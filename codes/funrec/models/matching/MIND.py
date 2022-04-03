import tensorflow as tf
from tensorflow.python.keras import backend as K
from tensorflow.keras.layers import *
from tensorflow.keras.models import *
from tensorflow.python.keras.models import Model

# 不用deepctr的feature_column， 在filter选择的时候，怎么选择不出东西？
from deepctr.feature_column import SparseFeat, VarLenSparseFeat, DenseFeat

from layers.utils import build_input_layers, build_embedding_layers, embedding_lookup, combined_dnn_input, NoMask, get_item_embedding
from layers.interaction import LabelAwareAttention, CapsuleLayer
from layers.core import SampledSoftmaxLayer, PoolingLayer, EmbeddingIndex, DNN

def tile_user_otherfeat(user_other_feature, k_max):
    return tf.tile(tf.expand_dims(user_other_feature, -2), [1, k_max, 1])


def MIND(user_feature_columns, item_feature_columns, num_sampled=5, k_max=2, p=1.0, dynamic_k=False, user_dnn_hidden_units=(64, 32),
         dnn_activation='relu', dnn_use_bn=False, l2_reg_dnn=0, l2_reg_embedding=1e-6, dnn_dropout=0, output_activation='linear', seed=1024):
    """
        :param k_max: 用户兴趣胶囊的最大个数
    """
    # 目前这里只支持item_feature_columns为1的情况，即只能转入item_id
    if len(item_feature_columns) > 1:
        raise ValueError("Now MIND only support 1 item feature like item_id")

    # 获取item相关的配置参数
    item_feature_column = item_feature_columns[0]
    item_feature_name = item_feature_column.name
    item_vocabulary_size = item_feature_column.vocabulary_size
    item_embedding_dim = item_feature_column.embedding_dim

    behavior_feature_list = [item_feature_name]

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
    varlen_feature_columns = list \
        (filter(lambda x: isinstance(x, VarLenSparseFeat), user_feature_columns)) if user_feature_columns else []

    # 由于这个变长序列里面只有历史点击文章，没有类别啥的，所以这里直接可以用varlen_feature_columns
    # deepctr这里单独把点击文章这个放到了history_feature_columns
    seq_max_len = varlen_feature_columns[0].maxlen

    # 构建embedding字典
    embedding_layer_dict = build_embedding_layers(user_feature_columns +item_feature_columns)

    # 获取当前的行为特征(doc)的embedding，这里面可能又多个类别特征，所以需要pooling下
    query_embed_list = embedding_lookup(behavior_feature_list, item_input_layer_dict, embedding_layer_dict)  # 长度为1
    # 获取行为序列(doc_id序列, hist_doc_id) 对应的embedding，这里有可能有多个行为产生了行为序列，所以需要使用列表将其放在一起
    keys_embed_list = embedding_lookup([varlen_feature_columns[0].name], user_input_layer_dict, embedding_layer_dict)  # 长度为1

    # 用户离散特征的输入层与embedding层拼接
    dnn_input_emb_list = embedding_lookup([col.name for col in sparse_feature_columns], user_input_layer_dict, embedding_layer_dict)

    # 获取dense
    dnn_dense_input = []
    for fc in dense_feature_columns:
        if fc.name != 'hist_len':  # 连续特征不要这个
            dnn_dense_input.append(user_input_layer_dict[fc.name])

    # 把keys_emb_list和query_emb_listpooling操作， 这是因为可能每个商品不仅有id，还可能用类别，品牌等多个embedding向量，这种需要pooling成一个
    history_emb = PoolingLayer()(NoMask()(keys_embed_list))  # (None, 50, 8)
    target_emb = PoolingLayer()(NoMask()(query_embed_list))   # (None, 1, 8)

    hist_len = user_input_layer_dict['hist_len']
    # 胶囊网络
    # (None, 2, 8) 得到了两个兴趣胶囊
    high_capsule = CapsuleLayer(input_units=item_embedding_dim, out_units=item_embedding_dim,
                                max_len=seq_max_len, k_max=k_max)((history_emb, hist_len))  # 【5, 7, 8, 9】

    # 把用户的其他特征拼接到胶囊网络上来
    if len(dnn_input_emb_list) > 0 or len(dnn_dense_input) > 0:
        user_other_feature = combined_dnn_input(dnn_input_emb_list, dnn_dense_input)
        # (None, 2, 32)   这里会发现其他的用户特征是每个胶囊复制了一份，然后拼接起来
        other_feature_tile = tf.keras.layers.Lambda(tile_user_otherfeat, arguments={'k_max': k_max})(user_other_feature)
        user_deep_input = Concatenate()([NoMask()(other_feature_tile), high_capsule]) # (None, 2, 40)
    else:
        user_deep_input = high_capsule

    # 接下来过一个DNN层，获取最终的用户表示向量 如果是三维输入， 那么最后一个维度与w相乘，所以这里如果不自己写，可以用Dense层的列表也可以
    user_embeddings = DNN(user_dnn_hidden_units, dnn_activation)(user_deep_input)  # (None, 2, 8)
    # 接下来，过Label-aware layer
    if dynamic_k:
        user_embedding_final = LabelAwareAttention(k_max=k_max, pow_p=p)((user_embeddings, target_emb, hist_len))
    else:
        user_embedding_final = LabelAwareAttention(k_max=k_max, pow_p=p)((user_embeddings, target_emb))

    # 接下来
    item_embedding_matrix = embedding_layer_dict[item_feature_name]  # 获取doc_id的embedding层
    item_index = EmbeddingIndex(list(range(item_vocabulary_size))) \
        (item_input_layer_dict[item_feature_name]) # 所有doc_id的索引
    item_embedding_weight = NoMask()(item_embedding_matrix(item_index))  # 拿到所有item的embedding
    pooling_item_embedding_weight = PoolingLayer() \
        ([item_embedding_weight])  # 这里依然是当可能不止item_id，或许还有brand_id, cat_id等，需要池化

    # 这里传入的是整个doc_id的embedding， user_embedding, 以及用户点击的doc_id，然后去进行负采样计算损失操作
    output = SampledSoftmaxLayer(num_sampled) \
        ([pooling_item_embedding_weight, user_embedding_final, item_input_layer_dict[item_feature_name]])

    model = Model(inputs=user_input_layers + item_input_layers, outputs=output)

    # 下面是等模型训练完了之后，获取用户和item的embedding
    model.__setattr__("user_input", user_input_layers)
    model.__setattr__("user_embedding", user_embeddings)
    model.__setattr__("item_input", item_input_layers)
    model.__setattr__("item_embedding", get_item_embedding(pooling_item_embedding_weight, item_input_layer_dict[item_feature_name]))

    return model