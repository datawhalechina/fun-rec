import tensorflow as tf

from .utils import build_input_layer, build_embedding_table_dict, add_tensor_func
from .layers import PositionEncodingLayer, NegativeSampleEmbedding, DNNs


def build_sasrec_model(feature_columns, model_config):
    """
    构建SASRec模型 (Self-Attentive Sequential Recommendation)

    参数:
    feature_columns: 特征列配置
    model_config: 模型配置字典，包含:
        - max_seq_len: 最大序列长度 (default: 200)
        - mha_num: 多头注意力层数 (default: 2)
        - nums_heads: 注意力头数 (default: 1)
        - dropout: dropout率 (default: 0.2)
        - activation: 激活函数 (default: 'relu')
        - pos_emb_trainable: 位置编码是否可训练 (default: True)
        - pos_initializer: 位置编码初始化器 (default: 'glorot_uniform')
    """
    # 从配置中提取参数，设置默认值
    max_seq_len = model_config.get("max_seq_len", 200)
    mha_num = model_config.get("mha_num", 2)
    nums_heads = model_config.get("nums_heads", 1)
    dropout = model_config.get("dropout", 0.2)
    activation = model_config.get("activation", "relu")
    pos_emb_trainable = model_config.get("pos_emb_trainable", True)
    pos_initializer = model_config.get("pos_initializer", "glorot_uniform")

    input_layer_dict = build_input_layer(feature_columns)
    embedding_table_dict = build_embedding_table_dict(feature_columns, prefix="sasrec/")
    sequence_embedding = embedding_table_dict["item_id"](input_layer_dict["seq_ids"])
    positive_embedding = embedding_table_dict["item_id"](input_layer_dict["pos_ids"])
    # 评估时需要使用的embedding, 包括全量评估和采样评估
    negative_embedding = embedding_table_dict["item_id"](
        input_layer_dict["neg_sample_ids"]
    )

    # 对于全量物品评估，我们需要一个可以映射到物品嵌入的单一输入
    # 为物品评估创建一个虚拟输入，在评估期间会被替换
    all_item_input = tf.keras.layers.Input(
        shape=(), name="all_item_input", dtype="int32"
    )
    all_item_embedding = embedding_table_dict["item_id"](all_item_input)

    position_embedding = PositionEncodingLayer(
        dims=feature_columns[0].emb_dim,
        max_len=max_seq_len,
        trainable=pos_emb_trainable,
        initializer=pos_initializer,
    )(sequence_embedding)
    # 原始序列emb加上position embedding
    sequence_embedding = add_tensor_func([sequence_embedding, position_embedding])

    # 多头注意力
    for i in range(mha_num):
        sequence_embedding_norm = tf.keras.layers.LayerNormalization()(
            sequence_embedding
        )
        sequence_embedding_output = tf.keras.layers.MultiHeadAttention(
            num_heads=nums_heads,
            key_dim=feature_columns[0].emb_dim,
            dropout=dropout,
            name=f"{i}_block",
        )(sequence_embedding_norm, sequence_embedding, use_causal_mask=True)
        # 残差连接
        sequence_embedding = add_tensor_func(
            [sequence_embedding, sequence_embedding_output]
        )
        sequence_embedding = tf.keras.layers.LayerNormalization()(sequence_embedding)
        # FFN
        sequence_embedding = DNNs(
            units=[feature_columns[0].emb_dim, feature_columns[0].emb_dim],
            dropout_rate=dropout,
            activation=activation,
            name=f"{i}_dnn",
        )(sequence_embedding)
    sequence_embedding = tf.keras.layers.LayerNormalization()(sequence_embedding)

    # 序列的padding在左边，直接拿到序列的最后一个结果即可
    last_sequence_embedding = tf.keras.layers.Lambda(
        lambda x: x[:, -1, :], name="last_sequence_embedding"
    )(
        sequence_embedding
    )  # B, emb_dim

    # 获取所有item的索引和权重
    item_embedding_weight = embedding_table_dict["item_id"].embeddings

    # 负采样算loss
    negative_embeddings = NegativeSampleEmbedding(
        vocab_size=feature_columns[0].vocab_size,
        num_sampled=max_seq_len,
        sampled_type="uniform",
    )(positive_embedding, item_embedding_weight)

    # 序列展开成[batch_size x max_len, emb_dim]
    sequence_embedding = tf.keras.layers.Reshape((-1, feature_columns[0].emb_dim))(
        sequence_embedding
    )
    pos_item_embedding = tf.keras.layers.Reshape((-1, feature_columns[0].emb_dim))(
        positive_embedding
    )
    negative_embeddings = tf.keras.layers.Reshape((-1, feature_columns[0].emb_dim))(
        negative_embeddings
    )

    pos_logits = tf.keras.layers.Lambda(lambda x: tf.reduce_sum(x[0] * x[1], axis=-1))(
        [pos_item_embedding, sequence_embedding]
    )  # B,1
    neg_logits = tf.keras.layers.Lambda(
        lambda x: tf.reduce_sum(x[0] * tf.expand_dims(x[1], axis=1), axis=-1)
    )(
        [negative_embeddings, sequence_embedding]
    )  # B, max_len

    # 创建目标掩码，忽略padding项目（ID=0），维度: [batch_size * maxlen]
    # 这里的掩码是为了计算loss时忽略padding项
    is_target = tf.keras.layers.Lambda(
        lambda x: tf.reshape(tf.cast(tf.not_equal(x, 0), tf.float32), [-1, max_seq_len])
    )(
        input_layer_dict["pos_ids"]
    )  # B, max_len

    main_loss = tf.reduce_sum(
        -tf.math.log(tf.sigmoid(pos_logits) + 1e-24) * is_target
        - tf.math.log(1 - tf.sigmoid(neg_logits) + 1e-24) * is_target
    ) / tf.reduce_sum(is_target)

    # 构建模型
    model = tf.keras.Model(inputs=list(input_layer_dict.values()), outputs=[main_loss])

    # 推理时用户输入和item输入
    user_inputs_list = [v for k, v in input_layer_dict.items() if k in ["seq_ids"]]
    model.__setattr__("user_input", user_inputs_list)
    model.__setattr__("user_embedding", last_sequence_embedding)

    # 全量物品评估使用专用的物品输入
    model.__setattr__("all_item_input", [all_item_input])
    model.__setattr__("all_item_embedding", all_item_embedding)

    sampling_item_inputs_list = [
        v for k, v in input_layer_dict.items() if k in ["neg_sample_ids"]
    ]
    model.__setattr__("sampling_item_input", sampling_item_inputs_list)
    model.__setattr__("sampling_item_embedding", negative_embedding)

    # 为评估创建独立的用户和物品模型
    user_model = tf.keras.Model(
        inputs=user_inputs_list, outputs=last_sequence_embedding
    )
    item_model = tf.keras.Model(inputs=[all_item_input], outputs=all_item_embedding)

    return model, user_model, item_model
