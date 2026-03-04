"""
FunRec 离线流水线

用于执行特征预处理、模型训练、数据导入和模型部署的离线任务。
"""

import argparse
from offline.feature.preprocess_retrieval import run_retrieval_preprocessing
from offline.feature.preprocess_ranking import run_ranking_preprocessing
from offline.training.train_retrieval import run_retrieval_training
from offline.training.train_ranking import run_ranking_training
from offline.storage.redis_ingest import ingest_to_redis
from offline.storage.local_deploy import deploy_local

def main():
    parser = argparse.ArgumentParser(description="FunRec 离线流水线")
    parser.add_argument("--steps", type=str, default="all", help="要执行的步骤: all, preprocess, train, ingest, deploy")
    parser.add_argument("--flush-redis", action="store_true", help="清空 Redis 数据库")
    args = parser.parse_args()
    
    steps = args.steps.split(",")
    if "all" in steps:
        steps = ["retrieval_preprocess", "ranking_preprocess", "retrieval_training", "ranking_training", "ingest", "deploy"]
        
    if "retrieval_preprocess" in steps:
        run_retrieval_preprocessing()

    if "ranking_preprocess" in steps:
        run_ranking_preprocessing()

    if "retrieval_training" in steps:
        run_retrieval_training()

    if "ranking_training" in steps:
        run_ranking_training()
        
    if "ingest" in steps:
        ingest_to_redis(flush=args.flush_redis)
        
    if "deploy" in steps:
        deploy_local()
        
if __name__ == "__main__":
    main()
