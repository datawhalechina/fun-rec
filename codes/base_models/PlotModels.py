from collections import namedtuple
from tensorflow import keras 
import pandas as pd 
import numpy as np 
from sklearn.preprocessing import LabelEncoder

from DeepCrossing import DeepCrossing
from DeepFM import DeepFM
from NFM import NFM
from WideNDeep import WideNDeep
from DIN import DIN
from NCF import NCF
from AFM import AFM
from DCN import DCN
from PNN import PNN
from DIEN import DIEN

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


# 读取criteo数据
def read_criteo_data():
    # 读取数据
    data = pd.read_csv('./data/criteo_sample.txt')

    # 划分dense和sparse特征
    columns = data.columns.values
    dense_features = [feat for feat in columns if 'I' in feat]
    sparse_features = [feat for feat in columns if 'C' in feat]

    return data, dense_features, sparse_features


def plot_deepcrossing():
    data, dense_features, sparse_features = read_criteo_data()
    dense_features = dense_features[:3]
    sparse_features = sparse_features[:3]

    # 将特征分组，分成linear部分和dnn部分(根据实际场景进行选择)，并将分组之后的特征做标记（使用DenseFeat, SparseFeat）
    dnn_feature_columns = [SparseFeat(feat, vocabulary_size=data[feat].nunique(),embedding_dim=4)
                            for feat in sparse_features] + [DenseFeat(feat, 1,)
                            for feat in dense_features]

    # 构建DeepCrossing模型
    history = DeepCrossing(dnn_feature_columns)
    keras.utils.plot_model(history, to_file="./imgs/DeepCrossing.png", show_shapes=True)


def plot_deepfm():
    # 读取数据
    data, dense_features, sparse_features = read_criteo_data()
    dense_features = dense_features[:3]
    sparse_features = sparse_features[:2]

    # 将特征分组，分成linear部分和dnn部分(根据实际场景进行选择)，并将分组之后的特征做标记（使用DenseFeat, SparseFeat）
    linear_feature_columns = [SparseFeat(feat, vocabulary_size=data[feat].nunique(),embedding_dim=4)
                            for feat in sparse_features] + [DenseFeat(feat, 1,)
                            for feat in dense_features]

    dnn_feature_columns = [SparseFeat(feat, vocabulary_size=data[feat].nunique(),embedding_dim=4)
                            for feat in sparse_features] + [DenseFeat(feat, 1,)
                            for feat in dense_features]

    # 构建DeepFM模型
    history = DeepFM(linear_feature_columns, dnn_feature_columns)
    keras.utils.plot_model(history, to_file="./imgs/DeepFM.png", show_shapes=True)


def plot_nfm():
    # 读取数据
    data, dense_features, sparse_features = read_criteo_data()
    dense_features = dense_features[:3]
    sparse_features = sparse_features[:2]

    # 将特征分组，分成linear部分和dnn部分(根据实际场景进行选择)，并将分组之后的特征做标记（使用DenseFeat, SparseFeat）
    linear_feature_columns = [SparseFeat(feat, vocabulary_size=data[feat].nunique(),embedding_dim=4)
                            for i,feat in enumerate(sparse_features)] + [DenseFeat(feat, 1,)
                            for feat in dense_features]

    dnn_feature_columns = [SparseFeat(feat, vocabulary_size=data[feat].nunique(),embedding_dim=4)
                            for i,feat in enumerate(sparse_features)] + [DenseFeat(feat, 1,)
                            for feat in dense_features]

    # 构建NFM模型
    history = NFM(linear_feature_columns, dnn_feature_columns)
    keras.utils.plot_model(history, to_file="./imgs/NFM.png", show_shapes=True)


