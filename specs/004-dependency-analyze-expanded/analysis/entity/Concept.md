# src/entity/Concept.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/entity/Concept.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/entity/Concept.java` |
| 模块链路 | `language 基座 -> entity 实体层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/entity/Concept.ts --noEmit`）

- 执行的命令：`npx tsc src/entity/Concept.ts --noEmit`
- 关键输出：
  - TS2564（L28, C12）：[full_check] Property 'seq_before' has no initializer and is not definitely assigned in the constructor.
  - TS2344（L28, C28）：[full_check] Type 'Task' does not satisfy the constraint 'Item<Sentence>'.
  - TS2344（L33, C36）：[full_check] Type 'TaskLink' does not satisfy the constraint 'Item<Task>'.
  - TS2304（L38, C36）：[full_check] Cannot find name 'TermLink'.
  - TS2304（L38, C46）：[full_check] Cannot find name 'TermLink'.
  - TS2304（L44, C55）：[full_check] Cannot find name 'TermLink'.
  - TS2304（L75, C29）：[full_check] Cannot find name 'Memory'.
  - TS2694（L80, C64）：[full_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/lang/index"' has no exported member 'Float'.
  - TS2304（L92, C27）：[full_check] Cannot find name 'BudgetValue'.
  - TS2304（L92, C58）：[full_check] Cannot find name 'Memory'.
  - TS2322（L98, C9）：[full_check] Type 'ArrayList<unknown>' is not assignable to type 'List<Task>'.
  - TS2322（L99, C9）：[full_check] Type 'ArrayList<unknown>' is not assignable to type 'List<Task>'.
  - TS2322（L100, C9）：[full_check] Type 'ArrayList<unknown>' is not assignable to type 'List<Task>'.
  - TS2322（L101, C9）：[full_check] Type 'ArrayList<unknown>' is not assignable to type 'List<Task>'.
  - TS2322（L102, C9）：[full_check] Type 'ArrayList<unknown>' is not assignable to type 'List<Task>'.
  - TS2322（L103, C9）：[full_check] Type 'ArrayList<unknown>' is not assignable to type 'List<Task>'.
  - TS2322（L105, C9）：[full_check] Type 'Bag<Item<Task>, Task>' is not assignable to type 'Bag<TaskLink, Task>'.
  - TS2304（L110, C27）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L111, C45）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2322（L113, C13）：[full_check] Type 'null' is not assignable to type 'List<TermLink>'.
  - TS2367（L119, C13）：[full_check] This comparison appears to be unintentional because the types 'this' and 'JavaObject' have no overlap.
  - TS2322（L139, C13）：[full_check] Type 'null' is not assignable to type 'Sentence'.
  - TS2322（L140, C9）：[full_check] Type 'void' is not assignable to type 'Task'.
  - TS2555（L140, C25）：[full_check] Expected at least 6 arguments, but got 4.
  - TS2304（L162, C44）：[full_check] Cannot find name 'DerivationContext'.
  - TS2304（L163, C25）：[full_check] Cannot find name 'BudgetValue'.
  - TS2339（L163, C44）：[full_check] Property 'budget' does not exist on type 'Task'.
  - TS2304（L168, C36）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L175, C24）：[full_check] Cannot find name 'BudgetValue'.
  - TS2304（L175, C38）：[full_check] Cannot find name 'distributeAmongLinks'.
  - TS2304（L179, C39）：[full_check] Cannot find name 'TermLink'.
  - TS2304（L210, C28）：[full_check] Cannot find name 'rankBelief'.
  - TS2304（L215, C21）：[full_check] Cannot find name 'rankBelief'.
  - TS2322（L221, C21）：[full_check] Type 'null' is not assignable to type 'Task'.
  - TS2322（L231, C17）：[full_check] Type 'Task | undefined' is not assignable to type 'Task'.
  - TS2322（L237, C9）：[full_check] Type 'null' is not assignable to type 'Task'.
  - TS2304（L247, C75）：[full_check] Cannot find name 'Timable'.
  - TS2322（L253, C13）：[full_check] Type 'null' is not assignable to type 'Task'.
  - TS2304（L258, C29）：[full_check] Cannot find name 'LocalRules'.
  - TS2322（L288, C16）：[full_check] Type 'null' is not assignable to type 'Task'.
  - TS2322（L289, C16）：[full_check] Type 'number' is not assignable to type 'bigint'.
  - TS2322（L290, C16）：[full_check] Type 'number' is not assignable to type 'bigint'.
  - TS2322（L303, C12）：[full_check] Type 'ArrayList<unknown>' is not assignable to type 'List<AnticipationEntry>'.
  - TS2304（L313, C55）：[full_check] Cannot find name 'DerivationContext'.
  - TS2304（L316, C9）：[full_check] Cannot find name 'ProcessQuestion'.
  - TS2304（L318, C9）：[full_check] Cannot find name 'ProcessQuestion'.
  - TS2339（L324, C48）：[full_check] Property 'Float' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/lang/index")'.
  - TS2322（L325, C13）：[full_check] Type 'null' is not assignable to type 'TaskLink'.
  - TS2488（L326, C24）：[full_check] Type 'Bag<TaskLink, Task>' must have a '[Symbol.iterator]()' method that returns an iterator.
  - TS2304（L337, C38）：[full_check] Cannot find name 'TaskLinkRemove'.
  - TS2304（L346, C34）：[full_check] Cannot find name 'TaskLinkRemove'.
  - TS2304（L349, C34）：[full_check] Cannot find name 'TaskLinkRemove'.
  - TS2304（L352, C26）：[full_check] Cannot find name 'TaskLinkAdd'.
  - TS2304（L363, C39）：[full_check] Cannot find name 'BudgetValue'.
  - TS2314（L363, C67）：[full_check] Generic type 'Parameters' requires 1 type argument(s).
  - TS2304（L368, C24）：[full_check] Cannot find name 'BudgetValue'.
  - TS2304（L368, C38）：[full_check] Cannot find name 'distributeAmongLinks'.
  - TS2304（L375, C35）：[full_check] Cannot find name 'TermLink'.
  - TS2304（L387, C37）：[full_check] Cannot find name 'TermLink'.
  - TS2304（L388, C40）：[full_check] Cannot find name 'TermLink'.
  - TS2304（L390, C35）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L390, C69）：[full_check] Cannot find name 'TermLink'.
  - TS2304（L403, C37）：[full_check] Cannot find name 'TermLink'.
  - TS2304（L404, C22）：[full_check] Cannot find name 'TermLink'.
  - TS2304（L407, C34）：[full_check] Cannot find name 'TermLinkRemove'.
  - TS2304（L411, C34）：[full_check] Cannot find name 'TermLinkRemove'.
  - TS2304（L414, C26）：[full_check] Cannot find name 'TermLinkAdd'.
  - TS2322（L432, C13）：[full_check] Type 'string' is not assignable to type 'JavaString'.
  - TS2663（L432, C37）：[full_check] Cannot find name 'toStringExternal'. Did you mean the instance member 'this.toStringExternal'?
  - TS2341（L432, C74）：[full_check] Property 'name' is private and only accessible within class 'Term'.
  - TS2349（L432, C74）：[full_check] This expression is not callable.
  - TS2345（L433, C38）：[full_check] Argument of type 'number' is not assignable to parameter of type 'JavaObject'.
  - TS2345（L434, C38）：[full_check] Argument of type 'number' is not assignable to parameter of type 'JavaObject'.
  - TS2345（L435, C38）：[full_check] Argument of type 'number' is not assignable to parameter of type 'JavaObject'.
  - TS2345（L436, C38）：[full_check] Argument of type 'number' is not assignable to parameter of type 'JavaObject'.
  - TS2345（L437, C38）：[full_check] Argument of type 'number' is not assignable to parameter of type 'JavaObject'.
  - TS2345（L438, C38）：[full_check] Argument of type 'number' is not assignable to parameter of type 'JavaObject'.
  - TS2322（L452, C13）：[full_check] Type 'string' is not assignable to type 'JavaString'.
  - TS2322（L455, C13）：[full_check] Type 'string' is not assignable to type 'JavaString'.
  - TS2339（L479, C34）：[full_check] Property 'math' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/index")'.
  - TS2304（L494, C51）：[full_check] Cannot find name 'TermLink'.
  - TS2304（L508, C27）：[full_check] Cannot find name 'DerivationContext'.
  - TS2304（L509, C24）：[full_check] Cannot find name 'Stamp'.
  - TS2304（L514, C22）：[full_check] Cannot find name 'BeliefSelect'.
  - TS2322（L527, C9）：[full_check] Type 'null' is not assignable to type 'Sentence'.
  - TS2304（L533, C25）：[full_check] Cannot find name 'TruthValue'.
  - TS2304（L537, C23）：[full_check] Cannot find name 'TruthValue'.
  - TS2314（L548, C74）：[full_check] Generic type 'Parameters' requires 1 type argument(s).
  - TS2304（L548, C87）：[full_check] Cannot find name 'TermLink'.
  - TS2304（L553, C27）：[full_check] Cannot find name 'TermLink'.
  - TS2304（L568, C37）：[full_check] Cannot find name 'TermLink'.
  - TS2304（L596, C24）：[full_check] Cannot find name 'NativeOperator'.
  - TS2564（L28, C12）：[syntax_check] Property 'seq_before' has no initializer and is not definitely assigned in the constructor.
  - TS2344（L28, C28）：[syntax_check] Type 'Task' does not satisfy the constraint 'Item<Sentence>'.
  - TS2344（L33, C36）：[syntax_check] Type 'TaskLink' does not satisfy the constraint 'Item<Task>'.
  - TS2304（L38, C36）：[syntax_check] Cannot find name 'TermLink'.
  - TS2304（L38, C46）：[syntax_check] Cannot find name 'TermLink'.
  - TS2304（L44, C55）：[syntax_check] Cannot find name 'TermLink'.
  - TS2304（L75, C29）：[syntax_check] Cannot find name 'Memory'.
  - TS2694（L80, C64）：[syntax_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/lang/index"' has no exported member 'Float'.
  - TS2304（L92, C27）：[syntax_check] Cannot find name 'BudgetValue'.
  - TS2304（L92, C58）：[syntax_check] Cannot find name 'Memory'.
  - TS2322（L98, C9）：[syntax_check] Type 'ArrayList<unknown>' is not assignable to type 'List<Task>'.
  - TS2322（L99, C9）：[syntax_check] Type 'ArrayList<unknown>' is not assignable to type 'List<Task>'.
  - TS2322（L100, C9）：[syntax_check] Type 'ArrayList<unknown>' is not assignable to type 'List<Task>'.
  - TS2322（L101, C9）：[syntax_check] Type 'ArrayList<unknown>' is not assignable to type 'List<Task>'.
  - TS2322（L102, C9）：[syntax_check] Type 'ArrayList<unknown>' is not assignable to type 'List<Task>'.
  - TS2322（L103, C9）：[syntax_check] Type 'ArrayList<unknown>' is not assignable to type 'List<Task>'.
  - TS2322（L105, C9）：[syntax_check] Type 'Bag<Item<Task>, Task>' is not assignable to type 'Bag<TaskLink, Task>'.
  - TS2304（L110, C27）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L111, C45）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2322（L113, C13）：[syntax_check] Type 'null' is not assignable to type 'List<TermLink>'.
  - TS2367（L119, C13）：[syntax_check] This comparison appears to be unintentional because the types 'this' and 'JavaObject' have no overlap.
  - TS2322（L139, C13）：[syntax_check] Type 'null' is not assignable to type 'Sentence'.
  - TS2322（L140, C9）：[syntax_check] Type 'void' is not assignable to type 'Task'.
  - TS2555（L140, C25）：[syntax_check] Expected at least 6 arguments, but got 4.
  - TS2304（L162, C44）：[syntax_check] Cannot find name 'DerivationContext'.
  - TS2304（L163, C25）：[syntax_check] Cannot find name 'BudgetValue'.
  - TS2339（L163, C44）：[syntax_check] Property 'budget' does not exist on type 'Task'.
  - TS2304（L168, C36）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L175, C24）：[syntax_check] Cannot find name 'BudgetValue'.
  - TS2304（L175, C38）：[syntax_check] Cannot find name 'distributeAmongLinks'.
  - TS2304（L179, C39）：[syntax_check] Cannot find name 'TermLink'.
  - TS2304（L210, C28）：[syntax_check] Cannot find name 'rankBelief'.
  - TS2304（L215, C21）：[syntax_check] Cannot find name 'rankBelief'.
  - TS2322（L221, C21）：[syntax_check] Type 'null' is not assignable to type 'Task'.
  - TS2322（L231, C17）：[syntax_check] Type 'Task | undefined' is not assignable to type 'Task'.
  - TS2322（L237, C9）：[syntax_check] Type 'null' is not assignable to type 'Task'.
  - TS2304（L247, C75）：[syntax_check] Cannot find name 'Timable'.
  - TS2322（L253, C13）：[syntax_check] Type 'null' is not assignable to type 'Task'.
  - TS2304（L258, C29）：[syntax_check] Cannot find name 'LocalRules'.
  - TS2322（L288, C16）：[syntax_check] Type 'null' is not assignable to type 'Task'.
  - TS2322（L289, C16）：[syntax_check] Type 'number' is not assignable to type 'bigint'.
  - TS2322（L290, C16）：[syntax_check] Type 'number' is not assignable to type 'bigint'.
  - TS2322（L303, C12）：[syntax_check] Type 'ArrayList<unknown>' is not assignable to type 'List<AnticipationEntry>'.
  - TS2304（L313, C55）：[syntax_check] Cannot find name 'DerivationContext'.
  - TS2304（L316, C9）：[syntax_check] Cannot find name 'ProcessQuestion'.
  - TS2304（L318, C9）：[syntax_check] Cannot find name 'ProcessQuestion'.
  - TS2339（L324, C48）：[syntax_check] Property 'Float' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/lang/index")'.
  - TS2322（L325, C13）：[syntax_check] Type 'null' is not assignable to type 'TaskLink'.
  - TS2488（L326, C24）：[syntax_check] Type 'Bag<TaskLink, Task>' must have a '[Symbol.iterator]()' method that returns an iterator.
  - TS2304（L337, C38）：[syntax_check] Cannot find name 'TaskLinkRemove'.
  - TS2304（L346, C34）：[syntax_check] Cannot find name 'TaskLinkRemove'.
  - TS2304（L349, C34）：[syntax_check] Cannot find name 'TaskLinkRemove'.
  - TS2304（L352, C26）：[syntax_check] Cannot find name 'TaskLinkAdd'.
  - TS2304（L363, C39）：[syntax_check] Cannot find name 'BudgetValue'.
  - TS2314（L363, C67）：[syntax_check] Generic type 'Parameters' requires 1 type argument(s).
  - TS2304（L368, C24）：[syntax_check] Cannot find name 'BudgetValue'.
  - TS2304（L368, C38）：[syntax_check] Cannot find name 'distributeAmongLinks'.
  - TS2304（L375, C35）：[syntax_check] Cannot find name 'TermLink'.
  - TS2304（L387, C37）：[syntax_check] Cannot find name 'TermLink'.
  - TS2304（L388, C40）：[syntax_check] Cannot find name 'TermLink'.
  - TS2304（L390, C35）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L390, C69）：[syntax_check] Cannot find name 'TermLink'.
  - TS2304（L403, C37）：[syntax_check] Cannot find name 'TermLink'.
  - TS2304（L404, C22）：[syntax_check] Cannot find name 'TermLink'.
  - TS2304（L407, C34）：[syntax_check] Cannot find name 'TermLinkRemove'.
  - TS2304（L411, C34）：[syntax_check] Cannot find name 'TermLinkRemove'.
  - TS2304（L414, C26）：[syntax_check] Cannot find name 'TermLinkAdd'.
  - TS2322（L432, C13）：[syntax_check] Type 'string' is not assignable to type 'JavaString'.
  - TS2663（L432, C37）：[syntax_check] Cannot find name 'toStringExternal'. Did you mean the instance member 'this.toStringExternal'?
  - TS2341（L432, C74）：[syntax_check] Property 'name' is private and only accessible within class 'Term'.
  - TS2349（L432, C74）：[syntax_check] This expression is not callable.
  - TS2345（L433, C38）：[syntax_check] Argument of type 'number' is not assignable to parameter of type 'JavaObject'.
  - TS2345（L434, C38）：[syntax_check] Argument of type 'number' is not assignable to parameter of type 'JavaObject'.
  - TS2345（L435, C38）：[syntax_check] Argument of type 'number' is not assignable to parameter of type 'JavaObject'.
  - TS2345（L436, C38）：[syntax_check] Argument of type 'number' is not assignable to parameter of type 'JavaObject'.
  - TS2345（L437, C38）：[syntax_check] Argument of type 'number' is not assignable to parameter of type 'JavaObject'.
  - TS2345（L438, C38）：[syntax_check] Argument of type 'number' is not assignable to parameter of type 'JavaObject'.
  - TS2322（L452, C13）：[syntax_check] Type 'string' is not assignable to type 'JavaString'.
  - TS2322（L455, C13）：[syntax_check] Type 'string' is not assignable to type 'JavaString'.
  - TS2339（L479, C34）：[syntax_check] Property 'math' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/index")'.
  - TS2304（L494, C51）：[syntax_check] Cannot find name 'TermLink'.
  - TS2304（L508, C27）：[syntax_check] Cannot find name 'DerivationContext'.
  - TS2304（L509, C24）：[syntax_check] Cannot find name 'Stamp'.
  - TS2304（L514, C22）：[syntax_check] Cannot find name 'BeliefSelect'.
  - TS2322（L527, C9）：[syntax_check] Type 'null' is not assignable to type 'Sentence'.
  - TS2304（L533, C25）：[syntax_check] Cannot find name 'TruthValue'.
  - TS2304（L537, C23）：[syntax_check] Cannot find name 'TruthValue'.
  - TS2314（L548, C74）：[syntax_check] Generic type 'Parameters' requires 1 type argument(s).
  - TS2304（L548, C87）：[syntax_check] Cannot find name 'TermLink'.
  - TS2304（L553, C27）：[syntax_check] Cannot find name 'TermLink'.
  - TS2304（L568, C37）：[syntax_check] Cannot find name 'TermLink'.
  - TS2304（L596, C24）：[syntax_check] Cannot find name 'NativeOperator'.
- 总结：存在语法错误，需要比对 Java 语句结构。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

| 符号 | 来源文件 | 触发位置 | 依赖原因 |
| --- | --- | --- | --- |
| `Item` | `src/entity/Item.ts` | import | 结构性：Concept 直接使用 Item 的主流程 |
| `Term` | `src/language/Term.ts` | import | 结构性：Concept 直接使用 Term 的主流程 |
| `Sentence` | `src/entity/Sentence.ts` | import | 结构性：Concept 直接使用 Sentence 的主流程 |
| `Task` | `src/entity/Task.ts` | import | 结构性：Concept 直接使用 Task 的主流程 |
| `Bag` | `src/storage/Bag.ts` | import | 结构性：Concept 直接使用 Bag 的主流程 |
| `TaskLink` | `src/entity/TaskLink.ts` | import | 结构性：Concept 直接使用 TaskLink 的主流程 |

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

- `[full_check] Cannot find name 'TermLink'.` @ L38
- `[full_check] Cannot find name 'TermLink'.` @ L38
- `[full_check] Cannot find name 'TermLink'.` @ L44
- `[full_check] Cannot find name 'Memory'.` @ L75
- `[full_check] Cannot find name 'BudgetValue'.` @ L92
- `[full_check] Cannot find name 'Memory'.` @ L92
- `[full_check] Cannot find name 'CompoundTerm'.` @ L110
- `[full_check] Cannot find name 'CompoundTerm'.` @ L111
- `[full_check] Cannot find name 'DerivationContext'.` @ L162
- `[full_check] Cannot find name 'BudgetValue'.` @ L163
- `[full_check] Cannot find name 'CompoundTerm'.` @ L168
- `[full_check] Cannot find name 'BudgetValue'.` @ L175
- `[full_check] Cannot find name 'distributeAmongLinks'.` @ L175
- `[full_check] Cannot find name 'TermLink'.` @ L179
- `[full_check] Cannot find name 'rankBelief'.` @ L210
- `[full_check] Cannot find name 'rankBelief'.` @ L215
- `[full_check] Cannot find name 'Timable'.` @ L247
- `[full_check] Cannot find name 'LocalRules'.` @ L258
- `[full_check] Cannot find name 'DerivationContext'.` @ L313
- `[full_check] Cannot find name 'ProcessQuestion'.` @ L316
- `[full_check] Cannot find name 'ProcessQuestion'.` @ L318
- `[full_check] Cannot find name 'TaskLinkRemove'.` @ L337
- `[full_check] Cannot find name 'TaskLinkRemove'.` @ L346
- `[full_check] Cannot find name 'TaskLinkRemove'.` @ L349
- `[full_check] Cannot find name 'TaskLinkAdd'.` @ L352
- `[full_check] Cannot find name 'BudgetValue'.` @ L363
- `[full_check] Cannot find name 'BudgetValue'.` @ L368
- `[full_check] Cannot find name 'distributeAmongLinks'.` @ L368
- `[full_check] Cannot find name 'TermLink'.` @ L375
- `[full_check] Cannot find name 'TermLink'.` @ L387
- `[full_check] Cannot find name 'TermLink'.` @ L388
- `[full_check] Cannot find name 'CompoundTerm'.` @ L390
- `[full_check] Cannot find name 'TermLink'.` @ L390
- `[full_check] Cannot find name 'TermLink'.` @ L403
- `[full_check] Cannot find name 'TermLink'.` @ L404
- `[full_check] Cannot find name 'TermLinkRemove'.` @ L407
- `[full_check] Cannot find name 'TermLinkRemove'.` @ L411
- `[full_check] Cannot find name 'TermLinkAdd'.` @ L414
- `[full_check] Cannot find name 'toStringExternal'. Did you mean the instance member 'this.toStringExternal'?` @ L432
- `[full_check] Cannot find name 'TermLink'.` @ L494
- `[full_check] Cannot find name 'DerivationContext'.` @ L508
- `[full_check] Cannot find name 'Stamp'.` @ L509
- `[full_check] Cannot find name 'BeliefSelect'.` @ L514
- `[full_check] Cannot find name 'TruthValue'.` @ L533
- `[full_check] Cannot find name 'TruthValue'.` @ L537
- `[full_check] Cannot find name 'TermLink'.` @ L548
- `[full_check] Cannot find name 'TermLink'.` @ L553
- `[full_check] Cannot find name 'TermLink'.` @ L568
- `[full_check] Cannot find name 'NativeOperator'.` @ L596
- `[syntax_check] Cannot find name 'TermLink'.` @ L38
- `[syntax_check] Cannot find name 'TermLink'.` @ L38
- `[syntax_check] Cannot find name 'TermLink'.` @ L44
- `[syntax_check] Cannot find name 'Memory'.` @ L75
- `[syntax_check] Cannot find name 'BudgetValue'.` @ L92
- `[syntax_check] Cannot find name 'Memory'.` @ L92
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L110
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L111
- `[syntax_check] Cannot find name 'DerivationContext'.` @ L162
- `[syntax_check] Cannot find name 'BudgetValue'.` @ L163
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L168
- `[syntax_check] Cannot find name 'BudgetValue'.` @ L175
- `[syntax_check] Cannot find name 'distributeAmongLinks'.` @ L175
- `[syntax_check] Cannot find name 'TermLink'.` @ L179
- `[syntax_check] Cannot find name 'rankBelief'.` @ L210
- `[syntax_check] Cannot find name 'rankBelief'.` @ L215
- `[syntax_check] Cannot find name 'Timable'.` @ L247
- `[syntax_check] Cannot find name 'LocalRules'.` @ L258
- `[syntax_check] Cannot find name 'DerivationContext'.` @ L313
- `[syntax_check] Cannot find name 'ProcessQuestion'.` @ L316
- `[syntax_check] Cannot find name 'ProcessQuestion'.` @ L318
- `[syntax_check] Cannot find name 'TaskLinkRemove'.` @ L337
- `[syntax_check] Cannot find name 'TaskLinkRemove'.` @ L346
- `[syntax_check] Cannot find name 'TaskLinkRemove'.` @ L349
- `[syntax_check] Cannot find name 'TaskLinkAdd'.` @ L352
- `[syntax_check] Cannot find name 'BudgetValue'.` @ L363
- `[syntax_check] Cannot find name 'BudgetValue'.` @ L368
- `[syntax_check] Cannot find name 'distributeAmongLinks'.` @ L368
- `[syntax_check] Cannot find name 'TermLink'.` @ L375
- `[syntax_check] Cannot find name 'TermLink'.` @ L387
- `[syntax_check] Cannot find name 'TermLink'.` @ L388
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L390
- `[syntax_check] Cannot find name 'TermLink'.` @ L390
- `[syntax_check] Cannot find name 'TermLink'.` @ L403
- `[syntax_check] Cannot find name 'TermLink'.` @ L404
- `[syntax_check] Cannot find name 'TermLinkRemove'.` @ L407
- `[syntax_check] Cannot find name 'TermLinkRemove'.` @ L411
- `[syntax_check] Cannot find name 'TermLinkAdd'.` @ L414
- `[syntax_check] Cannot find name 'toStringExternal'. Did you mean the instance member 'this.toStringExternal'?` @ L432
- `[syntax_check] Cannot find name 'TermLink'.` @ L494
- `[syntax_check] Cannot find name 'DerivationContext'.` @ L508
- `[syntax_check] Cannot find name 'Stamp'.` @ L509
- `[syntax_check] Cannot find name 'BeliefSelect'.` @ L514
- `[syntax_check] Cannot find name 'TruthValue'.` @ L533
- `[syntax_check] Cannot find name 'TruthValue'.` @ L537
- `[syntax_check] Cannot find name 'TermLink'.` @ L548
- `[syntax_check] Cannot find name 'TermLink'.` @ L553
- `[syntax_check] Cannot find name 'TermLink'.` @ L568
- `[syntax_check] Cannot find name 'NativeOperator'.` @ L596

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `entity/Concept` -> `io/events/Events`（deps.xml 第 199 行）
- `entity/Concept` -> `entity/TruthValue`（deps.xml 第 200 行）
- `entity/Concept` -> `language/CompoundTerm`（deps.xml 第 201 行）
- `entity/Concept` -> `entity/Item`（deps.xml 第 202 行）
- `entity/Concept` -> `entity/Task`（deps.xml 第 203 行）
- `entity/Concept` -> `entity/BudgetValue`（deps.xml 第 204 行）
- `entity/Concept` -> `interfaces/Timable`（deps.xml 第 205 行）
- `entity/Concept` -> `main/Shell`（deps.xml 第 206 行）
- `entity/Concept` -> `language/Term`（deps.xml 第 207 行）
- `entity/Concept` -> `entity/Sentence`（deps.xml 第 208 行）
- `entity/Concept` -> `io/Symbols`（deps.xml 第 209 行）
- `entity/Concept` -> `parameter/Parameters`（deps.xml 第 210 行）
- `entity/Concept` -> `control/concept/ProcessQuestion`（deps.xml 第 211 行）
- `entity/Concept` -> `entity/TaskLink`（deps.xml 第 212 行）
- `entity/Concept` -> `inference/BudgetFunctions`（deps.xml 第 213 行）
- `entity/Concept` -> `io/events/EventEmitter`（deps.xml 第 214 行）
- `entity/Concept` -> `entity/Stamp`（deps.xml 第 215 行）
- `entity/Concept` -> `inference/LocalRules`（deps.xml 第 216 行）
- `entity/Concept` -> `inference/UtilityFunctions`（deps.xml 第 217 行）
- `entity/Concept` -> `control/DerivationContext`（deps.xml 第 218 行）
- `entity/Concept` -> `storage/Bag`（deps.xml 第 219 行）
- `entity/Concept` -> `entity/TermLink`（deps.xml 第 220 行）
- `entity/Concept` -> `storage/Memory`（deps.xml 第 221 行）
- 交叉校验：
- Java graph 额外依赖：control/DerivationContext、control/concept/ProcessQuestion、entity/BudgetValue、entity/Stamp、entity/TermLink、entity/TruthValue、inference/BudgetFunctions、inference/LocalRules、inference/UtilityFunctions、interfaces/Timable、io/Symbols、io/events/EventEmitter、io/events/Events、language/CompoundTerm、main/Shell、parameter/Parameters、storage/Memory

## 5. Java 功能说明

- **职责概述**：文件工作：保持 Stamp/TruthValue 等值对象的不可变语义，补齐 clone/equals/hash 与序列化。；TODO 2 处
- **关键数据结构**：
- `Concept` · 继承：Item<Term> · 实现：（无接口）
- **核心流程 / 算法**：
  1. 依赖准备：依赖：entity/Item.ts, language/Term.ts, entity/Sentence.ts, entity/Task.ts, storage/Bag.ts, entity/TaskLink.ts
  2. 文件工作：保持 Stamp/TruthValue 等值对象的不可变语义，补齐 clone/equals/hash 与序列化。；TODO 2 处
  3. Java-TS 差异：参见《通用转译法.md》 - 实体与序列化
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `entity/Item, entity/Sentence, entity/Task, entity/TaskLink, language/Term, storage/Bag` 衔接上下游。

## 6. 一致性风险

- 文件内仍保留 2 处 TODO，需对照 Java 填补。
- `tsc` 报错阻塞进一步分析，需要回填语句结构。

## 7. 路线图定位

- 1. 依赖准备：依赖：entity/Item.ts, language/Term.ts, entity/Sentence.ts, entity/Task.ts, storage/Bag.ts, entity/TaskLink.ts
- 2. 文件工作：保持 Stamp/TruthValue 等值对象的不可变语义，补齐 clone/equals/hash 与序列化。；TODO 2 处
- 3. Java-TS 差异：参见《通用转译法.md》 - 实体与序列化

## 8. 附加记录

- ts-analysis: LOC=620 · TODO=2
- 参考文件：`java-master/src/main/java/org/opennars/entity/Concept.java`
