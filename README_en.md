<div align=center>
  <img src="imgs/wheat.png" width="100%"/>
  <h3>Deep Recommendation Algorithms in Practice（wheat-book）</h3>
  <p>From Cascade Architecture to Generative Paradigm</p>
</div>
<div align="center">

English | [中文](./README.md)

</div>

This book systematically covers the full technical evolution of recommendation systems, from classical cascade architectures to the generative paradigm. It is organized into two parts: the first covers candidate retrieval techniques including collaborative filtering, embedding-based retrieval, and sequential retrieval, along with ranking and re-ranking methods such as feature crossing, multi-objective modeling, and multi-scenario modeling; the second focuses on frontier generative recommendation, encompassing LLM foundations, Scaling Law architecture exploration, end-to-end generative modeling, chain-of-thought reasoning, and diffusion-based recommendation, culminating in a hands-on production-grade system project. Ideal for readers with a machine learning background who want to systematically master both the theory and engineering practice of recommendation algorithms.

## 📖 Table of Contents

**Part I: Cascade Architecture**

- **1. Introduction to Recommendation Systems**
  - What is a Recommendation System? / Book Overview
- **2. Fast Candidate Retrieval**
  - Collaborative Filtering: Item-based CF / User-based CF / Matrix Factorization
  - Embedding-based Retrieval: I2I / U2I
  - Sequential Retrieval: User Interest Representation / Full-history Modeling & Streaming Index
- **3. Precise Preference Prediction**
  - Memorization & Generalization
  - Feature Crossing: 2nd-order / Higher-order
  - Sequential Modeling: Local Activation Attention / Interest Evolution Modeling / Behavior-to-Session Modeling
  - Multi-objective Modeling: Architecture Evolution / Task Dependency Modeling / Multi-loss Optimization
  - Multi-scenario Modeling: Multi-tower Architecture / Dynamic Weight Modeling
- **4. Re-ranking & Diversity Modeling**
  - Greedy-based Re-ranking: Maximum Marginal Relevance / Determinantal Point Process
  - Personalized Re-ranking: Transformer Re-ranking Model / Permutation-based Re-ranking Model

**Part II: Generative Paradigm**

- **5. Foundations of Generative Recommendation**
  - Evolution of Recommendation Paradigms: Discriminative Modeling / Generative Core Ideas / Essential Differences
  - Building Blocks of Generative Architectures: Transformer / Diffusion Models
  - Fundamentals of LLM Modeling: Three-stage Paradigm / From LLM to Generative Recommendation
  - Tokenizer Techniques for Recommendation: Paradigm Evolution / End-to-end Discretization / Industrial Solutions / Key Challenges
- **6. Scaling Law Architecture Exploration**
  - HSTU Architecture Evolution: First Scaling Law Exploration / Engineering Breakthrough / Hybrid Paradigm Breakthrough
  - Hardware-aware Architecture Design: HW-Aware Unified Architecture / Unified Sequence & Feature Interaction Modeling
- **7. End-to-End Generative Modeling**
  - OneRec Architecture Evolution: OneRec-V1 Pioneering Exploration / OneRec-V2 Efficiency & Performance Breakthrough
  - Query Completion & Product Retrieval: OneSug Query Completion / OneSearch Product Retrieval
  - Auction Mechanisms & Multi-scenario Advertising: EGA Unified Auction & Generation / GPR Pretrained Ad Generation
- **8. Reasoning-enhanced Recommendation**
  - Unifying Collaborative and Linguistic Semantics: Item Index Learning / Semantic Alignment Training / PLUM Framework
  - OneRec-Think Reasoning Framework: Item Alignment / Reasoning Activation / Reasoning Enhancement / Think-Ahead Architecture
  - Exploration of Autonomous Reasoning: RecZero / RecOne / Future Directions
- **9. Diffusion-based Recommendation**
  - Fundamentals of Diffusion Models: Diffusion Taxonomy / Forward Noising & Reverse Denoising / Training & Sampling / Conditional Generation
  - Diffusion-based Data Augmentation: DiffuASR Sequential Augmentation / Diff-MSR Cross-scenario Augmentation
  - Feature Enhancement & Diversity Optimization: AsymDiffRec Feature Enhancement / DMSG Diversity Optimization
- **10. Production-grade Recommendation System**
  - Project Background & Goals / System Architecture Design / Offline Pipeline / Online Pipeline / Frontend & Interaction / Deployment & Operations

We also establish a **FunRec learning community (WeChat group + knowledge planet)**, where the WeChat group is convenient for daily communication and discussion, and the knowledge planet is convenient for content retention. Some early recorded videos related to technology are also on Bilibili [All technical sharing content is on Bilibili](https://space.bilibili.com/431850986/channel/collectiondetail?sid=339597). Since the WeChat group's QR code is only valid for 7 days, just add the following WeChat Code, with remark: **Fun-Rec**, you will be added into a Fun-Rec discussion group. If you think the WeChat group is too noisy, it is recommended to add the knowledge planet directly!

<div align=center> 
<img src="imgs/join_community.png" alt="image-20220408193745249" width="400px";" />
</div>


## Thanks
**Core Contributors**

<table border="0">
  <tbody>
    <tr align="center" >
      <td>
         <a href="https://github.com/ruyiluo"><img width="70" height="70" src="https://github.com/ruyiluo.png?s=40" alt="pic"></a><br>
         <a href="https://github.com/ruyiluo">Ruyi Luo</a> 
        <p><br> MSc, Xidian University <br> Senior Recommendation Algorithm Engineer </p>
      </td>
      <td>
         <a href="https://github.com/bokang-ugent"><img width="70" height="70" src="https://github.com/bokang-ugent.png?s=40" alt="pic"></a><br>
         <a href="https://bokang.io">Bo Kang</a> 
        <p><br> Visiting Professor, Ghent University <br> Co-founder of nobl.ai </p>
      </td>
    </tr>
  </tbody>
</table>

Special thanks to [kenken-xr](https://github.com/kenken-xr)、[swallown1](https://github.com/swallown1)、[Lyons-T](https://github.com/Lyons-T)、[zhongqiangwu960812](https://github.com/zhongqiangwu960812)、[@wangych6](https://github.com/wangych6)、[@morningsky](https://github.com/morningsky)、[@hilbert-yaa](https://github.com/hilbert-yaa)、[@maxxbaba](https://github.com/maxxbaba)、[@pearfl](https://github.com/pearfl)、[@ChungKingExpress](https://github.com/ChungKingExpress)、[@storyandwine](https://github.com/storyandwine)、[@SYC1123](https://github.com/SYC1123)、[@luzixiao](https://github.com/luzixiao)、[@Evan-wyl](https://github.com/Evan-wyl)、[@Sm1les](https://github.com/Sm1les)、[@LSGOMYP](https://github.com/LSGOMYP) for their early help and support to this project.


## Follow Us
<div align=center>
<p>Scan the QR code below to follow the Datawhale Official Account</p>
<img src="imgs/datawhale_qrcode.jpg" width = "180" height = "180">
</div>

Datawhale, a learning community focused on the field of AI. Our mission is for the learner, and grow together with learners. Currently, there are thousands of people have joined the learning community, and we have organized learning in various fields such as machine learning, deep learning, data analysis, data mining, web crawling, programming, statistics, MySQL, and data competitions. You can join us by searching for the Datawhale Official Account on WeChat.


## LICENSE
<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://img.shields.io/badge/license-CC%20BY--NC--SA%204.0-lightgrey" /></a>
This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA 4.0)</a>.
