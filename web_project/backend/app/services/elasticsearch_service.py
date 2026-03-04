"""Elasticsearch 电影搜索服务"""

from typing import List, Dict, Optional
from elasticsearch import Elasticsearch, AsyncElasticsearch
from elasticsearch.helpers import async_bulk
import logging

from app.config import settings

logger = logging.getLogger(__name__)


class ElasticsearchService:
    """Elasticsearch 操作服务"""
    
    INDEX_NAME = "movies"
    
    # 电影索引映射配置
    INDEX_MAPPING = {
        "settings": {
            "number_of_shards": 1,
            "number_of_replicas": 0,
            "analysis": {
                "analyzer": {
                    "movie_analyzer": {
                        "type": "custom",
                        "tokenizer": "standard",
                        "filter": ["lowercase", "asciifolding"]
                    }
                }
            }
        },
        "mappings": {
            "properties": {
                "movie_id": {"type": "integer"},
                "title": {
                    "type": "text",
                    "analyzer": "movie_analyzer",
                    "fields": {
                        "keyword": {"type": "keyword"},
                        "suggest": {
                            "type": "completion"
                        }
                    }
                },
                "year": {"type": "integer"},
                "genres": {
                    "type": "keyword"
                },
                "description": {
                    "type": "text",
                    "analyzer": "movie_analyzer"
                },
                "imdb_id": {"type": "keyword"},
                "avg_rating": {"type": "float"},
                "imdb_rating": {"type": "float"},
                "rating_count": {"type": "integer"},
                "imdb_votes": {"type": "integer"},
                "runtime_minutes": {"type": "integer"},
                "title_type": {"type": "keyword"}
            }
        }
    }
    
    def __init__(self):
        """初始化 Elasticsearch 客户端"""
        try:
            self.client = Elasticsearch(
                [settings.elasticsearch_url],
                verify_certs=False,
                max_retries=3,
                retry_on_timeout=True
            )
            # 测试连接
            if self.client.ping():
                logger.info(f"✓ 已连接到 Elasticsearch: {settings.elasticsearch_url}")
            else:
                logger.warning(f"⚠ 无法连接到 Elasticsearch: {settings.elasticsearch_url}")
        except Exception as e:
            logger.error(f"✗ Elasticsearch 连接错误: {e}")
            self.client = None
    
    def is_available(self) -> bool:
        """检查 Elasticsearch 是否可用"""
        if not self.client:
            return False
        try:
            return self.client.ping()
        except:
            return False
    
    async def create_index(self, delete_existing: bool = False) -> bool:
        """使用正确的映射创建电影索引"""
        if not self.is_available():
            logger.warning("Elasticsearch 不可用，跳过索引创建")
            return False
        
        try:
            # 如果请求，删除已存在的索引
            if delete_existing and self.client.indices.exists(index=self.INDEX_NAME):
                self.client.indices.delete(index=self.INDEX_NAME)
                logger.info(f"已删除现有索引: {self.INDEX_NAME}")
            
            # 如果索引不存在则创建
            if not self.client.indices.exists(index=self.INDEX_NAME):
                self.client.indices.create(index=self.INDEX_NAME, body=self.INDEX_MAPPING)
                logger.info(f"✓ 已创建索引: {self.INDEX_NAME}")
                return True
            else:
                logger.info(f"索引已存在: {self.INDEX_NAME}")
                return True
        except Exception as e:
            logger.error(f"✗ 创建索引错误: {e}")
            return False
    
    def index_movie(self, movie_data: Dict) -> bool:
        """索引单部电影"""
        if not self.is_available():
            return False
        
        try:
            doc = {
                "movie_id": movie_data.get("movie_id"),
                "title": movie_data.get("title"),
                "year": movie_data.get("year"),
                "genres": movie_data.get("genres", []),
                "description": movie_data.get("description"),
                "imdb_id": movie_data.get("imdb_id"),
                "avg_rating": movie_data.get("avg_rating"),
                "imdb_rating": movie_data.get("imdb_rating"),
                "rating_count": movie_data.get("rating_count", 0),
                "imdb_votes": movie_data.get("imdb_votes"),
                "runtime_minutes": movie_data.get("runtime_minutes"),
                "title_type": movie_data.get("title_type")
            }
            
            self.client.index(
                index=self.INDEX_NAME,
                id=movie_data["movie_id"],
                document=doc
            )
            logger.debug(f"已索引电影: {movie_data['title']} (ID: {movie_data['movie_id']})")
            return True
        except Exception as e:
            logger.error(f"✗ 索引电影错误 {movie_data.get('movie_id')}: {e}")
            return False
    
    def bulk_index_movies(self, movies: List[Dict]) -> bool:
        """批量索引多部电影"""
        if not self.is_available():
            return False
        
        try:
            actions = []
            for movie in movies:
                doc = {
                    "_index": self.INDEX_NAME,
                    "_id": movie["movie_id"],
                    "_source": {
                        "movie_id": movie.get("movie_id"),
                        "title": movie.get("title"),
                        "year": movie.get("year"),
                        "genres": movie.get("genres", []),
                        "description": movie.get("description"),
                        "imdb_id": movie.get("imdb_id"),
                        "avg_rating": movie.get("avg_rating"),
                        "imdb_rating": movie.get("imdb_rating"),
                        "rating_count": movie.get("rating_count", 0),
                        "imdb_votes": movie.get("imdb_votes"),
                        "runtime_minutes": movie.get("runtime_minutes"),
                        "title_type": movie.get("title_type")
                    }
                }
                actions.append(doc)
            
            from elasticsearch.helpers import bulk
            success, failed = bulk(self.client, actions, stats_only=False, raise_on_error=False)
            logger.info(f"✓ 批量索引 {success} 部电影，{len(failed)} 部失败")
            return True
        except Exception as e:
            logger.error(f"✗ 批量索引电影错误: {e}")
            return False
    
    def search_movies(
        self,
        query: str,
        limit: int = 20,
        min_score: float = 0.1
    ) -> List[Dict]:
        """
        多字段搜索电影
        
        Args:
            query: 搜索查询字符串
            limit: 最大结果数量
            min_score: 最小相关性分数
        
        Returns:
            带分数的电影字典列表
        """
        if not self.is_available():
            logger.warning("Elasticsearch 不可用")
            return []
        
        if not query or not query.strip():
            return []
        
        try:
            # 带权重提升的多字段搜索
            search_query = {
                "bool": {
                    "should": [
                        # 精确标题匹配（最高优先级）
                        {
                            "match_phrase": {
                                "title": {
                                    "query": query,
                                    "boost": 10.0
                                }
                            }
                        },
                        # 标题前缀匹配（高优先级）
                        {
                            "match_phrase_prefix": {
                                "title": {
                                    "query": query,
                                    "boost": 5.0
                                }
                            }
                        },
                        # 标题模糊匹配（中优先级）
                        {
                            "match": {
                                "title": {
                                    "query": query,
                                    "fuzziness": "AUTO",
                                    "boost": 3.0
                                }
                            }
                        },
                        # 类型匹配（中优先级）
                        {
                            "match": {
                                "genres": {
                                    "query": query,
                                    "boost": 2.0
                                }
                            }
                        },
                        # 简介匹配（低优先级）
                        {
                            "match": {
                                "description": {
                                    "query": query,
                                    "fuzziness": "AUTO",
                                    "boost": 1.0
                                }
                            }
                        }
                    ],
                    "minimum_should_match": 1
                }
            }
            
            response = self.client.search(
                index=self.INDEX_NAME,
                query=search_query,
                size=limit,
                min_score=min_score,
                _source=True
            )
            
            results = []
            for hit in response["hits"]["hits"]:
                movie = hit["_source"]
                movie["score"] = hit["_score"]
                results.append(movie)
            
            logger.info(f"搜索 '{query}' 返回 {len(results)} 条结果")
            return results
        except Exception as e:
            logger.error(f"✗ 搜索查询 '{query}' 错误: {e}")
            return []
    
    def delete_movie(self, movie_id: int) -> bool:
        """从索引中删除电影"""
        if not self.is_available():
            return False
        
        try:
            self.client.delete(index=self.INDEX_NAME, id=movie_id)
            logger.debug(f"已从索引中删除电影: {movie_id}")
            return True
        except Exception as e:
            logger.error(f"✗ 删除电影 {movie_id} 错误: {e}")
            return False
    
    def update_movie(self, movie_id: int, movie_data: Dict) -> bool:
        """更新索引中的电影"""
        if not self.is_available():
            return False
        
        try:
            doc = {
                "title": movie_data.get("title"),
                "year": movie_data.get("year"),
                "genres": movie_data.get("genres", []),
                "description": movie_data.get("description"),
                "avg_rating": movie_data.get("avg_rating"),
                "imdb_rating": movie_data.get("imdb_rating"),
                "rating_count": movie_data.get("rating_count", 0),
                "imdb_votes": movie_data.get("imdb_votes"),
            }
            
            self.client.update(
                index=self.INDEX_NAME,
                id=movie_id,
                doc=doc
            )
            logger.debug(f"已更新索引中的电影: {movie_id}")
            return True
        except Exception as e:
            logger.error(f"✗ 更新电影 {movie_id} 错误: {e}")
            return False


# 全局实例
es_service = ElasticsearchService()

