---
status: complete
created: 2026-08-24
priority: medium
depends_on:
- 019-tsc-zero-error-build
- 023-jree-removal-native-runtime
- 024-platform-neutral-core-host-adapters
created_at: 2026-08-24T01:48:53.859499900Z
updated_at: 2026-09-30T11:31:45.199421Z
completed_at: 2026-09-30T11:31:45.199421Z
transitions:
- status: in-progress
  at: 2026-08-25T11:48:42.932070800Z
- status: complete
  at: 2026-09-30T11:31:45.199421Z
---

# TypeScript performance and release

## 概述

在 M2 构建冻结后，建立 M3 可用性能、基准测试、CLI 和发布门禁。

## 目标

- 消除由实现低效导致、且尚未解释的 process limit。
- 在单线程契约下量化 Java/TypeScript 冷启动和热运行性能。
- 生成可复现的基准、发布文档和经用户确认的发布边界。

## 计划

- [x] 获取关闭诊断 trace 的正式性能基线。
- [x] 一次只针对一个已测量热点做 profile 和优化，不改变语义。
- [x] 重新运行功能、编译、CLI、基准和 245+1 验收门禁。

## 测试

- [x] 主要 NAL 工作负载在批准的性能预算内完成。
- [x] 优化后 M1 和 M2 门禁仍保持通过。
- [x] 正式构建、CLI、核心 API、基准和发布证据可复现。

### 2026-09-30：NativeMap 性能批次与 v1.0.0 收口

`8e1855c` 的 NativeMap 哈希命中路径移除 `records.indexOf(record)` 线性回表，并由直接合同、完整 TS-only M2、代表性 M3 workload 和阶段 M1-prime 保护。M3 四个 workload 全部 functional/parity，通过 `60000 ms/1024 cycles` 预算；M1-prime 组合为 M1-- `243/243`、#25 `1/1`、#245 降载 `1/1`、#246 `1/1`，两个 `131072` 周期 markerless digest 均 `equal=true`，含 Java M2 `498/498`。release package 的外部 tsc、公共 API、CLI、Shell、配置和包内容检查通过。

正式发行提交为 `8568ebd`，版本为 `1.0.0`，GitHub Release 为 `v1.0.0`。原始 2,000,000 周期长期稳定性仍记录为当前设备的持续系统瓶颈，不作为日常发布门。

## Agent 工作流与身份披露

2026-09-30 的发行准备由 `GPT-6 Sol High` 执行：先读取仓库规则、当前状态、LeanSpec 和既有证据，再在同一责任边界内批量修改公开文档、归属声明和发行脚本；随后运行非增量 typecheck、串行 M2、build、dist API、release package、编码检查和 demo 验证，审阅 diff 后提交并推送。Agent 没有自动改变 GitHub 可见性、发布 npm 或创建不可逆 release tag；这些操作保留给仓库所有者确认。

完整工作流记录见 [`docs/agent-workflow-disclosure.md`](../../docs/agent-workflow-disclosure.md)。
