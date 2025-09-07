import tensorflow as tf

from .utils import (
    concat_group_embedding,
    build_input_layer,
    build_group_feature_embedding_table_dict,
)
from .layers import DNNs, SampledSoftmaxLayer, L2NormalizeLayer, SqueezeLayer


def build_youtubednn_model(feature_columns, model_config):
    # 从model_config中提取参数
    emb_dim = model_config.get("emb_dim", 16)
    neg_sample = model_config.get("neg_sample", 20)
    dnn_units = model_config.get("dnn_units", [32])
    label_name = model_config.get("label_name", "movie_id")

    input_layer_dict = build_input_layer(feature_columns)
    group_embedding_feature_dict, embedding_table_dict = (
        build_group_feature_embedding_table_dict(
            feature_columns,
            input_layer_dict,
            prefix="embedding/",
            return_embedding_table=True,
        )
    )

    user_feature_embedding = concat_group_embedding(
        group_embedding_feature_dict, "user_dnn"
    )  # B x (D * N)
    if "raw_hist_seq" in group_embedding_feature_dict:
        hist_seq_embedding = concat_group_embedding(
            group_embedding_feature_dict, "raw_hist_seq"
        )  # B x D
        user_dnn_inputs = tf.concat(
            [user_feature_embedding, hist_seq_embedding], axis=1
        )  # B x (D * N + D)
    else:
        user_dnn_inputs = user_feature_embedding  # B x (D * N)

    # 获取物品嵌入表和词汇表大小
    item_embedding_table = embedding_table_dict[label_name]
    item_vocab_size = None
    for fc in feature_columns:
        if fc.name == label_name:
            item_vocab_size = fc.vocab_size
            break

    # 构建用户塔
    user_dnn_output = DNNs(
        units=dnn_units + [emb_dim], activation="relu", use_bn=False
    )(user_dnn_inputs)
    user_dnn_output = L2NormalizeLayer(axis=-1)(user_dnn_output)

    # 构建采样softmax层
    sampled_softmax_layer = SampledSoftmaxLayer(item_vocab_size, neg_sample, emb_dim)
    output = sampled_softmax_layer(
        [item_embedding_table.embeddings, user_dnn_output, input_layer_dict[label_name]]
    )

    # 构建输出层
    model = tf.keras.Model(inputs=input_layer_dict, outputs=output)

    # 构建评估模型
    output_item_embedding = SqueezeLayer(axis=1)(
        embedding_table_dict[label_name](input_layer_dict[label_name])
    )
    output_item_embedding = L2NormalizeLayer(axis=-1)(output_item_embedding)

    # 构建用户模型和物品模型用于评估
    user_feature_names = [
        fc.name
        for fc in feature_columns
        if "user_dnn" in fc.group or "raw_hist_seq" in fc.group
    ]
    user_inputs_dict = {name: input_layer_dict[name] for name in user_feature_names}
    user_model = tf.keras.Model(inputs=user_inputs_dict, outputs=user_dnn_output)

    item_inputs_dict = {label_name: input_layer_dict[label_name]}
    item_model = tf.keras.Model(inputs=item_inputs_dict, outputs=output_item_embedding)

    return model, user_model, item_model
