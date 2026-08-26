# OpenNARS-304-TS Luna Agent 长期目标（M1/M2 后续阶段）

用途：本文件是 G0/M1/M2 重建阶段的历史提示词，保留用于追溯当时的门禁设计。当前 G0 已完成，最新 M1/M2 状态以 `docs/current-status-and-runbook.md` 和批次报告为准；后续 Agent 应使用 `docs/luna-agent-post-g0-goal.md`，不要把本文件的旧“先执行 G0”段落当作当前工作入口。

## 可直接交给 Luna Agent 的提示词

你继续负责 `H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts` 的长期开发。不要重启已经完成的迁移，也不要把提交数量当作完成度。你的总目标是：在不可回退的 M1 功能基线和 M2 编译基线上，依次完成生产核心去 jree、核心平台无关化、测量驱动的必要性能优化与对外发布准备，最终交付可由 Node.js 和浏览器直接集成的 OpenNARS 3.0.4 TypeScript 正式版本。

### 一、当前权威状态

开始时必须重新读取 HEAD、origin/main、工作区和最新报告；下列数字只是 2026-08-26 18:16（Asia/Shanghai）的审阅快照，不得覆盖更新的 Git 事实。

- M1 已冻结：`1bdad9d`，245 个主资源加 1 个 `simpleOperationTest.nal`，功能验收 246/246；244 个有 marker 样本 marker 等价，2 个无 marker 样本在既定长周期窗口等价。
- M2 已冻结：`2ffcb64`，非增量 TypeScript 零诊断构建完成。
- canonical Java source commit：`8675b76fe8c21ee20a7b8c1b63408fb05327210d`。
- canonical Java JAR SHA-256：`2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`。
- 审阅时稳定 HEAD 与 origin/main 均为 `dff359e`；其后若已有提交，以 Git 为准。
- `dff359e` 记录的稳定验证包括：串行单测 195/195、非增量 tsc、构建、dist API、canonical Java 局部算法 parity 和一个 1550 周期 NAL smoke 通过。这不是 246 项全量重跑。
- 023 的 J0 清单从 117 个生产 `src` 直接 jree 导入文件开始；审阅时稳定树仍有 107 个直接导入文件，并有 35 个 `ArrayList`、41 个 `LinkedHashMap`、26 个 `LinkedHashSet` 构造命中。`package.json` 仍声明 `jree@1.3.0` 运行时依赖。
- 024 已完成 P0、P1、P2；P3 正在进行；P4、P5 尚未完成。
- `EventEmitter` 原生事件容器已由 `dff359e` 完成并推送。当前工作区正在进行 `SensoryChannel`/`VisionChannel` 集合边界切片；保留这些未提交修改，但立即暂停继续扩张，先执行下述 G0。
- 当前仍不能宣称：整体 jree 已移除、浏览器无 shim、根入口平台中立、M1/M2 已在最新所有重构后完成集成冻结、正式发布包已完成。

### 二、最高优先级 G0：立即重跑 M1/M2 全量回归

收到本目标后，不得再开始新的去 jree、平台边界、bundle、文档改写或性能代码。若已有短测试命令正在运行，可让该命令自然结束；随后立即执行 G0。

当前工作区若已有未提交切片：

- 不丢弃、不 reset、不覆盖，也不为了测试而仓促提交；
- 记录其文件清单和 diff 归属；
- 从当时的 `origin/main` 创建隔离、干净、不可变的测试 worktree；
- G0 只验证该稳定 commit。G0 通过后再回到原工作区完成在途切片；该切片提交后仍须执行自己的局部合同与 M2 门。

M1 全量门必须在 canonical Java 条件下实际运行全部 245+1 项，并生成逐文件 JSONL、汇总 JSON 和 artifact manifest。通过标准保持冻结口径：

