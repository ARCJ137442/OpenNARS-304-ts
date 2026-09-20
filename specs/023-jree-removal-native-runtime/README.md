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
按 J1 运行时兼容、J2 语言与解析、J3 推理核心、J4 operator/plugin、J5 主入口与宿主边界五个责任簇安排依赖边界。优先替换局部临时集合和高频路径，保留窄化的兼容适配器；公共API不得泄漏jree类型。单文件只是实现切片，不是 M1- 验收单位：普通切片先做局部合同、TS-only M2 和 2～5 个受影响 NAL；只有一个责任簇的出口条件全部满足时才运行一次 TS-only M1- 244 项；023 整体验收才现跑 canonical Java、完整 245+1 和严格 markerless 长测。M1、M2 或定向哨兵回退时停止后续迁移。

## 计划
- [x] 完成生产jree、Java集合和Java对象依赖的机器可读清单，标记允许的适配边界。
- [ ] 按五个责任簇连续替换原生集合和辅助逻辑，每个实现切片保留回退提交与局部证据，每个责任簇只在收口时运行一次 M1-。
- [ ] 收敛公共API和入口边界，确认无未授权jree泄漏。
- [ ] 完成受影响的M1、M2、局部测试和性能验证，并记录未迁移残余及理由。

## 测试
- [ ] 生产代码无未解释的直接jree依赖，或每项残余均有边界、理由和移除条件。
- [ ] 每个迁移切片的局部测试、TS-only M2和 2～5 个受影响 NAL 与冻结 Java 标杆一致；每个责任簇的唯一收口 M1- 证据与稳定基线一致。
- [ ] 通过串行单线程性能对照，性能结果达到批准预算或明确记录为后续优化项。

## 备注

### 2026-09-19：责任簇与分层验证策略

现行执行策略以 `docs/luna-agent-active-goal.md` 为长期目标，以 `scripts/checking/validation-clusters.mjs` 为责任簇路径、直接测试和哨兵 NAL 的机器真源。`scripts/checking/classify-change-gate.mjs` 必须校验冻结 Java 标杆哈希并生成验证计划：风险切片只生成受影响 NAL；显式 `--close-cluster` 才生成 M1-；`--stage 023` 才要求现跑 Java 和完整阶段门。一个 owner 簇最多携带一个 supporting 簇、两个 supporting 生产文件；触及三个簇或缺少 owner 时失败关闭。生产源码改动行数只统计 `src` 下 TypeScript 源文件，不统计测试、规格、脚本、报告或文档。

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

### 2026-09-17：`Terms` 图像/Product 局部 Set 原生化

本批承接历史前向审查，回读 canonical Java `Terms.equalSubjectPredicateInRespectToImageAndProduct`，确认 `componentsA`、`componentsB` 的原始类型均为 `Set<Term>`、实现为 `LinkedHashSet`。调用面只有逐项 `add` 和插入顺序遍历；其语义是 Term 值相等去重后的成员比较，不是 List 或数组。TypeScript 使用 `NativeSet<Term>`，并在源码注明“Java 原始 Set/LinkedHashSet → 当前 NativeSet”；没有改变等价判断算法或公共返回形状。

新增重复变量 Product/Image 等价回归，定向回归 `8/8`、串行单测 `245/245`、显式非增量 `tsc` 0 诊断、build、dist API、canonical local parity 均通过。`nal4.0.nal`～`nal4.8.nal` 在 canonical JAR、单线程、cold、1550 周期条件下逐文件运行，`9/9` 通过。本批按局部 Set 风险等级不运行 M1-/#245。

审计前→后：生产 `new LinkedHashSet` `6 → 4`；`new LinkedHashMap` `35 → 35`；`new ArrayList` `0 → 0`；直接 jree 导入文件 `95 → 95`。迁移扫描 collection-method `563 → 565` 是 `.add` 调用扫描计数变化，不是生产 jree 构造增加。023 仍保持 `in-progress`，本批不能宣称 jree 已移除、M1- 全量重跑、性能等价或里程碑完成。

### 2026-09-17：`CompoundTerm` 递归 Set 原生化

本批继续历史前向审查，回读 canonical Java `CompoundTerm.getContainedTerms()` 与 `addComponentsRecursively()`。两者的原始合同都是 `Set<Term>`，实现为 `LinkedHashSet`：递归收集 Term，按 Java `equals` 做值相等去重，并按首次加入顺序迭代；后一个入口由 `CompositionalRules` 的目标/谓词分支实际消费。TypeScript 将两个局部实现改为 `NativeSet<Term>`，保留 `java.util.Set<Term>` 的公共边界、递归顺序和调用方逻辑，没有以 `NativeList` 或数组冒充 Set。

新增语言层回归，验证 NativeSet 运行时类型、递归结果的唯一性、插入顺序和独立但 Java `equals` 相等的 Term 可以命中。M2 为定向 `45/45`、串行统一单测 `246/246`、非增量 `tsc=0`、build、dist API 和 canonical local parity 全部通过，失败/跳过均为 0。

在显式排除 `stability/long_term_stability.nal` 后，M1- 主资源 `single_step=215`、`multi_step=24`、`application=5`，`244/244` 功能与 parity 通过；0 exception、0 marker missing、0 no-progress timeout、0 process limit、0 not-run、0 Java/TS diff。唯一 markerless 资源 `nal6.redundant.nal` 另按冻结协议完成 Java/TS 各 `131072` 周期、`128` 个窗口、`589572` 个事件，stage digest 为 `equal=true`、`first_difference=null`、`incomplete=false`。

