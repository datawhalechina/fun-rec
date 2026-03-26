.PHONY: help up down restart logs ingest clean rebuild shell db-shell test

test:
	uv run pytest

test-verbose:
	uv run pytest -v

test-specific:
	uv run pytest tests/test_api_endpoints.py::TestBasicEndpoints::test_health_check

test-auth:
	uv run pytest tests/test_auth.py

launch-api:
	uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

run-offline-pipeline:
	uv run python -m offline.pipeline --steps all --flush-redis

run-offline-training:
	uv run python -m offline.pipeline --steps retrieval_preprocess,ranking_preprocess,retrieval_training,ranking_training

ingest-to-redis:
	uv run python -m offline.pipeline --steps ingest --flush-redis

index-movies-to-elasticsearch:
	uv run scripts/index_movies_elasticsearch.py

ingest-data-to-database:
	uv run scripts/ingest_data_to_database.py --reset --create-test-user
