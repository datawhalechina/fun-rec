"""MovieLens 1M + IMDb 评分数据导入脚本

本脚本处理以下任务:
- 数据库初始化（创建/重置表）
- 从 pickle 文件加载数据
- 填充 PostgreSQL 数据库
- 将电影数据与 IMDb 评分关联
- 创建测试用户

使用方法:
    python ingest_data.py [--reset] [--skip-ratings] [--create-test-user]
"""

import argparse
import os
import pickle
import sys
from pathlib import Path
from typing import Dict, List
import pandas as pd
from dotenv import load_dotenv

load_dotenv("../.env")

# 添加父目录到路径以导入模块
sys.path.append(str(Path(__file__).parent.parent))

from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import SessionLocal, init_db
from app.models import (
    User, Movie, Rating, TitleRating,
    NameBasics, TitleCrew, TitlePrincipal, TitleAka, Genre
)
from app.config import settings
from app.core.security import get_password_hash


def load_pickle_file(file_path: str) -> pd.DataFrame:
    """从 pickle 文件加载数据"""
    print(f"加载 {file_path}...")
    df = pd.read_pickle(file_path)
    print(f"加载了 {len(df)} 记录")
    return df


def load_metadata(file_path: str) -> Dict[str, pd.DataFrame]:
    """从 pickle 文件加载元数据字典"""
    print(f"加载元数据从 {file_path}...")
    with open(file_path, 'rb') as f:
        metadata = pickle.load(f)
    for key, df in metadata.items():
        print(f"  - {key}: {len(df)} records")
    return metadata


def ingest_title_ratings(db: Session, df_title_ratings: pd.DataFrame):
    """导入 IMDb 电影评分"""
    print("\n=== 导入 IMDb 电影评分 ===")
    
    # 创建连接字典
    title_ratings_dict = {}
    
    batch = []
    for idx, row in df_title_ratings.iterrows():
        title_rating = TitleRating(
            tconst=row['tconst'],
            average_rating=float(row['averageRating']),
            num_votes=int(row['numVotes'])
        )
        batch.append(title_rating)
        title_ratings_dict[row['tconst']] = {
            'rating': float(row['averageRating']),
            'votes': int(row['numVotes'])
        }
        
        # 每 1000 条记录批量插入
        if len(batch) >= 1000:
            db.bulk_save_objects(batch)
            db.commit()
            print(f"插入了 {len(batch)} 条 IMDb 电影评分")
            batch = []
    
    # 插入剩余的
    if batch:
        db.bulk_save_objects(batch)
        db.commit()
        print(f"Inserted {len(batch)} title ratings...")
    
    print(f"总共导入 IMDb 电影评分: {len(df_title_ratings)}")
    return title_ratings_dict


def ingest_movies(db: Session, df_movies: pd.DataFrame, title_ratings_dict: Dict):
    """导入电影数据（关联 IMDb 评分）"""
    print("\n=== Ingesting Movies ===")
    
    batch = []
    movies_with_ratings = 0
    
    for idx, row in df_movies.iterrows():
        # 解析 genres (将管道分隔的字符串转换为列表)
        genres_str = row.get('genres', '')
        genres = [g.strip() for g in str(genres_str).split('|') if g.strip()] if pd.notna(genres_str) else []
        
        # 与 IMDb 评分关联
        imdb_id = row.get('imdb_id')
        imdb_rating = None
        imdb_votes = None
        if pd.notna(imdb_id) and imdb_id in title_ratings_dict:
            imdb_rating = title_ratings_dict[imdb_id]['rating']
            imdb_votes = title_ratings_dict[imdb_id]['votes']
            movies_with_ratings += 1
        
        movie = Movie(
            movie_id=int(row['movie_id']),
            imdb_id=imdb_id if pd.notna(imdb_id) else None,
            title=str(row['title']),
            year=int(row['startYear']) if pd.notna(row.get('startYear')) and str(row['startYear']) != '\\N' else None,
            genres=genres,
            description=str(row.get('description', '')),            
            title_type=str(row.get('titleType', 'movie')),
            runtime_minutes=int(row['runtimeMinutes']) if pd.notna(row.get('runtimeMinutes')) and str(row['runtimeMinutes']) != '\\N' else None,
            is_adult=int(row.get('isAdult', 0)) if pd.notna(row.get('isAdult')) else 0,
            # IMDb 评分关联在这里
            imdb_rating=imdb_rating,
            imdb_votes=imdb_votes,
            # MovieLens 评分将在评分导入后计算
            avg_rating=None,
            rating_count=0,
        )
        batch.append(movie)
        
        # 每 500 条记录批量插入
        if len(batch) >= 500:
            db.bulk_save_objects(batch)
            db.commit()
            print(f"Inserted {len(batch)} movies...")
            batch = []
    
    # 插入剩余的
    if batch:
        db.bulk_save_objects(batch)
        db.commit()
        print(f"插入了 {len(batch)} 条电影")
    
    print(f"总共导入电影: {len(df_movies)}")
    print(f"有 IMDb 评分的电影: {movies_with_ratings} ({movies_with_ratings/len(df_movies)*100:.1f}%)")