def plot_widendeep():
    # 读取数据
    data, dense_features, sparse_features = read_criteo_data()
    dense_features = dense_features[:3]
    sparse_features = sparse_features[:2]

    # 将特征分组，分成linear部分和dnn部分(根据实际场景进行选择)，并将分组之后的特征做标记（使用DenseFeat, SparseFeat）
    linear_feature_columns = [SparseFeat(feat, vocabulary_size=data[feat].nunique(),embedding_dim=4)
                            for i,feat in enumerate(sparse_features)] + [DenseFeat(feat, 1,)
                            for feat in dense_features]

    dnn_feature_columns = [SparseFeat(feat, vocabulary_size=data[feat].nunique(),embedding_dim=4)
                            for i,feat in enumerate(sparse_features)] + [DenseFeat(feat, 1,)
                            for feat in dense_features]

    # 构建WideNDeep模型
    history = WideNDeep(linear_feature_columns, dnn_feature_columns)
    keras.utils.plot_model(history, to_file="./imgs/Wide&Deep.png", show_shapes=True)


def plot_din():
    # 读取数据
    samples_data = pd.read_csv("./data/movie_sample.txt", sep="\t", header = None)
    samples_data.columns = ["user_id", "gender", "age", "hist_movie_id", "hist_len", "movie_id", "movie_type_id", "label"]

    feature_columns = [SparseFeat('user_id', max(samples_data["user_id"])+1, embedding_dim=8), 
                        SparseFeat('gender', max(samples_data["gender"])+1, embedding_dim=8), 
                        SparseFeat('age', max(samples_data["age"])+1, embedding_dim=8), 
                        SparseFeat('movie_id', max(samples_data["movie_id"])+1, embedding_dim=8),
                        SparseFeat('movie_type_id', max(samples_data["movie_type_id"])+1, embedding_dim=8),
                        DenseFeat('hist_len', 1)]

    feature_columns += [VarLenSparseFeat('hist_movie_id', vocabulary_size=max(samples_data["movie_id"])+1, embedding_dim=8, maxlen=50)]

    # 行为特征列表，表示的是基础特征
    behavior_feature_list = ['movie_id']
    # 行为序列特征
    behavior_seq_feature_list = ['hist_movie_id']

    history = DIN(feature_columns, behavior_feature_list, behavior_seq_feature_list)
    keras.utils.plot_model(history, to_file="./imgs/DIN.png", show_shapes=True)


def plot_pnn():
    data, dense_features, sparse_features = read_criteo_data()
    dense_features = dense_features[:3]
    sparse_features = sparse_features[:3]

    # 将特征分组，分成linear部分和dnn部分(根据实际场景进行选择)，并将分组之后的特征做标记（使用DenseFeat, SparseFeat）
    dnn_feature_columns = [SparseFeat(feat, vocabulary_size=data[feat].nunique(),embedding_dim=4)
                            for feat in sparse_features] + [DenseFeat(feat, 1,)
                            for feat in dense_features]

    # 构建DeepCrossing模型
    history = PNN(dnn_feature_columns)
    keras.utils.plot_model(history, to_file="./imgs/PNN.png", show_shapes=True)


def plot_ncf():
    # 读取数据，NCF使用的特征只有user_id和item_id
    rnames = ['user_id','movie_id','rating','timestamp']
    data = pd.read_csv('./data/ml-1m/ratings.dat', sep='::', engine='python', names=rnames)

    lbe = LabelEncoder()
    data['user_id'] = lbe.fit_transform(data['user_id'])
    data['movie_id'] = lbe.fit_transform(data['movie_id']) 

    dnn_feature_columns = [SparseFeat('user_id', data['user_id'].nunique(), 8),
                           SparseFeat('movie_id', data['movie_id'].nunique(), 8)]

    # 构建FM模型
    history = NCF(dnn_feature_columns)
    keras.utils.plot_model(history, to_file="./imgs/NCF.png", show_shapes=True)


