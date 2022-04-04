#!/usr/bin/env python
# -*- coding:utf-8 -*-
# @file  : set_device.py
# @Author: xLyons
# @IDE   : PyCharm
# @Time  : 2022/2/7

import tensorflow as tf


def set_GPU():
    gpus = tf.config.experimental.list_physical_devices('GPU')
    print(gpus)

    for gpu in gpus:
        tf.config.experimental.set_memory_growth(gpu, True)