canonical Java source commit 为 `8675b76fe8c21ee20a7b8c1b63408fb05327210d`，JAR SHA-256 为 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`。生产审计前→后为 `new LinkedHashSet 4→2`、`new LinkedHashMap 35→35`、`new ArrayList 0→0`、直接 jree 导入文件 `95→95`；迁移扫描 collection-method `565→568` 的增加来自本批 Set 调用/测试观察，不是 jree 构造增加。编码检查扫描 915 个文件且无异常；报告为 `reports/20260917-132959.md`。023 仍保持 `in-progress`，本批不能宣称 jree 已移除、#245 长期稳定性已重跑、性能等价或里程碑完成。

### 2026-09-17：`Anticipate` 预测 Map value Set 原生化（本批完成，023 仍进行中）

本批继续做历史提交前向审查。对照 canonical Java `Anticipate.java`，确认 `anticipations` 的原始形状为 `Map<Prediction, LinkedHashSet<Term>>`；内层 Set 需要 Term 值相等去重、插入顺序以及 `Iterator.remove()`，不能按 List 或数组处理。TypeScript 保留外层 Java `LinkedHashMap`，仅将具体 value 改为 `NativeSet<Term>`；新增 `NativeSet.iterator().remove()` 与变更检查，并在源码注明 Java 原始类型。Prediction 键、外层 Map 的 entry iterator.remove、目标派发与其它推理规则未改动。

定向回归最终为 `10/10`，完整串行 M2 为 `248/248`，非增量 `tsc` 为 0 诊断，build、dist API、canonical local parity 均通过；`nal8.add.nal` 受影响 smoke 为 `1/1`。首轮 M1- 的原始结果为 `243/244`，唯一异常是 canonical Java 子进程在 `multi_step/nars_multistep_2.nal` 上退出；同一文件 TypeScript 为 `2/2`，独立 canonical 重跑为 `1/1`，因此未形成 TS 语义差异。修复外层 Map 延迟删除后，最终以显式排除 #245 的 244 个文件、canonical JAR、单线程、cold、逐文件单进程方式完成 M1-：`244/244`，分层为 `single_step=215`、`multi_step=24`、`application=5`；Java/TS 均为 0 exception、0 marker missing、0 timeout、0 stall、0 process limit、0 not-run、0 Java/TS diff。

本批首先暴露了 jree `LinkedHashMap` entry iterator 不支持 Java `Iterator.remove()` 的边界，随后保留外层 Map 抽象，以有序 Prediction 临时数组收集待删项，遍历后调用 `Map.remove()`，并增加了对应生命周期回归。最终 M1- Java 总耗时 `159,782 ms`、TypeScript `1,655,338 ms`、合计 `1,815,120 ms`，TS/Java 约 `10.36x`，最大单行 `363,928 ms`；本次未启用 resource metrics，不新增内存节省比例。canonical Java source commit 为 `8675b76fe8c21ee20a7b8c1b63408fb05327210d`，JAR SHA-256 为 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`。023 继续保持 `in-progress`，本批不能宣称 jree 已移除、#245 通过、性能等价或里程碑完成。

### 2026-09-20：`CompositionalRules.powerSet` 嵌套 Set 合同切片（`a8da3a5`）

canonical Java 的 `powerSet` 为 `Set<Set<T>>`，实现使用 `LinkedHashSet`，因此外层和内层都必须保留 Set 的值相等、唯一性与插入顺序语义。TypeScript 将输入从兼容边界 `java.util.Set<T>` 收窄为 `NativeSet<T>`；测试去除仅用于构造输入的 jree 导入。代码和测试均注明 Java 原始类型与当前原生类型，未把 Set 冒充成 List/数组，也未重写幂集算法。

- 代码提交：`a8da3a5 refactor(023): 收窄组合规则幂集Set合同`，基线为 `38b4afb`。
- 直接合同 `5/5`，定向测试 `20/20`，串行统一单测 `347` 项（`345` 通过、`2` 跳过、`0` 失败），非增量 `tsc=0`，build、dist API、迁移扫描、jree/platform 审计均通过。
- 受影响 NAL 为 `4/4` functional/parity；使用冻结 Java 标杆、TS-only、单线程、cold、1550 周期、逐文件串行运行，0 exception、0 marker missing、0 stall、0 timeout、0 process limit、0 not-run、0 Java/TS diff。
- 项目外证据：`H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\compositional-powerset-j3-20260920-sentinel.jsonl`；SHA-256：`92FF5494E77ACB771C72CC8D1B2D99073793EFB5A5EF7D7E3AEFFB1184A0F0BF`。

本批只完成 J3 一个 T1 边界切片，不能勾选责任簇、023、jree 清零或性能验收；下一步仍按 `introduceVariables` 的 Set/Map 合同与 J1 兼容桥风险排序。

### 2026-09-20：J3 数学浮点边界切片（`cd33361`）

对照 canonical Java 的 `Math.sqrt`、`Math.pow(float,double)` 和 double 比较路径，
本批在 `Float32Math` 中新增 `powDouble`，并修正 `BudgetFunctions`、
`CompositionalRules` 的调用边界。Java 的 float 输入先收窄，double 运算结果只在对应
float 赋值点收窄；没有把 `Math.pow` 一律提前 `Math.fround`，也没有改写推理规则。

- 代码提交：`cd33361 refactor(023): 收敛J3数学浮点边界`，基线为 `fb9a7dd`。
- 直接测试：`27/27`；串行统一单测：`348` 项，`346` 通过、`2` 跳过、`0` 失败。
- 非增量 `tsc=0`；build、dist API、迁移扫描、jree/platform 审计均通过。
- 受影响 NAL：`5/5` functional/parity；0 exception、0 marker missing、0 stall、
  0 timeout、0 process limit、0 Java/TS diff。冻结 Java 标杆未改变，因此本批未启动
  live Java、M1- 或 #245。
- 证据：`H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\j3-float-math-20260920-sentinel.jsonl`。
- 证据 SHA-256：`1DC5D44E36A84ACDF36B68F9F2173D4603AC3CCAC83CB496A8BA902E6612383A`。

本批只完成 J3 一个数学边界切片，不能勾选 J3/023 完成。下一步优先审查
`introduceVariables` 的嵌套 Set/Map 合同，或把 `jree-compat.ts` 的异常桥责任拆成
可独立验证的小簇；责任簇收口后再运行 M1-。

### 2026-09-20：J3 链接数组合同切片（`6aeae85`）

对照 canonical Java 的 `TermLink`、`TaskLink`，确认索引字段原始类型是 `short[]`，
判等和哈希依赖 `Arrays.equals`、`Arrays.hashCode`；`TermLink` 还依赖
`Objects.hash`。本批新增 `src/runtime/JavaArrays.ts`，以原生 `Int16Array` 保留
null、长度、顺序、short 值和 Java 31 倍哈希语义；两个链接类删除直接 jree 导入，
异常仍通过 `JavaIllegalArgumentException` 保持兼容观察面。

- 代码提交：`6aeae85 refactor(023): 原生化链接数组合同`，基线为 `78dac6a`。
- 计划器：J3 owner、J1 supporting、T1、`plan_valid=true`，不要求 M1-。
- 直接测试：`21/21`；串行统一单测：`351` 项，`349` 通过、`2` 跳过、`0` 失败。
- 非增量 `tsc=0`；build、dist API、迁移扫描、jree/platform 审计均通过。
- 审计前→后：直接 jree 导入 `77→75`，`java.util` 文件 `27→25`，
  `java.lang` 文件 `76→74`。
- 受影响 NAL：`5/5` functional/parity；0 exception、0 marker missing、0 stall、
  0 timeout、0 process limit、0 Java/TS diff。冻结标杆未改变，本批未运行 live Java、
  M1- 或 #245。
- 证据：`H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\j3-link-arrays-20260920-sentinel.jsonl`。
- 证据 SHA-256：`310FF5E595282CEF62C0FD16111804EDA68B8866DA293CD9151CB47B1E76A987`。

本批只完成 J3 一个链接数组边界切片，不能勾选 J3/023 完成。下一步优先拆解
J1 异常桥责任，保留 `instanceof`、`getMessage()` 和继承关系；J2 count Map 与
J3 `introduceVariables` 的 Set/Map 继续按共同合同推进。

### 2026-09-20：J1 原生断言错误合同切片（`b640677`）

