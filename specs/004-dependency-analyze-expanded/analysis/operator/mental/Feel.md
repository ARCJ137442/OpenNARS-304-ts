# src/operator/mental/Feel.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/operator/mental/Feel.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/operator/mental/Feel.java` |
| 模块链路 | `language 基座 -> entity -> operator 操作符层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/operator/mental/Feel.ts --noEmit`）

- 执行的命令：`npx tsc src/operator/mental/Feel.ts --noEmit`
- 关键输出：
  - TS2304（L8, C36）：[full_check] Cannot find name 'Operator'.
  - TS2304（L9, C35）：[full_check] Cannot find name 'Term'.
  - TS2304（L15, C28）：[full_check] Cannot find name 'Term'.
  - TS2349（L15, C38）：[full_check] This expression is not callable.
  - TS2339（L15, C79）：[full_check] Property 'toLowerCase' does not exist on type 'JavaString'.
  - TS2304（L18, C44）：[full_check] Cannot find name 'Term'.
  - TS2304（L18, C51）：[full_check] Cannot find name 'Term'.
  - TS2304（L27, C45）：[full_check] Cannot find name 'Memory'.
  - TS2304（L27, C59）：[full_check] Cannot find name 'Timable'.
  - TS2304（L27, C84）：[full_check] Cannot find name 'Task'.
  - TS2304（L28, C20）：[full_check] Cannot find name 'Stamp'.
  - TS2304（L28, C32）：[full_check] Cannot find name 'Stamp'.
  - TS2304（L28, C52）：[full_check] Cannot find name 'Tense'.
  - TS2304（L29, C20）：[full_check] Cannot find name 'TruthValue'.
  - TS2304（L29, C37）：[full_check] Cannot find name 'TruthValue'.
  - TS2304（L32, C24）：[full_check] Cannot find name 'Term'.
  - TS2304（L32, C35）：[full_check] Cannot find name 'SetInt'.
  - TS2304（L34, C22）：[full_check] Cannot find name 'Term'.
  - TS2304（L34, C29）：[full_check] Cannot find name 'Inheritance'.
  - TS2304（L35, C23）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L35, C38）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L37, C13）：[full_check] Cannot find name 'Symbols'.
  - TS2304（L41, C30）：[full_check] Cannot find name 'BudgetFunctions'.
  - TS2304（L42, C21）：[full_check] Cannot find name 'BudgetValue'.
  - TS2304（L42, C39）：[full_check] Cannot find name 'BudgetValue'.
  - TS2304（L45, C22）：[full_check] Cannot find name 'Task'.
  - TS2304（L45, C33）：[full_check] Cannot find name 'Task'.
  - TS2304（L45, C56）：[full_check] Cannot find name 'Task'.
  - TS2304（L46, C16）：[full_check] Cannot find name 'Lists'.
  - TS2304（L8, C36）：[syntax_check] Cannot find name 'Operator'.
  - TS2304（L9, C35）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L15, C28）：[syntax_check] Cannot find name 'Term'.
  - TS2349（L15, C38）：[syntax_check] This expression is not callable.
  - TS2339（L15, C79）：[syntax_check] Property 'toLowerCase' does not exist on type 'JavaString'.
  - TS2304（L18, C44）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L18, C51）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L27, C45）：[syntax_check] Cannot find name 'Memory'.
  - TS2304（L27, C59）：[syntax_check] Cannot find name 'Timable'.
  - TS2304（L27, C84）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L28, C20）：[syntax_check] Cannot find name 'Stamp'.
  - TS2304（L28, C32）：[syntax_check] Cannot find name 'Stamp'.
  - TS2304（L28, C52）：[syntax_check] Cannot find name 'Tense'.
  - TS2304（L29, C20）：[syntax_check] Cannot find name 'TruthValue'.
  - TS2304（L29, C37）：[syntax_check] Cannot find name 'TruthValue'.
  - TS2304（L32, C24）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L32, C35）：[syntax_check] Cannot find name 'SetInt'.
  - TS2304（L34, C22）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L34, C29）：[syntax_check] Cannot find name 'Inheritance'.
  - TS2304（L35, C23）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L35, C38）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L37, C13）：[syntax_check] Cannot find name 'Symbols'.
  - TS2304（L41, C30）：[syntax_check] Cannot find name 'BudgetFunctions'.
  - TS2304（L42, C21）：[syntax_check] Cannot find name 'BudgetValue'.
  - TS2304（L42, C39）：[syntax_check] Cannot find name 'BudgetValue'.
  - TS2304（L45, C22）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L45, C33）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L45, C56）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L46, C16）：[syntax_check] Cannot find name 'Lists'.
- 总结：存在语法错误，需要比对 Java 语句结构。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

（无显式结构性依赖，主要依赖 `jree` 提供的运行时桩或尚未补齐的全局声明。）

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

