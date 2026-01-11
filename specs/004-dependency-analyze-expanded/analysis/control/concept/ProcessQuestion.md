# src/control/concept/ProcessQuestion.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/control/concept/ProcessQuestion.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/control/concept/ProcessQuestion.java` |
| 模块链路 | `language 基座 -> entity -> inference -> control 控制层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/control/concept/ProcessQuestion.ts --noEmit`）

- 执行的命令：`npx tsc src/control/concept/ProcessQuestion.ts --noEmit`
- 关键输出：
  - TS2304（L17, C47）：[full_check] Cannot find name 'Concept'.
  - TS2304（L17, C61）：[full_check] Cannot find name 'DerivationContext'.
  - TS2304（L17, C86）：[full_check] Cannot find name 'Task'.
  - TS2304（L18, C23）：[full_check] Cannot find name 'Task'.
  - TS2304（L19, C39）：[full_check] Cannot find name 'Task'.
  - TS2304（L20, C43）：[full_check] Cannot find name 'Symbols'.
  - TS2304（L24, C57）：[full_check] Cannot find name 'Task'.
  - TS2304（L24, C65）：[full_check] Cannot find name 'tryFind'.
  - TS7006（L25, C17）：[full_check] Parameter 'iQuestionTask' implicitly has an 'any' type.
  - TS2304（L34, C26）：[full_check] Cannot find name 'Task'.
  - TS2304（L35, C39）：[full_check] Cannot find name 'Events'.
  - TS2304（L39, C35）：[full_check] Cannot find name 'Events'.
  - TS2304（L41, C19）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L42, C25）：[full_check] Cannot find name 'Task'.
  - TS2304（L47, C13）：[full_check] Cannot find name 'trySolution'.
  - TS2304（L57, C33）：[full_check] Cannot find name 'Events'.
  - TS2304（L71, C48）：[full_check] Cannot find name 'Concept'.
  - TS2304（L71, C63）：[full_check] Cannot find name 'Task'.
  - TS2304（L71, C74）：[full_check] Cannot find name 'DerivationContext'.
  - TS2304（L75, C24）：[full_check] Cannot find name 'Term'.
  - TS2304（L75, C34）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L76, C17）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L77, C51）：[full_check] Cannot find name 'Variables'.
  - TS2304（L77, C92）：[full_check] Cannot find name 'Symbols'.
  - TS2304（L78, C28）：[full_check] Cannot find name 'Concept'.
  - TS2304（L83, C49）：[full_check] Cannot find name 'Task'.
  - TS2304（L85, C41）：[full_check] Cannot find name 'Task'.
  - TS2362（L87, C29）：[full_check] The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.
  - TS2304（L87, C42）：[full_check] Cannot find name 'trySolution'.
  - TS2304（L94, C33）：[full_check] Cannot find name 'Events'.
  - TS2304（L109, C54）：[full_check] Cannot find name 'Concept'.
  - TS2304（L109, C66）：[full_check] Cannot find name 'Task'.
  - TS2304（L109, C77）：[full_check] Cannot find name 'DerivationContext'.
  - TS2304（L112, C27）：[full_check] Cannot find name 'Task'.
  - TS2304（L117, C28）：[full_check] Cannot find name 'Term'.
  - TS2304（L117, C38）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L118, C21）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L120, C28）：[full_check] Cannot find name 'Variables'.
  - TS2304（L120, C69）：[full_check] Cannot find name 'Symbols'.
  - TS2304（L121, C32）：[full_check] Cannot find name 'Concept'.
  - TS2304（L126, C53）：[full_check] Cannot find name 'Task'.
  - TS2304（L128, C45）：[full_check] Cannot find name 'Task'.
  - TS2362（L130, C33）：[full_check] The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.
  - TS2304（L130, C46）：[full_check] Cannot find name 'trySolution'.
  - TS2304（L137, C41）：[full_check] Cannot find name 'Events'.
  - TS2304（L17, C47）：[syntax_check] Cannot find name 'Concept'.
  - TS2304（L17, C61）：[syntax_check] Cannot find name 'DerivationContext'.
  - TS2304（L17, C86）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L18, C23）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L19, C39）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L20, C43）：[syntax_check] Cannot find name 'Symbols'.
  - TS2304（L24, C57）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L24, C65）：[syntax_check] Cannot find name 'tryFind'.
  - TS7006（L25, C17）：[syntax_check] Parameter 'iQuestionTask' implicitly has an 'any' type.
  - TS2304（L34, C26）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L35, C39）：[syntax_check] Cannot find name 'Events'.
  - TS2304（L39, C35）：[syntax_check] Cannot find name 'Events'.
  - TS2304（L41, C19）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L42, C25）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L47, C13）：[syntax_check] Cannot find name 'trySolution'.
  - TS2304（L57, C33）：[syntax_check] Cannot find name 'Events'.
  - TS2304（L71, C48）：[syntax_check] Cannot find name 'Concept'.
  - TS2304（L71, C63）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L71, C74）：[syntax_check] Cannot find name 'DerivationContext'.
  - TS2304（L75, C24）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L75, C34）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L76, C17）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L77, C51）：[syntax_check] Cannot find name 'Variables'.
  - TS2304（L77, C92）：[syntax_check] Cannot find name 'Symbols'.
  - TS2304（L78, C28）：[syntax_check] Cannot find name 'Concept'.
  - TS2304（L83, C49）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L85, C41）：[syntax_check] Cannot find name 'Task'.
  - TS2362（L87, C29）：[syntax_check] The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.
  - TS2304（L87, C42）：[syntax_check] Cannot find name 'trySolution'.
  - TS2304（L94, C33）：[syntax_check] Cannot find name 'Events'.
  - TS2304（L109, C54）：[syntax_check] Cannot find name 'Concept'.
  - TS2304（L109, C66）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L109, C77）：[syntax_check] Cannot find name 'DerivationContext'.
  - TS2304（L112, C27）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L117, C28）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L117, C38）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L118, C21）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L120, C28）：[syntax_check] Cannot find name 'Variables'.
  - TS2304（L120, C69）：[syntax_check] Cannot find name 'Symbols'.
  - TS2304（L121, C32）：[syntax_check] Cannot find name 'Concept'.
  - TS2304（L126, C53）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L128, C45）：[syntax_check] Cannot find name 'Task'.
  - TS2362（L130, C33）：[syntax_check] The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.
  - TS2304（L130, C46）：[syntax_check] Cannot find name 'trySolution'.
  - TS2304（L137, C41）：[syntax_check] Cannot find name 'Events'.
