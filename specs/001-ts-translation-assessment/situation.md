# 现状报告

> 所属spec：[ts-translation-assessment](README.md)

## 范围
对比 java-master/src/main/java/org/opennars 和当前 `src` TypeScript 实现，以 ts-analysis.json 信息为核心资料来统计覆盖率、语法可执行性与依赖完整性。

## 执行摘要
- 规模：共计 119 个 TS 文件，TODO 43 处，全部已映射至 Java 源文件。
- 编译：`npx tsc --noEmit` 对 10 个 TS 文件报告错误，及 `test/metrics/AttentionMetric.ts` (单独设置的测试) 需要一并修复。
- 测试：目前 `npm test` 只覆盖 `test/node/distributor.test.ts`，大部分核心文件缺乏热点测试。
- 数据：本报告采用 ts-analysis.json + tsc/npm test 实运利用结果。

## 按包统计
- control: TS 8/8，已完全对齐
- entity: TS 10/11，仍缺 1 个 Java 文件翻译
- inference: TS 9/10，仍缺 1 个 Java 文件翻译
- interfaces: TS 10/10，已完全对齐
- io: TS 11/12，仍缺 1 个 Java 文件翻译
- language: TS 30/31，仍缺 1 个 Java 文件翻译
- main: TS 5/3，TS 比 Java 额外 2 个文件 (如 main/提取 Parameter)
- operator: TS 23/23，已完全对齐
- plugin: TS 9/9，已完全对齐
- storage: TS 3/4，仍缺 1 个 Java 文件翻译
- util: TS 1/1，已完全对齐
- parameter: TS 0/2，仍缺 2 个 Java 文件翻译

## 编译与测试现状
以下文件需要先修复 tsc 错误：
- entity/Item.ts: TS1005 @ 281:36 '=' expected.
- entity/Task.ts: TS1005 @ 222:25 ';' expected.
- inference/RuleTables.ts: TS1005 @ 621:23 ';' expected.
- inference/TruthFunctions.ts: TS1005 @ 43:39 ';' expected.
- io/events/EventEmitter.ts: TS1109 @ 113:30 Expression expected.
- io/events/Events.ts: TS1005 @ 357:38 '=' expected.
- language/Statement.ts: TS1005 @ 365:27 ';' expected.
- main/NarNode.ts: TS1472 @ 316:13 'catch' or 'finally' expected.
- main/Shell.ts: TS1359 @ 107:35 Identifier expected. 'in' is a reserved word that cannot be used here.
- plugin/perception/SensoryChannel.ts: TS1135 @ 144:31 Argument expression expected.
- `npm test`: 尚保留 `test/node/distributor.test.ts`，需依照路线图为其他模块增补 smoke test。

## 文件级评估
本段对每个 TS 文件建立“Java 对照”、“可执行性”、“路线图”信息，以侧助后续转译排期。

## control/DerivationContext.ts

- **Java对照**: `java-master/src/main/java/org/opennars/control/DerivationContext.java`
- **规模 / TODO**: 约 610 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：重建推理循环、任务调度与暂停机制，替换 synchronized/wait 行为。
  3. Java-TS 差异：参见《通用转译法.md》 - 控制与调度

## control/GeneralInferenceControl.ts

- **Java对照**: `java-master/src/main/java/org/opennars/control/GeneralInferenceControl.java`
- **规模 / TODO**: 约 115 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：重建推理循环、任务调度与暂停机制，替换 synchronized/wait 行为。
  3. Java-TS 差异：参见《通用转译法.md》 - 控制与调度

## control/TemporalInferenceControl.ts

- **Java对照**: `java-master/src/main/java/org/opennars/control/TemporalInferenceControl.java`
- **规模 / TODO**: 约 235 行，TODO 1 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：重建推理循环、任务调度与暂停机制，替换 synchronized/wait 行为。；TODO 1 处
  3. Java-TS 差异：参见《通用转译法.md》 - 控制与调度

## control/concept/ProcessAnticipation.ts

- **Java对照**: `java-master/src/main/java/org/opennars/control/concept/ProcessAnticipation.java`
- **规模 / TODO**: 约 264 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：重建推理循环、任务调度与暂停机制，替换 synchronized/wait 行为。
  3. Java-TS 差异：参见《通用转译法.md》 - 控制与调度

## control/concept/ProcessGoal.ts

- **Java对照**: `java-master/src/main/java/org/opennars/control/concept/ProcessGoal.java`
- **规模 / TODO**: 约 492 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：重建推理循环、任务调度与暂停机制，替换 synchronized/wait 行为。
  3. Java-TS 差异：参见《通用转译法.md》 - 控制与调度

## control/concept/ProcessJudgment.ts

- **Java对照**: `java-master/src/main/java/org/opennars/control/concept/ProcessJudgment.java`
- **规模 / TODO**: 约 181 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：重建推理循环、任务调度与暂停机制，替换 synchronized/wait 行为。
  3. Java-TS 差异：参见《通用转译法.md》 - 控制与调度

## control/concept/ProcessQuestion.ts

- **Java对照**: `java-master/src/main/java/org/opennars/control/concept/ProcessQuestion.java`
- **规模 / TODO**: 约 143 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：重建推理循环、任务调度与暂停机制，替换 synchronized/wait 行为。
  3. Java-TS 差异：参见《通用转译法.md》 - 控制与调度

## control/concept/ProcessTask.ts

- **Java对照**: `java-master/src/main/java/org/opennars/control/concept/ProcessTask.java`
- **规模 / TODO**: 约 62 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：重建推理循环、任务调度与暂停机制，替换 synchronized/wait 行为。
  3. Java-TS 差异：参见《通用转译法.md》 - 控制与调度

## entity/BudgetValue.ts

