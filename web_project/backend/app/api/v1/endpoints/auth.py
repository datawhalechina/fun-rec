"""认证"""

from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.models import User
from app.schemas import UserSignup, UserLogin, Token, UserProfile
from app.config import settings

router = APIRouter()


@router.post("/auth/signup", response_model=UserProfile, status_code=status.HTTP_201_CREATED, tags=["auth"])
async def signup(user_data: UserSignup, db: Session = Depends(get_db)):
    """注册新用户"""
    
    # 检查邮箱是否已存在
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="邮箱已注册"
        )
    
    # 邮箱即用户名
    hashed_password = get_password_hash(user_data.password)
    
    db_user = User(
        email=user_data.email,
        username=user_data.email,  # 用户名 = 邮箱
        hashed_password=hashed_password,
        gender=user_data.gender,
        age=user_data.age,
        occupation=user_data.occupation,
        zip_code=user_data.zip_code,
        preferred_genres=user_data.preferred_genres or [],  # 用户偏好类型（用于冷启动）
        is_active=1,
        is_superuser=0,
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return UserProfile.model_validate(db_user)


@router.post("/auth/login", response_model=Token, tags=["auth"])
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """用户登录并获取访问令牌"""
    
    # 根据邮箱查找用户
    user = db.query(User).filter(User.email == credentials.email).first()
    
    if not user or not user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="错误的邮箱或密码",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 验证密码
    if not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="错误的邮箱或密码",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 检查用户是否激活
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="用户未激活"
        )
    
    # 创建访问令牌
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": str(user.user_id)},  # JWT subject 必须是字符串
        expires_delta=access_token_expires
    )
    
    return Token(access_token=access_token, token_type="bearer")



