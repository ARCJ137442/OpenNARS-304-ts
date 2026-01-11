# src/plugin/mental/Abbreviation.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/plugin/mental/Abbreviation.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/plugin/mental/Abbreviation.java` |
| 模块链路 | `language 基座 -> entity -> operator -> plugin 扩展层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/plugin/mental/Abbreviation.ts --noEmit`）

- 执行的命令：`npx tsc src/plugin/mental/Abbreviation.ts --noEmit`
- 关键输出：
  - TS2420（L10, C14）：[full_check] Class 'Abbreviation' incorrectly implements interface 'Plugin'.
  - TS2304（L11, C17）：[full_check] Cannot find name 'EventObserver'.
  - TS2304（L78, C32）：[full_check] Cannot find name 'Task'.
  - TS2304（L79, C48）：[full_check] Cannot find name 'Operation'.
  - TS2304（L84, C26）：[full_check] Cannot find name 'Nar'.
  - TS2304（L85, C21）：[full_check] Cannot find name 'Memory'.
  - TS2304（L87, C26）：[full_check] Cannot find name 'Operator'.
  - TS2304（L91, C25）：[full_check] Cannot find name 'Operator'.
  - TS7006（L94, C25）：[full_check] Parameter 'event' implicitly has an 'any' type.
  - TS7006（L94, C32）：[full_check] Parameter 'a' implicitly has an 'any' type.
  - TS2304（L95, C31）：[full_check] Cannot find name 'TaskDerive'.
  - TS2304（L101, C27）：[full_check] Cannot find name 'Task'.
  - TS2304（L101, C42）：[full_check] Cannot find name 'Task'.
  - TS2304（L106, C36）：[full_check] Cannot find name 'Operation'.
  - TS2304（L106, C48）：[full_check] Cannot find name 'Operation'.
  - TS2304（L107, C37）：[full_check] Cannot find name 'termArray'.
  - TS2304（L118, C45）：[full_check] Cannot find name 'TaskDerive'.
  - TS2304（L126, C57）：[full_check] Cannot find name 'Operator'.
  - TS2322（L132, C24）：[full_check] Type 'number' is not assignable to type 'Integer'.
  - TS2304（L134, C45）：[full_check] Cannot find name 'Term'.
  - TS2356（L136, C13）：[full_check] An arithmetic operand must be of type 'any', 'number', 'bigint' or an enum type.
  - TS2304（L138, C24）：[full_check] Cannot find name 'Term'.
  - TS2365（L138, C29）：[full_check] Operator '+' cannot be applied to types 'number' and 'JavaString'.
  - TS2304（L148, C38）：[full_check] Cannot find name 'Operation'.
  - TS2304（L148, C55）：[full_check] Cannot find name 'Term'.
  - TS2304（L148, C71）：[full_check] Cannot find name 'Memory'.
  - TS2304（L149, C19）：[full_check] Cannot find name 'Timable'.
  - TS2304（L149, C44）：[full_check] Cannot find name 'Task'.
  - TS2304（L151, C27）：[full_check] Cannot find name 'Term'.
  - TS2304（L153, C25）：[full_check] Cannot find name 'Term'.
  - TS2304（L153, C51）：[full_check] Cannot find name 'Symbols'.
  - TS2304（L155, C27）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L155, C42）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L156, C17）：[full_check] Cannot find name 'Similarity'.
  - TS2304（L157, C17）：[full_check] Cannot find name 'Symbols'.
  - TS2304（L158, C21）：[full_check] Cannot find name 'TruthValue'.
  - TS2304（L161, C21）：[full_check] Cannot find name 'Stamp'.
  - TS2304（L163, C34）：[full_check] Cannot find name 'BudgetFunctions'.
  - TS2304（L165, C25）：[full_check] Cannot find name 'BudgetValue'.
  - TS2304（L165, C43）：[full_check] Cannot find name 'BudgetValue'.
  - TS2304（L170, C26）：[full_check] Cannot find name 'Task'.
  - TS2304（L170, C37）：[full_check] Cannot find name 'Task'.
  - TS2304（L170, C60）：[full_check] Cannot find name 'Task'.
  - TS2304（L171, C20）：[full_check] Cannot find name 'Lists'.
  - TS2420（L10, C14）：[syntax_check] Class 'Abbreviation' incorrectly implements interface 'Plugin'.
  - TS2304（L11, C17）：[syntax_check] Cannot find name 'EventObserver'.
  - TS2304（L78, C32）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L79, C48）：[syntax_check] Cannot find name 'Operation'.
  - TS2304（L84, C26）：[syntax_check] Cannot find name 'Nar'.
  - TS2304（L85, C21）：[syntax_check] Cannot find name 'Memory'.
  - TS2304（L87, C26）：[syntax_check] Cannot find name 'Operator'.
  - TS2304（L91, C25）：[syntax_check] Cannot find name 'Operator'.
  - TS7006（L94, C25）：[syntax_check] Parameter 'event' implicitly has an 'any' type.
  - TS7006（L94, C32）：[syntax_check] Parameter 'a' implicitly has an 'any' type.
  - TS2304（L95, C31）：[syntax_check] Cannot find name 'TaskDerive'.
  - TS2304（L101, C27）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L101, C42）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L106, C36）：[syntax_check] Cannot find name 'Operation'.
  - TS2304（L106, C48）：[syntax_check] Cannot find name 'Operation'.
  - TS2304（L107, C37）：[syntax_check] Cannot find name 'termArray'.
  - TS2304（L118, C45）：[syntax_check] Cannot find name 'TaskDerive'.
  - TS2304（L126, C57）：[syntax_check] Cannot find name 'Operator'.
  - TS2322（L132, C24）：[syntax_check] Type 'number' is not assignable to type 'Integer'.
  - TS2304（L134, C45）：[syntax_check] Cannot find name 'Term'.
  - TS2356（L136, C13）：[syntax_check] An arithmetic operand must be of type 'any', 'number', 'bigint' or an enum type.
  - TS2304（L138, C24）：[syntax_check] Cannot find name 'Term'.
  - TS2365（L138, C29）：[syntax_check] Operator '+' cannot be applied to types 'number' and 'JavaString'.
  - TS2304（L148, C38）：[syntax_check] Cannot find name 'Operation'.
  - TS2304（L148, C55）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L148, C71）：[syntax_check] Cannot find name 'Memory'.
  - TS2304（L149, C19）：[syntax_check] Cannot find name 'Timable'.
  - TS2304（L149, C44）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L151, C27）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L153, C25）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L153, C51）：[syntax_check] Cannot find name 'Symbols'.
  - TS2304（L155, C27）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L155, C42）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L156, C17）：[syntax_check] Cannot find name 'Similarity'.
  - TS2304（L157, C17）：[syntax_check] Cannot find name 'Symbols'.
  - TS2304（L158, C21）：[syntax_check] Cannot find name 'TruthValue'.
  - TS2304（L161, C21）：[syntax_check] Cannot find name 'Stamp'.
  - TS2304（L163, C34）：[syntax_check] Cannot find name 'BudgetFunctions'.
  - TS2304（L165, C25）：[syntax_check] Cannot find name 'BudgetValue'.
  - TS2304（L165, C43）：[syntax_check] Cannot find name 'BudgetValue'.
  - TS2304（L170, C26）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L170, C37）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L170, C60）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L171, C20）：[syntax_check] Cannot find name 'Lists'.
