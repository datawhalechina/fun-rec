from collections import OrderedDict
import tensorflow as tf
from tensorflow.keras.layers import *
from deepctr.feature_column import SparseFeat, DenseFeat, VarLenSparseFeat

class NoMask(tf.keras.layers.Layer):
    def __init__(self, **kwargs):
        super(NoMask, self).__init__(**kwargs)

    def build(self, input_shape):
        # Be sure to call this somewhere!
        super(NoMask, self).build(input_shape)

    def call(self, x, mask=None, **kwargs):
        return x

    def compute_mask(self, inputs, mask):
        return None

def softmax(logits, dim=-1, name=None):
    try:
        return tf.nn.softmax(logits, dim=dim, name=name)
    except TypeError:
        return tf.nn.softmax(logits, axis=dim, name=name)

def concat_func(inputs, axis=-1, mask=False):
    if not mask:
        inputs = list(map(NoMask(), inputs))
    if len(inputs) == 1:
        return inputs[0]
    else:
        return tf.keras.layers.Concatenate(axis=axis)(inputs)

def build_input_layers(feature_columns, prefix=''):
    input_features = OrderedDict()
    for fc in feature_columns:
        if isinstance(fc, SparseFeat):
            input_features[fc.name] = Input(
                shape=(1,), name=prefix + fc.name, dtype=fc.dtype)
        elif isinstance(fc, DenseFeat):
            input_features[fc.name] = Input(
                shape=(fc.dimension,), name=prefix + fc.name, dtype=fc.dtype)
        elif isinstance(fc, VarLenSparseFeat):
            input_features[fc.name] = Input(shape=(fc.maxlen,), name=prefix + fc.name,
                                            dtype=fc.dtype)
            if fc.weight_name is not None:
                input_features[fc.weight_name] = Input(shape=(fc.maxlen, 1), name=prefix + fc.weight_name,
                                                       dtype="float32")
            if fc.length_name is not None:
                input_features[fc.length_name] = Input((1,), name=prefix + fc.length_name, dtype='int32')

        else:
            raise TypeError("Invalid feature column type,got", type(fc))

    return input_features


def build_embedding_layers(feature_columns):
    embedding_layer_dict = {}

    for fc in feature_columns:
        if isinstance(fc, SparseFeat):
            embedding_layer_dict[fc.name] = Embedding(fc.vocabulary_size, fc.embedding_dim, name='emb_' + fc.name)
        elif isinstance(fc, VarLenSparseFeat):
            # 这里加1是因为mask有个默认的embedding，占用了一个位置，比如mask为0， 而0这个位置的embedding是mask专用了
            embedding_layer_dict[fc.name] = Embedding(fc.vocabulary_size + 1, fc.embedding_dim, name='emb_' + fc.name,
                                                      mask_zero=True)

    return embedding_layer_dict


def embedding_lookup(feature_columns, input_layer_dict, embedding_layer_dict):
    # 这个函数是Input层与embedding层给接起来
    embedding_list = []

    for fc in feature_columns:
        _input = input_layer_dict[fc]
        _embed = embedding_layer_dict[fc]
        embed = _embed(_input)
        embedding_list.append(embed)

    return embedding_list

def get_item_embedding(item_embedding, item_input_layer):
    return Lambda(lambda x: tf.squeeze(tf.gather(item_embedding, x), axis=1))(
        item_input_layer)

def squash(inputs):
    vec_squared_norm = reduce_sum(tf.square(inputs), axis=-1, keep_dims=True)  # (None, 2, 1)
    scalar_factor = vec_squared_norm / (1 + vec_squared_norm) / tf.sqrt(vec_squared_norm + 1e-8)
    vec_squashed = scalar_factor * inputs
    return vec_squashed

def reduce_sum(input_tensor,
               axis=None,
               keep_dims=False,
               name=None,
               reduction_indices=None):
    try:
        return tf.reduce_sum(input_tensor,
                             axis=axis,
                             keep_dims=keep_dims,
                             name=name,
                             reduction_indices=reduction_indices)
    except TypeError:
        return tf.reduce_sum(input_tensor,
                             axis=axis,
                             keepdims=keep_dims,
                             name=name)

def combined_dnn_input(sparse_embedding_list, dense_value_list):
    if len(sparse_embedding_list) > 0 and len(dense_value_list) > 0:
        sparse_dnn_input = Flatten()(concat_func(sparse_embedding_list))
        dense_dnn_input = Flatten()(concat_func(dense_value_list))
        return concat_func([sparse_dnn_input, dense_dnn_input])
    elif len(sparse_embedding_list) > 0:
        return Flatten()(concat_func(sparse_embedding_list))
    elif len(dense_value_list) > 0:
        return Flatten()(concat_func(dense_value_list))
    else:
        raise NotImplementedError("dnn_feature_columns can not be empty list")

