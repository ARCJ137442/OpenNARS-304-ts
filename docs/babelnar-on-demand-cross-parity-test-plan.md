# BabelNAR 按需横向一致性测试计划与 Luna Agent 提示词

> **暂缓计划（未执行）**：截至 2026-08-27，本仓库没有运行本文所述 BabelNAR 全量测试，也没有生成其 Java/TypeScript 矩阵。本文只保存测试设计；恢复前必须重新固定被测 artifact，并核对[当前状态](current-status.md)。

## 1. 文档定位

本文是 OpenNARS 3.0.4 TypeScript 的后续测试计划与执行提示词，当前状态为 **Planned / 尚未执行**。

当前只完成以下事项：

- 固化测试目标、边界、任务 DAG、证据合同和完成条件；
- 为后续独立测试 Luna Agent 提供可直接复制的长期提示词；
- 把 BabelNAR 定位为面向不可变发布候选的**人工按需验收工具**。

当前明确不做：

- 不运行 BabelNAR 测试；
- 不构建 BabelNAR CLI；
- 不生成 Java/TypeScript 测试矩阵；
- 不修改 OpenNARS 推理算法；
- 不新增 GitHub Actions、定时任务或每次提交自动运行的持续集成；
- 不把尚未执行的测试计划计入项目通过率。

本文记录的是未来工作的起点，不是已经取得的测试证据。

## 2. 当前决策

### 2.1 测试触发方式

BabelNAR 测试由维护者在以下场景手工触发：

1. OpenNARS-304-TS 已产生一个可独立消费的 JavaScript 构建产物；
2. 准备验证 release candidate、npm tarball 或正式发布产物；
3. 功能冻结、运行时原生化或性能优化之后，需要检查语义是否回退；
4. 发现具体规则、协议或 NAL 层级差异，需要细粒度复现。

默认不要求持续集成。若未来确实需要 CI，应另立任务评估运行时间、Windows 进程管理、Java/Rust/Node 工具链和 artifact 缓存，不得由本计划自动推导出 CI 范围。

### 2.2 TypeScript 被测对象

主门禁只测试不可变的可发布 JavaScript artifact，优先级如下：

1. 从固定 commit 执行 `npm pack` 后，在干净临时目录安装得到的包；
2. 从同一固定 commit 干净构建得到的 `dist`；
3. 源码 loader 入口仅用于诊断构建前后差异、冷启动或 source map，不作为发布通过率的主要依据。

当前包已经声明以下正式入口，后续执行前仍须从被测 artifact 的 `package.json` 重新确认：

- 库入口：`dist/index.js`；
- CLI：`dist/cli.mjs`，bin 名称 `opennars-304`；
- 交互 Shell：`dist/shell.mjs`，bin 名称 `opennars-304-shell`。

测试系统不得依赖 TypeScript 源码 loader 才能完成主矩阵。BabelNAR 应把 JavaScript 构建产物当作普通外部进程，通过 stdin/stdout 协议测试。

### 2.3 与现有测试门的关系

- 现有 245+1 功能冻结矩阵继续负责 OpenNARS 自带 NAL 资源的广覆盖 Java/TypeScript 对照；
- BabelNAR 负责细粒度规则预言、输出通道和跨实现适配；
- 两者样本高度重叠，不得相加成 360 个独立样本；
- BabelNAR 不替代单元测试、typecheck、构建检查、npm tarball 安装验证和独立性能基准；
- BabelNAR 搜索步数与带人工等待的 wall time 不得作为算法性能结论。

## 3. 权威输入与执行前复核

### 3.1 工作目录

- TypeScript：`$OPENNARS_TS_ROOT`
- BabelNAR 测试套件：`$BABELNAR_TEST_ROOT`
- BabelNAR.rs：`$BABELNAR_RS_ROOT`
- BabelNAR CLI：`$BABELNAR_CLI_ROOT`
- Java canonical：`$JAVA_CANONICAL_ROOT`