def ingest_users(db: Session, df_users: pd.DataFrame):
    """导入用户数据"""
    print("\n=== 导入用户数据 ===")
    
    batch = []
    max_user_id = 0
    
    for idx, row in df_users.iterrows():
        user_id = int(row['user_id'])
        max_user_id = max(max_user_id, user_id)
        
        user = User(
            user_id=user_id,
            gender=str(row.get('gender')) if pd.notna(row.get('gender')) else None,
            age=str(row.get('age')) if pd.notna(row.get('age')) else None,
            occupation=str(row.get('occupation')) if pd.notna(row.get('occupation')) else None,
            zip_code=str(row.get('zip_code')) if pd.notna(row.get('zip_code')) else None,
        )
        batch.append(user)
        
        # 每 1000 条记录批量插入
        if len(batch) >= 1000:
            db.bulk_save_objects(batch)
            db.commit()
            print(f"插入了 {len(batch)} 条用户")
            batch = []
    
    # 插入剩余的
    if batch:
        db.bulk_save_objects(batch)
        db.commit()
        print(f"插入了 {len(batch)} 条用户")
    
    # 重置序列以避免创建新用户时的冲突
    db.execute(text(f"SELECT setval('users_user_id_seq', {max_user_id + 1}, false)"))
    db.commit()
    
    print(f"总共导入用户: {len(df_users)}")
    print(f"用户 ID 序列重置为从 {max_user_id + 1} 开始")


def ingest_ratings(db: Session, df_ratings: pd.DataFrame):
    """导入评分数据"""
    print("\n=== 导入评分数据 ===")
    
    batch = []
    for idx, row in df_ratings.iterrows():
        rating = Rating(
            user_id=int(row['user_id']),
            movie_id=int(row['movie_id']),
            rating=int(row['rating']),
            timestamp=int(row['timestamp']),
        )
        batch.append(rating)
        
        # 每 5000 条记录批量插入
        if len(batch) >= 5000:
            db.bulk_save_objects(batch)
            db.commit()
            print(f"插入了 {len(batch)} 条评分")
            batch = []
    
    # 插入剩余的
    if batch:
        db.bulk_save_objects(batch)
        db.commit()
        print(f"插入了 {len(batch)} 条评分")
    
    print(f"总共导入评分: {len(df_ratings)}")


def update_movie_statistics(db: Session):
    """从评分表更新电影统计数据（avg_rating、rating_count）"""
    print("\n=== 更新电影统计数据 ===")
    
    # 使用 SQL 进行高效聚合
    query = text("""
    UPDATE movies m
    SET 
        avg_rating = r.avg_rating,
        rating_count = r.rating_count
    FROM (
        SELECT 
            movie_id,
            AVG(rating)::FLOAT as avg_rating,
            COUNT(*)::INTEGER as rating_count
        FROM ratings
        GROUP BY movie_id
    ) r
    WHERE m.movie_id = r.movie_id
    """)
    
    db.execute(query)
    db.commit()
    
    print("电影统计数据更新成功")


