import tensorflow as tf

from .utils import (
    build_input_layer,
    build_group_feature_embedding_table_dict,
    concat_group_embedding,
)
from .layers import DNNs, PredictLayer


def build_shared_bottom_model(feature_columns, model_config):
    """
    构建Shared-Bottom多任务排序模型。

    Args:
        feature_columns: FeatureColumn列表
        model_config: 包含参数的字典:
            - task_names: 列表，任务名称 (默认 ["is_click"])
            - share_dnn_units: 列表，共享底层DNN隐藏单元 (默认 [128, 64])
            - task_tower_dnn_units: 列表，任务塔DNN隐藏单元 (默认 [128, 64])
            - dropout_rate: 浮点数，dropout率 (默认 0.1)

    Returns:
        (model, None, None): 排序模型元组
    """
    task_names = model_config.get("task_names", ["is_click"])
    share_dnn_units = model_config.get("share_dnn_units", [128, 64])
    task_tower_dnn_units = model_config.get("task_tower_dnn_units", [128, 64])
    dropout_rate = model_config.get("dropout_rate", 0.1)

    # 输入层
    input_layer_dict = build_input_layer(feature_columns)

    # 分组嵌入
    group_embedding_feature_dict = build_group_feature_embedding_table_dict(
        feature_columns, input_layer_dict, prefix="embedding/"
    )

    # 连接不同组的嵌入向量作为网络的输入
    dnn_inputs = concat_group_embedding(group_embedding_feature_dict, "shared_bottom")

    # 构建共享底层DNN层
    shared_bottom_feature = DNNs(
        name="shared_bottom", units=share_dnn_units, dropout_rate=dropout_rate
    )(dnn_inputs)

    # 构建任务特定塔
    task_output_list = []
    for task_name in task_names:
        task_output_logit = DNNs(
            name=f"task_tower_{task_name}",
            units=task_tower_dnn_units + [1],
            dropout_rate=dropout_rate,
        )(shared_bottom_feature)

        task_output_prob = PredictLayer(name=f"task_{task_name}")(task_output_logit)
        task_output_list.append(task_output_prob)

    # 构建模型，输出任务输出列表
    model = tf.keras.models.Model(
        inputs=list(input_layer_dict.values()), outputs=task_output_list
    )
    return model, None, None
