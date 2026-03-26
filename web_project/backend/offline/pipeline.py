"""
FunRec offline pipeline entrypoint.
"""

import argparse
import importlib


STEP_HANDLERS = {
    "retrieval_preprocess": (
        "offline.feature.preprocess_retrieval",
        "run_retrieval_preprocessing",
    ),
    "ranking_preprocess": (
        "offline.feature.preprocess_ranking",
        "run_ranking_preprocessing",
    ),
    "retrieval_training": (
        "offline.training.train_retrieval",
        "run_retrieval_training",
    ),
    "ranking_training": (
        "offline.training.train_ranking",
        "run_ranking_training",
    ),
    "ingest": ("offline.storage.redis_ingest", "ingest_to_redis"),
    "deploy": ("offline.storage.local_deploy", "deploy_local"),
}


def _load_handler(step_name: str):
    module_path, function_name = STEP_HANDLERS[step_name]
    try:
        module = importlib.import_module(module_path)
    except ModuleNotFoundError as exc:
        missing_name = exc.name or "unknown dependency"
        raise ModuleNotFoundError(
            f"Step '{step_name}' requires optional dependency '{missing_name}'. "
            "For Windows offline training, run only preprocess/train steps or "
            "install the dependency needed by this step."
        ) from exc
    return getattr(module, function_name)


def main():
    parser = argparse.ArgumentParser(description="FunRec offline pipeline")
    parser.add_argument(
        "--steps",
        type=str,
        default="all",
        help="Pipeline steps: all, retrieval_preprocess, ranking_preprocess, "
        "retrieval_training, ranking_training, ingest, deploy",
    )
    parser.add_argument(
        "--flush-redis",
        action="store_true",
        help="Flush Redis before ingest step",
    )
    args = parser.parse_args()

    steps = [step.strip() for step in args.steps.split(",") if step.strip()]
    if "all" in steps:
        steps = [
            "retrieval_preprocess",
            "ranking_preprocess",
            "retrieval_training",
            "ranking_training",
            "ingest",
            "deploy",
        ]

    for step in steps:
        if step not in STEP_HANDLERS:
            raise ValueError(f"Unknown offline pipeline step: {step}")

        handler = _load_handler(step)
        if step == "ingest":
            handler(flush=args.flush_redis)
        else:
            handler()


if __name__ == "__main__":
    main()
