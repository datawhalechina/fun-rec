"""
因子分解机（FM）推荐模型。
"""

import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, Dot, Add, Subtract, Concatenate

from .utils import (
    build_input_layer,
    build_group_feature_embedding_table_dict,
    concat_group_embedding,
)
from .layers import PredictLayer


class SumPooling(tf.keras.layers.Layer):
    """对嵌入特征进行求和聚合的层"""

    def __init__(self, name=None, **kwargs):
        super(SumPooling, self).__init__(name=name, **kwargs)

    def call(self, inputs):
        # inputs shape: [batch_size, num_features, embedding_dim]
        return tf.reduce_sum(inputs, axis=1)  # [batch_size, embedding_dim]

    def get_config(self):
        config = super(SumPooling, self).get_config()
        return config


class OnesLayer(tf.keras.layers.Layer):
    """生成全1向量的层"""

    def __init__(self, name=None, **kwargs):
        super(OnesLayer, self).__init__(name=name, **kwargs)

    def call(self, inputs):
        batch_size = tf.shape(inputs)[0]
        return tf.ones((batch_size, 1), dtype=tf.float32)

    def get_config(self):
        config = super(OnesLayer, self).get_config()
        return config


class SquareLayer(tf.keras.layers.Layer):
    """平方操作层"""

    def __init__(self, name=None, **kwargs):
        super(SquareLayer, self).__init__(name=name, **kwargs)

    def call(self, inputs):
        return tf.square(inputs)

    def get_config(self):
        config = super(SquareLayer, self).get_config()
        return config


class SumScalarLayer(tf.keras.layers.Layer):
    """将向量求和为标量的层"""

    def __init__(self, name=None, **kwargs):
        super(SumScalarLayer, self).__init__(name=name, **kwargs)

    def call(self, inputs):
        return tf.reduce_sum(inputs, axis=1, keepdims=True)

    def get_config(self):
        config = super(SumScalarLayer, self).get_config()
        return config


class ScaleLayer(tf.keras.layers.Layer):
    """按常数缩放的层"""

    def __init__(self, scale_factor, name=None, **kwargs):
        super(ScaleLayer, self).__init__(name=name, **kwargs)
        self.scale_factor = scale_factor

    def call(self, inputs):
        return inputs * self.scale_factor

    def get_config(self):
        config = super(ScaleLayer, self).get_config()
        config.update({"scale_factor": self.scale_factor})
        return config


