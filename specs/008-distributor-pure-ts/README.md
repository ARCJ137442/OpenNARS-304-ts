---
status: in-progress
created: '2026-01-11'
tags: []
priority: medium
created_at: '2026-01-11T21:15:43.364Z'
updated_at: '2026-01-11T21:16:39.386Z'
transitions:
  - status: in-progress
    at: '2026-01-11T21:16:39.386Z'
---

# distributor-pure-ts

> **Status**: ⏳ In progress · **Priority**: Medium · **Created**: 2026-01-11

## 概述

对 storage/Distributor.ts 进行纯 TS 转写规划，锁定公开面、依赖与测试，服务后续 Bag 调用。

## 目标

- 目标 1：去除 jree int 依赖，保持分布算法与异常行为一致。
- 目标 2：固化公开面与索引不变式，补齐测试与验证路径。
- 目标 3：给出调用点改造规则，保障 Bag 与测试平滑过渡。

## 反目标

- 反目标 1：不调整分布算法与概率策略。
- 反目标 2：不引入跨目录重构或无必要拆分。
- 反目标 3：不改动 Bag/Memory 等上层逻辑（除调用点同步）。

## 设计

- 类型：int -> src/types.ts 的 int（alias number）；order: int[]；capacity: int（私有只读）。
- API：保留 constructor(range)、pick(index)、next(index)，公开 order 供 Bag/测试读取。
- Java 语义替代：移除 jree 类型别名，改用 src/types.ts 的 int；仅保留 RangeError；无 clone/hashCode/Serializable。
- enum：当前无枚举；如需常量集，用 const 对象 + as const。

## 计划

- [ ] 公开面盘点清单（扫描 src/storage/Distributor.ts）：导出类 Distributor；字段 order（数组索引结构）、私有 capacity；API 为 constructor(range)、pick(index)、next(index)；常量与静态初始化点均无；构造函数填充 order 为运行期副作用。
- [ ] 依赖剥离与拆分策略：移除 jree 的 int 类型别名，改用 src/types.ts 的 int；原则上不拆分；若后续需兼容旧式类型，新增同目录后缀文件 DistributorAdapter.ts 承载适配。
- [ ] 测试计划：覆盖构造初始化回归（order 填充与 RangeError）；索引一致性（capacity、计数、范围）；规则类行为（分布计数与 next 循环）；预期值来源注明为公式 n(n+1)/2 与代码逻辑。
- [ ] 纯 TS 设计草案：保留公开 order 与方法签名，capacity 设为私有只读；Java 语义替代改用 src/types.ts 的 int 保留整数语义，仅保留 RangeError；无 enum，必要时用 const 对象 + as const。
- [ ] 调用点改造清单与替换规则（来自 rg 扫描）：src/storage/Bag.ts、test/node/distributor.test.ts、test/core/bag/DistributorAnalyzer.ts；移除 type int 引入与 as int，保持 new Distributor(range) 签名不变。
- [ ] 验证计划：最小测试集为 node --test test/node/distributor.test.ts；可选 npx tsc src/storage/Distributor.ts --noEmit；回归点挑选标准为分布计数/索引不变式与 Bag 调用路径。

## 测试

- [x] 运行 node --test test/node/distributor.test.ts。
- [x] 可选运行 npx tsc src/storage/Distributor.ts --noEmit。

## 备注

- 参考：src/storage/Bag.ts 的分布调用路径。
