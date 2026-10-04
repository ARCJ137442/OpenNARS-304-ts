---
status: in-progress
created: 2026-10-02
priority: high
tags:
- performance
- demo
- release
created_at: 2026-10-02T13:51:09.692848600Z
updated_at: 2026-10-02T13:51:29.751352Z
transitions:
- status: in-progress
  at: 2026-10-02T13:51:29.751352Z
---

# Native performance convergence and fix release

## 目的与边界

以 [当前目标](../../docs/active-goal-20261002.md) 为详细验收定义，在 031 runtime 原生化与 036 平台中立核心的已验收基础上，继续优化真实推理和 Demo 长尾，完成新修订版。不得改变 OpenNARS 3.0.4 可观察语义；原始 2,000,000 周期稳定性未完成时必须如实披露。

本规格**需要** 031 与 036 的已实现合同。当前安装的 `lean-spec` CLI 没有 `link` 子命令，也没有 `update --depends-on`；依赖关系暂以此处显式记录，工具缺口不能伪造为已链接。

2026-10-03 用户新增 Web Lab 发布前设计与终端整合要求，故本次发行还须完成 [044](../044-web-lab-terminal-integration/README.md) 的发布前入口、终端和浏览器门。LeanSpec CLI 搜索 `Demo Lab` 时因中文字节边界 panic，`link` 命令仍不可用；以实际文件和本段为准，不伪造工具结果。

## 实施计划

- [x] 对性能候选保留同配置 A/B、源码身份、RPS/TPS、长尾、概念数与 RSS；否决无收益或语义回退的候选。
- [x] 完成 Bag/词项判等/概念增长与 GC 的本轮有证据批次，并保留 Java 可观察的恢复态键与迭代合同；**未证明热点已穷尽**。
- [x] 针对 Demo Worker 与环境调度做独立测量；确认同步/异步、HUD、非 babble 操作及真实画面；**持续目标速率仍未达**。
- [ ] 发布前如实披露持续 TPS 与目标差额、残余热点，以及 2026-10-03 用户要求在反复低收益后主动停止本轮试探；不得把主动停止称为实测达标或严格收敛。
- [ ] 在同一不可变提交通过 M1′、完整 M2、strict markerless、Node/API、真实浏览器、依赖与平台审计。
- [x] 更新中英双语文档与 Lab Pages，分内容提交推送，创建仅含当前包资产的 GitHub fix release；public 可见性的人工审查仍由仓库所有者最后确认。

## 测试与声明门

- [ ] 直接合同、非增量 typecheck、build、dist API、TS-only M2 与 Java M2 零失败。
- [ ] M1′ 243/243 加 #25/#246；#245 降周期按预估与 1800 秒安全限单独分类；strict markerless 等价。
- [ ] 浏览器十个 Demo、Microworld、canvas、操作记录、FPS/TPS/RPS 和 Worker 入口实测可用。
- [ ] 证据区分 passed、failed、skipped、timeout、process_limit、exception、stall、not_run；资源限制不能写成通过。
- [ ] 发布产物、许可证/来源、旧 release 资产、公开路径与文档可供无上下文用户检查。

当前第一候选和原始数据见 [性能探查](../../docs/probes/20261002-performance-next-batch.md)；是否接受须待完整门禁。

## 本轮性能试探的停止点

最后一次已接受的核心优化之后，重复首查、改名安全名称索引和无空间索引词项几何对象快路均未给出可接受的端到端收益；后两者还增加了代表负载的 RSS。用户明确要求“如果屡次无明显优化，我们就停下来”，因此撤销全部尚未接受的候选，保存原始 JSON、源码 patch 与直接合同，并停止新的性能实验。完整反证见 [Bag 探查](../../docs/probes/20261002-bag-term-equality.md)。这是一项**主动停止决策**，不是“再无有效优化空间”的技术证明；Microworld 示例知识模式 30 秒平均 `15.875 TPS`、末窗 `11.776 TPS`，仍低于持续 20 TPS 期望。后续发行资料须显著披露这些限制，同时继续完成与性能试探独立的行为、M1′/M2、Node/浏览器及公开资产门。

