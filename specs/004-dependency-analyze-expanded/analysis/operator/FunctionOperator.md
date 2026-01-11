# src/operator/FunctionOperator.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/operator/FunctionOperator.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/operator/FunctionOperator.java` |
| 模块链路 | `language 基座 -> entity -> operator 操作符层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/operator/FunctionOperator.ts --noEmit`）

- 执行的命令：`npx tsc src/operator/FunctionOperator.ts --noEmit`
- 关键输出：
  - TS2304（L12, C48）：[full_check] Cannot find name 'Operator'.
  - TS2304（L23, C41）：[full_check] Cannot find name 'Memory'.
  - TS2304（L23, C52）：[full_check] Cannot find name 'Term'.
  - TS2304（L23, C61）：[full_check] Cannot find name 'Term'.
  - TS2304（L29, C36）：[full_check] Cannot find name 'Term'.
  - TS2304（L34, C34）：[full_check] Cannot find name 'Operation'.
  - TS2304（L34, C51）：[full_check] Cannot find name 'Term'.
  - TS2304（L34, C62）：[full_check] Cannot find name 'Memory'.
  - TS2304（L34, C76）：[full_check] Cannot find name 'Timable'.
  - TS2304（L34, C101）：[full_check] Cannot find name 'Task'.
  - TS2304（L59, C16）：[full_check] Cannot find name 'Term'.
  - TS2304（L59, C35）：[full_check] Cannot find name 'Term'.
  - TS2304（L62, C16）：[full_check] Cannot find name 'Term'.
  - TS2322（L66, C13）：[full_check] Type 'null' is not assignable to type 'List<Task>'.
  - TS2304（L86, C40）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L88, C19）：[full_check] Cannot find name 'Operation'.
  - TS2304（L90, C16）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L90, C31）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L91, C13）：[full_check] Cannot find name 'Symbols'.
  - TS2304（L92, C17）：[full_check] Cannot find name 'TruthValue'.
  - TS2304（L93, C17）：[full_check] Cannot find name 'Stamp'.
  - TS2304（L94, C31）：[full_check] Cannot find name 'BudgetValue'.
  - TS2304（L94, C49）：[full_check] Cannot find name 'BudgetValue'.
  - TS2304（L96, C13）：[full_check] Cannot find name 'truthToQuality'.
  - TS2304（L97, C22）：[full_check] Cannot find name 'Task'.
  - TS2304（L97, C33）：[full_check] Cannot find name 'Task'.
  - TS2304（L97, C59）：[full_check] Cannot find name 'Task'.
  - TS2304（L98, C16）：[full_check] Cannot find name 'Lists'.
  - TS2304（L105, C22）：[full_check] Cannot find name 'Term'.
  - TS2304（L105, C31）：[full_check] Cannot find name 'Term'.
  - TS2304（L12, C48）：[syntax_check] Cannot find name 'Operator'.
  - TS2304（L23, C41）：[syntax_check] Cannot find name 'Memory'.
  - TS2304（L23, C52）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L23, C61）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L29, C36）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L34, C34）：[syntax_check] Cannot find name 'Operation'.
  - TS2304（L34, C51）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L34, C62）：[syntax_check] Cannot find name 'Memory'.
  - TS2304（L34, C76）：[syntax_check] Cannot find name 'Timable'.
  - TS2304（L34, C101）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L59, C16）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L59, C35）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L62, C16）：[syntax_check] Cannot find name 'Term'.
  - TS2322（L66, C13）：[syntax_check] Type 'null' is not assignable to type 'List<Task>'.
  - TS2304（L86, C40）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L88, C19）：[syntax_check] Cannot find name 'Operation'.
  - TS2304（L90, C16）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L90, C31）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L91, C13）：[syntax_check] Cannot find name 'Symbols'.
  - TS2304（L92, C17）：[syntax_check] Cannot find name 'TruthValue'.
  - TS2304（L93, C17）：[syntax_check] Cannot find name 'Stamp'.
  - TS2304（L94, C31）：[syntax_check] Cannot find name 'BudgetValue'.
  - TS2304（L94, C49）：[syntax_check] Cannot find name 'BudgetValue'.
  - TS2304（L96, C13）：[syntax_check] Cannot find name 'truthToQuality'.
  - TS2304（L97, C22）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L97, C33）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L97, C59）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L98, C16）：[syntax_check] Cannot find name 'Lists'.
  - TS2304（L105, C22）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L105, C31）：[syntax_check] Cannot find name 'Term'.
- 总结：存在语法错误，需要比对 Java 语句结构。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

（无显式结构性依赖，主要依赖 `jree` 提供的运行时桩或尚未补齐的全局声明。）

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

