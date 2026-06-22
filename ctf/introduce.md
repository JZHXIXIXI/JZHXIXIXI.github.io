# 椭圆曲线加密与代数结构学习笔记

这是我的第一篇技术日志！今天主要记录密码学的一些数学基础。

## 1. 群 (Group) 的定义
一个集合 $G$ 加上一个二元运算 $\cdot$ 如果满足以下四个条件，则称为一个**群**：
* **封闭性**：$\forall a, b \in G, a \cdot b \in G$
* **结合律**：$(a \cdot b) \cdot c = a \cdot (b \cdot c)$
* **单位元**：$\exists e \in G$，使得 $e \cdot a = a \cdot e = a$
* **逆元**：$\forall a \in G, \exists a^{-1} \in G$，使得 $a \cdot a^{-1} = e$

## 2. Python 代码片段测试
下面是一段简单的 Python 模型推理初始化伪代码：

```python
import onnxruntime as ort

def init_detection_model(model_path):
    session = ort.InferenceSession(model_path)
    print("【系统提示】安全检测模型加载成功！")
    return session
    