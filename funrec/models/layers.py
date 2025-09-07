from typing import Callable, List, Optional, Union
import tensorflow as tf
import numpy as np
from tensorflow.keras.regularizers import l2
from tensorflow.keras import backend as K

def squash(inputs):
    vec_squared_norm = tf.reduce_sum(tf.square(inputs), axis=-1, keepdims=True)
    scalar_factor = vec_squared_norm / (1 + vec_squared_norm) / tf.sqrt(vec_squared_norm + 1e-9)
    vec_squashed = scalar_factor * inputs
    return vec_squashed


class MeanPoolingLayer(tf.keras.layers.Layer):
    def __init__(self, **kwargs):
        super(MeanPoolingLayer, self).__init__(**kwargs)
        self.eps = tf.constant(1e-8, dtype=tf.float32)

    def call(self, inputs, mask=None, *args, **kwargs):
        mask = tf.cast(mask, dtype=tf.float32)
        valid_len = tf.reduce_sum(mask, axis=-1, keepdims=True)
        mask = tf.expand_dims(mask, axis=2)
        input_sum = tf.reduce_sum(inputs * mask, axis=1, keepdims=False)
        input_mean = tf.divide(input_sum, tf.cast(valid_len, tf.float32) + self.eps)
        input_mean = tf.expand_dims(input_mean, axis=1)
        return input_mean


class DNNs(tf.keras.layers.Layer):
    def __init__(self, units, use_bn=False, dropout_rate=0.0, out_active=False, activation='relu', last_layer_name=None, **kwargs):
        super(DNNs, self).__init__(**kwargs)
        self.units = units
        self.num_layers = len(units)
        self.out_active = out_active
        self.use_bn = use_bn
        self.dropout_rate = dropout_rate
        self.activation = tf.keras.layers.Activation(activation) 
        self.dense_layers = []
        self.bn_layers = []
        self.last_layer_name = last_layer_name
        self.dropout = None if dropout_rate <= 0 else tf.keras.layers.Dropout(dropout_rate)

    def build(self, input_shape):
        # Define layers in build method
        if self.last_layer_name is not None:
            self.dense_layers = []
            for i, units in enumerate(self.units):
                if i == len(self.units) - 1:
                    self.dense_layers.append(tf.keras.layers.Dense(units, name=f"{self.last_layer_name}_{i}"))
                self.dense_layers.append(tf.keras.layers.Dense(units))
        else:
            self.dense_layers = [tf.keras.layers.Dense(unit) for unit in self.units]
        
        if self.use_bn:
            self.bn_layers = [tf.keras.layers.BatchNormalization() for _ in range(self.num_layers - 1)]
        
        super(DNNs, self).build(input_shape)

    def call(self, inputs, training=None):
        for i in range(self.num_layers):
            inputs = self.dense_layers[i](inputs)
            if self.use_bn and i < self.num_layers - 1:
                inputs = self.bn_layers[i](inputs, training=training)
            if i < self.num_layers - 1 or self.out_active:
                inputs = self.activation(inputs)
            if self.dropout is not None and i < self.num_layers - 1:
                inputs = self.dropout(inputs, training=training)
        return inputs


class EmbeddingIndex(tf.keras.layers.Layer):
    def __init__(self, index, **kwargs):
        super(EmbeddingIndex, self).__init__(**kwargs)
        self.index = index

    def call(self, x, **kwargs):
        return tf.constant(self.index)


class L2NormalizeLayer(tf.keras.layers.Layer):    
    """L2 归一化层"""
    def __init__(self, axis=-1, **kwargs):
        super().__init__(**kwargs)
        self.axis = axis
    
    def call(self, inputs):
        return tf.nn.l2_normalize(inputs, axis=self.axis)
    
    def get_config(self):
        config = super().get_config()
        config.update({"axis": self.axis})
        return config


class SqueezeLayer(tf.keras.layers.Layer):
    """squeeze操作"""
    def __init__(self, axis=1, **kwargs):
        super().__init__(**kwargs)
        self.axis = axis
    
    def call(self, inputs):
        return tf.squeeze(inputs, axis=self.axis)
    
    def get_config(self):
        config = super().get_config()
        config.update({"axis": self.axis})
        return config


class SampledSoftmaxLayer(tf.keras.layers.Layer):
    def __init__(self, vocab_size, num_sampled, emb_dim, **kwargs):
        super().__init__(**kwargs)
        self.emb_dim = emb_dim
        self.vocab_size = vocab_size
        self.num_sampled = num_sampled
        
    def build(self, input_shape):
        self.zero_bias = self.add_weight(
            shape=[self.vocab_size],
            initializer=tf.keras.initializers.Zeros,
            dtype=tf.float32,
            trainable=False,
            name="bias"
        )
        super().build(input_shape)

    def call(self, inputs):
        item_embedding, user_emb, label_index = inputs
        loss = tf.nn.sampled_softmax_loss(
            weights=item_embedding,
            biases=self.zero_bias,
            labels=label_index,
            inputs=user_emb,
            num_sampled=self.num_sampled,
            num_classes=self.vocab_size
        )
        return tf.expand_dims(loss, axis=1)
    
    def get_config(self):
        config = super().get_config()
        config.update({
            "vocab_size": self.vocab_size,
            "num_sampled": self.num_sampled,
            "emb_dim": self.emb_dim
        })
        return config
    

class CapsuleLayer(tf.keras.layers.Layer):
    def __init__(self, input_units, out_units, max_len, k_max, iteration_times=3,
                 init_std=1.0, **kwargs):
        self.input_units = input_units
        self.out_units = out_units
        self.max_len = max_len  # 序列的最大长度
        self.k_max = k_max # 兴趣的个数
        self.iteration_times = iteration_times  # 动态路由计算的次数，一般情况下需要计算三次
        self.init_std = init_std
        super(CapsuleLayer, self).__init__(**kwargs)

    def build(self, input_shape):
        #  定义一个kmax的routing_logits, 后续通过实际的胶囊数量去做mask 不可训练 注意 trainable 参数
        self.routing_logits = self.add_weight(shape=[1, self.k_max, self.max_len],
                                              initializer=tf.keras.initializers.RandomNormal(stddev=self.init_std),
                                              trainable=False, name="B", dtype=tf.float32)
        self.bilinear_mapping_matrix = self.add_weight(shape=[self.input_units, self.out_units],
                                                       initializer=tf.keras.initializers.RandomNormal(stddev=self.init_std),
                                                       name="S", dtype=tf.float32)
        super(CapsuleLayer, self).build(input_shape)
    def call(self, inputs, mask=None, **kwargs):
        # [B,max_len,input_units] , [B,1] seq_len 记录序列的真实长度，后续用于 Mask
        behavior_embddings, history_mask, capsule_num  = inputs[0], inputs[1], inputs[2] 
        batch_size = tf.shape(behavior_embddings)[0]

        # 用户序列mask生成
        mask = tf.expand_dims(history_mask, axis=1) # [B, 1, max_len]
        mask = tf.tile(mask, [1, self.k_max, 1]) # [B, k_max, max_len]

        # 实际有效的胶囊mask生成
        capsule_mask = tf.sequence_mask(capsule_num, self.k_max, tf.float32) # 根据给定的矩阵生成一个矩阵mask, [B, k_max]
        capsule_mask = tf.expand_dims(capsule_mask, axis=-1) # [B, k_max, 1]
        capsule_mask = tf.tile(capsule_mask, [1, 1, self.max_len]) # [B, k_max, max_len]
        capsule_padding = tf.ones_like(capsule_mask) * -2 ** 31
        capsule_mask = tf.cast(capsule_mask, tf.bool)

        for i in range(self.iteration_times):  # 动态路由的循环迭代
            # 对胶囊进行mask 
            mask_routing_logits = tf.where(capsule_mask, tf.tile(self.routing_logits, [batch_size, 1, 1]), capsule_padding) # [B, k_max, max_len]
            pad = tf.ones_like(mask, dtype=tf.float32) * (-2 ** 32 + 1)  
            # 对序列进行mask  [B,k_max,max_len]
            routing_logits_with_padding = tf.where(mask, mask_routing_logits, pad) 
            weight = tf.nn.softmax(routing_logits_with_padding)  # 操作 softmax 得到 w_ij 可以对比原论文 [B,k_max,max_len]
            # 原文得到High-cat 需要经过 w_ij* S_ij*C_i 此步骤只是计算后面两个参数的点积 [B,max_len,input_units] dot axis=1 [input_units,out_units](Broadcast) --->  [B,max_len,out_units]
            behavior_embdding_mapping = tf.tensordot(behavior_embddings, self.bilinear_mapping_matrix, axes=1) 
            Z = tf.matmul(weight, behavior_embdding_mapping) # 接上一步完成 High-cat 输出计算 [B,k_max,out_units]
            interest_capsules = squash(Z) # [B,k_max,out_units]
            # [B,k_max,out_units]  matual [B,out_units,max_len]  ---->   [B,k_max,max_len]   ---reduce_sum--> [1,k_max,max_len]
            delta_routing_logits = tf.reduce_sum(
                tf.matmul(interest_capsules, tf.transpose(behavior_embdding_mapping, perm=[0, 2, 1])),   
                axis=0, keepdims=True
            )
            self.routing_logits.assign_add(delta_routing_logits)
        interest_capsules = tf.reshape(interest_capsules, [-1, self.k_max, self.out_units]) # 输出兴趣胶囊 [B,k_max,out_units]
        return interest_capsules


