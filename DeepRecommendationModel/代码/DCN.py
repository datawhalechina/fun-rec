import warnings
warnings.filterwarnings("ignore")
import itertools
import pandas as pd
import numpy as np
from tqdm import tqdm
from collections import namedtuple

import tensorflow as tf
from tensorflow.keras.layers import *
from tensorflow.keras.models import *

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import  MinMaxScaler, LabelEncoder

from utils import SparseFeat, DenseFeat, VarLenSparseFeat

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


def get_dnn_output(dnn_input):

    # dnn层，这里的Dropout参数，Dense中的参数都可以自己设定
    fc_layer = Dropout(0.5)(Dense(1024, activation='relu')(dnn_input))  
    fc_layer = Dropout(0.3)(Dense(512, activation='relu')(fc_layer))
    dnn_out = Dropout(0.1)(Dense(256, activation='relu')(fc_layer))

    return dnn_out


class CrossNet(Layer):
    def __init__(self, layer_nums=3):
        super(CrossNet, self).__init__()
        self.layer_nums = layer_nums

    def build(self, input_shape):
        # 计算w的维度，w的维度与输入数据的最后一个维度相同
        self.dim = int(input_shape[-1])

        # 注意，在DCN中W不是一个矩阵而是一个向量，这里根据残差的层数定义一个权重列表
        self.W = [self.add_weight(name='W_' + str(i), shape=(self.dim,)) for i in range(self.layer_nums)]
        self.b = [self.add_weight(name='b_' + str(i),shape=(self.dim,), initializer='zeros') for i in range(self.layer_nums)]

    def call(self, inputs):

        # 进行特征交叉时的x_0一直没有变，变的是x_l和每一层的权重
        x_0 = inputs # B x dims 
        x_l = x_0
        for i in range(self.layer_nums):
            # 将x_l的第一个维度与w[i]的第0个维度计算点积
            xl_w = tf.tensordot(x_l, self.W[i], axes=(1, 0)) # B, 
            xl_w = tf.expand_dims(xl_w, axis=-1) # 在最后一个维度上添加一个维度 # B x 1
            cross = tf.multiply(x_0, xl_w) # B x dims
            x_l = cross + self.b[i] + x_l
        
        return x_l


def DCN(linear_feature_columns, dnn_feature_columns):
    # 构建输入层，即所有特征对应的Input()层，这里使用字典的形式返回，方便后续构建模型
    dense_input_dict, sparse_input_dict = build_input_layers(linear_feature_columns + dnn_feature_columns)

    # 构建模型的输入层，模型的输入层不能是字典的形式，应该将字典的形式转换成列表的形式
    # 注意：这里实际的输入与Input()层的对应，是通过模型输入时候的字典数据的key与对应name的Input层
    input_layers = list(dense_input_dict.values()) + list(sparse_input_dict.values())

    # 构建维度为k的embedding层，这里使用字典的形式返回，方便后面搭建模型
    embedding_layer_dict = build_embedding_layers(dnn_feature_columns, sparse_input_dict, is_linear=False)

    concat_dense_inputs = Concatenate(axis=1)(list(dense_input_dict.values()))

    # 将特征中的sparse特征筛选出来
    sparse_feature_columns = list(filter(lambda x: isinstance(x, SparseFeat), linear_feature_columns)) if linear_feature_columns else []

    sparse_kd_embed = concat_embedding_list(sparse_feature_columns, sparse_input_dict, embedding_layer_dict, flatten=True)

    concat_sparse_kd_embed = Concatenate(axis=1)(sparse_kd_embed)   

    dnn_input = Concatenate(axis=1)([concat_dense_inputs, concat_sparse_kd_embed])

    dnn_output = get_dnn_output(dnn_input)
    
    cross_output = CrossNet()(dnn_input)

    # stack layer
    stack_output = Concatenate(axis=1)([dnn_output, cross_output])

    # 这里的激活函数使用sigmoid
    output_layer = Dense(1, activation='sigmoid')(stack_output)

    model = Model(input_layers, output_layer)
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
                            for i,feat in enumerate(sparse_features)] + [DenseFeat(feat, 1,)
                            for feat in dense_features]

    dnn_feature_columns = [SparseFeat(feat, vocabulary_size=data[feat].nunique(),embedding_dim=4)
                            for i,feat in enumerate(sparse_features)] + [DenseFeat(feat, 1,)
                            for feat in dense_features]

    # 构建DCN模型
    history = DCN(linear_feature_columns, dnn_feature_columns)
    history.summary()
    history.compile(optimizer="adam", 
                loss="binary_crossentropy", 
                metrics=["binary_crossentropy", tf.keras.metrics.AUC(name='auc')])

    # 将输入数据转化成字典的形式输入
    train_model_input = {name: data[name] for name in dense_features + sparse_features}
    # 模型训练
    history.fit(train_model_input, train_data['label'].values,
            batch_size=32, epochs=5, validation_split=0.2, )


