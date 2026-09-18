# OpenNARS-304-TS 当前开发目标与验收计划

> **现行目标文件**。交给开发 Luna Agent 前，先读取 [当前状态](current-status.md)、[开发者指南](developer-guide.md)、根目录 `AGENTS.md`、最新已完成报告及 LeanSpec board。本文规定决策与门禁，不重复维护动态 HEAD、通过率或残余数量。两份旧 Luna 提示词是历史资料，不能作为现行命令。

## 总目标与当下起点

在 OpenNARS 3.0.4 canonical Java 的固定单线程语义基线上，保留 M1 功能等价与 M2 零诊断构建成果，依次完成 `023` 去 jree、`024` 平台中立、同提交 J/P 集成验收、`020` 正式性能优化、单一 `OpenNARS` 公共门面及单 JS + 单 `.d.ts`、Shell/Web 外壳、文档和发布候选。tag、GitHub Release、npm 与网站覆盖只在用户当次明确授权后执行。

**第一项当前工作不是再做 G0。** `9bd6cc0` 已有完整 G0 证据。最新 Bag `NativeMap` 切片的 `toothbrush2.nal`、`nars_multistep_3.nal` 在 M1- 被进程安全上限截断。先固定 `f1cf976` 与 `f952a02` 做同条件 A/B 和 profile，恢复两项 marker 的可观察性，然后才扩张 023/024。`NativeMap` 线性查找是待证实的热点假说，不是已确认根因。保留来源不明的未跟踪草稿报告。

## Java 标杆复用的硬条件

普通小批次只运行 TypeScript，对照冻结 Java JSONL；不现跑 canonical Java。复用前确认 canonical Java source commit、JAR SHA-256、classes/test-classes、Java 依赖、JDK、NAL 内容与顺序、额外夹具、配置、随机种子、单线程、runner 解析/marker/周期/超时/结果 schema、冻结标杆 SHA-256 和 manifest 均未变化。任一不变量变化或无法确认，升为 T2。T2 现跑 Java 后必须逐字段核对旧标杆；不一致先调查，不能自动刷新预言。多线程是后续独立课题。

## T0/T1/T2 可操作判别

每个**已提交候选**运行以下工具；工作区未提交修改不在脚本计算中：

    node scripts/checking/classify-change-gate.mjs --base <上次验收提交> --head HEAD

完成一类 jree 责任或大模块时追加 `--scope responsibility`；这里的“完成一类责任”是收口一个已枚举的 jree 责任类或一个大模块，不是单个普通类/单文件切片。阶段验收追加 `--stage 023|024|integration|rc`。JSON 中的 `tier` 是最低门，`m1_minus_required` 指示该 T1 批次是否必须跑整份 M1-，不是等价证书；脚本漏报或实测异常只能升级。不能凭 Agent 主观判断降级；例外需可复核证据及用户批准。

| 门 | 量化触发 | 必做验证 |
| --- | --- | --- |
| T0 日常切片 | 未命中 T1/T2；生产源文件 ≤2 个且生产 TypeScript 源总改动 ≤80 行 | 生产改动：直接正常/异常合同、`npm test`（TS-only）、非增量 typecheck、build、dist API、静态审计和受影响 NAL；没有对应 NAL 时记录调用链。纯文档/测试工具改动只做适用的静态检查和工具回归，不需无关 NAL |
| T1 风险簇 | `src/control|inference|storage|language|entity|operator|plugin|main|runtime|platform|io` 任一路径，即使只改一行；diff 命中集合判等、迭代、随机、float、派发等语义词；生产源文件 ≥3 或生产 TypeScript 源总改动 >80 行；完成一类 jree 责任；或 T0 出现退化 | T0 全部＋至少 2 个受影响 NAL 和 1 个已通过样本的定向探针；`m1_minus_required=true` 才加跑 TS-only M1- 244 项。高成本探针已红时，先诊断，不启动整份 M1- |
| T2 阶段门 | Java/fixture/配置/runner/运行依赖基线变化；023/024 整体验收、J/P 集成、RC；或冻结标杆失效 | 现跑单线程 canonical Java；完整 245+1 M1、两个无 marker 样本严格长周期观察、完整含 Java 的 M2、Node/真实浏览器及依赖扫描 |

路径与行数规则的可执行版本是 `scripts/checking/change-gate-policy.mjs`，并有自动化测试。`>80` 门只统计 `src/**/*.ts`、`.tsx`、`.mts`、`.cts` 的生产源文件行数；测试/规格文件、`test`/`tests`/`__tests__` 目录、报告、文档、脚本和其他非 TypeScript 文件均不计入。`m1_minus_required` 在存储/调度/推理热路径、关键链接/变量/原生容器、≥3 个生产文件、生产源改动 >80 行或 `--scope responsibility` 时为真；一般平台/IO 小切片先做定向验证，不机械启动 244 项。即使脚本未命中，变更实质位于 Bag、TaskLink、TermLink、RuleTables、随机数或类身份热路径时也必须升级 T1 和 M1-，并在报告指出调用链。`M1-` 是不含 #245 的 244 个普通主资源保护矩阵；`simpleOperationTest.nal` 按影响另做定向测试。无 marker 样本的短运行不能代替 131072 周期严格摘要。

