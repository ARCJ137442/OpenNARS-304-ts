# Luna Agent：G0 通过后的历史推进目标

> **封存文档（禁止直接执行）**：本文曾用于 G0 之后的长期开发。项目已于 2026-08-27 阶段封存，其中的提交身份、进入条件和下一步已经过期；恢复工作必须先核对[当前状态](current-status.md)并重新授权。

历史用途：在当时的稳定 TypeScript commit 完成 G0 后交给开发 Luna Agent。本文现在只用于追溯，不是恢复入口。

## 可直接交给 Luna Agent 的提示词

你继续负责 `H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts`。本目标假设 G0 已经完成：最新稳定 TypeScript commit 已在固定 canonical Java artifact、随机/周期/超时口径下通过 M1 245+1 全量功能回归与 M2 全量编译/测试/构建门。你的任务不再是重复 G0，而是在这个新冻结点上持续完成生产核心去 jree、核心平台无关化、集成冻结、测量驱动性能优化与发布准备。

### 一、进入条件：先登记 G0，不重新猜测

开始时读取最新报告、G0 summary、逐文件 matrix 与 manifest，记录：

- G0 TypeScript commit、branch、origin/main；
- canonical Java source commit、JAR 路径与 SHA-256；
- 246 项实际运行数、通过数、marker mismatch、exception、timeout、not_run；
- 244 个 marker 样本结果；
- 2 个无 marker 样本的周期数与窗口摘要；
- 串行单测发现/通过/失败/跳过数；
- 非增量 tsc、build、dist API、CLI/Shell、局部 parity 与检查脚本结果；
- Node/npm/Java 与 runner 配置；
- 原始证据文件的相对路径与 SHA-256。

只有同时满足以下条件才进入后续开发：

- M1 246/246 实际完成；
- `unexpected_semantic_diff=0`；
- `exception=0`、`not_run=0`；
- timeout 全部符合已批准的高成本分层口径，不存在未分类样本；
- M2 非增量 tsc 零诊断；
- 全部串行单测、build、dist API、局部 parity 与 CLI/Shell 门通过；
- manifest 能把结果绑定到同一不可变 TypeScript commit 和 canonical Java JAR。

若缺少任一项：不要声称 G0 完成，不要继续迁移；恢复 `docs/luna-agent-goal-restart-prompt.md` 中的 G0 工作。若全部满足，在新阶段报告顶部写明“G0 accepted”，以后所有差异都以该 commit 为回退基线。

### 二、长期目标与执行顺序

执行顺序固定为：

1. 安全闭环接收目标时已经在途的一个小批次；
2. 完成 023：生产核心去 jree；
3. 完成 024：平台中立核心与宿主适配；
4. 冻结唯一公共运行时类 `OpenNARS`；
5. 在最新实现上重新完成 J/P 集成冻结；
6. 做 profile 驱动、停止条件明确的性能优化；
7. 完成发布准备，包括 `npm run bundle`、公共文档、历史 Agent 文档整理和 Release Candidate；
8. 只有用户明确授权后才正式打 tag、创建 GitHub Release、发布 npm 或覆盖公开网站制品。

023 与 024 可以在同一个纵向切片中协同，但当前主攻指标是生产核心 jree burn-down。平台边界修改只有在保护宿主职责、解除 jree 耦合或完成 024 明确阶段时才进入当前批次；不要同时打开多个无关模块。

### 三、目标 DAG

```text
G0 M1/M2 新冻结点（进入条件，已完成）
  └─→ A0 收尾唯一在途小批次
       └─→ A1 024-P3 插件与宿主能力注册完成
            └─→ J1 低风险 jree 容器/字符串/辅助类型
                 └─→ J2 领域集合与 equals/hash/order/iterator
                      └─→ J3 class identity/静态初始化/数值/Random
                           └─→ J4 删除 jree compat 与 package 依赖

J4 + A1
  └─→ P4 浏览器配置、文本输入与上传宿主入口
       └─→ P5 浏览器可达图无 Node shim
            └─→ U1 唯一 OpenNARS 公共门面
                 └─→ I1 最新 J/P 集成冻结
                      └─→ PERF 测量驱动性能优化
                           └─→ R1 发布准备
                                ├─ npm run bundle
                                ├─ 公共文档更新
                                ├─ 历史 Agent 文档整理
                                └─ Release Candidate
                                     └─→ RELEASE 用户授权后的正式发布
```

### 四、LeanSpec、报告与工作区纪律

