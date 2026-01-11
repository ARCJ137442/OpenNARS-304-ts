# src/control/concept/ProcessAnticipation.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/control/concept/ProcessAnticipation.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/control/concept/ProcessAnticipation.java` |
| 模块链路 | `language 基座 -> entity -> inference -> control 控制层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/control/concept/ProcessAnticipation.ts --noEmit`）

- 执行的命令：`npx tsc src/control/concept/ProcessAnticipation.ts --noEmit`
- 关键输出：
  - TS2304（L11, C35）：[full_check] Cannot find name 'DerivationContext'.
  - TS2304（L11, C68）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L11, C86）：[full_check] Cannot find name 'BudgetValue'.
  - TS2304（L12, C83）：[full_check] Cannot find name 'Term'.
  - TS2304（L12, C89）：[full_check] Cannot find name 'Term'.
  - TS2304（L14, C20）：[full_check] Cannot find name 'Stamp'.
  - TS2304（L14, C32）：[full_check] Cannot find name 'Stamp'.
  - TS2304（L15, C33）：[full_check] Cannot find name 'Stamp'.
  - TS2304（L17, C16）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L17, C31）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L20, C17）：[full_check] Cannot find name 'TruthValue'.
  - TS2304（L22, C16）：[full_check] Cannot find name 'Task'.
  - TS2304（L22, C27）：[full_check] Cannot find name 'Task'.
  - TS2304（L22, C39）：[full_check] Cannot find name 'BudgetValue'.
  - TS2304（L22, C87）：[full_check] Cannot find name 'Task'.
  - TS2304（L24, C28）：[full_check] Cannot find name 'Term'.
  - TS2304（L24, C57）：[full_check] Cannot find name 'Statement'.
  - TS2304（L25, C40）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L40, C39）：[full_check] Cannot find name 'Term'.
  - TS2304（L40, C64）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L41, C16）：[full_check] Cannot find name 'Concept'.
  - TS2304（L43, C51）：[full_check] Cannot find name 'Implication'.
  - TS2304（L43, C100）：[full_check] Cannot find name 'Equivalence'.
  - TS2304（L44, C59）：[full_check] Cannot find name 'TemporalRules'.
  - TS2503（L45, C27）：[full_check] Cannot find namespace 'Concept'.
  - TS2503（L46, C27）：[full_check] Cannot find namespace 'Concept'.
  - TS2304（L46, C59）：[full_check] Cannot find name 'Concept'.
  - TS2304（L72, C27）：[full_check] Cannot find name 'Statement'.
  - TS2304（L72, C81）：[full_check] Cannot find name 'Statement'.
  - TS2304（L73, C26）：[full_check] Cannot find name 'Concept'.
  - TS2304（L75, C36）：[full_check] Cannot find name 'Operator'.
  - TS2304（L75, C87）：[full_check] Cannot find name 'Anticipate'.
  - TS2304（L76, C72）：[full_check] Cannot find name 'Anticipate'.
  - TS2304（L77, C39）：[full_check] Cannot find name 'Anticipate'.
  - TS2304（L81, C29）：[full_check] Cannot find name 'OutputHandler'.
  - TS2314（L96, C68）：[full_check] Generic type 'Parameters' requires 1 type argument(s).
  - TS2304（L96, C89）：[full_check] Cannot find name 'Concept'.
  - TS2304（L97, C14）：[full_check] Cannot find name 'Nar'.
  - TS2503（L99, C39）：[full_check] Cannot find namespace 'Concept'.
  - TS2503（L100, C42）：[full_check] Cannot find namespace 'Concept'.
  - TS2304（L110, C28）：[full_check] Cannot find name 'Task'.
  - TS2304（L115, C25）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L116, C37）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L132, C33）：[full_check] Cannot find name 'OutputHandler'.
  - TS2304（L137, C33）：[full_check] Cannot find name 'OutputHandler'.
  - TS2304（L140, C23）：[full_check] Cannot find name 'Term'.
  - TS2304（L141, C44）：[full_check] Cannot find name 'Term'.
  - TS2304（L141, C51）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L144, C44）：[full_check] Cannot find name 'TruthValue'.
  - TS2304（L146, C40）：[full_check] Cannot find name 'Concept'.
  - TS2304（L153, C42）：[full_check] Cannot find name 'Term'.
  - TS2304（L168, C68）：[full_check] Cannot find name 'Implication'.
  - TS2365（L169, C57）：[full_check] Operator '/' cannot be applied to types 'number' and 'bigint'.
  - TS2304（L172, C37）：[full_check] Cannot find name 'c2w'.
  - TS2304（L174, C37）：[full_check] Cannot find name 'w2c'.
  - TS2304（L176, C32）：[full_check] Cannot find name 'TruthValue'.
  - TS2304（L176, C49）：[full_check] Cannot find name 'TruthValue'.
  - TS2304（L179, C45）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L179, C60）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L181, C25）：[full_check] Cannot find name 'Symbols'.
  - TS2304（L183, C29）：[full_check] Cannot find name 'Stamp'.
  - TS2304（L183, C52）：[full_check] Cannot find name 'Tense'.
  - TS2304（L184, C33）：[full_check] Cannot find name 'BudgetValue'.
  - TS2304（L184, C51）：[full_check] Cannot find name 'BudgetValue'.
  - TS2304（L185, C28）：[full_check] Cannot find name 'Task'.
  - TS2304（L185, C39）：[full_check] Cannot find name 'Task'.
  - TS2304（L185, C72）：[full_check] Cannot find name 'Task'.
  - TS2304（L202, C45）：[full_check] Cannot find name 'Task'.
  - TS2304（L202, C60）：[full_check] Cannot find name 'Concept'.
  - TS2304（L202, C74）：[full_check] Cannot find name 'DerivationContext'.
  - TS2503（L206, C39）：[full_check] Cannot find namespace 'Concept'.
  - TS2304（L215, C29）：[full_check] Cannot find name 'OutputHandler'.
  - TS2304（L230, C50）：[full_check] Cannot find name 'Task'.
  - TS2304（L230, C65）：[full_check] Cannot find name 'Concept'.
  - TS2304（L230, C79）：[full_check] Cannot find name 'DerivationContext'.
  - TS2304（L231, C15）：[full_check] Cannot find name 'Timable'.
  - TS2304（L231, C34）：[full_check] Cannot find name 'TaskLink'.
  - TS2304（L234, C27）：[full_check] Cannot find name 'Term'.
  - TS2304（L235, C25）：[full_check] Cannot find name 'Concept'.
  - TS2304（L236, C77）：[full_check] Cannot find name 'Implication'.
  - TS2304（L237, C30）：[full_check] Cannot find name 'Implication'.
  - TS2304（L237, C52）：[full_check] Cannot find name 'Implication'.
  - TS2304（L238, C52）：[full_check] Cannot find name 'TemporalRules'.
  - TS2304（L239, C37）：[full_check] Cannot find name 'Term'.
  - TS2304（L240, C40）：[full_check] Cannot find name 'Term'.
  - TS2304（L241, C47）：[full_check] Cannot find name 'Conjunction'.
  - TS2304（L242, C39）：[full_check] Cannot find name 'Conjunction'.
  - TS2304（L242, C73）：[full_check] Cannot find name 'Conjunction'.
  - TS2304（L243, C61）：[full_check] Cannot find name 'TemporalRules'.
  - TS2304（L244, C60）：[full_check] Cannot find name 'Interval'.
  - TS2304（L248, C29）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L249, C37）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L251, C39）：[full_check] Cannot find name 'DerivationContext'.
  - TS2304（L251, C63）：[full_check] Cannot find name 'DerivationContext'.
  - TS2304（L257, C29）：[full_check] Cannot find name 'RuleTables'.
  - TS2304（L11, C35）：[syntax_check] Cannot find name 'DerivationContext'.
  - TS2304（L11, C68）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L11, C86）：[syntax_check] Cannot find name 'BudgetValue'.
  - TS2304（L12, C83）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L12, C89）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L14, C20）：[syntax_check] Cannot find name 'Stamp'.
  - TS2304（L14, C32）：[syntax_check] Cannot find name 'Stamp'.
  - TS2304（L15, C33）：[syntax_check] Cannot find name 'Stamp'.
  - TS2304（L17, C16）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L17, C31）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L20, C17）：[syntax_check] Cannot find name 'TruthValue'.
  - TS2304（L22, C16）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L22, C27）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L22, C39）：[syntax_check] Cannot find name 'BudgetValue'.
  - TS2304（L22, C87）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L24, C28）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L24, C57）：[syntax_check] Cannot find name 'Statement'.
  - TS2304（L25, C40）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L40, C39）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L40, C64）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L41, C16）：[syntax_check] Cannot find name 'Concept'.
  - TS2304（L43, C51）：[syntax_check] Cannot find name 'Implication'.
  - TS2304（L43, C100）：[syntax_check] Cannot find name 'Equivalence'.
  - TS2304（L44, C59）：[syntax_check] Cannot find name 'TemporalRules'.
  - TS2503（L45, C27）：[syntax_check] Cannot find namespace 'Concept'.
  - TS2503（L46, C27）：[syntax_check] Cannot find namespace 'Concept'.
  - TS2304（L46, C59）：[syntax_check] Cannot find name 'Concept'.
  - TS2304（L72, C27）：[syntax_check] Cannot find name 'Statement'.
  - TS2304（L72, C81）：[syntax_check] Cannot find name 'Statement'.
  - TS2304（L73, C26）：[syntax_check] Cannot find name 'Concept'.
  - TS2304（L75, C36）：[syntax_check] Cannot find name 'Operator'.
  - TS2304（L75, C87）：[syntax_check] Cannot find name 'Anticipate'.
  - TS2304（L76, C72）：[syntax_check] Cannot find name 'Anticipate'.
  - TS2304（L77, C39）：[syntax_check] Cannot find name 'Anticipate'.
  - TS2304（L81, C29）：[syntax_check] Cannot find name 'OutputHandler'.
  - TS2314（L96, C68）：[syntax_check] Generic type 'Parameters' requires 1 type argument(s).
  - TS2304（L96, C89）：[syntax_check] Cannot find name 'Concept'.
  - TS2304（L97, C14）：[syntax_check] Cannot find name 'Nar'.
  - TS2503（L99, C39）：[syntax_check] Cannot find namespace 'Concept'.
  - TS2503（L100, C42）：[syntax_check] Cannot find namespace 'Concept'.
  - TS2304（L110, C28）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L115, C25）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L116, C37）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L132, C33）：[syntax_check] Cannot find name 'OutputHandler'.
  - TS2304（L137, C33）：[syntax_check] Cannot find name 'OutputHandler'.
  - TS2304（L140, C23）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L141, C44）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L141, C51）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L144, C44）：[syntax_check] Cannot find name 'TruthValue'.
  - TS2304（L146, C40）：[syntax_check] Cannot find name 'Concept'.
  - TS2304（L153, C42）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L168, C68）：[syntax_check] Cannot find name 'Implication'.
  - TS2365（L169, C57）：[syntax_check] Operator '/' cannot be applied to types 'number' and 'bigint'.
  - TS2304（L172, C37）：[syntax_check] Cannot find name 'c2w'.
  - TS2304（L174, C37）：[syntax_check] Cannot find name 'w2c'.
  - TS2304（L176, C32）：[syntax_check] Cannot find name 'TruthValue'.
  - TS2304（L176, C49）：[syntax_check] Cannot find name 'TruthValue'.
  - TS2304（L179, C45）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L179, C60）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L181, C25）：[syntax_check] Cannot find name 'Symbols'.
  - TS2304（L183, C29）：[syntax_check] Cannot find name 'Stamp'.
  - TS2304（L183, C52）：[syntax_check] Cannot find name 'Tense'.
  - TS2304（L184, C33）：[syntax_check] Cannot find name 'BudgetValue'.
  - TS2304（L184, C51）：[syntax_check] Cannot find name 'BudgetValue'.
  - TS2304（L185, C28）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L185, C39）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L185, C72）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L202, C45）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L202, C60）：[syntax_check] Cannot find name 'Concept'.
  - TS2304（L202, C74）：[syntax_check] Cannot find name 'DerivationContext'.
  - TS2503（L206, C39）：[syntax_check] Cannot find namespace 'Concept'.
  - TS2304（L215, C29）：[syntax_check] Cannot find name 'OutputHandler'.
  - TS2304（L230, C50）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L230, C65）：[syntax_check] Cannot find name 'Concept'.
  - TS2304（L230, C79）：[syntax_check] Cannot find name 'DerivationContext'.
  - TS2304（L231, C15）：[syntax_check] Cannot find name 'Timable'.
  - TS2304（L231, C34）：[syntax_check] Cannot find name 'TaskLink'.
  - TS2304（L234, C27）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L235, C25）：[syntax_check] Cannot find name 'Concept'.
  - TS2304（L236, C77）：[syntax_check] Cannot find name 'Implication'.
  - TS2304（L237, C30）：[syntax_check] Cannot find name 'Implication'.
  - TS2304（L237, C52）：[syntax_check] Cannot find name 'Implication'.
  - TS2304（L238, C52）：[syntax_check] Cannot find name 'TemporalRules'.
  - TS2304（L239, C37）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L240, C40）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L241, C47）：[syntax_check] Cannot find name 'Conjunction'.
  - TS2304（L242, C39）：[syntax_check] Cannot find name 'Conjunction'.
  - TS2304（L242, C73）：[syntax_check] Cannot find name 'Conjunction'.
  - TS2304（L243, C61）：[syntax_check] Cannot find name 'TemporalRules'.
  - TS2304（L244, C60）：[syntax_check] Cannot find name 'Interval'.
  - TS2304（L248, C29）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L249, C37）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L251, C39）：[syntax_check] Cannot find name 'DerivationContext'.
  - TS2304（L251, C63）：[syntax_check] Cannot find name 'DerivationContext'.
  - TS2304（L257, C29）：[syntax_check] Cannot find name 'RuleTables'.
