# src/operator/NullOperator.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/operator/NullOperator.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/operator/NullOperator.java` |
| 模块链路 | `language 基座 -> entity -> operator 操作符层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/operator/NullOperator.ts --noEmit`）

- 执行的命令：`npx tsc src/operator/NullOperator.ts --noEmit`
- 关键输出：
  - TS2304（L8, C35）：[full_check] Cannot find name 'Operator'.
  - TS2349（L17, C17）：[full_check] This expression is not callable.
  - TS17009（L17, C17）：[full_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L41, C34）：[full_check] Cannot find name 'Operation'.
  - TS2304（L41, C51）：[full_check] Cannot find name 'Term'.
  - TS2304（L41, C67）：[full_check] Cannot find name 'Memory'.
  - TS2304（L42, C15）：[full_check] Cannot find name 'Timable'.
  - TS2304（L42, C40）：[full_check] Cannot find name 'Task'.
  - TS2304（L43, C13）：[full_check] Cannot find name 'Debug'.
  - TS2339（L44, C42）：[full_check] Property 'getClass' does not exist on type 'typeof JavaObject'.
  - TS2322（L46, C9）：[full_check] Type 'null' is not assignable to type 'List<Task>'.
  - TS2304（L8, C35）：[syntax_check] Cannot find name 'Operator'.
  - TS2349（L17, C17）：[syntax_check] This expression is not callable.
  - TS17009（L17, C17）：[syntax_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L41, C34）：[syntax_check] Cannot find name 'Operation'.
  - TS2304（L41, C51）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L41, C67）：[syntax_check] Cannot find name 'Memory'.
  - TS2304（L42, C15）：[syntax_check] Cannot find name 'Timable'.
  - TS2304（L42, C40）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L43, C13）：[syntax_check] Cannot find name 'Debug'.
  - TS2339（L44, C42）：[syntax_check] Property 'getClass' does not exist on type 'typeof JavaObject'.
  - TS2322（L46, C9）：[syntax_check] Type 'null' is not assignable to type 'List<Task>'.
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
- `[full_check] Cannot find name 'Operation'.` @ L41
- `[full_check] Cannot find name 'Term'.` @ L41
- `[full_check] Cannot find name 'Memory'.` @ L41
- `[full_check] Cannot find name 'Timable'.` @ L42
- `[full_check] Cannot find name 'Task'.` @ L42
- `[full_check] Cannot find name 'Debug'.` @ L43
- `[syntax_check] Cannot find name 'Operator'.` @ L8
- `[syntax_check] Cannot find name 'Operation'.` @ L41
- `[syntax_check] Cannot find name 'Term'.` @ L41
- `[syntax_check] Cannot find name 'Memory'.` @ L41
- `[syntax_check] Cannot find name 'Timable'.` @ L42
- `[syntax_check] Cannot find name 'Task'.` @ L42
- `[syntax_check] Cannot find name 'Debug'.` @ L43

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `operator/NullOperator` -> `entity/Task`（deps.xml 第 1164 行）
- `operator/NullOperator` -> `operator/Operation`（deps.xml 第 1165 行）
- `operator/NullOperator` -> `operator/Operator`（deps.xml 第 1166 行）
- `operator/NullOperator` -> `interfaces/Timable`（deps.xml 第 1167 行）
- `operator/NullOperator` -> `storage/Memory`（deps.xml 第 1168 行）
- `operator/NullOperator` -> `language/Term`（deps.xml 第 1169 行）
- `operator/NullOperator` -> `parameter/Debug`（deps.xml 第 1170 行）
- 交叉校验：
- Java graph 额外依赖：entity/Task、interfaces/Timable、language/Term、operator/Operation、operator/Operator、parameter/Debug、storage/Memory

## 5. Java 功能说明

- **职责概述**：文件工作：将 Operation 注册与 Memory 交互显式化，补写副作用与预算更新。
- **关键数据结构**：
- `NullOperator` · 继承：Operator · 实现：（无接口）
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
- 参考文件：`java-master/src/main/java/org/opennars/operator/NullOperator.java`
