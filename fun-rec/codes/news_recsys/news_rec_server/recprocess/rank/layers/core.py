#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @File  : core.py
# @Author: xLyons
# @IDE   ：PyCharm
# @Time  : 2022/1/27

import tensorflow as tf
from tensorflow.keras.layers import Layer, Dense, Embedding, BatchNormalization, Dropout
from tensorflow.keras.initializers import glorot_normal, Zeros, glorot_uniform
from tensorflow.keras.regularizers import l2

from layers.activation import activation_layer


class DNN(Layer):
    def __init__(self, hidden_units, activation='relu', l2_reg=.0, dropout_rate=.0, use_bn=False,
                 output_activation=None, seed=48, **kwargs):
        self.hidden_units = hidden_units
        self.activation = activation
        self.l2_reg = l2_reg
        self.dropout_rate = dropout_rate
        self.use_bn = use_bn
        self.output_activation = output_activation
        self.seed = seed

        super(DNN, self).__init__(**kwargs)

    def build(self, input_shape):
        input_size = input_shape[-1]

        hidden_units = [int(input_size)] + list(self.hidden_units)
        self.kernels = [self.add_weight(name='kernel' + str(i),
                                        shape=(
                                            hidden_units[i], hidden_units[i + 1]),
                                        initializer=glorot_uniform(
                                            seed=self.seed),
                                        regularizer=l2(self.l2_reg),
                                        trainable=True) for i in range(len(self.hidden_units))]
        self.bias = [self.add_weight(name='bias' + str(i),
                                     shape=(self.hidden_units[i],),
                                     initializer=Zeros(),
                                     trainable=True) for i in range(len(self.hidden_units))]
        if self.use_bn:
            self.bn_layers = [tf.keras.layers.BatchNormalization() for _ in range(len(self.hidden_units))]

        self.dropout_layers = [tf.keras.layers.Dropout(self.dropout_rate, seed=self.seed + i) for i in
                               range(len(self.hidden_units))]

        self.activation_layers = [activation_layer(self.activation) for _ in range(len(self.hidden_units))]

        if self.output_activation:
            self.activation_layers[-1] = activation_layer(self.output_activation)

        super(DNN, self).build(input_shape)

    def call(self, inputs, training=True, **kwargs):
        deep_input = inputs

        for i in range(len(self.hidden_units)):
            fc = tf.nn.bias_add(tf.tensordot(
                deep_input, self.kernels[i], axes=(-1, 0)), self.bias[i])

            if self.use_bn:
                fc = self.bn_layers[i](fc, training=training)
            try:
                fc = self.activation_layers[i](fc, training=training)
            except TypeError as e:
                print("make sure the activation function use training flag properly", e)
                fc = self.activation_layers[i](fc)

            fc = self.dropout_layers[i](fc, training=training)
            deep_input = fc

        return deep_input


class Linear(Layer):
    def __init__(self, l2_reg=.0, use_bias=False, seed=48, **kwargs):
        self.l2_reg = l2_reg
        self.use_bias = use_bias
        self.seed = seed

        super().__init__(**kwargs)

    def build(self, input_shape):
        self.kernel = self.add_weight(
            name='linear_kernel',
            shape=(input_shape[-1], 1),
            initializer=glorot_normal(self.seed),
            regularizer=l2(self.l2_reg),
            trainable=True,
        )
        if self.use_bias:
            self.bias = self.add_weight(
                name='linear_bais',
                shape=(1, ),
                initializer=Zeros(),
                trainable=True
            )

        super(Linear, self).build(input_shape)

    def call(self, inputs, **kwargs):
        linear_logits = tf.tensordot(inputs, self.kernel, axes=1)
        if self.use_bias:
            linear_logits += self.bias

        return linear_logits