- **Java对照**: `java-master/src/main/java/org/opennars/entity/BudgetValue.java`
- **规模 / TODO**: 约 353 行，TODO 1 处
- **依赖现状**: 依赖：io/Symbols.ts, inference/UtilityFunctions.ts, inference/BudgetFunctions.ts, main/Parameters.ts, entity/TruthValue.ts
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：依赖：io/Symbols.ts, inference/UtilityFunctions.ts, inference/BudgetFunctions.ts, main/Parameters.ts, entity/TruthValue.ts
  2. 文件工作：保持 Stamp/TruthValue 等值对象的不可变语义，补齐 clone/equals/hash 与序列化。；TODO 1 处
  3. Java-TS 差异：参见《通用转译法.md》 - 实体与序列化

## entity/Concept.ts

- **Java对照**: `java-master/src/main/java/org/opennars/entity/Concept.java`
- **规模 / TODO**: 约 620 行，TODO 2 处
- **依赖现状**: 依赖：entity/Item.ts, language/Term.ts, entity/Sentence.ts, entity/Task.ts, storage/Bag.ts, entity/TaskLink.ts
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：依赖：entity/Item.ts, language/Term.ts, entity/Sentence.ts, entity/Task.ts, storage/Bag.ts, entity/TaskLink.ts
  2. 文件工作：保持 Stamp/TruthValue 等值对象的不可变语义，补齐 clone/equals/hash 与序列化。；TODO 2 处
  3. Java-TS 差异：参见《通用转译法.md》 - 实体与序列化

## entity/Item.ts

- **Java对照**: `java-master/src/main/java/org/opennars/entity/Item.java`
- **规模 / TODO**: 约 285 行，TODO 0 处
- **依赖现状**: 依赖：entity/BudgetValue.ts
- **编译 / 测试**: 编译失败：TS1005 @ 281:36 '=' expected.，另有 2 条 ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：依赖：entity/BudgetValue.ts
  2. 文件工作：保持 Stamp/TruthValue 等值对象的不可变语义，补齐 clone/equals/hash 与序列化。；tsc TS1005 @ 281:36 错误
  3. Java-TS 差异：参见《通用转译法.md》 - 实体与序列化

## entity/Sentence.ts

- **Java对照**: `java-master/src/main/java/org/opennars/entity/Sentence.java`
- **规模 / TODO**: 约 643 行，TODO 2 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：保持 Stamp/TruthValue 等值对象的不可变语义，补齐 clone/equals/hash 与序列化。；TODO 2 处
  3. Java-TS 差异：参见《通用转译法.md》 - 实体与序列化

## entity/Stamp.ts

- **Java对照**: `java-master/src/main/java/org/opennars/entity/Stamp.java`
- **规模 / TODO**: 约 606 行，TODO 2 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：保持 Stamp/TruthValue 等值对象的不可变语义，补齐 clone/equals/hash 与序列化。；TODO 2 处
  3. Java-TS 差异：参见《通用转译法.md》 - 实体与序列化

## entity/TLink.ts

- **Java对照**: `java-master/src/main/java/org/opennars/entity/TLink.java`
- **规模 / TODO**: 约 18 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：保持 Stamp/TruthValue 等值对象的不可变语义，补齐 clone/equals/hash 与序列化。
  3. Java-TS 差异：参见《通用转译法.md》 - 实体与序列化

## entity/Task.ts

- **Java对照**: `java-master/src/main/java/org/opennars/entity/Task.java`
- **规模 / TODO**: 约 232 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 编译失败：TS1005 @ 222:25 ';' expected. ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：保持 Stamp/TruthValue 等值对象的不可变语义，补齐 clone/equals/hash 与序列化。；tsc TS1005 @ 222:25 错误
  3. Java-TS 差异：参见《通用转译法.md》 - 实体与序列化

## entity/TaskLink.ts

- **Java对照**: `java-master/src/main/java/org/opennars/entity/TaskLink.java`
- **规模 / TODO**: 约 218 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：保持 Stamp/TruthValue 等值对象的不可变语义，补齐 clone/equals/hash 与序列化。
  3. Java-TS 差异：参见《通用转译法.md》 - 实体与序列化

## entity/TermLink.ts

- **Java对照**: `java-master/src/main/java/org/opennars/entity/TermLink.java`
- **规模 / TODO**: 约 265 行，TODO 1 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：保持 Stamp/TruthValue 等值对象的不可变语义，补齐 clone/equals/hash 与序列化。；TODO 1 处
  3. Java-TS 差异：参见《通用转译法.md》 - 实体与序列化

## entity/TruthValue.ts

- **Java对照**: `java-master/src/main/java/org/opennars/entity/TruthValue.java`
- **规模 / TODO**: 约 332 行，TODO 0 处
- **依赖现状**: 依赖：io/Symbols.ts, main/Parameters.ts
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：依赖：io/Symbols.ts, main/Parameters.ts
  2. 文件工作：保持 Stamp/TruthValue 等值对象的不可变语义，补齐 clone/equals/hash 与序列化。
  3. Java-TS 差异：参见《通用转译法.md》 - 实体与序列化

## inference/BudgetFunctions.ts

- **Java对照**: `java-master/src/main/java/org/opennars/inference/BudgetFunctions.java`
- **规模 / TODO**: 约 336 行，TODO 0 处
- **依赖现状**: 依赖：entity/TruthValue.ts, entity/Sentence.ts, entity/TaskLink.ts, entity/Task.ts, control/DerivationContext.ts, entity/BudgetValue.ts ...
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：依赖：entity/TruthValue.ts, entity/Sentence.ts, entity/TaskLink.ts, entity/Task.ts, control/DerivationContext.ts, entity/BudgetValue.ts ...
  2. 文件工作：复制规则/真值/预算静态表并完善类型约束与数值校验。
  3. Java-TS 差异：参见《通用转译法.md》 - 推理规则