def ingest_name_basics(db: Session, df_name_basics: pd.DataFrame):
    """导入人物详情（演员、导演等）"""
    print("\n=== 导入人物详情 (People) ===")
    
    batch = []
    for idx, row in df_name_basics.iterrows():
        # 解析 professions 和 known titles
        professions = str(row.get('primaryProfession', '')).split(',') if pd.notna(row.get('primaryProfession')) else []
        professions = [p.strip() for p in professions if p.strip() and p.strip() != '\\N']
        
        known_titles = str(row.get('knownForTitles', '')).split(',') if pd.notna(row.get('knownForTitles')) else []
        known_titles = [t.strip() for t in known_titles if t.strip() and t.strip() != '\\N']
        
        name_basic = NameBasics(
            nconst=row['nconst'],
            primary_name=str(row.get('primaryName', '')),
            birth_year=int(row['birthYear']) if pd.notna(row.get('birthYear')) and str(row['birthYear']) != '\\N' else None,
            death_year=int(row['deathYear']) if pd.notna(row.get('deathYear')) and str(row['deathYear']) != '\\N' else None,
            primary_profession=professions if professions else None,
            known_for_titles=known_titles if known_titles else None,
        )
        batch.append(name_basic)
        
        # 每 1000 条记录批量插入
        if len(batch) >= 1000:
            db.bulk_save_objects(batch)
            db.commit()
            print(f"插入了 {len(batch)} 条人物详情")
            batch = []
    
    # 插入剩余的
    if batch:
        db.bulk_save_objects(batch)
        db.commit()
        print(f"插入了 {len(batch)} 条人物详情")
    
    print(f"总共导入人物详情: {len(df_name_basics)}")


def ingest_title_crew(db: Session, df_title_crew: pd.DataFrame):
    """导入每部电影的导演和编剧"""
    print("\n=== 导入每部电影的导演和编剧 ===")
    
    batch = []
    for idx, row in df_title_crew.iterrows():
        # Parse comma-separated nconst lists
        directors = str(row.get('directors', '')).split(',') if pd.notna(row.get('directors')) else []
        directors = [d.strip() for d in directors if d.strip() and d.strip() != '\\N']
        
        writers = str(row.get('writers', '')).split(',') if pd.notna(row.get('writers')) else []
        writers = [w.strip() for w in writers if w.strip() and w.strip() != '\\N']
        
        title_crew = TitleCrew(
            tconst=row['tconst'],
            directors=directors if directors else None,
            writers=writers if writers else None,
        )
        batch.append(title_crew)
        
        # 每 1000 条记录批量插入
        if len(batch) >= 1000:
            db.bulk_save_objects(batch)
            db.commit()
            print(f"插入了 {len(batch)} 条导演和编剧")
            batch = []
    
    # 插入剩余的
    if batch:
        db.bulk_save_objects(batch)
        db.commit()
        print(f"插入了 {len(batch)} 条导演和编剧")
    
    print(f"总共导入导演和编剧: {len(df_title_crew)}")


def ingest_title_principals(db: Session, df_title_principals: pd.DataFrame):
    """导入主要演职人员（主演）"""
    print("\n=== 导入主要演职人员 (主演) ===")
    
    batch = []
    for idx, row in df_title_principals.iterrows():
        title_principal = TitlePrincipal(
            tconst=row['tconst'],
            ordering=int(row['ordering']),
            nconst=row['nconst'],
            category=str(row.get('category', '')),
            job=str(row.get('job')) if pd.notna(row.get('job')) and str(row.get('job')) != '\\N' else None,
            characters=str(row.get('characters')) if pd.notna(row.get('characters')) and str(row.get('characters')) != '\\N' else None,
        )
        batch.append(title_principal)
        
        # 每 2000 条记录批量插入 (复合键)
        if len(batch) >= 2000:
            db.bulk_save_objects(batch)
            db.commit()
            print(f"插入了 {len(batch)} 条主要演职人员")
            batch = []
    
    # 插入剩余的
    if batch:
        db.bulk_save_objects(batch)
        db.commit()
        print(f"插入了 {len(batch)} 条主要演职人员")
    
    print(f"总共导入主要演职人员: {len(df_title_principals)}")


def ingest_title_akas(db: Session, df_title_akas: pd.DataFrame):
    """导入电影别名（不同地区/语言）"""
    print("\n=== 导入电影别名 (不同地区/语言) ===")
    
    batch = []
    for idx, row in df_title_akas.iterrows():
        title_aka = TitleAka(
            tconst=row['tconst'],
            ordering=int(row['ordering']),
            title=str(row.get('title', '')),
            region=str(row.get('region')) if pd.notna(row.get('region')) and str(row.get('region')) != '\\N' else None,
            language=str(row.get('language')) if pd.notna(row.get('language')) and str(row.get('language')) != '\\N' else None,
            types=str(row.get('types')) if pd.notna(row.get('types')) and str(row.get('types')) != '\\N' else None,
            attributes=str(row.get('attributes')) if pd.notna(row.get('attributes')) and str(row.get('attributes')) != '\\N' else None,
            is_original_title=int(row.get('isOriginalTitle', 0)) if pd.notna(row.get('isOriginalTitle')) else 0,
        )
        batch.append(title_aka)
        
        # 每 2000 条记录批量插入 (复合键)
        if len(batch) >= 2000:
            db.bulk_save_objects(batch)
            db.commit()
            print(f"插入了 {len(batch)} 条电影别名")
            batch = []
    
    # 插入剩余的
    if batch:
        db.bulk_save_objects(batch)
        db.commit()
        print(f"插入了 {len(batch)} 条电影别名")
    
    print(f"总共导入电影别名: {len(df_title_akas)}")


