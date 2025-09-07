import tensorflow as tf
from tensorflow.keras import layers
from .utils import (
    build_input_layer,
    build_group_feature_embedding_table_dict,
    concat_group_embedding,
    concat_func,
)
from .layers import DNNs, PredictLayer


# 在 build_dsin_model 函数之前添加 BiasEncoding 类
class BiasEncoding(tf.keras.layers.Layer):
    """
    DSIN 模型的偏置编码层。

    该层为会话嵌入添加三种类型的偏置：
    1. 会话偏置：每个会话不同（捕获会话级特征）
    2. 位置偏置：会话内每个位置不同（捕获时间模式）
    3. Item偏置：每个嵌入维度不同（捕获特征级偏置）

    公式：BE(k,t,c) = w_k^K + w_t^T + w_c^C
    其中：
    - k：会话索引
    - t：会话内位置索引
    - c：嵌入维度索引
    """

    def __init__(self, sess_max_count, sess_max_len, seed=1024, **kwargs):
        super(BiasEncoding, self).__init__(**kwargs)
        self.sess_max_count = sess_max_count
        self.sess_max_len = sess_max_len
        self.seed = seed

    def build(self, input_shape):
        # 从输入形状获取嵌入大小
        # input_shape: [batch_size, sess_max_count, sess_max_len, embedding_dim]
        if len(input_shape) == 4:
            embedding_dim = input_shape[-1]
        else:
            raise ValueError(f"期望4维输入形状，得到 {input_shape}")

        # 会话偏置：每个会话不同
        # 形状：[sess_max_count, 1, 1]
        self.sess_bias_embedding = self.add_weight(
            "sess_bias_embedding",
            shape=(self.sess_max_count, 1, 1),
            initializer=tf.keras.initializers.TruncatedNormal(
                mean=0.0, stddev=0.0001, seed=self.seed
            ),
            trainable=True,
        )

        # 位置偏置：会话内每个位置不同
        # 形状：[1, sess_max_len, 1]
        self.seq_bias_embedding = self.add_weight(
            "seq_bias_embedding",
            shape=(1, self.sess_max_len, 1),
            initializer=tf.keras.initializers.TruncatedNormal(
                mean=0.0, stddev=0.0001, seed=self.seed
            ),
            trainable=True,
        )

        # Item偏置：每个嵌入维度不同
        # 形状：[1, 1, embedding_dim]
        self.item_bias_embedding = self.add_weight(
            "item_bias_embedding",
            shape=(1, 1, embedding_dim),
            initializer=tf.keras.initializers.TruncatedNormal(
                mean=0.0, stddev=0.0001, seed=self.seed
            ),
            trainable=True,
        )

        super(BiasEncoding, self).build(input_shape)

    def call(self, inputs, **kwargs):
        """
        对会话嵌入应用偏置编码。

        参数：
            inputs：会话嵌入张量
                    形状：[batch_size, sess_max_count, sess_max_len, embedding_dim]

        返回：
            偏置编码后的会话嵌入，形状相同
        """
        # 将所有三种偏置添加到输入中
        # 广播将处理维度对齐
        # 形状：[batch_size, sess_max_count, sess_max_len, embedding_dim]
        encoded_inputs = (
            inputs
            + self.sess_bias_embedding  # 会话偏置
            + self.seq_bias_embedding  # 位置偏置
            + self.item_bias_embedding
        )  # Item偏置

        return encoded_inputs

    def compute_output_shape(self, input_shape):
        return input_shape

    def get_config(self):
        config = {
            "sess_max_count": self.sess_max_count,
            "sess_max_len": self.sess_max_len,
            "seed": self.seed,
        }
        base_config = super(BiasEncoding, self).get_config()
        return dict(list(base_config.items()) + list(config.items()))


