### FM模型的引入

#### 逻辑回归模型及其缺点

FM模型其实是一种思路，具体的应用稍少。一般来说做推荐CTR预估时最简单的思路就是将特征做线性组合（逻辑回归LR），传入sigmoid中得到一个概率值，本质上这就是一个线性模型，因为sigmoid是单调增函数不会改变里面的线性模型的CTR预测顺序，因此逻辑回归模型效果会比较差。也就是LR的缺点有：

* 是一个线性模型
* 每个特征对最终输出结果独立，需要手动特征交叉（$x_i*x_j$），比较麻烦

<br>

#### 二阶交叉项的考虑及改进

由于LR模型的上述缺陷（主要是手动做特征交叉比较麻烦），干脆就考虑所有的二阶交叉项，也就是将目标函数由原来的

$$
y = w_0+\sum_{i=1}^nw_ix_i
$$
变为

$$
y = w_0+\sum_{i=1}^nw_ix_i+\sum_{i=1}^{n-1}\sum_{i+1}^nw_{ij}x_ix_j
$$
但这个式子有一个问题，**只有当$x_i$与$x_j$均不为0时这个二阶交叉项才会生效**，后面这个特征交叉项本质是和多项式核SVM等价的，为了解决这个问题，我们的FM登场了！

FM模型使用了如下的优化函数：

$$
y = w_0+\sum_{i=1}^nw_ix_i+\sum_{i=1}^{n}\sum_{i+1}^n\lt v_i,v_j\gt x_ix_j
$$
事实上做的唯一改动就是把$w_{ij}$替换成了$\lt v_i,v_j\gt$，大家应该就看出来了，这实际上就有深度学习的意味在里面了，实质上就是给每个$x_i$计算一个embedding，然后将两个向量之间的embedding做内积得到之前所谓的$w_{ij}$好处就是这个模型泛化能力强 ，即使两个特征之前从未在训练集中**同时**出现，我们也不至于像之前一样训练不出$w_{ij}$，事实上只需要$x_i$和其他的$x_k$同时出现过就可以计算出$x_i$的embedding！

<br>

### FM公式的理解

从公式来看，模型前半部分就是普通的LR线性组合，后半部分的交叉项：特征组合。首先，单从模型表达能力上来看，FM是要强于LR的，至少它不会比LR弱，当交叉项参数$w_{ij}$全为0的时候，整个模型就退化为普通的LR模型。对于有$n$个特征的模型，特征组合的参数数量共有$1+2+3+\cdots  + n-1=\frac{n(n-1)}{2}$个，并且任意两个参数之间是独立的。所以说特征数量比较多的时候，特征组合之后，维度自然而然就高了。

> 定理：任意一个实对称矩阵（正定矩阵）$W$都存在一个矩阵$V$，使得 $W=V.V^{T}$成立。

类似地，所有二次项参数$\omega_{ij}$可以组成一个对称阵$W$（为了方便说明FM的由来，对角元素可以设置为正实数），那么这个矩阵就可以分解为$W=V^TV$，$V$ 的第$j$列($v_{j}$)便是第$j$维特征($x_{j}$)的隐向量。

$$
\hat{y}(X) = \omega_{0}+\sum_{i=1}^{n}{\omega_{i}x_{i}}+\sum_{i=1}^{n-1}{\sum_{j=i+1}^{n} \color{red}{<v_{i},v_{j}>x_{i}x_{j}}}
$$

需要估计的参数有$\omega_{0}∈ R$，$\omega_{i}∈ R$，$V∈ R$，$< \cdot, \cdot>$是长度为$k$的两个向量的点乘，公式如下：

$$
<v_{i},v_{j}> = \sum_{f=1}^{k}{v_{i,f}\cdot v_{j,f}}
$$

上面的公式中： 

- $\omega_{0}$为全局偏置；
- $\omega_{i}$是模型第$i$个变量的权重;
- $\omega_{ij} = < v_{i}, v_{j}>$特征$i$和$j$的交叉权重;
- $v_{i} $是第$i$维特征的隐向量;
- $<\cdot, \cdot>$代表向量点积;
- $k(k<<n)$为隐向量的长度，包含 $k$ 个描述特征的因子。

FM模型中二次项的参数数量减少为 $kn $个，远少于多项式模型的参数数量。另外，参数因子化使得 $x_{h}x_{i}$ 的参数和 $x_{i}x_{j}$ 的参数不再是相互独立的，因此我们可以在样本稀疏的情况下相对合理地估计FM的二次项参数。具体来说，$x_{h}x_{i}$ 和 $x_{i}x_{j}$的系数分别为 $\lt v_{h},v_{i}\gt$ 和 $\lt v_{i},v_{j}\gt$ ，它们之间有共同项 $v_{i}$ 。也就是说，所有包含“ $x_{i}$ 的非零组合特征”（存在某个 $j \ne i$ ，使得 $x_{i}x_{j}\neq 0$ ）的样本都可以用来学习隐向量$v_{i}$，这很大程度上避免了数据稀疏性造成的影响。而在多项式模型中,$w_{hi}$ 和 $w_{ij}$ 是相互独立的。

显而易见，FM的公式是一个通用的拟合方程，可以采用不同的损失函数用于解决regression、classification等问题，比如可以采用MSE（Mean Square Error）loss function来求解回归问题，也可以采用Hinge/Cross-Entropy loss来求解分类问题。当然，在进行二元分类时，FM的输出需要使用sigmoid函数进行变换，该原理与LR是一样的。直观上看，FM的复杂度是 $O(kn^2)$ 。但是FM的二次项可以化简，其复杂度可以优化到 $O(kn)$ 。由此可见，FM可以在线性时间对新样本作出预测。

