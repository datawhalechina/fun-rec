import pandas as pd
import numpy as np
from tqdm import tqdm
import warnings, random, math, os
from collections import namedtuple, OrderedDict

import tensorflow as tf
from tensorflow.keras.layers import *
from tensorflow.keras.models import *
import tensorflow.keras.backend as K
from tensorflow.python.keras.initializers import (Zeros, glorot_normal,
                                                  glorot_uniform)

from tensorflow.python.keras.regularizers import l2

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, MinMaxScaler, StandardScaler, LabelEncoder

from utils import DenseFeat, SparseFeat, VarLenSparseFeat

# 简单处理特征，包括填充缺失值，数值处理，类别编码
def data_process(data_df, dense_features, sparse_features):
    data_df[dense_features] = data_df[dense_features].fillna(0.0)
    for f in dense_features:
        data_df[f] = data_df[f].apply(lambda x: np.log(x+1) if x > -1 else -1)
        
    data_df[sparse_features] = data_df[sparse_features].fillna("-1")
    for f in sparse_features:
        lbe = LabelEncoder()
        data_df[f] = lbe.fit_transform(data_df[f])
    
    return data_df[dense_features + sparse_features]

# 构建输入层
# 将输入的数据转换成字典的形式，定义输入层的时候让输入层的name和字典中特征的key一致，就可以使得输入的数据和对应的Input层对应
def build_input_layers(feature_columns):
    """构建Input层字典，并以dense和sparse两类字典的形式返回"""
    dense_input_dict, sparse_input_dict = {}, {}
    for fc in feature_columns:
        if isinstance(fc, SparseFeat):
            sparse_input_dict[fc.name] = Input(shape=(1, ), name=fc.name, dtype=fc.dtype)
        elif isinstance(fc, DenseFeat):
            dense_input_dict[fc.name] = Input(shape=(fc.dimension, ), name=fc.name, dtype=fc.dtype)
    return dense_input_dict, sparse_input_dict

# 构建embedding层
def build_embedding_layers(feature_columns, input_layer_dict, is_linear):
    # 定义一个embedding层对应的字典
    embedding_layers_dict = dict()
    
    # 将特征中的sparse特征筛选出来
    sparse_features_columns = list(filter(lambda x: isinstance(x, SparseFeat), feature_columns)) if feature_columns else []
    
    # 如果是用于线性部分的embedding层，其维度是1，否则维度是自己定义的embedding维度
    if is_linear:
        for fc in sparse_features_columns:
            embedding_layers_dict[fc.name] = Embedding(fc.vocabulary_size, 1, name='1d_emb_'+fc.name)
    else:
        for fc in sparse_features_columns:
            embedding_layers_dict[fc.name] = Embedding(fc.vocabulary_size, fc.embedding_dim, name='kd_emb_'+fc.name)
    
    return embedding_layers_dict


# 将所有的sparse特征embedding拼接
def concat_embedding_list(feature_columns, input_layer_dict, embedding_layer_dict, flatten=False):
    # 将sparse特征筛选出来
    sparse_feature_columns = list(filter(lambda x: isinstance(x, SparseFeat), feature_columns))

    embedding_list = []
    for fc in sparse_feature_columns:
        _input = input_layer_dict[fc.name] # 获取输入层 
        _embed = embedding_layer_dict[fc.name] # B x 1 x dim  获取对应的embedding层
        embed = _embed(_input) # B x dim  将input层输入到embedding层中

        # 是否需要flatten, 如果embedding列表最终是直接输入到Dense层中，需要进行Flatten，否则不需要
        if flatten:
            embed = Flatten()(embed)
        
        embedding_list.append(embed)
    
    return embedding_list 

def get_dnn_output(dnn_input, hidden_units=[1024, 512, 256], dnn_dropout=0.3, activation='relu'):
    
    # 建立dnn_network
    dnn_network = [Dense(units=unit, activation=activation) for unit in hidden_units]
    dropout = Dropout(dnn_dropout)
    
    # 前向传播
    x = dnn_input
    for dnn in dnn_network:
        x = dropout(dnn(x))
    
    return x

