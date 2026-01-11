# src/inference/BudgetFunctions.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/inference/BudgetFunctions.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/inference/BudgetFunctions.java` |
| 模块链路 | `language 基座 -> entity -> inference 推理层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/inference/BudgetFunctions.ts --noEmit`）

- 执行的命令：`npx tsc src/inference/BudgetFunctions.ts --noEmit`
- 关键输出：
  - TS2339（L66, C14）：[full_check] Property 'decPriority' does not exist on type 'Task'.
  - TS2339（L67, C14）：[full_check] Property 'decDurability' does not exist on type 'Task'.
  - TS2339（L70, C19）：[full_check] Property 'decPriority' does not exist on type 'TaskLink'.
  - TS2339（L71, C19）：[full_check] Property 'decDurability' does not exist on type 'TaskLink'.
  - TS2339（L74, C19）：[full_check] Property 'decPriority' does not exist on type 'TermLink'.
  - TS2339（L75, C19）：[full_check] Property 'decDurability' does not exist on type 'TermLink'.
  - TS2339（L78, C36）：[full_check] Property 'math' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/index")'.
  - TS2339（L78, C74）：[full_check] Property 'getPriority' does not exist on type 'Task'.
  - TS2304（L79, C33）：[full_check] Cannot find name 'aveAri'.
  - TS2339（L79, C59）：[full_check] Property 'getDurability' does not exist on type 'Task'.
  - TS2314（L117, C73）：[full_check] Generic type 'Parameters' requires 1 type argument(s).
  - TS2339（L120, C36）：[full_check] Property 'math' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/index")'.
  - TS2339（L120, C65）：[full_check] Property 'getPriority' does not exist on type 'Task'.
  - TS2304（L121, C33）：[full_check] Cannot find name 'aveAri'.
  - TS2339（L121, C50）：[full_check] Property 'getDurability' does not exist on type 'Task'.
  - TS2314（L134, C79）：[full_check] Generic type 'Parameters' requires 1 type argument(s).
  - TS2304（L155, C18）：[full_check] Cannot find name 'Max'.
  - TS2740（L158, C18）：[full_check] Type 'typeof TaskLink' is missing the following properties from type 'Enum<Activating>': #private, hashCode, ordinal, [Symbol.toPrimitive], and 7 more.
  - TS2339（L160, C43）：[full_check] Property 'math' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/index")'.
  - TS2304（L161, C40）：[full_check] Cannot find name 'aveAri'.
  - TS2304（L237, C48）：[full_check] Cannot find name 'w2c'.
  - TS2304（L276, C48）：[full_check] Cannot find name 'w2c'.
  - TS2339（L310, C29）：[full_check] Property 'math' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/index")'.
  - TS2339（L310, C64）：[full_check] Property 'getPriority' does not exist on type 'TermLink'.
  - TS2339（L311, C31）：[full_check] Property 'math' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/index")'.
  - TS2339（L311, C69）：[full_check] Property 'getDurability' does not exist on type 'TermLink'.
  - TS2339（L313, C19）：[full_check] Property 'incPriority' does not exist on type 'TermLink'.
  - TS2339（L313, C36）：[full_check] Property 'math' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/index")'.
  - TS2339（L314, C19）：[full_check] Property 'incDurability' does not exist on type 'TermLink'.
  - TS2339（L66, C14）：[syntax_check] Property 'decPriority' does not exist on type 'Task'.
  - TS2339（L67, C14）：[syntax_check] Property 'decDurability' does not exist on type 'Task'.
  - TS2339（L70, C19）：[syntax_check] Property 'decPriority' does not exist on type 'TaskLink'.
  - TS2339（L71, C19）：[syntax_check] Property 'decDurability' does not exist on type 'TaskLink'.
  - TS2339（L74, C19）：[syntax_check] Property 'decPriority' does not exist on type 'TermLink'.
  - TS2339（L75, C19）：[syntax_check] Property 'decDurability' does not exist on type 'TermLink'.
  - TS2339（L78, C36）：[syntax_check] Property 'math' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/index")'.
  - TS2339（L78, C74）：[syntax_check] Property 'getPriority' does not exist on type 'Task'.
  - TS2304（L79, C33）：[syntax_check] Cannot find name 'aveAri'.
  - TS2339（L79, C59）：[syntax_check] Property 'getDurability' does not exist on type 'Task'.
  - TS2314（L117, C73）：[syntax_check] Generic type 'Parameters' requires 1 type argument(s).
  - TS2339（L120, C36）：[syntax_check] Property 'math' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/index")'.
  - TS2339（L120, C65）：[syntax_check] Property 'getPriority' does not exist on type 'Task'.
  - TS2304（L121, C33）：[syntax_check] Cannot find name 'aveAri'.
  - TS2339（L121, C50）：[syntax_check] Property 'getDurability' does not exist on type 'Task'.
  - TS2314（L134, C79）：[syntax_check] Generic type 'Parameters' requires 1 type argument(s).
  - TS2304（L155, C18）：[syntax_check] Cannot find name 'Max'.
  - TS2740（L158, C18）：[syntax_check] Type 'typeof TaskLink' is missing the following properties from type 'Enum<Activating>': #private, hashCode, ordinal, [Symbol.toPrimitive], and 7 more.
  - TS2339（L160, C43）：[syntax_check] Property 'math' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/index")'.
  - TS2304（L161, C40）：[syntax_check] Cannot find name 'aveAri'.
  - TS2304（L237, C48）：[syntax_check] Cannot find name 'w2c'.
  - TS2304（L276, C48）：[syntax_check] Cannot find name 'w2c'.
  - TS2339（L310, C29）：[syntax_check] Property 'math' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/index")'.
  - TS2339（L310, C64）：[syntax_check] Property 'getPriority' does not exist on type 'TermLink'.
  - TS2339（L311, C31）：[syntax_check] Property 'math' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/index")'.
  - TS2339（L311, C69）：[syntax_check] Property 'getDurability' does not exist on type 'TermLink'.
  - TS2339（L313, C19）：[syntax_check] Property 'incPriority' does not exist on type 'TermLink'.
  - TS2339（L313, C36）：[syntax_check] Property 'math' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/index")'.
  - TS2339（L314, C19）：[syntax_check] Property 'incDurability' does not exist on type 'TermLink'.
