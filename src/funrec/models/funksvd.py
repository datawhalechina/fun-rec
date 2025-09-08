"""
FunkSVD 模型实现

这实现了基本的奇异值分解（SVD）协同过滤模型，不包含偏置项，也称为 FunkSVD。
该模型学习用户和物品的潜在因子来预测用户-物品交互。

评分预测：r_ui = p_u^T * q_i
其中 p_u 是用户潜在因子向量，q_i 是物品潜在因子向量。
"""

import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, Embedding, Flatten, Dot, Input

from .utils import build_input_layer


def build_funksvd_model(feature_columns, model_config):
    """
    构建 FunkSVD 协同过滤模型 - 用于召回的双塔结构。

    FunkSVD 基于：评分 = 用户因子 · 物品因子^T

    Args:
        feature_columns: 特征列配置
        model_config: 模型配置字典，包含：
            - embedding_dim: 嵌入维度（对应 SVD 中的潜在因子数量）（默认：8）

    Returns:
        返回 (训练模型, 用户模型, 物品模型) 的元组
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
        raise ValueError("需要 user_id 和 item_id（或 movie_id）输入")

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

    # === 独立的用户和物品模型 ===
    user_model = Model(inputs=user_inputs, outputs=user_factors, name="user_tower")
    item_model = Model(inputs=item_inputs, outputs=item_factors, name="item_tower")

    # === 训练模型 ===
    # 仅交互项（无偏置项）
    prediction = Dot(axes=1)([user_factors, item_factors])

    # 输出层
    output = Dense(1, activation="sigmoid", name="output")(prediction)

    # 训练模型
    training_model = Model(
        inputs=user_inputs + item_inputs, outputs=output, name="funksvd_training"
    )

    return training_model, user_model, item_model
