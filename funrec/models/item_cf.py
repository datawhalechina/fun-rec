"""
基于物品的协同过滤推荐算法。
"""

import numpy as np
from collections import defaultdict
import pandas as pd
from tqdm import tqdm
from operator import itemgetter


class ItemCF:
    """
    优化的基于物品的协同过滤算法，用于CTR预测。
    使用基于用户的倒排索引进行更快的计算和直接推荐生成。
    """

    def __init__(self, k_neighbors=20, min_similarity=0.1):
        """
        初始化ItemCF模型。

        参数:
        -----------
        k_neighbors : int, 默认=20
            用于推荐的邻居数量。
        min_similarity : float, 默认=0.1
            将物品视为邻居的最小相似度阈值。
        """
        self.k_neighbors = k_neighbors
        self.min_similarity = min_similarity

        # 用于优化的数据结构
        self.user_items = defaultdict(dict)  # 用户 -> 物品评分字典 (CTR中为1.0)
        self.item_users = defaultdict(set)  # 物品 -> 交互用户集合
        self.item_similarity = defaultdict(dict)  # 物品 -> {邻居: 相似度}
        self.user_map = {}  # 原始用户ID -> 内部ID
        self.item_map = {}  # 原始物品ID -> 内部ID
        self.reverse_user_map = {}  # 内部ID -> 原始用户ID
        self.reverse_item_map = {}  # 内部ID -> 原始物品ID

    def fit(self, user_item_interactions):
        """
        使用用户-物品交互数据训练模型（带有0/1标签的CTR数据）。

        参数:
        -----------
        user_item_interactions : 元组列表 (user_id, item_id, label) 或 DataFrame
            训练数据，其中label为0（未点击）或1（点击）。
            只有label=1的交互被视为正向交互。

        返回:
        --------
        self : ItemCF实例
        """
        # 如果需要，转换为DataFrame
        if not isinstance(user_item_interactions, pd.DataFrame):
            user_item_interactions = pd.DataFrame(
                user_item_interactions, columns=["user_id", "item_id", "label"]
            )

        # 只过滤正向交互（点击）
        positive_interactions = user_item_interactions[
            user_item_interactions["label"] == 1
        ]

        # 创建映射
        unique_users = positive_interactions["user_id"].unique()
        unique_items = positive_interactions["item_id"].unique()

        self.user_map = {user: idx for idx, user in enumerate(unique_users)}
        self.item_map = {item: idx for idx, item in enumerate(unique_items)}
        self.reverse_user_map = {idx: user for user, idx in self.user_map.items()}
        self.reverse_item_map = {idx: item for item, idx in self.item_map.items()}

        # 构建数据结构: 用户 -> {物品: 评分}, 物品 -> {用户}
        for _, row in positive_interactions.iterrows():
            user_id = self.user_map[row["user_id"]]
            item_id = self.item_map[row["item_id"]]

            self.user_items[user_id][item_id] = 1.0  # CTR: 所有正向交互的评分为1.0
            self.item_users[item_id].add(user_id)

        # 计算物品相似度
        self._calculate_item_similarity()

        return self

    def _calculate_item_similarity(self):
        """
        使用基于用户的倒排索引优化计算物品相似度。
        以更高效的格式存储相似度用于推荐。
        """
        # 步骤1: 构建共现矩阵 C[i][j] = 共同用户数量
        C = defaultdict(lambda: defaultdict(int))

        # 对于每个用户，找到他们都交互过的所有物品对
        for user_id, items in self.user_items.items():
            items_list = list(items.keys())
            # 对于该用户交互过的所有物品对
            for i in range(len(items_list)):
                for j in range(i + 1, len(items_list)):
                    i1, i2 = items_list[i], items_list[j]
                    C[i1][i2] += 1
                    C[i2][i1] += 1  # 对称

        # 步骤2: 计算最终相似度分数并高效存储
        for i1 in C:
            for i2 in C[i1]:
                if i1 >= i2:  # 避免重复计算
                    continue

                # 计算余弦相似度
                similarity = C[i1][i2] / np.sqrt(
                    len(self.item_users[i1]) * len(self.item_users[i2])
                )

                if similarity >= self.min_similarity:
                    self.item_similarity[i1][i2] = similarity
                    self.item_similarity[i2][i1] = similarity

    def recommend(self, user_id, n_recommendations=10, exclude_interacted=True):
        """
        使用直接计算的优化推荐，无需predict_score。
        基于物品的协同过滤：推荐与用户已交互物品相似的物品。

        参数:
        -----------
        user_id : 原始用户ID
        n_recommendations : int, 推荐数量
        exclude_interacted : bool, 是否排除已交互的物品

        返回:
        --------
        元组列表: [(item_id, score), ...]
        """
        if user_id not in self.user_map:
            return []

        user_idx = self.user_map[user_id]

        # 获取用户已交互的物品
        user_interacted_items = self.user_items[user_idx]
        interacted_items = (
            set(user_interacted_items.keys()) if exclude_interacted else set()
        )

        if not user_interacted_items:
            return []  # 用户没有交互记录

        # 初始化字典
        rank = defaultdict(float)

        # 对于用户交互过的每个物品j（评分ruj）
        for j, ruj in user_interacted_items.items():
            # 获取与j最相似的前K个物品，按相似度降序排列
            similar_items = sorted(
                self.item_similarity[j].items(), key=itemgetter(1), reverse=True
            )[: self.k_neighbors]

            # 对于每个相似物品i及其相似度wji
            for i, wji in similar_items:
                # 跳过用户已交互的物品
                if i in interacted_items:
                    continue

                # 累积加权分数
                # 由于CTR中所有正向交互的ruj = 1.0
                rank[i] += wji * ruj

        # 转换为(score, item_id)列表并按分数降序排列
        recommendations = [
            (score, self.reverse_item_map[item_idx]) for item_idx, score in rank.items()
        ]
        recommendations.sort(reverse=True)

        # 返回前N个推荐结果，格式为(item_id, score)
        return [
            (item_id, score) for score, item_id in recommendations[:n_recommendations]
        ]


def build_item_cf_model(feature_columns, model_config):
    """
    使用标准化接口构建ItemCF模型。

    参数:
        feature_columns: ItemCF不使用（经典算法不需要特征列）
        model_config: 模型配置字典，包含:
            - k_neighbors: 邻居数量（默认: 20）
            - min_similarity: 最小相似度阈值（默认: 0.1）

    返回:
        ItemCF模型实例
    """
    k_neighbors = model_config.get("k_neighbors", 20)
    min_similarity = model_config.get("min_similarity", 0.1)

    return ItemCF(k_neighbors=k_neighbors, min_similarity=min_similarity)
