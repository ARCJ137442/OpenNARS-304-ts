# OpenNARS-304-ts

OpenNARS 3.0.4的TypeScript翻译版（开发中🚧）

## 概况

🔗来源：<https://github.com/ARCJ137442/opennars-304>
🛠️工具：<https://github.com/mike-lischke/java2typescript>

❗Java→TypeScript的主要困难

1. 空安全性
2. 函数重载
3. 内部类
4. `final`
5. ...

## 转写方法与流程

- 入口文档：`AGENTS.md`（全局规范）、`通用转写方法1.1.md`（通用转写步骤/测试/依赖剥离）、`specs/*`（模块规格）、`reports/*`（过程与结论记录）。
- 标准流程：先 `lean-spec board/search` 做上下文发现 → 基于 spec 盘点公开面与依赖 → 先定测试计划再动代码 → 依赖剥离与纯 TS 设计 → 最小测试/可选 tsc → 更新 spec 状态与报告并提交。
- 可读性原则：每一步都写清“来源（扫描/调用点）—边界（拆分/依赖）—验证（测试/检查）”，让人类与 AI 都能复现决策路径。

### 当前战略基线

旧的逐文件转写计划已不足以指导主线推进。当前以[新战略基线与工作流](docs/strategic-baseline.md)为项目导航：优先恢复可重复工具链，打通最小 NARS 垂直切片，再逐层扩展到完整推理与 NAL 差分验证。

## 目录 & 进度（历史文件清单）

以下复选框保留用于回溯早期逐文件转写进度，不再作为当前排期或完成标准。当前阶段、门禁和路线以[新战略基线与工作流](docs/strategic-baseline.md)为准。

- [ ] control
  - [ ] concept
    - [ ] ProcessAnticipation
    - [ ] ProcessGoal
    - [ ] ProcessJudgment
    - [ ] ProcessQuestion
    - [ ] ProcessTask
  - [ ] DerivationContext
  - [ ] GeneralInferenceControl
  - [ ] TemporalInferenceControl
- [ ] entity
  - [ ] BudgetValue
  - [ ] Concept
  - [ ] Item
  - [ ] Sentence
  - [ ] Stamp
  - [ ] Task
  - [ ] TaskLink
  - [ ] TermLink
  - [ ] TLink
  - [x] TruthValue
- [ ] inference
  - [ ] BudgetFunctions
  - [ ] CompositionalRules
  - [ ] LocalRules
  - [ ] RuleTables
  - [ ] StructuralRules
  - [ ] SyllogisticRules
  - [ ] TemporalRules
  - [ ] TruthFunctions
  - [ ] UtilityFunctions
- [ ] interfaces
  - [ ] pub
    - [ ] Reasoner
  - [ ] Eventable
  - [ ] InputFileConsumer
  - [ ] Multistepable
  - [ ] NarseseConsumer
  - [ ] Pluggable
  - [ ] Resettable
  - [ ] SensoryChannelConsumer
  - [ ] TaskConsumer
  - [ ] Timable
- [ ] io
  - [ ] events
    - [ ] AnswerHandler
    - [ ] EventEmitter
    - [ ] EventHandler
    - [ ] Events
    - [ ] OutputHandler
    - [ ] TextOutputHandler
  - [ ] ConfigReader
  - [ ] Narsese
  - [ ] Parser
  - [ ] Symbols
  - [x] Texts
- [ ] language
  - [ ] AbstractTerm
  - [ ] CompoundTerm
  - [ ] Conjunction
  - [ ] DifferenceExt
  - [ ] DifferenceInt
  - [ ] Disjunction
  - [ ] Equivalence
  - [ ] Image
  - [ ] ImageExt
  - [ ] ImageInt
  - [ ] Implication
  - [ ] Inheritance
  - [ ] Instance
  - [ ] InstanceProperty
  - [ ] IntersectionExt
  - [ ] IntersectionInt
  - [ ] Interval
  - [ ] Negation
  - [ ] Product
  - [ ] Property
  - [ ] SetExt
  - [ ] SetInt
  - [ ] SetTensional
  - [ ] Similarity
  - [ ] Statement
  - [ ] Tense
  - [ ] Term
  - [ ] Terms
  - [ ] Variable
  - [ ] Variables
- [ ] main
  - [ ] Debug
  - [ ] Nar
  - [ ] NarNode
  - [ ] Parameters
  - [ ] Shell
