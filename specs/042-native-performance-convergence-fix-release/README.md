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

## 实施计划

- [ ] 对每个候选保留同配置 A/B、源码提交、RPS/TPS、长尾、概念数与 RSS；否决无收益或语义回退的候选。
- [ ] 完成 Bag/词项判等/概念增长与 GC 的有证据批次，并保留 Java 可观察的恢复态键与迭代合同。
- [ ] 针对 Demo Worker 与环境调度做独立测量；确认同步/异步、HUD、非 babble 操作及真实画面。
- [ ] 达到实测 TPS 目标或连续三轮主要指标提升均小于 5% 的收敛条件；未达目标需解释剩余限制。
- [ ] 在同一不可变提交通过 M1′、完整 M2、strict markerless、Node/API、真实浏览器、依赖与平台审计。
- [ ] 更新中英双语文档与 Lab Pages，分内容提交推送，创建仅含当前包资产的 GitHub fix release；给出 public 可见性的人工审查结论。

## 测试与声明门

- [ ] 直接合同、非增量 typecheck、build、dist API、TS-only M2 与 Java M2 零失败。
- [ ] M1′ 243/243 加 #25/#246；#245 降周期按预估与 1800 秒安全限单独分类；strict markerless 等价。
- [ ] 浏览器十个 Demo、Microworld、canvas、操作记录、FPS/TPS/RPS 和 Worker 入口实测可用。
- [ ] 证据区分 passed、failed、skipped、timeout、process_limit、exception、stall、not_run；资源限制不能写成通过。
- [ ] 发布产物、许可证/来源、旧 release 资产、公开路径与文档可供无上下文用户检查。

当前第一候选和原始数据见 [性能探查](../../docs/probes/20261002-performance-next-batch.md)；是否接受须待完整门禁。

## 第一批：Bag 全表读取

`Bag.findEquivalentKey` 的恢复态扫描保留 Java 相等方向和原有回退路径，读取从 `NativeMap.entrySet()` 的逐项包装改为 `recordsForView()` 的只读原始记录；同一改动覆盖 `rebuildEqualityBucket`。两轮同配置 A/B 的 RPS 增幅为 25.3% 和 24.0%；现有 Bag/NativeMap 合同 28/28、TS-only M2 506/508（2 skip）、Java M2 508/508、typecheck、build、dist API 与静态审计通过。仍须在不可变提交上完成 M1′、strict markerless 和 Demo 浏览器验收，才可接受为本规格的性能轮次。
