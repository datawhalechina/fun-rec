"""
配置文件: SDM_CONFIG

使用方式:
    from funrec.config.config_sdm import CONFIG
    config = CONFIG
"""

from typing import Dict, Any


# 配置来源: config_sdm.yaml
CONFIG: Dict[str, Any] = {
    "data": {
        "dataset_name": "ml-1m_recall_data",
    },
    "features": {
        "dataset_name": "ml-1m_recall_data",
        "emb_dim": 16,
        "max_seq_len": 50,
        "task_names": [
            "movie_id",
        ],
        "features": [
            {
                "name": "user_id",
                "group": [
                    "user",
                ],
            },
            {
                "name": "age",
                "group": [
                    "user",
                ],
            },
            {
                "name": "occupation",
                "group": [
                    "user",
                ],
            },
            {
                "name": "zip",
                "group": [
                    "user",
                ],
            },
            {
                "name": "movie_id",
                "group": [
                    "target_item",
                ],
            },
            {
                "name": "genres",
                "group": [
                    "target_item",
                ],
            },
            {
                "name": "hist_movie_id",
                "emb_name": "movie_id",
                "group": [
                    "raw_hist_seq_base",
                ],
                "combiner": None,
                "max_len": 50,
            },
            {
                "name": "hist_genres",
                "emb_name": "genres",
                "group": [
                    "raw_hist_seq_base",
                ],
                "combiner": None,
                "max_len": 50,
            },
            {
                "name": "hist_movie_id_short",
                "emb_name": "movie_id",
                "group": [
                    "raw_hist_seq",
                ],
                "combiner": None,
                "max_len": 5,
            },
            {
                "name": "hist_genres_short",
                "emb_name": "genres",
                "group": [
                    "raw_hist_seq",
                ],
                "combiner": None,
                "max_len": 5,
            },
            {
                "name": "hist_movie_id_long",
                "emb_name": "movie_id",
                "group": [
                    "raw_hist_seq_long",
                ],
                "combiner": None,
                "max_len": 50,
            },
            {
                "name": "hist_genres_long",
                "emb_name": "genres",
                "group": [
                    "raw_hist_seq_long",
                ],
                "combiner": None,
                "max_len": 50,
            },
        ],
        "feature_transformations": [
            {
                "type": "sequence_slice",
                "source_features": [
                    "hist_movie_id",
                    "hist_genres",
                ],
                "target_suffix": "_short",
                "slice_start": -5,
                "target_groups": [
                    "raw_hist_seq",
                ],
            },
            {
                "type": "sequence_copy",
                "source_features": [
                    "hist_movie_id",
                    "hist_genres",
                ],
                "target_suffix": "_long",
                "target_groups": [
                    "raw_hist_seq_long",
                ],
            },
        ],
    },
    "training": {
        "build_function": "funrec.models.sdm.build_sdm_model",
        "data_preprocessing": [
            {
                "type": "positive_sampling_labels",
            },
        ],
        "model_params": {
            "emb_dim": 16,
            "dnn_activation": "tanh",
            "num_heads": 2,
            "num_sampled": 20,
            "label_name": "movie_id",
        },
        "optimizer": "adam",
        "optimizer_params": {
            "learning_rate": 0.0001,
        },
        "loss": "sampledsoftmaxloss",
        "batch_size": 128,
        "epochs": 1,
        "verbose": 0,
    },
    "evaluation": {
        "k_list": [
            5,
            10,
        ],
        "model_config": {
            "user_id_col": "user_id",
            "item_id_col": "movie_id",
        },
    },
}


# 为了向后兼容，也提供原始变量名
SDM_CONFIG = CONFIG


__all__ = ["CONFIG", "SDM_CONFIG"]