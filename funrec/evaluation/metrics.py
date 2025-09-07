"""
评估指标
"""

import logging

logger = logging.getLogger(__name__)
from typing import Dict, Any, Union, Tuple

import numpy as np
import pandas as pd
from tqdm import tqdm
from sklearn.metrics import roc_auc_score
from sklearn.metrics.pairwise import cosine_similarity


def mae(predictions, actuals):
    """
    计算 Mean Absolute Error（MAE）。

    Args:
        predictions: 预测值
        actuals: 实际值

    Returns:
        float: MAE
    """
    return np.mean(np.abs(np.array(predictions) - np.array(actuals)))


def rmse(predictions, actuals):
    """
    计算 Root Mean Squared Error（RMSE）。

    Args:
        predictions: 预测值
        actuals: 实际值

    Returns:
        float: RMSE
    """
    return np.sqrt(np.mean((np.array(predictions) - np.array(actuals)) ** 2))


def precision_at_k(recommended_items, relevant_items, k=10):
    """
    计算当前用户 precision@k 。

    Args:
        recommended_items: 推荐物品ID列表
        relevant_items: 实际物品ID列表
        k: 推荐数量，默认10

    Returns:
        float: precision@k
    """

    # 只取前k个推荐
    recommended_items = recommended_items[:k]

    # 计算相关物品数量
    hits = len(set(recommended_items) & set(relevant_items))

    # 计算precision@k
    return hits / min(k, len(recommended_items)) if len(recommended_items) > 0 else 0


def recall_at_k(recommended_items, relevant_items, k=10):
    """
    计算当前用户 recall@k 。

    Args:
        recommended_items: 推荐物品ID列表
        relevant_items: 实际物品ID列表
        k: 推荐数量，默认10

    Returns:
    --------
    float: recall@k
    """

    # 只取前k个推荐
    recommended_items = recommended_items[:k]

    # 计算相关物品数量
    hits = len(set(recommended_items) & set(relevant_items))

    # 计算recall@k
    return hits / len(relevant_items) if len(relevant_items) > 0 else 0


def average_precision_at_k(recommended_items, relevant_items, k=10):
    """
    计算当前用户 average precision@k 。

    Args:
        recommended_items: 推荐物品ID列表
        relevant_items: 实际物品ID列表
        k: 推荐数量，默认10

    Returns:
        float: average precision@k
    """
    # 只取前k个推荐
    recommended_items = recommended_items[:k]

    # 初始化变量
    score = 0.0
    num_hits = 0.0

    # 遍历每个推荐物品
    for i, item in enumerate(recommended_items):
        # 检查物品是否相关
        if item in relevant_items:
            num_hits += 1
            # 计算precision@k
            score += num_hits / (i + 1.0)

    # 计算average precision@k
    return score / min(len(relevant_items), k) if len(relevant_items) > 0 else 0


def ndcg_at_k(recommended_items, relevant_items, k=10):
    """
    计算当前用户 NDCG@k 。

    Args:
        recommended_items: 推荐物品ID列表
        relevant_items: 实际物品ID列表
        k: 推荐数量，默认10

    Returns:
        float: NDCG@k
    """
    # 只取前k个推荐
    recommended_items = recommended_items[:k]

    # 计算DCG
    dcg = 0.0
    for i, item in enumerate(recommended_items):
        if item in relevant_items:
            # 物品是否相关
            dcg += 1.0 / np.log2(
                i + 2
            )  # +2 because index starts from 0 and log2(1) = 0

    # 计算理想DCG
    idcg = sum(1.0 / np.log2(i + 2) for i in range(min(len(relevant_items), k)))

    # 计算NDCG
    return dcg / idcg if idcg > 0 else 0


def hit_rate_at_k(recommended_items, relevant_items, k=10):
    """
    计算当前用户 hit rate@k 。

    Args:
        recommended_items: 推荐物品ID列表
        relevant_items: 实际物品ID列表
        k: 推荐数量，默认10

    Returns:
        float: hit rate@k
    """
    # 取前k个推荐
    recommended_items = recommended_items[:k]

    # 计算相关物品数量
    hits = len(set(recommended_items) & set(relevant_items))

    # 计算hit rate@k
    return 1.0 if hits > 0 else 0.0


