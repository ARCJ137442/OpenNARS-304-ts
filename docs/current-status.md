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