## inference/CompositionalRules.ts

- **Java对照**: `java-master/src/main/java/org/opennars/inference/CompositionalRules.java`
- **规模 / TODO**: 约 827 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：复制规则/真值/预算静态表并完善类型约束与数值校验。
  3. Java-TS 差异：参见《通用转译法.md》 - 推理规则

## inference/LocalRules.ts

- **Java对照**: `java-master/src/main/java/org/opennars/inference/LocalRules.java`
- **规模 / TODO**: 约 470 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：复制规则/真值/预算静态表并完善类型约束与数值校验。
  3. Java-TS 差异：参见《通用转译法.md》 - 推理规则

## inference/RuleTables.ts

- **Java对照**: `java-master/src/main/java/org/opennars/inference/RuleTables.java`
- **规模 / TODO**: 约 999 行，TODO 1 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 编译失败：TS1005 @ 621:23 ';' expected. ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：复制规则/真值/预算静态表并完善类型约束与数值校验。；tsc TS1005 @ 621:23 错误；TODO 1 处
  3. Java-TS 差异：参见《通用转译法.md》 - 推理规则

## inference/StructuralRules.ts

- **Java对照**: `java-master/src/main/java/org/opennars/inference/StructuralRules.java`
- **规模 / TODO**: 约 986 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：复制规则/真值/预算静态表并完善类型约束与数值校验。
  3. Java-TS 差异：参见《通用转译法.md》 - 推理规则

## inference/SyllogisticRules.ts

- **Java对照**: `java-master/src/main/java/org/opennars/inference/SyllogisticRules.java`
- **规模 / TODO**: 约 1000 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：复制规则/真值/预算静态表并完善类型约束与数值校验。
  3. Java-TS 差异：参见《通用转译法.md》 - 推理规则

## inference/TemporalRules.ts

- **Java对照**: `java-master/src/main/java/org/opennars/inference/TemporalRules.java`
- **规模 / TODO**: 约 340 行，TODO 2 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：复制规则/真值/预算静态表并完善类型约束与数值校验。；TODO 2 处
  3. Java-TS 差异：参见《通用转译法.md》 - 推理规则

## inference/TruthFunctions.ts

- **Java对照**: `java-master/src/main/java/org/opennars/inference/TruthFunctions.java`
- **规模 / TODO**: 约 626 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 编译失败：TS1005 @ 43:39 ';' expected. ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：复制规则/真值/预算静态表并完善类型约束与数值校验。；tsc TS1005 @ 43:39 错误
  3. Java-TS 差异：参见《通用转译法.md》 - 推理规则

## inference/UtilityFunctions.ts

- **Java对照**: `java-master/src/main/java/org/opennars/inference/UtilityFunctions.java`
- **规模 / TODO**: 约 93 行，TODO 0 处
- **依赖现状**: 依赖：main/Parameters.ts
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：依赖：main/Parameters.ts
  2. 文件工作：复制规则/真值/预算静态表并完善类型约束与数值校验。
  3. Java-TS 差异：参见《通用转译法.md》 - 推理规则

## interfaces/Eventable.ts

- **Java对照**: `java-master/src/main/java/org/opennars/interfaces/Eventable.java`
- **规模 / TODO**: 约 18 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：以 interface/abstract class 还原 Java 接口，在 TS 实现类中显式 implements。
  3. Java-TS 差异：参见《通用转译法.md》 - 接口规范

## interfaces/InputFileConsumer.ts

- **Java对照**: `java-master/src/main/java/org/opennars/interfaces/InputFileConsumer.java`
- **规模 / TODO**: 约 18 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：以 interface/abstract class 还原 Java 接口，在 TS 实现类中显式 implements。
  3. Java-TS 差异：参见《通用转译法.md》 - 接口规范

## interfaces/Multistepable.ts

- **Java对照**: `java-master/src/main/java/org/opennars/interfaces/Multistepable.java`
- **规模 / TODO**: 约 21 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：以 interface/abstract class 还原 Java 接口，在 TS 实现类中显式 implements。
  3. Java-TS 差异：参见《通用转译法.md》 - 接口规范

## interfaces/NarseseConsumer.ts

- **Java对照**: `java-master/src/main/java/org/opennars/interfaces/NarseseConsumer.java`
- **规模 / TODO**: 约 21 行，TODO 1 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：以 interface/abstract class 还原 Java 接口，在 TS 实现类中显式 implements。；TODO 1 处
  3. Java-TS 差异：参见《通用转译法.md》 - 接口规范

## interfaces/Pluggable.ts

- **Java对照**: `java-master/src/main/java/org/opennars/interfaces/Pluggable.java`
- **规模 / TODO**: 约 31 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：以 interface/abstract class 还原 Java 接口，在 TS 实现类中显式 implements。
  3. Java-TS 差异：参见《通用转译法.md》 - 接口规范

## interfaces/Resettable.ts

- **Java对照**: `java-master/src/main/java/org/opennars/interfaces/Resettable.java`
- **规模 / TODO**: 约 17 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：以 interface/abstract class 还原 Java 接口，在 TS 实现类中显式 implements。
  3. Java-TS 差异：参见《通用转译法.md》 - 接口规范

## interfaces/SensoryChannelConsumer.ts

- **Java对照**: `java-master/src/main/java/org/opennars/interfaces/SensoryChannelConsumer.java`
- **规模 / TODO**: 约 18 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：以 interface/abstract class 还原 Java 接口，在 TS 实现类中显式 implements。
  3. Java-TS 差异：参见《通用转译法.md》 - 接口规范

## interfaces/TaskConsumer.ts

