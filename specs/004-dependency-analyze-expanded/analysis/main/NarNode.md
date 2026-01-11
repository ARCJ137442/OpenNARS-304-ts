# src/main/NarNode.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/main/NarNode.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/main/NarNode.java` |
| 模块链路 | `language 基座 -> entity -> control -> main 应用层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/main/NarNode.ts --noEmit`）

- 执行的命令：`npx tsc src/main/NarNode.ts --noEmit`
- 关键输出：
  - TS2304（L8, C52）：[full_check] Cannot find name 'EventObserver'.
  - TS2694（L18, C37）：[full_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/net/index"' has no exported member 'DatagramSocket'.
  - TS2304（L26, C17）：[full_check] Cannot find name 'Nar'.
  - TS2304（L38, C29）：[full_check] Cannot find name 'Nar'.
  - TS2349（L45, C17）：[full_check] This expression is not callable.
  - TS17009（L45, C17）：[full_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L45, C26）：[full_check] Cannot find name 'Nar'.
  - TS2304（L52, C52）：[full_check] Cannot find name 'Nar'.
  - TS2339（L58, C51）：[full_check] Property 'DatagramSocket' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/net/index")'.
  - TS2339（L58, C87）：[full_check] Property 'InetAddress' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/net/index")'.
  - TS2552（L59, C39）：[full_check] Cannot find name 'Events'. Did you mean 'Event'?
  - TS2339（L61, C45）：[full_check] Property 'Thread' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/lang/index")'.
  - TS2304（L67, C56）：[full_check] Cannot find name 'Task'.
  - TS2304（L68, C63）：[full_check] Cannot find name 'EventReceivedTask'.
  - TS2304（L69, C61）：[full_check] Cannot find name 'Task'.
  - TS2339（L77, C54）：[full_check] Property 'Logger' does not exist on type 'typeof System'.
  - TS2339（L77, C117）：[full_check] Property 'Logger' does not exist on type 'typeof System'.
  - TS2339（L84, C21）：[full_check] Property 'start' does not exist on type '(Anonymous class)'.
  - TS2552（L104, C23）：[full_check] Cannot find name 'Events'. Did you mean 'event'?
  - TS2304（L105, C20）：[full_check] Cannot find name 'Task'.
  - TS2304（L105, C38）：[full_check] Cannot find name 'Task'.
  - TS2339（L110, C38）：[full_check] Property 'Logger' does not exist on type 'typeof System'.
  - TS2339（L110, C101）：[full_check] Property 'Logger' does not exist on type 'typeof System'.
  - TS2304（L125, C25）：[full_check] Cannot find name 'Task'.
  - TS2694（L127, C25）：[full_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/io/index"' has no exported member 'ObjectOutput'.
  - TS2551（L127, C52）：[full_check] Property 'ObjectOutputStream' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/io/index")'. Did you mean 'OutputStream'?
  - TS2304（L133, C27）：[full_check] Cannot find name 'Term'.
  - TS2304（L134, C60）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L138, C33）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2694（L140, C42）：[full_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/net/index"' has no exported member 'DatagramPacket'.
  - TS2339（L140, C72）：[full_check] Property 'DatagramPacket' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/net/index")'.
  - TS2702（L156, C64）：[full_check] 'NarNode' only refers to a type, but is being used as a namespace here.
  - TS2304（L159, C26）：[full_check] Cannot find name 'Term'.
  - TS2702（L163, C68）：[full_check] 'NarNode' only refers to a type, but is being used as a namespace here.
  - TS2694（L167, C33）：[full_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/io/index"' has no exported member 'ObjectOutput'.
  - TS2551（L167, C60）：[full_check] Property 'ObjectOutputStream' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/io/index")'. Did you mean 'OutputStream'?
  - TS2339（L172, C66）：[full_check] Property 'contains' does not exist on type 'JavaString'.
  - TS2694（L174, C42）：[full_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/net/index"' has no exported member 'DatagramPacket'.
  - TS2339（L174, C72）：[full_check] Property 'DatagramPacket' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/net/index")'.
  - TS2304（L185, C144）：[full_check] Cannot find name 'Term'.
  - TS2304（L214, C108）：[full_check] Cannot find name 'Term'.
  - TS2339（L217, C43）：[full_check] Property 'InetAddress' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/net/index")'.
  - TS2339（L218, C44）：[full_check] Property 'DatagramSocket' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/net/index")'.
  - TS2694（L226, C49）：[full_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/net/index"' has no exported member 'DatagramSocket'.
  - TS2694（L228, C52）：[full_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/net/index"' has no exported member 'InetAddress'.
  - TS2304（L229, C45）：[full_check] Cannot find name 'Term'.
  - TS2702（L234, C37）：[full_check] 'NarNode' only refers to a type, but is being used as a namespace here.
  - TS2702（L236, C37）：[full_check] 'NarNode' only refers to a type, but is being used as a namespace here.
  - TS2304（L251, C26）：[full_check] Cannot find name 'Term'.
  - TS2702（L255, C43）：[full_check] 'NarNode' only refers to a type, but is being used as a namespace here.
  - TS2304（L265, C130）：[full_check] Cannot find name 'Term'.
  - TS2694（L289, C30）：[full_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/net/index"' has no exported member 'DatagramPacket'.
  - TS2339（L289, C60）：[full_check] Property 'DatagramPacket' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/net/index")'.
  - TS2694（L296, C40）：[full_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/io/index"' has no exported member 'ObjectInputStream'.
  - TS2339（L296, C72）：[full_check] Property 'ObjectInputStream' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/io/index")'.
  - TS2551（L296, C102）：[full_check] Property 'ByteArrayInputStream' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/io/index")'. Did you mean 'ByteArrayOutputStream'?
  - TS2304（L300, C44）：[full_check] Cannot find name 'Task'.
  - TS2769（L312, C54）：[full_check] No overload matches this call.
  - TS2322（L315, C9）：[full_check] Type 'null' is not assignable to type 'JavaObject'.
  - TS2304（L8, C52）：[syntax_check] Cannot find name 'EventObserver'.
  - TS2694（L18, C37）：[syntax_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/net/index"' has no exported member 'DatagramSocket'.
  - TS2304（L26, C17）：[syntax_check] Cannot find name 'Nar'.
  - TS2304（L38, C29）：[syntax_check] Cannot find name 'Nar'.
  - TS2349（L45, C17）：[syntax_check] This expression is not callable.
  - TS17009（L45, C17）：[syntax_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L45, C26）：[syntax_check] Cannot find name 'Nar'.
  - TS2304（L52, C52）：[syntax_check] Cannot find name 'Nar'.
  - TS2339（L58, C51）：[syntax_check] Property 'DatagramSocket' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/net/index")'.
  - TS2339（L58, C87）：[syntax_check] Property 'InetAddress' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/net/index")'.
  - TS2552（L59, C39）：[syntax_check] Cannot find name 'Events'. Did you mean 'Event'?
  - TS2339（L61, C45）：[syntax_check] Property 'Thread' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/lang/index")'.
  - TS2304（L67, C56）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L68, C63）：[syntax_check] Cannot find name 'EventReceivedTask'.
  - TS2304（L69, C61）：[syntax_check] Cannot find name 'Task'.
  - TS2339（L77, C54）：[syntax_check] Property 'Logger' does not exist on type 'typeof System'.
  - TS2339（L77, C117）：[syntax_check] Property 'Logger' does not exist on type 'typeof System'.
  - TS2339（L84, C21）：[syntax_check] Property 'start' does not exist on type '(Anonymous class)'.
  - TS2552（L104, C23）：[syntax_check] Cannot find name 'Events'. Did you mean 'event'?
  - TS2304（L105, C20）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L105, C38）：[syntax_check] Cannot find name 'Task'.
  - TS2339（L110, C38）：[syntax_check] Property 'Logger' does not exist on type 'typeof System'.
  - TS2339（L110, C101）：[syntax_check] Property 'Logger' does not exist on type 'typeof System'.
  - TS2304（L125, C25）：[syntax_check] Cannot find name 'Task'.
  - TS2694（L127, C25）：[syntax_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/io/index"' has no exported member 'ObjectOutput'.
  - TS2551（L127, C52）：[syntax_check] Property 'ObjectOutputStream' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/io/index")'. Did you mean 'OutputStream'?
  - TS2304（L133, C27）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L134, C60）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L138, C33）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2694（L140, C42）：[syntax_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/net/index"' has no exported member 'DatagramPacket'.
  - TS2339（L140, C72）：[syntax_check] Property 'DatagramPacket' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/net/index")'.
  - TS2702（L156, C64）：[syntax_check] 'NarNode' only refers to a type, but is being used as a namespace here.
  - TS2304（L159, C26）：[syntax_check] Cannot find name 'Term'.
  - TS2702（L163, C68）：[syntax_check] 'NarNode' only refers to a type, but is being used as a namespace here.
  - TS2694（L167, C33）：[syntax_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/io/index"' has no exported member 'ObjectOutput'.
  - TS2551（L167, C60）：[syntax_check] Property 'ObjectOutputStream' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/io/index")'. Did you mean 'OutputStream'?
  - TS2339（L172, C66）：[syntax_check] Property 'contains' does not exist on type 'JavaString'.
  - TS2694（L174, C42）：[syntax_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/net/index"' has no exported member 'DatagramPacket'.
  - TS2339（L174, C72）：[syntax_check] Property 'DatagramPacket' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/net/index")'.
  - TS2304（L185, C144）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L214, C108）：[syntax_check] Cannot find name 'Term'.
  - TS2339（L217, C43）：[syntax_check] Property 'InetAddress' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/net/index")'.
  - TS2339（L218, C44）：[syntax_check] Property 'DatagramSocket' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/net/index")'.
  - TS2694（L226, C49）：[syntax_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/net/index"' has no exported member 'DatagramSocket'.
  - TS2694（L228, C52）：[syntax_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/net/index"' has no exported member 'InetAddress'.
  - TS2304（L229, C45）：[syntax_check] Cannot find name 'Term'.
  - TS2702（L234, C37）：[syntax_check] 'NarNode' only refers to a type, but is being used as a namespace here.
  - TS2702（L236, C37）：[syntax_check] 'NarNode' only refers to a type, but is being used as a namespace here.
  - TS2304（L251, C26）：[syntax_check] Cannot find name 'Term'.
  - TS2702（L255, C43）：[syntax_check] 'NarNode' only refers to a type, but is being used as a namespace here.
  - TS2304（L265, C130）：[syntax_check] Cannot find name 'Term'.
  - TS2694（L289, C30）：[syntax_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/net/index"' has no exported member 'DatagramPacket'.
  - TS2339（L289, C60）：[syntax_check] Property 'DatagramPacket' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/net/index")'.
  - TS2694（L296, C40）：[syntax_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/io/index"' has no exported member 'ObjectInputStream'.
  - TS2339（L296, C72）：[syntax_check] Property 'ObjectInputStream' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/io/index")'.
  - TS2551（L296, C102）：[syntax_check] Property 'ByteArrayInputStream' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/io/index")'. Did you mean 'ByteArrayOutputStream'?
  - TS2304（L300, C44）：[syntax_check] Cannot find name 'Task'.
  - TS2769（L312, C54）：[syntax_check] No overload matches this call.
  - TS2322（L315, C9）：[syntax_check] Type 'null' is not assignable to type 'JavaObject'.
- 总结：存在语法错误，需要比对 Java 语句结构。；编译失败：TS1472 @ 316:13 'catch' or 'finally' expected. ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

（无显式结构性依赖，主要依赖 `jree` 提供的运行时桩或尚未补齐的全局声明。）

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

- `[full_check] Cannot find name 'EventObserver'.` @ L8
- `[full_check] Cannot find name 'Nar'.` @ L26
- `[full_check] Cannot find name 'Nar'.` @ L38
- `[full_check] Cannot find name 'Nar'.` @ L45
- `[full_check] Cannot find name 'Nar'.` @ L52
- `[full_check] Cannot find name 'Events'. Did you mean 'Event'?` @ L59
- `[full_check] Cannot find name 'Task'.` @ L67
- `[full_check] Cannot find name 'EventReceivedTask'.` @ L68
- `[full_check] Cannot find name 'Task'.` @ L69
- `[full_check] Cannot find name 'Events'. Did you mean 'event'?` @ L104
- `[full_check] Cannot find name 'Task'.` @ L105
- `[full_check] Cannot find name 'Task'.` @ L105
- `[full_check] Cannot find name 'Task'.` @ L125
- `[full_check] Cannot find name 'Term'.` @ L133
- `[full_check] Cannot find name 'CompoundTerm'.` @ L134
- `[full_check] Cannot find name 'CompoundTerm'.` @ L138
- `[full_check] Cannot find name 'Term'.` @ L159
- `[full_check] Cannot find name 'Term'.` @ L185
- `[full_check] Cannot find name 'Term'.` @ L214
- `[full_check] Cannot find name 'Term'.` @ L229
- `[full_check] Cannot find name 'Term'.` @ L251
- `[full_check] Cannot find name 'Term'.` @ L265
- `[full_check] Cannot find name 'Task'.` @ L300
- `[syntax_check] Cannot find name 'EventObserver'.` @ L8
- `[syntax_check] Cannot find name 'Nar'.` @ L26
- `[syntax_check] Cannot find name 'Nar'.` @ L38
- `[syntax_check] Cannot find name 'Nar'.` @ L45
- `[syntax_check] Cannot find name 'Nar'.` @ L52
- `[syntax_check] Cannot find name 'Events'. Did you mean 'Event'?` @ L59
- `[syntax_check] Cannot find name 'Task'.` @ L67
- `[syntax_check] Cannot find name 'EventReceivedTask'.` @ L68
- `[syntax_check] Cannot find name 'Task'.` @ L69
- `[syntax_check] Cannot find name 'Events'. Did you mean 'event'?` @ L104
- `[syntax_check] Cannot find name 'Task'.` @ L105
- `[syntax_check] Cannot find name 'Task'.` @ L105
- `[syntax_check] Cannot find name 'Task'.` @ L125
- `[syntax_check] Cannot find name 'Term'.` @ L133
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L134
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L138
- `[syntax_check] Cannot find name 'Term'.` @ L159
- `[syntax_check] Cannot find name 'Term'.` @ L185
- `[syntax_check] Cannot find name 'Term'.` @ L214
- `[syntax_check] Cannot find name 'Term'.` @ L229
- `[syntax_check] Cannot find name 'Term'.` @ L251
- `[syntax_check] Cannot find name 'Term'.` @ L265
- `[syntax_check] Cannot find name 'Task'.` @ L300

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `main/NarNode` -> `io/events/Events`（deps.xml 第 910 行）
- `main/NarNode` -> `language/CompoundTerm`（deps.xml 第 911 行）
- `main/NarNode` -> `entity/Item`（deps.xml 第 912 行）
- `main/NarNode` -> `entity/Task`（deps.xml 第 913 行）
- `main/NarNode` -> `language/Term`（deps.xml 第 914 行）
- `main/NarNode` -> `io/events/EventEmitter`（deps.xml 第 915 行）
- `main/NarNode` -> `main/Nar`（deps.xml 第 916 行）
- 交叉校验：
- Java graph 额外依赖：entity/Item、entity/Task、io/events/EventEmitter、io/events/Events、language/CompoundTerm、language/Term、main/Nar

## 5. Java 功能说明

- **职责概述**：文件工作：把 Nar/NarNode/Shell 生命周期、线程和 CLI 搭到 Node 异步控制器上。；tsc TS1472 @ 316:13 错误
- **关键数据结构**：
- `NarNode` · 继承：JavaObject · 实现：EventObserver
- **核心流程 / 算法**：
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：把 Nar/NarNode/Shell 生命周期、线程和 CLI 搭到 Node 异步控制器上。；tsc TS1472 @ 316:13 错误
  3. Java-TS 差异：参见《通用转译法.md》 - 主程序
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `Java Memory/Task 接口` 衔接上下游。

## 6. 一致性风险

- `tsc` 报错阻塞进一步分析，需要回填语句结构。
- 缺少显式 import，需依赖 Java/ts-analysis 交叉校验。

## 7. 路线图定位

- 1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
- 2. 文件工作：把 Nar/NarNode/Shell 生命周期、线程和 CLI 搭到 Node 异步控制器上。；tsc TS1472 @ 316:13 错误
- 3. Java-TS 差异：参见《通用转译法.md》 - 主程序

## 8. 附加记录

- ts-analysis: LOC=337 · TODO=0
- 参考文件：`java-master/src/main/java/org/opennars/main/NarNode.java`