- 246/246 实际完成；
- 244 个带 marker 样本 marker 等价；
- 2 个无 marker 样本达到既定 131072 周期且比较窗口完全一致；
- `unexpected_semantic_diff=0`、`exception=0`、`not_run=0`；
- timeout 只能按既有高成本样本分层预算解释，不得把 30 秒运维预算超时直接记为语义通过或失败；
- Java artifact 必须是 SHA-256 为 `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5` 的 canonical JAR。

M2 全量门至少包括：

- `npm run test:unit:serial` 全部通过，报告发现、通过、失败、跳过数；
- `npm run typecheck` 非增量零诊断；
- `npm run test:build`；
- `npm run test:api:dist`；
- canonical Java 局部算法 parity 为 `differences=[]`；
- CLI/Shell 与发行检查脚本通过；
- 汉字编码、迁移模式扫描和 `git diff --check` 通过。

G0 结果必须绑定 commit、Java/TS artifact SHA、命令、随机/周期/超时配置和原始证据。任一失败、异常、未运行或未经解释差异都会阻塞后续开发；先定位最早可观察分歧并最小修复，不得一边保留红色基线一边继续迁移。

长矩阵运行期间只允许并行做只读调查、结果 schema 校验和发布文档清单盘点，不得修改推理核心或开启第二个全量矩阵。

### 三、总目标与优先级

优先级固定如下：

1. 立即完成 G0，在最新稳定 HEAD 上重新确认 M1/M2 全量基线。
2. 完成 023：生产核心去 jree 化。
3. 完成 024：核心平台无关化与宿主适配。
4. 冻结单一 `OpenNARS` 公共门面。
5. 在上述集成门通过后，才做 profile 驱动、停止条件明确的性能优化。
6. 完成发布准备：`npm run bundle`、公共文档更新、历史 Agent 文档整理、release manifest 与候选制品。
7. 只有用户明确授权后才发 tag、GitHub Release、npm 或其他正式发布。

不要把 023 与 024 理解为严格串行的两块。二者可按同一条纵向切片协同推进，但每批必须说明：去除了什么 jree 责任、平台能力落在哪个宿主、哪条 Java 行为合同保护了改动。

### 四、目标 DAG

```text
历史 M1/M2 冻结
  └─→ G0 最新稳定 HEAD 的 M1/M2 全量回归（立即执行）

G0 通过
  ├─→ G1 024-P3：插件与宿主能力注册收敛
  └─→ G2 023：按风险簇移除 jree

G1 + G2
  └─→ G3 024-P4：浏览器配置文本、输入与上传宿主入口
       └─→ G4 024-P5：消除浏览器可达图上的 Node shim

G2 + G4
  └─→ G5 单一 OpenNARS 公共门面
       └─→ G6 J/P 集成冻结：M1 + M2 + Node + Browser
            └─→ G7 测量驱动的性能优化
                 └─→ G8 发布准备
                      ├─ npm run bundle 单文件构建功能
                      ├─ 公共文档更新
                      ├─ 历史 Agent 文档整理
                      └─ Release Candidate
                           └─→ G9 用户授权后的正式发布
```

023、024 是 020 的真实阻塞依赖。020 中已经勾选的历史性能工作不等于发布完成；在 G6 前不得把 020 标为 complete。

### 五、开始与规格纪律

1. 完整阅读根目录 `AGENTS.md`。
2. 运行 `.lean-spec\report-get-latest.py` 并阅读最新报告及 Human Notes。
3. 运行 `lean-spec board`，分别搜索并阅读 018、019、020、023、024。
4. 阅读：
   - `docs/platform-neutral-single-js-library-plan.md`
   - `docs/translation-deep-pitfalls.md`
   - `docs/java-to-typescript-migration-patterns.md`
   - 018、019 的冻结报告与后续 023、024 报告。
5. 继续用 023 管去 jree，用 024 管平台边界。先搜索是否已有公共门面/单文件发布 spec；只有确实没有时，才用 LeanSpec `create` 创建新 spec，并让 020 依赖它。不得手工创建 spec 或编辑 frontmatter。
6. 005、008 等历史 in-progress spec 不自动成为当前主线；只有经证据证明会阻塞 023/024 时才处理，否则记录为历史状态债务。
7. 工作区存在用户、其他 Agent 和诊断遗留文件。不得 reset、checkout 覆盖、删除或夹带无关文件；每批只暂存所属 spec 的文件。

