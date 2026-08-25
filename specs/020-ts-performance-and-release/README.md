---
status: in-progress
created: 2026-08-24
priority: medium
depends_on:
- 019-tsc-zero-error-build
created_at: 2026-08-24T01:48:53.859499900Z
updated_at: 2026-08-25T11:48:42.932070800Z
transitions:
- status: in-progress
  at: 2026-08-25T11:48:42.932070800Z
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
- [ ] 一次只针对一个已测量热点做 profile 和优化，不改变语义。
- [ ] 重新运行功能、编译、CLI、基准和 245+1 验收门禁。

## 测试

- [ ] 主要 NAL 工作负载在批准的性能预算内完成。
- [ ] 优化后 M1 和 M2 门禁仍保持通过。
- [ ] 正式构建、CLI、核心 API、基准和发布证据可复现。
