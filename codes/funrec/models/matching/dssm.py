from tensorflow.keras.models import Model
from tensorflow.keras.layers import Flatten, Concatenate
from features import FeatureEncoder
from layers import DNN, CosinSimilarity, PredictLayer


def process_feature(user_feature_columns, item_feature_columns, feature_encode):
    """
    根据FeatureEncoder获取所有输入的Input层或者Embedding层，然后根据自己
    实际场景的业务数据，对不同的特征进行处理.
    user_feature_columns = [
        SparseFeat('user_id', feature_max_index_dict['user_id'], embedding_dim=4),
        SparseFeat('gender', feature_max_index_dict['gender'], embedding_dim=4),
        SparseFeat('occupation', feature_max_index_dict['occupation'], embedding_dim=4),
        SparseFeat('zip', feature_max_index_dict['zip'], embedding_dim=4),
        VarLenSparseFeat(SparseFeat('hist_movie_id', feature_max_idx['movie_id'], embedding_dim,
                            embedding_name="movie_id"), SEQ_LEN, 'mean', 'hist_len'),
    ]
    item_feature_columns = [SparseFeat('movie_id', feature_max_index_dict['movie_id'], embedding_dim=4)]
    """
    group_embedding_dict = feature_encode.sparse_feature_dict

    user_emb_name = [fc.embedding_name for fc in user_feature_columns]
    item_emb_name = [fc.embedding_name for fc in item_feature_columns]

    user_dnn_input = [v for k, v in group_embedding_dict['default_group'].items() 
        if k in user_emb_name]
    item_dnn_input = [v for k, v in group_embedding_dict['default_group'].items() 
        if k in item_emb_name]

    return user_dnn_input, item_dnn_input


def DSSM(user_feature_columns, item_feature_columns, dnn_units=[64, 32], 
        temp=10, task='binary'):
    # 构建所有特征的Input层和Embedding层
    feature_encode = FeatureEncoder(user_feature_columns + item_feature_columns)
    feature_input_layers_list = list(feature_encode.feature_input_layer_dict.values())

    # 特征处理
    user_dnn_input, item_dnn_input = process_feature(user_feature_columns,\
        item_feature_columns, feature_encode)

    # 构建模型的核心层
    if len(user_dnn_input) >= 2:
        user_dnn_input = Concatenate(axis=1)(user_dnn_input)
    else:
        user_dnn_input = user_dnn_input[0]
    if len(item_dnn_input) >= 2:
        item_dnn_input = Concatenate(axis=1)(item_dnn_input)
    else:
        item_dnn_input = item_dnn_input[0]

    user_dnn_input = Flatten()(user_dnn_input) 
    item_dnn_input = Flatten()(item_dnn_input)

    user_dnn_out = DNN(dnn_units)(user_dnn_input)
    item_dnn_out = DNN(dnn_units)(item_dnn_input)

    # 计算相似度
    scores = CosinSimilarity(temp)([user_dnn_out, item_dnn_out]) # (B,1)

    # 确定拟合目标
    output = PredictLayer()(scores)

    # 根据输入输出构建模型
    model = Model(feature_input_layers_list, output)
    # model.summary()

    return model 

