#!/usr/bin/env python
# -*- coding:utf-8 -*-
# @file  : set_parament.py
# @Author: xLyons
# @IDE   : PyCharm
# @Time  : 2022/2/7

import yaml
from collections import namedtuple


def get_args(yaml_path):
    with open(yaml_path, 'r', encoding='utf-8') as f:
        para_dict = yaml.load(f.read(), Loader=yaml.FullLoader)

        ps = namedtuple('parser', list(para_dict.keys()))
        args = ps(**para_dict)
        f.close()

    return args
