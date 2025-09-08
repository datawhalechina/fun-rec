import tensorflow as tf

from .utils import (
    build_input_layer,
    build_group_feature_embedding_table_dict,
    concat_group_embedding,
    add_tensor_func,
    get_linear_logits,
    get_cross_logits,
)
from .layers import PredictLayer, DNNs


def build_wide_deep_model(feature_columns, model_config):
    """
    构建Wide&Deep模型

    参数:
    feature_columns: 特征列配置
    model_config: 模型配置字典，包含:
        - dnn_units: DNN层单元数 (默认: [64, 32])
        - dnn_dropout_rate: 丢弃概率 (默认: 0.1)
    """
    # 从配置中提取参数并设置默认值
    dnn_units = model_config.get("dnn_units", [64, 32])
    dnn_dropout_rate = model_config.get("dnn_dropout_rate", 0.1)
    # 构建输入层
    input_layer_dict = build_input_layer(feature_columns)

    # 构建特征embedding表
    group_embedding_feature_dict = build_group_feature_embedding_table_dict(
        feature_columns, input_layer_dict, prefix="embedding/"
    )

    # 拼接组特征
    group_feature_dict = {}
    for group_name, _ in group_embedding_feature_dict.items():
        group_feature_dict[group_name] = concat_group_embedding(
            group_embedding_feature_dict, group_name, axis=1, flatten=True
        )  # B x (N * D)

    # 深度部分输出
    deep_logits = []
    for group_name, group_feature in group_feature_dict.items():
        deep_out = DNNs(
            units=dnn_units, activation="relu", dropout_rate=dnn_dropout_rate
        )(group_feature)
        deep_logit = tf.keras.layers.Dense(1, activation=None)(
            deep_out
        )  # 保持为 (B, 1)
        deep_logits.append(deep_logit)

    # 宽度部分输出
    linear_logit = get_linear_logits(input_layer_dict, feature_columns)
    cross_logit = get_cross_logits(input_layer_dict, feature_columns)

    # 构建模型
    wide_deep_logits = add_tensor_func(deep_logits + [linear_logit, cross_logit])
    # 展平以确保输出为 (batch_size,) 用于二分类
    wide_deep_logits = tf.keras.layers.Flatten()(wide_deep_logits)
    output = tf.keras.layers.Dense(1, activation="sigmoid", name="wide_deep_output")(
        wide_deep_logits
    )
    output = tf.keras.layers.Flatten()(output)  # 确保最终输出为 (batch_size,)
    model = tf.keras.Model(inputs=list(input_layer_dict.values()), outputs=output)

    # 排序模型返回 (model, None, None)，因为没有单独的用户/物品模型
    return model, None, None
