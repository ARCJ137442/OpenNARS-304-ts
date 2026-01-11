# src/language/Negation.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/language/Negation.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/language/Negation.java` |
| 模块链路 | `language 基座` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/language/Negation.ts --noEmit`）

- 执行的命令：`npx tsc src/language/Negation.ts --noEmit`
- 关键输出：
  - TS2304（L11, C31）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L17, C30）：[full_check] Cannot find name 'Term'.
  - TS2339（L20, C23）：[full_check] Property 'cert' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/security/index")'.
  - TS2304（L20, C49）：[full_check] Cannot find name 'term'.
  - TS2304（L24, C16）：[full_check] Cannot find name 'makeCompoundName'.
  - TS2304（L24, C33）：[full_check] Cannot find name 'NativeOperator'.
  - TS2304（L24, C58）：[full_check] Cannot find name 'term'.
  - TS2304（L34, C28）：[full_check] Cannot find name 'Term'.
  - TS2304（L34, C37）：[full_check] Cannot find name 'Term'.
  - TS2304（L35, C50）：[full_check] Cannot find name 'Term'.
  - TS2304（L39, C37）：[full_check] Cannot find name 'term'.
  - TS2304（L46, C45）：[full_check] Cannot find name 'Term'.
  - TS2304（L73, C27）：[full_check] Cannot find name 'Term'.
  - TS2304（L73, C34）：[full_check] Cannot find name 'Term'.
  - TS2304（L81, C34）：[full_check] Cannot find name 'Term'.
  - TS2304（L81, C43）：[full_check] Cannot find name 'Term'.
  - TS2304（L82, C45）：[full_check] Cannot find name 'Term'.
  - TS2304（L85, C38）：[full_check] Cannot find name 'Term'.
  - TS2339（L90, C44）：[full_check] Property 'term' does not exist on type 'Negation'.
  - TS2304（L99, C45）：[full_check] Cannot find name 'Term'.
  - TS2304（L122, C24）：[full_check] Cannot find name 'NativeOperator'.
  - TS2304（L123, C16）：[full_check] Cannot find name 'NativeOperator'.
  - TS2304（L126, C42）：[full_check] Cannot find name 'Term'.
  - TS2304（L126, C53）：[full_check] Cannot find name 'Term'.
  - TS2304（L11, C31）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L17, C30）：[syntax_check] Cannot find name 'Term'.
  - TS2339（L20, C23）：[syntax_check] Property 'cert' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/security/index")'.
  - TS2304（L20, C49）：[syntax_check] Cannot find name 'term'.
  - TS2304（L24, C16）：[syntax_check] Cannot find name 'makeCompoundName'.
  - TS2304（L24, C33）：[syntax_check] Cannot find name 'NativeOperator'.
  - TS2304（L24, C58）：[syntax_check] Cannot find name 'term'.
  - TS2304（L34, C28）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L34, C37）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L35, C50）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L39, C37）：[syntax_check] Cannot find name 'term'.
  - TS2304（L46, C45）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L73, C27）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L73, C34）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L81, C34）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L81, C43）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L82, C45）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L85, C38）：[syntax_check] Cannot find name 'Term'.
  - TS2339（L90, C44）：[syntax_check] Property 'term' does not exist on type 'Negation'.
  - TS2304（L99, C45）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L122, C24）：[syntax_check] Cannot find name 'NativeOperator'.
  - TS2304（L123, C16）：[syntax_check] Cannot find name 'NativeOperator'.
  - TS2304（L126, C42）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L126, C53）：[syntax_check] Cannot find name 'Term'.
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
- `[full_check] Cannot find name 'Term'.` @ L17
- `[full_check] Cannot find name 'term'.` @ L20
- `[full_check] Cannot find name 'makeCompoundName'.` @ L24
- `[full_check] Cannot find name 'NativeOperator'.` @ L24
- `[full_check] Cannot find name 'term'.` @ L24
- `[full_check] Cannot find name 'Term'.` @ L34
- `[full_check] Cannot find name 'Term'.` @ L34
- `[full_check] Cannot find name 'Term'.` @ L35
- `[full_check] Cannot find name 'term'.` @ L39
- `[full_check] Cannot find name 'Term'.` @ L46
- `[full_check] Cannot find name 'Term'.` @ L73
- `[full_check] Cannot find name 'Term'.` @ L73
- `[full_check] Cannot find name 'Term'.` @ L81
- `[full_check] Cannot find name 'Term'.` @ L81
- `[full_check] Cannot find name 'Term'.` @ L82
- `[full_check] Cannot find name 'Term'.` @ L85
- `[full_check] Cannot find name 'Term'.` @ L99
- `[full_check] Cannot find name 'NativeOperator'.` @ L122
- `[full_check] Cannot find name 'NativeOperator'.` @ L123
- `[full_check] Cannot find name 'Term'.` @ L126
- `[full_check] Cannot find name 'Term'.` @ L126
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L11
- `[syntax_check] Cannot find name 'Term'.` @ L17
- `[syntax_check] Cannot find name 'term'.` @ L20
- `[syntax_check] Cannot find name 'makeCompoundName'.` @ L24
- `[syntax_check] Cannot find name 'NativeOperator'.` @ L24
- `[syntax_check] Cannot find name 'term'.` @ L24
- `[syntax_check] Cannot find name 'Term'.` @ L34
- `[syntax_check] Cannot find name 'Term'.` @ L34
- `[syntax_check] Cannot find name 'Term'.` @ L35
- `[syntax_check] Cannot find name 'term'.` @ L39
- `[syntax_check] Cannot find name 'Term'.` @ L46
- `[syntax_check] Cannot find name 'Term'.` @ L73
- `[syntax_check] Cannot find name 'Term'.` @ L73
- `[syntax_check] Cannot find name 'Term'.` @ L81
- `[syntax_check] Cannot find name 'Term'.` @ L81
- `[syntax_check] Cannot find name 'Term'.` @ L82
- `[syntax_check] Cannot find name 'Term'.` @ L85
- `[syntax_check] Cannot find name 'Term'.` @ L99
- `[syntax_check] Cannot find name 'NativeOperator'.` @ L122
- `[syntax_check] Cannot find name 'NativeOperator'.` @ L123
- `[syntax_check] Cannot find name 'Term'.` @ L126
- `[syntax_check] Cannot find name 'Term'.` @ L126

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `language/Negation` -> `language/CompoundTerm`（deps.xml 第 751 行）
- `language/Negation` -> `language/Term`（deps.xml 第 752 行）
- `language/Negation` -> `io/Symbols`（deps.xml 第 753 行）
- 交叉校验：
- Java graph 额外依赖：io/Symbols、language/CompoundTerm、language/Term

## 5. Java 功能说明

- **职责概述**：文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。
- **关键数据结构**：
- `Negation` · 继承：CompoundTerm · 实现：（无接口）
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

- ts-analysis: LOC=132 · TODO=0
- 参考文件：`java-master/src/main/java/org/opennars/language/Negation.java`
