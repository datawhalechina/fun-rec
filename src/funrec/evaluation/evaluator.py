"""
模型评估
"""

import logging
from typing import Dict, Any, List, Tuple, Union

logger = logging.getLogger(__name__)

import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.metrics import roc_auc_score
from sklearn.preprocessing import normalize
from tqdm import tqdm


from ..features.feature_column import FeatureColumn
from .metrics import (
    precision_at_k,
    hit_rate_at_k,
    ndcg_at_k,
    evaluate_sasmodel_all_item,
    evaluate_sasmodel_sampling_item,
    group_auc,
)


def evaluate_model(
    models: Union[Tuple[tf.keras.Model, tf.keras.Model, tf.keras.Model], Any],
    processed_data: Dict[str, Any],
    evaluation_config: Dict[str, Any],
    feature_columns: List[FeatureColumn],
) -> Dict[str, float]:
    """
    使用指定指标评估训练好的模型。

    Args:
        models: 深度模型: (main_model, user_model, item_model)
                经典模型: 训练好的经典模型实例
        processed_data: 处理后的数据字典，包含测试特征
        evaluation_config: 评估配置字典，包含:
            - classical_model: 布尔值，指示是否为经典模型
            - k_list: 评估的K值列表
            - 其他模型特定参数

    Returns:
        评估指标
    """
    is_classical = evaluation_config.get("classical_model", False)
    is_external_embedding = evaluation_config.get("embedding_external", False)

    if is_classical:
        # 经典模型评估
        classical_model = models[0]

        # 准备测试数据
        test_interactions = []
        test_features = processed_data["test"]["features"]
        test_labels = processed_data["test"]["labels"]

        # 从特征中提取用户和物品ID
        user_ids = (
            test_features[0]
            if isinstance(test_features, list)
            else test_features["user_id"]
        )
        item_ids = (
            test_features[1]
            if isinstance(test_features, list)
            else test_features["item_id"]
        )

        # 转换为交互格式
        for i in range(len(user_ids)):
            test_interactions.append((user_ids[i], item_ids[i], test_labels[i]))

        # 获取评估参数
        k_list = evaluation_config.get("k_list", [5, 10])
        exclude_train = evaluation_config.get("exclude_train", True)

        # 使用统一评估函数评估经典模型
        metrics = evaluate_classical_model(
            model=classical_model,
            test_data=test_interactions,
            k_list=k_list,
            exclude_train=exclude_train,
        )

        return metrics

    else:
        if is_external_embedding:
            # 基于三方embedding库构建的模型评估 (例如：Item2Vec)
            external_model = models[0]

            # 当特征配置为空时，processed_data已经包含测试字典
            test_features = (
                processed_data["test"]["features"]
                if "features" in processed_data["test"]
                else processed_data["test"]
            )
            feature_dict = processed_data["feature_dict"]

            # 用户历史序列
            hist_key_candidates = [
                "hist_movie_id_list",
                "hist_movie_ids",
                "hist_item_id_list",
                "hist_item_ids",
            ]
            hist_array = None
            for key in hist_key_candidates:
                if key in test_features:
                    hist_array = test_features[key]
                    break
            if hist_array is None:
                raise ValueError(
                    "基于三方embedding库构建的模型评估需要 'hist_movie_id_list' 在测试特征中"
                )

            # 用户嵌入
            user_embs = external_model.get_user_embs(hist_array)

            # 全物品嵌入 (ID从0..N或1..N开始）
            vocab_size = (
                len(feature_dict.get("movieId", [])) + 1
                if isinstance(feature_dict.get("movieId", {}), dict)
                else feature_dict.get("movieId", 0)
            )
            if vocab_size == 0:
                vocab_size = processed_data["feature_dict"].get("movie_id", 0)
            item_id_list = list(range(vocab_size))
            item_embs = external_model.get_item_embs(item_id_list)

            # 评估指标
            k_list = evaluation_config.get("k_list", [5, 10])

            # 评估
            model_config = evaluation_config.get(
                "model_config", {"user_id_col": "user_id", "item_id_col": "movie_id"}
            )
            metrics = evaluate_embedding_model(
                user_embs=user_embs,
                item_embs=item_embs,
                test_model_input=test_features,
                test_label=None,
                k_list=k_list,
                model_config=model_config,
            )
            return metrics

        # 检查是否为排序模型
        model_type = evaluation_config.get("model_type", "retrieval")

        if model_type == "ranking":
            # 排序模型评估使用AUC和gAUC
            return evaluate_ranking_model(
                models, processed_data, evaluation_config, feature_columns
            )
        if model_type == "rerank":
            return evaluate_rerank_model(models, processed_data, evaluation_config)
        if model_type == "eges":
            # EGES特殊评估: 用户嵌入 = 历史物品嵌入的平均值
            main_model, _, _ = models
            test_features = (
                processed_data["test"]["features"]
                if "features" in processed_data["test"]
                else processed_data["test"]
            )
            feature_dict = processed_data.get("feature_dict", {})

            # 构建所有物品输入 (movie_id, genre_id)
            vocab_size = feature_dict.get("movie_id", 0)
            if isinstance(vocab_size, dict):
                vocab_size = len(vocab_size) + 1
            all_movie_ids = np.array(list(range(vocab_size)), dtype=np.int32)

            # 从测试特征构建genre映射
            movie_to_genre = {}
            if "movie_id" in test_features and "genres" in test_features:
                for m, g in zip(test_features["movie_id"], test_features["genres"]):
                    movie_to_genre[int(m)] = int(g)
            all_genres = np.array(
                [movie_to_genre.get(i, 0) for i in range(vocab_size)], dtype=np.int32
            )

            all_item_model_input = {
                "movie_id": all_movie_ids,
                "genre_id": all_genres,
                "context_id": np.zeros_like(all_movie_ids, dtype=np.int32),
            }

            # 计算物品嵌入
            item_embedding_model = tf.keras.Model(
                inputs=main_model.item_input, outputs=main_model.item_embedding
            )
            item_embs = item_embedding_model.predict(
                all_item_model_input, batch_size=4096, verbose=0
            )

            # 从历史计算用户嵌入
            if "hist_movie_id" not in test_features:
                raise ValueError("EGES 评估需要'hist_movie_id'在测试特征中")
            user_embs = []
            for seq in test_features["hist_movie_id"]:
                seq = np.array(seq)
                non_zero = seq[seq != 0]
                if len(non_zero) == 0:
                    user_embs.append(np.zeros(item_embs.shape[1], dtype=np.float32))
                else:
                    # 裁剪索引到词汇表范围内
                    nz = np.clip(non_zero, 0, vocab_size - 1)
                    user_embs.append(item_embs[nz].mean(axis=0))
            user_embs = np.stack(user_embs, axis=0)

            k_list = evaluation_config.get("k_list", [5, 10])
            model_cfg = evaluation_config.get(
                "model_config", {"user_id_col": "user_id", "item_id_col": "movie_id"}
            )
            return evaluate_embedding_model(
                user_embs, item_embs, test_features, None, k_list, model_cfg
            )

        # 深度模型评估
        main_model, user_model, item_model = models

        # 获取评估参数
        k_list = evaluation_config.get("k_list", [5, 10])

        # SASRec序列模型
        if hasattr(main_model, "user_input") and hasattr(main_model, "all_item_input"):

            logger.debug("序列模型评估...")

            # 获取评估配置
            model_config = evaluation_config.get("model_config", {})
            all_item_pool = model_config.get("all_item_pool", True)

            # 序列模型, 准备输入
            test_features = processed_data["test"]["features"]

            # 根据用户模型输入提取用户嵌入所需特征
            # 从用户模型获取预期输入名称
            user_input_names = [layer.name for layer in main_model.user_input]
            user_input_features = {
                k: v for k, v in test_features.items() if k in user_input_names
            }

            # 获取用户embedding
            user_embedding_model = tf.keras.Model(
                inputs=main_model.user_input, outputs=main_model.user_embedding
            )
            user_embs = user_embedding_model.predict(
                user_input_features, batch_size=64, verbose=0
            )

            # 获取特征字典
            feature_dict = processed_data["feature_dict"]

            if all_item_pool:
                logger.debug("使用所有物品评估...")
                # 创建所有物品输入
                all_item_model_input = np.array(list(range(feature_dict["item_id"])))
                item_embedding_model = tf.keras.Model(
                    inputs=main_model.all_item_input,
                    outputs=main_model.all_item_embedding,
                )
                item_embs = item_embedding_model.predict(
                    all_item_model_input, batch_size=64, verbose=0
                )

                # 获取测试标签
                test_eval_data = processed_data["test"][
                    "eval_data"
                ]  # Access the evaluation data
                test_label_list = test_eval_data.get(
                    "label_list", processed_data["test"].get("labels", [])
                )
                metrics = evaluate_sasmodel_all_item(
                    user_embs, item_embs, test_label_list, k_list
                )
            else:
                logger.debug("随机采样评估...")
                # 使用采样评估
                sampling_item_input = {
                    k: v for k, v in test_features.items() if k in ["neg_sample_ids"]
                }
                item_embedding_model = tf.keras.Model(
                    inputs=main_model.sampling_item_input,
                    outputs=main_model.sampling_item_embedding,
                )
                sampling_item_embs = item_embedding_model.predict(
                    sampling_item_input, batch_size=64, verbose=0
                )

                sampling_k_list = [k for k in k_list if k <= 20]
                metrics = evaluate_sasmodel_sampling_item(
                    user_embs, sampling_item_embs, sampling_k_list
                )

            return metrics

        # 其他模型
        else:
            # 提取用户特征用于预测
            test_features = processed_data["test"]["features"]
            user_feature_names = [
                fc.name
                for fc in feature_columns
                if any(
                    group in ["user", "user_dnn", "raw_hist_seq", "raw_hist_seq_long"]
                    for group in fc.group
                )
            ]

            # 添加特殊特征，如hist_len
            special_user_features = ["hist_len"]
            for special_feat in special_user_features:
                if (
                    special_feat in test_features
                    and special_feat not in user_feature_names
                ):
                    user_feature_names.append(special_feat)

            # 获取用户embedding
            user_features = {
                k: v for k, v in test_features.items() if k in user_feature_names
            }
            user_embs = user_model.predict(user_features, batch_size=64, verbose=0)

            # 获取物品embedding
            all_item_features = processed_data.get("all_items")
            if all_item_features is not None:
                item_embs = item_model.predict(all_item_features, verbose=0)
            else:
                # Fallback: 使用测试数据中的所有物品（去重）
                feature_dict = processed_data["feature_dict"]
                if "movie_id" in feature_dict:
                    all_item_model_input = {
                        "movie_id": np.array(list(range(feature_dict["movie_id"])))
                    }
                    # 添加其他物品特征，如果可用
                    if "genres" in test_features:
                        # 使用映射，如果可用
                        movie_id_to_genre_id_dict = {}
                        for movie_id, genre_id in zip(
                            test_features["movie_id"], test_features["genres"]
                        ):
                            movie_id_to_genre_id_dict[movie_id] = genre_id
                        all_item_model_input["genres"] = np.array(
                            [
                                movie_id_to_genre_id_dict.get(movie_id, 0)
                                for movie_id in all_item_model_input["movie_id"]
                            ]
                        )
                    item_embs = item_model.predict(
                        all_item_model_input, batch_size=64, verbose=0
                    )
                else:
                    raise ValueError("无法确定物品特征用于评估")

            # 检查是否为MIND模型 (3D用户embedding)
            if len(user_embs.shape) == 3:
                # MIND模型，多个兴趣胶囊
                metrics = evaluate_mind_model(
                    user_embs=user_embs,
                    item_embs=item_embs,
                    test_model_input=test_features,
                    k_list=k_list,
                )
            else:
                # 常规embedding模型
                metrics = evaluate_embedding_model(
                    user_embs=user_embs,
                    item_embs=item_embs,
                    test_model_input=test_features,
                    test_label=None,
                    k_list=k_list,
                    model_config=evaluation_config.get("model_config"),
                )

            return metrics