class LabelAwareAttention(tf.keras.layers.Layer):
    def __init__(self, k_max, pow_p=1, **kwargs):
        self.k_max = k_max
        self.pow_p = pow_p
        super(LabelAwareAttention, self).__init__(**kwargs)

    def call(self, inputs, training=None, **kwargs):
        keys = inputs[0]
        query = inputs[1]
        weight = tf.reduce_sum(keys * query, axis=-1, keepdims=True)
        weight = tf.pow(weight, self.pow_p)  # [x,k_max,1]

        # 如果pow_p 比较大，直接返回最感兴趣的胶囊
        if self.pow_p >= 100:
            idx = tf.stack(
                [tf.range(tf.shape(keys)[0]), tf.squeeze(tf.argmax(weight, axis=1, output_type=tf.int32), axis=1)],
                axis=1)
            output = tf.gather_nd(keys, idx)
        else:
            weight = tf.nn.softmax(weight, axis=1, name="weight")
            output = tf.reduce_sum(keys * weight, axis=1)

        return output


class GateNU(tf.keras.layers.Layer):
    def __init__(self,
                 hidden_units,
                 gamma=2.,
                 l2_reg=0.):
        assert len(hidden_units) == 2
        self.gamma = gamma

        self.dense_layers = [
            tf.keras.layers.Dense(hidden_units[0], activation="relu", kernel_regularizer=tf.keras.regularizers.l2(l2_reg)),
            tf.keras.layers.Dense(hidden_units[1], activation="sigmoid", kernel_regularizer=tf.keras.regularizers.l2(l2_reg))
        ]

        super(GateNU, self).__init__()

    def call(self, inputs):
        output = self.dense_layers[0](inputs)

        output = self.gamma * self.dense_layers[1](output)

        return output


class EPNet(tf.keras.layers.Layer):
    """Embedding Personalized Network(EPNet)

    Reference:
        PEPNet: Parameter and Embedding Personalized Network for Infusing with Personalized Prior Information
    """
    def __init__(self,
                 l2_reg=0.,
                 **kwargs):
        self.l2_reg = l2_reg

        self.gate_nu = None

        super(EPNet, self).__init__(**kwargs)

    def build(self, input_shape):
        assert len(input_shape) == 2
        shape1, shape2 = input_shape
        self.gate_nu = GateNU(hidden_units=[shape2[-1], shape2[-1]], l2_reg=self.l2_reg)

    def call(self, inputs, *args, **kwargs):
        domain, emb = inputs

        return self.gate_nu(tf.concat([domain, tf.stop_gradient(emb)], axis=-1)) * emb


class PPNet(tf.keras.layers.Layer):
    """Parameter Personalized Network(PPNet)

    Reference:
        PEPNet: Parameter and Embedding Personalized Network for Infusing with Personalized Prior Information
    """
    def __init__(self,
                 multiples,
                 hidden_units,
                 activation,
                 dropout=0.,
                 l2_reg=0.,
                 **kwargs):
        self.hidden_units = hidden_units
        self.l2_reg = l2_reg

        self.multiples = multiples

        self.dense_layers = []
        self.dropout_layers = []
        for i in range(multiples):
            self.dense_layers.append(
                [tf.keras.layers.Dense(units, activation=activation, kernel_regularizer=tf.keras.regularizers.l2(l2_reg)) for units in hidden_units]
            )
            self.dropout_layers.append(
                [tf.keras.layers.Dropout(dropout) for _ in hidden_units]
            )
        self.gate_nu = []
        
        super(PPNet, self).__init__(**kwargs)

    def build(self, input_shape):
        self.gate_nu = [GateNU([i*self.multiples, i*self.multiples], l2_reg=self.l2_reg
                               ) for i in self.hidden_units]

    def call(self, inputs, training=None, **kwargs):
        inputs, persona = inputs

        gate_list = []
        for i in range(len(self.hidden_units)):
            gate = self.gate_nu[i](tf.concat([persona, tf.stop_gradient(inputs)], axis=-1))
            gate = tf.split(gate, self.multiples, axis=1)
            gate_list.append(gate)

        output_list = []

        for n in range(self.multiples):
            output = inputs

            for i in range(len(self.hidden_units)):
                fc = self.dense_layers[n][i](output)

                output = gate_list[i][n] * fc

                output = self.dropout_layers[n][i](output, training=training)

            output_list.append(output)

        return output_list


class PredictLayer(tf.keras.layers.Layer):
    """预测层
    
    该层负责将模型的最终输出转换为预测结果。
    支持二分类和多分类任务，可以选择是否输出logits或概率值。
    
    参数:
        task: 任务类型，'binary'表示二分类，'multiclass'表示多分类
        num_classes: 输出类别数，二分类通常为1，多分类为具体类别数
        as_logit: 是否输出logits，True表示输出原始logits，False则应用激活函数
        use_bias: 是否使用偏置项
    """
    def __init__(self,
                 task: str = 'binary',
                 num_classes: int = 1,
                 as_logit: bool = False,
                 use_bias: bool = False,
                 activation = None,
                 **kwargs):
        if task not in ('binary', 'multiclass'):
            raise ValueError(f"task must be binary or multiclass, but got {task}")
        self.num_classes = num_classes
        self.use_bias = use_bias
        self.task = task
        self.as_logit = as_logit
        self.activation = activation
        if not as_logit:
            if task == "binary":
                self.activation = tf.nn.sigmoid
            elif task == "multiclass":
                self.activation = tf.nn.softmax
        self.dense_layer = None
        self.bias = None
        super(PredictLayer, self).__init__(**kwargs)

    def build(self, input_shape):
        if input_shape[-1] != self.num_classes:
            self.dense_layer = tf.keras.layers.Dense(self.num_classes, use_bias=self.use_bias)
        else:
            if self.use_bias:
                self.bias = self.add_weight(shape=(1,), initializer=tf.keras.initializers.Zeros(), name="global_bias")
                self.dense_layer = lambda x: x + self.bias

    def call(self, inputs, *args, **kwargs):
        output = inputs
        if self.dense_layer is not None:
            output = self.dense_layer(output)
        if self.activation is not None:
            output = self.activation(output)

        return output
    
    def get_config(self):
        """获取层配置
        
        返回层的配置参数，用于序列化和重建层。
        """
        config = super(PredictLayer, self).get_config()
        config.update({
            "task": self.task,
            "num_classes": self.num_classes,
            "as_logit": self.as_logit,
            "use_bias": self.use_bias
        })
        return config
    
    def compute_output_shape(self, input_shape):
        """计算输出形状
        
        根据输入形状计算输出形状。
        """
        if self.dense_layer is not None and not isinstance(self.dense_layer, type(lambda: None)):
            return self.dense_layer.compute_output_shape(input_shape)
        else:
            return input_shape[:-1] + (self.num_classes,)


class SequenceMeanPoolingLayer(tf.keras.layers.Layer):
    def __init__(self, keep_shape=False, supports_masking=True, **kwargs):
        """序列池化层，用于对变长序列特征进行平均池化操作。

        Args:
            keep_shape (bool): 是否保持输入形状，默认为False。
            supports_masking (bool): 是否支持mask。默认为True。
        """
        super(SequenceMeanPoolingLayer, self).__init__(**kwargs)
        self.keep_shape = keep_shape
        self.supports_masking = supports_masking
        self.eps = tf.constant(1e-8, dtype=tf.float32)

    def call(self, inputs, mask=None, *args, **kwargs):
        """
        前向传播逻辑。

        Args:
            inputs (tf.Tensor): 输入张量，形状为(batch_size, seq_len, embedding_dim)。
            mask (tf.Tensor): 掩码张量，形状为(batch_size, seq_len)。默认为None。

        Returns:
            tf.Tensor: 平均池化后的张量，形状为(batch_size, embedding_dim)。
        """
        if mask is not None:
            mask = tf.cast(mask, dtype=tf.float32)
            mask = tf.expand_dims(mask, axis=-1)  # (batch_size, seq_len, 1)
            inputs *= mask

        valid_len = tf.reduce_sum(mask, axis=1, keepdims=False) if mask is not None else tf.shape(inputs)[1]
        valid_len = tf.cast(valid_len, dtype=tf.float32)
        output = tf.reduce_sum(inputs, axis=1) / (valid_len + self.eps)
        if self.keep_shape:
            output = tf.expand_dims(output, axis=1)
        return output

    def get_config(self):
        """
        返回层的配置字典。

        Returns:
            dict: 配置字典。
        """
        config = super(SequenceMeanPoolingLayer, self).get_config()
        config.update({
            "supports_masking": self.supports_masking,
        })
        return config


class BiasOnly(tf.keras.layers.Layer):
    def __init__(self, units):
        super().__init__()
        self.units = units

    def build(self, input_shape):
        self.bias = self.add_weight(
            shape=(self.units,),
            initializer='zeros',
            trainable=True,
            name='bias'
        )

    def call(self, inputs):
        return inputs + self.bias


