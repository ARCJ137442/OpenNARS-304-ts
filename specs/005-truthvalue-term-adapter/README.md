---
status: in-progress
created: '2026-01-11'
tags: []
priority: medium
created_at: '2026-01-11T17:24:42.939Z'
updated_at: '2026-01-11T17:28:10.556Z'
transitions:
  - status: in-progress
    at: '2026-01-11T17:28:10.556Z'
---

# truthvalue-term-adapter

> **Status**: ⏳ In progress · **Priority**: Medium · **Created**: 2026-01-11

## 概述

当前 `TruthValue` 内含 `toWordTerm`，使实体层直接依赖语言层 `Term`。为保持分层边界与可跑通逻辑，先将转换逻辑迁移到与 `TruthValue` 同目录的新适配文件，并保留与 Java 源码路径的可追溯性，后续再考虑目录重构。

## 目标

<!-- 解决问题后应该是什么样的？ -->

- 🎯 `TruthValue` 不再依赖 `Term`，保持纯值对象语义。
- 🎯 新增 `src/entity/TruthValueTerm.ts` 承载 `toWordTerm` 逻辑。
- 🎯 调整高层调用点，确保逻辑行为不变。

## 反目标

<!-- 该spec不是什么？不应做什么？不应有哪些结果？ -->

- ❌ 不进行目录结构重构或模块重分层。
- ❌ 不修改 `TruthValue` 的核心数值/比较逻辑。
- ❌ 不引入新的跨层循环依赖。

## 设计

<!-- 技术方案、架构决策 -->
采用“同层适配器”方案：在 `src/entity` 下新建 `TruthValueTerm.ts`，导出 `truthToWordTerm(truth: TruthValue): Term`（名称可微调）。`TruthValue.ts` 移除 `Term` 相关 import 与方法，`InternalExperience` 由适配函数替代原调用。该方案保留路径接近性，降低后续检索成本，同时保持依赖方向由高层显式选择。

## 计划

<!-- 将实现拆分为步骤 -->

<!-- 提示：如果计划超过 6 个阶段或本 spec 接近 400 行，请考虑子 spec：
     - IMPLEMENTATION.md 用于详细实现
     - 参考 .lean-spec\references\sub-spec-files.md 的拆分指南 -->

- [x] 对照 Java `TruthValue.toWordTerm`，确定迁移范围与行为细节。
- [x] 新建 `src/entity/TruthValueTerm.ts` 并迁移实现。
- [x] 更新 `src/plugin/mental/InternalExperience.ts` 的调用点。
- [x] 更新 `src/operator/mental/Believe.ts` 的调用点。
- [x] 调整 `TruthValue` 以移除 `Term` 依赖。
- [x] 运行最小验证（`tsc` 或相关测试）。

## 测试

<!-- 如何验证完成？ -->

- [ ] `npx tsc src/entity/TruthValue.ts --noEmit` 通过。
- [ ] 如有相关测试，确保 `InternalExperience` 路径逻辑正常。

## 备注

<!-- 可选：调研结论、备选方案、未决问题 -->
若后续出现多处调用，可在 `language` 或 `inference` 层建立统一的格式化/适配模块，再将 `TruthValueTerm.ts` 迁移上层。
