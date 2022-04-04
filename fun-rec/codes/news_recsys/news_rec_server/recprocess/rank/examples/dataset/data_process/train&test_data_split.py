#!/usr/bin/env python
# -*- coding:utf-8 -*-
# @File  : train&test_data_split.py
# @Author: xLyons
# @IDE   : PyCharm
# @Time  : 2022/2/16


import os
import pandas as pd


def main():
    raw_data_path = '../raw_data'
    new_data_path = '../new_data'

    # 1. 数据读取
    all_data_path = os.path.join(raw_data_path, 'train_data_5w.csv')
    all_data = pd.read_csv(all_data_path, sep='\t', index_col=0)    # .sample(n=100000)
    all_data.columns = ['user_id', 'item_id', '展现时间', '网路环境', '刷新次数', '展现位置', '是否点击', '消费时长（秒）']
    print(f'样本总数为：{all_data.shape[0]}')

    # 2. 数据处理
    all_data.loc[all_data['消费时长（秒）'] < 0, '消费时长（秒）'] = 0
    all_data['展现时间'] = pd.to_datetime(
        all_data.loc[:, '展现时间'], utc=True, unit='ms').dt.tz_convert('Asia/Shanghai')
    all_data['展现日期'] = all_data['展现时间'].dt.date
    all_data['index'] = range(all_data.shape[0])

    dates = all_data['展现日期'].unique()
    dates.sort()
    # 3. 训练、测试数据集划分
    train_data = all_data[all_data['展现日期'] != dates[-1]]
    test_data = all_data[all_data['展现日期'] == dates[-1]]
    test_label = test_data[['index', '是否点击']]

    # 4. 测试集处理
    test_data = test_data.drop(columns=['消费时长（秒）', '展现位置', '是否点击'])

    train_data.to_pickle(os.path.join(raw_data_path, 'train_data.pkl'))
    test_data.to_pickle(os.path.join(raw_data_path, 'test_data.pkl'))
    test_label.to_pickle(os.path.join(new_data_path, 'test_label.pkl'))


if __name__ == '__main__':
    main()
