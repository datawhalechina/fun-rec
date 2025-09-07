# -*- coding: utf-8 -*-
import tensorflow as tf

from .layers import APGLayer, PredictLayer
from .utils import (
    build_input_layer,
    build_group_feature_embedding_table_dict,
    concat_group_embedding,
    get_linear_logits,
)


def build_apg_model(feature_columns, model_config):
    """按照FunRec约定构建APG排序模型。

    参数:
        feature_columns: FeatureColumn列表
        model_config: 字典，支持以下键：
            - task_names: 任务名称列表 (默认 ["is_click"])
            - scene_group_name: 提供场景嵌入的场景组名称 (例如 'domain')
            - apg_dnn_units: APG层隐藏单元列表 (默认 [256, 128])
            - scene_emb_dim: 场景嵌入维度 (未使用；从嵌入中推导)
            - activation: APG内部/输出激活函数 (默认 'relu')
            - dropout: 每个APG层后的dropout (默认 0.2)
            - l2_reg: l2正则化 (保留)
            - use_uv_shared: bool，使用UV共享权重 (默认 True)
            - use_mf_p: bool，启用P路径因子分解 (默认 True)
            - mf_k: int，K路径因子分割因子 (默认 4)
            - mf_p: int，P路径因子分割因子 (默认 4)
            - linear_logits: bool，添加线性项 (默认 False)

    返回:
        (model, None, None)
    """
    task_name_list = model_config.get("task_names", ["is_click"])
    scene_group_name = model_config.get("scene_group_name", "domain")
    apg_dnn_units = model_config.get("apg_dnn_units", [256, 128])
    scene_emb_dim = model_config.get("scene_emb_dim", 8)
    activation = model_config.get("activation", "relu")
    dropout = model_config.get("dropout", 0.2)
    l2_reg = model_config.get("l2_reg", 1e-5)
    use_uv_shared = model_config.get("use_uv_shared", True)
    use_mf_p = model_config.get("use_mf_p", True)
    mf_k = model_config.get("mf_k", 4)
    mf_p = model_config.get("mf_p", 4)
    linear_logits = model_config.get("linear_logits", False)

    # 构建输入层
    input_layer_dict = build_input_layer(feature_columns)

    # 按组构建嵌入表
    group_embedding_feature_dict = build_group_feature_embedding_table_dict(
        feature_columns, input_layer_dict, prefix="embedding/"
    )

    # 合并DNN嵌入并提取场景嵌入
    dnn_inputs = concat_group_embedding(group_embedding_feature_dict, "dnn")
    # 场景组应包含至少一个形状为[B, 1, D]的稀疏嵌入张量
    if scene_group_name not in group_embedding_feature_dict:
        raise ValueError(f"在特征组中未找到scene_group_name '{scene_group_name}'")
    scene_group_list = group_embedding_feature_dict[scene_group_name]
    if isinstance(scene_group_list, dict):
        # 选择第一个张量
        scene_tensor = next(iter(scene_group_list.values()))
    else:
        scene_tensor = scene_group_list[0]
    scene_emb = tf.keras.layers.Lambda(lambda x: tf.squeeze(x, axis=1))(scene_tensor)

    # 构建APG堆叠层
    input_dim = dnn_inputs.shape[-1]
    x = dnn_inputs
    for i, units in enumerate(apg_dnn_units):
        x = APGLayer(
            input_dim=input_dim,
            output_dim=units,
            scene_emb_dim=scene_emb_dim,
            activation=activation,
            use_uv_shared=use_uv_shared,
            use_mf_p=use_mf_p,
            mf_k=mf_k,
            mf_p=mf_p,
            name=f"apg_layer_{i}",
        )([x, scene_emb])
        if dropout and dropout > 0:
            x = tf.keras.layers.Dropout(dropout)(x)
        input_dim = units

    # 可选的线性logits
    linear_logits_tensor = None
    if linear_logits:
        linear_logits_tensor = get_linear_logits(input_layer_dict, feature_columns)

    # 任务特定输出
    task_outputs = []
    for i, task_name in enumerate(task_name_list):
        task_logit = tf.keras.layers.Dense(
            1, use_bias=False, name=f"task_{task_name}_logit"
        )(x)
        if linear_logits and linear_logits_tensor is not None:
            task_logit = tf.keras.layers.Add()([task_logit, linear_logits_tensor])
        output = PredictLayer(name=task_name)(task_logit)
        task_outputs.append(output)

    # Keras模型
    model = tf.keras.Model(inputs=list(input_layer_dict.values()), outputs=task_outputs)

    # FunRec排序模型约定
    return model, None, None
