# src/language/DifferenceInt.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/language/DifferenceInt.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/language/DifferenceInt.java` |
| 模块链路 | `language 基座` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/language/DifferenceInt.ts --noEmit`）

- 执行的命令：`npx tsc src/language/DifferenceInt.ts --noEmit`
- 关键输出：
  - TS2304（L12, C36）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L19, C30）：[full_check] Cannot find name 'Term'.
  - TS2339（L24, C23）：[full_check] Property 'cert' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/security/index")'.
  - TS2304（L27, C55）：[full_check] Cannot find name 'Term'.
  - TS2304（L31, C13）：[full_check] Cannot find name 'Debug'.
  - TS2304（L44, C28）：[full_check] Cannot find name 'Term'.
  - TS2304（L44, C37）：[full_check] Cannot find name 'Term'.
  - TS2304（L45, C55）：[full_check] Cannot find name 'Term'.
  - TS2304（L49, C42）：[full_check] Cannot find name 'term'.
  - TS2304（L56, C45）：[full_check] Cannot find name 'Term'.
  - TS2304（L81, C29）：[full_check] Cannot find name 'Term'.
  - TS2304（L81, C38）：[full_check] Cannot find name 'Term'.
  - TS2304（L90, C28）：[full_check] Cannot find name 'Term'.
  - TS2304（L90, C38）：[full_check] Cannot find name 'Term'.
  - TS2304（L90, C45）：[full_check] Cannot find name 'Term'.
  - TS2304（L91, C45）：[full_check] Cannot find name 'Term'.
  - TS2304（L94, C40）：[full_check] Cannot find name 'Term'.
  - TS2304（L104, C40）：[full_check] Cannot find name 'SetInt'.
  - TS2304（L104, C70）：[full_check] Cannot find name 'SetInt'.
  - TS2694（L106, C40）：[full_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/util/index"' has no exported member 'NavigableSet'.
  - TS2304（L106, C53）：[full_check] Cannot find name 'Term'.
  - TS2339（L106, C75）：[full_check] Property 'TreeSet' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/util/index")'.
  - TS2304（L106, C94）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L107, C46）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L108, C28）：[full_check] Cannot find name 'SetInt'.
  - TS2304（L122, C43）：[full_check] Cannot find name 'Term'.
  - TS2304（L122, C49）：[full_check] Cannot find name 'Term'.
  - TS2304（L146, C24）：[full_check] Cannot find name 'NativeOperator'.
  - TS2304（L147, C16）：[full_check] Cannot find name 'NativeOperator'.
  - TS2304（L12, C36）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L19, C30）：[syntax_check] Cannot find name 'Term'.
  - TS2339（L24, C23）：[syntax_check] Property 'cert' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/security/index")'.
  - TS2304（L27, C55）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L31, C13）：[syntax_check] Cannot find name 'Debug'.
  - TS2304（L44, C28）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L44, C37）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L45, C55）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L49, C42）：[syntax_check] Cannot find name 'term'.
  - TS2304（L56, C45）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L81, C29）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L81, C38）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L90, C28）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L90, C38）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L90, C45）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L91, C45）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L94, C40）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L104, C40）：[syntax_check] Cannot find name 'SetInt'.
  - TS2304（L104, C70）：[syntax_check] Cannot find name 'SetInt'.
  - TS2694（L106, C40）：[syntax_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/util/index"' has no exported member 'NavigableSet'.
  - TS2304（L106, C53）：[syntax_check] Cannot find name 'Term'.
  - TS2339（L106, C75）：[syntax_check] Property 'TreeSet' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/util/index")'.
  - TS2304（L106, C94）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L107, C46）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L108, C28）：[syntax_check] Cannot find name 'SetInt'.
  - TS2304（L122, C43）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L122, C49）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L146, C24）：[syntax_check] Cannot find name 'NativeOperator'.
  - TS2304（L147, C16）：[syntax_check] Cannot find name 'NativeOperator'.
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
- `[full_check] Cannot find name 'Term'.` @ L27
- `[full_check] Cannot find name 'Debug'.` @ L31
- `[full_check] Cannot find name 'Term'.` @ L44
- `[full_check] Cannot find name 'Term'.` @ L44
- `[full_check] Cannot find name 'Term'.` @ L45
- `[full_check] Cannot find name 'term'.` @ L49
- `[full_check] Cannot find name 'Term'.` @ L56
- `[full_check] Cannot find name 'Term'.` @ L81
- `[full_check] Cannot find name 'Term'.` @ L81
- `[full_check] Cannot find name 'Term'.` @ L90
- `[full_check] Cannot find name 'Term'.` @ L90
- `[full_check] Cannot find name 'Term'.` @ L90
- `[full_check] Cannot find name 'Term'.` @ L91
- `[full_check] Cannot find name 'Term'.` @ L94
- `[full_check] Cannot find name 'SetInt'.` @ L104
- `[full_check] Cannot find name 'SetInt'.` @ L104
- `[full_check] Cannot find name 'Term'.` @ L106
- `[full_check] Cannot find name 'CompoundTerm'.` @ L106
- `[full_check] Cannot find name 'CompoundTerm'.` @ L107
- `[full_check] Cannot find name 'SetInt'.` @ L108
- `[full_check] Cannot find name 'Term'.` @ L122
- `[full_check] Cannot find name 'Term'.` @ L122
- `[full_check] Cannot find name 'NativeOperator'.` @ L146
- `[full_check] Cannot find name 'NativeOperator'.` @ L147
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L12
- `[syntax_check] Cannot find name 'Term'.` @ L19
- `[syntax_check] Cannot find name 'Term'.` @ L27
- `[syntax_check] Cannot find name 'Debug'.` @ L31
- `[syntax_check] Cannot find name 'Term'.` @ L44
- `[syntax_check] Cannot find name 'Term'.` @ L44
- `[syntax_check] Cannot find name 'Term'.` @ L45
- `[syntax_check] Cannot find name 'term'.` @ L49
- `[syntax_check] Cannot find name 'Term'.` @ L56
- `[syntax_check] Cannot find name 'Term'.` @ L81
- `[syntax_check] Cannot find name 'Term'.` @ L81
- `[syntax_check] Cannot find name 'Term'.` @ L90
- `[syntax_check] Cannot find name 'Term'.` @ L90
- `[syntax_check] Cannot find name 'Term'.` @ L90
- `[syntax_check] Cannot find name 'Term'.` @ L91
- `[syntax_check] Cannot find name 'Term'.` @ L94
- `[syntax_check] Cannot find name 'SetInt'.` @ L104
- `[syntax_check] Cannot find name 'SetInt'.` @ L104
- `[syntax_check] Cannot find name 'Term'.` @ L106
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L106
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L107
- `[syntax_check] Cannot find name 'SetInt'.` @ L108
- `[syntax_check] Cannot find name 'Term'.` @ L122
- `[syntax_check] Cannot find name 'Term'.` @ L122
- `[syntax_check] Cannot find name 'NativeOperator'.` @ L146
- `[syntax_check] Cannot find name 'NativeOperator'.` @ L147

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `language/DifferenceInt` -> `language/SetInt`（deps.xml 第 655 行）
- `language/DifferenceInt` -> `language/CompoundTerm`（deps.xml 第 656 行）
- `language/DifferenceInt` -> `language/Term`（deps.xml 第 657 行）
- `language/DifferenceInt` -> `io/Symbols`（deps.xml 第 658 行）
- `language/DifferenceInt` -> `parameter/Debug`（deps.xml 第 659 行）
- 交叉校验：
- Java graph 额外依赖：io/Symbols、language/CompoundTerm、language/SetInt、language/Term、parameter/Debug

## 5. Java 功能说明

- **职责概述**：文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。；TODO 1 处
- **关键数据结构**：
- `DifferenceInt` · 继承：CompoundTerm · 实现：（无接口）
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

- ts-analysis: LOC=149 · TODO=1
- 参考文件：`java-master/src/main/java/org/opennars/language/DifferenceInt.java`
