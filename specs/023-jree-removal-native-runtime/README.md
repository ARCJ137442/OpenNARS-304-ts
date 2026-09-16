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

### 2026-09-15：Tense/Symbols 字符串查找表批次

在提交 `3312c9a` 中，对照 Java `Tense.stringToTense`、`Symbols.stringToOperator` 与 `Symbols.charToOperator` 的实际调用，确认这些表只以字符串或字符文本为 key，不承担 Term、Task 等领域对象的 `equals/hashCode` 判等。因此将三张 jree `LinkedHashMap` 查找表收窄为原生 `Map`，把 `put` 改为 `set`，并在对外查找边界将原生 `undefined` 明确归一化为 Java `null`。首轮局部测试发现 `Symbols.getRelation` 直接使用 miss 结果会触发 `undefined` 运行时异常，补上 null 归一化后，新增查找表回归与原有时间 Narsese 回归共 `2/2` 通过。

该批次的 M2 证据为串行单测 `213/213`、非增量 `tsc` 0 诊断、build、dist API 和局部算法 parity 全部通过。M1 在不可变提交 `3312c9a` 上串行完成 245 个主资源，`245/245` 功能/parity、0 exception、0 marker missing、0 timeout、0 process limit、0 not-run；额外 `simpleOperationTest.nal` 无 marker 但完成 131072 周期，Java/TS stage digest 比较为 `equal=true`、`first_difference=null`。jree 审计的生产直接导入文件保持 `96`，`new LinkedHashMap` 构造由 `41` 降为 `38`；Map/Set 的领域对象 key、JavaObject/运行时类身份和 jree 运行时依赖仍保留，023 继续保持 `in-progress`。

### 2026-09-15：Memory.operators 文本注册表批次

在提交 `dbdb936` 中，对照 canonical Java `Memory.operators` 的实际写入、读取和删除调用，确认 key 只来自 `Operator.name()` 和文本 `getOperator(String)`，不承担 `Term`、`Task` 等领域对象的 `equals/hashCode` 判等。因此将该 `CharSequence → Operator` 注册表从 jree `LinkedHashMap` 收窄为原生 `Map<string, Operator>`，以 `javaStringValue` 统一 Java String 与原生文本 key，并显式把 native `Map.get` 的 `undefined` 归一化为 Java `null`。新增回归覆盖 Java String 查询、缺失、同名替换和删除旧值；首轮测试捕获并修复了 miss 未归一化的问题。

该批次的 M2 证据为串行单测 `214/214`、非增量 `tsc` 0 诊断、build、dist API 和局部算法 parity 全部通过。M1 在不可变提交 `dbdb936` 上串行完成 245 个主资源，`245/245` 功能/parity、0 exception、0 marker missing、0 timeout、0 process limit、0 not-run；额外 `simpleOperationTest.nal` 无 marker 但完成 131072 周期，Java/TS stage digest 比较为 `equal=true`、`first_difference=null`。jree 审计的生产直接导入文件保持 `96`，`new LinkedHashMap` 构造由 `38` 降为 `37`；Bag、TemporalInferenceControl 等领域对象集合仍保留，jree 运行时依赖也仍保留，023 继续保持 `in-progress`。

### 2026-09-15：Term.atoms 文本缓存批次（候选 `ef78de8`）

对照 canonical Java `Term.get(CharSequence)`，确认 `atoms` 仅以 atomic term 的 `CharSequence` 文本名称作为 key；索引项虽然会把 `p[1,2]` 等输入规范化为 `p[i,j,k,l]`，仍不使用 `Term` 对象作为 key，也不依赖集合的领域对象判等。因此将 `java.util.Map<CharSequence, Term>`/`LinkedHashMap` 收窄为原生 `Map<string, Term>`，在读写两端统一经过 `javaStringValue`，并把 native `undefined` miss 归一化为 Java 风格的 `null`。新增 native string 与 jree `java.lang.String` 查询同一 atomic term 的身份回归；没有改变索引项的 Java 规范化逻辑。

