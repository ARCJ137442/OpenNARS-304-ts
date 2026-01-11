# src/main/Shell.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/main/Shell.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/main/Shell.java` |
| 模块链路 | `language 基座 -> entity -> control -> main 应用层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/main/Shell.ts --noEmit`）

- 执行的命令：`npx tsc src/main/Shell.ts --noEmit`
- 关键输出：
  - TS2304（L12, C27）：[full_check] Cannot find name 'Nar'.
  - TS2304（L15, C56）：[full_check] Cannot find name 'Nar'.
  - TS2304（L16, C18）：[full_check] Cannot find name 'Nar'.
  - TS2322（L17, C13）：[full_check] Type 'null' is not assignable to type 'Integer'.
  - TS2339（L18, C22）：[full_check] Property 'toLowerCase' does not exist on type 'JavaString'.
  - TS2322（L19, C13）：[full_check] Type 'number' is not assignable to type 'Integer'.
  - TS2339（L22, C21）：[full_check] Property 'toLowerCase' does not exist on type 'JavaString'.
  - TS2304（L24, C27）：[full_check] Cannot find name 'Nar'.
  - TS2304（L26, C27）：[full_check] Cannot find name 'Nar'.
  - TS2339（L28, C28）：[full_check] Property 'endsWith' does not exist on type 'JavaString'.
  - TS2304（L30, C27）：[full_check] Cannot find name 'Nar'.
  - TS2304（L32, C27）：[full_check] Cannot find name 'Nar'.
  - TS2339（L38, C34）：[full_check] Property 'exit' does not exist on type 'typeof System'.
  - TS2304（L40, C19）：[full_check] Cannot find name 'Nar'.
  - TS2322（L72, C21）：[full_check] Type 'string' is not assignable to type 'JavaString'.
  - TS2322（L72, C29）：[full_check] Type 'string' is not assignable to type 'JavaString'.
  - TS2322（L72, C37）：[full_check] Type 'string' is not assignable to type 'JavaString'.
  - TS2322（L72, C45）：[full_check] Type 'string' is not assignable to type 'JavaString'.
  - TS2339（L76, C30）：[full_check] Property 'exit' does not exist on type 'typeof System'.
  - TS2345（L79, C19）：[full_check] Argument of type 'string' is not assignable to parameter of type 'JavaString'.
  - TS2339（L79, C65）：[full_check] Property 'join' does not exist on type 'typeof JavaString'.
  - TS2304（L80, C18）：[full_check] Cannot find name 'Nar'.
  - TS2345（L83, C23）：[full_check] Argument of type 'string' is not assignable to parameter of type 'JavaString'.
  - TS2304（L85, C23）：[full_check] Cannot find name 'NarNode'.
  - TS2304（L85, C37）：[full_check] Cannot find name 'NarNode'.
  - TS2304（L87, C24）：[full_check] Cannot find name 'Term'.
  - TS2339（L87, C43）：[full_check] Property 'toLowerCase' does not exist on type 'JavaString'.
  - TS2304（L87, C85）：[full_check] Cannot find name 'Term'.
  - TS2339（L88, C99）：[full_check] Property 'Float' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/lang/index")'.
  - TS2345（L93, C19）：[full_check] Argument of type 'string' is not assignable to parameter of type 'JavaString'.
  - TS2304（L97, C27）：[full_check] Cannot find name 'Nar'.
  - TS2339（L103, C52）：[full_check] Property 'Thread' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/lang/index")'.
  - TS2304（L105, C37）：[full_check] Cannot find name 'Nar'.
  - TS2377（L107, C13）：[full_check] Constructors for derived classes must contain a 'super' call.
  - TS2304（L107, C74）：[full_check] Cannot find name 'Nar'.
  - TS17009（L108, C17）：[full_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS17009（L109, C17）：[full_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS4112（L112, C30）：[full_check] This member cannot have an 'override' modifier because its containing class 'InputThread' does not extend another class.
  - TS2322（L115, C29）：[full_check] Type 'JavaString | null' is not assignable to type 'JavaString'.
  - TS2304（L121, C41）：[full_check] Cannot find name 'Debug'.
  - TS2339（L141, C35）：[full_check] Property 'Thread' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/lang/index")'.
  - TS2339（L143, C52）：[full_check] Property 'InterruptedException' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/lang/index")'.
  - TS2345（L144, C122）：[full_check] Argument of type 'unknown' is not assignable to parameter of type 'Throwable | null'.
  - TS2304（L160, C21）：[full_check] Cannot find name 'TextOutputHandler'.
  - TS2304（L160, C45）：[full_check] Cannot find name 'TextOutputHandler'.
  - TS2339（L165, C46）：[full_check] Property 'toLowerCase' does not exist on type 'JavaString'.
  - TS2339（L166, C50）：[full_check] Property 'toLowerCase' does not exist on type 'JavaString'.
  - TS2663（L171, C18）：[full_check] Cannot find name 'InputThread'. Did you mean the instance member 'this.InputThread'?
  - TS2339（L171, C47）：[full_check] Property 'in' does not exist on type 'typeof System'.
  - TS2339（L178, C30）：[full_check] Property 'exit' does not exist on type 'typeof System'.
  - TS2344（L191, C44）：[full_check] Type 'typeof InputThread' does not satisfy the constraint 'abstract new (...args: any) => any'.
  - TS2304（L12, C27）：[syntax_check] Cannot find name 'Nar'.
  - TS2304（L15, C56）：[syntax_check] Cannot find name 'Nar'.
  - TS2304（L16, C18）：[syntax_check] Cannot find name 'Nar'.
  - TS2322（L17, C13）：[syntax_check] Type 'null' is not assignable to type 'Integer'.
  - TS2339（L18, C22）：[syntax_check] Property 'toLowerCase' does not exist on type 'JavaString'.
  - TS2322（L19, C13）：[syntax_check] Type 'number' is not assignable to type 'Integer'.
  - TS2339（L22, C21）：[syntax_check] Property 'toLowerCase' does not exist on type 'JavaString'.
  - TS2304（L24, C27）：[syntax_check] Cannot find name 'Nar'.
  - TS2304（L26, C27）：[syntax_check] Cannot find name 'Nar'.
  - TS2339（L28, C28）：[syntax_check] Property 'endsWith' does not exist on type 'JavaString'.
  - TS2304（L30, C27）：[syntax_check] Cannot find name 'Nar'.
  - TS2304（L32, C27）：[syntax_check] Cannot find name 'Nar'.
  - TS2339（L38, C34）：[syntax_check] Property 'exit' does not exist on type 'typeof System'.
  - TS2304（L40, C19）：[syntax_check] Cannot find name 'Nar'.
  - TS2322（L72, C21）：[syntax_check] Type 'string' is not assignable to type 'JavaString'.
  - TS2322（L72, C29）：[syntax_check] Type 'string' is not assignable to type 'JavaString'.
  - TS2322（L72, C37）：[syntax_check] Type 'string' is not assignable to type 'JavaString'.
  - TS2322（L72, C45）：[syntax_check] Type 'string' is not assignable to type 'JavaString'.
  - TS2339（L76, C30）：[syntax_check] Property 'exit' does not exist on type 'typeof System'.
  - TS2345（L79, C19）：[syntax_check] Argument of type 'string' is not assignable to parameter of type 'JavaString'.
  - TS2339（L79, C65）：[syntax_check] Property 'join' does not exist on type 'typeof JavaString'.
  - TS2304（L80, C18）：[syntax_check] Cannot find name 'Nar'.
  - TS2345（L83, C23）：[syntax_check] Argument of type 'string' is not assignable to parameter of type 'JavaString'.
  - TS2304（L85, C23）：[syntax_check] Cannot find name 'NarNode'.
  - TS2304（L85, C37）：[syntax_check] Cannot find name 'NarNode'.
  - TS2304（L87, C24）：[syntax_check] Cannot find name 'Term'.
  - TS2339（L87, C43）：[syntax_check] Property 'toLowerCase' does not exist on type 'JavaString'.
  - TS2304（L87, C85）：[syntax_check] Cannot find name 'Term'.
  - TS2339（L88, C99）：[syntax_check] Property 'Float' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/lang/index")'.
  - TS2345（L93, C19）：[syntax_check] Argument of type 'string' is not assignable to parameter of type 'JavaString'.
  - TS2304（L97, C27）：[syntax_check] Cannot find name 'Nar'.
  - TS2339（L103, C52）：[syntax_check] Property 'Thread' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/lang/index")'.
  - TS2304（L105, C37）：[syntax_check] Cannot find name 'Nar'.
  - TS2377（L107, C13）：[syntax_check] Constructors for derived classes must contain a 'super' call.
  - TS2304（L107, C74）：[syntax_check] Cannot find name 'Nar'.
  - TS17009（L108, C17）：[syntax_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS17009（L109, C17）：[syntax_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS4112（L112, C30）：[syntax_check] This member cannot have an 'override' modifier because its containing class 'InputThread' does not extend another class.
  - TS2322（L115, C29）：[syntax_check] Type 'JavaString | null' is not assignable to type 'JavaString'.
  - TS2304（L121, C41）：[syntax_check] Cannot find name 'Debug'.
  - TS2339（L141, C35）：[syntax_check] Property 'Thread' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/lang/index")'.
  - TS2339（L143, C52）：[syntax_check] Property 'InterruptedException' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/lang/index")'.
  - TS2345（L144, C122）：[syntax_check] Argument of type 'unknown' is not assignable to parameter of type 'Throwable | null'.
  - TS2304（L160, C21）：[syntax_check] Cannot find name 'TextOutputHandler'.
  - TS2304（L160, C45）：[syntax_check] Cannot find name 'TextOutputHandler'.
  - TS2339（L165, C46）：[syntax_check] Property 'toLowerCase' does not exist on type 'JavaString'.
  - TS2339（L166, C50）：[syntax_check] Property 'toLowerCase' does not exist on type 'JavaString'.
  - TS2663（L171, C18）：[syntax_check] Cannot find name 'InputThread'. Did you mean the instance member 'this.InputThread'?
  - TS2339（L171, C47）：[syntax_check] Property 'in' does not exist on type 'typeof System'.
  - TS2339（L178, C30）：[syntax_check] Property 'exit' does not exist on type 'typeof System'.
  - TS2344（L191, C44）：[syntax_check] Type 'typeof InputThread' does not satisfy the constraint 'abstract new (...args: any) => any'.
- 总结：存在语法错误，需要比对 Java 语句结构。；编译失败：TS1359 @ 107:35 Identifier expected. 'in' is a reserved word that cannot be used here.，另有 2 条 ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

（无显式结构性依赖，主要依赖 `jree` 提供的运行时桩或尚未补齐的全局声明。）

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

- `[full_check] Cannot find name 'Nar'.` @ L12
- `[full_check] Cannot find name 'Nar'.` @ L15
- `[full_check] Cannot find name 'Nar'.` @ L16
- `[full_check] Cannot find name 'Nar'.` @ L24
- `[full_check] Cannot find name 'Nar'.` @ L26
- `[full_check] Cannot find name 'Nar'.` @ L30
- `[full_check] Cannot find name 'Nar'.` @ L32
- `[full_check] Cannot find name 'Nar'.` @ L40
- `[full_check] Cannot find name 'Nar'.` @ L80
- `[full_check] Cannot find name 'NarNode'.` @ L85
- `[full_check] Cannot find name 'NarNode'.` @ L85
- `[full_check] Cannot find name 'Term'.` @ L87
- `[full_check] Cannot find name 'Term'.` @ L87
- `[full_check] Cannot find name 'Nar'.` @ L97
- `[full_check] Cannot find name 'Nar'.` @ L105
- `[full_check] Cannot find name 'Nar'.` @ L107
- `[full_check] Cannot find name 'Debug'.` @ L121
- `[full_check] Cannot find name 'TextOutputHandler'.` @ L160
- `[full_check] Cannot find name 'TextOutputHandler'.` @ L160
- `[full_check] Cannot find name 'InputThread'. Did you mean the instance member 'this.InputThread'?` @ L171
- `[syntax_check] Cannot find name 'Nar'.` @ L12
- `[syntax_check] Cannot find name 'Nar'.` @ L15
- `[syntax_check] Cannot find name 'Nar'.` @ L16
- `[syntax_check] Cannot find name 'Nar'.` @ L24
- `[syntax_check] Cannot find name 'Nar'.` @ L26
- `[syntax_check] Cannot find name 'Nar'.` @ L30
- `[syntax_check] Cannot find name 'Nar'.` @ L32
- `[syntax_check] Cannot find name 'Nar'.` @ L40
- `[syntax_check] Cannot find name 'Nar'.` @ L80
- `[syntax_check] Cannot find name 'NarNode'.` @ L85
- `[syntax_check] Cannot find name 'NarNode'.` @ L85
- `[syntax_check] Cannot find name 'Term'.` @ L87
- `[syntax_check] Cannot find name 'Term'.` @ L87
- `[syntax_check] Cannot find name 'Nar'.` @ L97
- `[syntax_check] Cannot find name 'Nar'.` @ L105
- `[syntax_check] Cannot find name 'Nar'.` @ L107
- `[syntax_check] Cannot find name 'Debug'.` @ L121
- `[syntax_check] Cannot find name 'TextOutputHandler'.` @ L160
- `[syntax_check] Cannot find name 'TextOutputHandler'.` @ L160
- `[syntax_check] Cannot find name 'InputThread'. Did you mean the instance member 'this.InputThread'?` @ L171

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `main/Shell` -> `io/events/TextOutputHandler`（deps.xml 第 920 行）
- `main/Shell` -> `main/NarNode`（deps.xml 第 921 行）
- `main/Shell` -> `language/Term`（deps.xml 第 922 行）
- `main/Shell` -> `parameter/Debug`（deps.xml 第 923 行）
- `main/Shell` -> `main/Nar`（deps.xml 第 924 行）
- 交叉校验：
- Java graph 额外依赖：io/events/TextOutputHandler、language/Term、main/Nar、main/NarNode、parameter/Debug

## 5. Java 功能说明

- **职责概述**：文件工作：把 Nar/NarNode/Shell 生命周期、线程和 CLI 搭到 Node 异步控制器上。；tsc TS1359 @ 107:35 错误；TODO 1 处
- **关键数据结构**：
- `Shell` · 继承：JavaObject · 实现：（无接口）
- **核心流程 / 算法**：
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：把 Nar/NarNode/Shell 生命周期、线程和 CLI 搭到 Node 异步控制器上。；tsc TS1359 @ 107:35 错误；TODO 1 处
  3. Java-TS 差异：参见《通用转译法.md》 - 主程序
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `Java Memory/Task 接口` 衔接上下游。

## 6. 一致性风险

- 文件内仍保留 1 处 TODO，需对照 Java 填补。
- `tsc` 报错阻塞进一步分析，需要回填语句结构。
- 缺少显式 import，需依赖 Java/ts-analysis 交叉校验。

## 7. 路线图定位

- 1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
- 2. 文件工作：把 Nar/NarNode/Shell 生命周期、线程和 CLI 搭到 Node 异步控制器上。；tsc TS1359 @ 107:35 错误；TODO 1 处
- 3. Java-TS 差异：参见《通用转译法.md》 - 主程序

## 8. 附加记录

- ts-analysis: LOC=195 · TODO=1
- 参考文件：`java-master/src/main/java/org/opennars/main/Shell.java`