本批处理 J1 异常桥中最小且没有通用捕获链的 `AssertionError` 合同。新增
`src/runtime/JavaExceptions.ts`，以无 jree 运行时导入的 `JavaThrowable`、`JavaError`、
`JavaException`、`JavaRuntimeException` 建立项目内异常层级，并将
`JavaAssertionError` 接入 `jree-compat.ts` 的兼容导出。保留 `getMessage()`、localized
message、cause、`instanceof Error` 和异常名称；没有迁移 `IllegalArgument/StateException`，
避免先改变抛出端而遗漏 `java.lang.Exception` 捕获端。

- 代码提交：`b640677 refactor(023): 原生化断言错误合同`，基线 `72d2e92`。
- 计划器：J1 owner、T1、`plan_valid=true`；不要求 M1-，要求 J1 定向合同和 3 个 NAL。
- 定向测试 `13/13`；串行 M2 `354` 项，`352` 通过、`2` 跳过、`0` 失败；非增量
  `tsc=0`；build、dist API、迁移扫描、平台审计通过。
- 受影响 NAL `3/3` functional/parity；0 exception、0 marker missing、0 stall、
  0 timeout、0 process limit、0 Java/TS diff。
- 证据位于项目外：
  `H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\j1-exception-assertion-20260920-sentinel.jsonl`。
- 证据 SHA-256：`5A88870C71349172E6067C4841F4B98E3B901D96A374718D5F1E16D5EA95D3C6`。

本批只完成 J1 的一个异常合同切片，不能勾选 J1、023 或 jree 清零。下一批继续
处理 `IllegalArgument/StateException`，要求抛出、捕获、消息和 cause 一起迁移。

### 2026-09-20：J1 Java 异常族原生化（`caf6516`）

本批把 J1 异常族从 jree 子类迁移到 `src/runtime/JavaExceptions.ts`：
`JavaIllegalArgumentException`、`JavaIllegalStateException`、`JavaIllegalAccessError`、
以及 jree 缺失的 checked-exception 类型均继承项目内的 Java 风格异常层级。
`JavaThrowable.printStackTrace` 支持显式 `println` 输出边界。为避免直接迁移生产者后使
旧捕获端失效，`src/runtime/jree-compat.ts` 暂时通过 `Symbol.hasInstance` 保留
`java.lang.Throwable/Error/Exception/RuntimeException/IllegalArgumentException/
IllegalStateException` 的观察面；这是过渡适配，不是最终核心依赖。

- 代码提交：`caf6516 refactor(023): 原生化Java异常合同`，基线 `4481d7e`。
- 计划器：J1-runtime-compat、T1、`plan_valid=true`；`live_java_required=false`、
  `m1_minus_required=false`、`full_m1_required=false`。
- 串行 M2：`npm test` 为 `355` 项，`353` 通过、`2` 跳过、`0` 失败；非增量
  `tsc=0`；build 源文件 `139`；dist API、迁移扫描、jree/platform 审计均通过。
- 受影响 NAL：`nal1.0.nal`、`nal6.17.nal`、`toothbrush.nal`，冻结 Java 标杆、
  TS-only、单线程、cold、1550 周期串行为 `3/3` functional/parity；0 exception、
  0 marker missing、0 stall、0 timeout、0 process limit、0 Java/TS diff。
- 项目外证据：
  `H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\j1-exception-family-20260920-sentinel.jsonl`；
  SHA-256 `DC9D4F95CD6585DC2A10CC6EE93F535B11856BD5C6891D1A159589314DE1C4FF`。
- 当前生产 jree 审计为 `directJreeImportFiles=75`、`newLinkedHashSet=1`、
  `javaObjectFiles=1`、`javaUtilFiles=25`、`javaLangFiles=74`；异常仍经桥接导出，
  不得把本批写成 jree 清零。

本批只完成 J1 异常实现层和兼容观察面的验证，不勾选 J1、023 或发布门。下一批应先
审查并迁移 `Shell`、`Operator`、`Nar`、`NarNode`、`TextOutputHandler` 的直接异常
捕获端；在这些捕获端有直接回归以前，不得删除 `Symbol.hasInstance` 适配。随后再按
Java 原始合同推进 J3 `introduceVariables` 的嵌套 Set/Map。

#### 023 责任簇导航

```text
023 jree 原生 TypeScript 运行时     [##--------] 进行中
├─ J1 runtime compat                [####------] 异常族已迁，捕获端/桥接清理待做
├─ J2 language/parser                [####------] List/Map/Set 多个局部合同已验证
├─ J3 inference core                 [####------] Map/List/Set/float/short[] 已验证
├─ J4 operator/plugin                [##--------] 局部反馈/字符串/插件边界已验证
└─ J5 main/host                     [#---------] 入口宿主边界待推进
```

### 2026-09-20：异常捕获边界按责任簇拆分

本批先发现：把 J1 兼容桥、J4 Operator 和 J5 主入口放在同一个提交会使验证计划
失败关闭。初次尝试 `d681592` 未推送，随后用 `d26255e` 回退，并按责任簇拆成三个
可独立验证的提交；这不是业务回退，而是修复提交边界和门禁证据。

- `14cbdf4`（J1）：在 `jree-compat.ts` 集中提供 `isJavaThrowable`、
  `isJavaException`，同时识别原生异常和仍可能存在的旧 jree 异常；3 个 J1 哨兵
  `3/3` 通过。
- `d2b4116`（J4）：Operator 的异常生产、捕获和执行反馈改用项目内异常合同；4 个
  J4 哨兵 `4/4` 通过。
- `247bc3c`（J5）：Shell、Nar、NarNode、TextOutputHandler 统一异常捕获边界，Nar
  推理错误包装改用原生异常；3 个 J5 哨兵 `3/3` 通过。
- 三批均使用冻结 Java baseline JSONL，SHA-256 为
  `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`，未现跑 Java。
- 最终组合 M2：`npm test` 为 `355` 项，`353` 通过、`2` 跳过、`0` 失败；非增量
  `tsc=0`；build `139` 个源文件；dist API、迁移扫描、平台审计均通过。
- 证据位于项目外：J1 `j1-exception-helper-20260920-sentinel.jsonl`，SHA
  `E36EF575A438A83384DC54981033D73E16F4482FED16A718D2B5C187C19E3444`；J4
  `j4-operator-exception-20260920-sentinel.jsonl`，SHA
  `A571E3E397761EF0412C12DC71207DA0DD830C1A4941B1C63E3846A876CB3E52`；J5
  `j5-entry-exception-20260920-sentinel.jsonl`，SHA
  `464B482FE5ECD7A7820DA1A34021E046BA049D98939DFFD35EF55702325CD6BD`。

当前只完成异常观察边界切片，不能勾选 J1/J4/J5 或 023 完成；不能宣称 jree 清零、
完整 M1/#245 当前候选通过或 Java/TypeScript 性能等价。下一步按同簇异常生产者继续
迁移，待所有生产者和直接回归收口后，才删除异常 `Symbol.hasInstance` 过渡桥；随后
继续 `introduceVariables` 的嵌套 Set/Map 合同。

### 2026-09-20：J4 `Anticipate`/`Operator.call` 异常边界切片（`123a212`）

