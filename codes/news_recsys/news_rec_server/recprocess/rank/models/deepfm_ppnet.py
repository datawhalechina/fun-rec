#!/usr/bin/env python
# -*- coding:utf-8 -*-
# @File  : deepfm_ppnet.py
# @Author: xLyons
# @IDE   : PyCharm
# @Time  : 2022/2/8


from tensorflow.keras.layers import Dense

from layers.core import PPNet
from layers.interaction import FMCross
from model_tools.feature_columns import *


def DeepFM_PPNet(
        feature_columns,
        ppnet_size,
        ppnet_features,
        dnn_hidden_units,
        embed_l2_reg=1e-5,
        linear_l2_reg=1e-5,
        linear_use_bias=True,
        dnn_l2_reg=1e-5,
        dnn_drop_rate=.0,
        dnn_use_bn=False,
        dnn_activation='relu',
        seed=48):

    feat_inputs = build_feature_inputs(feature_columns)
    inputs_list = list(feat_inputs.values())

    sparse_feature_columns = list(
        filter(lambda x: isinstance(x, SparseFeat), feature_columns)) if feature_columns else []

    sparse_embed_dict = create_embed_dict(sparse_feature_columns, embed_l2_reg)
    sparse_embed_list = embedding_lookup(sparse_embed_dict, feat_inputs, sparse_feature_columns, to_list=True)

    dense_inputs = get_dense_inputs(feat_inputs, feature_columns, concat_flag=True)

    linear_logit = get_linear_logit(feat_inputs=feat_inputs,
                                    feature_columns=feature_columns,
                                    linear_l2_reg=linear_l2_reg,
                                    embed_l2_reg=embed_l2_reg,
                                    use_bias=linear_use_bias,
                                    seed=seed)

    fm_inputs = Concatenate(axis=1)(sparse_embed_list)
    fm_logit = FMCross()(fm_inputs)

    sparse_embed_inputs = Flatten()(Concatenate(axis=-1)(sparse_embed_list))
    dnn_inputs = tf.concat([dense_inputs, sparse_embed_inputs], axis=-1)

    ppnet_feature_columns = list(
        filter(lambda x: x.name in ppnet_features, feature_columns)) if feature_columns else []
    ppnet_embed_list = embedding_lookup(sparse_embed_dict, feat_inputs, ppnet_feature_columns, to_list=True)
    ppnet_inputs = Flatten()(Concatenate(axis=-1)(ppnet_embed_list))
    # stop gradient propagation
    ppnet_inputs = tf.stop_gradient(ppnet_inputs)

    dnn_logit = PPNet(
        ppnet_size=ppnet_size,
        hidden_units=dnn_hidden_units,
        activation=dnn_activation,
        l2_reg=dnn_l2_reg,
        dropout_rate=dnn_drop_rate,
        use_bn=dnn_use_bn
        )([dnn_inputs, ppnet_inputs])
    dnn_logit = Dense(units=1,
                      use_bias=False,
                      kernel_initializer=tf.keras.initializers.glorot_uniform(seed=seed)
                      )(dnn_logit)

    final_outputs = tf.nn.sigmoid(linear_logit + fm_logit + dnn_logit)
    model = tf.keras.models.Model(inputs=inputs_list, outputs=final_outputs)

    return model
