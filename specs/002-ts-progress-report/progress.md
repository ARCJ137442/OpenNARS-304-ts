# TypeScript File Progress Overview

- 119 files tracked under `src`, containing 43 TODO markers.
- `npx tsc --noEmit` currently fails on 10 source files plus `test/metrics/AttentionMetric.ts`; see per-file status below.
- `npm test` only exercises `test/node/distributor.test.ts` and passes, covering `storage/Distributor.ts`.

Each subsection lists the Java counterpart, build/test status, dependencies, and the translation roadmap.

## control/DerivationContext.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/control/DerivationContext.java`

- **Size / TODO**: 610 LOC, TODO 0
- **Declared types**: class DerivationContext extends JavaObject
- **Imports / deps**: implicit: JavaObject
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: JavaObject -> focus Stabilize inference scheduling loops and replace synchronized/wait logic with async control. -> differences see 通用转译法.md / Control & Scheduling

## control/GeneralInferenceControl.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/control/GeneralInferenceControl.java`

- **Size / TODO**: 115 LOC, TODO 0
- **Declared types**: class GeneralInferenceControl extends JavaObject
- **Imports / deps**: implicit: JavaObject
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: JavaObject -> focus Stabilize inference scheduling loops and replace synchronized/wait logic with async control. -> differences see 通用转译法.md / Control & Scheduling

## control/TemporalInferenceControl.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/control/TemporalInferenceControl.java`

- **Size / TODO**: 235 LOC, TODO 1
- **Declared types**: class TemporalInferenceControl extends JavaObject
- **Imports / deps**: implicit: JavaObject
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: JavaObject -> focus Stabilize inference scheduling loops and replace synchronized/wait logic with async control. -> differences see 通用转译法.md / Control & Scheduling

## control/concept/ProcessAnticipation.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/control/concept/ProcessAnticipation.java`

- **Size / TODO**: 264 LOC, TODO 0
- **Declared types**: class ProcessAnticipation extends JavaObject
- **Imports / deps**: implicit: JavaObject
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: JavaObject -> focus Stabilize inference scheduling loops and replace synchronized/wait logic with async control. -> differences see 通用转译法.md / Control & Scheduling

## control/concept/ProcessGoal.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/control/concept/ProcessGoal.java`

- **Size / TODO**: 492 LOC, TODO 0
- **Declared types**: class ProcessGoal extends JavaObject
- **Imports / deps**: implicit: JavaObject
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: JavaObject -> focus Stabilize inference scheduling loops and replace synchronized/wait logic with async control. -> differences see 通用转译法.md / Control & Scheduling

## control/concept/ProcessJudgment.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/control/concept/ProcessJudgment.java`

- **Size / TODO**: 181 LOC, TODO 0
- **Declared types**: class ProcessJudgment extends JavaObject
- **Imports / deps**: implicit: JavaObject
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: JavaObject -> focus Stabilize inference scheduling loops and replace synchronized/wait logic with async control. -> differences see 通用转译法.md / Control & Scheduling

## control/concept/ProcessQuestion.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/control/concept/ProcessQuestion.java`

- **Size / TODO**: 143 LOC, TODO 0
- **Declared types**: class ProcessQuestion extends JavaObject
- **Imports / deps**: implicit: JavaObject
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: JavaObject -> focus Stabilize inference scheduling loops and replace synchronized/wait logic with async control. -> differences see 通用转译法.md / Control & Scheduling

## control/concept/ProcessTask.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/control/concept/ProcessTask.java`

- **Size / TODO**: 62 LOC, TODO 0
- **Declared types**: class ProcessTask extends JavaObject
- **Imports / deps**: implicit: JavaObject
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: JavaObject -> focus Stabilize inference scheduling loops and replace synchronized/wait logic with async control. -> differences see 通用转译法.md / Control & Scheduling

## entity/BudgetValue.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/entity/BudgetValue.java`

- **Size / TODO**: 353 LOC, TODO 1
- **Declared types**: class BudgetValue implements JavaObject, java.lang.Cloneable<BudgetValue>, java.io.Serializable
- **Imports / deps**: io/Symbols.ts(ready), inference/UtilityFunctions.ts(ready), inference/BudgetFunctions.ts(ready), main/Parameters.ts(ready), entity/TruthValue.ts(ready)
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites io/Symbols.ts(ready), inference/UtilityFunctions.ts(ready), inference/BudgetFunctions.ts(ready), main/Parameters.ts(ready), entity/TruthValue.ts(ready) -> focus Preserve clone/equality/serialization semantics for value objects such as Stamp or TruthValue. -> differences see 通用转译法.md / Entity & Serialization

## entity/Concept.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/entity/Concept.java`

- **Size / TODO**: 620 LOC, TODO 2
- **Declared types**: class Concept extends Item<Term>
- **Imports / deps**: entity/Item.ts(ready), language/Term.ts(ready), entity/Sentence.ts(ready), entity/Task.ts(ready), storage/Bag.ts(ready), entity/TaskLink.ts(ready)
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites entity/Item.ts(ready), language/Term.ts(ready), entity/Sentence.ts(ready), entity/Task.ts(ready), storage/Bag.ts(ready), entity/TaskLink.ts(ready) -> focus Preserve clone/equality/serialization semantics for value objects such as Stamp or TruthValue. -> differences see 通用转译法.md / Entity & Serialization

## entity/Item.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/entity/Item.java`

- **Size / TODO**: 285 LOC, TODO 0
- **Declared types**: (helpers only)
- **Imports / deps**: entity/BudgetValue.ts(ready)
- **External deps**: jree
- **Build / tests**: tsc fail: TS1005 @ 281:36 '=' expected. (+2 more); no dedicated test
- **Roadmap**: prerequisites entity/BudgetValue.ts(ready) -> focus Preserve clone/equality/serialization semantics for value objects such as Stamp or TruthValue. -> differences see 通用转译法.md / Entity & Serialization

## entity/Sentence.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/entity/Sentence.java`

- **Size / TODO**: 643 LOC, TODO 2
- **Declared types**: class Sentence extends JavaObject implements java.lang.Cloneable, java.io.Serializable
- **Imports / deps**: implicit: JavaObject
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: JavaObject -> focus Preserve clone/equality/serialization semantics for value objects such as Stamp or TruthValue. -> differences see 通用转译法.md / Entity & Serialization

## entity/Stamp.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/entity/Stamp.java`

