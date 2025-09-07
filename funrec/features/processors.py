"""
特征处理
"""

import logging
from typing import Dict, Any, List, Tuple

logger = logging.getLogger(__name__)

import numpy as np
import pandas as pd

from .feature_column import FeatureColumn
from ..data.data_utils import read_pkl_data
from ..config.data_config import DATASET_CONFIG


def apply_feature_transformations(
    features_config: Dict[str, Any], data_dict: Dict[str, Any]
) -> Dict[str, Any]:
    """
    根据配置规则进行特征处理

    Args:
        features_config: 特征配置，包含变换规则
        data_dict: 数据字典，包含需要变换的数据

    Returns:
        变换后的数据字典
    """
    transformations = features_config.get("feature_transformations", [])
    if not transformations:
        return data_dict

    # 创建一个副本，避免修改原始数据
    transformed_data = data_dict.copy()

    for transform in transformations:
        transform_type = transform.get("type")
        source_features = transform.get("source_features", [])
        target_suffix = transform.get("target_suffix", "")

        if transform_type == "sequence_slice":
            slice_start = transform.get("slice_start")
            slice_end = transform.get("slice_end")

            for source_feat in source_features:
                if source_feat in transformed_data:
                    target_feat = source_feat + target_suffix
                    if slice_end is not None:
                        transformed_data[target_feat] = transformed_data[source_feat][
                            :, slice_start:slice_end
                        ]
                    else:
                        transformed_data[target_feat] = transformed_data[source_feat][
                            :, slice_start:
                        ]

        elif transform_type == "sequence_copy":
            for source_feat in source_features:
                if source_feat in transformed_data:
                    target_feat = source_feat + target_suffix
                    transformed_data[target_feat] = transformed_data[source_feat].copy()

    return transformed_data


