from typing import Dict, Any, List, Tuple, Union, Optional

from tabulate import tabulate
from .config import load_config, Config
from .data.loaders import load_data
from .features.processors import prepare_features
from .training.trainer import train_model
from .evaluation.evaluator import evaluate_model


def build_results_table(results: Dict[str, Dict[str, Any]]) -> str:
    """
    为模型测试结果构建表格化摘要。

    参数:
        results: 从模型键到字典的映射，字典包含以下键：
                 - 'success': bool
                 - 'metrics': dict 或 None
                 - 'name': str

    返回:
        由tabulate以'grid'格式渲染的表格字符串。
    """
    # 过滤成功的结果以收集指标名称
    successful_results = {
        k: v for k, v in results.items() if v.get("success") and v.get("metrics")
    }

    if not successful_results:
        return "没有成功的结果可显示。"

    # 收集并排序所有唯一的指标键
    all_metrics = set()
    for result in successful_results.values():
        all_metrics.update(result["metrics"].keys())
    metric_names = sorted(list(all_metrics))

    # 组成表格行
    table_data = []
    for model_key in results:
        result = results[model_key]
        status = "✅ 通过" if result.get("success") else "❌ 失败"

        row = [result.get("name", model_key), status]
        metrics = result.get("metrics") or {}

        for metric in metric_names:
            if result.get("success") and metrics:
                value = metrics.get(metric, "N/A")
                if isinstance(value, (int, float)):
                    row.append(f"{value:.4f}")
                else:
                    row.append("N/A" if value == "N/A" else str(value))
            else:
                row.append("N/A")

        table_data.append(row)

    headers = ["模型名称", "状态"] + metric_names
    return tabulate(table_data, headers=headers, tablefmt="grid")


def build_metrics_table(metrics: Dict[str, Any]) -> str:
    """
    构建一个简单的单行表格，显示指标名称作为标题及其值。

    参数:
        metrics: 指标名称 -> 数值的映射

    返回:
        由tabulate以'grid'格式渲染的表格字符串，不包含模型/状态列。
    """
    if not metrics:
        return "没有成功的结果可显示。"

    headers = sorted(metrics.keys())
    row = []
    for key in headers:
        value = metrics[key]
        if isinstance(value, (int, float)):
            row.append(f"{value:.4f}")
        else:
            row.append(str(value))

    return tabulate([row], headers=headers, tablefmt="grid")


def build_model_comparison_table(model_to_metrics: Dict[str, Dict[str, Any]]) -> str:
    """
    构建多行表格，比较不同模型的指标。

    参数:
        model_to_metrics: 模型显示名称 -> 指标字典的映射

    返回:
        由tabulate以'grid'格式渲染的表格字符串，每个模型一行。
    """
    if not model_to_metrics:
        return "没有结果可显示。"

    # 收集指标键的并集
    all_metric_keys = set()
    for metrics in model_to_metrics.values():
        if metrics:
            all_metric_keys.update(metrics.keys())
    metric_names = sorted(list(all_metric_keys))

    headers = ["模型"] + metric_names
    table_data: List[List[str]] = []
    for model_name, metrics in model_to_metrics.items():
        row: List[str] = [model_name]
        for key in metric_names:
            value = metrics.get(key, "N/A") if metrics else "N/A"
            if isinstance(value, (int, float)):
                row.append(f"{value:.4f}")
            else:
                row.append("N/A" if value == "N/A" else str(value))
        table_data.append(row)

    return tabulate(table_data, headers=headers, tablefmt="grid")


def compare_models(
    models: List[str],    
    return_table: bool = True,
) -> Union[Dict[str, Dict[str, Any]], Tuple[Dict[str, Dict[str, Any]], str]]:
    """
    训练和评估多个模型并比较它们的指标。

    每个模型可以通过以下方式指定：
    - name (str): 加载funrec.config下的模型

    参数:
        models: 模型列表    
        return_table: 是否同时返回格式化的比较表格

    返回:
        - 如果return_table为False: 模型显示名称 -> 指标字典的映射
        - 如果return_table为True: (结果字典, 表格字符串)
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

    if return_table:
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
        return results, table
    return results