def build_fm_recall_model(feature_columns, model_config):
    """
    构建因子分解机(FM)模型 - 双塔结构用于召回
    基于FM的数学分解：MatchScore = V_item · V_user^T

    根据FM的数学推导：
    - 用户向量：V_user = [1; ∑(v_u * x_u)]
    - 物品向量：V_item = [∑w_t*x_t + FM_interaction; ∑(v_t * x_t)]

    Args:
        feature_columns: 特征列配置
        model_config: 模型配置字典，包含:
            - embedding_dim: 嵌入维度 (default: 8)

    Returns:
        Tuple of (training_model, user_model, item_model)
    """
    # 从配置中提取参数，设置默认值
    embedding_dim = model_config.get("embedding_dim", 8)

    # 构建输入层和嵌入特征
    input_layer_dict = build_input_layer(feature_columns)
    group_embedding_feature_dict = build_group_feature_embedding_table_dict(
        feature_columns, input_layer_dict, prefix="embedding/"
    )

    # 分离用户和物品的输入
    user_inputs = [
        input_layer_dict[fc.name] for fc in feature_columns if "user" in fc.group
    ]
    item_inputs = [
        input_layer_dict[fc.name] for fc in feature_columns if "item" in fc.group
    ]

    # === 用户塔：V_user = [1; ∑(v_u * x_u)] ===
    def build_user_tower():
        user_embeddings = group_embedding_feature_dict.get("user", [])
        if not user_embeddings:
            raise ValueError("No user embeddings found")

        # 计算用户嵌入向量的和：∑(v_u * x_u)
        # 注意：这里的x_u对于one-hot编码的类别特征来说就是1
        user_concat = Concatenate(axis=1, name="user_concat")(
            user_embeddings
        )  # [batch_size, num_user_features, embedding_dim]
        user_embedding_sum = SumPooling(name="user_embedding_sum")(
            user_concat
        )  # [batch_size, embedding_dim]

        # 构建用户向量：[1; ∑(v_u * x_u)]
        ones_vector = OnesLayer(name="ones_vector")(
            user_embedding_sum
        )  # [batch_size, 1]

        # 拼接：[1; ∑(v_u * x_u)]
        user_vector = Concatenate(axis=1, name="user_vector")(
            [ones_vector, user_embedding_sum]
        )

        return user_vector

    # === 物品塔：V_item = [first_term; ∑(v_t * x_t)] ===
    def build_item_tower():
        item_embeddings = group_embedding_feature_dict.get("item", [])
        if not item_embeddings:
            raise ValueError("No item embeddings found")

        # 计算物品嵌入向量的和：∑(v_t * x_t)
        item_concat = Concatenate(axis=1, name="item_concat")(
            item_embeddings
        )  # [batch_size, num_item_features, embedding_dim]
        item_embedding_sum = SumPooling(name="item_embedding_sum")(
            item_concat
        )  # [batch_size, embedding_dim]

        # 计算一阶线性项：∑(w_t * x_t)
        # 为每个物品特征学习一个权重
        item_linear_weights = Dense(
            1, activation="linear", use_bias=False, name="item_linear_weights"
        )(
            item_embedding_sum
        )  # [batch_size, 1]

        # 计算FM二阶交互项：0.5 * ((∑v_t*x_t)² - ∑(v_t²*x_t²))
        # 1. 计算 (∑v_t*x_t)²
        sum_squared = SquareLayer(name="item_sum_squared")(
            item_embedding_sum
        )  # [batch_size, embedding_dim]

        # 2. 计算 ∑(v_t²*x_t²) = ∑(v_t²)，因为x_t=1对于one-hot特征
        item_squared = SquareLayer(name="item_squared")(
            item_concat
        )  # [batch_size, num_item_features, embedding_dim]
        squared_sum = SumPooling(name="item_squared_sum")(
            item_squared
        )  # [batch_size, embedding_dim]

        # 3. 计算FM交互项：0.5 * (sum_squared - squared_sum)
        fm_interaction_vector = Subtract(name="fm_subtract")(
            [sum_squared, squared_sum]
        )  # [batch_size, embedding_dim]
        # 乘以0.5
        fm_interaction_half = ScaleLayer(0.5, name="fm_half_scale")(
            fm_interaction_vector
        )

        # 4. 聚合FM交互项为标量
        fm_interaction_scalar = SumScalarLayer(name="fm_interaction_scalar")(
            fm_interaction_half
        )  # [batch_size, 1]

        # 5. 计算first_term = ∑(w_t*x_t) + FM_interaction
        first_term = Add(name="item_first_term")(
            [item_linear_weights, fm_interaction_scalar]
        )  # [batch_size, 1]

        # 6. 构建物品向量：[first_term; ∑(v_t * x_t)]
        item_vector = Concatenate(axis=1, name="item_vector")(
            [first_term, item_embedding_sum]
        )

        return item_vector

    # 构建双塔
    user_representation = build_user_tower()  # [batch_size, 1 + embedding_dim]
    item_representation = build_item_tower()  # [batch_size, 1 + embedding_dim]

    # === 构建独立的用户和物品模型 ===
    user_model = Model(
        inputs=user_inputs, outputs=user_representation, name="user_tower_model"
    )

    item_model = Model(
        inputs=item_inputs, outputs=item_representation, name="item_tower_model"
    )

    # === 构建训练模型 ===
    # 计算FM匹配分数：V_item · V_user^T（内积）
    fm_score = Dot(axes=1, name="fm_match_score")(
        [item_representation, user_representation]
    )  # [batch_size, 1]

    # 输出层（sigmoid激活用于二分类）
    output = Dense(1, activation="sigmoid", name="output")(fm_score)

    # 训练模型
    all_inputs = user_inputs + item_inputs
    training_model = Model(
        inputs=all_inputs, outputs=output, name="fm_two_tower_training"
    )

    return training_model, user_model, item_model
