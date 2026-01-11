# src/language/DifferenceExt.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/language/DifferenceExt.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/language/DifferenceExt.java` |
| 模块链路 | `language 基座` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/language/DifferenceExt.ts --noEmit`）

- 执行的命令：`npx tsc src/language/DifferenceExt.ts --noEmit`
- 关键输出：
  - TS2304（L12, C36）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L19, C30）：[full_check] Cannot find name 'Term'.
  - TS2304（L22, C9）：[full_check] Cannot find name 'ensureValidDifferenceArguments'.
  - TS2339（L24, C23）：[full_check] Property 'cert' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/security/index")'.
  - TS2304（L34, C28）：[full_check] Cannot find name 'Term'.
  - TS2304（L34, C37）：[full_check] Cannot find name 'Term'.
  - TS2304（L35, C55）：[full_check] Cannot find name 'Term'.
  - TS2304（L39, C42）：[full_check] Cannot find name 'term'.
  - TS2304（L46, C45）：[full_check] Cannot find name 'Term'.
  - TS2304（L71, C29）：[full_check] Cannot find name 'Term'.
  - TS2304（L71, C38）：[full_check] Cannot find name 'Term'.
  - TS2304（L80, C28）：[full_check] Cannot find name 'Term'.
  - TS2304（L80, C38）：[full_check] Cannot find name 'Term'.
  - TS2304（L80, C45）：[full_check] Cannot find name 'Term'.
  - TS2304（L81, C45）：[full_check] Cannot find name 'Term'.
  - TS2304（L84, C40）：[full_check] Cannot find name 'Term'.
  - TS2304（L93, C40）：[full_check] Cannot find name 'SetExt'.
  - TS2304（L93, C70）：[full_check] Cannot find name 'SetExt'.
  - TS2694（L95, C40）：[full_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/util/index"' has no exported member 'NavigableSet'.
  - TS2304（L95, C53）：[full_check] Cannot find name 'Term'.
  - TS2339（L95, C75）：[full_check] Property 'TreeSet' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/util/index")'.
  - TS2304（L95, C94）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L96, C46）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L97, C28）：[full_check] Cannot find name 'SetExt'.
  - TS2304（L111, C43）：[full_check] Cannot find name 'Term'.
  - TS2304（L111, C49）：[full_check] Cannot find name 'Term'.
  - TS2304（L135, C24）：[full_check] Cannot find name 'NativeOperator'.
  - TS2304（L136, C16）：[full_check] Cannot find name 'NativeOperator'.
  - TS2304（L12, C36）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L19, C30）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L22, C9）：[syntax_check] Cannot find name 'ensureValidDifferenceArguments'.
  - TS2339（L24, C23）：[syntax_check] Property 'cert' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/security/index")'.
  - TS2304（L34, C28）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L34, C37）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L35, C55）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L39, C42）：[syntax_check] Cannot find name 'term'.
  - TS2304（L46, C45）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L71, C29）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L71, C38）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L80, C28）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L80, C38）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L80, C45）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L81, C45）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L84, C40）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L93, C40）：[syntax_check] Cannot find name 'SetExt'.
  - TS2304（L93, C70）：[syntax_check] Cannot find name 'SetExt'.
  - TS2694（L95, C40）：[syntax_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/util/index"' has no exported member 'NavigableSet'.
  - TS2304（L95, C53）：[syntax_check] Cannot find name 'Term'.
  - TS2339（L95, C75）：[syntax_check] Property 'TreeSet' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/util/index")'.
  - TS2304（L95, C94）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L96, C46）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L97, C28）：[syntax_check] Cannot find name 'SetExt'.
  - TS2304（L111, C43）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L111, C49）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L135, C24）：[syntax_check] Cannot find name 'NativeOperator'.
  - TS2304（L136, C16）：[syntax_check] Cannot find name 'NativeOperator'.
- 总结：存在语法错误，需要比对 Java 语句结构。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

（无显式结构性依赖，主要依赖 `jree` 提供的运行时桩或尚未补齐的全局声明。）

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

- `[full_check] Cannot find name 'CompoundTerm'.` @ L12
- `[full_check] Cannot find name 'Term'.` @ L19
- `[full_check] Cannot find name 'ensureValidDifferenceArguments'.` @ L22
- `[full_check] Cannot find name 'Term'.` @ L34
- `[full_check] Cannot find name 'Term'.` @ L34
- `[full_check] Cannot find name 'Term'.` @ L35
- `[full_check] Cannot find name 'term'.` @ L39
- `[full_check] Cannot find name 'Term'.` @ L46
- `[full_check] Cannot find name 'Term'.` @ L71
- `[full_check] Cannot find name 'Term'.` @ L71
- `[full_check] Cannot find name 'Term'.` @ L80
- `[full_check] Cannot find name 'Term'.` @ L80
- `[full_check] Cannot find name 'Term'.` @ L80
- `[full_check] Cannot find name 'Term'.` @ L81
- `[full_check] Cannot find name 'Term'.` @ L84
- `[full_check] Cannot find name 'SetExt'.` @ L93
- `[full_check] Cannot find name 'SetExt'.` @ L93
- `[full_check] Cannot find name 'Term'.` @ L95
- `[full_check] Cannot find name 'CompoundTerm'.` @ L95
- `[full_check] Cannot find name 'CompoundTerm'.` @ L96
- `[full_check] Cannot find name 'SetExt'.` @ L97
- `[full_check] Cannot find name 'Term'.` @ L111
- `[full_check] Cannot find name 'Term'.` @ L111
- `[full_check] Cannot find name 'NativeOperator'.` @ L135
- `[full_check] Cannot find name 'NativeOperator'.` @ L136
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L12
- `[syntax_check] Cannot find name 'Term'.` @ L19
- `[syntax_check] Cannot find name 'ensureValidDifferenceArguments'.` @ L22
- `[syntax_check] Cannot find name 'Term'.` @ L34
- `[syntax_check] Cannot find name 'Term'.` @ L34
- `[syntax_check] Cannot find name 'Term'.` @ L35
- `[syntax_check] Cannot find name 'term'.` @ L39
- `[syntax_check] Cannot find name 'Term'.` @ L46
- `[syntax_check] Cannot find name 'Term'.` @ L71
- `[syntax_check] Cannot find name 'Term'.` @ L71
- `[syntax_check] Cannot find name 'Term'.` @ L80
- `[syntax_check] Cannot find name 'Term'.` @ L80
- `[syntax_check] Cannot find name 'Term'.` @ L80
- `[syntax_check] Cannot find name 'Term'.` @ L81
- `[syntax_check] Cannot find name 'Term'.` @ L84
- `[syntax_check] Cannot find name 'SetExt'.` @ L93
- `[syntax_check] Cannot find name 'SetExt'.` @ L93
- `[syntax_check] Cannot find name 'Term'.` @ L95
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L95
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L96
- `[syntax_check] Cannot find name 'SetExt'.` @ L97
- `[syntax_check] Cannot find name 'Term'.` @ L111
- `[syntax_check] Cannot find name 'Term'.` @ L111
- `[syntax_check] Cannot find name 'NativeOperator'.` @ L135
- `[syntax_check] Cannot find name 'NativeOperator'.` @ L136

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `language/DifferenceExt` -> `language/DifferenceInt`（deps.xml 第 648 行）
- `language/DifferenceExt` -> `language/CompoundTerm`（deps.xml 第 649 行）
- `language/DifferenceExt` -> `language/SetExt`（deps.xml 第 650 行）
- `language/DifferenceExt` -> `language/Term`（deps.xml 第 651 行）
- `language/DifferenceExt` -> `io/Symbols`（deps.xml 第 652 行）
- 交叉校验：
- Java graph 额外依赖：io/Symbols、language/CompoundTerm、language/DifferenceInt、language/SetExt、language/Term

## 5. Java 功能说明

- **职责概述**：文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。；TODO 1 处
- **关键数据结构**：
- `DifferenceExt` · 继承：CompoundTerm · 实现：（无接口）
- **核心流程 / 算法**：
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。；TODO 1 处
  3. Java-TS 差异：参见《通用转译法.md》 - 语言层
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `Java Memory/Task 接口` 衔接上下游。

## 6. 一致性风险

- 文件内仍保留 1 处 TODO，需对照 Java 填补。
- `tsc` 报错阻塞进一步分析，需要回填语句结构。
- 缺少显式 import，需依赖 Java/ts-analysis 交叉校验。

## 7. 路线图定位

- 1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
- 2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。；TODO 1 处
- 3. Java-TS 差异：参见《通用转译法.md》 - 语言层

## 8. 附加记录

- ts-analysis: LOC=138 · TODO=1
- 参考文件：`java-master/src/main/java/org/opennars/language/DifferenceExt.java`
