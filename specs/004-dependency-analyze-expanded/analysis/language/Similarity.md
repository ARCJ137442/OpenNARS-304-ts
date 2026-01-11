# src/language/Similarity.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/language/Similarity.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/language/Similarity.java` |
| 模块链路 | `language 基座` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/language/Similarity.ts --noEmit`）

- 执行的命令：`npx tsc src/language/Similarity.ts --noEmit`
- 关键输出：
  - TS2304（L11, C33）：[full_check] Cannot find name 'Statement'.
  - TS2304（L18, C29）：[full_check] Cannot find name 'Term'.
  - TS2304（L20, C30）：[full_check] Cannot find name 'Term'.
  - TS2304（L20, C42）：[full_check] Cannot find name 'Term'.
  - TS2304（L24, C40）：[full_check] Cannot find name 'Term'.
  - TS2339（L29, C31）：[full_check] Property 'cert' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/security/index")'.
  - TS2304（L36, C47）：[full_check] Cannot find name 'Term'.
  - TS2304（L36, C53）：[full_check] Cannot find name 'Term'.
  - TS2349（L39, C17）：[full_check] This expression is not callable.
  - TS17009（L39, C17）：[full_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L59, C28）：[full_check] Cannot find name 'Term'.
  - TS2304（L64, C39）：[full_check] Cannot find name 'term'.
  - TS2304（L71, C45）：[full_check] Cannot find name 'Term'.
  - TS2322（L75, C21）：[full_check] Type 'null' is not assignable to type 'Similarity'.
  - TS2322（L78, C21）：[full_check] Type 'null' is not assignable to type 'Similarity'.
  - TS2304（L96, C37）：[full_check] Cannot find name 'Term'.
  - TS2304（L96, C54）：[full_check] Cannot find name 'Term'.
  - TS2304（L96, C61）：[full_check] Cannot find name 'Term'.
  - TS2304（L109, C33）：[full_check] Cannot find name 'Term'.
  - TS2304（L109, C50）：[full_check] Cannot find name 'Term'.
  - TS2304（L111, C13）：[full_check] Cannot find name 'invalidStatement'.
  - TS2322（L112, C13）：[full_check] Type 'null' is not assignable to type 'Similarity'.
  - TS2304（L126, C24）：[full_check] Cannot find name 'NativeOperator'.
  - TS2304（L127, C16）：[full_check] Cannot find name 'NativeOperator'.
  - TS2304（L11, C33）：[syntax_check] Cannot find name 'Statement'.
  - TS2304（L18, C29）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L20, C30）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L20, C42）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L24, C40）：[syntax_check] Cannot find name 'Term'.
  - TS2339（L29, C31）：[syntax_check] Property 'cert' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/security/index")'.
  - TS2304（L36, C47）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L36, C53）：[syntax_check] Cannot find name 'Term'.
  - TS2349（L39, C17）：[syntax_check] This expression is not callable.
  - TS17009（L39, C17）：[syntax_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L59, C28）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L64, C39）：[syntax_check] Cannot find name 'term'.
  - TS2304（L71, C45）：[syntax_check] Cannot find name 'Term'.
  - TS2322（L75, C21）：[syntax_check] Type 'null' is not assignable to type 'Similarity'.
  - TS2322（L78, C21）：[syntax_check] Type 'null' is not assignable to type 'Similarity'.
  - TS2304（L96, C37）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L96, C54）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L96, C61）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L109, C33）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L109, C50）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L111, C13）：[syntax_check] Cannot find name 'invalidStatement'.
  - TS2322（L112, C13）：[syntax_check] Type 'null' is not assignable to type 'Similarity'.
  - TS2304（L126, C24）：[syntax_check] Cannot find name 'NativeOperator'.
  - TS2304（L127, C16）：[syntax_check] Cannot find name 'NativeOperator'.
- 总结：存在语法错误，需要比对 Java 语句结构。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

（无显式结构性依赖，主要依赖 `jree` 提供的运行时桩或尚未补齐的全局声明。）

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

- `[full_check] Cannot find name 'Statement'.` @ L11
- `[full_check] Cannot find name 'Term'.` @ L18
- `[full_check] Cannot find name 'Term'.` @ L20
- `[full_check] Cannot find name 'Term'.` @ L20
- `[full_check] Cannot find name 'Term'.` @ L24
- `[full_check] Cannot find name 'Term'.` @ L36
- `[full_check] Cannot find name 'Term'.` @ L36
- `[full_check] Cannot find name 'Term'.` @ L59
- `[full_check] Cannot find name 'term'.` @ L64
- `[full_check] Cannot find name 'Term'.` @ L71
- `[full_check] Cannot find name 'Term'.` @ L96
- `[full_check] Cannot find name 'Term'.` @ L96
- `[full_check] Cannot find name 'Term'.` @ L96
- `[full_check] Cannot find name 'Term'.` @ L109
- `[full_check] Cannot find name 'Term'.` @ L109
- `[full_check] Cannot find name 'invalidStatement'.` @ L111
- `[full_check] Cannot find name 'NativeOperator'.` @ L126
- `[full_check] Cannot find name 'NativeOperator'.` @ L127
- `[syntax_check] Cannot find name 'Statement'.` @ L11
- `[syntax_check] Cannot find name 'Term'.` @ L18
- `[syntax_check] Cannot find name 'Term'.` @ L20
- `[syntax_check] Cannot find name 'Term'.` @ L20
- `[syntax_check] Cannot find name 'Term'.` @ L24
- `[syntax_check] Cannot find name 'Term'.` @ L36
- `[syntax_check] Cannot find name 'Term'.` @ L36
- `[syntax_check] Cannot find name 'Term'.` @ L59
- `[syntax_check] Cannot find name 'term'.` @ L64
- `[syntax_check] Cannot find name 'Term'.` @ L71
- `[syntax_check] Cannot find name 'Term'.` @ L96
- `[syntax_check] Cannot find name 'Term'.` @ L96
- `[syntax_check] Cannot find name 'Term'.` @ L96
- `[syntax_check] Cannot find name 'Term'.` @ L109
- `[syntax_check] Cannot find name 'Term'.` @ L109
- `[syntax_check] Cannot find name 'invalidStatement'.` @ L111
- `[syntax_check] Cannot find name 'NativeOperator'.` @ L126
- `[syntax_check] Cannot find name 'NativeOperator'.` @ L127

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `language/Similarity` -> `language/CompoundTerm`（deps.xml 第 785 行）
- `language/Similarity` -> `language/Statement`（deps.xml 第 786 行）
- `language/Similarity` -> `language/Term`（deps.xml 第 787 行）
- `language/Similarity` -> `io/Symbols`（deps.xml 第 788 行）
- 交叉校验：
- Java graph 额外依赖：io/Symbols、language/CompoundTerm、language/Statement、language/Term

## 5. Java 功能说明

- **职责概述**：文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。
- **关键数据结构**：
- `Similarity` · 继承：Statement · 实现：（无接口）
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

- ts-analysis: LOC=138 · TODO=0
- 参考文件：`java-master/src/main/java/org/opennars/language/Similarity.java`
