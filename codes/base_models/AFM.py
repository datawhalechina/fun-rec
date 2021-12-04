import pandas as pd
import numpy as np
from tqdm import tqdm
import warnings, random, math, os
from collections import namedtuple, OrderedDict

import tensorflow as tf
from tensorflow.keras.layers import *
from tensorflow.keras.models import *
import tensorflow.keras.backend as K
from tensorflow.python.keras.initializers import Zeros, glorot_normal
from tensorflow.python.keras.regularizers import l2

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, MinMaxScaler, StandardScaler, LabelEncoder

from utils import DenseFeat, SparseFeat, VarLenSparseFeat
import itertools

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


def build_input_layers(feature_columns):
    # 构建Input层字典，并以dense和sparse两类字典的形式返回
    dense_input_dict, sparse_input_dict = {}, {}

    for fc in feature_columns:
        if isinstance(fc, SparseFeat):
            sparse_input_dict[fc.name] = Input(shape=(1, ), name=fc.name)
        elif isinstance(fc, DenseFeat):
            dense_input_dict[fc.name] = Input(shape=(fc.dimension, ), name=fc.name)
        
    return dense_input_dict, sparse_input_dict


def build_embedding_layers(feature_columns, input_layers_dict, is_linear):
    # 定义一个embedding层对应的字典
    embedding_layers_dict = dict()
    
    # 将特征中的sparse特征筛选出来
    sparse_feature_columns = list(filter(lambda x: isinstance(x, SparseFeat), feature_columns)) if feature_columns else []
    
    # 如果是用于线性部分的embedding层，其维度为1，否则维度就是自己定义的embedding维度
    if is_linear:
        for fc in sparse_feature_columns:
            embedding_layers_dict[fc.name] = Embedding(fc.vocabulary_size, 1, name='1d_emb_' + fc.name)
    else:
        for fc in sparse_feature_columns:
            embedding_layers_dict[fc.name] = Embedding(fc.vocabulary_size, fc.embedding_dim, name='kd_emb_' + fc.name)
    
    return embedding_layers_dict


def get_linear_logits(dense_input_dict, sparse_input_dict, sparse_feature_columns):
    # 将所有的dense特征的Input层，然后经过一个全连接层得到dense特征的logits
    concat_dense_inputs = Concatenate(axis=1)(list(dense_input_dict.values()))
    dense_logits_output = Dense(1)(concat_dense_inputs)
    
    # 获取linear部分sparse特征的embedding层，这里使用embedding的原因是：
    # 对于linear部分直接将特征进行onehot然后通过一个全连接层，当维度特别大的时候，计算比较慢
    # 使用embedding层的好处就是可以通过查表的方式获取到哪些非零的元素对应的权重，然后在将这些权重相加，效率比较高
    linear_embedding_layers = build_embedding_layers(sparse_feature_columns, sparse_input_dict, is_linear=True)
    
    # 将一维的embedding拼接，注意这里需要使用一个Flatten层，使维度对应
    sparse_1d_embed = []
    for fc in sparse_feature_columns:
        feat_input = sparse_input_dict[fc.name]
        embed = Flatten()(linear_embedding_layers[fc.name](feat_input))
        sparse_1d_embed.append(embed)

    # embedding中查询得到的权重就是对应onehot向量中一个位置的权重，所以后面不用再接一个全连接了，本身一维的embedding就相当于全连接
    # 只不过是这里的输入特征只有0和1，所以直接向非零元素对应的权重相加就等同于进行了全连接操作(非零元素部分乘的是1)
    sparse_logits_output = Add()(sparse_1d_embed)

    # 最终将dense特征和sparse特征对应的logits相加，得到最终linear的logits
    linear_part = Add()([dense_logits_output, sparse_logits_output])
    return linear_part


class AFM_Layer(Layer):
    def __init__(self, att_dims=8):
        super(AFM_Layer, self).__init__()
        self.att_dims = att_dims

    def build(self, input_shape):
        embed_dims = input_shape[0][-1]

        self.att_W = self.add_weight(name='W', 
                                    shape=(embed_dims, self.att_dims), 
                                    initializer='glorot_normal',
                                    regularizer='l2',
                                    trainable=True)

        self.att_b = self.add_weight(name='b', 
                                    shape=(self.att_dims, ), 
                                    initializer='zeros',
                                    trainable=True)

        self.project_h = self.add_weight(name='h', 
                                    shape=(self.att_dims, 1), 
                                    initializer='glorot_normal',
                                    regularizer='l2',
                                    trainable=True)

        self.project_p = self.add_weight(name='p', 
                                    shape=(embed_dims, 1), 
                                    initializer='glorot_normal',
                                    regularizer='l2',
                                    trainable=True)


    def call(self, inputs):
        # inputs: 是一个列表，长度为n,列表中的每个元素是一个Bx1xk的向量
        rows = []
        cols = []

        # 将inputs中的所有向量进行两两组合
        for r, c in itertools.combinations(inputs, 2): # r / c => B x 1 x k
            rows.append(r)
            cols.append(c)

        # 将列表转换成tensor
        p = tf.concat(rows, axis=1) # B x (n(n-1)/2) x k
        q = tf.concat(cols, axis=1) # B x (n(n-1)/2) x k

        # 计算两两向量之间对应元素的乘积
        element_wise_product = p * q  # B x (n(n-1)/2) x k
 
        # 计算attention值, 根据公式进行计算
        att_temp = tf.nn.relu(tf.matmul(element_wise_product, self.att_W) + self.att_b) # B x (n(n-1)/2) x att_dims
        att_temp = tf.matmul(att_temp, self.project_h) # B x (n(n-1)/2) x 1
        att_temp = tf.nn.softmax(att_temp, axis=2) # B x (n(n-1)/2) x 1
        
        att_out = tf.reduce_sum(att_temp * element_wise_product, axis=1) # B x k
        att_logits = tf.matmul(att_out, self.project_p) # B x 1

        return att_logits

    def compute_output_shape(self, input_shape):
        return (None, 1) # 返回的是logits值