本批继续 J4 Operator/Plugin 责任簇的异常生产者收口。对照 canonical Java，确认
`Anticipate` 的非法构造器参数和 `Operator.call` 的非法参数数量都是 TypeScript 为
保留 Java overload 运行时防线而存在的边界；本批只将它们改为项目
`JavaIllegalArgumentException`，保留消息、合法路径、旧 jree `instanceof` 观察面和
推理算法。没有把该异常切片扩大为字符串、数组、插件或输出边界迁移。

- 代码提交：`123a212a07e147f19670a05a43eb5d7f61db3828`。
- 直接合同测试：`9/9`；覆盖 Anticipate 非法构造器和 Operator.call 非法 overload。
- 串行 `npm test`：`361` 项，`359` 通过、`2` 跳过、`0` 失败；非增量 `tsc=0`；build `139` 个源文件；dist API 通过。
- 计划器：J4 owner、T1、`plan_valid=true`、不需要 live Java、M1- 或完整 M1。
- 受影响 NAL：`nal9.believe1.nal`、`nal9.wonder1.nal`、`vision.nal`、
  `simpleOperationTest.nal`，冻结 Java 标杆 TS-only 串行结果 `4/4` functional/parity；
  0 exception、0 marker missing、0 stall、0 timeout、0 process limit、0 not-run、0 Java/TS diff。
- 项目外证据：`H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\anticipate-operator-exception-20260920-sentinel.jsonl`；
  SHA-256 `F1E74BB0D9CEF993A524CDF425CB8CAE0562BB463B951E765F99234E2C193322`。
- 当前 jree 审计：直接导入文件 `75`、`java.util=25`、`java.lang=72`、Java String `47`、
  high-risk `41`、semantic-review `74`、candidate-native `2`、`newLinkedHashSet=1`；
  `jree@1.3.0` 仍为声明依赖。

本批可以宣称 J4 两个异常生产点已完成项目异常边界迁移并通过 M2 与受影响 NAL；
不能勾选 J4 或 023 完成，也不能宣称 jree 清零、当前候选完整 M1/#245、源码覆盖率
或性能等价。J4 仍有字符串、数组、插件和输出边界残余，因此本批不运行 M1-。

#### 当前阶段与完整项目导航

```text
OpenNARS-304-ts
├─ F0/F1/F2/F3 Java canonical、M1、M2、G0    [##########] 完成
├─ 023 去 jree 原生运行时                       [##--------] 进行中
│  ├─ J1 runtime compat                         [####------] 异常类/观察函数已迁，桥清理待做
│  ├─ J2 language/parser                         [####------] List/Map/Set 多个合同切片已验证
│  ├─ J3 inference core                         [####------] Map/List/Set/float/short[] 已验证
│  ├─ J4 operator/plugin                        [###-------] 数组/字符串/异常切片已验证，未收口
│  └─ J5 main/host                              [##--------] 异常观察已验证，宿主边界未收口
├─ 024 平台中立核心与宿主适配                    [##--------] P0-P2 完成，P3-P5 未完成
├─ I 集成回归                                   [----------] 待开始
├─ O 正式性能门                                 [----------] 待开始
└─ R RC/bundle/tag                             [----------] 待开始

LeanSpec registry: 15 specs
├─ complete       10/15  [##########----------] 67%
└─ in-progress     5/15  [#####---------------] 33%

Spec checklist snapshot: 89/111
├─ checked         89  [################----] 80.2%（仅登记规格条目，不是产品完成率）
└─ open            22  [####----------------] 19.8%
```

后续优先级：先按 Java 合同审查 J4 的 StringBuilder/String/数组复制和公共类型边界，
再补 J3 `introduceVariables` 的嵌套 Set/Map 合同，随后继续 J1 异常生产/捕获端与桥接
清理。普通切片复用冻结 Java 标杆；责任簇出口才运行一次 M1-，023/024 阶段验收再
现跑 live Java、完整 245+1 与严格 markerless 长测。

#### 本批后的导航进度

```text
023 jree 原生 TypeScript 运行时     [##--------] 进行中
├─ J1 runtime compat                [####------] 异常类/观察函数已迁；生产者/桥清理待做
├─ J2 language/parser               [####------] List/Map/Set 多个切片已验证，未收口
├─ J3 inference core                [####------] Map/List/Set/float/数组切片已验证，未收口
├─ J4 operator/plugin               [###-------] 数组/字符串/异常切片已验证，未收口
└─ J5 main/host                    [##--------] 异常观察切片已验证，平台边界待做

验证链
冻结 Java 标杆 ──> 同簇切片 ──> 局部合同 + 串行 M2 + 2~5 NAL
                         └────> 簇出口满足后一次 M1- ──> 023 阶段门
```

### 2026-09-20：J4 `Operation`/`NullOperator` 异常生产者切片（`9c9a71d`）

对照 canonical Java `Operation.java` 与 `NullOperator.java`，本批确认 Java 只暴露
固定构造器/工厂签名；TypeScript 为保留运行时 overload 防线而保留非法参数分支。
`Operation.ts` 的 2 个非法参数路径和 `NullOperator.ts` 的构造器路径改用项目内
`JavaIllegalArgumentException`，保留 Java 原始消息、合法重载、Operation 类型和
NullOperator 名称行为；没有修改推理规则。

- 代码提交：`9c9a71d69c3c4d4edb4e2175b4c9c1071912f1e3`。
- T1 J4 计划：`plan_valid=true`、`live_java_required=false`、`m1_minus_required=false`。
- 串行 M2：356 项，354 通过、2 跳过、0 失败；非增量 `tsc=0`；build 139 个源文件。
- 受影响 NAL：4/4 通过；使用冻结 Java JSONL，未启动 Java。
- 证据：项目外 `operation-nulloperator-exception-20260920-sentinel.jsonl`，SHA-256
  `8B5804243A8129A6F3BD0459989CBA91BC32C79B2251497E075D02B8FA97D558`。

本批不能勾选 J4 或 023 完成。下一批继续 `FunctionOperator`、`Add`、`Reflect` 的
异常生产者合同；J4 收口前不运行 M1-，所有生产者和捕获端收口前不删除
`jree-compat.ts` 异常兼容桥。

### 2026-09-20：J4 `FunctionOperator` 异常生产者切片（`3f2a050`）

对照 canonical Java `FunctionOperator.java`，本批确认 `numArgs < 1`、`numArgs < 2`
分别对应 `IllegalStateException`；TypeScript equals 重载防线的非法参数对应
`IllegalArgumentException`。本批将 3 个生产点切换到项目内异常类型，保留消息、参数
计算、数组复制、Task 生成和真值/预算计算，没有修改推理算法。

- 代码提交：`3f2a0504a648ba54e59e7acb1cd4d9d18e63970c`。
- T1 J4 计划：`plan_valid=true`、`live_java_required=false`、`m1_minus_required=false`。
- 串行 M2：357 项，355 通过、2 跳过、0 失败；非增量 `tsc=0`；build 139 个源文件。
- 受影响 NAL：4/4 通过；使用冻结 Java JSONL，未启动 Java。
- 证据：项目外 `functionoperator-exception-20260920-sentinel.jsonl`，SHA-256
  `2BB402B3E0A387B16449AA33698076D3E8F38753B9993A6205DB6C177B5941AF`。

