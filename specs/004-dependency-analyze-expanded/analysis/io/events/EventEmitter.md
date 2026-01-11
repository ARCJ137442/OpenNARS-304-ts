# src/io/events/EventEmitter.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/io/events/EventEmitter.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/io/events/EventEmitter.java` |
| 模块链路 | `language 基座 -> entity -> io I/O 层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/io/events/EventEmitter.ts --noEmit`）

- 执行的命令：`npx tsc src/io/events/EventEmitter.ts --noEmit`
- 关键输出：
  - TS2339（L11, C48）：[full_check] Property 'Observable' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/util/index")'.
  - TS2322（L15, C22）：[full_check] Type 'ArrayDeque<unknown>' is not assignable to type 'Deque<JavaObject[]>'.
  - TS2322（L67, C9）：[full_check] Type 'ArrayList<unknown>' is not assignable to type 'List<EventObserver>'.
  - TS2531（L76, C21）：[full_check] Object is possibly 'null'.
  - TS2304（L86, C61）：[full_check] Cannot find name 'EventObserver'.
  - TS2531（L100, C13）：[full_check] Object is possibly 'null'.
  - TS2531（L120, C9）：[full_check] Object is possibly 'null'.
  - TS2322（L140, C13）：[full_check] Type 'List<EventObserver> | null' is not assignable to type 'List<EventObserver>'.
  - TS2339（L159, C57）：[full_check] Property 'Observer' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/util/index")'.
  - TS2339（L161, C18）：[full_check] Property 'update' does not exist on type 'DefaultEventObserver'.
  - TS2339（L11, C48）：[syntax_check] Property 'Observable' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/util/index")'.
  - TS2322（L15, C22）：[syntax_check] Type 'ArrayDeque<unknown>' is not assignable to type 'Deque<JavaObject[]>'.
  - TS2322（L67, C9）：[syntax_check] Type 'ArrayList<unknown>' is not assignable to type 'List<EventObserver>'.
  - TS2531（L76, C21）：[syntax_check] Object is possibly 'null'.
  - TS2304（L86, C61）：[syntax_check] Cannot find name 'EventObserver'.
  - TS2531（L100, C13）：[syntax_check] Object is possibly 'null'.
  - TS2531（L120, C9）：[syntax_check] Object is possibly 'null'.
  - TS2322（L140, C13）：[syntax_check] Type 'List<EventObserver> | null' is not assignable to type 'List<EventObserver>'.
  - TS2339（L159, C57）：[syntax_check] Property 'Observer' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/util/index")'.
  - TS2339（L161, C18）：[syntax_check] Property 'update' does not exist on type 'DefaultEventObserver'.
- 总结：存在语法错误，需要比对 Java 语句结构。；编译失败：TS1109 @ 113:30 Expression expected. ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

（无显式结构性依赖，主要依赖 `jree` 提供的运行时桩或尚未补齐的全局声明。）

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

- `[full_check] Cannot find name 'EventObserver'.` @ L86
- `[syntax_check] Cannot find name 'EventObserver'.` @ L86

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- deps.xml 未列出额外依赖。
- 交叉校验：
- TS 与 Java 依赖集合一致。

## 5. Java 功能说明

- **职责概述**：文件工作：将 java.io 流与事件转接到 Node 流 + EventEmitter，补宏 Parser/Narsese/Events 链路。；tsc TS1109 @ 113:30 错误；TODO 1 处
- **关键数据结构**：
- `EventEmitter` · 继承：JavaObject · 实现：（无接口）
- **核心流程 / 算法**：
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：将 java.io 流与事件转接到 Node 流 + EventEmitter，补宏 Parser/Narsese/Events 链路。；tsc TS1109 @ 113:30 错误；TODO 1 处
  3. Java-TS 差异：参见《通用转译法.md》 - I/O 与事件
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `Java Memory/Task 接口` 衔接上下游。

## 6. 一致性风险

- 文件内仍保留 1 处 TODO，需对照 Java 填补。
- `tsc` 报错阻塞进一步分析，需要回填语句结构。
- 缺少显式 import，需依赖 Java/ts-analysis 交叉校验。

## 7. 路线图定位

- 1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
- 2. 文件工作：将 java.io 流与事件转接到 Node 流 + EventEmitter，补宏 Parser/Narsese/Events 链路。；tsc TS1109 @ 113:30 错误；TODO 1 处
- 3. Java-TS 差异：参见《通用转译法.md》 - I/O 与事件

## 8. 附加记录

- ts-analysis: LOC=160 · TODO=1
- 参考文件：`java-master/src/main/java/org/opennars/io/events/EventEmitter.java`
