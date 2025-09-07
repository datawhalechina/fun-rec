import tensorflow as tf

from .utils import (
    build_input_layer,
    build_group_feature_embedding_table_dict,
    concat_group_embedding,
    get_linear_logits,
    add_tensor_func,
    parse_din_feature_columns,
    concat_func,
)
from .layers import DNNs, DinAttentionLayer, PredictLayer


def build_din_model(feature_columns, model_config):
    """
    构建 DIN (深度兴趣网络) 排序模型。

    参数:
        feature_columns: FeatureColumn 列表
        model_config: 包含以下参数的字典:
            - dnn_units: list, 隐藏层单元数包括输出大小 (默认 [128, 64, 1])
            - linear_logits: bool, 是否添加线性项 (默认 True)

    返回:
        (model, None, None): 排序模型元组
    """
    dnn_units = model_config.get("dnn_units", [128, 64, 1])
    use_linear_logits = model_config.get("linear_logits", True)

    # 输入和嵌入
    input_layer_dict = build_input_layer(feature_columns)
    group_embedding_feature_dict = build_group_feature_embedding_table_dict(
        feature_columns, input_layer_dict, prefix="embedding/"
    )

    # 来自 'dnn' 组的基础 DNN 输入
    dnn_inputs = concat_group_embedding(group_embedding_feature_dict, "dnn")

    # 对序列特征进行 DIN 注意力机制
    din_output_list = []
    din_feature_list = parse_din_feature_columns(feature_columns)
    for k_name, v_name in din_feature_list:
        query_feature = group_embedding_feature_dict["din_sequence"][k_name]
        key_feature = group_embedding_feature_dict["din_sequence"][v_name]
        din_output = DinAttentionLayer(name=v_name + "_din_layer")(
            [
                query_feature,
                key_feature,
            ]
        )
        din_output_list.append(din_output)
    din_output = concat_func(din_output_list, axis=1, flatten=True)
    dnn_inputs = concat_func([dnn_inputs, din_output], axis=-1)

    # DNN 塔
    dnn_logits = DNNs(dnn_units, use_bn=True)(dnn_inputs)
    if use_linear_logits:
        linear_logit = get_linear_logits(input_layer_dict, feature_columns)
        dnn_logits = add_tensor_func(
            [dnn_logits, linear_logit], name="din_linear_logits"
        )

    # 输出: 遵循排序约定以确保 (batch,) 标签兼容性
    final_logits = tf.keras.layers.Flatten()(dnn_logits)
    output = tf.keras.layers.Dense(1, activation="sigmoid", name="din_output")(
        final_logits
    )
    output = tf.keras.layers.Flatten()(output)
    model = tf.keras.models.Model(
        inputs=list(input_layer_dict.values()), outputs=output
    )

    return model, None, None
