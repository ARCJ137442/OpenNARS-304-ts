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
  - 无报错
- 总结：命令通过，未触发额外依赖。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

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

（无缺失符号，报错均与语法结构相关。）

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

## 7. 路线图定位

- 1. 依赖准备：依赖：io/Symbols.ts, inference/UtilityFunctions.ts, inference/BudgetFunctions.ts, main/Parameters.ts, entity/TruthValue.ts
- 2. 文件工作：保持 Stamp/TruthValue 等值对象的不可变语义，补齐 clone/equals/hash 与序列化。；TODO 1 处
- 3. Java-TS 差异：参见《通用转译法.md》 - 实体与序列化

## 8. 附加记录

- ts-analysis: LOC=353 · TODO=1
- 参考文件：`java-master/src/main/java/org/opennars/entity/BudgetValue.java`
