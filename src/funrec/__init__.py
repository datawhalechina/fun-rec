"""
FunRec推荐系统训练和评估框架
"""

from .config import load_config
from .data.loaders import load_data
from .features.processors import prepare_features
from .training.trainer import train_model
from .evaluation import evaluate_model, compare_models
from .utils import build_model_comparison_table

__version__ = "0.1.0"
__all__ = [
    "load_config",
    "load_data",
    "prepare_features",
    "train_model",
    "evaluate_model",
    "compare_models",
    "build_model_comparison_table",
]