- **Size / TODO**: 606 LOC, TODO 2
- **Declared types**: class Stamp extends JavaObject implements java.lang.Cloneable, java.io.Serializable
- **Imports / deps**: implicit: JavaObject
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: JavaObject -> focus Preserve clone/equality/serialization semantics for value objects such as Stamp or TruthValue. -> differences see 通用转译法.md / Entity & Serialization

## entity/TLink.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/entity/TLink.java`

- **Size / TODO**: 18 LOC, TODO 0
- **Declared types**: (helpers only)
- **Imports / deps**: (none)
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites (none) -> focus Preserve clone/equality/serialization semantics for value objects such as Stamp or TruthValue. -> differences see 通用转译法.md / Entity & Serialization

## entity/Task.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/entity/Task.java`

- **Size / TODO**: 232 LOC, TODO 0
- **Declared types**: class Task extends Item<Sentence>
- **Imports / deps**: implicit: Item<Sentence>
- **External deps**: jree
- **Build / tests**: tsc fail: TS1005 @ 222:25 ';' expected.; no dedicated test
- **Roadmap**: prerequisites implicit: Item<Sentence> -> focus Preserve clone/equality/serialization semantics for value objects such as Stamp or TruthValue. -> differences see 通用转译法.md / Entity & Serialization

## entity/TaskLink.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/entity/TaskLink.java`

- **Size / TODO**: 218 LOC, TODO 0
- **Declared types**: class TaskLink extends Item<Task> implements TLink<Task>
- **Imports / deps**: implicit: Item<Task>, TLink<Task>
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: Item<Task>, TLink<Task> -> focus Preserve clone/equality/serialization semantics for value objects such as Stamp or TruthValue. -> differences see 通用转译法.md / Entity & Serialization

## entity/TermLink.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/entity/TermLink.java`

- **Size / TODO**: 265 LOC, TODO 1
- **Declared types**: class TermLink extends Item<TermLink> implements TLink<Term>
- **Imports / deps**: implicit: Item<TermLink>, TLink<Term>
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: Item<TermLink>, TLink<Term> -> focus Preserve clone/equality/serialization semantics for value objects such as Stamp or TruthValue. -> differences see 通用转译法.md / Entity & Serialization

## entity/TruthValue.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/entity/TruthValue.java`

- **Size / TODO**: 332 LOC, TODO 0
- **Declared types**: class TruthValue extends JavaObject implements java.lang.Cloneable, java.io.Serializable
- **Imports / deps**: io/Symbols.ts(ready), main/Parameters.ts(ready)
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites io/Symbols.ts(ready), main/Parameters.ts(ready) -> focus Preserve clone/equality/serialization semantics for value objects such as Stamp or TruthValue. -> differences see 通用转译法.md / Entity & Serialization

## inference/BudgetFunctions.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/inference/BudgetFunctions.java`

- **Size / TODO**: 336 LOC, TODO 0
- **Declared types**: class BudgetFunctions
- **Imports / deps**: entity/TruthValue.ts(ready), entity/Sentence.ts(ready), entity/TaskLink.ts(ready), entity/Task.ts(ready), control/DerivationContext.ts(ready), entity/BudgetValue.ts(ready), language/Term.ts(ready), storage/Memory.ts(ready), entity/Item.ts(ready), entity/TermLink.ts(ready), entity/Concept.ts(ready)
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites entity/TruthValue.ts(ready), entity/Sentence.ts(ready), entity/TaskLink.ts(ready), entity/Task.ts(ready), control/DerivationContext.ts(ready), entity/BudgetValue.ts(ready), language/Term.ts(ready), storage/Memory.ts(ready), entity/Item.ts(ready), entity/TermLink.ts(ready), entity/Concept.ts(ready) -> focus Finalize rule tables, numeric utilities, and generic constraints so rules can be tested. -> differences see 通用转译法.md / Inference Rules

## inference/CompositionalRules.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/inference/CompositionalRules.java`

- **Size / TODO**: 827 LOC, TODO 0
- **Declared types**: class CompositionalRules extends JavaObject
- **Imports / deps**: implicit: JavaObject
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: JavaObject -> focus Finalize rule tables, numeric utilities, and generic constraints so rules can be tested. -> differences see 通用转译法.md / Inference Rules

## inference/LocalRules.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/inference/LocalRules.java`

- **Size / TODO**: 470 LOC, TODO 0
- **Declared types**: class LocalRules extends JavaObject
- **Imports / deps**: implicit: JavaObject
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: JavaObject -> focus Finalize rule tables, numeric utilities, and generic constraints so rules can be tested. -> differences see 通用转译法.md / Inference Rules

## inference/RuleTables.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/inference/RuleTables.java`

- **Size / TODO**: 999 LOC, TODO 1
- **Declared types**: class RuleTables extends JavaObject
- **Imports / deps**: implicit: JavaObject
- **External deps**: jree
- **Build / tests**: tsc fail: TS1005 @ 621:23 ';' expected.; no dedicated test
- **Roadmap**: prerequisites implicit: JavaObject -> focus Finalize rule tables, numeric utilities, and generic constraints so rules can be tested. -> differences see 通用转译法.md / Inference Rules

## inference/StructuralRules.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/inference/StructuralRules.java`

- **Size / TODO**: 986 LOC, TODO 0
- **Declared types**: class StructuralRules extends JavaObject
- **Imports / deps**: implicit: JavaObject
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: JavaObject -> focus Finalize rule tables, numeric utilities, and generic constraints so rules can be tested. -> differences see 通用转译法.md / Inference Rules

## inference/SyllogisticRules.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/inference/SyllogisticRules.java`

- **Size / TODO**: 1000 LOC, TODO 0
- **Declared types**: class SyllogisticRules extends JavaObject
- **Imports / deps**: implicit: JavaObject
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: JavaObject -> focus Finalize rule tables, numeric utilities, and generic constraints so rules can be tested. -> differences see 通用转译法.md / Inference Rules

## inference/TemporalRules.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/inference/TemporalRules.java`

- **Size / TODO**: 340 LOC, TODO 2
- **Declared types**: class TemporalRules extends JavaObject
- **Imports / deps**: implicit: JavaObject
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: JavaObject -> focus Finalize rule tables, numeric utilities, and generic constraints so rules can be tested. -> differences see 通用转译法.md / Inference Rules

## inference/TruthFunctions.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/inference/TruthFunctions.java`