- `[full_check] Cannot find name 'Operator'.` @ L8
- `[full_check] Cannot find name 'Term'.` @ L9
- `[full_check] Cannot find name 'Term'.` @ L15
- `[full_check] Cannot find name 'Term'.` @ L18
- `[full_check] Cannot find name 'Term'.` @ L18
- `[full_check] Cannot find name 'Memory'.` @ L27
- `[full_check] Cannot find name 'Timable'.` @ L27
- `[full_check] Cannot find name 'Task'.` @ L27
- `[full_check] Cannot find name 'Stamp'.` @ L28
- `[full_check] Cannot find name 'Stamp'.` @ L28
- `[full_check] Cannot find name 'Tense'.` @ L28
- `[full_check] Cannot find name 'TruthValue'.` @ L29
- `[full_check] Cannot find name 'TruthValue'.` @ L29
- `[full_check] Cannot find name 'Term'.` @ L32
- `[full_check] Cannot find name 'SetInt'.` @ L32
- `[full_check] Cannot find name 'Term'.` @ L34
- `[full_check] Cannot find name 'Inheritance'.` @ L34
- `[full_check] Cannot find name 'Sentence'.` @ L35
- `[full_check] Cannot find name 'Sentence'.` @ L35
- `[full_check] Cannot find name 'Symbols'.` @ L37
- `[full_check] Cannot find name 'BudgetFunctions'.` @ L41
- `[full_check] Cannot find name 'BudgetValue'.` @ L42
- `[full_check] Cannot find name 'BudgetValue'.` @ L42
- `[full_check] Cannot find name 'Task'.` @ L45
- `[full_check] Cannot find name 'Task'.` @ L45
- `[full_check] Cannot find name 'Task'.` @ L45
- `[full_check] Cannot find name 'Lists'.` @ L46
- `[syntax_check] Cannot find name 'Operator'.` @ L8
- `[syntax_check] Cannot find name 'Term'.` @ L9
- `[syntax_check] Cannot find name 'Term'.` @ L15
- `[syntax_check] Cannot find name 'Term'.` @ L18
- `[syntax_check] Cannot find name 'Term'.` @ L18
- `[syntax_check] Cannot find name 'Memory'.` @ L27
- `[syntax_check] Cannot find name 'Timable'.` @ L27
- `[syntax_check] Cannot find name 'Task'.` @ L27
- `[syntax_check] Cannot find name 'Stamp'.` @ L28
- `[syntax_check] Cannot find name 'Stamp'.` @ L28
- `[syntax_check] Cannot find name 'Tense'.` @ L28
- `[syntax_check] Cannot find name 'TruthValue'.` @ L29
- `[syntax_check] Cannot find name 'TruthValue'.` @ L29
- `[syntax_check] Cannot find name 'Term'.` @ L32
- `[syntax_check] Cannot find name 'SetInt'.` @ L32
- `[syntax_check] Cannot find name 'Term'.` @ L34
- `[syntax_check] Cannot find name 'Inheritance'.` @ L34
- `[syntax_check] Cannot find name 'Sentence'.` @ L35
- `[syntax_check] Cannot find name 'Sentence'.` @ L35
- `[syntax_check] Cannot find name 'Symbols'.` @ L37
- `[syntax_check] Cannot find name 'BudgetFunctions'.` @ L41
- `[syntax_check] Cannot find name 'BudgetValue'.` @ L42
- `[syntax_check] Cannot find name 'BudgetValue'.` @ L42
- `[syntax_check] Cannot find name 'Task'.` @ L45
- `[syntax_check] Cannot find name 'Task'.` @ L45
- `[syntax_check] Cannot find name 'Task'.` @ L45
- `[syntax_check] Cannot find name 'Lists'.` @ L46

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `operator/mental/Feel` -> `operator/Operator`（deps.xml 第 1023 行）
- `operator/mental/Feel` -> `language/Inheritance`（deps.xml 第 1024 行）
- `operator/mental/Feel` -> `entity/TruthValue`（deps.xml 第 1025 行）
- `operator/mental/Feel` -> `inference/BudgetFunctions`（deps.xml 第 1026 行）
- `operator/mental/Feel` -> `entity/Stamp`（deps.xml 第 1027 行）
- `operator/mental/Feel` -> `entity/Task`（deps.xml 第 1028 行）
- `operator/mental/Feel` -> `entity/BudgetValue`（deps.xml 第 1029 行）
- `operator/mental/Feel` -> `language/SetInt`（deps.xml 第 1030 行）
- `operator/mental/Feel` -> `interfaces/Timable`（deps.xml 第 1031 行）
- `operator/mental/Feel` -> `storage/Memory`（deps.xml 第 1032 行）
- `operator/mental/Feel` -> `language/Term`（deps.xml 第 1033 行）
- `operator/mental/Feel` -> `language/Tense`（deps.xml 第 1034 行）
- `operator/mental/Feel` -> `entity/Sentence`（deps.xml 第 1035 行）
- `operator/mental/Feel` -> `io/Symbols`（deps.xml 第 1036 行）
- `operator/mental/Feel` -> `parameter/Parameters`（deps.xml 第 1037 行）
- 交叉校验：
- Java graph 额外依赖：entity/BudgetValue、entity/Sentence、entity/Stamp、entity/Task、entity/TruthValue、inference/BudgetFunctions、interfaces/Timable、io/Symbols、language/Inheritance、language/SetInt、language/Tense、language/Term、operator/Operator、parameter/Parameters、storage/Memory

## 5. Java 功能说明

- **职责概述**：文件工作：将 Operation 注册与 Memory 交互显式化，补写副作用与预算更新。
- **关键数据结构**：
- `Feel` · 继承：Operator · 实现：（无接口）
- **核心流程 / 算法**：
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：将 Operation 注册与 Memory 交互显式化，补写副作用与预算更新。
  3. Java-TS 差异：参见《通用转译法.md》 - 操作符
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `Java Memory/Task 接口` 衔接上下游。

## 6. 一致性风险

- `tsc` 报错阻塞进一步分析，需要回填语句结构。
- 缺少显式 import，需依赖 Java/ts-analysis 交叉校验。

## 7. 路线图定位

- 1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
- 2. 文件工作：将 Operation 注册与 Memory 交互显式化，补写副作用与预算更新。
- 3. Java-TS 差异：参见《通用转译法.md》 - 操作符

## 8. 附加记录

- ts-analysis: LOC=49 · TODO=0
- 参考文件：`java-master/src/main/java/org/opennars/operator/mental/Feel.java`