# 计算gAUC
def compute_gauc(test_sample_dict, test_label_list, pred_ans, user_id_col="user_id"):
    """
    计算gAUC (Group AUC) - 每个用户的AUC的加权平均

    Args:
        test_sample_dict: 测试样本字典
        test_label_list: 测试标签列表
        pred_ans: 模型预测结果
        user_id_col: 用户ID列名

    Returns:
        gauc: gAUC值
        valid_users: 有效用户数量（至少有正负样本的用户）
    """

    test_users = test_sample_dict[user_id_col]
    test_labels = test_label_list[0]  # 假设只有一个任务
    predictions = pred_ans.flatten()

    unique_users = np.unique(test_users)
    user_aucs = []
    user_weights = []
    valid_users = 0

    for user_id in unique_users:
        # 获取该用户的所有样本
        user_mask = test_users == user_id
        user_labels = test_labels[user_mask]
        user_preds = predictions[user_mask]

        # 检查是否有正负样本
        if len(np.unique(user_labels)) > 1:  # 至少有正负样本
            try:
                user_auc = roc_auc_score(user_labels, user_preds)
                user_aucs.append(user_auc)
                user_weights.append(len(user_labels))  # 用样本数作为权重
                valid_users += 1
            except ValueError:
                # 如果计算AUC失败，跳过该用户
                continue

    if len(user_aucs) == 0:
        return 0.0, 0

    # 计算加权平均AUC
    user_aucs = np.array(user_aucs)
    user_weights = np.array(user_weights)
    gauc = np.average(user_aucs, weights=user_weights)

    return gauc, valid_users


def evaluate_sasmodel_all_item(
    user_embs, item_embs, test_label_list, k_list=[5, 10, 20, 50, 100]
):
    """
    评估推荐模型性能，计算Hit Rate@k和NDCG@k指标

    参数:
        user_embs: np.array, 用户嵌入向量，维度为[N, D]，其中N是用户数量，D是嵌入维度
        item_embs: np.array, 物品嵌入向量，维度为[T, D]，其中T是物品数量，D是嵌入维度
        test_label_list: list, 每个用户的真实点击物品ID，长度为N
        k_list: list, 要评估的k值列表，默认为[5, 10, 20, 50, 100]

    返回:
        dict: 包含每个k值对应的Hit Rate和NDCG指标的字典
    """
    # 初始化结果字典
    metrics = {}
    for k in k_list:
        metrics[f"hit_rate@{k}"] = []
        metrics[f"ndcg@{k}"] = []

    # 对每个用户进行评估
    for i, (user_emb, true_item_id) in enumerate(
        tqdm(
            zip(user_embs, test_label_list),
            total=len(user_embs),
            desc="评估中",
            disable=not logger.isEnabledFor(logging.DEBUG),
        )
    ):
        # 将用户向量转换为二维数组以便计算相似度
        user_emb = user_emb.reshape(1, -1)

        # 计算用户向量与所有物品向量的余弦相似度
        sim_scores = cosine_similarity(user_emb, item_embs)[0]

        # 获取相似度最高的物品索引（降序排序）
        top_item_indices = np.argsort(-sim_scores)

        # 为每个k计算指标
        for k in k_list:
            top_k_items = top_item_indices[:k]
            # 计算Hit Rate@k: 推荐列表中是否包含用户真实点击的物品
            hit = int(true_item_id in top_k_items)
            metrics[f"hit_rate@{k}"].append(hit)

            # 计算NDCG@k
            if true_item_id in top_k_items:
                # 找到真实物品在推荐列表中的位置
                rank = np.where(top_k_items == true_item_id)[0][0]
                # 计算DCG (使用二元相关性: 相关为1，不相关为0)
                dcg = 1.0 / np.log2(rank + 2)  # +2因为rank从0开始，且log2(1)=0
                # 理想情况下，相关物品排在第一位
                idcg = 1.0  # 1.0 / np.log2(1 + 1) = 1.0
                ndcg = dcg / idcg
            else:
                ndcg = 0.0

            metrics[f"ndcg@{k}"].append(ndcg)

    # 计算平均指标
    for metric in metrics:
        metrics[metric] = np.mean(metrics[metric])

    return metrics