- **Java对照**: `java-master/src/main/java/org/opennars/interfaces/TaskConsumer.java`
- **规模 / TODO**: 约 21 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：以 interface/abstract class 还原 Java 接口，在 TS 实现类中显式 implements。
  3. Java-TS 差异：参见《通用转译法.md》 - 接口规范

## interfaces/Timable.ts

- **Java对照**: `java-master/src/main/java/org/opennars/interfaces/Timable.java`
- **规模 / TODO**: 约 18 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：以 interface/abstract class 还原 Java 接口，在 TS 实现类中显式 implements。
  3. Java-TS 差异：参见《通用转译法.md》 - 接口规范

## interfaces/pub/Reasoner.ts

- **Java对照**: `java-master/src/main/java/org/opennars/interfaces/pub/Reasoner.java`
- **规模 / TODO**: 约 83 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：以 interface/abstract class 还原 Java 接口，在 TS 实现类中显式 implements。
  3. Java-TS 差异：参见《通用转译法.md》 - 接口规范

## io/ConfigReader.ts

- **Java对照**: `java-master/src/main/java/org/opennars/io/ConfigReader.java`
- **规模 / TODO**: 约 170 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：将 java.io 流与事件转接到 Node 流 + EventEmitter，补宏 Parser/Narsese/Events 链路。
  3. Java-TS 差异：参见《通用转译法.md》 - I/O 与事件

## io/Narsese.ts

- **Java对照**: `java-master/src/main/java/org/opennars/io/Narsese.java`
- **规模 / TODO**: 约 567 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：将 java.io 流与事件转接到 Node 流 + EventEmitter，补宏 Parser/Narsese/Events 链路。
  3. Java-TS 差异：参见《通用转译法.md》 - I/O 与事件

## io/Parser.ts

- **Java对照**: `java-master/src/main/java/org/opennars/io/Parser.java`
- **规模 / TODO**: 约 36 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：将 java.io 流与事件转接到 Node 流 + EventEmitter，补宏 Parser/Narsese/Events 链路。
  3. Java-TS 差异：参见《通用转译法.md》 - I/O 与事件

## io/Symbols.ts

- **Java对照**: `java-master/src/main/java/org/opennars/io/Symbols.java`
- **规模 / TODO**: 约 333 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：将 java.io 流与事件转接到 Node 流 + EventEmitter，补宏 Parser/Narsese/Events 链路。
  3. Java-TS 差异：参见《通用转译法.md》 - I/O 与事件

## io/Texts.ts

- **Java对照**: `java-master/src/main/java/org/opennars/io/Texts.java`
- **规模 / TODO**: 约 168 行，TODO 1 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：将 java.io 流与事件转接到 Node 流 + EventEmitter，补宏 Parser/Narsese/Events 链路。；TODO 1 处
  3. Java-TS 差异：参见《通用转译法.md》 - I/O 与事件

## io/events/AnswerHandler.ts

- **Java对照**: `java-master/src/main/java/org/opennars/io/events/AnswerHandler.java`
- **规模 / TODO**: 约 41 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：将 java.io 流与事件转接到 Node 流 + EventEmitter，补宏 Parser/Narsese/Events 链路。
  3. Java-TS 差异：参见《通用转译法.md》 - I/O 与事件

## io/events/EventEmitter.ts

- **Java对照**: `java-master/src/main/java/org/opennars/io/events/EventEmitter.java`
- **规模 / TODO**: 约 160 行，TODO 1 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 编译失败：TS1109 @ 113:30 Expression expected. ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：将 java.io 流与事件转接到 Node 流 + EventEmitter，补宏 Parser/Narsese/Events 链路。；tsc TS1109 @ 113:30 错误；TODO 1 处
  3. Java-TS 差异：参见《通用转译法.md》 - I/O 与事件

## io/events/EventHandler.ts

- **Java对照**: `java-master/src/main/java/org/opennars/io/events/EventHandler.java`
- **规模 / TODO**: 约 58 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：将 java.io 流与事件转接到 Node 流 + EventEmitter，补宏 Parser/Narsese/Events 链路。
  3. Java-TS 差异：参见《通用转译法.md》 - I/O 与事件

## io/events/Events.ts

- **Java对照**: `java-master/src/main/java/org/opennars/io/events/Events.java`
- **规模 / TODO**: 约 360 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 编译失败：TS1005 @ 357:38 '=' expected.，另有 2 条 ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：将 java.io 流与事件转接到 Node 流 + EventEmitter，补宏 Parser/Narsese/Events 链路。；tsc TS1005 @ 357:38 错误
  3. Java-TS 差异：参见《通用转译法.md》 - I/O 与事件

## io/events/OutputHandler.ts

- **Java对照**: `java-master/src/main/java/org/opennars/io/events/OutputHandler.java`
- **规模 / TODO**: 约 110 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：将 java.io 流与事件转接到 Node 流 + EventEmitter，补宏 Parser/Narsese/Events 链路。
  3. Java-TS 差异：参见《通用转译法.md》 - I/O 与事件

## io/events/TextOutputHandler.ts

- **Java对照**: `java-master/src/main/java/org/opennars/io/events/TextOutputHandler.java`
- **规模 / TODO**: 约 294 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：将 java.io 流与事件转接到 Node 流 + EventEmitter，补宏 Parser/Narsese/Events 链路。
  3. Java-TS 差异：参见《通用转译法.md》 - I/O 与事件

## language/AbstractTerm.ts

- **Java对照**: `java-master/src/main/java/org/opennars/language/AbstractTerm.java`
- **规模 / TODO**: 约 31 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。
  3. Java-TS 差异：参见《通用转译法.md》 - 语言层

## language/CompoundTerm.ts

- **Java对照**: `java-master/src/main/java/org/opennars/language/CompoundTerm.java`
- **规模 / TODO**: 约 818 行，TODO 4 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。；TODO 4 处
  3. Java-TS 差异：参见《通用转译法.md》 - 语言层