def build_dsin_model(feature_columns, model_config):
    """
    构建深度会话兴趣网络 (DSIN) 模型用于 CTR 预测。

    DSIN 引入会话概念来更好地建模用户行为序列。
    关键组件：
    1. 会话划分：基于时间间隔将用户行为序列划分为会话
    2. 偏置编码：应用会话、位置和Item偏置（如果启用）
    3. 会话兴趣提取：使用多头注意力提取会话级兴趣
    4. 会话兴趣交互：使用双向 LSTM 建模会话间交互
    5. 会话兴趣激活：应用注意力激活相关的会话兴趣

    参数：
        feature_columns：特征列定义列表
        model_config：包含以下参数的字典：
            - session_feature_list：list，例如 ['video_id']
            - sess_max_count：int
            - sess_max_len：int
            - bias_encoding：bool
            - att_embedding_size：int
            - att_head_num：int
            - dnn_units：list
            - dropout_rate：float
            - l2_reg：float

    返回：
        (model, None, None)：排序模型元组
    """

    session_feature_list = model_config.get("session_feature_list", ["video_id"])
    sess_max_count = model_config.get("sess_max_count", 5)
    sess_max_len = model_config.get("sess_max_len", 10)
    bias_encoding = model_config.get("bias_encoding", True)
    att_embedding_size = model_config.get("att_embedding_size", 8)
    att_head_num = model_config.get("att_head_num", 2)
    dnn_units = model_config.get("dnn_units", [128, 64, 1])
    dropout_rate = model_config.get("dropout_rate", 0.2)
    try:
        l2_reg = float(model_config.get("l2_reg", 1e-6))
    except Exception:
        l2_reg = 0.000001

    # 为所有特征构建输入层
    # 形状：input_layer_dict 包含所有输入张量
    input_layer_dict = build_input_layer(feature_columns)

    # 为所有特征构建嵌入表
    # 形状：group_embedding_feature_dict 包含按用途分组的嵌入
    group_embedding_feature_dict = build_group_feature_embedding_table_dict(
        feature_columns, input_layer_dict, prefix="embedding/"
    )

    # 获取常规 DNN 输入（非会话特征）
    # 形状：[batch_size, total_embedding_dim]
    dnn_inputs = concat_group_embedding(group_embedding_feature_dict, "dnn")

    # 使用 DSIN 组件处理会话特征
    session_embeddings = []

    # 查找用于会话处理的 video_id 嵌入
    video_id_embedding_layer = None
    for fc in feature_columns:
        if fc.name == "video_id":
            video_id_embedding_layer = tf.keras.layers.Embedding(
                fc.vocab_size,
                fc.emb_dim,
                name="video_id_session_embedding",
                mask_zero=True,
                embeddings_regularizer=tf.keras.regularizers.l2(l2_reg),
            )
            break

    # 提取会话嵌入
    session_inputs_found = False
    for sess_idx in range(sess_max_count):
        for feature_name in session_feature_list:
            session_key = f"sess_{sess_idx}_{feature_name}"

            if session_key in input_layer_dict:
                session_inputs_found = True
                # 获取会话输入张量
                # 形状：[batch_size, sess_max_len]
                session_input = input_layer_dict[session_key]

                # 获取此会话的嵌入
                # 形状：[batch_size, sess_max_len, embedding_dim]
                session_emb = video_id_embedding_layer(session_input)
                session_embeddings.append(session_emb)

    # 堆叠会话嵌入
    # 形状：[batch_size, sess_max_count, sess_max_len, embedding_dim]
    session_embeddings_stack = tf.stack(session_embeddings, axis=1)

    # 如果启用，应用偏置编码
    if bias_encoding:
        bias_encoder = BiasEncoding(sess_max_count, sess_max_len, seed=1024)
        session_embeddings_stack = bias_encoder(session_embeddings_stack)

    # DSIN 组件 1：会话兴趣提取
    session_interests = apply_session_interest_extractor(
        session_embeddings_stack,
        sess_max_count,
        sess_max_len,
        att_embedding_size,
        att_head_num,
        dropout_rate,
    )

    # DSIN 组件 2：会话兴趣交互
    session_interactions = apply_session_interest_interaction(
        session_interests,
        sess_max_count,
        att_embedding_size * att_head_num,
        dropout_rate,
    )

    # DSIN 组件 3：会话兴趣激活
    # 获取用于激活的目标Item嵌入
    target_item_embedding = get_target_item_embedding_by_prefix(
        group_embedding_feature_dict, "embedding/video_id"
    )

    # 基于目标Item激活会话兴趣和交互
    activated_session_interests = apply_attention_activation(
        session_interests, target_item_embedding, name_suffix="interests"
    )
    activated_session_interactions = apply_attention_activation(
        session_interactions, target_item_embedding, name_suffix="interactions"
    )

    # 组合所有特征进行最终预测
    all_features = [dnn_inputs]

    # 如果可用，添加会话特征
    if session_inputs_found:
        all_features.extend(
            [activated_session_interests, activated_session_interactions]
        )

    # 连接所有特征
    # 形状：[batch_size, total_feature_dim]
    final_inputs = concat_func(all_features, axis=-1)

    # 应用 DNN 层
    # 形状：[batch_size, 1]（最终预测）
    dnn_logits = DNNs(dnn_units, use_bn=True, dropout_rate=dropout_rate)(final_inputs)

    # 最终预测层
    # 形状：[batch_size, 1] 带 sigmoid 激活
    output = PredictLayer(name="dsin_output")(dnn_logits)

    # 创建模型
    model = tf.keras.models.Model(
        inputs=list(input_layer_dict.values()), outputs=output
    )

    return model, None, None


