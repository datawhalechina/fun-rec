"""FastAPI application entrypoint."""

import logging
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.v1.api import api_router
from app.api.v1.endpoints.health import router as health_router
from app.config import settings


logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    debug=settings.debug,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

poster_dir = Path(settings.poster_dir)
if poster_dir.exists():
    app.mount(
        f"{settings.api_prefix}/posters",
        StaticFiles(directory=str(poster_dir)),
        name="posters",
    )
    print(f"Poster service enabled: {poster_dir} -> {settings.api_prefix}/posters")
else:
    print(f"Warning: poster directory does not exist: {poster_dir}")
    print("  Poster requests will return 404 until the directory is created.")


@app.get("/")
async def root():
    return {
        "message": "Welcome to FunRec Movie Recommender",
        "version": settings.app_version,
        "docs": "/docs",
    }


app.include_router(health_router)
app.include_router(api_router, prefix=settings.api_prefix)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
