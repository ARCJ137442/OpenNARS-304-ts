---
status: in-progress
created: '2026-08-22'
tags: []
priority: medium
created_at: '2026-08-22T01:54:49.696Z'
updated_at: '2026-08-22T01:55:28.194Z'
transitions:
  - status: in-progress
    at: '2026-08-22T01:55:28.194Z'
---

# java-304-canonical-baseline

> **Status**: ⏳ In progress · **Priority**: Medium · **Created**: 2026-08-22

## 概述

当前 TypeScript runner 使用的历史 JAR manifest 为 3.1.0-SNAPSHOT，而 Java 源码 HEAD 是 v3.0.4 之后的提交；源码、class、JAR 尚未形成可复现的行为基线。该 spec 只解决基线重建、artifact 选择和新旧 Java 行为证据，不扩展推理功能。

## 目标

- 固化历史 JAR、sources JAR 和 classes 的路径、时间、manifest 与 SHA-256，并在隔离 worktree 用当前 Java 304 源码构建新 artifact。
- 让局部算法和 NAL runner 能显式选择 JAR、classes、test-classes，并在结果中记录实际 artifact、commit、环境和结构化状态。
- 用 Java 测试、局部快照、代表性 NAL 和 245 个主资源矩阵决定是否切换 canonical；任何未解释差异都阻止自动切换。

## 反目标

- ❌ 不在现有 java-master/target 中覆盖历史 JAR，也不删除或版本化构建产物。
- ❌ 不修改 Java 业务语义来规避构建或测试失败。
- ❌ 在基线证据闭合前不修复 TypeScript 推理规则、插件、性能或大范围迁移。

## 设计

使用 Java commit `a2d76a246d830671142c61793e0c6aac058ba033` 的隔离 worktree，优先使用 JDK 18.0.2 和可正常输出版本的 Maven。runner 参数解析保持默认历史路径兼容，但显式参数优先，并校验路径存在；所有运行结果输出绝对路径和 SHA-256。新旧 Java 与 TypeScript 的比较按固定输入、周期、随机条件、超时和 marker 口径保存为机器可读结果。只有构建成功、Java 测试无未解释 failure/error、局部快照一致、代表性 smoke 无新增退化、全量矩阵无未解释新旧差异时才切换 canonical，否则保留双基线并报告决策阻塞。

## 计划

<!-- 将实现拆分为步骤 -->

<!-- 提示：如果计划超过 6 个阶段或本 spec 接近 400 行，请考虑子 spec：
     - IMPLEMENTATION.md 用于详细实现
     - 参考 .lean-spec\references\sub-spec-files.md 的拆分指南 -->

- [x] 固化历史 artifact，核验 Java/Maven/JDK，建立隔离 worktree 并完成 `clean verify`。
- [x] 记录新 artifact manifest、哈希、commit、环境和 Surefire 汇总；解析 failure/error/skipped。
- [x] 为局部算法和 NAL runner 增加显式 artifact 选择、路径校验、默认值和哈希输出。
- [ ] 完成 Java 自测、局部算法、代表性 NAL 与 245 主资源分层矩阵，形成新旧 Java/TS 证据。
- [ ] 按门槛决定 canonical 或保留双基线，更新文档、报告和可复现清单。

## 测试

<!-- 如何验证完成？ -->

- [ ] Java `clean verify` 成功，Surefire 无未解释 failure/error，并记录 skipped。
- [x] 局部算法快照数值容差为 `1e-5`，类型、文本、布尔值和集合形状精确一致。
- [ ] 代表性 NAL 覆盖 single_step、multi_step、toothbrush、detective2、vision 有界运行和 stability 短周期。
- [ ] 245 个主资源按 215/24/5/1 分层、逐文件超时、可恢复地记录 matched、异常、超时和未运行。
- [x] runner 参数、默认路径、不存在路径和实际 artifact 哈希有自动化回归覆盖。

## 备注

历史 JAR SHA-256 已知为 `796A3B20EE6ED7F8F6778367738AD728F0BFCC32CFAD99BACAEBEC41EBC7EB04`，manifest 为 3.1.0-SNAPSHOT；该 JAR 是 legacy baseline，不等同于已证实的 304 构建。历史 JAR 必须继续保留。