- **Size / TODO**: 626 LOC, TODO 0
- **Declared types**: class TruthFunctions extends UtilityFunctions
- **Imports / deps**: implicit: UtilityFunctions
- **External deps**: jree
- **Build / tests**: tsc fail: TS1005 @ 43:39 ';' expected.; no dedicated test
- **Roadmap**: prerequisites implicit: UtilityFunctions -> focus Finalize rule tables, numeric utilities, and generic constraints so rules can be tested. -> differences see 通用转译法.md / Inference Rules

## inference/UtilityFunctions.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/inference/UtilityFunctions.java`

- **Size / TODO**: 93 LOC, TODO 0
- **Declared types**: class UtilityFunctions extends JavaObject
- **Imports / deps**: main/Parameters.ts(ready)
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites main/Parameters.ts(ready) -> focus Finalize rule tables, numeric utilities, and generic constraints so rules can be tested. -> differences see 通用转译法.md / Inference Rules

## interfaces/Eventable.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/interfaces/Eventable.java`

- **Size / TODO**: 18 LOC, TODO 0
- **Declared types**: interface Eventable
- **Imports / deps**: (none)
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites (none) -> focus Express Java interfaces as TypeScript interfaces/abstract classes and enforce imports for implementors. -> differences see 通用转译法.md / Interface Contracts

## interfaces/InputFileConsumer.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/interfaces/InputFileConsumer.java`

- **Size / TODO**: 18 LOC, TODO 0
- **Declared types**: interface InputFileConsumer
- **Imports / deps**: (none)
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites (none) -> focus Express Java interfaces as TypeScript interfaces/abstract classes and enforce imports for implementors. -> differences see 通用转译法.md / Interface Contracts

## interfaces/Multistepable.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/interfaces/Multistepable.java`

- **Size / TODO**: 21 LOC, TODO 0
- **Declared types**: interface Multistepable
- **Imports / deps**: (none)
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites (none) -> focus Express Java interfaces as TypeScript interfaces/abstract classes and enforce imports for implementors. -> differences see 通用转译法.md / Interface Contracts

## interfaces/NarseseConsumer.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/interfaces/NarseseConsumer.java`

- **Size / TODO**: 21 LOC, TODO 1
- **Declared types**: interface NarseseConsumer
- **Imports / deps**: (none)
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites (none) -> focus Express Java interfaces as TypeScript interfaces/abstract classes and enforce imports for implementors. -> differences see 通用转译法.md / Interface Contracts

## interfaces/Pluggable.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/interfaces/Pluggable.java`

- **Size / TODO**: 31 LOC, TODO 0
- **Declared types**: interface Pluggable
- **Imports / deps**: (none)
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites (none) -> focus Express Java interfaces as TypeScript interfaces/abstract classes and enforce imports for implementors. -> differences see 通用转译法.md / Interface Contracts

## interfaces/Resettable.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/interfaces/Resettable.java`

- **Size / TODO**: 17 LOC, TODO 0
- **Declared types**: interface Resettable
- **Imports / deps**: (none)
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites (none) -> focus Express Java interfaces as TypeScript interfaces/abstract classes and enforce imports for implementors. -> differences see 通用转译法.md / Interface Contracts

## interfaces/SensoryChannelConsumer.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/interfaces/SensoryChannelConsumer.java`

- **Size / TODO**: 18 LOC, TODO 0
- **Declared types**: interface SensoryChannelConsumer
- **Imports / deps**: (none)
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites (none) -> focus Express Java interfaces as TypeScript interfaces/abstract classes and enforce imports for implementors. -> differences see 通用转译法.md / Interface Contracts

## interfaces/TaskConsumer.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/interfaces/TaskConsumer.java`

- **Size / TODO**: 21 LOC, TODO 0
- **Declared types**: (helpers only)
- **Imports / deps**: (none)
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites (none) -> focus Express Java interfaces as TypeScript interfaces/abstract classes and enforce imports for implementors. -> differences see 通用转译法.md / Interface Contracts

## interfaces/Timable.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/interfaces/Timable.java`

- **Size / TODO**: 18 LOC, TODO 0
- **Declared types**: interface Timable
- **Imports / deps**: (none)
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites (none) -> focus Express Java interfaces as TypeScript interfaces/abstract classes and enforce imports for implementors. -> differences see 通用转译法.md / Interface Contracts

## interfaces/pub/Reasoner.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/interfaces/pub/Reasoner.java`

- **Size / TODO**: 83 LOC, TODO 0
- **Declared types**: interface Reasoner extends SensoryChannelConsumer, Resettable, NarseseConsumer, InputFileConsumer, TaskConsumer<Reasoner>, Eventable, Pluggable, Multistepable, Timable
- **Imports / deps**: implicit: SensoryChannelConsumer, Resettable, NarseseConsumer, InputFileConsumer, TaskConsumer<Reasoner>, Eventable, Pluggable, Multistepable, Timable
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: SensoryChannelConsumer, Resettable, NarseseConsumer, InputFileConsumer, TaskConsumer<Reasoner>, Eventable, Pluggable, Multistepable, Timable -> focus Express Java interfaces as TypeScript interfaces/abstract classes and enforce imports for implementors. -> differences see 通用转译法.md / Interface Contracts

## io/ConfigReader.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/io/ConfigReader.java`

- **Size / TODO**: 170 LOC, TODO 0
- **Declared types**: class ConfigReader extends JavaObject
- **Imports / deps**: implicit: JavaObject
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: JavaObject -> focus Bridge java.io-based parsing and event emitters to Node streams and typed events. -> differences see 通用转译法.md / IO & Event Pipelines

## io/Narsese.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/io/Narsese.java`

- **Size / TODO**: 567 LOC, TODO 0
- **Declared types**: class Narsese extends JavaObject implements java.io.Serializable, Parser
- **Imports / deps**: implicit: JavaObject, Parser
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: JavaObject, Parser -> focus Bridge java.io-based parsing and event emitters to Node streams and typed events. -> differences see 通用转译法.md / IO & Event Pipelines

## io/Parser.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/io/Parser.java`

- **Size / TODO**: 36 LOC, TODO 0
- **Declared types**: class Parser
- **Imports / deps**: (none)
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites (none) -> focus Bridge java.io-based parsing and event emitters to Node streams and typed events. -> differences see 通用转译法.md / IO & Event Pipelines

## io/Symbols.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/io/Symbols.java`

- **Size / TODO**: 333 LOC, TODO 0
- **Declared types**: class Symbols extends JavaObject
- **Imports / deps**: implicit: JavaObject
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: JavaObject -> focus Bridge java.io-based parsing and event emitters to Node streams and typed events. -> differences see 通用转译法.md / IO & Event Pipelines

