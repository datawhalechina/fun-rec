#!/usr/bin/env python
# -*- coding:utf-8 -*-
# @File  : create_ctr_data.py
# @Author: xLyons
# @IDE   : PyCharm
# @Time  : 2022/2/7

import pickle
import numpy as np
import pandas as pd
from sklearn.utils import shuffle

from model_tools.feature_columns import SparseFeat, DenseFeat


def create_ctr_data(data_path, args, use_dict=True):
    with open(data_path + 'data.pkl', 'rb') as f:
        all_data, feature_info = pickle.load(f)
        f.close()

    # 训练数据和测试数据
    all_data = shuffle(all_data)
    train_df = all_data[all_data['是否点击'] != -1]
    test_df = all_data[all_data['是否点击'] == -1]
    # 测试数据的标签
    test_labels = pd.read_pickle(data_path + 'test_label.pkl')
    test_labels = pd.merge(test_df[['index']], test_labels, how='left', on=['index'])

    all_features = feature_info['dense_features'] + feature_info['sparse_features']
    if use_dict:
        train_inputs = {name: np.array(train_df[name].tolist()) for name in all_features}
        train_labels = train_df['是否点击'].values
        test_inputs = {name: np.array(test_df[name].tolist()) for name in all_features}
        test_labels = test_labels['是否点击'].values
    else:
        train_inputs = [np.array(train_df[name]) for name in all_features]
        train_labels = train_df['是否点击'].values
        test_inputs = [np.array(test_df[name]) for name in all_features]
        test_labels = test_labels['是否点击'].values

    features_columns = [DenseFeat(name=feat,
                                  dimension=1,
                                  dtype='float32',)
                        for feat in feature_info['dense_features']]

    features_columns += [SparseFeat(name=feat,
                                    embed_name=feat,
                                    embed_dim=args.embed_dim,
                                    vocab_size=all_data[feat].max()+1,
                                    dtype='int32',)
                         for feat in feature_info['sparse_features']]

    return (train_inputs, train_labels), (test_inputs, test_labels), features_columns
