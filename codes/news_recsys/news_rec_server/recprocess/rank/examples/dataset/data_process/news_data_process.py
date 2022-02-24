#!/usrbin/env python
# -*- coding:utf-8 -*-
# @File  : news_data_process.py
# @Author: xLyons
# @IDE   : PyCharm
# @Time  : 2022/2/7

import os
import gc
import swifter
import pickle
import numpy as np
import pandas as pd

from tqdm.auto import tqdm
from sklearn.preprocessing import LabelEncoder, StandardScaler
from utils.data_compression import reduce_mem


def get_statistical_features(all_data, past_day=7):
    # 统计新闻从发文到展示的日期差
    temp = all_data['展现日期'] - all_data['发文日期']
    all_data['从发文到展现的日期差'] = temp.dt.days
    all_data.loc[all_data['从发文到展现的日期差'] < 0, '从发文到展现的日期差'] = 0
    all_data.fillna(value={'从发文到展现的日期差': 0}, inplace=True)

    statis_dense_columns = ['从发文到展现的日期差']

    dates = all_data['展现日期'].unique()
    dates.sort()
    date_num = len(dates)
    date_map = dict(zip(dates, range(date_num)))
    all_data['展现日期_idx'] = all_data['展现日期'].map(date_map)

    train_data = all_data[all_data['是否点击'] != -1]

    # ===================================================================================
    for feat in tqdm([['user_id'], ['item_id'], ['一级分类'], ['二级分类'],
                      ['user_id', '一级分类'], ['user_id', '二级分类']]):
        res_arr = []
        name = f'过去{past_day}天_特征({"_".join(feat)})_展现总数'
        statis_dense_columns.append(name)

        for day in range(0, date_num):
            train_data_temp = train_data[
                (train_data['展现日期_idx'] >= day-past_day) & (train_data['展现日期_idx'] < day)]
            train_data_temp = train_data_temp.groupby(feat)['item_id'].agg([
                (name, 'count')]).reset_index()
            train_data_temp['展现日期_idx'] = day
            res_arr.append(train_data_temp)
        stat_all_data = pd.concat(res_arr)
        all_data = all_data.merge(stat_all_data, how='left', on=feat + ['展现日期_idx'])

    target = '是否点击'
    for feat in tqdm([['user_id'], ['item_id'], ['一级分类'], ['二级分类'],
                     ['user_id', '一级分类'], ['user_id', '二级分类']]):
        res_arr = []
        name_mean = f'过去{past_day}天_特征({"_".join(feat)})_点击率mean'
        name_sum = f'过去{past_day}天_特征({"_".join(feat)})_点击总数sum'

        statis_dense_columns.append(name_mean)
        statis_dense_columns.append(name_sum)

        for day in range(0, date_num):
            train_data_temp = train_data[
                (train_data['展现日期_idx'] >= day-past_day) & (train_data['展现日期_idx'] < day)]
            train_data_temp = train_data_temp.groupby(feat)[target].agg(
                [(name_mean, 'mean'), (name_sum, 'sum')]).reset_index()
            train_data_temp['展现日期_idx'] = day
            res_arr.append(train_data_temp)
        stat_all_data = pd.concat(res_arr)
        all_data = all_data.merge(stat_all_data, how='left', on=feat + ['展现日期_idx'])

    target = '消费时长（秒）'
    for feat in tqdm([['user_id'], ['item_id'], ['一级分类'], ['二级分类'],
                     ['user_id', '一级分类'], ['user_id', '二级分类']]):
        res_arr = []
        name_mean = f'过去{past_day}天_特征({"_".join(feat)})_消费时长mean'
        name_std = f'过去{past_day}天_特征({"_".join(feat)})_消费时长std'
        name_sum = f'过去{past_day}天_特征({"_".join(feat)})_消费时长sum'
        statis_dense_columns.append(name_mean)
        statis_dense_columns.append(name_std)
        statis_dense_columns.append(name_sum)

        for day in range(0, date_num):
            train_data_temp = train_data[
                (train_data['展现日期_idx'] >= day-past_day) & (train_data['展现日期_idx'] < day)]
            train_data_temp = train_data_temp.groupby(feat)[target].agg(
                [(name_mean, 'mean'), (name_std, 'std'), (name_sum, 'sum')]
            ).reset_index()
            train_data_temp['展现日期_idx'] = day
            res_arr.append(train_data_temp)
        stat_all_data = pd.concat(res_arr)
        all_data = all_data.merge(stat_all_data, how='left', on=feat + ['展现日期_idx'])

    return all_data, statis_dense_columns


def main():
    raw_data_path = '../raw_data'
    new_data_path = '../new_data'
    os.makedirs(new_data_path, exist_ok=True)

    train_data_path = os.path.join(raw_data_path, 'train_data.pkl')
    test_data_path = os.path.join(raw_data_path, 'test_data.pkl')

    train_data = pd.read_pickle(train_data_path)
    test_data = pd.read_pickle(test_data_path)
    test_data['是否点击'] = -1
    all_data = pd.concat([train_data, test_data])

    # 1. 合并用户特征
    user_path = os.path.join(new_data_path, 'user_info_5w.pkl')
    user_info = pd.read_pickle(user_path)
    all_data = all_data.merge(
        user_info[['user_id', '设备名称', '操作系统', '所在省', '所在市', '年龄', '性别']],
        how='left', on='user_id'
    )
    del user_info
    gc.collect()

    # 2. 合并文档特征
    doc_path = os.path.join(new_data_path, 'doc_info.pkl')
    doc_info = pd.read_pickle(doc_path)
    all_data = all_data.merge(
        doc_info[['item_id', '一级分类', '二级分类', '关键词', '图片数量', '发文时间', '发文日期']],
        how='left', on='item_id'
    )
    del doc_info
    gc.collect()

    # 3. 获取统计特征
    all_data, statis_dense_columns = get_statistical_features(all_data)

    # 4. 连续特征处理
    base_dense_columns = ['刷新次数', '图片数量']
    dense_columns = base_dense_columns + statis_dense_columns

    all_data.fillna(value={feat: 0 for feat in dense_columns}, inplace=True)
    # sc = StandardScaler()
    # all_data[dense_columns] = sc.fit_transform(all_data[dense_columns])
    for feat in dense_columns:
        all_data[feat] = np.log(1 + all_data[feat])

    # 5. 离散特征处理
    sparse_columns = ['user_id', 'item_id', '网路环境', '设备名称', '操作系统', '展现位置',
                      '所在省', '所在市', '年龄', '性别', '一级分类', '二级分类', '关键词']
    for feat in sparse_columns:
        lb = LabelEncoder()
        all_data[feat] = lb.fit_transform(all_data[feat].astype(str))

    all_data = reduce_mem(all_data)
    feature_info = {'dense_features': dense_columns,
                    'sparse_features': sparse_columns}
    file = [all_data, feature_info]
    file_save_path = os.path.join(new_data_path, 'data.pkl')
    with open(file_save_path, 'wb') as f:
        pickle.dump(file, f)
        f.close()


if __name__ == '__main__':
    main()