def ingest_genres(db: Session, df_movies: pd.DataFrame):
    """从电影数据中提取唯一类型并导入到类型表"""
    print("\n=== 导入电影类型 ===")
    
    # 提取所有唯一的电影类型
    all_genres = set()
    for genres_str in df_movies['genres']:
        if pd.notna(genres_str):
            if isinstance(genres_str, str):
                genres = [g.strip() for g in genres_str.split('|') if g.strip()]
            elif isinstance(genres_str, list):
                genres = [g.strip() for g in genres_str if g.strip()]
            else:
                continue
            all_genres.update(genres)
    
    # 过滤掉无效的类型
    all_genres = {g for g in all_genres if g and g != '(no genres listed)'}
    
    print(f"Found {len(all_genres)} unique genres: {sorted(all_genres)}")
    
    # 插入类型
    batch = []
    for genre_name in sorted(all_genres):
        # 检查类型是否已存在
        existing = db.query(Genre).filter(Genre.name == genre_name).first()
        if not existing:
            genre = Genre(name=genre_name)
            batch.append(genre)
    
    if batch:
        db.bulk_save_objects(batch)
        db.commit()
        print(f"Inserted {len(batch)} genres")
    else:
        print("All genres already exist")
    
    return list(all_genres)


def create_test_user(db: Session, email: str = "test@funrec.com", password: str = "test123456"):
    """创建用于开发的测试超级用户（偏好科幻类型）"""
    print("\n=== 创建测试超级用户 ===")
    
    # 检查用户是否已存在
    existing_user = db.query(User).filter(User.email == email).first()
    
    if existing_user:
        print(f"⚠️  用户 {email} 已存在 (user_id={existing_user.user_id})")
        print(f"  超级用户: {'是' if existing_user.is_superuser else '否'}")
        print(f"  偏好类型: {existing_user.preferred_genres}")
        # 如果 preferred_genres 未设置，则更新为科幻类型
        if not existing_user.preferred_genres:
            existing_user.preferred_genres = ["Sci-Fi"]
            db.commit()
            print(f"  更新偏好类型为: {existing_user.preferred_genres}")
        return existing_user
    
    # 创建新的测试超级用户（偏好科幻类型，用于冷启动演示）
    hashed_password = get_password_hash(password)
    
    test_user = User(
        email=email,
        username=email,
        hashed_password=hashed_password,
        gender="M",
        age="25",
        occupation="Engineer",
        preferred_genres=["Sci-Fi"],  # Cold start preference
        is_active=1,
        is_superuser=1  # Superuser for admin operations
    )
    
    db.add(test_user)
    db.commit()
    db.refresh(test_user)
    
    print(f"✓ 测试超级用户创建成功: {email} / {password}")
    print(f"  用户 ID: {test_user.user_id}")
    print(f"  超级用户: 是")
    print(f"  偏好类型: {test_user.preferred_genres}")
    
    return test_user


