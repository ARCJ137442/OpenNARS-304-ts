# src/io/ConfigReader.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/io/ConfigReader.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/io/ConfigReader.java` |
| 模块链路 | `language 基座 -> entity -> io I/O 层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/io/ConfigReader.ts --noEmit`）

- 执行的命令：`npx tsc src/io/ConfigReader.ts --noEmit`
- 关键输出：
  - TS2304（L12, C92）：[full_check] Cannot find name 'Reasoner'.
  - TS2314（L13, C21）：[full_check] Generic type 'Parameters' requires 1 type argument(s).
  - TS2322（L19, C13）：[full_check] Type 'null' is not assignable to type 'InputStream'.
  - TS2322（L22, C13）：[full_check] Type 'null' is not assignable to type 'JavaFile'.
  - TS2694（L23, C29）：[full_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/net/index"' has no exported member 'URL'.
  - TS2304（L23, C35）：[full_check] Cannot find name 'Resources'.
  - TS2694（L25, C38）：[full_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/net/index"' has no exported member 'URLConnection'.
  - TS2304（L32, C37）：[full_check] Cannot find name 'DocumentBuilderFactory'.
  - TS2304（L32, C62）：[full_check] Cannot find name 'DocumentBuilderFactory'.
  - TS2304（L33, C30）：[full_check] Cannot find name 'DocumentBuilder'.
  - TS2531（L35, C32）：[full_check] Object is possibly 'null'.
  - TS2551（L35, C80）：[full_check] Property 'getChildNodes' does not exist on type 'Element'. Did you mean 'childNodes'?
  - TS2551（L37, C75）：[full_check] Property 'getLength' does not exist on type 'NodeList'. Did you mean 'length'?
  - TS2322（L38, C17）：[full_check] Type 'Node | null' is not assignable to type 'Node'.
  - TS2551（L40, C25）：[full_check] Property 'getNodeType' does not exist on type 'Node'. Did you mean 'nodeType'?
  - TS2551（L44, C54）：[full_check] Property 'getNodeName' does not exist on type 'Node'. Did you mean 'nodeName'?
  - TS2551（L46, C49）：[full_check] Property 'getChildNodes' does not exist on type 'Node'. Did you mean 'childNodes'?
  - TS2551（L48, C84）：[full_check] Property 'getLength' does not exist on type 'NodeList'. Did you mean 'length'?
  - TS2322（L49, C25）：[full_check] Type 'Node | null' is not assignable to type 'Node'.
  - TS2551（L51, C33）：[full_check] Property 'getNodeType' does not exist on type 'Node'. Did you mean 'nodeType'?
  - TS2339（L55, C69）：[full_check] Property 'getAttributes' does not exist on type 'Node'.
  - TS1210（L57, C25）：[full_check] Code contained in a class is evaluated in JavaScript's strict mode which does not allow this use of 'arguments'. For more information, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode.
  - TS2551（L57, C55）：[full_check] Property 'getChildNodes' does not exist on type 'Node'. Did you mean 'childNodes'?
  - TS2339（L64, C62）：[full_check] Property 'getAttributes' does not exist on type 'Node'.
  - TS2339（L65, C71）：[full_check] Property 'getAttributes' does not exist on type 'Node'.
  - TS2694（L70, C52）：[full_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/lang/index"' has no exported member 'reflect'.
  - TS2693（L70, C68）：[full_check] 'Parameters' only refers to a type, but is being used as a value here.
  - TS2693（L72, C55）：[full_check] 'int' only refers to a type, but is being used as a value here.
  - TS2693（L74, C62）：[full_check] 'float' only refers to a type, but is being used as a value here.
  - TS2339（L75, C67）：[full_check] Property 'Float' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/lang/index")'.
  - TS2693（L76, C62）：[full_check] 'double' only refers to a type, but is being used as a value here.
  - TS2339（L77, C67）：[full_check] Property 'Double' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/lang/index")'.
  - TS2693（L78, C62）：[full_check] 'boolean' only refers to a type, but is being used as a value here.
  - TS2339（L81, C45）：[full_check] Property 'ParseException' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/text/index")'.
  - TS2339（L86, C48）：[full_check] Property 'NoSuchFieldException' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/lang/index")'.
  - TS2694（L95, C56）：[full_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/lang/index"' has no exported member 'reflect'.
  - TS2304（L95, C72）：[full_check] Cannot find name 'Debug'.
  - TS2693（L97, C59）：[full_check] 'int' only refers to a type, but is being used as a value here.
  - TS2693（L99, C66）：[full_check] 'float' only refers to a type, but is being used as a value here.
  - TS2339（L100, C65）：[full_check] Property 'Float' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/lang/index")'.
  - TS2339（L102, C49）：[full_check] Property 'ParseException' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/text/index")'.
  - TS2339（L107, C52）：[full_check] Property 'NoSuchFieldException' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/lang/index")'.
  - TS1210（L119, C91）：[full_check] Code contained in a class is evaluated in JavaScript's strict mode which does not allow this use of 'arguments'. For more information, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode.
  - TS2304（L120, C19）：[full_check] Cannot find name 'Reasoner'.
  - TS2322（L121, C13）：[full_check] Type 'ArrayList<unknown>' is not assignable to type 'List<Class<unknown>>'.
  - TS2322（L122, C13）：[full_check] Type 'ArrayList<unknown>' is not assignable to type 'List<JavaObject>'.
  - TS2551（L124, C66）：[full_check] Property 'getLength' does not exist on type 'NodeList'. Did you mean 'length'?
  - TS2322（L125, C17）：[full_check] Type 'Node | null' is not assignable to type 'Node'.
  - TS2551（L127, C28）：[full_check] Property 'getNodeType' does not exist on type 'Node'. Did you mean 'nodeType'?
  - TS2322（L131, C17）：[full_check] Type 'null' is not assignable to type 'JavaString'.
  - TS2322（L132, C17）：[full_check] Type 'null' is not assignable to type 'JavaString'.
  - TS2339（L133, C57）：[full_check] Property 'getAttributes' does not exist on type 'Node'.
  - TS2339（L136, C41）：[full_check] Property 'getAttributes' does not exist on type 'Node'.
  - TS2339（L137, C42）：[full_check] Property 'getAttributes' does not exist on type 'Node'.
  - TS2304（L141, C27）：[full_check] Cannot find name 'Reasoner'.
  - TS2339（L144, C37）：[full_check] Property 'ParseException' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/text/index")'.
  - TS2693（L146, C27）：[full_check] 'int' only refers to a type, but is being used as a value here.
  - TS2345（L147, C28）：[full_check] Argument of type 'number' is not assignable to parameter of type 'JavaObject'.
  - TS2693（L149, C27）：[full_check] 'float' only refers to a type, but is being used as a value here.
  - TS2339（L150, C38）：[full_check] Property 'Float' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/lang/index")'.
  - TS2693（L152, C27）：[full_check] 'boolean' only refers to a type, but is being used as a value here.
  - TS2345（L153, C28）：[full_check] Argument of type 'boolean' is not assignable to parameter of type 'JavaObject'.
  - TS2339（L158, C37）：[full_check] Property 'ParseException' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/text/index")'.
  - TS2314（L162, C78）：[full_check] Generic type 'Class<T>' requires 1 type argument(s).
  - TS2339（L165, C59）：[full_check] Property 'forName' does not exist on type 'typeof Class'.
  - TS2339（L167, C39）：[full_check] Property 'getConstructor' does not exist on type 'Class<unknown>'.
  - TS2304（L12, C92）：[syntax_check] Cannot find name 'Reasoner'.
  - TS2314（L13, C21）：[syntax_check] Generic type 'Parameters' requires 1 type argument(s).
  - TS2322（L19, C13）：[syntax_check] Type 'null' is not assignable to type 'InputStream'.
  - TS2322（L22, C13）：[syntax_check] Type 'null' is not assignable to type 'JavaFile'.
  - TS2694（L23, C29）：[syntax_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/net/index"' has no exported member 'URL'.
  - TS2304（L23, C35）：[syntax_check] Cannot find name 'Resources'.
  - TS2694（L25, C38）：[syntax_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/net/index"' has no exported member 'URLConnection'.
  - TS2304（L32, C37）：[syntax_check] Cannot find name 'DocumentBuilderFactory'.
  - TS2304（L32, C62）：[syntax_check] Cannot find name 'DocumentBuilderFactory'.
  - TS2304（L33, C30）：[syntax_check] Cannot find name 'DocumentBuilder'.
  - TS2531（L35, C32）：[syntax_check] Object is possibly 'null'.
  - TS2551（L35, C80）：[syntax_check] Property 'getChildNodes' does not exist on type 'Element'. Did you mean 'childNodes'?
  - TS2551（L37, C75）：[syntax_check] Property 'getLength' does not exist on type 'NodeList'. Did you mean 'length'?
  - TS2322（L38, C17）：[syntax_check] Type 'Node | null' is not assignable to type 'Node'.
  - TS2551（L40, C25）：[syntax_check] Property 'getNodeType' does not exist on type 'Node'. Did you mean 'nodeType'?
  - TS2551（L44, C54）：[syntax_check] Property 'getNodeName' does not exist on type 'Node'. Did you mean 'nodeName'?
  - TS2551（L46, C49）：[syntax_check] Property 'getChildNodes' does not exist on type 'Node'. Did you mean 'childNodes'?
  - TS2551（L48, C84）：[syntax_check] Property 'getLength' does not exist on type 'NodeList'. Did you mean 'length'?
  - TS2322（L49, C25）：[syntax_check] Type 'Node | null' is not assignable to type 'Node'.
  - TS2551（L51, C33）：[syntax_check] Property 'getNodeType' does not exist on type 'Node'. Did you mean 'nodeType'?
  - TS2339（L55, C69）：[syntax_check] Property 'getAttributes' does not exist on type 'Node'.
  - TS1210（L57, C25）：[syntax_check] Code contained in a class is evaluated in JavaScript's strict mode which does not allow this use of 'arguments'. For more information, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode.
  - TS2551（L57, C55）：[syntax_check] Property 'getChildNodes' does not exist on type 'Node'. Did you mean 'childNodes'?
  - TS2339（L64, C62）：[syntax_check] Property 'getAttributes' does not exist on type 'Node'.
  - TS2339（L65, C71）：[syntax_check] Property 'getAttributes' does not exist on type 'Node'.
  - TS2694（L70, C52）：[syntax_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/lang/index"' has no exported member 'reflect'.
  - TS2693（L70, C68）：[syntax_check] 'Parameters' only refers to a type, but is being used as a value here.
  - TS2693（L72, C55）：[syntax_check] 'int' only refers to a type, but is being used as a value here.
  - TS2693（L74, C62）：[syntax_check] 'float' only refers to a type, but is being used as a value here.
  - TS2339（L75, C67）：[syntax_check] Property 'Float' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/lang/index")'.
  - TS2693（L76, C62）：[syntax_check] 'double' only refers to a type, but is being used as a value here.
  - TS2339（L77, C67）：[syntax_check] Property 'Double' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/lang/index")'.
  - TS2693（L78, C62）：[syntax_check] 'boolean' only refers to a type, but is being used as a value here.
  - TS2339（L81, C45）：[syntax_check] Property 'ParseException' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/text/index")'.
  - TS2339（L86, C48）：[syntax_check] Property 'NoSuchFieldException' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/lang/index")'.
  - TS2694（L95, C56）：[syntax_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/lang/index"' has no exported member 'reflect'.
  - TS2304（L95, C72）：[syntax_check] Cannot find name 'Debug'.
  - TS2693（L97, C59）：[syntax_check] 'int' only refers to a type, but is being used as a value here.
  - TS2693（L99, C66）：[syntax_check] 'float' only refers to a type, but is being used as a value here.
  - TS2339（L100, C65）：[syntax_check] Property 'Float' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/lang/index")'.
  - TS2339（L102, C49）：[syntax_check] Property 'ParseException' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/text/index")'.
  - TS2339（L107, C52）：[syntax_check] Property 'NoSuchFieldException' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/lang/index")'.
  - TS1210（L119, C91）：[syntax_check] Code contained in a class is evaluated in JavaScript's strict mode which does not allow this use of 'arguments'. For more information, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode.
  - TS2304（L120, C19）：[syntax_check] Cannot find name 'Reasoner'.
  - TS2322（L121, C13）：[syntax_check] Type 'ArrayList<unknown>' is not assignable to type 'List<Class<unknown>>'.
  - TS2322（L122, C13）：[syntax_check] Type 'ArrayList<unknown>' is not assignable to type 'List<JavaObject>'.
  - TS2551（L124, C66）：[syntax_check] Property 'getLength' does not exist on type 'NodeList'. Did you mean 'length'?
  - TS2322（L125, C17）：[syntax_check] Type 'Node | null' is not assignable to type 'Node'.
  - TS2551（L127, C28）：[syntax_check] Property 'getNodeType' does not exist on type 'Node'. Did you mean 'nodeType'?
  - TS2322（L131, C17）：[syntax_check] Type 'null' is not assignable to type 'JavaString'.
  - TS2322（L132, C17）：[syntax_check] Type 'null' is not assignable to type 'JavaString'.
  - TS2339（L133, C57）：[syntax_check] Property 'getAttributes' does not exist on type 'Node'.
  - TS2339（L136, C41）：[syntax_check] Property 'getAttributes' does not exist on type 'Node'.
  - TS2339（L137, C42）：[syntax_check] Property 'getAttributes' does not exist on type 'Node'.
  - TS2304（L141, C27）：[syntax_check] Cannot find name 'Reasoner'.
  - TS2339（L144, C37）：[syntax_check] Property 'ParseException' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/text/index")'.
  - TS2693（L146, C27）：[syntax_check] 'int' only refers to a type, but is being used as a value here.
  - TS2345（L147, C28）：[syntax_check] Argument of type 'number' is not assignable to parameter of type 'JavaObject'.
  - TS2693（L149, C27）：[syntax_check] 'float' only refers to a type, but is being used as a value here.
  - TS2339（L150, C38）：[syntax_check] Property 'Float' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/lang/index")'.
  - TS2693（L152, C27）：[syntax_check] 'boolean' only refers to a type, but is being used as a value here.
  - TS2345（L153, C28）：[syntax_check] Argument of type 'boolean' is not assignable to parameter of type 'JavaObject'.
  - TS2339（L158, C37）：[syntax_check] Property 'ParseException' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/text/index")'.
  - TS2314（L162, C78）：[syntax_check] Generic type 'Class<T>' requires 1 type argument(s).
  - TS2339（L165, C59）：[syntax_check] Property 'forName' does not exist on type 'typeof Class'.
  - TS2339（L167, C39）：[syntax_check] Property 'getConstructor' does not exist on type 'Class<unknown>'.
- 总结：存在语法错误，需要比对 Java 语句结构。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

（无显式结构性依赖，主要依赖 `jree` 提供的运行时桩或尚未补齐的全局声明。）

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

- `[full_check] Cannot find name 'Reasoner'.` @ L12
- `[full_check] Cannot find name 'Resources'.` @ L23
- `[full_check] Cannot find name 'DocumentBuilderFactory'.` @ L32
- `[full_check] Cannot find name 'DocumentBuilderFactory'.` @ L32
- `[full_check] Cannot find name 'DocumentBuilder'.` @ L33
- `[full_check] Cannot find name 'Debug'.` @ L95
- `[full_check] Cannot find name 'Reasoner'.` @ L120
- `[full_check] Cannot find name 'Reasoner'.` @ L141
- `[syntax_check] Cannot find name 'Reasoner'.` @ L12
- `[syntax_check] Cannot find name 'Resources'.` @ L23
- `[syntax_check] Cannot find name 'DocumentBuilderFactory'.` @ L32
- `[syntax_check] Cannot find name 'DocumentBuilderFactory'.` @ L32
- `[syntax_check] Cannot find name 'DocumentBuilder'.` @ L33
- `[syntax_check] Cannot find name 'Debug'.` @ L95
- `[syntax_check] Cannot find name 'Reasoner'.` @ L120
- `[syntax_check] Cannot find name 'Reasoner'.` @ L141

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `io/ConfigReader` -> `interfaces/pub/Reasoner`（deps.xml 第 546 行）
- `io/ConfigReader` -> `parameter/Debug`（deps.xml 第 547 行）
- `io/ConfigReader` -> `parameter/Parameters`（deps.xml 第 548 行）
- `io/ConfigReader` -> `plugin/Plugin`（deps.xml 第 549 行）
- 交叉校验：
- Java graph 额外依赖：interfaces/pub/Reasoner、parameter/Debug、parameter/Parameters、plugin/Plugin

## 5. Java 功能说明

- **职责概述**：文件工作：将 java.io 流与事件转接到 Node 流 + EventEmitter，补宏 Parser/Narsese/Events 链路。
- **关键数据结构**：
- `ConfigReader` · 继承：JavaObject · 实现：（无接口）
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

- ts-analysis: LOC=170 · TODO=0
- 参考文件：`java-master/src/main/java/org/opennars/io/ConfigReader.java`
