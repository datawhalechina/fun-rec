import tensorflow as tf

from .utils import (
    build_input_layer,
    build_group_feature_embedding_table_dict,
    concat_group_embedding,
    add_tensor_func,
    get_linear_logits,
    pairwise_feature_interactions,
)
from .layers import AttentionPoolingLayer


def build_afm_model(feature_columns, model_config):
    """
    构建注意力因子分解机（AFM）排序模型。

    参数:
        feature_columns: FeatureColumn列表
        model_config: 包含参数的字典:
            - attention_factor: int, 注意力隐藏层大小 (默认 4)
            - dropout_rate: float, 成对交互的dropout (默认 0.1)
            - l2_reg: float, 注意力权重的L2正则化 (默认 1e-4)
            - linear_logits: bool, 是否添加线性项 (默认 True)

    返回:
        (model, None, None): 排序模型元组
    """
    attention_factor = model_config.get("attention_factor", 4)
    dropout_rate = model_config.get("dropout_rate", 0.1)
    l2_reg = model_config.get("l2_reg", 1e-4)
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

    # 对每个组的成对交互进行注意力池化
    group_attention_pooling_out = {}
    for group_name, group_feature in group_feature_dict.items():
        group_pairwise = pairwise_feature_interactions(
            group_feature, drop_rate=dropout_rate
        )  # B x num_pairs x D
        group_attention_pooling_out[group_name] = AttentionPoolingLayer(
            attention_factor=attention_factor, l2_reg=l2_reg
        )(
            group_pairwise
        )  # B x D

    # 跨组求和
    attention_pooling_output = add_tensor_func(
        [
            group_attention_pooling_out[group_name]
            for group_name in group_feature_dict.keys()
        ]
    )  # B x D

    # Logits
    afm_logits = tf.keras.layers.Dense(1, activation=None)(
        attention_pooling_output
    )  # B x 1

    if linear_logits:
        linear_logit = get_linear_logits(input_layer_dict, feature_columns)
        afm_logits = add_tensor_func(
            [afm_logits, linear_logit], name="afm_linear_logits"
        )

    # 遵循FM排序输出约定：展平并应用sigmoid
    afm_logits = tf.keras.layers.Flatten()(afm_logits)
    output = tf.keras.layers.Dense(1, activation="sigmoid", name="afm_output")(
        afm_logits
    )
    output = tf.keras.layers.Flatten()(output)

    model = tf.keras.models.Model(
        inputs=list(input_layer_dict.values()), outputs=output
    )
    return model, None, None
