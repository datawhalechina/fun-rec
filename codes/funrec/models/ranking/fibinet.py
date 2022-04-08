from audioop import bias
from itertools import chain
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Flatten, Concatenate, Dense, Reshape
from features import FeatureEncoder
from layers import DNN, SENetLayer, BilinearInteractionLayer
from layers.core import PredictLayer


def process_feature(linear_feature_columns, dnn_feature_columns, feature_encode):
    """
    根据FeatureEncoder获取所有输入的Input层或者Embedding层，然后根据自己
    实际场景的业务数据，对不同的特征进行处理.
    """
    linear_input_sparse_dict = feature_encode.linear_sparse_feature_dict
    group_embedding_dict = feature_encode.sparse_feature_dict

    linear_input_sparse_list = list(linear_input_sparse_dict['default_group'].values())
    linear_dense_dict = feature_encode.dense_feature_dict
    linear_dense_list = list(linear_dense_dict.values())

    dnn_emb_name = [fc.embedding_name for fc in dnn_feature_columns]
    embedding_list = [v for k, v in group_embedding_dict['bilinear'].items() 
        if k in dnn_emb_name]

    linear_sparse_inputs = Flatten()(Concatenate(axis=1)(linear_input_sparse_list))
    linear_dense_list.append(linear_sparse_inputs)
    linear_inputs = []
    if len(linear_dense_list) == 2:
        linear_inputs = Concatenate(axis=-1)(linear_dense_list)
    else:
        linear_inputs = linear_dense_list[0]

    return linear_inputs, embedding_list


def FiBiNet(linear_feature_columns, dnn_feature_columns, hidden_units=(32, 16, 1),
    bilinear_type='interaction', activation='relu', 
    use_bias=True, dp_rate=0.2, use_bn=True, use_dp=True, task='binary'):

    feature_columns = list(set(linear_feature_columns + dnn_feature_columns))
    feature_encode = FeatureEncoder(feature_columns, 
                        linear_sparse_feature=linear_feature_columns)
    feature_input_layers_list = list(feature_encode.feature_input_layer_dict.values())

    # 特征处理
    linear_inputs, embedding_list = \
        process_feature(linear_feature_columns, dnn_feature_columns, feature_encode)

    senet_out_embedding_list = SENetLayer()(embedding_list)

    bilinear_out = BilinearInteractionLayer(bilinear_type)(embedding_list)
    bilinear_out_se = BilinearInteractionLayer(bilinear_type)(senet_out_embedding_list)

    dnn_bilinear_inputs = Flatten()(bilinear_out)
    dnn_bilinear_se_inputs = Flatten()(bilinear_out_se)

    dnn_inputs = Concatenate(axis=-1)([linear_inputs, dnn_bilinear_inputs, \
        dnn_bilinear_se_inputs])

    logits = DNN(hidden_units, activation, use_bias, use_dp, dp_rate, dp_rate, 
        use_bn, get_logits=True)(dnn_inputs)

    output = PredictLayer(task)(logits)
    model = Model(feature_input_layers_list, output)
    return model 
