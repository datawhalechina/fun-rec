"""电影"""

from fastapi import APIRouter, Depends, HTTPException, Query, File, UploadFile, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import json
import shutil
from pathlib import Path

from app.api.deps import get_db
from app.core.auth import get_current_admin_user
from app.models import Movie, TitleCrew, TitlePrincipal, NameBasics, User
from app.schemas import (
    MovieDetail, MovieListItem, MovieList,
    MovieCast, MovieCrew, CastMember, CrewMember, MovieCreate
)
from app.config import settings
from app.services.elasticsearch_service import es_service

router = APIRouter()


@router.post("/movies", response_model=MovieDetail, status_code=201, tags=["movies"])
async def create_movie(
    movie_data: str = Form(..., description="电影数据，json格式"),
    poster: Optional[UploadFile] = File(None, description="海报图片，可选"),
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """创建新电影（仅管理员）"""
    
    # 解析 JSON 字符串中的电影数据
    try:
        movie_dict = json.loads(movie_data)
        movie_create = MovieCreate(**movie_dict)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="电影数据解析失败")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"验证失败: {str(e)}")
    
    # 检查 IMDb ID 是否已存在（如果提供了的话）
    if movie_create.imdb_id:
        existing = db.query(Movie).filter(Movie.imdb_id == movie_create.imdb_id).first()
        if existing:
            raise HTTPException(
                status_code=409,
                detail=f"电影 IMDb ID {movie_create.imdb_id} 已存在 (movie_id: {existing.movie_id})"
            )
    
    # 验证上传的海报
    if poster:
        # 检查文件大小
        max_size_bytes = settings.max_poster_size_mb * 1024 * 1024
        poster.file.seek(0, 2)  # 移动到文件末尾
        file_size = poster.file.tell()
        poster.file.seek(0)  # 移回文件开头
        
        if file_size > max_size_bytes:
            raise HTTPException(
                status_code=413,
                detail=f"海报文件太大。最大大小: {settings.max_poster_size_mb}MB"
            )
        
        # 检查文件类型
        if poster.content_type not in settings.allowed_poster_types:
            raise HTTPException(
                status_code=400,
                detail=f"海报文件类型无效。允许的类型: {', '.join(settings.allowed_poster_types)}"
            )
    
    # 创建电影记录
    new_movie = Movie(
        title=movie_create.title,
        imdb_id=movie_create.imdb_id,
        year=movie_create.year,
        genres=movie_create.genres if movie_create.genres else [],
        description=movie_create.description,
        runtime_minutes=movie_create.runtime_minutes,
        title_type=movie_create.title_type,
        imdb_rating=movie_create.imdb_rating,
        imdb_votes=movie_create.imdb_votes,
        created_by=current_admin.user_id,
        avg_rating=None,
        rating_count=0,
        is_adult=0
    )
    
    db.add(new_movie)
    db.commit()
    db.refresh(new_movie)
    
    # 将电影索引到 Elasticsearch 以支持搜索
    try:
        movie_doc = {
            "movie_id": new_movie.movie_id,
            "title": new_movie.title,
            "year": new_movie.year,
            "genres": new_movie.genres or [],
            "description": new_movie.description,
            "imdb_id": new_movie.imdb_id,
            "avg_rating": new_movie.avg_rating,
            "imdb_rating": new_movie.imdb_rating,
            "rating_count": new_movie.rating_count,
            "imdb_votes": new_movie.imdb_votes,
            "runtime_minutes": new_movie.runtime_minutes,
            "title_type": new_movie.title_type
        }
        es_service.index_movie(movie_doc)
        print(f"✓ 已在 Elasticsearch 中索引电影: {new_movie.title} (ID: {new_movie.movie_id})")
    except Exception as e:
        print(f"⚠ 警告: 无法将电影索引到 Elasticsearch: {e}")
        # 不终止请求 - 电影已创建成功
    
    # 保存海报（如果上传了）
    if poster:
        try:
            poster_dir = Path(settings.poster_dir)
            poster_dir.mkdir(parents=True, exist_ok=True)
            
            # 保存为 {movie_id}.png
            poster_path = poster_dir / f"{new_movie.movie_id}.png"
            
            with poster_path.open("wb") as buffer:
                shutil.copyfileobj(poster.file, buffer)
            
            print(f"✓ 海报已保存: {poster_path}")
            
        except Exception as e:
            print(f"⚠ 警告: 无法保存电影 {new_movie.movie_id} 的海报: {e}")
            # 不终止请求 - 电影已创建成功
    
    return MovieDetail(
        movie_id=new_movie.movie_id,
        imdb_id=new_movie.imdb_id,
        title=new_movie.title,
        year=new_movie.year,
        genres=new_movie.genres or [],
        description=new_movie.description,
        avg_rating=new_movie.avg_rating,
        rating_count=new_movie.rating_count,
        imdb_rating=new_movie.imdb_rating,
        imdb_votes=new_movie.imdb_votes,
        runtime_minutes=new_movie.runtime_minutes,
        title_type=new_movie.title_type,
    )