def apply_training_preprocessing(
    training_config: Dict[str, Any], train_features: Dict[str, Any], train_labels: Any
) -> Tuple[Dict[str, Any], Any]:
    """
    训练数据预处理

    Args:
        training_config: 训练配置，包含预处理规则
        train_features: 训练特征字典
        train_labels: 训练标签

    Returns:
        Tuple of (processed_features, processed_labels)
    """
    processed_features = train_features.copy()
    processed_labels = train_labels

    # 如果指定，采样训练数据
    subsample_size = training_config.get("subsample_size")
    if subsample_size is not None and subsample_size > 0:
        # 获取第一个特征的采样数量
        current_size = len(next(iter(processed_features.values())))
        if current_size > subsample_size:
            logger.debug(
                f"Subsampling training data from {current_size} to {subsample_size} samples"
            )
            # 对所有特征进行采样
            for key in processed_features:
                processed_features[key] = processed_features[key][:subsample_size]
            # 对标签进行采样
            if isinstance(processed_labels, list):
                processed_labels = [
                    labels[:subsample_size] for labels in processed_labels
                ]
            else:
                processed_labels = processed_labels[:subsample_size]

    preprocessing_rules = training_config.get("data_preprocessing", [])
    if not preprocessing_rules:
        return processed_features, processed_labels

    for rule in preprocessing_rules:
        rule_type = rule.get("type")

        if rule_type == "positive_sampling_labels":
            # 将标签转换为全1，用于模型（YouTubeDNN, SDM, etc.）
            processed_labels = np.ones_like(list(processed_features.values())[0])
        elif rule_type == "eges_generate_walk_pairs":
            # 构建EGES训练对，通过随机游走
            num_walks = int(rule.get("num_walks", 10))
            walk_length = int(rule.get("walk_length", 10))
            window_size = int(rule.get("window_size", 5))
            neg_samples = int(rule.get("neg_samples", 2))

            # 导入EGES辅助函数
            from ..models.eges import (
                SimpleWalker,
                get_graph_context_all_pairs,
                generate_negative_samples,
            )

            # 需要从原始训练字典中获取输入
            if "hist_movie_id" not in processed_features:
                raise ValueError("EGES预处理需要'hist_movie_id'在训练特征中")

            hist_movie_id = processed_features["hist_movie_id"]
            hist_len = processed_features.get("hist_len", None)
            # 构建会话列表
            session_list = []
            if hist_len is not None:
                for seq, l in zip(hist_movie_id, hist_len):
                    seq = seq[-int(l) :] if isinstance(l, (int, np.integer)) else seq
                    session_list.append(
                        seq.tolist() if hasattr(seq, "tolist") else list(seq)
                    )
            else:
                for seq in hist_movie_id:
                    session_list.append(
                        (seq.tolist() if hasattr(seq, "tolist") else list(seq))
                    )

            # 构建电影->genre映射
            genre_map = {}
            if "movie_id" in processed_features and "genres" in processed_features:
                for m, g in zip(
                    processed_features["movie_id"], processed_features["genres"]
                ):
                    try:
                        genre_map[int(m)] = int(g)
                    except Exception:
                        continue

            # 随机游走图
            walker = SimpleWalker()
            G, maps = walker.build_graph(session_list)
            if G is None:
                raise ValueError("EGES预处理无法从会话列表构建图")

            walks = walker.generate_walks(
                G, num_walks=num_walks, walk_length=walk_length
            )
            all_pairs = get_graph_context_all_pairs(walks, window_size=window_size)

            # 正样本
            pos_dict = {
                "movie_id": np.array([int(x[0]) for x in all_pairs], dtype=np.int32),
                "context_id": np.array([int(x[1]) for x in all_pairs], dtype=np.int32),
                "genre_id": np.array(
                    [int(genre_map.get(int(x[0]), 0)) for x in all_pairs],
                    dtype=np.int32,
                ),
            }

            # 负样本
            neg_dict = generate_negative_samples(pos_dict, num_negatives=neg_samples)

            labels = np.concatenate(
                [
                    np.ones(len(all_pairs), dtype=np.float32),
                    np.zeros(len(neg_dict["movie_id"]), dtype=np.float32),
                ]
            )

            new_features = {
                "movie_id": np.concatenate(
                    [pos_dict["movie_id"], neg_dict["movie_id"]]
                ),
                "context_id": np.concatenate(
                    [pos_dict["context_id"], neg_dict["context_id"]]
                ),
                "genre_id": np.concatenate(
                    [pos_dict["genre_id"], neg_dict["genre_id"]]
                ),
            }

            # 打乱
            idx = np.random.permutation(len(new_features["movie_id"]))
            for k in new_features:
                new_features[k] = new_features[k][idx]
            labels = labels[idx]

            processed_features = new_features
            processed_labels = labels

    return processed_features, processed_labels


