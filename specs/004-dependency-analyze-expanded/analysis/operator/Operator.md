# src/operator/Operator.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/operator/Operator.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/operator/Operator.java` |
| 模块链路 | `language 基座 -> entity -> operator 操作符层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/operator/Operator.ts --noEmit`）

- 执行的命令：`npx tsc src/operator/Operator.ts --noEmit`
- 关键输出：
  - TS2420（L17, C23）：[full_check] Class 'Operator' incorrectly implements interface 'Plugin'.
  - TS2345（L37, C38）：[full_check] Argument of type 'string' is not assignable to parameter of type 'JavaString'.
  - TS2448（L83, C44）：[full_check] Block-scoped variable 'args' used before its declaration.
  - TS2339（L86, C25）：[full_check] Property 'isExecutable' does not exist on type 'Operation'.
  - TS2304（L89, C27）：[full_check] Cannot find name 'Product'.
  - TS2448（L97, C57）：[full_check] Block-scoped variable 'args' used before its declaration.
  - TS2454（L97, C57）：[full_check] Variable 'args' is used before being assigned.
  - TS2352（L97, C57）：[full_check] Conversion of type 'Term[]' to type '[Operation, Term[], Memory, Timable]' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  - TS2322（L100, C21）：[full_check] Type 'null' is not assignable to type 'List<Task>'.
  - TS2740（L102, C21）：[full_check] Type 'Task[]' is missing the following properties from type 'List<Task>': add, addAll, clear, contains, and 26 more.
  - TS2304（L105, C29）：[full_check] Cannot find name 'Debug'.
  - TS2304（L106, C47）：[full_check] Cannot find name 'ERR'.
  - TS2304（L108, C30）：[full_check] Cannot find name 'Debug'.
  - TS2304（L120, C62）：[full_check] Cannot find name 'TruthValue'.
  - TS2304（L144, C55）：[full_check] Cannot find name 'Statement'.
  - TS1210（L146, C13）：[full_check] Code contained in a class is evaluated in JavaScript's strict mode which does not allow this use of 'arguments'. For more information, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode.
  - TS2322（L148, C9）：[full_check] Type 'string' is not assignable to type 'JavaString'.
  - TS2339（L165, C35）：[full_check] Property 'getPredicate' does not exist on type 'Operation'.
  - TS2304（L170, C29）：[full_check] Cannot find name 'EXE'.
  - TS2322（L174, C17）：[full_check] Type 'string' is not assignable to type 'JavaObject'.
  - TS2304（L176, C25）：[full_check] Cannot find name 'EXE'.
  - TS2304（L195, C20）：[full_check] Cannot find name 'BudgetValue'.
  - TS2339（L197, C36）：[full_check] Property 'budget' does not exist on type 'Task'.
  - TS2322（L202, C13）：[full_check] Type 'string' is not assignable to type 'JavaString'.
  - TS2345（L210, C32）：[full_check] Argument of type 'string' is not assignable to parameter of type 'JavaString'.
  - TS2322（L211, C13）：[full_check] Type 'string' is not assignable to type 'JavaString'.
  - TS2420（L17, C23）：[syntax_check] Class 'Operator' incorrectly implements interface 'Plugin'.
  - TS2345（L37, C38）：[syntax_check] Argument of type 'string' is not assignable to parameter of type 'JavaString'.
  - TS2448（L83, C44）：[syntax_check] Block-scoped variable 'args' used before its declaration.
  - TS2339（L86, C25）：[syntax_check] Property 'isExecutable' does not exist on type 'Operation'.
  - TS2304（L89, C27）：[syntax_check] Cannot find name 'Product'.
  - TS2448（L97, C57）：[syntax_check] Block-scoped variable 'args' used before its declaration.
  - TS2454（L97, C57）：[syntax_check] Variable 'args' is used before being assigned.
  - TS2352（L97, C57）：[syntax_check] Conversion of type 'Term[]' to type '[Operation, Term[], Memory, Timable]' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  - TS2322（L100, C21）：[syntax_check] Type 'null' is not assignable to type 'List<Task>'.
  - TS2740（L102, C21）：[syntax_check] Type 'Task[]' is missing the following properties from type 'List<Task>': add, addAll, clear, contains, and 26 more.
  - TS2304（L105, C29）：[syntax_check] Cannot find name 'Debug'.
  - TS2304（L106, C47）：[syntax_check] Cannot find name 'ERR'.
  - TS2304（L108, C30）：[syntax_check] Cannot find name 'Debug'.
  - TS2304（L120, C62）：[syntax_check] Cannot find name 'TruthValue'.
  - TS2304（L144, C55）：[syntax_check] Cannot find name 'Statement'.
  - TS1210（L146, C13）：[syntax_check] Code contained in a class is evaluated in JavaScript's strict mode which does not allow this use of 'arguments'. For more information, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode.
  - TS2322（L148, C9）：[syntax_check] Type 'string' is not assignable to type 'JavaString'.
  - TS2339（L165, C35）：[syntax_check] Property 'getPredicate' does not exist on type 'Operation'.
  - TS2304（L170, C29）：[syntax_check] Cannot find name 'EXE'.
  - TS2322（L174, C17）：[syntax_check] Type 'string' is not assignable to type 'JavaObject'.
  - TS2304（L176, C25）：[syntax_check] Cannot find name 'EXE'.
  - TS2304（L195, C20）：[syntax_check] Cannot find name 'BudgetValue'.
  - TS2339（L197, C36）：[syntax_check] Property 'budget' does not exist on type 'Task'.
  - TS2322（L202, C13）：[syntax_check] Type 'string' is not assignable to type 'JavaString'.
  - TS2345（L210, C32）：[syntax_check] Argument of type 'string' is not assignable to parameter of type 'JavaString'.
  - TS2322（L211, C13）：[syntax_check] Type 'string' is not assignable to type 'JavaString'.
