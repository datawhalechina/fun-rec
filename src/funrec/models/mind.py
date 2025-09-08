import tensorflow as tf

from .utils import (
    concat_group_embedding,
    build_input_layer,
    build_group_feature_embedding_table_dict,
    pooling_group_embedding,
)
from .layers import DNNs, CapsuleLayer, LabelAwareAttention, SampledSoftmaxLayer


def dynamic_capsule_num(seq_len, k_max):
    """
    动态计算胶囊数量

    参数:
        seq_len: 序列长度 [B, 1]
        k_max: 最大胶囊数量

    返回:
        k_capsule: 动态胶囊数量
    """
    seq_len = tf.squeeze(seq_len, axis=1)  # [B,]
    log_len = tf.math.log1p(tf.cast(seq_len, dtype="float32"))
    # 最少一个胶囊
    k_capsule = tf.cast(
        tf.maximum(
            1.0, tf.minimum(tf.cast(k_max, dtype="float32"), log_len / tf.math.log(2.0))
        ),
        dtype="int32",
    )
    return k_capsule


def build_mind_model(feature_columns, model_config):
    """
    构建MIND (Multi-Interest Network with Dynamic routing)模型

    参数:
    feature_columns: 特征列配置
    model_config: 模型配置字典，包含:
        - neg_samples: 负采样数量 (默认: 50)
        - emb_dims: embedding维度 (默认: 16)
        - max_capsulen_nums: 最大胶囊数量 (默认: 4)
        - max_seq_len: 最大序列长度 (默认: 50)
        - user_dnn_units: 用户DNN层单元数 (默认: [128, 64])
    """
    # 从配置中提取参数并设置默认值
    neg_samples = model_config.get("neg_samples", 50)
    emb_dims = model_config.get("emb_dims", 16)
    max_capsulen_nums = model_config.get("max_capsulen_nums", 4)
    max_seq_len = model_config.get("max_seq_len", 50)
    user_dnn_units = model_config.get("user_dnn_units", [128, 64])

    # 从特征列中获取物品词汇表大小和标签名称
    item_vocab_size = None
    label_name = None
    for fc in feature_columns:
        if "target_item" in fc.group and fc.name == "movie_id":
            item_vocab_size = fc.vocab_size
            label_name = fc.name
            break

    if item_vocab_size is None or label_name is None:
        raise ValueError("无法从特征列中找到物品词汇表大小或标签名称")

    # 获取用户嵌入特征名称列表
    user_emb_feature_name_list = []
    for fc in feature_columns:
        if any(group in ["user_dnn", "raw_hist_seq"] for group in fc.group):
            user_emb_feature_name_list.append(fc.name)
    user_emb_feature_name_list.append("hist_len")  # 添加hist_len

    # 构建输入层
    input_layer_dict = build_input_layer(feature_columns)

    # 构建特征embedding表
    group_embedding_feature_dict, embedding_table_dict = (
        build_group_feature_embedding_table_dict(
            feature_columns,
            input_layer_dict,
            prefix="embedding/",
            return_embedding_table=True,
        )
    )

    user_dnn_inputs = concat_group_embedding(group_embedding_feature_dict, "user_dnn")
    user_hist_seq_embedding = pooling_group_embedding(
        group_embedding_feature_dict, "raw_hist_seq"
    )
    target_item_embedding = pooling_group_embedding(
        group_embedding_feature_dict, "target_item"
    )

    # 转换成胶囊的数量
    user_dnn_inputs = tf.keras.layers.Lambda(lambda x: tf.expand_dims(x, axis=1))(
        user_dnn_inputs
    )
    user_dnn_inputs = tf.keras.layers.Lambda(
        lambda x: tf.tile(x, [1, max_capsulen_nums, 1])
    )(
        user_dnn_inputs
    )  # [B, k_max, feat_num x dim]

    # 因为序列是左侧padding，所以mask需要反转
    hist_len = input_layer_dict["hist_len"]
    sequence_mask = tf.keras.layers.Lambda(
        lambda x: tf.reverse(
            tf.sequence_mask(tf.squeeze(x, axis=1), maxlen=max_seq_len), axis=[1]
        )
    )(
        hist_len
    )  # [B, max_seq_len]

    capsule_num = tf.keras.layers.Lambda(lambda x: dynamic_capsule_num(x[0], x[1]))(
        [hist_len, max_capsulen_nums]
    )

    high_capsule = CapsuleLayer(
        input_units=emb_dims,
        out_units=emb_dims,
        max_len=max_seq_len,
        k_max=max_capsulen_nums,
    )(
        [user_hist_seq_embedding, sequence_mask, capsule_num]
    )  # [B,k_max,out_units]

    # 将每个胶囊都拼接上用户的特征
    user_embeddings = tf.keras.layers.Concatenate(axis=-1)(
        [user_dnn_inputs, high_capsule]
    )
    # 再将拼接后的特征降维到胶囊的维度
    user_embeddings = DNNs(user_dnn_units + [emb_dims])(user_embeddings)

    # 计算LabelAwareAttention
    user_embedding_final = LabelAwareAttention(k_max=max_capsulen_nums, pow_p=1.0)(
        (user_embeddings, target_item_embedding)
    )
    user_embedding_final = tf.keras.layers.Lambda(lambda x: tf.nn.l2_normalize(x, -1))(
        user_embedding_final
    )

    # 获取item emb权重
    item_embedding_weight = embedding_table_dict[label_name].embeddings
    # 获取item embedding
    output_item_embedding = tf.keras.layers.Lambda(lambda x: tf.squeeze(x, axis=1))(
        embedding_table_dict[label_name](input_layer_dict[label_name])
    )
    # 构建采样softmax层
    sampled_softmax_layer = SampledSoftmaxLayer(
        vocab_size=item_vocab_size, num_sampled=neg_samples, emb_dim=emb_dims
    )
    # 计算输出
    output = sampled_softmax_layer(
        [item_embedding_weight, user_embedding_final, input_layer_dict[label_name]]
    )

    # 构建模型
    model = tf.keras.Model(inputs=list(input_layer_dict.values()), outputs=output)

    # 构建用户模型和物品模型用于评估
    user_inputs_list = [
        input_layer_dict[feat_name] for feat_name in user_emb_feature_name_list
    ]
    user_model = tf.keras.Model(inputs=user_inputs_list, outputs=user_embeddings)

    item_model = tf.keras.Model(
        inputs=input_layer_dict[label_name], outputs=output_item_embedding
    )

    return model, user_model, item_model
