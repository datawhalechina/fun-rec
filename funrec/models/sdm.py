import tensorflow as tf

from .utils import (
    concat_group_embedding,
    build_input_layer,
    build_group_feature_embedding_table_dict,
)
from .layers import SampledSoftmaxLayer, UserAttention, GatedFusion


def build_sdm_model(feature_columns, model_config):
    # 从model_config中提取参数
    label_name = model_config.get("label_name", "movie_id")
    dnn_activation = model_config.get("dnn_activation", "tanh")
    emb_dim = model_config.get("emb_dim", 16)
    num_heads = model_config.get("num_heads", 2)
    num_sampled = model_config.get("num_sampled", 20)

    # 从feature_columns中获取item_vocab_size
    item_vocab_size = None
    for fc in feature_columns:
        if fc.name == label_name:
            item_vocab_size = fc.vocab_size
            break

    if item_vocab_size is None:
        raise ValueError(f"Could not find vocab_size for label feature '{label_name}'")

    input_layer_dict = build_input_layer(feature_columns)
    group_embedding_feature_dict, embedding_table_dict = (
        build_group_feature_embedding_table_dict(
            feature_columns,
            input_layer_dict,
            prefix="embedding/",
            return_embedding_table=True,
        )
    )

    # 用户表示
    user_emb_concat = concat_group_embedding(
        group_embedding_feature_dict, "user", flatten=False
    )  # [None, 1, dim * num_user_features]
    user_embedding = tf.keras.layers.Dense(emb_dim, activation=dnn_activation)(
        user_emb_concat
    )  # [None, 1, dim]

    # ------------ 短期兴趣建模 ------------
    # 1. 序列信息学习层（LSTM）
    # 获取短期会话序列特征
    short_history_features = group_embedding_feature_dict["raw_hist_seq"]
    short_history_item_embs = []
    for name, short_history_feature in short_history_features.items():
        short_history_mask = tf.keras.layers.Lambda(
            lambda x: tf.expand_dims(
                tf.cast(tf.not_equal(x, 0), dtype=tf.float32), axis=-1
            )
        )(
            input_layer_dict[name]
        )  # [None, max_len, 1]

        # 使用mask
        short_history_item_embs.append(
            tf.keras.layers.Lambda(lambda x: x[0] * x[1])(
                [short_history_feature, short_history_mask]
            )
        )  # [None, max_len, dim]
    short_history_item_emb_concat = tf.keras.layers.Concatenate(axis=-1)(
        short_history_item_embs
    )  # [None, max_len, dim * num_short_history_features]
    short_history_item_emb = tf.keras.layers.Dense(emb_dim, activation=dnn_activation)(
        short_history_item_emb_concat
    )  # [None, max_len, dim]

    # 使用LSTM处理序列
    lstm_layer = tf.keras.layers.LSTM(
        emb_dim, return_sequences=True, recurrent_initializer="glorot_uniform"
    )
    sequence_output = lstm_layer(short_history_item_emb)

    # 2. 多兴趣提取层（多头自注意力）
    # 对LSTM输出应用多头注意力

    norm_sequence_output = tf.keras.layers.LayerNormalization()(sequence_output)
    sequence_output = tf.keras.layers.MultiHeadAttention(
        num_heads=num_heads,
        key_dim=emb_dim // num_heads,
        dropout=0.1,
        use_bias=True,
        kernel_initializer="glorot_uniform",
        bias_initializer="zeros",
        name=f"short_term_attention",
    )(
        norm_sequence_output, sequence_output, attention_mask=short_history_mask
    )  # [None, max_len, dim]

    short_term_output = tf.keras.layers.LayerNormalization()(
        sequence_output
    )  # [None, max_len, dim]

    # 3. 用户个性化注意力层
    user_attention = UserAttention(name="user_attention_short")
    short_term_interest = user_attention(
        user_embedding, short_term_output
    )  # [None, 1, dim]

    # ------------ 长期兴趣建模 ------------
    # 从不同特征维度对长期行为进行聚合
    long_history_features = group_embedding_feature_dict["raw_hist_seq_long"]

    long_term_interests = []
    for name, long_history_feature in long_history_features.items():
        long_history_mask = tf.keras.layers.Lambda(
            lambda x: tf.expand_dims(
                tf.cast(tf.not_equal(x, 0), dtype=tf.float32), axis=-1
            )
        )(
            input_layer_dict[name]
        )  # [None, max_len_long, 1]
        long_history_item_emb = tf.keras.layers.Lambda(lambda x: x[0] * x[1])(
            [long_history_feature, long_history_mask]
        )  # [None, max_len_long, dim]

        user_attention = UserAttention(name=f"user_attention_long_{name}")
        long_term_interests.append(
            user_attention(user_embedding, long_history_item_emb)
        )  # [None, 1, dim]

    long_term_interests_concat = tf.keras.layers.Concatenate(axis=-1)(
        long_term_interests
    )  # [None, 1, dim * len(long_history_features)]
    long_term_interest = tf.keras.layers.Dense(emb_dim, activation=dnn_activation)(
        long_term_interests_concat
    )  # [None, 1, dim]

    # ------------ 长短期兴趣融合 ------------
    gated_fusion = GatedFusion(name="gated_fusion")
    final_interest = gated_fusion(
        [user_embedding, short_term_interest, long_term_interest]
    )  # [None, 1, dim]
    final_interest = tf.keras.layers.Lambda(lambda x: tf.squeeze(x, axis=1))(
        final_interest
    )  # [None, dim]

    # ------------ 预测层 ------------
    # 获取item索引

    # 获取item嵌入权重
    item_embedding_weight = embedding_table_dict[label_name].embeddings
    # 获取item嵌入
    output_item_embedding = tf.keras.layers.Lambda(lambda x: tf.squeeze(x, axis=1))(
        embedding_table_dict[label_name](input_layer_dict[label_name])
    )
    # 构建采样softmax层
    sampled_softmax_layer = SampledSoftmaxLayer(item_vocab_size, num_sampled, emb_dim)
    # 计算输出
    output = sampled_softmax_layer(
        [item_embedding_weight, final_interest, input_layer_dict[label_name]]
    )

    # 构建模型
    model = tf.keras.Model(inputs=list(input_layer_dict.values()), outputs=output)

    # 构建用户模型和物品模型用于评估
    user_feature_names = [
        fc.name
        for fc in feature_columns
        if any(g in fc.group for g in ["user", "raw_hist_seq", "raw_hist_seq_long"])
    ]
    user_inputs_dict = {name: input_layer_dict[name] for name in user_feature_names}
    user_model = tf.keras.Model(inputs=user_inputs_dict, outputs=final_interest)

    item_inputs_dict = {label_name: input_layer_dict[label_name]}
    item_model = tf.keras.Model(inputs=item_inputs_dict, outputs=output_item_embedding)

    return model, user_model, item_model
