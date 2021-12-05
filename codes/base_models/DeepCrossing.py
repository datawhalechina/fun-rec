import warnings
warnings.filterwarnings("ignore")
import itertools
import pandas as pd
import numpy as np
from tqdm import tqdm
from collections import namedtuple

import tensorflow as tf
from tensorflow import keras 
from tensorflow.keras.layers import *
from tensorflow.keras.models import *

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import  MinMaxScaler, LabelEncoder

from utils import SparseFeat, DenseFeat, VarLenSparseFeat


def data_process(data_df, dense_features, sparse_features):
    """
    简单处理特征，包括填充缺失值，数值处理，类别编码
    param data_df: DataFrame格式的数据
    param dense_features: 数值特征名称列表
    param sparse_features: 类别特征名称列表
    """
    data_df[dense_features] = data_df[dense_features].fillna(0.0)
    for f in dense_features:
        data_df[f] = data_df[f].apply(lambda x: np.log(x+1) if x > -1 else -1)
        
    data_df[sparse_features] = data_df[sparse_features].fillna("-1")
    for f in sparse_features:
        lbe = LabelEncoder()
        data_df[f] = lbe.fit_transform(data_df[f])
    
    return data_df[dense_features + sparse_features]


def build_input_layers(feature_columns):
    """
    构建输入层
    param feature_columns: 数据集中的所有特征对应的特征标记之
    """
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
            embedding_layers_dict[fc.name] = Embedding(fc.vocabulary_size + 1, 1, name='1d_emb_' + fc.name)
    else:
        for fc in sparse_feature_columns:
            embedding_layers_dict[fc.name] = Embedding(fc.vocabulary_size + 1, fc.embedding_dim, name='kd_emb_' + fc.name)
    
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


# DNN残差块的定义
class ResidualBlock(Layer):
    def __init__(self, units): # units表示的是DNN隐藏层神经元数量
        super(ResidualBlock, self).__init__()
        self.units = units

    def build(self, input_shape):
        out_dim = input_shape[-1]
        self.dnn1 = Dense(self.units, activation='relu')
        self.dnn2 = Dense(out_dim, activation='relu') # 保证输入的维度和输出的维度一致才能进行残差连接
    def call(self, inputs):
        x = inputs
        x = self.dnn1(x)
        x = self.dnn2(x)
        x = Activation('relu')(x + inputs) # 残差操作
        return x


# block_nums表示DNN残差块的数量
def get_dnn_logits(dnn_inputs, block_nums=3):
    dnn_out = dnn_inputs
    for i in range(block_nums):
        dnn_out = ResidualBlock(64)(dnn_out)
    
    # 将dnn的输出转化成logits
    dnn_logits = Dense(1, activation='sigmoid')(dnn_out)

    return dnn_logits


def DeepCrossing(dnn_feature_columns):
    # 构建输入层，即所有特征对应的Input()层，这里使用字典的形式返回，方便后续构建模型
    dense_input_dict, sparse_input_dict = build_input_layers(dnn_feature_columns)
    # 构建模型的输入层，模型的输入层不能是字典的形式，应该将字典的形式转换成列表的形式
    # 注意：这里实际的输入与Input()层的对应，是通过模型输入时候的字典数据的key与对应name的Input层
    input_layers = list(dense_input_dict.values()) + list(sparse_input_dict.values())
    
    # 构建维度为k的embedding层，这里使用字典的形式返回，方便后面搭建模型
    embedding_layer_dict = build_embedding_layers(dnn_feature_columns, sparse_input_dict, is_linear=False)

    #将所有的dense特征拼接到一起
    dense_dnn_list = list(dense_input_dict.values())
    dense_dnn_inputs = Concatenate(axis=1)(dense_dnn_list) # B x n (n表示数值特征的数量)

    # 因为需要将其与dense特征拼接到一起所以需要Flatten，不进行Flatten的Embedding层输出的维度为：Bx1xdim
    sparse_dnn_list = concat_embedding_list(dnn_feature_columns, sparse_input_dict, embedding_layer_dict, flatten=True) 

    sparse_dnn_inputs = Concatenate(axis=1)(sparse_dnn_list) # B x m*dim (n表示类别特征的数量，dim表示embedding的维度)

    # 将dense特征和Sparse特征拼接到一起
    dnn_inputs = Concatenate(axis=1)([dense_dnn_inputs, sparse_dnn_inputs]) # B x (n + m*dim)

    # 输入到dnn中，需要提前定义需要几个残差块
    output_layer = get_dnn_logits(dnn_inputs, block_nums=3)

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

    # 将特征做标记
    dnn_feature_columns = [SparseFeat(feat, vocabulary_size=data[feat].nunique(),embedding_dim=4)
                            for feat in sparse_features] + [DenseFeat(feat, 1,)
                            for feat in dense_features]

    # 构建DeepCrossing模型
    history = DeepCrossing(dnn_feature_columns)

    history.summary()
    history.compile(optimizer="adam", 
                loss="binary_crossentropy", 
                metrics=["binary_crossentropy", tf.keras.metrics.AUC(name='auc')])

    # 将输入数据转化成字典的形式输入
    train_model_input = {name: data[name] for name in dense_features + sparse_features}
    # 模型训练
    history.fit(train_model_input, train_data['label'].values,
            batch_size=64, epochs=5, validation_split=0.2, )