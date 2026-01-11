# src/inference/CompositionalRules.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/inference/CompositionalRules.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/inference/CompositionalRules.java` |
| 模块链路 | `language 基座 -> entity -> inference 推理层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/inference/CompositionalRules.ts --noEmit`）

- 执行的命令：`npx tsc src/inference/CompositionalRules.ts --noEmit`
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
- `inference/CompositionalRules` -> `language/Terms`（deps.xml 第 305 行）
- `inference/CompositionalRules` -> `language/Variables`（deps.xml 第 306 行）
- `inference/CompositionalRules` -> `entity/TruthValue`（deps.xml 第 307 行）
- `inference/CompositionalRules` -> `language/Interval`（deps.xml 第 308 行）
- `inference/CompositionalRules` -> `entity/Concept`（deps.xml 第 309 行）
- `inference/CompositionalRules` -> `language/DifferenceExt`（deps.xml 第 310 行）
- `inference/CompositionalRules` -> `language/CompoundTerm`（deps.xml 第 311 行）
- `inference/CompositionalRules` -> `language/Negation`（deps.xml 第 312 行）
- `inference/CompositionalRules` -> `language/Statement`（deps.xml 第 313 行）
- `inference/CompositionalRules` -> `entity/Item`（deps.xml 第 314 行）
- `inference/CompositionalRules` -> `entity/Task`（deps.xml 第 315 行）
- `inference/CompositionalRules` -> `language/DifferenceInt`（deps.xml 第 316 行）
- `inference/CompositionalRules` -> `entity/BudgetValue`（deps.xml 第 317 行）
- `inference/CompositionalRules` -> `language/Conjunction`（deps.xml 第 318 行）
- `inference/CompositionalRules` -> `entity/Sentence`（deps.xml 第 319 行）
- `inference/CompositionalRules` -> `language/Inheritance`（deps.xml 第 320 行）
- `inference/CompositionalRules` -> `language/ImageInt`（deps.xml 第 321 行）
- `inference/CompositionalRules` -> `language/SetExt`（deps.xml 第 322 行）
- `inference/CompositionalRules` -> `entity/Stamp`（deps.xml 第 323 行）
- `inference/CompositionalRules` -> `language/Equivalence`（deps.xml 第 324 行）
- `inference/CompositionalRules` -> `language/SetInt`（deps.xml 第 325 行）
- `inference/CompositionalRules` -> `inference/TruthFunctions`（deps.xml 第 326 行）
- `inference/CompositionalRules` -> `storage/Memory`（deps.xml 第 327 行）
- `inference/CompositionalRules` -> `language/IntersectionExt`（deps.xml 第 328 行）
- `inference/CompositionalRules` -> `language/Implication`（deps.xml 第 329 行）
- `inference/CompositionalRules` -> `language/Image`（deps.xml 第 330 行）
- `inference/CompositionalRules` -> `inference/TemporalRules`（deps.xml 第 331 行）
- `inference/CompositionalRules` -> `language/ImageExt`（deps.xml 第 332 行）
- `inference/CompositionalRules` -> `language/IntersectionInt`（deps.xml 第 333 行）
- `inference/CompositionalRules` -> `language/Term`（deps.xml 第 334 行）
- `inference/CompositionalRules` -> `language/Disjunction`（deps.xml 第 335 行）
- `inference/CompositionalRules` -> `io/Symbols`（deps.xml 第 336 行）
- `inference/CompositionalRules` -> `parameter/Debug`（deps.xml 第 337 行）
- `inference/CompositionalRules` -> `parameter/Parameters`（deps.xml 第 338 行）
- `inference/CompositionalRules` -> `language/Variable`（deps.xml 第 339 行）
- `inference/CompositionalRules` -> `inference/BudgetFunctions`（deps.xml 第 340 行）
- `inference/CompositionalRules` -> `control/DerivationContext`（deps.xml 第 341 行）
- `inference/CompositionalRules` -> `language/Similarity`（deps.xml 第 342 行）
- 交叉校验：
- Java graph 额外依赖：control/DerivationContext、entity/BudgetValue、entity/Concept、entity/Item、entity/Sentence、entity/Stamp、entity/Task、entity/TruthValue、inference/BudgetFunctions、inference/TemporalRules、inference/TruthFunctions、io/Symbols、language/CompoundTerm、language/Conjunction、language/DifferenceExt、language/DifferenceInt、language/Disjunction、language/Equivalence、language/Image、language/ImageExt、language/ImageInt、language/Implication、language/Inheritance、language/IntersectionExt、language/IntersectionInt、language/Interval、language/Negation、language/SetExt、language/SetInt、language/Similarity、language/Statement、language/Term、language/Terms、language/Variable、language/Variables、parameter/Debug、parameter/Parameters、storage/Memory

## 5. Java 功能说明

- **职责概述**：文件工作：复制规则/真值/预算静态表并完善类型约束与数值校验。
- **关键数据结构**：
- `CompositionalRules` · 继承：JavaObject · 实现：（无接口）
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

- ts-analysis: LOC=827 · TODO=0
- 参考文件：`java-master/src/main/java/org/opennars/inference/CompositionalRules.java`