- `[full_check] Cannot find name 'Operator'.` @ L12
- `[full_check] Cannot find name 'Memory'.` @ L23
- `[full_check] Cannot find name 'Term'.` @ L23
- `[full_check] Cannot find name 'Term'.` @ L23
- `[full_check] Cannot find name 'Term'.` @ L29
- `[full_check] Cannot find name 'Operation'.` @ L34
- `[full_check] Cannot find name 'Term'.` @ L34
- `[full_check] Cannot find name 'Memory'.` @ L34
- `[full_check] Cannot find name 'Timable'.` @ L34
- `[full_check] Cannot find name 'Task'.` @ L34
- `[full_check] Cannot find name 'Term'.` @ L59
- `[full_check] Cannot find name 'Term'.` @ L59
- `[full_check] Cannot find name 'Term'.` @ L62
- `[full_check] Cannot find name 'CompoundTerm'.` @ L86
- `[full_check] Cannot find name 'Operation'.` @ L88
- `[full_check] Cannot find name 'Sentence'.` @ L90
- `[full_check] Cannot find name 'Sentence'.` @ L90
- `[full_check] Cannot find name 'Symbols'.` @ L91
- `[full_check] Cannot find name 'TruthValue'.` @ L92
- `[full_check] Cannot find name 'Stamp'.` @ L93
- `[full_check] Cannot find name 'BudgetValue'.` @ L94
- `[full_check] Cannot find name 'BudgetValue'.` @ L94
- `[full_check] Cannot find name 'truthToQuality'.` @ L96
- `[full_check] Cannot find name 'Task'.` @ L97
- `[full_check] Cannot find name 'Task'.` @ L97
- `[full_check] Cannot find name 'Task'.` @ L97
- `[full_check] Cannot find name 'Lists'.` @ L98
- `[full_check] Cannot find name 'Term'.` @ L105
- `[full_check] Cannot find name 'Term'.` @ L105
- `[syntax_check] Cannot find name 'Operator'.` @ L12
- `[syntax_check] Cannot find name 'Memory'.` @ L23
- `[syntax_check] Cannot find name 'Term'.` @ L23
- `[syntax_check] Cannot find name 'Term'.` @ L23
- `[syntax_check] Cannot find name 'Term'.` @ L29
- `[syntax_check] Cannot find name 'Operation'.` @ L34
- `[syntax_check] Cannot find name 'Term'.` @ L34
- `[syntax_check] Cannot find name 'Memory'.` @ L34
- `[syntax_check] Cannot find name 'Timable'.` @ L34
- `[syntax_check] Cannot find name 'Task'.` @ L34
- `[syntax_check] Cannot find name 'Term'.` @ L59
- `[syntax_check] Cannot find name 'Term'.` @ L59
- `[syntax_check] Cannot find name 'Term'.` @ L62
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L86
- `[syntax_check] Cannot find name 'Operation'.` @ L88
- `[syntax_check] Cannot find name 'Sentence'.` @ L90
- `[syntax_check] Cannot find name 'Sentence'.` @ L90
- `[syntax_check] Cannot find name 'Symbols'.` @ L91
- `[syntax_check] Cannot find name 'TruthValue'.` @ L92
- `[syntax_check] Cannot find name 'Stamp'.` @ L93
- `[syntax_check] Cannot find name 'BudgetValue'.` @ L94
- `[syntax_check] Cannot find name 'BudgetValue'.` @ L94
- `[syntax_check] Cannot find name 'truthToQuality'.` @ L96
- `[syntax_check] Cannot find name 'Task'.` @ L97
- `[syntax_check] Cannot find name 'Task'.` @ L97
- `[syntax_check] Cannot find name 'Task'.` @ L97
- `[syntax_check] Cannot find name 'Lists'.` @ L98
- `[syntax_check] Cannot find name 'Term'.` @ L105
- `[syntax_check] Cannot find name 'Term'.` @ L105

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `operator/FunctionOperator` -> `operator/Operator`（deps.xml 第 927 行）
- `operator/FunctionOperator` -> `entity/TruthValue`（deps.xml 第 928 行）
- `operator/FunctionOperator` -> `language/CompoundTerm`（deps.xml 第 929 行）
- `operator/FunctionOperator` -> `inference/BudgetFunctions`（deps.xml 第 930 行）
- `operator/FunctionOperator` -> `language/Statement`（deps.xml 第 931 行）
- `operator/FunctionOperator` -> `entity/Stamp`（deps.xml 第 932 行）
- `operator/FunctionOperator` -> `entity/Task`（deps.xml 第 933 行）
- `operator/FunctionOperator` -> `operator/Operation`（deps.xml 第 934 行）
- `operator/FunctionOperator` -> `entity/BudgetValue`（deps.xml 第 935 行）
- `operator/FunctionOperator` -> `interfaces/Timable`（deps.xml 第 936 行）
- `operator/FunctionOperator` -> `storage/Memory`（deps.xml 第 937 行）
- `operator/FunctionOperator` -> `language/Term`（deps.xml 第 938 行）
- `operator/FunctionOperator` -> `entity/Sentence`（deps.xml 第 939 行）
- `operator/FunctionOperator` -> `io/Symbols`（deps.xml 第 940 行）
- `operator/FunctionOperator` -> `parameter/Parameters`（deps.xml 第 941 行）
- 交叉校验：
- Java graph 额外依赖：entity/BudgetValue、entity/Sentence、entity/Stamp、entity/Task、entity/TruthValue、inference/BudgetFunctions、interfaces/Timable、io/Symbols、language/CompoundTerm、language/Statement、language/Term、operator/Operation、operator/Operator、parameter/Parameters、storage/Memory

## 5. Java 功能说明

- **职责概述**：文件工作：将 Operation 注册与 Memory 交互显式化，补写副作用与预算更新。；TODO 2 处
- **关键数据结构**：
- `FunctionOperator` · 继承：Operator · 实现：（无接口）
- **核心流程 / 算法**：
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：将 Operation 注册与 Memory 交互显式化，补写副作用与预算更新。；TODO 2 处
  3. Java-TS 差异：参见《通用转译法.md》 - 操作符
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `Java Memory/Task 接口` 衔接上下游。

## 6. 一致性风险

- 文件内仍保留 2 处 TODO，需对照 Java 填补。
- `tsc` 报错阻塞进一步分析，需要回填语句结构。
- 缺少显式 import，需依赖 Java/ts-analysis 交叉校验。

## 7. 路线图定位

- 1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
- 2. 文件工作：将 Operation 注册与 Memory 交互显式化，补写副作用与预算更新。；TODO 2 处
- 3. Java-TS 差异：参见《通用转译法.md》 - 操作符

## 8. 附加记录

- ts-analysis: LOC=109 · TODO=2
- 参考文件：`java-master/src/main/java/org/opennars/operator/FunctionOperator.java`
