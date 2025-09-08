import tensorflow as tf

from .utils import (
    build_input_layer,
    build_group_feature_embedding_table_dict,
    concat_group_embedding,
    add_tensor_func,
    get_linear_logits,
    concat_func,
)
from .layers import (
    DNNs,
    PredictLayer,
    PartitionedNormalization,
    StarTopologyFCN,
)


def build_star_model(feature_columns, model_config):
    """
    为FunRec构建STAR（星形拓扑自适应推荐器）排序模型。

    Args:
        feature_columns: FeatureColumn列表
        model_config: 包含参数的字典:
            - num_domains: 整数，域的数量
            - domain_feature_name: 字符串，域指示特征名称
            - star_dnn_units: 列表，STAR FCN隐藏单元 (默认 [128, 64])
            - aux_dnn_units: 列表，辅助DNN隐藏单元 (默认 [128, 64])
            - star_fcn_activation: 字符串，STAR FCN的激活函数 (默认 'relu')
            - dropout: 浮点数，dropout率 (默认 0.2)
            - l2_reg: 浮点数，L2正则化 (默认 1e-5)
            - linear_logits: 布尔值，是否添加线性项 (默认 False)

    Returns:
        (model, None, None): 排序模型元组
    """
    num_domains = model_config.get("num_domains", 5)
    domain_feature_name = model_config.get("domain_feature_name", "tab")
    star_dnn_units = model_config.get("star_dnn_units", [128, 64])
    aux_dnn_units = model_config.get("aux_dnn_units", [128, 64])
    star_fcn_activation = model_config.get("star_fcn_activation", "relu")
    dropout = model_config.get("dropout", 0.2)
    l2_reg = model_config.get("l2_reg", 1e-5)
    linear_logits = model_config.get("linear_logits", False)
    # 构建输入层字典
    input_layer_dict = build_input_layer(feature_columns)
    domain_input = input_layer_dict[domain_feature_name]

    # 构建特征嵌入表字典
    group_embedding_feature_dict = build_group_feature_embedding_table_dict(
        feature_columns, input_layer_dict, prefix="embedding/"
    )

    # 连接不同组的嵌入向量作为各个网络的输入
    domain_embeddings = concat_group_embedding(group_embedding_feature_dict, "domain")
    dnn_inputs = concat_group_embedding(group_embedding_feature_dict, "dnn")

    fcn_inputs = PartitionedNormalization(num_domain=num_domains, name="fcn_pn_layer")(
        [dnn_inputs, domain_input]
    )

    fcn_output = StarTopologyFCN(
        num_domains,
        star_dnn_units,
        star_fcn_activation,
        dropout,
        l2_reg,
        name="star_fcn_layer",
    )([fcn_inputs, domain_input])

    fcn_logit = PredictLayer(activation=None, name="fcn_logits")(fcn_output)

    aux_inputs = concat_func([domain_embeddings, dnn_inputs], axis=-1)
    aux_inputs = PartitionedNormalization(num_domain=num_domains, name="aux_pn_layer")(
        [aux_inputs, domain_input]
    )

    aux_output = DNNs(aux_dnn_units, dropout_rate=dropout)(aux_inputs)
    aux_logit = PredictLayer(activation=None, name="aux_logits")(aux_output)

    if linear_logits:
        linear_logits = get_linear_logits(input_layer_dict, feature_columns)
        final_logits = add_tensor_func([linear_logits, fcn_logit, aux_logit])
    else:
        final_logits = add_tensor_func([fcn_logit, aux_logit])

    # 将logits转换为概率并展平以匹配标签形状
    final_logits = tf.keras.layers.Flatten(name="star_logits_flat")(final_logits)
    final_prediction = tf.keras.layers.Dense(
        1, activation="sigmoid", name="star_output"
    )(final_logits)
    final_prediction = tf.keras.layers.Flatten(name="star_output_flat")(
        final_prediction
    )

    # 构建模型
    model = tf.keras.Model(
        inputs=list(input_layer_dict.values()), outputs=final_prediction
    )
    return model, None, None
