# src/inference/RuleTables.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/inference/RuleTables.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/inference/RuleTables.java` |
| 模块链路 | `language 基座 -> entity -> inference 推理层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/inference/RuleTables.ts --noEmit`）

- 执行的命令：`npx tsc src/inference/RuleTables.ts --noEmit`
- 关键输出：
  - TS1005（L621, C23）：';' expected.
- 总结：存在语法错误，需要比对 Java 语句结构。；编译失败：TS1005 @ 621:23 ';' expected. ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

（无显式结构性依赖，主要依赖 `jree` 提供的运行时桩或尚未补齐的全局声明。）

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

（无缺失符号，报错均与语法结构相关。）

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `inference/RuleTables` -> `io/events/Events`（deps.xml 第 376 行）
- `inference/RuleTables` -> `language/Terms`（deps.xml 第 377 行）
- `inference/RuleTables` -> `operator/Operator`（deps.xml 第 378 行）
- `inference/RuleTables` -> `language/Variables`（deps.xml 第 379 行）
- `inference/RuleTables` -> `entity/TruthValue`（deps.xml 第 380 行）
- `inference/RuleTables` -> `entity/Concept`（deps.xml 第 381 行）
- `inference/RuleTables` -> `language/Implication`（deps.xml 第 382 行）
- `inference/RuleTables` -> `language/CompoundTerm`（deps.xml 第 383 行）
- `inference/RuleTables` -> `language/Negation`（deps.xml 第 384 行）
- `inference/RuleTables` -> `inference/TemporalRules`（deps.xml 第 385 行）
- `inference/RuleTables` -> `language/Statement`（deps.xml 第 386 行）
- `inference/RuleTables` -> `entity/Item`（deps.xml 第 387 行）
- `inference/RuleTables` -> `entity/Task`（deps.xml 第 388 行）
- `inference/RuleTables` -> `entity/BudgetValue`（deps.xml 第 389 行）
- `inference/RuleTables` -> `language/Conjunction`（deps.xml 第 390 行）
- `inference/RuleTables` -> `interfaces/Timable`（deps.xml 第 391 行）
- `inference/RuleTables` -> `language/Product`（deps.xml 第 392 行）
- `inference/RuleTables` -> `inference/StructuralRules`（deps.xml 第 393 行）
- `inference/RuleTables` -> `language/Term`（deps.xml 第 394 行）
- `inference/RuleTables` -> `language/Disjunction`（deps.xml 第 395 行）
- `inference/RuleTables` -> `entity/Sentence`（deps.xml 第 396 行）
- `inference/RuleTables` -> `io/Symbols`（deps.xml 第 397 行）
- `inference/RuleTables` -> `parameter/Parameters`（deps.xml 第 398 行）
- `inference/RuleTables` -> `language/Inheritance`（deps.xml 第 399 行）
- `inference/RuleTables` -> `language/Variable`（deps.xml 第 400 行）
- `inference/RuleTables` -> `entity/TaskLink`（deps.xml 第 401 行）
- `inference/RuleTables` -> `entity/TLink`（deps.xml 第 402 行）
- `inference/RuleTables` -> `inference/BudgetFunctions`（deps.xml 第 403 行）
- `inference/RuleTables` -> `language/SetExt`（deps.xml 第 404 行）
- `inference/RuleTables` -> `inference/SyllogisticRules`（deps.xml 第 405 行）
- `inference/RuleTables` -> `entity/Stamp`（deps.xml 第 406 行）
- `inference/RuleTables` -> `inference/LocalRules`（deps.xml 第 407 行）
- `inference/RuleTables` -> `operator/Operation`（deps.xml 第 408 行）
- `inference/RuleTables` -> `control/DerivationContext`（deps.xml 第 409 行）
- `inference/RuleTables` -> `language/Equivalence`（deps.xml 第 410 行）
- `inference/RuleTables` -> `inference/CompositionalRules`（deps.xml 第 411 行）
- `inference/RuleTables` -> `language/SetInt`（deps.xml 第 412 行）
- `inference/RuleTables` -> `inference/TruthFunctions`（deps.xml 第 413 行）
- `inference/RuleTables` -> `entity/TermLink`（deps.xml 第 414 行）
- `inference/RuleTables` -> `storage/Memory`（deps.xml 第 415 行）
- `inference/RuleTables` -> `language/Similarity`（deps.xml 第 416 行）
- 交叉校验：
- Java graph 额外依赖：control/DerivationContext、entity/BudgetValue、entity/Concept、entity/Item、entity/Sentence、entity/Stamp、entity/TLink、entity/Task、entity/TaskLink、entity/TermLink、entity/TruthValue、inference/BudgetFunctions、inference/CompositionalRules、inference/LocalRules、inference/StructuralRules、inference/SyllogisticRules、inference/TemporalRules、inference/TruthFunctions、interfaces/Timable、io/Symbols、io/events/Events、language/CompoundTerm、language/Conjunction、language/Disjunction、language/Equivalence、language/Implication、language/Inheritance、language/Negation、language/Product、language/SetExt、language/SetInt、language/Similarity、language/Statement、language/Term、language/Terms、language/Variable、language/Variables、operator/Operation、operator/Operator、parameter/Parameters、storage/Memory

## 5. Java 功能说明

- **职责概述**：文件工作：复制规则/真值/预算静态表并完善类型约束与数值校验。；tsc TS1005 @ 621:23 错误；TODO 1 处
- **关键数据结构**：
- `RuleTables` · 继承：JavaObject · 实现：（无接口）
- **核心流程 / 算法**：
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：复制规则/真值/预算静态表并完善类型约束与数值校验。；tsc TS1005 @ 621:23 错误；TODO 1 处
  3. Java-TS 差异：参见《通用转译法.md》 - 推理规则
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `Java Memory/Task 接口` 衔接上下游。

## 6. 一致性风险

- 文件内仍保留 1 处 TODO，需对照 Java 填补。
- `tsc` 报错阻塞进一步分析，需要回填语句结构。
- 缺少显式 import，需依赖 Java/ts-analysis 交叉校验。

## 7. 路线图定位

- 1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
- 2. 文件工作：复制规则/真值/预算静态表并完善类型约束与数值校验。；tsc TS1005 @ 621:23 错误；TODO 1 处
- 3. Java-TS 差异：参见《通用转译法.md》 - 推理规则

## 8. 附加记录

- ts-analysis: LOC=999 · TODO=1
- 参考文件：`java-master/src/main/java/org/opennars/inference/RuleTables.java`