def evaluate_sasmodel_sampling_item(
    user_embs, sampling_item_embs, k_list=[1, 5, 10, 20]
):
    """
    计算Hit Rate和NDCG指标

    参数:
    - user_embs: 用户嵌入，shape为[batch_size, dim]
    - sampling_item_embs: 物品嵌入，shape为[batch_size, item_cnt, dim]
                          其中每个用户的第一个物品是正样本，其余为负样本
    - k_list: 计算的top-k列表

    返回:
    - metrics: 包含不同k值的HR和NDCG指标的字典
    """
    batch_size = user_embs.shape[0]
    item_cnt = sampling_item_embs.shape[1]

    # 初始化结果字典
    metrics = {}
    for k in k_list:
        metrics[f"HR@{k}"] = 0.0
        metrics[f"NDCG@{k}"] = 0.0

    for i in range(batch_size):
        # 获取当前用户的嵌入
        user_emb = user_embs[i]  # [dim]

        # 获取当前用户的所有物品嵌入（包括正样本和负样本）
        items_emb = sampling_item_embs[i]  # [item_cnt, dim]

        # 计算用户与所有物品的内积相似度
        scores = np.dot(items_emb, user_emb)  # [item_cnt]

        # 获取排序索引（降序）
        rank_indices = np.argsort(-scores)

        # 正样本的位置（在原始数据中总是第一个）
        pos_item_idx = 0

        # 获取正样本在排序后的位置
        rank_pos = np.where(rank_indices == pos_item_idx)[0][0]

        # 计算各个指标
        for k in k_list:
            # 如果正样本出现在top-k中，HR@k为1，否则为0
            if rank_pos < k:
                metrics[f"HR@{k}"] += 1.0

                # 计算DCG@k: 2^rel / log2(rank+2)，因为rel=1（相关）或0（不相关），2^1 = 2, 2^0 = 1
                # 对于二元相关性，DCG简化为 1/log2(rank+2)
                dcg_at_k = 1.0 / np.log2(rank_pos + 2)

                # 理想DCG（iDCG）始终为1/log2(1+2)=1/log2(3)，因为在理想情况下正样本应该排在第一位
                idcg_at_k = 1.0 / np.log2(1 + 2)

                # NDCG@k = DCG@k / iDCG@k
                ndcg_at_k = dcg_at_k / idcg_at_k
                metrics[f"NDCG@{k}"] += ndcg_at_k

    # 计算平均值
    for k in k_list:
        metrics[f"HR@{k}"] /= batch_size
        metrics[f"NDCG@{k}"] /= batch_size

    return metrics


def group_auc(
    test_features: Dict[str, Any],
    test_labels: Union[np.ndarray, Dict[str, np.ndarray]],
    predictions: np.ndarray,
    user_id_key: str = "user_id",
) -> Tuple[float, int]:
    """
    计算group auc。

    Args:
    -----------
    test_features : Dict[str, Any]
        测试特征字典，包含用户ID。
    test_labels : Union[np.ndarray, Dict[str, np.ndarray]]
        测试标签，可以是数组或字典，包含任务名称。
    predictions : np.ndarray
        模型预测结果。
    user_id_key : str, default='user_id'
        测试特征字典中用户ID的键名。

    Returns:
    --------
    Tuple[float, int]:
        - gauc_score: 平均AUC 所有有效用户
        - valid_users: 可计算AUC的用户数量
    """
    # 获取用户ID
    if user_id_key in test_features:
        user_ids = test_features[user_id_key]
    else:
        # 回退: 尝试在特征中找到用户ID列
        user_id_candidates = [k for k in test_features.keys() if "user" in k.lower()]
        if user_id_candidates:
            user_ids = test_features[user_id_candidates[0]]
            print(
                f"Warning: '{user_id_key}' 没有找到，使用 '{user_id_candidates[0]}' 进行gAUC计算"
            )
        else:
            print("Warning: 没有找到用户ID，返回AUC作为gAUC")
            global_auc = roc_auc_score(test_labels, predictions.flatten())
            return global_auc, len(test_labels)

    # 处理不同的标签格式
    if isinstance(test_labels, dict):
        task_name = list(test_labels.keys())[0]
        labels_array = test_labels[task_name]
    else:
        labels_array = test_labels

    # 按用户分组并计算每个用户的AUC
    user_aucs = []
    valid_users = 0

    # 转换为DataFrame进行更容易的分组
    df = pd.DataFrame(
        {
            "user_id": user_ids,
            "label": labels_array,
            "prediction": predictions.flatten(),
        }
    )

    for user_id, group in df.groupby("user_id"):
        # 跳过只有一种标签的用户（无法计算AUC）
        if len(group["label"].unique()) < 2:
            continue

        try:
            user_auc = roc_auc_score(group["label"], group["prediction"])
            user_aucs.append(user_auc)
            valid_users += 1
        except ValueError:
            # 跳过无法计算AUC的用户
            continue

    if len(user_aucs) == 0:
        print("Warning: 没有可计算AUC的用户")
        return 0.0, 0

    gauc_score = np.mean(user_aucs)
    return gauc_score, valid_users
