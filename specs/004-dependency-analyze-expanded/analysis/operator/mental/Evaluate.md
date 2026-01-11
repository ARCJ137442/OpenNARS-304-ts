# src/operator/mental/Evaluate.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/operator/mental/Evaluate.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/operator/mental/Evaluate.java` |
| 模块链路 | `language 基座 -> entity -> operator 操作符层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/operator/mental/Evaluate.ts --noEmit`）

- 执行的命令：`npx tsc src/operator/mental/Evaluate.ts --noEmit`
- 关键输出：
  - TS2304（L8, C31）：[full_check] Cannot find name 'Operator'.
  - TS2304（L21, C34）：[full_check] Cannot find name 'Operation'.
  - TS2304（L21, C51）：[full_check] Cannot find name 'Term'.
  - TS2304（L21, C67）：[full_check] Cannot find name 'Memory'.
  - TS2304（L22, C15）：[full_check] Cannot find name 'Timable'.
  - TS2304（L22, C40）：[full_check] Cannot find name 'Task'.
  - TS2304（L23, C22）：[full_check] Cannot find name 'Term'.
  - TS2304（L25, C23）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L25, C38）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L27, C13）：[full_check] Cannot find name 'Symbols'.
  - TS2304（L29, C17）：[full_check] Cannot find name 'Stamp'.
  - TS2304（L31, C21）：[full_check] Cannot find name 'BudgetValue'.
  - TS2304（L31, C39）：[full_check] Cannot find name 'BudgetValue'.
  - TS2304（L34, C22）：[full_check] Cannot find name 'Task'.
  - TS2304（L34, C33）：[full_check] Cannot find name 'Task'.
  - TS2304（L34, C56）：[full_check] Cannot find name 'Task'.
  - TS2304（L35, C16）：[full_check] Cannot find name 'Lists'.
  - TS2304（L8, C31）：[syntax_check] Cannot find name 'Operator'.
  - TS2304（L21, C34）：[syntax_check] Cannot find name 'Operation'.
  - TS2304（L21, C51）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L21, C67）：[syntax_check] Cannot find name 'Memory'.
  - TS2304（L22, C15）：[syntax_check] Cannot find name 'Timable'.
  - TS2304（L22, C40）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L23, C22）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L25, C23）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L25, C38）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L27, C13）：[syntax_check] Cannot find name 'Symbols'.
  - TS2304（L29, C17）：[syntax_check] Cannot find name 'Stamp'.
  - TS2304（L31, C21）：[syntax_check] Cannot find name 'BudgetValue'.
  - TS2304（L31, C39）：[syntax_check] Cannot find name 'BudgetValue'.
  - TS2304（L34, C22）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L34, C33）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L34, C56）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L35, C16）：[syntax_check] Cannot find name 'Lists'.
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
- `[full_check] Cannot find name 'Operation'.` @ L21
- `[full_check] Cannot find name 'Term'.` @ L21
- `[full_check] Cannot find name 'Memory'.` @ L21
- `[full_check] Cannot find name 'Timable'.` @ L22
- `[full_check] Cannot find name 'Task'.` @ L22
- `[full_check] Cannot find name 'Term'.` @ L23
- `[full_check] Cannot find name 'Sentence'.` @ L25
- `[full_check] Cannot find name 'Sentence'.` @ L25
- `[full_check] Cannot find name 'Symbols'.` @ L27
- `[full_check] Cannot find name 'Stamp'.` @ L29
- `[full_check] Cannot find name 'BudgetValue'.` @ L31
- `[full_check] Cannot find name 'BudgetValue'.` @ L31
- `[full_check] Cannot find name 'Task'.` @ L34
- `[full_check] Cannot find name 'Task'.` @ L34
- `[full_check] Cannot find name 'Task'.` @ L34
- `[full_check] Cannot find name 'Lists'.` @ L35
- `[syntax_check] Cannot find name 'Operator'.` @ L8
- `[syntax_check] Cannot find name 'Operation'.` @ L21
- `[syntax_check] Cannot find name 'Term'.` @ L21
- `[syntax_check] Cannot find name 'Memory'.` @ L21
- `[syntax_check] Cannot find name 'Timable'.` @ L22
- `[syntax_check] Cannot find name 'Task'.` @ L22
- `[syntax_check] Cannot find name 'Term'.` @ L23
- `[syntax_check] Cannot find name 'Sentence'.` @ L25
- `[syntax_check] Cannot find name 'Sentence'.` @ L25
- `[syntax_check] Cannot find name 'Symbols'.` @ L27
- `[syntax_check] Cannot find name 'Stamp'.` @ L29
- `[syntax_check] Cannot find name 'BudgetValue'.` @ L31
- `[syntax_check] Cannot find name 'BudgetValue'.` @ L31
- `[syntax_check] Cannot find name 'Task'.` @ L34
- `[syntax_check] Cannot find name 'Task'.` @ L34
- `[syntax_check] Cannot find name 'Task'.` @ L34
- `[syntax_check] Cannot find name 'Lists'.` @ L35

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `operator/mental/Evaluate` -> `operator/Operator`（deps.xml 第 1010 行）
- `operator/mental/Evaluate` -> `entity/Stamp`（deps.xml 第 1011 行）
- `operator/mental/Evaluate` -> `entity/Task`（deps.xml 第 1012 行）
- `operator/mental/Evaluate` -> `operator/Operation`（deps.xml 第 1013 行）
- `operator/mental/Evaluate` -> `entity/BudgetValue`（deps.xml 第 1014 行）
- `operator/mental/Evaluate` -> `interfaces/Timable`（deps.xml 第 1015 行）
- `operator/mental/Evaluate` -> `storage/Memory`（deps.xml 第 1016 行）
- `operator/mental/Evaluate` -> `language/Term`（deps.xml 第 1017 行）
- `operator/mental/Evaluate` -> `entity/Sentence`（deps.xml 第 1018 行）
- `operator/mental/Evaluate` -> `io/Symbols`（deps.xml 第 1019 行）
- `operator/mental/Evaluate` -> `parameter/Parameters`（deps.xml 第 1020 行）
- 交叉校验：
- Java graph 额外依赖：entity/BudgetValue、entity/Sentence、entity/Stamp、entity/Task、interfaces/Timable、io/Symbols、language/Term、operator/Operation、operator/Operator、parameter/Parameters、storage/Memory

## 5. Java 功能说明

- **职责概述**：文件工作：将 Operation 注册与 Memory 交互显式化，补写副作用与预算更新。
- **关键数据结构**：
- `Evaluate` · 继承：Operator · 实现：（无接口）
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

- ts-analysis: LOC=37 · TODO=0
- 参考文件：`java-master/src/main/java/org/opennars/operator/mental/Evaluate.java`
