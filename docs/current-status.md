# OpenNARS-304-ts 当前状态

- 状态日期：2026-09-19（Asia/Shanghai）
- 代码冻结点：`17cec541f535d83bd62e5b15ee9c03f4a2233812`
- 包版本：`0.1.0`

本文是项目封存后的唯一状态入口。README 只保留必要摘要；历史报告、旧战略和 Agent 提示词不得覆盖本文的状态结论。

2026-09-18 恢复开发的唯一现行目标见[当前开发目标与验收计划](luna-agent-active-goal.md)；下面的“代码冻结点”是历史恢复点，不是当前 HEAD 或新发布候选。

## 封存结论

项目已经得到一个可编译、可测试、可运行 Shell/CLI、可从 ESM 入口调用的 TypeScript OpenNARS。Java/TypeScript 功能等价基线（M1）与 TypeScript 零诊断构建基线（M2）已经建立并在冻结点保持不回退。

本次是**阶段开发封存**，不是正式发行完成。去 jree 化、核心浏览器平台中立化、最终性能预算、单文件 bundle、Release Candidate 与正式 tag 均未完成。

## 规范基线

- Canonical Java source commit：`8675b76fe8c21ee20a7b8c1b63408fb05327210d`。
- Canonical Java JAR SHA-256：`2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`。
- TypeScript 代码冻结点：`17cec541f535d83bd62e5b15ee9c03f4a2233812`。
- 旧 `v0.1.0` tag 没有随本次封存移动，也不代表新的发布候选。

## 九个宏观门禁

当前为 **4/9 完成、2/9 进行中、3/9 待开始**。这个计数表示验收门状态，不表示代码量或工期百分比。

| 门禁 | 状态 | 封存结论 |
| --- | --- | --- |
| F0 Canonical Java 可复现基线 | 完成 | Java source、JAR 与哈希已经固定 |
| F1 M1 功能等价 | 完成 | 有效验收 246/246；证据是当前矩阵与严格长周期结果的组合 |
| F2 M2 零诊断与构建 | 完成 | 202/202 单测、非增量 `tsc` 0 诊断、build 与 dist API 通过 |
| F3 G0 迁移前全量回归 | 完成 | clean worktree 上的 M1/M2 证据已经归档 |
| J 去 jree 化 | 进行中 | `spec 023`；依赖和大量生产导入仍存在 |
| P 平台中立核心 | 进行中 | `spec 024`；P0-P2 完成，P3-P5 未完成 |
| I J/P 汇合集成回归 | 待开始 | 尚未在同一不可变提交完成 Node、浏览器、M1/M2 与依赖扫描 |
| O 正式性能门 | 待开始 | `spec 020` 尚未满足主要 NAL 的批准预算 |
| R 发布候选与正式发布 | 待开始 | bundle、公共门面、RC、tag/release 尚未完成 |

## M1：可以相信到什么程度

有效的 246/246 结论由多份同口径证据组合成立，不能改写成“最后一次原始矩阵 246 行全部绿色”。

- 冻结点主资源矩阵共有 245 行：244 个 `functional_pass`、244 个 `parity`、0 exception、0 timeout、0 not-run、1 个 `process_limit`。
- 原始非通过项是 `long_term_stability.nal`。它在 TypeScript 侧达到进程安全上限，不是异常、普通超时或未运行。
- 两个无 marker 样本是 `nal6.redundant.nal` 与额外夹具 `simpleOperationTest.nal`。
- 有效 246/246 继续引用 G0 的 `nal8_list` 重跑，以及 stability/simpleOperation 的 131072 周期严格 stage digest。
- 冻结点 raw 矩阵与 G0 稳定 raw 基线逐字段对照为 `differing_fields=0`。

主要证据：

- [冻结交接报告](../reports/20260827-003242.md)
- [G0 报告](../reports/20260826-195419.md)
- [冻结点前一批报告](../reports/20260826-231219.md)
- [冻结点 245 项原始矩阵](../reports/evidence/m1-245-plus-1-after-evaluate-20260826.jsonl)

## M2：构建与公开入口

冻结复验记录为：

- `npm test`：202/202，0 failed，0 skipped；
- `npm run typecheck`：非增量 TypeScript 0 诊断；
- `npm run test:build`：131 个源文件构建成功；
- `npm run test:api:dist`：输入、周期、事件和停止合同通过；
- `npm run test:parity:local`：`ok: true`，`differences: []`。

当前产物包括 `dist/index.js`、`dist/index.d.ts`、`dist/cli.mjs` 和 `dist/shell.mjs`。声明入口没有暴露 jree 类型，但运行时代码仍依赖 jree，因此不能把“公开类型干净”外推为“核心已去 jree”。

## 去 jree 化冻结状态

`spec 023` 只完成了清单与若干小批次原生化，尚未达到退出条件。

| 指标 | J0 | 冻结点 | 变化 |
| --- | ---: | ---: | ---: |
| 生产源码直接 jree 导入 | 117 | 105 | -12（约 -10.3%） |
| `new ArrayList` | 50 | 24 | -26（-52%） |
| `new LinkedHashMap` | 43 | 41 | -2 |
| `new LinkedHashSet` | 26 | 26 | 0 |

已完成的重点包括多个临时数组、Narsese 参数、操作反馈路径，以及 `FunctionOperator`、`Want`、`Evaluate` 的局部原生容器替换。尚未完成的关键事实：

- `package.json` 仍依赖 `jree@1.3.0`；
- 生产源码仍有 105 个直接 jree 导入；
- 冻结构建产物中仍有 97 个 JavaScript 文件包含 jree 引用；
- Map/Set、JavaObject、字符串/数值兼容和运行时类族仍需按契约逐簇处理；
- `spec 023` 的备注落后于已提交批次，恢复开发时应先同步记录，不能按旧备注重复工作。

因此，ArrayList 的下降只能证明一个子簇取得进展，不能作为整个去 jree 化的完成率。

### G0 之后的持续开发增量（截至 `9d4cc87`）

以下数字是在不改变上方冻结 M1/M2 结论的前提下，对当前主线增量的记录：

- 生产源码直接 jree 导入文件：`96`；
- `new ArrayList` 构造：`6`；
- `new LinkedHashMap` 构造：`35`；
- `new LinkedHashSet` 构造：`26`；
- 最近十三批已推送的原生化范围：mental operator 反馈数组、配置插件原生序列、`ProcessGoal` anticipation value 数组、`VisionChannel` prototypes 数组、`Tense`/`Symbols` 字符串与字符查找表、`Memory.operators` 文本 key 注册表、`Term.atoms` 文本缓存、`Sentence` 变量重命名文本表、`CompoundTerm` Guava 数组迭代器、`Concept` 六组任务表、`DerivationContext.doublePremiseTask` 结果缓冲、`TemporalRules.temporalInduction` 派生结果缓冲、`CompoundTerm` 局部列表缓冲；
- 此前 `1833fc4` 代表批次的串行单测为 `217/217`，非增量 typecheck 为 0 诊断，build、dist API、canonical Java 局部 parity、M1 主矩阵、额外夹具和 markerless 长周期均通过；长周期采用冻结的 `--skip-embedded + 131072` 协议。当前候选的最新 M2/M1- 数字见下方。

这些是可追溯的局部迁移结果，不是 023 的完成率，也不改变 023 的退出条件。领域 Map/Set、其余迭代器/remove、运行时类身份、jree compatibility 层和 `package.json` 运行时依赖仍未收口。对应批次报告见 `reports/20260915-170037.md`、`reports/20260915-171226.md`、`reports/20260915-173124.md`、`reports/20260915-173959.md`、`reports/20260915-180430.md`、`reports/20260915-200152.md`、`reports/20260915-214647.md`、`reports/20260916-074856.md`、`reports/20260916-091636.md` 和 `reports/20260916-171613.md`。

### 当前候选（截至 `9d4cc87`）

当前候选不是 2026-08-27 冻结点的替代品，而是冻结后的去 jree 增量。代码提交 `9d4cc87` 已完成本批实现；本批阶段报告、状态和 023 记录随后归档，canonical Java artifact 未改变。

- 本候选的 M2 复验：串行单测 `225/225`、非增量 `tsc` 0 诊断、build、dist API 和局部算法 parity 均通过。
- 上一候选的 M1 保护矩阵：245 个主资源全部通过 marker/功能口径，0 exception、0 marker missing、0 timeout、0 process limit、0 not-run；额外 `simpleOperationTest.nal` 的短 parity 为 `1/1`。按冻结的 `--skip-embedded --cycles 131072 --window-size 1024` 合同复验，Java/TS 均观察到 `131072` 周期、`128` 窗口、`2535970` 事件，stage digest `equal=true`、`first_difference=null`。另一次执行内嵌周期后追加周期的诊断协议在窗口 53 的 scheduler 事件数为 `3238/3237`，该差异在旧 jree `Term.atoms` A/B 中同样存在，不能归因于 `ef78de8`。
- 本批 `CompoundTerm.iterator()` 迁移后，M1 主矩阵为 `245/245`、额外 `simpleOperationTest.nal` 为 `1/1`；无 marker 长周期两侧均为 `131072` 周期、`128` 窗口、`2,535,970` 事件，逐窗口记录一致，0 exception、0 marker missing、0 timeout、0 process limit、0 not-run。主矩阵累计耗时 `4,318,407 ms`。
- `long_term_stability.nal` 在主矩阵内完成约 2001974 周期并命中当前空 marker 合同；TS 约 2461.8 秒、约 1.230 ms/周期，低于 117.1875 ms/周期预算。按用户授权的 4GB 单进程/10GB 系统可用内存边界，Node 峰值约 2.89GB，系统可用内存高于 12GB；相对 Java 的慢速是后续性能优化项，不是功能失败。
- 本批新增的 024-P3 插件显式参数、非法配置/重复 classpath 诊断和三种合法无参插件构造均有直接测试；这不等于 P3-P5 或 J/P 集成门禁完成。
- `Image.ts` 的既有注释空格调整已单独作为 `673d390 style(repo): 统一 Image 注释格式` 记录，没有与语义修改混提交。

本批 `CompoundTerm` 三处局部列表缓冲也已原生化：M1- 主矩阵 `244/244`，额外 `simpleOperationTest.nal` `1/1`，0 exception、0 marker missing、0 timeout、0 process limit、0 not-run、0 Java/TS diff；主矩阵总时长 `1,957,134 ms`，TS 峰值 RSS `1,345,036,288 bytes`。相对上一批主矩阵分别减少 `71,681 ms`（`3.53%`）和 `133,230,592 bytes`（`9.01%`）；相对完整 M1 的 `4,231,370 ms`，M1- 节省 `2,274,236 ms`（`53.75%`），但内存采集口径不同且时间节省主要来自排除 #245，均不作为本批性能优化结论。

因此，当前可以继续 023/024 的低风险、单簇、可回归工作；本候选可以宣称 M2 与 M1- 保护门重新闭环，并已将 `Concept`、`DerivationContext`、`TemporalRules` 和 `CompoundTerm` 的局部列表责任逐步收窄到原生实现，但不能把未重新执行的完整 M1/#245 说成当前候选的全量通过，也不能宣称 023 已完成、jree 已退场、正式发布或 Java/TypeScript 性能等价。性能优化应与后续逻辑迁移分开。

### 2026-09-17：静态工具类 JavaObject 标记壳批次

本批在既有 023 里程碑下继续做前向审查。对照 canonical Java 的类声明和 TypeScript 调用点，确认 `ProcessAnticipation`、`ProcessJudgment`、`TemporalInferenceControl`、`Terms`、`Variables` 均只有静态方法；Java 源码没有显式父类，TypeScript 的 `extends JavaObject` 只是转写标记。没有发现这些类被实例化、用于 `instanceof` 或作为 `.class` 运行时身份，因此只移除继承壳，保留它们对 jree 中真实 Java 类型、异常和事件类的使用。`ProcessQuestion` 因仍以 `JavaObject` 作为事件参数兼容类型，本批明确保留。

新增 `core-runtime` 原型回归，确认 5 个静态工具类直接继承 `Object.prototype`；此前 6 个标记类回归继续通过。串行单测 `252/252`，非增量 `tsc=0`，build `134` 源文件、dist API、canonical local parity 和 `toothbrush.nal` 的 TS-only 冻结标杆 smoke 均通过；该 smoke 使用 `g0-java-baseline-26772af-20260917`（baseline SHA-256 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`），没有重复启动 Java。本批按“纯静态类壳”低风险口径未运行 M1- 或 #245。

生产 jree 审计（去除注释后的 summary）为：直接 jree 导入文件 `89`、`new ArrayList=0`、`new LinkedHashMap=35`、`new LinkedHashSet=1`、`javaObjectFiles=42`；迁移扫描为 `224` 文件、`jree-runtime-type=1727/145`。这些下降只反映静态类壳和 import 的移除，不代表 jree compatibility、领域 Map/Set、运行时类身份或 023 已完成。下一批应继续按层审查 inference rule static shell，仍需避免把推理语义修改与壳迁移混在一起。

### 2026-09-17：推理规则静态工具类 JavaObject 标记壳批次

本批在 023 的推理规则层做前向审查。对照 canonical Java，确认 `CompositionalRules`、`LocalRules`、`RuleTables`、`StructuralRules`、`SyllogisticRules`、`TemporalRules` 都是无显式父类的静态规则/派发类；没有实例化、`instanceof` 或外层 `.class` 身份消费。因此只移除外层 `extends JavaObject`。`CompositionalRules` 和 `LocalRules` 仍保留 `JavaObject` import，因为事件载荷转换 helper 仍要求该兼容类型；`RuleTables.EnumFigureSide` 等嵌套 Java enum 身份没有修改。

新增 `core-runtime` 原型回归，确认 6 个规则类直接继承 `Object.prototype`。串行单测 `253/253`，非增量 `tsc=0`，build `134` 源文件、dist API、canonical local parity 均通过；`nal4.7.nal` 与 `toothbrush.nal` 使用冻结 Java 功能标杆的 TS-only smoke 为 `2/2`，无异常、marker 缺失、no-progress timeout 或未运行。普通验证没有重复启动 Java。

本批生产 jree 审计为 direct import `89`、`javaObjectFiles=38`、`new ArrayList=0`、`new LinkedHashMap=35`、`new LinkedHashSet=1`；迁移扫描 224 个文件，malformed 项均为 0。`JavaObject` 数量下降只反映外层类壳，不代表推理规则实现、jree compatibility、领域 Map/Set 或 023 已完成。阶段报告见 `reports/20260917-201456.md`。

本批提交 `eeaa938` 完成后，继续执行串行 M1- 保护矩阵：使用冻结 Java 功能标杆 `g0-java-baseline-26772af-20260917`，未重复启动 Java；命令为 `node scripts/e2e/run-nal-corpus.mjs --engine ts --java-baseline ... --all --limit 244 --cycles 1550 --timeout-ms 180000 --process-limit-ms 1800000 --ts-mode cold --resource-metrics --chunk-size 1 --summary`。结果文件位于项目外 `H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\g3-inference-rule-javaobject-m1-minus-20260917.jsonl`，SHA-256 为 `25B67A1EE9F290A6473C7C7D1BBD3DC83C6629998CC728E178028B5A18DC7B8D`。

- M1- 分层为 `single_step=215`、`multi_step=24`、`application=5`，合计 `244/244`；0 exception、0 marker missing、0 no-progress timeout、0 process limit、0 not-run、0 Java/TS diff。
- 逐行总时长 `1,675,927 ms`，平均 `6,869 ms/行`，最大单行 `346,810 ms`；TS 平均峰值 RSS `257.25 MiB`，最大 `1,172.45 MiB`；累计 reasoning cycles `2,288,254`。这些只作为后续性能优化观测。
- `243` 行通过 marker 路线；无 marker 的 `nal6.redundant.nal` 在该短矩阵中仅运行到 `1,650` 周期，长周期状态为 `not_reached`。该项不构成失败，也不替代此前已完成的 `131072` 周期、`128` 窗口、`589572` 事件且 `equal=true` 的独立 stage-digest 证据。

本批因此可以宣称：推理规则静态壳改动在 M1- 244 个主资源上没有产生功能回退。仍不能宣称完整 M1/#245 在本批重跑通过、023 完成、jree 已退场或 Java/TypeScript 性能等价。日常非 023 验证继续复用冻结 Java 功能字段；只有 023/024 整体验收才现跑 Java 与冻结投影逐字段核对。

上一批 `2465dcd` 将 `Concept` 六组列表收窄为 `NativeList`；随后 `cb4c60a` 处理 `DerivationContext.doublePremiseTask`，`b4c0a21` 处理 `TemporalRules.temporalInduction`，本批 `9d4cc87` 处理 `CompoundTerm` 三处局部列表并补齐 `NativeList.remove(Object)`。当前本批 M2 为非增量 `tsc=0`、串行单测 `225/225`、build/API/local parity 全部通过；M1- 为 `244/244`，0 exception、0 marker missing、0 timeout、0 process limit、0 not-run、0 Java/TS diff。M1- 逐行总时长为 `1,957,134 ms`，相对上一批 `2,028,815 ms` 减少 `71,681 ms`（`3.53%`），TS 最大 RSS 为 `1,345,036,288 bytes`，相对上一批 `1,478,266,880 bytes` 减少 `133,230,592 bytes`（`9.01%`）；这些数字记录为本轮测量结果，不等同于性能优化结论。相对完整 M1 `4,231,370 ms`，M1- 排除 #245 节省 `2,274,236 ms`（`53.75%`）；完整 M1 的 #245 仍按独立长期稳定性证据管理。

### 冻结后阶段增量与去 jree 具体范围

以下是从 `17cec541` 冻结点到当前候选的可追溯实现增量。文档提交只记录状态，不重复计算产品完成率。

| 提交 | 主要代码范围 | 去 jree 的实际变化 | 验证结果 |
| --- | --- | --- | --- |
| `1ea7bdd` | `src/operator/mental/*` 的 Consider、Doubt、Feel、FeelBusy、FeelSatisfied、Hesitate、Name、Register、Remind、Wonder | 反馈结果从 `java.util.List<Task>` 收敛为原生 `Task[]`；`ArrayList` 构造、add 和仅为返回类型存在的 jree 导入被移除，保留 Java 的 null/顺序语义 | 单测 `203/203` |
| `d88dc5b` | `NullOperator`、mental `Believe`、plugin mental `Abbreviation` | 同一反馈容器模式继续迁移到原生数组；`ArrayList` 从 20 降至 17 | 单测 `205/205` |
| `097f488` | `ConfigReader`、`Nar` 插件序列 | 配置插件序列由 `java.util.List<Plugin>` 改为 `Plugin[]`，复制和传递路径保持顺序 | 单测 `206/206` |
| `3f6c851` | `ProcessGoal` | `ArrayList<ExecutablePrecondition>` 改为原生数组，`add` 改为 `push`；`LinkedHashMap<Operation, ...>` 保留以维护 Java key/order 契约 | 单测 `206/206` |
| `0af732b` | `VisionChannel` | `prototypes` 改为 `Prototype[]`，`isEmpty/size/get/set/add` 映射到 `length`、索引和 `push`；迭代顺序保持 | 单测 `207/207`，`vision.nal` parity 通过 |
| `597267f` | 024-P3 `ConfigPluginRegistry`、`ConfigReader`、`System` 边界 | 不是容器替换，而是去除隐式反射式注册假设：显式解析 int/float/boolean/String/Reasoner 构造参数，float 在边界处 `Math.fround`，保留诊断与配置顺序 | 局部 `17/17`，M2 与局部 parity 通过 |
| `14bedad` | 同一插件注册表 | 补齐 Java 已确认支持的 `Anticipate`、`Emotions`、`InternalExperience` 无参构造工厂；参数化构造路径不变 | 局部 `14/14`，串行单测 `212/212` |
| `3312c9a` | `Tense`、`Symbols` 字符串/字符查找表 | 将仅使用字符串/字符 key 的 `LinkedHashMap` 改为原生 `Map`，`put/get` 改为 `set/get`，显式把 miss 的 `undefined` 归一化为 Java `null`；领域对象 key 的 Map 未迁移 | 局部 `2/2`，串行单测 `213/213`，M1 `245+1` 通过 |
| `dbdb936` | `Memory.operators` | 确认 registry 的 key 只来自 operator name 文本，将 `CharSequence → Operator` 的 jree `LinkedHashMap` 改为原生 `Map<string, Operator>`；通过 `javaStringValue` 统一 key，并保持 miss、同名替换、删除返回值的 Java 合同 | 局部 `1/1`，串行单测 `214/214`，M1 `245+1` 通过 |
| `ef78de8` | `Term.atoms` | 确认 atom cache 的 key 是 `CharSequence` 文本而非 Term 对象，将 `CharSequence → Term` 的 jree `LinkedHashMap` 改为原生 `Map<string, Term>`；读写统一经 `javaStringValue`，显式保留 Java `null` miss 和索引项规范化 | 局部 `1/1`，串行单测 `215/215`，M1 主矩阵 `245/245`；markerless `--skip-embedded + 131072` stage digest `equal=true` |
| `6af34d8` | `Sentence` 变量规范化 | 确认重命名表的 key 是变量名文本而非变量对象，将短生命周期 `LinkedHashMap<CharSequence, CharSequence>` 改为原生 `Map<string, CharSequence>`；读写经 `javaStringValue`，保留 Java `CharSequence` value、null miss 和编号顺序 | 局部新增回归，串行单测 `216/216`，M1 主矩阵 `245/245`、额外夹具 `1/1`；markerless `--skip-embedded + 131072` 逐窗口一致 |
| `1833fc4` | `CompoundTerm.iterator()` | 对照 Java 的 Guava `Iterators.forArray(term)`，以原生数组引用和索引状态替换 jree `ArrayList` 构造；保留只读 `remove()` 与耗尽 `next()` 的 Java 异常合同 | 新增迭代器回归，串行单测 `217/217`，M1 主矩阵 `245/245`、额外夹具 `1/1`；markerless `--skip-embedded + 131072` 为 `equal=true` |
| `2465dcd` | `Concept` 六组任务表、`ProcessQuestion`、`ProcessJudgment`、`ProcessGoal` | 新增 `NativeList<T>`，将高频 Concept `ArrayList` 收窄为原生数组容器；保留 Java `add/get/remove/size/isEmpty/iterator` 合同，`contains/indexOf` 按查询对象的 Java `equals` 方向执行；公开 getter 仍在兼容边界返回不可修改的 jree 快照 | 容器回归 `5/5`，串行单测 `222/222`，非增量 tsc `0`；M1- `244/244`、额外夹具 `1/1`；#245 的 Java/TS 长测分别有成功原始证据，但普通 JVM 曾发生主机级 `hs_err` |
| `cb4c60a` | `DerivationContext.doublePremiseTask` | 对照 Java 确认局部结果列表仅承担 0–2 项成功派生任务收集；以 `NativeList<Task>` 替换 jree `ArrayList<Task>`，保留公开 Java List 形状、`null` 失败分支和插入顺序 | 直接回归命中成功派生路径；串行单测 `223/223`，非增量 tsc `0`，build/API/local parity 通过；M1- `244/244`，额外 `simpleOperationTest.nal` `1/1`，总时长 `2,001,067 ms`，TS 峰值 RSS `1,465,114,624 bytes` |
| `b4c0a21` | `TemporalRules.temporalInduction` | 对照 Java 确认局部 `derivations` 只承担短生命周期、按规则顺序收集结果；以 `NativeList<Task>` 替换 jree `ArrayList<Task>`，保留 Java List 返回形状、`Collections.emptyList()` 空结果和追加顺序 | 新增空结果缓冲直接回归；串行单测 `224/224`，非增量 tsc `0`，build/API/local parity 通过；M1- `244/244`，额外 `simpleOperationTest.nal` `1/1`，总时长 `2,028,815 ms`，TS 峰值 RSS `1,478,266,880 bytes` |
| `9d4cc87` | `CompoundTerm.asTermList`、`cloneTermsListDeep`、`prepareComponentLinks` | 对照 Java 确认三处局部列表只承担原顺序短生命周期缓冲；以 `NativeList` 替换 jree `ArrayList`，并补 `remove(Object)` 的 Java equals 重载，保留 Java List 返回形状、索引/值删除和 TermLink 顺序 | 新增 CompoundTerm/NativeList 直接回归；串行单测 `225/225`，非增量 tsc `0`，build/API/local parity 通过；M1- `244/244`，额外 `simpleOperationTest.nal` `1/1`，总时长 `1,957,134 ms`，TS 峰值 RSS `1,345,036,288 bytes` |
| `02ddf20` | `Term.toSortedSet`、`NativeSortedSet` | 对照 Java 确认返回类型为 `TreeSet`；以比较器驱动的原生有序集合替代 jree `ArrayList` 假 Set，保留排序、去重、`retainAll` 和 Java 形状 `toArray` | 新增 `NativeSortedSet` 直接回归；串行单测 `227/227`，非增量 tsc `0`，build/API/local parity 通过；M1- 原始 `242/244`，两项独立 canonical 重跑 `2/2`，有效 `244/244`；markerless `131072` 周期 stage digest 一致 |

综合指标为：生产源码直接 jree 导入文件 `117 → 96`，`new ArrayList` `50 → 6`，`new LinkedHashMap` `43 → 35`，`new LinkedHashSet` `26 → 26`。这证明数组/序列子簇和四个稳定文本 key 查找表子簇已取得实质进展，但不是“jree 已移除”：`package.json` 仍依赖 `jree@1.3.0`，Map/Set key equality、JavaObject/运行时类身份、JavaString、随机数、float32 和模块初始化环仍是未收口边界。后续仍按“数据结构 → 容器 → 推理规则 → 推理引擎 → 宿主入口”的顺序推进。

### 当前候选（截至 `02ddf20`）

本候选承接 `9d4cc87`，只处理 `Term.toSortedSet` 的真实 `TreeSet` 合同，canonical Java artifact 未改变：源码 commit `8675b76fe8c21ee20a7b8c1b63408fb05327210d`，JAR SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`。代码提交 `02ddf20656e614eeca283671457f5a66158615c2` 已推送；文档提交随后补录。

- M2：串行单测 `227/227`，非增量 `tsc=0`，build、dist API、canonical Java 局部 parity 均通过；TypeScript 5.4.5 build 源文件计数 `133`。
- M1- 原始主矩阵：244 行中 `242` 行功能/parity 通过，`2` 行是 Java 子进程异常；TS 异常、超时、marker 缺失、进程限制和未运行均为 `0`。异常文件 `nal4.everyday_reasoning.nal`、`nars_multistep_2.nal` 独立重跑均通过，因此有效 M1- 为 `244/244`，但原始结果仍保留为 `242/244`，不做“原始全绿”表述。
- 额外 `simpleOperationTest.nal` 短跑 `1/1`。该无 marker 夹具的 Java/TS 严格 stage digest 均为 `131072` 周期、`128` 窗口、`2535970` 事件，`equal=true`、`first_difference=null`。
- M1- 主矩阵逐行总时长 `2,118,396 ms`，TS 峰值 RSS `1,387,151,360 bytes`。相对上一批 M1- 的 `1,957,134 ms` 和 `1,345,036,288 bytes`，本批时间增加 `161,262 ms`（`8.24%`），RSS 增加 `42,115,072 bytes`（`3.13%`）。相对历史完整 M1 的 `4,231,370 ms` 和约 `3,050,434,560 bytes`（内存采样口径不同），M1- 少 `2,112,974 ms`（`49.94%`），粗略少占 `1,663,283,200 bytes`（`54.53%`）；该节省主要来自排除长期稳定性 `#245`，不是本批优化收益。
- 当前去 jree 审计：直接导入文件 `96`、`new ArrayList=5`、`new LinkedHashMap=35`、`new LinkedHashSet=26`、candidate native items `70`。本批具体去除一处 `Term.toSortedSet` 的 `ArrayList` 假 Set；没有触碰公开只读快照、领域对象 Map/Set 或完整 `TreeSet` 视图。

本候选可以宣称 M2 与 M1- 保护门在补充证据口径下重新闭环，以及 `Term.toSortedSet` 的局部原生合同有直接回归；不能宣称本批重新完成完整 M1/#245、023 已完成、jree 已退场、TypeScript 与 Java 性能等价或正式发布。完整 M1/#245 仍按独立长期稳定性计划执行。

### G0 最新稳定 HEAD 验收（截至 `ee7bc39`）

本节是冻结后最新稳定候选的阶段性复核，补充并更新上文历史候选的证据，不改变 023/024 的未完成状态。

- Git：`HEAD=origin/main=ee7bc3970e1c9d99c34034648320dd735368fbfc`；本轮验证前工作区干净，未修改生产代码。
- Canonical Java：source commit `8675b76fe8c21ee20a7b8c1b63408fb05327210d`；JAR SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`；本轮使用该显式 artifact，未回退到历史 3.1.0 JAR。
- M1 主矩阵：245/245（single_step 215、multi_step 24、application 5、stability 1）功能与 parity 通过；0 exception、0 timeout、0 marker missing、0 process limit、0 not-run、0 Java/TS diff。逐行总耗时 `4,185,931 ms`，TypeScript 峰值 RSS `3,047,796,736 bytes`。
- M1 额外夹具：`simpleOperationTest.nal` 为 1/1，无异常/超时。两个 markerless 样本 `nal6.redundant.nal` 与 `simpleOperationTest.nal` 均完成严格 `131072` 周期、`128` 窗口；事件总数分别为 `589572`、`2535970`，Java/TS digest 均 `equal=true`、`first_difference=null`。因此 G0 有效结果为 245+1，即 246/246。
- M1- 资源节省：当前同口径 M1- 为 `2,118,396 ms`、TS 峰值 RSS `1,387,151,360 bytes`；相比完整 M1 少 `2,067,535 ms`（`49.39%`）和 `1,660,645,376 bytes`（`54.49%`）。这是排除长期稳定性 #245 的结构性节省，不是本批代码优化收益；运行时间仍作为后续性能优化指标记录。
- M2：串行单测 `227/227`；显式非增量 `npx tsc --noEmit --pretty false --incremental false` 为 0 诊断；build、dist API、local algorithm parity、release、直接 CLI 和 `npm run shell` 均通过，运行时警告为 none。release tarball SHA-256 为 `fde84e3f1f36ac28a53b9ea2ea80b2a4cb70ac24a697a3a4f038404e0ef9e9bf`。
- 资源与流程：长周期单进程峰值约 3.05 GB，观测期间系统可用内存保持在用户授权的安全范围内；矩阵全程串行，没有并行第二矩阵或内存密集型 tsc/build。第一次 `npm run typecheck` 无诊断文本退出 1，显式非增量重跑和随后复跑均为 0，作为瞬态命令层现象留痕。
- 当前可宣称：`ee7bc39` 已通过 G0 的 M1/M2 迁移前保护门，可以继续 023/024 的单簇去 jree 化。当前不能宣称 023/024 完成、jree 已移除、浏览器平台中立完成、Java/TypeScript 性能等价或正式发布；下一轮仍使用 M1- 做日常保护，#245 按阶段计划单独执行完整 M1。
- 可追溯记录：详见 [G0 阶段报告](../reports/20260916-193157.md)。项目外原始 JSONL、summary、stage digest 与 artifact manifest 保存在 `H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\`，不纳入 Git。

### 当前候选：只读列表原生化簇（2026-09-16）

本批在 G0 稳定保护门之上，完成了“只读 `ArrayList` 快照”整类责任的 Java 合同核对与原生化。代码提交 `3543752` 已推送到 `origin/main`。小范围变更采用局部合同、直接回归和 M2 验证；完整特性簇闭合后再运行 M1-，符合当前减少非必要全量测试的约定。

- Java `Concept` 的四个任务 getter 与 `Nar.getPlugins()` 实际返回 `Collections.unmodifiableList` 的实时只读视图；TypeScript 已从“jree `ArrayList` 复制后再包装”改为 `NativeReadOnlyList`，保持实时观察、插入顺序、索引、遍历和修改拒绝语义。
- 生产源码中的实际 `new java.util.ArrayList` 构造由 `5` 降为 `0`；直接 jree 导入文件由 `96` 降为 `95`。后者仍包含既有 Java 类型与运行时兼容责任，不能解释为 jree 已退出。
- M2：串行单测 `229/229`，显式非增量 `tsc` `0` 诊断，build、dist API、canonical Java 局部 parity、release、直接 CLI 和 `npm run shell` 全部通过，运行时警告为 none。
- M1-：主资源 `244/244` 加额外 `simpleOperationTest.nal` `1/1`，合计 `245/245`；0 exception、0 timeout、0 marker missing、0 process limit、0 not-run、0 Java/TS diff。主资源与额外夹具均使用显式 canonical Java artifact，矩阵串行执行。
- 本批 M1- 耗时 `1,929,641 ms`，TS 峰值 RSS `1,395,273,728 bytes`；相对 G0 完整 M1 的 `4,185,931 ms` 与 `3,047,796,736 bytes`，结构性节省分别为 `53.90%` 与 `54.22%`（约 `1.54 GiB`），原因是排除长期稳定性 `#245`，不是本批性能优化结论。
- canonical Java 未改变：source commit `8675b76fe8c21ee20a7b8c1b63408fb05327210d`，JAR SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`。

本批代码、测试和证据详见 [只读列表原生化阶段报告](../reports/20260916-212425.md)。当前可以继续 023 的下一类小簇；不能宣称 023 已完成、jree 已移除、024 已完成、完整 M1/#245 已在本候选重新执行，或 Java/TypeScript 性能等价。项目外 M1- JSONL 证据保存在 `H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\`，不纳入 Git。

### 当前候选：`Stamp` 证据基集合原生化簇（2026-09-16）

本批继续沿“数据结构 → 容器 → 推理规则 → 推理引擎 → 宿主入口”的顺序，完成 `Stamp` 两处局部证据基集合责任的 Java 合同核对。按照当前工作约定，小簇使用局部合同和局部 M2；只有整类责任闭合后才运行一次串行 M1-，不重复运行长期稳定性 `#245`。

本批代码、测试和报告已由提交 `7bef525` 记录并推送到 `origin/main`；canonical Java artifact 未改变。

- Java `Stamp.baseOverlap` 与 `Stamp.evidenceIsCyclic` 都只对 `LinkedHashSet<BaseEntry>` 执行 `contains + add`；没有依赖集合遍历、删除或桶恢复。`BaseEntry.equals` 按 `(narId,inputId)` 值判等，因此 TS 改为 `NativeList<Stamp.BaseEntry>` 后仍执行 Java equals 驱动的重复检测。
- 新增 `test/node/stamp-evidence.test.ts`，覆盖不同对象相同 `(narId,inputId)`、同一 stamp 重复证据和跨 stamp 重叠；局部测试 `2/2`，统一串行 M2 `231/231`，`test/entity/TLink.test.ts` 已随统一入口纳入历史 M2 口径。
- 非增量 `tsc --noEmit --pretty false --incremental false` 为 `0` 诊断；build `sourceFileCount=133`、dist API、canonical Java 局部 parity 均通过；`nal8.add.nal` 受影响 smoke `1/1`。本批没有修改 canonical Java。
- M1- 原始主矩阵为 `243/244`：唯一失败 `nal6.12.nal` 的 TS 子进程退出 `0xC0000005 (EXCEPTION_ACCESS_VIOLATION)`。依据已确认的主机内存不稳定事实，该行作为主机级瞬态证据保留，不作为源码逻辑分叉；相同参数独立重跑为 `1/1`。额外 `simpleOperationTest.nal` 为 `1/1`，故有效主资源 `244/244`、含额外夹具 `245/245`，有效 `java_ts_diff=0`、`timeout=0`、`marker_missing=0`、`process_limit=0`、`not_run=0`。
- 两个无 marker 样本均在当前代码下重新完成 `--skip-embedded --cycles 131072 --window-size 1024` 严格摘要：`nal6.redundant.nal` 为 `131072` 周期、`128` 窗口、`589572` 事件；`simpleOperationTest.nal` 为 `131072` 周期、`128` 窗口、`2535970` 事件；两组 Java/TS 均 `equal=true`、`first_difference=null`、`incomplete=false`。
- 本批 M1- 有效总耗时 `1,995,388 ms`，TS 峰值 RSS `1,374,785,536 bytes`。相对上一批 `1,929,641 ms` 与 `1,395,273,728 bytes`，时间增加 `3.41%`，RSS 减少 `1.47%`；这是回归观测，不宣称 `NativeList` 已带来性能优化。`NativeList.contains` 的线性复杂度与 Java `LinkedHashSet` 的复杂度差异留作后续容器/性能专题。
- 当前机器可读 jree 审计为：生产直接导入文件 `95`、`new ArrayList=0`、`new LinkedHashMap=35`、`new LinkedHashSet=24`、`javaObjectFiles=53`、`javaUtilFiles=40`、`candidateNativeItems=68`。相对上一候选 `9d4cc87` 的审计记录，直接导入文件减少 `1`，`LinkedHashSet` 构造减少 `2`；这仍不是 jree 退场。

本批代码、测试和阶段证据见 [Stamp 批次报告](../reports/20260916-225427.md)。项目外 JSONL 与四份 stage digest 保存在 `H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\`，不纳入 Git。本批可以继续 023 的下一类局部 jree 原生化；不能宣称 023 完成、所有领域 Map/Set 判等已审计、完整 M1/#245 重新完成、Java/TypeScript 性能等价或 024/发布门完成。

### 当前候选：`ProcessGoal` 证据子集原生化簇（2026-09-17）

本批沿“数据结构 → 容器 → 推理规则 → 推理引擎 → 宿主入口”的顺序，核对并原生化 `ProcessGoal.processOperationGoal` 中只承担 `BaseEntry` `add/contains` 子集判定的局部集合责任。Java canonical 未改变：source commit `8675b76fe8c21ee20a7b8c1b63408fb05327210d`，JAR SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`。本批代码、测试和文档提交为 `4ff0860c3fe6eb19451e3a0f35766b67bbb366eb`，已推送至 `origin/main`。

- Java `BaseEntry.equals` 按 `(narId,inputId)` 值判等；TypeScript 将局部 `java.util.LinkedHashSet` 替换为既有 `NativeList`，只保持该局部合同，不扩展到 `ProcessGoal` 的其他 Map/Set。
- 新增回归覆盖相同值不同对象的证据包含、缺失证据和空旧目标分支；直接回归 `3/3`。
- M2：统一串行单测 `232/232`，显式非增量 `npx tsc --noEmit --pretty false --incremental false` 为 `0` 诊断，build `sourceFileCount=133`、dist API、canonical Java local parity、平台审计、迁移模式扫描和受影响 smoke 均通过。
- M1-：244 个主资源与额外 `simpleOperationTest.nal` 共 `245/245`；主矩阵在系统重启后从 JSONL 检查点 `--resume` 续跑完成。0 exception、0 stall/no-progress、0 marker missing、0 process limit、0 not-run、0 Java/TS diff。矩阵串行执行，canonical artifact 路径和 SHA-256 均逐行记录。
- 无 marker 样本严格摘要：`nal6.redundant.nal` 为 131072 周期、128 窗口、589572 事件；`simpleOperationTest.nal` 为 131072 周期、128 窗口、2535970 事件。Java/TS 两侧均 `equal=true`、`first_difference=null`、`incomplete=false`。
- 本批 M1- 总耗时 `1,938,672 ms`，TS 峰值 RSS `1,353,818,112 bytes`；相对上一批 Stamp 的 `1,995,388 ms` 与 `1,374,785,536 bytes`，分别少 `2.84%` 与 `1.52%`。这是运行观测，不是本批性能优化结论；`NativeList.contains` 的线性复杂度仍留在后续容器/性能专题。
- 当前 jree 审计：直接导入文件 `95`、`new ArrayList=0`、`new LinkedHashMap=35`、`new LinkedHashSet=23`、`javaObjectFiles=53`、`javaUtilFiles=40`、`javaLangFiles=87`、`highRiskItems=93`、`semanticReviewItems=111`、`candidateNativeItems=68`。相对 Stamp 批次，`new LinkedHashSet` 再减少 1；这仍不是 jree 退场。

本候选代码、测试和阶段证据见 [ProcessGoal 批次报告](../reports/20260916-235913.md)。项目外 M1- JSONL、严格摘要与 artifact 证据保存在 `H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\`，不纳入 Git。本批只完成 023 的一个局部责任簇，可以继续下一类原生化；不能宣称 023/024 完成、jree 已移除、完整 M1/#245 重新完成或 Java/TypeScript 性能等价。

### 当前候选：`TemporalInferenceControl` 局部尝试集合原生化簇（2026-09-17）

本批沿“数据结构 → 容器 → 推理规则 → 推理引擎 → 宿主入口”的顺序，核对并原生化 `TemporalInferenceControl.eventInference` 中两个只承担局部尝试去重的集合。Java canonical 未改变：source commit `8675b76fe8c21ee20a7b8c1b63408fb05327210d`，JAR SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`。

- Java 的 `already_attempted` 与 `already_attempted_ops` 只执行 `contains/add/clear`；`Task.equals` 按 `Sentence` 值判等。TypeScript 改用既有 `NativeList<Task>`，不触碰其他 `TemporalInferenceControl` 集合和推理流程。
- 新增 `test/node/temporal-inference.test.ts`，命中真实 `eventInference`，覆盖不同对象相同 Task 值只尝试一次、任务回放和清空边界；局部回归 `1/1`，统一串行 M2 `233/233`。
- 非增量 `tsc` 为 `0` 诊断；build、dist API、canonical Java 局部 parity 均通过；受影响 `nars_memorize_precondition_sequence.nal` smoke 为 `1/1`。
- 当前 jree 审计为直接导入文件 `95`、`new LinkedHashMap=35`、`new LinkedHashSet=21`、`candidateNativeItems=68`。本批只去除两个局部实例，不能解释为 jree 已退出；`NativeList` 的线性查找性能也未在本批裁决。
- 按用户对局部小簇的明确政策，本批不运行 M1-，不运行长期稳定性 `#245`；待较大责任簇或高风险运行时簇闭合后再做串行 M1- 保护。故本批不能宣称 M1-/M1 全量通过或 023 完成。

本批代码、测试和阶段证据见 [TemporalInferenceControl 批次报告](../reports/20260917-074048.md)。
代码与测试提交 `a89d003` 已推送至 `origin/main`；本批不运行 M1-，后续仅在较大或高风险责任簇闭合后运行串行 M1- 保护。

### 当前候选：`TemporalInferenceControl` Set 抽象修正（2026-09-17）

前一批曾把 Java `LinkedHashSet<Task>` 映射为 `NativeList<Task>`；功能上可通过，但类型层没有表达 Set 语义。本批新增 `NativeSet<T>`，底层暂用数组但对外保持 Set 的唯一性、Java-style `equals` 判重和插入顺序，并在 `TemporalInferenceControl.eventInference` 的两个声明处保留原始 `Set<Task>`/`LinkedHashSet<Task>` 来源注释。

- 直接回归继续覆盖不同对象但相同 Task 值只尝试一次，以及清空后的重新判重边界。
- 本批应只运行局部回归、串行 M2、非增量 typecheck、build/API、局部 parity 和受影响 NAL smoke；不运行 M1- 或 #245。
- 本批尚未完成提交前，不能宣称该修正已进入远端稳定状态。

本批修正验证已完成：局部回归 `2/2`，串行 M2 `234/234`，非增量 typecheck 0 诊断，build/API、canonical parity 和受影响 sequence NAL smoke 均通过；待修正提交后补录远端哈希。本批不运行 M1- 或 #245。

### 当前候选：既有原生容器语义审计与 Set→Set 修正（2026-09-17）

用户指出不能以 API 形状把 Set 继续冒充 List。本批因此回溯 `023`/`020`/`024` 已提交的原生化点，并以向前 fix 保留历史提交：

- `7bef525` 的 `Stamp.baseOverlap`、`Stamp.evidenceIsCyclic` 原始 Java 类型是 `Set<BaseEntry> = LinkedHashSet`，此前误用 `NativeList`；现改为 `NativeSet<BaseEntry>`。
- `4ff0860` 的 `ProcessGoal.processOperationGoal` 原始 Java 类型是 `Set<BaseEntry> = LinkedHashSet`，此前误用 `NativeList`；现改为 `NativeSet<BaseEntry>`。
- `a89d003` 的 `TemporalInferenceControl` 两个尝试集合原始 Java 类型是 `Set<Task> = LinkedHashSet`，本批同步改为 `NativeSet<Task>`。
- `NativeList`、`NativeSortedSet`、`NativeDeque`、Map 文本索引/对象身份辅助索引、数组队列和字符串缓冲已逐项核对；截至本批没有发现第二个已证实的 Map/Deque/字符串容器错配。`StringBuilder` 后续仅在确认纯文本拼接语义后按模板字符串/`join` 改写，并保留 Java 来源与格式注释。

本批增加 `NativeSet` 的 Java equals 接收者方向回归，并命中 Stamp/ProcessGoal/Temporal 三条业务路径；按局部小簇策略运行针对性单测、串行 M2、显式非增量 typecheck、build/API、局部 parity 与受影响 NAL，不运行 M1-/#245。代码与报告已提交并推送：修复提交为 `7b9f1d4`，状态补录提交为 `4e964fd`。首次推送因 GitHub HTTPS Schannel TLS 握手失败，低频重试后成功，当前 `origin/main=4e964fd`。

### 当前权威候选：G0 M1/M2 保护门复验（2026-09-17）

本节覆盖此前所有候选记录，当前事实以本节、G0 阶段报告和项目外机器可读证据为准。复验起点为 `HEAD=origin/main=c5957163e8e4ef553bf2c6b5f778608f306cbca6`，工作区在启动时干净；本批没有修改产品源码。

- canonical Java source commit：`8675b76fe8c21ee20a7b8c1b63408fb05327210d`。
- canonical JAR：`H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-java-canonical-fixed-build\target\opennars-3.0.4-SNAPSHOT.jar`。
- canonical JAR SHA-256：`2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`。
- M1 主矩阵：245/245（single_step 215、multi_step 24、application 5、stability 1）；额外 `simpleOperationTest.nal` 为 1/1；合计 246/246。
- M1 结果字段：0 exception、0 timeout、0 process limit、0 not-run、0 marker missing、0 Java/TS diff；Java/TS 均单线程、cold、chunk-size=1。M1 总 Java 运行时 `228326 ms`，TypeScript `3709796 ms`，TS 最大 RSS `2995437568 bytes`，仅作为后续性能观测。
- 无 marker 的 `nal6.redundant.nal` 与 `simpleOperationTest.nal` 均完成 131072 周期、128 个 1024 周期窗口；Java/TS stage digest 均 `equal=true`、`first_difference=null`。
- M2 串行单测 `235/235`（失败 0、跳过 0，含 `test/entity/TLink.test.ts`）；显式非增量 `npx tsc --noEmit --pretty false --incremental false` 为 0 诊断；build、dist API、local parity、release 均通过，release runtime warnings 为 none。
- 当前审计数字：jree 生产直接导入文件 95、`new ArrayList=0`、`new LinkedHashMap=35`、`new LinkedHashSet=21`；平台扫描 171 文件，其中核心候选 90、混合边界 5、browser shim 2/19 处；迁移模式扫描 222 文件，malformed generic/operator/new-this 均为 0。

本次复验确认 G0 的 M1 245+1 与 M2 保护门通过，可以继续下一阶段单簇去 jree 化；不能据此宣称 023/024 完成、jree 已移除、平台中立完成、Java/TypeScript 性能等价或正式发布。

本批也确认历史前向审查必须持续执行：`7b9f1d4` 已修正 `7bef525`（Stamp 两处）、`4ff0860`（ProcessGoal 一处）和 `a89d003`（Temporal 两处）中把 Java `LinkedHashSet` 错映射为 `NativeList` 的问题，改为语义明确的 `NativeSet`。以后所有原生化仍须先回到 Java 声明核对 List/Set/Map/Deque/TreeSet、equals/hashCode、顺序、缺失值和迭代删除，不能只按 API 表面或数组底层实现批量迁移。

证据文件位于项目外 `H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\`：`g0-m1-245-main-20260917.jsonl`、`g0-m1-simpleOperation-20260917.jsonl` 及四份 131072 stage digest；阶段解释见 [G0 阶段报告](../reports/20260917-083653.md)。状态与报告已由 `d66da8d docs(g0): 记录 M1 M2 全量保护门` 提交并推送至 `origin/main`。

### 当前候选：`Item` 文本边界原生化（2026-09-17）

本批承接 G0 稳定保护点 `534407bc7058c545daf2772b3846b3d3cc84d1d1`，继续沿“数据结构 → 容器 → 推理规则 → 推理引擎 → 程序入口”的方向做历史前向审查。canonical Java 未改变：源码 commit `8675b76fe8c21ee20a7b8c1b63408fb05327210d`，JAR SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`。

- Java `Item.toString`、`toStringExternal`、`toStringExternal2` 都是局部一次性 `StringBuilder -> String`；没有共享、增量观察或中途可变状态。TypeScript 改用模板字符串，显式保留 Java `String.valueOf`、null 名称、无预算前导空格和三种输出顺序。
- 因基类返回类型改变，`Concept`、`Task`、`TaskLink`、`TermLink` 的相同继承合同同步改为原生 `string`；仍有共享/条件拼接的 `Task.toStringLong`、`TermLink.newKeyPrefix` 等 builder 未作批量替换。
- 历史前向审查回读 `b9e1407`（TermLink Java 字符边界）、`cbdb52f`（Item 可空预算/`String.valueOf`）和 `81b41a5`（TaskLink 的真实 Deque）；结合此前 `7b9f1d4` 对三处 Set→List 错配的修复，确认字符串、Deque、Set、List、Map 必须按原始 Java 抽象分别处理。
- M2：`item-string.test.ts` `2/2`，统一串行单测 `237/237`；显式非增量 `tsc` `0` 诊断；build/API、canonical local parity、`nal8.add.nal` smoke `1/1` 均通过。`test/entity/TLink.test.ts` 仍由统一入口纳入。
- 当前 jree 审计：生产直接导入文件 `95`、`new ArrayList=0`、`new LinkedHashMap=35`、`new LinkedHashSet=21`、`javaObjectFiles=53`、`javaUtilFiles=40`、`javaLangFiles=87`、`semanticReviewItems=108`、`candidateNativeItems=68`。迁移扫描 `223` 文件，jree runtime type `1779/144`；本批是字符串输出边界收敛，不代表 jree 已退场。
- 本批不运行 M1-/#245：修改范围是局部文本合同，已有直接回归、局部 parity 与受影响 smoke；较大共享输出、集合或调度责任簇闭合时再运行串行 M1-。这不能改写 G0 的完整 M1 结论。

本批代码、测试和阶段报告已由 `84806c2 refactor(023): 原生化 Item 文本拼接边界` 提交并推送到 `origin/main`；本状态补录提交状态。`v0.1.0` 未移动。023/024、正式性能门和发布门仍未完成。

### 当前候选：`TermLink` 前缀文本原生化（2026-09-17）

本批承接远端 `45bcef9`，继续对早期迁移提交做前向审查。Java canonical 未改变：源码 commit `8675b76fe8c21ee20a7b8c1b63408fb05327210d`，JAR SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`。

- `TermLink.newKeyPrefix()` 的 Java 返回类型是 `CharSequence`，实现是局部 `StringBuilder`；唯一调用点是 `TermLink.toString()` 的立即拼接。TypeScript 现使用原生文本和 `join("-")`，保持组件/复合标记、类型号、索引顺序、radix-16 小写格式和空索引行为。
- `TermLink.toString()` 同步使用原生字符串组合，并通过 `javaStringValue` 保留 target 的 Java 对象字符串边界；没有改动 equality、hashCode 或规则派发。
- 本批回读 `b9e1407` 的 TermLink 字符串边界修复，并与此前 `84806c2` 的 Item 输出合同保持一致；历史 `Set/List/Map/Deque` 仍按各自 Java 抽象审查，不套用字符串模板。
- M2：`termlink-string.test.ts` `1/1`，统一串行单测 `238/238`，显式非增量 `tsc` `0` 诊断，build、dist API、canonical local parity、`nal8.add.nal` smoke 均通过。
- 当前 jree 审计：生产直接导入文件 `95`、`new ArrayList=0`、`new LinkedHashMap=35`、`new LinkedHashSet=21`、`javaStringFiles=52`、`semanticReviewItems=107`、`candidateNativeItems=68`；迁移扫描 `224` 文件，jree runtime type `1772/144`。本批不是 023 完成。
- 本批不运行 M1-/#245：这是局部文本合同簇，已有直接回归、局部 parity 和 NAL smoke；涉及共享输出、集合/Map、运行时类型或推理调度的责任簇仍须按规模重新决定 M1-。

本批代码、测试和阶段报告已由 `14cd10f refactor(023): 原生化 TermLink 前缀文本` 提交并推送；状态补录提交随后完成。`v0.1.0` 不移动。023/024、正式性能门和发布门仍未完成。

### 当前候选：`CompositionalRules` 集合簇与历史 Set 契约前向修复（2026-09-17）

本批承接稳定推进点 `17cec541f535d83bd62e5b15ee9c03f4a2233812`，先由 `a0b3584 refactor(023): 原生化组合规则集合簇` 将 `CompositionalRules` 中 Java `LinkedHashSet` 的集合责任改为显式 `NativeSet`，再由 `5251f129 fix(023): 对齐集合相等与哈希契约` 修正前向审查发现的集合语义缺口。两次提交均保持 `Map` 为 Map、`Set` 为 Set；幂集递归仅使用原生数组作为短生命周期的有序 List 视图，没有把数组当作 Set 对外暴露。

- canonical Java source commit：`8675b76fe8c21ee20a7b8c1b63408fb05327210d`。
- canonical JAR：`H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-java-canonical-fixed-build\target\opennars-3.0.4-SNAPSHOT.jar`。
- canonical JAR SHA-256：`2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`。
- M2：定向集合合同 `9/9`；完整串行单测 `241/241`，失败 0、跳过 0，统一入口包含 `test/entity/TLink.test.ts`；显式非增量 tsc `0` 诊断；build、dist API、local parity、`nal3.5.nal` smoke 均通过。
- M1-：244 个主资源 `244/244`，额外 `java-master/src/test/simpleOperationTest.nal` 为 `1/1`，合计 `245/245`；0 exception、0 timeout、0 stall/no-progress、0 marker missing、0 process limit、0 not-run、0 Java/TS diff。主资源分层为 single_step 215、multi_step 24、application 5；本批排除 #245 `stability/long_term_stability.nal`。
- M1- 资源观测：主矩阵合计 `1,763,277 ms`，其中 Java `157,319 ms`、TypeScript `1,605,958 ms`；TypeScript 峰值 RSS `1,265,442,816 bytes`。该时间差主要反映 Java/TS 运行时和样本成本，不能当作本批逻辑修复带来的性能结论。
- markerless 严格长周期：`nal6.redundant.nal` 与 `simpleOperationTest.nal` 均完成 `131072` 周期、`128` 个 1024 周期窗口；事件总数分别为 `589572`、`2535970`，Java/TS 均 `equal=true`、`first_difference=null`、`incomplete=false`。
- jree/平台/迁移审计：jree 生产直接导入文件 `95`、`new ArrayList=0`、`new LinkedHashMap=35`、`new LinkedHashSet=13`；平台扫描 171 文件（核心候选 90、混合边界 5、browser shim 2/19）；迁移扫描 224 文件，malformed generic/operator/new-this 均为 0，jree runtime type `1744/144`。

本批的历史前向审查覆盖了 `20ba562`、`ef78de8`、`6af34d8`、`3312c9a`、`dbdb936`、`3f6c851`、`097f488`、`0af732b`、Operator 反馈簇、插件事件簇、`81b41a5`、`02ddf20`、`7bef525`、`4ff0860`、`a89d003` 等早期原生化点。结论是：文本 key 的 Map 仍保持 Map；短生命周期 List 才允许数组化；Deque、TreeSet、Set 的抽象分别保持。发现并修正的实际遗留问题是 `NativeSet.equals` 原先反向使用另一集合的 `contains`，不符合 Java `AbstractSet.equals` 的 `this.containsAll(other)` 方向；同时补齐 `NativeSortedSet` 的 Set `equals/hashCode`。公开插件/API 上的 List 形状收窄仍登记为后续边界审查项，不能被 NAL 通过结果掩盖。

本候选可以宣称：组合规则集合簇及其历史 Set 契约 fix 已通过局部 M2、M1- `245/245` 和 markerless 131072 周期证据，可以继续下一类小簇原生化。本候选不能宣称：023/024 完成、jree 已移除、所有历史公共 List API 已恢复、完整 M1/#245 已在本批重跑、Java/TypeScript 性能等价或正式发布。证据 JSONL 与 stage digest 保存在项目外 `H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\`，不纳入 Git。

### 当前候选：`ProcessJudgment` 目标 Set 原生化（2026-09-17）

本批继续对更早 Git 提交做前向审查。canonical Java 仍为 source commit `8675b76fe8c21ee20a7b8c1b63408fb05327210d`，JAR SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`。回读 Java `ProcessJudgment.addToTargetConceptsPreconditions` 与 TS blame 后确认，局部目标集合的原始合同是 `Set<Term> + LinkedHashSet`，实际只需要 `add`、按插入顺序遍历和 Term 值去重；该处没有历史 Set→List 错配。

- 实现：以 `NativeSet<Term>` 替换局部 jree Set，保留 Set 抽象；代码注释明确标出原始 Java `Set<Term> targets = new LinkedHashSet<>()`，未改 Map、List、规则或派发逻辑。
- 回归：新增两个独立解析但 Java `equals` 相等 Term 的去重/顺序测试，定向回归 `18/18`，串行单测 `242/242`，失败 0、跳过 0；`test/entity/TLink.test.ts` 仍由统一入口纳入。
- 构建与合同：显式非增量 `tsc` 为 0 诊断；build、dist API、canonical local parity 通过；`toothbrush.nal` 受影响 smoke 为 `1/1`。
- 审计前后：生产 `new LinkedHashSet` `13 → 12`，直接 jree 导入文件 `95 → 95`，`new LinkedHashMap` `35 → 35`；迁移扫描 collection-method `560 → 561` 是新增测试 `.size()` 带来的扫描计数变化，不是生产依赖增加。
- 本批不运行 M1-/#245：该项是局部 Set 小簇，已有直接合同、串行 M2、local parity 和受影响 smoke；共享领域 Set/Map、迭代器或调度簇扩大时再按规模触发 M1-。

本批可以宣称 `ProcessJudgment` 这一局部 Set 去 jree 化已验证；不能宣称 023/024 完成、jree 已移除、完整 M1/#245 本批重跑、Java/TypeScript 性能等价或正式发布。代码与测试已由 `fb2a3c917f1bdcaa7bac4e53a33e42431fdc8846` 提交并推送，状态说明与阶段报告随后补录，`v0.1.0` 不移动。

### 当前候选：`Variables` 统一索引 Set 原生化（2026-09-17）

本批代码提交为 `52d4f5d`，提交前回退基线为 `35f6d4d`。对照 canonical Java `Variables.unify` 的声明与历史 blame，确认 `matchedJ` 的原始类型是 `Set<Integer>`、实现是 `LinkedHashSet`，职责是记录已经使用的右侧索引；TypeScript 现使用 `NativeSet<java.lang.Integer>`，保留 Set 抽象、Java `Integer` 包装边界、唯一性和插入顺序。新增回归验证 `(|,a,a)` 与 `(|,a,b)` 不能复用一个右侧索引。

- M2：定向回归 `40/40`，串行单测 `243/243`（`test/entity/TLink.test.ts` 仍由统一入口纳入），非增量 `tsc --noEmit --pretty false --incremental false` 为 0 诊断；build、dist API、canonical Java local parity 均通过。
- M1-：显式 canonical JAR、单线程、cold、`--chunk-size 1`、`--cycles 1550`，排除长期稳定性 #245；`single_step=215`、`multi_step=24`、`application=5`，主资源 `244/244`，0 exception、0 marker missing、0 timeout、0 stall、0 process limit、0 not-run、0 Java/TS diff。证据 JSONL 在项目外归档。
- 资源观测：Java 阶段时长合计 `161,997 ms`，TypeScript `1,649,672 ms`，TS/Java 约 `10.18x`；TS 最大 RSS `1,193,345,024 bytes`。这是性能观测，不是本批性能优化完成结论。
- canonical Java：source commit `8675b76fe8c21ee20a7b8c1b63408fb05327210d`；JAR SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`。
- 审计前→后：`new LinkedHashSet 12→11`、直接 jree 导入文件 `95→95`、`new LinkedHashMap 35→35`；迁移扫描 collection-method `560→561` 是新增测试 `.size()` 造成的计数变化，不是生产依赖增加。

本批同步完成历史前向审查。已确认此前 `7b9f1d4` 修正的 `7bef525`（Stamp 两处）、`4ff0860`（ProcessGoal 一处）和 `a89d003`（Temporal 两处）Set→List 错配仍保持为 `NativeSet`。本次还登记了 `dda82d0` 的 `Concept.anticipations`、`cdbf968` 的 `Concept.recent_intervals`/`CompoundTerm.extractIntervals`、`3ae6874` 的 `SensoryChannel.results`、`0af732b` 的 `VisionChannel.prototypes` 等 Java List→数组历史转换；后续复核见文末补录，不能按类型名称直接判定必须回退。

本候选可以宣称 `Variables` 局部 Set 去 jree 化已通过 M2 与 M1-；不能宣称 023/024 完成、全部历史 List 边界已对齐、#245 长期稳定性通过、Java/TypeScript 性能等价或正式发布。代码、测试和本批报告已在后续状态提交中推送；`v0.1.0` 未移动。

## 平台中立与发布冻结状态

`spec 024` 当前已完成：

- P0 平台与依赖盘点；
- P1 配置文本解析、原生配置对象和默认配置边界；
- P2 NAL 文件/文本的宿主边界。

仍未完成：

- P3 插件与宿主能力注册合同；
- P4 浏览器配置文本/上传入口；
- P5 浏览器可达路径上的 Node shim 清理；
- J/P 汇合后的浏览器与 Node 同提交集成冻结；
- 正式单文件 `bundle.js + .d.ts`、单一公共门面类和对外发布包；
- 独立性能门、RC 验收、正式 tag 与 release。

## 恢复开发的顺序

```text
17cec54 代码冻结点
  ├─ 同步 spec 023 已完成批次 → 继续小簇去 jree 化
  └─ 完成 spec 024 P3 → P4 → P5
             ↓
       J/P 同提交集成回归
             ↓
       正式性能门
             ↓
       bundle、公共 API、文档与 RC
             ↓
       用户批准后 tag/release
```

恢复者必须先阅读[开发者指南](developer-guide.md)和[冻结交接报告](../reports/20260827-003242.md)，再运行 LeanSpec board/search/view。不要把未完成 spec 标成 complete，也不要清理当前工作区中来源不明的历史证据或探针。

### 当前候选：`Terms` 图像/Product 局部 Set 原生化（2026-09-17）

本批继续对照 Java 源码做历史前向审查。`Terms.equalSubjectPredicateInRespectToImageAndProduct` 中的 `componentsA`、`componentsB` 原始类型均为 `Set<Term>`、实现为 `LinkedHashSet`；实际调用只有逐项 `add` 与插入顺序遍历，用于成员去重和比较。TypeScript 已改用 `NativeSet<Term>`，保留 Set 抽象、Term 值相等去重和顺序，不改变等价判断分支或公共返回形状。

- 定向回归覆盖重复变量的 Product/Image 等价路径，相关回归与 NativeSet 共 `8/8` 通过。
- M2：串行统一单测 `245/245`，失败 0、跳过 0；显式非增量 `tsc` 为 0 诊断；build、dist API、canonical Java local parity 均通过。
- 受影响 NAL：`nal4.0.nal`～`nal4.8.nal`，canonical JAR、单线程、cold、1550 周期、逐文件串行，`9/9` 通过，0 failure。
- 审计前→后：生产 `new LinkedHashSet` `6 → 4`，直接 jree 导入文件 `95 → 95`，`new LinkedHashMap` `35 → 35`，`new ArrayList` `0 → 0`。collection-method `563 → 565` 是扫描到 `.add` 调用的变化，不是生产 jree 构造增加。

本批按局部 Set 风险规则不重新运行 M1-/#245；不能把局部证据表述为新的 M1 全量通过。023 仍保持 `in-progress`，`CompoundTerm` 公共 Set 返回、`Anticipate` Map value Set 和 jree 兼容层继续单独审查。阶段报告为 `reports/20260917-132229.md`。

### 当前候选：`Anticipate.newTasks` Set 原生化（2026-09-17）

本批继续做历史前向审查。对照 canonical Java `Anticipate` 的声明与调用，确认 `newTasks` 的原始合同是 `Set<Term> + LinkedHashSet<Term>`，用途是登记待派发 Term，并依赖 `add`、`remove`、`clear`、空判断、Term 值相等去重和插入顺序。TypeScript 现改为 `NativeSet<Term>`，源码保留“Java 原始 Set/LinkedHashSet → 当前 NativeSet”的注释；没有将 Set 降为数组，也没有触碰 `anticipations` Map、Map value Set、`ae` 临时 Set 或目标派发规则。

- M2：定向 `anticipate.test.ts + native-set.test.ts` 为 `8/8`；串行统一单测 `244/244`，失败 0、跳过 0；`test/entity/TLink.test.ts` 仍由统一入口纳入。
- 构建与合同：`npx tsc --noEmit --pretty false --incremental false` 为 0 诊断；build、dist API、canonical Java local parity 均通过。
- 受影响 NAL：`nal8.add.nal` 使用显式 canonical JAR、单线程、cold、1550 周期、逐文件运行，Java/TS `1/1` 通过。
- 审计前→后：生产 `new LinkedHashSet` `11 → 6`，直接 jree 导入文件 `95 → 95`，`new LinkedHashMap` `35 → 35`，`new ArrayList` `0 → 0`。迁移扫描 collection-method `561 → 563` 来自新增测试调用，不是生产依赖增加。

本批按局部 Set 风险规则不重新运行 M1-/#245；不能把本批局部证据说成新的 M1 全量通过。023 仍保持 `in-progress`，尚未完成的共享 Map/Set、其它 jree 运行时依赖、公共 API 和平台边界继续按原有门禁推进。阶段报告为 `reports/20260917-131050.md`。

### 2026-09-17：CompoundTerm 递归 Set 原生化

本批继续对照 canonical Java 做历史前向审查，并将 `CompoundTerm.getContainedTerms()` 与 `addComponentsRecursively()` 的两个 Java `Set<Term> + LinkedHashSet` 实现替换为 `NativeSet<Term>`。Java 公共返回形状仍保留为 `java.util.Set<Term>`；唯一性、Java `equals` 值相等、首次加入顺序和递归算法均保持不变。`CompositionalRules` 对后一个入口有真实消费，因此本批在 M2 后执行 M1- 保护矩阵。

- canonical Java source commit：`8675b76fe8c21ee20a7b8c1b63408fb05327210d`；JAR SHA-256：`2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`；classes/test-classes 来自 `OpenNARS-304-java-canonical-fixed-build`，未覆盖历史 JAR。
- M2：定向回归 `45/45`；`npm test`/`npm run test:unit:serial` `246/246`，失败 0、跳过 0；显式非增量 `npx tsc --noEmit --pretty false --incremental false` 为 0 诊断；build、dist API、canonical local parity 均通过。
- M1-：显式排除 `stability/long_term_stability.nal` 后的 244 个主资源，`single_step=215`、`multi_step=24`、`application=5`，`244/244` 功能与 parity 通过；0 exception、0 marker missing、0 no-progress timeout、0 process limit、0 not-run、0 Java/TS diff。Java 总耗时 `157,614 ms`，TypeScript `1,644,344 ms`，总计 `1,801,958 ms`；本批未启用 `--resource-metrics`，不新增内存节省结论。
- markerless 补证：`nal6.redundant.nal` 的 Java/TS stage digest 均完成 `131072` 周期、`128` 个窗口、`589572` 个事件，`incomplete=false`，比较结果 `equal=true`、`first_difference=null`。
- 审计前→后：生产 `new LinkedHashSet` `4→2`、`new LinkedHashMap` `35→35`、`new ArrayList` `0→0`、直接 jree 导入文件 `95→95`；迁移扫描的 collection-method `565→568` 来自本批 Set 调用/测试观察，不是新增 jree 构造。当前仍有 95 个直接 jree 导入文件，023 不能标记完成。
- 前向审查继续遵循“Map 仍为 Map、Set 仍为 Set、无特殊 List 合同时优先原生数组”的原则；本批没有修改既有 Java List→数组边界。阶段报告为 [reports/20260917-132959.md](../reports/20260917-132959.md)。

本批可以宣称 `CompoundTerm` 递归 Set 辅助已原生化并通过 M2、M1- 和 markerless 长周期证据；不能宣称 023/024 完成、jree 已移除、#245 已在本批重跑、Java/TypeScript 性能等价或正式发布。下一批仍应先回到 Java 合同，优先审查 `Anticipate` 的公开 Map value Set 或其他具有明确 Set/Map 责任的簇。

### 当前候选补录：历史 List→数组边界复核（2026-09-17）

用户确认“除非有特殊需要，否则原生数组更合适”。据此复核此前登记的历史转换：Java `List` 名称本身不构成必须恢复 `NativeList` 的理由；应以实际调用面和对外兼容要求判定。

| 历史提交 | Java 原类型 → 当前 TypeScript 类型 | 实际调用面 | 当前结论 |
| --- | --- | --- | --- |
| `dda82d0` | `List<AnticipationEntry> + ArrayList` → `AnticipationEntry[]` | 有序遍历、追加、按身份删除、过滤、长度 | 数组成立；`ProcessAnticipation` 独占修改 |
| `cdbf968` | `List<Float>` → `float[]`；`List<Long>` 返回 → `long[]` | 数值索引读写、追加、长度、顺序结果遍历 | 数组成立；没有 List 专有调用 |
| `3ae6874` | `Collection<SensoryChannel>`/`List<Task>` → 数组 | 私有目标遍历；结果追加、遍历、清空 | 数组成立；不要求 Collection/List 方法 |
| `0af732b` | `ArrayList<Prototype>` → `Prototype[]` | 索引读取、追加、按索引替换、顺序遍历 | 数组成立；随机访问是主要操作 |

源码已补充每处的“原始 Java 类型 → 当前类型 → 适用范围”注释。当前没有发现需要回退的历史逻辑错误；未来若出现 `.size/.get/.add` 兼容要求、Java 值相等删除/迭代器删除、并发可见性或公共 List 形状依赖，再单独引入 `NativeList`/兼容视图。该复核不改变已冻结的 M1/M2 结论，也不宣称 023 完成。

### 2026-09-17：`Anticipate` 预测 Map value Set 原生化（本批完成，023 仍进行中）

本批继续做历史提交前向审查。对照 canonical Java `Anticipate.java`，确认 `anticipations` 的原始形状为 `Map<Prediction, LinkedHashSet<Term>>`；内层 Set 需要 Term 值相等去重、插入顺序以及 `Iterator.remove()`，不能按 List 或数组处理。TypeScript 保留外层 Java `LinkedHashMap`，仅将具体 value 改为 `NativeSet<Term>`；新增 `NativeSet.iterator().remove()` 与变更检查，并在源码注明 Java 原始类型。Prediction 键、外层 Map 的 entry iterator.remove、目标派发与其它推理规则未改动。

定向回归最终为 `10/10`，完整串行 M2 为 `248/248`，非增量 `tsc` 为 0 诊断，build、dist API、canonical local parity 均通过；`nal8.add.nal` 受影响 smoke 为 `1/1`。首轮 M1- 的原始结果为 `243/244`，唯一异常是 canonical Java 子进程在 `multi_step/nars_multistep_2.nal` 上退出；同一文件 TypeScript 为 `2/2`，独立 canonical 重跑为 `1/1`，因此未形成 TS 语义差异。修复外层 Map 延迟删除后，最终以显式排除 #245 的 244 个文件、canonical JAR、单线程、cold、逐文件单进程方式完成 M1-：`244/244`，分层为 `single_step=215`、`multi_step=24`、`application=5`；Java/TS 均为 0 exception、0 marker missing、0 timeout、0 stall、0 process limit、0 not-run、0 Java/TS diff。

本批首先暴露了 jree `LinkedHashMap` entry iterator 不支持 Java `Iterator.remove()` 的边界，随后保留外层 Map 抽象，以有序 Prediction 临时数组收集待删项，遍历后调用 `Map.remove()`，并增加了对应生命周期回归。最终 M1- Java 总耗时 `159,782 ms`、TypeScript `1,655,338 ms`、合计 `1,815,120 ms`，TS/Java 约 `10.36x`，最大单行 `363,928 ms`；本次未启用 resource metrics，不新增内存节省比例。canonical Java source commit 为 `8675b76fe8c21ee20a7b8c1b63408fb05327210d`，JAR SHA-256 为 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`。023 继续保持 `in-progress`，本批不能宣称 jree 已移除、#245 通过、性能等价或里程碑完成。

### 2026-09-17：G0 最新稳定 HEAD 的 M1/M2 全量保护门

本批在稳定提交 `26772af507f96516311bc2077869fe5ee4151f77` 上暂停新的迁移，只验证当前代码。Java 对照固定使用 canonical 304 artifact：source commit `8675b76fe8c21ee20a7b8c1b63408fb05327210d`，JAR `opennars-3.0.4-SNAPSHOT.jar`，SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`；Java/TypeScript 均为单线程、cold、逐文件串行。

- M1 主资源共 245 个：首轮固定 `900000 ms` 进程安全上限下完成 `244/245`，唯一未完成是 `stability/long_term_stability.nal` 的 TypeScript process-limit；该行原始证据保留。随后以 `3600000 ms` 独立串行恢复，#245 完成 `1/1`，没有异常、无进展 timeout 或 Java/TS 差异。
- 额外 `src/test/simpleOperationTest.nal` 完成 `1/1`。有效 M1 合计 `246/246`，`java_ts_diff=0`、exception 0、timeout 0、process-limit 0、not-run 0、marker missing 0。
- 两个 markerless 样本均按 `--skip-embedded --cycles 131072 --window-size 1024` 完成 `131072` 周期和 `128` 个窗口：`nal6.redundant.nal` 为 `589572` 事件，`simpleOperationTest.nal` 为 `2535970` 事件；Java/TS 两组均 `equal=true`、`first_difference=null`、`incomplete=false`。
- M2 串行单测 `248/248`，统一入口包含 `test/entity/TLink.test.ts`；`npm run typecheck` 使用显式 `--incremental false` 且为 0 诊断；build、dist API、canonical local algorithm parity、release、直接 CLI/Shell smoke、jree/platform 审计、迁移模式扫描、汉字检查和 `git diff --check` 均通过。release 检查的运行时 warning 为 none。
- 当前 M1 运行观测：Java 总运行时约 `241388 ms`，TypeScript 总运行时约 `3881779 ms`，TS 最大 RSS `2998956032 bytes`。这些是后续性能优化的输入，不改变功能等价判定。

Java 基准采用“功能字段可冻结、资源指标不冻结”的策略：在 Java artifact、源码/classes/test-classes、依赖 JAR、fixture、runner/验收合同、JDK、线程/随机条件均未变化时，后续日常批次可复用已封存的 Java `expected/matched/ok/error` 结果，只运行 TypeScript 并重新采集耗时、marker 时间和 RSS；上述任一条件变化，或基准本身出现异常/资源限制，就必须重新运行 Java。当前批次仍实际运行了 Java，避免把“未执行”误记为对照通过。旧 M1- 与本批 244 个共同文件的稳定 Java 字段差异为 `0`。

当前去 jree 路线仍未完成：静态审计显示生产直接 jree 导入 `95` 个文件、`new LinkedHashMap=35`、`new LinkedHashSet=1`、candidate native items `68`。`src/runtime/jree-compat.ts` 仍是过渡桥接层，集中承接 Java 字符串/哈希、float/long、异常、类身份、随机数和集合边界；后续必须按“数据结构 → 容器 → 推理规则 → 推理引擎 → 宿主入口”逐簇拆除，不能把 Set 当 List、把 Map 当普通对象，也不能因底层使用数组就省略原始 Java 类型和判等/顺序/迭代器契约。

证据 manifest 和原始/有效 JSONL、summary、分类矩阵及四份 stage digest 位于项目外：`H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\g0-artifact-manifest-26772af-20260917.json`。阶段细节见 [G0 阶段报告](../reports/20260917-154752.md)。

本批可以宣称：当前稳定 HEAD 在 canonical Java 304、单线程和已定义 245+1 观测面上通过 M1/M2 G0 保护门。仍不能宣称：023/024 完成、生产核心已去 jree、浏览器可达图无 shim、Java/TypeScript 性能等价或正式发布。

#### Java canonical 标杆三轮一致性冻结（2026-09-17）

在同一 canonical JAR、单线程、`chunk-size=1`、`cycles=1550`、`timeout=180000 ms`、`process-limit=1800000 ms` 下，Java 主矩阵 `245` 项加额外 `simpleOperationTest.nal` 共 `246` 项，连续三轮的归一化功能投影均为 `246/246`，轮次两两差异均为 `0`。归一化字段包含期望/实际 marker、`ok`、错误分类、异常/超时/退出/未运行/marker 缺失和 `functional_pass`；不包含耗时、RSS、绝对路径等运行观测。

第 3 轮主矩阵的 `long_term_stability.nal` 曾出现一次退出码 `4294967295` 的环境/进程稳定性失败；原始证据未覆盖，重跑该单项成功后才纳入有效 run3。三轮有效 Java 观测总时长分别为 `244128 ms`、`244967 ms`、`254975 ms`；这些数值只用于性能观察，不作为功能基线字段。

已冻结的 Java 功能标杆位于项目外归档目录：

- `g0-java-baseline-frozen-26772af-20260917.jsonl`：246 行，SHA-256 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`；
- `g0-java-baseline-manifest-26772af-20260917.json`：SHA-256 `889274025E3C38A05D90BCC3FBF59F65AF3C2454E43DC209ABC88C4EB5009799`。

后续可在 canonical Java artifact、源码/classes/test-classes、依赖、fixture、runner/验收合同、JDK、线程/随机种子/配置不变且 manifest 校验通过时，仅运行 TypeScript 并对照这份 Java 功能标杆；耗时、marker 时间戳和 RSS 每次重新采集。若任一条件变化或基准出现异常，必须重新运行 Java。当前 Java 标杆已满足“三次一致后归一化”的条件，但不改变 TypeScript 性能尚待优化、023/024 尚未完成的结论。

### 2026-09-17：primitive alias 去 jree 化批次

本批从 `bff971e90214bba93d8b397a10b327a3dac454a0` 开始，完成一项不改变运行时语义的编译期迁移：在 `src/types.ts` 建立项目自有的 `int`、`char`、`short`、`long`、`float`、`double` 别名，将 67 个生产文件中的 145 个 primitive alias 导入从 jree 移出。各文件保留其余 jree runtime 导入，并以注释记录“Java 原别名 → 项目类型契约”；没有将这次改动误称为 Float32、int32 或 long 运行时语义实现。

- M2：串行统一单测 `250/250`，显式非增量 `tsc` 为 0 诊断；build、dist API、canonical local algorithm parity 和受影响的 `nal8.add.nal` smoke 均通过。
- M1-：显式排除 `#245` 后，主资源 `215 single_step + 24 multi_step + 5 application + 1 extra` 共 `245/245` 通过；Java/TS parity `245`，差异、异常、无进展 stall、process limit、marker missing、not-run 均为 0，线程模式全部为 `single/single`。
- M1- 证据位于项目外归档：`g2-primitive-alias-m1-minus-20260917-bff971e.jsonl`，SHA-256 为 `0D61DC45679FEC63FE0A4B01F1687766F9FF26024114A560D5678C73DFD84994`。Java canonical JAR SHA-256 仍为 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`。
- 运行观测：Java 总运行时 `170,668 ms`，TypeScript `1,804,291 ms`；TS 平均峰值 RSS 约 `257.5 MiB`，最大约 `1,185.3 MiB`。性能差距记录为后续独立优化输入，不作为本批功能门失败。
- 去 jree 审计当前仍为生产直接导入文件 `95`、`new LinkedHashMap=35`、`new LinkedHashSet=1`；因此 023 仍为 `in-progress`，不能宣称生产核心已去 jree 化。
- runner 已新增 `--engine ts --java-baseline <冻结 JSONL>`：校验当前 fixture、读取冻结 Java 功能字段、只运行 TS，并输出冻结文件 SHA-256、Java source commit 与 Java artifact SHA-256；回归 smoke `nal8.add.nal` 为 `1/1`，`java_process_mode=frozen-baseline`。

本批明确更新基线使用方式：日常 G0/M1- 应在校验 Java artifact、依赖、fixture、runner 合同、JDK、线程/随机/配置均未变化后，复用三轮一致的 Java 功能标杆，仅运行 TS 并重新采集时间、marker 时间戳和 RSS；本批 M1- 在该入口落地前已完成，因此是一次性 Java+TS 双跑。023/024 的整体验收必须现跑 Java，与冻结功能投影逐字段比较，差异经解释并获准后才能刷新标杆。

### 2026-09-17：Java 隐式 Object 标记性继承去 jree 化

本批继续对照 canonical Java 304 做历史前向审查。确认 `Instance`、`InstanceProperty`、`Property`、`ProcessTask`、`GeneralInferenceControl` 和 `Debug` 的 Java 原始声明均未继承专用父类；当前 TypeScript 的 `extends JavaObject` 只是转写器为 Java 隐式 `Object` 添加的 jree 运行时壳。搜索实例化、`instanceof`、`getClass()` 和类 token 消费后，没有发现这些六个类的实例身份被业务逻辑使用；真正的 `Events.*.class` 事件标识未触碰。

因此本批移除六个类的 `JavaObject` 继承和仅为此存在的 jree 导入，保留静态工厂、任务派发、推理控制和调试字段不变；源码注释记录“Java 隐式 Object → 原生 TypeScript 类”的前后关系。新增回归验证六个类不再位于 jree `JavaObject` 原型链上，并验证 Instance/InstanceProperty/Property 的静态工厂输出结构。

- M2：定向 core-runtime `34/34`；串行统一单测 `251/251`，失败 0、跳过 0；显式非增量 `tsc` 为 0 诊断；build、dist API、canonical local algorithm parity 均通过。
- 受影响语言 smoke：`nal2.13.nal`、`nal2.14.nal`、`nal2.15.nal` 使用冻结 Java 功能标杆做 TS-only 对照，`3/3`；异常 0、marker 缺失 0、no-progress timeout 0、process limit 0、not-run 0。
- 冻结 Java 基线未改变：baseline JSONL SHA-256 为 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`；canonical Java source commit 为 `8675b76fe8c21ee20a7b8c1b63408fb05327210d`，JAR SHA-256 为 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`。
- 审计前→后：生产直接 jree 导入文件 `95→89`，JavaObject 文件 `53→47`；`new LinkedHashMap=35`、`new LinkedHashSet=1` 未变。迁移扫描 224 个文件，malformed 项均为 0。
- 本批未运行 M1- 或 #245：这是六个无实例消费的继承壳小簇，已有直接合同、串行 M2、local parity 和受影响 NAL smoke；涉及共享领域集合、推理调度、公共 API 或运行时类身份的后续簇必须重新评估 M1-。

本批可以宣称：上述六个历史 JavaObject 标记性继承点已在 023 下原生化，并通过局部回归、M2 和三个受影响 NAL 的冻结标杆对照。不能宣称：023/024 完成、jree runtime 已移除、M1/#245 在本批重新全量通过、性能等价或正式发布。阶段细节见 [Java 隐式 Object 标记性继承批次报告](../reports/20260917-194533.md)。

### 2026-09-17：`Map<Term, Integer>` 计数簇原生化

本批继续沿“数据结构 → 容器 → 推理规则 → 推理引擎 → 宿主入口”做 023 的历史前向审查。对照 canonical Java，确认 `Term.countTermRecursively`、`CompoundTerm.countTermRecursively` 和 `Variable.countTermRecursively` 的原始类型都是 `Map<Term, Integer>`，且首次创建时具体实现为 `LinkedHashMap`。其中 `Term`/`CompoundTerm` 按 Java `equals` 累加值，`Variable` 只创建并传递累加器、不计数。此前 TS 的前状态是 `new java.util.LinkedHashMap`；本批后状态是项目内 `NativeMap<Term, java.lang.Integer>`，对外方法签名仍为 Java `Map<Term, Integer>`。

新增的 `src/runtime/NativeMap.ts` 保留 Map 的独立抽象，不以数组或 List 冒充 Map：查找以被搜索键的 Java `equals` 为准；相等键替换时保留首个键和原插入位置；`keySet`、`entrySet`、`values` 是 live views；视图迭代器支持 `remove()` 和 fail-fast 检查。`NativeSet` 仅导出共享的 Java 值相等函数，未改变其 Set 语义。源码注释明确标出“Java `LinkedHashMap<Term,Integer>` → NativeMap”，没有迁移 Bag、变量替换 Map 或其他领域 Map。

- 定向 NativeMap/core-runtime 回归：`40/40`，包含 equal-but-distinct key、替换顺序、null value、live view、iterator.remove、fail-fast、jree `LinkedHashMap` 对照和计数器实际返回类型。
- M2：串行统一单测 `257/257`，失败 0、跳过 0；`npm run typecheck` 使用显式 `--incremental false` 为 0 诊断；build `sourceFileCount=135`、dist API 均通过。canonical local algorithm parity 为 `ok=true`、`differences=[]`，JAR SHA-256 为 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`。
- M1-：使用单线程、cold、逐文件串行、`--engine ts --java-baseline`，显式排除 #245 的 244 个主资源（`single_step=215`、`multi_step=24`、`application=5`），`functional_pass=244/244`；marker missing、TS exception、stall、process limit、performance warning、failed 均为 0。243 行走 marker 等价路径；1 行 markerless 短运行未达到 131072 周期，但不影响其功能通过，也不替代已有 markerless 长周期 digest 证据。
- M1- 证据位于项目外归档：`g3-count-map-m1-minus-20260917.jsonl`，SHA-256 为 `5CDAD861753CF5E7A4E689DD389DE32212D183CCC33ECD262C259E7D39398737`；使用冻结 Java 标杆 `g0-java-baseline-frozen-26772af-20260917.jsonl`，其 SHA-256 为 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`，Java source commit 为 `8675b76fe8c21ee20a7b8c1b63408fb05327210d`。
- 运行观测：M1- TS 总时长 `1,755,052 ms`，平均每文件约 `7,193 ms`，最大单文件 `389,509 ms`，最大 TS RSS `1,224,298,496 bytes`，推理周期合计 `2,288,254`。相对功能结论，这些只作为后续性能优化输入；本批没有把慢运行判为逻辑错误，也没有重新运行 Java 全量矩阵。
- 去 jree 生产审计：`new LinkedHashMap` `35→32`；直接 jree 导入文件仍为 `89`，`new LinkedHashSet` 为 `1`，说明本批只完成一个明确 Map 计数簇，不代表 jree 已退场。迁移扫描更新为 226 个文件；malformed generic/operator/new-this/constructor-delegation 均为 0。

本批可以宣称：计数算法的一个 `Map<Term,Integer>` 簇已按 Java 合同原生化，并通过局部合同、M2 与冻结 Java 标杆 M1- 保护矩阵；当前工作区仍可在此基础上继续下一类经 Java 合同确认的 jree 依赖。不能宣称：023 完成、全部生产 Map 已原生化、#245 在本批重新运行、Java/TypeScript 性能等价或正式发布。完整 023/024 验收时仍需重新运行 canonical Java，并与冻结标杆逐字段核对。

### 2026-09-17：`Nar.sensoryChannels` Map 原生化批次

本批以 `df7ba35` 为前向基线，继续按“数据结构 → 容器 → 推理规则 → 推理引擎 → 宿主入口”审查 023。对照 canonical Java `Nar.java`，确认 `sensoryChannels` 的原始声明为 `Map<Term, SensoryChannel>`，具体实现为 `LinkedHashMap`；`addSensoryChannel`、感知派发、插件移除和反序列化重建分别依赖 `put`、`containsKey`、`get`、`remove`、`values`。本批将两个构造点改为 `NativeMap<Term, SensoryChannel>`，对外仍保留 Java Map 类型形状，并以注释记录 Java 原类型；没有将 Map 改成数组或普通对象。

- 新增 `nar-sensory-channel-map.test.ts`：以独立但 Java `Term.equals` 相等的键查询、覆盖、删除，并确认实际 registry 为 NativeMap。
- M2：统一串行单测 `258/258`，失败 0、跳过 0；`npm run typecheck` 使用显式 `--incremental false` 为 0 诊断；build、dist API、canonical local algorithm parity 均通过。
- M1-：使用三轮一致的冻结 Java 功能标杆，TS-only、单线程、cold、`chunk-size=1`、逐文件独立运行，排除 #245，`244/244` 通过；分层为 `single_step=215`、`multi_step=24`、`application=5`。TS exception、marker missing、无进展 stall、process limit、not-run、性能 warning 与功能失败均为 0。243 行走 marker 等价路线，1 行 markerless 短运行未到 131072 周期，不替代已有 markerless 长周期证据。
- M1- 结果位于项目外归档：`g4-nar-sensory-map-m1-minus-20260917.jsonl`，SHA-256 为 `AC11509A4EC0378C0A89851C82C10EE4EBEF6EF7D351EAE936CDF8783109C6D0`；冻结标杆 `g0-java-baseline-frozen-26772af-20260917.jsonl` 的 SHA-256 仍为 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`。本轮 `java_artifact=null`，明确没有启动 Java 全量矩阵。
- 运行观测：TS 总时长 `1,685,890 ms`，最长单文件 `365,186 ms`，最大 RSS `1,226,625,024 bytes`，推理周期合计 `2,288,254`；耗时与 RSS 只作为后续性能优化输入，不作为功能门失败。
- jree 审计前→后（相对 `df7ba35`）：`new LinkedHashMap` `32→30`，直接 jree 导入文件仍为 `89`；当前扫描为 227 个文件，`semanticReviewItems=99`、`candidateNativeItems=2`。这说明本批只移除两个明确构造点，不代表生产 jree 已退场。

本批可以宣称：`Nar.sensoryChannels` 的 Map 簇已在 023 下原生化，并通过直接合同、M2 与冻结 Java 标杆 M1- 保护。仍不能宣称：023/024 完成、#245 在本批重跑通过、markerless 长周期在本批重新验证、生产核心完全去 jree、Java/TypeScript 性能等价或正式发布。日常批次继续复用冻结 Java 功能字段；023/024 整体验收时仍需现跑 canonical Java 并与标杆逐字段核对。

### 2026-09-17：CompositionalRules 局部 Map 原生化批次

本批以 `fdda235` 为前向基线，对照 canonical Java `CompositionalRules.java`，确认 `eliminateVariableOfConditionAbductive` 的 `res1`—`res4` 与 `introduceVariables` 的 `app`、`mapping` 都是方法内 `Map<Term,Term>`，具体实现为 `LinkedHashMap`。调用面仅包含 `put`、`get`、`clear`、`size`、`getOrDefault` 和有序 `keySet` 快照，没有把 Map 当作 List 或 Set 使用。

- 以 `nativeTermMap()` 将六个构造点切换为 `NativeMap`，保持对外 Java `Map` 类型、Term 值相等查找、替换语义和插入顺序；注释记录 Java 原始类型与实现类型。
- 新增 `CompositionalRules.introduceVariables` 直接回归：重复 subject 的变量引入结果与 Java 兼容文本及 penalty 均符合预期。统一串行单测 `259/259`，非增量 `tsc` 为 0 诊断，build、dist API、local algorithm parity 均通过。
- M1- 使用 TS-only、单线程、cold、逐文件串行和冻结 Java 功能标杆，排除 #245 的 244 个主资源 `244/244` 通过；分层 `single_step=215`、`multi_step=24`、`application=5`。TS exception、marker missing、stall、process limit、not-run、performance warning 和功能失败均为 0。243 行走 marker 等价路线，1 行 markerless 短运行未到 131072 周期。
- M1- 证据位于项目外：`g4-compositional-rules-m1-minus-20260917.jsonl`，SHA-256 为 `268BB09A2AE298A603295DD5934B7F98915B612C8172A5895EA1D6B2A48D3DB4`；冻结 Java 标杆 SHA-256 仍为 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`，Java artifact SHA-256 仍为 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`。
- 运行观测：TS 总耗时 `1,587,700 ms`，最长单文件 `329,008 ms`，最大 RSS `1,270,341,632 bytes`，推理周期合计 `2,288,254`；这些数据只用于后续性能优化。
- jree 审计前→后（相对 `fdda235`）：`new LinkedHashMap` `30→24`，直接 jree 导入文件仍为 `89`；平台审计扫描 172 个文件，迁移模式扫描 227 个文件，malformed 项均为 0。

本批可以宣称：`CompositionalRules` 六个局部 `Map<Term,Term>` 构造点已按 Java Map 合同原生化，并通过直接回归、M2 与冻结 Java 标杆 M1- 保护。仍不能宣称：023/024 完成、生产核心完全去 jree、#245 本批重跑通过、markerless 长周期在本批重新验证、Java/TypeScript 性能等价或正式发布。日常批次继续复用冻结 Java 功能字段；023/024 整体验收仍需现跑 canonical Java 并与标杆逐字段核对。

### 2026-09-18：`Variables` 统一映射簇原生化批次

本批以 `2b94dac2560558cff416463be83a1dcbedf19a65` 为前向基线，对照 canonical Java `Variables.java` 审查统一变量替换路径。Java 中 12 个具体构造点的声明均为 `Map<Term, Term>`，实现为 `LinkedHashMap`；`copyMapFrom` 保留两个 Map 的数组形状，并按源 Map 的 `keySet` 顺序逐项 `put` 到新 Map。本批只替换具体实现，不把 Map 改成数组、Set 或普通对象，也没有改动统一算法。

- `src/language/Variables.ts`：12 个懒初始化、复制和默认参数构造点由 jree `LinkedHashMap` 改为 `NativeMap`；对外仍为 Java `Map<Term, Term>`，保留 Term 值相等查找、覆盖语义和插入顺序，并标注“Java 原类型 → NativeMap 实现”。
- `test/node/variables-substitution.test.ts`：新增直接回归，验证替换路径懒初始化两个 NativeMap，并能以变量键取回绑定 Term。
- M2：直接测试 `5/5`；串行统一单测 `260/260`，失败 0、跳过 0；`npm run typecheck` 使用显式 `--incremental false`，0 诊断；build、dist API、canonical local algorithm parity 均通过。
- M1-：使用三次一致的 Java 功能冻结标杆，仅运行 TypeScript，单线程、cold、逐文件串行、244 个主资源（`single_step=215`、`multi_step=24`、`application=5`）`244/244` 通过；Java/TS diff、TS exception、marker missing、stall、process limit、not-run 和 performance warning 均为 0。243 个样本走 marker 路径；1 个 markerless 短运行未达到 131072 周期，因此不新增长周期证据。
- M1- 证据位于项目外：`g4-variables-map-m1-minus-20260917.jsonl`，SHA-256 `6683B34AB110404CE0DE9F82F7B0B8615BFD0D1E63902D4FCD9C43070C61352A`。TS 总耗时 `1,580,493 ms`，最长单文件 `324,434 ms`，最大 RSS `1,242,873,856 bytes`，推理周期合计 `2,288,254`；性能观测仅作为后续优化输入。
- Java 标杆未变化：冻结 JSONL `g0-java-baseline-frozen-26772af-20260917.jsonl` SHA-256 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`；canonical source commit `8675b76fe8c21ee20a7b8c1b63408fb05327210d`；canonical JAR SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`。本批未启动 Java 全量矩阵，因为 artifact、源码/classes、依赖、夹具、runner 合同、JDK、线程和随机/配置均未变化；023/024 整体验收仍须现跑 Java 与冻结标杆逐字段核对。
- 审计当前：生产 `src` 136 个文件，直接 jree 导入文件 `89`，`new LinkedHashMap=12`，`new LinkedHashSet=1`，`JavaObject=38` 个文件，`Java util=40` 个文件，`Java lang=87` 个文件，`Java String=52` 个文件；迁移模式扫描 227 个文件，malformed generic/operator/new-this/constructor-delegation 均为 0，platform findings 为 0。

本批可以宣称：`Variables` 统一 Map 实现已按 Java Map 合同原生化，并通过直接回归、M2 和冻结 Java 标杆 M1- 保护。仍不能宣称：023/024 完成、生产核心完全去 jree、#245 在本批重跑通过、markerless 131072 周期等价、Java/TypeScript 性能等价或正式发布。阶段细节见 [Variables 统一映射批次报告](../reports/20260917-232955.md)。

### 2026-09-18：`SyllogisticRules` 临时替换 Map 原生化批次

本批以 `e4bb8f3c9a88f774cae811270c5a3e2bae02c034` 为前向基线，对照 canonical Java `SyllogisticRules.java` 与 `ProcessAnticipation.java`。确认 `conditionalAna` 在预测确认成立时创建一个临时 `Map<Term, Term>`，具体实现为 `LinkedHashMap`，随后仅交给 `ProcessAnticipation.anticipate`，由 `CompoundTerm.applySubstitute` 读取；该点没有独立的 key 表、Set 语义或持久生命周期。

- `src/inference/SyllogisticRules.ts`：将单个 `new java.util.LinkedHashMap<Term, Term>()` 改为 `NativeMap<Term, Term>`，并显式收窄为 Java `Map<Term, Term>`；源码注释记录 Java 原类型与原实现。
- `test/node/anticipate.test.ts`：新增真实 `ProcessAnticipation` 调用合同，验证 NativeMap 替换映射可被推理路径接受，复合项替换结果保持正确；测试导入别名避免遮蔽 TypeScript `Parameters<>` 工具类型。
- M2：直接回归 `6/6`；串行统一单测 `261/261`，失败 0、跳过 0；显式非增量 `tsc` 为 0 诊断；build、dist API、canonical local algorithm parity 均通过；`nal9.anticipate1.nal` smoke `1/1`。
- M1-：使用三次一致的 Java 功能冻结标杆，仅运行 TypeScript，单线程、cold、逐文件串行，244 个主资源 `244/244` 通过；分层 `single_step=215`、`multi_step=24`、`application=5`；Java/TS diff、TS exception、marker missing、stall、process limit、not-run、performance warning 均为 0。243 个样本走 marker 路径，1 个 markerless 短运行未达到 131072 周期。
- M1- 证据位于项目外：`g4-syllogistic-anticipation-m1-minus-20260918.jsonl`，SHA-256 `9B115CEBC908625B47F2EFE00FD19F095EA40CB973CCCA6689CA808208F1D437`；TS 总耗时 `1,698,236 ms`，最长单文件 `368,710 ms`，最大 RSS `1,260,576,768 bytes`，推理周期合计 `2,288,254`。性能观测仅作为后续优化输入。
- Java 标杆未变化：冻结 JSONL `g0-java-baseline-frozen-26772af-20260917.jsonl` SHA-256 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`；canonical source commit `8675b76fe8c21ee20a7b8c1b63408fb05327210d`；canonical JAR SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`。本批没有启动 Java 全量矩阵，因为 artifact、源码/classes、依赖、夹具、runner 合同、JDK、线程和随机/配置均未变化；023/024 整体验收仍须现跑 Java 与冻结标杆逐字段核对。
- 审计：生产 `src` 136 个文件，直接 jree 导入文件 `89`，`new LinkedHashMap=11`、`new LinkedHashSet=1`，JavaObject 文件 `38`，java.util 文件 `40`，java.lang 文件 `87`，Java String 文件 `52`；迁移模式扫描 227 个文件，constructor-delegation、malformed-generic、malformed-operator、malformed-new-this 均为 0。platform 审计扫描 172 个文件，其中 core candidate 84、mixed boundary 5、node adapter candidate 2、browser source 2、browser shim 2 个文件/19 处，属于 024 的后续边界债务。

本批可以宣称：`SyllogisticRules` 一个临时 `Map<Term,Term>` 构造点已按 Java Map 合同原生化，并通过直接回归、M2、受影响 smoke 与 M1- 保护。仍不能宣称：023/024 完成、全部生产 jree 清零、#245 在本批重跑通过、markerless 131072 周期等价、Java/TypeScript 性能等价或正式发布。阶段细节见 [SyllogisticRules 临时 Map 批次报告](../reports/20260918-001150.md)。

### 2026-09-18：`9bd6cc0` G0 M1/M2 全量复核

本次在干净的 `HEAD=origin/main=9bd6cc0398e1cbe583cda5ef8d0261d2373f4a19` 上重新执行 G0 全量保护门。与日常 023 小批次不同，本次实际同时运行 canonical Java 与 TypeScript；后续在 Java artifact、源码/classes/test-classes、依赖、NAL 夹具、runner 合同、JDK、线程/随机条件和配置均不变时，可以复用已确认一致的 Java 标杆，只运行 TS。

- canonical Java：source commit `8675b76fe8c21ee20a7b8c1b63408fb05327210d`；JAR SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`。
- M1 主矩阵：245 项，分层为 `single_step=215`、`multi_step=24`、`application=5`、`stability=1`；Java/TS `functional_pass=245`、`parity=245`，`java_ts_diff=0`。
- 额外夹具：`simpleOperationTest.nal` 为 Java/TS `1/1`；合计 `246/246`。
- 全量错误字段：exception、timed out、stall、process limited、not run、marker missing、both wrong 均为 `0`。
- markerless 严格摘要：`nal6.redundant.nal` 与 `simpleOperationTest.nal` 均为 `131072` 周期、`128` 个 1024 周期窗口，事件数分别为 `589572` 与 `2535970`；两组比较均为 `equal=true`、`first_difference=null`、`incomplete=false`。
- 运行观测：Java 总耗时 `232755 ms`，TS 总耗时 `3599126 ms`，合计 `3831881 ms`；TS 峰值 RSS `3025555456 bytes`。这些是性能输入，不改变功能判定。
- M2：串行单测 `261/261`，失败 `0`、跳过 `0`；显式非增量 `tsc` 为 `0` 诊断；build、dist API、local algorithm parity、release/package、CLI、Shell 均通过，release 检查报告 `runtimeWarnings=none`。
- 静态检查：迁移模式扫描 227 个文件，malformed generic/operator/new-this/constructor-delegation 均为 `0`；jree 审计为直接导入 89 个文件、`new LinkedHashMap=11`、`new LinkedHashSet=1`；platform 审计扫描 172 个文件，browser shim 为 2 个文件/19 处；汉字编码检查和 `git diff --check` 通过。

本次 G0 可以宣称：在 canonical Java 3.0.4、固定单线程和当前 runner 观测面下，`9bd6cc0` 的 245+1 项功能结果与 Java 一致，两个 markerless 样本的 131072 周期阶段摘要一致，M2 工程门通过。仍不能宣称：023/024 完成、生产核心 jree 清零、性能等价、浏览器平台门完成、正式发布或新的 tag。G0 证据均保存在项目外 `OpenNARS-304-ts-evidence-archive`，不纳入 Git。

### 2026-09-18：G1 Java 隐式 `Object` 壳批次

本批以已推送的 G0 提交 `01aff5c` 为基线，对照 canonical Java 的 `Parameters.java` 与 `Symbols.java`。两者都没有显式父类；本批移除转写器附加的 `JavaObject`，但保留 `Symbols.NativeOperator` 的 Java Enum 边界，不改枚举、查表、静态初始化或参数数值逻辑。

- `src/main/Parameters.ts`：删除 `JavaObject` 基类和仅用于 marker interface 的 `java.io.Serializable` 声明；保留全部参数字段与 Java float binary32 边界。
- `src/io/Symbols.ts`：删除 `JavaObject` 基类；保留 Java Enum、字符串模板和异常边界。
- `test/node/core-runtime.test.ts`：将 `Parameters`、`Symbols` 纳入隐式 Object 原型回归。
- M2：串行统一单测 `261/261`，失败 0、跳过 0；显式 `--incremental false` 的 `tsc` 诊断为 0；build、dist API、local algorithm parity 全部通过。local parity 使用 canonical JAR SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`，结果 `ok=true`、`differences=[]`。
- M1-/#245：本批未运行。改动仅影响两个无显式父类的运行时壳，没有触碰集合判等、推理调度、公共算法或 runner；G0 的 245+1 全量证据仍是当前保护基线。后续若改动 Enum、集合、推理或公共边界，必须重新评估 M1-。
- jree 审计前→后（相对 G0）：生产直接导入文件 `89→88`，JavaObject 文件 `38→36`；迁移扫描 malformed 项仍为 0。审计结果保存在项目外 `g1-audit-jree-20260918.log`。

本批可以宣称：`Parameters`、`Symbols` 两个 Java 隐式 Object 壳已原生化，并通过 261 项串行 M2、非增量编译、局部 canonical parity、build 与 dist API 检查。仍不能宣称：023/024 完成、生产 jree 清零、M1/#245 在本批重新全量通过、Java/TypeScript 性能等价或正式发布。普通批次继续复用 G0 冻结 Java 标杆；023/024 整体验收时仍须现跑 canonical Java 并核对标杆一致。

### 2026-09-18：G2 `BudgetValue` Java 隐式 Object 壳批次

本批以 G1 提交 `cec700a3557d40b20de32381dc525693d2182488` 为基线，对照 canonical Java `BudgetValue.java`。Java 类没有显式父类，`Cloneable` 与 `Serializable` 只是 marker interface；`clone()` 是类自有实现。因此本批只移除转写器附加的 `JavaObject`/marker 壳，不改变预算字段、构造重载、float32 收窄、预算运算、异常或文本语义。

- `src/entity/BudgetValue.ts`：由 `extends JavaObject implements ...` 收窄为原生 TypeScript 类；保留显式 `clone()` 和已有 float32 边界。
- `test/node/core-runtime.test.ts`：加入 `BudgetValue` 隐式 Object 原型回归，并验证 clone 是独立对象且三个预算数值保持一致。
- M2：最终定向 `core-runtime.test.ts` 为 `36/36`；统一串行单测 `261/261`，失败 `0`、跳过 `0`；显式非增量 `tsc` 为 `0` 诊断；build、dist API、local canonical parity 均通过。local parity 使用 canonical JAR SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`，结果 `ok=true`、`differences=[]`。
- 静态检查：生产源文件 `136`，直接 jree 导入文件 `88`，`JavaObject` 文件 `35`；迁移模式扫描 `227` 个文件，malformed generic/operator/new-this/constructor-delegation 均为 `0`；汉字编码检查与 `git diff --check` 通过。
- jree 审计相对 G1：`JavaObject` 文件 `36→35`；直接导入文件仍为 `88`，因为 `BudgetValue` 仍使用 `java`、`S` 和 Java 异常/类型边界；迁移扫描的 jree runtime type 为 `1721→1719`。这表示一个壳已移除，不表示 jree runtime 已退场。
- M1-/#245：本批未运行。改动只触及继承/marker 壳，已有直接回归、完整串行 M2 与 canonical local parity；G0 的 `245+1` 全量证据继续作为功能保护基线。若后续改动触及 BudgetValue 数值逻辑、集合、推理或公共边界，必须重新评估 M1-。

本批可以宣称：`BudgetValue` 的 Java 隐式 Object/marker 壳已原生化，并经直接回归、串行 M2、非增量编译和 canonical 局部 parity 保护。仍不能宣称：023/024 完成、生产 jree 清零、M1/#245 在本批重新全量通过、Java/TypeScript 性能等价或正式发布。普通 023 批次继续在 Java artifact、源码/classes/test-classes、依赖、夹具、runner 合同、JDK、线程/随机条件和配置均不变时复用冻结 Java 标杆；023/024 整体验收仍需现跑 canonical Java 并逐字段核对标杆一致。

### 2026-09-18：G3 `ProcessQuestion` 静态工具与私有 Optional 边界批次

本批以 G2 提交 `e563361c25e1211b27c9398727727efe0bb18d04` 为基线，对照 canonical Java `ProcessQuestion.java`。Java 类没有显式父类，所有方法均为静态工具方法；当前 TS 没有该类的实例化、`instanceof` 或 `.class` 消费。因此移除外层 `JavaObject` 是安全的。另确认 Java/Guava `Optional` 只在私有 `tryFind` 中用于 `isPresent()`/`get()`，本批将其收窄为 `Task | null`，不改变问题处理算法。

- `src/control/concept/ProcessQuestion.ts`：移除外层 `JavaObject` 继承；私有搜索结果由 `java.util.Optional<Task>` 改为 `Task | null`。保留事件载荷的 `JavaObject` 类型断言、Java 异常和其他 Java 行为边界。
- `test/node/core-runtime.test.ts`：将 `ProcessQuestion` 纳入静态工具类原型回归。
- M2：定向核心测试 `36/36`；统一串行单测 `261/261`，失败 `0`、跳过 `0`；显式非增量 `tsc` 为 `0` 诊断；local canonical parity `ok=true`、`differences=[]`；build、dist API、release 均通过，release `runtimeWarnings=none`。
- 受影响 NAL：`nal1.5.nal` 使用 TS-only 与冻结 Java 标杆运行，`1/1` 通过，marker 匹配，TS exception、stall、not-run 和 marker missing 均为 `0`；额外周期 `1550`，推理周期 `1556`。
- 静态检查：生产源文件 `136`，直接 jree 导入文件 `88`，`JavaObject` 文件 `35`，`java.util` 文件 `39`；迁移模式扫描 `227` 个文件，malformed generic/operator/new-this/constructor-delegation 均为 `0`；平台审计、汉字编码检查和 `git diff --check` 通过。
- jree 审计相对 G2：直接导入文件 `88→88`、`JavaObject` 文件 `35→35`，因为事件载荷类型断言仍需 `JavaObject` 名称；`java.util` 文件 `40→39`，迁移扫描 jree runtime type `1719→1715`。这表示私有 Optional 与外层壳收窄，不表示 jree runtime 已退场。
- M1-/#245：本批未运行。改动没有改变集合判等、推理规则、预算/浮点数值、公共 runner 或 Java 基线；已用静态工具原型回归、完整串行 M2、local parity 和问题处理 NAL smoke 保护。若后续改动触及 `ProcessQuestion` 的算法、集合或公共边界，应重新评估 M1-。

本批可以宣称：`ProcessQuestion` 的隐式 Object 壳及其私有 Optional 包装已按 Java 合同原生化，并通过直接回归、M2、local parity 和受影响 NAL smoke。仍不能宣称：023/024 完成、生产 jree 清零、M1/#245 在本批重新全量通过、Java/TypeScript 性能等价或正式发布。普通 023 批次继续在 Java artifact、源码/classes/test-classes、依赖、夹具、runner 合同、JDK、线程/随机条件和配置均不变时复用冻结 Java 标杆；023/024 整体验收仍需现跑 canonical Java 并逐字段核对标杆一致。

### 2026-09-18：G4 `DerivationContext` 原生推理上下文边界批次

本批以 G3 提交 `a0b773c732959f94d005633d1605b5f821ca5ca8` 为基线，对照 canonical Java `DerivationContext.java`。Java 类没有专用父类；其 `JavaObject` 只是隐式 `Object` 转写壳。没有发现 `DerivationContext` 的实例身份被 `.class` 或 `instanceof` 消费。它确实作为 Java `Object...` 事件 payload 传递，因此本批同步修正事件边界：native TypeScript 对象可进入 `Memory.emit`，仅在旧 EventEmitter 入口集中转换。

- `src/control/DerivationContext.ts`：移除 `JavaObject` 继承和构造器 `super()`，删除失效的 `override`；`emit` 的 Java `Object...` payload 改为 `unknown[]`，保留全部推理状态、派发和 Float32 运算。
- `src/storage/Memory.ts`：`emit` 接受 `unknown[]`，在兼容 EventEmitter 边界转换为 Java 形状，避免把 native 推理上下文伪装成 jree 对象。
- `src/operator/mental/Anticipate.ts`、`src/plugin/mental/InternalExperience.ts`：对事件数组中的推理上下文做显式 unknown→`DerivationContext` 收窄。
- `test/node/core-runtime.test.ts`：加入 `DerivationContext` 隐式 Object 原型回归。
- M2：定向核心测试 `36/36`；统一串行单测 `261/261`，失败 `0`、跳过 `0`；显式非增量 `tsc` 为 `0` 诊断；local canonical parity `ok=true`、`differences=[]`；build、dist API、release 均通过，`runtimeWarnings=none`。
- 受影响 NAL：`nal1.5.nal` 使用 TS-only 与冻结 Java 标杆运行，`1/1` 通过，marker 匹配，exception、stall、not-run 和 marker missing 均为 `0`。
- 静态检查：生产源文件 `136`，直接 jree 导入文件 `88`，`JavaObject` 文件 `35→34`，`java.util` 文件 `39`；`new LinkedHashMap=11`、`new LinkedHashSet=1`；迁移模式扫描 `227` 个文件，malformed generic/operator/new-this/constructor-delegation 均为 `0`；平台审计、汉字编码检查和 `git diff --check` 通过。
- M1-/#245：本批未运行。改动是隐式 Object 壳和事件 payload 类型边界，没有改变集合判等、推理规则、预算/浮点数值、runner 或 Java artifact；直接原型、完整串行 M2、local parity 和受影响 NAL smoke 已覆盖。后续若改动 `DerivationContext` 算法、集合或公共事件合同，应重新评估 M1-。

本批可以宣称：推理上下文已脱离隐式 `JavaObject` 继承，native 实例可通过事件 payload 进入推理链，并经直接回归、M2、local parity 和受影响 NAL smoke 保护。仍不能宣称：023/024 完成、生产 jree 清零、M1/#245 在本批重新全量通过、Java/TypeScript 性能等价或正式发布。普通 023 批次继续在 Java artifact、源码/classes/test-classes、依赖、夹具、runner 合同、JDK、线程/随机条件和配置均不变时复用冻结 Java 标杆；023/024 整体验收仍需现跑 canonical Java 并逐字段核对标杆一致。

### 2026-09-18：G5 `EventEmitter` 原生事件容器壳批次

本批以 G4 提交 `fd3fcc3a41af1a5c81bc3dd56b77c509cc0357eb` 为基线，对照 canonical Java `EventEmitter.java`。Java 类没有专用父类；其行为合同是事件注册表、observer 身份删除、订阅/派发顺序和 FIFO pending 操作，不依赖 `JavaObject` 的 equals/hashCode/getClass。事件 token 属于 `Events`/`OutputHandler` 类族，本批未修改 token 或事件身份。

- `src/io/events/EventEmitter.ts`：移除 `JavaObject` 继承和两个构造器中的 `super()`；保留现有原生 `Map`、observer 数组、identity removal、FIFO pending 和 Java event token 接口。
- `test/node/event-emitter.test.ts`：增加 `EventEmitter.prototype` 直接继承 `Object.prototype` 的回归；定向事件测试 `5/5`。
- M2：统一串行单测 `261/261`，失败 `0`、跳过 `0`；显式非增量 `tsc` 为 `0` 诊断；local canonical parity `ok=true`、`differences=[]`；build、dist API 通过；release 检查通过且无新的 runtime warning。
- 受影响 NAL：`nal1.5.nal` 使用 TS-only 与冻结 Java 标杆运行，`1/1` 通过，marker 匹配，exception、stall、not-run 和 marker missing 均为 `0`。
- 静态检查：生产源文件 `136`，直接 jree 导入文件 `88`，`JavaObject` 文件 `34→33`，`java.util` 文件 `39`；`new LinkedHashMap=11`、`new LinkedHashSet=1`；迁移模式扫描 `227` 个文件，malformed generic/operator/new-this/constructor-delegation 均为 `0`；平台审计、汉字编码检查和 `git diff --check` 通过。
- M1-/#245：本批未运行。只移除了事件容器的隐式 Object 壳，没有改变事件 token、订阅顺序、observer identity、推理算法、runner 或 Java artifact；定向事件合同、完整串行 M2、local parity 和受影响 NAL smoke 已覆盖。后续若触及 `Events` token、事件 payload、集合实现或推理调度，应重新评估 M1-。

本批可以宣称：`EventEmitter` 已脱离隐式 `JavaObject` 继承，并经事件合同、M2、local parity 和受影响 NAL smoke 保护。仍不能宣称：023/024 完成、生产 jree 清零、M1/#245 在本批重新全量通过、Java/TypeScript 性能等价或正式发布。普通 023 批次继续在 Java artifact、源码/classes/test-classes、依赖、夹具、runner 合同、JDK、线程/随机条件和配置均不变时复用冻结 Java 标杆；023/024 整体验收仍需现跑 canonical Java 并逐字段核对标杆一致。

### 2026-09-18：`EventHandler` 候选前向审查（保留未迁移）

对照 canonical Java `EventHandler.java` 后，试验性移除其 `JavaObject` 外壳触发非增量 `tsc` 反证：`OutputHandler.class` 依赖从 `JavaObject` 继承的静态类 token，`TextOutputHandler` 的 `Serializable` 结构依赖 `getClass()`，测试层 `OutputCondition` 也依赖该继承链。试改已撤回，G5 提交 `2365d0fbf020172cfa0833371c444edcc35ed3cc` 保持干净，未将该候选标记为完成。

该类不能按“Java 没有显式父类”单独迁移；后续必须先设计并验证原生运行时类身份/marker 方案，再处理 `EventHandler`、`OutputHandler` 与测试工具的完整继承链。本次只记录为已解释的边界，不改变 023/024 的完成状态或 Java 标杆。

### 2026-09-18：G7 `AnswerHandler` 隐式 `Object` 壳批次

本批以 G6 审查记录后的干净提交 `27a34c6` 为基线，对照 canonical Java `AnswerHandler.java`。Java 类没有专用父类；当前 TS 消费面只有两个业务子类，没有 `AnswerHandler.class`、`getClass()` 或 `instanceof AnswerHandler`。与 `EventHandler` 不同，本批没有发现它参与公共事件类身份继承链，因此可以只移除外层 `JavaObject`。

- `src/io/events/AnswerHandler.ts`：删除 `JavaObject` 继承和导入；保留 `EventObserver`、`Events.Answer.class`、Java `Object[]` 事件边界，以及 `Task.equals` 的值相等逻辑。
- `test/node/core-runtime.test.ts`：增加 `AnswerHandler.prototype` 直接继承 `Object.prototype` 的回归断言。
- M2：定向核心/事件回归 `41/41`；统一串行单测 `261/261`，失败 `0`、跳过 `0`；显式非增量 `tsc` 为 `0` 诊断；local canonical parity `ok=true`、`differences=[]`；build、dist API、release 均通过，`runtimeWarnings=none`。
- 受影响 NAL：`nal1.5.nal` 使用 TS-only 与冻结 Java 标杆运行，`1/1` 通过，marker 匹配；异常、stall、not-run 和 marker missing 均为 `0`。
- jree 审计相对 G5：JavaObject 文件 `33→32`；直接 jree 导入文件 `88`、`java.util` 文件 `39`、`new LinkedHashMap=11`、`new LinkedHashSet=1`；迁移扫描 `227` 个文件，jree-runtime-type `1714`，malformed generic/operator/new-this/constructor-delegation 均为 `0`；平台、汉字编码和 diff 检查通过。
- M1-/#245：本批未运行。改动只触及没有类身份消费面的继承壳，未改变事件 token、Task/Sentence 判等、集合、预算/浮点、推理调度、Java artifact 或 runner；完整串行 M2、local parity 和受影响 NAL smoke 已提供局部保护。后续若触及公共事件身份、集合或推理算法，应重新评估 M1-。

本批可以宣称：`AnswerHandler` 的 Java 隐式 `Object` 壳已原生化，并经直接原型回归、M2、local parity 和受影响 NAL smoke 保护。普通批次继续在 Java artifact、源码/classes/test-classes、依赖、夹具、runner 合同、JDK、线程/随机条件和配置不变时复用冻结 Java 标杆；023/024 整体验收仍需现跑 canonical Java 并核对标杆一致。仍不能宣称：023/024 完成、生产 jree 清零、M1/#245 在本批重新全量通过、Java/TypeScript 性能等价或正式发布。

### 2026-09-18：G8 `ProcessGoal` 外层静态工具壳批次

本批以 G7 提交 `3b8c7e6` 为基线，对照 canonical Java `ProcessGoal.java`。Java 外层类只有静态方法，没有专用父类、实例状态或外层身份消费；`ExecutablePrecondition` 是独立的嵌套运行时值，继续保留 JavaObject 继承。

- `src/control/concept/ProcessGoal.ts`：删除外层 `extends JavaObject`；保留嵌套 `ExecutablePrecondition`、其 Java 默认字段、Map/Set/List 合同和全部目标/操作推理算法。
- `test/node/core-runtime.test.ts`：将 `ProcessGoal` 纳入静态工具类的 `Object.prototype` 原型回归。
- M2：定向核心回归 `36/36`；统一串行单测 `261/261`，失败 `0`、跳过 `0`；显式非增量 `tsc` 为 `0` 诊断；local canonical parity `ok=true`、`differences=[]`；build、dist API、release 均通过，`runtimeWarnings=none`。
- 受影响 NAL：`nal1.5.nal` 使用 TS-only 与冻结 Java 标杆运行，`1/1` 通过；异常、stall、not-run 和 marker missing 均为 `0`。
- jree 审计相对 G7：直接 jree 导入文件 `88`、`JavaObject` 文件仍为 `32`（嵌套 `ExecutablePrecondition` 仍有明确身份）、`java.util` 文件 `39`、`new LinkedHashMap=11`、`new LinkedHashSet=1`；迁移扫描 `227` 个文件，jree-runtime-type `1714`，malformed generic/operator/new-this/constructor-delegation 均为 `0`；平台、汉字编码和 diff 检查通过。
- M1-/#245：本批未运行。改动只触及无实例消费面的外层静态壳，没有改变嵌套值、集合、预算/浮点、事件 token、推理调度、Java artifact 或 runner；M2、local parity 和受影响 NAL smoke 提供局部保护。后续触及嵌套值或算法时重新评估 M1-。

本批可以宣称：`ProcessGoal` 外层静态工具壳已原生化，并经原型回归、M2、local parity 和 NAL smoke 保护。仍不能宣称整个 `ProcessGoal` 模块、023/024 或生产核心已脱离 jree，也不能宣称 M1- 全量重跑、性能等价或正式发布。

### 2026-09-18：`Abbreviation` 外层插件壳批次

本批以 G8 提交 `d577927` 为基线，对照 canonical Java `Abbreviation.java`。Java 外层类声明为 `implements Plugin`，没有专用父类或自身类身份消费；其嵌套 `Abbreviate` 继续继承 `Operator`，不在本批迁移范围内。

- `src/plugin/mental/Abbreviation.ts`：删除外层 `JavaObject` 继承及两个外层构造器 `super()`；保留 Java `double/int/double` 字段、构造重载、插件事件观察者、事件 token、概率判断和嵌套 Operator。
- `test/node/core-runtime.test.ts`：增加 `Abbreviation.prototype` 直接继承 `Object.prototype` 的回归，并继续执行 `Abbreviate` 的实际操作测试。
- M2：定向核心回归 `36/36`；统一串行单测 `261/261`，失败 `0`、跳过 `0`；显式非增量 `tsc` 为 `0` 诊断；local canonical parity `ok=true`、`differences=[]`；build、dist API、release 均通过，`runtimeWarnings=none`。
- 受影响 NAL：`nal8_list.nal` 首次使用 `180000 ms` process limit 时推进至 `301550` 周期后被成本上限截止；提高到 `1800000 ms`、无进展上限 `120000 ms` 后 TS-only 对冻结 Java 标杆 `1/1`，6 个 marker 全部匹配。该过程证明前一次是成本上限，不是逻辑异常。
- jree 审计相对 G8：JavaObject 文件 `32→31`；直接 jree 导入文件仍为 `88`（本文件仍使用 Java 类型/运行时边界）、`java.util` 文件 `39`、`new LinkedHashMap=11`、`new LinkedHashSet=1`；迁移扫描 `227` 个文件，jree-runtime-type `1714`，malformed generic/operator/new-this/constructor-delegation 均为 `0`；平台、汉字编码和 diff 检查通过。
- M1-/#245：本批未运行。改动只触及插件外层继承壳，没有改变嵌套 Operator、事件 token、集合、预算/浮点算法、推理调度、Java artifact 或 runner；M2、local parity 和长预算单文件 smoke 提供局部保护。后续触及插件算法或嵌套 Operator 时重新评估 M1-。

本批可以宣称：`Abbreviation` 外层隐式 `Object` 壳已原生化，并经定向回归、串行 M2、local parity、长预算 NAL smoke 和构建门保护。仍不能宣称整个插件模块、023/024 或生产核心已脱离 jree，也不能宣称 M1- 全量重跑、性能等价或正式发布。

### 2026-09-18：`cb32ed8` G0 串行保护回归

本节是本次 G0 的增量证据，不改写此前已经封存的 `9bd6cc0` 全量通过结论。测试使用 `HEAD=cb32ed8dec5084d41fd3d80f5d906373dfe8b476` 与 canonical Java：source commit `8675b76fe8c21ee20a7b8c1b63408fb05327210d`，JAR 为 `H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-java-canonical-fixed-build\target\opennars-3.0.4-SNAPSHOT.jar`，SHA-256 为 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`。Java 与 TypeScript 均为单线程、cold 模式；矩阵逐文件串行运行，`cycles=1550`、`timeout-ms=180000`、`process-limit-ms=1800000`、`chunk-size=1`、启用 `resource-metrics`。

- M1 主资源共 `245` 项，JSONL 解析 `245/245`，序号完整为 `0..244`，`not_run=0`、Java/TS exception `0`、stall `0`、普通 timeout `0`。
- 其中 `244` 个普通资源 `functional_pass=244` 且 parity 等价；唯一未完成的是 `stability/long_term_stability.nal`：Java 完成 `2,001,974` 周期，TS 在 `1,746,827` 周期时达到进程上限，marker missing。因此这里是稳定性证据未完成，不是已证实的逻辑分叉，也不能将 raw G0 记为 `245/245` 全绿。
- 额外 `simpleOperationTest.nal` 为 `1/1`，无异常、stall、timeout 或 process limit。证据见 [g0-m1-245-cb32ed8-parity-serial.jsonl](../reports/evidence/g0-m1-245-cb32ed8-parity-serial.jsonl) 与 [g0-m1-simple-cb32ed8-parity-serial.jsonl](../reports/evidence/g0-m1-simple-cb32ed8-parity-serial.jsonl)。
- M2 串行单测 `261/261`，失败 `0`、跳过 `0`；显式非增量 `tsc` 为 `0` 诊断；build、dist API、local algorithm parity、release/package 与静态检查均通过，release `runtimeWarnings=none`，local parity `differences=[]`。
- 当前统一单测入口为 `test/node/*.test.ts`，`test/entity/TLink.test.ts` 尚未被捕获；因此 `261/261` 是统一入口结果，不等于仓库全部测试已经纳入。
- 本批 jree 审计快照：生产直接导入文件 `88`、`newLinkedHashMap=11`、`newLinkedHashSet=1`、`JavaObject` 文件 `31`；这些是当前清单，不是 023 完成度。023 仍为 `in-progress`。

📌 Java 标杆复用规则：当 canonical JAR SHA、Java source/classes/test-classes、jree 依赖、NAL 夹具、runner 合同、JDK、单线程设置、随机/周期/配置均不变时，普通 023 小批次只运行 TypeScript 并对照已验证的冻结 Java JSONL；一旦其中任一不变量变化，或进入 023/024 阶段验收、集成冻结、发布候选，就必须现跑 Java 并逐字段核对冻结标杆。不一致时先调查原因，再决定是否刷新标杆。:codex-annotation{index="1"}

当前可以宣称：`cb32ed8` 的 244 个普通主资源与额外夹具在本次串行 Java/TypeScript 对照中通过，M2 工程门通过。当前不能宣称：本次 raw 245+1 矩阵全绿、#245 markerless 长周期等价、023/024 完成、生产核心 jree 清零、Java/TypeScript 性能等价或正式发布。

### 2026-09-18：ProcessGoal 临时 Map 原生化

本批对照 canonical Java `ProcessGoal.java` 审查了 8 个临时 `LinkedHashMap`：`Map<Term,Term>` 替换映射、以及 `Map<Operation,List<ExecutablePrecondition>>` 预测聚合。TypeScript 保留两个 `java.util.Map` 抽象边界，改用项目 `NativeMap`；Java `LinkedHashMap(Map)` 复制构造通过 `entrySet()` 显式复制，未把 Map 改成对象、数组或仅按 JS 引用身份判等。

- 直接回归：ProcessGoal Map 路径 `4/4`；统一串行 M2 `277/277`，失败/跳过 `0/0`。
- M2：非增量 `tsc=0`，build、dist API、release 通过，runtime warnings 为 `none`；canonical 局部 parity `differences=[]`。
- TS-only M1-：`244/244`，分层 `single_step=215`、`multi_step=24`、`application=5`；`exception=0`、`marker_missing=0`、`timeout=0`、`not_run=0`、Java/TS diff `0`。本批复用冻结 Java JSONL，未启动 Java。
- 本批 M1- 结果文件在项目外归档：`m1-minus-processgoal-nativemap-20260918.jsonl`，SHA-256 为 `D7D5D68739AEDD1724D5348A85127B5DBBCEF09A10446922FCDEED62AFDF8F4A`；TS 总时长 `1,700,616 ms`，总推理周期 `2,288,254`，约 `0.743 ms/周期`，峰值 RSS `1,245,339,648 bytes`。性能数值仅作后续观测，不作为本批优化结论。
- jree 构造前→后：`ProcessGoal` 的 `new LinkedHashMap` `8→0`；生产剩余 `new LinkedHashMap=3`（Bag 2、Anticipate 1）。023 仍为 `in-progress`。

本批可以宣称：ProcessGoal 临时 Map 实现已原生化，并在局部合同、M2 与 M1- 上通过。当前不能宣称：023 完成、生产核心 jree 清零、#245 长期稳定性完成、Java/TypeScript 性能等价或正式发布。普通局部批次在 canonical JAR、依赖、夹具、runner 合同、JDK、单线程设置、随机/周期/配置不变时继续只运行 TS 并复用冻结 Java 标杆；spec/阶段验收或任一基线不变量变化时才现跑 Java 并逐字段核对。:codex-annotation{index="1"}

### 2026-09-18：统一串行测试入口补齐 `TLink`

本批只修正 M2 测试发现范围，不改变推理代码、Java artifact 或 runner 语义。`package.json` 的 `test:unit:serial` 由 `test/node/*.test.ts` 扩展为同时捕获 `test/entity/*.test.ts`，使已有的 `test/entity/TLink.test.ts` 15 项合同测试进入统一入口。

- 串行单测：`276/276`，失败 `0`、跳过 `0`；新增纳入的 TLink 15 项全部通过。
- `npm run typecheck`：显式非增量 TypeScript 诊断 `0`。
- `npm run test:build`、`npm run test:api:dist`：均通过；dist API `cycles=2`、`cycleEnds=2`、`outputSignals=1`、`stopped=true`。
- 复用基线探针：`nal8.add.nal` 使用 `--engine ts --java-baseline`，`java_artifact=null`，冻结 Java 基线 SHA-256 为 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`，结果 `1/1` 通过；本批没有启动 Java。

本批可以宣称：M2 统一串行测试入口现在覆盖 `test/node` 与 `test/entity`，共 `276/276` 通过，且非增量编译、构建和 dist API 通过。仍不能宣称：#245 稳定性长测在本批完成、023/024 完成、生产 jree 清零或 Java/TypeScript 性能等价。日常普通 TS 验证继续在 Java 基线不变量未变化时复用冻结 Java JSONL；阶段验收或基线变化时现跑 Java 并核对。:codex-annotation{index="1"}

### 2026-09-18：`Anticipate` 外层 Map 原生化

本批承接 `5e4dbd0` 的 `ProcessGoal` Map 批次，对照 canonical Java `Anticipate.java` 审查 `anticipations`：Java 原始形状为 `Map<Prediction, LinkedHashSet<Term>>`，实现为 `LinkedHashMap`。`Prediction` 没有覆写 `equals/hashCode`，因此外层 key 必须继续保持 Java 默认对象身份；内层 value 仍需要 Set 的 Term 值相等、插入顺序和迭代删除语义。

- `src/operator/mental/Anticipate.ts`：以 `NativeMap<Prediction, NativeSet<Term>>` 替换具体 `LinkedHashMap`，保留 `java.util.Map` 抽象、Prediction 身份 key、内层 NativeSet、延迟删除和全部预测/反馈派发逻辑。源码注释明确记录 Java 原类型与当前实现。
- `test/node/anticipate.test.ts`：新增两个相同时间字段但不同 Prediction 对象必须占据两个 Map key 的回归；定向 Anticipate 回归 `5/5`。
- 串行 M2 为 `278/278`，失败 `0`、跳过 `0`；`test/entity/TLink.test.ts` 已纳入统一入口。
- 显式非增量 `tsc --noEmit --pretty false --incremental false` 为 `0` 诊断；build、dist API、local canonical parity 均通过，`differences=[]`。
- `nal8.add.nal` 的 TS-only 冻结标杆 smoke 为 `1/1`，无异常；本批普通验证未启动 Java。:codex-annotation{index="1"}
- M1- 使用单线程、cold、逐文件串行、`--cycles 1550`、`--timeout-ms 180000`、`--process-limit-ms 1800000`、`--chunk-size 1`，排除长期稳定性 `#245`；`single_step=215`、`multi_step=24`、`application=5`，共 `244/244` 通过。exception、marker missing、timeout、stall、process limit、not-run、Java/TS diff 均为 `0`。
- M1- 证据在项目外归档：`m1-minus-anticipate-nativemap-20260918.jsonl`，SHA-256 为 `C75A5FC706B5118AECB6BA694349FFCBF28A5E0F8DECD5B353D2346387F8A67E`；TS 总时长 `1,782,206 ms`，推理周期 `2,288,254`，`0.778850 ms/周期`，峰值 RSS `1,231,945,728 bytes`。性能数据只作为后续优化输入。
- jree 生产审计当前为：直接导入文件 `88`、`newLinkedHashMap=2`、`newLinkedHashSet=1`、`JavaObject` 文件 `31`、`java.util` 文件 `39`、`java.lang` 文件 `87`、Java String 文件 `52`；这不是 023 完成度。
- 平台审计扫描 `172` 个文件，核心候选 `83`、混合边界 `5`、Node adapter 候选 `2`；迁移模式扫描 `227` 个文件，constructor-delegation、malformed-generic/operator/new-this 均为 `0`。release `0.1.0` 通过，`runtimeWarnings=none`、`forbiddenPackageMembers=0`；汉字编码检查与 `git diff --check` 通过。

本批可以宣称：`Anticipate` 外层具体 Map 已在不改变 Map 抽象和 Prediction 身份 key 的前提下原生化，并经直接合同、M2、local parity、受影响 smoke 和 M1- 保护。仍不能宣称：023/024 完成、全部生产 jree 清零、#245 长期稳定性在本批完成、Java/TypeScript 性能等价或正式发布。普通小批次继续在 canonical Java 基线不变量不变时复用冻结 Java 功能标杆；023/024 整体验收或任一基线不变量变化时才现跑 Java 并逐字段核对。:codex-annotation{index="1"}

### 2026-09-18：`Bag.nameTable` NativeMap 原生化批次

本批承接 `f1cf976` 的 `Anticipate` Map 批次，对照 canonical Java `Bag.java` 审查 `nameTable` 与 `itemTable` 的历史迁移。Java 原始合同是 `HashMap<K,Type>` 声明、`LinkedHashMap<K,Type>` 具体实现；`itemTable` 则是独立的 `ArrayList<ArrayList<Type>>` 优先级队列。本批只迁移名称 Map，不把 Map、Set、List 混为同一底层抽象。

- `src/storage/Bag.ts`：`nameTable` 的新建与 `clear()` 改用项目 `NativeMap`，保留 Java `HashMap` 类型边界；NativeMap 提供 Java equals 查找、替换不移动插入位置、values/entry 迭代和删除合同。旧/restored `equalityBuckets`、`itemOrder`、`itemTable` 兼容路径保持不变。
- `test/node/bag.test.ts`：新增 NativeMap 类型、Java equals 替换和插入顺序回归；保留 malformed/restored bucket 与 FIFO 层级测试。Bag 定向测试 `10/10`。
- M2：统一串行单测 `279/279`，失败/跳过/取消 `0/0/0`；`test/entity/TLink.test.ts` 已纳入入口；显式 `--incremental false` 的 `tsc` 为 `0` 诊断；build、dist API、受影响 `nal8.add.nal` smoke `1/1` 通过。
- M1-：TS-only 对冻结 Java 标杆逐文件串行运行，主资源 `244/244` 行完整，`functional_pass=242`、parity `242`、exception/stall/not-run `0/0/0`。`toothbrush2.nal` 与 `nars_multistep_3.nal` 触发 `1800000 ms` process limit；`201550` 与 `502562` 是计划周期数，原始行的 `last_progress_cycle` 分别为 `170381` 与 `296192`。没有证据证明逻辑分叉，但 marker 观测未完成，因此不能写成 `244/244` 全功能通过。
- 结果文件在项目外归档：`m1-minus-bag-nativemap-20260918.jsonl`，SHA-256 为 `EF6728C3E8D4EEC5496A968FB4B64CA479E28E564334A785F0E5905FFC2D06CC`；总运行 `6756929 ms`，`reasoning_cycles` 求和 `2288254` 是计划周期合计而非全部实际完成周期，已采集样本峰值 RSS `369.42 MiB`。先前相同 M1- 口径的 `nars_multistep_3.nal` 为 `377969 ms`/`357765 ms` 完成，本批性能显著回退，与 NativeMap 线性查找热路径吻合，但尚须 A/B 与 profile 证明因果；本批不改写语义结论。
- jree 审计：生产直接 jree 导入文件 `88`，`newLinkedHashMap=0`，`newLinkedHashSet=1`，`JavaObject` 文件 `31`，`java.util` 文件 `39`；平台审计扫描 `172` 个文件。全部 `scripts/checking/*.py` 顺序通过，汉字编码与 `git diff --check` 通过。

本批可以宣称：`Bag.nameTable` 已完成一次保留 Java Map 合同的原生化，并通过局部 M2 与大部分 M1- 功能保护。当前不能宣称：M1- `244/244` 全部通过、023/024 完成、生产核心 jree 清零、Java/TypeScript 性能等价或正式发布。后续应优先单独评估 NativeMap 的索引策略和高周期性能，避免把性能回退与语义迁移混在同一修复中。普通批次继续复用冻结 Java 标杆；阶段验收、集成冻结或基线不变量变化时才现跑 canonical Java。:codex-annotation{index="1"}

### 2026-09-18：日常 TS-only 与阶段 Java 测试门分离

根据用户对 Java 标杆复用的最高指示，`npm test` 与 `test:unit:serial` 改为 TS-only 入口，保留 `test:unit:with-java` 供阶段完整验收显式调用；`test:parity:local` 仍会现跑 Java，不能算入普通批次。TS-only 入口对直接及继承该环境的 Node 子进程设置 Java 启动拦截；两项确需现跑 Java 的单测明确跳过，其他 Java artifact 选择的负向合同仍运行。当前验证发现 `286` 项，`284` 通过、`2` 跳过、`0` 失败；非增量 typecheck `0` 诊断、build 与 dist API 通过。此数不等于完整含 Java 的 M2 结果。

新增 `classify-change-gate.mjs` 按提交差异给 T0/T1/T2 最低门；真实的 `f1cf976..f952a02` Bag 差异被判为 T1，显式 `--stage 023` 被判为 T2。现行长期计划已单独落在 `docs/luna-agent-active-goal.md`。本批没有启动 Java 全量、没有重新运行 M1- 或 #245；上方 Bag 两项未完成的状态不变。

### 2026-09-18：S0 `NativeMap` 索引修复与 M1- 保护复核

本批承接 `10e8db0` 的现行 S0 目标，先用正常结束的 TypeScript 子进程 profile 证实热点，再做一处不改变 Map 抽象的最小修复。Java canonical 与冻结标杆未变化：source commit `8675b76fe8c21ee20a7b8c1b63408fb05327210d`，JAR SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`，冻结 Java JSONL SHA-256 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`。所有运行均为单线程、cold、TS-only，未启动 Java。

- `src/runtime/NativeMap.ts`：保留 ordered record table、Map/entrySet/keySet/values/iterator 合同和 Java equals 查找方向；为有 Java-compatible `hashCode` 的 key 增加候选桶索引，`remove`、迭代器 `remove`、`clear` 同步维护索引；无 `hashCode` 的对象继续全表 equals 回退。
- `test/node/native-map.test.ts`：新增 hash collision、remove/clear 索引维护和无 hashCode 对象回退测试；NativeMap 定向回归 `6/6`。
- profile：`nars_transitivity.nal` 正常完成并生成子进程 profile `CPU.20260918.120616.5080.0.001.cpuprofile`，SHA-256 `4C864400155D54C1898A773ED2EC02FC8CE7E27107CE051A06329B38EA13946C`。聚合自耗时主要为 `CompoundTerm.equals`、`javaValueEquals`、`Bag.findEquivalentKey/removeKey`；`NativeMap.put` 也在热点中，但不能据此把 NativeMap 宣称为唯一根因。
- 定向高成本样本：`nars_transitivity.nal` 为 `211550` 实际周期、2/2 marker、`111147 ms`、RSS `362.33 MiB`；`toothbrush2.nal` 为 `201550` 实际周期、2/2 marker、`105422 ms`、RSS `960.25 MiB`。两者均 functional/parity 通过、无 exception、stall 或 process limit。证据 SHA-256 分别为 `A6E00333A812371160EE13FD8B58D9A6D5709EF1548D49F7795911781A02B924` 与 `5A3FDE81D5573BA44D5C471F947EE579C09A7DED881587DEE0A430451DDE181D`。
- M2-TS：非增量 `tsc=0`；NativeMap 定向 `6/6`；串行单测 `288` 项，`286` 通过、`2` 跳过、`0` 失败；build 与 dist API 通过。跳过项是按 TS-only 规则不现跑 Java 的测试，不计为通过。
- M1-：244 行逐文件串行完整运行，主结果 `243/244` functional/parity；唯一失败是 `nal2.8.nal` 的一次 Windows `EXCEPTION_ACCESS_VIOLATION (3221225477)`，无 Java/TS 逻辑差异证据。同配置单独 retry `1/1` 通过，retry SHA-256 `5DC06ED2A608D16B797DC9CD7E940CFA0D2B0176105BD1193B0C3ADDE595E6E5`；合并本批功能证据为 `244/244`。主矩阵 SHA-256 `5E941B2C9B9E08594A43AB525C68364AB22D09CE271D25C9A02CADA1575A0BE9`。
- M1- 总耗时为 `1741388 ms`；主矩阵已采集样本的最大 RSS 为 `995.22 MiB`。关键行 `nars_multistep_3.nal` 完成 `502562` 周期、约 `349969 ms`，此前 Bag 批次在进程上限截断；本批未修改原始异常行，主机访问冲突与代码功能结论分开记录。

本批可以宣称：S0 的 NativeMap 最小索引修复通过局部 Map 合同、M2-TS、两个原先高成本样本和 M1- 合并 `244/244` 功能/parity 证据；可以继续现行目标的下一个 023/024 单簇。仍不能宣称：023/024 完成、生产 jree 清零、完整 M1/#245 长周期完成、Java/TypeScript 性能等价或正式发布。`nars_multistep_3.nal` 的约 350 秒只作为性能观测，不是 020 性能门结论。

### 2026-09-18：S1 `ConfigReader` 隐式 JavaObject 壳原生化

本批承接 S0 `dba2334`，继续现行目标的单一 jree 责任切片。对照 canonical Java `ConfigReader.java` 确认 Java 声明是无显式父类的普通 `public class`；TypeScript 原先的 `extends JavaObject` 没有对应业务行为、实例身份或 `.class` 消费面，因此只移除该外层兼容壳。对照审查同时发现 `Stamp` 虽然 Java 没有显式父类，但 TS 的 `Cloneable`/`Serializable` 仍经 jree `IReflection` 承诺 `getClass()`，本批保留，不把高风险反射契约混入 IO 小切片。

- `src/io/ConfigReader.ts`：删除 `JavaObject` 导入和外层继承；保留 Node 文件系统访问、配置解析、插件诊断、顺序和原生插件数组。
- `test/node/config-platform-boundary.test.ts`：新增原型链回归，确认 `ConfigReader.prototype` 直接继承 `Object.prototype`；配置边界定向测试 `15/15`。
- M2-TS：`npm run typecheck` 使用显式 `--incremental false`，诊断 `0`；串行单测共 `289` 项，`287` 通过、`2` 跳过、`0` 失败；build `135` 个源文件成功；dist API `cycles=2`、`cycleEnds=2`、`outputSignals=1`、`stopped=true`。
- 受影响 NAL：`nal4.7.nal` 以 TS-only、cold、单线程和冻结 Java 标杆运行，`1/1` marker 通过，0 exception、0 timeout、0 stall、0 not-run。结果位于项目外 `H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\s1-config-reader-nal4.7-20260918.jsonl`，SHA-256 为 `0420E251A298B87C7E4D2853F986CAACE513F06DFF4E8314E72EE7D937D1C4A6`。
- 提交后 `classify-change-gate.mjs --base dba2334 --head 64cc54a` 判定 T1 且 `m1_minus_required=true`，故补跑 TS-only M1- 244 项串行保护矩阵。结果 `244/244` functional/parity，0 exception、0 marker missing、0 stall、0 process limit、0 not-run；总耗时 `1748907 ms`，最大单行 `374501 ms`，最大 RSS `1029468160 bytes`，总 reasoning cycles `2288254`。证据位于项目外 `H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\s1-config-reader-m1-minus-20260918.jsonl`，SHA-256 为 `E999A4DA9CD5DCD9CFC2AA997941C687B3A3AA705637CEEF32058B8F8B4800FB`。
- jree 审计（去注释 summary）：直接导入文件 `88`，相对本批前 `89` 减少 1；`JavaObject` 文件 `30`，相对本批前 `31` 减少 1；`new LinkedHashMap=0`、`new LinkedHashSet=1`。这些是静态清单变化，不是 023 完成率。
- 迁移模式扫描：229 个文件；constructor-delegation、malformed-generic/operator/new-this 均为 `0`。平台审计、全部 `scripts/checking/*.py`、汉字编码和 `git diff --check` 通过。

本批可以宣称：ConfigReader 的隐式 JavaObject 壳已按 Java 普通类契约原生化，并经直接原型回归、串行 M2、构建、dist API 和受影响 NAL smoke 保护；可以继续下一个 S1 单簇。普通批次仍只运行 TypeScript 并复用冻结 Java JSONL。

本批不能宣称：#245 在本批重跑、023/024 完成、生产核心 jree 清零、Stamp 等核心实体已去 jree、Java/TypeScript 性能等价或正式发布。M1- 已按提交后 T1 门禁完成，但其中无 marker 样本只有短跑证据，不能替代 131072 周期长周期门。阶段验收、Java 基线不变量变化或进入 023/024 整体验收时，仍需现跑 canonical Java 并逐字段核对冻结标杆。

### 2026-09-18：`ComplexEmotions` 隐式 JavaObject 壳原生化

本批承接 `a1d9a14`，继续 023 的单一 jree 责任切片。对照 canonical Java `ComplexEmotions.java` 确认其声明为普通 `public class ComplexEmotions implements Plugin`，没有显式父类；TypeScript 原先的 `extends JavaObject` 只提供兼容外壳。`java` 导入仍用于事件类、Java 字符串、异常和输出，因此没有机械删除整个 jree 导入。

- `src/plugin/mental/ComplexEmotions.ts`：删除 `JavaObject` 导入和继承，增加 Java 普通 Plugin 边界说明；保留事件、字符串与输出合同。
- `test/node/complex-emotions-boundary.test.ts`：新增实例原型链回归，确认直接继承 JavaScript `Object.prototype`；定向测试 `1/1`。
- M2-TS：非增量 `tsc=0`；串行单测 `290` 项，`288` 通过、`2` 跳过、`0` 失败；build、dist API 通过。
- 两个代表性 TS-only NAL smoke（`nal4.7.nal`、`nal8.add.nal`）均为 `1/1`，`java_artifact=null`、无异常/timeout/stall/not-run；结果 SHA-256 分别为 `192C0CC6AC4CCCC213427AD6042F911E4CA1A2D4E6F7E42BA4B34821ADEE48AC` 与 `ED07C51FA6BAA6940B6EAF83F6D22C7F2599EB725923269D5944E5DA6EA6DD87`。
- 本批历史上曾以 `--scope responsibility` 保守运行 M1-；按最新目标文件，在不带该参数时重新判定 `d8b2f39` 为 `T1`、`live_java_required=false`、`m1_minus_required=false`，生产源改动 `7` 行。单个普通类不属于“完成一类 jree 责任”；本次 M1- 因此是额外保护证据。矩阵仍为 `244/244` functional/parity，通过 `0` exception、`0` marker missing、`0` stall、`0` process limit、`0` not-run；总耗时 `1787048 ms`，最大单文件 `385820 ms`，最大 RSS `866918400 bytes`，结果位于项目外 `H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\s1-complex-emotions-m1-minus-20260918.jsonl`，SHA-256 为 `6259B40D6BDB2F5104FD24B322597162B4CA379AB2595AAFC6148B2542FDD0B0`。
- jree 审计去注释 summary：直接导入文件 `88`（未变，因 `java` 事件/字符串/输出合同仍在）、`JavaObject` 文件 `29`（本批前 `30`）、`newLinkedHashMap=0`、`newLinkedHashSet=1`；迁移扫描 `230` 个文件，平台审计扫描 `179` 个文件。

本批可以宣称：`ComplexEmotions` 的无行为 JavaObject 外壳已原生化，并经直接回归、M2、代表性 smoke 和额外 M1- 保护。仍不能宣称：023/024 完成、生产核心 jree 清零、#245 长期稳定性完成、Java/TypeScript 性能等价或正式发布。该插件不在默认注册表，代表性 NAL 不等于插件业务行为的直接覆盖；下一候选为 `Counting` 的同类普通 Plugin 外壳。只有收口已枚举责任类或大模块时才使用 `--scope responsibility`。

### 2026-09-18：change gate 生产 TypeScript 行数口径纠正

修正 `scripts/checking/classify-change-gate.mjs` 与 `change-gate-policy.mjs` 的 `>80` 行门：现在只统计 `src/` 下生产 `.ts`、`.tsx`、`.mts`、`.cts` 文件，排除测试/规格文件、`test`/`tests`/`__tests__` 目录、报告、文档、脚本和其他非 TypeScript 文件。

- `d8b2f39` 原先把 `7` 行生产 TS、`11` 行测试和 `84` 行报告合计成 `102`，修正后为 `source_changed_lines=7`，默认 slice 不触发 M1-。
- ConfigReader 历史批次原先为 `120`（`10` 行生产 TS 加测试、报告和文档），修正后生产源行数为 `10`，默认 slice 同样不因行数触发 M1-。
- `--scope responsibility` 仍独立触发 M1-；ComplexEmotions 已额外完成的 TS-only M1- `244/244` 是保护证据，不是修正后默认 slice 的强制要求。

### 2026-09-18：`Counting` 隐式 JavaObject 壳原生化

本批承接 `4c59aa4` 与门禁口径修订提交 `ee0dd77`，继续 023 的单一普通类切片。对照 canonical Java `Counting.java` 确认其声明为普通 `public class Counting implements Plugin`；TypeScript 原先的 `JavaObject` 只提供外壳，两个构造器中的 `super()` 也是翻译遗留。事件类、异常、字符串和 float32 收窄仍是有效合同，因此只移除外壳，不删除整个 `java` 导入。

- `src/plugin/mental/Counting.ts`：删除 `JavaObject` 导入和继承，移除默认/带参构造器中的空 `super()`，保留 Java 构造器重载、事件派发和 float32 优先级边界。
- `test/node/counting-boundary.test.ts`：新增默认构造器、带参构造器和原型链回归；定向测试 `1/1`。
- M2-TS：非增量 `tsc=0`；串行单测 `292` 项，`290` 通过、`2` 跳过、`0` 失败；build、dist API 通过。
- 两个代表性 TS-only NAL smoke（`nal4.7.nal`、`nal8.add.nal`）均为 `1/1`，`java_artifact=null`、无异常/timeout/stall/not-run；结果 SHA-256 分别为 `D17E48E636585A7EB1744663B88E6FA8C12ADE9275704B8592BD36F4787E16C7` 与 `FDCE55E44104E3378E0FDCA14BF742F126488A961CF96D38789D2D214F11F29E`。
- 以 `ee0dd77` 为父基线运行修订后的 `classify-change-gate`：`T1`、`live_java_required=false`、`m1_minus_required=false`、生产源改动 `13` 行；原因是 `high-risk-path` 与 `semantic-token-change`。单个普通类不使用 `--scope responsibility`，本批未启动 M1-。
- jree 审计去注释 summary：直接导入文件 `88`、`JavaObject` 文件 `28`（本批前 `29`）、`newLinkedHashMap=0`、`newLinkedHashSet=1`；迁移扫描 `231` 个文件，平台审计扫描 `179` 个文件；编码检查与 `git diff --check` 通过。

本批可以宣称：`Counting` 的无行为 JavaObject 外壳及遗留 `super()` 已原生化，并经直接回归、M2、代表性 smoke 和修订后 T1 gate 保护。仍不能宣称：023/024 完成、生产核心 jree 清零、#245 长期稳定性完成、Java/TypeScript 性能等价或正式发布。该插件不在默认注册表，代表性 NAL 不等于 Counting 业务行为的直接覆盖。

### 2026-09-18：`Emotions` 隐式 JavaObject 壳原生化

本批承接 `13a1a29`，继续 023 的单一普通类切片。对照 canonical Java `Emotions.java` 确认其声明为普通 `public class Emotions implements Plugin`；TypeScript 原先的 `JavaObject` 只提供外壳，两个构造器中的 `super()` 是翻译遗留。该插件在默认配置中注册，且 `Nar` 使用 `instanceof Emotions` 识别，因此保留原生类身份、Java float32 阈值、事件、异常、字符串和 Math 合同，只移除兼容壳。

- `src/plugin/mental/Emotions.ts`：删除 `JavaObject` 导入和继承，移除默认/带参构造器中的空 `super()`，保留 Java 构造器重载、float32 阈值、事件和 `instanceof` 语义。
- `test/node/emotions-boundary.test.ts`：新增默认/带参构造器、阈值收窄、原型链和 `instanceof` 回归；定向测试 `1/1`。
- M2-TS：非增量 `tsc=0`；串行单测 `293` 项，`291` 通过、`2` 跳过、`0` 失败；build、dist API 通过。
- 两个代表性 TS-only NAL smoke（`nal4.7.nal`、`nal8.add.nal`）均为 `1/1`，`java_artifact=null`、无异常/timeout/stall/not-run；结果 SHA-256 分别为 `9DF54FCC80450ECE3C97BDE037996F4EADD4E4450E1911599B1B0B4D6E79696A` 与 `40EDB744ACC5706E8E0CC54A2ED6C8CFC6FA651C557D4E88C763F32EC40C8450`。
- 以 `13a1a29` 为父基线运行修订后的 `classify-change-gate`：`T1`、`live_java_required=false`、`m1_minus_required=false`、生产源改动 `13` 行；原因是 `high-risk-path` 与 `semantic-token-change`。单个普通类不使用 `--scope responsibility`，本批未启动 M1-。
- jree 审计去注释 summary：直接导入文件 `88`、`JavaObject` 文件 `27`（本批前 `28`）、`newLinkedHashMap=0`、`newLinkedHashSet=1`；迁移扫描 `232` 个文件，平台审计扫描 `179` 个文件；编码检查与 `git diff --check` 通过。

本批可以宣称：`Emotions` 的无行为 JavaObject 外壳及遗留 `super()` 已原生化，并经直接回归、默认配置路径 M2、代表性 smoke 和修订后 T1 gate 保护。仍不能宣称：023/024 完成、生产核心 jree 清零、#245 长期稳定性完成、Java/TypeScript 性能等价或正式发布。代表性 NAL 覆盖默认插件装载路径，但不等于 Emotions 事件行为全覆盖。

### 2026-09-18：`InternalExperience` 隐式 JavaObject 壳原生化

本批承接 `13a1a29` 与门禁修订后的普通类切片。对照 canonical Java `InternalExperience.java` 确认其声明为普通 `public class InternalExperience implements Plugin, EventObserver`；TypeScript 原先的 `JavaObject` 只提供外壳，默认/九参构造器中的 `super()` 是翻译遗留。该插件在默认配置中注册，且通过事件 observer 和 `instanceof` 进入主链，因此保留对象身份、事件类、float32/boolean 配置、异常、字符串和静态方法合同，只移除兼容壳。

- `src/plugin/mental/InternalExperience.ts`：删除 `JavaObject` 导入和继承，移除默认/九参构造器中的空 `super()`，保留 Plugin/EventObserver、float32 配置、事件和静态工具语义。
- `test/node/internal-experience-boundary.test.ts`：新增默认/九参构造器、float32/boolean 配置、原型链和 `instanceof` 回归；定向测试 `1/1`。
- M2-TS：非增量 `tsc=0`；串行单测 `294` 项，`292` 通过、`2` 跳过、`0` 失败；build、dist API 通过。
- 两个代表性 TS-only NAL smoke（`nal4.7.nal`、`nal8.add.nal`）均为 `1/1`，`java_artifact=null`、无异常/timeout/stall/not-run；结果 SHA-256 分别为 `E0F02FC1E175CA1FD4EBEBA651741C584F0E637D4D0982A33BD6C4C670071776` 与 `5F11D684A2750AB5A17E087BB8AAB296CE8B0E8DA7C6808C57B7682AA38BAB3C`。
- 以 `dcf9597` 为父基线运行修订后的 `classify-change-gate`：`T1`、`live_java_required=false`、`m1_minus_required=false`、生产源改动 `12` 行；原因是 `high-risk-path` 与 `semantic-token-change`。单个普通类不使用 `--scope responsibility`，本批未启动 M1-。
- jree 审计去注释 summary：直接导入文件 `88`、`JavaObject` 文件 `26`（本批前 `27`）、`newLinkedHashMap=0`、`newLinkedHashSet=1`；迁移扫描 `233` 个文件，平台审计扫描 `179` 个文件；编码检查与 `git diff --check` 通过。

本批可以宣称：`InternalExperience` 的无行为 JavaObject 外壳及遗留 `super()` 已原生化，并经直接回归、默认配置路径 M2、代表性 smoke 和修订后 T1 gate 保护。仍不能宣称：023/024 完成、生产核心 jree 清零、#245 长期稳定性完成、Java/TypeScript 性能等价或正式发布。代表性 NAL 覆盖默认插件装载路径，但不等于 InternalExperience 全部事件分支和静态业务方法的直接覆盖。

### 2026-09-18：`Shell` 隐式 JavaObject 壳原生化

本批承接 `85770b1`，继续 023/024 的宿主入口切片。对照 canonical Java `Shell.java` 确认 Java 声明为普通 `public class Shell`，构造器只有 `this.nar = n`；只有内部 `InputThread` 继承线程类。TypeScript 原先的 `JavaObject` 是翻译外壳，不能与 `ThreadCompat` 这一真实线程适配混淆。

- `src/main/Shell.ts`：删除 `JavaObject` 导入、外层继承和空 `super()`；保留 `java` 的 PrintStream/System、Integer/Boolean、String、异常和 IO 合同，保留 `InputThread extends ThreadCompat`、Node stdin、文件系统和宿主退出路径。
- `test/node/shell-boundary.test.ts`：新增构造器、原型链和 `instanceof` 回归；定向测试 `1/1`。
- M2-TS：非增量 `tsc=0`；串行单测 `295` 项，`293` 通过、`2` 跳过、`0` 失败；build 源文件 `135` 个成功；dist API `cycles=2`、`cycleEnds=2`、`outputSignals=1`、`stopped=true`。其中已有 Shell 无警告测试也通过。
- 两个代表性 TS-only NAL smoke（`nal4.7.nal`、`nal8.add.nal`）均为 `1/1`，冻结 Java baseline SHA-256 为 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`，`java_artifact=null`，无 exception/stall/process limit/marker missing。结果 SHA-256 分别为 `2847539708B516ECFC4035947F90B1B27ADDACB61A2BBEB4871899DADB9DECAE` 与 `EB2B1F3F7A7709696E8AFCDCD6CC559717CCBF5DE2D47CA5F7813377D1BF6E84`。
- 以 `85770b1` 为父基线运行 `classify-change-gate`：`T1`、`live_java_required=false`、`m1_minus_required=false`、生产源改动 `6` 行；原因是 `high-risk-path:src/main/Shell.ts` 与 `semantic-token-change`。单个普通宿主类不使用 `--scope responsibility`，本批未启动 M1-。
- jree 审计去注释 summary：直接导入文件 `88`、`JavaObject` 文件 `25`（本批前 `26`）、`newLinkedHashMap=0`、`newLinkedHashSet=1`；迁移扫描 `234` 个文件。平台审计仍把 Shell 标记为 mixed Node-host boundary；未把宿主 Node 依赖误算作核心去 jree 完成。

本批可以宣称：`Shell` 的无行为 JavaObject 外壳已按 canonical Java 普通类契约原生化，并经直接回归、串行 M2-TS、Shell 无警告测试、两个代表性 smoke、静态审计和 T1 gate 保护；代码提交 `3cb60c8` 已推送到 `origin/main`。仍不能宣称：023/024 完成、生产核心 jree 清零、#245 长期稳定性完成、Java/TypeScript 性能等价或正式发布。Shell 的 Node 文件系统、stdin、线程和退出能力仍属于后续 024 宿主适配边界，本批未改变这些行为。

### 2026-09-18：`VisualSpace` 隐式 JavaObject 壳原生化

本批承接 `f1bc27f`，继续 023/024 的感知边界切片。对照 canonical Java `VisualSpace.java` 确认 Java 声明为普通 `public class VisualSpace implements ImaginationSpace`，无显式父类；TypeScript 原先的 `JavaObject` 只提供翻译外壳。`instanceof VisualSpace` 是领域类身份判断，必须保留；图像复制、float 和 ImaginationSpace 算法不在本批改动范围。

- `src/plugin/perception/VisualSpace.ts`：删除 `JavaObject` 导入、外层继承和空 `super()`；保留 ImaginationSpace、`instanceof VisualSpace`、静态 move/zoom 插件、图像快照和数值计算合同。
- `test/node/visual-space-boundary.test.ts`：新增构造器、原型链、实例身份、源数据复制和插件登记回归；定向测试 `1/1`。
- M2-TS：非增量 `tsc=0`；串行单测 `296` 项，`294` 通过、`2` 跳过、`0` 失败；build 源文件 `135` 个成功；dist API `cycles=2`、`cycleEnds=2`、`outputSignals=1`、`stopped=true`。
- 两个代表性 TS-only NAL smoke（`nal4.7.nal`、`nal8.add.nal`）均 `1/1`，冻结 Java baseline SHA-256 为 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`，`java_artifact=null`，无 exception/stall/process limit/marker missing。结果 SHA-256 分别为 `41538A9AF4EAC9141FFB8047474D23C8C8FF74C2EFC0DBD7E1DBFD6ABDFC50BD` 与 `517C1DC13C7F7790F1224DAAD54EBB4D46C46D370BEEB04E73B50A9BC2EACAB9`。
- 以 `f1bc27f` 为父基线运行 `classify-change-gate`：`T1`、`live_java_required=false`、`m1_minus_required=false`、生产源改动 `6` 行；原因是 `high-risk-path:src/plugin/perception/VisualSpace.ts` 与 `semantic-token-change`。单个普通感知类不使用 `--scope responsibility`，本批未启动 M1-。
- jree 审计去注释 summary：直接导入文件 `88`、`JavaObject` 文件 `24`（本批前 `25`）、`newLinkedHashMap=0`、`newLinkedHashSet=1`；迁移扫描 `235` 个文件。平台审计仍把感知模块和 jree 依赖作为静态边界项记录，本批未误宣称核心 jree 清零。

本批可以宣称：`VisualSpace` 的无行为 JavaObject 外壳已按 canonical Java 普通类契约原生化，并经直接回归、串行 M2-TS、两个 TS-only smoke、静态审计和 T1 gate 保护；代码提交 `6fe4f6e` 已推送到 `origin/main`。仍不能宣称：023/024 完成、生产核心 jree 清零、#245 长期稳定性完成、Java/TypeScript 性能等价或正式发布。VisualSpace 的图像算法、float 合同和 Nar/插件依赖仍未改变。

### 2026-09-18：`Narsese` 隐式 JavaObject 壳原生化

本批承接 `b8c0858`，继续 023 的单一普通类切片。对照 canonical Java `Narsese.java` 确认其声明为 `public class Narsese implements Serializable, Parser`，没有显式父类；TypeScript 原先的 `JavaObject` 只提供翻译外壳。项目内没有 `Narsese.class`、`instanceof Narsese` 或 `Narsese.getClass()` 的消费面，因此只移除外层壳和空 `super()`，保留解析器、Memory/Nar 双入口、Java 字符串、异常和所有解析算法。

- `src/io/Narsese.ts`：删除 `JavaObject` 导入、继承和空 `super()`；不保留 jree 的 `java.io.Serializable` TypeScript marker，因为该接口在 jree 中额外要求 `getClass()` 反射方法，而 Java 的 `Serializable` 本身只是无行为标记。保留 `Parser` 契约，并用注释记录原 Java 类型。
- `test/node/narsese-boundary.test.ts`：新增普通类原型链、`instanceof` 和构造器 Memory 委托回归，直接测试 `1/1`。
- M2-TS：非增量 `tsc=0`；串行单测 `297` 项，`295` 通过、`2` 跳过、`0` 失败；build `sourceFileCount=135`、dist API 均通过。
- 两个 TS-only 冻结标杆 smoke（`nal4.7.nal`、`nal8.add.nal`）均 `1/1`，无 exception、stall、process limit、marker missing 或 Java/TS diff；冻结 Java baseline SHA-256 为 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`，`java_artifact=null`。
- 以 `b8c0858` 为父基线运行 `classify-change-gate`：`T1`、`live_java_required=false`、`m1_minus_required=false`、生产源改动 `7` 行；本批未启动 Java 和 M1-。
- 证据文件在项目外归档：`s1-narsese-nal4.7-20260918.jsonl` SHA-256 `9AE0829B7635A8C7D9A5F993662583119300C87178AD0529284FD768E982F6B1`；`s1-narsese-nal8-add-20260918.jsonl` SHA-256 `E1604EAB6CCC0B15D29B3D2FAF37D149DB82FC8599E7736F7EB6E678F72A63B8`。
- jree 审计（HEAD `90fe4fe`）：直接导入文件 `88`、`JavaObject` 文件 `23`、`new LinkedHashMap=0`、`new LinkedHashSet=1`；平台审计扫描 `179` 个文件，核心候选 `83`、混合边界 `5`。`Narsese` 仍保留 `java` 字符串/异常/运行时解析边界，本批不是 jree 退场。

本批可以宣称：`Narsese` 的无行为 JavaObject 外壳已按 canonical Java 普通类契约原生化，并经直接回归、串行 M2-TS、两个 TS-only smoke、静态审计和 T1 gate 保护；代码提交 `90fe4fe`。仍不能宣称：023/024 完成、生产核心 jree 清零、完整 M1/#245 重新完成、Java/TypeScript 性能等价或正式发布。全部 `scripts/checking/*.py` 已顺序通过，汉字编码和 `git diff --check` 通过。

### 2026-09-18：`Events` 外层普通类边界原生化

本批承接 `082bf62`，继续 023 的单一普通类切片。对照 canonical Java `Events.java` 确认其声明为可实例化的 `public class Events`，没有显式父类、实例方法或构造器使用面；TypeScript 原先的外层 `abstract extends JavaObject` 是翻译兼容壳。`CycleEnd` 等嵌套事件类仍承担 JavaObject/反射合同，因此只移除外层壳，不删除文件内仍有意义的 jree 依赖。

- `src/io/events/Events.ts`：删除外层 `abstract`、`extends JavaObject` 和对应外层兼容语义；嵌套事件类、`java` 导入和反射行为保持不变。
- `test/node/event-emitter.test.ts`：新增外层原型链、实例身份和 `CycleEnd.class` 名称回归；定向测试 `6/6`。
- M2-TS：非增量 `tsc=0`；串行单测 `298` 项，`296` 通过、`2` 跳过、`0` 失败；build 源文件 `135` 个成功；dist API 通过。
- 两个 TS-only 冻结标杆 smoke（`nal4.7.nal`、`nal8.add.nal`）均为 `1/1`，冻结 Java baseline SHA-256 为 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`，`java_artifact=null`，无 exception/stall/process limit/marker missing。结果 SHA-256 分别为 `35681ED7493ACFDA774351F9EE7A4A21087809D435FFA0AA23F584F8541CDEC7` 与 `BCB998E733E4D3726DCE75A94AD637B87100B3E4535879B962B941C0E07423BD`。
- 以 `082bf62` 为父基线运行 `classify-change-gate`：`T1`、`live_java_required=false`、`m1_minus_required=false`；本批未启动 Java 和 M1-。
- jree 审计去注释 summary：直接导入文件 `88`、`JavaObject` 文件 `23`、`newLinkedHashMap=0`、`newLinkedHashSet=1`；迁移扫描 `236` 个文件。JavaObject 文件数不下降是预期的，因为嵌套事件类仍保留反射合同。

本批可以宣称：`Events` 外层无行为 JavaObject/abstract 兼容壳已按 canonical Java 普通类合同原生化，并经直接回归、串行 M2-TS、两个 TS-only smoke、静态审计和 T1 gate 保护；代码提交 `4e09b5b`。

仍不能宣称：023/024 完成、生产核心 jree 清零、完整 M1/#245 重新完成、Java/TypeScript 性能等价或正式发布。嵌套事件类的反射合同和事件行为全量覆盖仍未改变。

### 2026-09-18：`ProcessGoal.ExecutablePrecondition` 私有数据壳原生化

本批承接 `00349ab`，继续 023 的 Java 合同驱动小簇。对照 canonical Java `ProcessGoal.java` 确认外层 `ProcessGoal` 是静态工具类，私有 `ExecutablePrecondition` 是普通数据 holder；两者均无显式父类，且没有 `getClass()`、`.class` 或其他反射消费面。先审查的 `EventHandler` 候选因下游仍消费继承的 `getClass()`、静态 `OutputHandler.class` 和 `Serializable` 类型契约而暂缓，未把它误删。

- `src/control/concept/ProcessGoal.ts`：删除仅服务于私有 `ExecutablePrecondition` 的 `JavaObject` 导入和继承；保留 `java` Map/异常、float/long 边界、任务派发和静态推理算法。
- `test/node/core-runtime.test.ts`：在已有默认元数据测试中增加 `ExecutablePrecondition.prototype` 直接继承 `Object.prototype` 的回归。
- 定向 `core-runtime`：`37/37`；非增量 `tsc=0`；串行单测 `298` 项，`296` 通过、`2` 跳过、`0` 失败；build 源文件 `135` 个；dist API 通过。
- 两个 TS-only 冻结标杆 smoke（`nal4.7.nal`、`nal8.add.nal`）均 `1/1`，无 exception/stall/process limit/marker missing。结果 SHA-256 为 `9C8245DA3CE3932388D0638666A99180F77DDF093C11286171FFE2169DC47D76` 与 `D06CBDFC847E9ABFEECDE7BF4E3245D1737E98F6006BA82C1878DACFBBCFF0C7`。
- 以 `00349ab` 为父基线的 `classify-change-gate` 判定 `T1`、`live_java_required=false`、`m1_minus_required=true`，原因是 `hot-path:src/control/concept/ProcessGoal.ts`。随后完成 TS-only M1- 244 项串行矩阵：`244/244` functional/parity，0 exception、0 timeout、0 marker missing、0 stall、0 process limit、0 not-run、0 performance warning；总耗时 `1794242 ms`，最大单文件 `388643 ms`，最大 RSS `1049436160 bytes`，reasoning cycles 合计 `2288254`。
- M1- 证据位于项目外 `H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\s1-process-goal-m1-minus-20260918.jsonl`，SHA-256 `984382E657EEABD0478F0BFC7D561FF2C97DCD97111BFF1416C73561A127AFC5`；复用冻结 Java baseline SHA-256 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`，`java_artifact=null`。
- jree 审计（生产 `src`）：直接导入文件 `88`、`JavaObject` 文件 `22`、`newLinkedHashMap=0`、`newLinkedHashSet=1`；迁移扫描 `236` 个文件。M1- 中 1 个 markerless 短运行项未达到 131072 周期，但没有功能失败或 marker 缺失，不替代既有严格长周期证据。

本批可以宣称：`ProcessGoal.ExecutablePrecondition` 的无行为 JavaObject 壳已原生化，并通过直接回归、完整串行 M2、两个 TS-only smoke、T1 要求的 M1- 244/244 和静态审计保护；代码提交 `875abba`。

仍不能宣称：023/024 完成、生产核心 jree 清零、完整 M1/#245 长周期在本批完成、Java/TypeScript 性能等价或正式发布。`EventHandler` 的 JavaObject 继承仍是有证据的反射/类型边界，需独立设计后再处理。

### 2026-09-18：`ItemPriorityComparator` 无行为 JavaObject 壳原生化

本批承接 `39746db`，继续 023 的 Java 合同驱动小簇。对照 canonical Java `Item.java` 确认外层 `Item<K>` 是抽象实体类并实现 `Serializable`，必须保留 JavaObject、equals/hashCode 和实体继承合同；嵌套 `ItemPriorityComparator<E extends Item<?>>` 是普通静态比较器，没有显式父类、`getClass()` 或 `.class` 消费面，因此只移除嵌套比较器的翻译兼容壳。

- `src/entity/Item.ts`：删除 `ItemPriorityComparator` 的 `extends JavaObject`，增加 Java 原始类型注释；外层 `Item` 保持不变。
- `test/node/core-runtime.test.ts`：增加比较器原型链回归，确认直接继承 `Object.prototype`；定向 core-runtime `38/38`。
- M2-TS：非增量 `tsc=0`；串行单测 `299` 项，`297` 通过、`2` 跳过、`0` 失败；build `sourceFileCount=135`；dist API `cycles=2`、`cycleEnds=2`、`outputSignals=1`、`stopped=true`。
- 两个 TS-only 冻结标杆 smoke（`nal4.7.nal`、`nal8.add.nal`）均 `1/1`，冻结 Java baseline SHA-256 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`，`java_artifact=null`，无 exception、timeout、stall、process limit 或 marker missing。结果 SHA-256 分别为 `D251CBB56C2D741E1CE0A6FD70133F2028D445E832CD8404405E9BF5E0DFDE46` 与 `0A3108471EA2DCC5C2D0707B265E4747EF0DED328D5BBEBC137D93F0326D18BC`。
- 以 `39746db` 为父基线运行 `classify-change-gate`：`T1`、`live_java_required=false`、`m1_minus_required=false`；原因是 `high-risk-path:src/entity/Item.ts` 与 `semantic-token-change`。本批未重复运行 Java 和 M1-。
- 生产 jree 审计：直接导入文件 `88`、`JavaObject` 文件 `22`、`newLinkedHashMap=0`、`newLinkedHashSet=1`；平台审计扫描 `179` 个文件，核心候选 `83`、混合边界 `5`。编码检查与 `git diff --check` 通过。

本批可以宣称：`ItemPriorityComparator` 的无行为 JavaObject 外壳已按 canonical Java 合同原生化，并经直接回归、串行 M2、两个 TS-only smoke、静态审计和 T1 gate 保护；代码提交 `b358e4c`。仍不能宣称：023/024 完成、生产核心 jree 清零、完整 M1/#245 长周期重新完成、Java/TypeScript 性能等价或正式发布。外层 `Item` 的 JavaObject、equals/hashCode、Serializable 和核心实体行为未在本批重写。

### 2026-09-18：S0 A/B 证据复核与 `Operator.ExecutionResult` 普通载荷原生化

本批首先按现行目标文件复核 S0，而不是把目标文件中遗留的待办文字当作当前事实。`f1cf976` 与 `f952a02` 的 M1- 外部结果均为 244 行，并且 `run_key` 完全一致：TS-only、单线程 cold、`cycles=1550`、`timeoutMs=180000`、`processLimitMs=1800000`、冻结 Java baseline SHA-256 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`。A（Anticipate Map）两项高成本样本均完成 marker；B（Bag nameTable Map）两项均命中进程安全上限。原始 profile SHA-256 为 `4C864400155D54C1898A773ED2EC02FC8CE7E27107CE051A06329B38EA13946C`。随后 `1faf542` 的 NativeMap 哈希索引修复已恢复两项 marker 可观察性，S0 闭环已有既有报告和结果支撑，本批未重复运行长测。

本批继续 023 的单一普通静态类切片。对照 canonical Java `Operator.java` 确认 `ExecutionResult` 是无显式父类的 `public static class`，没有 `.class`、`getClass()` 或 Serializable 消费面；TypeScript 只需保留其 class identity 和事件载荷行为。

- `src/operator/Operator.ts`：删除嵌套 `ExecutionResult` 的 `JavaObject` 继承、空 `super()` 和不再适用的 `override`；外层 `Operator extends Term` 保持不变，并增加 Java 原始类型注释。
- `test/metrics/AttentionMetric.ts`：将事件参数到 `Operator.ExecutionResult` 的转换改为显式 `unknown` 中转，固定普通载荷的类型边界。
- `test/node/core-runtime.test.ts`：增加 `ExecutionResult.prototype` 直接继承 `Object.prototype` 的回归；定向 core-runtime `39/39`。
- M2-TS：非增量 `tsc=0`；串行单测 `300` 项，`298` 通过、`2` 跳过、`0` 失败；build `sourceFileCount=135`；dist API 通过。
- 两个 TS-only 受影响样本均与冻结 Java 标杆一致：`simpleOperationTest.nal` `1/1`、`51564` 周期、`23523 ms`，证据 SHA-256 `E5E88B627F8EB1124702A64556020C474B588889D81FF2B8B12F77894252706B`；`toothbrush2.nal` `1/1`、两个 marker、`201550` 周期、`126618 ms`、峰值 RSS `831414272`，证据 SHA-256 `4AD724D2431FB0F61A6916BFE94DBEF833B2CFDF208E3F622D63A040F3F18112`。两项均无 exception、timeout、stall、process limit 或 marker missing，且 `java_artifact=null`。
- `classify-change-gate --base 41ce643 --head 8862203`：`T1`、`live_java_required=false`、`m1_minus_required=false`；原因是高风险 Operator 路径和语义 token 变化。本批未重复运行 Java 或 M1-。
- 静态扫描：迁移扫描 `236` 个文件；jree 审计直接导入文件 `88`、`JavaObject` 文件 `21`、`newLinkedHashMap=0`、`newLinkedHashSet=1`；平台审计扫描 `179` 个文件，核心候选 `83`、混合边界 `5`；汉字编码检查和 `git diff --check` 通过。

本批可以宣称：S0 的 A/B/profile 证据链已复核；`Operator.ExecutionResult` 的无行为 JavaObject 外壳已按 canonical Java 普通静态类合同原生化，并经直接回归、M2、操作样本和 T1 gate 保护；代码提交 `8862203`。仍不能宣称：023/024 完成、生产核心 jree 清零、完整 M1/#245 长周期重新完成、Java/TypeScript 性能等价或正式发布。

### 2026-09-18：`CompoundTerm.ConvRectangle` 普通几何数据壳原生化

本批承接 `f2d6481`，继续 023 的单一 Java 合同小簇。对照 canonical Java `CompoundTerm.java` 确认 `ConvRectangle` 是无显式父类的 `public static class`，只有 `index_variable`、`term_indices` 两个数据字段和无行为构造器；没有 Serializable、`.class` 或 `getClass()` 消费面。因此只移除嵌套数据壳的 jree 继承，保留外层 `CompoundTerm extends Term`、既有 `Int32Array` 对 Java `int[]` 的表示和全部索引计算。

- `src/language/CompoundTerm.ts`：删除 `JavaObject` 导入、`ConvRectangle` 的 `extends JavaObject` 和空 `super()`；增加 Java 原始类型注释。
- `test/node/core-runtime.test.ts`：增加 `ConvRectangle` 原型链与默认 `null` 字段回归；已有 `UpdateConvRectangle` 断言继续覆盖几何计算；定向 core-runtime `40/40`。
- M2-TS：非增量 `tsc=0`；串行单测 `301` 项，`299` 通过、`2` 跳过、`0` 失败；build `sourceFileCount=135`；dist API 通过。
- 两个 TS-only 冻结标杆 smoke 均 `1/1`，冻结 Java baseline SHA-256 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`，`java_artifact=null`，无 exception、timeout、stall、process limit 或 marker missing。`nal4.7.nal` 结果 SHA-256 `1A04435EC8A920E384999322FA515776E8AAEF08EC7A72A4B9447DCF3A0919E6`；`nal8.add.nal` 结果 SHA-256 `9DD173E3729F45940970229B022E05A82CBFD23C695C695FA5C634E47F83F2D4`。
- `classify-change-gate --base f2d6481 --head 72161a8`：`T1`、`live_java_required=false`、`m1_minus_required=false`；原因是 `high-risk-path:src/language/CompoundTerm.ts` 与 `semantic-token-change`。本批未重复运行 Java 或 M1-。
- 静态扫描：迁移扫描 `236` 个文件；jree 审计直接导入文件 `88`、`JavaObject` 文件 `20`、`newLinkedHashMap=0`、`newLinkedHashSet=1`；平台审计扫描 `179` 个文件，核心候选 `83`、混合边界 `5`；编码检查与 `git diff --check` 通过。

本批可以宣称：`CompoundTerm.ConvRectangle` 的无行为 JavaObject 外壳已按 canonical Java 普通静态类合同原生化，并经直接回归、M2、两个 TS-only NAL、静态审计和 T1 gate 保护；代码提交 `72161a8`。仍不能宣称：023/024 完成、生产核心 jree 清零、完整 M1/#245 长周期重新完成、Java/TypeScript 性能等价或正式发布。外层 `CompoundTerm` 的继承、几何索引算法和 `int[]` 表示未在本批重写。

### 2026-09-18：`NarNode.TargetNar` 普通网络目标壳原生化

本批承接 `f6b160d`，继续 023/024 的宿主边界小簇。对照 canonical Java `NarNode.java` 确认 `TargetNar` 是无显式父类的 `public static class`，只承载目标地址、DatagramSocket、阈值、Term 和发送标记，没有 Serializable、`.class` 或 `getClass()` 消费面。因此只移除嵌套 holder 的 jree 外壳，不改变 Node socket 兼容、float32 收窄、发送逻辑或 `NarNode` 外层。

- `src/main/NarNode.ts`：删除 `TargetNar` 的 `extends JavaObject` 和空 `super()`，增加 Java 原始类型及宿主边界说明；`NarNode` 外层和 `EventReceivedTask` 仍保留 JavaObject。
- `test/node/narnode-targets.test.ts`：增加 TargetNar 原型链回归；定向测试 `2/2`。
- M2-TS：非增量 `tsc=0`；串行单测 `302` 项，`300` 通过、`2` 跳过、`0` 失败；build `sourceFileCount=135`；dist API 通过。
- 两个 TS-only 主链 smoke 均 `1/1`，冻结 Java baseline SHA-256 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`，`java_artifact=null`，无 exception、timeout、stall、process limit 或 marker missing。由于标准 NAL 不实例化 NarNode 网络路径，它们记录为主链无回退证据，不代替网络宿主测试。结果 SHA-256 分别为 `575FCFB90807D48399A79665D6B297121699C992D4D79D973F1648C8C41D63CE` 与 `B8345CB4D7BC7F50F5AE8D88476F08DF60315B948044DB7F47447C3D777AE76B`。
- `classify-change-gate --base f6b160d --head be1dd9f`：`T1`、`live_java_required=false`、`m1_minus_required=false`；原因是 `high-risk-path:src/main/NarNode.ts` 与 `semantic-token-change`。本批未重复运行 Java 或 M1-。
- 静态扫描：迁移扫描 `236` 个文件；jree 审计直接导入文件 `88`、`JavaObject` 文件 `20`、`newLinkedHashMap=0`、`newLinkedHashSet=1`；平台审计扫描 `179` 个文件，核心候选 `83`、混合边界 `5`；编码检查与 `git diff --check` 通过。

本批可以宣称：`NarNode.TargetNar` 的无行为 JavaObject 外壳已按 canonical Java 普通静态类合同原生化，并经直接边界回归、M2、主链 smoke、静态审计和 T1 gate 保护；代码提交 `be1dd9f`。仍不能宣称：024 网络宿主完整验收、023/024 完成、生产核心 jree 清零、完整 M1/#245 长周期重新完成、Java/TypeScript 性能等价或正式发布。`NarNode` 外层、`EventReceivedTask` 和真实 socket 通道未在本批重写。

### 2026-09-18：`Anticipate.Prediction` 普通身份键数据壳原生化

本批承接 `52c5c30`，继续按 023 的 Java 合同推进单一普通类切片。对照 canonical Java `Anticipate.java` 确认 `Prediction` 是包可见普通类，只含两个 `long` 字段和构造器，没有 `equals/hashCode`、`.class`、`getClass()` 或 Serializable 消费面。它虽然作为外层 `Map<Prediction, LinkedHashSet<Term>>` 的 key 使用，但 key 依赖的是 Java 默认对象身份；去掉 JavaObject 不得把它变成字段值 key。

- `src/operator/mental/Anticipate.ts`：删除 `Prediction` 的 `JavaObject` 导入、继承和空 `super()`；保留 `toRuntimeLong`、两个 long 字段、外层 Java Map 抽象、NativeMap 具体实现、Prediction 身份 key 和内层 NativeSet。
- `test/node/anticipate.test.ts`：在已有相同字段双 Prediction key 回归中增加普通原型链断言；不改变 Map/Set 行为测试。
- M2-TS：非增量 `tsc=0`；串行单测 `302` 项，`300` 通过、`2` 跳过、`0` 失败；build 源文件 `135` 个成功；dist API 通过。
- 两个 TS-only 冻结标杆 smoke 均 `functional_pass=true`、`parity=true`，冻结 Java baseline SHA-256 为 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`，`java_artifact=null`，单线程 cold。`nal4.7.nal` 为 `1550` 周期、`2891 ms`，结果 SHA-256 `20AC2521A8EE9A931FEE024C9C5EF981CA1ADB0DB13DDF782B732894B97F88D2`；`nal8.add.nal` 为 `1550` 周期、`3519 ms`，结果 SHA-256 `29095183338BF216AF309AFE6207940DCE2A4C8165C12515A912199C5CB35914`。两项均无 exception、timeout、stall、process limit 或 marker missing。
- 以 `52c5c30` 为父基线运行 `classify-change-gate`：T1、`live_java_required=false`、`m1_minus_required=false`；原因是 `high-risk-path:src/operator/mental/Anticipate.ts` 与 `semantic-token-change`，本批未启动 M1-。
- 静态审计（HEAD `e03f823`）：迁移扫描 `236` 个文件；jree 审计直接导入文件 `88`、`JavaObject` 文件 `19`、`newLinkedHashMap=0`、`newLinkedHashSet=1`；平台审计继续保留宿主边界和核心 jree 风险清单。汉字编码检查与 `git diff --check` 通过。

本批可以宣称：`Anticipate.Prediction` 的无行为 JavaObject 外壳已按 canonical Java 普通类合同原生化，并经身份键/原型链回归、串行 M2-TS、两个 TS-only smoke、T1 gate 和静态审计保护；代码提交 `e03f823`。仍不能宣称：023/024 完成、生产核心 jree 清零、完整 M1/#245 长周期重新完成、Java/TypeScript 性能等价或正式发布。外层 `Anticipate`、Map/Set 抽象、预测派发和 `jree-compat` 未在本批重写。

### 2026-09-18：`VisionChannel.Prototype` 普通感知数据壳原生化

本批承接 `352e3ea`，继续按 023 的 Java 合同推进单一普通类切片。对照 canonical Java `VisionChannel.java` 确认 `Prototype` 是包可见普通类，只含 observationCount、Task 和三个普通方法，没有 `.class`、`getClass()` 或 Serializable 消费面。`VisionChannel.class` 仍用于日志反射，和嵌套 `Prototype` 的无行为对象壳是两条独立合同。

- `src/plugin/perception/VisionChannel.ts`：删除 `Prototype` 的 `JavaObject` 导入、继承和空 `super()`；保留外层 `VisionChannel.class`、事件 class token、float32 配置、原生数组顺序和感知算法。
- `test/node/vision-channel.test.ts`：在现有 prototype 生成测试中增加普通原型链断言。
- M2-TS：非增量 `tsc=0`；串行单测 `302` 项，`300` 通过、`2` 跳过、`0` 失败；build 源文件 `135` 个成功；dist API 通过。
- 两个 TS-only 冻结标杆 smoke 均 `functional_pass=true`、`parity=true`，冻结 Java baseline SHA-256 为 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`，`java_artifact=null`，单线程 cold。`nal4.7.nal` 为 `1550` 周期、`2901 ms`，结果 SHA-256 `38B262E91DDFDD7BA98BBC54AE768F819E49BA08C1E485A78327E1879B29E860`；`nal8.add.nal` 为 `1550` 周期、`3468 ms`，结果 SHA-256 `CA8C8D1FE8727D0BA2536497DB30798167410EEE2A350624382EADC4F8D72405`。两项均无 exception、timeout、stall、process limit 或 marker missing。
- 以 `352e3ea` 为父基线运行 `classify-change-gate`：T1、`live_java_required=false`、`m1_minus_required=false`；原因是 `high-risk-path:src/plugin/perception/VisionChannel.ts` 与 `semantic-token-change`，本批未启动 M1-。
- 静态审计（HEAD `65927d9`）：迁移扫描 `236` 个文件；jree 审计直接导入文件 `88`、`JavaObject` 文件 `18`、`newLinkedHashMap=0`、`newLinkedHashSet=1`；平台审计扫描 `179` 个文件，核心候选 `83`、混合边界 `5`。汉字编码检查与 `git diff --check` 通过。

本批可以宣称：`VisionChannel.Prototype` 的无行为 JavaObject 外壳已按 canonical Java 普通类合同原生化，并经原型链/感知生成回归、串行 M2-TS、两个 TS-only smoke、T1 gate 和静态审计保护；代码提交 `65927d9`。仍不能宣称：023/024 完成、生产核心 jree 清零、完整 M1/#245 长周期重新完成、Java/TypeScript 性能等价或正式发布。VisionChannel 外层、日志反射、感知算法和 float 合同未在本批重写。

### 2026-09-18：`EventHandler` 前向审查暂缓

本批承接 `ff5d43e`，对剩余 `JavaObject` 做继承链前向审查。canonical Java `EventHandler.java` 直接声明为普通抽象基类，没有显式父类、Serializable 或自身 `.class` 消费；但 TypeScript 的 `OutputHandler`、`TextOutputHandler` 和测试辅助类沿继承链消费了 jree 提供的 `class/getClass` 及 Serializable 类型合同。

- 未提交实验曾删除 `EventHandler` 的 JavaObject 和空 `super()`，并增加普通原型链断言。
- 实验定向 EventHandler 测试为 `6/6`，但非增量 typecheck 暴露 4 项下游诊断：`LocalRules` 的两处 `OutputHandler.class`、`TextOutputHandler implements Serializable` 缺少 `getClass`、测试 `OutputCondition` 缺少 `getClass`。
- 实验已完全撤回；撤回后 `tsc=0`、build `135` 个源文件、dist API 和 EventHandler 定向 `6/6` 均通过。没有新增代码、测试或 jree 计数变化，也没有改变 Java 标杆和 M1/M2 证据。

本批可以宣称：EventHandler 的前向审查发现并记录了真实的继承链约束，避免了一次会破坏事件 class token 和 Serializable 类型传播的表面去壳。仍不能宣称：EventHandler 已去 jree；023/024 完成、生产核心 jree 清零、完整 M1/#245 长周期重新完成、Java/TypeScript 性能等价或正式发布。后续若处理该簇，必须先设计项目内 `class/getClass` 兼容边界，再单独回归 OutputHandler 和 Serializable 消费者。

### 2026-09-18：事件类身份边界原生化

本批承接 `0716ee2`，继续按照 023 的 Java 合同驱动小簇推进。对照 canonical Java 事件 API 确认，`Events` 的嵌套类和 `OutputHandler` 的通道类主要作为 `Class` token 使用：事件注册表以类身份作为 Map key，`InferenceEvent.getType()` 返回运行时类，输出通道通过类 token 分派。这个局部合同可以从 jree JavaObject 的通用兼容壳中拆出，但 `EventHandler` 外层仍保留 jree 继承，因为此前前向审查已确认其后代的 Serializable/`getClass()` 类型链尚未独立收敛。

- `src/runtime/RuntimeClass.ts`：新增 `ClassTokenLike`、`RuntimeClassToken` 和 `RuntimeObject`。项目自有边界只承载稳定类 token、类名、身份相等、实例判断和受限构造；不声称提供 JavaObject 的 hashCode、monitor 或序列化行为。
- `src/io/events/Events.ts`、`src/io/events/OutputHandler.ts`：事件标记类、推理事件类和输出通道类由 `JavaObject` 外壳改为 `RuntimeObject`；保留 Java 类身份和事件分派语义。
- `EventEmitter`、`EventHandler`、`AnswerHandler`、`TextOutputHandler`、`Eventable` 及相关调用方：将事件 token 参数收敛为 `ClassTokenLike`，兼容尚未迁移的 jree Class 与新 token。
- `test/node/event-emitter.test.ts`：增加原生事件 token 的稳定性、名称、相等性和 `InferenceEvent.getType()` 回归。
- M2-TS：定向事件测试 `7/7`；串行单元测试 `303` 项，`301` 通过、`2` 跳过、`0` 失败；非增量 `tsc=0`；build、dist API、release package 均通过，release runtime warnings 为 `none`。
- 两个 TS-only 冻结标杆 smoke（`nal4.7.nal`、`nal8.add.nal`）均 marker parity `1/1`；代码提交 `28d7513`。
- `classify-change-gate --base 0716ee2 --head 28d7513` 判定 `T1`、`live_java_required=false`、`m1_minus_required=true`。随后完成冻结 Java JSONL 标杆下的 244 项单文件串行 M1-：`244/244` functional/parity，0 exception、0 timeout、0 stall、0 marker missing、0 process limit、0 not-run、0 performance warning；TS 运行时合计 `1631113 ms`，最大单文件 `339261 ms`，reasoning cycles 合计 `378200`。本次未启用 resource metrics，因此没有新增峰值 RSS 观测。
- M1- 证据位于项目外 `H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\m1-minus-runtime-class-20260918.jsonl`，SHA-256 `6B904837DF993F82540716BABD972D223B775DD11D01B168B4E54E137DC5EC46`；复用冻结 Java baseline SHA-256 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`，Java artifact SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`，`java_artifact=null`。
- 提交后静态审计：jree 生产审计 `sourceFiles=137`、直接导入文件 `88`、JavaObject 文件 `16`（上一批 `18`）、`newLinkedHashMap=0`、`newLinkedHashSet=1`；迁移扫描 `237` 个文件；平台边界扫描 `180` 个文件，核心候选 `83`、混合边界 `5`。汉字编码检查为 `No encoding anomalies`，`git diff --check` 通过。

本批可以宣称：事件类身份已形成项目自有、可单测的去 jree 边界，并通过 M2-TS、局部 TS-only smoke 和 T1 要求的 M1- `244/244`。仍不能宣称：完整 M1/#245 长周期重新完成、023/024 完成、生产核心 jree 清零、Java/TypeScript 性能等价或正式发布。M1- 结果本次未采集 RSS，性能数据只用于记录运行时，不替代后续性能专项。

### 2026-09-18：`SensoryChannel` 普通 Plugin 基类原生化

本批承接 `04402c2`，继续按 Java 合同审查一个普通插件基类。canonical Java `SensoryChannel.java` 是抽象 `Plugin` 基类，没有 `Serializable`、自定义 `equals/hashCode`、显式父类行为或实例级 `.class` 消费；`SensoryChannel.class.getName()` 只服务于日志。因而它的通用 `JavaObject` 外壳可以由项目内运行时类身份合同承接。

- `src/plugin/perception/SensoryChannel.ts`：Java 原始类型 `abstract class SensoryChannel implements Plugin` → TypeScript `extends RuntimeObject implements Plugin`；保留 Plugin 方法、感知算法、日志和公开 API。
- `src/main/Nar.ts`：删除冗余的 jree `java.lang.Runnable` 显式实现；`Nar` 仍通过 `Reasoner.run()` 满足 `ThreadCompat` 的 `{ run(): void }` 合同。这个收窄是必要的，因为 jree `Runnable` 携带的 `getClass(): jree Class` 会与 `RuntimeObject` 的项目内类 token 冲突。
- `test/node/nar-sensory-channel-map.test.ts`：新增原型链落在 `RuntimeObject`、派生通道保持自身类 token 的回归。
- M2-TS：定向测试 `2/2`；串行单元测试 `304` 项，`302` 通过、`2` 跳过、`0` 失败；非增量 `tsc=0`；build 的 136 个源文件、dist API 均通过。
- `classify-change-gate --base 04402c2 --head eab9a56` 判定 T1，`live_java_required=false`、`m1_minus_required=true`；未重新启动 Java，使用三轮一致的冻结功能标杆。
- M1-：TS-only、单线程、cold、逐文件串行，主资源 `single_step=215`、`multi_step=24`、`application=5`，共 `244/244` functional/parity；exception、marker missing、stall、process limit、not-run、Java/TS diff 和 performance warning 均为 `0`。TS 总时长 `1,875,218 ms`，最长单文件 `432,665 ms`，最大 RSS `959,041,536 bytes`，reasoning cycles `2,288,254`。
- M1- 首次运行在 24/244 后因外部进程会话终止而停止，没有形成失败结论；同一 JSONL 使用 `--resume` 从第 25 项恢复，最终摘要退出码为 `0`，没有重复已完成行。证据位于项目外 `H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\sensory-channel-m1-minus-20260918.jsonl`，SHA-256 为 `D4070A8BD596F2929E0E146AA968FD32B28BD5B718BF0FDDCC69AFA55731A0EF`。
- 仍复用冻结 Java 标杆 `g0-java-baseline-frozen-26772af-20260917`，SHA-256 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`；其 Java source commit `8675b76fe8c21ee20a7b8c1b63408fb05327210d`，canonical artifact SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`。
- 静态审计：迁移扫描 `237` 个文件；jree 审计 `sourceFiles=137`、直接导入文件 `88`、`JavaObject` 文件 `15`、`newLinkedHashMap=0`、`newLinkedHashSet=1`；平台边界仍由既有审计维护。覆盖率专项尚未实现，NAL 数量也未被当作源码覆盖率替代指标。

本批可以宣称：`SensoryChannel` 的无行为 `JavaObject` 外壳已按 canonical Java 普通基类合同原生化，并经直接身份回归、串行 M2-TS、构建、dist API、静态审计和冻结标杆 M1- `244/244` 保护。仍不能宣称：023/024 完成、生产核心完全去 jree、完整 M1/#245 长周期在本批重跑、Java/TypeScript 性能等价或代码覆盖率目标完成。代码提交为 `eab9a56`；报告与状态更新待本批检查后另行提交。

### 2026-09-18：事件 payload 边界原生化

本批承接 `8c043d2`，对照 canonical Java `EventEmitter.emit(Object...)`、观察者 `event(Object[])` 和 `Events` 的位置化参数消费，确认事件 payload 只要求按顺序传递对象值，不要求每个值继承 `JavaObject`、参与 Java equals/hashCode 或序列化。因而将事件桥接边界命名为 `EventEmitter.EventPayload = unknown[]`，不把它误扩展为领域对象或集合语义迁移。

- `src/io/events/EventEmitter.ts`、`Events.ts`、`EventHandler.ts`、`AnswerHandler.ts`、`TextOutputHandler.ts`：观察者和 emit 签名改为 `EventPayload`，保留事件 token、注册、FIFO pending operation、参数位置和既有格式化兼容边界。
- `Nar`、`Memory`、`NarNode`、`DerivationContext`、`ProcessQuestion`、`LocalRules`、`Concept`、`NullOperator` 及 mental plugin 事件调用方：删除仅用于事件转发的伪 `JavaObject` 转换；`TruthFunctions` 所需的 Java value 转换不在本批删除。
- `test/node/event-emitter.test.ts` 新增原生 payload 顺序回归，测试观察者签名同步收窄；局部事件专项 `8/8`。
- M2-TS：非增量 `tsc=0`；串行单测 `305` 项，`303` 通过、`0` 失败、`2` 跳过；build 源文件 `136` 个；dist API 通过。
- 两个受影响 TS-only 冻结标杆 smoke（`nal4.7.nal`、`nal8.add.nal`）为 `2/2`；证据文件 `event-payload-smoke-20260918.jsonl`，SHA-256 `530A4453E0DDAAD288B6059396DE9A5769384956B68CF6E6F04D2AF903357E38`。使用冻结 Java baseline SHA-256 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`，未重复启动 Java。
- `classify-change-gate --base 8c043d2 --head 5134dd6`：`T1`、`live_java_required=false`、`m1_minus_required=true`。
- M1- 按单线程、cold、逐文件串行、`--cycles 1550`、`--timeout-ms 180000`、`--process-limit-ms 1800000`、显式冻结 Java 标杆运行；主资源 `244/244`，分层 `single_step=215`、`multi_step=24`、`application=5`。0 exception、0 marker missing、0 timeout、0 stall/no-progress、0 process limit、0 not-run、0 Java/TS diff、0 performance warning。
- M1- 证据文件 `event-payload-m1-minus-20260918.jsonl`，SHA-256 `F6069395A54842D118E7D4801519D3099B82AEA87C566AEB3E8509DFFA6D52DE`；TS 总时长 `1,807,198 ms`，最长单文件 `378,311 ms`，最大 RSS `1,054,670,848 bytes`，reasoning cycles `2,288,254`。相对上一批 M1- 的 `1,875,218 ms`，本批观测时长减少 `68,020 ms`（约 `3.63%`）；RSS 增加 `95,129,312 bytes`（约 `9.92%`）。这是同口径观测，不宣称事件 payload 原生化已经完成性能优化。
- 本批静态审计：jree `sourceFiles=137`、直接导入文件 `88`、`javaObjectFiles=13`、`javaUtilFiles=39`、`javaLangFiles=85`、`javaStringFiles=52`、`semanticReviewItems=93`；迁移模式扫描 `237` 个文件；平台扫描 `180` 个文件、核心候选 `83`、混合边界 `5`、Node 适配候选 `2`。编码检查无异常，`git diff --check` 待提交前复核。

本批可以宣称：事件 payload 原生边界已通过 M2、非增量编译、构建/API、受影响 smoke 和 T1 要求的 TS-only M1- `244/244`；代码提交为 `5134dd6`。仍不能宣称：023/024 完成、生产核心完全去 jree、完整 M1/#245 在本批重跑、Java/TypeScript 全面等价、性能等价或代码覆盖率目标完成。覆盖率专项仍只登记为后续工作：应先建立全仓基线和缺口，再设计能命中缺口的 NAL/局部测试，并与 Java/TS 对照及矩阵回归联动。

### 2026-09-18：`TaskLink.Recording` 普通记录数据壳原生化

本批承接 `2aec759`，继续按 023 的 Java 合同推进单一嵌套类切片。对照 canonical Java `TaskLink.java` 确认 `Recording` 是 `public static final class Recording implements Serializable`，只保存 `TermLink` 与时间并提供读写方法；没有自定义 `equals/hashCode`、`.class`、`getClass()` 或身份 key 消费。Java `Serializable` 在此是 marker interface，当前 jree 的 TypeScript 类型却额外要求 `getClass()`；按照项目中 `Parameters`/`Narsese` 的既有边界处理，本批不为了满足 jree 类型壳重新引入 `JavaObject`。

- `src/entity/TaskLink.ts`：删除 `Recording` 的 `JavaObject` 继承和空 `super()`；保留 `link`、时间读写与原 Java marker 来源说明。外层 `TaskLink extends Item`、任务链接的值相等与 novelty 逻辑未改动。
- `test/node/tasklink-recording.test.ts`：新增原型链、link 身份、时间读取和修改回归；首次断言层级错误已在提交前修正。
- M2：`npm run test:unit:serial` 为 `306` 项，`304` 通过、`0` 失败、`2` 跳过；`npm run typecheck` 使用显式 `--incremental false` 为 `0` 诊断；`npm run test:build` 与 `npm run test:api:dist` 通过，build `sourceFileCount=136`。
- gate：`classify-change-gate --base 2aec759 --head f8a7b4d` 判定 `T1`，`live_java_required=false`、`m1_minus_required=true`，原因是 `TaskLink.ts` 热路径和语义 token 变化。
- M1- 原始 TS-only 矩阵为 `243/244` functional/parity；唯一异常是 `single_step/nal2.15.nal` 的 TS 子进程退出码 `3221225477`（Windows `EXCEPTION_ACCESS_VIOLATION`），没有 Java/TS marker 分叉证据。原始证据位于项目外 `tasklink-recording-m1-minus-20260918.jsonl`，SHA-256 `897A94F39AC642529B73327CCBEE2957AB2F80E5613851B6EDDA97CCEB22D48D`；`244` 行中 `243` 通过、`1` 异常，TS 总时长 `1,803,463 ms`，最长单行 `374,140 ms`，最大 RSS `1,107,599,360 bytes`，reasoning cycles `2,288,254`。
- 按本机环境异常处理规则，使用相同参数独立重跑 `nal2.15.nal`，结果 `1/1` functional/parity、无异常；重试证据 `tasklink-recording-nal2-15-retry-20260918.jsonl`，SHA-256 `5B76A6DE02FEE28F6E29F863FB96D7AA6C30C859C307998AAF83E1487F810898`，耗时 `1,856 ms`、`1,551` reasoning cycles。故本批经环境重试的 M1- 功能保护结论为 `244/244`，但不改写原始 `243/244` 记录。
- 两份矩阵证据均复用三轮一致的冻结 Java baseline SHA-256 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`；canonical Java source commit `8675b76fe8c21ee20a7b8c1b63408fb05327210d`，artifact SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`，未重复启动 Java。
- jree 审计（本批代码提交后）：生产直接导入文件 `88`，`JavaObject` 文件 `12`，`java.util` 文件 `39`，`newLinkedHashMap=0`，`newLinkedHashSet=1`。覆盖率专项仍未实现：当前约有 `137` 个生产 TS 源文件、`306` 个统一 TS-only 测试声明和 `16` 个历史 `test/core` 文件，但 package 尚无 `c8`/`nyc`/Istanbul 覆盖率依赖或脚本；NAL 通过数不作为源码覆盖率替代指标。

本批可以宣称：`TaskLink.Recording` 的无行为 JavaObject 壳已按 canonical Java 合同原生化，并通过直接回归、M2、构建/API、T1 要求的 M1- 及单项环境异常重试。仍不能宣称：023/024 完成、生产核心完全去 jree、#245 长期稳定性完成、Java/TypeScript 性能等价、源码覆盖率目标完成或正式发布。代码提交 `f8a7b4d`；报告与状态文档提交待本批最终检查后推送。

### 2026-09-18：`Nar.PluginState` 插件状态壳原生化

本批承接 `aff8cb1`，继续按 023 的 canonical Java 合同推进单一内部状态类切片。对照 `java-master/src/main/java/org/opennars/main/Nar.java` 确认 `PluginState` 是非静态内部类，仅保存 `Plugin` 和 `enabled`，通过 `Nar.this` 调用插件生命周期和事件；Java `Serializable` 只是 marker，没有自定义 `equals/hashCode`、`.class` 或 `getClass()` 消费。TS 闭包 `$outer` 保留了这个外层绑定，插件列表仍用对象身份定位删除。

- `src/main/Nar.ts`：删除 `PluginState` 的 jree `JavaObject` 继承、marker 类型壳和空 `super()`；保留构造重载、默认启用、`setEnabled`、`isEnabled`、插件回调、外层 Nar 事件发射和列表身份行为。
- `test/node/config-platform-boundary.test.ts`：新增原型链、初始 enabled、回调顺序和禁用行为回归；专项文件最终 `16/16`。
- M2：非增量 `tsc=0`；串行单元测试 `307` 项，`305` 通过、`0` 失败、`2` 跳过；build `sourceFileCount=136`、dist API 通过。
- `classify-change-gate --base aff8cb1 --head 1f0879d` 判定 `T1`，`live_java_required=false`、`m1_minus_required=true`，原因是 `Nar.ts` 热路径。
- M1- 使用单线程、cold、逐文件串行、`--cycles 1550`、`--timeout-ms 180000`、`--process-limit-ms 1800000`、TS-only 和冻结 Java 标杆；主资源 `244/244` functional/parity，`0` exception、`0` marker missing、`0` timeout、`0` stall、`0` process limit、`0` not-run、`0` performance warning。分层为 `single_step=215`、`multi_step=24`、`application=5`。
- M1- 证据位于项目外 `H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\nar-plugin-state-m1-minus-20260918.jsonl`，SHA-256 `3E2D091B8003BAC53BED8689AE62E2C07811661A6DE40B260192B4FE4D7B3158`；TS 总时长 `1,694,667 ms`，最长单文件 `365,033 ms`，最大 RSS `947,920,896 bytes`，reasoning cycles `2,288,254`。
- 相对上一批 `Concept.AnticipationEntry` 的 `1,693,705 ms`，本批总时长增加 `962 ms`（约 `0.06%`），RSS 增加 `145,510,400 bytes`（约 `18.13%`）；这是资源观测，不宣称本批完成性能优化。
- 继续复用三轮一致的冻结 Java baseline SHA-256 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`；canonical Java source commit `8675b76fe8c21ee20a7b8c1b63408fb05327210d`，artifact SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`，本批未重复启动 Java。
- 代码提交 `1f0879d`；本批 jree 审计：`sourceFiles=137`、直接导入文件 `88`、`javaObjectFiles=10`、`javaUtilFiles=39`、`javaLangFiles=85`、`javaStringFiles=52`、`semanticReviewItems=93`、`candidateNativeItems=2`、`newLinkedHashMap=0`、`newLinkedHashSet=1`。覆盖率专项仍未实现，NAL 通过数不替代源码覆盖率。

本批可以宣称：`Nar.PluginState` 的无行为 jree `JavaObject` 外壳已按 canonical Java 合同原生化，并通过生命周期回归、M2、构建/API、T1 要求的 TS-only M1- `244/244`。仍不能宣称：023/024 完成、生产核心完全去 jree、#245 长期稳定性完成、Java/TypeScript 性能等价或源码覆盖率目标完成。总体目标完成后才汇总覆盖率与 Java/TypeScript 一致性资料并发送给计划任务 `01a026ef-8f70-7670-95dd-2dd82746b5f8`。

### 2026-09-18：`Concept.AnticipationEntry` 普通预期记录壳原生化

本批承接 `8c8e124`，继续按 023 的 canonical Java 合同推进单一嵌套数据壳切片。对照 `java-master/src/main/java/org/opennars/entity/Concept.java` 确认 `AnticipationEntry` 只有四个字段和构造器，Java 声明为 `implements Serializable`，没有自定义 `equals/hashCode`、`.class`、`getClass()` 或身份 key 消费。早期 `dda82d0` 已将外层 `List<AnticipationEntry>` 按有序遍历、追加、身份删除和过滤语义改为原生数组；本批不改变这部分算法。

- `src/entity/Concept.ts`：删除 `AnticipationEntry` 的 jree `JavaObject` 继承、marker 类型壳和空 `super()`；保留字段、`Float32Math.from` 写入、long 字段和构造参数。
- `test/node/anticipate.test.ts`：增加嵌套记录原型链回归，保留原生数组存储与对象身份断言。
- M2：专项 `anticipate.test.ts` 为 `7/7`；非增量 `tsc=0`；串行单元测试 `306` 项，`304` 通过、`0` 失败、`2` 跳过；build `sourceFileCount=136`、dist API 通过。
- `classify-change-gate --base 8c8e124 --head 174508a` 判定 `T1`，`live_java_required=false`、`m1_minus_required=true`，原因是 `Concept.ts` 热路径。
- M1- 使用单线程、cold、逐文件串行、`--cycles 1550`、`--timeout-ms 180000`、`--process-limit-ms 1800000`、TS-only 和冻结 Java 标杆；主资源 `244/244` functional/parity，`0` exception、`0` marker missing、`0` timeout、`0` stall、`0` process limit、`0` not-run、`0` performance warning。分层为 `single_step=215`、`multi_step=24`、`application=5`。
- M1- 证据位于项目外 `H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\concept-anticipation-entry-m1-minus-20260918.jsonl`，SHA-256 `8C85D223258C06F8A44DC30E620DC23856E4BAA5CAABC85D1311DB30CFD98B9A`；TS 总时长 `1,693,705 ms`，最长单文件 `358,440 ms`，最大 RSS `802,410,496 bytes`，reasoning cycles `2,288,254`。
- 继续复用三轮一致的冻结 Java baseline SHA-256 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`；canonical Java source commit `8675b76fe8c21ee20a7b8c1b63408fb05327210d`，artifact SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`，本批未重复启动 Java。
- 代码提交 `174508a`；本批 jree 审计：`sourceFiles=137`、直接导入文件 `88`、`javaObjectFiles=11`、`javaUtilFiles=39`、`javaLangFiles=85`、`javaStringFiles=52`、`semanticReviewItems=93`、`candidateNativeItems=2`、`newLinkedHashMap=0`、`newLinkedHashSet=1`。覆盖率专项仍未实现，NAL 通过数不替代源码覆盖率。

本批可以宣称：`Concept.AnticipationEntry` 的无行为 jree `JavaObject` 外壳已按 canonical Java 合同原生化，并通过直接回归、M2、构建/API、T1 要求的 TS-only M1- `244/244`。仍不能宣称：023/024 完成、生产核心完全去 jree、#245 长期稳定性完成、Java/TypeScript 性能等价或源码覆盖率目标完成。总体目标完成后才汇总覆盖率与 Java/TypeScript 一致性资料并发送给计划任务 `01a026ef-8f70-7670-95dd-2dd82746b5f8`。

### 2026-09-19：`Stamp.BaseEntry` 证据条目值对象原生化

本批承接 `b355f19`，对照 canonical Java `Stamp.BaseEntry` 确认它虽然声明 `Comparable<BaseEntry>, Serializable`，但实际可观察合同是两个 long 字段、访问器、按字段值的 `equals`、Java 31 倍 `hashCode`、先 `narId` 后 `inputId` 的自然排序和固定文本格式。jree `Comparable<T>` 额外继承 `IReflection/getClass()`，不属于该值对象的业务语义；本批移除运行时接口壳，不移除值语义。

- `src/entity/Stamp.ts`：删除 `BaseEntry` 的 jree `JavaObject`/`Comparable`/`Serializable` 壳和空构造调用；保留字段、访问器、值相等、哈希、比较和文本行为。Java `Arrays.sort(set)` 改为原生数组排序并显式调用同一 `compareTo`，因此保留 Java 的排序顺序。
- `test/node/stamp-evidence.test.ts`：增加原型链、`compareTo`、`toString` 和等值哈希一致性回归；原有 `Stamp` evidential-base、重复值和 `ProcessGoal` 路径继续覆盖。
- M2：定向 `stamp-evidence.test.ts` 为 `3/3`；串行单元测试 `307` 项，`305` 通过、`2` 跳过、`0` 失败；非增量 `tsc=0`；build `sourceFileCount=136`、dist API 通过。
- `classify-change-gate --base b355f19 --head 58d6aad` 判定 `T1`，`live_java_required=false`；因 `Stamp.ts` 为高风险路径且包含语义 token 变化，仍执行 M1- 保护。
- M1- 使用单线程、cold、逐文件串行、`--engine ts --java-baseline`、`--cycles 1550`、`--timeout-ms 180000`、`--process-limit-ms 1800000`、`--resource-metrics`、`--chunk-size 1`，排除长期稳定性 `#245`；主资源 `244/244` functional/parity，分层为 `single_step=215`、`multi_step=24`、`application=5`。`exception=0`、`marker_missing=0`、`timeout=0`、`stall=0`、`process_limit=0`、`not_run=0`、`Java/TS diff=0`、`performance_warning=0`。`243` 行走 marker 等价路线；`nal6.redundant.nal` 无 marker，短运行观察 `1,650` 周期并标记 `not_reached`，但功能和 parity 通过。
- M1- 证据位于项目外 `H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\stamp-base-entry-m1-minus-20260918.jsonl`，SHA-256 `75656D12A053E384C20634D866D854CBA175C9F95AD84DCED74BC84A149363A6`；TS 总时长 `1,754,433 ms`，平均 `7,190.30 ms/文件`，最大单文件 `387,154 ms`，最大 RSS `902,828,032 bytes`，平均 RSS `267,809,506.62 bytes`，reasoning cycles `2,288,254`。
- 继续复用三轮一致的冻结 Java baseline `g0-java-baseline-26772af-20260917`，其 SHA-256 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`；canonical Java source commit `8675b76fe8c21ee20a7b8c1b63408fb05327210d`，artifact SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`；本批 `java_artifact=null`，未重复启动 Java。
- 本批提交：代码 `58d6aad`；报告与状态更新待最终检查后提交。jree 审计为 `sourceFiles=137`、直接导入文件 `88`、`JavaObject` 文件 `10`、`java.util` `39`、`java.lang` `85`、Java String `52`、`semanticReviewItems=93`、`candidateNativeItems=2`、`newLinkedHashMap=0`、`newLinkedHashSet=1`。迁移扫描 `238` 个文件，malformed/constructor-delegation 均为 `0`；平台扫描 `180` 个文件，核心候选 `83`、混合边界 `5`、Node adapter 候选 `2`。

本批可以宣称：`Stamp.BaseEntry` 的无行为 jree 壳已按 Java 值对象合同原生化，并通过直接回归、M2、构建/API、T1 要求的 TS-only M1- `244/244`；未观察到功能回退。仍不能宣称：023/024 完成、生产核心完全去 jree、#245 长期稳定性完成、Java/TypeScript 性能等价或源码覆盖率目标完成。总体目标完成后才汇总覆盖率与 Java/TypeScript 一致性资料并发送给计划任务 `01a026ef-8f70-7670-95dd-2dd82746b5f8`。

### 2026-09-19：`EventHandler` 事件处理器继承边界原生化

本批承接 `bb07a48`，对照 canonical Java `EventHandler.java` 确认其原始声明为 `abstract class EventHandler implements EventEmitter.EventObserver`，没有专用父类；但 TypeScript 派生类实际使用了 `OutputHandler.class` 和 `getClass()`，所以不能简单落到 `Object.prototype`。本批将 jree `JavaObject` 壳收窄为项目自有 `RuntimeObject`，只保留已观测的类身份能力。

- `src/io/events/EventHandler.ts`：删除 jree `JavaObject`，改为 `RuntimeObject`；保留构造重载、source、active 状态、事件列表和注册/注销行为。
- `src/io/events/TextOutputHandler.ts`：Java `Serializable` 在此仅是 marker；移除会重新要求 jree `getClass()` 的 TypeScript 接口实现，保留 Java 来源注释和输出行为。
- `test/node/event-emitter.test.ts`：新增继承边界回归，确认 `EventHandler` 的原型直接落在项目 `RuntimeObject`，不再落到 jree `JavaObject`。
- M2：串行单测 `308` 项，`306` 通过、`2` 跳过、`0` 失败；显式非增量 `tsc=0`；build `sourceFileCount=136`、build 检查、dist API 和 canonical Java 局部 parity 均通过；编码检查无异常，`git diff --check` 无差异错误。
- canonical Java source commit 为 `8675b76fe8c21ee20a7b8c1b63408fb05327210d`，JAR SHA-256 为 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`；冻结 Java 标杆 SHA-256 为 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`。本批未启动 Java，也未重复 M1-，因为没有修改 Java 基线、推理算法、事件顺序或容器语义。
- jree 审计前→后：`javaObjectFiles=10→9`；直接导入文件 `88→88`；`java.util=39`、`java.lang=85`、`javaString=52`、`newLinkedHashMap=0`、`newLinkedHashSet=1`、`semanticReviewItems=93`、`candidateNativeItems=2` 保持不变。

本批可以宣称：EventHandler 的 jree JavaObject 壳已按 Java 继承合同收窄为项目 RuntimeObject，并通过 M2 和局部 parity。仍不能宣称：023/024 完成、生产核心完全去 jree、#245 长期稳定性完成、Java/TypeScript 性能等价或源码覆盖率目标完成。报告为 `reports/20260919-003336.md`；提交与推送待最终收尾。

### 2026-09-19：`TruthFunctions.lookupTruthOrNull` varargs 边界原生化

本批承接 `af88531`，对照 canonical Java `TruthFunctions.lookupTruthOrNull(TruthValue, TruthValue, Parameters, Object...)` 确认其 varargs 在实际实现中只按成对位置读取 boolean 条件和 `EnumType` 选择器：首个 true 立即计算并返回，全部 false 返回 null。原 TypeScript 用 `JavaObject` cast 包装布尔值，只是 jree 类型适配，并非业务对象身份。

- `src/inference/TruthFunctions.ts`：将 `...values` 从 jree `java.lang.Object[]` 改为 `unknown[]`；保留 Java 的成对扫描、首个 true 优先、TruthFunction 选择和 nullable 返回。
- `src/inference/CompositionalRules.ts`：删除 `JavaObject` 导入与 `asJavaObject` 辅助函数，8 个条件直接以原生 boolean 传入。
- `test/node/compositional-rules.test.ts`：新增 raw boolean varargs、首个 true 选择及全 false 返回 null 回归。
- `classify-change-gate --base af88531 --head 3ea4b75 --scope responsibility`：T1，`live_java_required=false`，`m1_minus_required=true`；原因是 inference 热路径和责任收口。
- M2：定向 compositional rules `5/5`；串行单测 `309` 项，`307` 通过、`2` 跳过、`0` 失败；显式非增量 `tsc=0`；build `sourceFileCount=136`、build 检查、dist API 和 canonical Java 局部 parity 均通过。
- M1-：TS-only、单线程、cold、逐文件串行、冻结 Java JSONL、`--cycles 1550`、`--timeout-ms 180000`、`--process-limit-ms 1800000`、`--resource-metrics`；结果 `244/244` functional pass，分层 `single_step=215`、`multi_step=24`、`application=5`。exception、marker missing、timeout、stall、process limit、Java/TS diff、performance warning 均为 `0`；243 行走 marker 路线。
- 唯一 markerless `nal6.redundant.nal` 观察到 `1,650/131,072` 周期，状态为 `not_reached`；它的功能和 marker/parity 行为通过，但不能计作长周期等价。#245 `stability/long_term_stability.nal` 未纳入本批证据。
- M1- 证据位于项目外 `H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\truthfunctions-varargs-m1-minus-20260919.jsonl`，SHA-256 `E7A15B19445C8A2AB9E0381EE822E6E8FAACDA0E002908F3DCDE2353E0005249`；TS 总时长 `1,706,180 ms`，最长单文件 `352,009 ms`，最大 RSS `955,789,312 bytes`，reasoning cycles `2,288,254`。
- canonical Java source commit `8675b76fe8c21ee20a7b8c1b63408fb05327210d`、JAR SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`、冻结 Java baseline SHA-256 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954` 均未变化；本批未启动 Java。
- jree 审计前→后：`javaObjectFiles=9→8`；直接导入文件 `88→88`；`java.util=39`、`java.lang=85`、`javaString=52`、`newLinkedHashMap=0`、`newLinkedHashSet=1`、`semanticReviewItems=93`、`candidateNativeItems=2` 保持不变。

本批可以宣称：`lookupTruthOrNull` 的 jree `JavaObject` 类型壳已移除，M2 和 244 个普通主资源的功能保护通过。仍不能宣称：`nal6.redundant.nal` 的 131072 周期长测完成、#245 长期稳定性完成、023/024 完成、生产核心完全去 jree、Java/TypeScript 性能等价或源码覆盖率目标完成。报告为 `reports/20260919-004703.md`；代码提交 `3ea4b75` 待与报告、状态更新一起推送。

### 2026-09-19：`NarNode` 类身份运行时边界原生化

本批承接 `1ab7d01`，对照 canonical Java `NarNode.java` 确认 `NarNode` 原始声明为 `implements EventObserver`，内部 `EventReceivedTask` 也是普通类；Java 没有需要由 jree `JavaObject` 提供的 hash、monitor 或序列化行为。TS 原先继承 `JavaObject` 的实际用途只有 `.class` 类身份令牌，因此改用项目 `RuntimeObject` 的窄合同。

- `src/main/NarNode.ts`：移除 `JavaObject` 导入和继承；`EventReceivedTask` 同样改为 `RuntimeObject`。网络收发、事件派发、目标列表顺序、线程和序列化路径均未改动，并在源码中标注原 Java 声明及替换理由。
- `test/node/narnode-targets.test.ts`：增加 `NarNode.class.getName()` 和 token 自等回归；专项测试 `3/3` 通过。
- M2：`npm run test:unit:serial` 为 `310` 项，`308` 通过、`2` 跳过、`0` 失败；`npm run typecheck` 使用显式 `--incremental false` 为 `0` 诊断；`npm run test:build`、`npm run test:api:dist` 与 `npm run test:parity:local` 均通过。
- gate：`classify-change-gate --base 1ab7d01 --head b55d594 --scope responsibility` 判定 `T1`，`live_java_required=false`、`m1_minus_required=true`；原因包括 `src/main/NarNode.ts` 高风险路径、semantic token 和 completed responsibility。
- M1-：TS-only、单线程、cold、逐文件串行，使用冻结 Java baseline、`--cycles 1550`、`--timeout-ms 180000`、`--process-limit-ms 1800000`、`--all --start 0 --limit 244`，明确排除 #245。结果 `244/244` functional pass、`244/244` parity；`exception=0`、`marker_missing=0`、`timeout=0`、`stall=0`、`process_limit=0`、`not_run=0`、`Java/TS diff=0`、`performance_warning=0`。分层为 `single_step=215`、`multi_step=24`、`application=5`；243 行走 marker 等价路线，`nal6.redundant.nal` 无 marker，状态为 `not_reached`。
- M1- 证据位于项目外 `H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\narnode-m1-minus-20260919.jsonl`，SHA-256 `1E9771B212A794E0C25ED64A44E2CBC8B4EDD295B40739109018D77CC1419F6B`；TS 总时长 `1,684,905 ms`，最长单文件 `358,823 ms`，最大 RSS `1,070,170,112 bytes`，reasoning cycles `2,288,254`。
- 本批复用三轮一致的冻结 Java baseline SHA-256 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`；canonical Java source commit `8675b76fe8c21ee20a7b8c1b63408fb05327210d`、JAR SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5` 均未变化，未重复启动 Java。
- jree 审计前→后：`javaObjectFiles=8→7`；直接导入文件 `88→88`；`java.util=39`、`java.lang=85`、`javaString=52`、`newLinkedHashMap=0`、`newLinkedHashSet=1`、`semanticReviewItems=93`、`candidateNativeItems=2` 保持不变。直接导入数未下降，是因为 NarNode 仍需 jree 的网络、IO、异常和字符串兼容边界。

本批可以宣称：`NarNode` 与 `EventReceivedTask` 的无行为 `JavaObject` 壳已按 canonical Java 合同收窄为项目 `RuntimeObject`，并通过直接回归、M2、构建/API、局部 parity 和 T1 要求的 TS-only M1- `244/244`。仍不能宣称：023/024 完成、生产核心完全去 jree、`nal6.redundant.nal` 的 131072 周期长测完成、#245 长期稳定性完成、Java/TypeScript 性能等价或源码覆盖率目标完成。代码提交为 `b55d594`；报告为 `reports/20260919-020533.md`。

### 2026-09-19：`Stamp` 类身份与 marker 边界原生化

本批承接 `40979a6`，对照 canonical Java `Stamp.java` 确认其原始声明为 `public class Stamp implements Cloneable, Serializable`。两个接口在当前业务中只是 marker；Stamp 的实际合同是 evidential base、时间字段、clone、equals/hashCode、排序和文本表示。因此只收窄转写器添加的 jree Object 壳，不改证据算法。

- `src/entity/Stamp.ts`：移除 jree `JavaObject`，改为项目 `RuntimeObject`；移除仅用于类型适配的 jree `Cloneable/Serializable` marker；保留构造、证据、时间、clone、equals/hashCode 和排序逻辑。为满足 RuntimeObject 的原生字符串合同，`toString()` 返回原生 `string`。
- `test/node/stamp-evidence.test.ts`：新增 `Stamp.class`、实例 `getClass()`、clone 类型和实例关系回归；专项 `4/4` 通过。
- M2：`npm run test:unit:serial` 为 `311` 项，`309` 通过、`2` 跳过、`0` 失败；显式非增量 `tsc=0`；build、dist API、canonical Java 局部 parity 均通过。
- gate：`classify-change-gate --base 40979a6 --head 842d4e4 --scope responsibility` 判定 `T1`，`live_java_required=false`、`m1_minus_required=true`；原因包括 `Stamp.ts` 高风险路径、semantic token 和 completed responsibility。
- M1-：TS-only、单线程、cold、逐文件串行，使用冻结 Java baseline、`--cycles 1550`、`--timeout-ms 180000`、`--process-limit-ms 1800000`、`--all --start 0 --limit 244`，明确排除 #245。结果 `244/244` functional pass、`244/244` parity；`exception=0`、`marker_missing=0`、`timeout=0`、`stall=0`、`process_limit=0`、`not_run=0`、`Java/TS diff=0`、`performance_warning=0`。分层为 `single_step=215`、`multi_step=24`、`application=5`；243 行走 marker 等价路线，`nal6.redundant.nal` 无 marker，状态为 `not_reached`。
- M1- 证据位于项目外 `H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\stamp-m1-minus-20260919.jsonl`，SHA-256 `C60D323412F49998F1CAF8EBDB06F23CC3D7937A5896923FC60A67E00884BE93`；TS 总时长 `1,643,515 ms`，最长单文件 `344,306 ms`，最大 RSS `1,035,661,312 bytes`，reasoning cycles `2,288,254`。
- 本批复用三轮一致的冻结 Java baseline SHA-256 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`；canonical Java source commit `8675b76fe8c21ee20a7b8c1b63408fb05327210d`、JAR SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5` 均未变化，未重复启动 Java。
- jree 审计前→后：`javaObjectFiles=7→6`；直接导入文件 `88→88`；`java.util=39`、`java.lang=85`、`javaString=52`、`newLinkedHashMap=0`、`newLinkedHashSet=1`、`semanticReviewItems=93`、`candidateNativeItems=2` 保持不变。直接导入数未下降，是因为 Stamp 仍需 jree 的异常、字符串和 Java 时间边界能力。

本批可以宣称：`Stamp` 的无行为 jree `JavaObject`/marker 壳已按 canonical Java 合同收窄为项目 `RuntimeObject`，并通过直接回归、M2、构建/API、局部 parity 和 T1 要求的 TS-only M1- `244/244`。仍不能宣称：023/024 完成、生产核心完全去 jree、`nal6.redundant.nal` 的 131072 周期等价、#245 长期稳定性完成、Java/TypeScript 性能等价或源码覆盖率目标完成。代码提交为 `842d4e4`；报告为 `reports/20260919-024737.md`。

### 2026-09-19：`Item` 值对象基类运行时壳原生化

本批承接 `7aa07eb`，对照 canonical Java `Item.java` 做前向审查。Java 原始声明是 `abstract class Item<K> implements Serializable`；`Item` 自身已经实现预算访问、文本表示、按名称的 `equals/hashCode` 和合并行为，当前调用图没有发现 `Item.getClass()`、`Item.class` 或序列化运行时消费。因此只移除转写器添加的 jree `JavaObject`/Serializable 类型壳，改用项目 `RuntimeObject` 承接可观察的类身份。

- `src/entity/Item.ts`：删除 jree `JavaObject` 继承和仅作 marker 的 `java.io.Serializable`，改为 `RuntimeObject`；保留 budget、`toString*`、名称值相等、哈希和优先级比较。
- `src/entity/Concept.ts`、`Task.ts`、`TaskLink.ts`、`TermLink.ts`：将同一 Item 值相等边界的参数从 jree `java.lang.Object` 收窄为 `unknown`，由 `instanceof` 保持 Java 类型判断；`TermLink` 的哈希快速路径只在同类对象收窄后执行。没有改动 Bag 调度算法或领域 Map/Set。
- `test/node/core-runtime.test.ts`：新增 Item 原型链落在 `RuntimeObject`、派生类 token、值相等和等值哈希回归；既有 Item 文本、Bag、TaskLink 回归继续通过。
- M2-TS：局部 core-runtime/Item/Bag/TaskLink 测试 `54/54`；统一串行单测 `312` 项，`310` 通过、`2` 按 TS-only 规则跳过、`0` 失败；显式非增量 `tsc=0`；build `sourceFileCount=136`、dist API 通过。
- 两个 TS-only 受影响 smoke（`toothbrush.nal`、`nal8.add.nal`）均 functional/parity `1/1`，无 exception、marker missing、stall 或 process limit；证据位于项目外 `H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\s2-item-shell-smoke-20260919.jsonl`，SHA-256 `F02D236B7175B6801256BE77CD5A933D8DC75AF59B79C8B7CFCFFE079E8788F8`。
- 继续复用冻结 Java baseline SHA-256 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`；canonical Java source commit `8675b76fe8c21ee20a7b8c1b63408fb05327210d`、JAR SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`，本批未启动 Java。
- jree 审计前→后：`javaObjectFiles=6→5`；直接导入文件 `88→88`；`java.util=39`、`java.lang=85`、Java String `52`、`newLinkedHashMap=0`、`newLinkedHashSet=1`、`semanticReviewItems=93`、`candidateNativeItems=2`。迁移扫描 `238` 个文件，malformed/constructor-delegation 为 `0`；平台扫描 `180` 个文件，核心候选 `83`、混合边界 `5`、Node adapter 候选 `2`。

`classify-change-gate --base 7aa07eb --head e4aef1e` 判定 `T1`，`live_java_required=false`、`m1_minus_required=true`；因此本批按 gate 执行了 TS-only、单线程、cold、逐文件串行 M1-，复用冻结 Java JSONL，未重复启动 Java。
- M1- 命令参数为 `--all --limit 244 --cycles 1550 --timeout-ms 180000 --process-limit-ms 1800000 --ts-mode cold --resource-metrics --chunk-size 1`；结果 `244/244` functional pass、`244/244` parity，分层为 `single_step=215`、`multi_step=24`、`application=5`。`exception=0`、`marker_missing=0`、`timeout=0`、`stall=0`、`process_limit=0`、`not_run=0`、`Java/TS diff=0`、`performance_warning=0`；243 行走 marker 等价路线，`nal6.redundant.nal` 无 marker，短运行状态为 `not_reached`，不构成长周期结论。
- M1- 证据位于项目外 `H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\item-m1-minus-20260919.jsonl`，SHA-256 `E179C5D5F840466DCE8856C352AE1DF7F65BC08890F353FCDD597BF4A92B6EEF`；TS 总时长 `1,651,339 ms`，最大单文件 `349,740 ms`，最大 RSS `1,086,853,120 bytes`，reasoning cycles `2,288,254`。
- 本批最终可以宣称：`Item` 的无行为 jree 外层壳已按 Java 值对象合同收窄为项目 RuntimeObject，M2-TS、两项受影响 smoke 和 T1 要求的 M1- `244/244` 均通过，未观察到功能回退。仍不能宣称：023/024 完成、生产核心完全去 jree、#245 长期稳定性完成、Java/TypeScript 性能等价、源码覆盖率目标完成或正式发布。

### 2026-09-19：`Sentence` 运行时身份边界原生化

本批承接 `9de82c0`，对照 canonical Java `Sentence.java` 做前向审查。Java 原始声明是 `public class Sentence implements Cloneable, Serializable`；`Sentence` 自身实现构造、变量规范化、投影、值相等、哈希和 clone。调用图未发现 `Sentence.class`、实例 `getClass()` 或序列化运行时消费，因此只移除转写器添加的 jree `JavaObject`/marker 类型壳，改用项目 `RuntimeObject` 承接类身份。

- `src/entity/Sentence.ts`：删除 jree `JavaObject` import 和继承，改为 `RuntimeObject`；删除仅作类型 marker 的 `Cloneable`/`Serializable`；保留构造、规范化、投影、Java 字符/异常边界、`equals/hashCode/clone` 和领域状态。
- `test/node/core-runtime.test.ts`：新增 `Sentence.class`、实例 `getClass()`、clone 值相等和哈希一致性回归。
- M2-TS：定向 Sentence/core-runtime 等回归 `48/48`；统一串行单测 `312` 项，`310` 通过、`2` 按 TS-only 规则跳过、`0` 失败；显式非增量 `tsc=0`；build `sourceFileCount=136`、dist API 通过。
- `classify-change-gate --base 9de82c0 --head 6e2ee4b` 判定 `T1`，`live_java_required=false`、`m1_minus_required=false`；本批按最低 T1 门运行两个受影响 NAL，没有扩大到 244 项 M1-。
- TS-only smoke 使用冻结 Java baseline、单线程、cold、逐文件串行和 `--cycles 1550`：`application/toothbrush.nal` 与 `single_step/nal8.add.nal` 均 `functional/parity=1/1`；`exception=0`、`marker_missing=0`、`stall=0`、`process_limit=0`。证据位于项目外 `H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\sentence-shell-smoke-20260919.jsonl`，SHA-256 `809121B6E61E50EB5805947E93FFAB39931A04643046BE1A371F3DB0445ADF4E`。
- 继续复用冻结 Java baseline SHA-256 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`；canonical Java source commit `8675b76fe8c21ee20a7b8c1b63408fb05327210d`、JAR SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`，本批未启动 Java。
- jree 审计前→后：`javaObjectFiles=5→4`；当前 summary 为 `sourceFiles=137`、直接导入文件 `88`、`java.util=39`、`java.lang=85`、Java String `52`、`newLinkedHashMap=0`、`newLinkedHashSet=1`、`semanticReviewItems=93`、`candidateNativeItems=2`。平台审计扫描 `180` 个文件，`coreCandidateFiles=83`、`mixedBoundaryFiles=5`、`nodeAdapterCandidateFiles=2`、`jreeImportFiles=95`、`browserShimFiles=2`。

本批可以宣称：`Sentence` 的无行为 jree 外层壳已按 Java 类身份合同收窄为项目 `RuntimeObject`，M2-TS、直接回归和 T1 要求的两个 TS-only smoke 通过，未观察到功能回退。仍不能宣称：023/024 完成、生产核心完全去 jree、完整 M1/#245、Java/TypeScript 性能等价、源码覆盖率目标完成或正式发布。代码提交为 `6e2ee4b`；报告为 `reports/20260919-034853.md`，状态收尾待最终检查后提交。

### 2026-09-19：`Term` 运行时身份与字符串边界原生化

本批承接 `2f59905`，对照 canonical Java `Term.java` 与 `AbstractTerm.java` 做前向审查。Java 的 `Term` 原始声明为 `implements AbstractTerm, Serializable`；可观察合同包括 `getClass()` 精确类判等、原子缓存、`SELF`、clone、名称 hash 和文本转换。`AbstractTerm` 的 `Cloneable`/`Comparable` 是领域接口的排序与复制合同，不应把 jree 的反射型 `JavaObject` 要求继续泄漏到 Term 子树。

- `src/language/Term.ts`：移除 jree `JavaObject`，改为项目 `RuntimeObject`；保留 `Term.equals` 的精确运行时类比较、`SELF` 延迟登记、原子缓存、clone、Java 文本 hash 和 `CharSequence` 输入边界。
- `src/language/AbstractTerm.ts`：改为项目自有的 `clone`/`compareTo` 接口合同，去除只为翻译器引入的 jree `Cloneable`/`Comparable` 反射约束。
- `src/runtime/RuntimeClass.ts`：为迁移对象集中提供 Java 风格的对象字符串强制转换，调用具体类的 `toString()`；没有把 `jree-compat` 重新引回 RuntimeObject。
- `src/language/CompoundTerm.ts`、`Variable.ts`、`src/operator/FunctionOperator.ts`：只把领域 equals/equalsTerm 参数从 jree `java.lang.Object` 收窄到 `unknown`，没有修改推理规则、集合实现或调度算法。
- `test/node/core-runtime.test.ts`：增加 Term 原型、静态/实例 class token、clone、equals/hashCode 与 `String(term)` 回归。

- M2：Term/语言/推理关联定向测试 `62/62`；完整串行单测 `312` 项，`310` 通过、`2` 跳过、`0` 失败；`test/entity/TLink.test.ts` 仍由统一入口纳入；非增量 `npx tsc --noEmit --pretty false --incremental false` 为 `0` 诊断；build `sourceFileCount=136`、build 检查和 dist API 通过。
- change gate：`classify-change-gate --base 2f59905 --head a9ef59d` 判定 `T1`，`live_java_required=false`、`m1_minus_required=true`；因修改涉及 6 个高风险源码文件，按 gate 运行冻结 Java 标杆下的 TS-only M1-，没有启动 Java。
- M1-：单线程、cold、逐文件串行、冻结 Java JSONL、`--cycles 1550`、`--timeout-ms 180000`、`--process-limit-ms 1800000`、`--resource-metrics`，244 个主资源（排除 #245）`244/244` functional/parity；`exception=0`、`marker_missing=0`、`timeout=0`、`stall=0`、`process_limit=0`、`not_run=0`、`java_ts_diff=0`、`performance_warning=0`。243 行走 marker 路线，1 个 markerless 资源为 `unverified`，不构成长周期等价。
- M1- 证据位于项目外：`H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\term-m1-minus-20260919.jsonl`，SHA-256 `75590A757BDDDADC212367174B9BC7BA3F515E1C9207A88A18EDDA3F13D42B93`；TS 总时长 `1,655,234 ms`，最长单文件 `354,893 ms`，最大 RSS `1,022,398,464 bytes`，reasoning cycles `2,288,254`。
- Java 标杆未变化：冻结 JSONL SHA-256 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`；canonical Java source commit `8675b76fe8c21ee20a7b8c1b63408fb05327210d`；canonical JAR SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`。本批没有启动 Java。
- jree 审计前→后：`javaObjectFiles=4→3`；直接导入文件 `88→88`；`java.util=39`、`java.lang=85`、Java String `52`、`newLinkedHashMap=0`、`newLinkedHashSet=1`、`semanticReviewItems=93`、`candidateNativeItems=2`。迁移扫描仍为 `238` 个文件：constructor-delegation `0`、malformed generic/operator/new-this `0`，java-class-literal `220/46`，java-string `230/62`，java-collection `664/104`，jree-runtime-type `1574/143`，static-initializer `7/7`，anonymous-java-class `67/11`。平台扫描 `180` 个文件：core candidate `83`、mixed boundary `5`、Node adapter candidate `2`、jree import `95`、browser shim `2`。

本批可以宣称：`Term` 已脱离 jree `JavaObject` 外层壳并保留 Java 可观察合同，M2、非增量类型检查、构建/API、T1 gate 要求的 TS-only M1- `244/244` 均通过；代码提交 `a9ef59d`，已推送到 `origin/main`，批次报告为 `reports/20260919-040006.md`。

本批仍不能宣称：023/024 完成、生产核心完全去 jree、#245 长期稳定性完成、markerless 资源的 131072 周期等价、Java/TypeScript 性能等价、源码覆盖率目标完成或正式发布。普通验证继续复用冻结 Java 标杆；仅在 Java artifact/source/classes、runner 合同、配置/线程/随机条件或整体验收阶段变化时重跑 Java。

### 2026-09-19：`Bag` 运行时外壳原生化

本批在 `08f6a1c` 后继续沿数据结构 → 容器顺序，对照 canonical Java `Bag.java` 处理单一运行时外壳责任。Java `Bag` 原始声明为 `Serializable, Iterable<Type>`；实际观察到的额外类身份行为只有 `toStringLong()` 使用 `getClass().getSimpleName()`。因此本批只移除转写器添加的 jree `JavaObject`/marker 壳，改用项目 `RuntimeObject`，不改 `NativeMap`、equality bucket、优先级层、FIFO 队列、容量淘汰、迭代顺序或调度算法。

- `src/storage/Bag.ts`：删除 `JavaObject` 导入和 `Serializable` 继承，改为 `RuntimeObject`；保留 Bag 的 Java 类身份观察面。
- `test/node/bag.test.ts`：增加 `getClass().getSimpleName()` 直接合同回归；空 Bag 的既有 `toStringLong()` 层索引边界不在本批范围。
- 定向 Bag 测试 `11/11`；统一串行单测 `313` 项，`311` 通过、`2` 跳过、`0` 失败；非增量 `tsc=0`；build `sourceFileCount=136`；dist API 通过。
- gate：`classify-change-gate --base 08f6a1c --head e5eb077 --scope responsibility` 判定 `T1`，`live_java_required=false`、`m1_minus_required=true`，原因包括 `src/storage/Bag.ts` 热路径与语义 token 变化。
- M1- 使用单线程、cold、逐文件串行、冻结 Java JSONL、`--cycles 1550`、`--timeout-ms 180000`、`--process-limit-ms 1800000`、`--resource-metrics`，排除 #245；244 个主资源 `244/244` functional/parity，`exception=0`、`marker_missing=0`、`timeout=0`、`stall=0`、`process_limit=0`、`not_run=0`、`java_ts_diff=0`、`performance_warning=0`。243 行走 marker 等价路线，1 行 markerless 为 `unverified`。
- M1- 证据位于项目外 `H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\bag-shell-m1-minus-20260919.jsonl`，SHA-256 `FA7BBA0C34915D19044D33DF7E187F0F08F048EF5C4FAE8DDFACDE1AD78C3CC9`；TS 总时长 `1,671,440 ms`，最长单文件 `358,918 ms`，最大 RSS `868,003,840 bytes`，reasoning cycles `2,288,254`。
- 继续复用三轮一致的冻结 Java baseline SHA-256 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`；canonical Java source commit `8675b76fe8c21ee20a7b8c1b63408fb05327210d`，artifact SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`；本批未启动 Java。
- jree 审计前→后：`javaObjectFiles=3→2`；直接导入文件 `88`，`java.util=39`，`java.lang=85`，Java String `52`，`semanticReviewItems=93`，`candidateNativeItems=2`，`newLinkedHashMap=0`，`newLinkedHashSet=1`。迁移扫描 `238` 个文件，结构性异常项为 `0`。
- 代码提交 `e5eb077`；报告为 `reports/20260919-050229.md`；状态与报告在本批收尾提交中归档。

本批可以宣称：`Bag` 的无行为 jree `JavaObject` 外壳已按 Java 观察合同收窄为项目 `RuntimeObject`，M2 与 T1 要求的 TS-only M1- `244/244` 通过，未观察到功能回退。

本批仍不能宣称：023/024 完成、生产核心完全去 jree、#245 长期稳定性完成、markerless 资源的 131072 周期等价、Java/TypeScript 性能等价、源码覆盖率目标完成或正式发布。下一责任簇候选为 `Memory` 的 plain-class 外壳，须另起代码提交并重新走 M2/gate。

### 2026-09-19：`Memory` 状态容器 plain-class 外壳原生化

本批承接 `e5eb077`，继续沿数据结构、容器和推理引擎边界做前向审查。对照 canonical Java `Memory.java` 确认其原始声明为 `implements Serializable, Iterable<Concept>, Resettable`，没有显式业务父类；`Serializable` 在当前调用图中仅为 marker，没有观察到 `Memory.class`、实例 `getClass()` 或 `instanceof Memory` 消费。因此本批只移除转写器添加的 jree `JavaObject`/marker 外壳，不修改 Memory 的状态、事件、Bag、operator registry、随机数、reset 或迭代行为。

- `src/storage/Memory.ts`：移除 `JavaObject` 导入、继承和空 `super()`；保留 `java`、`S` 等仍有业务用途的兼容边界，并在源码中记录 Java 原始类型与替换理由。
- `test/node/memory-operator-registry.test.ts`：新增原型链回归，确认 `Memory` 实例直接落在原生 `Object.prototype`，并清理 `Nar` 运行资源。
- M2：专项 `2/2`；串行单元测试 `314` 项，`312` 通过、`2` 跳过、`0` 失败；非增量 typecheck、build、dist API 均通过，build `sourceFileCount=136`。
- change gate：`d746990..a2de854` 判定 `T1`，`live_java_required=false`、`m1_minus_required=true`，原因是 `Memory` 热路径和完成责任簇。
- M1-：TS-only、单线程、cold、逐文件串行、冻结 Java 标杆、`--cycles 1550`；主资源 `244/244` functional/parity。`exception=0`、`marker_missing=0`、`timeout=0`、`stall=0`、`process_limit=0`、`not_run=0`、`java_ts_diff=0`、`performance_warning=0`；243 项走 marker 路线，`nal6.redundant.nal` 唯一 markerless 项运行到 `1650/131072` 周期，状态为 `not_reached`，不构成长周期等价。
- M1- 证据位于项目外 `H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\memory-shell-m1-minus-20260919.jsonl`；SHA-256 为 `CF56606E40CB9FFF1E23A17C280F7C5BDFE43D355176420F7BB1D8ABE73B63E8`。总时长 `1,663,813 ms`，最长单文件 `353,111 ms`，最大 RSS `1,075,593,216 bytes`，reasoning cycles `2,288,254`。
- canonical Java source commit `8675b76fe8c21ee20a7b8c1b63408fb05327210d`、JAR SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5` 和冻结 JSONL SHA-256 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954` 均未变化；本批未启动 Java。
- jree 审计前→后：`javaObjectFiles=2→1`；直接导入文件 `88→88`；`java.util=39`、`java.lang=85`、Java String `52`、`newLinkedHashMap=0`、`newLinkedHashSet=1`、`semanticReviewItems=93`、`candidateNativeItems=2`。当前没有 c8/nyc/Istanbul 覆盖率依赖或脚本，NAL 通过数继续不作为源码覆盖率替代。

本批可以宣称：`Memory` 的无行为 jree 外壳已按 canonical Java plain-class 合同原生化，并通过 M2 与 T1 要求的 TS-only M1- `244/244`。仍不能宣称：023/024 完成、生产核心完全去 jree、完整 M1/#245 长期稳定性完成、markerless 131072 周期等价、Java/TypeScript 性能等价、源码覆盖率目标完成或正式发布。代码提交 `a2de854` 已推送；批次报告为 `reports/20260919-061141.md`，文档收尾提交待完成。

### 2026-09-19：`Memory` 与 `Bag` Java 迭代器边界原生化

本批承接 `75294f9`，继续审查存储层的 Java-shaped 兼容类型。canonical Java 的 `Memory.iterator()` 和 `Bag.iterator()` 返回 `java.util.Iterator<T>`；当前实现实际调用的是 NativeMap/Bag 的 `hasNext/next/remove` 迭代器，因此新增项目自有最小合同，避免把 jree 的类型要求重新泄漏到存储核心。

- `src/runtime/JavaIterator.ts`：新增 `JavaIterator<T>`，定义 `hasNext()`、`next()`、`remove()`；具体对象仍由 NativeMap/Bag 的 TypeScript 原生迭代器实现。
- `src/storage/Bag.ts`：`iterator()` 从 jree Iterator 类型改为项目 `JavaIterator<Type>`；`[Symbol.iterator]()` 返回 `IterableIterator<Type>`，不改变插入顺序或移除语义。
- `src/storage/Memory.ts`：`iterator()` 改为 `JavaIterator<Concept>`；`[Symbol.iterator]()` 直接复用 `concepts` 的原生可迭代器，删除中间包装。
- `test/perf/BagPerf.ts`：性能测试消费者同步使用项目迭代器合同；`test/node/memory-operator-registry.test.ts` 增加双路径回归。
- M2：专项 `3/3`；串行单测 `315` 项，`313` 通过、`2` 跳过、`0` 失败；非增量 typecheck、build、dist API 均通过，build `sourceFileCount=137`。
- change gate：`75294f9..c798116` 判定 `T1`，`live_java_required=false`、`m1_minus_required=true`，原因包括 Bag/Memory 热路径、3 个生产源文件和责任簇收口。
- 受影响 NAL smoke：`toothbrush.nal`、`nal8.add.nal` 共 `2/2`，无异常、marker 缺失、停滞或进程限制。
- M1-：TS-only、单线程、cold、逐文件串行、冻结 Java 标杆；`244/244` functional/parity，`exception=0`、`marker_missing=0`、`timeout=0`、`stall=0`、`process_limit=0`、`not_run=0`、`java_ts_diff=0`、`performance_warning=0`。243 项走 marker 路线，`nal6.redundant.nal` 运行到 `1650/131072` 周期并标为 `not_reached`。
- M1- 证据：`H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\iterator-boundary-m1-minus-20260919.jsonl`，SHA-256 `F00DDC2243C28460F5AEA59AFCD381D44D95AADE3B36C5A6C01197989AEB48D4`；总耗时 `1,755,609 ms`，最长单文件 `384,667 ms`，最大 RSS `989,159,424 bytes`，reasoning cycles `2,288,254`。
- smoke 证据：`iterator-boundary-smoke-20260919.jsonl`，SHA-256 `7B5B690207BE24D242DCAA1FD5C339DE38E92BE4D8F59A27C3ED46CC9472C283`。
- canonical Java source/JAR 与冻结 JSONL 未变化：source `8675b76fe8c21ee20a7b8c1b63408fb05327210d`，JAR `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`，baseline `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`；本批未启动 Java。
- jree 审计前→后：`directJreeImportFiles=88→88`、`javaObjectFiles=1→1`、`semanticReviewItems=93→92`、`newLinkedHashMap=0`、`newLinkedHashSet=1`。直接导入未减少，因为存储层仍有其他 Java 字符串、异常、随机数和事件边界。

本批可以宣称：Memory/Bag 的 Java 迭代器类型边界已收窄到项目自有合同，并通过 M2、受影响 smoke 和 T1 要求的 M1- `244/244`。仍不能宣称：023/024 完成、生产核心完全去 jree、完整 M1/#245、markerless 131072 周期等价、Java/TypeScript 性能等价、源码覆盖率完成或正式发布。代码提交 `c798116`；报告为 `reports/20260919-065512.md`，文档收尾提交待完成。

### 2026-09-19：`Eventable` 残留 jree 导入清理

本批是对早期迁移提交的前向审查。`src/interfaces/Eventable.ts` 只声明事件观察接口，源码中的 `import { java } from "jree"` 没有对应运行时或类型引用；Java 原始接口的实际合同由项目内 `EventEmitter.EventObserver` 与 `ClassTokenLike` 表达。因此删除该未使用导入，不创建新的兼容层，也不改变事件派发、类 token、集合、随机数或推理逻辑。

- M2：串行单元测试 `315` 项，`313` 通过、`2` 跳过、`0` 失败；显式非增量 typecheck 为 `0` 诊断；build `sourceFileCount=137`、build 检查和 dist API 通过。
- change gate：`classify-change-gate --base 6c5ac8b --head 8bb25fc` 判定 `T0`，`live_java_required=false`、`m1_minus_required=false`；因此没有启动 Java 或 M1-。
- 静态审计：迁移扫描 `239` 个文件，constructor-delegation、malformed generic/operator/new-this 均为 `0`；平台审计成功；jree 直接导入文件 `88→87`，`javaObjectFiles=1`、`java.util=39`、`java.lang=85`、Java String `52`、`newLinkedHashMap=0`、`newLinkedHashSet=1` 保持不变。
- 继续复用冻结 Java baseline `g0-java-baseline-26772af-20260917`，SHA-256 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`；canonical Java source `8675b76fe8c21ee20a7b8c1b63408fb05327210d`，JAR SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`。
- 代码提交：`8bb25fc3de151e0e4f954c9ac63a3ff07113d7d2`；批次报告：`reports/20260919-070629.md`。

本批可以宣称：`Eventable` 的无行为 jree 导入残留已清理，M2 和静态审计通过，未观察到功能变化。

本批仍不能宣称：023/024 完成、生产核心完全去 jree、完整 M1/#245、源码覆盖率目标完成、Java/TypeScript 性能等价或正式发布。后续若进入 `runtime/jree-compat.ts`、Map/Set、随机数、类身份或热路径，必须重新按 T1/T2 门禁验证。

### 2026-09-19：`AnswerHandler` 残留 jree 导入清理

本批继续前向审查事件边界。`AnswerHandler` 的 Java 原始职责是订阅 `Answer` 事件、比较 `Task.equals` 并调用 `onSolution`；TypeScript 当前实现只使用项目内的 `ClassTokenLike`、`EventEmitter.EventObserver`、`Events.Answer` 和 `Task`。文件中的 `import { java } from "jree"` 没有任何 `java.*` 使用，因此删除该导入，不改变事件 token、订阅顺序、回调参数或任务值相等语义。

- M2：串行单元测试 `315` 项，`313` 通过、`2` 跳过、`0` 失败；显式非增量 typecheck 为 `0` 诊断；build `sourceFileCount=137`、build 检查和 dist API 通过。
- change gate：`classify-change-gate --base 5873ffc --head b99a755` 判定 `T1`，原因是 `io/events` 高风险路径；`live_java_required=false`、`m1_minus_required=false`，因此本批没有启动 Java 或 M1-。
- 静态审计：迁移扫描 `239` 个文件，constructor-delegation、malformed generic/operator/new-this 均为 `0`；jree 直接导入文件 `87→86`，`javaObjectFiles=1`、`semanticReviewItems=92`、`newLinkedHashMap=0`、`newLinkedHashSet=1`。
- 继续复用冻结 Java baseline SHA-256 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`；canonical Java source `8675b76fe8c21ee20a7b8c1b63408fb05327210d`，JAR SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`。
- 代码提交：`b99a7554444bd7f2c70ac1503e11a5f92fb9f8b4`；批次报告：`reports/20260919-071447.md`。

本批可以宣称：`AnswerHandler` 的无行为 jree 导入残留已清理，M2、静态审计和 T1 最低门通过。

本批仍不能宣称：023/024 完成、生产核心完全去 jree、完整 M1/#245、源码覆盖率目标完成、Java/TypeScript 性能等价或正式发布。

### 2026-09-19：`Product` Java List 输入边界收窄

本批承接 `68d4ac3`，对照 canonical Java `Product.java` 做历史前向审查。Java 原始构造器同时提供 `Product(Term...)` 与 `Product(List<Term>)`；List 路径只通过有序 `toArray(new Term[0])` 转为组件数组，不能把 List 语义未经说明地替换为 Set。TypeScript 原实现还把 `java.util.List`、`IllegalArgumentException` 和 jree 字符串模板直接带入语言模块。

- `src/runtime/jree-compat.ts`：新增结构化 `JavaListInput<T>`、`isJavaListInput` 和 `JavaIllegalArgumentException`，集中保留 Java List 的 `toArray` 观察面与异常继承合同。
- `src/language/Product.ts`：删除直接 `jree` 导入；保留真实 jree `ArrayList` 的运行时输入、组件顺序、Product 工厂和 clone 行为；非法参数改用兼容边界异常。
- `test/node/core-runtime.test.ts`：增加真实 jree `ArrayList` 构造顺序与非法工厂参数异常继承回归。
- M2：核心运行时回归 `42/42`；完整串行单测 `316` 项，`314` 通过、`2` 跳过、`0` 失败；`test/entity/TLink.test.ts` 继续纳入统一入口。
- 类型检查：`npm run typecheck` 显式使用 `--incremental false`，诊断 `0`；build `sourceFileCount=137`；dist API `cycles=2`、`cycleEnds=2`、`outputSignals=1`、`stopped=true`。
- change gate：`classify-change-gate --base 68d4ac3 --head 4d427aa --scope responsibility` 判定 `T1`，`live_java_required=false`、`m1_minus_required=true`；原因是 Product 高风险路径、jree 兼容热路径、语义 token 和责任簇收口。
- M1-：TS-only、单线程、cold、逐文件串行，复用冻结 Java JSONL，排除 #245；`244/244` functional/parity，`exception=0`、`marker_missing=0`、`timeout=0`、`stall=0`、`process_limit=0`、`not_run=0`、`java_ts_diff=0`、`performance_warning=0`。243 项走 marker 等价路线；`nal6.redundant.nal` 无 marker，状态为 `not_reached`，不构成 131072 周期长测结论。
- M1- 证据：`H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\product-list-boundary-m1-minus-20260919.jsonl`，SHA-256 `001500243773BF865D33F6D5801C2DC680BDA8A824609C989A9D4D21A635E0F6`；TS 总时长 `1,797,344 ms`，最长单文件 `400,484 ms`，最大 RSS `971,739,136 bytes`，reasoning cycles `2,288,254`；观测速度约 `804.3 ms/1024 reasoning cycles`，仅作为后续优化数据。
- Java 基线未变化且本批未重跑 Java：冻结 JSONL SHA-256 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`，canonical source commit `8675b76fe8c21ee20a7b8c1b63408fb05327210d`，JAR SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`，M1- 行 `java_artifact=null`。
- jree 审计前→后：直接导入文件 `86→85`、`java.util` 文件 `39→38`、`java.lang` 文件 `85→84`、Java String 文件 `52→52`、`javaObjectFiles=1→1`、`semanticReviewItems=92→91`、`newLinkedHashMap=0`、`newLinkedHashSet=1`。兼容中心仍是 `src/runtime/jree-compat.ts`，不能把导入减少宣称为 jree 运行时退出。
- 覆盖率状态不变：仓库仍没有 c8/nyc/Istanbul 覆盖率门；NAL 通过数继续不替代源码覆盖率，覆盖率基线与“命中缺口的 NAL”仍留待总体目标阶段。

本批可以宣称：Product 的 Java List 输入边界已收窄到项目兼容合同，直接语言模块 jree 导入减少一项，M2、非增量类型检查、构建/API 及 T1 要求的 M1- `244/244` 均通过，未观察到功能回退。代码提交 `4d427aa4009c51fdc8c5d0a620f664ec3afe9f67`；批次报告为 `reports/20260919-071935.md`。

本批仍不能宣称：023/024 完成、生产核心完全去 jree、完整 M1/#245 长周期完成、`nal6.redundant.nal` 的 131072 周期等价、Java/TypeScript 全面性能等价、源码覆盖率目标完成或正式发布。

### 2026-09-19：`EventEmitter` 异常边界收窄

本批对照 canonical Java `EventEmitter.java` 做单一责任迁移。Java 的非法构造器参数抛 `IllegalArgumentException`；`off` 的空参数和未知事件抛 `IllegalStateException`。本批只替换直接 jree 异常边界，保留事件 Map、observer 数组、身份删除、pending FIFO、payload 顺序和既有消息拼接。

- `src/io/events/EventEmitter.ts`：删除直接 jree 导入，改用项目 `JavaIllegalArgumentException` 与 `JavaIllegalStateException`。
- `test/node/event-emitter.test.ts`：增加构造器、空参数和未知事件的异常继承关系及 Java `getMessage()` 观察面回归；定向测试 `11/11`。
- change gate：`9390646..5406aa7` 判定 `T1`，`live_java_required=false`、`m1_minus_required=true`；本批未修改 canonical Java，未启动 Java。
- M2：串行单元测试 `322` 项，`320` 通过、`2` 跳过、`0` 失败；非增量 `tsc=0`；build `sourceFileCount=137`；dist API 通过；迁移扫描结构性异常项为 `0`。
- smoke：`toothbrush.nal` 与 `single_step/nal4.7.nal` TS-only `2/2`，无 exception、timeout、marker missing 或 Java/TS diff。证据 `event-emitter-smoke-20260919.jsonl`，SHA-256 `08C9A7029D07DAC4EDF53FCE7885639656AB8C07A46CB9086E939F7630FA9B85`。
- M1-：TS-only、单线程、cold、逐文件串行，`244/244` functional/parity，`java_ts_diff=0`、`exception=0`、`marker_missing=0`、`timeout=0`、`stall=0`、`process_limit=0`、`not_run=0`、`performance_warning=0`。243 项走 marker 路线；`nal6.redundant.nal` 为 `1650/131072`，无 marker，保持 `unverified/not_reached`，不构成 131072 周期等价。
- M1- 证据：`event-emitter-m1-minus-20260919.jsonl`，大小 `773778 bytes`，SHA-256 `657755735189BB26A3909A4A86A5AB5BF960CEA5B6A05ADD714189C0DFC18E36`；TS 总时长 `1706823 ms`，最长单文件 `363234 ms`，最大 RSS `1021.22 MiB`，reasoning cycles `2288254`，仅作后续性能数据。
- Java 标杆未变化：source `8675b76fe8c21ee20a7b8c1b63408fb05327210d`，JAR SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`，冻结 JSONL SHA-256 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`；矩阵 `java_artifact=null`。
- jree 审计前→后：直接导入文件 `80→79`、`java.lang` 文件 `79→78`；`java.util=38`、`javaObjectFiles=1`、`newLinkedHashMap=0`、`newLinkedHashSet=1` 保持不变。审计证据 `audit-event-emitter-20260919.json`，SHA-256 `594FDEA368192FDFB2030CE9B93FB649D8C439EF47383640941906B68D12A9ED`。

本批可以宣称：`EventEmitter` 的异常边界已完成项目内收窄，并通过局部合同、M2、两个 smoke 和 M1- `244/244` 保护矩阵；不能宣称 023/024 完成、生产核心完全去 jree、完整 M1/#245、源码覆盖率、性能等价或正式发布。代码提交 `5406aa77d4dcf4afcb2d6ba4944b106c7fac40c5`，报告为 `reports/20260919-114104.md`。

### 2026-09-19：`EventHandler` 异常边界收窄

本批继续对照 canonical Java `EventHandler.java` 做单一责任迁移。Java 的两个构造器只负责绑定 `EventEmitter`、事件 class token 和 active 状态；TS 的唯一直接 jree 行为是非法参数分支中构造 `java.lang.IllegalArgumentException` 并使用转译模板字符串。本批只收窄该异常边界，不改变事件身份 token、订阅顺序、`setActive` 生命周期或 payload。

- `src/io/events/EventHandler.ts`：删除直接 `jree` 导入，改用项目 `JavaIllegalArgumentException` 与原生消息文本。
- `test/node/event-emitter.test.ts`：增加异常继承关系与 Java `getMessage()` 观察面的回归；定向事件测试 `10/10`。
- change gate：`8dcbff7..3510810` 判定 `T1`，`live_java_required=false`、`m1_minus_required=true`；本批没有修改 canonical Java，也没有启动 Java。
- M2：串行单元测试 `321` 项，`319` 通过、`2` 跳过、`0` 失败；非增量 `tsc=0`；build `sourceFileCount=137`；dist API 通过；迁移扫描结构性异常为 `0`。
- smoke：`toothbrush.nal` 与 `single_step/nal4.7.nal` TS-only `2/2`，0 exception、0 timeout、0 marker missing、0 Java/TS diff。证据 `event-handler-smoke-20260919.jsonl`，SHA-256 `F03D9224ED6E5FF8D13768C116D91538C6290409D380BFBA199EB2A70308F6DC`。
- M1- 原始矩阵：TS-only、单线程、cold、逐文件串行，`243/244` functional/parity；唯一异常为 `nal8.4.3.nal` 的 Windows `EXCEPTION_ACCESS_VIOLATION (3221225477)`，没有逻辑分叉证据。异常行同条件 retry `1/1` 通过，因此有效功能证据为 `244/244`；原始矩阵不改写。
- M1- 主证据：`event-handler-m1-minus-20260919.jsonl`，SHA-256 `EDFB5C499BD99C3DF8396550A846C2B4FA589AEE4D4537EF64C7280804EAFE66`；retry 证据 `event-handler-m1-retry-nal8.4.3-20260919.jsonl`，SHA-256 `F3FF67B8A46FEA7D4E8D175B94233BBDC42B129D9FE775637FF92FBDD8273F39`。原始 timeout、stall、process limit、not-run 均为 `0`；`nal6.redundant.nal` 仍是无 marker 短跑 `unverified/not_reached`。
- M1- 性能观测：总时长 `1757793 ms`，最长单文件 `389955 ms`，最大 RSS `912.69 MiB`，reasoning cycles `2288254`，约 `786.62 ms/1024 周期`；只作后续性能数据。
- Java 标杆未变化：source `8675b76fe8c21ee20a7b8c1b63408fb05327210d`，JAR SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`，冻结 JSONL SHA-256 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`。
- jree 审计前→后：直接导入文件 `81→80`、`java.lang` 文件 `80→79`、`java.util=38`、`javaObjectFiles=1`、`newLinkedHashMap=0`、`newLinkedHashSet=1` 保持不变。

本批可以宣称：`EventHandler` 的异常边界已完成项目内收窄，且通过直接合同、M2、两个 smoke 和 M1- `244/244` 合并保护证据；不能宣称 023/024 完成、jree 已清零、完整 M1/#245、源码覆盖率、性能等价或正式发布。代码提交 `351081097310b6a6f563bf7021de456d74b506d7`，报告为 `reports/20260919-105710.md`。

### 2026-09-19：`Plugin` CharSequence 边界收窄

本批承接 `90acd6b`，对照 canonical Java `Plugin.java` 做前向审查。Java 的 `Plugin.name()` 返回 `CharSequence`；TypeScript 原接口直接暴露 `jree` 的 `java.lang.CharSequence` 类型。本批只收窄类型边界，不改 `setEnabled`、插件注册顺序、默认方法语义或插件生命周期。

- `src/runtime/jree-compat.ts`：新增 `JavaCharSequenceInput`，集中表示 Java boxed `CharSequence` 与原生 `string` 的输入合同。
- `src/plugin/Plugin.ts`：删除直接 `jree` 类型导入，`name()` 改用项目内边界类型。
- `test/node/plugin-boundary.test.ts`：新增 Java `java.lang.String` 与原生 `string` 双路径回归。
- M2：串行单元测试 `319` 项，`317` 通过、`2` 跳过、`0` 失败；显式非增量 `tsc=0`；`test:build` 的 `sourceFileCount=137`、build 检查和 dist API 均通过；迁移扫描与 jree 审计均完成。首次 M2 因 C: 盘无剩余空间导致临时夹具写入 `ENOSPC`，将 `TEMP/TMP` 改指向项目外 H: 临时目录后重跑通过。
- change gate：`90acd6b..acb8ffa` 判定 `T1`，`live_java_required=false`、`m1_minus_required=true`；本批没有重跑 Java，继续复用冻结标杆。
- M1-：TS-only、单线程、cold、逐文件串行，执行 `244` 个主资源（排除 #245）；`244/244` functional/parity，`exception=0`、`marker_missing=0`、`timeout=0`、`stall=0`、`process_limit=0`、`not_run=0`、`java_ts_diff=0`、`performance_warning=0`。243 项走 marker 等价路线；`nal6.redundant.nal` 无 marker，`1650/131072` 周期状态为 `not_reached`，不构成 131072 周期等价结论。
- M1- 证据：`H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\plugin-charsequence-m1-minus-20260919.jsonl`，大小 `773,787 bytes`，SHA-256 `FEFA61ADB1E7046A5D69C7F1E3EB791ECDAFD56E427A332C1F29A449AD522A80`；TS 总时长 `1,815,632 ms`，最长单文件 `394,178 ms`，最大 RSS `874,852,352 bytes`，reasoning cycles `2,288,254`，观测速度约 `812.5 ms/1024 reasoning cycles`，仅作为后续性能数据。
- Java 基线未变化：冻结 JSONL SHA-256 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`，canonical source commit `8675b76fe8c21ee20a7b8c1b63408fb05327210d`，JAR SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`；M1- 行 `java_artifact=null`。
- jree 审计前→后：直接导入文件 `83→82`、`java.lang` 文件 `82→81`、Java String 文件 `51→50`、`semanticReviewItems=90→89`；`java.util=38`、`javaObjectFiles=1`、`newLinkedHashMap=0`、`newLinkedHashSet=1`、`candidateNativeItems=2` 保持不变。迁移扫描本批 `240` 个文件，结构性异常项仍为 `0`。

本批可以宣称：`Plugin` 的 `CharSequence` jree 类型边界已收窄到项目兼容层，M2、构建/API、静态审计和 T1 要求的 TS-only M1- `244/244` 均通过，未观察到功能回退。代码提交 `acb8ffa`；报告与状态收尾提交待完成。

本批仍不能宣称：023/024 完成、生产核心完全去 jree、完整 M1/#245 长期稳定性完成、`nal6.redundant.nal` 的 131072 周期等价、Java/TypeScript 全面性能等价、源码覆盖率目标完成或正式发布。

### 2026-09-19：`SensoryChannel` Java String 边界收窄

本批继续对照 canonical Java 的 `SensoryChannelConsumer.addSensoryChannel(String, SensoryChannel)` 与 `Nar.addSensoryChannel` 调用链做单一责任迁移。Java 的参数边界是普通 `String`；TypeScript 接口此前直接泄漏 jree boxed `java.lang.String`。本批只把入口收窄到项目内 `JavaStringInput`，保留既有 Narsese 解析、异常和 `NativeMap<Term, SensoryChannel>` 键判等路径，不改推理算法或领域 Map。

- `src/interfaces/SensoryChannelConsumer.ts` 和 `src/main/Nar.ts` 删除该边界上的直接 jree 类型依赖，统一使用 `JavaStringInput`。
- `test/node/nar-sensory-channel-map.test.ts` 增加 native string 入口回归，同时保留 Java boxed string 的等值 Term 查询回归；定向测试 `3/3`。
- change gate：`abcd8a5..8f1a5a6` 判定 `T1`，`live_java_required=false`、`m1_minus_required=true`；本批没有修改 canonical Java，也没有重跑 Java。
- M2：串行单元测试 `320` 项，`318` 通过、`2` 跳过、`0` 失败；非增量 `tsc=0`；build `sourceFileCount=137`；dist API、扫描、审计和受影响 `toothbrush.nal`/`vision.nal` smoke `2/2` 通过。
- M1-：使用冻结 Java JSONL，TS-only、单线程、cold、逐文件串行；`244/244` functional/parity，`0` Java/TS diff、`0` exception、`0` 卡死式 timeout、`0` marker missing、`0` stall、`0` process limit、`0` not-run、`0` performance warning。243 项走 marker 路线；`nal6.redundant.nal` 仅运行至 `1650/131072`，为 `unverified/not_reached`，不构成功能失败。
- M1- 证据：`H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\sensory-channel-m1-minus-20260919.jsonl`，大小 `773759 bytes`，SHA-256 `C5097EFFD746D7BA9CB946782F1BD5BFFD48483FAD2EDC8F95740A5B72E9F2C8`；TS 总时长 `1802239 ms`，最长单文件 `400488 ms`，最大 RSS `878.84 MiB`，reasoning cycles `2288254`，观测速度约 `806.51 ms/1024 reasoning cycles`，仅作后续性能数据。
- Java 标杆未变化：冻结 JSONL SHA-256 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`，canonical source `8675b76fe8c21ee20a7b8c1b63408fb05327210d`，JAR SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`；M1- 行 `java_artifact=null`。
- jree 审计前→后：直接导入文件 `82→81`、`java.lang` 文件 `81→80`、Java String 文件 `50→49`、`semanticReviewItems=89→88`；`java.util=38`、`javaObjectFiles=1`、`newLinkedHashMap=0`、`newLinkedHashSet=1` 保持不变。迁移扫描 `240` 个文件，结构性异常项为 `0`。

本批可以宣称：`SensoryChannel` 的 Java String 边界已收窄到项目兼容合同，并通过局部回归、M2、构建/API、静态审计、受影响 smoke 和 M1- `244/244` 保护矩阵；代码提交为 `8f1a5a65e77471acbb1decc0c0a787a94f4fe0e4`，阶段报告为 `reports/20260919-101035.md`。

本批仍不能宣称：023/024 完成、生产核心完全去 jree、完整 M1/#245 长期稳定性完成、`nal6.redundant.nal` 的 131072 周期等价、Java/TypeScript 全面性能等价、源码覆盖率目标完成或正式发布。

### 2026-09-19：`Counting` plain Plugin 字符串与异常边界收窄

本批继续对照 canonical Java `Counting.java` 做前向审查。Java 原实现是 plain `Plugin`，构造器只接受无参或一个 `float` 优先级；非法重载应抛 `IllegalArgumentException`，事件原因是普通字符串。TypeScript 原实现仅为这两个边界直接依赖 jree。本批没有修改 `MINIMUM_PRIORITY` 的 `Float32Math` 收窄、事件筛选、SetExt 基数计算或任务派发逻辑。

- `src/plugin/mental/Counting.ts`：删除直接 `jree` 导入；非法构造器改抛 `JavaIllegalArgumentException`；事件原因通过 `toJavaString` 进入现有 `Memory.addNewTask` Java 字符串合同。
- `test/node/counting-boundary.test.ts`：增加非法构造器参数的异常类型、继承关系和消息回归。
- M2：Counting 定向回归 `2/2`；完整串行单测 `318` 项，`316` 通过、`2` 跳过、`0` 失败；非增量 typecheck `0` 诊断；build `sourceFileCount=137`；dist API `cycles=2`、`cycleEnds=2`、`outputSignals=1`、`stopped=true`。
- change gate：`fa823ca..829d4a9` 判定 `T1`，`live_java_required=false`、`m1_minus_required=true`；原因包括 Counting 高风险插件路径和责任簇收口。
- M1-：TS-only、单线程、cold、逐文件串行、冻结 Java 标杆；`244/244` functional/parity，`0` Java/TS diff、`0` exception、`0` marker missing、`0` timeout、`0` stall、`0` process limit、`0` not-run、`0` performance warning。243 项走 marker 等价路线；`nal6.redundant.nal` 无 Java marker，保持 `unverified/not_reached`，不构成 131072 周期结论。
- M1- 证据：`H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\counting-plugin-m1-minus-20260919.jsonl`，SHA-256 `E0CF7BA187E24BB656D2150A0A7FF7B85F8D809797C08C792979063A2DD6CCF3`；总耗时 `1,725,399 ms`，最长单文件 `366,332 ms`，最大 RSS `980,512,768 bytes`，reasoning cycles `2,288,254`；观测速度约 `772.1 ms/1024 reasoning cycles`，仅作性能观测。
- Java 基线未变化且本批未重跑 Java：冻结 JSONL SHA-256 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`，canonical source `8675b76fe8c21ee20a7b8c1b63408fb05327210d`，JAR SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`，结果中 `java_artifact=null`。
- jree 审计前→后：直接导入文件 `84→83`、`javaObjectFiles=1→1`、`java.util=38→38`、`java.lang=83→82`、Java String `51→51`、`semanticReviewItems=90→90`、`candidateNativeItems=2→2`、`newLinkedHashMap=0`、`newLinkedHashSet=1`。

本批可以宣称：`Counting` 的 jree 字符串和构造器异常依赖已收窄到项目兼容边界，并通过局部合同、M2、非增量类型检查、构建/API、静态审计和 T1 要求的 M1- `244/244`；未观察到功能回退。代码提交 `829d4a9933cf1220c0205cd99c9853f4c6d28d58`；批次报告为 `reports/20260919-084331.md`。

本批仍不能宣称：023/024 完成、生产核心完全去 jree、完整 M1/#245 长周期完成、`nal6.redundant.nal` 的 131072 周期等价、Java/TypeScript 全面性能等价、源码覆盖率目标完成或正式发布。

### 2026-09-19：`Count` Java 字符串与异常边界收窄

本批继续对照 canonical Java `Count.java` 做前向审查。Java 原实现的 `requireMessage` 是普通 `String`，两个非法输入分支抛 `IllegalStateException`；TypeScript 原实现却让 `Count` 直接依赖 jree 的 boxed `String` 和异常命名空间。本批只收窄这两个边界，不改变参数判断、SetExt/SetInt 类型判断、集合计数或 FunctionOperator 执行路径。

- `src/runtime/jree-compat.ts`：新增 `JavaIllegalStateException`，集中保留 Java 异常继承关系。
- `src/operator/misc/Count.ts`：删除直接 `jree` 导入；`requireMessage` 改为 native `string`；两个非法输入分支改抛兼容边界异常。
- `test/node/operator-boundary.test.ts`：新增 Count protected-function 探针，验证空参数、非集合参数的异常类型、Java 继承关系和消息文本。
- M2：Count 定向回归 `3/3`；完整串行单测 `317` 项，`315` 通过、`2` 跳过、`0` 失败；非增量 typecheck `0` 诊断；build `sourceFileCount=137`；dist API `cycles=2`、`cycleEnds=2`、`outputSignals=1`、`stopped=true`。
- change gate：`17a3cae..fbe4b7e` 判定 `T1`，`live_java_required=false`、`m1_minus_required=true`；原因包括 `Count`/兼容层高风险路径和责任簇收口。
- M1-：TS-only、单线程、cold、逐文件串行、冻结 Java 标杆；`244/244` functional/parity，`0` Java/TS diff、`0` exception、`0` marker missing、`0` timeout、`0` stall、`0` process limit、`0` not-run、`0` performance warning。243 项走 marker 等价路线；`nal6.redundant.nal` 无 Java marker，保持 `unverified/not_reached`，不构成 131072 周期结论。
- M1- 证据：`H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\count-exception-boundary-m1-minus-20260919.jsonl`，SHA-256 `74CCB7BE28A19E7D513AC63CB0AE1104D10031027A4F3A9DB053D79FBCC86CC1`；总耗时 `1,756,222 ms`，最长单文件 `384,361 ms`，最大 RSS `891,342,848 bytes`，reasoning cycles `2,288,254`；观测速度约 `785.9 ms/1024 reasoning cycles`，仅作性能观测。
- Java 基线未变化且本批未重跑 Java：冻结 JSONL SHA-256 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`，canonical source `8675b76fe8c21ee20a7b8c1b63408fb05327210d`，JAR SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`，结果中 `java_artifact=null`。
- jree 审计前→后：直接导入文件 `85→84`、`javaObjectFiles=1→1`、`java.util=38→38`、`java.lang=84→83`、Java String `52→51`、`semanticReviewItems=91→90`、`candidateNativeItems=2→2`、`newLinkedHashMap=0`、`newLinkedHashSet=1`。

本批可以宣称：`Count` 的 Java 字符串与非法状态异常依赖已收窄到项目兼容边界，并通过局部合同、M2、非增量类型检查、构建/API、静态审计和 T1 要求的 M1- `244/244`；未观察到功能回退。代码提交 `fbe4b7ef5b8dfc534e9c3c3be778777af6867020`；批次报告为 `reports/20260919-080646.md`。

本批仍不能宣称：023/024 完成、生产核心完全去 jree、完整 M1/#245 长周期完成、`nal6.redundant.nal` 的 131072 周期等价、Java/TypeScript 全面性能等价、源码覆盖率目标完成或正式发布。

### 2026-09-19：`Events.InferenceEvent` 异常边界收窄

本批继续对照 canonical Java `Events.InferenceEvent` 做单一责任迁移。Java 一参构造转发到二参构造，只有 `stackFrames > 0` 才采集栈；TypeScript 的现有非法参数保护分支原先直接构造 `java.lang.IllegalArgumentException`。本批只把该异常边界收窄到项目兼容层，不改变事件 payload、栈追踪、`java.util.List` 或构造器正常路径。`InferenceEvent` 没有安全的公开非法重载实例化入口，因此以公开 `Events.ConceptNew` 正常构造回归和源码审计保护该边界，没有扩大 API。

- `src/io/events/Events.ts`：用 `JavaIllegalArgumentException` 替代该分支的直接 jree 异常命名空间；其他 Java 类型引用仍按原合同保留。
- change gate：`22a8989..c11d376` 判定 `T1`，`live_java_required=false`、`m1_minus_required=true`。
- M2：定向 `event-emitter.test.ts` `11/11`；完整串行单测 `322` 项，`320` 通过、`2` 跳过、`0` 失败；非增量 `tsc=0`；build `sourceFileCount=137`；dist API 和迁移模式扫描通过。
- smoke：`toothbrush.nal` 与 `single_step/nal4.7.nal` TS-only `2/2`，使用冻结 Java JSONL，`java_artifact=null`；证据 `event-inference-smoke-20260919.jsonl`，SHA-256 `D3A8049514CF4BDBFA9C82655CAFCDC39C1037C732441031A83A2A14DEDB0180`。
- M1-：冻结标杆、TS-only、单线程、cold、逐文件串行，`244/244` functional/parity；`0` Java/TS diff、`0` exception、`0` marker missing、`0` 卡死式 timeout、`0` stall、`0` process limit、`0` not-run、`0` performance warning。243 项走 marker 路线；`nal6.redundant.nal` 无 marker，运行到 `1650/131072`，为 `unverified/not_reached`，不构成失败。
- M1- 证据：`H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\event-inference-m1-minus-20260919.jsonl`，大小 `773776 bytes`，SHA-256 `BB56AEDBC510809942FA9E2B21ADEDE06D52CA29E5E965B6C89879B0F9D4CFDE`；TS 总时长 `1674357 ms`，最长单文件 `359585 ms`，最大 RSS `948948992 bytes`（约 `905.0 MiB`），按 `1550` 周期计 `378200` runner cycles，仅作功能保护和后续性能观测。
- Java 标杆未变化：source `8675b76fe8c21ee20a7b8c1b63408fb05327210d`，JAR SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`，冻结 JSONL SHA-256 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`；本批没有重新启动 Java。
- jree 审计：源码文件 `138`，直接导入文件 `79`，`java.lang` 文件 `78`，`semanticReviewItems=88`；本批只收窄异常边界，剩余 Java 集合、栈追踪和类型引用属于后续责任批次，因此不能以导入计数变化作为本批验收。

本批可以宣称：`InferenceEvent` 的异常边界已收窄，并通过局部合同、串行 M2、构建/API、静态审计、smoke 和 M1- `244/244` 保护矩阵。仍不能宣称 023/024 完成、jree 清零、完整 M1/#245 长期稳定性完成、markerless `131072` 周期等价、源码覆盖率达标、Java/TypeScript 全面性能等价或正式发布。代码提交 `c11d3767329564847e7264533ef9cda6a198d0b2`，阶段报告为 `reports/20260919-122358.md`。

### 2026-09-19：`OutputHandler` 异常边界收窄

本批继续对照 canonical Java `OutputHandler.java` 做单一责任迁移。Java 只有 1/2 参数构造器：`EventEmitter`、`Memory`、`Nar` 来源路径以及 `Nar` 默认激活路径；默认事件 token 和父类注册顺序是现有行为合同。TypeScript 原实现唯一直接 jree 行为是非法参数分支构造 `java.lang.IllegalArgumentException`。本批只收窄该异常边界，不改变 token、来源解析、默认事件列表或生命周期。

- `src/io/events/OutputHandler.ts`：删除直接 `jree` 导入，非法参数改抛 `JavaIllegalArgumentException`。
- `test/node/event-emitter.test.ts`：新增零参数构造器异常合同回归；定向测试 `12/12`。
- change gate：`b9303f8..4ea1113` 判定 `T1`，`live_java_required=false`、`m1_minus_required=true`；原因包括完成责任边界、io/events 高风险路径和 semantic-token-change。
- M2：串行单测 `323` 项，`321` 通过、`2` 跳过、`0` 失败；非增量 `tsc=0`；build `sourceFileCount=137`；dist API 通过；迁移扫描结构性异常项为 `0`。
- jree 审计：`sourceFiles=138`、直接导入文件 `78`、`java.lang` 文件 `77`、`semanticReviewItems=88`；本批只减少 `OutputHandler` 的直接 jree 异常依赖。
- M1-：冻结标杆、TS-only、单线程、cold、逐文件串行，`244/244` functional/parity；`0` Java/TS diff、`0` exception、`0` marker missing、`0` 卡死式 timeout、`0` stall、`0` process limit、`0` not-run、`0` performance warning。243 项走 marker 路线；`nal6.redundant.nal` 无 marker，运行到 `1650/131072`，为 `unverified/not_reached`，不构成失败。
- M1- 证据：`H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\output-handler-m1-minus-20260919.jsonl`，大小 `773787 bytes`，SHA-256 `A9F5612679EEE60CBF1A9EA450DD9B500AD258E2F93FB36E39FCB3BB3FA4A593`；TS 总时长 `1681853 ms`，最长单文件 `361678 ms`，峰值 RSS `987963392 bytes`（约 `942.2 MiB`），实际 reasoning cycles `2288254`，观测速度约 `752.6 ms/1024 周期`，仅作功能保护和后续性能观测。
- Java 标杆未变化：source `8675b76fe8c21ee20a7b8c1b63408fb05327210d`，JAR SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`，冻结 JSONL SHA-256 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`；本批没有重新启动 Java。

本批可以宣称：`OutputHandler` 的非法参数异常边界已收窄，并通过局部合同、串行 M2、构建/API、静态审计和 T1 要求的 M1- `244/244` 保护矩阵。仍不能宣称 023/024 完成、jree 清零、完整 M1/#245 长期稳定性完成、markerless `131072` 周期等价、源码覆盖率达标、Java/TypeScript 全面性能等价或正式发布。代码提交 `4ea1113118985d659d09697bd9928f70fa65818f`，阶段报告为 `reports/20260919-130804.md`。

### 2026-09-19：`TextOutputHandler` 异常边界收窄

本批继续对照 canonical Java `TextOutputHandler.java` 做单一责任迁移。Java 的构造器重载由编译器约束；TypeScript 通过 varargs 入口承接这些重载，因此必须显式保留非法参数异常。本批只收窄异常类型，不迁移 `java.io.PrintWriter`、`PrintStream`、`StringWriter` 或输出格式实现。

- `src/io/events/TextOutputHandler.ts`：非法输出目标、构造器非法参数、静态重载非法参数、实例重载非法参数共 4 个分支改抛 `JavaIllegalArgumentException`；删除 `S`` 依赖后，空前缀保持为 `new java.lang.String("")`，维持 JavaString 类型合同。
- `test/node/event-emitter.test.ts`：增加 `TextOutputHandler.getOutputString()` 零参数调用的异常类型与消息回归；定向事件测试 `13/13`。
- change gate：`3703132..ba832bb` 判定 `T1`，`live_java_required=false`、`m1_minus_required=true`；本批没有修改 canonical Java，也没有重跑 Java。
- M2：完整串行单元测试 `324` 项，`322` 通过、`2` 跳过、`0` 失败；非增量 typecheck `0` 诊断；build `sourceFileCount=137`；dist API 通过；迁移扫描结构性异常项为 `0`。
- M1-：使用冻结 Java JSONL，TS-only、单线程、cold、逐文件串行且排除长期稳定性 #245；`244/244` functional/parity，`0` Java/TS diff、`0` exception、`0` 卡死式 timeout、`0` marker missing、`0` stall、`0` process limit、`0` not-run、`0` performance warning。243 项走 marker 路线；`nal6.redundant.nal` 无 Java marker，运行到 `1650/131072`，为 `unverified/not_reached`，不构成失败。
- M1- 证据：`H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\text-output-handler-m1-minus-244-20260919.jsonl`，大小 `773800 bytes`，SHA-256 `B9406695A6997606166CCAA9826A11E6FE2D9F34D7E40425C22FAA473A114365`；TS 总时长 `1818691 ms`，最长单文件 `397077 ms`，峰值 RSS `959414272 bytes`（约 `915.0 MiB`），reasoning cycles `2288254`，观测速度约 `813.87 ms/1024 周期`，仅作功能保护和后续性能观测。
- Java 标杆未变化：source `8675b76fe8c21ee20a7b8c1b63408fb05327210d`，JAR SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`，冻结 JSONL SHA-256 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`；本批没有重新启动 Java，结果中 `java_artifact=null`。
- jree 审计前→后：直接导入文件 `78→78`、`java.lang` 文件 `77→77`、Java String 文件 `49→49`、`semanticReviewItems=88→88`；`java.util=38`、`javaObjectFiles=1`、`newLinkedHashMap=0`、`newLinkedHashSet=1` 保持不变。数字不下降是预期结果：本批只移除异常构造和模板字符串依赖，`java.io` 输出类型仍是明确的平台边界。

本批可以宣称：`TextOutputHandler` 的非法参数异常边界已收窄，并通过局部合同、串行 M2、构建/API、静态审计和 T1 要求的 M1- `244/244` 保护矩阵；代码提交为 `ba832bb4465a8e584ebf2431b52f45fbc0018b8b`，阶段报告为 `reports/20260919-134955.md`。

本批仍不能宣称：023/024 完成、生产核心完全去 jree、完整 M1/#245 长期稳定性完成、`nal6.redundant.nal` 的 131072 周期等价、Java/TypeScript 全面性能等价、源码覆盖率目标完成或正式发布。

### 2026-09-19：`Tense` enum-like 边界原生化

本批对照 canonical Java `Tense.java` 做单一责任迁移。Java 的 `Tense` 只有 `Past`、`Present`、`Future` 三个枚举值，`Eternal` 是运行时 `null` 哨兵；原 TypeScript 通过 jree `java.lang.Enum<Tense>` 继承共享 `values()`，实际运行时返回 22 个值并混入其他枚举，造成枚举边界与 Java 不一致。本批只修正 enum-like 容器责任，不改 NAL 推理规则或时间语义。

- `src/language/Tense.ts`：删除 jree `Enum` 继承与匿名子类，改为原生 enum-like 单例；显式维护三项 `values()`、`name()`、`ordinal()`、`valueOf()`、`toString()` 和符号查表；保留 `Eternal` 运行时 `null`，字符串入口通过 `javaStringValue` 保持 Java boxed string 合同。
- `test/node/native-lookup-tables.test.ts`：增加三项枚举集合、名称、序号、显示文本、`valueOf` 成功/失败和 `Eternal=null` 回归。
- M2：完整串行单元测试 `324` 项，`322` 通过、`2` 跳过、`0` 失败；定向查表测试 `2/2`；显式非增量 `typecheck=0`；`test:build` `sourceFileCount=137`；dist API 通过（`cycles=2`、`cycleEnds=2`、`outputSignals=1`、`stopped=true`）；迁移扫描结构性异常项为 `0`。
- change gate：`classify-change-gate --base 09ccc4b --head 5721f4c --scope responsibility` 判定 `T1`，`live_java_required=false`、`m1_minus_required=true`；本批未修改 canonical Java，继续复用冻结标杆。
- M1-：TS-only、单线程、cold、逐文件串行，明确排除长期稳定性 #245；`244/244` functional/parity，`java_ts_diff=0`、`both_wrong=0`、`exception=0`、`marker_missing=0`、`卡死式 timeout=0`、`stall=0`、`process_limit=0`、`not_run=0`、`performance_warning=0`。243 项达到 Java marker 等价；`nal6.redundant.nal` 无 marker，运行至 `1650/131072`，状态为 `not_reached`，不构成失败或 markerless 长周期等价结论。
- M1- 证据：`H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\tense-m1-minus-244-20260919.jsonl`，大小 `773793 bytes`，SHA-256 `BFAEFF5F8B4F86475321DD42B14775DC72223205C27B9F7B33E472FF062C5382`；TS 总时长 `1849619 ms`，最长单文件 `399294 ms`，峰值 RSS `1022263296 bytes`（约 `974.91 MiB`），reasoning cycles `2288254`，观测速度约 `827.71 ms/1024 周期`，仅作后续性能优化数据。
- Java 标杆未变化且本批未重跑 Java：冻结 JSONL SHA-256 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`，canonical source `8675b76fe8c21ee20a7b8c1b63408fb05327210d`，JAR SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`，结果行 `java_artifact=null`。
- jree 审计前→后：直接导入文件 `78→77`、`java.lang` 文件 `77→76`、Java String 文件 `49→48`、`semanticReviewItems=88→87`；`java.util=38`、`javaObjectFiles=1`、`newLinkedHashMap=0`、`newLinkedHashSet=1` 保持不变。`src/runtime/jree-compat.ts` 仍是过渡兼容边界，不能把本批导入减少宣称为 jree 运行时退出。

本批可以宣称：`Tense` 的 jree Enum 责任已原生化，并通过局部合同、完整串行 M2、非增量类型检查、构建/API、静态审计、T1 gate 和 M1- `244/244` 保护矩阵；未观察到冻结 Java 标杆上的功能回退。代码提交为 `5721f4c16955e10a183e275e14ae7034ebcf478d`，批次报告为 `reports/20260919-151046.md`。

本批仍不能宣称：023/024 完成、生产核心完全去 jree、完整 M1/#245 长期稳定性完成、`nal6.redundant.nal` 的 markerless `131072` 周期等价、源码覆盖率目标完成、Java/TypeScript 全面性能等价或正式发布。

### 2026-09-19：`ProcessJudgment` Optional 私有搜索边界原生化

本批对照 canonical Java `ProcessJudgment` 的 Guava `Optional<Task>` 搜索合同做单一责任迁移。Java 的 `tryFind` 只用于表达“是否找到最强 eternal belief”；它不是领域 `Map`、`Set`、迭代器或顺序容器。TypeScript 将该私有结果收窄为 `Task | null`，保持空结果早退、非空任务继续进入既有目标概念前提登记和派发流程。

- `src/control/concept/ProcessJudgment.ts`：`tryFind` 由 `java.util.Optional<T>` 改为 `T | null`；`isPresent()`/`get()` 改为一次 null 守卫后的直接访问；未改变领域 `Map`/`Set`、belief 顺序或推理派发。
- `test/node/core-runtime.test.ts`：增加无 eternal belief 时 `addToTargetConceptsPreconditions` 安全返回的回归，覆盖 Java `Optional.empty()` 对应路径；定向核心回归 `43/43`。
- M2：串行单元测试 `325` 项，`323` 通过、`2` 跳过、`0` 失败；非增量 `tsc=0`；build `sourceFileCount=137`；dist API 通过；迁移扫描结构性异常为 `0`。
- change gate：`df91e69..eaa4415` 判定 `T1`，`live_java_required=false`、`m1_minus_required=true`；本批未修改 Java canonical，复用冻结标杆。
- M1-：TS-only、单线程、cold、逐文件串行，排除 #245；`244/244` functional/parity，`java_ts_diff=0`、`both_wrong=0`、`exception=0`、卡死式 `timeout=0`、`stall=0`、`marker_missing=0`、`process_limit=0`、`not_run=0`、`performance_warning=0`。243 项走 marker 等价路线；`nal6.redundant.nal` 无 marker，运行到 `1650/131072`，为 `not_reached`，不构成 markerless 长周期等价结论。
- M1- 证据：`H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\process-judgment-optional-m1-minus-244-20260919.jsonl`，244 行、773835 bytes，SHA-256 `E2927108B39AF0C6D24491EE00A5075066A2D780DDD648A0643EEE95FA0BDD47`；总时长 `1947998 ms`，最长单文件 `446740 ms`，峰值 RSS `959762432 bytes`（约 `915.4 MiB`），reasoning cycles `2288254`，观测速度 `871.73 ms/1024 周期`，仅作后续性能数据。
- Java 标杆未变化且本批未重跑 Java：source `8675b76fe8c21ee20a7b8c1b63408fb05327210d`，canonical JAR SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`，冻结 JSONL SHA-256 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`。
- jree 审计（`eaa4415`）：`directJreeImportFiles=77`、`java.utilFiles=38`、`java.langFiles=76`、`javaStringFiles=48`、`semanticReviewItems=87`、`newLinkedHashMap=0`、`newLinkedHashSet=1`。本批的 Optional 是私有控制流结果，不改变领域集合语义；直接导入计数不下降是预期结果。

本批可以宣称：`ProcessJudgment` 的私有 Optional 空值边界已收窄为原生 `Task | null`，并通过局部合同、M2、非增量类型检查、构建/API、静态审计、T1 gate 和 M1- `244/244` 保护矩阵，未观察到冻结 Java 标杆上的功能回退。代码提交为 `eaa441543380dacc261aa965df74151f17d937ea`，报告为 `reports/20260919-160303.md`。

本批仍不能宣称：023/024 完成、生产核心完全去 jree、完整 M1/#245 长期稳定性完成、`nal6.redundant.nal` 的 markerless `131072` 周期等价、源码覆盖率目标完成、Java/TypeScript 全面性能等价或正式发布。

### 2026-09-19：`Memory` Java String 输入边界原生化

本批继续沿 S1 的单一 jree 责任路线，对照 canonical Java `Memory.java` 收窄字符串输入边界。Java 的 `addNewTask`、`removeTask` 使用 `String reason` 进入事件载荷，`getOperator` 使用字符串作为 operator 注册表查找键；本批没有改变事件顺序、operator 注册表的 Map 语义或推理派发。

- `src/storage/Memory.ts`：`addNewTask`、`removeTask`、`getOperator` 改用项目已有的 `JavaStringInput`；输入同时接受 native string 和 boxed Java `String`，事件 reason 通过 `toJavaString` 保留 Java 字符串载荷，operator 查表通过 `javaStringValue` 归一化。
- `test/node/memory-string-boundary.test.ts`：新增事件 payload 类型、native/boxed reason 和 native/boxed operator 查表回归；定向测试 `1/1`。
- change gate：`8318b68..b536180` 判定 `T1`，`live_java_required=false`、`m1_minus_required=true`；代码提交为 `b5361806a6959e2be93fafe4051b3b485068b9b6`。
- M2：统一串行单测 `326` 项，`324` 通过、`2` 跳过、`0` 失败；非增量 `tsc=0`；build `sourceFileCount=137`；dist API `ok=true`；迁移扫描结构性异常项均为 `0`。
- M1-：使用冻结 Java JSONL、TS-only、单线程、cold、逐文件串行，`244/244` functional/parity；`0` Java/TS diff、exception、marker missing、卡死式 timeout、stall、process limit、not-run、performance warning。243 项走 marker 路线；`nal6.redundant.nal` 无 marker，短保护运行到 `1650/131072`，为 `not_reached/unverified`，不构成 markerless 长周期等价结论。
- M1- 证据：`H:\\A137442\\Develop\\AGI\\NARS\\_Project\\OpenNARS-304-ts-evidence-archive\\memory-string-boundary-m1-minus-244-20260919.jsonl`，244 行，SHA-256 `DDFF1D28562F50CDC979195254CFB9653ABA5E012AED46C5FCCBCE15A178A7CC`；TS 总时长 `1845766 ms`，最长单文件 `412163 ms`，峰值 RSS `1005223936 bytes`，最高 observed reasoning cycles `502562`，均作为后续性能观测。
- Java 标杆未变化且本批未重跑 Java：source `8675b76fe8c21ee20a7b8c1b63408fb05327210d`，canonical JAR SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`，冻结 JSONL SHA-256 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`，结果记录 `java_artifact=null`。
- 当前 jree 审计（`b536180`）：`directJreeImportFiles=77`、`java.utilFiles=38`、`java.langFiles=76`、`javaStringFiles=47`、`highRiskItems=41`、`semanticReviewItems=86`、`newLinkedHashMap=0`、`newLinkedHashSet=1`；`package.json` 仍声明 `jree@1.3.0`。

本批可以宣称：Memory 的 Java String 输入/事件边界已原生化，并通过局部合同、M2、T1 gate、构建/API、静态审计和 M1- `244/244` 保护矩阵。仍不能宣称 023/024 完成、jree 清零、完整 M1/#245 当前候选通过、`nal6.redundant.nal` 的 markerless `131072` 周期等价、Java/TypeScript 全面性能等价、源码覆盖率达标或正式发布。

### 2026-09-19：`Stamp` occurrence-time 与名称缓存字符串边界原生化

本批继续对照 canonical Java `Stamp.java`，只处理 `StringBuilder`、occurrence-time 文本和名称缓存这一类字符串构造责任。Java 的 `appendOcurrenceTime(StringBuilder)` 只要求向调用者提供的 builder 追加文本并返回同一对象；`ensureCapacity` 是容量优化，不是外部语义。`name()` 的声明返回 `CharSequence`，但实际缓存的是构造结果；因此 TypeScript 将内部缓存收窄为 boxed Java `String`，保留下游 `CharSequence` 消费面，不触碰 `Arrays`、随机数、Map/Set 或类身份。

- `src/entity/Stamp.ts`：删除 `Stamp` 对 `java.lang.StringBuilder` 的直接构造；`name()` 改为原生字符串片段拼接后通过 `toJavaString` 缓存，`getOccurrenceTimeString()` 保留 Java `String` 输出；`appendOcurrenceTime` 保留传入 builder identity 与 append-return 合同，并明确标注 Java 原类型。
- `test/node/stamp-string-boundary.test.ts`：新增非 eternal/eternal occurrence 文本、Java `StringBuilder` 追加、返回对象 identity、名称缓存复用和 occurrence 变化失效回归，定向 `3/3`。
- 代码提交：`1a14c297618e3c9021399861d7203c7d213e69f7`；T1 gate：`live_java_required=false`、`m1_minus_required=true`，原因是完成责任簇与 Stamp 高风险路径。
- M2：串行单测 `329` 项，`327` 通过、`2` 按 TS-only 规则跳过、`0` 失败；非增量 `tsc=0`；build、dist API、迁移扫描和 jree 审计通过。
- M1-：使用冻结 Java JSONL，TS-only、单线程、cold、逐文件串行，`244/244` functional/parity；`exception=0`、`marker_missing=0`、卡死式 `timeout=0`、`stall=0`、`process_limit=0`、`not_run=0`、`java_ts_diff=0`、`both_wrong=0`。其中 `243` 项走 marker 路线；`nal6.redundant.nal` 无 marker，观察到 `1650/131072` 周期，状态为 `not_reached`，不构成失败或 markerless 长周期等价结论。
- M1- 证据：`H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\stamp-string-boundary-m1-minus-244-20260919.jsonl`，SHA-256 `93943EC8A7080D561888BA8991F4B0CFC73648C617D48A6F1F5FB9F47DE8FB29`；TS 总时长 `1718635 ms`，最长单文件 `365953 ms`，峰值 RSS `967311360 bytes`（约 `922.5 MiB`），最高 `reasoning_cycles=502562`，均仅作为后续性能观测。
- Java 标杆未变化且本批未重跑 Java：source `8675b76fe8c21ee20a7b8c1b63408fb05327210d`，canonical JAR SHA-256 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`，冻结 JSONL SHA-256 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`，结果中的 `java_artifact=null`。
- 当前 jree 审计：`directJreeImportFiles=77`、`java.utilFiles=38`、`java.langFiles=76`、`javaStringFiles=47`、`highRiskItems=41`、`semanticReviewItems=86`、`candidateNativeItems=2`、`newLinkedHashMap=0`、`newLinkedHashSet=1`；唯一显式 `new LinkedHashSet` 位于 `jree-compat.ts` 的兼容性 clone 路径，不作为普通生产 Set 迁移点。

本批可以宣称：`Stamp` 的 occurrence-time、名称缓存和 builder 字符串边界已按 Java 合同原生化，并通过局部回归、M2、T1 gate、静态审计和 M1- `244/244` 保护矩阵。下一批应先做历史 NativeList/原生数组替换的前向语义审计，逐项核对 Java 原类型、equals/hashCode、顺序、迭代和可变性；不能宣称 023/024 完成、jree 清零、完整 M1/#245 当前候选通过、源码覆盖率达标、Java/TypeScript 全面性能等价或正式发布。

### 2026-09-19：`CompoundTerm.extractIntervals` Java List 契约恢复

本批是历史数组收窄的前向语义审查。canonical Java 的公开方法返回 `List<Long>`，TypeScript 初始转写却返回 `long[]`；本批没有把“当前调用者恰好能用数组”误当成公开契约，而是恢复 Java List 语义。

- `src/language/CompoundTerm.ts`：返回类型恢复为 `java.util.List<long>`，内部使用 `NativeList<long>`，递归收集使用 `add`。
- `src/inference/LocalRules.ts`：间隔读取恢复为 Java List 的 `size()`/`get()`。
- `test/node/narsese-temporal.test.ts`：新增 `NativeList` 类型、顺序、`size/get` 和空结果回归；首次定向运行捕获并修复了残留的 `.push()` 调用。
- M2：串行单元测试 `329` 项，`327` 通过、`2` 跳过、`0` 失败；非增量 `tsc=0`；build `137` 个源文件；dist API、迁移扫描和 jree 审计通过。
- change gate：`ec1b51a..e225312` 判定 `T1`，`live_java_required=false`、`m1_minus_required=true`；canonical Java 未改变，日常验证复用冻结标杆。
- M1-：TS-only、单线程、cold、逐文件串行、排除 #245；`244/244` functional/parity，`java_ts_diff=0`、`exception=0`、`marker_missing=0`、卡死式 `timeout=0`、`stall=0`、`process_limit=0`、`not_run=0`、`performance_warning=0`。243 项走 marker 路线；`nal6.redundant.nal` 为唯一 markerless 未达到 `131072` 周期的样本，观测 `1650/131072`，不构成失败或长周期等价结论。
- M1- 证据：项目外结果 SHA-256 为 `DEA8AAB1ECEC40976489ACC5B1790F4CF15BA561E6E103D27D536FAFBC2ADC10`；总时长 `1,860,912 ms`，累计 reasoning cycles `2,288,254`，峰值 RSS `995,500,032 bytes`（约 `949.3 MiB`），仅作为后续性能观测。
- 当前 jree 审计：直接导入文件 `77`、`java.util` 文件 `38`、`java.lang` 文件 `76`、Java String 文件 `47`、`highRiskItems=41`、`semanticReviewItems=86`；`newLinkedHashMap=0`、`newLinkedHashSet=1`，后者位于 `jree-compat.ts` 兼容路径。

本批代码提交为 `e225312`，报告提交为 `f333d23`，均已推送到 `origin/main`。本批可以宣称：`CompoundTerm.extractIntervals` 的 Java List 公开契约已恢复，并通过局部回归、M2、T1 和 M1- 保护矩阵；仍不能宣称完整 M1/#245 当前候选重跑通过、023/024 完成、jree 退场、源码覆盖率达标、性能等价或正式发布。

下一批候选优先审查 `Bag` 的 Java `Map`/哈希键、`equals/hashCode` 判重、迭代器删除与对象身份语义；先按 Java 声明和调用链确认是 Map、Set、List 还是排序集合，再选择 TypeScript 原生抽象，避免用数组冒充集合。

### 2026-09-19：Bag 名称 Map 类型边界与直接合同回归

本批继续在 023 的 J3 推理核心簇中做前向审查。canonical Java 的 `Bag.nameTable`
声明为 `HashMap<K, Type>`、实际初始化为有序 `LinkedHashMap`；TypeScript 的实际
实现已经是项目自有 `NativeMap`，但字段类型仍残留 jree `HashMap` 壳。本批只将
内部类型收窄为 `NativeMap<K, Type>`，并在 `itemTable` 二维原生数组旁明确注明
Java 原始类型 `ArrayList<ArrayList<Type>>` 与 FIFO 语义，没有改变哈希、判等、
插入顺序、分层队列或调度算法。

- 代码提交：`ca2b56a`；新增 Bag `iterator`、`contains`、`takeOut` 直接合同回归。
- M2：串行单测 `338` 项，`336` 通过、`2` 跳过、`0` 失败；非增量 `tsc=0`；
  build `137` 个源文件；dist API 通过；迁移扫描结构性异常为 0。
- J3 定向回归：Bag、TaskLink key、CompositionalRules 合计 `20/20` 通过。
- 受影响 NAL：`nal6.17.nal`、`nal4.recursion.nal`、`nars_transitivity.nal`、
  `toothbrush2.nal` 串行 `4/4` 通过；0 exception、0 marker missing、0 stall、
  0 timeout、0 process limit、0 Java/TS diff。使用冻结 Java 标杆
  `g0-java-baseline-26772af-20260917`，没有重复运行 Java。
- 结果证据位于项目外 `H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\bag-name-map-20260919-sentinel.jsonl`，SHA-256：
  `570D20B17F76203071E35C55F84B9A90B5238726D61AEA87FEA7EBDBD91D8509`。

本批只能宣称 Bag 类型边界和受影响哨兵没有回退，不能宣称 J3 收口、023 完成、
完整 M1/#245 当前候选通过或 jree 已清零。下一系列优先继续 J3 的 `NativeMap`、
领域对象 key、Set/Map 判等和迭代合同；确认责任簇出口前保持 V1 哨兵口径，不扩大
到完整 M1/#245。

### 2026-09-19：ProcessGoal 私有操作 Map 边界与 NativeMap 合同

本批继续 J3 的 Map 语义审查。canonical Java 的
`anticipationsToMake` 是 `Map<Operation, List<ExecutablePrecondition>>`，实际实现为
`LinkedHashMap`；TypeScript 之前已经创建 `NativeMap`，但仍以 jree `java.util.Map`
类型和通用工厂承载。本批将这一私有推理累积器直接收窄为
`NativeMap<Operation, ExecutablePrecondition[]>`，保留 Java 原类型、顺序和 equals
契约说明；Variables 所需的 substitution Map 边界没有改变。

- 代码提交：`898741d`；新增 NativeMap 视图删除、clone/equals/hashCode、putAll、
  entry 更新和迭代器删除合同测试。
- 串行 M2：342 项，340 通过、2 跳过、0 失败；非增量 `tsc=0`；build 137 个源文件；
  dist API 通过。
- J3 直接测试：Bag、TaskLink key、CompositionalRules `20/20`；NativeMap 单测 `9/9`。
- 受影响 NAL：`nal6.17.nal`、`nal4.recursion.nal`、`nars_transitivity.nal`、
  `toothbrush2.nal` 串行 `4/4` 通过；0 exception、0 marker missing、0 stall、
  0 timeout、0 process limit、0 Java/TS diff。使用冻结 Java 标杆，没有重复运行 Java。
- 证据文件位于项目外
  `H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\process-goal-native-map-20260919-sentinel.jsonl`，SHA-256：
  `9A77BCDE2FB2A40C5DD798F5D863D0686804776670E096E0ABE778EEE4EB4367`。

- 当前责任簇验证脚手架已由 `03a15e9` 推送并成为主线 HEAD；本批 ProcessGoal 代码提交位于该脚手架之前，结果与新 T1 risk-slice 规则一致。

本批仍不能宣称 J3 收口、023 完成、完整 M1/#245 当前候选通过、jree 清零或性能
等价。下一候选继续审查 NativeMap 的领域对象 key、恢复态和 Map/Set 交界；仍按
V1 哨兵推进，责任簇出口时才运行一次 M1-。

## 2026-09-19：阶段全景与下一系列修改路线

当前没有遗留运行中的实例测试；最近一批 J3 受影响 NAL 已串行完成。下一步不按
文件数量推进，而按责任簇和 Java 可观察语义推进：

1. J3：继续审计 `CompositionalRules`、`CompoundTerm.countTermRecursively`、
   `Variables`、`SyllogisticRules`、`Anticipate` 的 Map 外形、领域对象 key、
   equals/hashCode、插入顺序、live view、迭代删除和恢复态；先处理私有累积器，
   不把 substitution Map、计数 Map、预测 Map 当成同一种结构。
2. J3 前向审查：回到更早提交，逐项核对 List/Set/Map/排序集合/数组/builder
   的 Java 原类型；只有 Java 明确是数组且没有集合行为时才收窄为数组，代码中保留
   原类型和语义理由。
3. J1：拆分 `src/runtime/jree-compat.ts` 的纯值语义与宿主能力边界，逐项迁出
   Java String、数值包装、equals/hash 等可原生化合同；异常、日志、进程退出和
   Node 能力保留窄桥，并以直接合同和回归验证。
4. J2→J4→J5：依次处理语言/解析、operator/plugin、Nar/CLI/宿主入口；小簇采用
   局部合同+串行 M2+2～5 个受影响 NAL，责任簇收口才运行一次 M1-。024 的 P3～P5
   单独验收，最后与 023 在集成门禁汇合。
5. 语义稳定后再进入 020 性能优化，记录运行时长/推理周期、marker 时间戳和峰值
   RSS；日常切片复用冻结 Java 标杆，Java 只在 Java artifact、整项 spec 或集成
   验收时现开并验证三次存档一致。

### Spec 级 DAG 与 ASCII 进度

```text
[013 Java canonical]########## 完成
          |
          v
[023 jree 原生运行时]###------- 进行中：J1-J5，当前 J3
          |
          +--------[024 平台中立核心]#####----- 进行中：P0-P2 完成
          |                                      P3-P5 待做
          v
[023/024 集成门禁]---------- 尚未开始：245+1、M2、build、CLI/API
          |
          v
[020 性能与发布]########-- 计划大部完成，批准预算/发布边界待验收
          |
          v
[RC/正式发布]  ---------- 未开始
```

历史 spec 状态：001～004、006～007、009、013、018、019 已完成；005、008、020、
023、024 仍在 board 的 in-progress。上图的 `#` 只表达各 spec 已明确的计划/测试
项，不作为产品完成率；总体事实仍以 M1/M2/parity 矩阵、自动化测试、Git 和阶段报告
为准。当前 023 只可宣称若干已验证的局部原生化批次，不能宣称 J3 收口、023/024
完成、jree 清零、完整 M1/#245 通过、源码覆盖率达标或 Java/TypeScript 性能等价。

### 2026-09-19：Map 合同切片与下一批路线

本批先尝试一次性收窄 substitution/count Map，候选提交 `07f1c55` 同时触及 J1、J2、J3，责任簇门禁拒绝；已通过 `0a15e55` 可逆撤销。这个失败不是语义结论，而是验证边界结论：跨三个责任簇的 Map 合同必须拆开，避免一个切片同时改变运行时、语言和推理核心。

随后完成有效的 J1 切片 `bb688ca`：`src/runtime/NativeMap.ts` 增加项目内 `MapContract<K,V>`，`NativeMap` 显式实现该合同；`test/node/native-map.test.ts` 增加直接合同回归。J1 计划有效，局部直接测试 `9/9`，串行 M2 为 `343` 项、`341` 通过、`2` 跳过、`0` 失败，非增量 typecheck、build、dist API 和审计通过。

J1 受影响 NAL 采用冻结 Java 标杆的 TS-only 串行验证：`nal1.0.nal`、`nal6.17.nal`、`toothbrush.nal` 为 `3/3` functional/parity；0 exception、0 marker missing、0 stall、0 timeout、0 process limit、0 Java/TS diff。证据为项目外 `map-contract-j1-20260919-sentinel.jsonl`，SHA-256 `D3722078014F91D8D55EF0E613D77FC832EDAE565AD867C09967D9525461CD48`。

下一系列按单簇推进：先 J2 的 substitution/count Map（`CompoundTerm`、`Term`、`Variable`、`Variables`），再 J3 的推理 Map（`CompositionalRules`、`SyllogisticRules`、`ProcessAnticipation`、`ProcessJudgment`、`ProcessGoal`），之后审计 Set、排序集合、equals/hashCode、迭代删除和 `jree-compat.ts` 桥接职责。每批保留 Java 原类型注释与语义理由；普通切片只跑局部合同、串行 M2 和 2～5 个受影响 NAL，责任簇收口才跑一次 M1-。

```text
013 Java baseline                         [##########] 完成
023 jree 原生运行时                       [##--------] J1合同完成，J2/J3/J4/J5待推进
024 平台中立核心                          [####------] P0-P2完成，P3-P5待推进
023+024 集成门禁                         [----------] 尚未开始
020 性能与发布                           [########--] 预算与发布边界待验收
RC/正式发布                              [----------] 未开始
```

该图只用于阶段导航；它不把 spec 复选框、测试数量或导入数量当作产品完成率。当前仍不能宣称 023/024 完成、jree 清零、完整 M1/#245 当前候选通过、源码覆盖率达标或 Java/TypeScript 性能等价。

### 2026-09-19：J2 substitution Map 合同切片

J2 本批只处理语言层 substitution Map，不把 count Map 的公共返回合同伪装成已完成。`src/language/CompoundTerm.ts` 的 `applySubstitute`/`applySubstituteToCompound` 与 `src/language/Variables.ts` 的 `findSubstitute`、Map 对复制/追加辅助函数已改用 J1 建立的 `MapContract`；两张 Map 的 Java 数组结构、NativeMap 插入顺序、equals/hashCode 和 Java `LinkedHashMap` 输入兼容均保留。`countTermRecursively` 仍保留 Java Map 公共签名，因为当前 `ProcessGoal`、`ProcessJudgment`、`CompositionalRules` 三个 J3 调用点尚未一起迁移。

本批代码提交为 `bb4f112`。J2 T1 计划 `plan_valid=true`，不要求现跑 Java 或 M1-。定向合同/变量统一测试 `7/7`；串行 M2 为 `346` 项、`344` 通过、`2` 跳过、`0` 失败；非增量 typecheck 为 0 诊断；build 源文件 `137`、dist API、迁移扫描和 jree/platform 审计通过。

受影响 NAL 使用冻结 Java 标杆、TS-only、单线程、cold、逐文件串行：`nal4.7.nal`、`nal6.17.nal`、`nal8.add.nal`、`nars_transitivity.nal` 为 `4/4` functional/parity；0 exception、0 marker missing、0 stall、0 timeout、0 process limit、0 Java/TS diff。`nars_transitivity.nal` 观察到 `211550` reasoning cycles，耗时约 `105770 ms`，仅作为性能观测。证据文件为项目外 `map-contract-j2-20260919-sentinel.jsonl`，SHA-256 `D4875EED3D7A253568D66CB66496D4CA6F6E0DA25210543794DC0C6D52F055B9`。

下一批应由 J3 owner 处理 count Map 公共返回合同，并同步 `CompositionalRules`、`ProcessGoal`、`ProcessJudgment` 等调用者；之后再处理 J3 的推理 substitution Map、Set/排序集合和迭代删除。当前仍不能宣称 J2 完成、J3 收口、023/024 完成、jree 清零、完整 M1/#245 当前候选通过、源码覆盖率达标或 Java/TypeScript 性能等价。

### 2026-09-19：J3 count Map 消费者合同切片

在 J2 substitution Map 已推送的基础上，本批先处理 J3 消费者而不改 J2 生产者：`ProcessGoal`、`ProcessJudgment`、`CompositionalRules` 的局部 `termCounts` 改用 `MapContract<Term, Integer>`。三处只使用 `keySet()`，因此没有改变 count Map 的领域 key、计数、插入顺序或推理算法；`Term/Variable/CompoundTerm.countTermRecursively` 仍保留 Java Map 公共返回合同，留待下一批 J2 生产者切片。

代码提交为 `092b2d2`。J3 T1 计划 `plan_valid=true`，不要求现跑 Java 或 M1-；直接测试 `20/20`，串行 M2 为 `346` 项、`344` 通过、`2` 跳过、`0` 失败；非增量 typecheck 为 0 诊断；build/API、迁移扫描、jree/platform 审计通过。

受影响 NAL 使用冻结 Java 标杆、TS-only、单线程、cold、逐文件串行：`nal6.17.nal`、`nal4.recursion.nal`、`nars_transitivity.nal`、`toothbrush2.nal` 为 `4/4` functional/parity；0 exception、0 marker missing、0 stall、0 timeout、0 process limit、0 Java/TS diff。`nars_transitivity.nal` 观察 `211550` 周期，`toothbrush2.nal` 观察 `201550` 周期；性能只作为后续观测。证据文件为项目外 `count-map-j3-20260919-sentinel.jsonl`，SHA-256 `11EC6D2EF7342E56FB0AD14FA1AA0D98BA143E1A210F84C521EBBDFB69F0C03E`。

下一批再由 J2 修改 `Term/Variable/CompoundTerm` 的 count Map 生产者返回合同；随后回到 J3 处理推理 substitution Map。当前仍不能宣称 J2 count Map、J3 收口、023/024 完成、jree 清零、完整 M1/#245 当前候选通过、源码覆盖率达标或 Java/TypeScript 性能等价。

### 2026-09-19：J2 count Map 生产者合同切片

本批在 J3 消费者已收窄的基础上，完成 J2 `Term`、`Variable`、`CompoundTerm` 的 count Map 生产者合同。三个 `countTermRecursively` 入口改用 `MapContract<Term, Integer>`，空累加器仍创建有序 `NativeMap`；递归计数、Java 值相等、插入顺序和 Java Map 输入兼容均未改变。

- 代码提交：`b2b8d7e refactor(023): 收窄语言层计数Map生产者合同`。
- 定向合同测试：`46/46`；串行 M2：`346` 项，`344` 通过、`2` 跳过、`0` 失败。
- 非增量 `tsc`：0 诊断；build/API、迁移扫描、jree/platform 审计通过。
- 当前 jree 审计：direct import 77，`java.util` 35，`java.lang` 76，Java String 47，high-risk 41，semantic review 82，`newLinkedHashMap=0`、`newLinkedHashSet=1`。
- 受影响 NAL 使用冻结 Java 标杆、TS-only、单线程、cold、逐文件串行：`4/4` functional/parity；0 exception、0 marker missing、0 卡死式 timeout、0 stall、0 process limit、0 Java/TS diff。
- 证据：`H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\count-map-j2-20260919-sentinel.jsonl`，SHA-256 `BB536CF38F60E4BCCBFA07597C65C1E179C931085EA608C097029600A8113F83`。
- 性能观测：`nars_transitivity` 为 211550 周期、111209 ms、峰值 RSS 390.4 MiB；仅用于后续优化，不改变本批逻辑验收。

本批可以宣称：语言层 count Map 生产者已收窄到项目内 `MapContract`，并通过局部合同、M2、非增量类型检查、build/API、审计和受影响 NAL 标杆对照。仍不能宣称 J2/J3 责任簇整体完成、023/024 完成、jree 清零、完整 M1/#245 当前候选通过、源码覆盖率达标或 Java/TypeScript 性能等价。

下一批先做 J3 推理 Map 的前向语义审查，优先核对领域对象 key、Set/Map 交界、equals/hashCode、live view 与迭代删除；仍保持单一责任簇、小范围直接合同、串行 M2 和受影响 NAL，责任簇收口后才运行 M1-。

### 2026-09-19：J3 CompositionalRules substitution Map 合同切片

本批对照 canonical Java `CompositionalRules.java`，确认 `res1`～`res4`、`app`、`mapping` 以及私有辅助参数的原始合同为 `Map<Term, Term>`，实现为 `LinkedHashMap`。TypeScript 只将这些短生命周期内部表从 jree `java.util.Map` 静态类型收窄到项目 `MapContract<Term, Term>`，实际仍使用 `NativeMap`；没有改变 Term 的 Java 值判等、插入顺序、随机调用、Set/List 语义或推理算法。

- 代码提交：`9221757 refactor(023): 收窄组合规则替换Map合同`。
- T1 计划：`plan_valid=true`、`live_java_required=false`、`m1_minus_required=false`；直接 J3 测试 `20/20`。
- 串行 M2：`346` 项，`344` 通过、`2` 跳过、`0` 失败；非增量 `tsc=0`；build/API 通过。
- 受影响 NAL：`nal6.17 4/4`、`nal4.recursion 1/1`、`nars_transitivity 2/2`、`toothbrush2 2/2`；无 exception、marker missing、stall、卡死式 timeout、process limit 或 Java/TS diff。
- 证据文件：`H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\compositional-map-j3-20260919-sentinel.jsonl`，SHA-256 `515D0BE42768D4DA0E5FB0DA7AC0816BB31141357DCC9FFD383F60040463AD3C`。
- 性能观测：`toothbrush2` 为 201550 周期、106432 ms、峰值 RSS 936.2 MiB；只作为后续性能观测。

下一批优先审查 `ProcessGoal` 私有 substitution Map，再单独处理 `SyllogisticRules`/`TemporalRules` 的 Map/List 边界；继续保持 J3 单责任簇和 V1 哨兵口径。

### 2026-09-19：ProcessGoal/ProcessAnticipation substitution Map 合同切片

本批对照 canonical Java `ProcessGoal.java` 与 `ProcessAnticipation.java`，确认
`ExecutablePrecondition.substitution`、`subsconc`、`subsBest`、复制表以及
`anticipate` 参数的原始合同均为 `Map<Term, Term>`，实际实现为 `LinkedHashMap`。
TypeScript 仅把同一闭环的静态边界收窄为项目 `MapContract<Term, Term>`，并保留
`NativeMap` 的 Java 值判等、插入顺序和 `entrySet()` 复制兼容；没有把 Map 改成
List、Set 或普通对象，也没有改变推理算法。

- 代码提交：`270c7f9 refactor(023): 收窄目标预测替换Map合同`，已推送到 `origin/main`。
- T1 计划：`plan_valid=true`、`live_java_required=false`、`m1_minus_required=false`。
- 直接回归：`58/58`；标准 J3 直接测试：`20/20`；串行 M2：`346` 项，`344` 通过、
  `2` 跳过、`0` 失败；非增量 `tsc=0`；build `137` 个源文件；dist API 通过。
- 受影响 NAL：`nal6.17.nal`、`nal4.recursion.nal`、`nars_transitivity.nal`、
  `toothbrush2.nal` 串行 `4/4` functional/parity；0 exception、0 marker missing、
  0 stall、0 timeout、0 process limit、0 Java/TS diff。
- 证据位于项目外
  `H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\process-goal-map-j3-20260919-sentinel.jsonl`，
  SHA-256：`E193B8BB6BC1B16B1AE63AEB92C47F7D2EE6CD3CF595246EEE4D57CEFD4160D8`。
- 当前审计：直接 jree 导入文件 `77`、`java.util` 文件 `34`、`java.lang` 文件 `76`、
  Java String 文件 `47`、`highRiskItems=41`、`semanticReviewItems=81`；
  `newLinkedHashMap=0`、`newLinkedHashSet=1`。后者仍在兼容路径，不能据此宣称 jree 已退场。

本批之后，J3 的下一组候选已经完成只读审查：先单独收窄 `TemporalRules` 的 Java
`List<Task>` 返回/参数与 `NativeList` 强制转换，再单独收窄 `SyllogisticRules` 的
`LinkedHashMap<Term, Term>` 临时替换表；不把 List 与 Map 合并成一个迁移批次。

### 当前全局 spec 级进度（阶段导航，不替代功能事实）

LeanSpec 当前共 15 项：10 项 complete，5 项 in-progress。下面的条形只表达
spec 的阶段状态和计划项，不把 spec 数量、复选框、测试数量或导入数量当作产品完成率；
产品事实仍以 M1/M2/parity 矩阵、自动化测试、Git 和阶段报告为准。

```text
001 翻译评估                         [##########] complete
002 进度报告                         [##########] complete
003 依赖简析                         [##########] complete
004 依赖展开                         [##########] complete
005 TruthValue 适配                  [#######---] 6/8，in-progress
006 TruthValue 纯 TS                 [##########] complete
007 Texts 纯 TS                      [##########] complete
008 Distributor 纯 TS                [##--------] 2/8，in-progress
009 Java 源码头                      [##########] complete
013 Java 3.0.4 canonical             [##########] complete
018 TS 功能等价                      [##########] complete
019 tsc 零诊断构建                   [##########] complete
023 jree 原生运行时                  [##--------] J1合同与J2/J3切片进行中
024 平台中立核心                     [#####-----] P0-P2完成，P3-P5待做
020 性能与发布                       [########--] 计划项基本完成，性能预算待验收
```

### 当前阶段 DAG

```text
[013 Java canonical]########## 完成
          |
          v
[023 jree 原生运行时]##-------- J1合同 + J2/J3局部切片，J3未收口
          |
          +--------[024 平台中立核心]#####----- P0-P2完成，P3-P5待做
          |                                      |
          +--------------------------------------+
                                                 v
                 [023/024 集成门禁]---------- 未开始：现跑Java、245+1、M2、CLI/API
                                                 |
                                                 v
                 [020 性能与发布]########-- 依赖集成门禁，尚有性能预算验收
                                                 |
                                                 v
                 [RC/正式发布]  ---------- 未开始，需用户明确授权
```

从项目开始到当前的主线可概括为：先完成 Java 304 canonical、TS 功能等价与零诊断
构建；随后完成平台边界的 P0-P2；023 先建立 `NativeMap`/MapContract 等项目内
合同，再按 Java 原始类型逐批迁移数组、字符串、可选结果和 Map。当前静态 jree
审计从早期 105 个直接导入文件降到 77 个；这只是迁移量指标，不是等价性证明。
当前仍不能宣称 023/024 完成、jree 清零、完整 M1/#245 当前候选通过、源码覆盖率
达标或 Java/TypeScript 性能等价。

### 2026-09-19：TemporalRules List 合同切片

本批对照 canonical Java `TemporalRules.java`，确认 `temporalInduction` 的原始返回
为 `List<Task>`，短生命周期实现为 `ArrayList<Task>`；`appendConclusion` 接受同一
List 合同。TypeScript 原先已经用 `NativeList` 存储，却用 `java.util.List` 类型和
强制转换把 jree 边界继续暴露。本批将 `TemporalRules.temporalInduction`、
`TemporalRules.appendConclusion` 以及直接转发层
`TemporalInferenceControl.proceedWithTemporalInduction` 收窄到 `NativeList<Task>`，
空结果也改为新的空 `NativeList`。上游 `DerivationContext.doublePremiseTask` 的
Java-shaped List 生产者暂不改变，留作下一独立合同批次。

- 代码提交：`0eaf098 refactor(023): 收窄时间规则List合同`。
- T1 计划：`plan_valid=true`、`live_java_required=false`、`m1_minus_required=false`；
  生产源码 2 个文件、26 行变更，单一 owner 为 J3。
- 直接相关测试：`44/44`；串行 M2：`346` 项，`344` 通过、`2` 跳过、`0` 失败；
  非增量 `tsc=0`；build `137` 个源文件；dist API 通过。
- 受影响 NAL：`nal6.17.nal`、`nal4.recursion.nal`、`nars_transitivity.nal`、
  `toothbrush2.nal` 串行 `4/4` functional/parity；0 exception、0 marker missing、
  0 stall、0 timeout、0 process limit、0 Java/TS diff。
- 证据位于项目外
  `H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\temporal-rules-list-j3-20260919-sentinel.jsonl`，
  SHA-256：`70B0630235C5187616B7F8DFF61BC73162692E380115C45F38CD0E8E3DAA4AB9`。
- 性能观测：四个样本分别为 `2919/251.6`、`8328/331.3`、`107938/378.1`、
  `102467/993.2`（毫秒/MiB）；仅作为后续性能观测。

本批可以宣称 TemporalRules 及其直接转发层的 List 结果边界已原生化并通过验证；
不能宣称 J3 责任簇收口、023/024 完成、jree 清零、完整 M1/#245 当前候选通过、
源码覆盖率达标或 Java/TypeScript 性能等价。下一批先处理
`DerivationContext.doublePremiseTask` 的 List 生产者及直接消费者，再单独处理
`SyllogisticRules` 的 Map 临时表。
