import tensorflow as tf
from .layers import EPNet, PPNet, PredictLayer
from .utils import (
    build_input_layer,
    build_group_feature_embedding_table_dict,
    concat_group_embedding,
    add_tensor_func,
    get_linear_logits,
)


def build_pepnet_model(feature_columns, model_config):
    """构建PEPNet排序模型并遵循FunRec接口约定

    Args:
        feature_columns: 特征列配置
        model_config: 模型参数配置，包含：
            - task_names: 任务名称列表（默认 ["is_click", "long_view", "is_like"]）
            - pepnet_dnn_units: PPNet中DNN层的隐藏单元数量（默认 [128, 64]）
            - pepnet_activation: PPNet中DNN层的激活函数（默认 'relu'）
            - pepnet_dropout: PPNet中的dropout比例（默认 0.1）
            - l2_reg: L2正则化系数（默认 1e-5）
            - linear_logits: 是否加上线性项（默认 False）
    Returns:
        (model, None, None): 排序模型返回单一主模型
    """
    task_name_list = model_config.get(
        "task_names", ["is_click", "long_view", "is_like"]
    )
    pepnet_dnn_units = model_config.get("pepnet_dnn_units", [128, 64])
    pepnet_activation = model_config.get("pepnet_activation", "relu")
    pepnet_dropout = model_config.get("pepnet_dropout", 0.1)
    l2_reg = model_config.get("l2_reg", 1e-5)
    linear_logits = model_config.get("linear_logits", False)
    # 构建输入层字典
    input_layer_dict = build_input_layer(feature_columns)
    # 构建特征嵌入表字典
    group_embedding_feature_dict = build_group_feature_embedding_table_dict(
        feature_columns, input_layer_dict, prefix="embedding/"
    )

    # 连接不同组的嵌入向量作为各个网络的输入
    epnet_inputs = concat_group_embedding(group_embedding_feature_dict, "epnet")
    pepnet_inputs = concat_group_embedding(group_embedding_feature_dict, "pepnet")
    dnn_inputs = concat_group_embedding(group_embedding_feature_dict, "dnn")

    # 创建EPNet和PPNet网络结构
    # EPNet负责嵌入个性化
    epnet = EPNet(l2_reg, name="dnn/epnet")
    # PPNet负责参数个性化，multiples参数为任务数量
    ppnet = PPNet(
        len(task_name_list),
        pepnet_dnn_units,
        pepnet_activation,
        pepnet_dropout,
        l2_reg,
        name="dnn/ppnet",
    )

    # 通过EPNet处理嵌入
    ep_emb = epnet([epnet_inputs, dnn_inputs])
    # 通过PPNet处理经过个性化的嵌入，生成多任务输出
    pp_output = ppnet([ep_emb, pepnet_inputs])

    if linear_logits:
        linear_logits = get_linear_logits(input_layer_dict, feature_columns)
        pp_output_logits = []
        for pp in pp_output:
            ppout_logit = tf.keras.layers.Dense(1, use_bias=False)(pp)
            task_logit = add_tensor_func([linear_logits, ppout_logit])
            pp_output_logits.append(task_logit)
        pp_output = pp_output_logits

    # 为每个任务创建输出层
    output_list = []
    for i, task_name in enumerate(task_name_list):
        # 对每个任务使用预测层生成最终输出
        prediction = PredictLayer(name=task_name)(pp_output[i])
        output_list.append(prediction)

    # 创建最终的Keras模型
    model = tf.keras.Model(inputs=list(input_layer_dict.values()), outputs=output_list)
    # FunRec排序模型约定：返回 (model, None, None)
    return model, None, None