本批不能勾选 J4 或 023 完成。下一批继续 `Add`/`Reflect` 异常生产者合同；J4 收口
前不运行 M1-，所有异常生产者和捕获端收口前不删除 `jree-compat.ts` 异常兼容桥。

### 2026-09-20：J4 `Add` 异常生产者切片（`a91d928`）

对照 canonical Java `Add.java`，本批确认参数数目错误对应 `IllegalStateException`，
两个非法整数参数分别对应 `IllegalArgumentException`。本批将三个生产点切换到项目内
异常类型，保留 Java 数字判断、整数解析、整数相加、结果 Term 和消息文本。

- 代码提交：`a91d92825200af1bae759eb15feff22fcf818578`。
- T1 J4 计划：`plan_valid=true`、`live_java_required=false`、`m1_minus_required=false`。
- 直接合同：覆盖参数数量、两个非法整数参数、异常消息、旧 jree `instanceof` 和正常结果。
- 串行 M2：358 项，356 通过、2 跳过、0 失败；非增量 `tsc=0`；build 139 个源文件。
- 受影响 NAL：4/4 通过；使用冻结 Java JSONL，未启动 Java。
- 证据：项目外 `add-exception-20260920-sentinel.jsonl`，SHA-256
  `2CD49FC9C1BE20774F8396F449C91D45C4D2D187973F485D4D15144786D83F1A`。

本批不能勾选 J4 或 023 完成。下一批继续 `Reflect`，再处理 `Anticipate`/`Operator`；
J4 收口前不运行 M1-，异常生产者和捕获端收口前不删除 `jree-compat.ts` 异常兼容桥。

### 2026-09-20：J4 `Reflect` 异常生产者切片（`8815a86`）

对照 canonical Java `Reflect.java`，本批确认 `function` 参数数目错误对应
`IllegalStateException`，静态 `sop` 非法 overload 对应 `IllegalArgumentException`。
本批将两个生产点切换到项目内异常类型，保留 Reflective-Narsese、Term 构造、overload
分派和消息文本。

- 代码提交：`8815a86cae4488c57fc2c575d1e7dd44ce830c10`。
- T1 J4 计划：`plan_valid=true`、`live_java_required=false`、`m1_minus_required=false`。
- 直接合同：覆盖错误参数、原子 Term 正常返回、静态 `sop()` 错误 overload、异常消息和旧 jree `instanceof`。
- 串行 M2：359 项，357 通过、2 跳过、0 失败；非增量 `tsc=0`；build 139 个源文件。
- 受影响 NAL：4/4 通过；使用冻结 Java JSONL，未启动 Java。
- 证据：项目外 `reflect-exception-20260920-sentinel.jsonl`，SHA-256
  `C2706A3FF18FA75D13ACEF20E3BB71B4FB216B95FA7DEB377F71B3A632A59E07`。

本批不能勾选 J4 或 023 完成。下一批继续 `Anticipate`/`Operator`；J4 收口前不运行
M1-，异常生产者和捕获端收口前不删除 `jree-compat.ts` 异常兼容桥。

### 2026-09-20：J4 `Operation.makeName` 字符串边界切片（`20b519a`）

对照 canonical Java `Operation.makeName`，确认其 `StringBuilder` 只承担固定顺序的
`append` 与最终 `toString()`：开括号、operator 文本、逗号分隔的 `Term.name()`、闭括号。
没有容量复用、插入/删除、共享可变 builder 或中途暴露 builder 的语义，因此本批将局部
实现替换为原生字符串拼接；公开返回类型仍保留 `java.lang.CharSequence`，并通过
`javaStringValue` 处理 Java `String` 与原生字符串边界。没有改变 Operation 名称文本、
推理规则或公共调用合同。

- 代码提交：`20b519ab15164ccb864664d1c217dc4d587deb45`，基线为 `6ecac1d`。
- 直接回归：Java `String` operator、多参数顺序、空参数共 `2` 个测试断言通过。
- 串行 M2：`npm test` 为 `362` 项，`360` 通过、`2` 跳过、`0` 失败；非增量 `tsc=0`；
  build `139` 个源文件；dist API 通过。
- 计划器：J4 owner、T1、`plan_valid=true`；不要求 live Java、M1- 或完整 M1。
- 受影响 NAL：`nal9.believe1.nal`、`nal9.wonder1.nal`、`vision.nal`、
  `simpleOperationTest.nal`，冻结 Java 标杆 TS-only 对照 `4/4` functional/parity；0
  exception、0 marker missing、0 stall、0 timeout、0 process limit、0 not-run、0 Java/TS diff。
- 证据：`H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\operation-makename-20260920-sentinel.jsonl`；
  SHA-256 `AE5A4CD9119C9CA264998056DE4B53D136F9D95229A7A8EFF86BAA78F2E5ED3A`。
- 冻结 Java 标杆 JSONL SHA-256：`264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`；
  Java source commit `8675b76fe8c21ee20a7b8c1b63408fb05327210d`；artifact SHA-256
  `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`。
- 审计：migration scan `248` 文件，`java-string-method=235/63`、
  `java-collection-method=744/108`、`jree-runtime-type=1409/135`；jree direct import files
  `75`、`newLinkedHashSet=1`、`javaObjectFiles=1`、`javaUtilFiles=25`、`javaLangFiles=72`、
  `javaStringFiles=47`。direct jree 数未下降是预期结果：`Operation` 仍保留 Java 类型与异常边界。

本批只完成 J4 一个低风险字符串实现切片，不能勾选 J4 或 023 完成，也不能宣称 jree
清零、完整 M1/#245 当前候选重跑、源码覆盖率、性能等价或正式发布。下一批优先审查
J4 `FunctionOperator` 的 `System.arraycopy`/数组边界与 `Operator` 公共 CharSequence/List
边界，随后处理 J3 `introduceVariables` 嵌套 Set/Map；责任簇收口前继续使用冻结 Java
标杆，不运行 M1-。

### 2026-09-20：J4 `FunctionOperator` 参数复制边界切片（`b75137f`）

对照 canonical Java `FunctionOperator.execute`，确认 Java 使用新建的 `Term[numParam]`
并执行 `System.arraycopy(args, 1, x, 0, numParam)`。上游 `numArgs` 检查确保复制区间
合法；目标数组与源数组不重叠，函数只接收浅复制后的参数引用。因此本批以
`args.slice(1, 1 + numParam)` 替换这一 jree 运行时调用，保留参数顺序、引用元素和新数组
身份；没有改变 arity、函数派发、推理结果或 Operation 更新逻辑。没有勾选 J4 或本 spec
完成，责任簇收口前仍使用冻结 Java 标杆，不运行 M1-。

