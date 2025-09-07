"""
Model utilities for building neural networks.
"""

from collections import OrderedDict
import tensorflow as tf
from tensorflow.keras.layers import Input, Embedding
from .layers import SequenceMeanPoolingLayer, BiasOnly


def build_input_layer(feature_columns, prefix=""):
    """构建输入层

    Args:
        feature_columns (list): 特征列列表
        prefix (str): 前缀，用于区分不同模型的输入层名称

    Returns:
        OrderedDict: 输入层字典，键为特征名称，值为对应的输入层
    """
    input_layer_dict = OrderedDict()
    for fc in feature_columns:
        if fc.type == "dense":
            if fc.max_len > 1:
                input_layer_dict[fc.name] = Input(
                    shape=(fc.max_len, fc.dimension),
                    name=prefix + fc.name,
                    dtype=fc.dtype,
                )
            else:
                input_layer_dict[fc.name] = Input(
                    shape=(fc.dimension,), name=prefix + fc.name, dtype=fc.dtype
                )
        else:
            input_layer_dict[fc.name] = Input(
                shape=(fc.max_len,), name=prefix + fc.name, dtype=fc.dtype
            )
    return input_layer_dict


def build_embedding_table_dict(feature_columns, prefix=""):
    embedding_table_dict = OrderedDict()
    for fc in feature_columns:
        if fc.type in ["sparse", "varlen_sparse"]:
            mask_zero = True if fc.type == "varlen_sparse" else False
            if isinstance(fc.emb_name, str) and fc.emb_name not in embedding_table_dict:
                embedding_table_dict[fc.emb_name] = Embedding(
                    input_dim=fc.vocab_size,
                    output_dim=fc.emb_dim if "linear" not in prefix else 1,
                    name=prefix + fc.emb_name,
                    embeddings_initializer=fc.initializer,
                    embeddings_regularizer=tf.keras.regularizers.l2(fc.l2_reg),
                    trainable=fc.trainable,
                    mask_zero=mask_zero,
                )
            elif isinstance(fc.emb_name, list):
                for emb_name in fc.emb_name:
                    if emb_name not in embedding_table_dict:
                        embedding_table_dict[emb_name] = Embedding(
                            input_dim=fc.vocab_size,
                            output_dim=fc.emb_dim if "linear" not in prefix else 1,
                            name=prefix + emb_name,
                            embeddings_initializer=fc.initializer,
                            embeddings_regularizer=tf.keras.regularizers.l2(fc.l2_reg),
                            trainable=fc.trainable,
                            mask_zero=mask_zero,
                        )
    return embedding_table_dict


def parse_group_feature_columns(feature_columns):
    """解析特征列，按组分类

    Args:
        feature_columns (list): 特征列列表

    Returns:
        dict: 特征列按组分类的字典
    """
    group_feature_columns = {}
    for fc in feature_columns:
        for group in fc.group:
            if group == "linear":
                continue
            if group not in group_feature_columns:
                group_feature_columns[group] = []
            group_feature_columns[group].append(fc)
    return group_feature_columns


