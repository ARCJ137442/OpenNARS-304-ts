---
status: complete
created: 2026-08-24
priority: medium
depends_on:
- 018-ts-functional-equivalence
created_at: 2026-08-24T01:48:53.764880900Z
updated_at: 2026-08-25T08:11:05.931416400Z
completed_at: 2026-08-25T08:11:05.931416400Z
transitions:
- status: in-progress
  at: 2026-08-24T09:34:04.441781300Z
- status: complete
  at: 2026-08-25T08:11:05.931416400Z
---

# TypeScript zero-error build

## 概述

在 M1 功能冻结后，建立 M2 编译、正式构建、CLI 和核心 API 门禁。

## 目标

- 在不隐藏错误的前提下将完整 TypeScript 诊断降为零。
- 生成干净的正式构建产物，并验证 CLI 与核心 API 入口。
- 保留 M1 的机器可读行为和回归证据。

## 计划

- [x] 获取非增量诊断基线，并按依赖层次分组。
- [x] 按运行时、语言/实体、推理/控制、IO/插件和公共接口的依赖顺序修复类型问题。
- [x] 验证干净构建、CLI、核心 API、测试和 M1 矩阵。

## 测试

- [x] `npx tsc --noEmit --incremental false` 报告零错误。
- [x] 正式构建、CLI、核心 API、npm test 和局部 parity 通过。