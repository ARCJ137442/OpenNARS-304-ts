# src/inference/StructuralRules.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/inference/StructuralRules.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/inference/StructuralRules.java` |
| 模块链路 | `language 基座 -> entity -> inference 推理层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/inference/StructuralRules.ts --noEmit`）

- 执行的命令：`npx tsc src/inference/StructuralRules.ts --noEmit`
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
- `inference/StructuralRules` -> `language/Terms`（deps.xml 第 419 行）
- `inference/StructuralRules` -> `entity/TruthValue`（deps.xml 第 420 行）
- `inference/StructuralRules` -> `language/Interval`（deps.xml 第 421 行）
- `inference/StructuralRules` -> `language/DifferenceExt`（deps.xml 第 422 行）
- `inference/StructuralRules` -> `language/Image`（deps.xml 第 423 行）
- `inference/StructuralRules` -> `language/IntersectionExt`（deps.xml 第 424 行）
- `inference/StructuralRules` -> `language/Implication`（deps.xml 第 425 行）
- `inference/StructuralRules` -> `language/CompoundTerm`（deps.xml 第 426 行）
- `inference/StructuralRules` -> `inference/TemporalRules`（deps.xml 第 427 行）
- `inference/StructuralRules` -> `language/Negation`（deps.xml 第 428 行）
- `inference/StructuralRules` -> `language/Statement`（deps.xml 第 429 行）
- `inference/StructuralRules` -> `entity/Task`（deps.xml 第 430 行）
- `inference/StructuralRules` -> `entity/BudgetValue`（deps.xml 第 431 行）
- `inference/StructuralRules` -> `language/DifferenceInt`（deps.xml 第 432 行）
- `inference/StructuralRules` -> `language/Conjunction`（deps.xml 第 433 行）
- `inference/StructuralRules` -> `language/ImageExt`（deps.xml 第 434 行）
- `inference/StructuralRules` -> `language/Product`（deps.xml 第 435 行）
- `inference/StructuralRules` -> `language/IntersectionInt`（deps.xml 第 436 行）
- `inference/StructuralRules` -> `language/Term`（deps.xml 第 437 行）
- `inference/StructuralRules` -> `language/Disjunction`（deps.xml 第 438 行）
- `inference/StructuralRules` -> `entity/Sentence`（deps.xml 第 439 行）
- `inference/StructuralRules` -> `io/Symbols`（deps.xml 第 440 行）
- `inference/StructuralRules` -> `parameter/Parameters`（deps.xml 第 441 行）
- `inference/StructuralRules` -> `language/Inheritance`（deps.xml 第 442 行）
- `inference/StructuralRules` -> `language/ImageInt`（deps.xml 第 443 行）
- `inference/StructuralRules` -> `inference/BudgetFunctions`（deps.xml 第 444 行）
- `inference/StructuralRules` -> `language/SetExt`（deps.xml 第 445 行）
- `inference/StructuralRules` -> `control/DerivationContext`（deps.xml 第 446 行）
- `inference/StructuralRules` -> `language/Equivalence`（deps.xml 第 447 行）
- `inference/StructuralRules` -> `language/SetInt`（deps.xml 第 448 行）
- `inference/StructuralRules` -> `inference/TruthFunctions`（deps.xml 第 449 行）
- `inference/StructuralRules` -> `language/Similarity`（deps.xml 第 450 行）
- 交叉校验：
- Java graph 额外依赖：control/DerivationContext、entity/BudgetValue、entity/Sentence、entity/Task、entity/TruthValue、inference/BudgetFunctions、inference/TemporalRules、inference/TruthFunctions、io/Symbols、language/CompoundTerm、language/Conjunction、language/DifferenceExt、language/DifferenceInt、language/Disjunction、language/Equivalence、language/Image、language/ImageExt、language/ImageInt、language/Implication、language/Inheritance、language/IntersectionExt、language/IntersectionInt、language/Interval、language/Negation、language/Product、language/SetExt、language/SetInt、language/Similarity、language/Statement、language/Term、language/Terms、parameter/Parameters

## 5. Java 功能说明

- **职责概述**：文件工作：复制规则/真值/预算静态表并完善类型约束与数值校验。
- **关键数据结构**：
- `StructuralRules` · 继承：JavaObject · 实现：（无接口）
- **核心流程 / 算法**：
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：复制规则/真值/预算静态表并完善类型约束与数值校验。
  3. Java-TS 差异：参见《通用转译法.md》 - 推理规则
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `Java Memory/Task 接口` 衔接上下游。

## 6. 一致性风险

- 缺少显式 import，需依赖 Java/ts-analysis 交叉校验。

## 7. 路线图定位

- 1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
- 2. 文件工作：复制规则/真值/预算静态表并完善类型约束与数值校验。
- 3. Java-TS 差异：参见《通用转译法.md》 - 推理规则

## 8. 附加记录

- ts-analysis: LOC=986 · TODO=0
- 参考文件：`java-master/src/main/java/org/opennars/inference/StructuralRules.java`