def apply_session_interest_extractor(
    session_embeddings,
    sess_max_count,
    sess_max_len,
    att_embedding_size,
    att_head_num,
    dropout_rate,
):
    """
    使用多头自注意力应用会话兴趣提取器。

    这是 DSIN 的核心组件，用于提取会话级兴趣。
    对于每个会话，我们应用多头自注意力来捕获
    该会话内Item之间的关系。

    教育说明：
    - 多头注意力允许模型同时关注会话的不同方面
    - 自注意力意味着会话中的每个Item都关注同一会话中的所有其他Item
    - 这捕获了会话内的依赖关系和兴趣
    - 偏置编码可能已应用于输入，以提供位置和会话级信息

    参数：
        session_embeddings：堆叠的会话嵌入（可能已偏置编码）
                           形状：[batch_size, sess_max_count, sess_max_len, embedding_dim]
        sess_max_count：每个用户的最大会话数
        sess_max_len：最大会话长度
        att_embedding_size：每个注意力头的嵌入大小
        att_head_num：注意力头数
        dropout_rate：正则化的 dropout 率

    返回：
        tf.Tensor：会话兴趣张量
                   形状：[batch_size, sess_max_count, att_embedding_size * att_head_num]
    """
    d_model = att_embedding_size * att_head_num
    session_interests = []

    for sess_idx in range(sess_max_count):
        # 获取此会话的会话嵌入
        # 形状：[batch_size, sess_max_len, embedding_dim]
        session_emb = session_embeddings[:, sess_idx, :, :]

        # 在此会话内应用多头自注意力
        # 这捕获同一会话中Item之间的关系
        # 形状：[batch_size, sess_max_len, d_model]
        attention_output = tf.keras.layers.MultiHeadAttention(
            num_heads=att_head_num,
            key_dim=att_embedding_size,
            dropout=dropout_rate,
            name=f"session_attention_{sess_idx}",
        )(session_emb, session_emb)

        # 应用层归一化以提高训练稳定性
        attention_output = tf.keras.layers.LayerNormalization(
            name=f"session_attention_norm_{sess_idx}"
        )(attention_output)

        # 应用平均池化获取会话级表示
        # 这将会话中的所有Item聚合为单一表示
        # 形状：[batch_size, d_model]
        session_interest = tf.reduce_mean(
            attention_output, axis=1, name=f"session_pooling_{sess_idx}"
        )
        session_interests.append(session_interest)

    # 堆叠所有会话兴趣
    # 形状：[batch_size, sess_max_count, d_model]
    session_interests = tf.stack(
        session_interests, axis=1, name="session_interests_stack"
    )

    return session_interests


def apply_session_interest_interaction(
    session_interests, sess_max_count, d_model, dropout_rate
):
    """
    使用双向 LSTM 应用会话兴趣交互。

    该组件建模会话之间的时间关系。
    直觉是会话按时间排序，后续会话
    可能受到早期会话的影响。

    教育说明：
    - 双向 LSTM 在前向和后向方向处理会话
    - 这捕获了过去会话如何影响当前会话以及
      未来会话如何为当前会话提供上下文
    - 输出捕获会话间依赖关系

    参数：
        session_interests：会话兴趣张量
                          形状：[batch_size, sess_max_count, d_model]
        sess_max_count：最大会话数
        d_model：模型维度
        dropout_rate：正则化的 dropout 率

    返回：
        tf.Tensor：会话交互输出
                   形状：[batch_size, sess_max_count, d_model * 2]
    """

    # 应用双向 LSTM 建模会话间的时间依赖关系
    # 前向方向：过去会话如何影响当前会话
    # 后向方向：未来会话如何为当前会话提供上下文
    # 形状：[batch_size, sess_max_count, d_model * 2]
    session_interactions = tf.keras.layers.Bidirectional(
        tf.keras.layers.LSTM(
            d_model // 2,  # 每个方向的单元数为一半，以保持输出大小一致
            return_sequences=True,
            dropout=dropout_rate,
            recurrent_dropout=dropout_rate,
            name="session_interaction_lstm_forward",
        ),
        name="session_interaction_lstm",
        backward_layer=tf.keras.layers.LSTM(
            d_model // 2,
            return_sequences=True,
            dropout=dropout_rate,
            recurrent_dropout=dropout_rate,
            go_backwards=True,
            name="session_interaction_lstm_backward",
        ),
    )(session_interests)

    # 应用层归一化以提高训练稳定性
    session_interactions = tf.keras.layers.LayerNormalization(
        name="session_interaction_norm"
    )(session_interactions)

    return session_interactions


