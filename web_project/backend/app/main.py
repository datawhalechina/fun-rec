"""FastAPI 应用入口"""

import logging

# 配置日志，显示 INFO 级别及以上
logging.basicConfig(
    level=logging.INFO,    
    format="%(levelname)s: %(message)s",
)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from app.config import settings
from app.api.v1.api import api_router
from app.api.v1.endpoints.health import router as health_router

# 创建 FastAPI 应用实例
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    debug=settings.debug,
)

# CORS 中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境请适当配置
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 挂载电影海报静态文件目录
poster_dir = Path(settings.poster_dir)
if poster_dir.exists():
    app.mount(f"{settings.api_prefix}/posters", StaticFiles(directory=str(poster_dir)), name="posters")
    print(f"✓ 海报服务已启动: {poster_dir} -> {settings.api_prefix}/posters")
else:
    print(f"⚠ 警告: 海报目录不存在: {poster_dir}")
    print(f"  在创建目录之前，海报请求将返回 404")


@app.get("/")
async def root():
    """根路由"""
    return {
        "message": "欢迎使用 FunRec 电影推荐系统",
        "version": settings.app_version,
        "docs": "/docs",
    }


# 在根路径下注册健康检查路由（无前缀）
app.include_router(health_router)

# 注册 API 路由，使用 /api 前缀
app.include_router(api_router, prefix=settings.api_prefix)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
