#!/usr/bin/env python
# -*- coding:utf-8 -*-
# @File  : activation.py
# @Author: xLyons
# @IDE   : PyCharm
# @Time  : 2022/1/27

import tensorflow as tf
from tensorflow.keras.initializers import Zeros
from tensorflow.keras.layers import Layer

unicode = str


def activation_layer(activation):
    if isinstance(activation, (str, unicode)):
        act_layer = tf.keras.layers.Activation(activation)
    elif issubclass(activation, Layer):
        act_layer = activation()
    else:
        raise ValueError(
            "Invalid activation,found %s.You should use a str or a Activation Layer Class." % (activation))
    return act_layer