### 六、贯穿全程的 M1/M2 不可回退合同

每个小批次必须至少完成：

- 直接命中本次边界的局部回归；
- `npm run test:unit:serial`，报告发现、通过、失败、跳过数；
- `npm run typecheck`，必须保持非增量零诊断；
- `npm run test:build` 与 `npm run test:api:dist`；
- canonical Java 局部算法 parity；
- 至少一个受影响 NAL smoke；
- jree/platform 静态审计、汉字编码检查和 `git diff --check`。

以下时点必须重跑完整 246 功能矩阵，而不是只跑 smoke：

- 完成一个高风险运行时簇；
- 准备把 023 或 024 标为 complete；
- G6 集成冻结；
- 性能优化后的 release candidate。

246 矩阵必须明确分类 pass、marker mismatch、exception、timeout、not_run；双方都失败、未运行或只输出相似不得计为通过。长周期样本使用已验证的分层预算和逐文件 checkpoint。完整矩阵针对不可变 commit/artifact，不针对不断变化的脏工作区。

任何 M1 或 M2 回退都立即停止扩张：先定位最早可观察分歧，最小修复或回退当前批次，再继续。

### 七、G1：完成 024-P3 插件与能力注册边界

目标是让核心只依赖显式能力和显式注册表，不隐式探测 Node、文件系统、进程或终端。

必须完成：

- G0 通过后，回到原工作区完成并独立闭环在途 `SensoryChannel`/`VisionChannel` 集合切片；
- 内置插件工厂、未支持插件、缺失宿主能力形成互斥且稳定的诊断；
- `^system` 等 Node 专属能力只由 Node adapter 注入，浏览器默认不执行任意系统命令；
- 插件顺序、参数解析、float32 收窄、操作名称和错误类型保持 Java/既有 TS 合同；
- 公共 API 不暴露 `java.lang.String`、Java List、jree class token 或 Node 类型；
- P3 全部验收后再通过 LeanSpec 勾选与更新状态，不因完成一条能力切片提前勾完。

异常路径至少覆盖：未知插件、已知插件但能力缺失、参数非法、宿主操作抛错、重复注册、无插件配置。

### 八、G2：完成 023 生产核心去 jree

以机器清单为入口，从低风险到高风险迁移，不按文件名批量替换。

建议顺序：

1. 临时数组、局部字符串包装、无 key 语义的局部集合；
2. 公共类型和构造边界；
3. 需要顺序但 key 为稳定原生值的 Map/Set；
4. 领域对象 key、`equals/hashCode`、iterator/remove、clone、class identity；
5. float/int/long、Java Random、静态初始化和循环依赖；
6. 收敛并删除项目内 jree compatibility 层；
7. 从 `package.json` 删除 jree，干净安装和构建不再取得该包。

最终硬门禁：

- 生产核心可达图直接 jree import = 0；
- 生产核心 jree 运行时引用 = 0；
- 公共 `.d.ts` 中 jree/Java 类型 = 0；
- `package.json` 运行时 jree 依赖不存在；
- 若仓库保留只用于历史测试/迁移工具的 jree，必须与发布产物物理隔离并记录移除条件，不能被核心入口打包。

不能把 import 文件数当作唯一进度。每批同时记录：直接导入文件、Java 集合构造、JavaObject、java.lang、java.util、高风险项，以及对关键运行路径的影响。

### 九、深层风险文档的使用边界

`docs/translation-deep-pitfalls.md` 是排查线索和反例索引，不是已批准的自动改写规则。处理以下项目时必须回到 canonical Java 源码、局部合同和 NAL 证据：