1. 完整阅读根目录 `AGENTS.md`。
2. 运行 `.lean-spec\report-get-latest.py`，阅读最新 Human Notes。
3. 运行 `lean-spec board` 和 `lean-spec search`，重点阅读 018、019、020、023、024。
4. 023 管去 jree，024 管平台边界。不要为每个微小批次创建新 spec。
5. 在进入公共门面/bundle/文档发布工程前，先搜索是否已有对应 spec；没有时才用 LeanSpec `create` 创建，并让 020 依赖它。
6. 不手工创建 spec、不手改 frontmatter；编码前更新为 in-progress，全部验收后才 complete。
7. 005、008 等历史 in-progress 项不自动成为当前主线；只在它们实际阻塞 023/024 时处理。
8. 保留用户和其他 Agent 的 dirty 文件，不 reset、不 checkout 覆盖、不全局 stash、不误提交。
9. 每次只允许一个代码批次处于未提交状态；每批形成可回退 Conventional Commit 并推送前核对暂存清单。

### 五、每批不可回退门

每个小批次必须先定义一个可观察 Java/既有 TS 合同，并至少完成：

- 直接命中本次路径的正常与异常回归；
- `npm run test:unit:serial`；
- `npm run typecheck`，非增量零诊断；
- `npm run test:build`；
- `npm run test:api:dist`；
- canonical Java 局部算法 parity；
- 一个受影响 NAL smoke；
- jree/platform 审计、汉字编码与 `git diff --check`。

完整 246 矩阵不在每个低风险微批次重复，但以下时点必须重跑：

- 任一高风险 J2/J3 簇完成；
- 023 准备 complete；
- 024 准备 complete；
- I1 集成冻结；
- 性能优化结束后的 Release Candidate。

任何回退都会停止后续批次：先沿首次可观察分歧最小修复或回退当前提交，不把红色结果留给下一阶段。

### 六、A0/A1：收尾在途工作并完成 024-P3

接收目标时若存在属于 Luna 的在途修改：先读取 diff、最新报告和已运行测试，确认它只有一个明确因果目标。G0 已通过不能替代该未提交切片自己的测试。

当前/未来 P3 完成口径：

- 内置插件只由显式注册表创建；
- 未支持插件、已知插件但缺少宿主能力、参数非法形成互斥诊断；
- `^system` 等 Node 专属能力只在 Node adapter 注入；
- 插件顺序、启停、参数应用、float32 收窄和操作名称有回归；
- 核心不隐式读取文件、探测 process/env 或启动子进程；
- 公共 API 不泄漏 Java List、`java.lang.String`、jree class token 或 Node 类型；
- P3 的全部计划与测试项真实完成后，才更新 024，而不是完成一个容器切片就勾选 P3。

异常测试至少覆盖：未知插件、能力缺失、参数非法、宿主操作异常、重复启停、无插件配置。

### 七、J1—J4：完成生产核心去 jree

每批从最新机器清单选一个簇，以“直接导入减少 + 兼容职责收窄 + 行为合同保持”为完成单位。

#### J1：低风险簇

- 局部临时数组；
- 不参与 key 判等的短生命周期集合；
- 重复 Java 字符串包装；
- 原生数值/布尔辅助，但保留明确 float32/int32 收窄；
- 只依赖顺序和对象身份、已有直接测试的容器。

#### J2：领域集合语义

- LinkedHashMap/LinkedHashSet 的插入、替换、删除与遍历顺序；
- Java `equals/hashCode` 与 JS identity/value key；
- null/undefined；
- iterator/remove 和遍历期间修改；
- snapshot/view、clone 深浅和恢复态容器。

J2 不允许仅凭“JS Map 也有顺序”直接替换。先用 canonical Java 和 TS 局部合同证明 key、顺序与 mutation 语义。

#### J3：高风险运行时

- `Class<T>`、`instanceof`、class token 与事件派发；
- ESM 循环依赖和静态初始化；
- Java 重载与运行时参数分派；
- float32/int32/long；
- Java Random 的种子、调用次数和顺序；
- 内部类捕获、线程/单线程假设；
- Java String 的 UTF-16、compare/hash/大小写语义。

每个 J3 簇完成后必须运行完整 246 门。`docs/translation-deep-pitfalls.md` 只用于定位风险，不是自动改写规范；不得机械套用 `structuredClone`、原生 Map、删除同步说明或其他建议。

#### J4：jree 退场

只有以下条件同时满足，023 才能 complete：

