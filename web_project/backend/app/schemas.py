"""API 请求/响应的 Pydantic 数据模式定义"""

from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime


class MovieBase(BaseModel):
    """电影基础模式"""
    title: str
    year: Optional[int] = None
    genres: List[str] = []
    description: Optional[str] = None


class MovieCreate(BaseModel):
    """创建电影的模式 (仅管理员)"""
    title: str = Field(..., max_length=255, description="电影标题")
    imdb_id: Optional[str] = Field(None, max_length=20, description="IMDb ID (如 tt1234567)")
    year: Optional[int] = Field(None, ge=1888, le=2099, description="上映年份")
    genres: Optional[List[str]] = Field(default=[], description="电影类型列表")
    description: Optional[str] = Field(None, description="电影简介")
    runtime_minutes: Optional[int] = Field(None, gt=0, description="时长（分钟）")
    title_type: Optional[str] = Field(None, max_length=50, description="类型: movie, tvSeries 等")
    imdb_rating: Optional[float] = Field(None, ge=0, le=10, description="IMDb 评分 (0-10)")
    imdb_votes: Optional[int] = Field(None, ge=0, description="IMDb 投票数")


class MovieDetail(MovieBase):
    """电影详情模式 - 用于 API 响应"""
    movie_id: int
    imdb_id: Optional[str] = None    
    avg_rating: Optional[float] = None
    rating_count: Optional[int] = 0
    imdb_rating: Optional[float] = None
    imdb_votes: Optional[int] = None
    runtime_minutes: Optional[int] = None
    title_type: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)


class MovieListItem(BaseModel):
    """电影列表项模式 - 用于列表视图"""
    movie_id: int
    title: str
    year: Optional[int] = None
    genres: List[str] = []    
    avg_rating: Optional[float] = None
    imdb_rating: Optional[float] = None
    
    model_config = ConfigDict(from_attributes=True)


class MovieList(BaseModel):
    """分页电影列表响应"""
    items: List[MovieListItem]
    total: int
    page: int
    page_size: int
    has_next: bool


class UserBase(BaseModel):
    """用户基础模式"""
    email: str
    username: str
    gender: Optional[str] = None
    age: Optional[str] = None
    occupation: Optional[str] = None
    zip_code: Optional[str] = None


class UserSignup(BaseModel):
    """用户注册模式"""
    email: str = Field(..., description="邮箱地址")
    password: str = Field(..., min_length=6, description="密码")
    gender: Optional[str] = Field(None, max_length=1)
    age: Optional[str] = None
    occupation: Optional[str] = None
    zip_code: Optional[str] = None
    preferred_genres: Optional[List[str]] = Field(default=[], description="用户偏好类型（用于冷启动）")


class UserLogin(BaseModel):
    """用户登录模式"""
    email: str
    password: str


class Token(BaseModel):
    """JWT 令牌响应"""
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """令牌载荷数据"""
    user_id: Optional[int] = None


class RecentRating(BaseModel):
    """用户最近评分模式 - 包含电影信息"""
    movie_id: int
    title: str
    genres: List[str] = []
    rating: int
    timestamp: int
    
    model_config = ConfigDict(from_attributes=True)


class UserProfile(BaseModel):
    """用户资料响应"""
    user_id: int
    email: str
    username: str
    gender: Optional[str] = None
    age: Optional[str] = None
    occupation: Optional[str] = None
    zip_code: Optional[str] = None
    is_superuser: int = 0  # 管理员状态 (0 或 1)
    created_at: datetime
    
    # 用户偏好类型（用于冷启动，用户编辑资料时更新）
    preferred_genres: List[str] = []
    
    # 计算字段（不存储在数据库中）
    frequent_genres: List[str] = []  # 根据评分历史计算的最常评分类型
    recent_ratings: List[RecentRating] = []
    
    model_config = ConfigDict(from_attributes=True)


class UserUpdate(BaseModel):
    """用户资料更新模式（邮箱/用户名不可修改）"""
    gender: Optional[str] = Field(None, max_length=1)
    age: Optional[str] = None
    occupation: Optional[str] = None
    zip_code: Optional[str] = None
    preferred_genres: Optional[List[str]] = Field(None, description="用户偏好类型（用于冷启动）")


class UserDetail(UserBase):
    """用户详情模式（向后兼容）"""
    user_id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class RatingBase(BaseModel):
    """评分基础模式"""
    user_id: int
    movie_id: int
    rating: int = Field(..., ge=1, le=5)


class RatingDetail(RatingBase):
    """评分详情模式"""
    timestamp: int
    
    model_config = ConfigDict(from_attributes=True)


class RatingCreate(BaseModel):
    """创建评分的模式"""
    movie_id: int
    rating: int = Field(..., ge=1, le=10, description="评分 1-10 分")


class HealthCheck(BaseModel):
    """健康检查响应"""
    status: str
    version: str
    database: str
    redis: str
    elasticsearch: str


# 人物/演员/主创 模式定义

class PersonBase(BaseModel):
    """人物基础模式"""
    person_id: str  # nconst
    name: str
    birth_year: Optional[int] = None
    death_year: Optional[int] = None


class PersonDetail(PersonBase):
    """人物详情模式"""
    professions: List[str] = []
    known_for_titles: List[str] = []


class CastMember(BaseModel):
    """电影演员成员"""
    person_id: str
    name: str
    character: Optional[str] = None
    category: str  # actor, actress
    ordering: int


class CrewMember(PersonBase):
    """主创成员（导演/编剧）"""
    pass


class MovieCast(BaseModel):
    """电影演员阵容响应"""
    movie_id: int
    movie_title: str
    cast: List[CastMember]


class MovieCrew(BaseModel):
    """电影主创响应"""
    movie_id: int
    movie_title: str
    directors: List[CrewMember]
    writers: List[CrewMember]


class GenreResponse(BaseModel):
    """电影类型 API 响应模式"""
    id: int
    name: str
    
    model_config = ConfigDict(from_attributes=True)


class GenreListResponse(BaseModel):
    """可用电影类型列表"""
    genres: List[GenreResponse]

