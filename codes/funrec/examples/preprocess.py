from random import sample, seed
import sys
sys.path.append("..")
import os 
import time 
import numpy as np
import pandas as pd 
from datetime import date, datetime
from sklearn.preprocessing import LabelEncoder
from features import DenseFeat, SparseFeat, VarLenSparseFeat


def process_data(sample_num=5000000):
    train_data_path = "./data/train"
    print("read train data ...")
    train_data_df = pd.read_csv(train_data_path, sep=',', nrows=sample_num)

    all_df = train_data_df
    all_df['hour'] = all_df['hour'].astype(str)

    # 构造时间相关的特征
    def _convert_weekday(timestamp):
        dt = date(int('20' + timestamp[0:2]), int(timestamp[2:4]), int(timestamp[4:6]))
        return int(dt.strftime('%w'))

    def _convert_weekend(timestamp):
        dt = date(int('20' + timestamp[0:2]), int(timestamp[2:4]), int(timestamp[4:6]))
        return 1 if dt.strftime('%w') in ['6', '0'] else 0

    """
    is_weekend: 是否是周末
    weekday: 星期几
    hour: 几点
    """
    all_df['is_weekend'] = all_df['hour'].apply(lambda x: _convert_weekend(x))
    all_df['weekday'] = all_df['hour'].apply(lambda x: _convert_weekday(x))
    all_df['hour_v2'] = all_df['hour'].apply(lambda x: int(x[6:8]))
    del all_df['hour']

    sparse_features = ['id', 'C1', 'banner_pos', 'site_id', 'site_domain',
        'site_category', 'app_id', 'app_domain', 'app_category', 'device_id',
        'device_ip', 'device_model', 'device_type', 'device_conn_type', 'C14',
        'C15', 'C16', 'C17', 'C18', 'C19', 'C20', 'C21', 'is_weekend',
        'weekday', 'hour_v2']

    print("start label encode ... ")
    feature_max_index_dict = {}
    for feat in sparse_features:
        lbe = LabelEncoder()
        all_df[feat] = lbe.fit_transform(all_df[feat]) + 1 # 让id从1开始，0可能会被做掩码
        feature_max_index_dict[feat] = all_df[feat].max() + 1 
    
    train_df = all_df
    feature_names = train_df.columns
    train_input_dict = {}
    for name in feature_names:
        train_input_dict[name] = np.array(train_df[name].values) 

    train_label = np.array(train_df['click'])
    train_df.pop('click')
    return feature_max_index_dict, train_input_dict, train_label