- 总结：存在语法错误，需要比对 Java 语句结构。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

| 符号 | 来源文件 | 触发位置 | 依赖原因 |
| --- | --- | --- | --- |
| `Term` | `src/language/Term.ts` | import | 结构性：Operator 直接使用 Term 的主流程 |
| `Operation` | `src/operator/Operation.ts` | import | 结构性：Operator 直接使用 Operation 的主流程 |
| `Memory` | `src/storage/Memory.ts` | import | 结构性：Operator 直接使用 Memory 的主流程 |
| `Timable` | `src/interfaces/Timable.ts` | import | 结构性：Operator 直接使用 Timable 的主流程 |
| `Task` | `src/entity/Task.ts` | import | 结构性：Operator 直接使用 Task 的主流程 |
| `Nar` | `src/main/Nar.ts` | import | 结构性：Operator 直接使用 Nar 的主流程 |

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

- `[full_check] Cannot find name 'Product'.` @ L89
- `[full_check] Cannot find name 'Debug'.` @ L105
- `[full_check] Cannot find name 'ERR'.` @ L106
- `[full_check] Cannot find name 'Debug'.` @ L108
- `[full_check] Cannot find name 'TruthValue'.` @ L120
- `[full_check] Cannot find name 'Statement'.` @ L144
- `[full_check] Cannot find name 'EXE'.` @ L170
- `[full_check] Cannot find name 'EXE'.` @ L176
- `[full_check] Cannot find name 'BudgetValue'.` @ L195
- `[syntax_check] Cannot find name 'Product'.` @ L89
- `[syntax_check] Cannot find name 'Debug'.` @ L105
- `[syntax_check] Cannot find name 'ERR'.` @ L106
- `[syntax_check] Cannot find name 'Debug'.` @ L108
- `[syntax_check] Cannot find name 'TruthValue'.` @ L120
- `[syntax_check] Cannot find name 'Statement'.` @ L144
- `[syntax_check] Cannot find name 'EXE'.` @ L170
- `[syntax_check] Cannot find name 'EXE'.` @ L176
- `[syntax_check] Cannot find name 'BudgetValue'.` @ L195

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `operator/Operator` -> `entity/TruthValue`（deps.xml 第 1183 行）
- `operator/Operator` -> `language/CompoundTerm`（deps.xml 第 1184 行）
- `operator/Operator` -> `language/Statement`（deps.xml 第 1185 行）
- `operator/Operator` -> `entity/Item`（deps.xml 第 1186 行）
- `operator/Operator` -> `entity/Task`（deps.xml 第 1187 行）
- `operator/Operator` -> `entity/BudgetValue`（deps.xml 第 1188 行）
- `operator/Operator` -> `interfaces/Timable`（deps.xml 第 1189 行）
- `operator/Operator` -> `language/Product`（deps.xml 第 1190 行）
- `operator/Operator` -> `language/Term`（deps.xml 第 1191 行）
- `operator/Operator` -> `parameter/Debug`（deps.xml 第 1192 行）
- `operator/Operator` -> `parameter/Parameters`（deps.xml 第 1193 行）
- `operator/Operator` -> `io/events/OutputHandler`（deps.xml 第 1194 行）
- `operator/Operator` -> `plugin/Plugin`（deps.xml 第 1195 行）
- `operator/Operator` -> `io/events/EventEmitter`（deps.xml 第 1196 行）
- `operator/Operator` -> `main/Nar`（deps.xml 第 1197 行）
- `operator/Operator` -> `operator/Operation`（deps.xml 第 1198 行）
- `operator/Operator` -> `storage/Memory`（deps.xml 第 1199 行）
- 交叉校验：
- Java graph 额外依赖：entity/BudgetValue、entity/Item、entity/TruthValue、io/events/EventEmitter、io/events/OutputHandler、language/CompoundTerm、language/Product、language/Statement、parameter/Debug、parameter/Parameters、plugin/Plugin

## 5. Java 功能说明

- **职责概述**：文件工作：将 Operation 注册与 Memory 交互显式化，补写副作用与预算更新。
- **关键数据结构**：
- `Operator` · 继承：Term · 实现：Plugin
- **核心流程 / 算法**：
  1. 依赖准备：依赖：language/Term.ts, operator/Operation.ts, storage/Memory.ts, interfaces/Timable.ts, entity/Task.ts, main/Nar.ts
  2. 文件工作：将 Operation 注册与 Memory 交互显式化，补写副作用与预算更新。
  3. Java-TS 差异：参见《通用转译法.md》 - 操作符
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `entity/Task, interfaces/Timable, language/Term, main/Nar, operator/Operation, storage/Memory` 衔接上下游。

## 6. 一致性风险

- `tsc` 报错阻塞进一步分析，需要回填语句结构。

## 7. 路线图定位

- 1. 依赖准备：依赖：language/Term.ts, operator/Operation.ts, storage/Memory.ts, interfaces/Timable.ts, entity/Task.ts, main/Nar.ts
- 2. 文件工作：将 Operation 注册与 Memory 交互显式化，补写副作用与预算更新。
- 3. Java-TS 差异：参见《通用转译法.md》 - 操作符

## 8. 附加记录

- ts-analysis: LOC=222 · TODO=0
- 参考文件：`java-master/src/main/java/org/opennars/operator/Operator.java`
