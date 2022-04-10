#!/usr/bin/env python
# -*- coding:utf-8 -*-
# @File  : deepfm_news.py
# @Author: xLyons
# @IDE   : PyCharm
# @Time  : 2022/1/27

import argparse

from run_train import run_deepfm
from utils.set_parament import get_args
from dataset.data_process.create_ctr_data import create_ctr_data


parser = argparse.ArgumentParser(description='Model Parameter')
parser.add_argument('--yaml_path',
                    default='./set_para/deepfm_news.yaml',
                    required=False)
parser.add_argument('--data_path',
                    default='./dataset/new_data/',
                    required=False)
parse_args = parser.parse_args()


if __name__ == '__main__':
    args = get_args(parse_args.yaml_path)
    train_data, test_data, feature_info = create_ctr_data(parse_args.data_path, args)

    run_deepfm.run(train_data, test_data, feature_info, args)
