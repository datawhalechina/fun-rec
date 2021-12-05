# 项目环境

**pythonh环境**
1. 安装conda环境
2. 创建conda虚拟环境: conda create -n news_rec_py3 python==3.8
3. 安装依赖文件: pip install -r requirements.txt

**ubuntu数据库环境**
1. 参考 2.2.1.1 Mysql基础
2. 参考 2.2.1.2 MongoDB基础
3. 参考 2.2.1.3 Redis基础

**ubuntu前端环境配置**
1. 安装node, 推荐安装v8.17.0版本(已经放到了项目目录中)
2. 安装前端环境依赖:
    1. 跳转到前端项目文件目录：cd $HOME/fun-rec/codes/news_recsys/news_rec_web/Vue-newsinfo
    2. 命令行运行：npm install

# 项目启动

**启动后端服务**
1. 跳转到后端项目文件目录: cd $HOME/fun-rec/codes/news_recsys/news_rec_server
2. 启动后端服务: python server.py 

**启动前端服务**
1. 跳转到前端项目文件目录：cd $HOME/fun-rec/codes/news_recsys/news_rec_web/Vue-newsinfo
2. 启动前端服务：npm run dev
3. 访问地址`http://localhost:3000`