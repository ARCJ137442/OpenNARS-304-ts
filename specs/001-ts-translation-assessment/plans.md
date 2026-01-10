# 计划

> 所属 spec：[ts-translation-assessment](README.md)

## 指导输入

- Java 基线：java-master/src/main/java/org/opennars
- TS 目标：依赖 jree 的 src 目录
- 当前缺口：Parameter 包错位、构建/测试脚手架缺失、运行时语义空白

## 阶段 1：对齐与结构

- 决定 Parameters 与 Debug 的规范所在位置（parameter vs main）。
- 统一 import 并更新引用（ConfigReader、Nar、Memory、推理工具）。
- 编写包映射规则，阻止后续漂移。

## 阶段 2：运行时语义

- 定义能替代 Java 线程（Thread、synchronized、volatile）的 TS 方案。
- 设计新的序列化策略，以取代 ObjectInputStream 与 Serializable。
- 将 ConfigReader 及 Nar.overrideParameters 中的反射逻辑替换为显式注册表或元数据。

## 阶段 3：依赖一致性

- 用 TS 工具函数或本地 helper 替代 Guava 与 commons-lang3 的使用。
- 审计并记录 jree 的调用点，明确是保留还是分阶段移除。

## 阶段 4：验证

- 增加构建脚本（启用 emit 或配置打包器）并记录使用方式。
- 接入测试运行器并激活现有 test/ 目录中的用例。
- 准备最小 smoke test（Nar 初始化、Narsese 解析、一次推理循环）。

## 退出标准

- 包结构与 Java 对齐，或有明确、可追踪的偏移说明。
- 构建与测试脚本可在本地直接运行，无需额外手动步骤。
- 核心推理路径能以示例输入完成一次执行。