def plot_dcn():
    # 读取数据
    data, dense_features, sparse_features = read_criteo_data()
    dense_features = dense_features[:3]
    sparse_features = sparse_features[:2]

    # 将特征分组，分成linear部分和dnn部分(根据实际场景进行选择)，并将分组之后的特征做标记（使用DenseFeat, SparseFeat）
    linear_feature_columns = [SparseFeat(feat, vocabulary_size=data[feat].nunique(),embedding_dim=4)
                            for i,feat in enumerate(sparse_features)] + [DenseFeat(feat, 1,)
                            for feat in dense_features]

    dnn_feature_columns = [SparseFeat(feat, vocabulary_size=data[feat].nunique(),embedding_dim=4)
                            for i,feat in enumerate(sparse_features)] + [DenseFeat(feat, 1,)
                            for feat in dense_features]

    # 构建AFM模型
    history = DCN(linear_feature_columns, dnn_feature_columns)
    keras.utils.plot_model(history, to_file="./imgs/DCN.png", show_shapes=True)


def plot_afm():
    # 读取数据
    data, dense_features, sparse_features = read_criteo_data()
    dense_features = dense_features[:3]
    sparse_features = sparse_features[:2]

    # 将特征分组，分成linear部分和dnn部分(根据实际场景进行选择)，并将分组之后的特征做标记（使用DenseFeat, SparseFeat）
    linear_feature_columns = [SparseFeat(feat, vocabulary_size=data[feat].nunique(),embedding_dim=4)
                            for i,feat in enumerate(sparse_features)] + [DenseFeat(feat, 1,)
                            for feat in dense_features]

    dnn_feature_columns = [SparseFeat(feat, vocabulary_size=data[feat].nunique(),embedding_dim=4)
                            for i,feat in enumerate(sparse_features)] + [DenseFeat(feat, 1,)
                            for feat in dense_features]

    # 构建AFM模型
    history = AFM(linear_feature_columns, dnn_feature_columns)
    keras.utils.plot_model(history, to_file="./imgs/AFM.png", show_shapes=True)


def plot_dien():
    """读取数据"""
    samples_data = pd.read_csv("data/movie_sample.txt", sep="\t", header = None)
    samples_data.columns = ["user_id", "gender", "age", "hist_movie_id", "hist_len", "movie_id", "movie_type_id", "label"]

    """数据集"""
    X = samples_data[["user_id", "gender", "age", "hist_movie_id", "hist_len", "movie_id", "movie_type_id"]]
    y = samples_data["label"]

    """特征封装"""
    feature_columns = [SparseFeat('user_id', max(samples_data["user_id"])+1, embedding_dim=8), 
                        SparseFeat('gender', max(samples_data["gender"])+1, embedding_dim=8), 
                        SparseFeat('age', max(samples_data["age"])+1, embedding_dim=8), 
                        SparseFeat('movie_id', max(samples_data["movie_id"])+1, embedding_dim=8),
                        SparseFeat('movie_type_id', max(samples_data["movie_type_id"])+1, embedding_dim=8),
                        DenseFeat('hist_len', 1)]

    feature_columns += [VarLenSparseFeat('hist_movie_id', vocabulary_size=max(samples_data["movie_id"])+1, embedding_dim=8, maxlen=50)]
    feature_columns += [VarLenSparseFeat('neg_hist_movie_id', vocabulary_size=max(samples_data["movie_id"])+1, embedding_dim=8, maxlen=50)]

    # 行为特征列表，表示的是基础特征
    behavior_feature_list = ['movie_id']
    # 行为序列特征
    behavior_seq_feature_list = ['hist_movie_id']
    # 负采样序列特征
    neg_seq_feature_list = ['neg_hist_movie_id']

    """构建DIN模型"""
    history = DIEN(feature_columns, behavior_feature_list, behavior_seq_feature_list, neg_seq_feature_list, use_neg_sample=True)
    
    keras.utils.plot_model(history, to_file="./imgs/DIEN.png", show_shapes=True)

 
if __name__ == '__main__':
    # plot_deepcrossing()
    # plot_deepfm()
    # plot_nfm()
    # plot_widendeep()
    # plot_din()
    # plot_ncf()
    # plot_afm()
    # plot_dcn()
    # plot_pnn()
    plot_dien()

