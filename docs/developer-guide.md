# OpenNARS-304-ts 开发者指南

本文面向维护、审阅或恢复开发的贡献者。023/024 已有阶段证据；本轮性能试探按用户要求停止，v1.0.7 已发布，Shot 长期行为等价仍未证明，源码仓库已公开，见[当前目标](active-goal-20261002.md)。最终声明以可追溯的源码/产物身份与门禁证据为准。2026-08-27 封存点和历史 Luna 文档只用于追溯，不能直接当作执行计划。

## 开始前

1. 阅读[当前状态](current-status.md)与[冻结交接报告](../reports/20260827-003242.md)。
2. 检查 `git status --short --branch`，不要清理或提交来源不明的未跟踪证据、探针和生成物。
3. 运行 `lean-spec board`，再用 `lean-spec search` 和 `lean-spec view` 查找相关规格。
4. 定位源码符号、调用链与影响面时优先使用 `codegraph_explore` 或 `codegraph explore "<符号或问题>"`；新工作树若缺少 `.codegraph/`，运行 `codegraph init` 后以 `codegraph status` 核对。索引不可用或需要精确文本匹配时使用 `rg`。
5. 只有多阶段功能、破坏性变更或设计决策才创建新 spec；frontmatter 和状态只能由 LeanSpec 工具维护。
6. 从当前状态与最新中期 tag 确认恢复点；`17cec541f535d83bd62e5b15ee9c03f4a2233812` 只是历史封存提交，旧 `v0.1.0` tag 也不是当前 RC。不得用它们覆盖后续已验收代码。

详细 Agent 规则见仓库根目录的 [AGENTS.md](../AGENTS.md)。

## 代码结构

| 路径 | 职责 |
| --- | --- |
| `src/main` | `Nar` 生命周期、参数和运行主链 |
| `src/language`、`src/entity` | Narsese 词项、句子、真值与预算值 |
| `src/inference`、`src/control` | 推理规则与控制流 |
| `src/storage` | 概念、Bag、Memory 等状态容器 |
| `src/io` | Narsese、配置与事件边界 |
| `src/operator`、`src/plugin` | 操作和插件 |
| `src/platform` | 显式宿主能力合同 |
| `scripts/cli.mjs`、`scripts/shell.mjs` | Node 宿主入口 |
| `scripts/e2e`、`scripts/parity` | Java/TypeScript 差分与长测工具 |
| `test/node` | 串行单元与合同测试 |
| `specs`、`reports` | LeanSpec 状态、阶段报告和证据 |

依赖方向应保持为：值对象与数据结构 → 容器 → 推理规则 → 推理引擎 → 宿主入口。底层模块不得反向读取文件、终端或进程状态。

## 常用验证

```bash
npm ci
npm test
npm run typecheck
npm run test:build
npm run test:api:dist
```

`npm test` 是 TS-only 日常门，两项必须现跑 Java 的测试会显式跳过，且 Java 子进程有启动拦截。阶段门才运行 `npm run test:unit:with-java` 和 `npm run test:parity:local`。用 `node scripts/checking/classify-change-gate.mjs --base <上次验收提交> --head HEAD` 得到最低 T0/T1/T2 门；该脚本不包含未提交工作区。

补充审计：

```bash
npm run scan:migration-patterns
npm run audit:jree
npm run audit:platform
python scripts/checking/check_hanzi_encoding.py --json-output scripts/checking/hanzi-report.json
```

完整参数、canonical Java 路径和长测规则见[M1/M2/M3 核实手册](verification-commands.md)。

### In-process RPS 基线

Demo 的 `RPS` 指 NARS 推理周期/秒，不是 Worker 请求数/秒。用单一复用的 `Nar` 实例测量输入解析加推理的总延迟：

```powershell
npm run typecheck
node --import ./scripts/register-ts-loader.mjs scripts/e2e/run-rps-benchmark.mjs `
  --cycles 100 --warmup-runs 2 --repetitions 20 `
  --output reports/evidence/rps-baseline-YYYYMMDD.json
```

报告同时记录 `request_per_second`、`cycles_per_second`、中位数与 p95 延迟、峰值 RSS。异步 Demo 的 TPS 提升不能替代 RPS 基线；性能优化必须保持功能和 parity 证据，并以稳定 `RPS >= 1.0` 作为最低可用门槛。

