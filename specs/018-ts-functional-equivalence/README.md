---
status: in-progress
created: 2026-08-24
priority: medium
depends_on:
- 013-java-304-canonical-baseline
created_at: 2026-08-24T01:48:40.661749500Z
updated_at: 2026-08-24T01:49:20.448020Z
transitions:
- status: in-progress
  at: 2026-08-24T01:49:01.124331600Z
---
# TypeScript functional equivalence

## 概述

建立 M1 Java/TypeScript 功能等价门禁。

## 目标

- 解释 245+1 矩阵中所有尚未解释的差异。
- 保留 canonical Java 304 artifact 和单线程运行契约。
- 为 M2 生成可追溯的功能冻结提交。

## 计划

- [x] 生成 toothbrush2 周期 47286 的 Java/TypeScript 紧凑证据。
- [ ] 定位并修复首个语义分歧，补充直接命中的回归测试。
- [ ] 重新分类剩余 unknown，并冻结 245+1 矩阵。

## 测试

- [ ] npm test 和局部算法 parity 通过。
- [ ] toothbrush2 有界检查点及代表性回归通过。
- [ ] unknown 数量降为零。