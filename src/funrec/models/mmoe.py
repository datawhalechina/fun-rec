import tensorflow as tf

from .utils import (
    build_input_layer,
    build_group_feature_embedding_table_dict,
    concat_group_embedding,
)
from .layers import DNNs, PredictLayer


def build_mmoe_model(feature_columns, model_config):
    """
    构建多门控专家混合（MMoE）多任务排序模型。

    Args:
        feature_columns: FeatureColumn 列表
        model_config: 包含参数的字典：
            - task_names: 列表，任务名称（默认 ["is_click"]）
            - expert_nums: 整数，专家数量（默认 4）
            - expert_dnn_units: 列表，专家 DNN 隐藏单元（默认 [128, 64]）
            - gate_dnn_units: 列表，门控 DNN 隐藏单元（默认 [128, 64]）
            - task_tower_dnn_units: 列表，任务塔 DNN 隐藏单元（默认 [128, 64]）
            - dropout_rate: 浮点数，dropout 率（默认 0.1）

    Returns:
        (model, None, None): 排序模型元组
    """
    task_names = model_config.get("task_names", ["is_click"])
    expert_nums = model_config.get("expert_nums", 4)
    expert_dnn_units = model_config.get("expert_dnn_units", [128, 64])
    gate_dnn_units = model_config.get("gate_dnn_units", [128, 64])
    task_tower_dnn_units = model_config.get("task_tower_dnn_units", [128, 64])
    dropout_rate = model_config.get("dropout_rate", 0.1)

    # 输入层
    input_layer_dict = build_input_layer(feature_columns)

    # 分组嵌入
    group_embedding_feature_dict = build_group_feature_embedding_table_dict(
        feature_columns, input_layer_dict, prefix="embedding/"
    )

    # 连接不同组的嵌入向量作为网络的输入
    dnn_inputs = concat_group_embedding(group_embedding_feature_dict, "mmoe")

    # 创建多个专家
    expert_output_list = []
    for i in range(expert_nums):
        expert_output = DNNs(
            name=f"expert_{i}", units=expert_dnn_units, dropout_rate=dropout_rate
        )(dnn_inputs)
        expert_output_list.append(expert_output)
    expert_concat = tf.keras.layers.Lambda(lambda x: tf.stack(x, axis=1))(
        expert_output_list
    )  # (None, expert_num, dims)

    # 定义任务特定的门控网络
    task_tower_input_list = []
    for i, task_name in enumerate(task_names):
        gate_output = DNNs(
            name=f"task_{i}_gates", units=gate_dnn_units, dropout_rate=dropout_rate
        )(dnn_inputs)
        gate_output = tf.keras.layers.Dense(
            expert_nums, use_bias=False, activation="softmax", name=f"task_{i}_softmax"
        )(gate_output)
        gate_output = tf.keras.layers.Lambda(lambda x: tf.expand_dims(x, axis=-1))(
            gate_output
        )  # (None,expert_num, 1)
        gate_expert_output = tf.keras.layers.Lambda(lambda x: x[0] * x[1])(
            [gate_output, expert_concat]
        )
        gate_expert_output = tf.keras.layers.Lambda(
            lambda x: tf.reduce_sum(x, axis=1, keepdims=False)
        )(gate_expert_output)
        task_tower_input_list.append(gate_expert_output)

    # 不同任务通过门控融合多个专家
    task_output_list = []
    for i, task_name in enumerate(task_names):
        task_output_logit = DNNs(
            name=f"task_tower_{task_name}",
            units=task_tower_dnn_units + [1],
            dropout_rate=dropout_rate,
        )(task_tower_input_list[i])

        task_output_prob = PredictLayer(name=f"task_{task_name}")(task_output_logit)
        task_output_list.append(task_output_prob)

    # 构建模型，输出任务输出列表
    model = tf.keras.models.Model(
        inputs=list(input_layer_dict.values()), outputs=task_output_list
    )
    return model, None, None
