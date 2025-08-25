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

## 目录 & 进度

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
  - [ ] TruthValue
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
  - [ ] Texts
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