- `synchronized` 与“推理循环内不得 await”的单线程假设；
- ESM 循环依赖、静态初始化和首次 import；
- `Class<T>`、`instanceof` 与运行时类 token；
- 反射、ServiceLoader 与显式插件注册；
- 同参数数量重载；
- LinkedHashMap/Set 的判等、插入/替换/删除顺序；
- `equals/hashCode`、clone 深浅；
- float32、int32、long 与 Java Random；
- 内部类的外层对象捕获。

不得机械执行文档中的“全部改原生 Map”“全部用 structuredClone”“删除同步注释”或类似建议。只有 Java 行为、TS 当前行为和回归测试共同支持时才能改。稳定重复且有多处实例与自动化保护的模式，才进入批量迁移规则库。

### 十、G3/G4：核心平台无关化

核心只接收普通文本、普通对象和显式能力接口。依赖方向固定为：

```text
普通值对象/数据结构
  → Narsese 与配置解析
  → 推理规则与 Nar 核心
  → OpenNARS 公共门面
  → Node adapter / Browser adapter / CLI / Web UI
```

必须完成：

- `new Nar()` 或公共 `new OpenNARS()` 不读取文件、不访问 cwd/env/process、不启动终端或子进程；
- 配置提供文本/对象 API；Node shell 可读文件后传入，浏览器可输入或上传后传入；
- NAL 文件同样由宿主读取，核心只处理文本；
- 把仍位于 `src/io/ConfigReader.ts`、`src/main/Shell.ts` 等混合文件中的 Node 能力移到明确的 Node adapter；
- 浏览器 Worker 使用同一核心，不维护另一份推理实现；
- 浏览器可达图无 `node:fs/path/process/child_process/terminal`，无 fake shim、虚拟空模块或动态 require；
- 缺少能力、无效配置、文件读取失败、用户取消上传均有可诊断合同；
- Worker 取消或终止属于宿主，不在同步推理核心中引入 `await`。

### 十一、G5：单类公共门面合同

普通集成者只需一个运行时类 `OpenNARS`。本阶段只冻结平台无关的公共合同；单文件打包、示例壳和发布目录属于 G8 的发布工程，不把它们误称为整个产品目标。推荐最小合同由实际实现验证后冻结：

```ts
export class OpenNARS {
  static readonly version: string;
  constructor(options?: OpenNARSOptions);
  input(text: string): this;
  cycles(count: number): this;
  setVolume(volume: number): this;
  onOutput(listener: OpenNARSOutputListener): () => void;
  registerOperation(name: string, handler: OpenNARSOperationHandler): () => void;
  reset(): this;
  close(): void;
  readonly cycle: number;
}
```

公共合同至少覆盖多行输入、volume、IN/OUT/ANSWER/EXE、NAL-8 宿主操作、reset、close、重复取消订阅、非法周期、close 后调用和宿主操作异常。公共类型只能使用普通 TypeScript 类型，不得泄漏 jree、Java collection、Node stream、Worker 或内部事件 class。

### 十二、G6：J/P 集成冻结

在同一不可变 commit 和同一构建 manifest 上同时通过：

- M1 246/246，未解释语义差异 = 0，not_run = 0；
- M2 非增量 tsc 零诊断；
- 当前完整串行单测全部通过；
- 构建、dist API、公共 `.d.ts` 严格 consumer 编译；
- 生产依赖扫描：jree = 0、核心 Node built-in = 0、browser shim = 0；
- Node ESM、Node CommonJS、Shell、Windows cmd、POSIX sh；
- 真实浏览器主线程或 Worker 冒烟，覆盖多行输入、volume 与 NAL-8；
- 干净临时目录只复制正式文件即可运行；
- 产物版本、构建日期时间、source commit、SHA-256 可机器读取。

BabelNAR 横向测试不是每批 CI，也不替代 246 门。若发布候选已可作为单 JS 库被 adapter 调用，再按 `docs/babelnar-on-demand-cross-parity-test-plan.md` 由独立测试会话按需执行。

### 十三、G7：测量驱动的性能优化

G6 通过前禁止把性能改写混入平台迁移。G6 后：