def evaluate_embedding_model(
    user_embs,
    item_embs,
    test_model_input,
    test_label,
    k_list=[5, 10],
    model_config=None,
):
    """
    评估基于embedding的模型，使用Hit Rate@k, NDCG@k, and Precision@k.
    适用于two-tower模型和其他基于embedding的，并且导出用户和物品embedding表的模型。

    Args:
        user_embs: 用户embedding
        item_embs: 物品embedding
        test_model_input: 测试数据，包含用户和物品ID列
        test_label: 测试标签
        k_list: 评估的k值列表
        model_config: 可选的配置字典

    Returns:
        包含每个k值的平均指标的字典
    """
    user_id_col = (
        model_config.get("user_id_col", "user_id")
        if model_config is not None
        else "user_id"
    )
    item_id_col = (
        model_config.get("item_id_col", "movie_id")
        if model_config is not None
        else "movie_id"
    )
    test_users = test_model_input[user_id_col]
    test_items = test_model_input[item_id_col]

    # 获取要评估的用户列表（去重）
    unique_test_users = np.unique(test_users)

    # 初始化指标
    metrics = {
        **{f"hit_rate@{k}": [] for k in k_list},
        **{f"ndcg@{k}": [] for k in k_list},
        **{f"precision@{k}": [] for k in k_list},
    }

    # 评估每个用户
    for user_id in tqdm(
        unique_test_users,
        desc="Evaluating",
        disable=not logger.isEnabledFor(logging.DEBUG),
    ):
        # 获取用户测试物品（ground truth）
        user_indices = np.where(test_users == user_id)[0]
        user_test_items = test_items[user_indices]
        relevant_items = list(user_test_items)  # 转换为列表

        # 获取用户embedding
        user_idx = np.where(test_users == user_id)[0][0]
        user_emb = user_embs[user_idx : user_idx + 1]

        # 计算余弦相似度
        scores = cosine_similarity(user_emb, item_embs)[0]

        # 获取top-k推荐
        top_items_indices = np.argsort(-scores)

        # 计算每个k的指标
        for k in k_list:
            # 获取top-k物品id作为推荐物品
            recommended_items = list(top_items_indices[:k])

            # 计算指标
            hit_rate = hit_rate_at_k(recommended_items, relevant_items, k)
            precision = precision_at_k(recommended_items, relevant_items, k)
            ndcg = ndcg_at_k(recommended_items, relevant_items, k)

            metrics[f"hit_rate@{k}"].append(hit_rate)
            metrics[f"precision@{k}"].append(precision)
            metrics[f"ndcg@{k}"].append(ndcg)

    # 计算平均指标
    for metric in metrics:
        metrics[metric] = np.mean(metrics[metric])

    return metrics


