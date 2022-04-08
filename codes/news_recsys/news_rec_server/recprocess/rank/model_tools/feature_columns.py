#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @File  : feature_columns.py
# @Author: xLyons
# @IDE   ：PyCharm 
# @Time  : 2022/1/27


import copy
import tensorflow as tf

from collections import OrderedDict
from tensorflow.keras.layers import Input, Flatten, Concatenate
from tensorflow.keras.initializers import RandomNormal, Zeros
from tensorflow.keras.layers.experimental.preprocessing import StringLookup

from layers.core import Linear
from layers.embedding import create_embed_dict, embedding_lookup


class SparseFeat(object):
    def __init__(self, name, embed_dim, vocab_size, dtype, embed_name=None, seed=48):
        self.name = name
        self.vocab_size = vocab_size
        self.embed_dim = embed_dim
        self.embed_init = RandomNormal(mean=0.0, stddev=0.01, seed=seed)
        self.dtype = dtype

        self.embed_name = embed_name if embed_name else name

        super(SparseFeat, self).__init__()


class DenseFeat(object):
    def __init__(self, name, dimension, dtype=None):
        self.name = name
        self.dimension = dimension
        self.dtype = dtype

        super(DenseFeat, self).__init__()


def build_feature_inputs(feature_columns):
    feat_inputs = OrderedDict()
    for feat in feature_columns:
        if isinstance(feat, SparseFeat):
            sparse_inputs = Input(shape=(1, ),
                                  name=feat.name,
                                  dtype=feat.dtype)
            feat_inputs[feat.name] = sparse_inputs
        elif isinstance(feat, DenseFeat):
            dense_inputs = Input(shape=(feat.dimension, ),
                                 name=feat.name,
                                 dtype=feat.dtype)
            feat_inputs[feat.name] = dense_inputs
        else:
            raise TypeError("Invalid feature column type,got", type(feat))

    return feat_inputs


def build_feature_coding_model(all_data, sparse_features):
    feature_vocab_dict = dict()
    for feat in sparse_features:
        string_model = StringLookup(vocabulary=all_data[feat].unique(),
                                    mask_token=None)
        feature_vocab_dict[feat] = string_model

    return feature_vocab_dict


def get_dense_inputs(feat_inputs, feature_columns, concat_flag=True):
    dense_inputs = []
    for feat in feature_columns:
        if isinstance(feat, DenseFeat):
            dense_inputs.append(feat_inputs[feat.name])

    if concat_flag:
        dense_inputs = tf.concat(dense_inputs, axis=-1)

    return dense_inputs


def get_linear_logit(feat_inputs, feature_columns, linear_l2_reg=.0, embed_l2_reg=1e-5, use_bias=True, seed=48,):
    linear_features = copy.deepcopy(feature_columns)
    for feat in linear_features:
        if isinstance(feat, SparseFeat):
            feat.embed_dim = 1
            feat.embed_init = Zeros()

    sparse_feature_columns = list(
        filter(lambda x: isinstance(x, SparseFeat), linear_features)) if feature_columns else []
    sparse_embed_dict = create_embed_dict(sparse_feature_columns, embed_l2_reg)
    sparse_embed_list = embedding_lookup(sparse_embed_dict, feat_inputs, sparse_feature_columns, to_list=True)

    dense_inputs = get_dense_inputs(feat_inputs, linear_features, concat_flag=True)
    sparse_embed_inputs = Flatten()(Concatenate(axis=-1)(sparse_embed_list))
    linear_inputs = tf.concat([dense_inputs, sparse_embed_inputs], axis=-1)

    linear_logit = Linear(linear_l2_reg, use_bias, seed)(linear_inputs)

    return linear_logit
