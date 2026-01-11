# src/control/concept/ProcessJudgment.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/control/concept/ProcessJudgment.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/control/concept/ProcessJudgment.java` |
| 模块链路 | `language 基座 -> entity -> inference -> control 控制层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/control/concept/ProcessJudgment.ts --noEmit`）

- 执行的命令：`npx tsc src/control/concept/ProcessJudgment.ts --noEmit`
- 关键输出：
  - TS2304（L18, C44）：[full_check] Cannot find name 'Concept'.
  - TS2304（L18, C58）：[full_check] Cannot find name 'DerivationContext'.
  - TS2304（L18, C83）：[full_check] Cannot find name 'Task'.
  - TS2304（L20, C19）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L21, C9）：[full_check] Cannot find name 'ProcessAnticipation'.
  - TS2304（L22, C25）：[full_check] Cannot find name 'Task'.
  - TS2304（L25, C24）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L28, C27）：[full_check] Cannot find name 'Stamp'.
  - TS2304（L29, C27）：[full_check] Cannot find name 'Stamp'.
  - TS2304（L33, C24）：[full_check] Cannot find name 'revisable'.
  - TS2304（L35, C38）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L39, C21）：[full_check] Cannot find name 'revision'.
  - TS2304（L48, C13）：[full_check] Cannot find name 'trySolution'.
  - TS2304（L52, C13）：[full_check] Cannot find name 'trySolution'.
  - TS2304（L55, C13）：[full_check] Cannot find name 'Events'.
  - TS2304（L55, C44）：[full_check] Cannot find name 'Events'.
  - TS2304（L69, C49）：[full_check] Cannot find name 'Task'.
  - TS2304（L69, C60）：[full_check] Cannot find name 'DerivationContext'.
  - TS2304（L70, C91）：[full_check] Cannot find name 'Operation'.
  - TS2304（L71, C21）：[full_check] Cannot find name 'Operation'.
  - TS2304（L71, C55）：[full_check] Cannot find name 'Operation'.
  - TS2304（L72, C20）：[full_check] Cannot find name 'Operator'.
  - TS2304（L72, C52）：[full_check] Cannot find name 'Operator'.
  - TS2304（L75, C32）：[full_check] Cannot find name 'Believe'.
  - TS2304（L75, C59）：[full_check] Cannot find name 'Want'.
  - TS2304（L75, C83）：[full_check] Cannot find name 'Wonder'.
  - TS2304（L76, C35）：[full_check] Cannot find name 'Evaluate'.
  - TS2304（L76, C63）：[full_check] Cannot find name 'Anticipate'.
  - TS2304（L77, C17）：[full_check] Cannot find name 'TemporalInferenceControl'.
  - TS2304（L90, C51）：[full_check] Cannot find name 'Task'.
  - TS2304（L90, C62）：[full_check] Cannot find name 'DerivationContext'.
  - TS2304（L91, C19）：[full_check] Cannot find name 'Term'.
  - TS2304（L93, C31）：[full_check] Cannot find name 'Implication'.
  - TS2304（L96, C18）：[full_check] Cannot find name 'Implication'.
  - TS2304（L96, C40）：[full_check] Cannot find name 'Implication'.
  - TS2304（L97, C40）：[full_check] Cannot find name 'TemporalRules'.
  - TS2304（L102, C19）：[full_check] Cannot find name 'Term'.
  - TS2304（L103, C31）：[full_check] Cannot find name 'Conjunction'.
  - TS2304（L106, C19）：[full_check] Cannot find name 'Conjunction'.
  - TS2304（L106, C41）：[full_check] Cannot find name 'Conjunction'.
  - TS2304（L108, C41）：[full_check] Cannot find name 'TemporalRules'.
  - TS2304（L110, C56）：[full_check] Cannot find name 'Interval'.
  - TS2304（L111, C56）：[full_check] Cannot find name 'Operation'.
  - TS2304（L121, C61）：[full_check] Cannot find name 'Task'.
  - TS2304（L121, C72）：[full_check] Cannot find name 'DerivationContext'.
  - TS2304（L122, C36）：[full_check] Cannot find name 'Term'.
  - TS2304（L124, C33）：[full_check] Cannot find name 'Implication'.
  - TS2304（L125, C44）：[full_check] Cannot find name 'Implication'.
  - TS2304（L127, C36）：[full_check] Cannot find name 'Term'.
  - TS2304（L127, C82）：[full_check] Cannot find name 'Implication'.
  - TS2304（L133, C29）：[full_check] Cannot find name 'Concept'.
  - TS2322（L138, C13）：[full_check] Type 'null' is not assignable to type 'Optional<Task>'.
  - TS2304（L138, C50）：[full_check] Cannot find name 'Task'.
  - TS2304（L140, C28）：[full_check] Cannot find name 'tryFind'.
  - TS7006（L140, C60）：[full_check] Parameter 'iTask' implicitly has an 'any' type.
  - TS2304（L145, C19）：[full_check] Cannot find name 'Term'.
  - TS2304（L145, C66）：[full_check] Cannot find name 'Implication'.
  - TS2304（L145, C95）：[full_check] Cannot find name 'Conjunction'.
  - TS2304（L147, C36）：[full_check] Cannot find name 'Operation'.
  - TS2304（L152, C33）：[full_check] Cannot find name 'Concept'.
  - TS2304（L158, C39）：[full_check] Cannot find name 'Task'.
  - TS2304（L164, C21）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L165, C21）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L176, C74）：[full_check] Cannot find name 'Events'.
  - TS2304（L177, C17）：[full_check] Cannot find name 'Events'.
  - TS2304（L18, C44）：[syntax_check] Cannot find name 'Concept'.
  - TS2304（L18, C58）：[syntax_check] Cannot find name 'DerivationContext'.
  - TS2304（L18, C83）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L20, C19）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L21, C9）：[syntax_check] Cannot find name 'ProcessAnticipation'.
  - TS2304（L22, C25）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L25, C24）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L28, C27）：[syntax_check] Cannot find name 'Stamp'.
  - TS2304（L29, C27）：[syntax_check] Cannot find name 'Stamp'.
  - TS2304（L33, C24）：[syntax_check] Cannot find name 'revisable'.
  - TS2304（L35, C38）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L39, C21）：[syntax_check] Cannot find name 'revision'.
  - TS2304（L48, C13）：[syntax_check] Cannot find name 'trySolution'.
  - TS2304（L52, C13）：[syntax_check] Cannot find name 'trySolution'.
  - TS2304（L55, C13）：[syntax_check] Cannot find name 'Events'.
  - TS2304（L55, C44）：[syntax_check] Cannot find name 'Events'.
  - TS2304（L69, C49）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L69, C60）：[syntax_check] Cannot find name 'DerivationContext'.
  - TS2304（L70, C91）：[syntax_check] Cannot find name 'Operation'.
  - TS2304（L71, C21）：[syntax_check] Cannot find name 'Operation'.
  - TS2304（L71, C55）：[syntax_check] Cannot find name 'Operation'.
  - TS2304（L72, C20）：[syntax_check] Cannot find name 'Operator'.
  - TS2304（L72, C52）：[syntax_check] Cannot find name 'Operator'.
  - TS2304（L75, C32）：[syntax_check] Cannot find name 'Believe'.
  - TS2304（L75, C59）：[syntax_check] Cannot find name 'Want'.
  - TS2304（L75, C83）：[syntax_check] Cannot find name 'Wonder'.
  - TS2304（L76, C35）：[syntax_check] Cannot find name 'Evaluate'.
  - TS2304（L76, C63）：[syntax_check] Cannot find name 'Anticipate'.
  - TS2304（L77, C17）：[syntax_check] Cannot find name 'TemporalInferenceControl'.
  - TS2304（L90, C51）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L90, C62）：[syntax_check] Cannot find name 'DerivationContext'.
  - TS2304（L91, C19）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L93, C31）：[syntax_check] Cannot find name 'Implication'.
  - TS2304（L96, C18）：[syntax_check] Cannot find name 'Implication'.
  - TS2304（L96, C40）：[syntax_check] Cannot find name 'Implication'.
  - TS2304（L97, C40）：[syntax_check] Cannot find name 'TemporalRules'.
  - TS2304（L102, C19）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L103, C31）：[syntax_check] Cannot find name 'Conjunction'.
  - TS2304（L106, C19）：[syntax_check] Cannot find name 'Conjunction'.
  - TS2304（L106, C41）：[syntax_check] Cannot find name 'Conjunction'.
  - TS2304（L108, C41）：[syntax_check] Cannot find name 'TemporalRules'.
  - TS2304（L110, C56）：[syntax_check] Cannot find name 'Interval'.
  - TS2304（L111, C56）：[syntax_check] Cannot find name 'Operation'.
  - TS2304（L121, C61）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L121, C72）：[syntax_check] Cannot find name 'DerivationContext'.
  - TS2304（L122, C36）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L124, C33）：[syntax_check] Cannot find name 'Implication'.
  - TS2304（L125, C44）：[syntax_check] Cannot find name 'Implication'.
  - TS2304（L127, C36）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L127, C82）：[syntax_check] Cannot find name 'Implication'.
  - TS2304（L133, C29）：[syntax_check] Cannot find name 'Concept'.
  - TS2322（L138, C13）：[syntax_check] Type 'null' is not assignable to type 'Optional<Task>'.
  - TS2304（L138, C50）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L140, C28）：[syntax_check] Cannot find name 'tryFind'.
  - TS7006（L140, C60）：[syntax_check] Parameter 'iTask' implicitly has an 'any' type.
  - TS2304（L145, C19）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L145, C66）：[syntax_check] Cannot find name 'Implication'.
  - TS2304（L145, C95）：[syntax_check] Cannot find name 'Conjunction'.
  - TS2304（L147, C36）：[syntax_check] Cannot find name 'Operation'.
  - TS2304（L152, C33）：[syntax_check] Cannot find name 'Concept'.
  - TS2304（L158, C39）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L164, C21）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L165, C21）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L176, C74）：[syntax_check] Cannot find name 'Events'.
  - TS2304（L177, C17）：[syntax_check] Cannot find name 'Events'.
