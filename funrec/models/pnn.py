import tensorflow as tf

from .utils import (
    build_input_layer,
    build_group_feature_embedding_table_dict,
    concat_group_embedding,
    add_tensor_func,
    get_linear_logits,
)
from .layers import DNNs, PNN


def build_pnn_model(feature_columns, model_config):
    """
    构建基于乘积的神经网络 (PNN) 排序模型。

    Args:
        feature_columns: FeatureColumn 列表
        model_config: 包含参数的字典:
            - dnn_units: 列表，DNN 隐藏层单元数 (默认 [64, 32])
            - product_layer_units: 整数，乘积层输出单元数 (默认 8)
            - use_inner: 布尔值，是否使用内积 (默认 True)
            - use_outer: 布尔值，是否使用外积 (默认 True)
            - use_bn: 布尔值，是否使用批量归一化 (默认 False)
            - dropout_rate: 浮点数，dropout 率 (默认 0.0)
            - linear_logits: 布尔值，是否添加线性项 (默认 True)

    Returns:
        (model, None, None): 排序模型元组
    """
    dnn_units = model_config.get("dnn_units", [64, 32])
    product_layer_units = model_config.get("product_layer_units", 8)
    use_inner = model_config.get("use_inner", True)
    use_outer = model_config.get("use_outer", True)
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
        if group_feature_name.startswith("pnn"):
            # PNN 期望嵌入张量列表
            pnn_out = PNN(
                units=product_layer_units, use_inner=use_inner, use_outer=use_outer
            )(group_feature_embedding)
            interaction_outputs.append(pnn_out)

    if len(interaction_outputs) > 1:
        interaction_outputs = tf.concat(interaction_outputs, axis=-1)
    else:
        interaction_outputs = interaction_outputs[0]

    # 深度神经网络
    dnn_out = DNNs(
        units=dnn_units, activation="relu", use_bn=use_bn, dropout_rate=dropout_rate
    )(interaction_outputs)

    # PNN logits
    pnn_logits = tf.keras.layers.Dense(1, activation=None)(dnn_out)  # B x 1

    if linear_logits:
        linear_logit = get_linear_logits(input_layer_dict, feature_columns)
        pnn_logits = add_tensor_func(
            [pnn_logits, linear_logit], name="pnn_linear_logits"
        )

    # 遵循排序输出约定：展平并应用 sigmoid
    pnn_logits = tf.keras.layers.Flatten()(pnn_logits)
    output = tf.keras.layers.Dense(1, activation="sigmoid", name="pnn_output")(
        pnn_logits
    )
    output = tf.keras.layers.Flatten()(output)

    model = tf.keras.models.Model(
        inputs=list(input_layer_dict.values()), outputs=output
    )
    return model, None, None