def get_attention_logits(sparse_input_dict, sparse_feature_columns, dnn_embedding_layers):
    # 只考虑sparse的二阶交叉，将所有的embedding拼接到一起
    # 这里在实际运行的时候，其实只会将那些非零元素对应的embedding拼接到一起
    # 并且将非零元素对应的embedding拼接到一起本质上相当于已经乘了x, 因为x中的值是1(公式中的x)
    sparse_kd_embed = []
    for fc in sparse_feature_columns:
        feat_input = sparse_input_dict[fc.name]
        _embed = dnn_embedding_layers[fc.name](feat_input) # B x 1 x k
        sparse_kd_embed.append(_embed)

    # 输入AFM_Layer中的是一个列表，方便计算两两向量之间的对应元素的乘积
    att_logits = AFM_Layer()(sparse_kd_embed)    

    return att_logits


def AFM(linear_feature_columns, dnn_feature_columns):
    # 构建输入层，即所有特征对应的Input()层，这里使用字典的形式返回，方便后续构建模型
    dense_input_dict, sparse_input_dict = build_input_layers(linear_feature_columns + dnn_feature_columns)

    # 将linear部分的特征中sparse特征筛选出来，后面用来做1维的embedding
    linear_sparse_feature_columns = list(filter(lambda x: isinstance(x, SparseFeat), linear_feature_columns))

    # 构建模型的输入层，模型的输入层不能是字典的形式，应该将字典的形式转换成列表的形式
    # 注意：这里实际的输入与Input()层的对应，是通过模型输入时候的字典数据的key与对应name的Input层
    input_layers = list(dense_input_dict.values()) + list(sparse_input_dict.values())

    # linear_logits由两部分组成，分别是dense特征的logits和sparse特征的logits
    linear_logits = get_linear_logits(dense_input_dict, sparse_input_dict, linear_sparse_feature_columns)

    # 构建维度为k的embedding层，这里使用字典的形式返回，方便后面搭建模型
    # embedding层用户构建FM交叉部分和DNN的输入部分
    embedding_layers = build_embedding_layers(dnn_feature_columns, sparse_input_dict, is_linear=False)

    # 将输入到dnn中的sparse特征筛选出来
    att_sparse_feature_columns = list(filter(lambda x: isinstance(x, SparseFeat), dnn_feature_columns))

    att_logits = get_attention_logits(sparse_input_dict, att_sparse_feature_columns, embedding_layers) # B x (n(n-1)/2)
    
    # 将linear,dnn的logits相加作为最终的logits
    output_logits = Add()([linear_logits, att_logits])

    # 这里的激活函数使用sigmoid
    output_layers = Activation("sigmoid")(output_logits)
    
    model = Model(input_layers, output_layers)
    return model


if __name__ == "__main__":
    # 读取数据
    data = pd.read_csv('./data/criteo_sample.txt')

    # 划分dense和sparse特征
    columns = data.columns.values
    dense_features = [feat for feat in columns if 'I' in feat]
    sparse_features = [feat for feat in columns if 'C' in feat]

    # 简单的数据预处理
    train_data = data_process(data, dense_features, sparse_features)
    train_data['label'] = data['label']

    # 将特征分组，分成linear部分和dnn部分(根据实际场景进行选择)，并将分组之后的特征做标记（使用DenseFeat, SparseFeat）
    linear_feature_columns = [SparseFeat(feat, vocabulary_size=data[feat].nunique(),embedding_dim=4)
                            for feat in sparse_features] + [DenseFeat(feat, 1,)
                            for feat in dense_features]

    dnn_feature_columns = [SparseFeat(feat, vocabulary_size=data[feat].nunique(),embedding_dim=4)
                            for feat in sparse_features] + [DenseFeat(feat, 1,)
                            for feat in dense_features]

    # 构建AFM模型
    history = AFM(linear_feature_columns, dnn_feature_columns)
    history.summary()
    history.compile(optimizer="adam", 
                loss="binary_crossentropy", 
                metrics=["binary_crossentropy", tf.keras.metrics.AUC(name='auc')])

    # 将输入数据转化成字典的形式输入
    train_model_input = {name: data[name] for name in dense_features + sparse_features}
    # 模型训练
    history.fit(train_model_input, train_data['label'].values,
            batch_size=64, epochs=5, validation_split=0.2, )