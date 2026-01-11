# src/inference/TemporalRules.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/inference/TemporalRules.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/inference/TemporalRules.java` |
| 模块链路 | `language 基座 -> entity -> inference 推理层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/inference/TemporalRules.ts --noEmit`）

- 执行的命令：`npx tsc src/inference/TemporalRules.ts --noEmit`
- 关键输出：
  - 无报错
- 总结：命令通过，未触发额外依赖。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

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
- `inference/TemporalRules` -> `language/Interval`（deps.xml 第 479 行）
- `inference/TemporalRules` -> `entity/TruthValue`（deps.xml 第 480 行）
- `inference/TemporalRules` -> `language/Implication`（deps.xml 第 481 行）
- `inference/TemporalRules` -> `language/Statement`（deps.xml 第 482 行）
- `inference/TemporalRules` -> `entity/Task`（deps.xml 第 483 行）
- `inference/TemporalRules` -> `entity/BudgetValue`（deps.xml 第 484 行）
- `inference/TemporalRules` -> `language/Conjunction`（deps.xml 第 485 行）
- `inference/TemporalRules` -> `interfaces/Timable`（deps.xml 第 486 行）
- `inference/TemporalRules` -> `language/Term`（deps.xml 第 487 行）
- `inference/TemporalRules` -> `entity/Sentence`（deps.xml 第 488 行）
- `inference/TemporalRules` -> `io/Symbols`（deps.xml 第 489 行）
- `inference/TemporalRules` -> `parameter/Parameters`（deps.xml 第 490 行）
- `inference/TemporalRules` -> `language/Inheritance`（deps.xml 第 491 行）
- `inference/TemporalRules` -> `control/TemporalInferenceControl`（deps.xml 第 492 行）
- `inference/TemporalRules` -> `inference/BudgetFunctions`（deps.xml 第 493 行）
- `inference/TemporalRules` -> `entity/Stamp`（deps.xml 第 494 行）
- `inference/TemporalRules` -> `control/DerivationContext`（deps.xml 第 495 行）
- `inference/TemporalRules` -> `language/Equivalence`（deps.xml 第 496 行）
- `inference/TemporalRules` -> `inference/CompositionalRules`（deps.xml 第 497 行）
- `inference/TemporalRules` -> `inference/TruthFunctions`（deps.xml 第 498 行）
- `inference/TemporalRules` -> `language/Similarity`（deps.xml 第 499 行）
- 交叉校验：
- Java graph 额外依赖：control/DerivationContext、control/TemporalInferenceControl、entity/BudgetValue、entity/Sentence、entity/Stamp、entity/Task、entity/TruthValue、inference/BudgetFunctions、inference/CompositionalRules、inference/TruthFunctions、interfaces/Timable、io/Symbols、language/Conjunction、language/Equivalence、language/Implication、language/Inheritance、language/Interval、language/Similarity、language/Statement、language/Term、parameter/Parameters

## 5. Java 功能说明

- **职责概述**：文件工作：复制规则/真值/预算静态表并完善类型约束与数值校验。；TODO 2 处
- **关键数据结构**：
- `TemporalRules` · 继承：JavaObject · 实现：（无接口）
- **核心流程 / 算法**：
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：复制规则/真值/预算静态表并完善类型约束与数值校验。；TODO 2 处
  3. Java-TS 差异：参见《通用转译法.md》 - 推理规则
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `Java Memory/Task 接口` 衔接上下游。

## 6. 一致性风险

- 文件内仍保留 2 处 TODO，需对照 Java 填补。
- 缺少显式 import，需依赖 Java/ts-analysis 交叉校验。

## 7. 路线图定位

- 1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
- 2. 文件工作：复制规则/真值/预算静态表并完善类型约束与数值校验。；TODO 2 处
- 3. Java-TS 差异：参见《通用转译法.md》 - 推理规则

## 8. 附加记录

- ts-analysis: LOC=340 · TODO=2
- 参考文件：`java-master/src/main/java/org/opennars/inference/TemporalRules.java`
