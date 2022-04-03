import tensorflow as tf
from tensorflow.keras.layers import *

if tf.__version__ >= '2.0.0':
    tf.compat.v1.disable_eager_execution()

# TODO
class PoolingLayer(Layer):
    def __init__(self, trainable=True, name=None, dtype=None, dynamic=False, **kwargs):
        super().__init__(trainable, name, dtype, dynamic, **kwargs)
        pass


class DynamicMultiRNN(Layer):
    def __init__(self, num_units=None, rnn_type='LSTM', return_sequence=True, num_layers=2, num_residual_layers=1,
                 dropout_rate=0.2, forget_bias=1.0, **kwargs):
        self.num_units = num_units
        self.return_sequence = return_sequence
        self.rnn_type = rnn_type
        self.num_layers = num_layers
        self.num_residual_layers = num_residual_layers
        self.dropout = dropout_rate
        self.forget_bias = forget_bias
        super(DynamicMultiRNN, self).__init__(**kwargs)

    def build(self, input_shape):
        input_seq_shape = input_shape[0]
        if self.num_units is None:
            self.num_units = input_seq_shape.as_list()[-1]
        # 这里先只用LSTM
        if self.rnn_type == "LSTM":
            try:
                # AttributeError: module 'tensorflow_core._api.v2.nn' has no attribute 'rnn_cell'
                single_cell = tf.nn.rnn_cell.BasicLSTMCell(self.num_units, forget_bias=self.forget_bias)
            except AttributeError:
                single_cell = tf.compat.v1.nn.rnn_cell.BasicLSTMCell(self.num_units, forget_bias=self.forget_bias)

        dropout = self.dropout if tf.keras.backend.learning_phase() == 1 else 0  # 训练的时候开启Dropout， 不训练的时候关闭
        try:
            single_cell = tf.nn.rnn_cell.DropoutWrapper(cell=single_cell, input_keep_prob=(1.0 - dropout))
        except AttributeError:
            single_cell = tf.compat.v1.nn.rnn_cell.DropoutWrapper(cell=single_cell, input_keep_prob=(1.0 - dropout))

        cell_list = []
        for i in range(self.num_layers):
            residual = (i >= self.num_layers - self.num_residual_layers)
            if residual:
                # 实现的功能， 把输入concat到输出上一起返回， 就跟ResNet一样
                try:
                    single_cell_residual = tf.nn.rnn_cell.ResidualWrapper(single_cell)
                except AttributeError:
                    single_cell_residual = tf.compat.v1.nn.rnn_cell.ResidualWrapper(single_cell)
                cell_list.append(single_cell_residual)
            else:
                cell_list.append(single_cell)

        if len(cell_list) == 1:
            self.final_cell = cell_list[0]
        else:
            # 构建多隐层RNN
            try:
                self.final_cell = tf.nn.rnn_cell.MultiRNNCell(cell_list)
            except AttributeError:
                self.final_cell = tf.compat.v1.nn.rnn_cell.MultiRNNCell(cell_list)

        super(DynamicMultiRNN, self).build(input_shape)

    def call(self, input_list):
        rnn_input, sequence_length = input_list

        try:
            # AttributeError: module 'tensorflow' has no attribute 'variable_scope'
            with tf.name_scope('rnn'), tf.variable_scope('rnn', reuse=tf.AUTO_REUSE):
                # rnn_output是所有时间步的隐藏层状态， hidden_state是最后一个时间步的输出， 如果是LSTM这里是c和h两个
                rnn_output, hidden_state = tf.nn.dynamic_rnn(self.final_cell, inputs=rnn_input,
                                                             sequence_length=tf.squeeze(sequence_length),
                                                             dtype=tf.float32, scope=self.name)
        except AttributeError:
            with tf.name_scope("rnn"), tf.compat.v1.variable_scope("rnn", reuse=tf.compat.v1.AUTO_REUSE):
                rnn_output, hidden_state = tf.compat.v1.nn.dynamic_rnn(self.final_cell, inputs=rnn_input,
                                                                       sequence_length=tf.squeeze(sequence_length),
                                                                       dtype=tf.float32, scope=self.name)
        if self.return_sequence:
            return rnn_output
        else:
            return tf.expand_dims(hidden_state, axis=1)

    def compute_output_shape(self, input_shape):
        rnn_input_shape = input_shape[0]
        if self.return_sequence:
            return rnn_input_shape
        else:
            return (None, 1, rnn_input_shape[2])