- [ ] operator
  - [ ] mental
    - [ ] Anticipate
    - [ ] Believe
    - [ ] Consider
    - [ ] Doubt
    - [ ] Evaluate
    - [ ] Feel
    - [ ] FeelBusy
    - [ ] FeelSatisfied
    - [ ] Hesitate
    - [ ] Name
    - [ ] Register
    - [ ] Remind
    - [ ] Want
    - [ ] Wonder
  - [ ] misc
    - [ ] Add
    - [ ] Count
    - [ ] Reflect
    - [ ] System
  - [ ] FunctionOperator
  - [ ] ImaginationSpace
  - [ ] NullOperator
  - [ ] Operation
  - [ ] Operator
- [ ] plugin
  - [ ] mental
    - [ ] Abbreviation
    - [ ] ComplexEmotions
    - [ ] Counting
    - [ ] Emotions
    - [ ] InternalExperience
  - [ ] perception
    - [ ] SensoryChannel
    - [ ] VisionChannel
    - [ ] VisualSpace
  - [ ] Plugin
- [ ] storage
  - [ ] Bag
  - [x] Distributor
  - [ ] Memory
- [ ] util
  - [ ] ListUtil

### 最近转写完成

- Texts（2026-01-12）
- TruthValue（2026-01-11）

## 文件分析进展（基于 `full_check.txt`）

- 数据来源：`specs/003-dependency-analyze-brief-plan/tsc_checks/full_check.txt`（`npx tsc --noEmit` 在当前 `src` 上的完整输出），共命中 109/119 个 TypeScript 文件。
- 现阶段所有顶层模块都存在阻塞型依赖，仅 `storage/Distributor.ts` 一个文件在 `tsc` 结果中未出现报错，其余模块至少有一半文件待补充依赖或语义对齐。

| 模块 | 出错文件 / 总数 | 报错条数 | 说明 |
| --- | --- | --- | --- |
| control | 8 / 8 | 586 | `DerivationContext` 与 `Process*` 系列完整依赖 `entity` / `language` 层，当前全部无法解析外部符号。 |
| entity | 9 / 10 | 513 | 核心结构（`Concept`、`Sentence`、`Stamp` 等）均缺少互相引用的类型，仅 `TLink.ts` 未触发报错。 |
| inference | 8 / 9 | 2100 | `CompositionalRules`、`RuleTables`、`StructuralRules`、`SyllogisticRules` 单文件即累计 350+ 报错，揭示推理规则链尚未建立。 |
| interfaces | 5 / 10 | 19 | `Reasoner` 及部分接口（`Eventable`、`TaskConsumer` 等）仍引用缺失的事件 / Narsese 类型。 |
| io | 11 / 11 | 463 | `Narsese`、`Symbols`、`events/*` 均依赖 `language` 与插件层，导致 I/O 层整体无法通过检查。 |
| language | 30 / 30 | 1543 | 语言层所有基础类型待补齐，`Terms.ts`、`Variables.ts`、`Statement.ts` 报错尤多。 |
| main | 3 / 5 | 317 | `Nar.ts`、`NarNode.ts`、`Shell.ts` 依赖尚未接通，使主循环无法构建。 |
| operator | 23 / 23 | 472 | mental / misc 操作器全部依赖 `Task`、`Concept`、`BudgetValue` 等核心结构。 |
| plugin | 9 / 9 | 468 | 感知与情绪插件 (`VisionChannel.ts`、`InternalExperience.ts` 等) 全面受制于 `io` 和 `entity`。 |
| storage | 2 / 3 | 148 | `Bag.ts`、`Memory.ts` 仍等待 `Task`/`Concept` 定义，`Distributor.ts` 暂为唯一未报错文件。 |
| util | 1 / 1 | 2 | `ListUtil.ts` 只剩两处泛型签名问题，属低优先级但可快速收敛。 |

### 优先排查文件（报错条数 Top 5）

- `src/inference/CompositionalRules.ts`：435 条，覆盖绝大多数结论生成规则。
- `src/inference/RuleTables.ts`：400 条，需先补齐语言层与推理上下文。
- `src/inference/StructuralRules.ts`：391 条，当前所有结构性推导均被阻塞。
- `src/inference/SyllogisticRules.ts`：392 条，暴露出 `Term`、`Statement` 未就绪。
- `src/language/Terms.ts`：252 条，说明语言层基础 API 仍未连通 `CompoundTerm` / `Variable`。
