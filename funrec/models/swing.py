"""
基于Swing评分的协同过滤推荐算法。
"""

import os
import logging

logger = logging.getLogger(__name__)
import numpy as np
import pandas as pd
from collections import defaultdict
from tqdm import tqdm
from operator import itemgetter


class Swing:
    """
    基于Swing评分的协同过滤推荐系统，用于CTR预测。

    Swing评分通过分析用户-物品二分图子结构并惩罚高活跃用户之间的
    共同行为，来捕获更稳健的物品-物品关系。

    针对二元标签模式（0/1 CTR数据）进行修改 - 仅使用正向交互（label=1）。
    优化实现，仅计算有共同用户的物品对的相似度，避免O(|I|^2)复杂度。
    """

    def __init__(self, alpha=1.0, k_neighbors=20, min_similarity=0):
        """
        初始化Swing模型。

        参数:
        -----------
        alpha : float, 默认=1.0
            平滑参数，用于防止用户交互交集较小时的数值不稳定。
        k_neighbors : int, 默认=20
            进行推荐时考虑的邻居数量。
        min_similarity : float, 默认=0
            将物品视为邻居的最小相似度阈值。
        """
        self.alpha = alpha
        self.k_neighbors = k_neighbors
        self.min_similarity = min_similarity
        self.swing_similarity = {}  # 使用字典进行稀疏存储
        self.user_map = None
        self.item_map = None
        self.reverse_user_map = None
        self.reverse_item_map = None
        self.user_weights = None
        self.user_items = {}  # user_id -> 物品id集合（仅正向交互）
        self.item_users = {}  # item_id -> 用户id集合（仅正向交互）

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
        self : Swing实例
            拟合后的模型。
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

        # 创建用户和物品映射
        unique_users = positive_interactions["user_id"].unique()
        unique_items = positive_interactions["item_id"].unique()

        self.user_map = {user: idx for idx, user in enumerate(unique_users)}
        self.item_map = {item: idx for idx, item in enumerate(unique_items)}
        self.reverse_user_map = {idx: user for user, idx in self.user_map.items()}
        self.reverse_item_map = {idx: item for item, idx in self.item_map.items()}

        # 构建倒排索引：用户->物品 和 物品->用户（仅正向交互）
        self._build_inverted_index(positive_interactions)

        # 计算用户权重
        self._calculate_user_weights()

        # 计算Swing相似度矩阵（优化版）
        self._calculate_swing_similarity_optimized()

        return self

    def _build_inverted_index(self, positive_interactions):
        """构建倒排索引以进行高效的相似度计算。"""
        self.user_items = defaultdict(set)
        self.item_users = defaultdict(set)

        for _, row in positive_interactions.iterrows():
            user_idx = self.user_map[row["user_id"]]
            item_idx = self.item_map[row["item_id"]]

            self.user_items[user_idx].add(item_idx)
            self.item_users[item_idx].add(user_idx)

    def _calculate_user_weights(self):
        """计算用户权重以减少高活跃用户的影响。"""
        # 获取每个用户交互的物品数量
        user_item_counts = np.array(
            [len(self.user_items[u]) for u in range(len(self.user_map))]
        )

        # 计算用户权重为 1/sqrt(|I_u|)
        self.user_weights = 1.0 / np.sqrt(user_item_counts)

    def _calculate_swing_similarity_optimized(self):
        """
        使用优化方法计算Swing相似度。
        仅计算有共同用户的物品对的相似度。
        时间复杂度：O(R * avg_user_items)，其中R是评分数量。
        """
        self.swing_similarity = defaultdict(dict)

        # 对于每个用户，计算其交互的所有物品对之间的相似度
        for user_idx in tqdm(
            range(len(self.user_map)),
            total=len(self.user_map),
            desc="查找每个用户的物品对",
            disable=not logger.isEnabledFor(logging.DEBUG),
        ):
            user_items = list(self.user_items[user_idx])

            # 对于该用户交互的每对物品
            for i in range(len(user_items)):
                for j in range(i + 1, len(user_items)):
                    item_i, item_j = user_items[i], user_items[j]

                    # 如果不存在则初始化相似度
                    if item_j not in self.swing_similarity[item_i]:
                        self.swing_similarity[item_i][item_j] = 0.0
                    if item_i not in self.swing_similarity[item_j]:
                        self.swing_similarity[item_j][item_i] = 0.0

        # 现在为有共同用户的物品对计算实际的Swing评分
        for item_i in tqdm(
            self.swing_similarity,
            total=len(self.swing_similarity),
            desc="计算Swing评分",
            disable=not logger.isEnabledFor(logging.DEBUG),
        ):
            for item_j in self.swing_similarity[item_i]:
                if item_i >= item_j:  # 避免重复计算
                    continue

                # 找到物品i和j的共同用户
                common_users = self.item_users[item_i].intersection(
                    self.item_users[item_j]
                )

                if len(common_users) < 2:
                    continue  # Swing计算至少需要2个用户

                swing_score = 0.0

                # 为所有共同用户对计算Swing评分
                common_users_list = list(common_users)
                for u_idx in range(len(common_users_list)):
                    for v_idx in range(len(common_users_list)):
                        if u_idx == v_idx:
                            continue

                        u, v = common_users_list[u_idx], common_users_list[v_idx]

                        # 找到用户u和v的物品交集
                        common_items_uv = self.user_items[u].intersection(
                            self.user_items[v]
                        )

                        # 使用用户权重计算贡献
                        user_weight_u = self.user_weights[u]
                        user_weight_v = self.user_weights[v]

                        contribution = (user_weight_u * user_weight_v) / (
                            self.alpha + len(common_items_uv)
                        )
                        swing_score += contribution

                # 存储相似度（对称）
                if swing_score >= self.min_similarity:
                    self.swing_similarity[item_i][item_j] = swing_score
                    self.swing_similarity[item_j][item_i] = swing_score

    def recommend(self, user_id, n_recommendations=10, exclude_interacted=True):
        """
        使用直接计算的优化推荐。
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
        interacted_items = set(user_interacted_items) if exclude_interacted else set()

        if not user_interacted_items:
            return []  # 用户没有交互

        # 初始化字典
        rank = defaultdict(float)

        # 对于用户已交互的每个物品j
        for j in user_interacted_items:
            # 获取与j最相似的前K个物品，按相似度降序排列
            similar_items = sorted(
                self.swing_similarity[j].items(), key=itemgetter(1), reverse=True
            )[: self.k_neighbors]

            # 对于每个相似物品i及其相似度wji
            for i, wji in similar_items:
                # 跳过用户已交互的物品
                if i in interacted_items:
                    continue

                # 累积加权评分
                # 由于CTR中所有正向交互的权重都是1.0
                rank[i] += wji

        # 转换为(score, item_id)列表并按评分降序排列
        recommendations = [
            (score, self.reverse_item_map[item_idx]) for item_idx, score in rank.items()
        ]
        recommendations.sort(reverse=True)

        # 返回前N个推荐作为(item_id, score)
        return [
            (item_id, score) for score, item_id in recommendations[:n_recommendations]
        ]


def build_swing_model(feature_columns, model_config):
    """
    使用标准化接口构建Swing模型。

    参数:
        feature_columns: Swing不使用（经典算法不需要特征列）
        model_config: 模型配置字典，包含：
            - alpha: 平滑参数（默认：1.0）
            - k_neighbors: 邻居数量（默认：20）
            - min_similarity: 最小相似度阈值（默认：0.0）

    返回:
        Swing模型实例
    """
    alpha = model_config.get("alpha", 1.0)
    k_neighbors = model_config.get("k_neighbors", 20)
    min_similarity = model_config.get("min_similarity", 0.0)

    return Swing(alpha=alpha, k_neighbors=k_neighbors, min_similarity=min_similarity)
