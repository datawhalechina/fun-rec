"""
基于用户的协同过滤推荐算法。
"""

import numpy as np
from collections import defaultdict
import pandas as pd
from tqdm import tqdm
from operator import itemgetter


class UserCF:
    """
    用于CTR预测的优化基于用户的协同过滤算法。
    使用基于物品的倒排索引进行更快的计算和直接推荐生成。
    """

    def __init__(self, k_neighbors=20, min_similarity=0.1):
        """
        初始化UserCF模型。

        参数:
        -----------
        k_neighbors : int, 默认=20
            进行推荐时考虑的邻居数量。
        min_similarity : float, 默认=0.1
            将用户视为邻居的最小相似度阈值。
        """
        self.k_neighbors = k_neighbors
        self.min_similarity = min_similarity

        # 用于优化的数据结构
        self.item_users = defaultdict(set)  # 物品 -> 交互过的用户集合
        self.user_items = defaultdict(dict)  # 用户 -> 物品评分字典（CTR为1.0）
        self.user_similarity = defaultdict(dict)  # 用户 -> {邻居: 相似度}
        self.user_map = {}  # 原始用户id -> 内部id
        self.item_map = {}  # 原始物品id -> 内部id
        self.reverse_user_map = {}  # 内部id -> 原始用户id
        self.reverse_item_map = {}  # 内部id -> 原始物品id

    def fit(self, user_item_interactions):
        """
        使用用户-物品交互数据（带有0/1标签的CTR数据）训练模型。

        参数:
        -----------
        user_item_interactions : 元组列表 (user_id, item_id, label) 或 DataFrame
            训练数据，其中label为0（未点击）或1（点击）。
            仅将label=1的交互视为正向交互。

        返回:
        --------
        self : UserCF实例
        """
        # 如果需要，转换为DataFrame
        if not isinstance(user_item_interactions, pd.DataFrame):
            user_item_interactions = pd.DataFrame(
                user_item_interactions, columns=["user_id", "item_id", "label"]
            )

        # 仅过滤正向交互（点击）
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

        # 构建数据结构：用户 -> {物品: 评分}
        for _, row in positive_interactions.iterrows():
            user_id = self.user_map[row["user_id"]]
            item_id = self.item_map[row["item_id"]]

            self.item_users[item_id].add(user_id)
            self.user_items[user_id][item_id] = 1.0  # CTR：所有正向交互的评分为1.0

        # 计算用户相似度
        self._calculate_user_similarity()

        return self

    def _calculate_user_similarity(self):
        """
        使用基于物品的倒排索引优化计算用户相似度。
        以更高效的格式存储相似度用于推荐。
        """
        # 步骤1：构建共现矩阵 C[u][v] = 共同物品数量
        C = defaultdict(lambda: defaultdict(int))

        # 对于每个物品，找到所有与之交互的用户对
        for item_id, users in self.item_users.items():
            users_list = list(users)
            # 对于所有与该物品交互的用户对
            for i in range(len(users_list)):
                for j in range(i + 1, len(users_list)):
                    u1, u2 = users_list[i], users_list[j]
                    C[u1][u2] += 1
                    C[u2][u1] += 1  # 对称

        # 步骤2：计算最终相似度分数并高效存储
        for u1 in C:
            for u2 in C[u1]:
                if u1 >= u2:  # 避免重复计算
                    continue

                similarity = C[u1][u2] / np.sqrt(
                    len(self.user_items[u1]) * len(self.user_items[u2])
                )

                if similarity >= self.min_similarity:
                    self.user_similarity[u1][u2] = similarity
                    self.user_similarity[u2][u1] = similarity

    def recommend(self, user_id, n_recommendations=10, exclude_interacted=True):
        """
        使用直接计算的优化推荐，无需predict_score。
        基于您提供的算法。

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
        interacted_items = (
            set(self.user_items[user_idx].keys()) if exclude_interacted else set()
        )

        # 初始化字典
        rank = defaultdict(float)

        # 获取前K个相似用户，按相似度降序排列
        similar_users = sorted(
            self.user_similarity[user_idx].items(), key=itemgetter(1), reverse=True
        )[: self.k_neighbors]

        # 对于每个相似用户v及其相似度wuv
        for v, wuv in similar_users:
            # 对于用户v交互过的每个物品i（评分rvi）
            for i, rvi in self.user_items[v].items():
                # 跳过目标用户已交互的物品
                if i in interacted_items:
                    continue

                # 累积加权评分：rank[i] += wuv * rvi
                rank[i] += wuv * rvi

        # 转换为(score, item_id)列表并按评分降序排列
        recommendations = [
            (score, self.reverse_item_map[item_idx]) for item_idx, score in rank.items()
        ]
        recommendations.sort(reverse=True)

        # 返回前N个推荐作为(item_id, score)
        return [
            (item_id, score) for score, item_id in recommendations[:n_recommendations]
        ]


def build_user_cf_model(feature_columns, model_config):
    """
    使用标准化接口构建UserCF模型。

    参数:
        feature_columns: UserCF不使用（经典算法不需要特征列）
        model_config: 模型配置字典，包含：
            - k_neighbors: 邻居数量（默认：20）
            - min_similarity: 最小相似度阈值（默认：0.1）

    返回:
        UserCF模型实例
    """
    k_neighbors = model_config.get("k_neighbors", 20)
    min_similarity = model_config.get("min_similarity", 0.1)

    return UserCF(k_neighbors=k_neighbors, min_similarity=min_similarity)
