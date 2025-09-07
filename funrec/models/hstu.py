import tensorflow as tf

from .utils import build_input_layer, build_embedding_table_dict, add_tensor_func
from .layers import PositionEncodingLayer, NegativeSampleEmbedding, DNNs, EmbeddingIndex


class HstuLayer(tf.keras.layers.Layer):
    """多头注意力机制的 Keras 实现

    参数:
      num_units: 注意力的维度大小，如果为None则使用输入的最后一维
      num_heads: 注意力头的数量
      dropout_rate: dropout 比率
      attention_type: 注意力类型，支持 'dot_product', 'relative_position_bias', 'time_interval_bias'
      causality: 是否使用因果掩码
      linear_projection_and_dropout: 是否在输出后添加线性投影和dropout
      args: 包含各种配置参数的对象
      with_qk: 是否返回Q和K
    """

    def __init__(
        self,
        num_units=None,
        num_heads=8,
        attention_type="dot_product",
        dropout_rate=0,
        causality=False,
        linear_projection_and_dropout=False,
        args=None,
        with_qk=False,
        **kwargs,
    ):
        super(HstuLayer, self).__init__(**kwargs)
        self.num_units = num_units
        self.num_heads = num_heads
        self.attention_type = attention_type
        self.dropout_rate = dropout_rate
        self.causality = causality
        self.linear_projection_and_dropout = linear_projection_and_dropout
        self.args = args
        self.with_qk = with_qk

    def build(self, input_shape):
        # 设置注意力维度的默认值
        if isinstance(input_shape, list):
            queries_shape = input_shape[0]
            keys_shape = input_shape[1]
        else:
            queries_shape = input_shape
            keys_shape = input_shape

        if self.num_units is None:
            self.num_units = queries_shape[-1]

        # 初始化器
        qkv_initializer = None
        if (
            hasattr(self.args, "qkv_projection_initializer")
            and self.args.qkv_projection_initializer == "normal"
        ):
            print("Set qkv projection initializer to normal")
            qkv_initializer = tf.keras.initializers.RandomNormal(mean=0, stddev=0.02)

        # 线性投影层
        use_bias = (
            getattr(self.args, "qkv_projection_bias", False) if self.args else False
        )
        self.query_dense = tf.keras.layers.Dense(
            self.num_units,
            activation=None,
            use_bias=use_bias,
            kernel_initializer=qkv_initializer,
            name="query_projection",
        )
        self.key_dense = tf.keras.layers.Dense(
            self.num_units,
            activation=None,
            use_bias=use_bias,
            kernel_initializer=qkv_initializer,
            name="key_projection",
        )

        self.value_projection = (
            getattr(self.args, "value_projection", True) if self.args else True
        )
        if self.value_projection:
            self.value_dense = tf.keras.layers.Dense(
                self.num_units,
                activation=None,
                use_bias=use_bias,
                kernel_initializer=qkv_initializer,
                name="value_projection",
            )

        # 相对位置偏置和时间间隔偏置
        if "relative_position_bias" in self.attention_type:
            self.rel_pos_bias = self.add_weight(
                shape=(2 * getattr(self.args, "maxlen", 50) - 1, self.num_heads),
                initializer="glorot_uniform",
                trainable=True,
                name="relative_position_bias",
            )

        if "time_interval_bias" in self.attention_type:
            max_interval = getattr(
                self.args, "time_interval_attention_max_interval", 1024
            )
            self.time_interval_bias = self.add_weight(
                shape=(max_interval + 1, self.num_heads),
                initializer="glorot_uniform",
                trainable=True,
                name="time_interval_bias",
            )

        # U投影
        self.u_projection = (
            getattr(self.args, "u_projection", False) if self.args else False
        )
        if self.u_projection:
            u_initializer = None
            if (
                hasattr(self.args, "u_projection_initializer")
                and self.args.u_projection_initializer == "normal"
            ):
                u_initializer = tf.keras.initializers.RandomNormal(mean=0, stddev=0.02)

            u_bias = (
                getattr(self.args, "u_projection_bias", False) if self.args else False
            )
            self.u_dense = tf.keras.layers.Dense(
                self.num_units,
                activation=None,
                use_bias=u_bias,
                kernel_initializer=u_initializer,
                name="u_projection",
            )

        # 输出投影
        if self.linear_projection_and_dropout:
            self.output_dense = tf.keras.layers.Dense(
                self.num_units,
                activation=None,
                kernel_initializer=qkv_initializer,
                name="output_projection",
            )

        # Dropout层
        self.dropout = tf.keras.layers.Dropout(self.dropout_rate)
        # 创建归一化层
        self.query_norm = tf.keras.layers.LayerNormalization(name="query_normalization")

        super(HstuLayer, self).build(input_shape)

    def silu(self, x):
        """SiLU (Swish) 激活函数"""
        return x * tf.sigmoid(x)

    def normalize(self, norm_func, inputs):
        """归一化"""
        return norm_func(inputs)

    def relative_position_bias(self, batch_size, maxlen, num_heads):
        """相对位置偏置"""
        seq_len = tf.shape(self.queries)[1]

        # 计算位置索引
        positions = tf.range(seq_len)
        relative_positions = positions[:, None] - positions[None, :]
        relative_positions = relative_positions + maxlen - 1  # 转换为非负索引

        # 获取相应的偏置
        bias = tf.gather(self.rel_pos_bias, relative_positions)
        # 转换形状以适配多头注意力
        bias = tf.transpose(bias, [2, 0, 1])  # (num_heads, seq_len, seq_len)
        bias = tf.tile(
            tf.expand_dims(bias, 0), [batch_size, 1, 1, 1]
        )  # (batch_size, num_heads, seq_len, seq_len)
        bias = tf.reshape(
            bias, [batch_size * num_heads, seq_len, seq_len]
        )  # (batch_size * num_heads, seq_len, seq_len)

        return bias

    def time_interval_bias(self, input_interval, maxlen, max_interval, num_heads):
        """时间间隔偏置"""
        batch_size = tf.shape(self.queries)[0]
        seq_len = tf.shape(self.queries)[1]

        # 计算时间间隔
        intervals = tf.abs(
            input_interval[:, :, None] - input_interval[:, None, :]
        )  # (batch_size, seq_len, seq_len)
        intervals = tf.minimum(intervals, max_interval)  # 截断最大间隔

        # 获取相应的偏置
        bias = tf.gather(
            self.time_interval_bias, intervals
        )  # (batch_size, seq_len, seq_len, num_heads)
        bias = tf.transpose(
            bias, [0, 3, 1, 2]
        )  # (batch_size, num_heads, seq_len, seq_len)
        bias = tf.reshape(
            bias, [batch_size * num_heads, seq_len, seq_len]
        )  # (batch_size * num_heads, seq_len, seq_len)

        return bias

    def apply_attention(
        self,
        K,
        V,
        outputs,
        scale_attention=True,
        attention_activation=None,
        attention_normalization=None,
    ):
        """应用注意力机制"""
        # 缩放
        if scale_attention:
            depth = tf.cast(tf.shape(K)[-1], tf.float32)
            outputs = outputs / tf.sqrt(depth)

        # 因果掩码
        if self.causality:
            # 创建下三角矩阵
            diag_vals = tf.ones_like(outputs[0, :, :])
            tril = tf.linalg.band_part(diag_vals, -1, 0)  # 下三角为1，上三角为0
            causality_mask = tf.tile(
                tf.expand_dims(tril, 0), [tf.shape(outputs)[0], 1, 1]
            )

            # 将上三角部分设置为很小的负数
            paddings = tf.ones_like(causality_mask) * (-(2**32) + 1)
            outputs = tf.where(tf.equal(causality_mask, 0), paddings, outputs)

        # Key掩码
        key_masks = tf.sign(tf.reduce_sum(tf.abs(K), axis=-1))  # (h*N, T_k)
        key_masks = tf.tile(
            tf.expand_dims(key_masks, 1), [1, tf.shape(self.queries)[1], 1]
        )  # (h*N, T_q, T_k)

        # 应用Key掩码
        paddings = tf.ones_like(outputs) * (-(2**32) + 1)
        outputs = tf.where(tf.equal(key_masks, 0), paddings, outputs)

        # 应用激活函数
        if attention_activation == "softmax":
            weights = tf.nn.softmax(outputs)
        else:
            weights = outputs

        # 归一化
        if attention_normalization == "softmax":
            weights = tf.nn.softmax(weights)

        # 应用dropout
        weights = self.dropout(weights, training=True)

        # 加权求和
        attention_output = tf.matmul(weights, V)

        return attention_output

    def call(self, inputs, input_interval=None, training=True):
        # 处理输入
        if isinstance(inputs, list):
            self.queries, self.keys = inputs[:2]
        else:
            self.queries = self.keys = inputs

        # 归一化查询
        if hasattr(self.args, "normalize_query") and self.args.normalize_query:
            self.queries = self.normalize(self.query_norm, self.queries)

        # 如果设置了覆写key
        if (
            hasattr(self.args, "overwrite_key_with_query")
            and self.args.overwrite_key_with_query
        ):
            self.keys = self.queries

        # 获取batch_size
        batch_size = tf.shape(self.queries)[0]

        # 线性投影
        Q = self.query_dense(self.queries)  # (N, T_q, C)
        K = self.key_dense(self.keys)  # (N, T_k, C)
        if self.value_projection:
            V = self.value_dense(self.keys)  # (N, T_k, C)
        else:
            V = self.keys

        # 分割并拼接，实现多头
        Q_split = tf.reshape(
            Q, [batch_size, -1, self.num_heads, self.num_units // self.num_heads]
        )
        Q_split = tf.transpose(Q_split, [0, 2, 1, 3])
        Q_ = tf.reshape(
            Q_split, [batch_size * self.num_heads, -1, self.num_units // self.num_heads]
        )

        K_split = tf.reshape(
            K, [batch_size, -1, self.num_heads, self.num_units // self.num_heads]
        )
        K_split = tf.transpose(K_split, [0, 2, 1, 3])
        K_ = tf.reshape(
            K_split, [batch_size * self.num_heads, -1, self.num_units // self.num_heads]
        )

        V_split = tf.reshape(
            V, [batch_size, -1, self.num_heads, self.num_units // self.num_heads]
        )
        V_split = tf.transpose(V_split, [0, 2, 1, 3])
        V_ = tf.reshape(
            V_split, [batch_size * self.num_heads, -1, self.num_units // self.num_heads]
        )

        # 应用SiLU激活
        if (
            hasattr(self.args, "qkv_projection_activation")
            and self.args.qkv_projection_activation == "silu"
        ):
            print("Use SiLU activation on qkv projection")
            Q_, K_, V_ = self.silu(Q_), self.silu(K_), self.silu(V_)

        new_values = 0
        # 不同类型的注意力机制
        if "dot_product" in self.attention_type:
            outputs = tf.matmul(Q_, tf.transpose(K_, [0, 2, 1]))  # (h*N, T_q, T_k)
            outputs = self.apply_attention(K_, V_, outputs)
            new_values += outputs

        if "relative_position_bias" in self.attention_type:
            print("Add relative position bias")
            maxlen = getattr(self.args, "maxlen", 50)
            attention_bias = self.relative_position_bias(
                batch_size, maxlen, self.num_heads
            )

            if (
                hasattr(self.args, "relative_position_bias_add_item_interaction")
                and self.args.relative_position_bias_add_item_interaction
            ):
                print("Relative position bias add item interaction")
                outputs = tf.matmul(Q_, tf.transpose(K_, [0, 2, 1]))
                outputs += attention_bias
            else:
                outputs = attention_bias

            scale_attention = (
                getattr(self.args, "scale_attention", True) if self.args else True
            )
            attention_activation = (
                getattr(self.args, "attention_activation", None) if self.args else None
            )
            attention_normalization = (
                getattr(self.args, "attention_normalization", None)
                if self.args
                else None
            )

            outputs = self.apply_attention(
                K_,
                V_,
                outputs,
                scale_attention=scale_attention,
                attention_activation=attention_activation,
                attention_normalization=attention_normalization,
            )
            new_values += outputs

        if "time_interval_bias" in self.attention_type and input_interval is not None:
            print("Add time interval bias attention")
            maxlen = getattr(self.args, "maxlen", 50)
            max_interval = getattr(
                self.args, "time_interval_attention_max_interval", 1024
            )
            attention_bias = self.time_interval_bias(
                input_interval, maxlen, max_interval, self.num_heads
            )

            if (
                hasattr(self.args, "time_interval_bias_add_item_interaction")
                and self.args.time_interval_bias_add_item_interaction
            ):
                outputs = tf.matmul(Q_, tf.transpose(K_, [0, 2, 1]))
                outputs += attention_bias
            else:
                outputs = attention_bias

            scale_attention = (
                getattr(self.args, "scale_attention", True) if self.args else True
            )
            attention_activation = (
                getattr(self.args, "attention_activation", None) if self.args else None
            )
            attention_normalization = (
                getattr(self.args, "attention_normalization", None)
                if self.args
                else None
            )

            outputs = self.apply_attention(
                K_,
                V_,
                outputs,
                scale_attention=scale_attention,
                attention_activation=attention_activation,
                attention_normalization=attention_normalization,
            )
            new_values += outputs

        # 合并多头注意力结果
        outputs_split = tf.reshape(
            new_values,
            [batch_size, self.num_heads, -1, self.num_units // self.num_heads],
        )
        outputs_split = tf.transpose(outputs_split, [0, 2, 1, 3])
        outputs = tf.reshape(outputs_split, [batch_size, -1, self.num_units])

        # U投影
        if self.u_projection:
            U = self.u_dense(self.queries)
            U = self.silu(U)
            outputs = U * self.normalize(outputs)

        # 线性投影和dropout
        if self.linear_projection_and_dropout:
            dropout_before = (
                getattr(self.args, "dropout_before_linear_projection", False)
                if self.args
                else False
            )
            if dropout_before:
                outputs = self.dropout(outputs, training=training)
            outputs = self.output_dense(outputs)
            if not dropout_before:
                outputs = self.dropout(outputs, training=training)

        # 残差连接
        outputs += self.queries

        if self.with_qk:
            return Q, K
        else:
            return outputs

    def get_config(self):
        config = super(HstuLayer, self).get_config()
        config.update(
            {
                "num_units": self.num_units,
                "num_heads": self.num_heads,
                "attention_type": self.attention_type,
                "dropout_rate": self.dropout_rate,
                "causality": self.causality,
                "linear_projection_and_dropout": self.linear_projection_and_dropout,
                "with_qk": self.with_qk,
            }
        )
        return config


def build_hstu_model(feature_columns, model_config):
    """
    构建HSTU模型 (分层结构化Transformer单元)

    参数:
    feature_columns: 特征列配置
    model_config: 模型配置字典，包含:
        - max_seq_len: 最大序列长度 (默认: 50)
        - mha_num: 多头注意力层数 (默认: 2)
        - nums_heads: 注意力头数 (默认: 1)
        - dropout: dropout率 (默认: 0.2)
        - activation: 激活函数 (默认: 'relu')
        - pos_emb_trainable: 位置编码是否可训练 (默认: True)
        - pos_initializer: 位置编码初始化器 (默认: 'glorot_uniform')
        - attention_type: 注意力类型 (默认: 'dot_product')
    """
    # 从配置中提取参数并设置默认值
    max_seq_len = model_config.get("max_seq_len", 50)
    mha_num = model_config.get("mha_num", 2)
    nums_heads = model_config.get("nums_heads", 1)
    dropout = model_config.get("dropout", 0.2)
    activation = model_config.get("activation", "relu")
    pos_emb_trainable = model_config.get("pos_emb_trainable", True)
    pos_initializer = model_config.get("pos_initializer", "glorot_uniform")
    attention_type = model_config.get("attention_type", "dot_product")
    input_layer_dict = build_input_layer(feature_columns)
    filter_feature_columns = [x for x in feature_columns if x.name != "timestamps"]
    embedding_table_dict = build_embedding_table_dict(
        filter_feature_columns, prefix="hstu/"
    )
    sequence_embedding = embedding_table_dict["item_id"](input_layer_dict["seq_ids"])
    positive_embedding = embedding_table_dict["item_id"](input_layer_dict["pos_ids"])
    # 评估时需要使用的embedding, 包括全量评估和采样评估
    negative_embedding = embedding_table_dict["item_id"](
        input_layer_dict["neg_sample_ids"]
    )

    # 对于全量物品评估，我们需要一个可以映射到物品嵌入的单一输入
    # 创建一个用于物品评估的虚拟输入，在评估时会被替换
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
        sequence_embedding_output = HstuLayer(
            num_units=feature_columns[0].emb_dim,
            num_heads=nums_heads,
            attention_type=attention_type,
            dropout_rate=dropout,
            causality=True,
            linear_projection_and_dropout=False,
            args=model_config,
            name=f"{i}_block",
        )(sequence_embedding_norm, input_interval=input_layer_dict.get("timestamps"))
        # 残差连接
        sequence_embedding = add_tensor_func(
            [sequence_embedding, sequence_embedding_output]
        )
        sequence_embedding = tf.keras.layers.LayerNormalization()(sequence_embedding)
        # 前馈神经网络
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
    user_inputs_list = [
        v for k, v in input_layer_dict.items() if k in ["seq_ids", "timestamps"]
    ]
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
