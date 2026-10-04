# PC Agent 启动提示词

你现在接手 OpenNARS-304-TS。请持续推进，直到 `docs/luna-agent-active-goal.md` 的目标真正完成；未完成前不要执行 `sleep 3600s`。

## 当前上下文

仓库当前交接提交为 `bec4d41`。开始前阅读：

- `AGENTS.md`
- `docs/current-status.md`
- `docs/developer-guide.md`
- `docs/luna-agent-active-goal.md`
- `docs/pc-agent-handoff-20260927.md`
- `reports/20260927-182859.md`
- `specs/023-jree-removal-native-runtime/README.md`
- `specs/024-platform-neutral-core-host-adapters/README.md`

先检查工作区、远端、`java-master` 本地链接、Java JAR、NAL 资料、冻结 baseline JSONL 和 Node 依赖。LeanSpec 工具不可用时，不要伪造结果，直接读取仓库中的 specs 并记录工具缺口。

历史证据不得删除。当前 Termux 工作树中的历史未跟踪证据已归档到仓库外的 `$EVIDENCE_ARCHIVE/termux-historical-20260927/`；接手时将 `$EVIDENCE_ARCHIVE` 替换为本机实际归档目录，不要使用 `git add -A`。

## 工作组织

责任簇固定为五个：

1. `J1-runtime-compat`
2. `J2-language-parser`
3. `J3-inference-core`
4. `J4-operator-plugin`
5. `J5-main-io-host`

采用一个主 Agent 串行推进，不按文件派发多个 Agent，不并行修改同一工作树。每个责任簇作为一个高层工作卡，内部按共同 Java 合同合并实现切片；不要每修改一个文件就重复跑全量矩阵。

顺序为：接手审计 → J1 → J2 → J3 → J4 → J5 → `--stage 023` → `--stage 024`。

## PC 测试口径

PC 环境不运行 M1--。所有需要 M1 的场合运行正常完整 M1，包含完整 245 个主资源、`#25` 和 `#245`。Termux 的 M1-- 243 项口径只适用于受限 Android/Termux 环境。

普通切片运行直接合同、非增量 typecheck、build、dist API、迁移/平台审计和 2～5 个受影响 NAL。责任簇收口时运行一次 PC 完整 M1。普通簇内至少完成一次 TS-only M2；`023/024` 阶段门运行含 Java 的完整 M2、完整 M1、严格 markerless 长测、Node 和真实浏览器验证。

所有长测使用单进程、唯一证据前缀、逐文件 checkpoint 和 `--resume`，同时记录 stdout、stderr、退出状态、周期、耗时、RSS 和证据哈希。必须区分 `timeout`、`process_limit`、`exception`、`stall`、`not_run` 和正常完成。

## 已知失败

最近一次 TS-only M2 为 `488` 项：`482` 通过、`1` 失败、`5` 跳过。唯一失败为 `test/node/nal-runner-semantics.test.ts:562` 的 hot/cold 隔离长测。先在 PC 独立复现并分类，保存完整子进程证据；未完成归因前不得直接修改生产代码，也不得把它直接称作语义回归。

若确认只是 TypeScript 测试启动预算不足，可以按 5 秒增量提高启动超时并记录原因；不得用扩大超时掩盖真实进程限制或无进展。

## 责任簇收口条件

每个簇必须先完成剩余审计项、Java 合同、直接测试和受影响 NAL，再运行一次完整 M1。局部切片通过不能写成责任簇完成。

023 必须满足：五簇均有收口证据、生产核心无未解释直接 jree 依赖、公共 API 不泄漏 jree 类型、字符串/异常/类身份/随机数/集合/迭代合同有项目内实现及测试，并通过 `--stage 023`。

024 必须满足：P3/P4/P5 完成，核心只消费显式宿主能力，Node 与真实浏览器使用同一核心入口，浏览器路径不依赖 Node shim，并通过 `--stage 024`。

## 提交、推送与清理

每个完成的责任簇和最终阶段门都必须有可追溯提交。只暂存本任务相关文件，使用 Conventional Commit，不修改无关历史证据。

阶段交接前必须：

- 检查 `git diff`、`git status` 和未跟踪文件；
- 保留历史证据，必要时先记录 SHA-256 再移到仓库外归档；
- 运行必要的编码检查和验证命令；
- 提交代码、测试、报告和必要规格同步；
- `git push origin main`；
- 确认本地 `HEAD` 与 `origin/main` 一致；
- 确认工作区最终为 clean；
- 汇报提交 SHA、推送结果、验证结果、证据路径和剩余问题。

未完成提交、推送和 clean 验证前，不得宣称阶段交接完成。不要预估工作日，以实际运行耗时、测试耗时和资源指标报告进度。