@router.get("/movies", response_model=MovieList, tags=["movies"])
async def get_movies(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    genre: Optional[str] = Query(None, description="Filter by genre"),
    min_year: Optional[int] = Query(None, description="Minimum release year"),
    max_year: Optional[int] = Query(None, description="Maximum release year"),
    min_rating: Optional[float] = Query(None, ge=0, le=10, description="Minimum IMDb rating"),
    sort_by: str = Query("rating", description="Sort by: rating, year, title"),
    db: Session = Depends(get_db)
):
    """获取分页电影列表，支持过滤条件"""
    
    query = db.query(Movie)
    
    if genre:
        query = query.filter(Movie.genres.any(genre))
    
    if min_year:
        query = query.filter(Movie.year >= min_year)
    
    if max_year:
        query = query.filter(Movie.year <= max_year)
    
    if min_rating:
        query = query.filter(Movie.imdb_rating >= min_rating)
    
    total = query.count()
    
    if sort_by == "rating":
        query = query.order_by(Movie.imdb_rating.desc().nullslast())
    elif sort_by == "year":
        query = query.order_by(Movie.year.desc().nullslast())
    elif sort_by == "title":
        query = query.order_by(Movie.title)
    
    offset = (page - 1) * page_size
    movies = query.offset(offset).limit(page_size).all()
    
    items = [
        MovieListItem(
            movie_id=m.movie_id,
            title=m.title,
            year=m.year,
            genres=m.genres or [],
            avg_rating=m.avg_rating,
            imdb_rating=m.imdb_rating,
        )
        for m in movies
    ]
    
    return MovieList(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        has_next=offset + page_size < total,
    )


@router.get("/movies/popular", response_model=List[MovieListItem], tags=["movies"])
async def get_popular_movies(
    limit: int = Query(20, ge=1, le=100, description="返回的电影数量"),
    db: Session = Depends(get_db)
):
    """获取热门电影 - 基于 IMDb 评分和投票数"""
    
    movies = (
        db.query(Movie)
        .filter(Movie.imdb_votes >= 1000)
        .filter(Movie.imdb_rating.isnot(None))
        .order_by(Movie.imdb_rating.desc())
        .limit(limit)
        .all()
    )
    
    return [
        MovieListItem(
            movie_id=m.movie_id,
            title=m.title,
            year=m.year,
            genres=m.genres or [],
            avg_rating=m.avg_rating,
            imdb_rating=m.imdb_rating,
        )
        for m in movies
    ]


@router.get("/movies/{movie_id}", response_model=MovieDetail, tags=["movies"])
async def get_movie(
    movie_id: int,
    db: Session = Depends(get_db)
):
    """获取指定电影的详细信息"""
    
    movie = db.query(Movie).filter(Movie.movie_id == movie_id).first()
    
    if not movie:
        raise HTTPException(status_code=404, detail=f"Movie {movie_id} not found")
    
    return MovieDetail(
        movie_id=movie.movie_id,
        imdb_id=movie.imdb_id,
        title=movie.title,
        year=movie.year,
        genres=movie.genres or [],
        description=movie.description,
        avg_rating=movie.avg_rating,
        rating_count=movie.rating_count,
        imdb_rating=movie.imdb_rating,
        imdb_votes=movie.imdb_votes,
        runtime_minutes=movie.runtime_minutes,
        title_type=movie.title_type,
    )


@router.get("/movies/{movie_id}/cast", response_model=MovieCast, tags=["movies"])
async def get_movie_cast(
    movie_id: int,
    limit: int = Query(10, ge=1, le=50, description="返回的演员数量"),
    db: Session = Depends(get_db)
):
    """获取指定电影的演员阵容"""
    
    movie = db.query(Movie).filter(Movie.movie_id == movie_id).first()
    if not movie or not movie.imdb_id:
        raise HTTPException(status_code=404, detail=f"电影 {movie_id} 不存在")
    
    principals = (
        db.query(TitlePrincipal, NameBasics)
        .join(NameBasics, TitlePrincipal.nconst == NameBasics.nconst)
        .filter(TitlePrincipal.tconst == movie.imdb_id)
        .filter(TitlePrincipal.category.in_(['actor', 'actress']))
        .order_by(TitlePrincipal.ordering)
        .limit(limit)
        .all()
    )
    
    cast_list = []
    for principal, person in principals:
        character = None
        if principal.characters:
            try:
                char_list = json.loads(principal.characters)
                if isinstance(char_list, list) and len(char_list) > 0:
                    character = char_list[0]
                elif isinstance(char_list, str):
                    character = char_list
            except (json.JSONDecodeError, TypeError):
                character = principal.characters
        
        cast_list.append(
            CastMember(
                person_id=person.nconst,
                name=person.primary_name,
                character=character,
                category=principal.category,
                ordering=principal.ordering,
            )
        )
    
    return MovieCast(
        movie_id=movie_id,
        movie_title=movie.title,
        cast=cast_list,
    )


@router.get("/movies/{movie_id}/crew", response_model=MovieCrew, tags=["movies"])
async def get_movie_crew(
    movie_id: int,
    db: Session = Depends(get_db)
):
    """获取指定电影的导演和编剧"""
    
    movie = db.query(Movie).filter(Movie.movie_id == movie_id).first()
    if not movie or not movie.imdb_id:
        raise HTTPException(status_code=404, detail=f"电影 {movie_id} 不存在")
    
    crew = db.query(TitleCrew).filter(TitleCrew.tconst == movie.imdb_id).first()
    
    if not crew:
        return MovieCrew(
            movie_id=movie_id,
            movie_title=movie.title,
            directors=[],
            writers=[],
        )
    
    directors = []
    if crew.directors:
        director_objs = db.query(NameBasics).filter(NameBasics.nconst.in_(crew.directors)).all()
        directors = [
            CrewMember(
                person_id=d.nconst,
                name=d.primary_name,
                birth_year=d.birth_year,
                death_year=d.death_year,
            )
            for d in director_objs
        ]
    
    writers = []
    if crew.writers:
        writer_objs = db.query(NameBasics).filter(NameBasics.nconst.in_(crew.writers)).all()
        writers = [
            CrewMember(
                person_id=w.nconst,
                name=w.primary_name,
                birth_year=w.birth_year,
                death_year=w.death_year,
            )
            for w in writer_objs
        ]
    
    return MovieCrew(
        movie_id=movie_id,
        movie_title=movie.title,
        directors=directors,
        writers=writers,
    )

