import itertools
from re import L
import tensorflow as tf
from tensorflow.keras.layers import *
from tensorflow.keras.initializers import TruncatedNormal, glorot_normal, RandomNormal

from layers.utils import softmax, squash, reduce_sum


class FM(Layer):
    """显示特征交叉，直接按照优化后的公式实现即可
    注意：
        1. 传入进来的参数看起来是一个Embedding权重，没有像公式中出现的特征，那是因
        为，输入的id特征本质上都是onehot编码，取出对应的embedding就等价于特征乘以
        权重。所以后续的操作直接就是对特征进行操作
        2. 在实现过程中，对于公式中的平方的和与和的平方两部分，需要留意是在哪个维度
        上计算，这样就可以轻松实现FM特征交叉模块
    """
    def __init__(self, **kwargs):
        super(FM, self).__init__(**kwargs)

    def build(self, input_shape):
        if not isinstance(input_shape, list) or len(input_shape) < 2:
            raise ValueError('`FM` layer should be called \
                on a list of at least 2 inputs')
        super(FM, self).build(input_shape)  # Be sure to call this somewhere!

    def call(self, inputs, **kwargs):
        """
        inputs: 是一个列表，列表中每个元素的维度为：(None, 1, emb_dim)， 列表长度
            为field_num
        """
        concated_embeds_value =  Concatenate(axis=1)(inputs) #(None,field_num,emb_dim)
        square_of_sum = tf.square(tf.reduce_sum(
            concated_embeds_value, axis=1, keepdims=True)) # (None, 1, emb_dim)
        sum_of_square = tf.reduce_sum(
            concated_embeds_value * concated_embeds_value,
             axis=1, keepdims=True) # (None, 1, emb_dim)
        cross_term = square_of_sum - sum_of_square
        cross_term = 0.5 * tf.reduce_sum(cross_term, axis=2, keepdims=False)#(None,1)
        return cross_term

    def compute_output_shape(self, input_shape):
        return (None, 1)
    
    def get_config(self):
        return super().get_config()


class InnerProduct(Layer):
    def __init__(self, use_mat_dot=False, units=128, **kwargs):
        super(InnerProduct, self).__init__(**kwargs)
        self.use_mat_dot = use_mat_dot
        self.units = units 

    def build(self, input_shape):
        if not isinstance(input_shape, list) or len(input_shape) < 2:
            raise ValueError('`InnerProduct` layer should be called \
                on a list of at least 2 inputs')

        if self.use_mat_dot:
            self.field_size = len(input_shape)
            self.embedding_size = input_shape[0].as_list()[-1]
            # 未优化时的矩阵大小为：D x N x N 
            # 优化后的内积权重大小为：D x N
            self.inner_w = self.add_weight(name='inner_w', shape=(self.units, 
                self.field_size), initializer='glorot_normal')

        super(InnerProduct, self).build(input_shape)

    def call(self, inputs):
        """inputs: 是一个长度为field_size的列表，其中每个元素的形状为：
            (None, 1, embedding_size)
        """        
        # 和原论文中一样使用可学习的权重矩阵与交叉特征做矩阵内积
        if self.use_mat_dot:
            concat_embed = Concatenate(axis=1)(inputs) # (None, feild_size, embedding_size)
            lp_list = []
            for i in range(self.units):
                # 相当于给每一个特征向量都乘以一个权重
                # self.inner_w[i] : (feild_size, ) 添加一个维度变成 (feild_size, 1)
                # delta = (None, feild_size, embedding_size)
                delta = tf.multiply(concat_embed, tf.expand_dims(self.inner_w[i], axis=1)) 
                # 在特征之间的维度上求和
                delta = tf.reduce_sum(delta, axis=1) # (None, embedding_size)
                # 最终在特征embedding维度上求二范数得到p
                lp_list.append(tf.reduce_sum(tf.square(delta), axis=-1, keepdims=True))
            lp = Concatenate(axis=1)(lp_list) # (None, units)
            return lp
        else:
            # 直接将特征两两做内积，最后展开
            row_list, col_list = [], []
            for i in range(len(inputs) - 1):
                for j in range(i + 1, len(inputs)):
                    row_list.append(i)
                    col_list.append(j)
            # pair_num = field_size * (field_size - 1) / 2
            p = tf.concat([inputs[idx] for idx in row_list], axis=1)
            q = tf.concat([inputs[idx] for idx in col_list], axis=1)
            lp = tf.reduce_sum(p * q, axis=-1, keepdims=False) # (None, pair_num)
        return lp


