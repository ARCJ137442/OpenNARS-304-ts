# src/language/Implication.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/language/Implication.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/language/Implication.java` |
| 模块链路 | `language 基座` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/language/Implication.ts --noEmit`）

- 执行的命令：`npx tsc src/language/Implication.ts --noEmit`
- 关键输出：
  - TS2304（L11, C34）：[full_check] Cannot find name 'Statement'.
  - TS2304（L12, C34）：[full_check] Cannot find name 'TemporalRules'.
  - TS2322（L15, C12）：[full_check] Type 'number' is not assignable to type 'bigint'.
  - TS2304（L22, C29）：[full_check] Cannot find name 'Term'.
  - TS2304（L29, C29）：[full_check] Cannot find name 'Term'.
  - TS2304（L31, C33）：[full_check] Cannot find name 'Term'.
  - TS2304（L31, C50）：[full_check] Cannot find name 'Term'.
  - TS2304（L35, C47）：[full_check] Cannot find name 'Term'.
  - TS2339（L42, C31）：[full_check] Property 'cert' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/security/index")'.
  - TS2304（L49, C56）：[full_check] Cannot find name 'Term'.
  - TS2339（L57, C31）：[full_check] Property 'cert' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/security/index")'.
  - TS2304（L64, C62）：[full_check] Cannot find name 'Term'.
  - TS2304（L64, C68）：[full_check] Cannot find name 'Term'.
  - TS2349（L67, C17）：[full_check] This expression is not callable.
  - TS17009（L67, C17）：[full_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L87, C21）：[full_check] Cannot find name 'Term'.
  - TS2304（L92, C40）：[full_check] Cannot find name 'term'.
  - TS2304（L99, C38）：[full_check] Cannot find name 'Term'.
  - TS2322（L103, C21）：[full_check] Type 'null' is not assignable to type 'Implication'.
  - TS2304（L128, C33）：[full_check] Cannot find name 'Term'.
  - TS2304（L128, C50）：[full_check] Cannot find name 'Term'.
  - TS2304（L130, C33）：[full_check] Cannot find name 'Term'.
  - TS2304（L130, C50）：[full_check] Cannot find name 'Term'.
  - TS2304（L134, C55）：[full_check] Cannot find name 'Term'.
  - TS2304（L134, C61）：[full_check] Cannot find name 'Term'.
  - TS2304（L137, C61）：[full_check] Cannot find name 'TemporalRules'.
  - TS2304（L144, C70）：[full_check] Cannot find name 'Term'.
  - TS2304（L144, C76）：[full_check] Cannot find name 'Term'.
  - TS2304（L147, C21）：[full_check] Cannot find name 'invalidStatement'.
  - TS2304（L148, C39）：[full_check] Cannot find name 'TemporalRules'.
  - TS2304（L148, C88）：[full_check] Cannot find name 'TemporalRules'.
  - TS2322（L149, C21）：[full_check] Type 'null' is not assignable to type 'Implication'.
  - TS2304（L152, C77）：[full_check] Cannot find name 'Equivalence'.
  - TS2304（L152, C115）：[full_check] Cannot find name 'Equivalence'.
  - TS2304（L154, C41）：[full_check] Cannot find name 'Interval'.
  - TS2304（L154, C76）：[full_check] Cannot find name 'Interval'.
  - TS2322（L155, C21）：[full_check] Type 'null' is not assignable to type 'Implication'.
  - TS2304（L160, C39）：[full_check] Cannot find name 'Term'.
  - TS2304（L160, C60）：[full_check] Cannot find name 'Statement'.
  - TS2304（L161, C50）：[full_check] Cannot find name 'Conjunction'.
  - TS2322（L162, C25）：[full_check] Type 'null' is not assignable to type 'Implication'.
  - TS2304（L166, C44）：[full_check] Cannot find name 'Conjunction'.
  - TS2304（L167, C35）：[full_check] Cannot find name 'Conjunction'.
  - TS2304（L167, C60）：[full_check] Cannot find name 'Conjunction'.
  - TS2304（L171, C39）：[full_check] Cannot find name 'Term'.
  - TS2304（L171, C46）：[full_check] Cannot find name 'Conjunction'.
  - TS2304（L172, C73）：[full_check] Cannot find name 'Statement'.
  - TS2304（L188, C37）：[full_check] Cannot find name 'Term'.
  - TS2304（L188, C74）：[full_check] Cannot find name 'Term'.
  - TS2304（L189, C21）：[full_check] Cannot find name 'NativeOperator'.
  - TS2304（L191, C18）：[full_check] Cannot find name 'TemporalRules'.
  - TS2304（L192, C26）：[full_check] Cannot find name 'NativeOperator'.
  - TS2304（L194, C18）：[full_check] Cannot find name 'TemporalRules'.
  - TS2304（L195, C26）：[full_check] Cannot find name 'NativeOperator'.
  - TS2304（L197, C18）：[full_check] Cannot find name 'TemporalRules'.
  - TS2304（L198, C26）：[full_check] Cannot find name 'NativeOperator'.
  - TS2304（L201, C26）：[full_check] Cannot find name 'NativeOperator'.
  - TS2304（L203, C16）：[full_check] Cannot find name 'makeStatementName'.
  - TS2304（L211, C24）：[full_check] Cannot find name 'NativeOperator'.
  - TS2304（L213, C18）：[full_check] Cannot find name 'TemporalRules'.
  - TS2304（L214, C24）：[full_check] Cannot find name 'NativeOperator'.
  - TS2304（L215, C18）：[full_check] Cannot find name 'TemporalRules'.
  - TS2304（L216, C24）：[full_check] Cannot find name 'NativeOperator'.
  - TS2304（L217, C18）：[full_check] Cannot find name 'TemporalRules'.
  - TS2304（L218, C24）：[full_check] Cannot find name 'NativeOperator'.
  - TS2304（L223, C16）：[full_check] Cannot find name 'NativeOperator'.
  - TS2304（L231, C44）：[full_check] Cannot find name 'TemporalRules'.
  - TS2304（L235, C44）：[full_check] Cannot find name 'TemporalRules'.
  - TS2304（L239, C44）：[full_check] Cannot find name 'TemporalRules'.
  - TS2304（L11, C34）：[syntax_check] Cannot find name 'Statement'.
  - TS2304（L12, C34）：[syntax_check] Cannot find name 'TemporalRules'.
  - TS2322（L15, C12）：[syntax_check] Type 'number' is not assignable to type 'bigint'.
  - TS2304（L22, C29）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L29, C29）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L31, C33）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L31, C50）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L35, C47）：[syntax_check] Cannot find name 'Term'.
  - TS2339（L42, C31）：[syntax_check] Property 'cert' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/security/index")'.
  - TS2304（L49, C56）：[syntax_check] Cannot find name 'Term'.
  - TS2339（L57, C31）：[syntax_check] Property 'cert' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/security/index")'.
  - TS2304（L64, C62）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L64, C68）：[syntax_check] Cannot find name 'Term'.
  - TS2349（L67, C17）：[syntax_check] This expression is not callable.
  - TS17009（L67, C17）：[syntax_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L87, C21）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L92, C40）：[syntax_check] Cannot find name 'term'.
  - TS2304（L99, C38）：[syntax_check] Cannot find name 'Term'.
  - TS2322（L103, C21）：[syntax_check] Type 'null' is not assignable to type 'Implication'.
  - TS2304（L128, C33）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L128, C50）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L130, C33）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L130, C50）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L134, C55）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L134, C61）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L137, C61）：[syntax_check] Cannot find name 'TemporalRules'.
  - TS2304（L144, C70）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L144, C76）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L147, C21）：[syntax_check] Cannot find name 'invalidStatement'.
  - TS2304（L148, C39）：[syntax_check] Cannot find name 'TemporalRules'.
  - TS2304（L148, C88）：[syntax_check] Cannot find name 'TemporalRules'.
  - TS2322（L149, C21）：[syntax_check] Type 'null' is not assignable to type 'Implication'.
  - TS2304（L152, C77）：[syntax_check] Cannot find name 'Equivalence'.
  - TS2304（L152, C115）：[syntax_check] Cannot find name 'Equivalence'.
  - TS2304（L154, C41）：[syntax_check] Cannot find name 'Interval'.
  - TS2304（L154, C76）：[syntax_check] Cannot find name 'Interval'.
  - TS2322（L155, C21）：[syntax_check] Type 'null' is not assignable to type 'Implication'.
  - TS2304（L160, C39）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L160, C60）：[syntax_check] Cannot find name 'Statement'.
  - TS2304（L161, C50）：[syntax_check] Cannot find name 'Conjunction'.
  - TS2322（L162, C25）：[syntax_check] Type 'null' is not assignable to type 'Implication'.
  - TS2304（L166, C44）：[syntax_check] Cannot find name 'Conjunction'.
  - TS2304（L167, C35）：[syntax_check] Cannot find name 'Conjunction'.
  - TS2304（L167, C60）：[syntax_check] Cannot find name 'Conjunction'.
  - TS2304（L171, C39）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L171, C46）：[syntax_check] Cannot find name 'Conjunction'.
  - TS2304（L172, C73）：[syntax_check] Cannot find name 'Statement'.
  - TS2304（L188, C37）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L188, C74）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L189, C21）：[syntax_check] Cannot find name 'NativeOperator'.
  - TS2304（L191, C18）：[syntax_check] Cannot find name 'TemporalRules'.
  - TS2304（L192, C26）：[syntax_check] Cannot find name 'NativeOperator'.
  - TS2304（L194, C18）：[syntax_check] Cannot find name 'TemporalRules'.
  - TS2304（L195, C26）：[syntax_check] Cannot find name 'NativeOperator'.
  - TS2304（L197, C18）：[syntax_check] Cannot find name 'TemporalRules'.
  - TS2304（L198, C26）：[syntax_check] Cannot find name 'NativeOperator'.
  - TS2304（L201, C26）：[syntax_check] Cannot find name 'NativeOperator'.
  - TS2304（L203, C16）：[syntax_check] Cannot find name 'makeStatementName'.
  - TS2304（L211, C24）：[syntax_check] Cannot find name 'NativeOperator'.
  - TS2304（L213, C18）：[syntax_check] Cannot find name 'TemporalRules'.
  - TS2304（L214, C24）：[syntax_check] Cannot find name 'NativeOperator'.
  - TS2304（L215, C18）：[syntax_check] Cannot find name 'TemporalRules'.
  - TS2304（L216, C24）：[syntax_check] Cannot find name 'NativeOperator'.
  - TS2304（L217, C18）：[syntax_check] Cannot find name 'TemporalRules'.
  - TS2304（L218, C24）：[syntax_check] Cannot find name 'NativeOperator'.
  - TS2304（L223, C16）：[syntax_check] Cannot find name 'NativeOperator'.
  - TS2304（L231, C44）：[syntax_check] Cannot find name 'TemporalRules'.
  - TS2304（L235, C44）：[syntax_check] Cannot find name 'TemporalRules'.
  - TS2304（L239, C44）：[syntax_check] Cannot find name 'TemporalRules'.
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
- `[full_check] Cannot find name 'TemporalRules'.` @ L12
- `[full_check] Cannot find name 'Term'.` @ L22
- `[full_check] Cannot find name 'Term'.` @ L29
- `[full_check] Cannot find name 'Term'.` @ L31
- `[full_check] Cannot find name 'Term'.` @ L31
- `[full_check] Cannot find name 'Term'.` @ L35
- `[full_check] Cannot find name 'Term'.` @ L49
- `[full_check] Cannot find name 'Term'.` @ L64
- `[full_check] Cannot find name 'Term'.` @ L64
- `[full_check] Cannot find name 'Term'.` @ L87
- `[full_check] Cannot find name 'term'.` @ L92
- `[full_check] Cannot find name 'Term'.` @ L99
- `[full_check] Cannot find name 'Term'.` @ L128
- `[full_check] Cannot find name 'Term'.` @ L128
- `[full_check] Cannot find name 'Term'.` @ L130
- `[full_check] Cannot find name 'Term'.` @ L130
- `[full_check] Cannot find name 'Term'.` @ L134
- `[full_check] Cannot find name 'Term'.` @ L134
- `[full_check] Cannot find name 'TemporalRules'.` @ L137
- `[full_check] Cannot find name 'Term'.` @ L144
- `[full_check] Cannot find name 'Term'.` @ L144
- `[full_check] Cannot find name 'invalidStatement'.` @ L147
- `[full_check] Cannot find name 'TemporalRules'.` @ L148
- `[full_check] Cannot find name 'TemporalRules'.` @ L148
- `[full_check] Cannot find name 'Equivalence'.` @ L152
- `[full_check] Cannot find name 'Equivalence'.` @ L152
- `[full_check] Cannot find name 'Interval'.` @ L154
- `[full_check] Cannot find name 'Interval'.` @ L154
- `[full_check] Cannot find name 'Term'.` @ L160
- `[full_check] Cannot find name 'Statement'.` @ L160
- `[full_check] Cannot find name 'Conjunction'.` @ L161
- `[full_check] Cannot find name 'Conjunction'.` @ L166
- `[full_check] Cannot find name 'Conjunction'.` @ L167
- `[full_check] Cannot find name 'Conjunction'.` @ L167
- `[full_check] Cannot find name 'Term'.` @ L171
- `[full_check] Cannot find name 'Conjunction'.` @ L171
- `[full_check] Cannot find name 'Statement'.` @ L172
- `[full_check] Cannot find name 'Term'.` @ L188
- `[full_check] Cannot find name 'Term'.` @ L188
- `[full_check] Cannot find name 'NativeOperator'.` @ L189
- `[full_check] Cannot find name 'TemporalRules'.` @ L191
- `[full_check] Cannot find name 'NativeOperator'.` @ L192
- `[full_check] Cannot find name 'TemporalRules'.` @ L194
- `[full_check] Cannot find name 'NativeOperator'.` @ L195
- `[full_check] Cannot find name 'TemporalRules'.` @ L197
- `[full_check] Cannot find name 'NativeOperator'.` @ L198
- `[full_check] Cannot find name 'NativeOperator'.` @ L201
- `[full_check] Cannot find name 'makeStatementName'.` @ L203
- `[full_check] Cannot find name 'NativeOperator'.` @ L211
- `[full_check] Cannot find name 'TemporalRules'.` @ L213
- `[full_check] Cannot find name 'NativeOperator'.` @ L214
- `[full_check] Cannot find name 'TemporalRules'.` @ L215
- `[full_check] Cannot find name 'NativeOperator'.` @ L216
- `[full_check] Cannot find name 'TemporalRules'.` @ L217
- `[full_check] Cannot find name 'NativeOperator'.` @ L218
- `[full_check] Cannot find name 'NativeOperator'.` @ L223
- `[full_check] Cannot find name 'TemporalRules'.` @ L231
- `[full_check] Cannot find name 'TemporalRules'.` @ L235
- `[full_check] Cannot find name 'TemporalRules'.` @ L239
- `[syntax_check] Cannot find name 'Statement'.` @ L11
- `[syntax_check] Cannot find name 'TemporalRules'.` @ L12
- `[syntax_check] Cannot find name 'Term'.` @ L22
- `[syntax_check] Cannot find name 'Term'.` @ L29
- `[syntax_check] Cannot find name 'Term'.` @ L31
- `[syntax_check] Cannot find name 'Term'.` @ L31
- `[syntax_check] Cannot find name 'Term'.` @ L35
- `[syntax_check] Cannot find name 'Term'.` @ L49
- `[syntax_check] Cannot find name 'Term'.` @ L64
- `[syntax_check] Cannot find name 'Term'.` @ L64
- `[syntax_check] Cannot find name 'Term'.` @ L87
- `[syntax_check] Cannot find name 'term'.` @ L92
- `[syntax_check] Cannot find name 'Term'.` @ L99
- `[syntax_check] Cannot find name 'Term'.` @ L128
- `[syntax_check] Cannot find name 'Term'.` @ L128
- `[syntax_check] Cannot find name 'Term'.` @ L130
- `[syntax_check] Cannot find name 'Term'.` @ L130
- `[syntax_check] Cannot find name 'Term'.` @ L134
- `[syntax_check] Cannot find name 'Term'.` @ L134
- `[syntax_check] Cannot find name 'TemporalRules'.` @ L137
- `[syntax_check] Cannot find name 'Term'.` @ L144
- `[syntax_check] Cannot find name 'Term'.` @ L144
- `[syntax_check] Cannot find name 'invalidStatement'.` @ L147
- `[syntax_check] Cannot find name 'TemporalRules'.` @ L148
- `[syntax_check] Cannot find name 'TemporalRules'.` @ L148
- `[syntax_check] Cannot find name 'Equivalence'.` @ L152
- `[syntax_check] Cannot find name 'Equivalence'.` @ L152
- `[syntax_check] Cannot find name 'Interval'.` @ L154
- `[syntax_check] Cannot find name 'Interval'.` @ L154
- `[syntax_check] Cannot find name 'Term'.` @ L160
- `[syntax_check] Cannot find name 'Statement'.` @ L160
- `[syntax_check] Cannot find name 'Conjunction'.` @ L161
- `[syntax_check] Cannot find name 'Conjunction'.` @ L166
- `[syntax_check] Cannot find name 'Conjunction'.` @ L167
- `[syntax_check] Cannot find name 'Conjunction'.` @ L167
- `[syntax_check] Cannot find name 'Term'.` @ L171
- `[syntax_check] Cannot find name 'Conjunction'.` @ L171
- `[syntax_check] Cannot find name 'Statement'.` @ L172
- `[syntax_check] Cannot find name 'Term'.` @ L188
- `[syntax_check] Cannot find name 'Term'.` @ L188
- `[syntax_check] Cannot find name 'NativeOperator'.` @ L189
- `[syntax_check] Cannot find name 'TemporalRules'.` @ L191
- `[syntax_check] Cannot find name 'NativeOperator'.` @ L192
- `[syntax_check] Cannot find name 'TemporalRules'.` @ L194
- `[syntax_check] Cannot find name 'NativeOperator'.` @ L195
- `[syntax_check] Cannot find name 'TemporalRules'.` @ L197
- `[syntax_check] Cannot find name 'NativeOperator'.` @ L198
- `[syntax_check] Cannot find name 'NativeOperator'.` @ L201
- `[syntax_check] Cannot find name 'makeStatementName'.` @ L203
- `[syntax_check] Cannot find name 'NativeOperator'.` @ L211
- `[syntax_check] Cannot find name 'TemporalRules'.` @ L213
- `[syntax_check] Cannot find name 'NativeOperator'.` @ L214
- `[syntax_check] Cannot find name 'TemporalRules'.` @ L215
- `[syntax_check] Cannot find name 'NativeOperator'.` @ L216
- `[syntax_check] Cannot find name 'TemporalRules'.` @ L217
- `[syntax_check] Cannot find name 'NativeOperator'.` @ L218
- `[syntax_check] Cannot find name 'NativeOperator'.` @ L223
- `[syntax_check] Cannot find name 'TemporalRules'.` @ L231
- `[syntax_check] Cannot find name 'TemporalRules'.` @ L235
- `[syntax_check] Cannot find name 'TemporalRules'.` @ L239

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `language/Implication` -> `language/Interval`（deps.xml 第 698 行）
- `language/Implication` -> `language/CompoundTerm`（deps.xml 第 699 行）
- `language/Implication` -> `inference/TemporalRules`（deps.xml 第 700 行）
- `language/Implication` -> `language/Statement`（deps.xml 第 701 行）
- `language/Implication` -> `language/Equivalence`（deps.xml 第 702 行）
- `language/Implication` -> `language/Conjunction`（deps.xml 第 703 行）
- `language/Implication` -> `language/Term`（deps.xml 第 704 行）
- `language/Implication` -> `io/Symbols`（deps.xml 第 705 行）
- 交叉校验：
- Java graph 额外依赖：inference/TemporalRules、io/Symbols、language/CompoundTerm、language/Conjunction、language/Equivalence、language/Interval、language/Statement、language/Term

## 5. Java 功能说明

- **职责概述**：文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。
- **关键数据结构**：
- `Implication` · 继承：Statement · 实现：（无接口）
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

- ts-analysis: LOC=242 · TODO=0
- 参考文件：`java-master/src/main/java/org/opennars/language/Implication.java`