本批 M2 已完成：串行单测 `215/215`、非增量 `tsc` 0 诊断、build、dist API 和局部算法 parity 通过。M1 在不可变提交 `ef78de8` 上完成：245 个主资源 `245/245`，0 exception、0 marker missing、0 timeout、0 process limit、0 not-run；额外 `simpleOperationTest.nal` 短 parity 为 `1/1`。对无 marker 夹具按冻结的 `--skip-embedded --cycles 131072 --window-size 1024` 合同复验，Java/TS 均为 `131072` 周期、`128` 窗口、`2535970` 事件，`equal=true`、`first_difference=null`；对应项目外证据文件为 `java-simpleOperationTest-stage-digest-131072-window1024-20260916-ef78de8-skip.json` 和 `ts-simpleOperationTest-stage-digest-131072-window1024-20260916-ef78de8-skip.json`。另一次执行内嵌周期后追加周期的诊断协议在窗口 53 观察到 Java/TS scheduler `3238/3237`，但暂时恢复旧 jree `LinkedHashMap` 后 TS 摘要完全不变，证明该差异不是本批 `Term.atoms` 引入，且该协议不同于冻结的 markerless 合同。

审计在候选提交上显示 `new LinkedHashMap=36`，较上一批再减少 1；直接 jree 导入文件保持 `96`。`Bag.nameTable`、替换映射、Set/Iterator 和 jree compatibility 层不属于本批，023 继续保持 `in-progress`。

### 2026-09-16：Sentence 变量重命名表批次

在代码提交 `6af34d8` 中，对照 canonical Java `Sentence.java` 的规范化实现，确认 `rename` 表的 key 是变量名（及必要 scope 后缀）的文本值，value 是 `Variable.getName` 返回的 Java `CharSequence`。因此仅将该短生命周期 `LinkedHashMap<CharSequence, CharSequence>` 收窄为原生 `Map<string, CharSequence>`：读写 key 统一经过 `javaStringValue`，miss 归一化为 `null`，并使用原生 `Map.size` 属性生成与 Java 相同的编号。没有将这一结论外推到领域对象 Map。

新增回归覆盖 Java `String` 与原生 TypeScript 字符串混合输入，确认重复文本变量均复用 `$1`。首轮局部测试暴露并修复了遗漏的 `javaStringValue` 导入和原生 Map 的 `size()`/`size` API 差异。

本批保护证据：非增量 typecheck 为 `0` 诊断，串行单测 `216/216`，build 源文件 `131`，dist API 和局部算法 parity 通过；M1 主矩阵 `245/245`、额外 `simpleOperationTest.nal` `1/1`，0 exception、0 marker missing、0 timeout、0 process limit、0 not-run。无 marker 冻结协议 `--skip-embedded --cycles 131072 --window-size 1024` 下，Java/TS 均为 `131072` 周期、`128` 窗口、`2,535,970` 事件，逐窗口记录一致且两侧均完整。静态审计为直接 jree 导入文件 `96`、`new ArrayList=14`、`new LinkedHashMap=35`、`new LinkedHashSet=26`；相比上一批仅减少 1 个 LinkedHashMap 构造。`package.json`、Bag 领域集合、替换映射、Set/Iterator、运行时类身份与兼容层仍未迁移，因此 023 继续保持 `in-progress`。

### 2026-09-16：CompoundTerm Guava 数组迭代器批次

在代码提交 `1833fc465ad2692f175e065826f2eb68636b14f7` 中，对照 canonical Java `CompoundTerm.iterator()` 的实际实现，确认 Java 调用的是 Guava `Iterators.forArray(term)`，其返回 `UnmodifiableIterator`：直接引用原数组、按原顺序读取，`remove()` 抛出 `UnsupportedOperationException`，耗尽后的 `next()` 抛出 `NoSuchElementException`。因此没有把 Java 语义误判为 `ArrayList` 快照，也没有触碰 `asTermList()` 等仍需 Java List 合同的公共方法。

TypeScript 侧将这一处仅为生成迭代器而构造的 jree `ArrayList` 替换为原生 `Term[]` 引用和索引状态，同时保留 `java.util.Iterator<Term>` 的兼容返回形状及两类 Java 异常。新增 `core-runtime` 回归覆盖遍历顺序、耗尽、`remove()` 只读约束和原数组不变性。

本批 M2 通过：非增量 typecheck 为 `0` 诊断，串行单测 `217/217`，build、dist API 和 canonical Java 局部 parity 均通过。M1 使用 explicit canonical JAR、单线程 cold、`--chunk-size 1`，主矩阵 `245/245`、额外 `simpleOperationTest.nal` `1/1`，均无异常；markerless 冻结协议下 Java/TS 均完整观察 `131072` 周期、`128` 窗口、`2,535,970` 事件，`equal=true`、`first_difference=null`。静态审计为直接 jree 导入文件 `96`、`new ArrayList=13`、`new LinkedHashMap=35`、`new LinkedHashSet=26`；023 仍保持 `in-progress`，本批不改变领域 Map/Set、运行时类身份或兼容层的未完成状态。