### 3.2 当前记录的 Java canonical

- source commit：`8675b76fe8c21ee20a7b8c1b63408fb05327210d`
- JAR：`target\opennars-3.0.4-SNAPSHOT.jar`
- SHA-256：`2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`

旧 BabelNAR 套件中的 `opennars-304-T-modified.jar`，已记录 SHA-256 为 `9F9FA941E0FE74D7F526D108C9C080A91470FA2E9D790807CD67466F7BB86F8A`，只能作为历史背景，不能成为 Java canonical。

### 3.3 待执行 Agent 必须复核的调查输入

以下内容来自先前调查，是执行起点而不是免检事实。未来测试 Agent 必须记录实际命令、时间、commit、文件哈希与上下文后再采用：

1. BabelNAR 测试套件 HEAD 曾记录为 `cd42deedae121d2ff23e4d3f8afbce73dbe07180`；
2. 套件内嵌 CLI 曾报告 `0.24.7`；
3. 本机 `BabelNAR-CLI\dist\babelnar_cli.exe` 曾报告 `0.3.0`，源码 `Cargo.toml` 曾为 `0.3.1`；
4. 套件曾统计为 121 个 `single_step` 文件、1 个 stability 文件、114 个启用用例、7 个禁用扩展样本；
5. 114 个启用用例曾统计为 157 条结构化断言；
6. 与 OpenNARS Java 资源 marker 去空白比较曾得到 140/157 断言直接吻合、98/114 文件集合完全吻合，余下 16 个文件需校准；
7. 历史旧 JAR 的最佳归档结果约为 105/114，不能代表当前 canonical；
8. 旧用例 `sleep: 0.2s` 对 TS 源码 loader 曾造成就绪前检查，2.5 秒探针能通过 NAL-1.0；
9. BabelNAR OpenNARS 转译器会发送 Narsese、裸整数周期、`*volume=N` 与 `*exit`；
10. TS Shell 曾能处理前三类输入，但把 `*exit` 报为非法输入；
11. 旧 Python runner 包含 `taskkill -f -im java.exe`，禁止直接运行；
12. BabelNAR 输出缓存不会在同文件相邻断言间清空，`success_cycles` 只能解释为 BabelNAR 搜索步数。

如果复核结果与以上记录不同，应保留原记录并解释变化来自 commit、构建、配置、版本还是调查误差，不能静默覆盖。

## 4. 被测 artifact 合同

只有满足以下条件的 TypeScript artifact 才能进入正式矩阵：

- 来自明确且最好为 clean 的 Git commit；
- `npm pack` tarball 或 `dist` 已实际生成；
- 记录包名、版本、commit、构建时间、Node/npm 版本；
- 记录 tarball 或 dist manifest 的 SHA-256；
- 在干净目录中能够被 Node.js 消费；
- 库入口和 Shell/CLI 入口均来自构建产物，而不是源码 loader；
- 被测期间 artifact 内容不变；
- 运行结果能反向关联到唯一 artifact identity。

推荐主测试入口为 tarball 干净安装后的 `opennars-304-shell`。`dist/shell.mjs` 可作为构建目录模式，`dist/index.js` 用于库 API 冒烟或专用适配器；源码入口仅为诊断模式。

如果上述 artifact 尚不存在，测试 Agent 只进行只读调查和缺口报告，不得对脏工作区临时打包后宣称发布候选通过。

## 5. 测试系统目标

交付一套安全、可恢复、可解释、人工按需运行的横向测试系统，使同一批 BabelNAR 用例能够至少测试：

1. Java 3.0.4 canonical；
2. OpenNARS-304-TS 的 npm tarball 或正式 `dist`；
3. OpenNARS-304-TS 源码入口，仅作为诊断；
4. 必要时加入旧 modified Java JAR、OpenNARS 1.5.8、3.1.2 或其他 NARS 实现作为背景组。

主验收要求：

