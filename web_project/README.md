# FunRec Recsys

一个完整的电影推荐系统示例项目，涵盖离线训练、在线服务、前端展示的全流程实现。基于 MovieLens-1M 数据集构建。

**核心特性**：
- **多路召回**：YoutubeDNN 向量召回 + I2I 相似度召回 + 偏好类目召回，Snake Merge 融合
- **精准排序**：DeepFM 点击率预测模型
- **冷启动处理**：UCB 类型探索算法，平衡探索与利用
- **多样性重排**：类型/年代连续打散，避免信息茧房
- **完整工程链路**：特征工程 → 模型训练 → 在线服务 → 前端交互


## 功能概览

**前端**：首页推荐、电影详情、搜索、用户认证、个人中心

**离线流水线** (`backend/offline/`)：
- 特征工程 → 召回模型训练（YoutubeDNN）→ 排序模型训练（DeepFM）
- 模型部署（本地目录）→ 特征上线（Redis）

**在线流水线** (`backend/online/`)：
- 冷启动检测 → 多路召回（YoutubeDNN + I2I + 偏好类目）→ 精排（DeepFM）→ 重排（打散）→ 结果组装

**存储**：PostgreSQL（业务数据）、Redis（特征缓存）、Elasticsearch（搜索索引）

## 本地运行
### 1. 下载数据[funrec-movielens-1m.zip](https://funrec-datasets.s3.eu-west-3.amazonaws.com/funrec-movielens-1m.zip)并且解压，记录数据绝对路径

### 2. 复制.env.example为.env，并设置数据绝对路径`FUNREC_RAW_DATA_PATH`为第一步记录的数据绝对路径。`FUNREC_PROCESSED_DATA_PATH`为处理后的数据的缓存**绝对路径**，自由设置。

### 3. 运行infra
```bash
docker compose up --build
```

### 4. 加载数据
* 安装 [uv 包管理器](https://docs.astral.sh/uv/getting-started/installation/)
* 进入 backend 目录
```bash
cd backend
```

* 同步依赖（需要 Python 3.11，因为 TensorFlow 2.15 仅支持该版本）
```bash
uv sync --python 3.11
```

* 加载数据到数据库
```bash
make ingest-data-to-database
```
此命令会：
1. **重建表结构**：删除并重新创建所有数据库表
2. **导入核心数据**：
   - 用户数据（~6000 用户，含性别、年龄、职业等）
   - 电影数据（~4000 部电影，含类型、年份、IMDb 评分等）
   - 评分数据（~100 万条用户-电影评分记录）
3. **导入 IMDb 元数据**：演员、导演、编剧、别名等
4. **计算统计信息**：基于评分数据更新每部电影的平均分和评分数
5. **创建测试用户**：`test@funrec.com` / `test123456`（管理员权限，偏好 Sci-Fi）

* 索引电影到 Elasticsearch（支持搜索功能）
```bash
make index-movies-to-elasticsearch
```
此命令会：
1. 连接 Elasticsearch 并创建索引（如不存在）
2. 从 PostgreSQL 读取所有电影数据
3. 批量写入 Elasticsearch（含标题、类型、年份、评分等字段）
4. 完成后即可使用前端搜索功能

* 运行离线 pipeline（特征处理、模型训练、部署上线）
```bash
make run-offline-pipeline
```
此命令会按顺序执行以下步骤：

| 步骤 | 说明 | 代码 |
|------|------|------|
| **1. 召回特征处理** | 构建用户行为序列、编码类别特征 | `offline/feature/preprocess_retrieval.py` |
| **2. 排序特征处理** | 构建正负样本（困难负样本+随机负样本） | `offline/feature/preprocess_ranking.py` |
| **3. 召回模型训练** | 训练 YoutubeDNN 双塔模型 | `offline/training/train_retrieval.py` |
| **4. 排序模型训练** | 训练 DeepFM 点击率预测模型 | `offline/training/train_ranking.py` |
| **5. 特征上线** | 写入 Redis：用户画像、行为历史、偏好类目 | `offline/storage/redis_ingest.py` |
| **6. 模型部署** | 部署到本地共享目录：模型文件、向量、词表 | `offline/storage/local_deploy.py` |

> 首次运行约需 5-10 分钟（含模型训练），后续可通过 `--steps` 参数单独运行某个步骤

### 5. 检查服务是否正常运行

* 检查后端
```bash
curl http://localhost:8000/health
```

* elasticsearch
```bash
curl http://localhost:9200
```

* 检查数据库
```bash
docker exec -it funrec-postgres pg_isready -U funrec
```

### 6. 访问前端
```bash
http://localhost:3000
```
测试用户
- Email: test@funrec.com
- Password: test123456


## 测试

```bash
cd backend
uv sync --python 3.11 --extra dev
make test
```
