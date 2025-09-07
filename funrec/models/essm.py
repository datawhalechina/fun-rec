import tensorflow as tf

from .utils import (
    build_input_layer,
    build_group_feature_embedding_table_dict,
    concat_group_embedding,
)
from .layers import DNNs, PredictLayer


def build_essm_model(feature_columns, model_config):
    """
    构建ESSM（全空间多任务模型）排序模型。

    参数:
        feature_columns: FeatureColumn列表
        model_config: 包含以下参数的字典:
            - task_names: 列表，任务名称（默认 ["is_click", "is_like"]）
            - task_tower_dnn_units: 列表，任务塔DNN隐藏单元数（默认 [128, 64]）
            - dropout_rate: 浮点数，丢弃率（默认 0.1）

    返回:
        (model, None, None): 排序模型元组
    """
    task_names = model_config.get("task_names", ["is_click", "is_like"])
    task_tower_dnn_units = model_config.get("task_tower_dnn_units", [128, 64])
    dropout_rate = model_config.get("dropout_rate", 0.1)

    # 输入层
    input_layer_dict = build_input_layer(feature_columns)

    # 分组嵌入
    group_embedding_feature_dict = build_group_feature_embedding_table_dict(
        feature_columns, input_layer_dict, prefix="embedding/"
    )

    # 连接不同组的嵌入向量作为网络的输入
    dnn_inputs = concat_group_embedding(group_embedding_feature_dict, "dnn")

    # CTR塔（第一个任务）
    ctr_output_logits = DNNs(
        name="ctr_dnn", units=task_tower_dnn_units + [1], dropout_rate=dropout_rate
    )(dnn_inputs)

    # CVR塔（第二个任务）
    cvr_output_logits = DNNs(
        name="cvr_dnn", units=task_tower_dnn_units + [1], dropout_rate=dropout_rate
    )(dnn_inputs)

    # 应用预测层
    ctr_output_prob = PredictLayer(name="ctr_output")(ctr_output_logits)
    cvr_output_prob = PredictLayer(name="cvr_output")(cvr_output_logits)

    # CTCVR = CTR * CVR（ESSM核心思想）
    ctcvr_output_prob = tf.keras.layers.Lambda(lambda x: tf.multiply(x[0], x[1]))(
        [ctr_output_prob, cvr_output_prob]
    )

    # 构建模型，输出任务输出列表
    model = tf.keras.models.Model(
        inputs=list(input_layer_dict.values()),
        outputs=[ctr_output_prob, ctcvr_output_prob],
    )
    return model, None, None
