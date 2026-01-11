# src/io/Texts.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/io/Texts.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/io/Texts.java` |
| 模块链路 | `language 基座 -> entity -> io I/O 层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/io/Texts.ts --noEmit`）

- 执行的命令：`npx tsc src/io/Texts.ts --noEmit`
- 关键输出：
  - TS2322（L29, C13）：[full_check] Type 'null' is not assignable to type 'CharSequence'.
  - TS2322（L38, C13）：[full_check] Type 'null' is not assignable to type 'CharSequence'.
  - TS2339（L55, C77）：[full_check] Property 'DecimalFormat' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/text/index")'.
  - TS2339（L61, C76）：[full_check] Property 'DecimalFormat' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/text/index")'.
  - TS2352（L68, C16）：[full_check] Conversion of type 'number' to type 'bigint' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  - TS2352（L72, C16）：[full_check] Conversion of type 'number' to type 'bigint' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  - TS2349（L87, C39）：[full_check] This expression is not callable.
  - TS2448（L87, C39）：[full_check] Block-scoped variable 'hundredths' used before its declaration.
  - TS2454（L87, C39）：[full_check] Variable 'hundredths' is used before being assigned.
  - TS2322（L91, C25）：[full_check] Type 'string' is not assignable to type 'CharSequence'.
  - TS2322（L93, C25）：[full_check] Type 'string' is not assignable to type 'CharSequence'.
  - TS2322（L95, C25）：[full_check] Type 'string' is not assignable to type 'CharSequence'.
  - TS2322（L97, C25）：[full_check] Type 'string' is not assignable to type 'CharSequence'.
  - TS2769（L105, C49）：[full_check] No overload matches this call.
  - TS2352（L106, C35）：[full_check] Conversion of type 'string' to type 'number' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  - TS2352（L106, C57）：[full_check] Conversion of type 'string' to type 'number' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  - TS2769（L109, C49）：[full_check] No overload matches this call.
  - TS2352（L110, C40）：[full_check] Conversion of type 'string' to type 'number' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  - TS2339（L135, C76）：[full_check] Property 'DecimalFormat' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/text/index")'.
  - TS2322（L154, C17）：[full_check] Type 'number | null' is not assignable to type 'number'.
  - TS2322（L155, C17）：[full_check] Type 'number | null' is not assignable to type 'number'.
  - TS2322（L29, C13）：[syntax_check] Type 'null' is not assignable to type 'CharSequence'.
  - TS2322（L38, C13）：[syntax_check] Type 'null' is not assignable to type 'CharSequence'.
  - TS2339（L55, C77）：[syntax_check] Property 'DecimalFormat' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/text/index")'.
  - TS2339（L61, C76）：[syntax_check] Property 'DecimalFormat' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/text/index")'.
  - TS2352（L68, C16）：[syntax_check] Conversion of type 'number' to type 'bigint' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  - TS2352（L72, C16）：[syntax_check] Conversion of type 'number' to type 'bigint' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  - TS2349（L87, C39）：[syntax_check] This expression is not callable.
  - TS2448（L87, C39）：[syntax_check] Block-scoped variable 'hundredths' used before its declaration.
  - TS2454（L87, C39）：[syntax_check] Variable 'hundredths' is used before being assigned.
  - TS2322（L91, C25）：[syntax_check] Type 'string' is not assignable to type 'CharSequence'.
  - TS2322（L93, C25）：[syntax_check] Type 'string' is not assignable to type 'CharSequence'.
  - TS2322（L95, C25）：[syntax_check] Type 'string' is not assignable to type 'CharSequence'.
  - TS2322（L97, C25）：[syntax_check] Type 'string' is not assignable to type 'CharSequence'.
  - TS2769（L105, C49）：[syntax_check] No overload matches this call.
  - TS2352（L106, C35）：[syntax_check] Conversion of type 'string' to type 'number' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  - TS2352（L106, C57）：[syntax_check] Conversion of type 'string' to type 'number' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  - TS2769（L109, C49）：[syntax_check] No overload matches this call.
  - TS2352（L110, C40）：[syntax_check] Conversion of type 'string' to type 'number' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  - TS2339（L135, C76）：[syntax_check] Property 'DecimalFormat' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/text/index")'.
  - TS2322（L154, C17）：[syntax_check] Type 'number | null' is not assignable to type 'number'.
  - TS2322（L155, C17）：[syntax_check] Type 'number | null' is not assignable to type 'number'.
- 总结：存在语法错误，需要比对 Java 语句结构。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

（无显式结构性依赖，主要依赖 `jree` 提供的运行时桩或尚未补齐的全局声明。）

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

（无缺失符号，报错均与语法结构相关。）

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- deps.xml 未列出额外依赖。
- 交叉校验：
- TS 与 Java 依赖集合一致。

## 5. Java 功能说明

- **职责概述**：文件工作：将 java.io 流与事件转接到 Node 流 + EventEmitter，补宏 Parser/Narsese/Events 链路。；TODO 1 处
- **关键数据结构**：
- `Texts` · 继承：JavaObject · 实现：（无接口）
- **核心流程 / 算法**：
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：将 java.io 流与事件转接到 Node 流 + EventEmitter，补宏 Parser/Narsese/Events 链路。；TODO 1 处
  3. Java-TS 差异：参见《通用转译法.md》 - I/O 与事件
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `Java Memory/Task 接口` 衔接上下游。

## 6. 一致性风险

- 文件内仍保留 1 处 TODO，需对照 Java 填补。
- `tsc` 报错阻塞进一步分析，需要回填语句结构。
- 缺少显式 import，需依赖 Java/ts-analysis 交叉校验。

## 7. 路线图定位

- 1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
- 2. 文件工作：将 java.io 流与事件转接到 Node 流 + EventEmitter，补宏 Parser/Narsese/Events 链路。；TODO 1 处
- 3. Java-TS 差异：参见《通用转译法.md》 - I/O 与事件

## 8. 附加记录

- ts-analysis: LOC=168 · TODO=1
- 参考文件：`java-master/src/main/java/org/opennars/io/Texts.java`