def build_group_feature_embedding_table_dict(
    feature_columns, input_layer_dict, prefix="", return_embedding_table=False
):
    """按组构建embedding表

    Args:
        feature_columns (list): 特征列列表
        prefix (str): 前缀，用于区分不同模型的embedding表名称

    Returns:
        dict: 按组分类的embedding表字典
    """
    group_feature_columns = parse_group_feature_columns(feature_columns)
    embedding_table_dict = build_embedding_table_dict(feature_columns, prefix=prefix)
    group_embedding_feature_dict = OrderedDict()
    for group_name, group_feature_column in group_feature_columns.items():
        for fc in group_feature_column:
            # 设置为emb_name设置为None的特征没有embedding
            if fc.emb_name is None:
                continue
            if isinstance(fc.emb_name, str):
                embedding_table = embedding_table_dict[fc.emb_name]
            elif isinstance(fc.emb_name, list):
                group_emb_name = group_name + "/" + fc.name
                embedding_table = embedding_table_dict[group_emb_name]
            else:
                pass
            if fc.type == "sparse":
                if group_name not in group_embedding_feature_dict:
                    group_embedding_feature_dict[group_name] = []
                group_embedding_feature_dict[group_name].append(
                    embedding_table(input_layer_dict[fc.name])
                )
            elif fc.type == "varlen_sparse":
                embed_list = embedding_table(input_layer_dict[fc.name])
                if fc.combiner is None:  # 不进行聚合，返回原始序列特征
                    if group_name not in group_embedding_feature_dict:
                        group_embedding_feature_dict[group_name] = {}
                    group_embedding_feature_dict[group_name][fc.name] = embed_list
                    continue

                # Initialize group if it doesn't exist and we have combiners that need list structure
                # Only apply mean combiner to non-sequence groups (not din_sequence, dien_sequence, mha, etc.)
                if (
                    ("mean" in fc.combiner)
                    and (group_name not in group_embedding_feature_dict)
                    and ("_sequence" not in group_name)
                ):
                    group_embedding_feature_dict[group_name] = []

                if ("mean" in fc.combiner) and ("_sequence" not in group_name):
                    pooling_emb = SequenceMeanPoolingLayer(keep_shape=True)(
                        embed_list
                    )  # Bx1xD
                    group_embedding_feature_dict[group_name].append(pooling_emb)
                if "din" in fc.combiner:
                    if "din_sequence" not in group_embedding_feature_dict:
                        group_embedding_feature_dict["din_sequence"] = {}
                    group_embedding_feature_dict["din_sequence"][fc.name] = embed_list
                    group_embedding_feature_dict["din_sequence"][fc.att_key_name] = (
                        embedding_table_dict[fc.emb_name](
                            input_layer_dict[fc.att_key_name]
                        )
                    )
                if "mha" in fc.combiner:
                    if "mha" not in group_embedding_feature_dict:
                        group_embedding_feature_dict["mha"] = {}
                    group_embedding_feature_dict["mha"][fc.name] = embed_list
                if "dien" in fc.combiner:
                    if "dien_sequence" not in group_embedding_feature_dict:
                        group_embedding_feature_dict["dien_sequence"] = {}
                    group_embedding_feature_dict["dien_sequence"][fc.name] = embed_list
                    group_embedding_feature_dict["dien_sequence"][fc.att_key_name] = (
                        embedding_table_dict[fc.emb_name](
                            input_layer_dict[fc.att_key_name]
                        )
                    )
    if return_embedding_table:
        return group_embedding_feature_dict, embedding_table_dict
    return group_embedding_feature_dict


def concat_group_embedding(
    group_embedding_feature_dict, group_name, axis=-1, flatten=True
):
    group_embedding = group_embedding_feature_dict[group_name]
    if isinstance(group_embedding, dict):
        group_embedding_list = list(group_embedding.values())
    else:
        group_embedding_list = group_embedding
    if len(group_embedding_list) == 1:
        if flatten:
            return tf.keras.layers.Flatten()(group_embedding_list[0])
        return group_embedding_list[0]
    else:
        concatenated = tf.keras.layers.Concatenate(axis=axis)(group_embedding_list)
        if flatten:
            return tf.keras.layers.Flatten()(concatenated)
        return concatenated


def pooling_group_embedding(
    group_embedding_feature_dict, group_name, pooling_type="mean", keep_shape=False
):
    """对指定组的嵌入特征进行池化操作

    Args:
        group_embedding_feature_dict (dict): 按组分类的嵌入特征字典
        group_name (str): 需要池化的组名称
        pooling_type (str): 池化类型，默认为'mean'
        keep_shape (bool): 是否保持输出形状，默认为False

    Returns:
        tf.Tensor: 池化后的嵌入特征
    """
    group_embeddings = group_embedding_feature_dict[
        group_name
    ]  # BxNxD, BxNxD => BxNxDx2
    if isinstance(group_embeddings, dict):
        group_embedding_list = group_embeddings.values()
    else:
        group_embedding_list = group_embeddings
    group_embedding_list = [
        tf.keras.layers.Lambda(lambda x: tf.expand_dims(x, axis=-1))(x)
        for x in group_embedding_list
    ]
    group_embedding = tf.keras.layers.Concatenate(axis=-1)(group_embedding_list)
    if pooling_type == "mean":
        pooled_embedding = tf.keras.layers.Lambda(
            lambda x: tf.reduce_mean(x, axis=-1, keepdims=keep_shape)
        )(group_embedding)
    return pooled_embedding


