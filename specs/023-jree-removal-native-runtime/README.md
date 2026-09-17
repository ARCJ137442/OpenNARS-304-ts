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

### 2026-09-16：Concept NativeList 列表容器批次

在代码提交 `2465dcd` 中，对照 canonical Java `Concept.java`、`ProcessQuestion.java`、`ProcessJudgment.java` 和 `ProcessGoal.java` 的实际调用点，确认六组任务表只依赖有限的 `ArrayList` 合同：`questions/quests` 在容量满时按 FIFO `remove(0)`，`beliefs/desires` 需要按 rank 中间插入并从尾部淘汰，四类表都需要 `size/get/add/iterator`。因此新增项目内 `src/runtime/NativeList.ts`，以原生数组实现这些操作、fail-fast iterator、iterator.remove、Java equals 方向的 contains/indexOf 和边界检查；六组 Concept 表及三个控制类局部变量改用该容器。公开 getter 仍保留 Java List 返回形状，但只在兼容边界返回不可修改的 jree 快照，避免把内部可变表交给 `Collections.unmodifiableList` 后原地锁死。

本批局部回归为 `5/5`，最终 M2 为非增量 `tsc=0`、串行单测 `222/222`、build、dist API、canonical Java 局部 parity 全部通过。普通保护矩阵按新口径执行 M1-（排除长期稳定性 #245）为 `244/244`，0 exception、0 marker missing、0 timeout、0 process limit、0 not-run、0 java/TS diff；额外 `simpleOperationTest.nal` 为 `1/1`。#245 的 TS 长测完成 `2,001,974` 周期并命中 marker；同一 canonical JAR 的 Java SerialGC 独立长测也完成 `2,001,974` 周期并命中 marker。普通 JVM 的首次执行在 JDK 18.0.2 `jvm.dll` 的 `GC Thread#1` 触发 `EXCEPTION_ACCESS_VIOLATION`，另一次带 `JAVA_TOOL_OPTIONS` 的 parity 复核再次遇到同类主机异常；这两次环境故障与 TS 逻辑分叉分开记录，不把它们算作本批语义失败。

本批矩阵原始逐行时长为：完整 M1 的 245 行 `4,231,370 ms`，其中 #245 为 `2,236,442 ms`；最终代码 M1- 的 244 行为 `1,974,268 ms`，相对完整 M1 节省 `2,257,102 ms`（`53.34%`）。相同前 244 行的差额仅 `20,660 ms`（`1.04%`），所以这项节省主要来自拆出 #245，而不是宣称 NativeList 已完成性能优化。当前完整 M1 #245 的 Windows `PeakWorkingSet64` 观察值为 `3,050,434,560 bytes`，M1- 的最大 TS `peak_rss_bytes` 为 `1,475,260,416 bytes`；由于采样接口不同，内存差只作量级参考，下一次完整 M1 按命令手册统一使用 `--resource-metrics`。023 仍保持 `in-progress`，未迁移的领域 Map/Set、其他 List/Iterator、运行时类身份和 jree 兼容层不能被本批覆盖。

### 2026-09-16：DerivationContext 双前提结果缓冲批次

对照 canonical Java `DerivationContext.doublePremiseTask`，确认局部 `ArrayList<Task>` 只承担成功派生结果的短生命周期收集：失败条件返回 `null`，成功路径按派生顺序追加最多两个任务，调用方只使用 Java List 的 `add`、`addAll`、`size` 和迭代能力。因此在不改变公开 `java.util.List<Task> | null` 返回形状的前提下，将内部缓冲替换为项目 `NativeList<Task>`；没有改变 `TemporalRules` 的上层 `derivations` 容器，也没有改变任务派发、预算、Stamp 或 `derivedTask` 逻辑。

新增 `core-runtime` 直接回归，命中成功派生路径并确认返回缓冲为 `NativeList`、结果数量为 1、Term 文本和顺序正确。M2 的串行单测为 `223/223`，非增量 typecheck 为 0 诊断，build、dist API、canonical Java 局部算法 parity 均通过。M1-（排除 #245）在 canonical Java 304 JAR、单线程 cold、逐文件串行条件下为 `244/244`，0 exception、0 marker missing、0 timeout、0 process limit、0 not-run、0 Java/TS diff；逐行总时长 `2,001,067 ms`，平均 `8,201.09 ms`，最大 `412,000 ms`，TS 最大 `peak_rss_bytes=1,465,114,624`。另行执行的 `simpleOperationTest.nal` 为 `1/1` parity 通过，耗时 `26,536 ms`。相对上一批 M1- 的 `1,974,268 ms`，本批主矩阵总时长增加 `26,799 ms`（`+1.36%`），TS 峰值 RSS 减少 `10,145,792 bytes`（`-0.69%`）；该幅度属于运行波动，不能宣称本批已完成性能优化。相对完整 M1 的 `4,231,370 ms`，排除 #245 后节省 `2,230,303 ms`（`52.71%`）。jree 审计的 `new ArrayList` 从上一批 `11` 降为 `10`，直接导入文件保持 `96`，`new LinkedHashMap=35`、`new LinkedHashSet=26`；023 继续保持 `in-progress`。

