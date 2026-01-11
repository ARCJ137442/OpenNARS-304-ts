# src/io/events/TextOutputHandler.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/io/events/TextOutputHandler.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/io/events/TextOutputHandler.java` |
| 模块链路 | `language 基座 -> entity -> io I/O 层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/io/events/TextOutputHandler.ts --noEmit`）

- 执行的命令：`npx tsc src/io/events/TextOutputHandler.ts --noEmit`
- 关键输出：
  - TS2420（L9, C14）：[full_check] Class 'TextOutputHandler' incorrectly implements interface 'Serializable'.
  - TS2304（L9, C40）：[full_check] Cannot find name 'OutputHandler'.
  - TS2304（L11, C27）：[full_check] Cannot find name 'Nar'.
  - TS2322（L13, C13）：[full_check] Type 'string' is not assignable to type 'JavaString'.
  - TS2564（L14, C13）：[full_check] Property 'outExp2' has no initializer and is not definitely assigned in the constructor.
  - TS2564（L15, C13）：[full_check] Property 'outExp' has no initializer and is not definitely assigned in the constructor.
  - TS2304（L27, C27）：[full_check] Cannot find name 'Nar'.
  - TS2304（L29, C27）：[full_check] Cannot find name 'Nar'.
  - TS2304（L31, C27）：[full_check] Cannot find name 'Nar'.
  - TS2304（L33, C27）：[full_check] Cannot find name 'Nar'.
  - TS2304（L35, C27）：[full_check] Cannot find name 'Nar'.
  - TS2304（L37, C27）：[full_check] Cannot find name 'Nar'.
  - TS2304（L39, C27）：[full_check] Cannot find name 'Nar'.
  - TS2304（L43, C38）：[full_check] Cannot find name 'Nar'.
  - TS2304（L54, C47）：[full_check] Cannot find name 'Nar'.
  - TS2349（L57, C17）：[full_check] This expression is not callable.
  - TS17009（L57, C17）：[full_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS17009（L58, C17）：[full_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L65, C46）：[full_check] Cannot find name 'Nar'.
  - TS2349（L68, C17）：[full_check] This expression is not callable.
  - TS17009（L68, C17）：[full_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L75, C42）：[full_check] Cannot find name 'Nar'.
  - TS2349（L78, C17）：[full_check] This expression is not callable.
  - TS17009（L78, C17）：[full_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L85, C41）：[full_check] Cannot find name 'Nar'.
  - TS2349（L88, C17）：[full_check] This expression is not callable.
  - TS17009（L88, C17）：[full_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L95, C59）：[full_check] Cannot find name 'Nar'.
  - TS2349（L98, C17）：[full_check] This expression is not callable.
  - TS17009（L98, C17）：[full_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS17009（L99, C17）：[full_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS17009（L100, C17）：[full_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L107, C55）：[full_check] Cannot find name 'Nar'.
  - TS2349（L110, C17）：[full_check] This expression is not callable.
  - TS17009（L110, C17）：[full_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS17009（L111, C17）：[full_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L144, C9）：[full_check] Cannot find name 'setActive'.
  - TS2304（L152, C46）：[full_check] Cannot find name 'ERR'.
  - TS2304（L155, C45）：[full_check] Cannot find name 'IN'.
  - TS2365（L163, C41）：[full_check] Operator '+' cannot be applied to types 'import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/lang/String").JavaString' and 'import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/lang/String").JavaString'.
  - TS2365（L167, C42）：[full_check] Operator '+' cannot be applied to types 'import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/lang/String").JavaString' and 'import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/lang/String").JavaString'.
  - TS2304（L200, C34）：[full_check] Cannot find name 'Nar'.
  - TS2304（L204, C34）：[full_check] Cannot find name 'Nar'.
  - TS2304（L208, C151）：[full_check] Cannot find name 'Nar'.
  - TS2304（L218, C164）：[full_check] Cannot find name 'Nar'.
  - TS2304（L226, C33）：[full_check] Cannot find name 'ERR'.
  - TS2304（L239, C41）：[full_check] Cannot find name 'OUT'.
  - TS2304（L239, C68）：[full_check] Cannot find name 'IN'.
  - TS2304（L239, C94）：[full_check] Cannot find name 'ECHO'.
  - TS2304（L239, C122）：[full_check] Cannot find name 'EXE'.
  - TS2304（L240, C37）：[full_check] Cannot find name 'Answer'.
  - TS2304（L241, C37）：[full_check] Cannot find name 'ANTICIPATE'.
  - TS2304（L241, C71）：[full_check] Cannot find name 'DISAPPOINT'.
  - TS2304（L241, C105）：[full_check] Cannot find name 'CONFIRM'.
  - TS2304（L242, C37）：[full_check] Cannot find name 'DEBUG'.
  - TS2304（L244, C37）：[full_check] Cannot find name 'CONFIRM'.
  - TS2304（L247, C43）：[full_check] Cannot find name 'Task'.
  - TS2304（L248, C32）：[full_check] Cannot find name 'Task'.
  - TS2304（L248, C49）：[full_check] Cannot find name 'Task'.
  - TS2322（L250, C29）：[full_check] Type 'null' is not assignable to type 'JavaString'.
  - TS2304（L252, C42）：[full_check] Cannot find name 'ANTICIPATE'.
  - TS2304（L252, C76）：[full_check] Cannot find name 'DISAPPOINT'.
  - TS2304（L254, C48）：[full_check] Cannot find name 'Answer'.
  - TS2304（L255, C39）：[full_check] Cannot find name 'Task'.
  - TS2304（L256, C41）：[full_check] Cannot find name 'Sentence'.
  - TS2420（L9, C14）：[syntax_check] Class 'TextOutputHandler' incorrectly implements interface 'Serializable'.
  - TS2304（L9, C40）：[syntax_check] Cannot find name 'OutputHandler'.
  - TS2304（L11, C27）：[syntax_check] Cannot find name 'Nar'.
  - TS2322（L13, C13）：[syntax_check] Type 'string' is not assignable to type 'JavaString'.
  - TS2564（L14, C13）：[syntax_check] Property 'outExp2' has no initializer and is not definitely assigned in the constructor.
  - TS2564（L15, C13）：[syntax_check] Property 'outExp' has no initializer and is not definitely assigned in the constructor.
  - TS2304（L27, C27）：[syntax_check] Cannot find name 'Nar'.
  - TS2304（L29, C27）：[syntax_check] Cannot find name 'Nar'.
  - TS2304（L31, C27）：[syntax_check] Cannot find name 'Nar'.
  - TS2304（L33, C27）：[syntax_check] Cannot find name 'Nar'.
  - TS2304（L35, C27）：[syntax_check] Cannot find name 'Nar'.
  - TS2304（L37, C27）：[syntax_check] Cannot find name 'Nar'.
  - TS2304（L39, C27）：[syntax_check] Cannot find name 'Nar'.
  - TS2304（L43, C38）：[syntax_check] Cannot find name 'Nar'.
  - TS2304（L54, C47）：[syntax_check] Cannot find name 'Nar'.
  - TS2349（L57, C17）：[syntax_check] This expression is not callable.
  - TS17009（L57, C17）：[syntax_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS17009（L58, C17）：[syntax_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L65, C46）：[syntax_check] Cannot find name 'Nar'.
  - TS2349（L68, C17）：[syntax_check] This expression is not callable.
  - TS17009（L68, C17）：[syntax_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L75, C42）：[syntax_check] Cannot find name 'Nar'.
  - TS2349（L78, C17）：[syntax_check] This expression is not callable.
  - TS17009（L78, C17）：[syntax_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L85, C41）：[syntax_check] Cannot find name 'Nar'.
  - TS2349（L88, C17）：[syntax_check] This expression is not callable.
  - TS17009（L88, C17）：[syntax_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L95, C59）：[syntax_check] Cannot find name 'Nar'.
  - TS2349（L98, C17）：[syntax_check] This expression is not callable.
  - TS17009（L98, C17）：[syntax_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS17009（L99, C17）：[syntax_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS17009（L100, C17）：[syntax_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L107, C55）：[syntax_check] Cannot find name 'Nar'.
  - TS2349（L110, C17）：[syntax_check] This expression is not callable.
  - TS17009（L110, C17）：[syntax_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS17009（L111, C17）：[syntax_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L144, C9）：[syntax_check] Cannot find name 'setActive'.
  - TS2304（L152, C46）：[syntax_check] Cannot find name 'ERR'.
  - TS2304（L155, C45）：[syntax_check] Cannot find name 'IN'.
  - TS2365（L163, C41）：[syntax_check] Operator '+' cannot be applied to types 'import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/lang/String").JavaString' and 'import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/lang/String").JavaString'.
  - TS2365（L167, C42）：[syntax_check] Operator '+' cannot be applied to types 'import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/lang/String").JavaString' and 'import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/lang/String").JavaString'.
  - TS2304（L200, C34）：[syntax_check] Cannot find name 'Nar'.
  - TS2304（L204, C34）：[syntax_check] Cannot find name 'Nar'.
  - TS2304（L208, C151）：[syntax_check] Cannot find name 'Nar'.
  - TS2304（L218, C164）：[syntax_check] Cannot find name 'Nar'.
  - TS2304（L226, C33）：[syntax_check] Cannot find name 'ERR'.
  - TS2304（L239, C41）：[syntax_check] Cannot find name 'OUT'.
  - TS2304（L239, C68）：[syntax_check] Cannot find name 'IN'.
  - TS2304（L239, C94）：[syntax_check] Cannot find name 'ECHO'.
  - TS2304（L239, C122）：[syntax_check] Cannot find name 'EXE'.
  - TS2304（L240, C37）：[syntax_check] Cannot find name 'Answer'.
  - TS2304（L241, C37）：[syntax_check] Cannot find name 'ANTICIPATE'.
  - TS2304（L241, C71）：[syntax_check] Cannot find name 'DISAPPOINT'.
  - TS2304（L241, C105）：[syntax_check] Cannot find name 'CONFIRM'.
  - TS2304（L242, C37）：[syntax_check] Cannot find name 'DEBUG'.
  - TS2304（L244, C37）：[syntax_check] Cannot find name 'CONFIRM'.
  - TS2304（L247, C43）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L248, C32）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L248, C49）：[syntax_check] Cannot find name 'Task'.
  - TS2322（L250, C29）：[syntax_check] Type 'null' is not assignable to type 'JavaString'.
  - TS2304（L252, C42）：[syntax_check] Cannot find name 'ANTICIPATE'.
  - TS2304（L252, C76）：[syntax_check] Cannot find name 'DISAPPOINT'.
  - TS2304（L254, C48）：[syntax_check] Cannot find name 'Answer'.
  - TS2304（L255, C39）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L256, C41）：[syntax_check] Cannot find name 'Sentence'.
- 总结：存在语法错误，需要比对 Java 语句结构。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

（无显式结构性依赖，主要依赖 `jree` 提供的运行时桩或尚未补齐的全局声明。）

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

- `[full_check] Cannot find name 'OutputHandler'.` @ L9
- `[full_check] Cannot find name 'Nar'.` @ L11
- `[full_check] Cannot find name 'Nar'.` @ L27
- `[full_check] Cannot find name 'Nar'.` @ L29
- `[full_check] Cannot find name 'Nar'.` @ L31
- `[full_check] Cannot find name 'Nar'.` @ L33
- `[full_check] Cannot find name 'Nar'.` @ L35
- `[full_check] Cannot find name 'Nar'.` @ L37
- `[full_check] Cannot find name 'Nar'.` @ L39
- `[full_check] Cannot find name 'Nar'.` @ L43
- `[full_check] Cannot find name 'Nar'.` @ L54
- `[full_check] Cannot find name 'Nar'.` @ L65
- `[full_check] Cannot find name 'Nar'.` @ L75
- `[full_check] Cannot find name 'Nar'.` @ L85
- `[full_check] Cannot find name 'Nar'.` @ L95
- `[full_check] Cannot find name 'Nar'.` @ L107
- `[full_check] Cannot find name 'setActive'.` @ L144
- `[full_check] Cannot find name 'ERR'.` @ L152
- `[full_check] Cannot find name 'IN'.` @ L155
- `[full_check] Cannot find name 'Nar'.` @ L200
- `[full_check] Cannot find name 'Nar'.` @ L204
- `[full_check] Cannot find name 'Nar'.` @ L208
- `[full_check] Cannot find name 'Nar'.` @ L218
- `[full_check] Cannot find name 'ERR'.` @ L226
- `[full_check] Cannot find name 'OUT'.` @ L239
- `[full_check] Cannot find name 'IN'.` @ L239
- `[full_check] Cannot find name 'ECHO'.` @ L239
- `[full_check] Cannot find name 'EXE'.` @ L239
- `[full_check] Cannot find name 'Answer'.` @ L240
- `[full_check] Cannot find name 'ANTICIPATE'.` @ L241
- `[full_check] Cannot find name 'DISAPPOINT'.` @ L241
- `[full_check] Cannot find name 'CONFIRM'.` @ L241
- `[full_check] Cannot find name 'DEBUG'.` @ L242
- `[full_check] Cannot find name 'CONFIRM'.` @ L244
- `[full_check] Cannot find name 'Task'.` @ L247
- `[full_check] Cannot find name 'Task'.` @ L248
- `[full_check] Cannot find name 'Task'.` @ L248
- `[full_check] Cannot find name 'ANTICIPATE'.` @ L252
- `[full_check] Cannot find name 'DISAPPOINT'.` @ L252
- `[full_check] Cannot find name 'Answer'.` @ L254
- `[full_check] Cannot find name 'Task'.` @ L255
- `[full_check] Cannot find name 'Sentence'.` @ L256
- `[syntax_check] Cannot find name 'OutputHandler'.` @ L9
- `[syntax_check] Cannot find name 'Nar'.` @ L11
- `[syntax_check] Cannot find name 'Nar'.` @ L27
- `[syntax_check] Cannot find name 'Nar'.` @ L29
- `[syntax_check] Cannot find name 'Nar'.` @ L31
- `[syntax_check] Cannot find name 'Nar'.` @ L33
- `[syntax_check] Cannot find name 'Nar'.` @ L35
- `[syntax_check] Cannot find name 'Nar'.` @ L37
- `[syntax_check] Cannot find name 'Nar'.` @ L39
- `[syntax_check] Cannot find name 'Nar'.` @ L43
- `[syntax_check] Cannot find name 'Nar'.` @ L54
- `[syntax_check] Cannot find name 'Nar'.` @ L65
- `[syntax_check] Cannot find name 'Nar'.` @ L75
- `[syntax_check] Cannot find name 'Nar'.` @ L85
- `[syntax_check] Cannot find name 'Nar'.` @ L95
- `[syntax_check] Cannot find name 'Nar'.` @ L107
- `[syntax_check] Cannot find name 'setActive'.` @ L144
- `[syntax_check] Cannot find name 'ERR'.` @ L152
- `[syntax_check] Cannot find name 'IN'.` @ L155
- `[syntax_check] Cannot find name 'Nar'.` @ L200
- `[syntax_check] Cannot find name 'Nar'.` @ L204
- `[syntax_check] Cannot find name 'Nar'.` @ L208
- `[syntax_check] Cannot find name 'Nar'.` @ L218
- `[syntax_check] Cannot find name 'ERR'.` @ L226
- `[syntax_check] Cannot find name 'OUT'.` @ L239
- `[syntax_check] Cannot find name 'IN'.` @ L239
- `[syntax_check] Cannot find name 'ECHO'.` @ L239
- `[syntax_check] Cannot find name 'EXE'.` @ L239
- `[syntax_check] Cannot find name 'Answer'.` @ L240
- `[syntax_check] Cannot find name 'ANTICIPATE'.` @ L241
- `[syntax_check] Cannot find name 'DISAPPOINT'.` @ L241
- `[syntax_check] Cannot find name 'CONFIRM'.` @ L241
- `[syntax_check] Cannot find name 'DEBUG'.` @ L242
- `[syntax_check] Cannot find name 'CONFIRM'.` @ L244
- `[syntax_check] Cannot find name 'Task'.` @ L247
- `[syntax_check] Cannot find name 'Task'.` @ L248
- `[syntax_check] Cannot find name 'Task'.` @ L248
- `[syntax_check] Cannot find name 'ANTICIPATE'.` @ L252
- `[syntax_check] Cannot find name 'DISAPPOINT'.` @ L252
- `[syntax_check] Cannot find name 'Answer'.` @ L254
- `[syntax_check] Cannot find name 'Task'.` @ L255
- `[syntax_check] Cannot find name 'Sentence'.` @ L256

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `io/events/TextOutputHandler` -> `io/events/Events`（deps.xml 第 581 行）
- `io/events/TextOutputHandler` -> `entity/Item`（deps.xml 第 582 行）
- `io/events/TextOutputHandler` -> `entity/Task`（deps.xml 第 583 行）
- `io/events/TextOutputHandler` -> `io/events/EventHandler`（deps.xml 第 584 行）
- `io/events/TextOutputHandler` -> `entity/Sentence`（deps.xml 第 585 行）
- `io/events/TextOutputHandler` -> `io/events/OutputHandler`（deps.xml 第 586 行）
- `io/events/TextOutputHandler` -> `main/Nar`（deps.xml 第 587 行）
- 交叉校验：
- Java graph 额外依赖：entity/Item、entity/Sentence、entity/Task、io/events/EventHandler、io/events/Events、io/events/OutputHandler、main/Nar

## 5. Java 功能说明

- **职责概述**：文件工作：将 java.io 流与事件转接到 Node 流 + EventEmitter，补宏 Parser/Narsese/Events 链路。
- **关键数据结构**：
- `TextOutputHandler` · 继承：OutputHandler · 实现：java.io.Serializable
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

- ts-analysis: LOC=294 · TODO=0
- 参考文件：`java-master/src/main/java/org/opennars/io/events/TextOutputHandler.java`