- 生产核心可达图直接 `jree` import = 0；
- 生产核心 jree 运行时引用 = 0；
- 根公共 `.d.ts` 的 jree/Java 类型 = 0；
- jree compatibility 层已删除，或仅存在于与发布产物物理隔离的历史测试工具中，并有明确理由；
- `package.json` 不再声明 jree 运行时依赖；
- 删除 `node_modules` 后干净安装、typecheck、build、API 和测试无需获取 jree；
- M1 246/246 与 M2 全门重新通过；
- 残余机器清单为 0，或每个非生产残余都有路径、用途和退场条件。

每批报告同时记录 direct imports、ArrayList/Map/Set、JavaObject、java.lang/java.util、高风险项，不能只用某一个数字宣布百分比。

### 八、P4/P5：完成平台中立核心

依赖方向固定为：

```text
普通值对象与数据结构
  → 配置/Narsese 解析
  → 推理核心
  → OpenNARS 公共门面
  → Node adapter / Browser adapter / CLI / Web UI
```

完成条件：

- 默认 `new Nar()`/`new OpenNARS()` 不读取文件、不访问 cwd/env/process、不启动终端或子进程；
- 配置只通过文本、普通对象或显式 capability 进入核心；
- Node 从文件读取后传文本，浏览器从文本框/上传读取后传文本；
- 浏览器 Worker 使用同一推理核心，不维护第二套算法；
- 根核心可达图无 `node:fs/path/process/child_process/terminal`；
- 浏览器构建无 fake shim、虚拟空模块、动态 require；
- 文件不存在、编码错误、配置非法、能力缺失、上传取消、Worker 终止均有稳定错误合同；
- 同步推理循环不引入 `await`、微任务或未声明并发。

P4/P5 完成后运行真实浏览器 smoke，不以 bundle 构建成功替代浏览器执行证据。

### 九、U1：冻结唯一公共运行时类

普通集成者只需要一个运行时类 `OpenNARS`。推荐合同由实现测试后冻结：

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

必须测试：多行输入、volume、IN/OUT/ANSWER/EXE、NAL-8 操作、reset、close、重复取消订阅、非法周期、close 后调用、宿主操作异常。公共类型只能使用普通 TypeScript 类型，不泄漏 jree、Java collection、Node stream、Worker 或内部事件 class。

### 十、I1：最新 J/P 集成冻结

在同一不可变 commit 和构建 manifest 上同时通过：

- M1 246/246，未解释语义差异 0，not_run 0；
- M2 非增量 tsc 零诊断、完整串行单测、build、dist API；
- 生产依赖：jree 0、核心 Node built-in 0、browser shim 0；
- 公共 API consumer 严格编译；
- Node ESM、Node CommonJS interop、CLI、Shell；
- Windows cmd、POSIX sh；
- 真实浏览器/Worker 多行输入、volume、ANSWER 与 NAL-8 smoke；
- 默认配置、显式配置、配置错误与能力缺失；
- 版本、构建时间、source commit、SHA-256 可机器读取。

BabelNAR 只在候选库已可由 adapter 使用时按需运行，不进入每批 CI，也不替代 246 门。

### 十一、PERF：测量驱动性能优化

I1 通过前不混入性能改写。I1 后：

1. 固定 commit、配置、随机条件、周期、冷/热模式和硬件；
2. 重建 M3 benchmark 基线并重复运行；
3. 用 CPU profile 选择一个真实热点；
4. 一次只优化一个热点；
5. 比较中位数、离散度、内存/超时和功能回归；
6. 每批通过局部合同与 M1/M2 门；
7. 达到批准预算，或继续优化的收益明显低于语义风险时停止并记录残余。

不用 BabelNAR 人工 sleep 总时间或搜索步数代替算法性能。没有 profile 证据，不做大范围“看起来更快”的重写。

### 十二、R1：发布准备

发布准备包含四个彼此独立的门，必须逐项验收。

#### R1-A：`npm run bundle`

实现稳定、可重复的 `npm run bundle`，核心输出为：

```text
opennars-304-ts.lib.js
opennars-304-ts.lib.d.ts
```

- `.lib.js` 自包含，无相对内部模块路径、外部运行时依赖、配置文件或 Node built-in；
- `.lib.d.ts` 是唯一核心声明文件；
- 同一 `.lib.js` 通过浏览器、Node ESM 和 Node CommonJS interop；
- Shell/Web 是无 `.d.ts` 的外部 JS wrapper，只调用公共 `OpenNARS`；
- 示例可带 `.cmd`/`.sh`，但与核心两文件分层；
- 客户目录无 `.tgz`、源码、node_modules、内部模块、多余声明和绝对路径；
- 失败时非零退出，不留下可误认成功的半成品。

