import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Flatten, Concatenate, Dense
from features import FeatureEncoder, get_linear_logits
from layers import FM, DNN, PredictLayer


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
    dnn_input_list = [v for k, v in group_embedding_dict['fm'].items() 
        if k in dnn_emb_name]

    return linear_dense_list, linear_input_sparse_list, dnn_input_list


def DeepFM(linear_feature_columns, dnn_feature_columns, hidden_units=(32, 16, 1),
    activation='relu', use_bias=True, dp_rate=0.2, use_bn=True, use_dp=True, 
    task='binary'):
    # 构建所有特征的Input层和Embedding层
    # 因为有些特征可能在linear层和dnn层会重复了
    feature_columns = list(set(linear_feature_columns + dnn_feature_columns))
    feature_encode = FeatureEncoder(feature_columns, 
                        linear_sparse_feature=linear_feature_columns)
    feature_input_layers_list = list(feature_encode.feature_input_layer_dict.values())

    # 特征处理
    linear_dense_list, linear_input_sparse_list, dnn_input_list = \
        process_feature(linear_feature_columns, dnn_feature_columns, feature_encode)

    fm_logits = FM()(dnn_input_list)
    linear_logits = get_linear_logits(linear_dense_list, linear_input_sparse_list)
    
    dnn_inputs = Flatten()(Concatenate(axis=1)(dnn_input_list))
    dnn_logits = DNN(hidden_units, activation, use_bias, use_dp, dp_rate, dp_rate, 
        use_bn, get_logits=True)(dnn_inputs)

    logits = linear_logits + fm_logits + dnn_logits
    output = PredictLayer(task)(logits)
    model = Model(feature_input_layers_list, output)

    return model 


