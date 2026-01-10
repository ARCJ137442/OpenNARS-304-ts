# 现状报告

> 所属 spec：[ts-translation-assessment](README.md)

## 范围

对比 java-master/src/main/java/org/opennars 与 src，以评估翻译的覆盖率与质量。

## 覆盖率摘要

- Java 文件总数：124
- 已找到的 TS 对应文件：117
- 缺失的 Java 文件：7
- 多出的、没有 Java 对应项的 TS 文件：2

## 按包统计的覆盖率

- control：8/8 已存在，0 缺失
- entity：10/11 已存在，1 缺失
- inference：9/10 已存在，1 缺失
- interfaces：10/10 已存在，0 缺失
- io：11/12 已存在，1 缺失
- language：30/31 已存在，1 缺失
- main：3/3 已存在，0 缺失
- operator：23/23 已存在，0 缺失
- parameter：0/2 已存在，2 缺失
- plugin：9/9 已存在，0 缺失
- storage：3/4 已存在，1 缺失
- util：1/1 已存在，0 缺失

## 缺失或位置异常

缺失的 Java 文件：
- entity/package-info.java
- inference/package-info.java
- io/package-info.java
- language/package-info.java
- storage/package-info.java
- parameter/Debug.java
- parameter/Parameters.java

多出的 TS 文件：
- main/Debug.ts
- main/Parameters.ts

备注：
- package-info.java 仅用于文档说明，不需要 TS 等价物。
- parameter/Debug 与 parameter/Parameters 疑似已经翻译，但被放在 src/main，导致包结构漂移。

## 质量信号

- TODO 标记遍布核心模块（Bag、TemporalInferenceControl、EventEmitter、VisualSpace、CompoundTerm 等），这些多半沿用自 Java，表示仍有未完成的设计工作。
- 体积比对显示没有空壳文件：部分 TS 文件略短（例如 mental operators 约为 Java 的 0.75 倍），也有更长的文件（language/Product.ts 约为 1.83 倍），推测来自格式化或翻译时的调整。

## 运行与构建准备度

- tsconfig.json 仍设置 noEmit: true，尚未产出 JS。
- package.json 的 test 脚本尚属占位。
- 代码依赖 jree 来模拟 Java 风格的类型、反射与序列化行为。

## 关键风险

- Parameter 包位置错误会破坏逻辑边界与 import 约定。
- Java 的反射与线程语义（ConfigReader、Nar）在 TS 中没有原生替代。
- Java 序列化（Serializable、ObjectInputStream）无法映射到 JS 运行时，需要给出新的方案。
