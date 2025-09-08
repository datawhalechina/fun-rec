"""
BiasedSVD 模型实现

这实现了带偏置的奇异值分解 (SVD) 协同过滤模型。
该模型学习用户和物品的潜在因子以及用户、物品和全局偏置来预测用户-物品交互。

评分预测: r_ui = global_bias + user_bias_u + item_bias_i + p_u^T * q_i
其中 p_u 是用户潜在因子向量，q_i 是物品潜在因子向量，
偏置项用于考虑一般的评分倾向。
"""

import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, Embedding, Flatten, Dot, Add, Input

from .utils import build_input_layer


def build_biassvd_model(feature_columns, model_config):
    """
    构建 BiasedSVD 协同过滤模型 - 用于召回的双塔结构。

    BiasedSVD 基于: Rating = global_bias + user_bias + item_bias + user_factors · item_factors^T

    参数:
        feature_columns: 特征列配置
        model_config: 模型配置字典，包含:
            - embedding_dim: 嵌入维度 (对应 SVD 中的潜在因子数量) (默认: 8)

    返回:
        (training_model, user_model, item_model) 元组
    """

    # 从配置中提取参数，设置默认值
    embedding_dim = model_config.get("embedding_dim", 8)

    # 构建输入层
    input_layer_dict = build_input_layer(feature_columns)

    # 查找用户和物品 ID 输入
    user_id_input = None
    item_id_input = None
    user_inputs = []
    item_inputs = []
    user_vocab_size = None
    item_vocab_size = None

    for fc in feature_columns:
        if "user" in fc.group:
            user_inputs.append(input_layer_dict[fc.name])
            if fc.name == "user_id":
                user_id_input = input_layer_dict[fc.name]
                user_vocab_size = fc.vocab_size
        elif "item" in fc.group:
            item_inputs.append(input_layer_dict[fc.name])
            if fc.name in ["movie_id", "item_id"]:
                item_id_input = input_layer_dict[fc.name]
                item_vocab_size = fc.vocab_size

    if user_id_input is None or item_id_input is None:
        raise ValueError("需要 user_id 和 item_id (或 movie_id) 输入")

    # === 用户塔 ===
    # 用户潜在因子
    user_factors = Embedding(
        user_vocab_size,
        embedding_dim,
        embeddings_initializer="normal",
        embeddings_regularizer=tf.keras.regularizers.l2(0.02),
        name="user_factors",
    )(user_id_input)
    user_factors = Flatten()(user_factors)

    # 用户偏置
    user_bias = Embedding(
        user_vocab_size,
        1,
        embeddings_initializer="zeros",
        embeddings_regularizer=tf.keras.regularizers.l2(0.02),
        name="user_bias",
    )(user_id_input)
    user_bias = Flatten()(user_bias)

    # 用户表示: [因子, 偏置]
    user_representation = tf.keras.layers.Concatenate()([user_factors, user_bias])

    # === 物品塔 ===
    # 物品潜在因子
    item_factors = Embedding(
        item_vocab_size,
        embedding_dim,
        embeddings_initializer="normal",
        embeddings_regularizer=tf.keras.regularizers.l2(0.02),
        name="item_factors",
    )(item_id_input)
    item_factors = Flatten()(item_factors)

    # 物品偏置
    item_bias = Embedding(
        item_vocab_size,
        1,
        embeddings_initializer="zeros",
        embeddings_regularizer=tf.keras.regularizers.l2(0.02),
        name="item_bias",
    )(item_id_input)
    item_bias = Flatten()(item_bias)

    # 物品表示: [因子, 偏置]
    item_representation = tf.keras.layers.Concatenate()([item_factors, item_bias])

    # === 独立的用户和物品模型 ===
    user_model = Model(
        inputs=user_inputs, outputs=user_representation, name="user_tower"
    )
    item_model = Model(
        inputs=item_inputs, outputs=item_representation, name="item_tower"
    )

    # === 训练模型 ===
    # 计算交互项: user_factors · item_factors
    interaction = Dot(axes=1)([user_factors, item_factors])

    # 全局偏置 - 使用带常数输入的 Dense 层的简单方法
    ones_input = tf.keras.layers.Lambda(lambda x: tf.ones_like(x))(interaction)
    global_bias = Dense(
        1, use_bias=True, kernel_initializer="zeros", name="global_bias"
    )(ones_input)

    # BiasedSVD 预测: global_bias + user_bias + item_bias + interaction
    prediction = Add()([global_bias, user_bias, item_bias, interaction])

    # 输出层
    output = Dense(1, activation="sigmoid", name="output")(prediction)

    # 训练模型
    training_model = Model(
        inputs=user_inputs + item_inputs, outputs=output, name="biassvd_training"
    )

    return training_model, user_model, item_model