#### R1-B：公共文档

- 更新根 README；
- 写简洁的 `OpenNARS` API 与 Node/浏览器集成文档；
- 说明配置文本/对象、文件/上传宿主边界、CLI/Shell、volume、NAL-8；
- 写构建、测试、bundle、哈希复验和兼容性/限制；
- 用户默认懂 NARS，不重复讲授 NARS 理论；
- 不含过期通过率、失效 commit、本机绝对路径或未完成功能的肯定描述。

#### R1-C：历史 Agent 文档整理

生成清单并分类：`public-current`、`maintainer-current`、`historical-evidence`、`duplicate-or-stale`。

- M1/M2 原始证据、canonical hash 和仍被引用的历史材料不得删除；
- 旧提示词、旧目标、阶段性审阅和过期状态移入历史区或加历史标记；
- 合并重复的战略、命令、迁移与平台说明；
- 建立权威文档索引和替代关系；
- 修复链接和编码；
- 发布制品排除 reports、specs、Agent 提示词与历史证据；
- 大量移动/删除或影响外部链接前请求用户决定。

#### R1-D：Release Candidate

- version、license、changelog；
- source commit、构建时间、manifest 与 SHA-256；
- M1/M2/J/P/PERF 摘要与已批准平台差异；
- 干净目录重建/复验步骤；
- release artifact 白名单；
- Node、浏览器、Shell 最小示例；
- 不含 tsbuildinfo、临时报告、tgz、绝对路径和无关源码。

bundle 完成不等于发布准备完成；R1-A/B/C/D 必须分别报告。

### 十三、长测试与 Token 纪律

- 同一时间只运行一个正式长矩阵；使用 checkpoint、resume 和逐文件超时。
- 后台 session 不做数秒轮询，不反复说“仍在运行”。
- 使用 60—300 秒等待，或等待系统自动插入完成消息。
- 测试期间可做只读依赖审阅、schema 校验、文档清单、报告框架和已完成 checkpoint 分类。
- 不在长矩阵运行时修改被测 commit 或启动第二个同名矩阵。
- 只有 artifact/参数错误、checkpoint 停止增长、资源失控、破坏性命令或用户要求时中断。

### 十四、提交、推送与发布授权

- 每个纵向小批次一个可回退 Conventional Commit；报告、测试与 spec 同步。
- 推送前检查 staged 文件，排除用户文件、其他 Agent 修改和生成噪声。
- 只有完整验收后才把 023、024、公共 API/bundle spec 或 020 标为 complete。
- 可以按既有授权推送普通开发提交到 origin/main；不得自行创建/移动 tag。
- 正式 GitHub Release、npm 发布、网站覆盖和公开制品替换必须取得用户当次明确授权。

### 十五、完成与暂停条件

本长期目标的开发阶段完成条件：

- 023 complete；
- 024 complete；
- 唯一 `OpenNARS` 公共门面冻结；
- I1 集成冻结通过；
- 性能完成到批准预算或记录了可接受停止理由；
- R1-A/B/C/D 全部通过；
- 未解释语义差异 0；
- 工作区无本目标产生的未提交临时文件；
- 已形成 Release Candidate，等待或取得用户发布授权。

只有以下情况请求用户决策：

- 需要改变 canonical Java 语义或 M1 观察口径；
- 公共 API 存在不可兼容的破坏性选择；
- 单一 JS 无法满足既定 Node/浏览器合同；
- 需要大量移动/删除历史文档或改变外部链接；
- 需要发布、打 tag、覆盖外部制品；
- 同一阻塞经过三次独立排查仍无可验证进展。

普通局部失败、单个 NAL 超时、jree 迁移困难或性能不够理想不是提前结束理由。

### 十六、G0 通过后的第一批动作

1. 登记 G0 commit、manifest、M1/M2 摘要与证据路径，写入新阶段报告。
2. 读取最新 Git 状态和在途 diff；若有单一 Luna 小批次，先以自己的局部/M2/parity/NAL 门完成并提交。
3. 重新运行 jree/platform 审计，生成以 G0 commit 为起点的 burn-down 清单。
4. 复核 024-P3 未完成条件；若只剩少量明确项，先完成 P3，否则从 023 选择一个能减少直接 jree import 的低风险 J1 簇。
5. 为所选簇写正常路径与至少同等数量的异常/边界测试，再实施最小修改。
6. 每批完成后更新 burn-down、报告、LeanSpec 与提交；不要在同一批顺手修改第二个无关模块。

请从验证并登记 G0 证据开始持续执行。