## 测试入口与零 Java 纪律

- `npm test`、`npm run test:unit:serial` 是日常 TS-only 单测。两项必须现跑 Java 的测试显式跳过；入口对直接和经继承 Node 子进程发起的 Java 启动设置拦截。报告分别列 pass/skip，不把 skip 算通过。
- `npm run test:unit:with-java` 是阶段完整串行单测；`npm run test:parity:local` 也现跑 Java。两者只用于 T2 或经批准的基线实验，不混入 T0/T1 摘要。
- 日常 M2-TS 还包含 `npm run typecheck`、`npm run test:build`、`npm run test:api:dist`。阶段 M2-full 追加现跑 Java 的合同、CLI/Shell 和包检查。
- T0/T1 NAL 必须以 `--engine ts --java-baseline <冻结 JSONL>` 运行，记录 `java_artifact=null` 与标杆 SHA-256。若实际启动 Java，结果不得称为 TS-only。

长矩阵只保留一个进程及唯一 checkpoint/resume；不做空轮询，不在运行时修改被测代码。完成消息到达后先解析完整结果，再形成结论。

## 功能、性能、观察未完成的边界

- 有 Java marker 的夹具：所有对应 marker 匹配且运行完整，走 marker 路线，不附加 131072 周期条件。
- 无 Java marker 的夹具：达到 131072 个**实际**周期且分段事件窗口一致，走长周期路线。路线按夹具预先确定，不是 marker 失败后的任意替代。
- 逻辑分叉、错误事件、完整运行后的 marker 不匹配或异常是功能失败；`not_run` 单列。
- 进程上限命中但仍推进：`performance_warning=true`、语义结论 `unverified`、验收 `pass=false`；既非已证实语义错误，也不能计为功能通过。
- 约 180000 ms 无**周期或事件进展**才是 stall 候选；没有用户可见 OUT 不等于卡死。watchdog 与总进程上限分开统计。
- 性能记录 wall/CPU/RSS、冷/热模式、实际完成周期、ms/1024 实际周期和同条件 Java 比率。截断样本不使用计划周期计算速度，也不外推全程平均值。

当前 Bag 报告中的 `201550/502562` 是计划周期；原始 JSONL 的 `last_progress_cycle` 是 `170381/296192`。两项 marker 尚未观察完成。此纠正只影响文字和后续指标，不改写原始证据。

## 执行阶段与停止条件

1. **S0 当前候选稳定**：固定 A/B 提交、配置与硬件，对两项失败样本至少做 2 次同口径定向测量并取得 profile；先证实热点，再做一处最小修复或有证据的回退提交。局部合同、M2-TS 与 T1 通过前不开新迁移簇。
2. **S1 023/024 纵向切片**：每批只改一个 jree 责任或平台能力边界；先 Java 源码/冻结标杆合同，再最小实现和分层回归。P3→P4→P5 可与 jree 责任簇交错，但同时只保持一个未提交代码批次。每批记录直接导入、JavaObject、集合构造、核心 Node 引用和浏览器 shim 差值。
3. **S2 J/P 阶段验收**：023 核心 jree 运行时、公共类型泄漏与运行时依赖退场；024 宿主能力、浏览器配置/上传及 shim 可达图闭合。在同一不可变提交按 T2 完成 M1/M2、Node/真实浏览器验证后，才分别关闭 spec。
4. **S3 020 正式性能门**：功能冻结后再做重复测量、profile 与有界优化。S0 的阻断性性能问题是功能可观察性修复，不是无边界 M3。023 现写有每 1024 周期 60000 ms、相对 Java ≤16 倍；若拟将严格预算移交 020，须先取得用户确认并同步修订 023，不能默默忽略。
5. **S4 公共接口与发布准备**：先搜索 LeanSpec，确无现行公共门面/bundle spec 才用工具创建。冻结唯一 `OpenNARS` 类，完成 `opennars-304-ts.lib.js` 和唯一核心 `.d.ts`；Shell/Web 为无 `.d.ts` 的外壳。完成使用文档、历史 Agent 文档分级、版本/构建时间/哈希 manifest、Node/浏览器/CLI/Shell 消费者复验与 RC。
6. **S5 发布**：仅按用户当次授权执行 tag、GitHub Release、npm 或网站覆盖；RC 不自动触发发布。

任何未分类语义差异、M2 退化、标杆失效或 T1/T2 未完成，立即停止扩大迁移范围。先找最早可观察分歧；性能回退要证明与改动的因果关系，不能仅以时间相邻下结论。

## 每批交接

先写“可以/不能宣称”，再列不可变 commit、风险脚本 JSON、门禁等级、Java 标杆 SHA、测试命令及 pass/skip/exception/stall/process_limit/not_run、实际进展周期、原始证据、性能和依赖审计差值、剩余问题及下一项可证伪实验。当前事实只更新 `docs/current-status.md`，README 只保留摘要入口。LeanSpec 状态只按真实验收变更，不因暂停或局部通过标记 complete。
