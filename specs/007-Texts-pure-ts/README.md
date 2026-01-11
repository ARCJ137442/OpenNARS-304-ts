---
status: complete
created: '2026-01-11'
tags: []
priority: medium
created_at: '2026-01-11T20:28:55.309Z'
updated_at: '2026-01-11T20:39:44.267Z'
transitions:
  - status: in-progress
    at: '2026-01-11T20:32:31.510Z'
  - status: complete
    at: '2026-01-11T20:39:44.267Z'
completed_at: '2026-01-11T20:39:44.267Z'
completed: '2026-01-11'
---

# Texts-pure-ts

> **Status**: ✅ Complete · **Priority**: Medium · **Created**: 2026-01-11

## 概述

将 `src/io/Texts.ts` 从 jree/Java 语义转为纯 TS 实现，保留核心格式化、数值处理和比较逻辑，降低依赖并对调用点回归可验证。

## 目标

- 提供纯 TS 实现，不再依赖 jree/java.text/java.lang。
- 保持 `n1`/`n2`/`n4`/`compareTo`/`yarn` 行为与现有测试和逻辑一致。
- 更新调用点，结束 `CharSequence`/`StringBuilder` 的 Java 语义依赖。

## 反目标

- 不调整模块目录或引入新的格式化库。
- 不改动与调用点无关的逻辑。
- 不在本 spec 内处理非 Texts 的性能优化。

## 设计

- Java 语义替代：`JavaObject` 改为普通 class；`CharSequence` 改为 `string`；`StringBuilder` 改为 `string[]` 或直接拼接；`DecimalFormat` 改为调整小数位的纯 TS 函数；`int`/`float`/`double`/`long` 改为 `number`；`IllegalStateException` 改为 `Error`。
- enum 处理：Texts 不使用 enum，后续如需属性方法结构，用 `const` 对象 + `as const`。
- API 设计：`n1`/`n2`/`n4` 返回 `string`；`n2` 仅保留一个签名 `n2(x: number)`；`compareTo` 使用字符串比较；`yarn` 返回 `string | null`。
- 静态初始化：将格式化逻辑收敛成纯函数，不依赖含副作用的静态实例。

## 计划

- [x] 公开面盘点清单（来自实际扫描 `src/io/Texts.ts`）：类 `Texts`；方法 `yarn`/`n4`/`n2Slow`/`thousandths`/`hundredths`/`n2`/`n1`/`compareTo`；静态初始化 `fourDecimal`/`twoDecimal`/`oneDecimal`；无索引结构。
- [x] 依赖剥离与拆分策略（同目录后缀文件命名）：移除 `jree`/`java.text`/`java.lang` 依赖，如需兼容层则新增 `src/io/TextsJreeAdapter.ts`；`Texts.ts` 保持纯 TS，调用端显式引入适配文件。
- [x] 测试计划：静态初始化回归（`n1`/`n2`/`n4` 格式化输出）；索引一致性（无索引，测试中明确说明）；规则类行为（`n2` 范围检查，`compareTo` 字符比较，四舍五入策略）；预期值来源说明（`test/util/TextsTest.ts` + 现有算法逻辑）。
- [x] 纯 TS 设计草案（包含 Java 语义替代策略、enum 处理方式）：明确返回类型为 `string`，整理小数精度函数与错误抛出策略。
- [x] 调用点改造清单与替换规则（来自实际扫描 `rg "Texts"`）：`src/entity/BudgetValue.ts` 使用 `n4`/`n2`；`src/plugin/perception/VisionChannel.ts` 使用 `n1`；`src/language/Term.ts` 使用 `compareTo`；`src/language/Variable.ts` 使用 `n2`/`compareTo`；`test/util/TextsTest.ts` 使用 `n2`。替换规则：`Texts.n1`/`n2`/`n4` 返回 `string`，删除 `.toString()`；`compareTo` 入参改为 `string`，或直接用 `localeCompare`。
- [x] 验证计划（最小测试集 + 可选 tsc 检查 + 回归点挑选标准）：最小测试集覆盖 `n1`/`n2`/`n4`/`compareTo`/`yarn`，可选运行 `npx tsc src/io/Texts.ts --noEmit`，回归点优先选择直接调用 Texts 的路径。

## 测试

- [x] 新增或迁移 Texts 单测，覆盖 `n2` 边界与小数输出。
- [x] 回归 `BudgetValue`/`VisionChannel`/`Term`/`Variable` 中的格式化调用路径。
- [x] 记录预期值来源与误差策略（四舍五入或截断）。

## 备注

- 公开面与调用点来源：`src/io/Texts.ts` 和 `rg "Texts"` 扫描结果。