### 2026-09-16：TemporalRules 派生结果缓冲批次

对照 canonical Java `TemporalRules.temporalInduction` 及其调用点，确认 `derivations` 仅按规则产生顺序收集短生命周期 `Task` 结果，实际使用为 `add`、`addAll`、迭代和返回；Java 的前三个变量引入 staging 列表已在 TypeScript 中是原生数组。本批仅将 `derivations` 的 jree `ArrayList<Task>` 替换为 `NativeList<Task>`，保留 `java.util.List<Task>` 返回形状，不改 `Collections.emptyList()` 的只读空结果契约，也不改任何推理规则、预算、Stamp 或派发顺序。

新增直接回归覆盖 `addToMemory=false`、`allowSequence=false` 的合法时间归纳空结果路径，确认返回原生有序缓冲且数量为 0。M2 串行单测为 `224/224`，非增量 typecheck 为 0 诊断，build、dist API、canonical Java 局部算法 parity 均通过。M1- 主矩阵 `244/244`，0 exception、0 marker missing、0 timeout、0 process limit、0 not-run、0 Java/TS diff；额外 `simpleOperationTest.nal` `1/1`。本批 jree 审计为直接导入文件 `96`、`new ArrayList=9`、`new LinkedHashMap=35`、`new LinkedHashSet=26`、candidate native items `72`。M1- 主矩阵总时长为 `2,028,815 ms`，TS 峰值 RSS 为 `1,478,266,880 bytes`；相对上一批主矩阵分别 `+1.39%` 和 `+0.90%`，不宣称性能收益。023 继续保持 `in-progress`。

### 2026-09-16：CompoundTerm 局部列表缓冲批次

对照 canonical Java `CompoundTerm.asTermList`、`cloneTermsListDeep` 和 `prepareComponentLinks` 及其调用点，确认三处 `ArrayList` 都是按 `term` 原顺序构造、短生命周期使用的列表缓冲，不承担 key 判等。`asTermList` 的调用方还会执行 `remove(Object)` 和 `remove(int)` 两种 Java 重载，因此同步补齐 `NativeList` 的值删除分支：以被搜索对象的 `equals` 方向定位元素，保留索引删除、顺序和修改计数；没有修改 `Terms.prepareComponentLinks` 的递归规则。

TypeScript 侧将三处局部 `ArrayList` 收窄为 `NativeList`，仍以类型断言保留 Java `List<Term>`/`List<TermLink>` 返回形状。新增回归覆盖 `asTermList` 的原生存储、索引删除、`cloneTermsExcept` 的值删除、深拷贝顺序和 TermLink `target` 顺序；NativeList 原有 indexed remove、equals lookup、iterator/remove 回归也继续通过。

本批 M2 为非增量 `tsc=0`、串行单测 `225/225`、build、dist API、canonical Java 局部 parity 全部通过。M1- 主矩阵在显式 canonical Java JAR、单线程 cold、逐文件串行条件下为 `244/244`，0 exception、0 marker missing、0 timeout、0 process limit、0 not-run、0 Java/TS diff；额外 `simpleOperationTest.nal` 为 `1/1`。jree 审计为直接导入文件 `96`、`new ArrayList=6`、`new LinkedHashMap=35`、`new LinkedHashSet=26`、candidate native items `71`。主矩阵总时长 `1,957,134 ms`，TS 峰值 RSS `1,345,036,288 bytes`；相对上一批分别减少 `71,681 ms`（`3.53%`）和 `133,230,592 bytes`（`9.01%`）。相对历史完整 M1 的 `4,231,370 ms`，M1- 节省 `2,274,236 ms`（`53.75%`）；历史完整 M1 与当前 M1- 的内存采样口径不同，只作为量级参考，不能将本批变化宣称为性能优化。023 继续保持 `in-progress`。

### 2026-09-16：Term.toSortedSet 原生有序集合批次（`02ddf20`）