## io/Texts.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/io/Texts.java`

- **Size / TODO**: 168 LOC, TODO 1
- **Declared types**: class Texts extends JavaObject
- **Imports / deps**: implicit: JavaObject
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: JavaObject -> focus Bridge java.io-based parsing and event emitters to Node streams and typed events. -> differences see 通用转译法.md / IO & Event Pipelines

## io/events/AnswerHandler.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/io/events/AnswerHandler.java`

- **Size / TODO**: 41 LOC, TODO 0
- **Declared types**: class AnswerHandler extends JavaObject implements EventObserver
- **Imports / deps**: implicit: JavaObject, EventObserver
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: JavaObject, EventObserver -> focus Bridge java.io-based parsing and event emitters to Node streams and typed events. -> differences see 通用转译法.md / IO & Event Pipelines

## io/events/EventEmitter.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/io/events/EventEmitter.java`

- **Size / TODO**: 160 LOC, TODO 1
- **Declared types**: class EventEmitter extends JavaObject
- **Imports / deps**: implicit: JavaObject
- **External deps**: jree
- **Build / tests**: tsc fail: TS1109 @ 113:30 Expression expected.; no dedicated test
- **Roadmap**: prerequisites implicit: JavaObject -> focus Bridge java.io-based parsing and event emitters to Node streams and typed events. -> differences see 通用转译法.md / IO & Event Pipelines

## io/events/EventHandler.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/io/events/EventHandler.java`

- **Size / TODO**: 58 LOC, TODO 0
- **Declared types**: class EventHandler extends JavaObject implements EventEmitter.EventObserver
- **Imports / deps**: implicit: JavaObject, EventEmitter.EventObserver
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: JavaObject, EventEmitter.EventObserver -> focus Bridge java.io-based parsing and event emitters to Node streams and typed events. -> differences see 通用转译法.md / IO & Event Pipelines

## io/events/Events.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/io/events/Events.java`

- **Size / TODO**: 360 LOC, TODO 0
- **Declared types**: class Events extends JavaObject
- **Imports / deps**: implicit: JavaObject
- **External deps**: jree
- **Build / tests**: tsc fail: TS1005 @ 357:38 '=' expected. (+2 more); no dedicated test
- **Roadmap**: prerequisites implicit: JavaObject -> focus Bridge java.io-based parsing and event emitters to Node streams and typed events. -> differences see 通用转译法.md / IO & Event Pipelines

## io/events/OutputHandler.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/io/events/OutputHandler.java`

- **Size / TODO**: 110 LOC, TODO 0
- **Declared types**: class OutputHandler extends EventHandler
- **Imports / deps**: implicit: EventHandler
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: EventHandler -> focus Bridge java.io-based parsing and event emitters to Node streams and typed events. -> differences see 通用转译法.md / IO & Event Pipelines

## io/events/TextOutputHandler.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/io/events/TextOutputHandler.java`

- **Size / TODO**: 294 LOC, TODO 0
- **Declared types**: class TextOutputHandler extends OutputHandler implements java.io.Serializable
- **Imports / deps**: implicit: OutputHandler
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: OutputHandler -> focus Bridge java.io-based parsing and event emitters to Node streams and typed events. -> differences see 通用转译法.md / IO & Event Pipelines

## language/AbstractTerm.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/language/AbstractTerm.java`

- **Size / TODO**: 31 LOC, TODO 0
- **Declared types**: class AbstractTerm extends java.lang.Cloneable & java.lang.Comparable<AbstractTerm>
- **Imports / deps**: (none)
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites (none) -> focus Align the Term hierarchy, caching layers, and immutable logical operations with TS generics. -> differences see 通用转译法.md / Language Layer

## language/CompoundTerm.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/language/CompoundTerm.java`

- **Size / TODO**: 818 LOC, TODO 4
- **Declared types**: class CompoundTerm extends Term implements java.lang.Iterable<Term>
- **Imports / deps**: implicit: Term
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: Term -> focus Align the Term hierarchy, caching layers, and immutable logical operations with TS generics. -> differences see 通用转译法.md / Language Layer

## language/Conjunction.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/language/Conjunction.java`

- **Size / TODO**: 494 LOC, TODO 0
- **Declared types**: class Conjunction extends CompoundTerm
- **Imports / deps**: implicit: CompoundTerm
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: CompoundTerm -> focus Align the Term hierarchy, caching layers, and immutable logical operations with TS generics. -> differences see 通用转译法.md / Language Layer

## language/DifferenceExt.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/language/DifferenceExt.java`

- **Size / TODO**: 138 LOC, TODO 1
- **Declared types**: class DifferenceExt extends CompoundTerm
- **Imports / deps**: implicit: CompoundTerm
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: CompoundTerm -> focus Align the Term hierarchy, caching layers, and immutable logical operations with TS generics. -> differences see 通用转译法.md / Language Layer

## language/DifferenceInt.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/language/DifferenceInt.java`

- **Size / TODO**: 149 LOC, TODO 1
- **Declared types**: class DifferenceInt extends CompoundTerm
- **Imports / deps**: implicit: CompoundTerm
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: CompoundTerm -> focus Align the Term hierarchy, caching layers, and immutable logical operations with TS generics. -> differences see 通用转译法.md / Language Layer

## language/Disjunction.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/language/Disjunction.java`

- **Size / TODO**: 149 LOC, TODO 0
- **Declared types**: class Disjunction extends CompoundTerm
- **Imports / deps**: implicit: CompoundTerm
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: CompoundTerm -> focus Align the Term hierarchy, caching layers, and immutable logical operations with TS generics. -> differences see 通用转译法.md / Language Layer

## language/Equivalence.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/language/Equivalence.java`

- **Size / TODO**: 195 LOC, TODO 1
- **Declared types**: class Equivalence extends Statement
- **Imports / deps**: implicit: Statement
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: Statement -> focus Align the Term hierarchy, caching layers, and immutable logical operations with TS generics. -> differences see 通用转译法.md / Language Layer

## language/Image.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/language/Image.java`

- **Size / TODO**: 104 LOC, TODO 1
- **Declared types**: class Image extends CompoundTerm
- **Imports / deps**: implicit: CompoundTerm
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: CompoundTerm -> focus Align the Term hierarchy, caching layers, and immutable logical operations with TS generics. -> differences see 通用转译法.md / Language Layer

## language/ImageExt.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/language/ImageExt.java`