# 得到线性部分的计算结果, 即线性部分计算的前向传播逻辑
def get_linear_logits(dense_input_dict, sparse_input_dict, linear_feature_columns):
    """
    线性部分的计算，所有特征的Input层，然后经过一个全连接层线性计算结果logits
    即FM线性部分的那块计算w1x1+w2x2+...wnxn + b,只不过，连续特征和离散特征这里的线性计算还不太一样
        连续特征由于是数值，可以直接过全连接，得到线性这边的输出。 
        离散特征需要先embedding得到1维embedding，然后直接把这个1维的embedding相加就得到离散这边的线性输出。
    :param dense_input_dict: A dict. 连续特征构建的输入层字典 形式{'dense_name': Input(shape, name, dtype)}
    :param sparse_input_dict: A dict. 离散特征构建的输入层字典 形式{'sparse_name': Input(shape, name, dtype)}
    :param linear_feature_columns: A list. 里面的每个元素是namedtuple(元组的一种扩展类型，同时支持序号和属性名访问组件)类型，表示的是linear数据的特征封装版
    """
    # 把所有的dense特征合并起来,经过一个神经元的全连接，做的计算  w1x1 + w2x2 + w3x3....wnxn
    concat_dense_inputs = Concatenate(axis=1)(list(dense_input_dict.values()))
    dense_logits_output = Dense(1)(concat_dense_inputs) 
    
    # 获取linear部分sparse特征的embedding层，这里使用embedding的原因：
    # 对于linear部分直接将特征进行OneHot然后通过一个全连接层，当维度特别大的时候，计算比较慢
    # 使用embedding层的好处就是可以通过查表的方式获取到非零元素对应的权重，然后将这些权重相加，提升效率
    linear_embedding_layers = build_embedding_layers(linear_feature_columns, sparse_input_dict, is_linear=True)
    
    # 将一维的embedding拼接，注意这里需要一个Flatten层， 使维度对应
    sparse_1d_embed = []
    for fc in linear_feature_columns:
        # 离散特征要进行embedding
        if isinstance(fc, SparseFeat):
            # 找到对应Input层，然后后面接上embedding层
            feat_input = sparse_input_dict[fc.name]
            embed = Flatten()(linear_embedding_layers[fc.name](feat_input))
            sparse_1d_embed.append(embed)
    
    # embedding中查询得到的权重就是对应onehot向量中一个位置的权重，所以后面不用再接一个全连接了，本身一维的embedding就相当于全连接
    # 只不过是这里的输入特征只有0和1，所以直接向非零元素对应的权重相加就等同于进行了全连接操作(非零元素部分乘的是1)
    sparse_logits_output = Add()(sparse_1d_embed)
    
    # 最终将dense特征和sparse特征对应的logits相加，得到最终linear的logits
    linear_part = Add()([dense_logits_output, sparse_logits_output])
    
    return linear_part

