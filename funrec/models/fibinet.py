import tensorflow as tf

from .utils import (
    build_input_layer,
    build_group_feature_embedding_table_dict,
    concat_group_embedding,
    add_tensor_func,
    get_linear_logits,
)
from .layers import DNNs, SENetLayer, BilinearInteractionLayer


def build_fibinet_model(feature_columns, model_config):
    """
    构建 FiBiNET（特征重要性和双线性特征交互网络）排序模型。

    Args:
        feature_columns: FeatureColumn 列表
        model_config: 包含参数的字典：
            - dnn_units: list，DNN 隐藏层单元数（默认 [64, 32]）
            - senet_reduction_ratio: int，SENet 压缩比例（默认 3）
            - bilinear_type: str，双线性交互类型（默认 "interaction"）
            - use_bn: bool，是否使用批归一化（默认 False）
            - dropout_rate: float，dropout 比例（默认 0.0）
            - linear_logits: bool，是否添加线性项（默认 True）

    Returns:
        (model, None, None): 排序模型元组
    """
    dnn_units = model_config.get("dnn_units", [64, 32])
    senet_reduction_ratio = model_config.get("senet_reduction_ratio", 3)
    bilinear_type = model_config.get("bilinear_type", "interaction")
    use_bn = model_config.get("use_bn", False)
    dropout_rate = model_config.get("dropout_rate", 0.0)
    linear_logits = model_config.get("linear_logits", True)

    # 输入层
    input_layer_dict = build_input_layer(feature_columns)

    # 分组嵌入 B x N x D
    group_embedding_feature_dict = build_group_feature_embedding_table_dict(
        feature_columns, input_layer_dict, prefix="embedding/"
    )

    interaction_outputs = []
    for (
        group_feature_name,
        group_feature_embedding,
    ) in group_embedding_feature_dict.items():
        if group_feature_name.startswith("fibinet"):
            # 获取特征嵌入 B x N x D
            group_feature = concat_group_embedding(
                group_embedding_feature_dict, group_feature_name, axis=1, flatten=False
            )

            # SENet 特征增强
            senet_enhanced_features = SENetLayer(reduction_ratio=senet_reduction_ratio)(
                group_feature
            )

            # 原始特征的双线性交互
            bilinear_interaction = BilinearInteractionLayer(
                bilinear_type=bilinear_type
            )(group_feature)

            # SENet 增强特征的双线性交互
            bilinear_senet_interaction = BilinearInteractionLayer(
                bilinear_type=bilinear_type
            )(senet_enhanced_features)

            # 展平交互输出
            bilinear_flat = tf.keras.layers.Flatten()(bilinear_interaction)
            bilinear_senet_flat = tf.keras.layers.Flatten()(bilinear_senet_interaction)

            # 连接所有展平的特征
            interaction_outputs.extend([bilinear_flat, bilinear_senet_flat])

    if len(interaction_outputs) > 1:
        interaction_outputs = tf.concat(interaction_outputs, axis=-1)
    else:
        interaction_outputs = interaction_outputs[0]

    # 深度神经网络
    dnn_out = DNNs(
        units=dnn_units, activation="relu", use_bn=use_bn, dropout_rate=dropout_rate
    )(interaction_outputs)

    # FiBiNET logits
    fibinet_logits = tf.keras.layers.Dense(1, activation=None)(dnn_out)  # B x 1

    if linear_logits:
        linear_logit = get_linear_logits(input_layer_dict, feature_columns)
        fibinet_logits = add_tensor_func(
            [fibinet_logits, linear_logit], name="fibinet_linear_logits"
        )

    # 遵循排序输出约定：展平并应用 sigmoid
    fibinet_logits = tf.keras.layers.Flatten()(fibinet_logits)
    output = tf.keras.layers.Dense(1, activation="sigmoid", name="fibinet_output")(
        fibinet_logits
    )
    output = tf.keras.layers.Flatten()(output)

    model = tf.keras.models.Model(
        inputs=list(input_layer_dict.values()), outputs=output
    )
    return model, None, None
