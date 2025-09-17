import os
import logging

logger = logging.getLogger(__name__)

import tensorflow as tf
import networkx as nx
import numpy as np
from tqdm import tqdm


class SimpleWalker:
    """简化的随机游走器实现"""

    def build_graph(self, session_list):

        logger.debug("构建图...")

        # 提取所有边
        edges = []
        for session in session_list:
            if len(session) > 1:
                for i in range(len(session) - 1):
                    u = int(session[i])
                    v = int(session[i + 1])
                    edges.append((u, v))

        if len(edges) == 0:
            return None, None

        # 创建NetworkX图
        G = nx.Graph()
        G.add_edges_from(edges)

        # 获取所有唯一节点
        nodes = list(G.nodes())
        node_map = {node: i for i, node in enumerate(nodes)}
        reverse_node_map = {i: node for i, node in enumerate(nodes)}

        logger.debug(
            f"图包含 {G.number_of_nodes()} 个节点和 {G.number_of_edges()} 条边"
        )

        return G, (node_map, reverse_node_map)

    def generate_walks(self, G, num_walks, walk_length):
        """生成随机游走"""
        logger.debug(f"生成随机游走...")

        walks = []
        nodes = list(G.nodes())

        for _ in range(num_walks):
            np.random.shuffle(nodes)
            for node in tqdm(
                nodes,
                desc=f"Walk {_+1}/{num_walks}",
                disable=not logger.isEnabledFor(logging.DEBUG),
            ):
                walk = [node]
                for _ in range(walk_length - 1):
                    curr = walk[-1]
                    neighbors = list(G.neighbors(curr))
                    if len(neighbors) == 0:
                        break
                    walk.append(np.random.choice(neighbors))
                walks.append(walk)

        logger.debug(f"生成的游走序列数量: {len(walks)}")

        return walks


def get_graph_context_all_pairs(walks, window_size):
    """
    从随机游走生成训练样本对
    """
    all_pairs = []
    for walk in tqdm(
        walks, desc="生成训练样本对", disable=not logger.isEnabledFor(logging.DEBUG)
    ):
        for i in range(len(walk)):
            for j in range(
                max(0, i - window_size), min(len(walk), i + window_size + 1)
            ):
                if i != j:
                    all_pairs.append((walk[i], walk[j]))
    logger.debug(f"生成的样本对数量: {len(all_pairs)}")
    return all_pairs


class ItemSpecificAttentionLayer(tf.keras.layers.Layer):
    """
    正确实现EGES论文中描述的加权池化注意力层
    A ∈ R^{|V| × (n+1)} - 每个商品有自己的一组特征权重
    """

    def __init__(self, num_items, **kwargs):
        """
        参数:
            num_items: 商品总数 |V|
        """
        self.num_items = num_items
        super(ItemSpecificAttentionLayer, self).__init__(**kwargs)

    def build(self, input_shape):
        # 商品数量和特征数量
        num_features = input_shape[1]  # n+1

        # 为每个商品创建一组特征权重 A ∈ R^{|V| × (n+1)}
        self.attention_weights = self.add_weight(
            name="attention_weights",
            shape=(self.num_items, num_features),  # |V| x (n+1)
            initializer=tf.keras.initializers.RandomNormal(),
            trainable=True,
            regularizer=tf.keras.regularizers.l2(1e-5),
        )
        super(ItemSpecificAttentionLayer, self).build(input_shape)

    def call(self, inputs, item_indices):
        """
        参数:
            inputs: 特征嵌入 [batch_size, n+1, emb_dim], n 是特征数量，emb_dim 是嵌入维度
            item_indices: 当前批次中每个样本对应的商品索引 [batch_size]
        """

        # 获取每个样本对应的商品特定权重 [batch_size, n+1]
        batch_attention_weights = tf.gather(self.attention_weights, item_indices)

        # 计算 e^(a_v^j)
        exp_attention = tf.exp(batch_attention_weights)  # [batch_size, n+1]

        # 计算每个样本的权重和 [batch_size, 1]
        attention_sum = tf.reduce_sum(exp_attention, axis=1, keepdims=True)

        # 归一化权重 [batch_size, n+1]
        normalized_attention = exp_attention / attention_sum

        # 扩展维度用于广播 [batch_size, n+1, 1]
        normalized_attention = tf.expand_dims(normalized_attention, axis=-1)

        # 应用权重到特征嵌入
        weighted_embedding = inputs * normalized_attention  # [batch_size, n+1, emb_dim]

        # 求和得到最终表示
        output = tf.reduce_sum(weighted_embedding, axis=1)  # [batch_size, emb_dim]

        return output, normalized_attention


def generate_negative_samples(train_sample_dict, num_negatives=2):
    """生成负样本"""
    negative_sample_dict = {
        # 重复 movie_id 列 num_negatives次
        "movie_id": np.repeat(train_sample_dict["movie_id"], num_negatives),
        # 重复 context_id 列 num_negatives次
        "context_id": np.repeat(train_sample_dict["context_id"], num_negatives),
        # 重复 genre_id 列 num_negatives次
        "genre_id": np.repeat(train_sample_dict["genre_id"], num_negatives),
    }
    # 打乱负样本字典中的context_id
    np.random.shuffle(negative_sample_dict["context_id"])

    return negative_sample_dict


