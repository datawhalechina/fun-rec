"""数据库模型定义"""

from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String, Float, BigInteger, Text, 
    ForeignKey, DateTime, Index, ARRAY
)
from sqlalchemy.orm import relationship

from app.database import Base


class Genre(Base):
    """电影类型模型 - 用于电影分类和用户偏好"""
    __tablename__ = "genres"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(50), unique=True, nullable=False, index=True)
    
    def __repr__(self):
        return f"<Genre(id={self.id}, name='{self.name}')>"


class User(Base):
    """用户模型"""
    __tablename__ = "users"
    
    user_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    # 认证字段
    email = Column(String(255), unique=True, index=True, nullable=True)  # 对已存在用户可为空
    username = Column(String(100), unique=True, index=True, nullable=True)  # 对已存在用户可为空
    hashed_password = Column(String(255), nullable=True)  # 对已存在用户可为空
    is_active = Column(Integer, default=1)  # 使用整数类型兼容性更好 (1=true, 0=false)
    is_superuser = Column(Integer, default=0)  # 使用整数类型兼容性更好
    
    # 人口统计信息 (来自 MovieLens 数据)
    gender = Column(String(1))
    age = Column(String(20))
    occupation = Column(String(100))
    zip_code = Column(String(10))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    # 用户偏好类型 (用于冷启动，用户编辑资料时更新)
    preferred_genres = Column(ARRAY(String), default=[])
    
    # 关联关系
    ratings = relationship("Rating", back_populates="user")
    
    def __repr__(self):
        return f"<User(user_id={self.user_id}, username={self.username}, email={self.email})>"


class Movie(Base):
    """电影模型 - 集成 IMDb 数据"""
    __tablename__ = "movies"
    
    movie_id = Column(Integer, primary_key=True, index=True)
    imdb_id = Column(String(20), index=True, unique=True)  # IMDb tconst ID
    title = Column(String(255), nullable=False, index=True)
    year = Column(Integer, index=True)
    genres = Column(ARRAY(String))  # PostgreSQL 数组类型，支持多类型
    description = Column(Text)
    
    # MovieLens 聚合评分
    avg_rating = Column(Float, index=True)
    rating_count = Column(Integer, default=0)
    
    # IMDb 评分 (来自 title_ratings 表)
    imdb_rating = Column(Float, index=True)
    imdb_votes = Column(Integer)
    
    # 其他元数据
    title_type = Column(String(50))  # movie, tvSeries 等
    runtime_minutes = Column(Integer)
    is_adult = Column(Integer, default=0)
    created_by = Column(Integer, ForeignKey("users.user_id"), nullable=True)  # 记录添加电影的管理员
    
    # 关联关系
    ratings = relationship("Rating", back_populates="movie")
    
    # 常用查询索引
    __table_args__ = (
        Index('idx_movie_avg_rating', 'avg_rating'),
        Index('idx_movie_imdb_rating', 'imdb_rating'),
        Index('idx_movie_year', 'year'),
    )
    
    def __repr__(self):
        return f"<Movie(movie_id={self.movie_id}, title='{self.title}', year={self.year})>"


class Rating(Base):
    """用户-物品评分模型 (MovieLens 评分数据)"""
    __tablename__ = "ratings"
    
    user_id = Column(Integer, ForeignKey("users.user_id"), primary_key=True)
    movie_id = Column(Integer, ForeignKey("movies.movie_id"), primary_key=True)
    rating = Column(Integer, nullable=False)  # 1-10 分制 (与 IMDb 相同)
    timestamp = Column(BigInteger, nullable=False)
    
    # 关联关系
    user = relationship("User", back_populates="ratings")
    movie = relationship("Movie", back_populates="ratings")
    
    # 常用查询索引
    __table_args__ = (
        Index('idx_rating_user_timestamp', 'user_id', 'timestamp'),
        Index('idx_rating_movie_rating', 'movie_id', 'rating'),
    )
    
    def __repr__(self):
        return f"<Rating(user_id={self.user_id}, movie_id={self.movie_id}, rating={self.rating})>"


class TitleRating(Base):
    """IMDb 电影评分 - 每部电影的聚合评分"""
    __tablename__ = "title_ratings"
    
    tconst = Column(String(20), primary_key=True, index=True)  # IMDb ID
    average_rating = Column(Float, nullable=False, index=True)  # 0-10 分制
    num_votes = Column(Integer, nullable=False, index=True)
    
    def __repr__(self):
        return f"<TitleRating(tconst='{self.tconst}', rating={self.average_rating}, votes={self.num_votes})>"


class NameBasics(Base):
    """人物详情 (演员、导演等) - 来自 IMDb"""
    __tablename__ = "name_basics"
    
    nconst = Column(String(20), primary_key=True, index=True)  # IMDb 人物 ID
    primary_name = Column(String(255), nullable=False, index=True)
    birth_year = Column(Integer)
    death_year = Column(Integer)
    primary_profession = Column(ARRAY(String))  # 如 ['actor', 'producer']
    known_for_titles = Column(ARRAY(String))  # IMDb 作品 ID 列表
    
    def __repr__(self):
        return f"<NameBasics(nconst='{self.nconst}', name='{self.primary_name}')>"


class TitleCrew(Base):
    """电影主创人员 - 导演和编剧"""
    __tablename__ = "title_crew"
    
    tconst = Column(String(20), primary_key=True, index=True)  # IMDb 作品 ID
    directors = Column(ARRAY(String))  # 导演 nconst ID 列表
    writers = Column(ARRAY(String))  # 编剧 nconst ID 列表
    
    def __repr__(self):
        return f"<TitleCrew(tconst='{self.tconst}')>"


class TitlePrincipal(Base):
    """电影主要演职人员 (主要角色)"""
    __tablename__ = "title_principals"
    
    tconst = Column(String(20), primary_key=True, index=True)  # IMDb 作品 ID
    ordering = Column(Integer, primary_key=True)  # 重要性排序
    nconst = Column(String(20), index=True)  # IMDb 人物 ID
    category = Column(String(50))  # actor, actress, director 等
    job = Column(String(255))  # 职位名称 (针对幕后人员)
    characters = Column(Text)  # 角色名 (JSON 字符串格式)
    
    # 常用查询复合索引
    __table_args__ = (
        Index('idx_principal_movie_category', 'tconst', 'category'),
        Index('idx_principal_person', 'nconst'),
    )
    
    def __repr__(self):
        return f"<TitlePrincipal(tconst='{self.tconst}', nconst='{self.nconst}', category='{self.category}')>"


class TitleAka(Base):
    """电影别名 (不同地区/语言的译名)"""
    __tablename__ = "title_akas"
    
    tconst = Column(String(20), primary_key=True, index=True)  # IMDb 作品 ID
    ordering = Column(Integer, primary_key=True)  # 列表中的顺序
    title = Column(String(500), index=True)  # 本地化标题
    region = Column(String(10))  # 国家代码 (US, GB 等)
    language = Column(String(10))  # 语言代码
    types = Column(String(100))  # 别名类型
    attributes = Column(String(255))  # 附加属性
    is_original_title = Column(Integer)  # 1 表示原始标题，0 表示否
    
    # 按地区搜索索引
    __table_args__ = (
        Index('idx_aka_title', 'title'),
        Index('idx_aka_region', 'region'),
    )
    
    def __repr__(self):
        return f"<TitleAka(tconst='{self.tconst}', title='{self.title}', region='{self.region}')>"

