# src/inference/SyllogisticRules.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/inference/SyllogisticRules.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/inference/SyllogisticRules.java` |
| 模块链路 | `language 基座 -> entity -> inference 推理层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/inference/SyllogisticRules.ts --noEmit`）

- 执行的命令：`npx tsc src/inference/SyllogisticRules.ts --noEmit`
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
- `inference/SyllogisticRules` -> `language/Terms`（deps.xml 第 453 行）
- `inference/SyllogisticRules` -> `language/Variables`（deps.xml 第 454 行）
- `inference/SyllogisticRules` -> `entity/TruthValue`（deps.xml 第 455 行）
- `inference/SyllogisticRules` -> `language/Interval`（deps.xml 第 456 行）
- `inference/SyllogisticRules` -> `language/Implication`（deps.xml 第 457 行）
- `inference/SyllogisticRules` -> `language/CompoundTerm`（deps.xml 第 458 行）
- `inference/SyllogisticRules` -> `inference/TemporalRules`（deps.xml 第 459 行）
- `inference/SyllogisticRules` -> `language/Statement`（deps.xml 第 460 行）
- `inference/SyllogisticRules` -> `entity/Task`（deps.xml 第 461 行）
- `inference/SyllogisticRules` -> `control/concept/ProcessAnticipation`（deps.xml 第 462 行）
- `inference/SyllogisticRules` -> `entity/BudgetValue`（deps.xml 第 463 行）
- `inference/SyllogisticRules` -> `language/Conjunction`（deps.xml 第 464 行）
- `inference/SyllogisticRules` -> `interfaces/Timable`（deps.xml 第 465 行）
- `inference/SyllogisticRules` -> `language/Term`（deps.xml 第 466 行）
- `inference/SyllogisticRules` -> `entity/Sentence`（deps.xml 第 467 行）
- `inference/SyllogisticRules` -> `io/Symbols`（deps.xml 第 468 行）
- `inference/SyllogisticRules` -> `parameter/Parameters`（deps.xml 第 469 行）
- `inference/SyllogisticRules` -> `operator/ImaginationSpace`（deps.xml 第 470 行）
- `inference/SyllogisticRules` -> `inference/BudgetFunctions`（deps.xml 第 471 行）
- `inference/SyllogisticRules` -> `entity/Stamp`（deps.xml 第 472 行）
- `inference/SyllogisticRules` -> `control/DerivationContext`（deps.xml 第 473 行）
- `inference/SyllogisticRules` -> `language/Equivalence`（deps.xml 第 474 行）
- `inference/SyllogisticRules` -> `inference/TruthFunctions`（deps.xml 第 475 行）
- `inference/SyllogisticRules` -> `storage/Memory`（deps.xml 第 476 行）
- 交叉校验：
- Java graph 额外依赖：control/DerivationContext、control/concept/ProcessAnticipation、entity/BudgetValue、entity/Sentence、entity/Stamp、entity/Task、entity/TruthValue、inference/BudgetFunctions、inference/TemporalRules、inference/TruthFunctions、interfaces/Timable、io/Symbols、language/CompoundTerm、language/Conjunction、language/Equivalence、language/Implication、language/Interval、language/Statement、language/Term、language/Terms、language/Variables、operator/ImaginationSpace、parameter/Parameters、storage/Memory

## 5. Java 功能说明

- **职责概述**：文件工作：复制规则/真值/预算静态表并完善类型约束与数值校验。
- **关键数据结构**：
- `SyllogisticRules` · 继承：JavaObject · 实现：（无接口）
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

- ts-analysis: LOC=1000 · TODO=0
- 参考文件：`java-master/src/main/java/org/opennars/inference/SyllogisticRules.java`