- 每个启用用例都被实际运行或得到明确分类；
- Java-valid 的断言在 TypeScript artifact 上不存在未经解释的语义差异；
- 异常、超时、未运行、启动失败、输出解析失败、预言失效、语义不匹配和性能告警分别统计；
- 双方都失败不能算一致；
- 不把 BabelNAR 搜索步数称为首次派生周期；
- 不把包含人工 sleep 的总 wall time 作为性能门；
- 每项结论能追溯到 artifact、fixture、命令、配置与原始输出。

## 6. 任务 DAG

```text
P0 满足启动条件：锁定可消费的 JS artifact
 └─→ P1 冻结仓库、工具链、fixture 与 artifact 身份
      ├─→ P2 建立非破坏性 runner、checkpoint 与结果 schema
      └─→ P3 建立 Java/TS 协议适配和协议合同测试

P2 + P3
 └─→ P4 用 canonical Java 校准 114 个启用用例的预言
      └─→ P5 Java/TS 六用例分层冒烟
           └─→ P6 Java/TS 全量 114 用例矩阵
                └─→ P7 差异复现、分类和开发移交
                     └─→ P8 与 245+1 功能冻结门合并为发布证据

P8 完成后再做：7 个禁用扩展样本、stability 与其他 NARS 实现
```

计划登记时为 0/9 个门完成。这个数字只表示计划节点，不能解释为已经运行 0/114 或项目功能退回 0%。

## 7. 分阶段执行计划

### P0：启动条件

由维护者明确给出被测 TS commit 和 artifact 路径，或授权测试 Agent 从 clean commit 构建并 `npm pack`。没有 artifact 就不进入执行阶段。

### P1：版本与证据冻结

记录五个代码库的 commit、branch、dirty 状态，以及 Java JAR、TS tarball/dist、BabelNAR CLI、fixture manifest 的哈希。重新构建 BabelNAR CLI 后以 source commit 与 artifact SHA 为准，不能只相信已有 exe 的版本字符串。

### P2：安全 runner

安全 orchestrator 必须：

- 只启动并终止自己创建的子进程树；
- Windows 下只允许按 PID 终止，例如 `taskkill /PID <pid> /T /F`；
- 禁止按映像名全局终止 `java.exe`、`node.exe` 或其他进程；
- 每个 test × engine × attempt 完成后立即写 JSONL checkpoint；
- 单文件超时或异常后继续剩余文件；
- 支持 resume，不把未执行项伪造为失败或通过；
- 保留 stdout、stderr、退出码、超时、artifact 与 attempt 身份；
- 对截断 checkpoint、重复终止和子进程提前退出有自动化合同测试。

### P3：协议合同

至少验证：

- judgment、question 与 `ANSWER`；
- 裸整数周期命令；
- `*volume=N`；
- `*exit` 或经明确批准的兼容 adapter；
- `IN`、`OUT`、`ANSWER`、`EXE` 通道；
- stdout/stderr 分离；
- 正常退出、异常退出、外部超时；
- npm tarball/dist 冷启动；
- 源码 loader 冷启动仅作为诊断。

优先解决 `*exit` 和 readiness 的协议适配，不要把启动竞态误判为推理语义差异。功能模式可采用保守就绪策略，性能模式不得包含人工等待。

### P4：canonical Java 预言校准

先只运行 canonical Java。把 114 个启用用例分成：

- `baseline_pass`
- `baseline_expectation_mismatch`
- `baseline_timeout`
- `baseline_exception`
- `translator_parse_failure`
- `fixture_invalid`
- `not_run`

预言变更必须同时引用 canonical Java 实际输出、Java 源资源、BabelNAR fixture 与相关 Git 历史。目标不是强行得到 114/114，而是 `unclassified=0`。

### P5：六用例分层冒烟

建议覆盖：1.0、1.6、2.14、5.23、6.17、7.0。每项至少运行 Java canonical、TS packed/dist deterministic、Java product Shell、TS product Shell；产品协议冒烟重复 3 次，用于发现启动和终止竞态。