def prepare_features(
    features_config: Dict[str, Any],
    train_data: Dict[str, Any],
    test_data: Dict[str, Any],
) -> Tuple[List[FeatureColumn], Dict[str, Dict[str, Any]]]:
    """
    准备特征列和处理后的数据

    Args:
        features_config: 特征配置字典
        train_data: 训练数据字典
        test_data: 测试数据字典

    Returns:
        Tuple of (feature_columns, processed_data)
    """

    # 如果未定义特征，使用数据集配置中的特征字典
    if not features_config or not features_config.get("features"):
        feature_dict = None
        dataset_name = features_config.get("dataset_name") if features_config else None
        if dataset_name and dataset_name in DATASET_CONFIG:
            dataset_config = DATASET_CONFIG[dataset_name]
            try:
                feature_dict = read_pkl_data(dataset_config["dict_path"])
            except Exception:
                feature_dict = None
        processed = {"train": train_data, "test": test_data}
        if feature_dict is not None:
            processed["feature_dict"] = feature_dict
        return [], processed

    # 可选采样，用来加速特征准备
    def _early_subsample(data: Dict[str, Any], size: int) -> Dict[str, Any]:
        if not data or size is None or size <= 0:
            return data
        # 从第一个数组值确定数据长度
        first_key = next((k for k, v in data.items() if hasattr(v, "__len__")), None)
        if first_key is None:
            return data
        current_size = len(data[first_key])
        if current_size <= size:
            return data

        sliced = {}
        for k, v in data.items():
            try:
                sliced[k] = v[:size]
            except Exception:
                sliced[k] = v
        return sliced

    pre_sub_train = features_config.get(
        "pre_subsample_size_train", features_config.get("pre_subsample_size")
    )
    pre_sub_test = features_config.get(
        "pre_subsample_size_test", features_config.get("pre_subsample_size")
    )
    if pre_sub_train is not None:
        train_data = _early_subsample(train_data, int(pre_sub_train))
    if pre_sub_test is not None:
        test_data = _early_subsample(test_data, int(pre_sub_test))

    # 获取数据信息
    dataset_name = features_config.get("dataset_name")
    if not dataset_name:
        raise ValueError("dataset_name must be specified in features config")

    if dataset_name not in DATASET_CONFIG:
        raise ValueError(f"Dataset {dataset_name} not found in DATASET_CONFIG")

    # Load feature dictionary
    # 加载特征字典
    dataset_config = DATASET_CONFIG[dataset_name]
    feature_dict = read_pkl_data(dataset_config["dict_path"])

    # 获取embedding维度
    emb_dim = features_config.get("emb_dim", 8)

    # 创建特征列
    feature_columns = []
    feature_definitions = features_config.get("features", [])

    # 获取序列最大长度
    max_seq_len = features_config.get("max_seq_len", 50)

    for feat_def in feature_definitions:
        feature_name = feat_def["name"]

        # 确定特征类型和参数
        explicit_type = feat_def.get("type")

        if feature_name == "hist_len":
            # 处理hist_len 长度信息
            fc = FeatureColumn(name=feature_name, emb_name=None, type="sparse")
        elif explicit_type == "dense":
            # 稠密特征
            fc = FeatureColumn(
                name=feature_name,
                emb_name=None,
                group=feat_def.get("group", []),
                type="dense",
                dimension=feat_def.get("dimension", 1),
                max_len=feat_def.get("max_len", 1),
                dtype=feat_def.get("dtype", "float32"),
            )
        elif explicit_type == "varlen_sparse" or (
            feature_name.startswith("hist_") and explicit_type is None
        ):
            # 序列特征
            if feature_name == "timestamps":
                fc = FeatureColumn(
                    name=feature_name,
                    emb_name=None,
                    emb_dim=1,
                    vocab_size=1,
                    type="varlen_sparse",
                    max_len=feat_def.get("max_len", max_seq_len),
                )
            else:
                fc = FeatureColumn(
                    name=feature_name,
                    emb_name=feat_def.get("emb_name", feature_name),
                    emb_dim=emb_dim,
                    vocab_size=feature_dict[feat_def.get("emb_name", feature_name)],
                    group=feat_def.get("group", []),
                    type="varlen_sparse",
                    max_len=feat_def.get("max_len", max_seq_len),
                    combiner=feat_def.get("combiner", "mean"),
                    att_key_name=feat_def.get("att_key_name"),
                )
        else:
            # 常规稀疏特征
            emb_name = feat_def.get("emb_name", feature_name)

            if feature_name == "timestamps":
                fc = FeatureColumn(
                    name=feature_name,
                    emb_name=None,
                    emb_dim=1,
                    vocab_size=1,
                    type="varlen_sparse",
                    max_len=feat_def.get("max_len", 50),
                )
            else:
                fc = FeatureColumn(
                    name=feature_name,
                    emb_name=emb_name,
                    emb_dim=emb_dim,
                    vocab_size=feature_dict[emb_name],
                    group=feat_def.get("group", []),
                )

        feature_columns.append(fc)

    # 获取特征名称和任务名称
    feature_name_list = [fc.name for fc in feature_columns]
    task_name_list = features_config.get("task_names", ["label"])

    # 特征变换
    train_data_transformed = apply_feature_transformations(features_config, train_data)
    test_data_transformed = apply_feature_transformations(features_config, test_data)

    # DSIN会话特征构造
    dsin_cfg = features_config.get("dsin_session", None)
    if dsin_cfg:
        sess_max_count = dsin_cfg.get("sess_max_count", 5)
        sess_max_len = dsin_cfg.get("sess_max_len", 10)
        session_feature_list = dsin_cfg.get("session_feature_list", ["video_id"])

        def _create_session_features_from_session_id(
            data_dict: Dict[str, Any],
        ) -> Dict[str, Any]:
            # 构建DataFrame
            df = pd.DataFrame(
                {"user_id": data_dict["user_id"], "session_id": data_dict["session_id"]}
            )
            for feat in session_feature_list:
                if feat in data_dict:
                    df[feat] = data_dict[feat]

            # 按用户分组
            user_sessions: Dict[Any, Dict[Any, Dict[str, list]]] = {}
            for user_id in df["user_id"].unique():
                user_df = df[df["user_id"] == user_id]
                sessions: Dict[Any, Dict[str, list]] = {}
                for sid in user_df["session_id"].unique():
                    s_df = user_df[user_df["session_id"] == sid]
                    sessions[sid] = {}
                    for feat in session_feature_list:
                        if feat in s_df.columns:
                            seq = s_df[feat].tolist()
                            if len(seq) > sess_max_len:
                                seq = seq[:sess_max_len]
                            elif len(seq) < sess_max_len:
                                seq = seq + [0] * (sess_max_len - len(seq))
                            sessions[sid][feat] = seq
                user_sessions[user_id] = sessions

            batch_size = len(data_dict["user_id"])
            for sess_idx in range(sess_max_count):
                for feat in session_feature_list:
                    key = f"sess_{sess_idx}_{feat}"
                    out = []
                    for i in range(batch_size):
                        uid = data_dict["user_id"][i]
                        user_sess = user_sessions.get(uid, {})
                        sids = list(user_sess.keys())
                        if sess_idx < len(sids):
                            sid = sids[sess_idx]
                            seq = user_sess[sid].get(feat, [0] * sess_max_len)
                        else:
                            seq = [0] * sess_max_len
                        out.append(seq)
                    data_dict[key] = np.array(out, dtype=np.int32)
            return data_dict

        # 应用到训练和测试数据
        if "session_id" in train_data_transformed:
            train_data_transformed = _create_session_features_from_session_id(
                train_data_transformed
            )
            train_data_transformed.pop("session_id", None)
        if "session_id" in test_data_transformed:
            test_data_transformed = _create_session_features_from_session_id(
                test_data_transformed
            )
            test_data_transformed.pop("session_id", None)

    # 处理训练数据
    train_sample_dict = {
        k: v for k, v in train_data_transformed.items() if k in feature_name_list
    }
    train_label_list = [
        v for k, v in train_data_transformed.items() if k in task_name_list
    ]

    # 处理测试数据
    test_sample_dict = {
        k: v for k, v in test_data_transformed.items() if k in feature_name_list
    }

    # 保留测试标签和其他评估数据
    test_labels = {
        k: v for k, v in test_data_transformed.items() if k in task_name_list
    }
    test_eval_data = {
        k: v
        for k, v in test_data_transformed.items()
        if k not in feature_name_list and k not in task_name_list
    }

    # 处理特定特征处理
    if "movie_id" in train_sample_dict and "genres" in train_sample_dict:
        movie_id_to_genre_id_dict = {
            movie_id: genre_id
            for movie_id, genre_id in zip(
                train_sample_dict["movie_id"], train_sample_dict["genres"]
            )
        }
        movie_id_to_genre_id_dict.update(
            {
                movie_id: genre_id
                for movie_id, genre_id in zip(
                    test_sample_dict["movie_id"], test_sample_dict["genres"]
                )
            }
        )

        # 准备所有物品数据
        all_item_model_input = {
            "movie_id": np.array(list(range(feature_dict["movie_id"])))
        }
        all_item_model_input["genres"] = np.array(
            [
                movie_id_to_genre_id_dict.get(movie_id, 0)
                for movie_id in all_item_model_input["movie_id"]
            ]
        )
    else:
        all_item_model_input = None

    processed_data = {
        "train": {"features": train_sample_dict, "labels": train_label_list},
        "test": {
            "features": test_sample_dict,
            "labels": test_labels,
            "eval_data": test_eval_data,
        },
        "all_items": all_item_model_input,
        "feature_dict": feature_dict,
    }

    return feature_columns, processed_data
