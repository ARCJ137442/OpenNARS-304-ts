# OpenNARS-304-ts 当前状态

- 状态日期：2026-09-16（Asia/Shanghai）
- 代码冻结点：`17cec541f535d83bd62e5b15ee9c03f4a2233812`
- 包版本：`0.1.0`

本文是项目封存后的唯一状态入口。README 只保留必要摘要；历史报告、旧战略和 Agent 提示词不得覆盖本文的状态结论。

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
