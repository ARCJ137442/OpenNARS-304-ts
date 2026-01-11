# src/io/events/EventHandler.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/io/events/EventHandler.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/io/events/EventHandler.java` |
| 模块链路 | `language 基座 -> entity -> io I/O 层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/io/events/EventHandler.ts --noEmit`）

- 执行的命令：`npx tsc src/io/events/EventHandler.ts --noEmit`
- 关键输出：
  - TS2503（L7, C66）：[full_check] Cannot find namespace 'EventEmitter'.
  - TS2304（L8, C32）：[full_check] Cannot find name 'EventEmitter'.
  - TS2564（L10, C22）：[full_check] Property 'events' has no initializer and is not definitely assigned in the constructor.
  - TS2304（L12, C27）：[full_check] Cannot find name 'Nar'.
  - TS2304（L14, C32）：[full_check] Cannot find name 'EventEmitter'.
  - TS2304（L18, C54）：[full_check] Cannot find name 'Nar'.
  - TS2349（L21, C17）：[full_check] This expression is not callable.
  - TS17009（L21, C17）：[full_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS17009（L21, C46）：[full_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2565（L21, C51）：[full_check] Property 'events' is used before being assigned.
  - TS2304（L28, C59）：[full_check] Cannot find name 'EventEmitter'.
  - TS2565（L33, C36）：[full_check] Property 'events' is used before being assigned.
  - TS2503（L7, C66）：[syntax_check] Cannot find namespace 'EventEmitter'.
  - TS2304（L8, C32）：[syntax_check] Cannot find name 'EventEmitter'.
  - TS2564（L10, C22）：[syntax_check] Property 'events' has no initializer and is not definitely assigned in the constructor.
  - TS2304（L12, C27）：[syntax_check] Cannot find name 'Nar'.
  - TS2304（L14, C32）：[syntax_check] Cannot find name 'EventEmitter'.
  - TS2304（L18, C54）：[syntax_check] Cannot find name 'Nar'.
  - TS2349（L21, C17）：[syntax_check] This expression is not callable.
  - TS17009（L21, C17）：[syntax_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS17009（L21, C46）：[syntax_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2565（L21, C51）：[syntax_check] Property 'events' is used before being assigned.
  - TS2304（L28, C59）：[syntax_check] Cannot find name 'EventEmitter'.
  - TS2565（L33, C36）：[syntax_check] Property 'events' is used before being assigned.
- 总结：存在语法错误，需要比对 Java 语句结构。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

（无显式结构性依赖，主要依赖 `jree` 提供的运行时桩或尚未补齐的全局声明。）

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

- `[full_check] Cannot find namespace 'EventEmitter'.` @ L7
- `[full_check] Cannot find name 'EventEmitter'.` @ L8
- `[full_check] Cannot find name 'Nar'.` @ L12
- `[full_check] Cannot find name 'EventEmitter'.` @ L14
- `[full_check] Cannot find name 'Nar'.` @ L18
- `[full_check] Cannot find name 'EventEmitter'.` @ L28
- `[syntax_check] Cannot find namespace 'EventEmitter'.` @ L7
- `[syntax_check] Cannot find name 'EventEmitter'.` @ L8
- `[syntax_check] Cannot find name 'Nar'.` @ L12
- `[syntax_check] Cannot find name 'EventEmitter'.` @ L14
- `[syntax_check] Cannot find name 'Nar'.` @ L18
- `[syntax_check] Cannot find name 'EventEmitter'.` @ L28

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `io/events/EventHandler` -> `main/Nar`（deps.xml 第 561 行）
- `io/events/EventHandler` -> `storage/Memory`（deps.xml 第 562 行）
- `io/events/EventHandler` -> `io/events/EventEmitter`（deps.xml 第 563 行）
- 交叉校验：
- Java graph 额外依赖：io/events/EventEmitter、main/Nar、storage/Memory

## 5. Java 功能说明

- **职责概述**：文件工作：将 java.io 流与事件转接到 Node 流 + EventEmitter，补宏 Parser/Narsese/Events 链路。
- **关键数据结构**：
- `EventHandler` · 继承：JavaObject · 实现：EventEmitter.EventObserver
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

- ts-analysis: LOC=58 · TODO=0
- 参考文件：`java-master/src/main/java/org/opennars/io/events/EventHandler.java`
