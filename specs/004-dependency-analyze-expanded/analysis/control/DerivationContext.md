# src/control/DerivationContext.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/control/DerivationContext.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/control/DerivationContext.java` |
| 模块链路 | `language 基座 -> entity -> inference -> control 控制层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/control/DerivationContext.ts --noEmit`）

- 执行的命令：`npx tsc src/control/DerivationContext.ts --noEmit`
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
- `control/DerivationContext` -> `io/events/Events`（deps.xml 第 124 行）
- `control/DerivationContext` -> `entity/TruthValue`（deps.xml 第 125 行）
- `control/DerivationContext` -> `language/Interval`（deps.xml 第 126 行）
- `control/DerivationContext` -> `entity/Concept`（deps.xml 第 127 行）
- `control/DerivationContext` -> `language/Implication`（deps.xml 第 128 行）
- `control/DerivationContext` -> `language/Statement`（deps.xml 第 129 行）
- `control/DerivationContext` -> `entity/Item`（deps.xml 第 130 行）
- `control/DerivationContext` -> `entity/Task`（deps.xml 第 131 行）
- `control/DerivationContext` -> `entity/BudgetValue`（deps.xml 第 132 行）
- `control/DerivationContext` -> `interfaces/Timable`（deps.xml 第 133 行）
- `control/DerivationContext` -> `language/Term`（deps.xml 第 134 行）
- `control/DerivationContext` -> `entity/Sentence`（deps.xml 第 135 行）
- `control/DerivationContext` -> `parameter/Debug`（deps.xml 第 136 行）
- `control/DerivationContext` -> `parameter/Parameters`（deps.xml 第 137 行）
- `control/DerivationContext` -> `language/Variable`（deps.xml 第 138 行）
- `control/DerivationContext` -> `entity/TaskLink`（deps.xml 第 139 行）
- `control/DerivationContext` -> `io/events/EventEmitter`（deps.xml 第 140 行）
- `control/DerivationContext` -> `entity/Stamp`（deps.xml 第 141 行）
- `control/DerivationContext` -> `operator/Operation`（deps.xml 第 142 行）
- `control/DerivationContext` -> `language/Equivalence`（deps.xml 第 143 行）
- `control/DerivationContext` -> `inference/TruthFunctions`（deps.xml 第 144 行）
- `control/DerivationContext` -> `entity/TermLink`（deps.xml 第 145 行）
- `control/DerivationContext` -> `storage/Memory`（deps.xml 第 146 行）
- 交叉校验：
- Java graph 额外依赖：entity/BudgetValue、entity/Concept、entity/Item、entity/Sentence、entity/Stamp、entity/Task、entity/TaskLink、entity/TermLink、entity/TruthValue、inference/TruthFunctions、interfaces/Timable、io/events/EventEmitter、io/events/Events、language/Equivalence、language/Implication、language/Interval、language/Statement、language/Term、language/Variable、operator/Operation、parameter/Debug、parameter/Parameters、storage/Memory

## 5. Java 功能说明

- **职责概述**：文件工作：重建推理循环、任务调度与暂停机制，替换 synchronized/wait 行为。
- **关键数据结构**：
- `DerivationContext` · 继承：JavaObject · 实现：（无接口）
- **核心流程 / 算法**：
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：重建推理循环、任务调度与暂停机制，替换 synchronized/wait 行为。
  3. Java-TS 差异：参见《通用转译法.md》 - 控制与调度
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `Java Memory/Task 接口` 衔接上下游。

## 6. 一致性风险

- 缺少显式 import，需依赖 Java/ts-analysis 交叉校验。

## 7. 路线图定位

- 1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
- 2. 文件工作：重建推理循环、任务调度与暂停机制，替换 synchronized/wait 行为。
- 3. Java-TS 差异：参见《通用转译法.md》 - 控制与调度

## 8. 附加记录

- ts-analysis: LOC=610 · TODO=0
- 参考文件：`java-master/src/main/java/org/opennars/control/DerivationContext.java`