六项都得到完整分类后才允许进入全量矩阵。

### P6：全量 114 矩阵

主矩阵至少覆盖 `java304-canonical` 与 `ts304-dist`，确定性模式下每项至少 2 次；出现不稳定时扩展至 3–5 次。

每条断言比较：

1. 输出通道；
2. Narsese 词项语义结构；
3. 变量 alpha-equivalence；
4. 标点与时态 stamp；
5. 真值与必要时的预算；
6. 操作名称与参数。

判定规则：

- Java 与 TS 都满足有效预言才可记语义通过；
- 双方都不满足仍是失败；
- 任一侧未运行、异常或超时，不能通过；
- 字符串不同但 AST、通道和真值合同一致，记录展示差异；
- 搜索步数不同只记 `search_cycle_diff`；
- 真值容差必须先证明是显示精度问题，并逐项记录批准依据。

### P7：差异调查与移交

每个差异生成最小复现包，包含 fixture、两侧命令、artifact SHA、stdout、stderr、NAVM、断言、重复结果和最早可观察分歧。

至少分类为：

- startup/readiness
- process lifecycle
- translator/parser
- formatting only
- truth/budget
- channel
- temporal stamp
- variable normalization
- semantic derivation
- timeout/performance
- nondeterminism
- invalid oracle

测试 Agent 不直接修改推理算法。若证据指向产品缺陷，形成最小复现和建议交给开发 Agent。

调查深层问题时应阅读 `docs/translation-deep-pitfalls.md`，但该文档只提供候选机制，不能替代最早分歧证据。尤其检查 Java/TypeScript 在整数、浮点、引用语义、集合顺序、哈希、重载、类型判断、空值、字符串、随机数、时间和模块初始化上的差异。

### P8：发布证据合并

在同一个 TS commit/tarball 上汇总：

- 245+1 功能冻结门；
- BabelNAR 规则预言门；
- npm tarball 外部安装；
- CLI/Shell 协议；
- 单元测试、typecheck、构建与 release package；
- 独立性能门。

报告应分别表述广覆盖资源矩阵、细粒度 BabelNAR 用例、结构化断言、重叠映射和未经解释的差异，不能把它们简单相加。

## 8. 结果合同

正式执行至少产生：

1. `manifest.json`：仓库、artifact、工具链、配置和 fixture 哈希；
2. `matrix.jsonl`：逐 test × engine × attempt 的不可覆盖原始记录；
3. `summary.json`：机器可读汇总；
4. `report.md`：中文阶段报告；
5. `failures/`：逐差异最小复现包。

推荐的最小行结构：

```json
{
  "schema_version": 1,
  "run_id": "...",
  "test_id": "6.17",
  "nal_level": 6,
  "fixture_sha256": "...",
  "engine": "ts304-dist",
  "engine_mode": "deterministic",
  "artifact_sha256": "...",
  "attempt": 1,
  "verdict": "pass",
  "exit_code": 0,
  "timed_out": false,
  "not_run": false,
  "stdout_parse_error": null,
  "stderr": null,
  "assertions_expected": 4,
  "assertions_passed": 4,
  "channels": ["OUT", "OUT", "OUT", "OUT"],
  "babel_search_cycles": [1, 1, 1, 1],
  "semantic_pass": true,
  "approved_difference": null
}
```

实际 schema 可以扩展，但不得丢失异常、超时、not_run、artifact、fixture 与重复运行身份。

## 9. 长时间测试和 Token 纪律

- 一次只启动一个有 checkpoint 的正式矩阵；
- 不启动同名的第二个全量矩阵；
- 后台 session 不做数秒级轮询，采用 60–300 秒等待或等待系统完成通知；
- 长测试期间处理 fixture 映射、schema 校验、历史证据、报告框架、runner 合同测试和已落盘结果分类；
- 不反复输出“仍在运行”；
- 仅在破坏性命令、artifact 身份错误、checkpoint 长期不增长、资源失控或用户要求时中止；
- 人工 sleep、冷启动、BabelNAR 解析和进程回收时间不得混入算法性能结论。