class FM(tf.keras.layers.Layer):
    """因子分解机(Factorization Machine)层
    
    这个层实现了FM的二阶交叉部分，用于捕获特征之间的交互关系。
    FM算法的核心思想是通过隐向量内积来表示特征之间的相互作用。
    
    计算公式: 
    sum_{i=1}^{n}sum_{j=i+1}^{n} <v_i, v_j> x_i x_j
    = 0.5 * (sum(v)^2 - sum(v^2))
    
    其中v是特征的embedding向量，x是特征值。
    """
    def __init__(self, **kwargs):
        """初始化FM层
        
        Args:
            **kwargs: 传递给父类的参数
        """
        super(FM, self).__init__(**kwargs)

    def build(self, input_shape):
        """构建层
        
        Args:
            input_shape: 输入张量的形状，预期为[batch_size, field_num, embedding_size]
        """
        super(FM, self).build(input_shape)

    def call(self, inputs, **kwargs):
        """前向传播
        
        Args:
            inputs: 形状为[batch_size, field_num, embedding_size]的张量
            **kwargs: 额外参数
            
        Returns:
            形状为[batch_size, 1]的张量，表示FM的二阶交互项
        """
        concated_embeds_value = inputs  # shape: [batch_size, field_num, embedding_size]
        
        # 计算(sum(v))^2，先在field维度上求和，再平方
        square_of_sum = tf.square(tf.reduce_sum(concated_embeds_value, axis=1, keepdims=True))  # [batch_size, 1, embedding_size]
        
        # 计算sum(v^2)，先平方，再在field维度上求和
        sum_of_square = tf.reduce_sum(concated_embeds_value * concated_embeds_value, axis=1, keepdims=True)  # [batch_size, 1, embedding_size]
        
        # 计算FM的二阶交互项: 0.5 * ((sum(v))^2 - sum(v^2))
        cross_term = square_of_sum - sum_of_square  # [batch_size, 1, embedding_size]
        cross_term = 0.5 * tf.reduce_sum(cross_term, axis=2, keepdims=False)  # [batch_size, 1]

        return cross_term

    def compute_output_shape(self, input_shape):
        """计算输出形状
        
        Args:
            input_shape: 输入张量的形状
            
        Returns:
            输出张量的形状，固定为(batch_size, 1)
        """
        return (None, 1)



def get_activation(activation):
    if activation is None:
        return tf.keras.layers.Lambda(lambda x: x)
    if isinstance(activation, str):
        if activation.lower() == 'relu':
            return tf.keras.layers.ReLU()
        elif activation.lower() == 'prelu':
            return tf.keras.layers.PReLU()
        elif activation.lower() == 'dice':
            return Dice()
        else:
            return tf.keras.layers.Activation(activation)
    return activation

class Dice(tf.keras.layers.Layer):
    def __init__(self, epsilon=1e-3, **kwargs):
        super(Dice, self).__init__(**kwargs)
        self.epsilon = epsilon
        
    def build(self, input_shape):
        self.alpha = self.add_weight(shape=(1,),
                                     initializer='zeros',
                                     dtype=tf.float32,
                                     name='alpha')
        
    def call(self, inputs, training=None):
        inputs_normed = tf.nn.batch_normalization(inputs, 
                                               tf.keras.backend.mean(inputs, axis=0),
                                               tf.keras.backend.var(inputs, axis=0),
                                               0, 1, self.epsilon)
        x_p = tf.sigmoid(inputs_normed)
        return self.alpha * (1.0 - x_p) * inputs + x_p * inputs


class FeedForwardLayer(tf.keras.layers.Layer):
    def __init__(self,
                 hidden_units: List[int],
                 activation: Optional[Union[str, Callable]] = "relu",
                 l2_reg: float = 0.,
                 dropout_rate: float = 0.,
                 use_bn: bool = False,
                 **kwargs
                 ):

        self.dense_layers = [tf.keras.layers.Dense(i, kernel_regularizer=tf.keras.regularizers.l2(l2_reg)) for i in hidden_units]

        self.activations = [get_activation(activation) for _ in hidden_units]

        self.dropout_layers = [tf.keras.layers.Dropout(dropout_rate) for _ in hidden_units]
        if use_bn:
            self.bn_layers = [tf.keras.layers.BatchNormalization() for _ in hidden_units]

        self.use_bn = use_bn
        super(FeedForwardLayer, self).__init__(**kwargs)

    def call(self, inputs, training=None, **kwargs):
        output = inputs

        for i in range(len(self.dense_layers)):
            fc = self.dense_layers[i](output)

            if self.use_bn:
                fc = self.bn_layers[i](fc, training=training)

            fc = self.activations[i](fc, training=training)

            fc = self.dropout_layers[i](fc, training=training)

            output = fc

        return output


class DinAttentionLayer(tf.keras.layers.Layer):
    """ DIN Attention:

    Reference:
        Deep Interest Network for Click-Through Rate Prediction

    Args:
        ffn_hidden_units: 前馈神经网络隐藏层单元数
        ffn_activation: 前馈神经网络激活函数
        query_ffn: 是否使用前馈神经网络对查询输入进行处理，当查询和键的维度不同时必须启用
        query_activation: 查询前馈神经网络激活函数
    """
    def __init__(self,
                 ffn_hidden_units=[80, 40],
                 ffn_activation="dice",
                 query_ffn=False,
                 query_activation="prelu",
                 **kwargs):
        self.query_ffn = query_ffn
        self.query_activation = query_activation
        self.query_ffn_layer = None
        
        self.ffn_layer = FeedForwardLayer(ffn_hidden_units, ffn_activation)
        self.dense = tf.keras.layers.Dense(1)
        super(DinAttentionLayer, self).__init__(**kwargs)
    
    def build(self, input_shape):
        assert len(input_shape) == 2 and len(input_shape[0]) == 3 and len(input_shape[1]) == 3
        if self.query_ffn:
            self.query_ffn_layer = tf.keras.layers.Dense(input_shape[1][-1], self.query_activation)

    def call(self, inputs, mask=None, **kwargs):
        # query: [B, 1, H]
        # keys: [B, L, H]
        query, keys = inputs
        query = tf.squeeze(query, axis=1)
        if self.query_ffn_layer is not None:
            query = self.query_ffn_layer(query)

        length = tf.shape(keys)[-2]
        query = tf.expand_dims(query, axis=1)
        att_inputs = tf.concat([tf.tile(query, [1, length, 1]),
                                keys, query - keys, query * keys], axis=-1)
        hidden_layer = self.ffn_layer(att_inputs)
        scores = self.dense(hidden_layer)
        scores = tf.reshape(scores, [-1, 1, length])

        if mask is not None:
            mask = mask[1]

            mask = tf.expand_dims(mask, axis=1)

            scores += (1.0 - tf.cast(mask, keys.dtype)) * (-1e9)

        scores /= keys.get_shape().as_list()[-1] ** 0.5
        scores = tf.nn.softmax(scores)

        att_outputs = tf.matmul(scores, keys)

        return tf.squeeze(att_outputs, axis=1)



class PositionEncodingLayer(tf.keras.layers.Layer):
    def __init__(self, dims, max_len, trainable=True, name=None, dtype=None, dynamic=False, initializer='glorot_uniform', **kwargs):
        """可学习的位置编码
        
        Args:
            dims: 编码维度
            max_len: 最大序列长度
            trainable: 是否可训练，默认为True
            initializer: 初始化方式，可以是'glorot_uniform'(随机初始化)或'sinusoidal'(正弦初始化)
        """
        super().__init__(trainable=trainable, name=name, dtype=dtype, dynamic=dynamic, **kwargs)
        # self.dims = dims
        self.max_len = max_len
        self.initializer = initializer

    def build(self, input_shape):
        # 初始化位置编码
        if self.initializer == 'sinusoidal':
            # 使用正弦函数初始化
            encoded_vec = np.array([pos/np.power(10000, 2*i/self.dims) 
                        for pos in range(self.max_len) for i in range(self.dims)])
            encoded_vec[::2] = np.sin(encoded_vec[::2])
            encoded_vec[1::2] = np.cos(encoded_vec[1::2])
            initial_value = encoded_vec.reshape([self.max_len, self.dims])
            initializer = tf.constant_initializer(initial_value)
        else:
            # 使用随机初始化
            initializer = tf.keras.initializers.GlorotUniform()
        
        # 创建可学习的权重
        self.pos_embeddings = self.add_weight(
            shape=(self.max_len, input_shape[-1]),
            initializer=initializer,
            trainable=self.trainable,
            name="position_embeddings"
        )
        return super().build(input_shape)
    
    def call(self, inputs, *args, **kwargs):
        # 返回位置编码，形状与输入序列相匹配
        batch_size, seq_len = tf.shape(inputs)[0], tf.shape(inputs)[1]
        # 获取序列长度对应的位置编码
        position_enc = self.pos_embeddings[:seq_len, :]  # [seq_len, dims]
        # 扩展到batch size维度
        position_enc = tf.expand_dims(position_enc, axis=0)  # [1, seq_len, dims]
        position_enc = tf.tile(position_enc, [batch_size, 1, 1])  # [batch_size, seq_len, dims]
        return position_enc
    
    def get_config(self):
        config = super().get_config()
        config.update({
            'dims': self.dims,
            'max_len': self.max_len,
            'initializer': self.initializer
        })
        return config



