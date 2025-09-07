"""
配置文件: YOUTUBEDNN_CONFIG

使用方式:
    from funrec.config.config_youtubednn import CONFIG
    config = CONFIG
"""

from typing import Dict, Any


# 配置来源: config_youtubednn.yaml
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
                    "user_dnn",
                ],
            },
            {
                "name": "age",
                "group": [
                    "user_dnn",
                ],
            },
            {
                "name": "occupation",
                "group": [
                    "user_dnn",
                ],
            },
            {
                "name": "zip",
                "group": [
                    "user_dnn",
                ],
            },
            {
                "name": "movie_id",
                "group": [
                    "target_item",
                ],
            },
            {
                "name": "hist_movie_id",
                "emb_name": "movie_id",
                "group": [
                    "raw_hist_seq",
                ],
                "combiner": "mean",
            },
        ],
    },
    "training": {
        "build_function": "funrec.models.youtubednn.build_youtubednn_model",
        "data_preprocessing": [
            {
                "type": "positive_sampling_labels",
            },
        ],
        "model_params": {
            "emb_dim": 16,
            "neg_sample": 20,
            "dnn_units": [
                32,
            ],
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
            20,
            50,
            100,
        ],
        "model_config": {
            "user_id_col": "user_id",
            "item_id_col": "movie_id",
        },
    },
}


# 为了向后兼容，也提供原始变量名
YOUTUBEDNN_CONFIG = CONFIG


__all__ = ["CONFIG", "YOUTUBEDNN_CONFIG"]