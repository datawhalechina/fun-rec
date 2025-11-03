"""
FunRec推荐系统训练和评估框架
"""

from .config import load_config
from .data.loaders import load_data
from .features.processors import prepare_features
from .training.trainer import train_model
from .evaluation import evaluate_model
from .utils import build_model_comparison_table
from .experiment import run_experiment, compare_models

__version__ = "0.1.0"
__all__ = [
    "load_config",
    "load_data",
    "prepare_features",
    "train_model",
    "evaluate_model",    
    "build_model_comparison_table",
    "run_experiment",
    "compare_models",
]