def add_tensor_func(tensor_list, name=None):
    """Add tensors together using Keras layers.

    Args:
        tensor_list (list): List of tensors to add
        name (str): Name for the layer

    Returns:
        tf.Tensor: Sum of input tensors
    """
    if len(tensor_list) == 1:
        return (
            tensor_list[0]
            if name is None
            else tf.keras.layers.Identity(name=name)(tensor_list[0])
        )
    else:
        return tf.keras.layers.Add(name=name)(tensor_list)


def get_linear_logits(
    input_layer_dict, feature_columns, use_bias=False, name="linear_logits"
):
    """获取线性部分的logits

    Args:
        input_layer_dict (OrderedDict): 输入层字典
        feature_columns (list): 特征列列表
        use_bias (bool): 是否使用bias
        name (str): 层名称

    Returns:
        tf.Tensor: 线性部分的logits
    """
    linear_embedding_feature_columns = [
        fc
        for fc in feature_columns
        if "linear" in fc.group and fc.type in ["sparse", "varlen_sparse"]
    ]
    linear_embedding_table_dict = build_embedding_table_dict(
        linear_embedding_feature_columns, prefix="linear/"
    )
    linear_embedding_list = []
    for fc in linear_embedding_feature_columns:
        if fc.type == "sparse":
            linear_embedding_list.append(
                linear_embedding_table_dict[fc.emb_name](input_layer_dict[fc.name])
            )
        elif fc.type == "varlen_sparse":
            embed_list = linear_embedding_table_dict[fc.emb_name](
                input_layer_dict[fc.name]
            )
            if fc.combiner == "mean":
                pooling_emb = SequenceMeanPoolingLayer()(embed_list)
            linear_embedding_list.append(pooling_emb)
    linear_dense_feature_columns = [
        fc for fc in feature_columns if "linear" in fc.group and fc.type == "dense"
    ]
    if len(linear_dense_feature_columns) > 0:
        linear_dense_list = []
        for fc in linear_dense_feature_columns:
            linear_dense_list.append(input_layer_dict[fc.name])
        linear_dense_feature = tf.keras.layers.Concatenate(axis=1)(linear_dense_list)
        linear_dense_feature = tf.keras.layers.Dense(
            linear_dense_feature.get_shape().as_list()[-1],
            activation=None,
            name="linear_dense",
        )(linear_dense_feature)
        linear_embedding_list.append(linear_dense_feature)

    if len(linear_embedding_list) == 0:
        # If no linear features, return zero tensor
        batch_size = tf.shape(list(input_layer_dict.values())[0])[0]
        linear_logits = tf.zeros([batch_size, 1])
    else:
        linear_embedding_feature = tf.keras.layers.Concatenate(axis=1)(
            linear_embedding_list
        )
        linear_logits = tf.keras.layers.Lambda(
            lambda x: tf.reduce_sum(x, axis=1, keepdims=True)
        )(linear_embedding_feature)

    if use_bias:
        linear_logits = BiasOnly(1)(linear_logits)
    linear_logits = tf.keras.layers.Identity(name=name)(linear_logits)
    return linear_logits


def pairwise_feature_interactions(group_feature, drop_rate=0.1):
    """
    Args:
        group_feature: B x N x D
        drop_rate: dropout rate

    Returns:
        B x num_interactions x D
    """
    pairwise_interactions = []
    n = group_feature.shape[1]
    for i in range(n):
        for j in range(i + 1, n):
            # 特征i和特征j的元素级乘积
            element_wise_product = tf.multiply(
                group_feature[:, i, :], group_feature[:, j, :]
            )  # B x D
            # 扩展维度以便后续连接
            element_wise_product = tf.expand_dims(
                element_wise_product, axis=1
            )  # B x 1 x D
            pairwise_interactions.append(element_wise_product)
    output = tf.concat(pairwise_interactions, axis=1)  # B x num_interactions x D
    output = tf.keras.layers.Dropout(drop_rate)(output)
    return output