## 10. 完成条件

本计划只有同时满足下列条件才可标记完成：

- 安全 runner 不会按进程名终止系统进程；
- runner 的异常、超时、继续执行和 resume 合同全部通过；
- Java/TS 协议合同有机器测试；
- canonical Java 的 114 个启用用例全部完成预言校准；
- Java-valid 的 BabelNAR 断言在 TS artifact 上通过或逐项有批准记录；
- `not_run=0`、`unclassified=0`、`unexpected_semantic_diff=0`；
- 同一 TS artifact 上的 245+1 功能门仍通过；
- 功能、搜索周期和性能结论完全分开；
- 证据包含 commit、artifact SHA、命令、配置和原始结果；
- 临时进程、配置和探针已清理；
- 提交不包含用户或其他 Agent 的无关修改；
- 是否推送、发布或打 tag 由当时用户授权决定。

## 11. 交给测试 Luna Agent 的长期提示词

以下内容可在 JS 发布候选已经准备好后，直接交给独立测试 Luna Agent。若 artifact 尚未准备好，应先把路径、commit 和 SHA 补入提示词；不要让 Agent 自行猜测发布候选。

``````markdown
# OpenNARS 3.0.4 TypeScript × BabelNAR 按需横向一致性测试目标

你是一名独立的测试 Luna Agent。你的职责不是继续修改推理算法，而是建立一条安全、可复现、机器可读、人工按需运行的 BabelNAR 横向测试流水线，用它验证 OpenNARS 3.0.4 Java canonical 与指定 OpenNARS-304-TS JavaScript 发布候选之间的功能一致性，并为以后加入其他 NARS 实现留下扩展接口。

## 一、当前任务模式

这不是持续集成任务：

- 不新增 GitHub Actions、定时任务、提交钩子或每次提交自动运行的全量测试；
- 只针对维护者明确指定的不可变 JS artifact 执行一次可恢复的验收；
- 主被测对象必须是 `npm pack` tarball 干净安装产物或固定 commit 的正式 `dist`；
- TypeScript 源码 loader 只作诊断，不计入发布主通过率；
- 如果没有给出可消费 artifact、commit 和哈希，先做只读调查并报告缺口，不对脏工作区临时打包后宣称通过。

开始前，先完整阅读：

- `$OPENNARS_TS_ROOT/docs/babelnar-on-demand-cross-parity-test-plan.md`
- `$OPENNARS_TS_ROOT/docs/translation-deep-pitfalls.md`
- 各相关仓库自己的 `AGENTS.md`、README 和最新阶段报告。

## 二、权威目录

- TypeScript：`$OPENNARS_TS_ROOT`
- BabelNAR 测试套件：`$BABELNAR_TEST_ROOT`
- BabelNAR.rs：`$BABELNAR_RS_ROOT`
- BabelNAR CLI：`$BABELNAR_CLI_ROOT`
- Java canonical：`$JAVA_CANONICAL_ROOT`

Java canonical 固定为：

- source commit：`8675b76fe8c21ee20a7b8c1b63408fb05327210d`
- JAR：`target\opennars-3.0.4-SNAPSHOT.jar`
- SHA-256：`2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`

旧 `opennars-304-T-modified.jar` 只能作为历史背景，不得成为 canonical。

维护者指定的 TypeScript 发布候选：

- commit：`<由维护者填写>`
- artifact 路径：`<由维护者填写 tarball 或 dist>`
- artifact SHA-256：`<由维护者填写或授权你计算>`
- package version：`<由维护者填写或从 artifact 复核>`

## 三、先复核，不要盲信历史记录

