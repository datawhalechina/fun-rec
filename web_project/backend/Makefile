.PHONY: help up down restart logs ingest clean rebuild shell db-shell test

test:
	uv run pytest

test-verbose:
	# 运行带有详细输出的测试
	uv run pytest -v

test-specific:
	uv run pytest tests/test_api_endpoints.py::TestBasicEndpoints::test_health_check

test-auth:
	uv run pytest tests/test_auth.py

launch-api:
	uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload


run-offline-pipeline:
	# 运行离线流水线
	uv run python -m offline.pipeline --steps all --flush-redis

ingest-to-redis:
	# 将数据导入 Redis
	uv run python -m offline.pipeline --steps ingest --flush-redis

index-movies-to-elasticsearch:
	# 索引电影到 Elasticsearch
	uv run scripts/index_movies_elasticsearch.py

ingest-data-to-database:
	# 将数据导入数据库
	uv run scripts/ingest_data_to_database.py --reset --create-test-user