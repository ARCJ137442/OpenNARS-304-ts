# OpenNARS-304-ts 当前状态

- 状态日期：2026-09-15（Asia/Shanghai）
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

### G0 之后的持续开发增量（截至 `87646f8`）

以下数字是在不改变上方冻结 M1/M2 结论的前提下，对当前主线增量的记录：

- 生产源码直接 jree 导入文件：`96`；
- `new ArrayList` 构造：`14`；
- `new LinkedHashMap` 构造：`41`；
- `new LinkedHashSet` 构造：`26`；
- 最近四批已推送的原生化范围：mental operator 反馈数组、配置插件原生序列、`ProcessGoal` anticipation value 数组、`VisionChannel` prototypes 数组；
- 最近一批（`0af732b` 实现、`87646f8` 文档）的串行单测为 `207/207`，非增量 typecheck 为 0 诊断，`vision.nal` 与 canonical Java 局部 parity 均通过。

这些是可追溯的局部迁移结果，不是 023 的完成率，也不改变 023 的退出条件。领域 Map/Set、迭代器/remove、运行时类身份、jree compatibility 层和 `package.json` 运行时依赖仍未收口。对应批次报告见 `reports/20260915-170037.md`、`reports/20260915-171226.md`、`reports/20260915-173124.md`、`reports/20260915-173959.md` 和 `reports/20260915-180430.md`。

### 当前候选（截至 `673d390`）

当前候选不是 2026-08-27 冻结点的替代品，而是冻结后在本地尚未推送的增量。当前工作区干净，`main` 为 `673d390`，相对 `origin/main` 超前 3 个提交；canonical Java artifact 未改变。

- M2 当前复验：串行单测 `212/212`、非增量 `tsc` 0 诊断、build、dist API、局部算法 parity 和 `vision.nal` 均通过。
- M1 当前保护矩阵：245 个主资源中 244 个完成实际 marker parity，0 exception、0 普通 timeout、0 not-run；`long_term_stability.nal` 仍为 process limit/marker 未完成，而不是逻辑 parity 通过。
- 该 stability 样本在 TypeScript 侧推进到约 461,770 周期后达到 600 秒/进程安全上限，峰值内存约 2.7 GB；它应作为性能/资源与空 marker 观测缺口记录，不能被“有进度”改写成成功 marker。
- 本批新增的 024-P3 插件显式参数、非法配置/重复 classpath 诊断和三种合法无参插件构造均有直接测试；这不等于 P3-P5 或 J/P 集成门禁完成。
- `Image.ts` 的既有注释空格调整已单独作为 `673d390 style(repo): 统一 Image 注释格式` 记录，没有与语义修改混提交。

因此，当前可以继续 023/024 的低风险、单簇、可回归工作；不能宣称当前 HEAD 已完成 M1 全量，也不能开始正式发布、tag、性能门或大范围无证据重构。M1 的高成本 stability 证据应在后续先定义低内存、可重复的观测方式，再单独处理性能，不与逻辑修复混为一谈。

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

综合指标为：生产源码直接 jree 导入文件 `117 → 96`，`new ArrayList` `50 → 14`，`new LinkedHashMap` `43 → 41`，`new LinkedHashSet` `26 → 26`。这证明数组/序列子簇已取得实质进展，但不是“jree 已移除”：`package.json` 仍依赖 `jree@1.3.0`，Map/Set key equality、JavaObject/运行时类身份、JavaString、随机数、float32 和模块初始化环仍是未收口边界。后续仍按“数据结构 → 容器 → 推理规则 → 推理引擎 → 宿主入口”的顺序推进。

## 平台中立与发布冻结状态

`spec 024` 已完成：

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
