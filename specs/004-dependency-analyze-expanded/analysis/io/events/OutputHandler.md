# src/io/events/OutputHandler.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/io/events/OutputHandler.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/io/events/OutputHandler.java` |
| 模块链路 | `language 基座 -> entity -> io I/O 层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/io/events/OutputHandler.ts --noEmit`）

- 执行的命令：`npx tsc src/io/events/OutputHandler.ts --noEmit`
- 关键输出：
  - TS2304（L10, C45）：[full_check] Cannot find name 'EventHandler'.
  - TS2304（L24, C79）：[full_check] Cannot find name 'IN'.
  - TS2304（L24, C89）：[full_check] Cannot find name 'EXE'.
  - TS2304（L24, C100）：[full_check] Cannot find name 'OUT'.
  - TS2304（L24, C111）：[full_check] Cannot find name 'ERR'.
  - TS2304（L25, C5）：[full_check] Cannot find name 'ECHO'.
  - TS2304（L25, C17）：[full_check] Cannot find name 'Answer'.
  - TS2304（L25, C124）：[full_check] Cannot find name 'DEBUG'.
  - TS2304（L27, C27）：[full_check] Cannot find name 'Nar'.
  - TS2304（L29, C32）：[full_check] Cannot find name 'EventEmitter'.
  - TS2304（L31, C27）：[full_check] Cannot find name 'Memory'.
  - TS2304（L33, C27）：[full_check] Cannot find name 'Nar'.
  - TS2304（L37, C38）：[full_check] Cannot find name 'Nar'.
  - TS2349（L40, C17）：[full_check] This expression is not callable.
  - TS17009（L40, C17）：[full_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L47, C51）：[full_check] Cannot find name 'EventEmitter'.
  - TS2304（L57, C46）：[full_check] Cannot find name 'Memory'.
  - TS2349（L60, C17）：[full_check] This expression is not callable.
  - TS17009（L60, C17）：[full_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L67, C46）：[full_check] Cannot find name 'Nar'.
  - TS2349（L70, C17）：[full_check] This expression is not callable.
  - TS17009（L70, C17）：[full_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L10, C45）：[syntax_check] Cannot find name 'EventHandler'.
  - TS2304（L24, C79）：[syntax_check] Cannot find name 'IN'.
  - TS2304（L24, C89）：[syntax_check] Cannot find name 'EXE'.
  - TS2304（L24, C100）：[syntax_check] Cannot find name 'OUT'.
  - TS2304（L24, C111）：[syntax_check] Cannot find name 'ERR'.
  - TS2304（L25, C5）：[syntax_check] Cannot find name 'ECHO'.
  - TS2304（L25, C17）：[syntax_check] Cannot find name 'Answer'.
  - TS2304（L25, C124）：[syntax_check] Cannot find name 'DEBUG'.
  - TS2304（L27, C27）：[syntax_check] Cannot find name 'Nar'.
  - TS2304（L29, C32）：[syntax_check] Cannot find name 'EventEmitter'.
  - TS2304（L31, C27）：[syntax_check] Cannot find name 'Memory'.
  - TS2304（L33, C27）：[syntax_check] Cannot find name 'Nar'.
  - TS2304（L37, C38）：[syntax_check] Cannot find name 'Nar'.
  - TS2349（L40, C17）：[syntax_check] This expression is not callable.
  - TS17009（L40, C17）：[syntax_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L47, C51）：[syntax_check] Cannot find name 'EventEmitter'.
  - TS2304（L57, C46）：[syntax_check] Cannot find name 'Memory'.
  - TS2349（L60, C17）：[syntax_check] This expression is not callable.
  - TS17009（L60, C17）：[syntax_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L67, C46）：[syntax_check] Cannot find name 'Nar'.
  - TS2349（L70, C17）：[syntax_check] This expression is not callable.
  - TS17009（L70, C17）：[syntax_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
- 总结：存在语法错误，需要比对 Java 语句结构。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

（无显式结构性依赖，主要依赖 `jree` 提供的运行时桩或尚未补齐的全局声明。）

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

- `[full_check] Cannot find name 'EventHandler'.` @ L10
- `[full_check] Cannot find name 'IN'.` @ L24
- `[full_check] Cannot find name 'EXE'.` @ L24
- `[full_check] Cannot find name 'OUT'.` @ L24
- `[full_check] Cannot find name 'ERR'.` @ L24
- `[full_check] Cannot find name 'ECHO'.` @ L25
- `[full_check] Cannot find name 'Answer'.` @ L25
- `[full_check] Cannot find name 'DEBUG'.` @ L25
- `[full_check] Cannot find name 'Nar'.` @ L27
- `[full_check] Cannot find name 'EventEmitter'.` @ L29
- `[full_check] Cannot find name 'Memory'.` @ L31
- `[full_check] Cannot find name 'Nar'.` @ L33
- `[full_check] Cannot find name 'Nar'.` @ L37
- `[full_check] Cannot find name 'EventEmitter'.` @ L47
- `[full_check] Cannot find name 'Memory'.` @ L57
- `[full_check] Cannot find name 'Nar'.` @ L67
- `[syntax_check] Cannot find name 'EventHandler'.` @ L10
- `[syntax_check] Cannot find name 'IN'.` @ L24
- `[syntax_check] Cannot find name 'EXE'.` @ L24
- `[syntax_check] Cannot find name 'OUT'.` @ L24
- `[syntax_check] Cannot find name 'ERR'.` @ L24
- `[syntax_check] Cannot find name 'ECHO'.` @ L25
- `[syntax_check] Cannot find name 'Answer'.` @ L25
- `[syntax_check] Cannot find name 'DEBUG'.` @ L25
- `[syntax_check] Cannot find name 'Nar'.` @ L27
- `[syntax_check] Cannot find name 'EventEmitter'.` @ L29
- `[syntax_check] Cannot find name 'Memory'.` @ L31
- `[syntax_check] Cannot find name 'Nar'.` @ L33
- `[syntax_check] Cannot find name 'Nar'.` @ L37
- `[syntax_check] Cannot find name 'EventEmitter'.` @ L47
- `[syntax_check] Cannot find name 'Memory'.` @ L57
- `[syntax_check] Cannot find name 'Nar'.` @ L67

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `io/events/OutputHandler` -> `io/events/Events`（deps.xml 第 574 行）
- `io/events/OutputHandler` -> `main/Nar`（deps.xml 第 575 行）
- `io/events/OutputHandler` -> `io/events/EventHandler`（deps.xml 第 576 行）
- `io/events/OutputHandler` -> `storage/Memory`（deps.xml 第 577 行）
- `io/events/OutputHandler` -> `io/events/EventEmitter`（deps.xml 第 578 行）
- 交叉校验：
- Java graph 额外依赖：io/events/EventEmitter、io/events/EventHandler、io/events/Events、main/Nar、storage/Memory

## 5. Java 功能说明

- **职责概述**：文件工作：将 java.io 流与事件转接到 Node 流 + EventEmitter，补宏 Parser/Narsese/Events 链路。
- **关键数据结构**：
- `OutputHandler` · 继承：EventHandler · 实现：（无接口）
- **核心流程 / 算法**：
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：将 java.io 流与事件转接到 Node 流 + EventEmitter，补宏 Parser/Narsese/Events 链路。
  3. Java-TS 差异：参见《通用转译法.md》 - I/O 与事件
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `Java Memory/Task 接口` 衔接上下游。

## 6. 一致性风险

- `tsc` 报错阻塞进一步分析，需要回填语句结构。
- 缺少显式 import，需依赖 Java/ts-analysis 交叉校验。

## 7. 路线图定位

- 1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
- 2. 文件工作：将 java.io 流与事件转接到 Node 流 + EventEmitter，补宏 Parser/Narsese/Events 链路。
- 3. Java-TS 差异：参见《通用转译法.md》 - I/O 与事件

## 8. 附加记录

- ts-analysis: LOC=110 · TODO=0
- 参考文件：`java-master/src/main/java/org/opennars/io/events/OutputHandler.java`
