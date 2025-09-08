import tensorflow as tf
from .layers import (
    DNNs,
    PositionEncodingLayer,
    MetaUnit,
    MetaAttention,
    MetaTower,
    PredictLayer,
    TaskEmbedding,
)
from .utils import (
    build_input_layer,
    build_group_feature_embedding_table_dict,
    concat_group_embedding,
    get_linear_logits,
    concat_func,
)


def build_m2m_model(feature_columns, model_config):
    """构建M2M排序模型并遵循FunRec接口约定

    Args:
        feature_columns: 特征列配置
        model_config: 模型参数配置，包含：
            - task_names: 任务名称列表（默认 ["is_click", "long_view", "is_like"]）
            - domain_group_name: 领域/场景分组名称（默认 'domain'）
            - num_experts, view_dim, scenario_dim, meta_tower_depth, meta_unit_depth,
              meta_unit_shared, activation, dropout, l2_reg
            - positon_agg_func, pos_emb_trainable, pos_initializer, sequence_pooling
            - linear_logits: 是否加上线性项（默认 True）
    Returns:
        (model, None, None): 排序模型返回单一主模型
    """
    task_name_list = model_config.get(
        "task_names", ["is_click", "long_view", "is_like"]
    )
    domain_group_name = model_config.get("domain_group_name", "domain")
    num_experts = model_config.get("num_experts", 4)
    view_dim = model_config.get("view_dim", 32)
    scenario_dim = model_config.get("scenario_dim", 16)
    meta_tower_depth = model_config.get("meta_tower_depth", 3)
    meta_unit_depth = model_config.get("meta_unit_depth", 3)
    meta_unit_shared = model_config.get("meta_unit_shared", True)
    activation = model_config.get("activation", "leaky_relu")
    dropout = model_config.get("dropout", 0.2)
    l2_reg = model_config.get("l2_reg", 1e-5)
    positon_agg_func = model_config.get("positon_agg_func", "concat")
    pos_emb_trainable = model_config.get("pos_emb_trainable", True)
    pos_initializer = model_config.get("pos_initializer", "glorot_uniform")
    sequence_pooling = model_config.get("sequence_pooling", "mean")
    use_linear_logits = model_config.get("linear_logits", True)
    # 构建输入层字典
    input_layer_dict = build_input_layer(feature_columns)

    # 构建特征嵌入表字典
    group_embedding_feature_dict = build_group_feature_embedding_table_dict(
        feature_columns, input_layer_dict, prefix="embedding/"
    )

    # 用于创建常量/广播张量的批次参考张量
    first_input_tensor = next(iter(input_layer_dict.values()))

    task_embedding_layers = [
        TaskEmbedding(view_dim, name=f"task_emb_{i}")
        for i in range(len(task_name_list))
    ]
    task_embedding_list = [layer(first_input_tensor) for layer in task_embedding_layers]

    # 用户嵌入：优先选择 'user' 组；回退到 'dnn'
    if "user" in group_embedding_feature_dict:
        user_embeddings = concat_group_embedding(group_embedding_feature_dict, "user")
    elif "dnn" in group_embedding_feature_dict:
        user_embeddings = concat_group_embedding(group_embedding_feature_dict, "dnn")
    else:
        # 如果都不存在，使用维度为view_dim的零向量
        user_embeddings = tf.keras.layers.Lambda(
            lambda x: tf.zeros((tf.shape(x)[0], view_dim))
        )(first_input_tensor)

    expert_inputs = (
        concat_group_embedding(group_embedding_feature_dict, "dnn")
        if "dnn" in group_embedding_feature_dict
        else user_embeddings
    )
    transformer_input_dict = group_embedding_feature_dict.get("mha", {})

    # 领域嵌入：取配置组下的第一个嵌入
    if domain_group_name in group_embedding_feature_dict:
        domain_group = group_embedding_feature_dict[domain_group_name]
        if isinstance(domain_group, list) and len(domain_group) > 0:
            domain_input = domain_group[0]
        elif isinstance(domain_group, dict) and len(domain_group) > 0:
            domain_input = list(domain_group.values())[0]
        else:
            domain_input = None
    else:
        domain_input = None
    if (
        domain_input is not None
        and len(domain_input.shape) == 3
        and domain_input.shape[1] == 1
    ):
        domain_embeddings = tf.keras.layers.Lambda(lambda x: tf.squeeze(x, axis=1))(
            domain_input
        )
    elif domain_input is not None:
        domain_embeddings = domain_input
    else:
        domain_embeddings = tf.keras.layers.Lambda(
            lambda x: tf.zeros((tf.shape(x)[0], view_dim))
        )(first_input_tensor)

    # 序列transformer
    mha_output_list = []
    for feat_name, transformer_input in transformer_input_dict.items():
        fc = [x for x in feature_columns if x.name == feat_name][0]
        position_embedding = PositionEncodingLayer(
            dims=transformer_input.shape[-1],
            max_len=fc.max_len,
            trainable=pos_emb_trainable,
            initializer=pos_initializer,
        )(transformer_input)
        if positon_agg_func == "sum":
            transformer_input = tf.keras.layers.Add()(
                [transformer_input, position_embedding]
            )
        elif positon_agg_func == "concat":
            transformer_input = tf.keras.layers.Concatenate(axis=-1)(
                [transformer_input, position_embedding]
            )
        transformer_output = tf.keras.layers.MultiHeadAttention(
            num_heads=1,
            key_dim=16,
            value_dim=16,
            dropout=0.2,
        )(transformer_input, transformer_input, transformer_input)
        if sequence_pooling == "mean":
            transformer_output = tf.keras.layers.Lambda(
                lambda x: tf.reduce_mean(x, axis=1)
            )(transformer_output)
        mha_output_list.append(transformer_output)

    mha_output = None
    if len(mha_output_list) != 0:
        mha_output = concat_func(mha_output_list, axis=-1)
        expert_inputs = tf.concat([expert_inputs, mha_output], axis=-1)
        print("mha shape", mha_output.shape)

    # 场景知识表示
    scenario_inputs = [domain_embeddings, user_embeddings]
    scenario_views = DNNs(
        [scenario_dim], activation=activation, name="dnn/scenario_mlp"
    )(tf.concat(scenario_inputs, axis=-1))

    # 专家视图表示
    expert_views = []
    for i in range(num_experts):
        expert_view = DNNs(
            [view_dim],
            activation=activation,
            dropout_rate=dropout,
            name=f"dnn/expert_{i}_mlp",
        )(expert_inputs)
        expert_views.append(expert_view)
    expert_views = tf.stack(expert_views, axis=1)

    attention_shared_meta_unit = None
    tower_shared_meta_unit = None
    if meta_unit_shared:
        attention_shared_meta_unit = MetaUnit(
            meta_unit_depth,
            activation,
            dropout,
            l2_reg,
            name="dnn/attention_shared_meta_unit",
        )
        tower_shared_meta_unit = MetaUnit(
            meta_unit_depth,
            activation,
            dropout,
            l2_reg,
            name="dnn/tower_shared_meta_unit",
        )

    linear_logit = None
    if use_linear_logits:
        linear_logit = get_linear_logits(input_layer_dict, feature_columns)

    # 构建多任务输出
    output_list = []
    for i, task_name in enumerate(task_name_list):
        # 任务视图表示
        task_embedding = task_embedding_list[i]
        task_views = DNNs(
            [view_dim],
            activation=activation,
            dropout_rate=dropout,
            name=f"dnn/{task_name}_mlp",
        )(task_embedding)

        # 元注意力机制
        meta_attention = MetaAttention(
            meta_unit=attention_shared_meta_unit,
            num_layer=meta_unit_depth,
            activation=activation,
            dropout=dropout,
            l2_reg=l2_reg,
            name=f"dnn/meta_attention_{task_name}",
        )
        attention_output = meta_attention([expert_views, task_views, scenario_views])

        # 元塔网络
        meta_tower = MetaTower(
            meta_unit=tower_shared_meta_unit,
            num_layer=meta_tower_depth,
            meta_unit_depth=meta_unit_depth,
            activation=activation,
            dropout=dropout,
            l2_reg=l2_reg,
            name=f"dnn/meta_tower_{task_name}",
        )
        tower_output = meta_tower([attention_output, scenario_views])
        tower_output = tf.keras.layers.Flatten()(tower_output)
        # 产生原始logits（无激活函数）
        tower_logit = PredictLayer(as_logit=True, name=f"{task_name}/tower_logit")(
            tower_output
        )

        if use_linear_logits:
            tower_logit = tf.keras.layers.Add()([tower_logit, linear_logit])
        # 确保形状为 (batch, 1)
        tower_logit = tf.keras.layers.Flatten(name=f"{task_name}/tower_logit_flat")(
            tower_logit
        )

        # 任务预测输出
        prediction = PredictLayer(name=f"task_{task_name}_output")(tower_logit)
        output_list.append(prediction)

    # 构建模型
    model = tf.keras.Model(inputs=list(input_layer_dict.values()), outputs=output_list)
    # FunRec排序模型约定：返回 (model, None, None)
    return model, None, None