def evaluate_classical_model(model, test_data, k_list=[5, 10], exclude_train=True):
    """
    经典推荐模型评估。

    Args:
    -----------
    model : 经典推荐模型实例
    test_data : 测试数据，DataFrame 或者 (user_id, item_id, label) 的列表
    k_list : 评估的K值列表
    exclude_train : 是否排除训练物品

    Returns:
    --------
    dict : 评估指标，包括 hit_rate@K 和 precision@K
    """
    if not isinstance(test_data, pd.DataFrame):
        test_data = pd.DataFrame(test_data, columns=["user_id", "item_id", "label"])

    # 过滤，只保留正样本
    positive_test = test_data[test_data["label"] == 1]

    # 按照用户分组，获取每个用户的测试物品（ground truth）
    user_test_items = positive_test.groupby("user_id")["item_id"].apply(list).to_dict()
    test_users = set(user_test_items.keys())

    # 找到最大的K值，用于高效计算
    max_k = max(k_list) if k_list else 100

    # 初始化指标
    metrics = {}
    for k in k_list:
        metrics[f"hit_rate@{k}"] = []
        metrics[f"precision@{k}"] = []

    # 评估每个测试用户
    for user_id in tqdm(
        test_users,
        desc="Evaluating users",
        total=len(test_users),
        disable=not logger.isEnabledFor(logging.DEBUG),
    ):
        # 检查用户是否在模型中（有训练数据）
        if not hasattr(model, "user_map") or user_id not in model.user_map:
            continue

        relevant_items = user_test_items[user_id]
        if len(relevant_items) == 0:
            continue

        # 使用最大的K值生成推荐
        recommendations = model.recommend(
            user_id, n_recommendations=max_k, exclude_interacted=exclude_train
        )

        # 提取排序后的物品ID
        recommended_items = [item_id for item_id, _ in recommendations]

        # 计算每个k的指标
        for k in k_list:
            hit_rate = hit_rate_at_k(recommended_items, relevant_items, k)
            precision = precision_at_k(recommended_items, relevant_items, k)

            metrics[f"hit_rate@{k}"].append(hit_rate)
            metrics[f"precision@{k}"].append(precision)

    # 计算平均指标
    final_metrics = {}
    for metric_name in metrics:
        if len(metrics[metric_name]) > 0:
            final_metrics[metric_name] = np.mean(metrics[metric_name])
        else:
            final_metrics[metric_name] = 0.0

    return final_metrics