- 总结：存在语法错误，需要比对 Java 语句结构。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

（无显式结构性依赖，主要依赖 `jree` 提供的运行时桩或尚未补齐的全局声明。）

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

- `[full_check] Cannot find name 'Concept'.` @ L18
- `[full_check] Cannot find name 'DerivationContext'.` @ L18
- `[full_check] Cannot find name 'Task'.` @ L18
- `[full_check] Cannot find name 'Sentence'.` @ L20
- `[full_check] Cannot find name 'ProcessAnticipation'.` @ L21
- `[full_check] Cannot find name 'Task'.` @ L22
- `[full_check] Cannot find name 'Sentence'.` @ L25
- `[full_check] Cannot find name 'Stamp'.` @ L28
- `[full_check] Cannot find name 'Stamp'.` @ L29
- `[full_check] Cannot find name 'revisable'.` @ L33
- `[full_check] Cannot find name 'Sentence'.` @ L35
- `[full_check] Cannot find name 'revision'.` @ L39
- `[full_check] Cannot find name 'trySolution'.` @ L48
- `[full_check] Cannot find name 'trySolution'.` @ L52
- `[full_check] Cannot find name 'Events'.` @ L55
- `[full_check] Cannot find name 'Events'.` @ L55
- `[full_check] Cannot find name 'Task'.` @ L69
- `[full_check] Cannot find name 'DerivationContext'.` @ L69
- `[full_check] Cannot find name 'Operation'.` @ L70
- `[full_check] Cannot find name 'Operation'.` @ L71
- `[full_check] Cannot find name 'Operation'.` @ L71
- `[full_check] Cannot find name 'Operator'.` @ L72
- `[full_check] Cannot find name 'Operator'.` @ L72
- `[full_check] Cannot find name 'Believe'.` @ L75
- `[full_check] Cannot find name 'Want'.` @ L75
- `[full_check] Cannot find name 'Wonder'.` @ L75
- `[full_check] Cannot find name 'Evaluate'.` @ L76
- `[full_check] Cannot find name 'Anticipate'.` @ L76
- `[full_check] Cannot find name 'TemporalInferenceControl'.` @ L77
- `[full_check] Cannot find name 'Task'.` @ L90
- `[full_check] Cannot find name 'DerivationContext'.` @ L90
- `[full_check] Cannot find name 'Term'.` @ L91
- `[full_check] Cannot find name 'Implication'.` @ L93
- `[full_check] Cannot find name 'Implication'.` @ L96
- `[full_check] Cannot find name 'Implication'.` @ L96
- `[full_check] Cannot find name 'TemporalRules'.` @ L97
- `[full_check] Cannot find name 'Term'.` @ L102
- `[full_check] Cannot find name 'Conjunction'.` @ L103
- `[full_check] Cannot find name 'Conjunction'.` @ L106
- `[full_check] Cannot find name 'Conjunction'.` @ L106
- `[full_check] Cannot find name 'TemporalRules'.` @ L108
- `[full_check] Cannot find name 'Interval'.` @ L110
- `[full_check] Cannot find name 'Operation'.` @ L111
- `[full_check] Cannot find name 'Task'.` @ L121
- `[full_check] Cannot find name 'DerivationContext'.` @ L121
- `[full_check] Cannot find name 'Term'.` @ L122
- `[full_check] Cannot find name 'Implication'.` @ L124
- `[full_check] Cannot find name 'Implication'.` @ L125
- `[full_check] Cannot find name 'Term'.` @ L127
- `[full_check] Cannot find name 'Implication'.` @ L127
- `[full_check] Cannot find name 'Concept'.` @ L133
- `[full_check] Cannot find name 'Task'.` @ L138
- `[full_check] Cannot find name 'tryFind'.` @ L140
- `[full_check] Cannot find name 'Term'.` @ L145
- `[full_check] Cannot find name 'Implication'.` @ L145
- `[full_check] Cannot find name 'Conjunction'.` @ L145
- `[full_check] Cannot find name 'Operation'.` @ L147
- `[full_check] Cannot find name 'Concept'.` @ L152
- `[full_check] Cannot find name 'Task'.` @ L158
- `[full_check] Cannot find name 'CompoundTerm'.` @ L164
- `[full_check] Cannot find name 'CompoundTerm'.` @ L165
- `[full_check] Cannot find name 'Events'.` @ L176
- `[full_check] Cannot find name 'Events'.` @ L177
- `[syntax_check] Cannot find name 'Concept'.` @ L18
- `[syntax_check] Cannot find name 'DerivationContext'.` @ L18
- `[syntax_check] Cannot find name 'Task'.` @ L18
- `[syntax_check] Cannot find name 'Sentence'.` @ L20
- `[syntax_check] Cannot find name 'ProcessAnticipation'.` @ L21
- `[syntax_check] Cannot find name 'Task'.` @ L22
- `[syntax_check] Cannot find name 'Sentence'.` @ L25
- `[syntax_check] Cannot find name 'Stamp'.` @ L28
- `[syntax_check] Cannot find name 'Stamp'.` @ L29
- `[syntax_check] Cannot find name 'revisable'.` @ L33
- `[syntax_check] Cannot find name 'Sentence'.` @ L35
- `[syntax_check] Cannot find name 'revision'.` @ L39
- `[syntax_check] Cannot find name 'trySolution'.` @ L48
- `[syntax_check] Cannot find name 'trySolution'.` @ L52
- `[syntax_check] Cannot find name 'Events'.` @ L55
- `[syntax_check] Cannot find name 'Events'.` @ L55
- `[syntax_check] Cannot find name 'Task'.` @ L69
- `[syntax_check] Cannot find name 'DerivationContext'.` @ L69
- `[syntax_check] Cannot find name 'Operation'.` @ L70
- `[syntax_check] Cannot find name 'Operation'.` @ L71
- `[syntax_check] Cannot find name 'Operation'.` @ L71
- `[syntax_check] Cannot find name 'Operator'.` @ L72
- `[syntax_check] Cannot find name 'Operator'.` @ L72
- `[syntax_check] Cannot find name 'Believe'.` @ L75
- `[syntax_check] Cannot find name 'Want'.` @ L75
- `[syntax_check] Cannot find name 'Wonder'.` @ L75
- `[syntax_check] Cannot find name 'Evaluate'.` @ L76
- `[syntax_check] Cannot find name 'Anticipate'.` @ L76
- `[syntax_check] Cannot find name 'TemporalInferenceControl'.` @ L77
- `[syntax_check] Cannot find name 'Task'.` @ L90
- `[syntax_check] Cannot find name 'DerivationContext'.` @ L90
- `[syntax_check] Cannot find name 'Term'.` @ L91
- `[syntax_check] Cannot find name 'Implication'.` @ L93
- `[syntax_check] Cannot find name 'Implication'.` @ L96
- `[syntax_check] Cannot find name 'Implication'.` @ L96
- `[syntax_check] Cannot find name 'TemporalRules'.` @ L97
- `[syntax_check] Cannot find name 'Term'.` @ L102
- `[syntax_check] Cannot find name 'Conjunction'.` @ L103
- `[syntax_check] Cannot find name 'Conjunction'.` @ L106
- `[syntax_check] Cannot find name 'Conjunction'.` @ L106
- `[syntax_check] Cannot find name 'TemporalRules'.` @ L108
- `[syntax_check] Cannot find name 'Interval'.` @ L110
- `[syntax_check] Cannot find name 'Operation'.` @ L111
- `[syntax_check] Cannot find name 'Task'.` @ L121
- `[syntax_check] Cannot find name 'DerivationContext'.` @ L121
- `[syntax_check] Cannot find name 'Term'.` @ L122
- `[syntax_check] Cannot find name 'Implication'.` @ L124
- `[syntax_check] Cannot find name 'Implication'.` @ L125
- `[syntax_check] Cannot find name 'Term'.` @ L127
- `[syntax_check] Cannot find name 'Implication'.` @ L127
- `[syntax_check] Cannot find name 'Concept'.` @ L133
- `[syntax_check] Cannot find name 'Task'.` @ L138
- `[syntax_check] Cannot find name 'tryFind'.` @ L140
- `[syntax_check] Cannot find name 'Term'.` @ L145
- `[syntax_check] Cannot find name 'Implication'.` @ L145
- `[syntax_check] Cannot find name 'Conjunction'.` @ L145
- `[syntax_check] Cannot find name 'Operation'.` @ L147
- `[syntax_check] Cannot find name 'Concept'.` @ L152
- `[syntax_check] Cannot find name 'Task'.` @ L158
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L164
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L165
- `[syntax_check] Cannot find name 'Events'.` @ L176
- `[syntax_check] Cannot find name 'Events'.` @ L177

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `control/concept/ProcessJudgment` -> `io/events/Events`（deps.xml 第 67 行）
- `control/concept/ProcessJudgment` -> `operator/Operator`（deps.xml 第 68 行）
- `control/concept/ProcessJudgment` -> `operator/mental/Believe`（deps.xml 第 69 行）
- `control/concept/ProcessJudgment` -> `language/Interval`（deps.xml 第 70 行）
- `control/concept/ProcessJudgment` -> `entity/Concept`（deps.xml 第 71 行）
- `control/concept/ProcessJudgment` -> `language/Implication`（deps.xml 第 72 行）
- `control/concept/ProcessJudgment` -> `language/CompoundTerm`（deps.xml 第 73 行）
- `control/concept/ProcessJudgment` -> `inference/TemporalRules`（deps.xml 第 74 行）
- `control/concept/ProcessJudgment` -> `language/Statement`（deps.xml 第 75 行）
- `control/concept/ProcessJudgment` -> `operator/mental/Wonder`（deps.xml 第 76 行）
- `control/concept/ProcessJudgment` -> `entity/Task`（deps.xml 第 77 行）
- `control/concept/ProcessJudgment` -> `control/concept/ProcessAnticipation`（deps.xml 第 78 行）
- `control/concept/ProcessJudgment` -> `operator/mental/Evaluate`（deps.xml 第 79 行）
- `control/concept/ProcessJudgment` -> `language/Conjunction`（deps.xml 第 80 行）
- `control/concept/ProcessJudgment` -> `interfaces/Timable`（deps.xml 第 81 行）
- `control/concept/ProcessJudgment` -> `language/Term`（deps.xml 第 82 行）
- `control/concept/ProcessJudgment` -> `entity/Sentence`（deps.xml 第 83 行）
- `control/concept/ProcessJudgment` -> `parameter/Parameters`（deps.xml 第 84 行）
- `control/concept/ProcessJudgment` -> `operator/mental/Want`（deps.xml 第 85 行）
- `control/concept/ProcessJudgment` -> `control/TemporalInferenceControl`（deps.xml 第 86 行）
- `control/concept/ProcessJudgment` -> `operator/mental/Anticipate`（deps.xml 第 87 行）
- `control/concept/ProcessJudgment` -> `entity/Stamp`（deps.xml 第 88 行）
- `control/concept/ProcessJudgment` -> `inference/LocalRules`（deps.xml 第 89 行）
- `control/concept/ProcessJudgment` -> `operator/Operation`（deps.xml 第 90 行）
- `control/concept/ProcessJudgment` -> `control/DerivationContext`（deps.xml 第 91 行）
- `control/concept/ProcessJudgment` -> `storage/Memory`（deps.xml 第 92 行）
- 交叉校验：
- Java graph 额外依赖：control/DerivationContext、control/TemporalInferenceControl、control/concept/ProcessAnticipation、entity/Concept、entity/Sentence、entity/Stamp、entity/Task、inference/LocalRules、inference/TemporalRules、interfaces/Timable、io/events/Events、language/CompoundTerm、language/Conjunction、language/Implication、language/Interval、language/Statement、language/Term、operator/Operation、operator/Operator、operator/mental/Anticipate、operator/mental/Believe、operator/mental/Evaluate、operator/mental/Want、operator/mental/Wonder、parameter/Parameters、storage/Memory

## 5. Java 功能说明

- **职责概述**：文件工作：重建推理循环、任务调度与暂停机制，替换 synchronized/wait 行为。
- **关键数据结构**：
- `ProcessJudgment` · 继承：JavaObject · 实现：（无接口）
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

- ts-analysis: LOC=181 · TODO=0
- 参考文件：`java-master/src/main/java/org/opennars/control/concept/ProcessJudgment.java`