- **Size / TODO**: 180 LOC, TODO 1
- **Declared types**: class ImageExt extends Image
- **Imports / deps**: implicit: Image
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: Image -> focus Align the Term hierarchy, caching layers, and immutable logical operations with TS generics. -> differences see 通用转译法.md / Language Layer

## language/ImageInt.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/language/ImageInt.java`

- **Size / TODO**: 200 LOC, TODO 1
- **Declared types**: class ImageInt extends Image
- **Imports / deps**: implicit: Image
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: Image -> focus Align the Term hierarchy, caching layers, and immutable logical operations with TS generics. -> differences see 通用转译法.md / Language Layer

## language/Implication.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/language/Implication.java`

- **Size / TODO**: 242 LOC, TODO 0
- **Declared types**: class Implication extends Statement
- **Imports / deps**: implicit: Statement
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: Statement -> focus Align the Term hierarchy, caching layers, and immutable logical operations with TS generics. -> differences see 通用转译法.md / Language Layer

## language/Inheritance.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/language/Inheritance.java`

- **Size / TODO**: 143 LOC, TODO 0
- **Declared types**: class Inheritance extends Statement
- **Imports / deps**: implicit: Statement
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: Statement -> focus Align the Term hierarchy, caching layers, and immutable logical operations with TS generics. -> differences see 通用转译法.md / Language Layer

## language/Instance.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/language/Instance.java`

- **Size / TODO**: 28 LOC, TODO 0
- **Declared types**: class Instance extends JavaObject /* extends Statement */
- **Imports / deps**: implicit: JavaObject /* extends Statement */
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: JavaObject /* extends Statement */ -> focus Align the Term hierarchy, caching layers, and immutable logical operations with TS generics. -> differences see 通用转译法.md / Language Layer

## language/InstanceProperty.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/language/InstanceProperty.java`

- **Size / TODO**: 28 LOC, TODO 0
- **Declared types**: class InstanceProperty extends JavaObject /* extends Statement */
- **Imports / deps**: implicit: JavaObject /* extends Statement */
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: JavaObject /* extends Statement */ -> focus Align the Term hierarchy, caching layers, and immutable logical operations with TS generics. -> differences see 通用转译法.md / Language Layer

## language/IntersectionExt.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/language/IntersectionExt.java`

- **Size / TODO**: 168 LOC, TODO 0
- **Declared types**: class IntersectionExt extends CompoundTerm
- **Imports / deps**: implicit: CompoundTerm
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: CompoundTerm -> focus Align the Term hierarchy, caching layers, and immutable logical operations with TS generics. -> differences see 通用转译法.md / Language Layer

## language/IntersectionInt.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/language/IntersectionInt.java`

- **Size / TODO**: 168 LOC, TODO 0
- **Declared types**: class IntersectionInt extends CompoundTerm
- **Imports / deps**: implicit: CompoundTerm
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: CompoundTerm -> focus Align the Term hierarchy, caching layers, and immutable logical operations with TS generics. -> differences see 通用转译法.md / Language Layer

## language/Interval.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/language/Interval.java`

- **Size / TODO**: 72 LOC, TODO 0
- **Declared types**: class Interval extends Term
- **Imports / deps**: implicit: Term
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: Term -> focus Align the Term hierarchy, caching layers, and immutable logical operations with TS generics. -> differences see 通用转译法.md / Language Layer

## language/Negation.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/language/Negation.java`

- **Size / TODO**: 132 LOC, TODO 0
- **Declared types**: class Negation extends CompoundTerm
- **Imports / deps**: implicit: CompoundTerm
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: CompoundTerm -> focus Align the Term hierarchy, caching layers, and immutable logical operations with TS generics. -> differences see 通用转译法.md / Language Layer

## language/Product.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/language/Product.java`

- **Size / TODO**: 143 LOC, TODO 0
- **Declared types**: class Product extends CompoundTerm
- **Imports / deps**: implicit: CompoundTerm
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: CompoundTerm -> focus Align the Term hierarchy, caching layers, and immutable logical operations with TS generics. -> differences see 通用转译法.md / Language Layer

## language/Property.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/language/Property.java`

- **Size / TODO**: 27 LOC, TODO 0
- **Declared types**: class Property extends JavaObject /* would extend "Statement" if it were its own type */
- **Imports / deps**: implicit: JavaObject /* would extend "Statement" if it were its own type */
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: JavaObject /* would extend "Statement" if it were its own type */ -> focus Align the Term hierarchy, caching layers, and immutable logical operations with TS generics. -> differences see 通用转译法.md / Language Layer

## language/SetExt.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/language/SetExt.java`

- **Size / TODO**: 113 LOC, TODO 0
- **Declared types**: class SetExt extends SetTensional
- **Imports / deps**: implicit: SetTensional
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: SetTensional -> focus Align the Term hierarchy, caching layers, and immutable logical operations with TS generics. -> differences see 通用转译法.md / Language Layer

## language/SetInt.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/language/SetInt.java`

- **Size / TODO**: 114 LOC, TODO 0
- **Declared types**: class SetInt extends SetTensional
- **Imports / deps**: implicit: SetTensional
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: SetTensional -> focus Align the Term hierarchy, caching layers, and immutable logical operations with TS generics. -> differences see 通用转译法.md / Language Layer

## language/SetTensional.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/language/SetTensional.java`

- **Size / TODO**: 64 LOC, TODO 0
- **Declared types**: class SetTensional extends CompoundTerm
- **Imports / deps**: implicit: CompoundTerm
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: CompoundTerm -> focus Align the Term hierarchy, caching layers, and immutable logical operations with TS generics. -> differences see 通用转译法.md / Language Layer

## language/Similarity.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/language/Similarity.java`

- **Size / TODO**: 138 LOC, TODO 0
- **Declared types**: class Similarity extends Statement
- **Imports / deps**: implicit: Statement
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: Statement -> focus Align the Term hierarchy, caching layers, and immutable logical operations with TS generics. -> differences see 通用转译法.md / Language Layer

## language/Statement.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/language/Statement.java`

- **Size / TODO**: 377 LOC, TODO 0
- **Declared types**: class Statement extends CompoundTerm
- **Imports / deps**: implicit: CompoundTerm
- **External deps**: jree
- **Build / tests**: tsc fail: TS1005 @ 365:27 ';' expected.; no dedicated test
- **Roadmap**: prerequisites implicit: CompoundTerm -> focus Align the Term hierarchy, caching layers, and immutable logical operations with TS generics. -> differences see 通用转译法.md / Language Layer