对照 canonical Java `Term.toSortedSet` 确认其真实返回类型为 `TreeSet`，排序和去重由 `Term.compareTo` 决定；当前 TypeScript 因 jree 缺少 `TreeSet`，曾以 `ArrayList` 冒充 `Set`。本批新增 `src/runtime/NativeSortedSet.ts`，只实现该调用面已经需要的排序、比较器去重、`contains`、`add`、`remove`、`retainAll`、`size`、迭代和 Java 形状的 `toArray`，并把 `Term.toSortedSet` 改为返回该原生集合。没有修改现有数组化的 SetExt/SetInt/IntersectionExt/IntersectionInt 工厂，也没有扩大到领域 Map/Set。

局部回归已覆盖乱序输入、重复项、比较器相等、交集保留和带目标数组的 `toArray`；串行完整单测为 `227/227`，非增量 `tsc=0`，build、dist API 和 canonical Java 局部 parity 均通过。当前静态审计为直接 jree 导入文件 `96`、`new ArrayList=5`、`new LinkedHashMap=35`、`new LinkedHashSet=26`、candidate native items `70`。

M1- 主矩阵使用 canonical JAR `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`、单线程 cold、逐文件串行和 `--cycles 1550`：原始结果 `242/244`，两项均为 Java 子进程异常且 TS 同行通过；对 `nal4.everyday_reasoning.nal` 与 `nars_multistep_2.nal` 的独立 canonical 重跑为 `2/2`，无可复现 TS 分叉，因此有效 M1- 为 `244/244`，但原始矩阵仍如实保留 `242/244`。额外 `simpleOperationTest.nal` 为 `1/1`。其无 marker 严格长周期证据为 Java/TS 均 `131072` 周期、`128` 窗口、`2535970` 事件，`equal=true`、`first_difference=null`。

本批主矩阵逐行总时长为 `2,118,396 ms`，TS 峰值 RSS 为 `1,387,151,360 bytes`。相对上一批 M1-（`1,957,134 ms`、`1,345,036,288 bytes`），本批分别增加 `161,262 ms`（`8.24%`）和 `42,115,072 bytes`（`3.13%`），没有把该变化宣称为性能收益。相对历史完整 M1（`4,231,370 ms`、约 `3,050,434,560 bytes` 的不同采样口径），M1- 少运行 `2,112,974 ms`（`49.94%`），粗略少占 `1,663,283,200 bytes`（`54.53%`）；主要原因是排除长期稳定性 `#245`，不是本批算法优化结论。023 继续保持 `in-progress`。

### 2026-09-17：ProcessJudgment 目标 Set 批次

对照 canonical Java `ProcessJudgment.addToTargetConceptsPreconditions` 及其历史 blame，确认局部变量原始类型是 `Set<Term>`、实现是 `LinkedHashSet<Term>`；调用面只有 `add`、按插入顺序遍历和基于 Term 值的去重。该处自初始转写以来一直使用 jree Set，未发现历史 Set→List 错配，因此本批只替换实现为项目 `NativeSet<Term>`，没有把 Set 降成数组，也没有改动 Map、List、推理规则或目标派发逻辑。

新增 NativeSet 等值 Term 回归，验证两个独立解析但 Java `equals` 相等的 Term 只保留首个元素。M2 结果为定向回归 `18/18`、串行单测 `242/242`、非增量 `tsc=0`、build、dist API、canonical Java 局部 parity 和 `toothbrush.nal` smoke `1/1`；失败 0、跳过 0。本批按低风险局部 Set 规则不运行 M1-/#245。

审计数字按“前 → 后”记录：相对上一提交 `b99467c`，生产 `new LinkedHashSet` 为 `13 → 12`，直接 jree 导入文件为 `95 → 95`，`new LinkedHashMap` 为 `35 → 35`；迁移扫描的 collection-method 为 `560 → 561`，增加来自本批测试新增的 `.size()`，不是生产 jree 依赖。canonical Java 仍为 source `8675b76fe8c21ee20a7b8c1b63408fb05327210d`、JAR SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`。023 继续保持 `in-progress`。

### 2026-09-17：Variables 统一索引 Set 原生化

在代码提交 `52d4f5d` 中，对照 canonical Java `Variables.unify` 的实际声明与调用，确认 `matchedJ` 是 `Set<Integer>`，由 `LinkedHashSet` 支撑，用于记录已经匹配的右侧索引。它不是可重复的 List，也不能只按数组 API 形状迁移。TypeScript 改为 `NativeSet<java.lang.Integer>`，保留 `Integer` 包装边界、`contains`/`add` 的唯一性和原有匹配顺序；代码中明确标注了 Java 原类型。

新增回归用 `(|,a,a)` 与 `(|,a,b)` 验证同一个右侧 `a` 不能被重复索引。M2 证据为定向 `40/40`、串行单测 `243/243`、显式非增量 `tsc` 0 诊断、build、dist API 和 canonical Java 局部 parity 通过；`test/entity/TLink.test.ts` 仍由统一串行入口纳入。

M1- 在提交前基线 `35f6d4d` 之后运行，使用单线程、cold、`--chunk-size 1`、显式 canonical Java 304 artifact，排除长期稳定性 #245。244 个主资源按 `single_step=215`、`multi_step=24`、`application=5` 分层，`244/244` 通过；Java/TS 均为 0 exception、0 marker missing、0 timeout、0 stall、0 process limit、0 not-run、0 Java/TS diff。阶段时长合计 Java `161,997 ms`、TypeScript `1,649,672 ms`，TS/Java 约 `10.18x`；TS 最大 `peak_rss_bytes=1,193,345,024`，仅作后续性能观测。

本批 canonical Java source commit 为 `8675b76fe8c21ee20a7b8c1b63408fb05327210d`，JAR 为 `H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-java-canonical-fixed-build\target\opennars-3.0.4-SNAPSHOT.jar`，SHA-256 为 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`。jree 审计前→后为：`new LinkedHashSet 12→11`、直接导入文件 `95→95`、`new LinkedHashMap 35→35`；迁移扫描的 `collection-method 560→561` 来自新增测试，不是生产依赖增加。