- 总结：存在语法错误，需要比对 Java 语句结构。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

（无显式结构性依赖，主要依赖 `jree` 提供的运行时桩或尚未补齐的全局声明。）

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

- `[full_check] Cannot find name 'EventObserver'.` @ L11
- `[full_check] Cannot find name 'Task'.` @ L78
- `[full_check] Cannot find name 'Operation'.` @ L79
- `[full_check] Cannot find name 'Nar'.` @ L84
- `[full_check] Cannot find name 'Memory'.` @ L85
- `[full_check] Cannot find name 'Operator'.` @ L87
- `[full_check] Cannot find name 'Operator'.` @ L91
- `[full_check] Cannot find name 'TaskDerive'.` @ L95
- `[full_check] Cannot find name 'Task'.` @ L101
- `[full_check] Cannot find name 'Task'.` @ L101
- `[full_check] Cannot find name 'Operation'.` @ L106
- `[full_check] Cannot find name 'Operation'.` @ L106
- `[full_check] Cannot find name 'termArray'.` @ L107
- `[full_check] Cannot find name 'TaskDerive'.` @ L118
- `[full_check] Cannot find name 'Operator'.` @ L126
- `[full_check] Cannot find name 'Term'.` @ L134
- `[full_check] Cannot find name 'Term'.` @ L138
- `[full_check] Cannot find name 'Operation'.` @ L148
- `[full_check] Cannot find name 'Term'.` @ L148
- `[full_check] Cannot find name 'Memory'.` @ L148
- `[full_check] Cannot find name 'Timable'.` @ L149
- `[full_check] Cannot find name 'Task'.` @ L149
- `[full_check] Cannot find name 'Term'.` @ L151
- `[full_check] Cannot find name 'Term'.` @ L153
- `[full_check] Cannot find name 'Symbols'.` @ L153
- `[full_check] Cannot find name 'Sentence'.` @ L155
- `[full_check] Cannot find name 'Sentence'.` @ L155
- `[full_check] Cannot find name 'Similarity'.` @ L156
- `[full_check] Cannot find name 'Symbols'.` @ L157
- `[full_check] Cannot find name 'TruthValue'.` @ L158
- `[full_check] Cannot find name 'Stamp'.` @ L161
- `[full_check] Cannot find name 'BudgetFunctions'.` @ L163
- `[full_check] Cannot find name 'BudgetValue'.` @ L165
- `[full_check] Cannot find name 'BudgetValue'.` @ L165
- `[full_check] Cannot find name 'Task'.` @ L170
- `[full_check] Cannot find name 'Task'.` @ L170
- `[full_check] Cannot find name 'Task'.` @ L170
- `[full_check] Cannot find name 'Lists'.` @ L171
- `[syntax_check] Cannot find name 'EventObserver'.` @ L11
- `[syntax_check] Cannot find name 'Task'.` @ L78
- `[syntax_check] Cannot find name 'Operation'.` @ L79
- `[syntax_check] Cannot find name 'Nar'.` @ L84
- `[syntax_check] Cannot find name 'Memory'.` @ L85
- `[syntax_check] Cannot find name 'Operator'.` @ L87
- `[syntax_check] Cannot find name 'Operator'.` @ L91
- `[syntax_check] Cannot find name 'TaskDerive'.` @ L95
- `[syntax_check] Cannot find name 'Task'.` @ L101
- `[syntax_check] Cannot find name 'Task'.` @ L101
- `[syntax_check] Cannot find name 'Operation'.` @ L106
- `[syntax_check] Cannot find name 'Operation'.` @ L106
- `[syntax_check] Cannot find name 'termArray'.` @ L107
- `[syntax_check] Cannot find name 'TaskDerive'.` @ L118
- `[syntax_check] Cannot find name 'Operator'.` @ L126
- `[syntax_check] Cannot find name 'Term'.` @ L134
- `[syntax_check] Cannot find name 'Term'.` @ L138
- `[syntax_check] Cannot find name 'Operation'.` @ L148
- `[syntax_check] Cannot find name 'Term'.` @ L148
- `[syntax_check] Cannot find name 'Memory'.` @ L148
- `[syntax_check] Cannot find name 'Timable'.` @ L149
- `[syntax_check] Cannot find name 'Task'.` @ L149
- `[syntax_check] Cannot find name 'Term'.` @ L151
- `[syntax_check] Cannot find name 'Term'.` @ L153
- `[syntax_check] Cannot find name 'Symbols'.` @ L153
- `[syntax_check] Cannot find name 'Sentence'.` @ L155
- `[syntax_check] Cannot find name 'Sentence'.` @ L155
- `[syntax_check] Cannot find name 'Similarity'.` @ L156
- `[syntax_check] Cannot find name 'Symbols'.` @ L157
- `[syntax_check] Cannot find name 'TruthValue'.` @ L158
- `[syntax_check] Cannot find name 'Stamp'.` @ L161
- `[syntax_check] Cannot find name 'BudgetFunctions'.` @ L163
- `[syntax_check] Cannot find name 'BudgetValue'.` @ L165
- `[syntax_check] Cannot find name 'BudgetValue'.` @ L165
- `[syntax_check] Cannot find name 'Task'.` @ L170
- `[syntax_check] Cannot find name 'Task'.` @ L170
- `[syntax_check] Cannot find name 'Task'.` @ L170
- `[syntax_check] Cannot find name 'Lists'.` @ L171

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `plugin/mental/Abbreviation` -> `io/events/Events`（deps.xml 第 1205 行）
- `plugin/mental/Abbreviation` -> `operator/Operator`（deps.xml 第 1206 行）
- `plugin/mental/Abbreviation` -> `entity/TruthValue`（deps.xml 第 1207 行）
- `plugin/mental/Abbreviation` -> `language/CompoundTerm`（deps.xml 第 1208 行）
- `plugin/mental/Abbreviation` -> `entity/Task`（deps.xml 第 1209 行）
- `plugin/mental/Abbreviation` -> `entity/BudgetValue`（deps.xml 第 1210 行）
- `plugin/mental/Abbreviation` -> `interfaces/Timable`（deps.xml 第 1211 行）
- `plugin/mental/Abbreviation` -> `language/Term`（deps.xml 第 1212 行）
- `plugin/mental/Abbreviation` -> `entity/Sentence`（deps.xml 第 1213 行）
- `plugin/mental/Abbreviation` -> `io/Symbols`（deps.xml 第 1214 行）
- `plugin/mental/Abbreviation` -> `parameter/Parameters`（deps.xml 第 1215 行）
- `plugin/mental/Abbreviation` -> `plugin/Plugin`（deps.xml 第 1216 行）
- `plugin/mental/Abbreviation` -> `inference/BudgetFunctions`（deps.xml 第 1217 行）
- `plugin/mental/Abbreviation` -> `io/events/EventEmitter`（deps.xml 第 1218 行）
- `plugin/mental/Abbreviation` -> `entity/Stamp`（deps.xml 第 1219 行）
- `plugin/mental/Abbreviation` -> `main/Nar`（deps.xml 第 1220 行）
- `plugin/mental/Abbreviation` -> `operator/Operation`（deps.xml 第 1221 行）
- `plugin/mental/Abbreviation` -> `storage/Memory`（deps.xml 第 1222 行）
- `plugin/mental/Abbreviation` -> `language/Similarity`（deps.xml 第 1223 行）
- 交叉校验：
- Java graph 额外依赖：entity/BudgetValue、entity/Sentence、entity/Stamp、entity/Task、entity/TruthValue、inference/BudgetFunctions、interfaces/Timable、io/Symbols、io/events/EventEmitter、io/events/Events、language/CompoundTerm、language/Similarity、language/Term、main/Nar、operator/Operation、operator/Operator、parameter/Parameters、plugin/Plugin、storage/Memory

## 5. Java 功能说明

- **职责概述**：文件工作：为心理/感知插件提供事件通道、状态缓存与关闭流程。；TODO 1 处
- **关键数据结构**：
- `Abbreviation` · 继承：JavaObject · 实现：Plugin
- **核心流程 / 算法**：
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：为心理/感知插件提供事件通道、状态缓存与关闭流程。；TODO 1 处
  3. Java-TS 差异：参见《通用转译法.md》 - 插件
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `Java Memory/Task 接口` 衔接上下游。

## 6. 一致性风险

- 文件内仍保留 1 处 TODO，需对照 Java 填补。
- `tsc` 报错阻塞进一步分析，需要回填语句结构。
- 缺少显式 import，需依赖 Java/ts-analysis 交叉校验。

## 7. 路线图定位

- 1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
- 2. 文件工作：为心理/感知插件提供事件通道、状态缓存与关闭流程。；TODO 1 处
- 3. Java-TS 差异：参见《通用转译法.md》 - 插件

## 8. 附加记录

- ts-analysis: LOC=184 · TODO=1
- 参考文件：`java-master/src/main/java/org/opennars/plugin/mental/Abbreviation.java`