def cosine_similarity_3d(X, Y):
    """
    计算3D用户embedding（每个用户多个胶囊）和2D物品embedding的余弦相似度。

    Args:
        X: 3D 用户embedding，形状为 (num_users, num_capsules, embedding_dim)
        Y: 2D 物品embedding，形状为 (num_items, embedding_dim)


    Returns:
        similarity_matrix: 每个用户胶囊和每个物品的余弦相似度，形状为 (num_users, num_capsules, num_items)

    """
    # 确保输入是numpy数组
    X = np.asarray(X)
    Y = np.asarray(Y)

    # 沿着embedding维度归一化X和Y
    X_normalized = normalize(X.reshape(-1, X.shape[-1]), axis=1).reshape(
        X.shape
    )  # 归一化每个胶囊
    Y_normalized = normalize(Y, axis=1)  # 归一化每个物品

    # 使用点积计算余弦相似度
    similarity_matrix = np.einsum(
        "ijk,lk->ijl", X_normalized, Y_normalized
    )  # (num_users, num_capsules, num_items)

    return similarity_matrix


def evaluate_mind_model(user_embs, item_embs, test_model_input, k_list=[5, 10]):
    """
    评估MIND模型，使用Hit Rate@k, NDCG@k, and Precision@k。
    Args:
        user_embs: 3D 用户embedding，形状为 (num_users, num_capsules, embedding_dim)
        item_embs: 2D 物品embedding，形状为 (num_items, embedding_dim)
        test_model_input: 测试数据，包含用户和物品ID列
        k_list: 评估的k值列表
    Returns:
        dict : 评估指标，包括 hit_rate@K 和 precision@K
    """
    test_users = test_model_input["user_id"]
    test_items = test_model_input["movie_id"]

    # 获取要评估的用户列表（去重）
    unique_test_users = np.unique(test_users)

    # 初始化指标
    metrics = {
        **{f"hit_rate@{k}": [] for k in k_list},
        **{f"ndcg@{k}": [] for k in k_list},
        **{f"precision@{k}": [] for k in k_list},
    }

    # 评估每个用户
    for user_id in tqdm(
        unique_test_users,
        desc="Evaluating",
        disable=not logger.isEnabledFor(logging.DEBUG),
    ):
        # 获取用户测试物品（ground truth）
        user_indices = np.where(test_users == user_id)[0]
        user_test_items = test_items[user_indices]
        user_test_items_set = set(user_test_items)

        # 获取用户多个embedding，形状为 (num_capsules, embedding_dim)
        user_idx = np.where(test_users == user_id)[0][0]
        user_emb = user_embs[user_idx : user_idx + 1]

        # 计算所有用户胶囊和物品的相似度
        capsule_item_scores = cosine_similarity_3d(
            user_emb, item_embs
        )  # [num_users, num_capsules, num_items]

        # 将用户多个向量对item的打分展开，(num_users, num_capsules, num_items)
        capsule_item_score_index_list = []
        for i in range(
            capsule_item_scores.shape[0]
        ):  # 遍历每一个用户emb相似度，记录分数和索引
            user_i = capsule_item_scores[i][0]
            for j in range(
                user_i.shape[0]
            ):  # 遍历所有item的打分，(num_items, embedding_dim)
                capsule_item_score_index_list.append([j, user_i[j]])

        # 按照分数进行倒序排列
        capsule_item_score_index_order_list = sorted(
            capsule_item_score_index_list, key=lambda x: x[1], reverse=True
        )

        # 从前到后取k个不重复的结果
        user_top_k_items = []
        for k in k_list:
            top_k_items = []
            dup_set = set([])
            for i, score in capsule_item_score_index_order_list:
                if i in dup_set:
                    continue
                dup_set.add(i)
                top_k_items.append(i)
                if len(top_k_items) == k:
                    break
            user_top_k_items.append(top_k_items)

        # 计算每个k的指标
        for i, k in enumerate(k_list):
            top_k_items = user_top_k_items[i]
            relevant = user_test_items_set

            # Hit Rate@k
            hit = len(set(top_k_items) & relevant) > 0
            metrics[f"hit_rate@{k}"].append(float(hit))

            # Precision@k
            precision = len(set(top_k_items) & relevant) / k
            metrics[f"precision@{k}"].append(precision)

            # NDCG@k
            dcg = sum(
                1 / np.log2(pos + 2)
                for pos, item in enumerate(top_k_items)
                if item in relevant
            )
            idcg = sum(1 / np.log2(pos + 2) for pos in range(min(len(relevant), k)))
            ndcg = dcg / idcg if idcg > 0 else 0.0
            metrics[f"ndcg@{k}"].append(ndcg)

    # 计算平均指标
    return {k: np.mean(v) for k, v in metrics.items()}


