import tensorflow as tf

from .utils import (
    build_input_layer,
    build_group_feature_embedding_table_dict,
    concat_group_embedding,
    add_tensor_func,
    get_linear_logits,
)
from .layers import DNNs, DCN


def build_dcn_model(feature_columns, model_config):
    """
    构建 DCN (深度交叉网络) 排序模型。

    参数:
        feature_columns: FeatureColumn 列表
        model_config: 包含以下参数的字典:
            - num_cross_layers: int, 交叉层数量 (默认 3)
            - dnn_units: list, DNN 隐藏单元 (默认 [64, 32])
            - dropout_rate: float, dropout 率 (默认 0.1)
            - l2_reg: float, L2 正则化 (默认 1e-5)
            - linear_logits: bool, 是否添加线性项 (默认 True)

    返回:
        (model, None, None): 排序模型元组
    """
    num_cross_layers = model_config.get("num_cross_layers", 3)
    dnn_units = model_config.get("dnn_units", [64, 32])
    dropout_rate = model_config.get("dropout_rate", 0.1)
    l2_reg = model_config.get("l2_reg", 1e-5)
    linear_logits = model_config.get("linear_logits", True)

    # 输入
    input_layer_dict = build_input_layer(feature_columns)

    # 分组嵌入
    group_embedding_feature_dict = build_group_feature_embedding_table_dict(
        feature_columns, input_layer_dict, prefix="embedding/"
    )

    # 为每个组构建交叉和深度组件
    cross_outputs = []
    deep_outputs = []

    for (
        group_feature_name,
        group_feature_embedding,
    ) in group_embedding_feature_dict.items():
        if group_feature_name.startswith("dcn"):
            # 交叉组件: 连接嵌入作为 DCN 输入
            concat_feature = concat_group_embedding(
                group_embedding_feature_dict, group_feature_name, axis=-1, flatten=True
            )  # B x (N*D)
            cross_out = DCN(num_cross_layers=num_cross_layers, l2_reg=l2_reg)(
                concat_feature
            )
            cross_outputs.append(cross_out)

        elif group_feature_name.startswith("dnn"):
            # DNN 组件: 展平嵌入作为 DNN 输入
            concat_feature = concat_group_embedding(
                group_embedding_feature_dict, group_feature_name, axis=-1, flatten=True
            )  # B x (N*D)
            dnn_out = DNNs(
                units=dnn_units,
                dropout_rate=dropout_rate,
                activation="relu",
                use_bn=False,
            )(concat_feature)
            deep_outputs.append(dnn_out)

    # 合并交叉输出
    if len(cross_outputs) > 1:
        cross_logit = add_tensor_func(cross_outputs, name="cross_logits")
    else:
        cross_logit = cross_outputs[0] if cross_outputs else None

    # 合并 DNN 输出
    if len(deep_outputs) > 1:
        deep_logit = add_tensor_func(deep_outputs, name="dnn_logits")
    else:
        deep_logit = deep_outputs[0] if deep_outputs else None

    # 合并所有输出
    dcn_outputs = []
    if cross_logit is not None:
        dcn_outputs.append(cross_logit)
    if deep_logit is not None:
        dcn_outputs.append(deep_logit)

    if len(dcn_outputs) > 1:
        dcn_logits = tf.keras.layers.Concatenate(name="dcn_concat")(dcn_outputs)
    else:
        dcn_logits = dcn_outputs[0]

    # 如果需要，添加线性项
    if linear_logits:
        linear_logit = get_linear_logits(input_layer_dict, feature_columns)
        dcn_logits = tf.keras.layers.Dense(1, name="dcn_dense")(dcn_logits)
        dcn_logits = add_tensor_func(
            [dcn_logits, linear_logit], name="dcn_linear_logits"
        )
    else:
        dcn_logits = tf.keras.layers.Dense(1, name="dcn_dense")(dcn_logits)

    # 遵循排序输出约定: 展平并 sigmoid
    dcn_logits = tf.keras.layers.Flatten()(dcn_logits)
    output = tf.keras.layers.Dense(1, activation="sigmoid", name="dcn_output")(
        dcn_logits
    )
    output = tf.keras.layers.Flatten()(output)

    model = tf.keras.models.Model(
        inputs=list(input_layer_dict.values()), outputs=output
    )
    return model, None, None
