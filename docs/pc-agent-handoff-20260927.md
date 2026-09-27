# PC Agent 交接包：2026-09-27

## 交接结论

- 项目目标仍以 `docs/luna-agent-active-goal.md` 为准，尚未完成；不要执行 `sleep 3600s`。
- 本轮 Termux 工作完成了 J5 的一个 Nar 时钟宿主边界切片，适合封存后交给性能更充足的 PC 环境。
- 本轮没有运行 M1--：当前批次是 J5 T1 risk-slice，不是责任簇收口。Termux 中所有 M1 相关测试仍必须使用 M1-- 的 243 项口径。
- PC Agent 负责完整 Java、完整 TS、完整 M1、完整 M2、严格 markerless 长测以及 `--stage 023/024` 阶段门；不得把 Termux 的 M1-- 结果冒充完整 245 项结果。

## 工作树与证据

```text
基线：8020800（已推送）
本轮：Nar currentTimeMillis 宿主能力切片（待本次提交后的 HEAD）
当前直接 jree 导入文件数：13
冻结 Java baseline SHA-256：264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954
```

- 代码：`src/main/Nar.ts`、`src/platform/RuntimeCapabilities.ts`、`src/platform/node/SystemCommandCapabilities.ts`、`src/public-api.d.ts`。
- 合同：`test/node/nar-clock-boundary.test.ts`。
- 本轮阶段报告：`reports/20260927-182859.md`。
- TS-only M2 原始输出：`reports/evidence/j5-nar-clock-m2-20260927.stdout`。
- 既有历史证据必须保留，但不要用 `git add -A` 将其混入本轮提交：`reports/evidence/m1-*`、`reports/evidence/j4-*`。

## 本轮验证事实

```text
Nar 时钟合同                         4/4 通过
配置/输入/Shell/Node stdin 回归      23/23 通过
TS-only M2                            488 项
  通过                                482
  失败                                  1
  跳过                                  5
typecheck/build/dist API/审计         通过
```

M2 唯一失败是 `test/node/nal-runner-semantics.test.ts:562` 的：
`NAL runner keeps hot results isolated from order and cold-process boundaries`。
它在 Termux 中约 `108711 ms` 后因 `assertRunSucceeded` 看到子进程非零退出而失败；当前日志只显示 `running chunk 1/1 (3 files)`，不能仅凭此断言生产时钟代码错误。PC Agent 必须先独立重跑，保存完整 stdout/stderr、子进程状态、信号、超时分类、最后进度周期和内存峰值。

## PC 恢复顺序

1. `git status --short --branch`，确认本轮提交已存在且没有覆盖用户改动。
2. 阅读 `docs/current-status.md`、`docs/developer-guide.md`、`docs/luna-agent-active-goal.md`、本文件与最新阶段报告。
3. 确认 `java-master` 是 PC 本地有效路径或符号链接；它是本地环境资产，不得提交，也不得跨端复用 Termux 的链接目标。
4. 确认 Java JAR、NAL 资料、冻结 baseline JSONL 与 Node/TypeScript 依赖均存在；缺资料先记录缺口，不伪造通过。
5. 在低并发、实时 RSS 监控下重跑本轮定向时钟合同和 M2；先复现唯一失败，不要同时启动第二份长测。
6. 对本轮提交运行 `npm run validation:plan -- -- --base 8020800 --head HEAD`，使用正确 J5 cluster、冻结 baseline SHA 与唯一 evidence prefix。
7. 若计划器仍给出 T1 risk-slice，运行受影响 NAL，不运行 M1--；只有 J5 所有出口条件满足并明确 `--close-cluster` 时，才运行一次 TS-only M1-- 243 项。
8. J5 及其他责任簇分别收口后，按不可变提交运行 `--stage 023`、`--stage 024`；阶段门的完整 Java/M1/M2/浏览器要求不能由 Termux 短门禁替代。

## PC 完整验证矩阵