class NegativeSampleEmbedding(tf.keras.layers.Layer):
    def __init__(self, vocab_size, num_sampled, sampled_type='uniform', trainable=False, name=None, dtype=None, dynamic=False, **kwargs):
        super().__init__(trainable, name, dtype, dynamic, **kwargs)
        self.sampled_type = sampled_type
        self.vocab_size = vocab_size
        self.num_sampled = num_sampled

    def build(self, input_shape):
        super().build(input_shape)

    def call(self, target_index, embedding_table):
        target_index = tf.cast(target_index, dtype=tf.int64)
        if self.sampled_type == 'uniform':
            sampled_idx = tf.random.uniform(
                (tf.shape(target_index)[0], self.num_sampled), 
                minval=1, 
                maxval=self.vocab_size, 
                dtype=tf.int64
            )
        
        # Use tf.gather instead of tf.nn.embedding_lookup for better tracking
        neg_sampled_emb = tf.gather(embedding_table, sampled_idx)
        return neg_sampled_emb
    



class PartitionedNormalization(tf.keras.layers.Layer):
    def __init__(self,
                 num_domain,
                 name=None,
                 **kwargs):

        self.bn_list = [tf.keras.layers.BatchNormalization(center=False, scale=False, name=f"bn_{i}", **kwargs) for i in range(num_domain)]

        super(PartitionedNormalization, self).__init__(name=name)

    def build(self, input_shape):
        assert len(input_shape) == 2 and len(input_shape[1]) <= 2
        dim = input_shape[0][-1]

        self.global_gamma = self.add_weight(
            name="global_gamma",
            shape=[dim],
            initializer=tf.keras.initializers.Constant(0.5),
            trainable=True
        )
        self.global_beta = self.add_weight(
            name="global_beta",
            shape=[dim],
            initializer=tf.keras.initializers.Zeros(),
            trainable=True
        )
        self.domain_gamma = self.add_weight(
                name="domain_gamma",
                shape=[len(self.bn_list), dim],
                initializer=tf.keras.initializers.Constant(0.5),
                trainable=True
            )
        self.domain_beta = self.add_weight(
                name="domain_beta",
                shape=[len(self.bn_list), dim],
                initializer=tf.keras.initializers.Zeros(),
                trainable=True
            )

    def generate_grid_tensor(self, indices, dim):
        y = tf.range(dim)
        x_grid, y_grid = tf.meshgrid(indices, y)
        return tf.transpose(tf.stack([x_grid, y_grid], axis=-1), [1, 0, 2])

    def call(self, inputs, training=None):
        inputs, domain_index = inputs
        domain_index = tf.cast(tf.reshape(domain_index, [-1]), "int32")
        dim = inputs.shape.as_list()[-1]

        output = inputs
        # compute each domain's BN individually
        for i, bn in enumerate(self.bn_list):
            mask = tf.equal(domain_index, i)
            single_bn = self.bn_list[i](tf.boolean_mask(inputs, mask), training=training)
            single_bn = (self.global_gamma + self.domain_gamma[i]) * single_bn + (self.global_beta + self.domain_beta[i])

            # get current domain samples' indices
            indices = tf.boolean_mask(tf.range(tf.shape(inputs)[0]), mask)
            indices = self.generate_grid_tensor(indices, dim)
            output = tf.cond(
                tf.reduce_any(mask),
                lambda: tf.reshape(tf.tensor_scatter_nd_update(output, indices, single_bn), [-1, dim]),
                lambda: output
            )

        return output


class StarTopologyFCN(tf.keras.layers.Layer):
    """
    Reference:
        One Model to Serve All: Star Topology Adaptive Recommender for Multi-Domain CTR Prediction
    """
    def __init__(self,
                 num_domain,
                 hidden_units,
                 activation="relu",
                 dropout=0.,
                 l2_reg=0.,
                 **kwargs):
        self.num_domain = num_domain
        self.hidden_units = hidden_units
        self.activation_list = [tf.keras.layers.Activation(activation) for _ in hidden_units]
        self.dropout_list = [tf.keras.layers.Dropout(dropout) for _ in hidden_units]
        self.l2_reg = l2_reg
        super(StarTopologyFCN, self).__init__(**kwargs)

    def build(self, input_shape):
        assert len(input_shape) == 2
        input_shape = input_shape[0]

        self.shared_bias = [
            self.add_weight(
                name=f"shared_bias_{i}",
                shape=[1, i],
                initializer=tf.keras.initializers.Zeros(),
                trainable=True
            ) for i in self.hidden_units
        ]
        self.domain_bias_list = [
            tf.keras.layers.Embedding(
                self.num_domain,
                output_dim=i,
                embeddings_initializer=tf.keras.initializers.Zeros()
            ) for i in self.hidden_units
        ]

        hidden_units = self.hidden_units.copy()
        hidden_units.insert(0, input_shape[-1])
        self.shared_weights = [
            self.add_weight(
                name=f"shared_weight_{i}",
                shape=[1, hidden_units[i], hidden_units[i+1]],
                initializer="glorot_uniform",
                regularizer=tf.keras.regularizers.l2(self.l2_reg),
                trainable=True
            ) for i in range(len(hidden_units) - 1)
        ]
        self.domain_weights_list = [
            tf.keras.layers.Embedding(
                self.num_domain,
                hidden_units[i] * hidden_units[i + 1],
                embeddings_initializer="glorot_uniform",
                embeddings_regularizer=tf.keras.regularizers.l2(self.l2_reg)
            ) for i in range(len(hidden_units) - 1)
        ]

    def call(self, inputs, training=None, **kwargs):
        inputs, domain_index = inputs
        output = tf.expand_dims(inputs, axis=1)
        for i in range(len(self.hidden_units)):
            domain_weight = tf.reshape(self.domain_weights_list[i](domain_index),
                                       [-1] + self.shared_weights[i].shape.as_list()[1:])
            weight = self.shared_weights[i] * domain_weight
            domain_bias = tf.reshape(self.domain_bias_list[i](domain_index), [-1] + self.shared_bias[i].shape.as_list()[1:])
            bias = self.shared_bias[i] + domain_bias

            fc = tf.matmul(output, weight) + tf.expand_dims(bias, 1)
            output = self.activation_list[i](fc, training=training)
            output = self.dropout_list[i](output, training=training)

        return tf.squeeze(output, axis=1)

class PNN(tf.keras.layers.Layer):
    """
    Reference:        
        Product-based Neural Networks for User Response Prediction
    """
    def __init__(self, units, use_inner=True, use_outer=True):
        super(PNN, self).__init__()
        self.use_inner = use_inner
        self.use_outer = use_outer
        self.units = units  # 原文中D1的大小

    def build(self, input_shape):
        # input_shape[0] : feat_nums x embed_dims
        self.feat_nums = len(input_shape)
        self.embed_dims = input_shape[0].as_list()[-1]
        flatten_dims = self.feat_nums * self.embed_dims

        # 线性信号权重，用于产生Z
        self.linear_w = self.add_weight(
            name='linear_w', 
            shape=(flatten_dims, self.units), 
            initializer='glorot_normal'
        )

        # 内积权重
        if self.use_inner:
            # 优化后的内积权重大小为：D x N
            self.inner_w = self.add_weight(
                name='inner_w', 
                shape=(self.units, self.feat_nums), 
                initializer='glorot_normal'
            )

        # 外积权重
        if self.use_outer:
            # 优化后的外积权重大小为：D x embed_dim x embed_dim
            self.outer_w = self.add_weight(
                name='outer_w', 
                shape=(self.units, self.embed_dims, self.embed_dims), 
                initializer='glorot_normal'
            )

    def call(self, inputs):
        """
        inputs: list, 包含所有特征的embedding矩阵, shape为[B, N, D]
        """
        # 计算线性信号部分的输出
        concat_embed = tf.keras.layers.Concatenate(axis=1)(inputs)  # B x feat_nums x embed_dims
        concat_embed_ = tf.reshape(concat_embed, shape=[-1, self.feat_nums * self.embed_dims]) # B x feat_nums * embed_dims
        lz = tf.matmul(concat_embed_, self.linear_w)  # B x units

        # 内积部分
        lp_list = []
        if self.use_inner:
            for i in range(self.units):
                # 给每一个特征向量乘以权重
                delta = tf.multiply(concat_embed, tf.expand_dims(self.inner_w[i], axis=1))  # B x feat_nums x embed_dims
                # 在特征之间的维度上求和
                delta = tf.reduce_sum(delta, axis=1)  # B x embed_dims
                # 在特征embedding维度上求二范数
                lp_list.append(tf.reduce_sum(tf.square(delta), axis=1, keepdims=True))  # B x 1
            
        # 外积部分
        if self.use_outer:
            # 将embedding矩阵在特征间的维度上通过求和进行压缩
            feat_sum = tf.reduce_sum(concat_embed, axis=1)  # B x embed_dims
            
            # 扩展维度便于计算外积
            f1 = tf.expand_dims(feat_sum, axis=2)  # B x embed_dims x 1
            f2 = tf.expand_dims(feat_sum, axis=1)  # B x 1 x embed_dims

            # 求外积 a * a^T
            product = tf.matmul(f1, f2)  # B x embed_dims x embed_dims

            # 将product与外积权重矩阵对应元素相乘再相加
            for i in range(self.units):
                lpi = tf.multiply(product, self.outer_w[i])  # B x embed_dims x embed_dims
                lpi = tf.reduce_sum(lpi, axis=[1, 2])  # B
                lpi = tf.expand_dims(lpi, axis=1)  # B x 1
                lp_list.append(lpi) # [batch_size, units]
            
        # 将所有交叉特征拼接到一起
        lp = tf.keras.layers.Concatenate(axis=1)(lp_list) # [batch_size, units]

        # 将lz和lp拼接到一起
        product_out = tf.keras.layers.Concatenate(axis=1)([lz, lp]) # [batch_size, units]
        
        return product_out
    
