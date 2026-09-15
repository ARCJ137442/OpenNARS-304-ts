---
status: in-progress
created: 2026-08-26
priority: medium
tags:
- jree
- native-typescript
- milestone
created_at: 2026-08-26T05:36:04.576870200Z
updated_at: 2026-08-26T05:46:50.864563400Z
transitions:
- status: in-progress
  at: 2026-08-26T05:36:10.563187Z
---

# jree原生TypeScript运行时

## 概述
在保留Java行为、M1全量验收和M2零诊断门禁的前提下，逐步移除生产TypeScript对jree的直接依赖，使用TypeScript与JavaScript原生数据结构和运行时逻辑。

## 目标
- 建立生产代码jree依赖清单、允许保留的适配边界和移除顺序。
- 将可替换的集合、字符串、数值和对象辅助逻辑迁移为原生TypeScript实现。
- 保持M1的245+1功能结果、M2测试和零诊断构建不回退。
- 记录每个迁移簇的功能证据与性能证据；性能预算为每1024周期60000毫秒以内，TypeScript相对Java单线程中位数不超过16倍。

## 反目标
- 不在本里程碑内重写推理算法或扩大到无失败证据的批量迁移。
- 不以性能改善替代功能等价；不改变canonical Java语义。
- 不移除仍有明确兼容职责且尚未有替代实现的适配层。

## 设计
按数据结构、容器、推理规则、推理引擎、程序入口安排依赖边界。优先替换局部临时集合和高频路径，保留窄化的兼容适配器；公共API不得泄漏jree类型。每个批次先做局部测试，再做M2检查和受影响的M1矩阵；M1或M2回退时停止后续迁移。

## 计划
- [x] 完成生产jree、Java集合和Java对象依赖的机器可读清单，标记允许的适配边界。
- [ ] 以小批次替换原生集合和辅助逻辑，每批保留回退提交与功能证据。
- [ ] 收敛公共API和入口边界，确认无未授权jree泄漏。
- [ ] 完成受影响的M1、M2、局部测试和性能验证，并记录未迁移残余及理由。

## 测试
- [ ] 生产代码无未解释的直接jree依赖，或每项残余均有边界、理由和移除条件。
- [ ] 每个迁移批次的局部测试、M2和受影响M1结果与稳定基线一致。
- [ ] 通过串行单线程性能对照，性能结果达到批准预算或明确记录为后续优化项。

## 备注
当前稳定回退基线：M1为1bdad9d，M2为2ffcb64，组合回归提交为c1885a1。已完成的代码批次为`4b44806`、`ea89f19`、`fa59303`、`42e4a27`、`854a171`：分别覆盖句子变量、时间规则临时数组、时间推理控制临时数组、复合工厂与时间间隔临时数组、Narsese 私有参数解析数组。J0清单见`reports/evidence/j0-jree-dependency-inventory-20260826-v1.json`，最近盘点见各批次的post清单。LeanSpec工具的默认模板返回Invalid template format，因此本spec使用LeanSpec的--content创建；当前依赖方向为`020`依赖`023`，平台边界由`024`登记。

### 2026-09-15：mental operator 反馈数组批次

在 G0 通过后的最新稳定提交 `03c79646a82f64b8350e669cb545700b164ced1c` 上，确认 `Operator.execute` 已允许 `Task[]`，而 `Consider`、`Doubt`、`FeelBusy`、`FeelSatisfied`、`Hesitate`、`Register`、`Remind`、`Name`、`Wonder` 的反馈路径只产生零个或一个任务；`Feel.feeling` 也只产生一个任务。因此将这些临时反馈容器从 jree `ArrayList` 收窄为原生数组，并以 `Wonder` 的直接执行与 `Operator.call` 回归保护派发行为。该批次使生产源码直接 jree 导入文件从 105 降为 96，`ArrayList` 构造从 24 降为 20；203/203 串行单测、非增量 typecheck、build、dist API、canonical Java 局部 parity 和 `nal9.wonder1.nal` smoke 通过。该批次不改变 023 的未完成状态，也不代表领域集合或 jree 运行时已经退场。

### 2026-09-15：Believe/Abbreviation 反馈数组批次

在 `2784b905c9c2a3afbcc29de7f63f7f410f0b67b0` 上，沿用同一 Java 合同，将 `NullOperator`、`Believe` 与 `Abbreviation.Abbreviate` 的反馈返回边界收窄为原生 `Task[]`；其中 `Believe` 的单任务返回改为 `[newTask]`，`Abbreviation` 的空/单任务返回改为 `[]`/`[newTask]`。`Believe`、`Abbreviation` 增加直接执行回归，串行单测达到 205/205，非增量 typecheck、build、dist API、canonical Java 局部 parity 均通过；`nal9.believe1.nal` parity 为 1/1。jree 审计的直接导入文件保持 96，`ArrayList` 构造由 20 降为 17；仍保留异常、类型辅助和领域集合相关 jree 责任，因此 023 继续保持未完成。

### 2026-09-15：ProcessGoal anticipation value 数组批次

在 `d99ccc7973a53ecd3ad96d318eb53092ad00b792` 上，对照 Java `ProcessGoal` 确认 anticipation map 的 `Operation` key、Map 插入顺序和 value 的顺序遍历都必须保留；仅将 value 的临时 `ArrayList<ExecutablePrecondition>` 改为原生数组。完整串行单测 `206/206`、非增量 typecheck、build、dist API、canonical Java 局部 parity 和 `nars_memorize_precondition_var3.nal` 的 `1/1` 对照均通过。jree 审计的直接导入文件保持 `96`，`ArrayList` 构造由 `16` 降为 `15`；Map/Set 领域语义和运行时类身份仍未迁移，023 继续保持未完成。

### 2026-09-15：VisionChannel prototypes 数组批次

在 `565f32a7b0ed9855ab5829175529365bf707c9cb` 上，对照 canonical Java `VisionChannel` 确认 `prototypes` 只承担有序短生命周期缓冲，调用面为 `isEmpty`、`add`、`size`、`get`、`set` 和 for-each；没有 key 判等、remove 或迭代器副作用。因此将其收窄为 `VisionChannel.Prototype[]`，保留插入顺序、索引替换和遍历行为。新增 1×1 视觉通道回归后，串行单测 `207/207`、非增量 typecheck、build、dist API、局部 parity 和 `vision.nal` 的 `1/1` 对照均通过；jree 审计的 `ArrayList` 构造由 `15` 降为 `14`，直接导入文件仍为 `96`。实现提交为 `0af732b`。该批次只完成 023 的一个低风险容器切片，同时为 024-P3/perception 保留路径证据，不代表 P3 或 023 完成。
