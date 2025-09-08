import tensorflow as tf

from .utils import (
    concat_group_embedding,
    build_input_layer,
    build_group_feature_embedding_table_dict,
)
from .layers import DNNs, PredictLayer


def build_dssm_model(feature_columns, model_config):
    """
    构建双塔模型

    参数:
    feature_columns: 特征列配置
    model_config: 模型配置字典，包含:
        - dnn_units: 物品和用户塔的层单元数 (default: [128, 64, 32])
        - dropout_rate: 丢弃概率 (default: 0.2)
    """
    # Extract parameters from config with defaults
    dnn_units = model_config.get("dnn_units", [128, 64, 32])
    dropout_rate = model_config.get("dropout_rate", 0.2)
    # 构建输入层
    input_layer_dict = build_input_layer(feature_columns)

    # 构建特征embedding表
    group_embedding_feature_dict = build_group_feature_embedding_table_dict(
        feature_columns, input_layer_dict, prefix="embedding/"
    )

    # 拼接特征
    user_feature = concat_group_embedding(
        group_embedding_feature_dict, "user", axis=1, flatten=True
    )  # B x (N*D)
    item_feature = concat_group_embedding(
        group_embedding_feature_dict, "item", axis=1, flatten=True
    )  # B x (N*D)

    # 构建用户塔和物品塔
    user_tower = DNNs(
        units=dnn_units, activation="tanh", dropout_rate=dropout_rate, use_bn=True
    )(user_feature)
    item_tower = DNNs(
        units=dnn_units, activation="tanh", dropout_rate=dropout_rate, use_bn=True
    )(item_feature)

    # 获取用户和物品的embedding
    user_embedding = tf.keras.layers.Lambda(lambda x: tf.nn.l2_normalize(x, axis=1))(
        user_tower
    )
    item_embedding = tf.keras.layers.Lambda(lambda x: tf.nn.l2_normalize(x, axis=1))(
        item_tower
    )

    # 计算余弦相似度
    cosine_similarity = tf.keras.layers.Dot(axes=1)([user_embedding, item_embedding])

    user_input_layer_dict = {
        fc.name: input_layer_dict[fc.name]
        for fc in feature_columns
        if "user" in fc.group
    }
    user_model = tf.keras.Model(inputs=user_input_layer_dict, outputs=user_embedding)

    item_input_layer_dict = {
        fc.name: input_layer_dict[fc.name]
        for fc in feature_columns
        if "item" in fc.group
    }
    item_model = tf.keras.Model(inputs=item_input_layer_dict, outputs=item_embedding)

    # 构建输出层
    output = PredictLayer(name="dssm_output")(cosine_similarity)
    model = tf.keras.Model(inputs=input_layer_dict, outputs=output)
    return model, user_model, item_model