def evaluate_ranking_model(
    models: Tuple[tf.keras.Model, None, None],
    processed_data: Dict[str, Any],
    evaluation_config: Dict[str, Any],
    feature_columns: List[FeatureColumn],
) -> Dict[str, float]:
    """
    评估排序模型，使用AUC和gAUC指标。

    Args:
        models: 排序模型，形状为 (main_model, None, None)，None主要是为了兼容其他模型类型
        processed_data: 处理后的数据字典，包含测试特征和标签
        evaluation_config: 评估配置
        feature_columns: 特征列列表

    Returns:
        dict : 评估指标，包括 AUC 和 gAUC
    """
    main_model, _, _ = models

    # 获取测试数据
    test_features = processed_data["test"]["features"]
    test_labels = processed_data["test"]["labels"]

    # 预测
    logger.debug("排序模型预测开始...")
    predictions = main_model.predict(test_features, batch_size=128, verbose=0)

    # 处理多任务输出：预测可以是列表/元组
    metrics: Dict[str, float] = {}

    if isinstance(predictions, (list, tuple)):
        # 确定任务名称
        task_names = evaluation_config.get("task_names")
        if not task_names and isinstance(test_labels, dict):
            task_names = list(test_labels.keys())

        for idx, preds in enumerate(predictions):
            # 映射到正确的标签
            if isinstance(test_labels, dict):
                task_name = (
                    task_names[idx]
                    if task_names and idx < len(task_names)
                    else list(test_labels.keys())[idx]
                )
                labels_array = test_labels[task_name]
                suffix = f"_{task_name}"
            elif isinstance(test_labels, list):
                labels_array = test_labels[idx]
                suffix = f"_task{idx}"
            else:
                labels_array = test_labels
                suffix = f"_task{idx}"

            # 每个任务的AUC
            auc = roc_auc_score(labels_array, preds.flatten())
            metrics[f"auc{suffix}"] = auc

            # 每个任务的gAUC
            gauc, valid_users = group_auc(test_features, labels_array, preds)
            metrics[f"gauc{suffix}"] = gauc
            metrics[f"val_user{suffix}"] = valid_users

        # 如果有多任务，平均AUC和gAUC
        auc_values = [
            v for k, v in metrics.items() if k.startswith("auc_") or k == "auc"
        ]
        gauc_values = [
            v for k, v in metrics.items() if k.startswith("gauc_") or k == "gauc"
        ]
        if auc_values:
            metrics["auc_macro"] = float(np.mean(auc_values))
        if gauc_values:
            metrics["gauc_macro"] = float(np.mean(gauc_values))
        return metrics
    else:
        # 单任务输出
        if isinstance(test_labels, dict):
            task_name = list(test_labels.keys())[0]
            test_labels_array = test_labels[task_name]
        elif isinstance(test_labels, list):
            test_labels_array = test_labels[0]
        else:
            test_labels_array = test_labels

        auc = roc_auc_score(test_labels_array, predictions.flatten())
        gauc, valid_users = group_auc(test_features, test_labels_array, predictions)
        return {"auc": auc, "gauc": gauc, "val_user": valid_users}