class DCN(tf.keras.layers.Layer):
    """
    Reference:
        Deep & Cross Network for Ad Click Predictions
    """

    def __init__(self, num_cross_layers, l2_reg=0.0):
        super(DCN, self).__init__()        
        self.num_cross_layers = num_cross_layers
        self.l2_reg = l2_reg
    
    def build(self, input_shape):        
        # input_shape : batch_size x (feat_nums * embed_dims)
        self.input_dim = input_shape[-1]

        self.ws = [self.add_weight(
            name='cross_weight_{}'.format(i),
            shape=(self.input_dim, 1),
            initializer='glorot_normal',
            regularizer=tf.keras.regularizers.l2(self.l2_reg),
            trainable=True
        ) for i in range(self.num_cross_layers)]

        self.bs = [self.add_weight(
            name='cross_bias_{}'.format(i),
            shape=(self.input_dim, 1),
            initializer='zeros',
            regularizer=tf.keras.regularizers.l2(self.l2_reg),
            trainable=True
        ) for i in range(self.num_cross_layers)]
        
    
    def call(self, x_0):
        """
        实现交叉层的计算: x_{l+1} = x_0 * x_l^T * w_l + b_l + x_l
        
        Args:
            x_0: 原始输入，shape: (batch_size, feature_embedding_dim)            
        """
        # x_l 是上一层的输出，shape: (batch_size, feature_embedding_dim)

        x_l = x_0
        for i in range(self.num_cross_layers):      
            # 计算 x_l^T * w_l        
            xlw = tf.matmul(x_l, self.ws[i]) # (batch_size, 1)
            
            # 计算 x_0 * (x_l^T * w_l)                
            cross_term = tf.multiply(x_0, xlw) # (batch_size, feature_embedding_dim)

            # 计算 x_0 * x_l^T * w_l + b_l + x_l
            x_l = cross_term + tf.reshape(self.bs[i], (1, -1)) + x_l # (batch_size, feature_embedding_dim)

        return x_l
    

class AttentionPoolingLayer(tf.keras.layers.Layer):
    """
    Reference:
        Attentional Factorization Machines: Learning the Weight of Feature Interactions via Attention Networks (AFM)
    """
    def __init__(self, attention_factor, l2_reg, **kwargs):
        super(AttentionPoolingLayer, self).__init__(**kwargs)
        self.attention_factor = attention_factor        
        self.l2_reg = l2_reg

    def build(self, input_shape):
        # input_shape: (None, n, D)


        # 注意力权重, D x attention_factor
        self.attention_weight = self.add_weight(
            name='attention_weight',
            shape=(input_shape[-1], self.attention_factor),
            initializer='glorot_normal',
            regularizer=tf.keras.regularizers.l2(self.l2_reg),
            trainable=True
        )

        # 注意力偏置, attention_factor x 1
        self.attention_bias = self.add_weight(
            name='attention_bias',
            shape=(self.attention_factor,),
            initializer='zeros',
            trainable=True
        )

        # 注意力投影层, attention_factor x 1
        self.attention_projection = self.add_weight(
            name='attention_projection',
            shape=(self.attention_factor, 1),
            initializer='glorot_normal',            
            trainable=True
        )

    def call(self, inputs, **kwargs):
        # inputs: B x num_interactions x D
        # - a_ij' = h^T \cdot RELU(W \cdot (v_i * v_j) * x_i * x_j + b)
        # - a_ij = softmax(a_ij')
        # - output = \sum_{i=1}^{n} \sum_{j=i+1}^{n} a_ij * (v_i * v_j) * x_i * x_j

        # 注意力权重计算
        weighted_inputs = tf.matmul(inputs, self.attention_weight) + self.attention_bias # B x num_interactions x attention_factor

        # activation relu
        activation = tf.nn.relu(weighted_inputs) # B x num_interactions x attention_factor
        
        # 注意力投影
        projected_activation = tf.matmul(activation, self.attention_projection) # B x num_interactions x 1
        
        # 注意力权重归一化
        attention_weights = tf.nn.softmax(projected_activation, axis=1) # B x num_interactions x 1
        
        # 注意力池化
        return tf.reduce_sum(tf.multiply(inputs, attention_weights), axis=1) # B x D    
    
class CINs(tf.keras.layers.Layer):
    def __init__(self, cin_layer_sizes, l2_reg=1e-5, **kwargs):
        """压缩交互网络(CIN)层
        
        Reference:
            xDeepFM: Combining Explicit and Implicit Feature Interactions for Recommender Systems
        
        Args:
            cin_layer_sizes: CIN各层的大小列表
        """
        super(CINs, self).__init__(**kwargs)
        self.cin_layer_sizes = cin_layer_sizes
        self.dense_layers = []
        self.l2_reg = l2_reg

    def build(self, input_shape):
        """构建层，创建Dense层用于特征交互的线性变换
        
        Args:
            input_shape: 输入形状 [B, field_num, emb_dim]
        """
        super(CINs, self).build(input_shape)
        
        # 为每个CIN层创建对应的Dense层
        for k, layer_size in enumerate(self.cin_layer_sizes):
            dense_layer = tf.keras.layers.Dense(
                layer_size,
                activation=None,
                use_bias=False,
                kernel_initializer='glorot_uniform',
                kernel_regularizer=tf.keras.regularizers.l2(self.l2_reg),
                name=f'cin_dense_{k}'
            )
            self.dense_layers.append(dense_layer)

    def call(self, inputs, **kwargs):
        """CIN层的前向传播
        
        Args:
            inputs: 特征embedding表示，shape为[B, field_num, emb_dim]
            
        Returns:
            CIN的最终输出张量 [B, sum(cin_layer_sizes)]
        """
        pooled_outputs = []
        field_nums = [inputs.shape[1]]  # 初始特征域数量 m
        
        # 初始化输入 X^0
        cin_layers = [inputs]  # 第0层就是原始特征embedding, x_0
        
        # 构建CIN网络
        for k, layer_size in enumerate(self.cin_layer_sizes):
            # 创建当前层，更新field_nums记录
            field_nums.append(layer_size)
            
            # 获取前一层输出X^{k-1}和输入层X^0
            x_k_minus_1 = cin_layers[-1]  # [B, H_{k-1}, D]
            x_0 = cin_layers[0]  # [B, m, D]
            
            # 获取维度信息
            batch_size = tf.shape(x_0)[0]
            embed_dim = x_0.shape[-1]
            x0_field_num, prev_field_num = field_nums[0], field_nums[-2]
            
            # 为更好地进行特征交互计算，调整张量形状
            # reshape为 [B, H_{k-1}, 1, D]
            x_k_minus_1_expand = tf.expand_dims(x_k_minus_1, axis=2)
            # reshape为 [B, 1, m, D]
            x_0_expand = tf.expand_dims(x_0, axis=1)
            
            # 执行向量级别的特征交互（哈达玛积）
            # Z^k形状为 [B, H_{k-1}, m, D]
            z_k = tf.multiply(x_k_minus_1_expand, x_0_expand)
            
            # 重塑张量，便于应用线性变换
            # reshape为 [B, H_{k-1}*m, D]
            z_k_reshape = tf.reshape(z_k, [batch_size, prev_field_num * x0_field_num, embed_dim])
            
            # 通过线性变换压缩特征交互的结果，这相当于原论文中的权重矩阵W
            # 使用Dense层实现线性变换，将H_{k-1}*m维压缩为H_k维
            x_k = self.dense_layers[k](
                tf.transpose(z_k_reshape, [0, 2, 1])  # [B, D, H_{k-1}*m] -> [B, D, H_k]
            )
            
            # 转置回来，得到当前层的输出 [B, H_k, D]
            x_k = tf.transpose(x_k, [0, 2, 1])
            
            # 保存当前层
            cin_layers.append(x_k)
            
            # 对每个特征图进行求和池化，得到标量输出 [B, H_k]
            pooled_output = tf.reduce_sum(x_k, axis=-1)
            pooled_outputs.append(pooled_output)
        
        # 拼接所有层的池化输出 [B, sum(H_k)]
        final_result = tf.concat(pooled_outputs, axis=1)
        return final_result    
    