## language/Conjunction.ts

- **Java对照**: `java-master/src/main/java/org/opennars/language/Conjunction.java`
- **规模 / TODO**: 约 494 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。
  3. Java-TS 差异：参见《通用转译法.md》 - 语言层

## language/DifferenceExt.ts

- **Java对照**: `java-master/src/main/java/org/opennars/language/DifferenceExt.java`
- **规模 / TODO**: 约 138 行，TODO 1 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。；TODO 1 处
  3. Java-TS 差异：参见《通用转译法.md》 - 语言层

## language/DifferenceInt.ts

- **Java对照**: `java-master/src/main/java/org/opennars/language/DifferenceInt.java`
- **规模 / TODO**: 约 149 行，TODO 1 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。；TODO 1 处
  3. Java-TS 差异：参见《通用转译法.md》 - 语言层

## language/Disjunction.ts

- **Java对照**: `java-master/src/main/java/org/opennars/language/Disjunction.java`
- **规模 / TODO**: 约 149 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。
  3. Java-TS 差异：参见《通用转译法.md》 - 语言层

## language/Equivalence.ts

- **Java对照**: `java-master/src/main/java/org/opennars/language/Equivalence.java`
- **规模 / TODO**: 约 195 行，TODO 1 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。；TODO 1 处
  3. Java-TS 差异：参见《通用转译法.md》 - 语言层

## language/Image.ts

- **Java对照**: `java-master/src/main/java/org/opennars/language/Image.java`
- **规模 / TODO**: 约 104 行，TODO 1 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。；TODO 1 处
  3. Java-TS 差异：参见《通用转译法.md》 - 语言层

## language/ImageExt.ts

- **Java对照**: `java-master/src/main/java/org/opennars/language/ImageExt.java`
- **规模 / TODO**: 约 180 行，TODO 1 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。；TODO 1 处
  3. Java-TS 差异：参见《通用转译法.md》 - 语言层

## language/ImageInt.ts

- **Java对照**: `java-master/src/main/java/org/opennars/language/ImageInt.java`
- **规模 / TODO**: 约 200 行，TODO 1 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。；TODO 1 处
  3. Java-TS 差异：参见《通用转译法.md》 - 语言层

## language/Implication.ts

- **Java对照**: `java-master/src/main/java/org/opennars/language/Implication.java`
- **规模 / TODO**: 约 242 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。
  3. Java-TS 差异：参见《通用转译法.md》 - 语言层

## language/Inheritance.ts

- **Java对照**: `java-master/src/main/java/org/opennars/language/Inheritance.java`
- **规模 / TODO**: 约 143 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。
  3. Java-TS 差异：参见《通用转译法.md》 - 语言层

## language/Instance.ts

- **Java对照**: `java-master/src/main/java/org/opennars/language/Instance.java`
- **规模 / TODO**: 约 28 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。
  3. Java-TS 差异：参见《通用转译法.md》 - 语言层

## language/InstanceProperty.ts

- **Java对照**: `java-master/src/main/java/org/opennars/language/InstanceProperty.java`
- **规模 / TODO**: 约 28 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。
  3. Java-TS 差异：参见《通用转译法.md》 - 语言层

## language/IntersectionExt.ts

- **Java对照**: `java-master/src/main/java/org/opennars/language/IntersectionExt.java`
- **规模 / TODO**: 约 168 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。
  3. Java-TS 差异：参见《通用转译法.md》 - 语言层

## language/IntersectionInt.ts

- **Java对照**: `java-master/src/main/java/org/opennars/language/IntersectionInt.java`
- **规模 / TODO**: 约 168 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。
  3. Java-TS 差异：参见《通用转译法.md》 - 语言层

## language/Interval.ts

- **Java对照**: `java-master/src/main/java/org/opennars/language/Interval.java`
- **规模 / TODO**: 约 72 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。
  3. Java-TS 差异：参见《通用转译法.md》 - 语言层

## language/Negation.ts

- **Java对照**: `java-master/src/main/java/org/opennars/language/Negation.java`
- **规模 / TODO**: 约 132 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。
  3. Java-TS 差异：参见《通用转译法.md》 - 语言层

## language/Product.ts

- **Java对照**: `java-master/src/main/java/org/opennars/language/Product.java`
- **规模 / TODO**: 约 143 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。
  3. Java-TS 差异：参见《通用转译法.md》 - 语言层

## language/Property.ts

- **Java对照**: `java-master/src/main/java/org/opennars/language/Property.java`
- **规模 / TODO**: 约 27 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。
  3. Java-TS 差异：参见《通用转译法.md》 - 语言层

## language/SetExt.ts

- **Java对照**: `java-master/src/main/java/org/opennars/language/SetExt.java`
- **规模 / TODO**: 约 113 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。
  3. Java-TS 差异：参见《通用转译法.md》 - 语言层

## language/SetInt.ts

- **Java对照**: `java-master/src/main/java/org/opennars/language/SetInt.java`
- **规模 / TODO**: 约 114 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。
  3. Java-TS 差异：参见《通用转译法.md》 - 语言层

## language/SetTensional.ts

- **Java对照**: `java-master/src/main/java/org/opennars/language/SetTensional.java`
- **规模 / TODO**: 约 64 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。
  3. Java-TS 差异：参见《通用转译法.md》 - 语言层

## language/Similarity.ts

- **Java对照**: `java-master/src/main/java/org/opennars/language/Similarity.java`
- **规模 / TODO**: 约 138 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。
  3. Java-TS 差异：参见《通用转译法.md》 - 语言层

## language/Statement.ts

