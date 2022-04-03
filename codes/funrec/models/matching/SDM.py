from collections import OrderedDict

import tensorflow as tf
from tensorflow.python.keras import backend as K
from tensorflow.keras.layers import *
from tensorflow.keras.models import *
from tensorflow.python.keras.models import Model

# 不用deepctr的feature_column， 在filter选择的时候，怎么选择不出东西？
from deepctr.feature_column import SparseFeat, VarLenSparseFeat, DenseFeat

from layers.utils import build_input_layers, build_embedding_layers, embedding_lookup, concat_func, NoMask, get_item_embedding
from layers.interaction import MultiHeadAttention, UserAttention, AttentionSequencePoolingLayer
from layers.core import SampledSoftmaxLayer, PoolingLayer, EmbeddingIndex
from layers.sequence import DynamicMultiRNN

if tf.__version__ >= '2.0.0':
    tf.compat.v1.disable_eager_execution()


def SDM(user_feature_columns, item_feature_columns, history_feature_list, num_sampled=5, units=32, rnn_layers=2,
        dropout_rate=0.2, rnn_num_res=1, num_head=4, l2_reg_embedding=1e-6, dnn_activation='tanh', seed=1024):
    """
    :param rnn_num_res: rnn的残差层个数
    :param history_feature_list: short和long sequence field
    """
    # item_feature目前只支持doc_id， 再加别的就不行了，其实这里可以改造下
    if (len(item_feature_columns)) > 1:
        raise ValueError("SDM only support 1 item feature like doc_id")

    # 获取item_feature的一些属性
    item_feature_column = item_feature_columns[0]
    item_feature_name = item_feature_column.name
    item_vocabulary_size = item_feature_column.vocabulary_size

    # 为用户特征创建Input层
    user_input_layer_dict = build_input_layers(user_feature_columns)
    item_input_layer_dict = build_input_layers(item_feature_columns)

    # 将Input层转化成列表的形式作为model的输入
    user_input_layers = list(user_input_layer_dict.values())
    item_input_layers = list(item_input_layer_dict.values())

    # 筛选出特征中的sparse特征和dense特征，方便单独处理
    sparse_feature_columns = list \
        (filter(lambda x: isinstance(x, SparseFeat), user_feature_columns)) if user_feature_columns else []
    dense_feature_columns = list \
        (filter(lambda x: isinstance(x, DenseFeat), user_feature_columns)) if user_feature_columns else []
    if len(dense_feature_columns) != 0:
        raise ValueError("SDM dont support dense feature")  # 目前不支持Dense feature
    varlen_feature_columns = list \
        (filter(lambda x: isinstance(x, VarLenSparseFeat), user_feature_columns)) if user_feature_columns else []

    # 构建embedding字典
    embedding_layer_dict = build_embedding_layers(user_feature_columns + item_feature_columns)

    # 拿到短期会话和长期会话列 之前的命名规则在这里起作用
    sparse_varlen_feature_columns = []
    prefer_history_columns = []
    short_history_columns = []

    prefer_fc_names = list(map(lambda x: "prefer_" + x, history_feature_list))
    short_fc_names = list(map(lambda x: "short_" + x, history_feature_list))

    for fc in varlen_feature_columns:
        if fc.name in prefer_fc_names:
            prefer_history_columns.append(fc)
        elif fc.name in short_fc_names:
            short_history_columns.append(fc)
        else:
            sparse_varlen_feature_columns.append(fc)

    # 获取用户的长期行为序列列表 L^u
    # [<tf.Tensor 'emb_prefer_doc_id_2/Identity:0' shape=(None, 50, 32) dtype=float32>, <tf.Tensor 'emb_prefer_cat1_2/Identity:0' shape=(None, 50, 32) dtype=float32>, <tf.Tensor 'emb_prefer_cat2_2/Identity:0' shape=(None, 50, 32) dtype=float32>]
    prefer_emb_list = embedding_lookup(prefer_fc_names, user_input_layer_dict, embedding_layer_dict)
    # 获取用户的短期序列列表 S^u
    # [<tf.Tensor 'emb_short_doc_id_2/Identity:0' shape=(None, 5, 32) dtype=float32>, <tf.Tensor 'emb_short_cat1_2/Identity:0' shape=(None, 5, 32) dtype=float32>, <tf.Tensor 'emb_short_cat2_2/Identity:0' shape=(None, 5, 32) dtype=float32>]
    short_emb_list = embedding_lookup(short_fc_names, user_input_layer_dict, embedding_layer_dict)

    # 用户离散特征的输入层与embedding层拼接 e^u
    user_emb_list = embedding_lookup([col.name for col in sparse_feature_columns], user_input_layer_dict, embedding_layer_dict)
    user_emb = concat_func(user_emb_list)
    user_emb_output = Dense(units, activation=dnn_activation, name='user_emb_output')(user_emb)  # (None, 1, 32)

    # 长期序列行为编码
    # 过AttentionSequencePoolingLayer --> Concat --> DNN
    prefer_sess_length = user_input_layer_dict['prefer_sess_length']
    prefer_att_outputs = []
    # 遍历长期行为序列
    for i, prefer_emb in enumerate(prefer_emb_list):
        prefer_attention_output = AttentionSequencePoolingLayer(dropout_rate=0) \
            ([user_emb_output, prefer_emb, prefer_sess_length])
        prefer_att_outputs.append(prefer_attention_output)
    prefer_att_concat = concat_func \
        (prefer_att_outputs)   # (None, 1, 32) <== Concat(item_embedding，cat1_embedding,cat2_embedding)
    prefer_output = Dense(units, activation=dnn_activation, name='prefer_output')(prefer_att_concat)
    # print(prefer_output.shape)   # (None, 1, 32)

    # 短期行为序列编码
    short_sess_length = user_input_layer_dict['short_sess_length']
    short_emb_concat = concat_func(short_emb_list)   # (None, 5, 64)   这里注意下， 对于短期序列，描述item的side info信息进行了拼接
    short_emb_input = Dense(units, activation=dnn_activation, name='short_emb_input')(short_emb_concat)  # (None, 5, 32)
    # 过rnn 这里的return_sequence=True， 每个时间步都需要输出h
    short_rnn_output = DynamicMultiRNN(num_units=units, return_sequence=True, num_layers=rnn_layers,
                                       num_residual_layers=rnn_num_res,
                                       dropout_rate=dropout_rate)([short_emb_input, short_sess_length])
    # print(short_rnn_output) # (None, 5, 32)
    # 过MultiHeadAttention  # (None, 5, 32)
    short_att_output = MultiHeadAttention(num_units=units, head_num=num_head, dropout_rate=dropout_rate) \
        ([short_rnn_output, short_sess_length]) # (None, 5, 64)
    # user_attention # (None, 1, 32)
    short_output = UserAttention(num_units=units, activation=dnn_activation, use_res=True, dropout_rate=dropout_rate) \
        ([user_emb_output, short_att_output, short_sess_length])

    # 门控融合
    gated_input = concat_func([prefer_output, short_output, user_emb_output])
    gate = Dense(units, activation='sigmoid')(gated_input)   # (None, 1, 32)

    # temp = tf.multiply(gate, short_output) + tf.multiply(1-gate, prefer_output)  感觉这俩一样？
    gated_output = Lambda(lambda x: tf.multiply(x[0], x[1]) + tf.multiply( 1 -x[0], x[2])) \
        ([gate, short_output, prefer_output])  # [None, 1,32]
    gated_output_reshape = Lambda(lambda x: tf.squeeze(x, 1)) \
        (gated_output)  # (None, 32)  这个维度必须要和docembedding层的维度一样，否则后面没法sortmax_loss

    # 接下来
    item_embedding_matrix = embedding_layer_dict[item_feature_name]  # 获取doc_id的embedding层
    item_index = EmbeddingIndex(list(range(item_vocabulary_size))) \
        (item_input_layer_dict[item_feature_name]) # 所有doc_id的索引
    item_embedding_weight = NoMask()(item_embedding_matrix(item_index))  # 拿到所有item的embedding
    pooling_item_embedding_weight = PoolingLayer() \
        ([item_embedding_weight])  # 这里依然是当可能不止item_id，或许还有brand_id, cat_id等，需要池化

    # 这里传入的是整个doc_id的embedding， user_embedding, 以及用户点击的doc_id，然后去进行负采样计算损失操作
    output = SampledSoftmaxLayer(num_sampled) \
        ([pooling_item_embedding_weight, gated_output_reshape, item_input_layer_dict[item_feature_name]])

    model = Model(inputs=user_input_layers +item_input_layers, outputs=output)

    # 下面是等模型训练完了之后，获取用户和item的embedding
    model.__setattr__("user_input", user_input_layers)
    model.__setattr__("user_embedding", gated_output_reshape)  # 用户embedding是取得门控融合的用户向量
    model.__setattr__("item_input", item_input_layers)
    # item_embedding取得pooling_item_embedding_weight, 这个会发现是负采样操作训练的那个embedding矩阵
    model.__setattr__("item_embedding", get_item_embedding(pooling_item_embedding_weight, item_input_layer_dict[item_feature_name]))

    return model