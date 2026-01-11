# src/plugin/perception/SensoryChannel.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/plugin/perception/SensoryChannel.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/plugin/perception/SensoryChannel.java` |
| 模块链路 | `language 基座 -> entity -> operator -> plugin 扩展层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/plugin/perception/SensoryChannel.ts --noEmit`）

- 执行的命令：`npx tsc src/plugin/perception/SensoryChannel.ts --noEmit`
- 关键输出：
  - TS2420（L5, C23）：[full_check] Class 'SensoryChannel' incorrectly implements interface 'Plugin'.
  - TS2564（L6, C13）：[full_check] Property 'reportResultsTo' has no initializer and is not definitely assigned in the constructor.
  - TS2304（L7, C17）：[full_check] Cannot find name 'Nar'.
  - TS2304（L8, C45）：[full_check] Cannot find name 'Task'.
  - TS2304（L12, C20）：[full_check] Cannot find name 'Term'.
  - TS2304（L44, C29）：[full_check] Cannot find name 'Nar'.
  - TS2304（L45, C44）：[full_check] Cannot find name 'Term'.
  - TS2304（L47, C29）：[full_check] Cannot find name 'Nar'.
  - TS2304（L48, C31）：[full_check] Cannot find name 'Term'.
  - TS2304（L60, C89）：[full_check] Cannot find name 'Nar'.
  - TS2304（L60, C147）：[full_check] Cannot find name 'Term'.
  - TS2304（L76, C89）：[full_check] Cannot find name 'Nar'.
  - TS2304（L76, C125）：[full_check] Cannot find name 'Term'.
  - TS2349（L79, C17）：[full_check] This expression is not callable.
  - TS17009（L79, C17）：[full_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L92, C51）：[full_check] Cannot find name 'Timable'.
  - TS2304（L94, C20）：[full_check] Cannot find name 'Task'.
  - TS2304（L94, C31）：[full_check] Cannot find name 'Narsese'.
  - TS2304（L97, C31）：[full_check] Cannot find name 'Narsese'.
  - TS2339（L98, C34）：[full_check] Property 'Logger' does not exist on type 'typeof System'.
  - TS2339（L98, C104）：[full_check] Property 'Logger' does not exist on type 'typeof System'.
  - TS2345（L99, C84）：[full_check] Argument of type 'unknown' is not assignable to parameter of type 'Throwable | null'.
  - TS2512（L106, C21）：[full_check] Overload signatures must all be abstract or non-abstract.
  - TS2304（L106, C33）：[full_check] Cannot find name 'Task'.
  - TS2304（L106, C45）：[full_check] Cannot find name 'Timable'.
  - TS2304（L106, C55）：[full_check] Cannot find name 'Nar'.
  - TS2304（L108, C29）：[full_check] Cannot find name 'Timable'.
  - TS2304（L111, C32）：[full_check] Cannot find name 'Timable'.
  - TS2304（L120, C31）：[full_check] Cannot find name 'Term'.
  - TS2304（L128, C24）：[full_check] Cannot find name 'Term'.
  - TS2304（L129, C29）：[full_check] Cannot find name 'Nar'.
  - TS2304（L130, C20）：[full_check] Cannot find name 'Concept'.
  - TS2304（L130, C39）：[full_check] Cannot find name 'Nar'.
  - TS2304（L143, C26）：[full_check] Cannot find name 'Term'.
  - TS2420（L5, C23）：[syntax_check] Class 'SensoryChannel' incorrectly implements interface 'Plugin'.
  - TS2564（L6, C13）：[syntax_check] Property 'reportResultsTo' has no initializer and is not definitely assigned in the constructor.
  - TS2304（L7, C17）：[syntax_check] Cannot find name 'Nar'.
  - TS2304（L8, C45）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L12, C20）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L44, C29）：[syntax_check] Cannot find name 'Nar'.
  - TS2304（L45, C44）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L47, C29）：[syntax_check] Cannot find name 'Nar'.
  - TS2304（L48, C31）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L60, C89）：[syntax_check] Cannot find name 'Nar'.
  - TS2304（L60, C147）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L76, C89）：[syntax_check] Cannot find name 'Nar'.
  - TS2304（L76, C125）：[syntax_check] Cannot find name 'Term'.
  - TS2349（L79, C17）：[syntax_check] This expression is not callable.
  - TS17009（L79, C17）：[syntax_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L92, C51）：[syntax_check] Cannot find name 'Timable'.
  - TS2304（L94, C20）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L94, C31）：[syntax_check] Cannot find name 'Narsese'.
  - TS2304（L97, C31）：[syntax_check] Cannot find name 'Narsese'.
  - TS2339（L98, C34）：[syntax_check] Property 'Logger' does not exist on type 'typeof System'.
  - TS2339（L98, C104）：[syntax_check] Property 'Logger' does not exist on type 'typeof System'.
  - TS2345（L99, C84）：[syntax_check] Argument of type 'unknown' is not assignable to parameter of type 'Throwable | null'.
  - TS2512（L106, C21）：[syntax_check] Overload signatures must all be abstract or non-abstract.
  - TS2304（L106, C33）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L106, C45）：[syntax_check] Cannot find name 'Timable'.
  - TS2304（L106, C55）：[syntax_check] Cannot find name 'Nar'.
  - TS2304（L108, C29）：[syntax_check] Cannot find name 'Timable'.
  - TS2304（L111, C32）：[syntax_check] Cannot find name 'Timable'.
  - TS2304（L120, C31）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L128, C24）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L129, C29）：[syntax_check] Cannot find name 'Nar'.
  - TS2304（L130, C20）：[syntax_check] Cannot find name 'Concept'.
  - TS2304（L130, C39）：[syntax_check] Cannot find name 'Nar'.
  - TS2304（L143, C26）：[syntax_check] Cannot find name 'Term'.
- 总结：存在语法错误，需要比对 Java 语句结构。；编译失败：TS1135 @ 144:31 Argument expression expected.，另有 1 条 ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

（无显式结构性依赖，主要依赖 `jree` 提供的运行时桩或尚未补齐的全局声明。）

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

- `[full_check] Cannot find name 'Nar'.` @ L7
- `[full_check] Cannot find name 'Task'.` @ L8
- `[full_check] Cannot find name 'Term'.` @ L12
- `[full_check] Cannot find name 'Nar'.` @ L44
- `[full_check] Cannot find name 'Term'.` @ L45
- `[full_check] Cannot find name 'Nar'.` @ L47
- `[full_check] Cannot find name 'Term'.` @ L48
- `[full_check] Cannot find name 'Nar'.` @ L60
- `[full_check] Cannot find name 'Term'.` @ L60
- `[full_check] Cannot find name 'Nar'.` @ L76
- `[full_check] Cannot find name 'Term'.` @ L76
- `[full_check] Cannot find name 'Timable'.` @ L92
- `[full_check] Cannot find name 'Task'.` @ L94
- `[full_check] Cannot find name 'Narsese'.` @ L94
- `[full_check] Cannot find name 'Narsese'.` @ L97
- `[full_check] Cannot find name 'Task'.` @ L106
- `[full_check] Cannot find name 'Timable'.` @ L106
- `[full_check] Cannot find name 'Nar'.` @ L106
- `[full_check] Cannot find name 'Timable'.` @ L108
- `[full_check] Cannot find name 'Timable'.` @ L111
- `[full_check] Cannot find name 'Term'.` @ L120
- `[full_check] Cannot find name 'Term'.` @ L128
- `[full_check] Cannot find name 'Nar'.` @ L129
- `[full_check] Cannot find name 'Concept'.` @ L130
- `[full_check] Cannot find name 'Nar'.` @ L130
- `[full_check] Cannot find name 'Term'.` @ L143
- `[syntax_check] Cannot find name 'Nar'.` @ L7
- `[syntax_check] Cannot find name 'Task'.` @ L8
- `[syntax_check] Cannot find name 'Term'.` @ L12
- `[syntax_check] Cannot find name 'Nar'.` @ L44
- `[syntax_check] Cannot find name 'Term'.` @ L45
- `[syntax_check] Cannot find name 'Nar'.` @ L47
- `[syntax_check] Cannot find name 'Term'.` @ L48
- `[syntax_check] Cannot find name 'Nar'.` @ L60
- `[syntax_check] Cannot find name 'Term'.` @ L60
- `[syntax_check] Cannot find name 'Nar'.` @ L76
- `[syntax_check] Cannot find name 'Term'.` @ L76
- `[syntax_check] Cannot find name 'Timable'.` @ L92
- `[syntax_check] Cannot find name 'Task'.` @ L94
- `[syntax_check] Cannot find name 'Narsese'.` @ L94
- `[syntax_check] Cannot find name 'Narsese'.` @ L97
- `[syntax_check] Cannot find name 'Task'.` @ L106
- `[syntax_check] Cannot find name 'Timable'.` @ L106
- `[syntax_check] Cannot find name 'Nar'.` @ L106
- `[syntax_check] Cannot find name 'Timable'.` @ L108
- `[syntax_check] Cannot find name 'Timable'.` @ L111
- `[syntax_check] Cannot find name 'Term'.` @ L120
- `[syntax_check] Cannot find name 'Term'.` @ L128
- `[syntax_check] Cannot find name 'Nar'.` @ L129
- `[syntax_check] Cannot find name 'Concept'.` @ L130
- `[syntax_check] Cannot find name 'Nar'.` @ L130
- `[syntax_check] Cannot find name 'Term'.` @ L143

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `plugin/perception/SensoryChannel` -> `io/Parser`（deps.xml 第 1306 行）
- `plugin/perception/SensoryChannel` -> `entity/Concept`（deps.xml 第 1307 行）
- `plugin/perception/SensoryChannel` -> `plugin/Plugin`（deps.xml 第 1308 行）
- `plugin/perception/SensoryChannel` -> `entity/Item`（deps.xml 第 1309 行）
- `plugin/perception/SensoryChannel` -> `entity/Task`（deps.xml 第 1310 行）
- `plugin/perception/SensoryChannel` -> `main/Nar`（deps.xml 第 1311 行）
- `plugin/perception/SensoryChannel` -> `io/Narsese`（deps.xml 第 1312 行）
- `plugin/perception/SensoryChannel` -> `interfaces/Timable`（deps.xml 第 1313 行）
- `plugin/perception/SensoryChannel` -> `storage/Memory`（deps.xml 第 1314 行）
- `plugin/perception/SensoryChannel` -> `language/Term`（deps.xml 第 1315 行）
- 交叉校验：
- Java graph 额外依赖：entity/Concept、entity/Item、entity/Task、interfaces/Timable、io/Narsese、io/Parser、language/Term、main/Nar、plugin/Plugin、storage/Memory

## 5. Java 功能说明

- **职责概述**：文件工作：为心理/感知插件提供事件通道、状态缓存与关闭流程。；tsc TS1135 @ 144:31 错误
- **关键数据结构**：
- `SensoryChannel` · 继承：JavaObject · 实现：Plugin
- **核心流程 / 算法**：
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：为心理/感知插件提供事件通道、状态缓存与关闭流程。；tsc TS1135 @ 144:31 错误
  3. Java-TS 差异：参见《通用转译法.md》 - 插件
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `Java Memory/Task 接口` 衔接上下游。

## 6. 一致性风险

- `tsc` 报错阻塞进一步分析，需要回填语句结构。
- 缺少显式 import，需依赖 Java/ts-analysis 交叉校验。

## 7. 路线图定位

- 1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
- 2. 文件工作：为心理/感知插件提供事件通道、状态缓存与关闭流程。；tsc TS1135 @ 144:31 错误
- 3. Java-TS 差异：参见《通用转译法.md》 - 插件

## 8. 附加记录

- ts-analysis: LOC=147 · TODO=0
- 参考文件：`java-master/src/main/java/org/opennars/plugin/perception/SensoryChannel.java`