此前调查曾记录：测试套件 HEAD `cd42deedae121d2ff23e4d3f8afbce73dbe07180`；114 个启用用例、157 条断言、7 个禁用扩展样本；140/157 断言与 Java marker 去空白直接吻合；旧 runner 含全局 `taskkill -f -im java.exe`；TS 源码 loader 的 0.2 秒就绪等待会造成假失败；TS Shell 对 `*exit` 存在协议差异。

你必须复核 commit、样本、断言、版本、构建产物和协议行为，并记录命令、时间、哈希及上下文。若结果变化，解释是版本变化、构建差异、配置变化还是先前调查误差，不得静默改写历史。

## 四、工作边界

允许优先在 BabelNAR 测试套件的独立分支或 worktree 中修改安全 runner、适配器、配置、结果 schema、报告和回归测试。

如需修改 OpenNARS-304-TS：

- 先遵守其 `AGENTS.md`；
- 先运行 `lean-spec board` 和 `lean-spec search`；
- 使用 LeanSpec 工具管理 spec；
- 只允许测试入口、协议兼容别名或非语义适配；
- 不得由测试 Agent 修改推理算法。

禁止：

- 直接运行包含按进程名全局杀 Java 的旧全量脚本；
- 执行 `taskkill -f -im java.exe` 或任何按映像名杀进程的等价命令；
- 把旧 modified JAR 设为 canonical；
- 修改 NAL 期望值迎合 TypeScript；
- 用双方都失败冒充一致；
- 把未运行、异常或超时计为通过；
- 把 BabelNAR 搜索步数称为首次派生周期；
- 把包含人工 sleep 的 wall time 当算法性能；
- 混入用户或其他 Agent 的无关工作区修改；
- 在测试运行时数秒级反复轮询并只报告“仍在运行”。

## 五、任务 DAG

```text
P0 锁定可消费的 JS artifact
 └─→ P1 冻结仓库、工具链、fixture 与 artifact 身份
      ├─→ P2 非破坏性 runner、checkpoint、resume 与 schema
      └─→ P3 Java/TS 协议适配和合同测试
P2 + P3
 └─→ P4 canonical Java 校准 114 个启用用例
      └─→ P5 六用例分层冒烟
           └─→ P6 全量 114 Java/TS 矩阵
                └─→ P7 差异复现、分类和开发移交
                     └─→ P8 合并 245+1 功能冻结门形成发布证据
```

开始时报告各门状态，不得把先前调查当作本轮已经完成的门。

## 六、执行合同

### 1. artifact

正式矩阵只测试不可变 tarball 或 dist。记录 Git commit、dirty 状态、package version、构建时间、Node/npm 版本、artifact SHA 和 manifest。主入口优先使用 tarball 干净安装后的 `opennars-304-shell`；`dist/shell.mjs` 是构建目录模式，`dist/index.js` 用于库 API 或专用 adapter，源码 loader 仅诊断。

### 2. 安全 runner

只终止自己启动的 PID 及子进程树；每个 test × engine × attempt 后立即写 JSONL；单项超时后继续；支持 resume；分别保存 stdout、stderr、退出码、超时和 not_run。给首项超时后续仍运行、异常退出、非零退出、零退出但协议错误、重复终止、checkpoint 截断恢复和重复 attempt 建立合同测试。

### 3. 协议

覆盖 judgment、question/ANSWER、裸整数周期、`*volume=N`、`*exit`、IN/OUT/ANSWER/EXE、stdout/stderr、正常退出、异常退出、外部超时和正式 artifact 冷启动。源码 loader readiness 只作诊断。若用 adapter 把 `*exit` 转为 `:quit`，必须记录为协议适配，不能伪装成原生支持。

### 4. oracle

先只运行 canonical Java，对 114 个启用用例逐项分类为 baseline_pass、baseline_expectation_mismatch、baseline_timeout、baseline_exception、translator_parse_failure、fixture_invalid 或 not_run。预言修订必须引用 canonical Java 输出、Java 源资源、原 fixture 与 Git 历史，目标是 unclassified=0，而不是强行 114/114。

