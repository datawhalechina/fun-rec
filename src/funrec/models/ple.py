import tensorflow as tf
import itertools

from .utils import (
    build_input_layer,
    build_group_feature_embedding_table_dict,
    concat_group_embedding,
)
from .layers import DNNs, PredictLayer


def cgc_net(
    input_list,
    task_num,
    task_expert_num,
    shared_expert_num,
    task_expert_dnn_units,
    shared_expert_dnn_units,
    task_gate_dnn_units,
    shared_gate_dnn_units,
    leval_name=None,
    is_last=False,
):
    """CGC结构
    input_list: 每个任务都有一个输入，这些任务的输入都是共享的，为了方便处理，给每个任务都复制了一份
    is_last: 主要是判断是否是最后一层CGC，如果是的话，就不需要把共享部分添加到输出中了
    """

    # 创建每个任务的任务专家
    task_expert_list = []
    for i in range(task_num):
        task_i_expert_list = []
        for j in range(task_expert_num):
            expert_dnn = DNNs(
                task_expert_dnn_units,
                name=f"{leval_name}_task_{str(i)}_expert_{str(j)}",
            )(input_list[i])
            task_i_expert_list.append(expert_dnn)
        task_expert_list.append(task_i_expert_list)

    # 创建所有任务的共享专家
    shared_expert_list = []
    for i in range(shared_expert_num):
        expert_dnn = DNNs(
            shared_expert_dnn_units, name=f"{leval_name}_shared_expert_{str(i)}"
        )(input_list[-1])
        shared_expert_list.append(expert_dnn)

    # 创建每个任务的融合门控
    task_gate_list = []
    fusion_expert_num = task_expert_num + shared_expert_num
    for i in range(task_num):
        gate_dnn = DNNs(task_gate_dnn_units, name=f"{leval_name}_task_{str(i)}_gate")(
            input_list[i]
        )
        gate_dnn = tf.keras.layers.Dense(
            fusion_expert_num, use_bias=False, activation="softmax"
        )(gate_dnn)
        gate_dnn = tf.keras.layers.Lambda(lambda x: tf.expand_dims(x, axis=-1))(
            gate_dnn
        )  # (None, gate_num, 1)
        task_gate_list.append(gate_dnn)

    # CGC输出结果
    cgc_output_list = []
    for i in range(task_num):
        cur_experts = task_expert_list[i] + shared_expert_list
        expert_concat = tf.keras.layers.Lambda(lambda x: tf.stack(x, axis=1))(
            cur_experts
        )  # None, gate_num, dim
        cur_gate = task_gate_list[i]
        task_gate_fusion_dnn = tf.keras.layers.Lambda(
            lambda x: tf.reduce_sum(x[0] * x[1], axis=1, keepdims=False)
        )(
            [cur_gate, expert_concat]
        )  # None, dim
        cgc_output_list.append(task_gate_fusion_dnn)

    # 如果不是最后一层还需要更新共享专家下一层的输入，也就是当前层需要融合所有任务和共享专家
    if not is_last:
        cur_experts = (
            list(itertools.chain.from_iterable(task_expert_list)) + shared_expert_list
        )
        cur_expert_num = len(cur_experts)
        expert_concat = tf.keras.layers.Lambda(lambda x: tf.stack(x, axis=1))(
            cur_experts
        )  # None, cur_expert_num, dim
        shared_gate_dnn = DNNs(shared_gate_dnn_units, name=f"{leval_name}_shared_gate")(
            input_list[-1]
        )
        shared_gate_dnn = tf.keras.layers.Dense(
            cur_expert_num, use_bias=False, activation="softmax"
        )(
            shared_gate_dnn
        )  # None, cur_expert_num
        shared_gate = tf.keras.layers.Lambda(lambda x: tf.expand_dims(x, -1))(
            shared_gate_dnn
        )  # None, cur_expert_num, 1
        shared_gate_fusion_output = tf.keras.layers.Lambda(
            lambda x: tf.reduce_sum(x[0] * x[1], axis=1, keepdims=False)
        )([shared_gate, expert_concat])
        cgc_output_list.append(shared_gate_fusion_output)
    return cgc_output_list


