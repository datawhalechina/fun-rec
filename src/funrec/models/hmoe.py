import tensorflow as tf

from .layers import DNNs
from .utils import (
    build_input_layer,
    build_group_feature_embedding_table_dict,
    concat_group_embedding,
    get_linear_logits,
    add_tensor_func,
)


def build_hmoe_model(feature_columns, model_config):
    """
    构建分层专家混合（HMoE）排序模型（多域CTR风格）。

    参数:
        feature_columns: List[FeatureColumn]
        model_config: 包含以下配置的字典:
            - num_domains: int, 域的数量（默认: 5）
            - domain_feature_name: str, 域指示特征名称（默认: 'tab'）
            - share_gate: bool, 门控是否在域间共享（默认: False）
            - share_domain_w: bool, 域权重是否共享（默认: False）
            - shared_expert_nums: int, 共享专家数量（默认: 5）
            - shared_expert_dnn_units: List[int], 专家MLP单元（默认: [256, 128]）
            - gate_dnn_units: List[int], 门控MLP单元（默认: [256, 128]）
            - domain_tower_units: List[int], 域塔单元（默认: [128, 64]）
            - domain_weight_units: List[int], 域权重网络单元（默认: [128, 64]）
            - linear_logits: bool, 添加线性项（默认: True）
    返回:
        (model, None, None): FunRec流水线的排序模型元组
    """
    num_domains = model_config.get("num_domains", 5)
    domain_feature_name = model_config.get("domain_feature_name", "tab")
    share_gate = model_config.get("share_gate", False)
    share_domain_w = model_config.get("share_domain_w", False)
    shared_expert_nums = model_config.get("shared_expert_nums", 5)
    shared_expert_dnn_units = model_config.get("shared_expert_dnn_units", [256, 128])
    gate_dnn_units = model_config.get("gate_dnn_units", [256, 128])
    domain_tower_units = model_config.get("domain_tower_units", [128, 64])
    domain_weight_units = model_config.get("domain_weight_units", [128, 64])
    use_linear_logits = model_config.get("linear_logits", True)
    # 构建输入层字典
    input_layer_dict = build_input_layer(feature_columns)
    domain_input = input_layer_dict[domain_feature_name]
    # 确保域输入是整数类型，用于比较/掩码操作
    if domain_input.dtype != tf.int32 and domain_input.dtype != tf.int64:
        domain_input = tf.keras.layers.Lambda(
            lambda x: tf.cast(tf.round(x), tf.int32), name="cast_domain_to_int"
        )(domain_input)
    # 构建特征嵌入表字典
    group_embedding_feature_dict = build_group_feature_embedding_table_dict(
        feature_columns, input_layer_dict, prefix="embedding/"
    )

    # 连接不同组的嵌入向量作为各个网络的输入
    dnn_inputs = concat_group_embedding(group_embedding_feature_dict, "dnn")

    # 创建多个专家
    expert_output_list = []
    for i in range(shared_expert_nums):
        expert_output = DNNs(shared_expert_dnn_units, name=f"expert_{str(i)}")(
            dnn_inputs
        )
        expert_output_list.append(expert_output)
    expert_concat = tf.keras.layers.Lambda(lambda x: tf.stack(x, axis=1))(
        expert_output_list
    )  # (None, expert_num, dims)

    if share_gate:
        # 共享Gate
        domain_tower_input_list = []
        gate_output = DNNs(gate_dnn_units, name=f"shared_gates")(dnn_inputs)
        gate_output = tf.keras.layers.Dense(
            shared_expert_nums,
            use_bias=False,
            activation="softmax",
            name=f"domain_{i}_softmax",
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
        for _ in range(num_domains):
            domain_tower_input_list.append(gate_expert_output)
    else:
        domain_tower_input_list = []
        for i in range(num_domains):
            gate_output = DNNs(gate_dnn_units, name=f"domain_{str(i)}_gates")(
                dnn_inputs
            )
            gate_output = tf.keras.layers.Dense(
                shared_expert_nums,
                use_bias=False,
                activation="softmax",
                name=f"domain_{i}_softmax",
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
            for _ in range(num_domains):
                domain_tower_input_list.append(gate_expert_output)

    # 定义domain tower
    domain_tower_output_list = []
    for i in range(num_domains):
        domain_dnn_input = domain_tower_input_list[i]
        task_output = DNNs(domain_tower_units)(domain_dnn_input)
        domain_tower_output_list.append(task_output)

    # 定义domain权重
    domain_weight_list = []
    if share_domain_w:
        # 共享domain权重
        domain_weight = DNNs(domain_weight_units)(dnn_inputs)
        for i in range(num_domains):
            domain_weight_list.append(domain_weight)
    else:
        for i in range(num_domains):
            domain_weight = DNNs(domain_weight_units)(dnn_inputs)
            domain_weight = tf.keras.layers.Lambda(lambda x: tf.nn.softmax(x, axis=1))(
                domain_weight
            )
            domain_weight_list.append(domain_weight)

    # 融合domain信息
    domain_output_list = []
    for i in range(num_domains):
        domain_weight = domain_weight_list[i]
        domain_tower_output = domain_tower_output_list[i]
        weighted_output = tf.keras.layers.Lambda(lambda x: x[0] * x[1])(
            [domain_weight, domain_tower_output]
        )
        for j in range(num_domains):
            if i == j:
                continue
            grad_output = tf.keras.layers.Lambda(lambda x: tf.stop_gradient(x))(
                domain_tower_output_list[j]
            )
            weighted_output = tf.keras.layers.Add()(
                [
                    weighted_output,
                    tf.keras.layers.Multiply()(
                        [domain_weight_list[i][:, j : j + 1], grad_output]
                    ),
                ]
            )
        dummy_domain = tf.keras.layers.Lambda(
            lambda x: tf.ones_like(x[0], dtype=tf.int32) * tf.cast(x[1], tf.int32)
        )([domain_input, i])
        domain_mask = tf.keras.layers.Lambda(
            lambda x: tf.squeeze(tf.equal(x[0], x[1]), axis=-1)
        )([domain_input, dummy_domain])
        domain_output = tf.keras.layers.Lambda(lambda x: tf.boolean_mask(x[0], x[1]))(
            [weighted_output, domain_mask]
        )
        domain_output_list.append(domain_output)
    # 将所有domain的数据拼接成batch
    final_domain_output = tf.keras.layers.Concatenate(axis=0)(domain_output_list)
    # 生成DNN分支logit
    dnn_logit = tf.keras.layers.Dense(1, activation=None, name="dnn_logits")(
        final_domain_output
    )

    # 可选择性地添加线性项
    if use_linear_logits:
        linear_logit = get_linear_logits(input_layer_dict, feature_columns)
        final_logit = add_tensor_func(
            [dnn_logit, linear_logit], name="hmoe_final_logit"
        )
    else:
        final_logit = tf.keras.layers.Identity(name="hmoe_final_logit")(dnn_logit)

    # 二分类CTR的Sigmoid激活
    output = tf.keras.layers.Activation("sigmoid", name="hmoe_output")(final_logit)
    output = tf.keras.layers.Flatten()(output)

    # 构建模型（排序模型返回 (model, None, None)）
    model = tf.keras.Model(inputs=list(input_layer_dict.values()), outputs=output)
    return model, None, None