1. 固定功能 commit、配置、随机条件、周期、冷/热模式和硬件环境；
2. 使用已有 M3 benchmark 及 CPU profile 找真实热点；
3. 一次只优化一个热点，建立前后重复样本和统计摘要；
4. 每批重跑受影响局部合同、M1/M2 门；
5. 不用 BabelNAR sleep 总时间或搜索步数替代算法性能；
6. 达到已批准预算，或主要热点继续优化的风险/收益不合理时停止，并记录残余。

性能改善不是语义正确的替代品。没有 profile 证据，不做“看起来更快”的大范围重写。

### 十四、G8：发布准备

G8 是一组发布工程任务，`npm run bundle` 只是其中一个构建功能，不代表发布准备的全部完成度。

#### G8-A：`npm run bundle` 单文件构建功能

实现稳定、可重复的 `npm run bundle`，输出核心两文件：

```text
opennars-304-ts.lib.js
opennars-304-ts.lib.d.ts
```

验收要求：

- `.lib.js` 自包含，无相对内部模块路径、无外部运行时包、无配置文件依赖；
- `.lib.d.ts` 是唯一核心声明文件，只暴露 `OpenNARS` 和必要的普通 TS 类型；
- 同一 `.lib.js` 通过 Node ESM、Node CommonJS 兼容加载和真实浏览器加载；具体 UMD/IIFE/兼容封装以最小 spike 和机器测试决定，不复制第二份核心；
- Shell 与 Web 是外部 JavaScript wrapper，不提供自己的 `.d.ts`，并且只调用公开 `OpenNARS`；
- 示例层可提供 `opennars-304-ts.shell.js`、`opennars-304-ts.web.js` 以及对应 `.cmd`、`.sh`，但与核心两文件分层；
- 客户直接交付目录不得包含 `.tgz`、源码树、`node_modules`、内部模块、多余声明文件或绝对构建路径；
- 连续两次从干净目录运行 bundle，除明确的构建日期字段外，文件清单和可复现内容一致；
- bundle 功能失败、缺少入口、类型生成失败或平台 smoke 失败时必须非零退出，不留下可误认成成功制品的半成品目录。

#### G8-B：公共文档更新

面向使用者维护一组小而完整的当前文档：

- 根 `README.md`：项目状态、安装/直接文件使用、Node/浏览器最短示例、CLI/Shell 入口；
- 公共 API 文档：唯一 `OpenNARS` 类、配置、输入、周期、输出、volume、NAL-8 操作和生命周期；
- 平台集成文档：Node 文件读取、浏览器文本/上传、Worker、Shell/Web wrapper；
- 构建与验证文档：typecheck、测试、`npm run bundle`、制品哈希和干净目录复验；
- 兼容性与限制：Java 3.0.4 canonical、M1/M2 口径、已批准平台差异、性能口径。

公共文档不得包含过期通过率、已失效 commit、作者本机绝对路径、未完成能力的肯定表述或仅供 Agent 使用的内部指令。

#### G8-C：历史 Agent 文档整理

先生成文档清单，把现有文档逐项分类为：

- `public-current`：发布后用户应阅读的当前文档；
- `maintainer-current`：维护者仍需使用的架构、迁移和验证文档；
- `historical-evidence`：保留用于追溯但不代表当前状态的阶段报告、旧提示词和旧调查；
- `duplicate-or-stale`：内容已被权威文档替代。

整理原则：

- 不删除 M1/M2 原始证据、canonical hash、Git 历史或仍被 spec/report 引用的材料；
- 旧 Agent 提示词、审阅稿、阶段性目标和过期状态报告移入明确的历史区或加醒目的历史状态头，不继续作为当前入口；
- 合并重复的战略、运行命令、迁移模式和平台说明，建立一个文档索引，标明权威版本与替代关系；
- 修复内部链接，检查中文编码；发布制品默认排除 reports、specs、Agent 提示词和历史证据；
- 删除或移动文件前先列出精确清单并确认引用关系；若会影响外部链接或大量历史引用，暂停请求用户决定。

#### G8-D：Release Candidate

Release Candidate 还必须包含：

