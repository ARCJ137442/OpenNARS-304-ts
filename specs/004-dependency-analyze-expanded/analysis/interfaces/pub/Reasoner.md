# src/interfaces/pub/Reasoner.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/interfaces/pub/Reasoner.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/interfaces/pub/Reasoner.java` |
| 模块链路 | `language 基座 -> interfaces 接口层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/interfaces/pub/Reasoner.ts --noEmit`）

- 执行的命令：`npx tsc src/interfaces/pub/Reasoner.ts --noEmit`
- 关键输出：
  - TS2304（L11, C5）：[full_check] Cannot find name 'SensoryChannelConsumer'.
  - TS2304（L12, C5）：[full_check] Cannot find name 'Resettable'.
  - TS2304（L13, C5）：[full_check] Cannot find name 'NarseseConsumer'.
  - TS2304（L14, C5）：[full_check] Cannot find name 'InputFileConsumer'.
  - TS2304（L15, C5）：[full_check] Cannot find name 'TaskConsumer'.
  - TS2304（L16, C5）：[full_check] Cannot find name 'Eventable'.
  - TS2304（L17, C5）：[full_check] Cannot find name 'Pluggable'.
  - TS2304（L18, C5）：[full_check] Cannot find name 'Multistepable'.
  - TS2304（L19, C5）：[full_check] Cannot find name 'Timable'.
  - TS2304（L28, C49）：[full_check] Cannot find name 'AnswerHandler'.
  - TS2304（L38, C52）：[full_check] Cannot find name 'AnswerHandler'.
  - TS2304（L47, C41）：[full_check] Cannot find name 'Concept'.
  - TS2304（L11, C5）：[syntax_check] Cannot find name 'SensoryChannelConsumer'.
  - TS2304（L12, C5）：[syntax_check] Cannot find name 'Resettable'.
  - TS2304（L13, C5）：[syntax_check] Cannot find name 'NarseseConsumer'.
  - TS2304（L14, C5）：[syntax_check] Cannot find name 'InputFileConsumer'.
  - TS2304（L15, C5）：[syntax_check] Cannot find name 'TaskConsumer'.
  - TS2304（L16, C5）：[syntax_check] Cannot find name 'Eventable'.
  - TS2304（L17, C5）：[syntax_check] Cannot find name 'Pluggable'.
  - TS2304（L18, C5）：[syntax_check] Cannot find name 'Multistepable'.
  - TS2304（L19, C5）：[syntax_check] Cannot find name 'Timable'.
  - TS2304（L28, C49）：[syntax_check] Cannot find name 'AnswerHandler'.
  - TS2304（L38, C52）：[syntax_check] Cannot find name 'AnswerHandler'.
  - TS2304（L47, C41）：[syntax_check] Cannot find name 'Concept'.
- 总结：存在语法错误，需要比对 Java 语句结构。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

（无显式结构性依赖，主要依赖 `jree` 提供的运行时桩或尚未补齐的全局声明。）

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

- `[full_check] Cannot find name 'SensoryChannelConsumer'.` @ L11
- `[full_check] Cannot find name 'Resettable'.` @ L12
- `[full_check] Cannot find name 'NarseseConsumer'.` @ L13
- `[full_check] Cannot find name 'InputFileConsumer'.` @ L14
- `[full_check] Cannot find name 'TaskConsumer'.` @ L15
- `[full_check] Cannot find name 'Eventable'.` @ L16
- `[full_check] Cannot find name 'Pluggable'.` @ L17
- `[full_check] Cannot find name 'Multistepable'.` @ L18
- `[full_check] Cannot find name 'Timable'.` @ L19
- `[full_check] Cannot find name 'AnswerHandler'.` @ L28
- `[full_check] Cannot find name 'AnswerHandler'.` @ L38
- `[full_check] Cannot find name 'Concept'.` @ L47
- `[syntax_check] Cannot find name 'SensoryChannelConsumer'.` @ L11
- `[syntax_check] Cannot find name 'Resettable'.` @ L12
- `[syntax_check] Cannot find name 'NarseseConsumer'.` @ L13
- `[syntax_check] Cannot find name 'InputFileConsumer'.` @ L14
- `[syntax_check] Cannot find name 'TaskConsumer'.` @ L15
- `[syntax_check] Cannot find name 'Eventable'.` @ L16
- `[syntax_check] Cannot find name 'Pluggable'.` @ L17
- `[syntax_check] Cannot find name 'Multistepable'.` @ L18
- `[syntax_check] Cannot find name 'Timable'.` @ L19
- `[syntax_check] Cannot find name 'AnswerHandler'.` @ L28
- `[syntax_check] Cannot find name 'AnswerHandler'.` @ L38
- `[syntax_check] Cannot find name 'Concept'.` @ L47

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `interfaces/pub/Reasoner` -> `interfaces/TaskConsumer`（deps.xml 第 522 行）
- `interfaces/pub/Reasoner` -> `interfaces/Multistepable`（deps.xml 第 523 行）
- `interfaces/pub/Reasoner` -> `io/Parser`（deps.xml 第 524 行）
- `interfaces/pub/Reasoner` -> `entity/Concept`（deps.xml 第 525 行）
- `interfaces/pub/Reasoner` -> `interfaces/InputFileConsumer`（deps.xml 第 526 行）
- `interfaces/pub/Reasoner` -> `interfaces/Resettable`（deps.xml 第 527 行）
- `interfaces/pub/Reasoner` -> `io/events/AnswerHandler`（deps.xml 第 528 行）
- `interfaces/pub/Reasoner` -> `interfaces/SensoryChannelConsumer`（deps.xml 第 529 行）
- `interfaces/pub/Reasoner` -> `interfaces/NarseseConsumer`（deps.xml 第 530 行）
- `interfaces/pub/Reasoner` -> `interfaces/Pluggable`（deps.xml 第 531 行）
- `interfaces/pub/Reasoner` -> `io/Narsese`（deps.xml 第 532 行）
- `interfaces/pub/Reasoner` -> `interfaces/Eventable`（deps.xml 第 533 行）
- `interfaces/pub/Reasoner` -> `interfaces/Timable`（deps.xml 第 534 行）
- 交叉校验：
- Java graph 额外依赖：entity/Concept、interfaces/Eventable、interfaces/InputFileConsumer、interfaces/Multistepable、interfaces/NarseseConsumer、interfaces/Pluggable、interfaces/Resettable、interfaces/SensoryChannelConsumer、interfaces/TaskConsumer、interfaces/Timable、io/Narsese、io/Parser、io/events/AnswerHandler

## 5. Java 功能说明

- **职责概述**：文件工作：以 interface/abstract class 还原 Java 接口，在 TS 实现类中显式 implements。
- **关键数据结构**：
- 以函数或常量导出为主，未声明 class。
- **核心流程 / 算法**：
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：以 interface/abstract class 还原 Java 接口，在 TS 实现类中显式 implements。
  3. Java-TS 差异：参见《通用转译法.md》 - 接口规范
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `Java Memory/Task 接口` 衔接上下游。

## 6. 一致性风险

- `tsc` 报错阻塞进一步分析，需要回填语句结构。
- 缺少显式 import，需依赖 Java/ts-analysis 交叉校验。

## 7. 路线图定位

- 1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
- 2. 文件工作：以 interface/abstract class 还原 Java 接口，在 TS 实现类中显式 implements。
- 3. Java-TS 差异：参见《通用转译法.md》 - 接口规范

## 8. 附加记录

- ts-analysis: LOC=83 · TODO=0
- 参考文件：`java-master/src/main/java/org/opennars/interfaces/pub/Reasoner.java`
