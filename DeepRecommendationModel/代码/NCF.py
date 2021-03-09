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


def build_input_layers(feature_columns):
    # 构建Input层字典，并以dense和sparse两类字典的形式返回
    dense_input_dict, sparse_input_dict = {}, {}

    for fc in feature_columns:
        if isinstance(fc, SparseFeat):
            sparse_input_dict[fc.name] = Input(shape=(1, ), name=fc.name)
        elif isinstance(fc, DenseFeat):
            dense_input_dict[fc.name] = Input(shape=(fc.dimension, ), name=fc.name)
        
    return dense_input_dict, sparse_input_dict


def build_embedding_layers(feature_columns, input_layers_dict, is_linear, prefix=''):
    # 定义一个embedding层对应的字典
    embedding_layers_dict = dict()
    
    # 将特征中的sparse特征筛选出来
    sparse_feature_columns = list(filter(lambda x: isinstance(x, SparseFeat), feature_columns)) if feature_columns else []
    
    # 如果是用于线性部分的embedding层，其维度为1，否则维度就是自己定义的embedding维度
    if is_linear:
        for fc in sparse_feature_columns:
            embedding_layers_dict[fc.name] = Embedding(fc.vocabulary_size + 1, 1, name=prefix + '1d_emb_' + fc.name)
    else:
        for fc in sparse_feature_columns:
            embedding_layers_dict[fc.name] = Embedding(fc.vocabulary_size + 1, fc.embedding_dim, name=prefix + 'kd_emb_' + fc.name)
    
    return embedding_layers_dict


def get_dnn_out(dnn_inputs, units=(32, 16)):

    dnn_out = dnn_inputs
    for out_dim in units:
        dnn_out = Dense(out_dim)(dnn_out)

    return dnn_out


def NCF(dnn_feature_columns):
    # 构建输入层，即所有特征对应的Input()层，这里使用字典的形式返回，方便后续构建模型
    _, sparse_input_dict = build_input_layers(dnn_feature_columns) # 没有dense特征

    # 构建模型的输入层，模型的输入层不能是字典的形式，应该将字典的形式转换成列表的形式
    # 注意：这里实际的输入与Input()层的对应，是通过模型输入时候的字典数据的key与对应name的Input层
    input_layers = list(sparse_input_dict.values())
    
    # 创建两份embedding向量, 由于Embedding层的name不能相同，所以这里加入一个prefix参数
    GML_embedding_dict = build_embedding_layers(dnn_feature_columns, sparse_input_dict, is_linear=False, prefix='GML')
    MLP_embedding_dict = build_embedding_layers(dnn_feature_columns, sparse_input_dict, is_linear=False, prefix='MLP')

    # 构建GML的输出
    GML_user_emb = Flatten()(GML_embedding_dict['user_id'](sparse_input_dict['user_id'])) # B x embed_dim
    GML_item_emb = Flatten()(GML_embedding_dict['movie_id'](sparse_input_dict['movie_id'])) # B x embed_dim
    GML_out = tf.multiply(GML_user_emb, GML_item_emb) # 按元素相乘 

    # 构建MLP的输出
    MLP_user_emb = Flatten()(MLP_embedding_dict['user_id'](sparse_input_dict['user_id'])) # B x embed_dim
    MLP_item_emb = Flatten()(MLP_embedding_dict['movie_id'](sparse_input_dict['movie_id'])) # B x embed_dim
    MLP_dnn_input = Concatenate(axis=1)([MLP_user_emb, MLP_item_emb]) # 两个向量concat
    MLP_dnn_out = get_dnn_out(MLP_dnn_input, (32, 16))

    # 将dense特征和Sparse特征拼接到一起
    concat_out = Concatenate(axis=1)([GML_out, MLP_dnn_out]) 

    # 输入到dnn中，需要提前定义需要几个残差块
    # output_layer = Dense(1, 'sigmoid')(concat_out)
    output_layer = Dense(1)(concat_out)
    
    model = Model(input_layers, output_layer)
    return model


if __name__ == "__main__":
    # 读取数据，NCF使用的特征只有user_id和item_id
    rnames = ['user_id','movie_id','rating','timestamp']
    data = pd.read_csv('./data/ml-1m/ratings.dat', sep='::', engine='python', names=rnames)

    lbe = LabelEncoder()
    data['user_id'] = lbe.fit_transform(data['user_id'])
    data['movie_id'] = lbe.fit_transform(data['movie_id']) 

    train_data = data[['user_id', 'movie_id']]
    train_data['label'] = data['rating']

    dnn_feature_columns = [SparseFeat('user_id', train_data['user_id'].nunique(), 8),
                           SparseFeat('movie_id', train_data['movie_id'].nunique(), 8)]

    # 构建FM模型
    history = NCF(dnn_feature_columns)
    history.summary()
    # 因为数据目前只有用户点击的数据，没有用户未点击的movie，所以这里不能用于做ctr预估
    # 如果需要做ctr预估需要给用户点击和未点击的movie打标签，这里就先预测用户评分
    history.compile(optimizer="adam", loss="mse", metrics=['mae'])

    # 将输入数据转化成字典的形式输入
    # 将数据转换成字典的形式，用于Input()层对应
    train_model_input = {name: train_data[name] for name in ['user_id', 'movie_id', 'label']}
    
    # 模型训练
    history.fit(train_model_input, train_data['label'].values,
            batch_size=32, epochs=2, validation_split=0.2, )