```text
定向合同        先跑，失败即停止扩大范围
typecheck       非增量
build           记录源文件数与产物哈希
dist API        公开入口消费者验证
迁移/jree审计   记录差值与残余文件清单
platform审计    确认核心/宿主边界
TS-only M2      串行、单进程、保存 stdout/stderr
Java M2          阶段门再跑，记录 JAR 与 baseline 哈希
NAL 哨兵         2～5 个受影响样本，记录周期/耗时/RSS/marker
责任簇 M1--      仅收口时运行 243 项
阶段门 M1        PC 环境完整 245+1，不能在 Termux 替代
长周期           markerless 样本与至少 200 周期以上检查点一致性
浏览器           真实浏览器核心入口验证
```

## 检查点与内存纪律

- 同一矩阵只允许一个进程、一个结果文件、一个证据前缀；恢复使用 `--resume`，不覆盖旧结果。
- 长矩阵按小 chunk 持久化结果；每个 chunk 完成后记录 RSS、最后进度周期、状态和证据文件哈希。
- 发现内存持续下降、无进度、Android/Termux 清屏或进程被杀时立即停止，保留已完成 checkpoint，不从零重跑。
- 恢复版必须与从零跑到同一 checkpoint 的版本逐行比较：run key、文件顺序、expected marker、matched、error 分类、周期和最终摘要都要一致。
- 任何 timeout 只能作为运行观察记录；语义结论必须区分 `exception`、`process_limit`、`stalled_no_progress` 与正常完成。

## GPT-6 Astra 的推荐用法

### 让高智能模型承担高杠杆工作

1. **总架构师**：每个责任簇开始前读取目标、规格、代码图、历史证据和未决失败，产出不超过一个主攻切片、出口条件、反例和停止条件。
2. **失败归因器**：对每个失败同时检查代码、运行器、宿主环境、资源预算和证据格式，要求给出可证伪实验，而不是直接改超时或重跑。
3. **阶段门审计员**：逐项检查计划器 JSON、baseline 哈希、提交不可变性、M1/M2 口径、依赖审计和报告措辞，禁止“局部通过=规格完成”。
4. **交接压缩器**：每次崩溃后从 checkpoint、stdout/stderr、git 状态和最新报告恢复现场，生成短而完整的下一步执行包。

### 推荐的调用编排

```text
Astra 主会话：上下文建模 -> 选主攻切片 -> 审查实现 -> 决定门禁
       |
       +-- Astra 独立失败复核：只读日志与代码，给出根因排序
       |
       +-- Astra 独立阶段审计：只读证据与规格，检查是否允许 M1--/stage
       |
       +-- 低价模型/脚本：机械测试、哈希、报告模板、结果汇总
```

不要让多个模型同时修改同一文件；Astra 的并行调用只读审查，写入由一个主会话串行整合。这样牺牲 API 费用换取判断质量，但不会牺牲提交可追溯性。

### 每次 Astra 调用都提供的固定上下文

- 当前提交、目标提交和工作树差异。
- `current-status`、`developer-guide`、active goal、涉及 spec 与最新报告。
- 责任簇、计划器 JSON、冻结 baseline SHA、当前测试矩阵口径。
- 原始 stdout/stderr、checkpoint 文件、RSS/耗时、失败测试完整堆栈。
- 明确要求：先给事实和不确定性，再给最小改动；未经证据不得宣称完成。

### 速度与准确性的平衡

- 把 Astra 预算集中在责任簇边界、跨端差异、长测失败和阶段门决策；不要用它反复执行无变化的 shell 命令。
- 每个切片采用“一个假设、一个最小合同、一个最小实现、一个门禁”的闭环；失败立即缩小范围，不扩大并发。
- 代码、测试、报告和 spec 状态同一提交；完成前由 Astra 做一次反方审查，专门寻找过度声明、漏测和跨簇污染。
- 只有连续证据满足出口条件才推进到 M1--；只有 `--stage 023/024` 通过才更新规格完成状态。

## 交接后的停止条件

- 本轮上下文已经提交、推送、报告化并可从本文件恢复。
- PC Agent 接手前，不在 Termux 启动完整 245 项或第二份 M2。
- 总目标未完成，不能执行 `sleep 3600s`；完成后再按用户要求休眠。
