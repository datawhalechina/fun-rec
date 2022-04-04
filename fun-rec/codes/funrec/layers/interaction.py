import itertools
from re import L
import tensorflow as tf
from tensorflow.keras.layers import Layer, Concatenate
from tensorflow.keras.initializers import TruncatedNormal, glorot_normal


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