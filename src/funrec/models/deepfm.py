import tensorflow as tf

from .utils import (
    build_input_layer,
    build_group_feature_embedding_table_dict,
    concat_group_embedding,
    add_tensor_func,
    get_linear_logits,
)
from .layers import FM, DNNs


def build_deepfm_model(feature_columns, model_config):
    """
    构建 DeepFM (深度分解机) 排序模型。

    参数:
        feature_columns: FeatureColumn 列表
        model_config: 包含以下参数的字典:
            - dnn_units: list, DNN 隐藏层单元数 (默认 [64, 32])
            - dropout_rate: float, dropout 率 (默认 0.1)
            - linear_logits: bool, 是否添加线性项 (默认 True)

    返回:
        (model, None, None): 排序模型元组
    """
    dnn_units = model_config.get("dnn_units", [64, 32])
    dropout_rate = model_config.get("dropout_rate", 0.1)
    linear_logits = model_config.get("linear_logits", True)

    # 输入
    input_layer_dict = build_input_layer(feature_columns)

    # 分组嵌入
    group_embedding_feature_dict = build_group_feature_embedding_table_dict(
        feature_columns, input_layer_dict, prefix="embedding/"
    )

    # 为每个组构建 FM 和 DNN 组件
    fm_outputs = []
    dnn_outputs = []

    for (
        group_feature_name,
        group_feature_embedding,
    ) in group_embedding_feature_dict.items():
        if group_feature_name.startswith("deepfm"):
            # FM 组件: 期望 B x N x D 张量
            concat_feature = concat_group_embedding(
                group_embedding_feature_dict, group_feature_name, axis=1, flatten=False
            )  # B x N x D
            fm_out = FM(name=f"fm_{group_feature_name}")(concat_feature)
            fm_outputs.append(fm_out)

            # DNN 组件: 展平嵌入作为 DNN 输入
            flatten_feature = tf.keras.layers.Flatten()(concat_feature)
            dnn_out = DNNs(
                name=f"dnn_{group_feature_name}",
                units=dnn_units + [1],
                dropout_rate=dropout_rate,
            )(flatten_feature)
            dnn_outputs.append(dnn_out)

    # 合并 FM 输出
    if len(fm_outputs) > 1:
        fm_logit = add_tensor_func(fm_outputs, name="fm_logits")
    else:
        fm_logit = fm_outputs[0]

    # 合并 DNN 输出
    if len(dnn_outputs) > 1:
        dnn_logit = add_tensor_func(dnn_outputs, name="dnn_logits")
    else:
        dnn_logit = dnn_outputs[0]

    # 如果需要，添加线性项
    if linear_logits:
        linear_logit = get_linear_logits(input_layer_dict, feature_columns)
        fm_logit = add_tensor_func([fm_logit, linear_logit], name="fm_linear_logits")

    # 合并 FM 和 DNN 输出
    deepfm_logits = add_tensor_func([fm_logit, dnn_logit], name="deepfm_logits")

    # 遵循排序输出约定: 展平并 sigmoid
    deepfm_logits = tf.keras.layers.Flatten()(deepfm_logits)
    output = tf.keras.layers.Dense(1, activation="sigmoid", name="deepfm_output")(
        deepfm_logits
    )
    output = tf.keras.layers.Flatten()(output)

    model = tf.keras.models.Model(
        inputs=list(input_layer_dict.values()), outputs=output
    )
    return model, None, None