class OuterProduct(Layer):
    def __init__(self, use_mat_dot=True, units=128, **kwargs):
        super(OuterProduct, self).__init__(**kwargs)
        self.use_mat_dot = use_mat_dot
        self.units = units

    def build(self, input_shape):
        if not isinstance(input_shape, list) or len(input_shape) < 2:
            raise ValueError('`OuterProduct` layer should be called \
                on a list of at least 2 inputs')

        self.field_size = len(input_shape)
        self.embedding_size = input_shape[0].as_list()[-1]
        # 优化之后的外积权重大小为：D x embed_dim x embed_dim, 
        # 因为计算外积的时候在特征维度通过求和的方式进行了压缩
        self.outer_w = self.add_weight(name='outer_w', shape=(self.units, 
            self.embedding_size, self.embedding_size), initializer='glorot_normal')
    
    def call(self, inputs):
        """inputs: 是一个长度为field_size的列表，其中每个元素的形状为：
            (None, 1, embedding_size)
        """    
        concat_embed = Concatenate(axis=1)(inputs) # (None, field_size, embedding_size)
        # 外积的优化是将embedding矩阵，在特征间的维度上通过求和进行压缩
        feat_sum = tf.reduce_sum(concat_embed, axis=1) # (None, embedding_size)
        # 为了方便计算外积，将维度进行扩展
        f1 = tf.expand_dims(feat_sum, axis=2) # (None, embedding_size, 1)
        f2 = tf.expand_dims(feat_sum, axis=1) # (None, 1, embedding_size)
        # 求外积 a * a^T
        product = tf.matmul(f1, f2) # (None, embedding_size, embedding_size)
        lp_list = []
        # 将product与外积权重矩阵对应元素相乘再相加
        for i in range(self.units):
            lpi = tf.multiply(product, self.outer_w[i]) # (None, embedding_size, embedding_size)
            # 将后面两个维度进行求和，需要注意的是，每使用一次reduce_sum就会减少一个维度
            lpi = tf.reduce_sum(lpi, axis=[1, 2]) # (None,)
            # 添加一个维度便于特征拼接
            lpi = tf.expand_dims(lpi, axis=1) # (None, 1)
            lp_list.append(lpi)
        # 将所有交叉特征拼接到一起
        lp = Concatenate(axis=1)(lp_list) # (None, self.units)
        return lp