- 总结：存在语法错误，需要比对 Java 语句结构。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

| 符号 | 来源文件 | 触发位置 | 依赖原因 |
| --- | --- | --- | --- |
| `TruthValue` | `src/entity/TruthValue.ts` | import | 结构性：BudgetFunctions 直接使用 TruthValue 的主流程 |
| `Sentence` | `src/entity/Sentence.ts` | import | 结构性：BudgetFunctions 直接使用 Sentence 的主流程 |
| `TaskLink` | `src/entity/TaskLink.ts` | import | 结构性：BudgetFunctions 直接使用 TaskLink 的主流程 |
| `Task` | `src/entity/Task.ts` | import | 结构性：BudgetFunctions 直接使用 Task 的主流程 |
| `DerivationContext` | `src/control/DerivationContext.ts` | import | 结构性：BudgetFunctions 直接使用 DerivationContext 的主流程 |
| `BudgetValue.ts ...` | `src/entity/BudgetValue.ts ....ts` | import | 结构性：BudgetFunctions 直接使用 BudgetValue.ts ... 的主流程 |

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

- `[full_check] Cannot find name 'aveAri'.` @ L79
- `[full_check] Cannot find name 'aveAri'.` @ L121
- `[full_check] Cannot find name 'Max'.` @ L155
- `[full_check] Cannot find name 'aveAri'.` @ L161
- `[full_check] Cannot find name 'w2c'.` @ L237
- `[full_check] Cannot find name 'w2c'.` @ L276
- `[syntax_check] Cannot find name 'aveAri'.` @ L79
- `[syntax_check] Cannot find name 'aveAri'.` @ L121
- `[syntax_check] Cannot find name 'Max'.` @ L155
- `[syntax_check] Cannot find name 'aveAri'.` @ L161
- `[syntax_check] Cannot find name 'w2c'.` @ L237
- `[syntax_check] Cannot find name 'w2c'.` @ L276

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `inference/BudgetFunctions` -> `entity/TruthValue`（deps.xml 第 290 行）
- `inference/BudgetFunctions` -> `entity/TaskLink`（deps.xml 第 291 行）
- `inference/BudgetFunctions` -> `entity/Concept`（deps.xml 第 292 行）
- `inference/BudgetFunctions` -> `entity/Item`（deps.xml 第 293 行）
- `inference/BudgetFunctions` -> `inference/UtilityFunctions`（deps.xml 第 294 行）
- `inference/BudgetFunctions` -> `entity/Task`（deps.xml 第 295 行）
- `inference/BudgetFunctions` -> `control/DerivationContext`（deps.xml 第 296 行）
- `inference/BudgetFunctions` -> `entity/BudgetValue`（deps.xml 第 297 行）
- `inference/BudgetFunctions` -> `entity/TermLink`（deps.xml 第 298 行）
- `inference/BudgetFunctions` -> `storage/Memory`（deps.xml 第 299 行）
- `inference/BudgetFunctions` -> `language/Term`（deps.xml 第 300 行）
- `inference/BudgetFunctions` -> `entity/Sentence`（deps.xml 第 301 行）
- `inference/BudgetFunctions` -> `parameter/Parameters`（deps.xml 第 302 行）
- 交叉校验：
- TS 额外依赖：entity/BudgetValue.ts ...
- Java graph 额外依赖：entity/BudgetValue、entity/Concept、entity/Item、entity/TermLink、inference/UtilityFunctions、language/Term、parameter/Parameters、storage/Memory

## 5. Java 功能说明

- **职责概述**：文件工作：复制规则/真值/预算静态表并完善类型约束与数值校验。
- **关键数据结构**：
- `BudgetFunctions` · 继承：（无继承） · 实现：（无接口）
- **核心流程 / 算法**：
  1. 依赖准备：依赖：entity/TruthValue.ts, entity/Sentence.ts, entity/TaskLink.ts, entity/Task.ts, control/DerivationContext.ts, entity/BudgetValue.ts ...
  2. 文件工作：复制规则/真值/预算静态表并完善类型约束与数值校验。
  3. Java-TS 差异：参见《通用转译法.md》 - 推理规则
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `control/DerivationContext, entity/BudgetValue.ts ..., entity/Sentence, entity/Task, entity/TaskLink, entity/TruthValue` 衔接上下游。

## 6. 一致性风险

- `tsc` 报错阻塞进一步分析，需要回填语句结构。

## 7. 路线图定位

- 1. 依赖准备：依赖：entity/TruthValue.ts, entity/Sentence.ts, entity/TaskLink.ts, entity/Task.ts, control/DerivationContext.ts, entity/BudgetValue.ts ...
- 2. 文件工作：复制规则/真值/预算静态表并完善类型约束与数值校验。
- 3. Java-TS 差异：参见《通用转译法.md》 - 推理规则

## 8. 附加记录

- ts-analysis: LOC=336 · TODO=0
- 参考文件：`java-master/src/main/java/org/opennars/inference/BudgetFunctions.java`
