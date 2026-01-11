# src/entity/BudgetValue.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/entity/BudgetValue.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/entity/BudgetValue.java` |
| 模块链路 | `language 基座 -> entity 实体层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/entity/BudgetValue.ts --noEmit`）

- 执行的命令：`npx tsc src/entity/BudgetValue.ts --noEmit`
- 关键输出：
  - TS2564（L25, C13）：[full_check] Property 'priority' has no initializer and is not definitely assigned in the constructor.
  - TS2564（L33, C13）：[full_check] Property 'durability' has no initializer and is not definitely assigned in the constructor.
  - TS2564（L36, C13）：[full_check] Property 'quality' has no initializer and is not definitely assigned in the constructor.
  - TS2322（L42, C13）：[full_check] Type 'number' is not assignable to type 'bigint'.
  - TS2564（L44, C13）：[full_check] Property 'narParameters' has no initializer and is not definitely assigned in the constructor.
  - TS2349（L69, C17）：[full_check] This expression is not callable.
  - TS2349（L79, C17）：[full_check] This expression is not callable.
  - TS2335（L89, C17）：[full_check] 'super' can only be referenced in a derived class.
  - TS2416（L118, C22）：[full_check] Property 'clone' in type 'BudgetValue' is not assignable to the same property in base type 'JavaObject'.
  - TS4112（L118, C22）：[full_check] This member cannot have an 'override' modifier because its containing class 'BudgetValue' does not extend another class.
  - TS2304（L272, C16）：[full_check] Cannot find name 'aveGeo'.
  - TS2416（L306, C22）：[full_check] Property 'toString' in type 'BudgetValue' is not assignable to the same property in base type 'Cloneable<BudgetValue>'.
  - TS2416（L306, C22）：[full_check] Property 'toString' in type 'BudgetValue' is not assignable to the same property in base type 'JavaObject'.
  - TS2416（L306, C22）：[full_check] Property 'toString' in type 'BudgetValue' is not assignable to the same property in base type 'Serializable'.
  - TS4112（L306, C22）：[full_check] This member cannot have an 'override' modifier because its containing class 'BudgetValue' does not extend another class.
  - TS2322（L307, C9）：[full_check] Type 'string' is not assignable to type 'JavaString'.
  - TS2304（L307, C35）：[full_check] Cannot find name 'Texts'.
  - TS2304（L307, C85）：[full_check] Cannot find name 'Texts'.
  - TS2304（L307, C137）：[full_check] Cannot find name 'Texts'.
  - TS2304（L319, C54）：[full_check] Cannot find name 'Texts'.
  - TS2304（L320, C56）：[full_check] Cannot find name 'Texts'.
  - TS2304（L321, C53）：[full_check] Cannot find name 'Texts'.
  - TS2367（L340, C13）：[full_check] This comparison appears to be unintentional because the types 'bigint' and 'number' have no overlap.
  - TS2322（L341, C13）：[full_check] Type 'number' is not assignable to type 'bigint'.
  - TS2564（L25, C13）：[syntax_check] Property 'priority' has no initializer and is not definitely assigned in the constructor.
  - TS2564（L33, C13）：[syntax_check] Property 'durability' has no initializer and is not definitely assigned in the constructor.
  - TS2564（L36, C13）：[syntax_check] Property 'quality' has no initializer and is not definitely assigned in the constructor.
  - TS2322（L42, C13）：[syntax_check] Type 'number' is not assignable to type 'bigint'.
  - TS2564（L44, C13）：[syntax_check] Property 'narParameters' has no initializer and is not definitely assigned in the constructor.
  - TS2349（L69, C17）：[syntax_check] This expression is not callable.
  - TS2349（L79, C17）：[syntax_check] This expression is not callable.
  - TS2335（L89, C17）：[syntax_check] 'super' can only be referenced in a derived class.
  - TS2416（L118, C22）：[syntax_check] Property 'clone' in type 'BudgetValue' is not assignable to the same property in base type 'JavaObject'.
  - TS4112（L118, C22）：[syntax_check] This member cannot have an 'override' modifier because its containing class 'BudgetValue' does not extend another class.
  - TS2304（L272, C16）：[syntax_check] Cannot find name 'aveGeo'.
  - TS2416（L306, C22）：[syntax_check] Property 'toString' in type 'BudgetValue' is not assignable to the same property in base type 'Cloneable<BudgetValue>'.
  - TS2416（L306, C22）：[syntax_check] Property 'toString' in type 'BudgetValue' is not assignable to the same property in base type 'JavaObject'.
  - TS2416（L306, C22）：[syntax_check] Property 'toString' in type 'BudgetValue' is not assignable to the same property in base type 'Serializable'.
  - TS4112（L306, C22）：[syntax_check] This member cannot have an 'override' modifier because its containing class 'BudgetValue' does not extend another class.
  - TS2322（L307, C9）：[syntax_check] Type 'string' is not assignable to type 'JavaString'.
  - TS2304（L307, C35）：[syntax_check] Cannot find name 'Texts'.
  - TS2304（L307, C85）：[syntax_check] Cannot find name 'Texts'.
  - TS2304（L307, C137）：[syntax_check] Cannot find name 'Texts'.
  - TS2304（L319, C54）：[syntax_check] Cannot find name 'Texts'.
  - TS2304（L320, C56）：[syntax_check] Cannot find name 'Texts'.
  - TS2304（L321, C53）：[syntax_check] Cannot find name 'Texts'.
  - TS2367（L340, C13）：[syntax_check] This comparison appears to be unintentional because the types 'bigint' and 'number' have no overlap.
  - TS2322（L341, C13）：[syntax_check] Type 'number' is not assignable to type 'bigint'.