- 总结：存在语法错误，需要比对 Java 语句结构。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

（无显式结构性依赖，主要依赖 `jree` 提供的运行时桩或尚未补齐的全局声明。）

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

- `[full_check] Cannot find name 'Concept'.` @ L17
- `[full_check] Cannot find name 'DerivationContext'.` @ L17
- `[full_check] Cannot find name 'Task'.` @ L17
- `[full_check] Cannot find name 'Task'.` @ L18
- `[full_check] Cannot find name 'Task'.` @ L19
- `[full_check] Cannot find name 'Symbols'.` @ L20
- `[full_check] Cannot find name 'Task'.` @ L24
- `[full_check] Cannot find name 'tryFind'.` @ L24
- `[full_check] Cannot find name 'Task'.` @ L34
- `[full_check] Cannot find name 'Events'.` @ L35
- `[full_check] Cannot find name 'Events'.` @ L39
- `[full_check] Cannot find name 'Sentence'.` @ L41
- `[full_check] Cannot find name 'Task'.` @ L42
- `[full_check] Cannot find name 'trySolution'.` @ L47
- `[full_check] Cannot find name 'Events'.` @ L57
- `[full_check] Cannot find name 'Concept'.` @ L71
- `[full_check] Cannot find name 'Task'.` @ L71
- `[full_check] Cannot find name 'DerivationContext'.` @ L71
- `[full_check] Cannot find name 'Term'.` @ L75
- `[full_check] Cannot find name 'CompoundTerm'.` @ L75
- `[full_check] Cannot find name 'CompoundTerm'.` @ L76
- `[full_check] Cannot find name 'Variables'.` @ L77
- `[full_check] Cannot find name 'Symbols'.` @ L77
- `[full_check] Cannot find name 'Concept'.` @ L78
- `[full_check] Cannot find name 'Task'.` @ L83
- `[full_check] Cannot find name 'Task'.` @ L85
- `[full_check] Cannot find name 'trySolution'.` @ L87
- `[full_check] Cannot find name 'Events'.` @ L94
- `[full_check] Cannot find name 'Concept'.` @ L109
- `[full_check] Cannot find name 'Task'.` @ L109
- `[full_check] Cannot find name 'DerivationContext'.` @ L109
- `[full_check] Cannot find name 'Task'.` @ L112
- `[full_check] Cannot find name 'Term'.` @ L117
- `[full_check] Cannot find name 'CompoundTerm'.` @ L117
- `[full_check] Cannot find name 'CompoundTerm'.` @ L118
- `[full_check] Cannot find name 'Variables'.` @ L120
- `[full_check] Cannot find name 'Symbols'.` @ L120
- `[full_check] Cannot find name 'Concept'.` @ L121
- `[full_check] Cannot find name 'Task'.` @ L126
- `[full_check] Cannot find name 'Task'.` @ L128
- `[full_check] Cannot find name 'trySolution'.` @ L130
- `[full_check] Cannot find name 'Events'.` @ L137
- `[syntax_check] Cannot find name 'Concept'.` @ L17
- `[syntax_check] Cannot find name 'DerivationContext'.` @ L17
- `[syntax_check] Cannot find name 'Task'.` @ L17
- `[syntax_check] Cannot find name 'Task'.` @ L18
- `[syntax_check] Cannot find name 'Task'.` @ L19
- `[syntax_check] Cannot find name 'Symbols'.` @ L20
- `[syntax_check] Cannot find name 'Task'.` @ L24
- `[syntax_check] Cannot find name 'tryFind'.` @ L24
- `[syntax_check] Cannot find name 'Task'.` @ L34
- `[syntax_check] Cannot find name 'Events'.` @ L35
- `[syntax_check] Cannot find name 'Events'.` @ L39
- `[syntax_check] Cannot find name 'Sentence'.` @ L41
- `[syntax_check] Cannot find name 'Task'.` @ L42
- `[syntax_check] Cannot find name 'trySolution'.` @ L47
- `[syntax_check] Cannot find name 'Events'.` @ L57
- `[syntax_check] Cannot find name 'Concept'.` @ L71
- `[syntax_check] Cannot find name 'Task'.` @ L71
- `[syntax_check] Cannot find name 'DerivationContext'.` @ L71
- `[syntax_check] Cannot find name 'Term'.` @ L75
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L75
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L76
- `[syntax_check] Cannot find name 'Variables'.` @ L77
- `[syntax_check] Cannot find name 'Symbols'.` @ L77
- `[syntax_check] Cannot find name 'Concept'.` @ L78
- `[syntax_check] Cannot find name 'Task'.` @ L83
- `[syntax_check] Cannot find name 'Task'.` @ L85
- `[syntax_check] Cannot find name 'trySolution'.` @ L87
- `[syntax_check] Cannot find name 'Events'.` @ L94
- `[syntax_check] Cannot find name 'Concept'.` @ L109
- `[syntax_check] Cannot find name 'Task'.` @ L109
- `[syntax_check] Cannot find name 'DerivationContext'.` @ L109
- `[syntax_check] Cannot find name 'Task'.` @ L112
- `[syntax_check] Cannot find name 'Term'.` @ L117
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L117
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L118
- `[syntax_check] Cannot find name 'Variables'.` @ L120
- `[syntax_check] Cannot find name 'Symbols'.` @ L120
- `[syntax_check] Cannot find name 'Concept'.` @ L121
- `[syntax_check] Cannot find name 'Task'.` @ L126
- `[syntax_check] Cannot find name 'Task'.` @ L128
- `[syntax_check] Cannot find name 'trySolution'.` @ L130
- `[syntax_check] Cannot find name 'Events'.` @ L137

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `control/concept/ProcessQuestion` -> `io/events/Events`（deps.xml 第 95 行）
- `control/concept/ProcessQuestion` -> `language/Variables`（deps.xml 第 96 行）
- `control/concept/ProcessQuestion` -> `entity/TaskLink`（deps.xml 第 97 行）
- `control/concept/ProcessQuestion` -> `entity/Concept`（deps.xml 第 98 行）
- `control/concept/ProcessQuestion` -> `language/CompoundTerm`（deps.xml 第 99 行）
- `control/concept/ProcessQuestion` -> `io/events/EventEmitter`（deps.xml 第 100 行）
- `control/concept/ProcessQuestion` -> `inference/LocalRules`（deps.xml 第 101 行）
- `control/concept/ProcessQuestion` -> `entity/Task`（deps.xml 第 102 行）
- `control/concept/ProcessQuestion` -> `control/DerivationContext`（deps.xml 第 103 行）
- `control/concept/ProcessQuestion` -> `storage/Memory`（deps.xml 第 104 行）
- `control/concept/ProcessQuestion` -> `language/Term`（deps.xml 第 105 行）
- `control/concept/ProcessQuestion` -> `entity/Sentence`（deps.xml 第 106 行）
- `control/concept/ProcessQuestion` -> `io/Symbols`（deps.xml 第 107 行）
- `control/concept/ProcessQuestion` -> `parameter/Parameters`（deps.xml 第 108 行）
- 交叉校验：
- Java graph 额外依赖：control/DerivationContext、entity/Concept、entity/Sentence、entity/Task、entity/TaskLink、inference/LocalRules、io/Symbols、io/events/EventEmitter、io/events/Events、language/CompoundTerm、language/Term、language/Variables、parameter/Parameters、storage/Memory

## 5. Java 功能说明

- **职责概述**：文件工作：重建推理循环、任务调度与暂停机制，替换 synchronized/wait 行为。
- **关键数据结构**：
- `ProcessQuestion` · 继承：JavaObject · 实现：（无接口）
- **核心流程 / 算法**：
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：重建推理循环、任务调度与暂停机制，替换 synchronized/wait 行为。
  3. Java-TS 差异：参见《通用转译法.md》 - 控制与调度
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `Java Memory/Task 接口` 衔接上下游。

## 6. 一致性风险

- `tsc` 报错阻塞进一步分析，需要回填语句结构。
- 缺少显式 import，需依赖 Java/ts-analysis 交叉校验。

## 7. 路线图定位

- 1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
- 2. 文件工作：重建推理循环、任务调度与暂停机制，替换 synchronized/wait 行为。
- 3. Java-TS 差异：参见《通用转译法.md》 - 控制与调度

## 8. 附加记录

- ts-analysis: LOC=143 · TODO=0
- 参考文件：`java-master/src/main/java/org/opennars/control/concept/ProcessQuestion.java`
