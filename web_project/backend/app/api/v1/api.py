"""API v1 路由聚合"""

from fastapi import APIRouter

from app.api.v1.endpoints import auth, users, movies, people, stats, ratings, search, recommendations, genres
from app.chat.router import router as chat_router

api_router = APIRouter()

# 注册各个路由到 /api 路径
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(movies.router)
api_router.include_router(people.router)
api_router.include_router(stats.router)
api_router.include_router(ratings.router)
api_router.include_router(search.router)
api_router.include_router(genres.router)
api_router.include_router(recommendations.router, prefix="/recommendations", tags=["recommendations"])
api_router.include_router(chat_router)