- 代码提交：`b75137f67e499eee35138d731190d0a37f3b1d8e`，基线为 `9ca9ffc`。
- 直接合同：`operator-boundary.test.ts` `11/11`，新增测试同时断言参数内容和新数组身份。
- 串行 M2：`npm test` 为 `363` 项，`361` 通过、`2` 跳过、`0` 失败；耗时约 `107833 ms`。
- 非增量 `tsc=0`；build `139` 个源文件；dist API 通过。
- 计划器：J4 owner、T1、`plan_valid=true`；不要求 live Java、M1- 或完整 M1。
- 受影响 NAL：`nal9.believe1.nal`、`nal9.wonder1.nal`、`vision.nal`、
  `simpleOperationTest.nal`，TS-only 冻结标杆对照 `4/4` functional/parity；0 exception、
  0 marker missing、0 stall、0 timeout、0 process limit、0 not-run、0 Java/TS diff。
- 证据：`H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\functionoperator-arraycopy-20260920-sentinel.jsonl`；
  SHA-256 `B00E415B046161810EFD3CC0B5D53CE1550EC84C68E7706D6F67B6FE257E758E`。
- 冻结 Java 标杆 JSONL SHA-256：`264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`；
  Java source commit `8675b76fe8c21ee20a7b8c1b63408fb05327210d`；artifact SHA-256
  `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`。
- 审计：migration scan `248` 文件，`java-collection-method=749/108`、
  `jree-runtime-type=1408/135`；jree direct import files `75`、`newLinkedHashSet=1`、
  `javaObjectFiles=1`、`javaUtilFiles=25`、`javaLangFiles=72`、`javaStringFiles=47`；
  platform 扫描 `185` 文件，核心候选 `70`。direct jree 数不变是预期结果：本批只移除
  `System.arraycopy` 调用，`FunctionOperator` 仍保留 Java 类型边界。

本批可以宣称 J4 一个参数数组复制切片完成 M2/T1 哨兵验证；不能宣称 J4、023 收口，
jree 清零，完整 M1/#245 当前候选重跑，源码覆盖率，性能等价或正式发布。下一批优先
继续 J4 `Operator` 公共 CharSequence/List 边界，然后处理 J3 `introduceVariables` 的
Set/Map 合同。

### 2026-09-20：J4 `OperatorFeedback` 反馈序列边界切片（`1bfcf8c`）

对照 canonical Java `Operator.execute`，确认 Java 的声明类型是 `List<Task> | null`，
但当前 TypeScript 的全部 operator 实现都只产生临时、有序的 `Task[] | null`；`Operator.call`
只读取反馈是否为空并按顺序迭代，没有调用 List 的插入、删除或索引能力。因此本批建立
项目内命名合同 `OperatorFeedback = Task[] | null`，收窄 `Operator.execute`、`Operator.call`
和 `Anticipate.execute`，并将两个 Java `List` 的 null 强制转换改为真实 `null`。这不是
将领域 Set/Map 机械替换成数组，而是对已审计的 transient operator feedback 进行窄化；
CharSequence、java.lang.Object 和异常桥仍保留在后续边界批次。本批不勾选 J4 或本 spec
完成，责任簇收口前继续使用冻结 Java 标杆，不运行 M1-。

- 代码提交：`1bfcf8ce3a210a293f720155fc9f6bcc34edab2f`，基线为 `6e21b11`。
- 直接合同：`operator-boundary.test.ts` `12/12`，覆盖 null 和空有序反馈的 executedTask
  语义以及不误派发输入任务。
- 串行 M2：`npm test` 为 `364` 项，`362` 通过、`2` 跳过、`0` 失败；非增量 `tsc=0`；
  build `139` 个源文件；dist API 通过。
- 计划器：J4 owner、T1、`plan_valid=true`、`live_java_required=false`、
  `m1_minus_required=false`、`full_m1_required=false`。
- 受影响 NAL：`nal9.believe1.nal`、`nal9.wonder1.nal`、`vision.nal`、
  `simpleOperationTest.nal`，TS-only 冻结标杆对照 `4/4` functional/parity；0 exception、
  0 marker missing、0 stall、0 timeout、0 process limit、0 not-run、0 Java/TS diff。
- 证据：`H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\operator-feedback-20260920-sentinel.jsonl`；
  SHA-256 `4B1CD04CA0C00C47956266569926FD2351B7B0000F16E82DD04310AE677898DC`。
- 冻结 Java 标杆 SHA-256：`264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`；
  Java source commit `8675b76fe8c21ee20a7b8c1b63408fb05327210d`；artifact SHA-256
  `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`。
- 审计：migration scan `248` 文件，`java-string-method=234/62`、
  `java-collection-method=750/108`、`jree-runtime-type=1403/135`；jree direct import files
  `75`、`javaUtilFiles=25`、`javaLangFiles=72`、`javaStringFiles=47`；platform 扫描
  `185` 文件，核心候选 `70` 个。

本批可以宣称 J4 的 operator feedback `List/null/empty` 边界完成局部合同、M2、T1
受影响 NAL 验证；不能宣称 J4/023 收口、jree 清零、完整 M1/#245 当前候选重跑、源码
覆盖率、性能等价或正式发布。下一批继续审查 `Operator` 的 CharSequence/Object 输出边界，
仍保持 J4 单簇。

### 2026-09-20：J4 `Operator` 对象反馈边界切片（`3585f6a`）

对照 canonical Java `Operator.java`，确认 `reportExecution` 与内部 `ExecutionResult` 的
`Object feedback` 只承担任意事件载荷：异常时读取类名与消息并文本化，随后作为 EXE
事件传递；没有使用 JavaObject 身份、反射或 Object 方法契约。因此只将 4 处 TypeScript
静态边界从 `java.lang.Object` 收窄为 `unknown`，保留 Java `String` 包装、异常识别、
事件输出和反馈序列行为。`operationExecutionString` 仍返回 Java `String`，且当前无调用者，
未与本批混改。没有勾选 J4 或本 spec 完成，责任簇收口前继续使用冻结 Java 标杆，不运行 M1-。

- 代码提交：`3585f6ac5f19895da3bc184fbad5ea64909388ac`，基线为 `e5602d7`。
- 直接合同：`operator-boundary.test.ts` `13/13`。
- 串行 M2：`npm test` 为 `365` 项，`363` 通过、`2` 跳过、`0` 失败，耗时约 `102775.7389 ms`；
  非增量 `tsc=0`；build `139` 个源文件；dist API `cycles=2`、`cycleEnds=2`、`outputSignals=1`、
  `stopped=true`。
- 计划器：J4 owner、T1、`plan_valid=true`、`live_java_required=false`、
  `m1_minus_required=false`、`full_m1_required=false`。
- 受影响 NAL：`nal9.believe1.nal`、`nal9.wonder1.nal`、`vision.nal`、
  `simpleOperationTest.nal`，TS-only 冻结标杆对照 `4/4` 通过，0 失败。
- 证据：`H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\operator-object-output-20260920-sentinel.jsonl`；
  SHA-256 `9B91D20B4442BB4C4FD003BFCA0D3A1D165987A1DBDF5E47CF980E240FB4552C`。
