# src/inference/LocalRules.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/inference/LocalRules.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/inference/LocalRules.java` |
| 模块链路 | `language 基座 -> entity -> inference 推理层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/inference/LocalRules.ts --noEmit`）

- 执行的命令：`npx tsc src/inference/LocalRules.ts --noEmit`
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
- `inference/LocalRules` -> `io/events/Events`（deps.xml 第 345 行）
- `inference/LocalRules` -> `language/Variables`（deps.xml 第 346 行）
- `inference/LocalRules` -> `entity/TruthValue`（deps.xml 第 347 行）
- `inference/LocalRules` -> `entity/Concept`（deps.xml 第 348 行）
- `inference/LocalRules` -> `language/Implication`（deps.xml 第 349 行）
- `inference/LocalRules` -> `language/CompoundTerm`（deps.xml 第 350 行）
- `inference/LocalRules` -> `inference/TemporalRules`（deps.xml 第 351 行）
- `inference/LocalRules` -> `entity/Item`（deps.xml 第 352 行）
- `inference/LocalRules` -> `language/Statement`（deps.xml 第 353 行）
- `inference/LocalRules` -> `entity/Task`（deps.xml 第 354 行）
- `inference/LocalRules` -> `entity/BudgetValue`（deps.xml 第 355 行）
- `inference/LocalRules` -> `interfaces/Timable`（deps.xml 第 356 行）
- `inference/LocalRules` -> `language/Term`（deps.xml 第 357 行）
- `inference/LocalRules` -> `entity/Sentence`（deps.xml 第 358 行）
- `inference/LocalRules` -> `io/Symbols`（deps.xml 第 359 行）
- `inference/LocalRules` -> `parameter/Parameters`（deps.xml 第 360 行）
- `inference/LocalRules` -> `language/Inheritance`（deps.xml 第 361 行）
- `inference/LocalRules` -> `io/events/OutputHandler`（deps.xml 第 362 行）
- `inference/LocalRules` -> `entity/TaskLink`（deps.xml 第 363 行）
- `inference/LocalRules` -> `inference/BudgetFunctions`（deps.xml 第 364 行）
- `inference/LocalRules` -> `entity/Stamp`（deps.xml 第 365 行）
- `inference/LocalRules` -> `inference/UtilityFunctions`（deps.xml 第 366 行）
- `inference/LocalRules` -> `control/DerivationContext`（deps.xml 第 367 行）
- `inference/LocalRules` -> `language/Equivalence`（deps.xml 第 368 行）
- `inference/LocalRules` -> `inference/TruthFunctions`（deps.xml 第 369 行）
- `inference/LocalRules` -> `entity/TermLink`（deps.xml 第 370 行）
- `inference/LocalRules` -> `storage/Memory`（deps.xml 第 371 行）
- `inference/LocalRules` -> `plugin/mental/Emotions`（deps.xml 第 372 行）
- `inference/LocalRules` -> `language/Similarity`（deps.xml 第 373 行）
- 交叉校验：
- Java graph 额外依赖：control/DerivationContext、entity/BudgetValue、entity/Concept、entity/Item、entity/Sentence、entity/Stamp、entity/Task、entity/TaskLink、entity/TermLink、entity/TruthValue、inference/BudgetFunctions、inference/TemporalRules、inference/TruthFunctions、inference/UtilityFunctions、interfaces/Timable、io/Symbols、io/events/Events、io/events/OutputHandler、language/CompoundTerm、language/Equivalence、language/Implication、language/Inheritance、language/Similarity、language/Statement、language/Term、language/Variables、parameter/Parameters、plugin/mental/Emotions、storage/Memory

## 5. Java 功能说明

- **职责概述**：文件工作：复制规则/真值/预算静态表并完善类型约束与数值校验。
- **关键数据结构**：
- `LocalRules` · 继承：JavaObject · 实现：（无接口）
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

- ts-analysis: LOC=470 · TODO=0
- 参考文件：`java-master/src/main/java/org/opennars/inference/LocalRules.java`
