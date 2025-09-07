"""
配置文件: PRS_CONFIG

使用方式:
    from funrec.config.config_prs import CONFIG
    config = CONFIG
"""

from typing import Dict, Any


# 配置来源: config_prs.yaml
CONFIG: Dict[str, Any] = {
    "data": {
        "dataset_type": "neural",
        "dataset_name": "e_commerce_rerank_data",
    },
    "features": {
        "dataset_name": "e_commerce_rerank_data",
        "emb_dim": 8,
        "max_seq_len": 30,
        "features": [
            {
                "name": "uid",
                "group": [
                    "user_part",
                ],
            },
            {
                "name": "user_feat_0",
                "group": [
                    "user_part",
                ],
            },
            {
                "name": "user_feat_1",
                "group": [
                    "user_part",
                ],
            },
            {
                "name": "user_feat_2",
                "group": [
                    "user_part",
                ],
            },
            {
                "name": "item_feat_0",
                "type": "varlen_sparse",
                "group": [
                    "item_part",
                ],
                "max_len": 30,
                "combiner": None,
            },
            {
                "name": "item_feat_1",
                "type": "varlen_sparse",
                "group": [
                    "item_part",
                ],
                "max_len": 30,
                "combiner": None,
            },
            {
                "name": "item_feat_2",
                "type": "varlen_sparse",
                "group": [
                    "item_part",
                ],
                "max_len": 30,
                "combiner": None,
            },
            {
                "name": "item_feat_3",
                "type": "varlen_sparse",
                "group": [
                    "item_part",
                ],
                "max_len": 30,
                "combiner": None,
            },
            {
                "name": "item_feat_4",
                "type": "varlen_sparse",
                "group": [
                    "item_part",
                ],
                "max_len": 30,
                "combiner": None,
            },
            {
                "name": "item_emb",
                "type": "dense",
                "group": [
                    "item_part",
                ],
                "max_len": 30,
                "emb_name": None,
                "dimension": 12,
            },
            {
                "name": "pv_emb",
                "type": "dense",
                "group": [
                    "item_part",
                ],
                "max_len": 30,
                "emb_name": None,
                "dimension": 7,
            },
        ],
        "task_names": [
            "label",
        ],
    },
    "training": {
        "build_function": "funrec.models.prs.build_prs_model",
        "model_params": {
            "max_seq_len": 30,
            "hidden_dim": 128,
            "dropout_rate": 0.2,
        },
        "optimizer": "adam",
        "loss": [
            "categorical_crossentropy",
            "categorical_crossentropy",
        ],
        "loss_weights": [
            1.0,
            0.5,
        ],
        "metrics": [
            "accuracy",
        ],
        "batch_size": 128,
        "epochs": 1,
        "validation_split": 0.1,
        "verbose": 0,
    },
    "evaluation": {
        "model_type": "rerank",
        "k_list": [
            5,
            10,
            30,
        ],
        "beam_size": 2,
        "max_length": 10,
        "alpha": 0.5,
        "beta": 0.5,
    },
}


# 为了向后兼容，也提供原始变量名
PRS_CONFIG = CONFIG


__all__ = ["CONFIG", "PRS_CONFIG"]