- 总结：存在语法错误，需要比对 Java 语句结构。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

（无显式结构性依赖，主要依赖 `jree` 提供的运行时桩或尚未补齐的全局声明。）

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

- `[full_check] Cannot find name 'DerivationContext'.` @ L11
- `[full_check] Cannot find name 'Sentence'.` @ L11
- `[full_check] Cannot find name 'BudgetValue'.` @ L11
- `[full_check] Cannot find name 'Term'.` @ L12
- `[full_check] Cannot find name 'Term'.` @ L12
- `[full_check] Cannot find name 'Stamp'.` @ L14
- `[full_check] Cannot find name 'Stamp'.` @ L14
- `[full_check] Cannot find name 'Stamp'.` @ L15
- `[full_check] Cannot find name 'Sentence'.` @ L17
- `[full_check] Cannot find name 'Sentence'.` @ L17
- `[full_check] Cannot find name 'TruthValue'.` @ L20
- `[full_check] Cannot find name 'Task'.` @ L22
- `[full_check] Cannot find name 'Task'.` @ L22
- `[full_check] Cannot find name 'BudgetValue'.` @ L22
- `[full_check] Cannot find name 'Task'.` @ L22
- `[full_check] Cannot find name 'Term'.` @ L24
- `[full_check] Cannot find name 'Statement'.` @ L24
- `[full_check] Cannot find name 'CompoundTerm'.` @ L25
- `[full_check] Cannot find name 'Term'.` @ L40
- `[full_check] Cannot find name 'CompoundTerm'.` @ L40
- `[full_check] Cannot find name 'Concept'.` @ L41
- `[full_check] Cannot find name 'Implication'.` @ L43
- `[full_check] Cannot find name 'Equivalence'.` @ L43
- `[full_check] Cannot find name 'TemporalRules'.` @ L44
- `[full_check] Cannot find namespace 'Concept'.` @ L45
- `[full_check] Cannot find namespace 'Concept'.` @ L46
- `[full_check] Cannot find name 'Concept'.` @ L46
- `[full_check] Cannot find name 'Statement'.` @ L72
- `[full_check] Cannot find name 'Statement'.` @ L72
- `[full_check] Cannot find name 'Concept'.` @ L73
- `[full_check] Cannot find name 'Operator'.` @ L75
- `[full_check] Cannot find name 'Anticipate'.` @ L75
- `[full_check] Cannot find name 'Anticipate'.` @ L76
- `[full_check] Cannot find name 'Anticipate'.` @ L77
- `[full_check] Cannot find name 'OutputHandler'.` @ L81
- `[full_check] Cannot find name 'Concept'.` @ L96
- `[full_check] Cannot find name 'Nar'.` @ L97
- `[full_check] Cannot find namespace 'Concept'.` @ L99
- `[full_check] Cannot find namespace 'Concept'.` @ L100
- `[full_check] Cannot find name 'Task'.` @ L110
- `[full_check] Cannot find name 'CompoundTerm'.` @ L115
- `[full_check] Cannot find name 'CompoundTerm'.` @ L116
- `[full_check] Cannot find name 'OutputHandler'.` @ L132
- `[full_check] Cannot find name 'OutputHandler'.` @ L137
- `[full_check] Cannot find name 'Term'.` @ L140
- `[full_check] Cannot find name 'Term'.` @ L141
- `[full_check] Cannot find name 'CompoundTerm'.` @ L141
- `[full_check] Cannot find name 'TruthValue'.` @ L144
- `[full_check] Cannot find name 'Concept'.` @ L146
- `[full_check] Cannot find name 'Term'.` @ L153
- `[full_check] Cannot find name 'Implication'.` @ L168
- `[full_check] Cannot find name 'c2w'.` @ L172
- `[full_check] Cannot find name 'w2c'.` @ L174
- `[full_check] Cannot find name 'TruthValue'.` @ L176
- `[full_check] Cannot find name 'TruthValue'.` @ L176
- `[full_check] Cannot find name 'Sentence'.` @ L179
- `[full_check] Cannot find name 'Sentence'.` @ L179
- `[full_check] Cannot find name 'Symbols'.` @ L181
- `[full_check] Cannot find name 'Stamp'.` @ L183
- `[full_check] Cannot find name 'Tense'.` @ L183
- `[full_check] Cannot find name 'BudgetValue'.` @ L184
- `[full_check] Cannot find name 'BudgetValue'.` @ L184
- `[full_check] Cannot find name 'Task'.` @ L185
- `[full_check] Cannot find name 'Task'.` @ L185
- `[full_check] Cannot find name 'Task'.` @ L185
- `[full_check] Cannot find name 'Task'.` @ L202
- `[full_check] Cannot find name 'Concept'.` @ L202
- `[full_check] Cannot find name 'DerivationContext'.` @ L202
- `[full_check] Cannot find namespace 'Concept'.` @ L206
- `[full_check] Cannot find name 'OutputHandler'.` @ L215
- `[full_check] Cannot find name 'Task'.` @ L230
- `[full_check] Cannot find name 'Concept'.` @ L230
- `[full_check] Cannot find name 'DerivationContext'.` @ L230
- `[full_check] Cannot find name 'Timable'.` @ L231
- `[full_check] Cannot find name 'TaskLink'.` @ L231
- `[full_check] Cannot find name 'Term'.` @ L234
- `[full_check] Cannot find name 'Concept'.` @ L235
- `[full_check] Cannot find name 'Implication'.` @ L236
- `[full_check] Cannot find name 'Implication'.` @ L237
- `[full_check] Cannot find name 'Implication'.` @ L237
- `[full_check] Cannot find name 'TemporalRules'.` @ L238
- `[full_check] Cannot find name 'Term'.` @ L239
- `[full_check] Cannot find name 'Term'.` @ L240
- `[full_check] Cannot find name 'Conjunction'.` @ L241
- `[full_check] Cannot find name 'Conjunction'.` @ L242
- `[full_check] Cannot find name 'Conjunction'.` @ L242
- `[full_check] Cannot find name 'TemporalRules'.` @ L243
- `[full_check] Cannot find name 'Interval'.` @ L244
- `[full_check] Cannot find name 'CompoundTerm'.` @ L248
- `[full_check] Cannot find name 'CompoundTerm'.` @ L249
- `[full_check] Cannot find name 'DerivationContext'.` @ L251
- `[full_check] Cannot find name 'DerivationContext'.` @ L251
- `[full_check] Cannot find name 'RuleTables'.` @ L257
- `[syntax_check] Cannot find name 'DerivationContext'.` @ L11
- `[syntax_check] Cannot find name 'Sentence'.` @ L11
- `[syntax_check] Cannot find name 'BudgetValue'.` @ L11
- `[syntax_check] Cannot find name 'Term'.` @ L12
- `[syntax_check] Cannot find name 'Term'.` @ L12
- `[syntax_check] Cannot find name 'Stamp'.` @ L14
- `[syntax_check] Cannot find name 'Stamp'.` @ L14
- `[syntax_check] Cannot find name 'Stamp'.` @ L15
- `[syntax_check] Cannot find name 'Sentence'.` @ L17
- `[syntax_check] Cannot find name 'Sentence'.` @ L17
- `[syntax_check] Cannot find name 'TruthValue'.` @ L20
- `[syntax_check] Cannot find name 'Task'.` @ L22
- `[syntax_check] Cannot find name 'Task'.` @ L22
- `[syntax_check] Cannot find name 'BudgetValue'.` @ L22
- `[syntax_check] Cannot find name 'Task'.` @ L22
- `[syntax_check] Cannot find name 'Term'.` @ L24
- `[syntax_check] Cannot find name 'Statement'.` @ L24
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L25
- `[syntax_check] Cannot find name 'Term'.` @ L40
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L40
- `[syntax_check] Cannot find name 'Concept'.` @ L41
- `[syntax_check] Cannot find name 'Implication'.` @ L43
- `[syntax_check] Cannot find name 'Equivalence'.` @ L43
- `[syntax_check] Cannot find name 'TemporalRules'.` @ L44
- `[syntax_check] Cannot find namespace 'Concept'.` @ L45
- `[syntax_check] Cannot find namespace 'Concept'.` @ L46
- `[syntax_check] Cannot find name 'Concept'.` @ L46
- `[syntax_check] Cannot find name 'Statement'.` @ L72
- `[syntax_check] Cannot find name 'Statement'.` @ L72
- `[syntax_check] Cannot find name 'Concept'.` @ L73
- `[syntax_check] Cannot find name 'Operator'.` @ L75
- `[syntax_check] Cannot find name 'Anticipate'.` @ L75
- `[syntax_check] Cannot find name 'Anticipate'.` @ L76
- `[syntax_check] Cannot find name 'Anticipate'.` @ L77
- `[syntax_check] Cannot find name 'OutputHandler'.` @ L81
- `[syntax_check] Cannot find name 'Concept'.` @ L96
- `[syntax_check] Cannot find name 'Nar'.` @ L97
- `[syntax_check] Cannot find namespace 'Concept'.` @ L99
- `[syntax_check] Cannot find namespace 'Concept'.` @ L100
- `[syntax_check] Cannot find name 'Task'.` @ L110
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L115
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L116
- `[syntax_check] Cannot find name 'OutputHandler'.` @ L132
- `[syntax_check] Cannot find name 'OutputHandler'.` @ L137
- `[syntax_check] Cannot find name 'Term'.` @ L140
- `[syntax_check] Cannot find name 'Term'.` @ L141
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L141
- `[syntax_check] Cannot find name 'TruthValue'.` @ L144
- `[syntax_check] Cannot find name 'Concept'.` @ L146
- `[syntax_check] Cannot find name 'Term'.` @ L153
- `[syntax_check] Cannot find name 'Implication'.` @ L168
- `[syntax_check] Cannot find name 'c2w'.` @ L172
- `[syntax_check] Cannot find name 'w2c'.` @ L174
- `[syntax_check] Cannot find name 'TruthValue'.` @ L176
- `[syntax_check] Cannot find name 'TruthValue'.` @ L176
- `[syntax_check] Cannot find name 'Sentence'.` @ L179
- `[syntax_check] Cannot find name 'Sentence'.` @ L179
- `[syntax_check] Cannot find name 'Symbols'.` @ L181
- `[syntax_check] Cannot find name 'Stamp'.` @ L183
- `[syntax_check] Cannot find name 'Tense'.` @ L183
- `[syntax_check] Cannot find name 'BudgetValue'.` @ L184
- `[syntax_check] Cannot find name 'BudgetValue'.` @ L184
- `[syntax_check] Cannot find name 'Task'.` @ L185
- `[syntax_check] Cannot find name 'Task'.` @ L185
- `[syntax_check] Cannot find name 'Task'.` @ L185
- `[syntax_check] Cannot find name 'Task'.` @ L202
- `[syntax_check] Cannot find name 'Concept'.` @ L202
- `[syntax_check] Cannot find name 'DerivationContext'.` @ L202
- `[syntax_check] Cannot find namespace 'Concept'.` @ L206
- `[syntax_check] Cannot find name 'OutputHandler'.` @ L215
- `[syntax_check] Cannot find name 'Task'.` @ L230
- `[syntax_check] Cannot find name 'Concept'.` @ L230
- `[syntax_check] Cannot find name 'DerivationContext'.` @ L230
- `[syntax_check] Cannot find name 'Timable'.` @ L231
- `[syntax_check] Cannot find name 'TaskLink'.` @ L231
- `[syntax_check] Cannot find name 'Term'.` @ L234
- `[syntax_check] Cannot find name 'Concept'.` @ L235
- `[syntax_check] Cannot find name 'Implication'.` @ L236
- `[syntax_check] Cannot find name 'Implication'.` @ L237
- `[syntax_check] Cannot find name 'Implication'.` @ L237
- `[syntax_check] Cannot find name 'TemporalRules'.` @ L238
- `[syntax_check] Cannot find name 'Term'.` @ L239
- `[syntax_check] Cannot find name 'Term'.` @ L240
- `[syntax_check] Cannot find name 'Conjunction'.` @ L241
- `[syntax_check] Cannot find name 'Conjunction'.` @ L242
- `[syntax_check] Cannot find name 'Conjunction'.` @ L242
- `[syntax_check] Cannot find name 'TemporalRules'.` @ L243
- `[syntax_check] Cannot find name 'Interval'.` @ L244
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L248
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L249
- `[syntax_check] Cannot find name 'DerivationContext'.` @ L251
- `[syntax_check] Cannot find name 'DerivationContext'.` @ L251
- `[syntax_check] Cannot find name 'RuleTables'.` @ L257

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `control/concept/ProcessAnticipation` -> `operator/Operator`（deps.xml 第 3 行）
- `control/concept/ProcessAnticipation` -> `entity/TruthValue`（deps.xml 第 4 行）
- `control/concept/ProcessAnticipation` -> `language/Interval`（deps.xml 第 5 行）
- `control/concept/ProcessAnticipation` -> `entity/Concept`（deps.xml 第 6 行）
- `control/concept/ProcessAnticipation` -> `language/Implication`（deps.xml 第 7 行）
- `control/concept/ProcessAnticipation` -> `language/CompoundTerm`（deps.xml 第 8 行）
- `control/concept/ProcessAnticipation` -> `inference/TemporalRules`（deps.xml 第 9 行）
- `control/concept/ProcessAnticipation` -> `language/Statement`（deps.xml 第 10 行）
- `control/concept/ProcessAnticipation` -> `entity/Task`（deps.xml 第 11 行）
- `control/concept/ProcessAnticipation` -> `entity/BudgetValue`（deps.xml 第 12 行）
- `control/concept/ProcessAnticipation` -> `language/Conjunction`（deps.xml 第 13 行）
- `control/concept/ProcessAnticipation` -> `interfaces/Timable`（deps.xml 第 14 行）
- `control/concept/ProcessAnticipation` -> `inference/RuleTables`（deps.xml 第 15 行）
- `control/concept/ProcessAnticipation` -> `language/Term`（deps.xml 第 16 行）
- `control/concept/ProcessAnticipation` -> `entity/Sentence`（deps.xml 第 17 行）
- `control/concept/ProcessAnticipation` -> `language/Tense`（deps.xml 第 18 行）
- `control/concept/ProcessAnticipation` -> `io/Symbols`（deps.xml 第 19 行）
- `control/concept/ProcessAnticipation` -> `parameter/Parameters`（deps.xml 第 20 行）
- `control/concept/ProcessAnticipation` -> `entity/TaskLink`（deps.xml 第 21 行）
- `control/concept/ProcessAnticipation` -> `io/events/OutputHandler`（deps.xml 第 22 行）
- `control/concept/ProcessAnticipation` -> `operator/mental/Anticipate`（deps.xml 第 23 行）
- `control/concept/ProcessAnticipation` -> `entity/Stamp`（deps.xml 第 24 行）
- `control/concept/ProcessAnticipation` -> `main/Nar`（deps.xml 第 25 行）
- `control/concept/ProcessAnticipation` -> `inference/UtilityFunctions`（deps.xml 第 26 行）
- `control/concept/ProcessAnticipation` -> `control/DerivationContext`（deps.xml 第 27 行）
- `control/concept/ProcessAnticipation` -> `language/Equivalence`（deps.xml 第 28 行）
- `control/concept/ProcessAnticipation` -> `entity/TermLink`（deps.xml 第 29 行）
- `control/concept/ProcessAnticipation` -> `storage/Memory`（deps.xml 第 30 行）
- 交叉校验：
- Java graph 额外依赖：control/DerivationContext、entity/BudgetValue、entity/Concept、entity/Sentence、entity/Stamp、entity/Task、entity/TaskLink、entity/TermLink、entity/TruthValue、inference/RuleTables、inference/TemporalRules、inference/UtilityFunctions、interfaces/Timable、io/Symbols、io/events/OutputHandler、language/CompoundTerm、language/Conjunction、language/Equivalence、language/Implication、language/Interval、language/Statement、language/Tense、language/Term、main/Nar、operator/Operator、operator/mental/Anticipate、parameter/Parameters、storage/Memory

## 5. Java 功能说明

- **职责概述**：文件工作：重建推理循环、任务调度与暂停机制，替换 synchronized/wait 行为。
- **关键数据结构**：
- `ProcessAnticipation` · 继承：JavaObject · 实现：（无接口）
- **核心流程 / 算法**：
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：重建推理循环、任务调度与暂停机制，替换 synchronized/wait 行为。
  3. Java-TS 差异：参见《通用转译法.md》 - 控制与调度
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `Java Memory/Task 接口` 衔接上下游。

## 6. 一致性风险

- `tsc` 报错阻塞进一步分析，需要回填语句结构。
- 缺少显式 import，需依赖 Java/ts-analysis 交叉校验。

## 7. 路线图定位

- 1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
- 2. 文件工作：重建推理循环、任务调度与暂停机制，替换 synchronized/wait 行为。
- 3. Java-TS 差异：参见《通用转译法.md》 - 控制与调度

## 8. 附加记录

- ts-analysis: LOC=264 · TODO=0
- 参考文件：`java-master/src/main/java/org/opennars/control/concept/ProcessAnticipation.java`
