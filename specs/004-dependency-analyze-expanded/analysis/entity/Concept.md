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
  - 无报错
- 总结：命令通过，未触发额外依赖。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

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

（无缺失符号，报错均与语法结构相关。）

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

## 7. 路线图定位

- 1. 依赖准备：依赖：entity/Item.ts, language/Term.ts, entity/Sentence.ts, entity/Task.ts, storage/Bag.ts, entity/TaskLink.ts
- 2. 文件工作：保持 Stamp/TruthValue 等值对象的不可变语义，补齐 clone/equals/hash 与序列化。；TODO 2 处
- 3. Java-TS 差异：参见《通用转译法.md》 - 实体与序列化

## 8. 附加记录

- ts-analysis: LOC=620 · TODO=2
- 参考文件：`java-master/src/main/java/org/opennars/entity/Concept.java`
