"""安全工具 - 密码哈希和 JWT 令牌处理"""

from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import jwt
import bcrypt

from app.config import settings


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """验证密码是否与哈希值匹配"""
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))


def get_password_hash(password: str) -> str:
    """对密码进行哈希处理"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """创建 JWT 访问令牌"""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    """解码并验证 JWT 令牌"""
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        return payload
    except jwt.JWTError:
        return None