class MultiHeadAttentionLayer(tf.keras.layers.Layer):
    """
    Reference:
        AutoInt: Automatic Feature Interaction Learning via Self-Attentive Neural Networks
    """
    def __init__(self, attention_dim, num_heads, use_residual=True):
        super(MultiHeadAttentionLayer, self).__init__()
        self.attention_dim = attention_dim  # 注意力层的维度 d'
        self.num_heads = num_heads          # 注意力头数量 H
        self.use_residual = use_residual    # 是否使用残差连接
        
    def build(self, input_shape):
        # input_shape: B x N x D
        self.feat_num = input_shape[1]
        self.embed_dim = input_shape[2]
        
        # 为每个注意力头创建查询(Query)、键(Key)和值(Value)的权重矩阵
        self.query_weights = []
        self.key_weights = []
        self.value_weights = []
        
        for i in range(self.num_heads):
            self.query_weights.append(
                self.add_weight(
                    name=f'query_weights_{i}',
                    shape=[self.embed_dim, self.attention_dim],
                    initializer='glorot_uniform',
                    trainable=True
                )
            )
            
            self.key_weights.append(
                self.add_weight(
                    name=f'key_weights_{i}',
                    shape=[self.embed_dim, self.attention_dim],
                    initializer='glorot_uniform',
                    trainable=True
                )
            )
            
            self.value_weights.append(
                self.add_weight(
                    name=f'value_weights_{i}',
                    shape=[self.embed_dim, self.attention_dim],
                    initializer='glorot_uniform',
                    trainable=True
                )
            )
        
        # 残差连接的权重矩阵
        if self.use_residual:
            self.residual_weights = self.add_weight(
                name='residual_weights',
                shape=[self.embed_dim, self.attention_dim * self.num_heads],
                initializer='glorot_uniform',
                trainable=True
            )
    
    def call(self, inputs):
        # 存储每个注意力头的输出
        head_outputs = []
        
        for i in range(self.num_heads):
            # 计算查询、键、值矩阵
            query = tf.einsum('bfe,ea->bfa', inputs, self.query_weights[i])  # [batch_size, feat_num, attention_dim]
            key = tf.einsum('bfe,ea->bfa', inputs, self.key_weights[i])      # [batch_size, feat_num, attention_dim]
            value = tf.einsum('bfe,ea->bfa', inputs, self.value_weights[i])  # [batch_size, feat_num, attention_dim]
            
            # 计算注意力得分
            attention_score = tf.matmul(query, key, transpose_b=True)  # [batch_size, feat_num, feat_num]
            
            # 对注意力分数进行归一化处理
            attention_weights = tf.nn.softmax(attention_score, axis=-1)  # [batch_size, feat_num, feat_num]
            
            # 计算注意力加权和
            head_output = tf.matmul(attention_weights, value)  # [batch_size, feat_num, attention_dim]
            head_outputs.append(head_output)
        
        # 将所有注意力头的输出拼接在一起
        multi_head_output = tf.concat(head_outputs, axis=-1)  # [batch_size, feat_num, attention_dim * num_heads]
        
        # 应用残差连接
        if self.use_residual:
            # 将原始输入通过线性变换后的结果与注意力输出相加
            residual_input = tf.tensordot(inputs, self.residual_weights, axes=[[2], [0]])  # [batch_size, feat_num, attention_dim * num_heads]
            
            output = tf.keras.layers.ReLU()(multi_head_output + residual_input)  # [batch_size, feat_num, attention_dim * num_heads]
        else:
            output = tf.keras.layers.ReLU()(multi_head_output)
        
        return output # B x N x (D * H)
    

