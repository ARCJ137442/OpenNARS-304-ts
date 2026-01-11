---
status: in-progress
created: '2026-01-11'
tags: []
priority: medium
created_at: '2026-01-11T11:38:28.165Z'
depends_on:
  - 003-dependency-analyze-brief-plan
updated_at: '2026-01-11T11:55:30.076Z'
transitions:
  - status: in-progress
    at: '2026-01-11T11:55:30.076Z'
---

# dependency-analyze-expanded

> **Status**: ⏳ In progress · **Priority**: Medium · **Created**: 2026-01-11

## 概述

基于 spec003 产出的单文件工作流与路线图模板，对关键 TypeScript 文件展开具体依赖分析，形成可复用、可核对的分析记录，并逐步完善整体转写顺序。该 spec 聚焦“如何分析”，不涉及代码改写，确保后续转写有稳定依据。

## 目标

<!-- 解决问题后应该是什么样的？ -->

- 🎯 使用 spec003 的模板完成一批核心文件的依赖分析记录。
- 🎯 在分析中明确 TS 依赖、Java 依赖及差异原因。
- 🎯 将分析结论反哺到路线图的细化顺序与优先级。

## 反目标

<!-- 该spec不是什么？不应做什么？不应有哪些结果？ -->

- ❌不修改任何 TypeScript/Java 源码，仅进行分析与记录。
- ❌不脱离 java-master 与 `deps.xml` 独立推断逻辑。
- ❌不在无依赖证据的情况下调整路线图顺序。

## 设计

分析记录使用 spec003 的模板结构，包含 TS 依赖、Java 依赖、差异说明、功能描述与一致性风险点。路线图更新遵循“模块链条 → 文件级排序”的顺序，并标注依赖来源，方便复核与复用。

❗重要：分析记录的输出格式为 Markdown 文件，并存放在 `analysis` 文件夹下，文件夹结构应与`src`文件夹结构保持一致，文件名为 `xxx.md`，其中 `xxx` 为对应 TypeScript/Java 文件名。

📝 所有单文件记录必须套用 `specs/004-dependency-analyze-expanded/file_template.md`（中文模板），逐段填写语法检查、依赖对照、Java 功能描述、风险与路线图位置，确保记录可直接复用。

## 计划

<!-- 将实现拆分为步骤 -->

<!-- 提示：如果计划超过 6 个阶段或本 spec 接近 400 行，请考虑子 spec：
     - IMPLEMENTATION.md 用于详细实现
     - 参考 .lean-spec\references\sub-spec-files.md 的拆分指南 -->

- [ ] 选择首批分析文件清单（按路线图基础模块优先）。
- [ ] 逐文件执行单文件工作流并输出分析记录。
- [ ] 对照 `deps.xml` 标注结构性依赖与表面依赖差异。
- [ ] 从 Java 源文件补写功能描述与关键语义点。
- [ ] 汇总分析结果，更新路线图的文件级顺序与依赖来源标注。

## 测试

<!-- 如何验证完成？ -->

- [ ] 每个已分析文件都有完整的模板化记录，包含依赖清单与差异说明。
- [ ] 路线图更新能被 `deps.xml` 复核，并记录所有不一致点。

## 备注

<!-- 可选：调研结论、备选方案、未决问题 -->