class GateNN(Layer):
    def __init__(self, hidden_units, activation='relu', l2_reg=.0, dropout_rate=.0, use_bn=False,
                 output_activation='sigmoid', seed=48, **kwargs):
        self.hidden_units = hidden_units
        self.activation = activation
        self.l2_reg = l2_reg
        self.dropout_rate = dropout_rate
        self.use_bn = use_bn
        self.output_activation = output_activation
        self.seed = seed

        super(GateNN, self).__init__(**kwargs)

    def build(self, input_shape):
        input_size = input_shape[-1]

        hidden_units = [int(input_size)] + list(self.hidden_units)
        self.kernels = [self.add_weight(name='kernel' + str(i),
                                        shape=(
                                            hidden_units[i], hidden_units[i + 1]),
                                        initializer=glorot_uniform(
                                            seed=self.seed),
                                        regularizer=l2(self.l2_reg),
                                        trainable=True) for i in range(len(self.hidden_units))]
        self.bias = [self.add_weight(name='bias' + str(i),
                                     shape=(self.hidden_units[i],),
                                     initializer=Zeros(),
                                     trainable=True) for i in range(len(self.hidden_units))]

        self.activation_layers = [activation_layer(self.activation) for _ in range(len(self.hidden_units))]

        if self.output_activation:
            self.activation_layers[-1] = activation_layer(self.output_activation)

        super(GateNN, self).build(input_shape)

    def call(self, inputs, training=True, **kwargs):
        deep_input = inputs

        for i in range(len(self.hidden_units)):
            fc = tf.nn.bias_add(tf.tensordot(
                deep_input, self.kernels[i], axes=(-1, 0)), self.bias[i])

            try:
                fc = self.activation_layers[i](fc, training=training)
            except TypeError as e:
                print("make sure the activation function use training flag properly", e)
                fc = self.activation_layers[i](fc)

            deep_input = fc

        return deep_input


class PPNet(Layer):
    def __init__(self, ppnet_size, hidden_units, activation='relu', l2_reg=.0, dropout_rate=.0, use_bn=False,
                 output_activation=None, seed=48, **kwargs):
        self.ppnet_size = ppnet_size
        self.hidden_units = hidden_units
        self.activation = activation
        self.l2_reg = l2_reg
        self.dropout_rate = dropout_rate
        self.use_bn = use_bn
        self.output_activation = output_activation
        self.seed = seed

        super(PPNet, self).__init__(**kwargs)

    def build(self, input_shape):
        input_size = input_shape[0][-1]
        hidden_units = [int(input_size)] + list(self.hidden_units)

        self.gate_nn_layers = [
            GateNN(hidden_units=[self.ppnet_size, hidden_units[i]],
                   activation='relu',
                   output_activation='sigmoid',
                   l2_reg=self.l2_reg,
                   seed=self.seed)
            for i in range(len(self.hidden_units))
        ]
        self.kernels = [self.add_weight(name='kernel' + str(i),
                                        shape=(hidden_units[i], hidden_units[i + 1]),
                                        initializer=glorot_uniform(
                                            seed=self.seed),
                                        regularizer=l2(self.l2_reg),
                                        trainable=True) for i in range(len(self.hidden_units))]
        self.bias = [self.add_weight(name='bias' + str(i),
                                     shape=(self.hidden_units[i],),
                                     initializer=Zeros(),
                                     trainable=True) for i in range(len(self.hidden_units))]
        if self.use_bn:
            self.bn_layers = [tf.keras.layers.BatchNormalization() for _ in range(len(self.hidden_units))]

        self.dropout_layers = [tf.keras.layers.Dropout(self.dropout_rate, seed=self.seed + i) for i in
                               range(len(self.hidden_units))]

        self.activation_layers = [activation_layer(self.activation) for _ in range(len(self.hidden_units))]

        if self.output_activation:
            self.activation_layers[-1] = activation_layer(self.output_activation)

        super(PPNet, self).build(input_shape)

    def call(self, inputs, training=True, **kwargs):
        deep_input, ppnet_input = inputs

        for i in range(len(self.hidden_units)):
            ppnet_scale = self.gate_nn_layers[i](ppnet_input)
            deep_input = deep_input * ppnet_scale * 2
            fc = tf.nn.bias_add(tf.tensordot(
                deep_input, self.kernels[i], axes=(-1, 0)), self.bias[i])

            if self.use_bn:
                fc = self.bn_layers[i](fc, training=training)
            try:
                fc = self.activation_layers[i](fc, training=training)
            except TypeError as e:
                print("make sure the activation function use training flag properly", e)
                fc = self.activation_layers[i](fc)

            fc = self.dropout_layers[i](fc, training=training)
            deep_input = fc

        return deep_input


    