## language/Tense.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/language/Tense.java`

- **Size / TODO**: 37 LOC, TODO 0
- **Declared types**: class Tense extends java.lang.Enum<Tense>
- **Imports / deps**: (none)
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites (none) -> focus Align the Term hierarchy, caching layers, and immutable logical operations with TS generics. -> differences see 通用转译法.md / Language Layer

## language/Term.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/language/Term.java`

- **Size / TODO**: 536 LOC, TODO 1
- **Declared types**: class Term extends JavaObject
- **Imports / deps**: language/SetExt.ts(ready)
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites language/SetExt.ts(ready) -> focus Align the Term hierarchy, caching layers, and immutable logical operations with TS generics. -> differences see 通用转译法.md / Language Layer

## language/Terms.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/language/Terms.java`

- **Size / TODO**: 615 LOC, TODO 1
- **Declared types**: class Terms extends JavaObject
- **Imports / deps**: implicit: JavaObject
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: JavaObject -> focus Align the Term hierarchy, caching layers, and immutable logical operations with TS generics. -> differences see 通用转译法.md / Language Layer

## language/Variable.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/language/Variable.java`

- **Size / TODO**: 327 LOC, TODO 1
- **Declared types**: class Variable extends Term
- **Imports / deps**: implicit: Term
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: Term -> focus Align the Term hierarchy, caching layers, and immutable logical operations with TS generics. -> differences see 通用转译法.md / Language Layer

## language/Variables.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/language/Variables.java`

- **Size / TODO**: 540 LOC, TODO 1
- **Declared types**: class Variables extends JavaObject
- **Imports / deps**: implicit: JavaObject
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: JavaObject -> focus Align the Term hierarchy, caching layers, and immutable logical operations with TS generics. -> differences see 通用转译法.md / Language Layer

## main/Debug.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/parameter/Debug.java`

- **Size / TODO**: 69 LOC, TODO 0
- **Declared types**: class Debug extends JavaObject
- **Imports / deps**: implicit: JavaObject
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: JavaObject -> focus Translate Nar/Shell lifecycle management, CLI options, and threads into a Node lifecycle. -> differences see 通用转译法.md / Main Runtime

## main/Nar.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/main/Nar.java`

- **Size / TODO**: 886 LOC, TODO 2
- **Declared types**: class Nar extends SensoryChannel implements Reasoner, java.lang.Runnable
- **Imports / deps**: implicit: SensoryChannel, Reasoner
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: SensoryChannel, Reasoner -> focus Translate Nar/Shell lifecycle management, CLI options, and threads into a Node lifecycle. -> differences see 通用转译法.md / Main Runtime

## main/NarNode.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/main/NarNode.java`

- **Size / TODO**: 337 LOC, TODO 0
- **Declared types**: class NarNode extends JavaObject implements EventObserver
- **Imports / deps**: implicit: JavaObject, EventObserver
- **External deps**: jree
- **Build / tests**: tsc fail: TS1472 @ 316:13 'catch' or 'finally' expected.; no dedicated test
- **Roadmap**: prerequisites implicit: JavaObject, EventObserver -> focus Translate Nar/Shell lifecycle management, CLI options, and threads into a Node lifecycle. -> differences see 通用转译法.md / Main Runtime

## main/Parameters.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/parameter/Parameters.java`

- **Size / TODO**: 301 LOC, TODO 1
- **Declared types**: class Parameters extends JavaObject implements java.io.Serializable
- **Imports / deps**: implicit: JavaObject
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: JavaObject -> focus Translate Nar/Shell lifecycle management, CLI options, and threads into a Node lifecycle. -> differences see 通用转译法.md / Main Runtime

## main/Shell.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/main/Shell.java`

- **Size / TODO**: 195 LOC, TODO 1
- **Declared types**: class Shell extends JavaObject
- **Imports / deps**: implicit: JavaObject
- **External deps**: jree
- **Build / tests**: tsc fail: TS1359 @ 107:35 Identifier expected. 'in' is a reserved word that cannot be used here. (+2 more); no dedicated test
- **Roadmap**: prerequisites implicit: JavaObject -> focus Translate Nar/Shell lifecycle management, CLI options, and threads into a Node lifecycle. -> differences see 通用转译法.md / Main Runtime

## operator/FunctionOperator.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/operator/FunctionOperator.java`

- **Size / TODO**: 109 LOC, TODO 2
- **Declared types**: class FunctionOperator extends Operator
- **Imports / deps**: implicit: Operator
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: Operator -> focus Replace reflective invocation with explicit Memory/Nar hooks and cover operator side-effects. -> differences see 通用转译法.md / Operators

## operator/ImaginationSpace.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/operator/ImaginationSpace.java`

- **Size / TODO**: 31 LOC, TODO 0
- **Declared types**: interface ImaginationSpace
- **Imports / deps**: (none)
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites (none) -> focus Replace reflective invocation with explicit Memory/Nar hooks and cover operator side-effects. -> differences see 通用转译法.md / Operators

## operator/NullOperator.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/operator/NullOperator.java`

- **Size / TODO**: 49 LOC, TODO 0
- **Declared types**: class NullOperator extends Operator
- **Imports / deps**: implicit: Operator
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: Operator -> focus Replace reflective invocation with explicit Memory/Nar hooks and cover operator side-effects. -> differences see 通用转译法.md / Operators

## operator/Operation.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/operator/Operation.java`

- **Size / TODO**: 107 LOC, TODO 0
- **Declared types**: class Operation extends Inheritance
- **Imports / deps**: implicit: Inheritance
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: Inheritance -> focus Replace reflective invocation with explicit Memory/Nar hooks and cover operator side-effects. -> differences see 通用转译法.md / Operators

## operator/Operator.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/operator/Operator.java`

- **Size / TODO**: 222 LOC, TODO 0
- **Declared types**: class Operator extends Term implements Plugin
- **Imports / deps**: language/Term.ts(ready), operator/Operation.ts(ready), storage/Memory.ts(ready), interfaces/Timable.ts(ready), entity/Task.ts(ready), main/Nar.ts(ready)
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites language/Term.ts(ready), operator/Operation.ts(ready), storage/Memory.ts(ready), interfaces/Timable.ts(ready), entity/Task.ts(ready), main/Nar.ts(ready) -> focus Replace reflective invocation with explicit Memory/Nar hooks and cover operator side-effects. -> differences see 通用转译法.md / Operators

