# src/language/Term.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/language/Term.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/language/Term.java` |
| 模块链路 | `language 基座` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/language/Term.ts --noEmit`）

- 执行的命令：`npx tsc src/language/Term.ts --noEmit`
- 关键输出：
  - TS2740（L21, C28）：[full_check] Type 'SetExt' is missing the following properties from type 'Term': name, isHigherOrderStatement, isExecutable, nameInternal, and 29 more.
  - TS2769（L21, C62）：[full_check] No overload matches this call.
  - TS2769（L22, C57）：[full_check] No overload matches this call.
  - TS2769（L23, C58）：[full_check] No overload matches this call.
  - TS2300（L26, C13）：[full_check] Duplicate identifier 'name'.
  - TS2322（L26, C13）：[full_check] Type 'null' is not assignable to type 'string'.
  - TS2304（L32, C24）：[full_check] Cannot find name 'NativeOperator'.
  - TS2304（L33, C16）：[full_check] Cannot find name 'NativeOperator'.
  - TS2304（L37, C33）：[full_check] Cannot find name 'Equivalence'.
  - TS2304（L37, C66）：[full_check] Cannot find name 'Implication'.
  - TS2304（L40, C30）：[full_check] Cannot find name 'Memory'.
  - TS2304（L43, C45）：[full_check] Cannot find name 'Operation'.
  - TS2385（L68, C5）：[full_check] Overload signatures must all be public, private or protected.
  - TS2322（L108, C21）：[full_check] Type 'Term | null' is not assignable to type 'Term'.
  - TS2339（L109, C49）：[full_check] Property 'endsWith' does not exist on type 'JavaString'.
  - TS2322（L115, C21）：[full_check] Type 'null' is not assignable to type 'Int32Array'.
  - TS2322（L116, C21）：[full_check] Type 'null' is not assignable to type 'JavaString'.
  - TS2339（L117, C29）：[full_check] Property 'endsWith' does not exist on type 'JavaString'.
  - TS2339（L117, C54）：[full_check] Property 'contains' does not exist on type 'JavaString'.
  - TS2322（L122, C25）：[full_check] Type 'string' is not assignable to type 'JavaString'.
  - TS2304（L127, C29）：[full_check] Cannot find name 'StringUtils'.
  - TS2322（L128, C29）：[full_check] Type 'Integer' is not assignable to type 'number'.
  - TS2322（L130, C29）：[full_check] Type 'null' is not assignable to type 'Int32Array'.
  - TS2322（L138, C21）：[full_check] Type 'string' is not assignable to type 'CharSequence'.
  - TS2740（L141, C17）：[full_check] Type 'Int32Array' is missing the following properties from type 'number[]': pop, push, concat, shift, and 6 more.
  - TS2322（L142, C17）：[full_check] Type 'JavaString' is not assignable to type 'string'.
  - TS2300（L173, C12）：[full_check] Duplicate identifier 'name'.
  - TS2322（L178, C9）：[full_check] Type 'string' is not assignable to type 'CharSequence'.
  - TS2322（L181, C12）：[full_check] Type 'null' is not assignable to type 'number[]'.
  - TS2339（L192, C48）：[full_check] Property 'clone' does not exist on type 'number[]'.
  - TS2349（L195, C24）：[full_check] This expression is not callable.
  - TS2339（L196, C11）：[full_check] Property 'imagination' does not exist on type 'Term'.
  - TS2339（L196, C30）：[full_check] Property 'imagination' does not exist on type 'Term'.
  - TS2349（L216, C80）：[full_check] This expression is not callable.
  - TS2349（L216, C109）：[full_check] This expression is not callable.
  - TS2349（L225, C21）：[full_check] This expression is not callable.
  - TS2304（L245, C16）：[full_check] Cannot find name 'TemporalRules'.
  - TS2304（L254, C29）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L255, C36）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2345（L270, C38）：[full_check] Argument of type 'null' is not assignable to parameter of type 'Term'.
  - TS2304（L283, C37）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L284, C44）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2322（L313, C9）：[full_check] Type 'CharSequence' is not assignable to type 'string'.
  - TS2304（L320, C28）：[full_check] Cannot find name 'AbstractTerm'.
  - TS2304（L325, C30）：[full_check] Cannot find name 'Variable'.
  - TS2304（L325, C64）：[full_check] Cannot find name 'Variable'.
  - TS2304（L327, C37）：[full_check] Cannot find name 'Variable'.
  - TS2304（L327, C71）：[full_check] Cannot find name 'Variable'.
  - TS2304（L330, C16）：[full_check] Cannot find name 'Texts'.
  - TS2349（L330, C37）：[full_check] This expression is not callable.
  - TS2365（L361, C23）：[full_check] Operator '+' cannot be applied to types 'Integer' and 'number'.
  - TS2345（L361, C46）：[full_check] Argument of type 'number' is not assignable to parameter of type 'Integer'.
  - TS2349（L376, C21）：[full_check] This expression is not callable.
  - TS2769（L384, C25）：[full_check] No overload matches this call.
  - TS2304（L410, C26）：[full_check] Cannot find name 'Symbols'.
  - TS2304（L412, C26）：[full_check] Cannot find name 'Symbols'.
  - TS2304（L414, C26）：[full_check] Cannot find name 'Symbols'.
  - TS2694（L449, C58）：[full_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/util/index"' has no exported member 'NavigableSet'.
  - TS2694（L451, C26）：[full_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/util/index"' has no exported member 'NavigableSet'.
  - TS2339（L451, C61）：[full_check] Property 'TreeSet' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/util/index")'.
  - TS2339（L452, C31）：[full_check] Property 'addAll' does not exist on type 'typeof Collections'.
  - TS2304（L469, C21）：[full_check] Cannot find name 'Debug'.
  - TS2694（L492, C26）：[full_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/util/index"' has no exported member 'NavigableSet'.
  - TS2339（L492, C61）：[full_check] Property 'TreeSet' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/util/index")'.
  - TS2339（L496, C31）：[full_check] Property 'addAll' does not exist on type 'typeof Collections'.
  - TS2304（L511, C29）：[full_check] Cannot find name 'Statement'.
  - TS2304（L512, C23）：[full_check] Cannot find name 'Statement'.
  - TS2304（L512, C43）：[full_check] Cannot find name 'Statement'.
  - TS2304（L513, C46）：[full_check] Cannot find name 'Variable'.
  - TS2304（L514, C24）：[full_check] Cannot find name 'Variable'.
  - TS2304（L514, C56）：[full_check] Cannot find name 'Variable'.
  - TS2304（L519, C48）：[full_check] Cannot find name 'Variable'.
  - TS2304（L520, C24）：[full_check] Cannot find name 'Variable'.
  - TS2304（L520, C58）：[full_check] Cannot find name 'Variable'.
  - TS2740（L21, C28）：[syntax_check] Type 'SetExt' is missing the following properties from type 'Term': name, isHigherOrderStatement, isExecutable, nameInternal, and 29 more.
  - TS2769（L21, C62）：[syntax_check] No overload matches this call.
  - TS2769（L22, C57）：[syntax_check] No overload matches this call.
  - TS2769（L23, C58）：[syntax_check] No overload matches this call.
  - TS2300（L26, C13）：[syntax_check] Duplicate identifier 'name'.
  - TS2322（L26, C13）：[syntax_check] Type 'null' is not assignable to type 'string'.
  - TS2304（L32, C24）：[syntax_check] Cannot find name 'NativeOperator'.
  - TS2304（L33, C16）：[syntax_check] Cannot find name 'NativeOperator'.
  - TS2304（L37, C33）：[syntax_check] Cannot find name 'Equivalence'.
  - TS2304（L37, C66）：[syntax_check] Cannot find name 'Implication'.
  - TS2304（L40, C30）：[syntax_check] Cannot find name 'Memory'.
  - TS2304（L43, C45）：[syntax_check] Cannot find name 'Operation'.
  - TS2385（L68, C5）：[syntax_check] Overload signatures must all be public, private or protected.
  - TS2322（L108, C21）：[syntax_check] Type 'Term | null' is not assignable to type 'Term'.
  - TS2339（L109, C49）：[syntax_check] Property 'endsWith' does not exist on type 'JavaString'.
  - TS2322（L115, C21）：[syntax_check] Type 'null' is not assignable to type 'Int32Array'.
  - TS2322（L116, C21）：[syntax_check] Type 'null' is not assignable to type 'JavaString'.
  - TS2339（L117, C29）：[syntax_check] Property 'endsWith' does not exist on type 'JavaString'.
  - TS2339（L117, C54）：[syntax_check] Property 'contains' does not exist on type 'JavaString'.
  - TS2322（L122, C25）：[syntax_check] Type 'string' is not assignable to type 'JavaString'.
  - TS2304（L127, C29）：[syntax_check] Cannot find name 'StringUtils'.
  - TS2322（L128, C29）：[syntax_check] Type 'Integer' is not assignable to type 'number'.
  - TS2322（L130, C29）：[syntax_check] Type 'null' is not assignable to type 'Int32Array'.
  - TS2322（L138, C21）：[syntax_check] Type 'string' is not assignable to type 'CharSequence'.
  - TS2740（L141, C17）：[syntax_check] Type 'Int32Array' is missing the following properties from type 'number[]': pop, push, concat, shift, and 6 more.
  - TS2322（L142, C17）：[syntax_check] Type 'JavaString' is not assignable to type 'string'.
  - TS2300（L173, C12）：[syntax_check] Duplicate identifier 'name'.
  - TS2322（L178, C9）：[syntax_check] Type 'string' is not assignable to type 'CharSequence'.
  - TS2322（L181, C12）：[syntax_check] Type 'null' is not assignable to type 'number[]'.
  - TS2339（L192, C48）：[syntax_check] Property 'clone' does not exist on type 'number[]'.
  - TS2349（L195, C24）：[syntax_check] This expression is not callable.
  - TS2339（L196, C11）：[syntax_check] Property 'imagination' does not exist on type 'Term'.
  - TS2339（L196, C30）：[syntax_check] Property 'imagination' does not exist on type 'Term'.
  - TS2349（L216, C80）：[syntax_check] This expression is not callable.
  - TS2349（L216, C109）：[syntax_check] This expression is not callable.
  - TS2349（L225, C21）：[syntax_check] This expression is not callable.
  - TS2304（L245, C16）：[syntax_check] Cannot find name 'TemporalRules'.
  - TS2304（L254, C29）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L255, C36）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2345（L270, C38）：[syntax_check] Argument of type 'null' is not assignable to parameter of type 'Term'.
  - TS2304（L283, C37）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L284, C44）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2322（L313, C9）：[syntax_check] Type 'CharSequence' is not assignable to type 'string'.
  - TS2304（L320, C28）：[syntax_check] Cannot find name 'AbstractTerm'.
  - TS2304（L325, C30）：[syntax_check] Cannot find name 'Variable'.
  - TS2304（L325, C64）：[syntax_check] Cannot find name 'Variable'.
  - TS2304（L327, C37）：[syntax_check] Cannot find name 'Variable'.
  - TS2304（L327, C71）：[syntax_check] Cannot find name 'Variable'.
  - TS2304（L330, C16）：[syntax_check] Cannot find name 'Texts'.
  - TS2349（L330, C37）：[syntax_check] This expression is not callable.
  - TS2365（L361, C23）：[syntax_check] Operator '+' cannot be applied to types 'Integer' and 'number'.
  - TS2345（L361, C46）：[syntax_check] Argument of type 'number' is not assignable to parameter of type 'Integer'.
  - TS2349（L376, C21）：[syntax_check] This expression is not callable.
  - TS2769（L384, C25）：[syntax_check] No overload matches this call.
  - TS2304（L410, C26）：[syntax_check] Cannot find name 'Symbols'.
  - TS2304（L412, C26）：[syntax_check] Cannot find name 'Symbols'.
  - TS2304（L414, C26）：[syntax_check] Cannot find name 'Symbols'.
  - TS2694（L449, C58）：[syntax_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/util/index"' has no exported member 'NavigableSet'.
  - TS2694（L451, C26）：[syntax_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/util/index"' has no exported member 'NavigableSet'.
  - TS2339（L451, C61）：[syntax_check] Property 'TreeSet' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/util/index")'.
  - TS2339（L452, C31）：[syntax_check] Property 'addAll' does not exist on type 'typeof Collections'.
  - TS2304（L469, C21）：[syntax_check] Cannot find name 'Debug'.
  - TS2694（L492, C26）：[syntax_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/util/index"' has no exported member 'NavigableSet'.
  - TS2339（L492, C61）：[syntax_check] Property 'TreeSet' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/util/index")'.
  - TS2339（L496, C31）：[syntax_check] Property 'addAll' does not exist on type 'typeof Collections'.
  - TS2304（L511, C29）：[syntax_check] Cannot find name 'Statement'.
  - TS2304（L512, C23）：[syntax_check] Cannot find name 'Statement'.
  - TS2304（L512, C43）：[syntax_check] Cannot find name 'Statement'.
  - TS2304（L513, C46）：[syntax_check] Cannot find name 'Variable'.
  - TS2304（L514, C24）：[syntax_check] Cannot find name 'Variable'.
  - TS2304（L514, C56）：[syntax_check] Cannot find name 'Variable'.
  - TS2304（L519, C48）：[syntax_check] Cannot find name 'Variable'.
  - TS2304（L520, C24）：[syntax_check] Cannot find name 'Variable'.
  - TS2304（L520, C58）：[syntax_check] Cannot find name 'Variable'.
- 总结：存在语法错误，需要比对 Java 语句结构。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

| 符号 | 来源文件 | 触发位置 | 依赖原因 |
| --- | --- | --- | --- |
| `SetExt` | `src/language/SetExt.ts` | import | 结构性：Term 直接使用 SetExt 的主流程 |

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

- `[full_check] Cannot find name 'NativeOperator'.` @ L32
- `[full_check] Cannot find name 'NativeOperator'.` @ L33
- `[full_check] Cannot find name 'Equivalence'.` @ L37
- `[full_check] Cannot find name 'Implication'.` @ L37
- `[full_check] Cannot find name 'Memory'.` @ L40
- `[full_check] Cannot find name 'Operation'.` @ L43
- `[full_check] Cannot find name 'StringUtils'.` @ L127
- `[full_check] Cannot find name 'TemporalRules'.` @ L245
- `[full_check] Cannot find name 'CompoundTerm'.` @ L254
- `[full_check] Cannot find name 'CompoundTerm'.` @ L255
- `[full_check] Cannot find name 'CompoundTerm'.` @ L283
- `[full_check] Cannot find name 'CompoundTerm'.` @ L284
- `[full_check] Cannot find name 'AbstractTerm'.` @ L320
- `[full_check] Cannot find name 'Variable'.` @ L325
- `[full_check] Cannot find name 'Variable'.` @ L325
- `[full_check] Cannot find name 'Variable'.` @ L327
- `[full_check] Cannot find name 'Variable'.` @ L327
- `[full_check] Cannot find name 'Texts'.` @ L330
- `[full_check] Cannot find name 'Symbols'.` @ L410
- `[full_check] Cannot find name 'Symbols'.` @ L412
- `[full_check] Cannot find name 'Symbols'.` @ L414
- `[full_check] Cannot find name 'Debug'.` @ L469
- `[full_check] Cannot find name 'Statement'.` @ L511
- `[full_check] Cannot find name 'Statement'.` @ L512
- `[full_check] Cannot find name 'Statement'.` @ L512
- `[full_check] Cannot find name 'Variable'.` @ L513
- `[full_check] Cannot find name 'Variable'.` @ L514
- `[full_check] Cannot find name 'Variable'.` @ L514
- `[full_check] Cannot find name 'Variable'.` @ L519
- `[full_check] Cannot find name 'Variable'.` @ L520
- `[full_check] Cannot find name 'Variable'.` @ L520
- `[syntax_check] Cannot find name 'NativeOperator'.` @ L32
- `[syntax_check] Cannot find name 'NativeOperator'.` @ L33
- `[syntax_check] Cannot find name 'Equivalence'.` @ L37
- `[syntax_check] Cannot find name 'Implication'.` @ L37
- `[syntax_check] Cannot find name 'Memory'.` @ L40
- `[syntax_check] Cannot find name 'Operation'.` @ L43
- `[syntax_check] Cannot find name 'StringUtils'.` @ L127
- `[syntax_check] Cannot find name 'TemporalRules'.` @ L245
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L254
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L255
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L283
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L284
- `[syntax_check] Cannot find name 'AbstractTerm'.` @ L320
- `[syntax_check] Cannot find name 'Variable'.` @ L325
- `[syntax_check] Cannot find name 'Variable'.` @ L325
- `[syntax_check] Cannot find name 'Variable'.` @ L327
- `[syntax_check] Cannot find name 'Variable'.` @ L327
- `[syntax_check] Cannot find name 'Texts'.` @ L330
- `[syntax_check] Cannot find name 'Symbols'.` @ L410
- `[syntax_check] Cannot find name 'Symbols'.` @ L412
- `[syntax_check] Cannot find name 'Symbols'.` @ L414
- `[syntax_check] Cannot find name 'Debug'.` @ L469
- `[syntax_check] Cannot find name 'Statement'.` @ L511
- `[syntax_check] Cannot find name 'Statement'.` @ L512
- `[syntax_check] Cannot find name 'Statement'.` @ L512
- `[syntax_check] Cannot find name 'Variable'.` @ L513
- `[syntax_check] Cannot find name 'Variable'.` @ L514
- `[syntax_check] Cannot find name 'Variable'.` @ L514
- `[syntax_check] Cannot find name 'Variable'.` @ L519
- `[syntax_check] Cannot find name 'Variable'.` @ L520
- `[syntax_check] Cannot find name 'Variable'.` @ L520

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `language/Term` -> `io/Texts`（deps.xml 第 810 行）
- `language/Term` -> `language/Implication`（deps.xml 第 811 行）
- `language/Term` -> `language/CompoundTerm`（deps.xml 第 812 行）
- `language/Term` -> `inference/TemporalRules`（deps.xml 第 813 行）
- `language/Term` -> `language/Statement`（deps.xml 第 814 行）
- `language/Term` -> `io/Symbols`（deps.xml 第 815 行）
- `language/Term` -> `parameter/Debug`（deps.xml 第 816 行）
- `language/Term` -> `operator/ImaginationSpace`（deps.xml 第 817 行）
- `language/Term` -> `language/Variable`（deps.xml 第 818 行）
- `language/Term` -> `language/SetExt`（deps.xml 第 819 行）
- `language/Term` -> `operator/Operation`（deps.xml 第 820 行）
- `language/Term` -> `language/AbstractTerm`（deps.xml 第 821 行）
- `language/Term` -> `language/Equivalence`（deps.xml 第 822 行）
- `language/Term` -> `storage/Memory`（deps.xml 第 823 行）
- 交叉校验：
- Java graph 额外依赖：inference/TemporalRules、io/Symbols、io/Texts、language/AbstractTerm、language/CompoundTerm、language/Equivalence、language/Implication、language/Statement、language/Variable、operator/ImaginationSpace、operator/Operation、parameter/Debug、storage/Memory

## 5. Java 功能说明

- **职责概述**：文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。；TODO 1 处
- **关键数据结构**：
- `Term` · 继承：JavaObject · 实现：（无接口）
- **核心流程 / 算法**：
  1. 依赖准备：依赖：language/SetExt.ts
  2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。；TODO 1 处
  3. Java-TS 差异：参见《通用转译法.md》 - 语言层
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `language/SetExt` 衔接上下游。

## 6. 一致性风险

- 文件内仍保留 1 处 TODO，需对照 Java 填补。
- `tsc` 报错阻塞进一步分析，需要回填语句结构。

## 7. 路线图定位

- 1. 依赖准备：依赖：language/SetExt.ts
- 2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。；TODO 1 处
- 3. Java-TS 差异：参见《通用转译法.md》 - 语言层

## 8. 附加记录

- ts-analysis: LOC=536 · TODO=1
- 参考文件：`java-master/src/main/java/org/opennars/language/Term.java`