- 冻结 Java 标杆 JSONL SHA-256：`264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`；
  Java source commit `8675b76fe8c21ee20a7b8c1b63408fb05327210d`；artifact SHA-256
  `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`。
- 审计：migration scan `248` 文件，`java-string-method=234/62`、`java-collection-method=751/108`、
  `jree-runtime-type=1398/135`；jree summary `directJreeImportFiles=75`、`newArrayList=0`、
  `newLinkedHashMap=0`、`newLinkedHashSet=1`；platform `filesScanned=185`、
  `coreCandidateFiles=70`、`jreeImportFiles=82`。

本批可以宣称 J4 一个 `Object` 事件载荷边界完成局部合同、M2、T1 受影响 NAL 验证；不能
宣称 J4/023 收口、jree 清零、完整 M1/#245 当前候选重跑、源码覆盖率、性能等价或正式发布。
下一批优先继续审查 J4 剩余 `CharSequence`/Java `String` 输出边界，仍保持单簇和 Java 合同先行。

#### 当前阶段导航树（不代表产品完成率）

```text
023 jree 原生 TypeScript 运行时                 [##--------] 进行中
├─ J1 runtime compat                            [####------] 异常/观察函数已迁，桥清理待做
├─ J2 language/parser                            [####------] 字符串/解析/List/Map/Set 局部合同
├─ J3 inference core                            [####------] Map/List/Set/float/数组局部合同
├─ J4 operator/plugin                           [####------] 异常/数组/反馈/Object 边界，未收口
└─ J5 main/host                                [##--------] 异常观察已验证，宿主边界待做
024 平台中立核心与宿主适配                       [##--------] P0-P2 完成，P3-P5 未完成
I J/P 汇合集成回归                              [----------] 待开始
O 正式性能门                                    [----------] 待开始
R RC/bundle/tag                                [----------] 待开始

J4 切片序列：异常生产者/捕获 → Operation 字符串 → FunctionOperator.arraycopy
          → OperatorFeedback List/null/empty → Operator Object 事件载荷（3585f6a）
```

### 2026-09-20：J4 `Operator.operationExecutionString` 原生文本边界切片（`5c8042b`）

对照 canonical Java `Operator.operationExecutionString`，确认该方法只读取 operator 与
Product 参数的最终文本，没有 TypeScript 调用者，也没有 Java `String` 对象身份、反射或
可变方法的消费。将局部 `java.lang.String` 中间值和返回包装改为原生 `string`，保留
Product 前缀 `"(*,"` 的 `substring(3)` 规则、operator 文本与参数顺序；`addPrefixIfMissing`
仍在 Narsese 活跃解析链中，本批不混改。

- 代码提交：`5c8042b173fed85762df2c4ce603f3747dfa15d4`，测试补强与阶段文档提交为 `6e6f873`，基线为 `ec3e014`。
- 直接合同：`operator-boundary.test.ts` `14/14`，新增 `typeof` 与 `^add(a,b)` 断言。
- M2：串行 `npm test` `366` 项，`364` 通过、`2` 跳过、`0` 失败；非增量 `tsc=0`；
  build `139` 个源文件；dist API 通过。
- 计划器：J4 owner、T1、`plan_valid=true`、`live_java_required=false`、
  `m1_minus_required=false`、`full_m1_required=false`；未运行 M1-/#245。
- 受影响 NAL：`nal9.believe1.nal`、`nal9.wonder1.nal`、`vision.nal`、
  `simpleOperationTest.nal` 共 `4/4`，0 exception、0 marker missing、0 stall、0 timeout、
  0 process limit、0 Java/TS diff；TS 单线程 cold。
- 证据：`H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\operator-execution-text-20260920-sentinel.jsonl`；
  SHA-256 `E99B718DCE8724AE9EB9611AADC22B5E884BF698F98FE5F57C59C5D1D64D7F1C`。
- 当前审计：migration scan `248` 文件，`java-string-method=234/62`、
  `java-collection-method=753/108`、`jree-runtime-type=1394/135`；jree summary
  `directJreeImportFiles=75`、`newArrayList=0`、`newLinkedHashMap=0`、`newLinkedHashSet=1`、
  `javaObjectFiles=1`；platform summary `185` 文件、`coreCandidateFiles=70`、
  `jreeImportFiles=82`。

本批只完成 J4 一个无调用者的执行文本边界，不能勾选 J4 或本 spec 完成；不能宣称
jree 清零、完整 M1/#245 当前候选重跑、源码覆盖率、性能等价或正式发布。下一批先审查
`addPrefixIfMissing` 的 Java/TS 输入输出合同，再决定是否需要带一个 J2 支持文件迁移。

### 2026-09-20：J4 `Operator.addPrefixIfMissing` 原生前缀文本边界切片（`cd38595`）

对照 canonical Java `Operator.addPrefixIfMissing(String)` 与 `Narsese.parseTerm` 的活跃调用链，确认 Java 合同只检查 `^` 前缀并返回最终文本。TypeScript 将输入收窄为项目 `JavaStringInput`，通过 `javaStringValue` 取得文本，使用原生 `startsWith` 与模板字符串生成原生 `string`；Narsese 只同步一个支持性局部类型点。

- 代码提交：`cd3859574d1bd8cddc98096edb3b513ac3a762d3`；本批仍未勾选本 spec 完成。
- 直接合同：boxed/native 输入、已有/缺失前缀、原生返回形状与 `add(a,b)` 解析共 `18/18` 通过。
- 计划器：`T1`，owner=`J4-operator-plugin`，supporting=`J2-language-parser`，`plan_valid=true`、`live_java_required=false`、`m1_minus_required=false`、`full_m1_required=false`；受影响 NAL 为 `5` 个。
- M2：串行 `npm test` `368` 项，`366` 通过、`2` 跳过、`0` 失败，耗时 `103651.5096 ms`；非增量 typecheck `0` 诊断；build `139` 个源文件；dist API 通过。
- 受影响 NAL：`nal9.believe1.nal`、`nal4.7.nal`、`nal9.wonder1.nal`、`vision.nal`、`simpleOperationTest.nal` 共 `5/5`，0 failure；证据 SHA-256 `FBEDFB0B258A899691A482F2AB84157872E77BDAA3D4C85E6CA498F976756AB9`。
- 审计：migration scan `248` 文件，`java-string-method=234/62`、`java-collection-method=753/108`、`jree-runtime-type=1390/135`；jree summary `directJreeImportFiles=75`、`newLinkedHashSet=1`；platform summary `185` 文件、`coreCandidateFiles=70`、`jreeImportFiles=82`。

本批只能宣称 J4 前缀文本边界及其 J2 解析支持点完成局部合同、串行 M2、构建、dist API 与 5 个受影响 NAL 验证；不能宣称 J4/023 收口、jree 清零、完整 M1/#245 当前候选重跑、源码覆盖率、性能等价或正式发布。下一批首选审查 `Add.function` 的 Java/TS 数值文本合同；当前 TS 的 `isNumeric` 带 `.trim()`，必须先锁定其与 Apache `StringUtils.isNumeric` 的边界，再决定去掉该文件的直接 jree 导入。

