import tensorflow as tf

from .layers import PositionEncodingLayer, TransformerEncoder
from .utils import (
    build_input_layer,
    build_group_feature_embedding_table_dict,
    concat_group_embedding,
    concat_func,
    add_tensor_func,
)


def build_prm_model(feature_columns, model_config):
    """构建与FunRec训练流水线兼容的PRM重排序模型。

    Args:
        feature_columns: FeatureColumn列表
        model_config: 包含参数的字典:
            - max_seq_len: int (默认30)
            - transformer_blocks: int (默认2)
            - nums_head: int (默认1)
            - dropout_rate: float (默认0.1)
            - intermediate_dim: int (默认64)
            - pos_emb_trainable: bool (默认True)

    Returns:
        (model, None, None): 重排序模型元组
    """
    max_seq_len = model_config.get("max_seq_len", 30)
    transformer_blocks = model_config.get("transformer_blocks", 2)
    nums_head = model_config.get("nums_head", 1)
    dropout_rate = model_config.get("dropout_rate", 0.1)
    intermediate_dim = model_config.get("intermediate_dim", 64)
    pos_emb_trainable = model_config.get("pos_emb_trainable", True)

    # 输入层
    input_layer_dict = build_input_layer(feature_columns)
    group_embedding_feature_dict = build_group_feature_embedding_table_dict(
        feature_columns, input_layer_dict, prefix="embedding/"
    )

    user_part_embedding = concat_group_embedding(
        group_embedding_feature_dict, "user_part"
    )  # B x D
    # 将用户嵌入在序列长度维度上进行复制
    user_part_embedding = tf.keras.layers.Lambda(
        lambda x: tf.tile(tf.expand_dims(x, axis=1), [1, max_seq_len, 1])
    )(
        user_part_embedding
    )  # [B, max_len, D]

    # 物品侧序列特征
    item_part_embedding = concat_group_embedding(
        group_embedding_feature_dict, "item_part", axis=-1, flatten=False
    )  # [B, max_len, K]
    pv_embeddings = input_layer_dict["pv_emb"]  # [B, max_len, D_pv]
    item_embeddings = input_layer_dict["item_emb"]  # [B, max_len, D_item]

    page_embedding = concat_func(
        [user_part_embedding, item_part_embedding, pv_embeddings, item_embeddings],
        axis=-1,
    )  # [B, max_len, dim]

    position_embedding = PositionEncodingLayer(
        dims=feature_columns[0].emb_dim,
        max_len=max_seq_len,
        trainable=pos_emb_trainable,
        initializer="glorot_uniform",
    )(page_embedding)

    enc_inputs = add_tensor_func([page_embedding, position_embedding])

    for _ in range(transformer_blocks):
        enc_inputs = TransformerEncoder(
            intermediate_dim,
            nums_head,
            dropout_rate,
            activation="relu",
            normalize_first=True,
            is_residual=True,
        )(enc_inputs)

    enc_output = tf.keras.layers.Dense(intermediate_dim, activation="tanh")(enc_inputs)
    enc_output = tf.keras.layers.Dense(1)(enc_output)
    flat = tf.keras.layers.Flatten()(enc_output)
    score_output = tf.keras.layers.Activation(activation="softmax")(flat)

    model = tf.keras.Model(inputs=list(input_layer_dict.values()), outputs=score_output)
    return model, None, None
