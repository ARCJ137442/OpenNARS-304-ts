---
status: complete
created: '2026-01-11'
tags: []
priority: medium
created_at: '2026-01-11T17:56:22.917Z'
depends_on:
  - 005-truthvalue-term-adapter
updated_at: '2026-01-11T18:08:39.373Z'
transitions:
  - status: in-progress
    at: '2026-01-11T17:57:48.144Z'
  - status: complete
    at: '2026-01-11T18:08:39.373Z'
completed_at: '2026-01-11T18:08:39.373Z'
completed: '2026-01-11'
---

# truthvalue-pure-ts

> **Status**: ✅ Complete · **Priority**: Medium · **Created**: 2026-01-11

## 概述

将 `TruthValue` 彻底从 `jree` 与 Java 语义中剥离，保留核心数值语义与字符串键能力，并采用具名工厂替代非字段映射构造函数。先写测试锁定行为，再进行实现重写。

## 目标

<!-- 解决问题后应该是什么样的？ -->

- 🎯 `TruthValue` 不再依赖 `jree`，使用原生 TypeScript 类型与语义。
- 🎯 保留稳定的字符串键（Map key）方案，移除 `hashCode/equals/clone/Serializable` 等 Java 语义。
- 🎯 采用“字段一一对应”的构造函数 + 具名工厂函数模式。

## 反目标

<!-- 该spec不是什么？不应做什么？不应有哪些结果？ -->

- ❌ 不改动 `TruthValue` 的核心数值公式与阈值语义。
- ❌ 不进行目录结构重构与跨模块重分层。
- ❌ 不引入新的跨层依赖或全局单例配置。

## 设计

`TruthValue` 重写为纯 TS 值对象：移除 Java 接口与 `java.lang.*` 调用，统一使用 `number/string`。仅保留一个最大化平铺的构造函数，其余构造需求由具名工厂方法承担。保留 `toKey()`（字符串哈希键）以供 Map/Set 使用，删除 `hashCode/equals/clone` 等 Java 语义。

## 计划

<!-- 将实现拆分为步骤 -->

<!-- 提示：如果计划超过 6 个阶段或本 spec 接近 400 行，请考虑子 spec：
     - IMPLEMENTATION.md 用于详细实现
     - 参考 .lean-spec\references\sub-spec-files.md 的拆分指南 -->

- [x] 先编写 TruthValue 行为测试（期望值、置信度上限、负性判断、字符串键稳定性、工厂函数）。
- [x] 梳理 `TruthValue` 的外部调用点（equals/hash/clone/构造器）并列出改造清单。
- [x] 重写 `TruthValue`：移除 `jree`、改为纯 TS 类型、保留字符串键。
- [x] 将非字段映射构造函数改为具名工厂，并更新调用点。
- [x] 运行测试与最小编译检查，确认行为一致。

## 测试

<!-- 如何验证完成？ -->

- [x] 新增 TruthValue 行为测试覆盖核心数值语义与字符串键。
- [x] 现有测试集可运行（或记录已知工具链阻塞项）。

## 备注

<!-- 可选：调研结论、备选方案、未决问题 -->