## operator/mental/Anticipate.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/operator/mental/Anticipate.java`

- **Size / TODO**: 299 LOC, TODO 0
- **Declared types**: class Anticipate extends Operator implements EventObserver
- **Imports / deps**: implicit: Operator, EventObserver
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: Operator, EventObserver -> focus Replace reflective invocation with explicit Memory/Nar hooks and cover operator side-effects. -> differences see 通用转译法.md / Operators

## operator/mental/Believe.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/operator/mental/Believe.java`

- **Size / TODO**: 48 LOC, TODO 0
- **Declared types**: class Believe extends Operator
- **Imports / deps**: operator/Operator.ts(ready), operator/Operation.ts(ready), entity/Task.ts(ready), storage/Memory.ts(ready), interfaces/Timable.ts(ready)
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites operator/Operator.ts(ready), operator/Operation.ts(ready), entity/Task.ts(ready), storage/Memory.ts(ready), interfaces/Timable.ts(ready) -> focus Replace reflective invocation with explicit Memory/Nar hooks and cover operator side-effects. -> differences see 通用转译法.md / Operators

## operator/mental/Consider.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/operator/mental/Consider.java`

- **Size / TODO**: 38 LOC, TODO 0
- **Declared types**: class Consider extends Operator
- **Imports / deps**: implicit: Operator
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: Operator -> focus Replace reflective invocation with explicit Memory/Nar hooks and cover operator side-effects. -> differences see 通用转译法.md / Operators

## operator/mental/Doubt.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/operator/mental/Doubt.java`

- **Size / TODO**: 29 LOC, TODO 0
- **Declared types**: class Doubt extends Operator
- **Imports / deps**: implicit: Operator
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: Operator -> focus Replace reflective invocation with explicit Memory/Nar hooks and cover operator side-effects. -> differences see 通用转译法.md / Operators

## operator/mental/Evaluate.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/operator/mental/Evaluate.java`

- **Size / TODO**: 37 LOC, TODO 0
- **Declared types**: class Evaluate extends Operator
- **Imports / deps**: implicit: Operator
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: Operator -> focus Replace reflective invocation with explicit Memory/Nar hooks and cover operator side-effects. -> differences see 通用转译法.md / Operators

## operator/mental/Feel.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/operator/mental/Feel.java`

- **Size / TODO**: 49 LOC, TODO 0
- **Declared types**: class Feel extends Operator
- **Imports / deps**: implicit: Operator
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: Operator -> focus Replace reflective invocation with explicit Memory/Nar hooks and cover operator side-effects. -> differences see 通用转译法.md / Operators

## operator/mental/FeelBusy.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/operator/mental/FeelBusy.java`

- **Size / TODO**: 28 LOC, TODO 0
- **Declared types**: class FeelBusy extends Feel
- **Imports / deps**: implicit: Feel
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: Feel -> focus Replace reflective invocation with explicit Memory/Nar hooks and cover operator side-effects. -> differences see 通用转译法.md / Operators

## operator/mental/FeelSatisfied.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/operator/mental/FeelSatisfied.java`

- **Size / TODO**: 28 LOC, TODO 0
- **Declared types**: class FeelSatisfied extends Feel
- **Imports / deps**: implicit: Feel
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: Feel -> focus Replace reflective invocation with explicit Memory/Nar hooks and cover operator side-effects. -> differences see 通用转译法.md / Operators

## operator/mental/Hesitate.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/operator/mental/Hesitate.java`

- **Size / TODO**: 29 LOC, TODO 0
- **Declared types**: class Hesitate extends Operator
- **Imports / deps**: implicit: Operator
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: Operator -> focus Replace reflective invocation with explicit Memory/Nar hooks and cover operator side-effects. -> differences see 通用转译法.md / Operators

## operator/mental/Name.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/operator/mental/Name.java`

- **Size / TODO**: 40 LOC, TODO 0
- **Declared types**: class Name extends Operator
- **Imports / deps**: implicit: Operator
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: Operator -> focus Replace reflective invocation with explicit Memory/Nar hooks and cover operator side-effects. -> differences see 通用转译法.md / Operators

## operator/mental/Register.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/operator/mental/Register.java`

- **Size / TODO**: 28 LOC, TODO 0
- **Declared types**: class Register extends Operator
- **Imports / deps**: implicit: Operator
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: Operator -> focus Replace reflective invocation with explicit Memory/Nar hooks and cover operator side-effects. -> differences see 通用转译法.md / Operators

## operator/mental/Remind.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/operator/mental/Remind.java`

- **Size / TODO**: 37 LOC, TODO 0
- **Declared types**: class Remind extends Operator
- **Imports / deps**: implicit: Operator
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: Operator -> focus Replace reflective invocation with explicit Memory/Nar hooks and cover operator side-effects. -> differences see 通用转译法.md / Operators

## operator/mental/Want.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/operator/mental/Want.java`

- **Size / TODO**: 41 LOC, TODO 0
- **Declared types**: class Want extends Operator
- **Imports / deps**: implicit: Operator
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: Operator -> focus Replace reflective invocation with explicit Memory/Nar hooks and cover operator side-effects. -> differences see 通用转译法.md / Operators

## operator/mental/Wonder.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/operator/mental/Wonder.java`

- **Size / TODO**: 38 LOC, TODO 0
- **Declared types**: class Wonder extends Operator
- **Imports / deps**: implicit: Operator
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: Operator -> focus Replace reflective invocation with explicit Memory/Nar hooks and cover operator side-effects. -> differences see 通用转译法.md / Operators

## operator/misc/Add.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/operator/misc/Add.java`

- **Size / TODO**: 41 LOC, TODO 0
- **Declared types**: class Add extends FunctionOperator
- **Imports / deps**: implicit: FunctionOperator
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: FunctionOperator -> focus Replace reflective invocation with explicit Memory/Nar hooks and cover operator side-effects. -> differences see 通用转译法.md / Operators

## operator/misc/Count.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/operator/misc/Count.java`

- **Size / TODO**: 47 LOC, TODO 0
- **Declared types**: class Count extends FunctionOperator
- **Imports / deps**: implicit: FunctionOperator
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: FunctionOperator -> focus Replace reflective invocation with explicit Memory/Nar hooks and cover operator side-effects. -> differences see 通用转译法.md / Operators

## operator/misc/Reflect.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/operator/misc/Reflect.java`