def build_ple_model(feature_columns, model_config):
    """
    构建PLE（渐进式分层提取）多任务排序模型。

    参数:
        feature_columns: FeatureColumn列表
        model_config: 包含参数的字典:
            - task_names: 列表，任务名称（默认["is_click"]）
            - ple_level_nums: 整数，PLE层数（默认1）
            - task_expert_num: 整数，任务专用专家数量（默认4）
            - shared_expert_num: 整数，共享专家数量（默认2）
            - task_expert_dnn_units: 列表，任务专家DNN隐藏单元（默认[128, 64]）
            - shared_expert_dnn_units: 列表，共享专家DNN隐藏单元（默认[128, 64]）
            - task_gate_dnn_units: 列表，任务门控DNN隐藏单元（默认[128, 64]）
            - shared_gate_dnn_units: 列表，共享门控DNN隐藏单元（默认[128, 64]）
            - task_tower_dnn_units: 列表，任务塔DNN隐藏单元（默认[128, 64]）
            - dropout_rate: 浮点数，dropout率（默认0.1）

    返回:
        (model, None, None): 排序模型元组
    """
    # 从model_config中提取参数
    task_names = model_config.get("task_names", ["is_click"])
    ple_level_nums = model_config.get("ple_level_nums", 1)
    task_expert_num = model_config.get("task_expert_num", 4)
    shared_expert_num = model_config.get("shared_expert_num", 2)
    task_expert_dnn_units = model_config.get("task_expert_dnn_units", [128, 64])
    shared_expert_dnn_units = model_config.get("shared_expert_dnn_units", [128, 64])
    task_gate_dnn_units = model_config.get("task_gate_dnn_units", [128, 64])
    shared_gate_dnn_units = model_config.get("shared_gate_dnn_units", [128, 64])
    task_tower_dnn_units = model_config.get("task_tower_dnn_units", [128, 64])
    dropout_rate = model_config.get("dropout_rate", 0.1)

    # 输入层
    input_layer_dict = build_input_layer(feature_columns)

    # 分组嵌入
    group_embedding_feature_dict = build_group_feature_embedding_table_dict(
        feature_columns, input_layer_dict, prefix="embedding/"
    )

    # 连接不同组的嵌入向量作为网络的输入
    dnn_inputs = concat_group_embedding(group_embedding_feature_dict, "ple")

    task_num = len(task_names)
    ple_input_list = [dnn_inputs] * (task_num + 1)

    for i in range(ple_level_nums):
        if i == ple_level_nums - 1:
            cgc_output_list = cgc_net(
                ple_input_list,
                task_num,
                task_expert_num,
                shared_expert_num,
                task_expert_dnn_units,
                shared_expert_dnn_units,
                task_gate_dnn_units,
                shared_gate_dnn_units,
                leval_name=f"cgc_level_{str(i)}",
                is_last=True,
            )
        else:
            cgc_output_list = cgc_net(
                ple_input_list,
                task_num,
                task_expert_num,
                shared_expert_num,
                task_expert_dnn_units,
                shared_expert_dnn_units,
                task_gate_dnn_units,
                shared_gate_dnn_units,
                leval_name=f"cgc_level_{str(i)}",
                is_last=False,
            )
            ple_input_list = cgc_output_list

    # 构建任务专用塔
    task_output_list = []
    for i in range(task_num):
        task_output_logit = DNNs(
            name=f"task_tower_{task_names[i]}",
            units=task_tower_dnn_units + [1],
            dropout_rate=dropout_rate,
        )(cgc_output_list[i])

        task_output_prob = PredictLayer(name=f"task_{task_names[i]}")(task_output_logit)
        task_output_list.append(task_output_prob)

    # 构建模型，输出任务输出列表
    model = tf.keras.models.Model(
        inputs=list(input_layer_dict.values()), outputs=task_output_list
    )
    return model, None, None