2026-10-05 已完成 Pages、GitHub `v1.0.6` fix release、Core `test:release`、typecheck、dist API、TS/Java M2 历史门复核和最新 Demo 真实浏览器回归；当前 Demo 提交为 `6cf5401`，Pages 为 `7737547`。经典 Microworld 默认入口已修正为随机 seed + 空白探索，显式 `?seed=<n>&knowledge=starter` 才启用示例先验；Shot 静态靶/进化角色矩阵已按原作校正。性能持续目标未达标、原始长稳定性 `not_run`、049 长期行为等价与 public 可见性审查仍未完成，故本 spec 保持 `in-progress`。

发行准备补充：清理 v1.0.4 误附旧包后，发现宽泛 `src` 打包规则仍收录本地历史 `.codex-corrupt` 文件。改为 TypeScript 文件白名单并排除内部检查清单；保留所有本地证据。增强发行检查器拒绝临时源文件、内部维护文档和缺失的包内 Markdown 目标，修正用户文档的维护链接后 `test:release` 通过，325成员、TypeScript/API/CLI/Shell 均通过。原始日志及 SHA-256 在当前状态。这一打包修复不改变推理核心，也不构成新版本发布或整体 spec 完成。

## 第一批：Bag 全表读取

`Bag.findEquivalentKey` 的恢复态扫描保留 Java 相等方向和原有回退路径，读取从 `NativeMap.entrySet()` 的逐项包装改为 `recordsForView()` 的只读原始记录；同一改动覆盖 `rebuildEqualityBucket`。两轮同配置 A/B 的 RPS 增幅为 25.3% 和 24.0%；现有 Bag/NativeMap 合同 28/28、TS-only M2 506/508（2 skip）、Java M2 508/508、typecheck、build、dist API 与静态审计通过。仍须在不可变提交上完成 M1′、strict markerless 和 Demo 浏览器验收，才可接受为本规格的性能轮次。

## 第二批：Bag 词项键的必不相等早退

在 Bag 全表回退中，仅当查询键和已有键均为 `Term` 且具体构造器不同，才跳过 `runtimeValueEquals`；`Term`、`CompoundTerm`、`Variable` 的现有 `equals` 在此情况下都返回 false。其余键、同类词项、恢复态异 hash 和变量作用域继续走原合同。两轮交叉 A/B 的 RPS 为 `4.043 -> 9.316` 和 `4.856 -> 8.904`，概念终点均为 `2296`；新增直接合同、非增量 typecheck、build/dist API、TS-only M2 `507/509`（2 skip）、Java M2 `509/509`、静态审计均通过。固定提交 `41070c1` 的 M1′ 主体 `243/243`、#25/#246、#245 降载 65536 与两项 strict markerless 也通过。真实 Chrome 重建 Worker 后，Microworld 30 秒平均 `11.520 TPS`，最后五秒 `0.40 TPS`，因此尚未达到持续 TPS 目标。原始测量与来源见 [词项键探查](../../docs/probes/20261002-bag-term-equality.md)；不得凭 M1′ 和短测勾选性能/发布门。

## 第三批：全 Term Bag 的具体类索引（候选）

