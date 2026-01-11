# src/inference/BudgetFunctions.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/inference/BudgetFunctions.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/inference/BudgetFunctions.java` |
| 模块链路 | `language 基座 -> entity -> inference 推理层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/inference/BudgetFunctions.ts --noEmit`）

- 执行的命令：`npx tsc src/inference/BudgetFunctions.ts --noEmit`
- 关键输出：
  - 无报错
- 总结：命令通过，未触发额外依赖。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

| 符号 | 来源文件 | 触发位置 | 依赖原因 |
| --- | --- | --- | --- |
| `TruthValue` | `src/entity/TruthValue.ts` | import | 结构性：BudgetFunctions 直接使用 TruthValue 的主流程 |
| `Sentence` | `src/entity/Sentence.ts` | import | 结构性：BudgetFunctions 直接使用 Sentence 的主流程 |
| `TaskLink` | `src/entity/TaskLink.ts` | import | 结构性：BudgetFunctions 直接使用 TaskLink 的主流程 |
| `Task` | `src/entity/Task.ts` | import | 结构性：BudgetFunctions 直接使用 Task 的主流程 |
| `DerivationContext` | `src/control/DerivationContext.ts` | import | 结构性：BudgetFunctions 直接使用 DerivationContext 的主流程 |
| `BudgetValue.ts ...` | `src/entity/BudgetValue.ts ....ts` | import | 结构性：BudgetFunctions 直接使用 BudgetValue.ts ... 的主流程 |

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

（无缺失符号，报错均与语法结构相关。）

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `inference/BudgetFunctions` -> `entity/TruthValue`（deps.xml 第 290 行）
- `inference/BudgetFunctions` -> `entity/TaskLink`（deps.xml 第 291 行）
- `inference/BudgetFunctions` -> `entity/Concept`（deps.xml 第 292 行）
- `inference/BudgetFunctions` -> `entity/Item`（deps.xml 第 293 行）
- `inference/BudgetFunctions` -> `inference/UtilityFunctions`（deps.xml 第 294 行）
- `inference/BudgetFunctions` -> `entity/Task`（deps.xml 第 295 行）
- `inference/BudgetFunctions` -> `control/DerivationContext`（deps.xml 第 296 行）
- `inference/BudgetFunctions` -> `entity/BudgetValue`（deps.xml 第 297 行）
- `inference/BudgetFunctions` -> `entity/TermLink`（deps.xml 第 298 行）
- `inference/BudgetFunctions` -> `storage/Memory`（deps.xml 第 299 行）
- `inference/BudgetFunctions` -> `language/Term`（deps.xml 第 300 行）
- `inference/BudgetFunctions` -> `entity/Sentence`（deps.xml 第 301 行）
- `inference/BudgetFunctions` -> `parameter/Parameters`（deps.xml 第 302 行）
- 交叉校验：
- TS 额外依赖：entity/BudgetValue.ts ...
- Java graph 额外依赖：entity/BudgetValue、entity/Concept、entity/Item、entity/TermLink、inference/UtilityFunctions、language/Term、parameter/Parameters、storage/Memory

## 5. Java 功能说明

- **职责概述**：文件工作：复制规则/真值/预算静态表并完善类型约束与数值校验。
- **关键数据结构**：
- `BudgetFunctions` · 继承：（无继承） · 实现：（无接口）
- **核心流程 / 算法**：
  1. 依赖准备：依赖：entity/TruthValue.ts, entity/Sentence.ts, entity/TaskLink.ts, entity/Task.ts, control/DerivationContext.ts, entity/BudgetValue.ts ...
  2. 文件工作：复制规则/真值/预算静态表并完善类型约束与数值校验。
  3. Java-TS 差异：参见《通用转译法.md》 - 推理规则
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `control/DerivationContext, entity/BudgetValue.ts ..., entity/Sentence, entity/Task, entity/TaskLink, entity/TruthValue` 衔接上下游。

## 6. 一致性风险

- 主要风险来自尚未补齐的 Java 语义与单元测试缺失。

## 7. 路线图定位

- 1. 依赖准备：依赖：entity/TruthValue.ts, entity/Sentence.ts, entity/TaskLink.ts, entity/Task.ts, control/DerivationContext.ts, entity/BudgetValue.ts ...
- 2. 文件工作：复制规则/真值/预算静态表并完善类型约束与数值校验。
- 3. Java-TS 差异：参见《通用转译法.md》 - 推理规则

## 8. 附加记录

- ts-analysis: LOC=336 · TODO=0
- 参考文件：`java-master/src/main/java/org/opennars/inference/BudgetFunctions.java`