- **Size / TODO**: 121 LOC, TODO 0
- **Declared types**: class Reflect extends FunctionOperator
- **Imports / deps**: implicit: FunctionOperator
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: FunctionOperator -> focus Replace reflective invocation with explicit Memory/Nar hooks and cover operator side-effects. -> differences see 通用转译法.md / Operators

## operator/misc/System.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/operator/misc/System.java`

- **Size / TODO**: 48 LOC, TODO 0
- **Declared types**: class System extends FunctionOperator
- **Imports / deps**: implicit: FunctionOperator
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: FunctionOperator -> focus Replace reflective invocation with explicit Memory/Nar hooks and cover operator side-effects. -> differences see 通用转译法.md / Operators

## plugin/Plugin.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/plugin/Plugin.java`

- **Size / TODO**: 21 LOC, TODO 0
- **Declared types**: class Plugin extends java.io.Serializable
- **Imports / deps**: (none)
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites (none) -> focus Wire perception/mental plugins up to event emitters and shared caches. -> differences see 通用转译法.md / Plugins

## plugin/mental/Abbreviation.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/plugin/mental/Abbreviation.java`

- **Size / TODO**: 184 LOC, TODO 1
- **Declared types**: class Abbreviation extends JavaObject implements Plugin
- **Imports / deps**: implicit: JavaObject, Plugin
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: JavaObject, Plugin -> focus Wire perception/mental plugins up to event emitters and shared caches. -> differences see 通用转译法.md / Plugins

## plugin/mental/ComplexEmotions.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/plugin/mental/ComplexEmotions.java`

- **Size / TODO**: 59 LOC, TODO 0
- **Declared types**: class ComplexEmotions extends JavaObject implements Plugin
- **Imports / deps**: implicit: JavaObject, Plugin
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: JavaObject, Plugin -> focus Wire perception/mental plugins up to event emitters and shared caches. -> differences see 通用转译法.md / Plugins

## plugin/mental/Counting.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/plugin/mental/Counting.java`

- **Size / TODO**: 117 LOC, TODO 1
- **Declared types**: class Counting extends JavaObject implements Plugin
- **Imports / deps**: implicit: JavaObject, Plugin
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: JavaObject, Plugin -> focus Wire perception/mental plugins up to event emitters and shared caches. -> differences see 通用转译法.md / Plugins

## plugin/mental/Emotions.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/plugin/mental/Emotions.java`

- **Size / TODO**: 264 LOC, TODO 0
- **Declared types**: class Emotions extends JavaObject implements Plugin
- **Imports / deps**: implicit: JavaObject, Plugin
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: JavaObject, Plugin -> focus Wire perception/mental plugins up to event emitters and shared caches. -> differences see 通用转译法.md / Plugins

## plugin/mental/InternalExperience.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/plugin/mental/InternalExperience.java`

- **Size / TODO**: 408 LOC, TODO 0
- **Declared types**: class InternalExperience extends JavaObject implements Plugin, EventObserver
- **Imports / deps**: implicit: JavaObject, Plugin, EventObserver
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: JavaObject, Plugin, EventObserver -> focus Wire perception/mental plugins up to event emitters and shared caches. -> differences see 通用转译法.md / Plugins

## plugin/perception/SensoryChannel.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/plugin/perception/SensoryChannel.java`

- **Size / TODO**: 147 LOC, TODO 0
- **Declared types**: class SensoryChannel extends JavaObject implements Plugin
- **Imports / deps**: implicit: JavaObject, Plugin
- **External deps**: jree
- **Build / tests**: tsc fail: TS1135 @ 144:31 Argument expression expected. (+1 more); no dedicated test
- **Roadmap**: prerequisites implicit: JavaObject, Plugin -> focus Wire perception/mental plugins up to event emitters and shared caches. -> differences see 通用转译法.md / Plugins

## plugin/perception/VisionChannel.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/plugin/perception/VisionChannel.java`

- **Size / TODO**: 291 LOC, TODO 0
- **Declared types**: class VisionChannel extends SensoryChannel
- **Imports / deps**: implicit: SensoryChannel
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: SensoryChannel -> focus Wire perception/mental plugins up to event emitters and shared caches. -> differences see 通用转译法.md / Plugins

## plugin/perception/VisualSpace.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/plugin/perception/VisualSpace.java`

- **Size / TODO**: 137 LOC, TODO 4
- **Declared types**: class VisualSpace extends JavaObject implements ImaginationSpace
- **Imports / deps**: implicit: JavaObject, ImaginationSpace
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: JavaObject, ImaginationSpace -> focus Wire perception/mental plugins up to event emitters and shared caches. -> differences see 通用转译法.md / Plugins

## storage/Bag.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/storage/Bag.java`

- **Size / TODO**: 356 LOC, TODO 2
- **Declared types**: (helpers only)
- **Imports / deps**: entity/Item.ts(ready), storage/Distributor.ts(ready), main/Parameters.ts(ready)
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites entity/Item.ts(ready), storage/Distributor.ts(ready), main/Parameters.ts(ready) -> focus Validate Bag/Memory capacity math and iterator order while removing unsynchronized mutations. -> differences see 通用转译法.md / Storage Structures

## storage/Distributor.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/storage/Distributor.java`

- **Size / TODO**: 61 LOC, TODO 0
- **Declared types**: class Distributor
- **Imports / deps**: (none)
- **External deps**: jree
- **Build / tests**: tsc pass; test/node/distributor.test.ts (npm test ok)
- **Roadmap**: prerequisites (none) -> focus Validate Bag/Memory capacity math and iterator order while removing unsynchronized mutations. -> differences see 通用转译法.md / Storage Structures

## storage/Memory.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/storage/Memory.java`

- **Size / TODO**: 401 LOC, TODO 0
- **Declared types**: class Memory extends JavaObject implements java.io.Serializable, java.lang.Iterable<Concept>, Resettable
- **Imports / deps**: implicit: JavaObject, Resettable
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: JavaObject, Resettable -> focus Validate Bag/Memory capacity math and iterator order while removing unsynchronized mutations. -> differences see 通用转译法.md / Storage Structures

## util/ListUtil.ts

**Java counterpart**: `java-master/src/main/java/org/opennars/util/ListUtil.java`

- **Size / TODO**: 25 LOC, TODO 0
- **Declared types**: class ListUtil extends JavaObject
- **Imports / deps**: implicit: JavaObject
- **External deps**: jree
- **Build / tests**: tsc pass; no dedicated test
- **Roadmap**: prerequisites implicit: JavaObject -> focus Port java.util helpers and keep int/long simulations consistent. -> differences see 通用转译法.md / Util Layer