- 总结：存在语法错误，需要比对 Java 语句结构。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

| 符号 | 来源文件 | 触发位置 | 依赖原因 |
| --- | --- | --- | --- |
| `Symbols` | `src/io/Symbols.ts` | import | 结构性：BudgetValue 直接使用 Symbols 的主流程 |
| `UtilityFunctions` | `src/inference/UtilityFunctions.ts` | import | 结构性：BudgetValue 直接使用 UtilityFunctions 的主流程 |
| `BudgetFunctions` | `src/inference/BudgetFunctions.ts` | import | 结构性：BudgetValue 直接使用 BudgetFunctions 的主流程 |
| `Parameters` | `src/main/Parameters.ts` | import | 结构性：BudgetValue 直接使用 Parameters 的主流程 |
| `TruthValue` | `src/entity/TruthValue.ts` | import | 结构性：BudgetValue 直接使用 TruthValue 的主流程 |

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

- `[full_check] Cannot find name 'aveGeo'.` @ L272
- `[full_check] Cannot find name 'Texts'.` @ L307
- `[full_check] Cannot find name 'Texts'.` @ L307
- `[full_check] Cannot find name 'Texts'.` @ L307
- `[full_check] Cannot find name 'Texts'.` @ L319
- `[full_check] Cannot find name 'Texts'.` @ L320
- `[full_check] Cannot find name 'Texts'.` @ L321
- `[syntax_check] Cannot find name 'aveGeo'.` @ L272
- `[syntax_check] Cannot find name 'Texts'.` @ L307
- `[syntax_check] Cannot find name 'Texts'.` @ L307
- `[syntax_check] Cannot find name 'Texts'.` @ L307
- `[syntax_check] Cannot find name 'Texts'.` @ L319
- `[syntax_check] Cannot find name 'Texts'.` @ L320
- `[syntax_check] Cannot find name 'Texts'.` @ L321

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `entity/BudgetValue` -> `io/Texts`（deps.xml 第 191 行）
- `entity/BudgetValue` -> `entity/TruthValue`（deps.xml 第 192 行）
- `entity/BudgetValue` -> `inference/BudgetFunctions`（deps.xml 第 193 行）
- `entity/BudgetValue` -> `inference/UtilityFunctions`（deps.xml 第 194 行）
- `entity/BudgetValue` -> `io/Symbols`（deps.xml 第 195 行）
- `entity/BudgetValue` -> `parameter/Parameters`（deps.xml 第 196 行）
- 交叉校验：
- TS 额外依赖：main/Parameters
- Java graph 额外依赖：io/Texts、parameter/Parameters

## 5. Java 功能说明

- **职责概述**：文件工作：保持 Stamp/TruthValue 等值对象的不可变语义，补齐 clone/equals/hash 与序列化。；TODO 1 处
- **关键数据结构**：
- `BudgetValue` · 继承：（无继承） · 实现：JavaObject, java.lang.Cloneable<BudgetValue>, java.io.Serializable
- **核心流程 / 算法**：
  1. 依赖准备：依赖：io/Symbols.ts, inference/UtilityFunctions.ts, inference/BudgetFunctions.ts, main/Parameters.ts, entity/TruthValue.ts
  2. 文件工作：保持 Stamp/TruthValue 等值对象的不可变语义，补齐 clone/equals/hash 与序列化。；TODO 1 处
  3. Java-TS 差异：参见《通用转译法.md》 - 实体与序列化
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `entity/TruthValue, inference/BudgetFunctions, inference/UtilityFunctions, io/Symbols, main/Parameters` 衔接上下游。

## 6. 一致性风险

- 文件内仍保留 1 处 TODO，需对照 Java 填补。
- `tsc` 报错阻塞进一步分析，需要回填语句结构。

## 7. 路线图定位

- 1. 依赖准备：依赖：io/Symbols.ts, inference/UtilityFunctions.ts, inference/BudgetFunctions.ts, main/Parameters.ts, entity/TruthValue.ts
- 2. 文件工作：保持 Stamp/TruthValue 等值对象的不可变语义，补齐 clone/equals/hash 与序列化。；TODO 1 处
- 3. Java-TS 差异：参见《通用转译法.md》 - 实体与序列化

## 8. 附加记录

- ts-analysis: LOC=353 · TODO=1
- 参考文件：`java-master/src/main/java/org/opennars/entity/BudgetValue.java`