class SENetLayer(tf.keras.layers.Layer):
    """
    Reference:
        FiBiNET: Combining Feature Importance and Bilinear feature Interaction for Click-Through Rate Prediction
    """
    def __init__(self, reduction_ratio=3):
        super(SENetLayer, self).__init__()
        self.reduction_ratio = reduction_ratio

    def build(self, input_shape):
        # input_shape B x N x D                
        self.feat_nums = input_shape[1]
        self.embed_dims = input_shape[2]
        
        # 计算缩减大小
        self.reduction_size = max(1, int(self.feat_nums // self.reduction_ratio))
        
        # 定义挤压和激励的FC层
        self.w1 = self.add_weight(
            name='senet_w1',
            shape=(self.feat_nums, self.reduction_size),
            initializer='glorot_normal'
        )
        
        self.w2 = self.add_weight(
            name='senet_w2',
            shape=(self.reduction_size, self.feat_nums),
            initializer='glorot_normal'
        )

    def call(self, inputs):                
        # 挤压：全局平均池化
        squeeze = tf.reduce_mean(inputs, axis=-1)  # batch_size x feat_nums
        
        # 激活：两个FC层，ReLU和Sigmoid激活
        excitation = tf.matmul(squeeze, self.w1)  # batch_size x reduction_size
        excitation = tf.nn.relu(excitation)
        excitation = tf.matmul(excitation, self.w2)  # batch_size x feat_nums
        excitation = tf.nn.sigmoid(excitation)
        
        # 应用注意力权重
        excitation = tf.expand_dims(excitation, axis=2)  # batch_size x feat_nums x 1
        reweighted_embed = tf.multiply(inputs, excitation)  # batch_size x feat_nums x embed_dims
        
        return reweighted_embed


class BilinearInteractionLayer(tf.keras.layers.Layer):
    """
    Reference:
        FiBiNET: Combining Feature Importance and Bilinear feature Interaction for Click-Through Rate Prediction
    """
    def __init__(self, bilinear_type="interaction"):
        super(BilinearInteractionLayer, self).__init__()
        self.bilinear_type = bilinear_type

    def build(self, input_shape):
        # input_shape B x N x D
        self.feat_nums = input_shape[1]
        self.embed_dims = input_shape[2]
        
        if self.bilinear_type == 'all':
            # 所有特征交互共享一个权重矩阵
            self.W = self.add_weight(
                name='bilinear_w',
                shape=(self.embed_dims, self.embed_dims),
                initializer='glorot_normal'
            )
        elif self.bilinear_type == 'each':
            # 每个特征有自己的权重矩阵
            self.W_list = [
                self.add_weight(
                    name=f'bilinear_w_{i}',
                    shape=(self.embed_dims, self.embed_dims),
                    initializer='glorot_normal'
                ) for i in range(self.feat_nums)
            ]
        elif self.bilinear_type == 'interaction':
            # 每个特征交互对有自己的权重矩阵
            self.W_list = []
            self.pairs = []
            for i in range(self.feat_nums):
                for j in range(i+1, self.feat_nums):
                    self.pairs.append((i, j))
                    self.W_list.append(
                        self.add_weight(
                            name=f'bilinear_w_{i}_{j}',
                            shape=(self.embed_dims, self.embed_dims),
                            initializer='glorot_normal'
                        )
                    )

    def call(self, inputs):
        #inputs B x N x D
        interaction_outputs = []
        
        if self.bilinear_type == 'all':
            # 一个共享的权重矩阵
            vdotw_list = [tf.matmul(inputs[:, i, :], self.W) for i in range(self.feat_nums)]
            for i in range(self.feat_nums):
                for j in range(i+1, self.feat_nums):
                    interaction = tf.multiply(vdotw_list[i], inputs[:, j, :])  # batch_size x embed_dims
                    interaction_outputs.append(interaction)
        
        elif self.bilinear_type == 'each':
            # 每个特征有自己的权重矩阵
            vdotw_list = [tf.matmul(inputs[:, i, :], self.W_list[i]) for i in range(self.feat_nums)]
            for i in range(self.feat_nums):
                for j in range(i+1, self.feat_nums):
                    interaction = tf.multiply(vdotw_list[i], inputs[:, j, :])  # batch_size x embed_dims
                    interaction_outputs.append(interaction)
        
        elif self.bilinear_type == 'interaction':
            # 每个特征交互对有自己的权重矩阵
            for idx, (i, j) in enumerate(self.pairs):
                vdotw = tf.matmul(inputs[:, i, :], self.W_list[idx])  # batch_size x embed_dims
                interaction = tf.multiply(vdotw, inputs[:, j, :])  # batch_size x embed_dims
                interaction_outputs.append(interaction)
        
        # 拼接所有交互输出
        if len(interaction_outputs) > 1:
            concat_interact = tf.keras.layers.Concatenate(axis=1)(interaction_outputs)  # batch_size x (n_pairs * embed_dims)
        else:
            concat_interact = interaction_outputs[0]
            
        return concat_interact    
    

class TransformerEncoder(tf.keras.layers.Layer):
    def __init__(self,         
        intermediate_dim,
        num_heads,
        dropout=0,
        activation="relu",
        normalize_first=False, 
        is_residual=True,
        return_attention_scores=False,
        trainable=True, name=None, dtype=None, dynamic=False, **kwargs):
        super().__init__(trainable, name, dtype, dynamic, **kwargs)
        self.intermediate_dim = intermediate_dim
        self.num_heads = num_heads
        self.dropout = dropout
        self.activation = activation
        self.normalize_first = normalize_first
        self.is_residual = is_residual
        self.return_attention_scores = return_attention_scores

    def build(self, input_shape):
        hidden_dim = input_shape[-1]
        key_dim = int(hidden_dim // self.num_heads)

        # self-attention 相关的层
        self.self_attention_layer = tf.keras.layers.MultiHeadAttention(
            num_heads=self.num_heads,
            key_dim=key_dim,
            dropout=self.dropout,
            name="self_attention_layer",
        )
        self.attention_layer_norm = tf.keras.layers.LayerNormalization()
        self.attention_dropout = tf.keras.layers.Dropout(rate=self.dropout)

        # feedforward 相关层
        self.feedforward_layer_norm = tf.keras.layers.LayerNormalization()
        self.feedforward_intermediate_dense = tf.keras.layers.Dense(self.intermediate_dim,activation=self.activation)
        self.feedforward_output_dense = tf.keras.layers.Dense(hidden_dim,activation=self.activation)
        self.feedforward_dropout = tf.keras.layers.Dropout(rate=self.dropout)

        return super().build(input_shape)

    def call(
            self,
            inputs,
            attention_mask=None,
            training=None,
            return_attention_scores=False, *args, **kwargs):
        
        # self-attention
        x = inputs
        residual = inputs
        if self.normalize_first:
            x = self.attention_layer_norm(x)

        if return_attention_scores:
            x, attention_scores = self.self_attention_layer(
                query=x,
                value=x,
                attention_mask=attention_mask,
                return_attention_scores=return_attention_scores,
                training=training,
            )
        else:
            x = self.self_attention_layer(
                query=x,
                value=x,
                attention_mask=attention_mask,
                training=training,
            )

        x = self.attention_dropout(x, training=training)
        if self.is_residual:
            x = x + residual

        if not self.normalize_first:
            x = self.attention_layer_norm(x)
        
        # feed forward
        residual = x
        if self.normalize_first:
            x = self.feedforward_layer_norm(x)
        x = self.feedforward_intermediate_dense(x)
        x = self.feedforward_output_dense(x)
        x = self.feedforward_dropout(x, training=training)

        if self.is_residual:
            x = x + residual

        if not self.normalize_first:
            x = self.feedforward_layer_norm(x)

        if self.return_attention_scores:
            return x, attention_scores
        
        return x


 
class UserAttention(tf.keras.layers.Layer):
    """用户注意力层，使用用户基础表示作为查询向量"""
    def __init__(self, **kwargs):
        super(UserAttention, self).__init__(**kwargs)
        
    def call(self, query_vector, key_vectors):
        # 计算注意力分数
        attention_scores = tf.matmul(
            query_vector,  # [batch_size, 1, dim]
            tf.transpose(key_vectors, [0, 2, 1])   # [batch_size, dim, seq_len]
        )  # [batch_size, 1, seq_len]

        attention_scores = tf.squeeze(attention_scores, axis=1)  # [batch_size, seq_len]
        
        # 应用softmax获取注意力权重
        attention_weights = tf.nn.softmax(attention_scores, axis=-1)  # [batch_size, seq_len]
        
        # 加权求和
        context_vector = tf.matmul(
            tf.expand_dims(attention_weights, axis=1),  # [batch_size, 1, seq_len]
            key_vectors  # [batch_size, seq_len, dim]
        )  # [batch_size, 1, dim]                
        
        return context_vector    
    
class GatedFusion(tf.keras.layers.Layer):
    """门控融合层，用于融合长期和短期兴趣"""
    def __init__(self, **kwargs):
        super(GatedFusion, self).__init__(**kwargs)
        
    def build(self, input_shape):
        dim = input_shape[0][-1]
        self.W1 = self.add_weight(
            shape=(dim, dim),
            initializer="glorot_uniform",
            trainable=True,
            name="W1"
        )
        self.W2 = self.add_weight(
            shape=(dim, dim),
            initializer="glorot_uniform",
            trainable=True,
            name="W2"
        )
        self.W3 = self.add_weight(
            shape=(dim, dim),
            initializer="glorot_uniform",
            trainable=True,
            name="W3"
        )
        self.b = self.add_weight(
            shape=(dim,),
            initializer="zeros",
            trainable=True,
            name="bias"
        )
        super(GatedFusion, self).build(input_shape)
        
    def call(self, inputs):
        user_embedding, short_term, long_term = inputs
        
        # 计算门控向量
        gate = tf.sigmoid(
            tf.matmul(user_embedding, self.W1) + 
            tf.matmul(short_term, self.W2) + 
            tf.matmul(long_term, self.W3) + 
            self.b
        )
        
        # 融合长短期兴趣
        output = (1 - gate) * long_term + gate * short_term
        
        return output            
    

class BiInteractionPooling(tf.keras.layers.Layer):
    def __init__(self, **kwargs):
        super(BiInteractionPooling, self).__init__(**kwargs)
    
    def call(self, inputs, **kwargs):
        # 双线性交互池化: 1/2 * ((\sum_i x_i*v_i)^2 - \sum_i (x_i*v_i)^2)
        sum_of_embeds = tf.reduce_sum(inputs, axis=1, keepdims=False) # B x D
        square_of_sum = tf.square(sum_of_embeds) # B x D
        
        square_of_embeds = tf.square(inputs) # B x n x D
        sum_of_square = tf.reduce_sum(square_of_embeds, axis=1, keepdims=False) # B x D
        
        bi_interaction = 0.5 * (square_of_sum - sum_of_square) # B x D
        return bi_interaction
    


class APGLayer(tf.keras.layers.Layer):
    """注意力个性化门控层 (Attention Personalized Gating Layer)

    该层实现了基于场景嵌入的注意力个性化机制，通过共享权重和场景特定权重的组合，
    动态调整输入特征的转换过程，支持矩阵分解和不同的权重共享策略。

    参数:
        input_dim: 输入特征维度
        output_dim: 输出特征维度
        scene_emb_dim: 场景嵌入向量维度
        activation: 输出激活函数名称
        generate_activation: 权重生成网络的激活函数
        inner_activation: 内部层激活函数
        use_uv_shared: 是否使用UV共享权重模式
        mf_k: 矩阵分解中K路径的分割因子
        use_mf_p: 是否使用P路径的矩阵分解
        mf_p: 矩阵分解中P路径的分割因子
    """
    def __init__(self, input_dim, output_dim, scene_emb_dim, activation='relu', generate_activation=None,
                 inner_activation=None, use_uv_shared=True, mf_k=16, use_mf_p=True, mf_p=4, **kwargs):
        super(APGLayer, self).__init__(**kwargs)
        self.input_dim = input_dim                  # 输入特征维度
        self.output_dim = output_dim                # 输出特征维度
        self.scene_emb_dim = scene_emb_dim          # 场景嵌入向量维度
        self.use_uv_shared = use_uv_shared          # 是否使用UV共享权重模式
        self.use_mf_p = use_mf_p                    # 是否使用P路径矩阵分解
        self.mf_k = mf_k                            # K路径矩阵分解分割因子
        self.mf_p = mf_p                            # P路径矩阵分解分割因子
        
        # 激活函数初始化
        self.activation = get_activation(activation) if activation else None
        self.inner_activation = get_activation(inner_activation) if inner_activation else None
        
        # 计算矩阵分解维度
        min_dim = min(input_dim, output_dim)
        self.p_dim = np.math.ceil(min_dim / mf_p) if use_mf_p else None  # P路径维度
        self.k_dim = np.math.ceil(min_dim / mf_k)                        # K路径维度
        
        # 场景特定KK权重生成器
        # 用于从场景嵌入生成KK权重矩阵和偏置
        kk_weight_size = self.k_dim * self.k_dim
        self.specific_weight_kk = DNNs([kk_weight_size], activation=generate_activation)
        self.specific_bias_kk = DNNs([self.k_dim], activation=generate_activation)
        
        # 权重初始化: 共享权重模式或场景特定权重模式
        if use_uv_shared:
            # UV共享权重模式: 使用共享矩阵进行特征转换
            if use_mf_p:
                # P路径矩阵分解: NP -> PK -> KK -> KP -> PM
                self.shared_weight_np = self.add_weight(shape=(input_dim, self.p_dim), initializer='glorot_uniform', name='shared_weight_np')
                self.shared_bias_np = self.add_weight(shape=(self.p_dim,), initializer='zeros', name='shared_bias_np')
                self.shared_weight_pk = self.add_weight(shape=(self.p_dim, self.k_dim), initializer='glorot_uniform', name='shared_weight_pk')
                self.shared_bias_pk = self.add_weight(shape=(self.k_dim,), initializer='zeros', name='shared_bias_pk')
                self.shared_weight_kp = self.add_weight(shape=(self.k_dim, self.p_dim), initializer='glorot_uniform', name='shared_weight_kp')
                self.shared_bias_kp = self.add_weight(shape=(self.p_dim,), initializer='zeros', name='shared_bias_kp')
                self.shared_weight_pm = self.add_weight(shape=(self.p_dim, output_dim), initializer='glorot_uniform', name='shared_weight_pm')
                self.shared_bias_pm = self.add_weight(shape=(output_dim,), initializer='zeros', name='shared_bias_pm')
            else:
                # 无P路径矩阵分解: NK -> KK -> KM
                self.shared_weight_nk = self.add_weight(shape=(input_dim, self.k_dim), initializer='glorot_uniform', name='shared_weight_nk')
                self.shared_bias_nk = self.add_weight(shape=(self.k_dim,), initializer='zeros', name='shared_bias_nk')
                self.shared_weight_km = self.add_weight(shape=(self.k_dim, output_dim), initializer='glorot_uniform', name='shared_weight_km')
                self.shared_bias_km = self.add_weight(shape=(output_dim,), initializer='zeros', name='shared_bias_km')
        else:
            # 场景特定权重模式: NK和KM权重由场景嵌入生成
            nk_weight_size = input_dim * self.k_dim
            km_weight_size = self.k_dim * output_dim
            self.specific_weight_nk = DNNs([nk_weight_size], activation=generate_activation)
            self.specific_bias_nk = DNNs([self.k_dim], activation=generate_activation)
            self.specific_weight_km = DNNs([km_weight_size], activation=generate_activation)
            self.specific_bias_km = DNNs([output_dim], activation=generate_activation)

    def call(self, inputs):
        """前向传播方法

        参数:
            inputs: 包含两个元素的列表 [x, scene_emb]
                x: 输入特征张量，形状为 (batch_size, input_dim)
                scene_emb: 场景嵌入张量，形状为 (batch_size, scene_emb_dim)

        返回:
            output: 经过注意力个性化门控处理的输出张量，形状为 (batch_size, output_dim)
        """
        x, scene_emb = inputs  # x: 输入特征, scene_emb: 场景嵌入
        batch_size = tf.shape(x)[0]
        
        # 生成场景特定KK权重矩阵和偏置
        specific_weight_kk = self.specific_weight_kk(scene_emb)  # 形状: (batch_size, k_dim*k_dim)
        specific_weight_kk = tf.reshape(specific_weight_kk, (-1, self.k_dim, self.k_dim))  # 重塑为矩阵
        specific_bias_kk = self.specific_bias_kk(scene_emb)  # KK偏置
        
        if self.use_uv_shared:
            # UV共享权重模式下的前向传播
            if self.use_mf_p:
                # P路径矩阵分解路径: NP -> PK -> KK -> KP -> PM
                # 1. NP: 输入特征到P维度空间
                output_np = tf.matmul(x, self.shared_weight_np) + self.shared_bias_np
                if self.inner_activation: output_np = self.inner_activation(output_np)
                
                # 2. PK: P维度到K维度空间
                output_pk = tf.matmul(output_np, self.shared_weight_pk) + self.shared_bias_pk
                if self.inner_activation: output_pk = self.inner_activation(output_pk)
                
                # 3. KK: 应用场景特定KK权重
                output_kk = tf.matmul(tf.expand_dims(output_pk, 1), specific_weight_kk)
                output_kk = tf.squeeze(output_kk, 1) + specific_bias_kk
                if self.inner_activation: output_kk = self.inner_activation(output_kk)
                
                # 4. KP: K维度到P维度空间
                output_kp = tf.matmul(output_kk, self.shared_weight_kp) + self.shared_bias_kp
                if self.inner_activation: output_kp = self.inner_activation(output_kp)
                
                # 5. PM: P维度到输出维度
                output = tf.matmul(output_kp, self.shared_weight_pm) + self.shared_bias_pm
            else:
                # 无P路径矩阵分解路径: NK -> KK -> KM
                # 1. NK: 输入特征到K维度空间
                output_nk = tf.matmul(x, self.shared_weight_nk) + self.shared_bias_nk
                if self.inner_activation: output_nk = self.inner_activation(output_nk)
                
                # 2. KK: 应用场景特定KK权重
                output_kk = tf.matmul(tf.expand_dims(output_nk, 1), specific_weight_kk)
                output_kk = tf.squeeze(output_kk, 1) + specific_bias_kk
                if self.inner_activation: output_kk = self.inner_activation(output_kk)
                
                # 3. KM: K维度到输出维度
                output = tf.matmul(output_kk, self.shared_weight_km) + self.shared_bias_km
        else:
            # 场景特定权重模式下的前向传播: NK -> KK -> KM
            # 1. NK: 生成场景特定NK权重并应用
            specific_weight_nk = self.specific_weight_nk(scene_emb)
            specific_weight_nk = tf.reshape(specific_weight_nk, (-1, self.input_dim, self.k_dim))
            specific_bias_nk = self.specific_bias_nk(scene_emb)
            
            output_nk = tf.matmul(tf.expand_dims(x, 1), specific_weight_nk)
            output_nk = tf.squeeze(output_nk, 1) + specific_bias_nk
            if self.inner_activation: output_nk = self.inner_activation(output_nk)
            
            # 2. KK: 应用场景特定KK权重
            output_kk = tf.matmul(tf.expand_dims(output_nk, 1), specific_weight_kk)
            output_kk = tf.squeeze(output_kk, 1) + specific_bias_kk
            if self.inner_activation: output_kk = self.inner_activation(output_kk)
            
            # 3. KM: 生成场景特定KM权重并应用
            specific_weight_km = self.specific_weight_km(scene_emb)
            specific_weight_km = tf.reshape(specific_weight_km, (-1, self.k_dim, self.output_dim))
            specific_bias_km = self.specific_bias_km(scene_emb)
            
            output = tf.matmul(tf.expand_dims(output_kk, 1), specific_weight_km)
            output = tf.squeeze(output, 1) + specific_bias_km
        
        # 应用输出激活函数
        if self.activation: output = self.activation(output)
        return output


class MetaUnit(tf.keras.layers.Layer):
    """
    Reference:
        Leaving No One Behind: A Multi-Scenario Multi-Task Meta Learning Approach for Advertiser Modeling
    """
    def __init__(self,
                 num_layer,
                 activation="leaky_relu",
                 dropout=0.,
                 l2_reg=0.,
                 **kwargs):
        self.num_layer = num_layer
        self.l2_reg = l2_reg

        self.weights_dense = []
        self.bias_dense = []
        self.activation_list = [get_activation(activation) for _ in range(num_layer)]
        self.dropout_list = [tf.keras.layers.Dropout(dropout) for _ in range(num_layer)]

        super(MetaUnit, self).__init__(**kwargs)

    def build(self, input_shape):
        assert len(input_shape) == 2
        input_size = input_shape[0][-1]
        self.input_size = input_size

        for i in range(self.num_layer):
            self.weights_dense.append(
                tf.keras.layers.Dense(input_size*input_size, kernel_regularizer=l2(self.l2_reg))
            )
            self.bias_dense.append(
                tf.keras.layers.Dense(input_size, kernel_regularizer=l2(self.l2_reg))
            )

    def call(self, inputs, training=None, **kwargs):
        inputs, scenario_views = inputs

        # [bs, 1, dim]
        squeeze = False
        if K.ndim(inputs) == 2:
            squeeze = True
            inputs = tf.expand_dims(inputs, axis=1)

        output = inputs
        for i in range(self.num_layer):
            # [bs, dim*dim]
            w = self.weights_dense[i](scenario_views)
            b = self.bias_dense[i](scenario_views)

            # [bs, dim, dim]
            w = tf.reshape(w, [-1, self.input_size, self.input_size])
            b = tf.expand_dims(b, axis=1)

            # [bs, 1, dim] * [bs, dim, dim] = [bs, 1, dim]
            fc = tf.matmul(output, w) + b

            output = self.activation_list[i](fc, training=training)

            output = self.dropout_list[i](output, training=training)

        # [bs, dim]
        if squeeze:
            return tf.squeeze(output, axis=1)
        else:
            return output


class MetaAttention(tf.keras.layers.Layer):
    """
    Reference:
        Leaving No One Behind: A Multi-Scenario Multi-Task Meta Learning Approach for Advertiser Modeling
    """
    def __init__(self,
                 meta_unit=None,
                 num_layer=3,
                 activation="leaky_relu",
                 dropout=0.,
                 l2_reg=0.,
                 **kwargs):
        if meta_unit is not None:
            self.meta_unit = meta_unit
        else:
            self.meta_unit = MetaUnit(num_layer, activation, dropout, l2_reg)
        self.dense = tf.keras.layers.Dense(1)

        super(MetaAttention, self).__init__(**kwargs)

    def call(self, inputs, training=None, **kwargs):
        expert_views, task_views, scenario_views = inputs
        task_views = tf.repeat(tf.expand_dims(task_views, axis=1), tf.shape(expert_views)[1], axis=1)
        # [bs, num_experts, dim]
        meta_unit_output = self.meta_unit([tf.concat([expert_views, task_views], axis=-1), scenario_views], training=training)
        # [bs, num_experts, 1]
        score = self.dense(meta_unit_output)
        # [bs, dim]
        output = tf.reduce_sum(expert_views * score, axis=1)

        return output


class MetaTower(tf.keras.layers.Layer):
    """
    Reference:
        Leaving No One Behind: A Multi-Scenario Multi-Task Meta Learning Approach for Advertiser Modeling
    """
    def __init__(self,
                 meta_unit=None,
                 num_layer=3,
                 meta_unit_depth=3,
                 activation="leaky_relu",
                 dropout=0.,
                 l2_reg=0.,
                 **kwargs):
        if meta_unit is not None:
            self.layers = [meta_unit] * num_layer  # 列表中的每个元素都是同一个meta_unit对象
        else:
            self.layers = [MetaUnit(meta_unit_depth, activation, dropout, l2_reg) for _ in range(num_layer)]
        self.activation_list = [get_activation(activation) for _ in range(num_layer)]
        self.dropout_list = [tf.keras.layers.Dropout(dropout) for _ in range(num_layer)]

        super(MetaTower, self).__init__(**kwargs)

    def call(self, inputs, training=None, **kwargs):
        inputs, scenario_views = inputs

        output = inputs
        for i in range(len(self.layers)):
            output = self.layers[i]([output, scenario_views], training=training)
            output = self.activation_list[i](output, training=training)
            output = self.dropout_list[i](output, training=training)

        return output


class TaskEmbedding(tf.keras.layers.Layer):
    """
    Reference:
        Leaving No One Behind: A Multi-Scenario Multi-Task Meta Learning Approach for Advertiser Modeling
    """
    # 创建M2M模型每个任务的可学习向量（不依赖显式的 `task` 特征列），用自定义层以避免Lambda创建变量问题
    def __init__(self, output_dim, **kwargs):
        super().__init__(**kwargs)
        self.emb = tf.keras.layers.Embedding(input_dim=1, output_dim=output_dim, name=f"{self.name}_table")
    def call(self, ref_tensor):
        batch = tf.shape(ref_tensor)[0]
        idx = tf.zeros((batch, 1), dtype=tf.int32)
        return tf.squeeze(self.emb(idx), axis=1)