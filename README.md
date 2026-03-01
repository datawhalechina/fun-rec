<div align=center>
  <img src="imgs/wheat.png" width="100%"/>
  <h3>深度推荐算法实践（小麦书）</h3>
  <p>从级联架构到生成式范式</p>
</div>
<div align="center">

中文 | [English](./README_en.md)

</div>

本书系统介绍了推荐系统从传统级联架构到生成式范式的完整技术演进。内容分为两大板块：上篇覆盖协同过滤、向量召回、序列召回等候选检索技术，以及特征交叉、多目标建模、多场景建模等精排与重排方法；下篇聚焦前沿生成式推荐，涵盖大模型基础、Scaling Law 架构探索、端到端生成式建模、思维链推理与扩散模型推荐等最新范式，并附有完整的生产级系统实战项目。适合具备机器学习基础、希望系统掌握推荐算法核心原理与工程实践的读者。

## 📖 章节目录

**上篇：级联架构**

- **1. 推荐系统概述**
  - 推荐系统是什么？/ 本书概览
- **2. 快速候选召回**
  - 协同过滤：物品CF / 用户CF / 矩阵分解
  - 向量召回：I2I / U2I
  - 序列召回：用户兴趣表示 / 全量兴趣建模与流式索引
- **3. 精准偏好预测**
  - 记忆与泛化
  - 特征交叉：二阶 / 高阶
  - 序列建模：局部激活注意力机制 / 兴趣演化建模 / 行为到会话序列建模
  - 多目标建模：基础结构演进 / 任务依赖建模 / 多目标损失融合
  - 多场景建模：多塔结构 / 动态权重建模
- **4. 重排多样性建模**
  - 基于贪心的重排：最大边际相关性 / 行列式点过程
  - 基于个性化的重排：Transformer重排模型 / 基于排列组合的重排模型

**下篇：生成式范式**

- **5. 生成式推荐基础**
  - 推荐范式的演进：判别式建模 / 生成式核心思想 / 两种范式的本质区别
  - 生成式架构的基石：Transformer / Diffusion模型
  - LLM建模的基本流程：三阶段范式 / 从LLM到生成式推荐
  - 推荐中的Tokenizer技术：范式演进 / 端到端离散化 / 工业级方案 / 核心挑战
- **6. Scaling Law架构探索**
  - HSTU架构演进：Scaling Law首次探索 / 生成式推荐的工程突破 / 混合范式的突破
  - 硬件感知架构设计：Hardware-Aware统一架构 / 统一序列与特征交叉建模
- **7. 端到端生成式建模**
  - OneRec的架构演进：OneRec-V1开创性探索 / OneRec-V2效率与性能突破
  - 查询补全与商品检索：OneSug查询补全生成 / OneSearch商品检索生成
  - 竞价机制与多场景广告：EGA统一竞价与生成 / GPR预训练驱动广告生成
- **8. 会思考的推荐模型**
  - 协同语义与语言语义的统一：物品索引学习 / 语义对齐训练 / PLUM框架
  - OneRec-Think的思考框架：物品对齐 / 推理激活 / 推理增强 / Think-Ahead架构
  - 自主推理的探索：RecZero / RecOne / 未来图景
- **9. 基于扩散的推荐模型**
  - 推荐中的扩散模型基础：Diffusion分类 / 前向加噪与反向去噪 / 训练与采样 / 条件生成
  - 基于扩散的数据增强：DiffuASR序列增强 / Diff-MSR跨场景增强
  - 特征增强与多样性优化：AsymDiffRec特征增强 / DMSG多样性优化
- **10. 生产级推荐系统构建**
  - 项目背景与目标 / 系统架构设计 / 离线流水线 / 在线流程 / 前端与交互 / 部署与运维


为了方便学习和交流，**我们建立了FunRec学习社区（微信群+知识星球）**，微信群方便大家平时日常交流和讨论，知识星球方便沉淀内容，B站上还有一些早期录制的相关视频[跟技术相关的分享内容都放在了B站](https://space.bilibili.com/431850986/channel/collectiondetail?sid=339597)。由于微信群的二维码只有7天内有效，所以直接加下面这个微信，备注：**Fun-Rec**，会被拉到Fun-Rec交流群，如果觉得微信群比较吵建议直接加知识星球！。

<div align=center> 
<img src="imgs/join_community.png" alt="image-20220408193745249" width="400px";" />
</div>


## 致谢
**核心贡献者**

<table border="0">
  <tbody>
    <tr align="center" >
      <td>
         <a href="https://github.com/ruyiluo"><img width="70" height="70" src="https://github.com/ruyiluo.png?s=40" alt="pic"></a><br>
         <a href="https://github.com/ruyiluo">Ruyi Luo</a> 
        <p><br> 西安电子科技大学硕士 <br> 推荐算法工程师 </p>
      </td>
      <td>
         <a href="https://github.com/bokang-ugent"><img width="70" height="70" src="https://github.com/bokang-ugent.png?s=40" alt="pic"></a><br>
         <a href="https://bokang.io">Bo Kang</a> 
        <p><br> 比利时根特大学访问教授 <br> nobl.ai 联合创始人 </p>
      </td>
    </tr>
  </tbody>
</table>

特别感谢[kenken-xr](https://github.com/kenken-xr)、[swallown1](https://github.com/swallown1)、[Lyons-T](https://github.com/Lyons-T)、[zhongqiangwu960812](https://github.com/zhongqiangwu960812)、[@wangych6](https://github.com/wangych6)、[@morningsky](https://github.com/morningsky)、[@hilbert-yaa](https://github.com/hilbert-yaa)、[@maxxbaba](https://github.com/maxxbaba)、[@pearfl](https://github.com/pearfl)、[@ChungKingExpress](https://github.com/ChungKingExpress)、[@storyandwine](https://github.com/storyandwine)、[@SYC1123](https://github.com/SYC1123)、[@luzixiao](https://github.com/luzixiao)、[@Evan-wyl](https://github.com/Evan-wyl)、[@Sm1les](https://github.com/Sm1les)、[@LSGOMYP](https://github.com/LSGOMYP)等人早期对本项目的帮助与支持。


## 关注我们
<div align=center>
<p>扫描下方二维码关注公众号：Datawhale</p>
<img src="imgs/datawhale_qrcode.jpg" width = "180" height = "180">
</div>

Datawhale，一个专注于AI领域的学习圈子。初衷是for the learner，和学习者一起成长。目前加入学习社群的人数已经数千人，组织了机器学习，深度学习，数据分析，数据挖掘，爬虫，编程，统计学，Mysql，数据竞赛等多个领域的内容学习，微信搜索公众号Datawhale可以加入我们。


## LICENSE
<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="知识共享许可协议" style="border-width:0" src="https://img.shields.io/badge/license-CC%20BY--NC--SA%204.0-lightgrey" /></a>
本作品采用<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议</a>进行许可。