**证明**：
$$
\begin{aligned} 
\sum_{i=1}^{n-1}{\sum_{j=i+1}^{n}{<v_i,v_j>x_ix_j}}
&= \frac{1}{2}\sum_{i=1}^{n}{\sum_{j=1}^{n}{<v_i,v_j>x_ix_j}} - \frac{1}{2} {\sum_{i=1}^{n}{<v_i,v_i>x_ix_i}} \\
&= \frac{1}{2} \left( \sum_{i=1}^{n}{\sum_{j=1}^{n}{\sum_{f=1}^{k}{v_{i,f}v_{j,f}x_ix_j}}} - \sum_{i=1}^{n}{\sum_{f=1}^{k}{v_{i,f}v_{i,f}x_ix_i}} \right) \\
&= \frac{1}{2}\sum_{f=1}^{k}{\left[ \left( \sum_{i=1}^{n}{v_{i,f}x_i} \right) \cdot \left( \sum_{j=1}^{n}{v_{j,f}x_j} \right) - \sum_{i=1}^{n}{v_{i,f}^2 x_i^2} \right]} \\
&= \frac{1}{2}\sum_{f=1}^{k}{\left[ \left( \sum_{i=1}^{n}{v_{i,f}x_i} \right)^2 - \sum_{i=1}^{n}{v_{i,f}^2 x_i^2} \right]} 
\end{aligned}
$$
**解释**：

- $v_{i,f}$ 是一个具体的值；
- 第1个等号：对称矩阵 $W$ 对角线上半部分；
- 第2个等号：把向量内积 $v_{i}$,$v_{j}$ 展开成累加和的形式；
- 第3个等号：提出公共部分；
- 第4个等号： $i$ 和 $j$ 相当于是一样的，表示成平方过程。

<br>

### FM优缺点

**优点**
1. 通过向量内积作为交叉特征的权重，可以在数据非常稀疏的情况下还能有效的训练处交叉特征的权重（因为不需要两个特征同时不为零）
2. 可以通过公式上的优化，得到O(nk)的计算复杂度，k一般比较小，所以基本上和n是正相关的，计算效率非常高
3. 尽管推荐场景下的总体特征空间非常大，但是FM的训练和预测只需要处理样本中的非零特征，这也提升了模型训练和线上预测的速度
4. 由于模型的计算效率高，并且在稀疏场景下可以自动挖掘长尾低频物料。所以在召回、粗排和精排三个阶段都可以使用。应用在不同阶段时，样本构造、拟合目标及线上服务都有所不同（注意FM用于召回时对于user和item相似度的优化）
5. 其他优点及工程经验参考石塔西的文章

**缺点**
1. 只能显示的做特征的二阶交叉，对于更高阶的交叉无能为力。对于此类问题，后续就提出了各类显示、隐式交叉的模型，来充分挖掘特征之间的关系

### 代码实现

```python
class FM(Layer):
    """显示特征交叉，直接按照优化后的公式实现即可
    注意：
        1. 传入进来的参数看起来是一个Embedding权重，没有像公式中出现的特征，那是因
        为，输入的id特征本质上都是onehot编码，取出对应的embedding就等价于特征乘以
        权重。所以后续的操作直接就是对特征进行操作
        2. 在实现过程中，对于公式中的平方的和与和的平方两部分，需要留意是在哪个维度
        上计算，这样就可以轻松实现FM特征交叉模块
    """
    def __init__(self, **kwargs):
        super(FM, self).__init__(**kwargs)

    def build(self, input_shape):
        if not isinstance(input_shape, list) or len(input_shape) < 2:
            raise ValueError('`FM` layer should be called \
                on a list of at least 2 inputs')
        super(FM, self).build(input_shape)  # Be sure to call this somewhere!

    def call(self, inputs, **kwargs):
        """
        inputs: 是一个列表，列表中每个元素的维度为：(None, 1, emb_dim)， 列表长度
            为field_num
        """
        concated_embeds_value =  Concatenate(axis=1)(inputs) #(None,field_num,emb_dim)
        # 根据最终优化的公式计算即可，需要注意的是计算过程中是沿着哪个维度计算的，将代码和公式结合起来看会更清晰
        square_of_sum = tf.square(tf.reduce_sum(
            concated_embeds_value, axis=1, keepdims=True)) # (None, 1, emb_dim)
        sum_of_square = tf.reduce_sum(
            concated_embeds_value * concated_embeds_value,
             axis=1, keepdims=True) # (None, 1, emb_dim)
        cross_term = square_of_sum - sum_of_square
        cross_term = 0.5 * tf.reduce_sum(cross_term, axis=2, keepdims=False)#(None,1)
        return cross_term

    def compute_output_shape(self, input_shape):
        return (None, 1)
    
    def get_config(self):
        return super().get_config()
```


**参考资料**
* [FM：推荐算法中的瑞士军刀](https://zhuanlan.zhihu.com/p/343174108)
* [FM算法解析](https://zhuanlan.zhihu.com/p/37963267)
* [FM论文原文]([https://www.csie.ntu.edu.tw/~b97053/paper/Rendle2010FM.pdf](https://www.csie.ntu.edu.tw/~b97053/paper/Rendle2010FM.pdf))
* [AI上推荐 之 FM和FFM](https://blog.csdn.net/wuzhongqiang/article/details/108719417)