# spec004 文件分析总览

- 分析时间：2026-01-11
- 覆盖范围：`src` 目录下 119 个 TypeScript 文件
- TODO 累计：43 处

## 模块分布

- language: 30 个文件
- operator: 23 个文件
- io: 11 个文件
- entity: 10 个文件
- interfaces: 10 个文件
- inference: 9 个文件
- plugin: 9 个文件
- control: 8 个文件
- main: 5 个文件
- storage: 3 个文件
- util: 1 个文件

## `npx tsc --noEmit` 失败文件

- entity/Item.ts
- entity/Task.ts
- inference/RuleTables.ts
- inference/TruthFunctions.ts
- io/events/EventEmitter.ts
- io/events/Events.ts
- language/Statement.ts
- main/NarNode.ts
- main/Shell.ts
- plugin/perception/SensoryChannel.ts

## TODO 分布

- control/TemporalInferenceControl.ts: TODO 1 处
- entity/BudgetValue.ts: TODO 1 处
- entity/Concept.ts: TODO 2 处
- entity/Sentence.ts: TODO 2 处
- entity/Stamp.ts: TODO 2 处
- entity/TermLink.ts: TODO 1 处
- inference/RuleTables.ts: TODO 1 处
- inference/TemporalRules.ts: TODO 2 处
- interfaces/NarseseConsumer.ts: TODO 1 处
- io/Texts.ts: TODO 1 处
- io/events/EventEmitter.ts: TODO 1 处
- language/CompoundTerm.ts: TODO 4 处
- language/DifferenceExt.ts: TODO 1 处
- language/DifferenceInt.ts: TODO 1 处
- language/Equivalence.ts: TODO 1 处
- language/Image.ts: TODO 1 处
- language/ImageExt.ts: TODO 1 处
- language/ImageInt.ts: TODO 1 处
- language/Term.ts: TODO 1 处
- language/Terms.ts: TODO 1 处
- language/Variable.ts: TODO 1 处
- language/Variables.ts: TODO 1 处
- main/Nar.ts: TODO 2 处
- main/Parameters.ts: TODO 1 处
- main/Shell.ts: TODO 1 处
- operator/FunctionOperator.ts: TODO 2 处
- plugin/mental/Abbreviation.ts: TODO 1 处
- plugin/mental/Counting.ts: TODO 1 处
- plugin/perception/VisualSpace.ts: TODO 4 处
- storage/Bag.ts: TODO 2 处

## 缺失 Java 对应文件

- 全部文件均可在 java-master 中找到对应源。