def parse_din_feature_columns(feature_columns):
    din_feature_columns = []
    for fc in feature_columns:
        if fc.type == "varlen_sparse" and "din" in fc.combiner:
            kv_list = [fc.att_key_name, fc.name]
            din_feature_columns.append(kv_list)
    return din_feature_columns


def parse_dien_feature_columns(feature_columns):
    """Parse DIEN feature columns to extract (target, sequence) pairs.

    Args:
        feature_columns: List of feature column specifications

    Returns:
        dien_feature_list: List of (target_feature, sequence_feature) pairs
    """
    dien_feature_columns = []
    for fc in feature_columns:
        if fc.type == "varlen_sparse" and "dien" in fc.combiner:
            kv_list = [fc.att_key_name, fc.name]
            dien_feature_columns.append(kv_list)
    return dien_feature_columns


def get_cross_logits(
    input_layer_dict, feature_columns, use_bias=False, name="cross_logits"
):
    """获取2阶交叉特征的logits (类似线性embedding，但用于特征交叉)

    Args:
        input_layer_dict (OrderedDict): 输入层字典
        feature_columns (list): 特征列列表
        use_bias (bool): 是否使用bias
        name (str): 层名称

    Returns:
        tf.Tensor: 2阶交叉特征的logits
    """
    # 获取用于交叉的特征列（稀疏特征）
    cross_feature_columns = [
        fc for fc in feature_columns if "cross" in fc.group and fc.type == "sparse"
    ]

    if len(cross_feature_columns) < 2:
        # 如果特征数量少于2个，无法进行交叉，返回零张量
        batch_size = tf.shape(list(input_layer_dict.values())[0])[0]
        return tf.zeros([batch_size, 1], name=name)

    cross_weights = []

    # 计算所有特征对的交叉
    for i in range(len(cross_feature_columns)):
        for j in range(i + 1, len(cross_feature_columns)):
            fc_i = cross_feature_columns[i]
            fc_j = cross_feature_columns[j]

            # 获取两个特征的输入
            feat_i = input_layer_dict[fc_i.name]  # [B, 1]
            feat_j = input_layer_dict[fc_j.name]  # [B, 1]

            # 计算交叉特征的vocab size (笛卡尔积)
            cross_vocab_size = fc_i.vocab_size * fc_j.vocab_size

            # 创建交叉特征的1D embedding表 (标量权重)
            cross_embedding = Embedding(
                input_dim=cross_vocab_size,
                output_dim=1,  # 1维输出，就是标量权重
                name=f"cross_{fc_i.name}_{fc_j.name}",
                embeddings_initializer="zeros",  # 初始化为0
                embeddings_regularizer=tf.keras.regularizers.l2(
                    max(fc_i.l2_reg, fc_j.l2_reg)
                ),
                trainable=True,
            )

            # 将特征对 (feat_i, feat_j) 组合成单一索引
            # combined_index = feat_i * vocab_size_j + feat_j
            combined_index = feat_i * fc_j.vocab_size + feat_j  # [B, 1]

            # 通过embedding层获取交叉特征的权重
            cross_weight = cross_embedding(combined_index)  # [B, 1, 1]
            cross_weight = tf.squeeze(cross_weight, axis=-1)  # [B, 1]

            cross_weights.append(cross_weight)

    if len(cross_weights) == 0:
        # 如果没有交叉特征，返回零张量
        batch_size = tf.shape(list(input_layer_dict.values())[0])[0]
        return tf.zeros([batch_size, 1], name=name)

    # 将所有交叉权重相加得到最终的cross logits
    if len(cross_weights) == 1:
        cross_logits = cross_weights[0]
    else:
        cross_logits = tf.keras.layers.Add()(cross_weights)

    # 可选的bias
    if use_bias:
        cross_logits = BiasOnly(1)(cross_logits)

    cross_logits = tf.keras.layers.Identity(name=name)(cross_logits)
    return cross_logits


def concat_func(x_list, axis, flatten=False):
    if len(x_list) == 1:
        return x_list[0] if not flatten else tf.keras.layers.Flatten()(x_list[0])
    else:
        concat_output = tf.keras.layers.Concatenate(axis=axis)(x_list)
        if flatten:
            concat_output = tf.keras.layers.Flatten()(concat_output)
    return concat_output