- **Java对照**: `java-master/src/main/java/org/opennars/language/Statement.java`
- **规模 / TODO**: 约 377 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 编译失败：TS1005 @ 365:27 ';' expected. ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。；tsc TS1005 @ 365:27 错误
  3. Java-TS 差异：参见《通用转译法.md》 - 语言层

## language/Tense.ts

- **Java对照**: `java-master/src/main/java/org/opennars/language/Tense.java`
- **规模 / TODO**: 约 37 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。
  3. Java-TS 差异：参见《通用转译法.md》 - 语言层

## language/Term.ts

- **Java对照**: `java-master/src/main/java/org/opennars/language/Term.java`
- **规模 / TODO**: 约 536 行，TODO 1 处
- **依赖现状**: 依赖：language/SetExt.ts
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：依赖：language/SetExt.ts
  2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。；TODO 1 处
  3. Java-TS 差异：参见《通用转译法.md》 - 语言层

## language/Terms.ts

- **Java对照**: `java-master/src/main/java/org/opennars/language/Terms.java`
- **规模 / TODO**: 约 615 行，TODO 1 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。；TODO 1 处
  3. Java-TS 差异：参见《通用转译法.md》 - 语言层

## language/Variable.ts

- **Java对照**: `java-master/src/main/java/org/opennars/language/Variable.java`
- **规模 / TODO**: 约 327 行，TODO 1 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。；TODO 1 处
  3. Java-TS 差异：参见《通用转译法.md》 - 语言层

## language/Variables.ts

- **Java对照**: `java-master/src/main/java/org/opennars/language/Variables.java`
- **规模 / TODO**: 约 540 行，TODO 1 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。；TODO 1 处
  3. Java-TS 差异：参见《通用转译法.md》 - 语言层

## main/Debug.ts

- **Java对照**: `java-master/src/main/java/org/opennars/parameter/Debug.java`
- **规模 / TODO**: 约 69 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：把 Nar/NarNode/Shell 生命周期、线程和 CLI 搭到 Node 异步控制器上。
  3. Java-TS 差异：参见《通用转译法.md》 - 主程序

## main/Nar.ts

- **Java对照**: `java-master/src/main/java/org/opennars/main/Nar.java`
- **规模 / TODO**: 约 886 行，TODO 2 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：把 Nar/NarNode/Shell 生命周期、线程和 CLI 搭到 Node 异步控制器上。；TODO 2 处
  3. Java-TS 差异：参见《通用转译法.md》 - 主程序

## main/NarNode.ts

- **Java对照**: `java-master/src/main/java/org/opennars/main/NarNode.java`
- **规模 / TODO**: 约 337 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 编译失败：TS1472 @ 316:13 'catch' or 'finally' expected. ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：把 Nar/NarNode/Shell 生命周期、线程和 CLI 搭到 Node 异步控制器上。；tsc TS1472 @ 316:13 错误
  3. Java-TS 差异：参见《通用转译法.md》 - 主程序

## main/Parameters.ts

- **Java对照**: `java-master/src/main/java/org/opennars/parameter/Parameters.java`
- **规模 / TODO**: 约 301 行，TODO 1 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：把 Nar/NarNode/Shell 生命周期、线程和 CLI 搭到 Node 异步控制器上。；TODO 1 处
  3. Java-TS 差异：参见《通用转译法.md》 - 主程序

## main/Shell.ts

- **Java对照**: `java-master/src/main/java/org/opennars/main/Shell.java`
- **规模 / TODO**: 约 195 行，TODO 1 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 编译失败：TS1359 @ 107:35 Identifier expected. 'in' is a reserved word that cannot be used here.，另有 2 条 ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：把 Nar/NarNode/Shell 生命周期、线程和 CLI 搭到 Node 异步控制器上。；tsc TS1359 @ 107:35 错误；TODO 1 处
  3. Java-TS 差异：参见《通用转译法.md》 - 主程序

## operator/FunctionOperator.ts

- **Java对照**: `java-master/src/main/java/org/opennars/operator/FunctionOperator.java`
- **规模 / TODO**: 约 109 行，TODO 2 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：将 Operation 注册与 Memory 交互显式化，补写副作用与预算更新。；TODO 2 处
  3. Java-TS 差异：参见《通用转译法.md》 - 操作符

## operator/ImaginationSpace.ts

- **Java对照**: `java-master/src/main/java/org/opennars/operator/ImaginationSpace.java`
- **规模 / TODO**: 约 31 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：将 Operation 注册与 Memory 交互显式化，补写副作用与预算更新。
  3. Java-TS 差异：参见《通用转译法.md》 - 操作符

## operator/NullOperator.ts

- **Java对照**: `java-master/src/main/java/org/opennars/operator/NullOperator.java`
- **规模 / TODO**: 约 49 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：将 Operation 注册与 Memory 交互显式化，补写副作用与预算更新。
  3. Java-TS 差异：参见《通用转译法.md》 - 操作符

## operator/Operation.ts

- **Java对照**: `java-master/src/main/java/org/opennars/operator/Operation.java`
- **规模 / TODO**: 约 107 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：将 Operation 注册与 Memory 交互显式化，补写副作用与预算更新。
  3. Java-TS 差异：参见《通用转译法.md》 - 操作符

## operator/Operator.ts

- **Java对照**: `java-master/src/main/java/org/opennars/operator/Operator.java`
- **规模 / TODO**: 约 222 行，TODO 0 处
- **依赖现状**: 依赖：language/Term.ts, operator/Operation.ts, storage/Memory.ts, interfaces/Timable.ts, entity/Task.ts, main/Nar.ts
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：依赖：language/Term.ts, operator/Operation.ts, storage/Memory.ts, interfaces/Timable.ts, entity/Task.ts, main/Nar.ts
  2. 文件工作：将 Operation 注册与 Memory 交互显式化，补写副作用与预算更新。
  3. Java-TS 差异：参见《通用转译法.md》 - 操作符

