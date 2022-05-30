# 前言

在自然语言处理（NLP）领域，谷歌提出的 Word2Vec 模型是学习词向量表示的重要方法。其中，带有负采样（SGNS，Skip-gram with negative sampling）的 Skip-Gram 神经词向量模型在当时被证明是最先进的方法之一。各位读者需要自行了解 Word2Vec 中的 Skip-Gram 模型，本文只会做简单介绍。

在论文 Item2Vec：Neural Item Embedding for Collaborative Filtering 中，作者受到 SGNS 的启发，提出了名为 Item2Vec 的方法来生成物品的向量表示，然后将其用于基于物品的协同过滤。

# 基于负采样的 Skip-Gram 模型

Skip-Gram 模型的思想很简单：给定一个句子  $(w_i)^K_{i=1}$，然后基于中心词来预测它的上下文。目标函数如下：
$$
\frac{1}{K} \sum_{i=1}^{K} \sum_{-c \leq j \leq c, j \neq 0} \log p\left(w_{i+j} \mid w_{i}\right)
$$

+ 其中，$c$ 表示上下文的窗口大小；$w_i$ 表示中心词；$w_{i+j}$ 表示上下文。

+ 表达式中的概率 $p\left(w_{j} \mid w_{i}\right)$ 的公式为：
  $$
  p\left(w_{j} \mid w_{i}\right)=\frac{\exp \left(u_{i}^{T} v_{j}\right)}{\sum_{k \in I_{W}} \exp \left(u_{i}^{T} v_{k}^{T}\right)}
  $$

  + $u_{i} \in U\left(\subset \mathbb{R}^{m}\right),v_{i} \in V\left(\subset \mathbb{R}^{m}\right)$，分别对应中心和上下文词的 Embedding 特征表示。
  + 这里的意思是每个单词有2个特征表示，作为中心词 $u_i$ 和上下文 $v_i$ 时的特征表示不一样。
  + $I_{W} \triangleq\{1, \ldots,|W|\}$  ，$|W|$ 表示语料库中词的数量。

简单来理解一下 Skip-Gram 模型的表达式：

+ 对于句子中的某个词 $w_i$，当其作为中心词时，希望尽可能准确预测它的上下文。
+ 我们可以将其转换为多分类问题：
  + 对于中心词 $w_i$ 预测的上下文 $w_j$，其 $label=1$ ；那么，模型对上下文的概率预测 $p\left(w_{j} \mid w_{i}\right)$  越接近1越好。
  + 若要 $p\left(w_{j} \mid w_{i}\right)$ 接近1，对于分母项中的 $k\ne j$，其 $\exp \left(u_{i}^{T} v_{k}^{T}\right)$ 越小越好（等价于将其视为了负样本）。


注意到分母项，由于需要遍历语料库中所有的单词，从而导致计算成本过高。一种解决办法是基于负采样（NEG）的方式来降低计算复杂度：
$$
p\left(w_{j} \mid w_{i}\right)=\sigma\left(u_{i}^{T} v_{j}\right) \prod_{k=1}^{N} \sigma\left(-u_{i}^{T} v_{k}\right)
$$

+ 其中，$\sigma(x)=1/1+exp(-x)$，$N$ 表示负样本的数量。

其它细节：

+ 单词 $w$ 作为负样本时，被采样到的概率：
  $$
  \frac{[\operatorname{counter}(w)]^{0.75}}{\sum_{u \in \mathcal{W}}[\operatorname{counter}(u)]^{0.75}}
  $$

+ 单词 $w$ 作为中心词时，被丢弃的概率：
  $$
  \operatorname{prob}(w)=1-\sqrt{\frac{t}{f(w)}}
  $$
  

# Item2Vec模型

Item2Vec 的原理十分十分简单，它是基于 Skip-Gram 模型的物品向量训练方法。但又存在一些区别，如下：

+ 词向量的训练是基于句子序列（sequence），但是物品向量的训练是基于物品集合（set）。
+ 因此，物品向量的训练丢弃了空间、时间信息。

Item2Vec 论文假设对于一个集合的物品，它们之间是相似的，与用户购买它们的顺序、时间无关。当然，该假设在其他场景下不一定使用，但是原论文只讨论了该场景下它们实验的有效性。由于忽略了空间信息，原文将共享同一集合的每对物品视为正样本。目标函数如下：
$$
\frac{1}{K} \sum_{i=1}^{K} \sum_{j \neq i}^{K} \log p\left(w_{j} \mid w_{i}\right)
$$

+ 对于窗口大小 $K$，由设置的决定。

在 Skip-Gram 模型中，提到过每个单词 $w_i$ 有2个特征表示。在 Item2Vec 中同样如此，论文中是将物品的中心词向量 $u_i$ 作为物品的特征向量。作者还提到了其他两种方式来表示物品向量：

+ **add**：$u_i + v_i$
+ **concat**：$\left[u_{i}^{T} v_{i}^{T}\right]^{T}$

原文还补充到，这两种方式有时候会有很好的表现。

# 总结

+ Item2Vec 的原理很简单，就是基于 Word2Vec 的 Skip-Gram 模型，并且还丢弃了时间、空间信息。
+ 基于 Item2Vec 得到物品的向量表示后，物品之间的相似度可由二者之间的余弦相似度计算得到。
+ 可以看出，Item2Vec 在计算物品之间相似度时，仍然依赖于不同物品之间的共现。因为，其无法解决物品的冷启动问题。
  + 一种解决方法：取出与冷启物品类别相同的非冷启物品，将它们向量的均值作为冷启动物品的向量表示。

原论文链接：[[1603.04259\] Item2Vec: Neural Item Embedding for Collaborative Filtering (arxiv.org)](https://arxiv.org/abs/1603.04259)

































