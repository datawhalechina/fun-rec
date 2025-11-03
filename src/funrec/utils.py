import os
import warnings
import logging
from pathlib import Path
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

from dotenv import find_dotenv, load_dotenv
from tabulate import tabulate


def load_env_with_fallback() -> None:
    """
    自动定位并加载 .env 文件，提供合理的默认路径作为回退。

    查找顺序：
    1. 使用 find_dotenv() 自动查找 .env 文件
    2. 如果未找到，使用合理的默认路径并发出警告

    默认路径：
    - FUNREC_RAW_DATA_PATH: ./data/raw
    - FUNREC_PROCESSED_DATA_PATH: ./book/tmp
    """
    # 尝试自动查找 .env 文件
    dotenv_path = find_dotenv(usecwd=True)

    if dotenv_path:
        load_dotenv(dotenv_path)
        logger.debug(f"已加载环境变量文件: {dotenv_path}")

    else:
        # 如果没有找到 .env 文件，使用默认值并警告用户
        warnings.warn(
            "未找到 .env 文件。使用默认路径作为回退。"
            "建议创建 .env 文件并设置 FUNREC_RAW_DATA_PATH 和 FUNREC_PROCESSED_DATA_PATH。"
            "或者使用默认路径: data（输入数据）和 tmp（处理后的数据）",
            UserWarning,
        )

        # 设置默认路径（相对于当前工作目录）
        if not os.getenv("FUNREC_RAW_DATA_PATH"):
            default_raw_path = str(Path.cwd() / "data")
            os.environ["FUNREC_RAW_DATA_PATH"] = default_raw_path
            warnings.warn(f"使用默认 RAW_DATA_PATH: {default_raw_path}")

        if not os.getenv("FUNREC_PROCESSED_DATA_PATH"):
            default_processed_path = str(Path.cwd() / "tmp")
            os.environ["FUNREC_PROCESSED_DATA_PATH"] = default_processed_path
            warnings.warn(f"使用默认 PROCESSED_DATA_PATH: {default_processed_path}")


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


def split_table_by_columns(
    metrics: Dict[str, Any], max_cols: int = 4, fixed_cols: int = 0
) -> List[tuple]:
    """
    将宽表格按列分割成多个较小的表格。

    参数:
        metrics: 指标名称 -> 数值的映射
        max_cols: 每个子表格的最大列数（包括固定列）
        fixed_cols: 需要在每个子表格中重复显示的固定列数（从左开始）

    返回:
        元组列表，每个元组包含 (sub_headers, sub_table_data)
    """
    headers = sorted(metrics.keys())
    table_data = [[metrics[key] for key in headers]]

    if len(headers) <= max_cols:
        return [(headers, table_data)]

    tables = []
    fixed_headers = headers[:fixed_cols]
    remaining_headers = headers[fixed_cols:]

    # 计算除了固定列外，每个子表格能容纳多少列
    cols_per_table = max_cols - fixed_cols

    for i in range(0, len(remaining_headers), cols_per_table):
        # 获取当前批次的列
        batch_headers = remaining_headers[i : i + cols_per_table]
        sub_headers = fixed_headers + batch_headers

        # 构建对应的数据行
        sub_table_data = []
        for row in table_data:
            # 固定列 + 当前批次的列
            fixed_data = row[:fixed_cols]
            batch_data = row[fixed_cols + i : fixed_cols + i + cols_per_table]
            sub_row = fixed_data + batch_data
            sub_row = [
                f"{item:.4f}" if isinstance(item, (int, float)) else str(item)
                for item in sub_row
            ]
            sub_table_data.append(sub_row)

        tables.append((sub_headers, sub_table_data))

    return tables


def print_table(
    metrics: Dict[str, Any], title: str = None, max_cols: int = 4, fixed_cols: int = 0
) -> None:
    """
    打印表格，如果列数过多会自动分割显示。

    参数:
        metrics: 指标名称 -> 数值的映射
        title: 表格标题（可选）
        max_cols: 每个子表格的最大列数
        fixed_cols: 需要在每个子表格中重复显示的固定列数
    """
    if title:
        print(f"\n{title}")
        print("=" * len(title))

    tables = split_table_by_columns(metrics, max_cols, fixed_cols)

    for i, (sub_headers, sub_data) in enumerate(tables):
        if len(tables) > 1:
            print(f"\n表格 {i + 1}/{len(tables)}:")

        table_str = tabulate(sub_data, headers=sub_headers, tablefmt="grid")
        print(table_str)

        # 在多个子表格之间添加分隔
        if i < len(tables) - 1:
            print()


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