class SelfAttentionInteraction(Layer):
    def __init__(self, att_embedding_size=8, use_res=True, head_num=2, 
        seed=1024, **kwargs):
        super(SelfAttentionInteraction, self).__init__(**kwargs)
        self.att_embedding_size = 8
        self.head_num = head_num
        self.seed = seed
        self.use_res = use_res

    def build(self, input_shape):
        if not isinstance(input_shape, list) or len(input_shape) < 2:
            raise ValueError('`OuterProduct` layer should be called \
                on a list of at least 2 inputs')

        embedding_size = input_shape[0].as_list()[-1]
        # 定义三个可学习的矩阵（W_Q, W_K, W_V）
        self.W_Q = self.add_weight(name="query", shape=[embedding_size, 
            self.att_embedding_size * self.head_num], dtype=tf.float32, 
            initializer=TruncatedNormal(self.seed))
        self.W_K = self.add_weight(name="key", shape=[embedding_size, 
            self.att_embedding_size * self.head_num], dtype=tf.float32, 
            initializer=TruncatedNormal(self.seed))
        self.W_V = self.add_weight(name="value", shape=[embedding_size, 
            self.att_embedding_size * self.head_num], dtype=tf.float32, 
            initializer=TruncatedNormal(self.seed))
        
        # 残差映射权重矩阵
        if self.use_res:
            self.W_Res = self.add_weight(name="res", shape=[embedding_size, 
            self.att_embedding_size * self.head_num], dtype=tf.float32, 
            initializer=TruncatedNormal(self.seed))
        return super().build(input_shape)

    def call(self, inputs, **kwargs):
        """inputs: 是一个长度为field_size的列表，其中每个元素的形状为：
            (None, 1, embedding_size)
        """    
        # 原始输入分别与三个权重矩阵相乘
        # inputs的最后一个维度与矩阵的第一个维度相乘
        inputs = Concatenate(axis=1)(inputs)
        # querys：(None, field_size, att_embedding_size*head_num)
        querys = tf.tensordot(inputs, self.W_Q, axes=(-1, 0)) 
        keys = tf.tensordot(inputs, self.W_K, axes=(-1, 0)) 
        values = tf.tensordot(inputs, self.W_V, axes=(-1, 0)) 

        # 将每个注意力头分开，方便对单个注意力头的输出进行处理
        # stack默认是在第0个维度去堆叠
        # querys：(head_num, None, field_size, att_embedding_size)
        querys = tf.stack(tf.split(querys, self.head_num, axis=-1))
        keys = tf.stack(tf.split(keys, self.head_num, axis=-1))
        values = tf.stack(tf.split(values, self.head_num, axis=-1))

        # 计算注意力权重
        # 先计算内积,transpose_b=True指的是在计算矩阵相乘时，将keys转置(key的最后
        # 两维换了位置)
        # 内积矩阵：(head_num, None, field_size, field_size)
        inner_product = tf.matmul(querys, keys, transpose_b=True)
        # att_scores: (head_num, None, field_size, 1)
        att_scores = tf.nn.softmax(inner_product, axis=-1)

        # att_output: (head_num, None, field_size, att_embedding_size)
        att_output = tf.matmul(att_scores, values)
        # 将多头注意力分开用于拼接
        # tf.split默认在第0个维度切分
        # att_output: (1, None, field_size, att_embedding_size*head_num)
        att_output = tf.concat(tf.split(att_output, self.head_num), axis=-1)
        # att_output: (None, field_size, att_embedding_size*head_num)
        att_output = tf.squeeze(att_output, axis=0)

        if self.use_res:
            att_output += tf.tensordot(inputs, self.W_Res, axes=(-1, 0))         
        att_out = tf.nn.relu(att_output)
        return att_out 

    def compute_output_shape(self, input_shape):
        return (None, len(input_shape), self.att_embedding_size * self.head_num)

    def get_config(self):
        config = {'att_embedding_size': self.att_embedding_size, 
        'head_num': self.head_num, 'use_res': self.use_res, 'seed': self.seed}
        base_config = super(SelfAttentionInteraction, self).get_config()
        base_config.update(config)
        return base_config