### 2026-09-20：J4 `Reflect` 原生字符串边界切片（`921fb10`）

对照 Java `Reflect.java`，确认 `sop` 四组重载和 `getMetaTerm` 元项递归结构。本批只移除
直接 `jree`/`S` 导入：用 `JavaStringInput` 描述 Java/native 字符串重载，用
`javaStringValue` 归一化 operator name 与 `Term.get` 输入，保留异常消息和原有元项构造。

- 代码提交：`921fb10`；基线为 `180ec03`。
- 直接合同：`operator-boundary.test.ts` `17/17`；串行 M2 `370` 项，`368` 通过、`2` 跳过、
  `0` 失败；非增量 `tsc=0`；build `139` 个源文件；dist API 通过。
- 计划器：J4 owner、T1 risk-slice；`live_java_required=false`、`m1_minus_required=false`、
  `full_m1_required=false`。
- 受影响 NAL：4/4 通过，0 exception、0 marker missing、0 stall、0 timeout、0 process limit、
  0 Java/TS diff。证据 SHA-256：`4B8404B37715BCD4CADF642E662F19CE485BB0EBE43389C25B37DBA6A9C899E5`。
- 审计变化：direct jree import files `74→73`；migration `jree-runtime-type` `1385/134→1382/133`；
  platform `coreCandidateFiles` `69→68`、`jreeImportFiles` `81→80`。

本批没有勾选 J4 或 023 完成，也没有运行 M1-。下一步先补 `Statement` 重载的真实调用对照，
再继续剩余 J4 字符串/异常边界。

### 2026-09-20：J4 `Operator` 原生字符串边界切片（`a37ed46`、`551e2ce`）

对照 Java `Operator.java`，确认构造器、异常反馈和 `ExecutionResult.toString` 的可观察文本
合同。本批以 `JavaStringInput`、`toJavaString`、`javaStringValue` 和局部
`javaArrayToString` 移除直接 `jree`/`S` 依赖；执行、反馈派发和 Java 异常类型不变。首次
尝试遗漏了 `Operator.call` 默认分支的 `S`，产生 `ReferenceError`，已在 `551e2ce` 修复。

- 代码提交：`a37ed46`、`551e2ce`；基线为 `0818515`。
- 直接合同：`operator-boundary.test.ts` `17/17`；串行 M2 `370` 项，`368` 通过、`2` 跳过、
  `0` 失败；非增量 `tsc=0`；build `139` 个源文件；dist API 通过。
- 计划器：J4 owner、T1 risk-slice；`live_java_required=false`、`m1_minus_required=false`、
  `full_m1_required=false`。
- 受影响 NAL：4/4 通过，0 exception、0 marker missing、0 stall、0 timeout、0 process limit、
  0 Java/TS diff。证据 SHA-256：`465C63FAFAA992A00BF23D2255443C9CC508EB5F69BC89D2BFBFD8DCEDAE3133`。
- 审计变化：direct jree import files `73→72`；migration `jree-runtime-type` `1382/133→1376/132`；
  platform `coreCandidateFiles` `68→67`、`jreeImportFiles` `80→79`。

本批没有勾选 J4 或 023 完成，也没有运行 M1-。下一步继续审查 `FunctionOperator` 与
`NullOperator` 的剩余字符串/异常桥接，但仍需先对照 Java 合同再拆批。

#### 当前阶段进度树

```text
023 jree 原生 TypeScript 运行时                 [##--------] 进行中
├─ J1 runtime compat                            [####------] 异常/观察函数已迁，桥清理待做
├─ J2 language/parser                            [####------] 字符串/解析/List/Map/Set 局部合同
├─ J3 inference core                            [####------] Map/List/Set/float/数组局部合同
├─ J4 operator/plugin                           [######----] 异常/数组/反馈/Object/文本/前缀/Add/Reflect，未收口
└─ J5 main/host                                [##--------] 异常观察已验证，宿主边界待做
024 平台中立核心与宿主适配                       [##--------] P0-P2 完成，P3-P5 未完成
I J/P 汇合集成回归                              [----------] 待开始
O 正式性能门                                    [----------] 待开始
R RC/bundle/tag                                [----------] 待开始
```

### 2026-09-20：J4 `Add.function` 原生数值文本边界切片（`d97593e`）

对照 Java `Add.java` 和 Apache Commons Lang 3.7，确认 `StringUtils.isNumeric` 只接受非空
ASCII 数字串；`Integer.parseInt` 还要求结果处于 Java `int` 范围。TS 原实现通过 jree 和
`trim()` 判断，无法保证 Java 的空白、非 ASCII 数字与溢出合同。现以原生正则、Java `int`
范围检查和 `JavaNumberFormatException` 重现该合同，结果文本仍以 Java `String.valueOf`
语义交给 `Term` 构造。

- 代码提交：`d97593e`；基线为 `1394b57`。
- 直接合同：`operator-boundary.test.ts` `16/16`。
- 串行 M2：`npm test` `369` 项，`367` 通过、`2` 跳过、`0` 失败；非增量 `tsc=0`；
  build `139` 个源文件；dist API 通过。
- 计划器：J4 owner、J1 supporting、T1；`live_java_required=false`、
  `m1_minus_required=false`、`full_m1_required=false`。
- 受影响 NAL：5/5 通过，0 exception、0 marker missing、0 stall、0 timeout、0 process limit、
  0 Java/TS diff。证据 SHA-256：`289709602589130B1CD55C36A2A15B27F68AA941BB3B05609DBD440203AD4AE3`。
- 审计变化：direct jree import files `75→74`；migration `jree-runtime-type` `1390/135→1385/134`；
  platform `coreCandidateFiles` `70→69`、`jreeImportFiles` `82→81`。

本批没有勾选 J4 或 023 完成；也没有运行 M1-。下一步优先审查 `Reflect` 的 `sop` 多态输入、
`Term.get` 文本化与非法参数异常，先补合同再做最小 native 化；`Count` 已基本原生化，暂不作为
同等优先级候选。

#### 当前阶段进度树

```text
023 jree 原生 TypeScript 运行时                 [##--------] 进行中
├─ J1 runtime compat                            [####------] 异常/观察函数已迁，桥清理待做
├─ J2 language/parser                            [####------] 字符串/解析/List/Map/Set 局部合同
├─ J3 inference core                            [####------] Map/List/Set/float/数组局部合同
├─ J4 operator/plugin                           [######----] 异常/数组/反馈/Object/文本/前缀/Add 边界，未收口
└─ J5 main/host                                [##--------] 异常观察已验证，宿主边界待做
024 平台中立核心与宿主适配                       [##--------] P0-P2 完成，P3-P5 未完成
I J/P 汇合集成回归                              [----------] 待开始
O 正式性能门                                    [----------] 待开始
R RC/bundle/tag                                [----------] 待开始
```
