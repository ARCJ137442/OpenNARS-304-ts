# src/language/Equivalence.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/language/Equivalence.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/language/Equivalence.java` |
| 模块链路 | `language 基座` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/language/Equivalence.ts --noEmit`）

- 执行的命令：`npx tsc src/language/Equivalence.ts --noEmit`
- 关键输出：
  - TS2304（L11, C34）：[full_check] Cannot find name 'Statement'.
  - TS2304（L13, C34）：[full_check] Cannot find name 'TemporalRules'.
  - TS2304（L20, C37）：[full_check] Cannot find name 'Term'.
  - TS2339（L25, C23）：[full_check] Property 'cert' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/security/index")'.
  - TS2304（L35, C21）：[full_check] Cannot find name 'Term'.
  - TS2304（L40, C40）：[full_check] Cannot find name 'term'.
  - TS2304（L47, C38）：[full_check] Cannot find name 'Term'.
  - TS2322（L51, C21）：[full_check] Type 'null' is not assignable to type 'Equivalence'.
  - TS2304（L74, C37）：[full_check] Cannot find name 'Term'.
  - TS2304（L74, C54）：[full_check] Cannot find name 'Term'.
  - TS2304（L74, C81）：[full_check] Cannot find name 'Term'.
  - TS2304（L88, C33）：[full_check] Cannot find name 'Term'.
  - TS2304（L88, C50）：[full_check] Cannot find name 'Term'.
  - TS2304（L90, C33）：[full_check] Cannot find name 'Term'.
  - TS2304（L90, C50）：[full_check] Cannot find name 'Term'.
  - TS2304（L94, C55）：[full_check] Cannot find name 'Term'.
  - TS2304（L94, C61）：[full_check] Cannot find name 'Term'.
  - TS2304（L98, C61）：[full_check] Cannot find name 'TemporalRules'.
  - TS2304（L105, C70）：[full_check] Cannot find name 'Term'.
  - TS2304（L105, C76）：[full_check] Cannot find name 'Term'.
  - TS2304（L109, C21）：[full_check] Cannot find name 'invalidStatement'.
  - TS2304（L109, C79）：[full_check] Cannot find name 'TemporalRules'.
  - TS2304（L110, C42）：[full_check] Cannot find name 'TemporalRules'.
  - TS2322（L111, C21）：[full_check] Type 'null' is not assignable to type 'Equivalence'.
  - TS2304（L114, C41）：[full_check] Cannot find name 'Implication'.
  - TS2304（L115, C46）：[full_check] Cannot find name 'Implication'.
  - TS2304（L116, C41）：[full_check] Cannot find name 'Interval'.
  - TS2304（L116, C76）：[full_check] Cannot find name 'Interval'.
  - TS2322（L117, C21）：[full_check] Type 'null' is not assignable to type 'Equivalence'.
  - TS2304（L120, C40）：[full_check] Cannot find name 'TemporalRules'.
  - TS2304（L121, C82）：[full_check] Cannot find name 'TemporalRules'.
  - TS2304（L122, C33）：[full_check] Cannot find name 'Term'.
  - TS2588（L123, C21）：[full_check] Cannot assign to 'subject' because it is a constant.
  - TS2588（L124, C21）：[full_check] Cannot assign to 'predicate' because it is a constant.
  - TS2304（L129, C26）：[full_check] Cannot find name 'TemporalRules'.
  - TS2588（L130, C25）：[full_check] Cannot assign to 'temporalOrder' because it is a constant.
  - TS2304（L130, C41）：[full_check] Cannot find name 'TemporalRules'.
  - TS2304（L144, C24）：[full_check] Cannot find name 'Term'.
  - TS2304（L145, C39）：[full_check] Cannot find name 'TemporalRules'.
  - TS2304（L148, C25）：[full_check] Cannot find name 'Term'.
  - TS2322（L151, C21）：[full_check] Type 'null' is not assignable to type 'Equivalence'.
  - TS2304（L170, C24）：[full_check] Cannot find name 'NativeOperator'.
  - TS2304（L172, C18）：[full_check] Cannot find name 'TemporalRules'.
  - TS2304（L173, C24）：[full_check] Cannot find name 'NativeOperator'.
  - TS2304（L174, C18）：[full_check] Cannot find name 'TemporalRules'.
  - TS2304（L175, C24）：[full_check] Cannot find name 'NativeOperator'.
  - TS2304（L180, C16）：[full_check] Cannot find name 'NativeOperator'.
  - TS2304（L189, C40）：[full_check] Cannot find name 'TemporalRules'.
  - TS2304（L11, C34）：[syntax_check] Cannot find name 'Statement'.
  - TS2304（L13, C34）：[syntax_check] Cannot find name 'TemporalRules'.
  - TS2304（L20, C37）：[syntax_check] Cannot find name 'Term'.
  - TS2339（L25, C23）：[syntax_check] Property 'cert' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/security/index")'.
  - TS2304（L35, C21）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L40, C40）：[syntax_check] Cannot find name 'term'.
  - TS2304（L47, C38）：[syntax_check] Cannot find name 'Term'.
  - TS2322（L51, C21）：[syntax_check] Type 'null' is not assignable to type 'Equivalence'.
  - TS2304（L74, C37）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L74, C54）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L74, C81）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L88, C33）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L88, C50）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L90, C33）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L90, C50）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L94, C55）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L94, C61）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L98, C61）：[syntax_check] Cannot find name 'TemporalRules'.
  - TS2304（L105, C70）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L105, C76）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L109, C21）：[syntax_check] Cannot find name 'invalidStatement'.
  - TS2304（L109, C79）：[syntax_check] Cannot find name 'TemporalRules'.
  - TS2304（L110, C42）：[syntax_check] Cannot find name 'TemporalRules'.
  - TS2322（L111, C21）：[syntax_check] Type 'null' is not assignable to type 'Equivalence'.
  - TS2304（L114, C41）：[syntax_check] Cannot find name 'Implication'.
  - TS2304（L115, C46）：[syntax_check] Cannot find name 'Implication'.
  - TS2304（L116, C41）：[syntax_check] Cannot find name 'Interval'.
  - TS2304（L116, C76）：[syntax_check] Cannot find name 'Interval'.
  - TS2322（L117, C21）：[syntax_check] Type 'null' is not assignable to type 'Equivalence'.
  - TS2304（L120, C40）：[syntax_check] Cannot find name 'TemporalRules'.
  - TS2304（L121, C82）：[syntax_check] Cannot find name 'TemporalRules'.
  - TS2304（L122, C33）：[syntax_check] Cannot find name 'Term'.
  - TS2588（L123, C21）：[syntax_check] Cannot assign to 'subject' because it is a constant.
  - TS2588（L124, C21）：[syntax_check] Cannot assign to 'predicate' because it is a constant.
  - TS2304（L129, C26）：[syntax_check] Cannot find name 'TemporalRules'.
  - TS2588（L130, C25）：[syntax_check] Cannot assign to 'temporalOrder' because it is a constant.
  - TS2304（L130, C41）：[syntax_check] Cannot find name 'TemporalRules'.
  - TS2304（L144, C24）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L145, C39）：[syntax_check] Cannot find name 'TemporalRules'.
  - TS2304（L148, C25）：[syntax_check] Cannot find name 'Term'.
  - TS2322（L151, C21）：[syntax_check] Type 'null' is not assignable to type 'Equivalence'.
  - TS2304（L170, C24）：[syntax_check] Cannot find name 'NativeOperator'.
  - TS2304（L172, C18）：[syntax_check] Cannot find name 'TemporalRules'.
  - TS2304（L173, C24）：[syntax_check] Cannot find name 'NativeOperator'.
  - TS2304（L174, C18）：[syntax_check] Cannot find name 'TemporalRules'.
  - TS2304（L175, C24）：[syntax_check] Cannot find name 'NativeOperator'.
  - TS2304（L180, C16）：[syntax_check] Cannot find name 'NativeOperator'.
  - TS2304（L189, C40）：[syntax_check] Cannot find name 'TemporalRules'.
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
- `[full_check] Cannot find name 'TemporalRules'.` @ L13
- `[full_check] Cannot find name 'Term'.` @ L20
- `[full_check] Cannot find name 'Term'.` @ L35
- `[full_check] Cannot find name 'term'.` @ L40
- `[full_check] Cannot find name 'Term'.` @ L47
- `[full_check] Cannot find name 'Term'.` @ L74
- `[full_check] Cannot find name 'Term'.` @ L74
- `[full_check] Cannot find name 'Term'.` @ L74
- `[full_check] Cannot find name 'Term'.` @ L88
- `[full_check] Cannot find name 'Term'.` @ L88
- `[full_check] Cannot find name 'Term'.` @ L90
- `[full_check] Cannot find name 'Term'.` @ L90
- `[full_check] Cannot find name 'Term'.` @ L94
- `[full_check] Cannot find name 'Term'.` @ L94
- `[full_check] Cannot find name 'TemporalRules'.` @ L98
- `[full_check] Cannot find name 'Term'.` @ L105
- `[full_check] Cannot find name 'Term'.` @ L105
- `[full_check] Cannot find name 'invalidStatement'.` @ L109
- `[full_check] Cannot find name 'TemporalRules'.` @ L109
- `[full_check] Cannot find name 'TemporalRules'.` @ L110
- `[full_check] Cannot find name 'Implication'.` @ L114
- `[full_check] Cannot find name 'Implication'.` @ L115
- `[full_check] Cannot find name 'Interval'.` @ L116
- `[full_check] Cannot find name 'Interval'.` @ L116
- `[full_check] Cannot find name 'TemporalRules'.` @ L120
- `[full_check] Cannot find name 'TemporalRules'.` @ L121
- `[full_check] Cannot find name 'Term'.` @ L122
- `[full_check] Cannot find name 'TemporalRules'.` @ L129
- `[full_check] Cannot find name 'TemporalRules'.` @ L130
- `[full_check] Cannot find name 'Term'.` @ L144
- `[full_check] Cannot find name 'TemporalRules'.` @ L145
- `[full_check] Cannot find name 'Term'.` @ L148
- `[full_check] Cannot find name 'NativeOperator'.` @ L170
- `[full_check] Cannot find name 'TemporalRules'.` @ L172
- `[full_check] Cannot find name 'NativeOperator'.` @ L173
- `[full_check] Cannot find name 'TemporalRules'.` @ L174
- `[full_check] Cannot find name 'NativeOperator'.` @ L175
- `[full_check] Cannot find name 'NativeOperator'.` @ L180
- `[full_check] Cannot find name 'TemporalRules'.` @ L189
- `[syntax_check] Cannot find name 'Statement'.` @ L11
- `[syntax_check] Cannot find name 'TemporalRules'.` @ L13
- `[syntax_check] Cannot find name 'Term'.` @ L20
- `[syntax_check] Cannot find name 'Term'.` @ L35
- `[syntax_check] Cannot find name 'term'.` @ L40
- `[syntax_check] Cannot find name 'Term'.` @ L47
- `[syntax_check] Cannot find name 'Term'.` @ L74
- `[syntax_check] Cannot find name 'Term'.` @ L74
- `[syntax_check] Cannot find name 'Term'.` @ L74
- `[syntax_check] Cannot find name 'Term'.` @ L88
- `[syntax_check] Cannot find name 'Term'.` @ L88
- `[syntax_check] Cannot find name 'Term'.` @ L90
- `[syntax_check] Cannot find name 'Term'.` @ L90
- `[syntax_check] Cannot find name 'Term'.` @ L94
- `[syntax_check] Cannot find name 'Term'.` @ L94
- `[syntax_check] Cannot find name 'TemporalRules'.` @ L98
- `[syntax_check] Cannot find name 'Term'.` @ L105
- `[syntax_check] Cannot find name 'Term'.` @ L105
- `[syntax_check] Cannot find name 'invalidStatement'.` @ L109
- `[syntax_check] Cannot find name 'TemporalRules'.` @ L109
- `[syntax_check] Cannot find name 'TemporalRules'.` @ L110
- `[syntax_check] Cannot find name 'Implication'.` @ L114
- `[syntax_check] Cannot find name 'Implication'.` @ L115
- `[syntax_check] Cannot find name 'Interval'.` @ L116
- `[syntax_check] Cannot find name 'Interval'.` @ L116
- `[syntax_check] Cannot find name 'TemporalRules'.` @ L120
- `[syntax_check] Cannot find name 'TemporalRules'.` @ L121
- `[syntax_check] Cannot find name 'Term'.` @ L122
- `[syntax_check] Cannot find name 'TemporalRules'.` @ L129
- `[syntax_check] Cannot find name 'TemporalRules'.` @ L130
- `[syntax_check] Cannot find name 'Term'.` @ L144
- `[syntax_check] Cannot find name 'TemporalRules'.` @ L145
- `[syntax_check] Cannot find name 'Term'.` @ L148
- `[syntax_check] Cannot find name 'NativeOperator'.` @ L170
- `[syntax_check] Cannot find name 'TemporalRules'.` @ L172
- `[syntax_check] Cannot find name 'NativeOperator'.` @ L173
- `[syntax_check] Cannot find name 'TemporalRules'.` @ L174
- `[syntax_check] Cannot find name 'NativeOperator'.` @ L175
- `[syntax_check] Cannot find name 'NativeOperator'.` @ L180
- `[syntax_check] Cannot find name 'TemporalRules'.` @ L189

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `language/Equivalence` -> `language/Interval`（deps.xml 第 669 行）
- `language/Equivalence` -> `language/Implication`（deps.xml 第 670 行）
- `language/Equivalence` -> `language/CompoundTerm`（deps.xml 第 671 行）
- `language/Equivalence` -> `inference/TemporalRules`（deps.xml 第 672 行）
- `language/Equivalence` -> `language/Statement`（deps.xml 第 673 行）
- `language/Equivalence` -> `language/Term`（deps.xml 第 674 行）
- `language/Equivalence` -> `io/Symbols`（deps.xml 第 675 行）
- 交叉校验：
- Java graph 额外依赖：inference/TemporalRules、io/Symbols、language/CompoundTerm、language/Implication、language/Interval、language/Statement、language/Term

## 5. Java 功能说明

- **职责概述**：文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。；TODO 1 处
- **关键数据结构**：
- `Equivalence` · 继承：Statement · 实现：（无接口）
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

- ts-analysis: LOC=195 · TODO=1
- 参考文件：`java-master/src/main/java/org/opennars/language/Equivalence.java`