针对第二批后的 CPU profile（`Bag.findEquivalentKey` 3413/7914 自耗采样），为全 Term 键的 Bag 在 hash 桶缺失时建立按具体类的原生临时索引，保留同类的完整 value equality、恢复态异 hash 查找和插入顺序；混合键仍全扫描。候选→基线→候选复测的固定 CartPole 20 ticks × 5 cycles 为 `22.625 / 9.488 / 23.525 RPS`，概念终点均 2296，峰值 RSS 较基线高约 50–62 MB。固定生产提交 `82469cc` 的 42/42 相关合同、非增量 typecheck、build/dist API、静态审计、TS-only M2 `508/510`（2 skipped）、Java M2 `510/510`、M1′ 主体 `243/243`、#25/#246、#245 降载 65536 和两项 strict markerless 均通过。M1′ 单文件峰值 RSS 860 MB。当前 Worker 的真实 Chrome 30 秒复测：Microworld 平均 `12.28 TPS`、末窗 `2.00 TPS`；CartPole 平均 `2.06 TPS`、末窗 `1.20 TPS`，仍未达到持续目标。完整数据见 [词项键探查](../../docs/probes/20261002-bag-term-equality.md)。

## 第四批：标准词项名称预筛（核心门通过，浏览器仍未达标）

在恢复态异 hash 的同具体类扫描中，仅当两端 `equals` 是项目内相同的标准 `Term`、`CompoundTerm` 或 `Variable` 方法时，先用原生名称排除必不相等者；自定义判等仍走双向完整合同。20-tick 候选/基线/复测 `26.47 / 23.02 / 26.53 RPS`，30-tick `27.98 / 25.79 / 28.60 RPS`，对应概念终点均一致。直接合同包括自定义跨名称相等、恢复态异 hash 与固定存储 hash 的名称变更。固定提交 `708afc5` 的 TS-only M2 `511 passed / 2 skipped / 0 failed`、含 Java M2 `513/513`、M1′ 主体 `243/243`、#25/#246、#245 降载 65536 和两项 strict markerless 均通过。M1′ 主体逐文件耗时合计 `693624 ms`，上一候选 `665581 ms`，不能把短 Demo 负载提升泛化为全部 NAL 提升。旧 Demo 输入的后续 Chrome 30 秒复测仍只有 Microworld 平均 `12.57`、末窗 `2.79 TPS`，CartPole 平均 `2.23`、末窗 `1.59 TPS`。此前三个小候选收益不足 5% 或回退均已撤销，不构成性能收敛证明。

## 浏览器诊断日志修正（当前批次）

真实 Demo 出现 `INFO ProcessGoal` 时，核心 `Logger.log` 原错误地调用 `console.error`，使基准把普通操作诊断分类成浏览器错误。现只将 INFO 改为 `console.info`，保留严重错误及异常堆栈的错误通道。固定生产提交 `083d7b8` 的直接合同、typecheck、build/dist API、TS-only M2 `512 passed / 2 skipped`、含 Java M2 `514/514`、M1′ 主体 `243/243`、#25/#246、降载 #245 与两项 strict markerless 均通过；新 Worker 的 Chrome 样本 `consoleErrors=0`。原始证据与可证伪边界见 [运行时探查](../../docs/probes/20261001-runtime-java-shape-cleanup.md)。

## Demo 具身输入与监测状态

相邻 Lab 项目的具身输入批次让普通十个 Demo 和 Microworld 示例模式在真实 Chrome、babble 0 下发出 NARS 操作；规则预置身份已披露。CartPole 旧逐刻 `good` 反馈改成操作后有结果才反馈，五个扩展环境改为前五刻完整输入、之后变化即报并每五刻刷新；这些是**Demo 行为适配**，不计入核心同语义性能轮。固定 30 秒测试表明 Shot 接近默认 5 TPS；TicTacToe、TestChamber、FighterPlane、Echo Relay 后段仍慢，BandRobot 虽常发操作但未完成交付。Microworld 示例模式目标 20 TPS 时平均约 `15.9`、末窗约 `11.8 TPS`，未达持续目标。HUD 已改为墙钟完成周期 RPS 并在空窗归零。当前仍需针对重负载与无效行动继续验证，不能勾选 spec 042 的性能收敛或最终发行复选框。详细固定提交矩阵在 Demo 项目 `docs/probes/20261003-embodied-operation-adaptation.md`。
