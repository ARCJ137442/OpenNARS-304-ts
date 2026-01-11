# src/inference/TemporalRules.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/inference/TemporalRules.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/inference/TemporalRules.java` |
| 模块链路 | `language 基座 -> entity -> inference 推理层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/inference/TemporalRules.ts --noEmit`）

- 执行的命令：`npx tsc src/inference/TemporalRules.ts --noEmit`
- 关键输出：
  - TS2304（L26, C36）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L26, C49）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L32, C41）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L32, C51）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L132, C48）：[full_check] Cannot find name 'Term'.
  - TS2304（L137, C50）：[full_check] Cannot find name 'Term'.
  - TS2304（L138, C30）：[full_check] Cannot find name 'Inheritance'.
  - TS2304（L138, C60）：[full_check] Cannot find name 'Similarity'.
  - TS2304（L142, C41）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L142, C55）：[full_check] Cannot find name 'Sentence'.
  - TS2503（L143, C14）：[full_check] Cannot find namespace 'org'.
  - TS2304（L144, C71）：[full_check] Cannot find name 'Task'.
  - TS2304（L146, C78）：[full_check] Cannot find name 'Symbols'.
  - TS2304（L147, C35）：[full_check] Cannot find name 'Symbols'.
  - TS2304（L151, C17）：[full_check] Cannot find name 'Term'.
  - TS2304（L152, C17）：[full_check] Cannot find name 'Term'.
  - TS2304（L154, C61）：[full_check] Cannot find name 'Statement'.
  - TS2304（L155, C13）：[full_check] Cannot find name 'Statement'.
  - TS2304（L162, C23）：[full_check] Cannot find name 'Interval'.
  - TS2304（L165, C28）：[full_check] Cannot find name 'Interval'.
  - TS2304（L167, C22）：[full_check] Cannot find name 'Conjunction'.
  - TS2304（L169, C22）：[full_check] Cannot find name 'Conjunction'.
  - TS2349（L172, C26）：[full_check] This expression is not callable.
  - TS2448（L172, C26）：[full_check] Block-scoped variable 'order' used before its declaration.
  - TS2454（L172, C26）：[full_check] Variable 'order' is used before being assigned.
  - TS2304（L173, C26）：[full_check] Cannot find name 'TruthValue'.
  - TS2304（L174, C26）：[full_check] Cannot find name 'TruthValue'.
  - TS2304（L177, C17）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L181, C21）：[full_check] Cannot find name 'TruthValue'.
  - TS2304（L181, C34）：[full_check] Cannot find name 'TruthFunctions'.
  - TS2304（L182, C21）：[full_check] Cannot find name 'TruthValue'.
  - TS2304（L182, C34）：[full_check] Cannot find name 'TruthFunctions'.
  - TS2304（L183, C21）：[full_check] Cannot find name 'TruthValue'.
  - TS2304（L183, C34）：[full_check] Cannot find name 'TruthFunctions'.
  - TS2304（L184, C21）：[full_check] Cannot find name 'TruthValue'.
  - TS2304（L184, C34）：[full_check] Cannot find name 'TruthFunctions'.
  - TS2304（L185, C22）：[full_check] Cannot find name 'BudgetValue'.
  - TS2304（L185, C36）：[full_check] Cannot find name 'BudgetFunctions'.
  - TS2304（L186, C22）：[full_check] Cannot find name 'BudgetValue'.
  - TS2304（L186, C36）：[full_check] Cannot find name 'BudgetFunctions'.
  - TS2304（L187, C22）：[full_check] Cannot find name 'BudgetValue'.
  - TS2304（L187, C36）：[full_check] Cannot find name 'BudgetFunctions'.
  - TS2304（L188, C22）：[full_check] Cannot find name 'BudgetValue'.
  - TS2304（L188, C36）：[full_check] Cannot find name 'BudgetFunctions'.
  - TS2304（L191, C25）：[full_check] Cannot find name 'Statement'.
  - TS2304（L191, C37）：[full_check] Cannot find name 'Implication'.
  - TS2304（L192, C25）：[full_check] Cannot find name 'Statement'.
  - TS2304（L192, C37）：[full_check] Cannot find name 'Implication'.
  - TS2304（L193, C25）：[full_check] Cannot find name 'Statement'.
  - TS2304（L193, C37）：[full_check] Cannot find name 'Equivalence'.
  - TS2304（L194, C25）：[full_check] Cannot find name 'Term'.
  - TS2304（L197, C30）：[full_check] Cannot find name 'Conjunction'.
  - TS2304（L200, C30）：[full_check] Cannot find name 'Conjunction'.
  - TS2304（L203, C30）：[full_check] Cannot find name 'Conjunction'.
  - TS2304（L207, C34）：[full_check] Cannot find name 'Term'.
  - TS2304（L208, C34）：[full_check] Cannot find name 'Term'.
  - TS2694（L209, C49）：[full_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/lang/index"' has no exported member 'Float'.
  - TS2304（L214, C41）：[full_check] Cannot find name 'Pair'.
  - TS2304（L214, C46）：[full_check] Cannot find name 'Term'.
  - TS2694（L214, C62）：[full_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/lang/index"' has no exported member 'Float'.
  - TS2304（L214, C72）：[full_check] Cannot find name 'CompositionalRules'.
  - TS2304（L216, C60）：[full_check] Cannot find name 'Statement'.
  - TS2304（L217, C60）：[full_check] Cannot find name 'Statement'.
  - TS2304（L223, C41）：[full_check] Cannot find name 'Task'.
  - TS2304（L226, C26）：[full_check] Cannot find name 'Term'.
  - TS2304（L227, C26）：[full_check] Cannot find name 'Term'.
  - TS2694（L228, C40）：[full_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/lang/index"' has no exported member 'Float'.
  - TS2304（L229, C34）：[full_check] Cannot find name 'Statement'.
  - TS2304（L229, C46）：[full_check] Cannot find name 'Implication'.
  - TS2304（L230, C34）：[full_check] Cannot find name 'Statement'.
  - TS2304（L230, C46）：[full_check] Cannot find name 'Implication'.
  - TS2304（L231, C34）：[full_check] Cannot find name 'Statement'.
  - TS2304（L231, C46）：[full_check] Cannot find name 'Equivalence'.
  - TS2304（L246, C36）：[full_check] Cannot find name 'Task'.
  - TS2304（L253, C52）：[full_check] Cannot find name 'Conjunction'.
  - TS2304（L256, C25）：[full_check] Cannot find name 'TemporalInferenceControl'.
  - TS2304（L267, C42）：[full_check] Cannot find name 'DerivationContext'.
  - TS2304（L267, C69）：[full_check] Cannot find name 'TruthValue'.
  - TS2304（L267, C90）：[full_check] Cannot find name 'BudgetValue'.
  - TS2304（L268, C21）：[full_check] Cannot find name 'Statement'.
  - TS2304（L268, C56）：[full_check] Cannot find name 'Task'.
  - TS2304（L270, C35）：[full_check] Cannot find name 'Task'.
  - TS2304（L308, C28）：[full_check] Cannot find name 'Stamp'.
  - TS2304（L308, C53）：[full_check] Cannot find name 'Stamp'.
  - TS2304（L328, C19）：[full_check] Cannot find name 'Stamp'.
  - TS2304（L332, C27）：[full_check] Cannot find name 'Stamp'.
  - TS2304（L333, C26）：[full_check] Cannot find name 'Stamp'.
  - TS2304（L26, C36）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L26, C49）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L32, C41）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L32, C51）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L132, C48）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L137, C50）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L138, C30）：[syntax_check] Cannot find name 'Inheritance'.
  - TS2304（L138, C60）：[syntax_check] Cannot find name 'Similarity'.
  - TS2304（L142, C41）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L142, C55）：[syntax_check] Cannot find name 'Sentence'.
  - TS2503（L143, C14）：[syntax_check] Cannot find namespace 'org'.
  - TS2304（L144, C71）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L146, C78）：[syntax_check] Cannot find name 'Symbols'.
  - TS2304（L147, C35）：[syntax_check] Cannot find name 'Symbols'.
  - TS2304（L151, C17）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L152, C17）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L154, C61）：[syntax_check] Cannot find name 'Statement'.
  - TS2304（L155, C13）：[syntax_check] Cannot find name 'Statement'.
  - TS2304（L162, C23）：[syntax_check] Cannot find name 'Interval'.
  - TS2304（L165, C28）：[syntax_check] Cannot find name 'Interval'.
  - TS2304（L167, C22）：[syntax_check] Cannot find name 'Conjunction'.
  - TS2304（L169, C22）：[syntax_check] Cannot find name 'Conjunction'.
  - TS2349（L172, C26）：[syntax_check] This expression is not callable.
  - TS2448（L172, C26）：[syntax_check] Block-scoped variable 'order' used before its declaration.
  - TS2454（L172, C26）：[syntax_check] Variable 'order' is used before being assigned.
  - TS2304（L173, C26）：[syntax_check] Cannot find name 'TruthValue'.
  - TS2304（L174, C26）：[syntax_check] Cannot find name 'TruthValue'.
  - TS2304（L177, C17）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L181, C21）：[syntax_check] Cannot find name 'TruthValue'.
  - TS2304（L181, C34）：[syntax_check] Cannot find name 'TruthFunctions'.
  - TS2304（L182, C21）：[syntax_check] Cannot find name 'TruthValue'.
  - TS2304（L182, C34）：[syntax_check] Cannot find name 'TruthFunctions'.
  - TS2304（L183, C21）：[syntax_check] Cannot find name 'TruthValue'.
  - TS2304（L183, C34）：[syntax_check] Cannot find name 'TruthFunctions'.
  - TS2304（L184, C21）：[syntax_check] Cannot find name 'TruthValue'.
  - TS2304（L184, C34）：[syntax_check] Cannot find name 'TruthFunctions'.
  - TS2304（L185, C22）：[syntax_check] Cannot find name 'BudgetValue'.
  - TS2304（L185, C36）：[syntax_check] Cannot find name 'BudgetFunctions'.
  - TS2304（L186, C22）：[syntax_check] Cannot find name 'BudgetValue'.
  - TS2304（L186, C36）：[syntax_check] Cannot find name 'BudgetFunctions'.
  - TS2304（L187, C22）：[syntax_check] Cannot find name 'BudgetValue'.
  - TS2304（L187, C36）：[syntax_check] Cannot find name 'BudgetFunctions'.
  - TS2304（L188, C22）：[syntax_check] Cannot find name 'BudgetValue'.
  - TS2304（L188, C36）：[syntax_check] Cannot find name 'BudgetFunctions'.
  - TS2304（L191, C25）：[syntax_check] Cannot find name 'Statement'.
  - TS2304（L191, C37）：[syntax_check] Cannot find name 'Implication'.
  - TS2304（L192, C25）：[syntax_check] Cannot find name 'Statement'.
  - TS2304（L192, C37）：[syntax_check] Cannot find name 'Implication'.
  - TS2304（L193, C25）：[syntax_check] Cannot find name 'Statement'.
  - TS2304（L193, C37）：[syntax_check] Cannot find name 'Equivalence'.
  - TS2304（L194, C25）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L197, C30）：[syntax_check] Cannot find name 'Conjunction'.
  - TS2304（L200, C30）：[syntax_check] Cannot find name 'Conjunction'.
  - TS2304（L203, C30）：[syntax_check] Cannot find name 'Conjunction'.
  - TS2304（L207, C34）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L208, C34）：[syntax_check] Cannot find name 'Term'.
  - TS2694（L209, C49）：[syntax_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/lang/index"' has no exported member 'Float'.
  - TS2304（L214, C41）：[syntax_check] Cannot find name 'Pair'.
  - TS2304（L214, C46）：[syntax_check] Cannot find name 'Term'.
  - TS2694（L214, C62）：[syntax_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/lang/index"' has no exported member 'Float'.
  - TS2304（L214, C72）：[syntax_check] Cannot find name 'CompositionalRules'.
  - TS2304（L216, C60）：[syntax_check] Cannot find name 'Statement'.
  - TS2304（L217, C60）：[syntax_check] Cannot find name 'Statement'.
  - TS2304（L223, C41）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L226, C26）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L227, C26）：[syntax_check] Cannot find name 'Term'.
  - TS2694（L228, C40）：[syntax_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/lang/index"' has no exported member 'Float'.
  - TS2304（L229, C34）：[syntax_check] Cannot find name 'Statement'.
  - TS2304（L229, C46）：[syntax_check] Cannot find name 'Implication'.
  - TS2304（L230, C34）：[syntax_check] Cannot find name 'Statement'.
  - TS2304（L230, C46）：[syntax_check] Cannot find name 'Implication'.
  - TS2304（L231, C34）：[syntax_check] Cannot find name 'Statement'.
  - TS2304（L231, C46）：[syntax_check] Cannot find name 'Equivalence'.
  - TS2304（L246, C36）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L253, C52）：[syntax_check] Cannot find name 'Conjunction'.
  - TS2304（L256, C25）：[syntax_check] Cannot find name 'TemporalInferenceControl'.
  - TS2304（L267, C42）：[syntax_check] Cannot find name 'DerivationContext'.
  - TS2304（L267, C69）：[syntax_check] Cannot find name 'TruthValue'.
  - TS2304（L267, C90）：[syntax_check] Cannot find name 'BudgetValue'.
  - TS2304（L268, C21）：[syntax_check] Cannot find name 'Statement'.
  - TS2304（L268, C56）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L270, C35）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L308, C28）：[syntax_check] Cannot find name 'Stamp'.
  - TS2304（L308, C53）：[syntax_check] Cannot find name 'Stamp'.
  - TS2304（L328, C19）：[syntax_check] Cannot find name 'Stamp'.
  - TS2304（L332, C27）：[syntax_check] Cannot find name 'Stamp'.
  - TS2304（L333, C26）：[syntax_check] Cannot find name 'Stamp'.
- 总结：存在语法错误，需要比对 Java 语句结构。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

（无显式结构性依赖，主要依赖 `jree` 提供的运行时桩或尚未补齐的全局声明。）

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

- `[full_check] Cannot find name 'Sentence'.` @ L26
- `[full_check] Cannot find name 'Sentence'.` @ L26
- `[full_check] Cannot find name 'Sentence'.` @ L32
- `[full_check] Cannot find name 'Sentence'.` @ L32
- `[full_check] Cannot find name 'Term'.` @ L132
- `[full_check] Cannot find name 'Term'.` @ L137
- `[full_check] Cannot find name 'Inheritance'.` @ L138
- `[full_check] Cannot find name 'Similarity'.` @ L138
- `[full_check] Cannot find name 'Sentence'.` @ L142
- `[full_check] Cannot find name 'Sentence'.` @ L142
- `[full_check] Cannot find namespace 'org'.` @ L143
- `[full_check] Cannot find name 'Task'.` @ L144
- `[full_check] Cannot find name 'Symbols'.` @ L146
- `[full_check] Cannot find name 'Symbols'.` @ L147
- `[full_check] Cannot find name 'Term'.` @ L151
- `[full_check] Cannot find name 'Term'.` @ L152
- `[full_check] Cannot find name 'Statement'.` @ L154
- `[full_check] Cannot find name 'Statement'.` @ L155
- `[full_check] Cannot find name 'Interval'.` @ L162
- `[full_check] Cannot find name 'Interval'.` @ L165
- `[full_check] Cannot find name 'Conjunction'.` @ L167
- `[full_check] Cannot find name 'Conjunction'.` @ L169
- `[full_check] Cannot find name 'TruthValue'.` @ L173
- `[full_check] Cannot find name 'TruthValue'.` @ L174
- `[full_check] Cannot find name 'Sentence'.` @ L177
- `[full_check] Cannot find name 'TruthValue'.` @ L181
- `[full_check] Cannot find name 'TruthFunctions'.` @ L181
- `[full_check] Cannot find name 'TruthValue'.` @ L182
- `[full_check] Cannot find name 'TruthFunctions'.` @ L182
- `[full_check] Cannot find name 'TruthValue'.` @ L183
- `[full_check] Cannot find name 'TruthFunctions'.` @ L183
- `[full_check] Cannot find name 'TruthValue'.` @ L184
- `[full_check] Cannot find name 'TruthFunctions'.` @ L184
- `[full_check] Cannot find name 'BudgetValue'.` @ L185
- `[full_check] Cannot find name 'BudgetFunctions'.` @ L185
- `[full_check] Cannot find name 'BudgetValue'.` @ L186
- `[full_check] Cannot find name 'BudgetFunctions'.` @ L186
- `[full_check] Cannot find name 'BudgetValue'.` @ L187
- `[full_check] Cannot find name 'BudgetFunctions'.` @ L187
- `[full_check] Cannot find name 'BudgetValue'.` @ L188
- `[full_check] Cannot find name 'BudgetFunctions'.` @ L188
- `[full_check] Cannot find name 'Statement'.` @ L191
- `[full_check] Cannot find name 'Implication'.` @ L191
- `[full_check] Cannot find name 'Statement'.` @ L192
- `[full_check] Cannot find name 'Implication'.` @ L192
- `[full_check] Cannot find name 'Statement'.` @ L193
- `[full_check] Cannot find name 'Equivalence'.` @ L193
- `[full_check] Cannot find name 'Term'.` @ L194
- `[full_check] Cannot find name 'Conjunction'.` @ L197
- `[full_check] Cannot find name 'Conjunction'.` @ L200
- `[full_check] Cannot find name 'Conjunction'.` @ L203
- `[full_check] Cannot find name 'Term'.` @ L207
- `[full_check] Cannot find name 'Term'.` @ L208
- `[full_check] Cannot find name 'Pair'.` @ L214
- `[full_check] Cannot find name 'Term'.` @ L214
- `[full_check] Cannot find name 'CompositionalRules'.` @ L214
- `[full_check] Cannot find name 'Statement'.` @ L216
- `[full_check] Cannot find name 'Statement'.` @ L217
- `[full_check] Cannot find name 'Task'.` @ L223
- `[full_check] Cannot find name 'Term'.` @ L226
- `[full_check] Cannot find name 'Term'.` @ L227
- `[full_check] Cannot find name 'Statement'.` @ L229
- `[full_check] Cannot find name 'Implication'.` @ L229
- `[full_check] Cannot find name 'Statement'.` @ L230
- `[full_check] Cannot find name 'Implication'.` @ L230
- `[full_check] Cannot find name 'Statement'.` @ L231
- `[full_check] Cannot find name 'Equivalence'.` @ L231
- `[full_check] Cannot find name 'Task'.` @ L246
- `[full_check] Cannot find name 'Conjunction'.` @ L253
- `[full_check] Cannot find name 'TemporalInferenceControl'.` @ L256
- `[full_check] Cannot find name 'DerivationContext'.` @ L267
- `[full_check] Cannot find name 'TruthValue'.` @ L267
- `[full_check] Cannot find name 'BudgetValue'.` @ L267
- `[full_check] Cannot find name 'Statement'.` @ L268
- `[full_check] Cannot find name 'Task'.` @ L268
- `[full_check] Cannot find name 'Task'.` @ L270
- `[full_check] Cannot find name 'Stamp'.` @ L308
- `[full_check] Cannot find name 'Stamp'.` @ L308
- `[full_check] Cannot find name 'Stamp'.` @ L328
- `[full_check] Cannot find name 'Stamp'.` @ L332
- `[full_check] Cannot find name 'Stamp'.` @ L333
- `[syntax_check] Cannot find name 'Sentence'.` @ L26
- `[syntax_check] Cannot find name 'Sentence'.` @ L26
- `[syntax_check] Cannot find name 'Sentence'.` @ L32
- `[syntax_check] Cannot find name 'Sentence'.` @ L32
- `[syntax_check] Cannot find name 'Term'.` @ L132
- `[syntax_check] Cannot find name 'Term'.` @ L137
- `[syntax_check] Cannot find name 'Inheritance'.` @ L138
- `[syntax_check] Cannot find name 'Similarity'.` @ L138
- `[syntax_check] Cannot find name 'Sentence'.` @ L142
- `[syntax_check] Cannot find name 'Sentence'.` @ L142
- `[syntax_check] Cannot find namespace 'org'.` @ L143
- `[syntax_check] Cannot find name 'Task'.` @ L144
- `[syntax_check] Cannot find name 'Symbols'.` @ L146
- `[syntax_check] Cannot find name 'Symbols'.` @ L147
- `[syntax_check] Cannot find name 'Term'.` @ L151
- `[syntax_check] Cannot find name 'Term'.` @ L152
- `[syntax_check] Cannot find name 'Statement'.` @ L154
- `[syntax_check] Cannot find name 'Statement'.` @ L155
- `[syntax_check] Cannot find name 'Interval'.` @ L162
- `[syntax_check] Cannot find name 'Interval'.` @ L165
- `[syntax_check] Cannot find name 'Conjunction'.` @ L167
- `[syntax_check] Cannot find name 'Conjunction'.` @ L169
- `[syntax_check] Cannot find name 'TruthValue'.` @ L173
- `[syntax_check] Cannot find name 'TruthValue'.` @ L174
- `[syntax_check] Cannot find name 'Sentence'.` @ L177
- `[syntax_check] Cannot find name 'TruthValue'.` @ L181
- `[syntax_check] Cannot find name 'TruthFunctions'.` @ L181
- `[syntax_check] Cannot find name 'TruthValue'.` @ L182
- `[syntax_check] Cannot find name 'TruthFunctions'.` @ L182
- `[syntax_check] Cannot find name 'TruthValue'.` @ L183
- `[syntax_check] Cannot find name 'TruthFunctions'.` @ L183
- `[syntax_check] Cannot find name 'TruthValue'.` @ L184
- `[syntax_check] Cannot find name 'TruthFunctions'.` @ L184
- `[syntax_check] Cannot find name 'BudgetValue'.` @ L185
- `[syntax_check] Cannot find name 'BudgetFunctions'.` @ L185
- `[syntax_check] Cannot find name 'BudgetValue'.` @ L186
- `[syntax_check] Cannot find name 'BudgetFunctions'.` @ L186
- `[syntax_check] Cannot find name 'BudgetValue'.` @ L187
- `[syntax_check] Cannot find name 'BudgetFunctions'.` @ L187
- `[syntax_check] Cannot find name 'BudgetValue'.` @ L188
- `[syntax_check] Cannot find name 'BudgetFunctions'.` @ L188
- `[syntax_check] Cannot find name 'Statement'.` @ L191
- `[syntax_check] Cannot find name 'Implication'.` @ L191
- `[syntax_check] Cannot find name 'Statement'.` @ L192
- `[syntax_check] Cannot find name 'Implication'.` @ L192
- `[syntax_check] Cannot find name 'Statement'.` @ L193
- `[syntax_check] Cannot find name 'Equivalence'.` @ L193
- `[syntax_check] Cannot find name 'Term'.` @ L194
- `[syntax_check] Cannot find name 'Conjunction'.` @ L197
- `[syntax_check] Cannot find name 'Conjunction'.` @ L200
- `[syntax_check] Cannot find name 'Conjunction'.` @ L203
- `[syntax_check] Cannot find name 'Term'.` @ L207
- `[syntax_check] Cannot find name 'Term'.` @ L208
- `[syntax_check] Cannot find name 'Pair'.` @ L214
- `[syntax_check] Cannot find name 'Term'.` @ L214
- `[syntax_check] Cannot find name 'CompositionalRules'.` @ L214
- `[syntax_check] Cannot find name 'Statement'.` @ L216
- `[syntax_check] Cannot find name 'Statement'.` @ L217
- `[syntax_check] Cannot find name 'Task'.` @ L223
- `[syntax_check] Cannot find name 'Term'.` @ L226
- `[syntax_check] Cannot find name 'Term'.` @ L227
- `[syntax_check] Cannot find name 'Statement'.` @ L229
- `[syntax_check] Cannot find name 'Implication'.` @ L229
- `[syntax_check] Cannot find name 'Statement'.` @ L230
- `[syntax_check] Cannot find name 'Implication'.` @ L230
- `[syntax_check] Cannot find name 'Statement'.` @ L231
- `[syntax_check] Cannot find name 'Equivalence'.` @ L231
- `[syntax_check] Cannot find name 'Task'.` @ L246
- `[syntax_check] Cannot find name 'Conjunction'.` @ L253
- `[syntax_check] Cannot find name 'TemporalInferenceControl'.` @ L256
- `[syntax_check] Cannot find name 'DerivationContext'.` @ L267
- `[syntax_check] Cannot find name 'TruthValue'.` @ L267
- `[syntax_check] Cannot find name 'BudgetValue'.` @ L267
- `[syntax_check] Cannot find name 'Statement'.` @ L268
- `[syntax_check] Cannot find name 'Task'.` @ L268
- `[syntax_check] Cannot find name 'Task'.` @ L270
- `[syntax_check] Cannot find name 'Stamp'.` @ L308
- `[syntax_check] Cannot find name 'Stamp'.` @ L308
- `[syntax_check] Cannot find name 'Stamp'.` @ L328
- `[syntax_check] Cannot find name 'Stamp'.` @ L332
- `[syntax_check] Cannot find name 'Stamp'.` @ L333

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `inference/TemporalRules` -> `language/Interval`（deps.xml 第 479 行）
- `inference/TemporalRules` -> `entity/TruthValue`（deps.xml 第 480 行）
- `inference/TemporalRules` -> `language/Implication`（deps.xml 第 481 行）
- `inference/TemporalRules` -> `language/Statement`（deps.xml 第 482 行）
- `inference/TemporalRules` -> `entity/Task`（deps.xml 第 483 行）
- `inference/TemporalRules` -> `entity/BudgetValue`（deps.xml 第 484 行）
- `inference/TemporalRules` -> `language/Conjunction`（deps.xml 第 485 行）
- `inference/TemporalRules` -> `interfaces/Timable`（deps.xml 第 486 行）
- `inference/TemporalRules` -> `language/Term`（deps.xml 第 487 行）
- `inference/TemporalRules` -> `entity/Sentence`（deps.xml 第 488 行）
- `inference/TemporalRules` -> `io/Symbols`（deps.xml 第 489 行）
- `inference/TemporalRules` -> `parameter/Parameters`（deps.xml 第 490 行）
- `inference/TemporalRules` -> `language/Inheritance`（deps.xml 第 491 行）
- `inference/TemporalRules` -> `control/TemporalInferenceControl`（deps.xml 第 492 行）
- `inference/TemporalRules` -> `inference/BudgetFunctions`（deps.xml 第 493 行）
- `inference/TemporalRules` -> `entity/Stamp`（deps.xml 第 494 行）
- `inference/TemporalRules` -> `control/DerivationContext`（deps.xml 第 495 行）
- `inference/TemporalRules` -> `language/Equivalence`（deps.xml 第 496 行）
- `inference/TemporalRules` -> `inference/CompositionalRules`（deps.xml 第 497 行）
- `inference/TemporalRules` -> `inference/TruthFunctions`（deps.xml 第 498 行）
- `inference/TemporalRules` -> `language/Similarity`（deps.xml 第 499 行）
- 交叉校验：
- Java graph 额外依赖：control/DerivationContext、control/TemporalInferenceControl、entity/BudgetValue、entity/Sentence、entity/Stamp、entity/Task、entity/TruthValue、inference/BudgetFunctions、inference/CompositionalRules、inference/TruthFunctions、interfaces/Timable、io/Symbols、language/Conjunction、language/Equivalence、language/Implication、language/Inheritance、language/Interval、language/Similarity、language/Statement、language/Term、parameter/Parameters

## 5. Java 功能说明

- **职责概述**：文件工作：复制规则/真值/预算静态表并完善类型约束与数值校验。；TODO 2 处
- **关键数据结构**：
- `TemporalRules` · 继承：JavaObject · 实现：（无接口）
- **核心流程 / 算法**：
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：复制规则/真值/预算静态表并完善类型约束与数值校验。；TODO 2 处
  3. Java-TS 差异：参见《通用转译法.md》 - 推理规则
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `Java Memory/Task 接口` 衔接上下游。

## 6. 一致性风险

- 文件内仍保留 2 处 TODO，需对照 Java 填补。
- `tsc` 报错阻塞进一步分析，需要回填语句结构。
- 缺少显式 import，需依赖 Java/ts-analysis 交叉校验。

## 7. 路线图定位

- 1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
- 2. 文件工作：复制规则/真值/预算静态表并完善类型约束与数值校验。；TODO 2 处
- 3. Java-TS 差异：参见《通用转译法.md》 - 推理规则

## 8. 附加记录

- ts-analysis: LOC=340 · TODO=2
- 参考文件：`java-master/src/main/java/org/opennars/inference/TemporalRules.java`
