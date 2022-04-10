from audioop import bias
from itertools import chain
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Flatten, Concatenate, Dense, Reshape
from features import FeatureEncoder
from layers import DNN, InnerProduct, OuterProduct
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
    embedding_list = [v for k, v in group_embedding_dict['pnn'].items() 
        if k in dnn_emb_name]

    linear_sparse_inputs = Flatten()(Concatenate(axis=1)(linear_input_sparse_list))
    linear_dense_list.append(linear_sparse_inputs)
    linear_inputs = []
    if len(linear_dense_list) == 2:
        linear_inputs = Concatenate(axis=-1)(linear_dense_list)
    else:
        linear_inputs = linear_dense_list[0]

    return linear_inputs, embedding_list


def PNN(linear_feature_columns, dnn_feature_columns, hidden_units=(32, 16, 1),
    use_inner=True, inner_units=512, outer_units=512, use_outter=True, 
    use_mat_dot=False, activation='relu', use_bias=True, dp_rate=0.2, use_bn=True, 
    use_dp=True, task='binary'):

    feature_columns = list(set(linear_feature_columns + dnn_feature_columns))
    feature_encode = FeatureEncoder(feature_columns, 
                        linear_sparse_feature=linear_feature_columns)
    feature_input_layers_list = list(feature_encode.feature_input_layer_dict.values())

    # 特征处理
    linear_inputs, embedding_list = \
        process_feature(linear_feature_columns, dnn_feature_columns, feature_encode)

    # 这里本来应该对原始的embedding做矩阵内积的，但是考虑到参数量比较多，下面直接将embedding矩阵展开
    field_size = len(embedding_list)
    embedding_dim = embedding_list[0].shape[-1]
    embedding_matrix = Concatenate(axis=1)(embedding_list)
    # (None, field_size * embedding_size)
    dnn_linear_input = Reshape([field_size * embedding_dim])(embedding_matrix)

    dnn_interaction_list = []
    if use_inner:
        dnn_inputs = InnerProduct(use_mat_dot, inner_units)(embedding_list)
        dnn_interaction_list.append(dnn_inputs)
    if use_outter:
        dnn_inputs = OuterProduct(use_mat_dot, outer_units)(embedding_list)
        dnn_interaction_list.append(dnn_inputs)
    
    if len(dnn_interaction_list) == 2:
        dnn_interaction_input = Concatenate(axis=-1)(dnn_interaction_list)
    else:
        dnn_interaction_input = dnn_interaction_list[0]
    
    if linear_inputs is not None:
        dnn_input_list = [linear_inputs, dnn_linear_input, dnn_interaction_input]
    else:
        dnn_input_list = [dnn_linear_input, dnn_interaction_input]

    dnn_inputs = Flatten()(Concatenate(axis=-1)(dnn_input_list))

    logits = DNN(hidden_units, activation, use_bias, use_dp, dp_rate, dp_rate, 
        use_bn, get_logits=True)(dnn_inputs)

    output = PredictLayer(task)(logits)
    model = Model(feature_input_layers_list, output)
    return model 
