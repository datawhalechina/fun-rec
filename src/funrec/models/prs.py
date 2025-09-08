import tensorflow as tf
import numpy as np

from .utils import (
    build_input_layer,
    build_group_feature_embedding_table_dict,
    concat_group_embedding,
)


def calculate_estimated_reward(ordering, ctr_scores, next_scores, alpha=0.5, beta=0.5):
    """
    根据PRS FPSA算法计算给定排序的估计奖励。

    Args:
        ordering: 物品ID的元组/列表
        ctr_scores: 物品到CTR分数的映射字典
        next_scores: 物品到Next分数的映射字典
        alpha, beta: 融合系数

    Returns:
        float 估计奖励
    """
    if not ordering:
        return 0.0

    r_ipv = 0.0
    p_expose = 1.0

    for item in ordering:
        p_ctr = ctr_scores[item]
        p_next = next_scores[item]
        r_ipv += p_expose * p_ctr
        p_expose *= p_next

    r_pv = p_expose
    return alpha * r_pv + beta * r_ipv


def fpsa_algorithm(
    items, ctr_scores, next_scores, beam_size=5, max_length=10, alpha=0.5, beta=0.5
):
    """
    快速排列搜索算法（FPSA），基于PRS论文。

    Args:
        items: 物品的可迭代对象
        ctr_scores: 物品到分数的映射字典
        next_scores: 物品到分数的映射字典
        beam_size: 束搜索宽度
        max_length: 输出长度
        alpha, beta: 融合系数

    Returns:
        候选排列的列表（作为元组）
    """
    candidates = [()]  # 从空排序开始
    for _ in range(1, max_length + 1):
        new_candidates = []
        rewards = {}
        for ordering in candidates:
            used = set(ordering)
            for ci in items:
                if ci in used:
                    continue
                new_order = ordering + (ci,)
                r = calculate_estimated_reward(
                    new_order, ctr_scores, next_scores, alpha, beta
                )
                rewards[new_order] = r
                new_candidates.append(new_order)
        # 按奖励进行剪枝
        new_candidates.sort(key=lambda x: rewards[x], reverse=True)
        candidates = new_candidates[:beam_size]
    return candidates