本批同时完成了历史前向审查：`7b9f1d4` 已修正早期三处 Java `Set` 误用 `NativeList` 的问题；另登记了 `dda82d0`、`cdbf968`、`3ae6874`、`0af732b` 等把 Java List 边界收窄为数组的历史转换。它们最初作为待审查项保留，后续复核结论见下文；不能用本批 Set 通过结论替代这项审查。

### 2026-09-17：历史 List→数组边界复核

结合用户对原生运行时的约束，对上段登记项做了前向复核。结论不是按 Java 类型名回退：原生数组是优先实现，只有确有 List 专有契约才保留 `NativeList`。`dda82d0` 的 `Concept.anticipations` 只执行有序遍历、追加、按对象身份删除、过滤和长度检查；`cdbf968` 的 `Concept.recent_intervals` 只执行数值索引读写/追加，`CompoundTerm.extractIntervals` 只返回有序结果缓冲；`3ae6874` 的 `SensoryChannel.results` 只执行追加、遍历和清空；`0af732b` 的 `VisionChannel.prototypes` 只执行索引读取、追加和替换。因此当前数组化不构成已证实的语义错误，不回退为 `NativeList`。

本次在相关源码补充“原始 Java 类型 → 当前数组类型 → 适用调用面”的注释，并保留已有直接回归：`anticipate.test.ts`、`narsese-temporal.test.ts`、`vision-channel.test.ts`。只有未来调用方依赖 `.size/.get/.add`、Java 值相等删除/迭代器删除、并发可见性或对外 Java List 兼容形状时，才新增兼容视图或 `NativeList`。这次是前向审查与边界澄清，没有改变推理代码路径。

023 仍保持 `in-progress`：本批只完成 `Variables` 局部 Set 原生化，不能宣称 jree 已移除、全部 Java List 边界已对齐、#245 长期稳定性通过、Java/TypeScript 性能等价或正式发布。

### 2026-09-17：`Anticipate.newTasks` Set 原生化

本批承接历史前向审查，回读 canonical Java `Anticipate` 的字段声明与使用点，确认 `newTasks` 的原始类型为 `Set<Term>`、实现为 `LinkedHashSet<Term>`。调用面虽然只有空判断、`add`、`remove`、`clear` 和遍历，但其语义仍包括 Java `Term.equals` 值相等去重与插入顺序，因此不能按数组或 List 处理。TypeScript 将其实现替换为 `NativeSet<Term>`，并在字段与防御性初始化处注明“Java 原始 Set/LinkedHashSet → 当前 NativeSet”。`anticipations` Map、Map value Set、`ae` 临时 Set 及派发规则未改动。

新增两个独立但 Java `equals` 相等的 Term 回归，确认 `newTasks` 只保留首个对象。定向回归 `8/8`、串行单测 `244/244`、显式非增量 `tsc` 0 诊断、build、dist API、canonical local parity 以及 `nal8.add.nal` `1/1` 均通过。本批按局部 Set 风险等级不运行 M1-/#245。

审计前→后：生产 `new LinkedHashSet` `11 → 6`；`new LinkedHashMap` `35 → 35`；`new ArrayList` `0 → 0`；直接 jree 导入文件 `95 → 95`。迁移扫描 collection-method `561 → 563` 是新增测试调用带来的计数变化，不是生产依赖增加。023 仍保持 `in-progress`，本批不能宣称 jree 已移除、M1- 全量重跑、性能等价或里程碑完成。