def build_eges_model(feature_columns, model_config):
    """
    构建EGES模型（自包含版本，适配funrec训练/评估流程）

    参数:
        feature_columns: 未使用（EGES使用自定义输入）
        model_config: 包含以下字段：
            - dataset_name: 数据集名称，用于解析字典大小            
            - item_feature_list: 物品侧特征列表（例如 ['movie_id', 'genre_id']）
            - emb_dim: 嵌入维度
            - l2_reg: L2正则
            - use_attention: 是否使用注意力聚合
    返回:
        (main_model, None, item_model)
    """
    from ..config.data_config import DATASET_CONFIG
    from ..data.data_utils import read_pkl_data

    item_feature_list = model_config.get("item_feature_list", ["movie_id", "genre_id"])
    emb_dim = int(model_config.get("emb_dim", 16))
    l2_reg = float(model_config.get("l2_reg", 1e-5))
    use_attention = model_config.get("use_attention", True)
    dataset_name = model_config.get("dataset_name")    

    if dataset_name is None:
        raise ValueError("EGES requires 'dataset_name' in model_config")

    dataset_cfg = dict(DATASET_CONFIG.get(dataset_name, {}))

    feature_dict = read_pkl_data(dataset_cfg["dict_path"])

    # 推断词表大小
    item_vocab_size = feature_dict.get("movie_id") or feature_dict.get("movieId") or 0
    if not isinstance(item_vocab_size, int):
        # 兼容可能的dict形式
        item_vocab_size = len(item_vocab_size) + 1
    genre_vocab_size = feature_dict.get("genres", 0)
    if not isinstance(genre_vocab_size, int):
        genre_vocab_size = len(genre_vocab_size) + 1

    # 输入层
    inputs = {
        "movie_id": tf.keras.Input(shape=(), dtype="int32", name="movie_id"),
        "context_id": tf.keras.Input(shape=(), dtype="int32", name="context_id"),
        "genre_id": tf.keras.Input(shape=(), dtype="int32", name="genre_id"),
    }

    # 嵌入层
    movie_emb_table = tf.keras.layers.Embedding(
        input_dim=item_vocab_size,
        output_dim=emb_dim,
        name="eges_movie_id",
        embeddings_initializer=tf.keras.initializers.RandomNormal(),
        embeddings_regularizer=tf.keras.regularizers.l2(l2_reg),
        mask_zero=False,
    )
    genre_emb_table = tf.keras.layers.Embedding(
        input_dim=genre_vocab_size,
        output_dim=emb_dim,
        name="eges_genre_id",
        embeddings_initializer=tf.keras.initializers.RandomNormal(),
        embeddings_regularizer=tf.keras.regularizers.l2(l2_reg),
        mask_zero=False,
    )
    context_emb_table = tf.keras.layers.Embedding(
        input_dim=item_vocab_size,
        output_dim=emb_dim,
        name="eges_context_id",
        embeddings_initializer=tf.keras.initializers.RandomNormal(),
        embeddings_regularizer=tf.keras.regularizers.l2(l2_reg),
        mask_zero=False,
    )

    # 查表
    feature_embedding_dict = {
        "movie_id": tf.expand_dims(movie_emb_table(inputs["movie_id"]), axis=1),
        "genre_id": tf.expand_dims(genre_emb_table(inputs["genre_id"]), axis=1),
        "context_id": tf.expand_dims(context_emb_table(inputs["context_id"]), axis=1),
    }

    # 堆叠物品侧特征
    all_feature_embeddings = []
    for feat_name in item_feature_list:
        all_feature_embeddings.append(feature_embedding_dict[feat_name])  # [B,1,D]
    stacked_embeddings = tf.concat(all_feature_embeddings, axis=1)  # [B,n,D]

    # 商品索引（注意力权重用）
    item_indices = tf.cast(inputs["movie_id"], tf.int32)

    # 加权聚合
    if use_attention:
        attention_layer = ItemSpecificAttentionLayer(num_items=item_vocab_size)
        final_embedding, _ = attention_layer(stacked_embeddings, item_indices)
    else:
        final_embedding = tf.reduce_mean(stacked_embeddings, axis=1)

    # 与上下文点积
    context_embedding = tf.squeeze(feature_embedding_dict["context_id"], axis=1)
    output = tf.reduce_sum(final_embedding * context_embedding, axis=1, keepdims=True)
    output = tf.keras.layers.Activation("sigmoid")(output)

    # 主模型
    model = tf.keras.Model(inputs=inputs, outputs=output)

    # 便于评估：物品输入与嵌入
    item_inputs = {k: v for k, v in inputs.items() if k in item_feature_list}
    model.__setattr__("item_input", item_inputs)
    model.__setattr__("item_embedding", final_embedding)

    # 物品侧嵌入模型
    item_model = tf.keras.Model(inputs=item_inputs, outputs=final_embedding)

    return model, None, item_model