## operator/mental/Anticipate.ts

- **Java对照**: `java-master/src/main/java/org/opennars/operator/mental/Anticipate.java`
- **规模 / TODO**: 约 299 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：将 Operation 注册与 Memory 交互显式化，补写副作用与预算更新。
  3. Java-TS 差异：参见《通用转译法.md》 - 操作符

## operator/mental/Believe.ts

- **Java对照**: `java-master/src/main/java/org/opennars/operator/mental/Believe.java`
- **规模 / TODO**: 约 48 行，TODO 0 处
- **依赖现状**: 依赖：operator/Operator.ts, operator/Operation.ts, entity/Task.ts, storage/Memory.ts, interfaces/Timable.ts
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：依赖：operator/Operator.ts, operator/Operation.ts, entity/Task.ts, storage/Memory.ts, interfaces/Timable.ts
  2. 文件工作：将 Operation 注册与 Memory 交互显式化，补写副作用与预算更新。
  3. Java-TS 差异：参见《通用转译法.md》 - 操作符

## operator/mental/Consider.ts

- **Java对照**: `java-master/src/main/java/org/opennars/operator/mental/Consider.java`
- **规模 / TODO**: 约 38 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：将 Operation 注册与 Memory 交互显式化，补写副作用与预算更新。
  3. Java-TS 差异：参见《通用转译法.md》 - 操作符

## operator/mental/Doubt.ts

- **Java对照**: `java-master/src/main/java/org/opennars/operator/mental/Doubt.java`
- **规模 / TODO**: 约 29 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：将 Operation 注册与 Memory 交互显式化，补写副作用与预算更新。
  3. Java-TS 差异：参见《通用转译法.md》 - 操作符

## operator/mental/Evaluate.ts

- **Java对照**: `java-master/src/main/java/org/opennars/operator/mental/Evaluate.java`
- **规模 / TODO**: 约 37 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：将 Operation 注册与 Memory 交互显式化，补写副作用与预算更新。
  3. Java-TS 差异：参见《通用转译法.md》 - 操作符

## operator/mental/Feel.ts

- **Java对照**: `java-master/src/main/java/org/opennars/operator/mental/Feel.java`
- **规模 / TODO**: 约 49 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：将 Operation 注册与 Memory 交互显式化，补写副作用与预算更新。
  3. Java-TS 差异：参见《通用转译法.md》 - 操作符

## operator/mental/FeelBusy.ts

- **Java对照**: `java-master/src/main/java/org/opennars/operator/mental/FeelBusy.java`
- **规模 / TODO**: 约 28 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：将 Operation 注册与 Memory 交互显式化，补写副作用与预算更新。
  3. Java-TS 差异：参见《通用转译法.md》 - 操作符

## operator/mental/FeelSatisfied.ts

- **Java对照**: `java-master/src/main/java/org/opennars/operator/mental/FeelSatisfied.java`
- **规模 / TODO**: 约 28 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：将 Operation 注册与 Memory 交互显式化，补写副作用与预算更新。
  3. Java-TS 差异：参见《通用转译法.md》 - 操作符

## operator/mental/Hesitate.ts

- **Java对照**: `java-master/src/main/java/org/opennars/operator/mental/Hesitate.java`
- **规模 / TODO**: 约 29 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：将 Operation 注册与 Memory 交互显式化，补写副作用与预算更新。
  3. Java-TS 差异：参见《通用转译法.md》 - 操作符

## operator/mental/Name.ts

- **Java对照**: `java-master/src/main/java/org/opennars/operator/mental/Name.java`
- **规模 / TODO**: 约 40 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：将 Operation 注册与 Memory 交互显式化，补写副作用与预算更新。
  3. Java-TS 差异：参见《通用转译法.md》 - 操作符

## operator/mental/Register.ts

- **Java对照**: `java-master/src/main/java/org/opennars/operator/mental/Register.java`
- **规模 / TODO**: 约 28 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：将 Operation 注册与 Memory 交互显式化，补写副作用与预算更新。
  3. Java-TS 差异：参见《通用转译法.md》 - 操作符

## operator/mental/Remind.ts

- **Java对照**: `java-master/src/main/java/org/opennars/operator/mental/Remind.java`
- **规模 / TODO**: 约 37 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：将 Operation 注册与 Memory 交互显式化，补写副作用与预算更新。
  3. Java-TS 差异：参见《通用转译法.md》 - 操作符

## operator/mental/Want.ts

- **Java对照**: `java-master/src/main/java/org/opennars/operator/mental/Want.java`
- **规模 / TODO**: 约 41 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：将 Operation 注册与 Memory 交互显式化，补写副作用与预算更新。
  3. Java-TS 差异：参见《通用转译法.md》 - 操作符

## operator/mental/Wonder.ts

- **Java对照**: `java-master/src/main/java/org/opennars/operator/mental/Wonder.java`
- **规模 / TODO**: 约 38 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：将 Operation 注册与 Memory 交互显式化，补写副作用与预算更新。
  3. Java-TS 差异：参见《通用转译法.md》 - 操作符

## operator/misc/Add.ts

- **Java对照**: `java-master/src/main/java/org/opennars/operator/misc/Add.java`
- **规模 / TODO**: 约 41 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：将 Operation 注册与 Memory 交互显式化，补写副作用与预算更新。
  3. Java-TS 差异：参见《通用转译法.md》 - 操作符

## operator/misc/Count.ts

- **Java对照**: `java-master/src/main/java/org/opennars/operator/misc/Count.java`
- **规模 / TODO**: 约 47 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：将 Operation 注册与 Memory 交互显式化，补写副作用与预算更新。
  3. Java-TS 差异：参见《通用转译法.md》 - 操作符

## operator/misc/Reflect.ts