class CIN(Layer):
    def __init__(self, cin_size, l2_reg=1e-4):
        """
        :param: cin_size: A list. [H_1, H_2, ....H_T], a list of number of layers
        """
        super(CIN, self).__init__()
        self.cin_size = cin_size
        self.l2_reg = l2_reg
    
    def build(self, input_shape):
        # input_shape  [None, field_nums, embedding_dim]
        self.field_nums = input_shape[1]
        
        # CIN 的每一层大小，这里加入第0层，也就是输入层H_0
        self.field_nums = [self.field_nums] + self.cin_size
        
        # 过滤器
        self.cin_W = {
            'CIN_W_' + str(i): self.add_weight(
                name='CIN_W_' + str(i),
                shape = (1, self.field_nums[0] * self.field_nums[i], self.field_nums[i+1]), # 这个大小要理解
                initializer='random_uniform',
                regularizer=l2(self.l2_reg),
                trainable=True
            )
            for i in range(len(self.field_nums)-1)
        }
        
        super(CIN, self).build(input_shape)
        
    def call(self, inputs):
        # inputs [None, field_num, embed_dim]
        embed_dim = inputs.shape[-1]
        hidden_layers_results = [inputs]
        
        # 从embedding的维度把张量一个个的切开,这个为了后面逐通道进行卷积，算起来好算
        # 这个结果是个list， list长度是embed_dim, 每个元素维度是[None, field_nums[0], 1]  field_nums[0]即输入的特征个数
        # 即把输入的[None, field_num, embed_dim]，切成了embed_dim个[None, field_nums[0], 1]的张量
        split_X_0 = tf.split(hidden_layers_results[0], embed_dim, 2) 
        
        for idx, size in enumerate(self.cin_size):
            # 这个操作和上面是同理的，也是为了逐通道卷积的时候更加方便，分割的是当一层的输入Xk-1
            split_X_K = tf.split(hidden_layers_results[-1], embed_dim, 2)   # embed_dim个[None, field_nums[i], 1] feild_nums[i] 当前隐藏层单元数量
            
            # 外积的运算
            out_product_res_m = tf.matmul(split_X_0, split_X_K, transpose_b=True) # [embed_dim, None, field_nums[0], field_nums[i]]
            out_product_res_o = tf.reshape(out_product_res_m, shape=[embed_dim, -1, self.field_nums[0]*self.field_nums[idx]]) # 后两维合并起来
            out_product_res = tf.transpose(out_product_res_o, perm=[1, 0, 2])  # [None, dim, field_nums[0]*field_nums[i]]
            
            # 卷积运算
            # 这个理解的时候每个样本相当于1张通道为1的照片 dim为宽度， field_nums[0]*field_nums[i]为长度
            # 这时候的卷积核大小是field_nums[0]*field_nums[i]的, 这样一个卷积核的卷积操作相当于在dim上进行滑动，每一次滑动会得到一个数
            # 这样一个卷积核之后，会得到dim个数，即得到了[None, dim, 1]的张量， 这个即当前层某个神经元的输出
            # 当前层一共有field_nums[i+1]个神经元， 也就是field_nums[i+1]个卷积核，最终的这个输出维度[None, dim, field_nums[i+1]]
            cur_layer_out = tf.nn.conv1d(input=out_product_res, filters=self.cin_W['CIN_W_'+str(idx)], stride=1, padding='VALID')
            
            cur_layer_out = tf.transpose(cur_layer_out, perm=[0, 2, 1])  # [None, field_num[i+1], dim]
            
            hidden_layers_results.append(cur_layer_out)
        
        # 最后CIN的结果，要取每个中间层的输出，这里不要第0层的了
        final_result = hidden_layers_results[1:]     # 这个的维度T个[None, field_num[i], dim]  T 是CIN的网络层数
        
        # 接下来在第一维度上拼起来  
        result = tf.concat(final_result, axis=1)  # [None, H1+H2+...HT, dim]
        # 接下来， dim维度上加和，并把第三个维度1干掉
        result = tf.reduce_sum(result, axis=-1, keepdims=False)  # [None, H1+H2+..HT]
        
        return result

