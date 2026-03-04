"""
将数据库中的电影索引到 Elasticsearch 的脚本

使用方法:
    python scripts/index_movies_elasticsearch.py [--recreate-index] [--batch-size 1000]

选项:
    --recreate-index    索引前删除并重建 Elasticsearch 索引
    --batch-size N      每批索引的电影数量（默认: 1000）
"""

import sys
import argparse
from pathlib import Path

# 添加父目录到路径以导入 app 模块
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import settings
from app.models import Movie
from app.services.elasticsearch_service import es_service


def index_movies(recreate_index: bool = False, batch_size: int = 1000):
    """将数据库中的所有电影索引到 Elasticsearch"""
    
    print("=" * 60)
    print("Elasticsearch 电影索引脚本")
    print("=" * 60)
    
    # 检查 Elasticsearch 连接
    if not es_service.is_available():
        print("✗ 错误: Elasticsearch 不可用!")
        print(f"  请确保 Elasticsearch 在以下地址运行: {settings.elasticsearch_url}")
        print("  可以使用以下命令启动: docker-compose up elasticsearch")
        return False
    
    print(f"✓ 已连接到 Elasticsearch: {settings.elasticsearch_url}")
    
    # 创建或重建索引
    if recreate_index:
        print("\n📝 重建 Elasticsearch 索引...")
        success = es_service.create_index(delete_existing=True)
        if not success:
            print("✗ 创建索引失败")
            return False
    else:
        print("\n📝 确保索引存在...")
        success = es_service.create_index(delete_existing=False)
        if not success:
            print("✗ 创建索引失败")
            return False
    
    # 连接数据库
    print(f"\n🗄️  连接数据库...")
    print(f"   {settings.database_url.split('@')[1] if '@' in settings.database_url else settings.database_url}")
    
    try:
        engine = create_engine(settings.database_url)
        SessionLocal = sessionmaker(bind=engine)
        db = SessionLocal()
    except Exception as e:
        print(f"✗ 数据库连接错误: {e}")
        return False
    
    print("✓ 已连接到数据库")
    
    # 获取电影总数
    try:
        total_movies = db.query(Movie).count()
        print(f"\n📊 数据库中找到 {total_movies:,} 部电影")
    except Exception as e:
        print(f"✗ 统计电影数量错误: {e}")
        db.close()
        return False
    
    if total_movies == 0:
        print("⚠️  没有电影需要索引")
        db.close()
        return True
    
    # 分批索引电影
    print(f"\n🔄 索引电影中（批大小: {batch_size}）...")
    print("-" * 60)
    
    indexed_count = 0
    failed_count = 0
    
    try:
        # 分批处理
        for offset in range(0, total_movies, batch_size):
            movies = db.query(Movie).offset(offset).limit(batch_size).all()
            
            # 转换为 Elasticsearch 的字典格式
            movie_docs = []
            for movie in movies:
                doc = {
                    "movie_id": movie.movie_id,
                    "title": movie.title,
                    "year": movie.year,
                    "genres": movie.genres or [],
                    "description": movie.description,
                    "imdb_id": movie.imdb_id,
                    "avg_rating": movie.avg_rating,
                    "imdb_rating": movie.imdb_rating,
                    "rating_count": movie.rating_count or 0,
                    "imdb_votes": movie.imdb_votes,
                    "runtime_minutes": movie.runtime_minutes,
                    "title_type": movie.title_type
                }
                movie_docs.append(doc)
            
            # 批量索引
            success = es_service.bulk_index_movies(movie_docs)
            
            if success:
                indexed_count += len(movies)
                progress = (indexed_count / total_movies) * 100
                print(f"  进度: {indexed_count:,}/{total_movies:,} ({progress:.1f}%)")
            else:
                failed_count += len(movies)
                print(f"  ⚠️  在偏移量 {offset} 处批量索引失败")
        
        print("-" * 60)
        print(f"\n✅ 索引完成!")
        print(f"   成功索引: {indexed_count:,} 部电影")
        if failed_count > 0:
            print(f"   失败: {failed_count:,} 部电影")
        
        return True
        
    except Exception as e:
        print(f"\n✗ 索引过程中出错: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        db.close()


def main():
    """主函数"""
    parser = argparse.ArgumentParser(
        description="将数据库中的电影索引到 Elasticsearch",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument(
        "--recreate-index",
        action="store_true",
        help="索引前删除并重建 Elasticsearch 索引"
    )
    parser.add_argument(
        "--batch-size",
        type=int,
        default=1000,
        help="每批索引的电影数量（默认: 1000）"
    )
    
    args = parser.parse_args()
    
    # 运行索引
    success = index_movies(
        recreate_index=args.recreate_index,
        batch_size=args.batch_size
    )
    
    if success:
        print("\n" + "=" * 60)
        print("🎉 所有电影已索引! 现在可搜索.")
        print("=" * 60)
        sys.exit(0)
    else:
        print("\n" + "=" * 60)
        print("❌ 索引失败. 请检查上面的错误.")
        print("=" * 60)
        sys.exit(1)


if __name__ == "__main__":
    main()

