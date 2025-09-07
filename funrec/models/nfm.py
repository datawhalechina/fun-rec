import tensorflow as tf

from .utils import (
    build_input_layer,
    build_group_feature_embedding_table_dict,
    concat_group_embedding,
    add_tensor_func,
    get_linear_logits,
)
from .layers import DNNs, BiInteractionPooling


def build_nfm_model(feature_columns, model_config):
    """
    构建神经因子分解机（NFM）排序模型。

    Args:
        feature_columns: FeatureColumn 列表
        model_config: 包含参数的字典：
            - dnn_units: 列表，DNN 隐藏单元（默认 [64, 32]）
            - use_bn: 布尔值，是否使用批量归一化（默认 True）
            - dropout_rate: 浮点数，dropout 率（默认 0.1）
            - linear_logits: 布尔值，是否添加线性项（默认 True）

    Returns:
        (model, None, None): 排序模型元组
    """
    dnn_units = model_config.get("dnn_units", [64, 32])
    use_bn = model_config.get("use_bn", True)
    dropout_rate = model_config.get("dropout_rate", 0.1)
    linear_logits = model_config.get("linear_logits", True)

    # 输入层
    input_layer_dict = build_input_layer(feature_columns)

    # 分组嵌入 B x N x D
    group_embedding_feature_dict = build_group_feature_embedding_table_dict(
        feature_columns, input_layer_dict, prefix="embedding/"
    )

    group_feature_dict = {}
    for group_name, _ in group_embedding_feature_dict.items():
        group_feature_dict[group_name] = concat_group_embedding(
            group_embedding_feature_dict, group_name, axis=1, flatten=False
        )  # B x N x D

    # 每个组的双交互池化
    bi_interaction_pooling_out = add_tensor_func(
        [
            BiInteractionPooling(name=group_name)(group_feature)
            for group_name, group_feature in group_feature_dict.items()
        ]
    )  # B x D

    # 深度神经网络
    dnn_out = DNNs(
        units=dnn_units, activation="relu", use_bn=use_bn, dropout_rate=dropout_rate
    )(bi_interaction_pooling_out)

    # NFM logits
    nfm_logits = tf.keras.layers.Dense(1, activation=None)(dnn_out)  # B x 1

    if linear_logits:
        linear_logit = get_linear_logits(input_layer_dict, feature_columns)
        nfm_logits = add_tensor_func(
            [nfm_logits, linear_logit], name="nfm_linear_logits"
        )

    # 遵循 FM 排序输出约定：扁平化和 sigmoid
    nfm_logits = tf.keras.layers.Flatten()(nfm_logits)
    output = tf.keras.layers.Dense(1, activation="sigmoid", name="nfm_output")(
        nfm_logits
    )
    output = tf.keras.layers.Flatten()(output)

    model = tf.keras.models.Model(
        inputs=list(input_layer_dict.values()), outputs=output
    )
    return model, None, None