- **Java对照**: `java-master/src/main/java/org/opennars/operator/misc/Reflect.java`
- **规模 / TODO**: 约 121 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：将 Operation 注册与 Memory 交互显式化，补写副作用与预算更新。
  3. Java-TS 差异：参见《通用转译法.md》 - 操作符

## operator/misc/System.ts

- **Java对照**: `java-master/src/main/java/org/opennars/operator/misc/System.java`
- **规模 / TODO**: 约 48 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：将 Operation 注册与 Memory 交互显式化，补写副作用与预算更新。
  3. Java-TS 差异：参见《通用转译法.md》 - 操作符

## plugin/Plugin.ts

- **Java对照**: `java-master/src/main/java/org/opennars/plugin/Plugin.java`
- **规模 / TODO**: 约 21 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：为心理/感知插件提供事件通道、状态缓存与关闭流程。
  3. Java-TS 差异：参见《通用转译法.md》 - 插件

## plugin/mental/Abbreviation.ts

- **Java对照**: `java-master/src/main/java/org/opennars/plugin/mental/Abbreviation.java`
- **规模 / TODO**: 约 184 行，TODO 1 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：为心理/感知插件提供事件通道、状态缓存与关闭流程。；TODO 1 处
  3. Java-TS 差异：参见《通用转译法.md》 - 插件

## plugin/mental/ComplexEmotions.ts

- **Java对照**: `java-master/src/main/java/org/opennars/plugin/mental/ComplexEmotions.java`
- **规模 / TODO**: 约 59 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：为心理/感知插件提供事件通道、状态缓存与关闭流程。
  3. Java-TS 差异：参见《通用转译法.md》 - 插件

## plugin/mental/Counting.ts

- **Java对照**: `java-master/src/main/java/org/opennars/plugin/mental/Counting.java`
- **规模 / TODO**: 约 117 行，TODO 1 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：为心理/感知插件提供事件通道、状态缓存与关闭流程。；TODO 1 处
  3. Java-TS 差异：参见《通用转译法.md》 - 插件

## plugin/mental/Emotions.ts

- **Java对照**: `java-master/src/main/java/org/opennars/plugin/mental/Emotions.java`
- **规模 / TODO**: 约 264 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：为心理/感知插件提供事件通道、状态缓存与关闭流程。
  3. Java-TS 差异：参见《通用转译法.md》 - 插件

## plugin/mental/InternalExperience.ts

- **Java对照**: `java-master/src/main/java/org/opennars/plugin/mental/InternalExperience.java`
- **规模 / TODO**: 约 408 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：为心理/感知插件提供事件通道、状态缓存与关闭流程。
  3. Java-TS 差异：参见《通用转译法.md》 - 插件

## plugin/perception/SensoryChannel.ts

- **Java对照**: `java-master/src/main/java/org/opennars/plugin/perception/SensoryChannel.java`
- **规模 / TODO**: 约 147 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 编译失败：TS1135 @ 144:31 Argument expression expected.，另有 1 条 ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：为心理/感知插件提供事件通道、状态缓存与关闭流程。；tsc TS1135 @ 144:31 错误
  3. Java-TS 差异：参见《通用转译法.md》 - 插件

## plugin/perception/VisionChannel.ts

- **Java对照**: `java-master/src/main/java/org/opennars/plugin/perception/VisionChannel.java`
- **规模 / TODO**: 约 291 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：为心理/感知插件提供事件通道、状态缓存与关闭流程。
  3. Java-TS 差异：参见《通用转译法.md》 - 插件

## plugin/perception/VisualSpace.ts

- **Java对照**: `java-master/src/main/java/org/opennars/plugin/perception/VisualSpace.java`
- **规模 / TODO**: 约 137 行，TODO 4 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：为心理/感知插件提供事件通道、状态缓存与关闭流程。；TODO 4 处
  3. Java-TS 差异：参见《通用转译法.md》 - 插件

## storage/Bag.ts

- **Java对照**: `java-master/src/main/java/org/opennars/storage/Bag.java`
- **规模 / TODO**: 约 356 行，TODO 2 处
- **依赖现状**: 依赖：entity/Item.ts, storage/Distributor.ts, main/Parameters.ts
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：依赖：entity/Item.ts, storage/Distributor.ts, main/Parameters.ts
  2. 文件工作：验证 Bag/Memory/Distributor 的容量、顺序与线程安全，补完断言和测试。；TODO 2 处
  3. Java-TS 差异：参见《通用转译法.md》 - 存储结构

## storage/Distributor.ts

- **Java对照**: `java-master/src/main/java/org/opennars/storage/Distributor.java`
- **规模 / TODO**: 约 61 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 已被 `npm test` 覆盖：test/node/distributor.test.ts
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：验证 Bag/Memory/Distributor 的容量、顺序与线程安全，补完断言和测试。
  3. Java-TS 差异：参见《通用转译法.md》 - 存储结构

## storage/Memory.ts

- **Java对照**: `java-master/src/main/java/org/opennars/storage/Memory.java`
- **规模 / TODO**: 约 401 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：验证 Bag/Memory/Distributor 的容量、顺序与线程安全，补完断言和测试。
  3. Java-TS 差异：参见《通用转译法.md》 - 存储结构

## util/ListUtil.ts

- **Java对照**: `java-master/src/main/java/org/opennars/util/ListUtil.java`
- **规模 / TODO**: 约 25 行，TODO 0 处
- **依赖现状**: 仅依赖 jree 或 TS 自身静态成员
- **编译 / 测试**: 已通过 `npx tsc --noEmit` ; 暂无针对性测试
- **路线图**:
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：整合 java.util 工具并保持 int/long 行为一致，中心存放工具函数。
  3. Java-TS 差异：参见《通用转译法.md》 - 工具层