### 5. smoke

用 1.0、1.6、2.14、5.23、6.17、7.0 覆盖 OUT、ANSWER、结构变换、条件推理、多断言变量和时态。每项运行 Java/TS deterministic 和两侧 product Shell；产品协议至少重复 3 次。六项完整分类后再进入全量。

### 6. matrix

114 个启用用例至少运行 Java canonical 与 TS dist/tarball 两侧各 2 次；不稳定项扩展到 3–5 次。比较通道、Narsese AST、变量 alpha-equivalence、标点、时态、真值、必要预算和操作。任一侧异常、超时或 not_run 均不能通过。

### 7. triage

按 startup/readiness、process lifecycle、translator/parser、formatting、truth/budget、channel、temporal、variable、semantic derivation、timeout/performance、nondeterminism、invalid oracle 分类。使用 `translation-deep-pitfalls.md` 生成候选解释，但必须沿最早可观察分歧取证。推理算法问题只形成复现包并移交开发 Agent。

### 8. evidence

至少生成 `manifest.json`、`matrix.jsonl`、`summary.json`、中文 `report.md` 和逐失败复现目录。每条原始记录都必须包含 run、test、engine、attempt、fixture SHA、artifact SHA、verdict、退出码、timeout、not_run、解析错误、断言计数、通道和 approved difference。

## 七、长测试纪律

一次只运行一个可 checkpoint 的正式矩阵。后台命令使用 60–300 秒等待或系统完成通知，不做数秒级轮询。等待期间完成 fixture 映射、schema 校验、历史结果对照、报告框架、runner 合同和已落盘结果分类。只在破坏性命令、artifact 错误、checkpoint 长期停滞、资源失控或用户要求时中断。

## 八、完成条件

- 安全 runner 不会按进程名终止系统进程；
- runner 的异常、超时、继续执行和 resume 合同通过；
- Java/TS 协议合同有机器测试；
- canonical Java 的 114 个启用用例均完成预言校准；
- Java-valid 的断言在 TS artifact 上通过或逐项有批准记录；
- `not_run=0`、`unclassified=0`、`unexpected_semantic_diff=0`；
- 同一 TS artifact 的 245+1 功能门仍通过；
- 功能、搜索步数和性能结论分开；
- 所有结论可追溯到 commit、artifact SHA、命令、配置和原始结果；
- 不包含无关修改；
- 推送、发布和 tag 只在用户明确授权后进行。

## 九、第一批行动

1. 只读检查相关仓库状态、规则、最新报告和现有脚本；
2. 在 OpenNARS-304-TS 中按 `AGENTS.md` 执行 LeanSpec discovery；
3. 核实维护者指定的 TS artifact 是否满足不可变构建合同；
4. 若 artifact 缺失，输出缺口并停止执行测试；
5. 若 artifact 有效，冻结所有版本与哈希；
6. 审计旧 runner，先建立阻止全局 taskkill 的硬保护；
7. 建立 TS packed/dist 的 BabelNAR 配置和 `*exit`、readiness、stderr 协议合同；
8. 只运行 NAL-1.0 双向冒烟；
9. 冒烟证据正确后再运行六用例；
10. 六项完整后提交阶段报告，检查通过后才进入 114 全量矩阵。

不要一开始就运行旧全量脚本，不要擅自建立 CI。
``````

## 12. 后续使用方式

1. 等 OpenNARS-304-TS 完成去 jree、尽力性能优化并形成 release candidate；
2. 从 clean commit 生成 `npm pack` tarball，并记录 SHA-256；
3. 把 artifact commit、路径、SHA 与 package version 填入第 11 节提示词；
4. 将本文件或第 11 节完整提示词交给独立测试 Luna Agent；
5. 由该 Agent 按 P0–P8 执行；
6. 主开发 Agent只接收带最小复现的产品缺陷，不与测试 Agent 混用职责。
