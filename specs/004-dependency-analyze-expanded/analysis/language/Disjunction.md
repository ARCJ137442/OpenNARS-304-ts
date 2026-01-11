# src/language/Disjunction.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/language/Disjunction.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/language/Disjunction.java` |
| 模块链路 | `language 基座` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/language/Disjunction.ts --noEmit`）

- 执行的命令：`npx tsc src/language/Disjunction.ts --noEmit`
- 关键输出：
  - TS2304（L11, C34）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L18, C30）：[full_check] Cannot find name 'Term'.
  - TS2304（L21, C13）：[full_check] Cannot find name 'Debug'.
  - TS2304（L22, C13）：[full_check] Cannot find name 'Terms'.
  - TS2339（L25, C23）：[full_check] Property 'cert' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/security/index")'.
  - TS2304（L35, C21）：[full_check] Cannot find name 'Term'.
  - TS2304（L35, C30）：[full_check] Cannot find name 'Term'.
  - TS2304（L36, C53）：[full_check] Cannot find name 'Term'.
  - TS2304（L40, C40）：[full_check] Cannot find name 'term'.
  - TS2304（L47, C38）：[full_check] Cannot find name 'Term'.
  - TS2304（L66, C27）：[full_check] Cannot find name 'Term'.
  - TS2304（L66, C36）：[full_check] Cannot find name 'Term'.
  - TS2304（L75, C31）：[full_check] Cannot find name 'Term'.
  - TS2304（L75, C44）：[full_check] Cannot find name 'Term'.
  - TS2304（L75, C51）：[full_check] Cannot find name 'Term'.
  - TS2304（L76, C45）：[full_check] Cannot find name 'Term'.
  - TS2304（L79, C38）：[full_check] Cannot find name 'Term'.
  - TS2588（L82, C17）：[full_check] Cannot assign to 't' because it is a constant.
  - TS2304（L82, C21）：[full_check] Cannot find name 'Term'.
  - TS2304（L98, C49）：[full_check] Cannot find name 'Term'.
  - TS2304（L98, C55）：[full_check] Cannot find name 'Term'.
  - TS2304（L101, C41）：[full_check] Cannot find name 'Term'.
  - TS2304（L103, C42）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L106, C46）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L113, C42）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L119, C63）：[full_check] Cannot find name 'Term'.
  - TS2304（L137, C24）：[full_check] Cannot find name 'NativeOperator'.
  - TS2304（L138, C16）：[full_check] Cannot find name 'NativeOperator'.
  - TS2304（L11, C34）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L18, C30）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L21, C13）：[syntax_check] Cannot find name 'Debug'.
  - TS2304（L22, C13）：[syntax_check] Cannot find name 'Terms'.
  - TS2339（L25, C23）：[syntax_check] Property 'cert' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/security/index")'.
  - TS2304（L35, C21）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L35, C30）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L36, C53）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L40, C40）：[syntax_check] Cannot find name 'term'.
  - TS2304（L47, C38）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L66, C27）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L66, C36）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L75, C31）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L75, C44）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L75, C51）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L76, C45）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L79, C38）：[syntax_check] Cannot find name 'Term'.
  - TS2588（L82, C17）：[syntax_check] Cannot assign to 't' because it is a constant.
  - TS2304（L82, C21）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L98, C49）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L98, C55）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L101, C41）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L103, C42）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L106, C46）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L113, C42）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L119, C63）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L137, C24）：[syntax_check] Cannot find name 'NativeOperator'.
  - TS2304（L138, C16）：[syntax_check] Cannot find name 'NativeOperator'.
- 总结：存在语法错误，需要比对 Java 语句结构。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

（无显式结构性依赖，主要依赖 `jree` 提供的运行时桩或尚未补齐的全局声明。）

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

- `[full_check] Cannot find name 'CompoundTerm'.` @ L11
- `[full_check] Cannot find name 'Term'.` @ L18
- `[full_check] Cannot find name 'Debug'.` @ L21
- `[full_check] Cannot find name 'Terms'.` @ L22
- `[full_check] Cannot find name 'Term'.` @ L35
- `[full_check] Cannot find name 'Term'.` @ L35
- `[full_check] Cannot find name 'Term'.` @ L36
- `[full_check] Cannot find name 'term'.` @ L40
- `[full_check] Cannot find name 'Term'.` @ L47
- `[full_check] Cannot find name 'Term'.` @ L66
- `[full_check] Cannot find name 'Term'.` @ L66
- `[full_check] Cannot find name 'Term'.` @ L75
- `[full_check] Cannot find name 'Term'.` @ L75
- `[full_check] Cannot find name 'Term'.` @ L75
- `[full_check] Cannot find name 'Term'.` @ L76
- `[full_check] Cannot find name 'Term'.` @ L79
- `[full_check] Cannot find name 'Term'.` @ L82
- `[full_check] Cannot find name 'Term'.` @ L98
- `[full_check] Cannot find name 'Term'.` @ L98
- `[full_check] Cannot find name 'Term'.` @ L101
- `[full_check] Cannot find name 'CompoundTerm'.` @ L103
- `[full_check] Cannot find name 'CompoundTerm'.` @ L106
- `[full_check] Cannot find name 'CompoundTerm'.` @ L113
- `[full_check] Cannot find name 'Term'.` @ L119
- `[full_check] Cannot find name 'NativeOperator'.` @ L137
- `[full_check] Cannot find name 'NativeOperator'.` @ L138
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L11
- `[syntax_check] Cannot find name 'Term'.` @ L18
- `[syntax_check] Cannot find name 'Debug'.` @ L21
- `[syntax_check] Cannot find name 'Terms'.` @ L22
- `[syntax_check] Cannot find name 'Term'.` @ L35
- `[syntax_check] Cannot find name 'Term'.` @ L35
- `[syntax_check] Cannot find name 'Term'.` @ L36
- `[syntax_check] Cannot find name 'term'.` @ L40
- `[syntax_check] Cannot find name 'Term'.` @ L47
- `[syntax_check] Cannot find name 'Term'.` @ L66
- `[syntax_check] Cannot find name 'Term'.` @ L66
- `[syntax_check] Cannot find name 'Term'.` @ L75
- `[syntax_check] Cannot find name 'Term'.` @ L75
- `[syntax_check] Cannot find name 'Term'.` @ L75
- `[syntax_check] Cannot find name 'Term'.` @ L76
- `[syntax_check] Cannot find name 'Term'.` @ L79
- `[syntax_check] Cannot find name 'Term'.` @ L82
- `[syntax_check] Cannot find name 'Term'.` @ L98
- `[syntax_check] Cannot find name 'Term'.` @ L98
- `[syntax_check] Cannot find name 'Term'.` @ L101
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L103
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L106
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L113
- `[syntax_check] Cannot find name 'Term'.` @ L119
- `[syntax_check] Cannot find name 'NativeOperator'.` @ L137
- `[syntax_check] Cannot find name 'NativeOperator'.` @ L138

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `language/Disjunction` -> `language/Terms`（deps.xml 第 662 行）
- `language/Disjunction` -> `language/CompoundTerm`（deps.xml 第 663 行）
- `language/Disjunction` -> `language/Term`（deps.xml 第 664 行）
- `language/Disjunction` -> `io/Symbols`（deps.xml 第 665 行）
- `language/Disjunction` -> `parameter/Debug`（deps.xml 第 666 行）
- 交叉校验：
- Java graph 额外依赖：io/Symbols、language/CompoundTerm、language/Term、language/Terms、parameter/Debug

## 5. Java 功能说明

- **职责概述**：文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。
- **关键数据结构**：
- `Disjunction` · 继承：CompoundTerm · 实现：（无接口）
- **核心流程 / 算法**：
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。
  3. Java-TS 差异：参见《通用转译法.md》 - 语言层
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `Java Memory/Task 接口` 衔接上下游。

## 6. 一致性风险

- `tsc` 报错阻塞进一步分析，需要回填语句结构。
- 缺少显式 import，需依赖 Java/ts-analysis 交叉校验。

## 7. 路线图定位

- 1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
- 2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。
- 3. Java-TS 差异：参见《通用转译法.md》 - 语言层

## 8. 附加记录

- ts-analysis: LOC=149 · TODO=0
- 参考文件：`java-master/src/main/java/org/opennars/language/Disjunction.java`