def xDeepFM(linear_feature_columns, dnn_feature_columns, cin_size=[128, 128]):
    # 构建输入层，即所有特征对应的Input()层，这里使用字典的形式返回，方便后续构建模型
    dense_input_dict, sparse_input_dict = build_input_layers(linear_feature_columns+dnn_feature_columns)
    
    # 构建模型的输入层，模型的输入层不能是字典的形式，应该将字典的形式转换成列表的形式
    # 注意：这里实际的输入预Input层对应，是通过模型输入时候的字典数据的key与对应name的Input层
    input_layers = list(dense_input_dict.values()) + list(sparse_input_dict.values())
    
    # 线性部分的计算逻辑 -- linear
    linear_logits = get_linear_logits(dense_input_dict, sparse_input_dict, linear_feature_columns)
    
    # 构建维度为k的embedding层，这里使用字典的形式返回，方便后面搭建模型
    # 线性层和dnn层统一的embedding层
    embedding_layer_dict = build_embedding_layers(linear_feature_columns+dnn_feature_columns, sparse_input_dict, is_linear=False)
    
    # DNN侧的计算逻辑 -- Deep
    # 将dnn_feature_columns里面的连续特征筛选出来，并把相应的Input层拼接到一块
    dnn_dense_feature_columns = list(filter(lambda x: isinstance(x, DenseFeat), dnn_feature_columns)) if dnn_feature_columns else []
    dnn_dense_feature_columns = [fc.name for fc in dnn_dense_feature_columns]
    dnn_concat_dense_inputs = Concatenate(axis=1)([dense_input_dict[col] for col in dnn_dense_feature_columns])
    
    # 将dnn_feature_columns里面的离散特征筛选出来，相应的embedding层拼接到一块
    dnn_sparse_kd_embed = concat_embedding_list(dnn_feature_columns, sparse_input_dict, embedding_layer_dict, flatten=True)
    dnn_concat_sparse_kd_embed = Concatenate(axis=1)(dnn_sparse_kd_embed)
    
    # DNN层的输入和输出
    dnn_input = Concatenate(axis=1)([dnn_concat_dense_inputs, dnn_concat_sparse_kd_embed])
    dnn_out = get_dnn_output(dnn_input)
    dnn_logits = Dense(1)(dnn_out)
    
    # CIN侧的计算逻辑， 这里使用的DNN feature里面的sparse部分,这里不要flatten
    exFM_sparse_kd_embed = concat_embedding_list(dnn_feature_columns, sparse_input_dict, embedding_layer_dict, flatten=False)
    exFM_input = Concatenate(axis=1)(exFM_sparse_kd_embed)
    exFM_out = CIN(cin_size=cin_size)(exFM_input)
    exFM_logits = Dense(1)(exFM_out)
    
    # 三边的结果stack
    stack_output = Add()([linear_logits, dnn_logits, exFM_logits])
    
    # 输出层
    output_layer = Dense(1, activation='sigmoid')(stack_output)
    
    model = Model(input_layers, output_layer)
    
    return model


if __name__ == "__main__":
    # 读取数据
    data = pd.read_csv('../data/criteo_sample.txt')

    # 划分dense和sparse特征
    columns = data.columns.values
    dense_features = [feat for feat in columns if 'I' in feat]
    sparse_features = [feat for feat in columns if 'C' in feat]

    # 简单的数据预处理
    train_data = data_process(data, dense_features, sparse_features)
    train_data['label'] = data['label']

    # 将特征分组，分成linear部分和dnn部分(根据实际场景进行选择)，并将分组之后的特征做标记（使用DenseFeat, SparseFeat）
    linear_feature_columns = [SparseFeat(feat, vocabulary_size=data[feat].nunique(),embedding_dim=4)
                            for i,feat in enumerate(sparse_features)] + [DenseFeat(feat, 1,)
                            for feat in dense_features]

    dnn_feature_columns = [SparseFeat(feat, vocabulary_size=data[feat].nunique(),embedding_dim=4)
                            for i,feat in enumerate(sparse_features)] + [DenseFeat(feat, 1,)
                            for feat in dense_features]

    # 构建xDeepFM模型
    model = xDeepFM(linear_feature_columns, dnn_feature_columns)
    model.summary()
    model.compile(optimizer="adam", 
                loss="binary_crossentropy", 
                metrics=["binary_crossentropy", tf.keras.metrics.AUC(name='auc')])

    # 将输入数据转化成字典的形式输入
    train_model_input = {name: data[name] for name in dense_features + sparse_features}
    # 模型训练
    model.fit(train_model_input, train_data['label'].values,
            batch_size=64, epochs=5, validation_split=0.2, )