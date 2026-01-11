# src/entity/TaskLink.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/entity/TaskLink.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/entity/TaskLink.java` |
| 模块链路 | `language 基座 -> entity 实体层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/entity/TaskLink.ts --noEmit`）

- 执行的命令：`npx tsc src/entity/TaskLink.ts --noEmit`
- 关键输出：
  - TS2304（L16, C31）：[full_check] Cannot find name 'Item'.
  - TS2304（L16, C36）：[full_check] Cannot find name 'Task'.
  - TS2304（L16, C53）：[full_check] Cannot find name 'TLink'.
  - TS2304（L16, C59）：[full_check] Cannot find name 'Task'.
  - TS2304（L21, C33）：[full_check] Cannot find name 'Task'.
  - TS2304（L33, C31）：[full_check] Cannot find name 'TermLink'.
  - TS2304（L36, C34）：[full_check] Cannot find name 'TermLink'.
  - TS2304（L74, C27）：[full_check] Cannot find name 'Task'.
  - TS2304（L74, C43）：[full_check] Cannot find name 'TermLink'.
  - TS2304（L74, C56）：[full_check] Cannot find name 'BudgetValue'.
  - TS2304（L76, C41）：[full_check] Cannot find name 'TermLink'.
  - TS2322（L83, C9）：[full_check] Type 'ArrayDeque<unknown>' is not assignable to type 'Deque<Recording>'.
  - TS2304（L91, C20）：[full_check] Cannot find name 'Task'.
  - TS2367（L96, C13）：[full_check] This comparison appears to be unintentional because the types 'JavaObject' and 'this' have no overlap.
  - TS2304（L129, C28）：[full_check] Cannot find name 'TermLink'.
  - TS2314（L129, C72）：[full_check] Generic type 'Parameters' requires 1 type argument(s).
  - TS2304（L131, C28）：[full_check] Cannot find name 'TermLink'.
  - TS2314（L131, C72）：[full_check] Generic type 'Parameters' requires 1 type argument(s).
  - TS2304（L136, C73）：[full_check] Cannot find name 'TermLink'.
  - TS2314（L136, C89）：[full_check] Generic type 'Parameters' requires 1 type argument(s).
  - TS2304（L146, C88）：[full_check] Cannot find name 'TermLink'.
  - TS2314（L146, C104）：[full_check] Generic type 'Parameters' requires 1 type argument(s).
  - TS2304（L149, C28）：[full_check] Cannot find name 'Term'.
  - TS2304（L153, C30）：[full_check] Cannot find name 'TermLink'.
  - TS2554（L175, C34）：[full_check] Expected 1 arguments, but got 0.
  - TS2322（L192, C9）：[full_check] Type 'string' is not assignable to type 'JavaString'.
  - TS2304（L204, C25）：[full_check] Cannot find name 'Task'.
  - TS2304（L208, C23）：[full_check] Cannot find name 'Term'.
  - TS2304（L16, C31）：[syntax_check] Cannot find name 'Item'.
  - TS2304（L16, C36）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L16, C53）：[syntax_check] Cannot find name 'TLink'.
  - TS2304（L16, C59）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L21, C33）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L33, C31）：[syntax_check] Cannot find name 'TermLink'.
  - TS2304（L36, C34）：[syntax_check] Cannot find name 'TermLink'.
  - TS2304（L74, C27）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L74, C43）：[syntax_check] Cannot find name 'TermLink'.
  - TS2304（L74, C56）：[syntax_check] Cannot find name 'BudgetValue'.
  - TS2304（L76, C41）：[syntax_check] Cannot find name 'TermLink'.
  - TS2322（L83, C9）：[syntax_check] Type 'ArrayDeque<unknown>' is not assignable to type 'Deque<Recording>'.
  - TS2304（L91, C20）：[syntax_check] Cannot find name 'Task'.
  - TS2367（L96, C13）：[syntax_check] This comparison appears to be unintentional because the types 'JavaObject' and 'this' have no overlap.
  - TS2304（L129, C28）：[syntax_check] Cannot find name 'TermLink'.
  - TS2314（L129, C72）：[syntax_check] Generic type 'Parameters' requires 1 type argument(s).
  - TS2304（L131, C28）：[syntax_check] Cannot find name 'TermLink'.
  - TS2314（L131, C72）：[syntax_check] Generic type 'Parameters' requires 1 type argument(s).
  - TS2304（L136, C73）：[syntax_check] Cannot find name 'TermLink'.
  - TS2314（L136, C89）：[syntax_check] Generic type 'Parameters' requires 1 type argument(s).
  - TS2304（L146, C88）：[syntax_check] Cannot find name 'TermLink'.
  - TS2314（L146, C104）：[syntax_check] Generic type 'Parameters' requires 1 type argument(s).
  - TS2304（L149, C28）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L153, C30）：[syntax_check] Cannot find name 'TermLink'.
  - TS2554（L175, C34）：[syntax_check] Expected 1 arguments, but got 0.
  - TS2322（L192, C9）：[syntax_check] Type 'string' is not assignable to type 'JavaString'.
  - TS2304（L204, C25）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L208, C23）：[syntax_check] Cannot find name 'Term'.
