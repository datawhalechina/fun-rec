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


def get_dnn_logits(dnn_inputs, units=(64, 32)):

    dnn_out = dnn_inputs
    for out_dim in units:
        dnn_out = Dense(out_dim, activation='relu')(dnn_out)
    
    # 将dnn的输出转化成logits
    dnn_logits = Dense(1, activation='sigmoid')(dnn_out)

    return dnn_logits


class ProductLayer(Layer):
    def __init__(self, units, use_inner=True, use_outer=False):
        super(ProductLayer, self).__init__()
        self.use_inner = use_inner
        self.use_outer = use_outer
        self.units = units # 指的是原文中D1的大小

    def build(self, input_shape):
        # 需要注意input_shape也是一个列表，并且里面的每一个元素都是TensorShape类型，
        # 需要将其转换成list然后才能参与数值计算，不然类型容易错
        # input_shape[0] : feat_nums x embed_dims
        self.feat_nums = len(input_shape)
        self.embed_dims = input_shape[0].as_list()[-1]
        flatten_dims = self.feat_nums * self.embed_dims

        # Linear signals weight, 这部分是用于产生Z的权重，因为这里需要计算的是两个元素对应元素乘积然后再相加
        # 等价于先把矩阵拉成一维，然后相乘再相加
        self.linear_w = self.add_weight(name='linear_w', shape=(flatten_dims, self.units), initializer='glorot_normal')

        # inner product weight
        if self.use_inner:
            # 优化之后的内积权重是未优化时的一个分解矩阵，未优化时的矩阵大小为：D x N x N 
            # 优化后的内积权重大小为：D x N
            self.inner_w = self.add_weight(name='inner_w', shape=(self.units, self.feat_nums), initializer='glorot_normal')

        if self.use_outer:
            # 优化之后的外积权重大小为：D x embed_dim x embed_dim, 因为计算外积的时候在特征维度通过求和的方式进行了压缩
            self.outer_w = self.add_weight(name='outer_w', shape=(self.units, self.embed_dims, self.embed_dims), initializer='glorot_normal')
        

    def call(self, inputs):
        # inputs是一个列表
        # 先将所有的embedding拼接起来计算线性信号部分的输出
        concat_embed = Concatenate(axis=1)(inputs) # B x feat_nums x embed_dims
        # 将两个矩阵都拉成二维的，然后通过矩阵相乘得到最终的结果
        concat_embed_ = tf.reshape(concat_embed, shape=[-1, self.feat_nums * self.embed_dims])
        lz = tf.matmul(concat_embed_, self.linear_w) # B x units

        # inner
        lp_list = []
        if self.use_inner:
            for i in range(self.units):
                # 相当于给每一个特征向量都乘以一个权重
                # self.inner_w[i] : (embed_dims, ) 添加一个维度变成 (embed_dims, 1)
                delta = tf.multiply(concat_embed, tf.expand_dims(self.inner_w[i], axis=1)) # B x feat_nums x embed_dims
                # 在特征之间的维度上求和
                delta = tf.reduce_sum(delta, axis=1) # B x embed_dims
                # 最终在特征embedding维度上求二范数得到p
                lp_list.append(tf.reduce_sum(tf.square(delta), axis=1, keepdims=True)) # B x 1
            
        # outer
        if self.use_outer:
            # 外积的优化是将embedding矩阵，在特征间的维度上通过求和进行压缩
            feat_sum = tf.reduce_sum(concat_embed, axis=1) # B x embed_dims
            
            # 为了方便计算外积，将维度进行扩展
            f1 = tf.expand_dims(feat_sum, axis=2) # B x embed_dims x 1
            f2 = tf.expand_dims(feat_sum, axis=1) # B x 1 x embed_dims

            # 求外积, a * a^T
            product = tf.matmul(f1, f2) # B x embed_dims x embed_dims

            # 将product与外积权重矩阵对应元素相乘再相加
            for i in range(self.units):
                lpi = tf.multiply(product, self.outer_w[i]) # B x embed_dims x embed_dims
                # 将后面两个维度进行求和，需要注意的是，每使用一次reduce_sum就会减少一个维度
                lpi = tf.reduce_sum(lpi, axis=[1, 2]) # B
                # 添加一个维度便于特征拼接
                lpi = tf.expand_dims(lpi, axis=1) # B x 1
                lp_list.append(lpi)
            
        # 将所有交叉特征拼接到一起
        lp = Concatenate(axis=1)(lp_list)

        # 将lz和lp拼接到一起
        product_out =  Concatenate(axis=1)([lz, lp])
        
        return product_out


def PNN(dnn_feature_columns, inner=True, outer=True):
    # 构建输入层，即所有特征对应的Input()层，这里使用字典的形式返回，方便后续构建模型
    _, sparse_input_dict = build_input_layers(dnn_feature_columns)

    # 构建模型的输入层，模型的输入层不能是字典的形式，应该将字典的形式转换成列表的形式
    # 注意：这里实际的输入与Input()层的对应，是通过模型输入时候的字典数据的key与对应name的Input层
    input_layers = list(sparse_input_dict.values())
    
    # 构建维度为k的embedding层，这里使用字典的形式返回，方便后面搭建模型
    embedding_layer_dict = build_embedding_layers(dnn_feature_columns, sparse_input_dict, is_linear=False)

    sparse_embed_list = concat_embedding_list(dnn_feature_columns, sparse_input_dict, embedding_layer_dict, flatten=False)

    dnn_inputs = ProductLayer(units=32, use_inner=True, use_outer=True)(sparse_embed_list)
    
    # 输入到dnn中，需要提前定义需要几个残差块
    output_layer = get_dnn_logits(dnn_inputs)

    model = Model(input_layers, output_layer)
    return model


# 实现PNN的时候一定要明确是实现优化前的还是优化后的，因为网上有的参考代码是优化前的，有的是优化后的，容易搞混了
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

    # 只传入类别特征, 如果想要传入dense特征，也可以传入直接进行拼接
    dnn_feature_columns = [SparseFeat(feat, vocabulary_size=data[feat].nunique(),embedding_dim=4)
                            for i,feat in enumerate(sparse_features)]

    # 构建FM模型
    history = PNN(dnn_feature_columns)
    history.summary()
    history.compile(optimizer="adam", 
                loss="binary_crossentropy", 
                metrics=["binary_crossentropy", tf.keras.metrics.AUC(name='auc')])

    # 将输入数据转化成字典的形式输入
    train_model_input = {name: data[name] for name in dense_features + sparse_features}
    # 模型训练
    history.fit(train_model_input, train_data['label'].values,
            batch_size=64, epochs=5, validation_split=0.2, )