def build_prs_model(feature_columns, model_config):
    """
    构建与FunRec流水线兼容的PRS DPWN风格重排序模型。

    输入遵循PRM/PRM数据集约定：
      - 用户部分（广播特征）：组'user_part'
      - 物品分类序列：组'item_part'（varlen_sparse，combiner=None）
      - 密集序列特征：'item_emb'和'pv_emb'

    模型架构（类似DPWN）：
      在连接的物品序列嵌入上使用双向LSTM；与平铺的用户向量和pv嵌入融合；
      TimeDistributed MLP输出每个位置的分数，使用sigmoid激活。

    Returns: (model, None, None)
    """
    max_seq_len = model_config.get("max_seq_len", 30)
    hidden_dim = model_config.get("hidden_dim", 128)
    user_dim = model_config.get("user_dim")  # 可选覆盖
    item_dim = model_config.get("item_dim")  # 可选覆盖
    dropout_rate = model_config.get("dropout_rate", 0.2)

    # 使用现有工具构建输入和嵌入
    input_layer_dict = build_input_layer(feature_columns)
    group_embedding_feature_dict = build_group_feature_embedding_table_dict(
        feature_columns, input_layer_dict, prefix="embedding/"
    )

    # 用户特征（向量）和平铺版本
    user_vector = concat_group_embedding(
        group_embedding_feature_dict, "user_part", axis=-1, flatten=True
    )  # [B, D_user]
    user_vector_dim = user_vector.shape[-1]
    if user_dim is None:
        user_dim = int(user_vector_dim) if user_vector_dim is not None else 64
    user_tiled = tf.keras.layers.Lambda(
        lambda x: tf.tile(tf.expand_dims(x, axis=1), [1, max_seq_len, 1])
    )(
        user_vector
    )  # [B, L, D_user]

    # 物品侧序列特征
    item_part_seq = concat_group_embedding(
        group_embedding_feature_dict, "item_part", axis=-1, flatten=False
    )  # [B, L, D_item_part]
    pv_seq = input_layer_dict.get("pv_emb")  # [B, L, D_pv]
    item_emb_seq = input_layer_dict.get("item_emb")  # [B, L, D_item]

    # 构建类似DPWN的网络
    # 使用双向LSTM对物品属性+物品嵌入进行序列编码
    seq_feature = tf.keras.layers.Concatenate(axis=-1)([item_part_seq, item_emb_seq])
    sequence_hidden = tf.keras.layers.Bidirectional(
        tf.keras.layers.LSTM(hidden_dim, return_sequences=True)
    )(
        seq_feature
    )  # [B, L, 2*hidden_dim]

    # 与用户向量和pv嵌入进行特征融合
    fused = tf.keras.layers.Concatenate(axis=-1)([sequence_hidden, user_tiled, pv_seq])

    # TimeDistributed MLP头 -> 每个位置的分数
    td_ctr_head = tf.keras.Sequential(
        [
            tf.keras.layers.Dense(256, activation="relu"),
            tf.keras.layers.Dropout(dropout_rate),
            tf.keras.layers.Dense(128, activation="relu"),
            tf.keras.layers.Dropout(dropout_rate),
            tf.keras.layers.Dense(1, activation="sigmoid"),
        ]
    )
    td_next_head = tf.keras.Sequential(
        [
            tf.keras.layers.Dense(256, activation="relu"),
            tf.keras.layers.Dropout(dropout_rate),
            tf.keras.layers.Dense(128, activation="relu"),
            tf.keras.layers.Dropout(dropout_rate),
            tf.keras.layers.Dense(1, activation="sigmoid"),
        ]
    )

    # DPWN点击概率（我们重用CTR头作为训练输出）
    ctr_probs_3d = tf.keras.layers.TimeDistributed(td_ctr_head)(fused)  # [B, L, 1]
    next_probs_3d = tf.keras.layers.TimeDistributed(td_next_head)(fused)  # [B, L, 1]

    ctr_probs = tf.keras.layers.Lambda(lambda x: tf.squeeze(x, axis=-1))(
        ctr_probs_3d
    )  # [B, L]
    next_probs = tf.keras.layers.Lambda(lambda x: tf.squeeze(x, axis=-1))(
        next_probs_3d
    )  # [B, L]

    # 主要训练输出：输出 ctr_probs和next_probs以确保两个头都接收梯度
    # 但在训练时我们只使用ctr_probs作为主要损失
    model = tf.keras.Model(
        inputs=list(input_layer_dict.values()), outputs=[ctr_probs, next_probs]
    )

    # 为推理构建辅助模型（PMatch输入）
    ctr_model = tf.keras.Model(
        inputs=list(input_layer_dict.values()), outputs=ctr_probs
    )
    next_model = tf.keras.Model(
        inputs=list(input_layer_dict.values()), outputs=next_probs
    )

    # 收集序列特征名称以支持PRank期间的排列
    item_part_feature_names = []
    user_part_feature_names = []
    for fc in feature_columns:
        if hasattr(fc, "group") and fc.group is not None:
            if "item_part" in fc.group:
                item_part_feature_names.append(fc.name)
            if "user_part" in fc.group:
                user_part_feature_names.append(fc.name)

    # 密集序列特征名称（如果存在）
    seq_dense_feature_names = []
    if "pv_emb" in input_layer_dict:
        seq_dense_feature_names.append("pv_emb")
    if "item_emb" in input_layer_dict:
        seq_dense_feature_names.append("item_emb")

    def _slice_single_example(features_dict, idx):
        single = {}
        for k, v in features_dict.items():
            # 支持列表和np.ndarray输入
            arr = v
            single[k] = arr[idx : idx + 1]
        return single

    def _reorder_sequence_feature(arr, order):
        # arr形状：[1, L, ...] 或 [1, L]
        if arr.ndim == 3:
            return arr[:, order, :]
        elif arr.ndim == 2:
            return arr[:, order]
        else:
            return arr

    def _prepare_permuted_batch(single_features, candidates, seq_keys):
        # 通过堆叠单个示例的排列副本来构建批次字典
        batch = {}
        num_cand = len(candidates)
        for k, v in single_features.items():
            if k in seq_keys:
                stacked = []
                for perm in candidates:
                    stacked.append(_reorder_sequence_feature(v, list(perm)))
                batch[k] = np.concatenate(stacked, axis=0)
            else:
                # 沿批次维度平铺非序列特征
                batch[k] = np.repeat(v, repeats=num_cand, axis=0)
        return batch

    def prs_predict(features, eval_config=None):
        """
        运行PRS PMatch（FPSA）+ PRank（DPWN）以产生反映最佳排列的每个slate分数。
        返回形状为[B, L]的分数；降序排序产生最终排列。
        """
        alpha = (eval_config or {}).get("alpha", 0.5)
        beta = (eval_config or {}).get("beta", 0.5)
        beam_size = (eval_config or {}).get("beam_size", 5)
        # 从可用的密集序列确定序列长度
        if "item_emb" in features:
            L = features["item_emb"].shape[1]
        elif "pv_emb" in features:
            L = features["pv_emb"].shape[1]
        else:
            # 回退：使用第一个item_part特征
            any_item_feat = (
                item_part_feature_names[0] if item_part_feature_names else None
            )
            if any_item_feat is None:
                raise ValueError("PRS需要序列特征（item_emb/pv_emb或item_part特征）。")
            L = features[any_item_feat].shape[1]
        max_length = min((eval_config or {}).get("max_length", L), L)

        # 需要排列的键
        seq_keys = set(item_part_feature_names + seq_dense_feature_names)

        B = next(iter(features.values())).shape[0]
        output_scores = np.zeros((B, L), dtype=np.float32)

        for i in range(B):
            # 切片单个示例
            single = _slice_single_example(features, i)

            # PMatch：计算每个位置的CTR和Next
            ctr_vec = ctr_model.predict(single, verbose=0)[0]  # [L]
            next_vec = next_model.predict(single, verbose=0)[0]  # [L]
            items = list(range(L))
            ctr_scores = {idx: float(ctr_vec[idx]) for idx in items}
            next_scores = {idx: float(next_vec[idx]) for idx in items}

            candidates = fpsa_algorithm(
                items=items,
                ctr_scores=ctr_scores,
                next_scores=next_scores,
                beam_size=beam_size,
                max_length=max_length,
                alpha=alpha,
                beta=beta,
            )

            # PRank：使用DPWN点击概率（ctr头）在排列序列上评估候选
            perm_batch = _prepare_permuted_batch(single, candidates, seq_keys)
            model_output = model.predict(
                perm_batch, verbose=0
            )  # [ctr_probs, next_probs]
            # 提取CTR概率（第一个输出）
            click_probs_batch = (
                model_output[0] if isinstance(model_output, list) else model_output
            )  # [num_cand, L]
            # 列表奖励 = 每个位置点击概率的总和
            lr_vec = np.sum(click_probs_batch[:, :max_length], axis=1)
            best_idx = int(np.argmax(lr_vec))
            best_perm = list(candidates[best_idx])

            # 构建分数以反映最终顺序：较早排名的分数更高
            scores = np.zeros((L,), dtype=np.float32)
            for rank, pos in enumerate(best_perm):
                scores[pos] = float(L - rank)
            output_scores[i] = scores

        return output_scores

    # 为评估器消费附加辅助函数到模型
    model.__setattr__("prs_predict", prs_predict)
    model.__setattr__("ctr_model", ctr_model)
    model.__setattr__("next_model", next_model)
    model.__setattr__("item_part_feature_names", item_part_feature_names)
    model.__setattr__("seq_dense_feature_names", seq_dense_feature_names)

    return model, None, None