def evaluate_rerank_model(
    models: Tuple[tf.keras.Model, None, None],
    processed_data: Dict[str, Any],
    evaluation_config: Dict[str, Any],
) -> Dict[str, float]:
    """评估重排模型，使用P@K和MAP@K指标。

    测试标签为每个序列的one-hot数组，模型输出为每个序列的分数。
    计算原始和重排后的标签的P@K和MAP@K，并返回两组指标。
    """
    main_model, _, _ = models
    test = processed_data["test"]
    test_features = test["features"]
    test_labels = test["labels"]

    # 获取标签
    label_array = (
        test_labels.get("label") if isinstance(test_labels, dict) else test_labels
    )
    if label_array is None:
        raise ValueError("重排模型评估需要'label'列在测试数据中")

    # 预测
    model_output = main_model.predict(test_features, batch_size=256, verbose=0)
    # 提取第一个输出（CTR概率）
    preds = model_output[0] if isinstance(model_output, list) else model_output

    # 准备标签列表
    new_label_list = []
    old_label_list = []
    for pred, label in zip(preds, label_array):
        new_ranks = np.argsort(-pred)
        new_labels = label[new_ranks]
        new_label_list.append(new_labels)
        old_label_list.append(label)

    # 计算原始和重排后的标签的P@K和MAP@K
    k_list = evaluation_config.get("k_list", [5, 10])
    metrics: Dict[str, float] = {}

    # 计算平均精确率@K
    def calc_average_precision_at_k(labels, k):
        n = min(len(labels), k)
        labels = labels[:n]
        p = []
        p_cnt = 0
        for i in range(n):
            if labels[i] > 0:
                p_cnt += 1
                p.append(p_cnt * 1.0 / (i + 1))
        if p_cnt > 0:
            return sum(p) / p_cnt
        else:
            return 0.0

    def calc_precision_at_k(labels, k):
        n = min(len(labels), k)
        labels = labels[:n]
        p_cnt = 0
        for i in range(n):
            if labels[i] > 0:
                p_cnt += 1
        return p_cnt * 1.0 / n

    # 计算原始和重排后的标签的P@K和MAP@K
    for label_type, label_list in zip(["old", "new"], [old_label_list, new_label_list]):
        cnt = len(label_list)
        for k in k_list:
            p_sum = 0.0
            map_sum = 0.0
            for label in label_list:
                p_sum += calc_precision_at_k(label, k)
                map_sum += calc_average_precision_at_k(label, k)

            # 存储指标，区分原始和重排
            metrics[f"{label_type}_p@{k}"] = p_sum / cnt if cnt > 0 else 0.0
            metrics[f"{label_type}_map@{k}"] = map_sum / cnt if cnt > 0 else 0.0

    # 返回重排后的指标
    for k in k_list:
        metrics[f"p@{k}"] = metrics[f"new_p@{k}"]
        metrics[f"map@{k}"] = metrics[f"new_map@{k}"]

    return metrics