- 总结：存在语法错误，需要比对 Java 语句结构。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

（无显式结构性依赖，主要依赖 `jree` 提供的运行时桩或尚未补齐的全局声明。）

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

- `[full_check] Cannot find name 'Item'.` @ L16
- `[full_check] Cannot find name 'Task'.` @ L16
- `[full_check] Cannot find name 'TLink'.` @ L16
- `[full_check] Cannot find name 'Task'.` @ L16
- `[full_check] Cannot find name 'Task'.` @ L21
- `[full_check] Cannot find name 'TermLink'.` @ L33
- `[full_check] Cannot find name 'TermLink'.` @ L36
- `[full_check] Cannot find name 'Task'.` @ L74
- `[full_check] Cannot find name 'TermLink'.` @ L74
- `[full_check] Cannot find name 'BudgetValue'.` @ L74
- `[full_check] Cannot find name 'TermLink'.` @ L76
- `[full_check] Cannot find name 'Task'.` @ L91
- `[full_check] Cannot find name 'TermLink'.` @ L129
- `[full_check] Cannot find name 'TermLink'.` @ L131
- `[full_check] Cannot find name 'TermLink'.` @ L136
- `[full_check] Cannot find name 'TermLink'.` @ L146
- `[full_check] Cannot find name 'Term'.` @ L149
- `[full_check] Cannot find name 'TermLink'.` @ L153
- `[full_check] Cannot find name 'Task'.` @ L204
- `[full_check] Cannot find name 'Term'.` @ L208
- `[syntax_check] Cannot find name 'Item'.` @ L16
- `[syntax_check] Cannot find name 'Task'.` @ L16
- `[syntax_check] Cannot find name 'TLink'.` @ L16
- `[syntax_check] Cannot find name 'Task'.` @ L16
- `[syntax_check] Cannot find name 'Task'.` @ L21
- `[syntax_check] Cannot find name 'TermLink'.` @ L33
- `[syntax_check] Cannot find name 'TermLink'.` @ L36
- `[syntax_check] Cannot find name 'Task'.` @ L74
- `[syntax_check] Cannot find name 'TermLink'.` @ L74
- `[syntax_check] Cannot find name 'BudgetValue'.` @ L74
- `[syntax_check] Cannot find name 'TermLink'.` @ L76
- `[syntax_check] Cannot find name 'Task'.` @ L91
- `[syntax_check] Cannot find name 'TermLink'.` @ L129
- `[syntax_check] Cannot find name 'TermLink'.` @ L131
- `[syntax_check] Cannot find name 'TermLink'.` @ L136
- `[syntax_check] Cannot find name 'TermLink'.` @ L146
- `[syntax_check] Cannot find name 'Term'.` @ L149
- `[syntax_check] Cannot find name 'TermLink'.` @ L153
- `[syntax_check] Cannot find name 'Task'.` @ L204
- `[syntax_check] Cannot find name 'Term'.` @ L208

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `entity/TaskLink` -> `entity/TLink`（deps.xml 第 266 行）
- `entity/TaskLink` -> `entity/Item`（deps.xml 第 267 行）
- `entity/TaskLink` -> `entity/Task`（deps.xml 第 268 行）
- `entity/TaskLink` -> `entity/BudgetValue`（deps.xml 第 269 行）
- `entity/TaskLink` -> `entity/TermLink`（deps.xml 第 270 行）
- `entity/TaskLink` -> `language/Term`（deps.xml 第 271 行）
- `entity/TaskLink` -> `entity/Sentence`（deps.xml 第 272 行）
- `entity/TaskLink` -> `parameter/Parameters`（deps.xml 第 273 行）
- 交叉校验：
- Java graph 额外依赖：entity/BudgetValue、entity/Item、entity/Sentence、entity/TLink、entity/Task、entity/TermLink、language/Term、parameter/Parameters

## 5. Java 功能说明

- **职责概述**：文件工作：保持 Stamp/TruthValue 等值对象的不可变语义，补齐 clone/equals/hash 与序列化。
- **关键数据结构**：
- `TaskLink` · 继承：Item<Task> · 实现：TLink<Task>
- **核心流程 / 算法**：
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：保持 Stamp/TruthValue 等值对象的不可变语义，补齐 clone/equals/hash 与序列化。
  3. Java-TS 差异：参见《通用转译法.md》 - 实体与序列化
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `Java Memory/Task 接口` 衔接上下游。

## 6. 一致性风险

- `tsc` 报错阻塞进一步分析，需要回填语句结构。
- 缺少显式 import，需依赖 Java/ts-analysis 交叉校验。

## 7. 路线图定位

- 1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
- 2. 文件工作：保持 Stamp/TruthValue 等值对象的不可变语义，补齐 clone/equals/hash 与序列化。
- 3. Java-TS 差异：参见《通用转译法.md》 - 实体与序列化

## 8. 附加记录

- ts-analysis: LOC=218 · TODO=0
- 参考文件：`java-master/src/main/java/org/opennars/entity/TaskLink.java`
