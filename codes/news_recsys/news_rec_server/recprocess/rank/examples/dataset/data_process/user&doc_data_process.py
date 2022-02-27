#!/usr/bin/env python
# -*- coding:utf-8 -*-
# @File  : user&doc_data_process.py
# @Author: xLyons
# @IDE   : PyCharm
# @Time  : 2022/2/9

import os
import swifter
import pandas as pd
import numpy as np

from tqdm.auto import tqdm


def prob2val(feat_info):
    # 判断是否为空
    if feat_info == feat_info:
        prob_list = [values.split(':') for values in feat_info.split(',')]
        prob_list = sorted(prob_list, key=lambda x: float(x[1]))
        return prob_list[-1][0]
    else:
        return np.NaN


def get_second_title(x):
    if x['二级分类'] == x['二级分类']:
        second_titles = x['二级分类'].split('/')
        for title in second_titles:
            # 跳过异常数据
            if title == 'A_0_24:0.447656,A_25_29:0.243809,A_30_39:0.076268,A_40+:0.232267':
                continue
            # 优先返回不等于一级分类的二级分类
            if title != x['一级分类']:
                return title

    return x['一级分类']


def get_key_word(feat_info):
    if feat_info == feat_info and isinstance(feat_info, str):
        key_word_list = [values.split(':') for values in feat_info.replace('^', '').split(',')]

        new_list = []
        last_elem = ''
        for idx, values in enumerate(key_word_list):
            if len(values) == 1:
                last_elem = values[0] if last_elem == '' else ','.join([last_elem, values[0]])
                continue
            if len(values) > 2:
                # 将类似于‘你好，李焕英’这种关键词重新进行拼接
                # 这类关键词由于存在逗号，在获取key_word_list时被误分开了
                values[0] = ':'.join(values[:-1])

            values[0] = values[0] if last_elem == '' else ','.join([last_elem, values[0]])
            new_list.append(values)
            last_elem = ''

        return new_list[-1][0]
    else:
        return np.NaN


def main():
    raw_data_path = '../raw_data'
    new_data_path = '../new_data'
    os.makedirs(new_data_path, exist_ok=True)

    # 1. 处理用户文件
    user_path = os.path.join(raw_data_path, 'user_info_5w.csv')
    user_info = pd.read_csv(user_path, sep='\t', index_col=0)
    user_info.columns = ['user_id', '设备名称', '操作系统', '所在省', '所在市', '年龄', '性别']

    user_info['年龄'] = [prob2val(age_info) for age_info in tqdm(user_info['年龄'])]
    user_info['性别'] = [prob2val(sex_info) for sex_info in tqdm(user_info['性别'])]

    user_info.to_pickle(os.path.join(new_data_path, 'user_info_5w.pkl'))

    # 2. 处理文档文件
    doc_path = os.path.join(raw_data_path, 'doc_info.txt')
    doc_info = pd.read_table(doc_path, sep='\t', low_memory=False, header=None)
    doc_info.columns = ['item_id', '标题', '发文时间', '图片数量', '一级分类', '二级分类', '关键词']

    # 处理异常的发文时间数据
    condition_row = (doc_info['发文时间'].isnull()) | (doc_info['发文时间'] == 'Android')
    time_fill_value = doc_info.loc[~condition_row, '发文时间'].swifter.apply(lambda x: int(x[:10])).astype('int').min()
    doc_info.loc[condition_row, '发文时间'] = str(time_fill_value)

    doc_info['发文时间'] = pd.to_datetime(
        doc_info.loc[:, '发文时间'], utc=True, unit='ms').dt.tz_convert('Asia/Shanghai')
    doc_info['发文日期'] = doc_info['发文时间'].dt.date

    doc_info['图片数量'] = doc_info.loc[:, '图片数量'].swifter.apply(
        lambda x: 0 if (x in ['上海', '云南', '山东'] or x != x) else int(x))

    doc_info['二级分类'] = doc_info.loc[:, ['一级分类', '二级分类']].swifter.apply(get_second_title, axis=1)
    doc_info['关键词'] = [get_key_word(words) for words in tqdm(doc_info['关键词'])]

    doc_info.to_pickle(os.path.join(new_data_path, 'doc_info.pkl'))


if __name__ == '__main__':
    main()