class SENetLayer(Layer):
    def __init__(self, reduction_ratio=3, seed=1024, **kwargs):
        super(SENetLayer, self).__init__(**kwargs)
        self.reduction_ratio = reduction_ratio
        self.seed = seed

    def build(self, input_shape):
        if not isinstance(input_shape, list) or len(input_shape) < 2:
            raise ValueError('`SENetLayer` layer should be called \
                on a list of at least 2 inputs')
       
        self.field_size = len(input_shape)
        self.embedding_size = input_shape[0].as_list()[-1]
        reduction_size = max(1, int(self.field_size // self.reduction_ratio))

        # 定义两个全连接层
        self.W_1 = self.add_weight(name="W_1", shape=(self.field_size, 
            reduction_size), initializer=glorot_normal(self.seed))
        self.W_2 = self.add_weight(name="W_2", shape=(reduction_size, 
            self.field_size), initializer=glorot_normal(self.seed))
        return super().build(input_shape)

    def call(self, inputs, **kwargs):
        """inputs: 是一个长度为field_size的列表，其中每个元素的形状为：
            (None, 1, embedding_size)
        """    
        inputs = Concatenate(axis=1)(inputs) # (None, field_size, embedding_size)
        x = tf.reduce_mean(inputs, axis=-1) # (None, field_size)
        
        # (None, field_size) * (field_size, reduction_size) = 
        # (None, reduction_size)
        A_1 = tf.tensordot(x, self.W_1, axes=(-1, 0))
        A_1 = tf.nn.relu(A_1)
        # (None, reduction_size) * (reduction_size, field_size) = 
        # (None, field_size)
        A_2 = tf.tensordot(A_1, self.W_2, axes=(-1, 0))
        A_2 = tf.nn.relu(A_2)
        A_2 = tf.expand_dims(A_2, axis=2) # (None, field_size, 1)

        res = tf.multiply(inputs, A_2) #(None, field_size, embedding_size)
        # 切分成数组，方便后续特征交叉
        res = tf.split(res, self.field_size, axis=1)
        return res

    def compute_output_shape(self, input_shape):
        return input_shape

    def get_config(self):
        config = {"reduction_ratio": self.reduction_ratio, "seed": self.seed}
        base_config = super(SENetLayer, self).get_config()
        base_config.update(config)
        return base_config


class BilinearInteractionLayer(Layer):
    def __init__(self, bilinear_type="interaction", seed=1024, **kwargs):
        super(BilinearInteractionLayer, self).__init__(**kwargs)
        self.bilinear_type = bilinear_type
        self.seed = seed

    def build(self, input_shape):
        if not isinstance(input_shape, list) or len(input_shape) < 2:
            raise ValueError('`OuterProduct` layer should be called \
                on a list of at least 2 inputs')

        embedding_size = input_shape[0].as_list()[-1]
        field_size = len(input_shape)

        # 所有交叉特征共享一个交叉矩阵
        if self.bilinear_type == 'all': 
            self.W = self.add_weight(name='bilinear_weight',
                shape=(embedding_size, embedding_size), 
                initializer=glorot_normal(self.seed))
        # 每个特征使用一个交叉矩阵
        elif self.bilinear_type == "each": 
            self.W_list = [self.add_weight(name='bilinear_weight_'+str(i),
                shape=(embedding_size, embedding_size), 
                initializer=glorot_normal(self.seed)) for i in range(field_size)]
        # 每组交叉特征使用一个交叉矩阵
        elif self.bilinear_type == 'interaction': 
            self.W_list = [self.add_weight(name='bilinear_weight_'+str(i)+"_"+str(j),
                shape=(embedding_size, embedding_size), 
                initializer=glorot_normal(self.seed)) 
                for i,j in itertools.combinations(range(field_size), 2)]
        else:
            raise NotImplementedError
        return super().build(input_shape)

    def call(self, inputs, **kwargs):
        """inputs: 是一个长度为field_size的列表，其中每个元素的形状为：
            (None, 1, embedding_size)
        """    
        if self.bilinear_type == 'all':
            # 计算点积, 遍历所有的特征分别与交叉矩阵计算内积
            # inputs[i]: (None, 1, embedding_size)
            vdotw_list = [tf.tensordot(inputs[i], self.W, axes=(-1,0)) 
                for i in range(len(inputs))]
            # 计算哈达玛积，遍历两两特征组合，计算哈达玛积
            p = [tf.multiply(vdotw_list[i], inputs[j]) for i, j in 
                itertools.combinations(range(len(inputs)), 2)]
        elif self.bilinear_type == 'each':
            # 每个特征都有一个交叉矩阵，self.W_list[i]
            vdotw_list = [tf.tensordot(inputs[i], self.W_list[i],
                axes=(-1,0)) for i in range(len(inputs))]
            p = [tf.multiply(vdotw_list[i], inputs[j]) for i, j in 
                itertools.combinations(range(len(inputs)), 2)]
        elif self.bilinear_type == 'interaction':
            p = [tf.multiply(tf.tensordot(inputs[v[0]], w, axes=(-1, 0)), inputs[v[1]]) for v, w in 
                zip(itertools.combinations(range(len(inputs)), 2), self.W_list)]
        else:
            raise NotImplementedError
        # (None, field_size * (field_size - 1) / 2, embedding_size)
        output = tf.concat(p, axis=1) 
        return output 

    def compute_output_shape(self, input_shape):
        field_size = input_shape[1]
        embedding_size = input_shape[2]
        return (None, int(field_size * (field_size - 1) // 2), embedding_size)

    def get_config(self):
        config = {"bilinear_type": self.bilinear_type, "seed": self.seed}
        base_config = super(BilinearInteractionLayer, self).get_config()
        base_config.update(config)
        return base_config


class AttentionSequencePoolingLayer(Layer):
    """
    :param query: [batch_szie, 1, c_q]
    :param keys: [batch_size, T, c_k]
    :param keys_length: [batch_size, 1]
    :return [batch, 1, c_k]
    """

    def __init__(self, dropout_rate=0, scale=True, **kwargs):
        self.dropout_rate = dropout_rate
        self.scale = scale
        super(AttentionSequencePoolingLayer, self).__init__(**kwargs)

    def build(self, input_shape):
        self.projection_layer = Dense(units=1, activation='tanh')
        super(AttentionSequencePoolingLayer, self).build(input_shape)

    def call(self, inputs, mask=None, **kwargs):
        # queries[None, 1, 64], keys[None, 50, 32], keys_length[None, 1]， 表示真实的会话长度， 后面mask会用到
        queries, keys, keys_length = inputs
        hist_len = keys.get_shape()[1]
        key_mask = tf.sequence_mask(keys_length, hist_len)  # mask 矩阵 (None, 1, 50)

        queries = tf.tile(queries, [1, hist_len, 1])  # [None, 50, 64]   为每个key都配备一个query
        # 后面，把queries与keys拼起来过全连接， 这里是这样的， 本身接下来是要求queryies与keys中每个item相关性，常规操作我们能想到的就是直接内积求得分数
        # 而这里的Attention实现，使用的是LuongAttention， 传统的Attention原来是有两种BahdanauAttention与LuongAttention， 这个在博客上整理下
        # 这里采用的LuongAttention，对其方式是q_k先拼接，然后过DNN的方式
        q_k = tf.concat([queries, keys], axis=-1)  # [None, 50, 96]
        output_scores = self.projection_layer(q_k)  # [None, 50, 1]

        if self.scale:
            output_scores = output_scores / (q_k.get_shape().as_list()[-1] ** 0.5)
        attention_score = tf.transpose(output_scores, [0, 2, 1])

        # 加权求和 需要把填充的那部分mask掉
        paddings = tf.ones_like(attention_score) * (-2 ** 32 + 1)
        attention_score = tf.where(key_mask, attention_score, paddings)
        attention_score = softmax(attention_score)  # [None, 1, 50]

        outputs = tf.matmul(attention_score, keys)  # [None, 1, 32]
        return outputs

    def compute_output_shape(self, input_shape):
        return (None, 1, input_shape[1][1])


class MultiHeadAttention(Layer):
    def __init__(self, num_units=8, head_num=4, scale=True, dropout_rate=0.2, use_layer_norm=True, use_res=True,
                 seed=2020, **kwargs):
        self.num_units = num_units
        self.head_num = head_num
        self.scale = scale
        self.dropout_rate = dropout_rate
        self.use_layer_norm = use_layer_norm
        self.use_res = use_res
        self.seed = seed
        super(MultiHeadAttention, self).__init__(**kwargs)

    def build(self, input_shape):
        embedding_size = int(input_shape[0][-1])
        # wq_wk_wv 放到一块
        self.W = self.add_weight(name='Q_K_V', shape=[embedding_size, self.num_units * 3],
                                 dtype=tf.float32,
                                 initializer=TruncatedNormal(seed=self.seed))
        self.W_output = self.add_weight(name='output_W', shape=[self.num_units, self.num_units],
                                        dtype=tf.float32,
                                        initializer=TruncatedNormal(seed=self.seed))
        self.layer_norm = LayerNormalization()
        self.dropout = Dropout(self.dropout_rate, seed=self.seed)
        self.seq_len_max = int(input_shape[0][1])
        super(MultiHeadAttention, self).build(input_shape)

    def call(self, inputs, training=None, **kwargs):
        input_info, keys_length = inputs
        hist_len = input_info.get_shape()[1]
        key_masks = tf.sequence_mask(keys_length, hist_len)  # (None, 1, 5)
        key_masks = tf.squeeze(key_masks, axis=1)  # (None, 5)

        Q_K_V = tf.tensordot(input_info, self.W, axes=(-1, 0))  # (None, seq_len, embed*3)
        querys, keys, values = tf.split(Q_K_V, 3, -1)

        # 计算的时候，分开头计算
        querys = tf.concat(tf.split(querys, self.head_num, axis=2), axis=0)  # (head_num*None, seq_len, embed/head_num)
        keys = tf.concat(tf.split(keys, self.head_num, axis=2), axis=0)  # (head_num*None, seq_len, embed/headnum)
        values = tf.concat(tf.split(values, self.head_num, axis=2), axis=0)  # (head_num*None, seq_len, embed/head_num)

        # 注意力分数
        att_score = tf.matmul(querys, tf.transpose(keys, [0, 2, 1]))  # (head_num*None, seq_len, seq_len)
        if self.scale:
            att_score = att_score / (keys.get_shape().as_list()[-1] ** 0.5)
        key_masks = tf.tile(key_masks, [self.head_num, 1])  # [head_num*None, seq_len]
        key_masks = tf.tile(tf.expand_dims(key_masks, 1),
                            [1, tf.shape(input_info)[1], 1])  # [head_num*None, seq_len, seq_len]

        paddings = tf.ones_like(att_score) * (-2 ** 32 + 1)  # [head_num*None, seq_len, seq_len]
        align = tf.where(key_masks, att_score, paddings)  # [head_num*None, seq_len, seq_len]
        align = softmax(align)
        output = tf.matmul(align, values)  # [head_num*None, seq_len, emb/head_num]

        output = tf.concat(tf.split(output, self.head_num, axis=0), axis=2)  # [None, seq_len, emb]
        output = tf.tensordot(output, self.W_output, axes=(-1, 0))  # [None, seq_len, emb]
        output = self.dropout(output, training=training)
        if self.use_res:
            output += input_info
        if self.use_layer_norm:
            output = self.layer_norm(output)
        return output

    def compute_output_shape(self, input_shape):
        return (None, input_shape[0][1], self.num_units)


class UserAttention(Layer):
    def __init__(self, num_units=None, activation='tanh', use_res=True, dropout_rate=0, scale=True, seed=2020,
                 **kwargs):
        self.scale = scale
        self.num_units = num_units
        self.activation = activation
        self.seed = seed
        self.dropout_rate = dropout_rate
        self.use_res = use_res
        super(UserAttention, self).__init__(**kwargs)

    def build(self, input_shape):
        if self.num_units is None:
            self.num_units = input_shape[0][-1]
        self.dense = Dense(self.num_units, activation=self.activation)
        super(UserAttention, self).build(input_shape)

    def call(self, inputs, mask=None, **kwargs):
        # [None, 1, embed]  [None, 5, embed], [None, 1]
        user_query, keys, keys_length = inputs
        hist_len = keys.get_shape()[1]
        key_masks = tf.sequence_mask(keys_length, hist_len)  # [None, 1, 5]
        query = self.dense(user_query)  # [None, 1, num_units]

        # 注意力分数
        att_score = tf.matmul(query, tf.transpose(keys, [0, 2, 1]))  # (None, 1, seq_len)
        if self.scale:
            att_score = att_score / (keys.get_shape().as_list()[-1] ** 0.5)

        paddings = tf.ones_like(att_score) * (-2 ** 32 + 1)  # [None, 1, seq_len]
        align = tf.where(key_masks, att_score, paddings)  # [None, 1, seq_len]
        align = softmax(align)

        output = tf.matmul(align, keys)  # [None, 1, embed]
        return output

    def compute_output_shape(self, input_shape):
        return (None, 1, input_shape[1][2])

    def compute_mask(self, inputs, mask):
        return mask

class LabelAwareAttention(Layer):
    def __init__(self, k_max, pow_p=1, **kwargs):
        self.k_max = k_max
        self.pow_p = pow_p
        super(LabelAwareAttention, self).__init__(**kwargs)

    def build(self, input_shape):
        self.embedding_size = input_shape[0][-1]
        super(LabelAwareAttention, self).build(input_shape)

    def call(self, inputs):
        keys, query = inputs[0], inputs[1]  # keys (None, 2, 8)  query (None, 1, 8)
        weight = reduce_sum(keys * query, axis=-1, keep_dims=True)  # (None, 2, 1)
        weight = tf.pow(weight, self.pow_p)  # (None, 2, 1)

        # k如果需要动态调整，那么这里就根据实际长度mask操作，这样被mask的输出胶囊的权重为0， 发挥不出作用了
        if len(inputs) == 3:
            k_user = tf.cast(tf.maximum(
                1.,
                tf.minimum(
                    tf.cast(self.k_max, dtype="float32"),  # k_max
                    tf.log1p(tf.cast(inputs[2], dtype="float32")) / tf.log(2.)  # hist_len
                )
            ), dtype="int64")
            seq_mask = tf.transpose(tf.sequence_mask(k_user, self.k_max), [0, 2, 1])
            padding = tf.ones_like(seq_mask, dtype=tf.float32) * (-2 ** 32 + 1)  # [x,k_max,1]
            weight = tf.where(seq_mask, weight, padding)

        weight = softmax(weight, dim=1, name='weight')
        output = reduce_sum(keys * weight, axis=1)  # (None, 8)
        return output


class CapsuleLayer(Layer):
    def __init__(self, input_units, out_units, max_len, k_max, iteration_times=3, init_std=1.0, **kwargs):
        self.input_units = input_units
        self.out_units = out_units
        self.max_len = max_len
        self.k_max = k_max
        self.iteration_times = iteration_times
        self.init_std = init_std
        super(CapsuleLayer, self).__init__(**kwargs)

    def build(self, input_shape):
        # 路由对数，大小是1，2，50， 即每个路由对数与输入胶囊个数一一对应，同时如果有两组输出胶囊的话， 那么这里就需要2组B
        self.routing_logits = self.add_weight(shape=[1, self.k_max, self.max_len],
                                              initializer=RandomNormal(stddev=self.init_std),
                                              trainable=False, name='B', dtype=tf.float32)
        # 双线性映射矩阵，维度是[输入胶囊维度，输出胶囊维度] 这样才能进行映射
        self.bilinear_mapping_matrix = self.add_weight(shape=[self.input_units, self.out_units],
                                                       initializer=RandomNormal(stddev=self.init_std),
                                                       name="S", dtype=tf.float32)
        super(CapsuleLayer, self).build(input_shape)

    def call(self, inputs, **kwargs):
        # input (hist_emb, hist_len) ,其中hist_emb是(None, seq_len, emb_dim), hist_len是(none, 1) batch and sel_len
        behavior_embeddings, seq_len = inputs
        batch_size = tf.shape(behavior_embeddings)[0]
        seq_len_tile = tf.tile(seq_len, [1, self.k_max])  # 在第二个维度上复制一份 k_max个输出胶囊嘛 (None, 2)  第一列和第二列都是序列真实长度

        for i in range(self.iteration_times):
            mask = tf.sequence_mask(seq_len_tile,
                                    self.max_len)  # （None, 2, 50) 第一个维度是样本，第二个维度是胶囊，第三个维度是[True, True, ..False, False, ..]
            pad = tf.ones_like(mask, dtype=tf.float32) * (
                        -2 ** 32 + 1)  # (None, 2, 50)  被mask的位置是非常小的数，这样softmax的时候这个位置正好是0
            routing_logits_with_padding = tf.where(mask, tf.tile(self.routing_logits, [batch_size, 1, 1]), pad)
            # (None, 2, 50) 沿着batch_size进行复制，每个样本都得有这样一套B，2个输出胶囊， 50个输入胶囊

            weight = tf.nn.softmax(routing_logits_with_padding)  # (none, 2, 50)  # softmax得到权重

            # (None, seq_len, emb_dim) * (emb_dim, out_emb) = (None, 50, 8) axes=1表示a的最后1个维度，与b进行张量乘法
            behavior_embedding_mapping = tf.tensordot(behavior_embeddings, self.bilinear_mapping_matrix, axes=1)

            Z = tf.matmul(weight, behavior_embedding_mapping)  # (None, 2, 8)即 上面的B与behavior_embed_map加权求和
            interest_capsules = squash(Z)  # (None, 2, 8)

            delta_routing_logits = reduce_sum(
                # (None, 2, 8)  * (None, 8, 50) = (None, 2, 50)
                tf.matmul(interest_capsules, tf.transpose(behavior_embedding_mapping, perm=[0, 2, 1])),
                axis=0, keep_dims=True
            )  # (1, 2, 50)   样本维度这里相加  所有样本一块为聚类做贡献

            self.routing_logits.assign_add(delta_routing_logits)  # 原来的基础上加上这个东西 （1, 2, 50)

        interest_capsules = tf.reshape(interest_capsules, [-1, self.k_max, self.out_units])  # (None, 2, 8)
        return interest_capsules

    def compute_output_shape(self, input_shape):
        return (None, self.k_max, self.out_units)

    # 下面这个如果需要保存模型的时候会用到
    def get_config(self, ):
        config = {'input_units': self.input_units, 'out_units': self.out_units, 'max_len': self.max_len,
                  'k_max': self.k_max, 'iteration_times': self.iteration_times, "init_std": self.init_std}
        base_config = super(CapsuleLayer, self).get_config()
        return dict(list(base_config.items()) + list(config.items()))