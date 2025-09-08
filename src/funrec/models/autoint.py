import tensorflow as tf

from .utils import (
    build_input_layer,
    build_group_feature_embedding_table_dict,
    concat_group_embedding,
    add_tensor_func,
    get_linear_logits,
)
from .layers import MultiHeadAttentionLayer


def build_autoint_model(feature_columns, model_config):
    """
    构建 AutoInt (自动特征交互学习) 排序模型。

    参数:
        feature_columns: FeatureColumn 列表
        model_config: 包含以下参数的字典:
            - num_interaction_layers: int, 注意力层数量 (默认 2)
            - attention_factor: int, 注意力维度 (默认 8)
            - num_heads: int, 注意力头数量 (默认 2)
            - use_residual: bool, 是否使用残差连接 (默认 True)
            - linear_logits: bool, 是否添加线性项 (默认 True)

    返回:
        (model, None, None): 排序模型元组
    """
    num_interaction_layers = model_config.get("num_interaction_layers", 2)
    attention_factor = model_config.get("attention_factor", 8)
    num_heads = model_config.get("num_heads", 2)
    use_residual = model_config.get("use_residual", True)
    linear_logits = model_config.get("linear_logits", True)

    # 输入
    input_layer_dict = build_input_layer(feature_columns)

    # 分组嵌入
    group_embedding_feature_dict = build_group_feature_embedding_table_dict(
        feature_columns, input_layer_dict, prefix="embedding/"
    )

    # 为每个组构建 AutoInt 组件
    autoint_outputs = []

    for (
        group_feature_name,
        group_feature_embedding,
    ) in group_embedding_feature_dict.items():
        if group_feature_name.startswith("autoint"):
            # 获取 B x N x D 格式的组特征
            group_feature = concat_group_embedding(
                group_embedding_feature_dict, group_feature_name, axis=1, flatten=False
            )  # B x N x D

            # 应用多个自注意力层
            attention_output = group_feature
            for _ in range(num_interaction_layers):
                attention_layer = MultiHeadAttentionLayer(
                    attention_dim=attention_factor,
                    num_heads=num_heads,
                    use_residual=use_residual,
                )
                attention_output = attention_layer(attention_output)

            # 展平注意力输出: B x N x (D * H) -> B x (N * D * H)
            flattened_attention = tf.keras.layers.Flatten()(attention_output)

            # 该组的全连接层
            group_output = tf.keras.layers.Dense(
                1, name=f"autoint_dense_{group_feature_name}"
            )(flattened_attention)
            autoint_outputs.append(group_output)

    # 合并 AutoInt 输出
    if len(autoint_outputs) > 1:
        autoint_logits = add_tensor_func(autoint_outputs, name="autoint_logits")
    elif len(autoint_outputs) == 1:
        autoint_logits = autoint_outputs[0]
    else:
        # 如果没有 AutoInt 组，创建零张量
        batch_size = tf.shape(list(input_layer_dict.values())[0])[0]
        autoint_logits = tf.zeros([batch_size, 1])

    # 如果需要，添加线性项
    if linear_logits:
        linear_logit = get_linear_logits(input_layer_dict, feature_columns)
        final_logits = add_tensor_func(
            [autoint_logits, linear_logit], name="autoint_linear_logits"
        )
    else:
        final_logits = autoint_logits

    # 遵循排序输出约定: 展平并 sigmoid
    final_logits = tf.keras.layers.Flatten()(final_logits)
    output = tf.keras.layers.Dense(1, activation="sigmoid", name="autoint_output")(
        final_logits
    )
    output = tf.keras.layers.Flatten()(output)

    model = tf.keras.models.Model(
        inputs=list(input_layer_dict.values()), outputs=output
    )
    return model, None, None