def apply_attention_activation(session_features, target_item_embedding, name_suffix=""):
    """
    基于目标Item对会话特征应用注意力激活。

    该组件基于会话特征与目标Item的相关性来激活会话特征。
    直觉是并非所有会话对预测用户对特定Item的兴趣都同等相关。

    教育说明：
    - 注意力机制允许模型关注最相关的会话
    - 目标Item嵌入为我们试图预测的内容提供上下文
    - 这创建了会话特征的加权组合

    参数：
        session_features：会话特征张量
                         形状：[batch_size, sess_max_count, feature_dim]
        target_item_embedding：目标Item嵌入
                              形状：[batch_size, embedding_dim]
        name_suffix：层名称后缀以确保唯一性

    返回：
        tf.Tensor：激活的会话特征
                   形状：[batch_size, feature_dim]
    """

    # 获取维度
    batch_size = tf.shape(session_features)[0]
    sess_max_count = tf.shape(session_features)[1]
    feature_dim = tf.shape(session_features)[2]

    # 扩展目标Item嵌入以匹配会话维度
    # 形状：[batch_size, 1, embedding_dim]
    target_expanded = tf.expand_dims(target_item_embedding, axis=1)

    # 为每个会话重复目标嵌入
    # 形状：[batch_size, sess_max_count, embedding_dim]
    target_repeated = tf.tile(target_expanded, [1, sess_max_count, 1])

    # 将会话特征与目标Item嵌入连接
    # 这为计算注意力分数提供上下文
    # 形状：[batch_size, sess_max_count, feature_dim + embedding_dim]
    combined_features = tf.concat([session_features, target_repeated], axis=-1)

    # 使用密集层计算注意力分数
    # 形状：[batch_size, sess_max_count, 1]
    attention_scores = tf.keras.layers.Dense(
        1, activation="tanh", name=f"attention_score_{name_suffix}"
    )(combined_features)

    # 应用 softmax 获取注意力权重
    # 这确保权重在会话间的和为 1
    # 形状：[batch_size, sess_max_count, 1]
    attention_weights = tf.nn.softmax(
        attention_scores, axis=1, name=f"attention_weights_{name_suffix}"
    )

    # 将注意力权重应用于会话特征
    # 这创建了会话特征的加权组合
    # 形状：[batch_size, feature_dim]
    activated_features = tf.reduce_sum(
        session_features * attention_weights,
        axis=1,
        name=f"activated_features_{name_suffix}",
    )
    return activated_features


def get_target_item_embedding_by_prefix(group_embedding_feature_dict, prefix):
    """
    获取用于注意力激活的目标Item嵌入。

    该函数从特征嵌入中提取目标Item嵌入。
    目标Item是我们试图预测用户兴趣的Item。

    参数：
        group_embedding_feature_dict：分组嵌入特征字典

    返回：
        tf.Tensor：目标Item嵌入
                   形状：[batch_size, embedding_dim]
    """
    dnn_embeddings = group_embedding_feature_dict.get("dnn", [])
    # 查找以 'embedding/video_id' 开头的嵌入
    target_embedding = None
    for embedding in dnn_embeddings:
        if embedding.name.startswith(prefix):
            target_embedding = embedding
            break

    if len(target_embedding.shape) > 2:
        # 如果嵌入有额外维度，取平均值
        target_embedding = tf.reduce_mean(target_embedding, axis=1)

    return target_embedding