def main():
    """主导入流程"""
    parser = argparse.ArgumentParser(
        description="将 MovieLens + IMDb 数据导入 PostgreSQL",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument(
        "--reset",
        action="store_true",
        help="删除现有表并重建（警告: 将删除所有数据）"
    )
    parser.add_argument(
        "--skip-ratings",
        action="store_true",
        help="跳过评分数据导入（用于快速测试）"
    )
    parser.add_argument(
        "--create-test-user",
        action="store_true",
        help="导入后创建测试用户账户"
    )
    parser.add_argument(
        "--data-dir",
        type=str,
        default=None,
        help="数据目录路径（默认: 从设置或 /data 获取）"
    )
    
    args = parser.parse_args()
    
    # 数据目录 - 使用正确的路径
    if args.data_dir:
        data_dir = Path(args.data_dir)
    elif os.getenv("FUNREC_RAW_DATA_PATH"):
        data_dir = Path(os.getenv("FUNREC_RAW_DATA_PATH"))
    else:
        data_dir = Path(settings.data_dir)
    
    print("=" * 60)
    print("MovieLens + IMDb 数据导入")
    print("=" * 60)
    print(f"数据目录: {data_dir}")
    print(f"重置数据库: {args.reset}")
    print(f"跳过评分: {args.skip_ratings}")
    print(f"创建测试用户: {args.create_test_user}")
    print("=" * 60)
    
    # 从 pickle 文件加载数据
    print("\n=== 从 pickle 文件加载数据 ===")
    df_movies = load_pickle_file(str(data_dir / "movies.pkl"))
    df_users = load_pickle_file(str(data_dir / "users.pkl"))
    df_ratings = load_pickle_file(str(data_dir / "ratings.pkl"))
    metadata = load_metadata(str(data_dir / "movie_metadata.pkl"))
    
    # 提取元数据 DataFrames
    df_title_ratings = metadata['title_ratings']
    df_name_basics = metadata['name_basics']
    df_title_crew = metadata['title_crew']
    df_title_principals = metadata['title_principals']
    df_title_akas = metadata['title_akas']
    
    # 初始化数据库 (创建表)
    print("\n=== 初始化数据库 ===")
    if args.reset:
        print("⚠️  删除现有表并重建...")
        init_db(drop_existing=True)
        print("✓ 数据库重置完成")
    else:
        print("创建表如果它们不存在...")
        init_db(drop_existing=False)
        print("✓ 数据库初始化完成")
    
    # 创建数据库会话
    db = SessionLocal()
    
    try:
        # 按顺序导入 (遵守外键约束)
        # 1. IMDb 电影评分首先 (用于与电影关联)
        title_ratings_dict = ingest_title_ratings(db, df_title_ratings)
        
        # 2. 用户 (独立表)
        ingest_users(db, df_users)
        
        # 3. 电影 (与 IMDb 评分关联)
        ingest_movies(db, df_movies, title_ratings_dict)
        
        # 4. 评分 (依赖于用户和电影)
        if not args.skip_ratings:
            ingest_ratings(db, df_ratings)
            
            # 5. 从评分更新电影统计数据
            update_movie_statistics(db)
        else:
            print("\n⚠️  跳过评分导入")
        
        # 6. 人物详情 (人物 - 独立表)
        ingest_name_basics(db, df_name_basics)
        
        # 7. 每部电影的导演和编剧 (依赖于电影存在)
        ingest_title_crew(db, df_title_crew)
        
        # 8. 主要演职人员 (主演) (依赖于电影存在)
        ingest_title_principals(db, df_title_principals)
        
        # 9. 电影别名 (不同地区/语言) (依赖于电影存在)
        ingest_title_akas(db, df_title_akas)
        
        # 10. 导入电影类型 (用于用户偏好选择)
        ingest_genres(db, df_movies)
        
        # 11. 创建测试用户 (偏好科幻类型)
        if args.create_test_user:
            create_test_user(db)
        
        print("\n" + "=" * 60)
        print("✅ 导入完成!")
        print("=" * 60)
        print("\n总结:")
        print(f"✓ IMDb 电影评分: {len(df_title_ratings):,} 记录")
        print(f"✓ 用户: {len(df_users):,} 记录")
        print(f"✓ 电影 (与 IMDb 评分关联): {len(df_movies):,} 记录")
        if not args.skip_ratings:
            print(f"✓ 评分 (用户-物品): {len(df_ratings):,} 记录")
            print("✓ 电影统计数据 (计算)")
        print(f"✓ 人物详情: {len(df_name_basics):,} 记录")
        print(f"✓ 每部电影的导演和编剧: {len(df_title_crew):,} 记录")
        print(f"✓ 主要演职人员 (主演): {len(df_title_principals):,} 记录")
        print(f"✓ 电影别名 (不同地区/语言): {len(df_title_akas):,} 记录")
        print("✓ 类型: 可用于用户偏好选择")
        
        if args.create_test_user:
            print("\n📍 测试超级用户创建成功:")
            print("   邮箱: test@funrec.com")
            print("   密码: test123456")
            print("   超级用户: 是 (可以添加电影)")
            print("   偏好类型: Sci-Fi (用于冷启动)")
            print("   前端: http://localhost:3000/login")
            print("   后端: http://localhost:8000/docs")
        
    except Exception as e:
        print(f"\n❌ 导入过程中发生错误: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()