- 版本策略和兼容性说明；
- 简洁中文/英文使用文档，面向懂 NARS 的集成者，不讲授 NARS 基础；
- Node、浏览器、Shell 的最小示例；
- license、changelog、构建 manifest、source commit、构建日期时间、SHA-256；
- M1/M2/J/P/性能摘要及已批准平台差异；
- 从干净目录重建与复验步骤；
- release artifact 白名单检查，无源码、临时报告、tsbuildinfo、tgz 或绝对构建路径泄漏。

G8-A、G8-B、G8-C、G8-D 必须分别给出验收结果；不得用“bundle 已生成”代替“发布准备完成”。

### 十五、G9：授权边界

只有用户明确授权后才允许：修改/创建正式 tag、创建 GitHub Release、发布 npm、推送发布网站或覆盖既有公开制品。准备完成不等于获得发布授权。

### 十六、长测试与 Token 纪律

- 一个时间点只运行一个正式长矩阵；使用 checkpoint、resume 和逐文件超时。
- 命令返回后台 session 后，不做数秒级轮询，不反复输出“仍在运行”。
- 优先使用 60–300 秒等待；如果系统会自动插入完成消息，就转去做不依赖结果的工作。
- 可并行做：依赖图审阅、局部合同编写、fixture/manifest 整理、报告框架、已落盘 checkpoint 分类、文档与 release 白名单。
- 只有 artifact/参数错误、checkpoint 停止增长、资源失控、破坏性命令或用户要求时才中断。
- 长测试完成消息到达后，先读取完整结果再调用下一轮模型，不为每个中间文件单独回应。

### 十七、提交、报告与完成口径

- 每个纵向小批次一个可回退 Conventional Commit；代码、测试、spec 勾选和报告保持可追溯。
- 每批推送前确认没有夹带用户文件、其他 Agent 代码、生成噪声或历史证据。
- 只有全量验收后才把 023、024、公共门面 spec 或 020 标为 complete。
- 不创建新 tag，不修改 `v0.1.0`，除非用户在当次会话明确授权。
- 最终阶段报告必须先给“可宣称到什么程度”，再列证据和剩余项。

每批报告至少包含：HEAD、origin/main、dirty 文件归属、spec 状态、直接 jree/平台扫描数字、测试计数、typecheck、build/API、局部 parity、NAL 结果、运行时间、提交与推送状态。

### 十八、允许暂停的条件

只有以下情况需要停下请求用户决策：

- 必须改变 canonical Java 语义或 M1 观察口径；
- 公共 API 需要破坏性选择且兼容层不能解决；
- 单一 JS 无法同时满足既定 Node/浏览器加载合同，需要用户选择格式；
- 需要删除、覆盖、发布、打 tag 或修改外部仓库；
- 同一阻塞在三次独立排查后仍无可验证进展。

普通局部失败、单个 NAL 超时、jree 迁移困难或性能未达理想值不是提前结束理由。

### 十九、现在的第一批动作

1. 立即停止继续修改当前 `SensoryChannel`/`VisionChannel` 在途切片；保留 diff，不 reset、不仓促提交。
2. 从最新 `origin/main` 建立干净隔离 worktree，固定 HEAD、canonical Java SHA 和全部 runner 参数。
3. 立即启动 G0 的 M1 245+1 全量矩阵；同一时间不得启动第二份矩阵。
4. M1 运行期间在同一稳定 commit 上完成 M2 全量门，或只并行整理结果 schema、文档清单与报告框架；不要修改核心代码。
5. 汇总 M1/M2 原始证据。只有 246/246、零未解释差异、M2 零诊断和全部构建/API/单测门通过，才宣布 G0 完成。
6. 若 G0 失败，冻结迁移工作并沿最早分歧最小修复；若 G0 通过，停止使用本提示词，切换到 `docs/luna-agent-post-g0-goal.md`，由后续目标接管在途切片与 G1/G2 DAG。

请从恢复最新 Git/LeanSpec/报告状态开始持续执行。
