from typing import Dict, Any, List, Tuple, Union

from .config import load_config, Config
from .data.loaders import load_data
from .features.processors import prepare_features
from .training.trainer import train_model
from .evaluation import evaluate_model
from .utils import build_metrics_table, build_model_comparison_table

def run_experiment(
    model_name: str, verbose: bool = True, return_metrics: bool = False
) -> Dict[str, Any]:
    """
    运行完整的推荐模型实验流程

    该函数封装了加载配置、加载数据、准备特征、训练模型和评估模型的完整流程，
    使得代码实践部分可以简化为一行函数调用。

    Args:
        model_name: 模型配置名称，如 'wide_deep', 'deepfm', 'dssm' 等
        verbose: 是否打印评估指标表格，默认为 True
        return_metrics: 是否返回评估指标字典，默认为 False
    Returns:
        Dict[str, Any]: 评估指标字典，包含各种评估指标的结果

    Example:
        >>> import funrec
        >>> metrics = funrec.run_experiment('wide_deep', return_metrics=True)

        或者不打印指标表格：
        >>> metrics = funrec.run_experiment('wide_deep', verbose=False, return_metrics=True)
    """
    # 加载配置
    config = load_config(model_name)

    # 加载数据
    train_data, test_data = load_data(config.data)

    # 准备特征
    feature_columns, processed_data = prepare_features(
        config.features, train_data, test_data
    )

    # 训练模型
    models = train_model(config.training, feature_columns, processed_data)

    # 评估模型
    metrics = evaluate_model(models, processed_data, config.evaluation, feature_columns)

    # 打印结果
    if verbose:
        print(build_metrics_table(metrics))

    if return_metrics:
        return metrics
    else:
        return None


def compare_models(
    models: List[str],
    verbose: bool = True,
    return_results: bool = False,    
) -> Union[Dict[str, Dict[str, Any]], Tuple[Dict[str, Dict[str, Any]], str]]:
    """
    训练和评估多个模型并比较它们的指标。

    每个模型可以通过以下方式指定：
    - name (str): 加载funrec.config下的模型

    参数:
        models: 模型列表
        verbose: 是否打印比较表格
        return_results: 是否返回结果字典

    返回:
        - 如果return_results为False: None
        - 如果return_results为True: 结果字典
    """
    # 将输入标准化为(display_name, Config)的列表
    normalized: List[Tuple[str, Config]] = []

    for model in models:
        normalized.append((model, load_config(model)))

    results: Dict[str, Dict[str, Any]] = {}

    for display_name, cfg in normalized:
        try:
            # 1) 加载数据
            train_data, test_data = load_data(cfg.data)
            # 2) 准备特征
            feature_columns, processed_data = prepare_features(
                cfg.features, train_data, test_data
            )
            # 3) 训练
            model_tuple = train_model(cfg.training, feature_columns, processed_data)
            # 4) 评估
            metrics = evaluate_model(
                model_tuple, processed_data, cfg.evaluation, feature_columns
            )
            results[str(display_name)] = metrics
        except Exception as e:
            # 捕获失败信息，保持表格对齐
            results[str(display_name)] = {"error": str(e)}

    
    # 过滤成功的指标字典用于显示；在单独列中包含错误
    any_error = any(("error" in m) for m in results.values())
    if any_error:
        # 构建包含'error'列的组合表格（如果存在）
        # 合并指标键并包含'error'
        model_to_metrics: Dict[str, Dict[str, Any]] = {}
        for name, m in results.items():
            if "error" in m:
                model_to_metrics[name] = {"error": m["error"]}
            else:
                model_to_metrics[name] = m
        table = build_model_comparison_table(model_to_metrics)
    else:
        table = build_model_comparison_table(results)

    if verbose:
        print(table)

    if return_results:
        return results, table