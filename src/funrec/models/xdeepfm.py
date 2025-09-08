import tensorflow as tf

from .utils import (
    build_input_layer,
    build_group_feature_embedding_table_dict,
    concat_group_embedding,
    add_tensor_func,
    get_linear_logits,
)
from .layers import DNNs, CINs


def build_xdeepfm_model(feature_columns, model_config):
    """
    构建 xDeepFM (极端深度因子分解机) 排序模型。

    Args:
        feature_columns: FeatureColumn 列表
        model_config: 包含参数的字典:
            - dnn_units: 列表，DNN 隐藏层单元数 (默认 [64, 32])
            - dnn_dropout_rate: 浮点数，DNN 的 dropout 率 (默认 0.1)
            - cin_layer_sizes: 列表，CIN 层大小 (默认 [32, 16])
            - l2_reg: 浮点数，L2 正则化 (默认 1e-5)
            - linear_logits: 布尔值，是否添加线性项 (默认 True)

    Returns:
        (model, None, None): 排序模型元组
    """
    dnn_units = model_config.get("dnn_units", [64, 32])
    dnn_dropout_rate = model_config.get("dnn_dropout_rate", 0.1)
    cin_layer_sizes = model_config.get("cin_layer_sizes", [32, 16])
    l2_reg = model_config.get("l2_reg", 1e-5)
    linear_logits = model_config.get("linear_logits", True)
    # 输入层
    input_layer_dict = build_input_layer(feature_columns)

    # 分组嵌入
    group_embedding_feature_dict = build_group_feature_embedding_table_dict(
        feature_columns, input_layer_dict, prefix="embedding/"
    )

    # 为每个组构建 DNN 和 CIN 组件
    dnn_logits = []
    cin_logits = []

    for (
        group_feature_name,
        group_feature_embedding,
    ) in group_embedding_feature_dict.items():
        if group_feature_name.startswith("xdeepfm"):
            # 为 xDeepFM 输入拼接嵌入: B x N x D
            concat_feature = concat_group_embedding(
                group_embedding_feature_dict, group_feature_name, axis=1, flatten=False
            )  # B x N x D

            # DNN 组件: 为 DNN 输入展平嵌入
            flatten_feature = tf.keras.layers.Flatten()(concat_feature)  # B x (N*D)
            dnn_out = DNNs(
                units=dnn_units,
                dropout_rate=dnn_dropout_rate,
                activation="relu",
                use_bn=False,
            )(flatten_feature)
            dnn_logit = tf.keras.layers.Dense(
                1, activation=None, name=f"dnn_{group_feature_name}"
            )(dnn_out)
            dnn_logits.append(dnn_logit)

            # CIN 组件: 使用 B x N x D 格式
            cin_out = CINs(cin_layer_sizes, l2_reg=l2_reg)(concat_feature)
            cin_logit = tf.keras.layers.Dense(
                1, activation=None, name=f"cin_{group_feature_name}"
            )(cin_out)
            cin_logits.append(cin_logit)

    # 合并 DNN 输出
    if len(dnn_logits) > 1:
        dnn_combined = add_tensor_func(dnn_logits, name="dnn_logits")
    else:
        dnn_combined = dnn_logits[0] if dnn_logits else None

    # 合并 CIN 输出
    if len(cin_logits) > 1:
        cin_combined = add_tensor_func(cin_logits, name="cin_logits")
    else:
        cin_combined = cin_logits[0] if cin_logits else None

    # 合并所有输出
    xdeepfm_outputs = []
    if dnn_combined is not None:
        xdeepfm_outputs.append(dnn_combined)
    if cin_combined is not None:
        xdeepfm_outputs.append(cin_combined)

    # 如果需要，添加线性项
    if linear_logits:
        linear_logit = get_linear_logits(input_layer_dict, feature_columns)
        xdeepfm_outputs.append(linear_logit)

    if len(xdeepfm_outputs) > 1:
        xdeepfm_logits = add_tensor_func(xdeepfm_outputs, name="xdeepfm_logits")
    else:
        xdeepfm_logits = xdeepfm_outputs[0]

    # 遵循排序输出约定：展平并应用 sigmoid
    xdeepfm_logits = tf.keras.layers.Flatten()(xdeepfm_logits)
    output = tf.keras.layers.Dense(1, activation="sigmoid", name="xdeepfm_output")(
        xdeepfm_logits
    )
    output = tf.keras.layers.Flatten()(output)

    model = tf.keras.models.Model(
        inputs=list(input_layer_dict.values()), outputs=output
    )
    return model, None, None