## M1/M2 保护纪律

- M1 以固定 Java artifact、固定随机/周期/超时口径和逐文件 checkpoint 为准。
- `timeout`、`process_limit`、`exception` 与 `not_run` 必须分别统计；双方都失败不是 parity。
- 有 marker 的样本比较 marker 路线；无 marker 的高周期样本使用独立 stage digest。
- 冻结点 246/246 是证据组合结论，最后一次 245 行 raw 矩阵本身是 244 pass + 1 process limit。
- M2 必须使用非增量 typecheck、串行单测、正式 build 和 dist API 检查。
- 每个去 jree 或平台边界批次都先跑局部合同和 M2-TS，再按[现行目标](luna-agent-active-goal.md)的 T0/T1/T2 判别运行受影响 NAL、M1- 或阶段全量 M1；发现回退立即停止扩张。

长测试必须使用唯一结果文件、逐文件 checkpoint 和 `--resume`。命令在后台运行时，不做数秒级轮询；可整理已落盘 checkpoint、文档或独立单测，但不得启动第二份同名全量矩阵。

## 恢复主线

当前 LeanSpec 主线为：

- `023-jree-removal-native-runtime`：实现门历史记录为 complete；当前生产源码直接 jree audit 为 `0/0`，仍需以最终候选提交重新核对发布边界。
- `024-platform-neutral-core-host-adapters`：实现门历史记录为 complete；Node/浏览器 adapter 与 Worker bundle 已有阶段证据，当前候选仍需最终集成核对。
- `020-ts-performance-and-release`：LeanSpec 历史状态为 complete；本轮持续性能目标未达标但已按用户要求停止，Pages 与 v1.0.5 GitHub fix release 已完成。项目不发布 npm。

推荐恢复 DAG：

```text
同步 023 已完成批次与残余清单
  ├─ 每次只迁移一个有 Java 合同的小簇
  └─ 完成 024 的 P3 → P4 → P5
                 ↓
        同一 clean commit 集成回归
                 ↓
        测量驱动的正式性能门
                 ↓
        单文件 bundle、公共门面、文档、RC
```

LeanSpec 状态描述实现事实，不描述“是否暂停”。完成 023/024 不等于性能优化或公开发布候选完成；发布前仍需运行本页的 M2、包检查、demo 检查和人工 smoke。

## 去 jree 化策略

当前仍可观察到 Java 兼容形状（`java.lang` 名称、类 token、集合合同和宿主 adapter），它们集中在兼容边界，不应在新核心代码继续扩散。若继续削减，不能按字符串机械替换：

1. 选择一个容器或运行时边界簇；
2. 阅读对应 Java 3.0.4 实现和 TypeScript 调用路径；
3. 写局部 Java/TypeScript 行为合同；
4. 用原生 Array/Map/Set 或窄适配器做最小修改；
5. 验证 null/undefined、重载、继承、类族、迭代顺序和数值边界；
6. 运行局部测试、M2、受影响 NAL，再记录依赖扫描差值；
7. 多处实例验证后才把模式加入迁移规则库。

可复用经验见[Java → TypeScript 迁移纠正模式库](java-to-typescript-migration-patterns.md)。[深层踩坑清单](translation-deep-pitfalls.md)只是历史假设库，不能作为未经验证的修复指令。

## 平台中立策略

- 核心接收字符串、原生配置对象和显式 `RuntimeCapabilities`；
- 文件读取、argv、终端、上传和下载属于宿主 wrapper；
- Node CLI 可以读文件，浏览器入口应接收文本或用户选择的文件内容；
- 缺失宿主能力必须抛出稳定、可测试的错误，不得静默使用 Node shim；
- Web/Shell wrapper 不应扩大核心公共 API；最终单一门面与 bundle 是尚未完成的发布任务。

## 文档与提交

- 当前事实只写入 `docs/current-status.md`；README 只做摘要和导航。
- 用户用法写入 `docs/user-guide.md`；维护流程写入本文。
- 历史提示词和旧战略必须保留“历史/不可直接执行”标记。
- 中文文件使用 UTF-8，并在提交前运行编码检查。
- 只暂存本任务文件，使用 Conventional Commit；不要混入 `tsconfig.tsbuildinfo` 或历史诊断输出。

全部资料的权威级别见[文档索引](README.md)。
