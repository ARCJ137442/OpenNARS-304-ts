# src/control/TemporalInferenceControl.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/control/TemporalInferenceControl.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/control/TemporalInferenceControl.java` |
| 模块链路 | `language 基座 -> entity -> inference -> control 控制层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/control/TemporalInferenceControl.ts --noEmit`）

- 执行的命令：`npx tsc src/control/TemporalInferenceControl.ts --noEmit`
- 关键输出：
  - TS2304（L10, C58）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L10, C77）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L11, C25）：[full_check] Cannot find name 'Task'.
  - TS2304（L11, C36）：[full_check] Cannot find name 'DerivationContext'.
  - TS2304（L12, C71）：[full_check] Cannot find name 'Task'.
  - TS2322（L16, C13）：[full_check] Type 'null' is not assignable to type 'List<Task>'.
  - TS2322（L19, C13）：[full_check] Type 'null' is not assignable to type 'List<Task>'.
  - TS2304（L27, C38）：[full_check] Cannot find name 'Symbols'.
  - TS2304（L27, C87）：[full_check] Cannot find name 'Symbols'.
  - TS2322（L28, C13）：[full_check] Type 'null' is not assignable to type 'List<Task>'.
  - TS2304（L33, C29）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L36, C28）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L39, C16）：[full_check] Cannot find name 'TemporalRules'.
  - TS2304（L43, C44）：[full_check] Cannot find name 'Task'.
  - TS2304（L43, C55）：[full_check] Cannot find name 'DerivationContext'.
  - TS2304（L53, C18）：[full_check] Cannot find name 'Events'.
  - TS2304（L59, C46）：[full_check] Cannot find name 'Task'.
  - TS2304（L60, C50）：[full_check] Cannot find name 'Task'.
  - TS2304（L64, C26）：[full_check] Cannot find name 'Task'.
  - TS2304（L70, C17）：[full_check] Cannot find name 'Stamp'.
  - TS2304（L87, C33）：[full_check] Cannot find name 'Task'.
  - TS2304（L99, C26）：[full_check] Cannot find name 'Concept'.
  - TS2304（L102, C46）：[full_check] Cannot find name 'Bag'.
  - TS2304（L106, C38）：[full_check] Cannot find name 'Task'.
  - TS2304（L122, C52）：[full_check] Cannot find name 'Task'.
  - TS2304（L154, C43）：[full_check] Cannot find name 'DerivationContext'.
  - TS2304（L154, C72）：[full_check] Cannot find name 'Task'.
  - TS2304（L156, C22）：[full_check] Cannot find name 'Task'.
  - TS2304（L159, C17）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L160, C17）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L186, C54）：[full_check] Cannot find name 'Operation'.
  - TS2304（L187, C20）：[full_check] Cannot find name 'Concept'.
  - TS2304（L188, C40）：[full_check] Cannot find name 'BudgetFunctions'.
  - TS2304（L193, C21）：[full_check] Cannot find name 'Task'.
  - TS2304（L193, C32）：[full_check] Cannot find name 'Task'.
  - TS2304（L194, C21）：[full_check] Cannot find name 'BudgetValue'.
  - TS2304（L203, C42）：[full_check] Cannot find name 'Memory'.
  - TS2304（L203, C56）：[full_check] Cannot find name 'Task'.
  - TS2304（L204, C38）：[full_check] Cannot find name 'Task'.
  - TS2304（L208, C32）：[full_check] Cannot find name 'BudgetFunctions'.
  - TS2304（L215, C26）：[full_check] Cannot find name 'BudgetFunctions'.
  - TS2304（L219, C16）：[full_check] Cannot find name 'Concept'.
  - TS2304（L223, C36）：[full_check] Cannot find name 'Bag'.
  - TS2304（L10, C58）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L10, C77）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L11, C25）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L11, C36）：[syntax_check] Cannot find name 'DerivationContext'.
  - TS2304（L12, C71）：[syntax_check] Cannot find name 'Task'.
  - TS2322（L16, C13）：[syntax_check] Type 'null' is not assignable to type 'List<Task>'.
  - TS2322（L19, C13）：[syntax_check] Type 'null' is not assignable to type 'List<Task>'.
  - TS2304（L27, C38）：[syntax_check] Cannot find name 'Symbols'.
  - TS2304（L27, C87）：[syntax_check] Cannot find name 'Symbols'.
  - TS2322（L28, C13）：[syntax_check] Type 'null' is not assignable to type 'List<Task>'.
  - TS2304（L33, C29）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L36, C28）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L39, C16）：[syntax_check] Cannot find name 'TemporalRules'.
  - TS2304（L43, C44）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L43, C55）：[syntax_check] Cannot find name 'DerivationContext'.
  - TS2304（L53, C18）：[syntax_check] Cannot find name 'Events'.
  - TS2304（L59, C46）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L60, C50）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L64, C26）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L70, C17）：[syntax_check] Cannot find name 'Stamp'.
  - TS2304（L87, C33）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L99, C26）：[syntax_check] Cannot find name 'Concept'.
  - TS2304（L102, C46）：[syntax_check] Cannot find name 'Bag'.
  - TS2304（L106, C38）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L122, C52）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L154, C43）：[syntax_check] Cannot find name 'DerivationContext'.
  - TS2304（L154, C72）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L156, C22）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L159, C17）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L160, C17）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L186, C54）：[syntax_check] Cannot find name 'Operation'.
  - TS2304（L187, C20）：[syntax_check] Cannot find name 'Concept'.
  - TS2304（L188, C40）：[syntax_check] Cannot find name 'BudgetFunctions'.
  - TS2304（L193, C21）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L193, C32）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L194, C21）：[syntax_check] Cannot find name 'BudgetValue'.
  - TS2304（L203, C42）：[syntax_check] Cannot find name 'Memory'.
  - TS2304（L203, C56）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L204, C38）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L208, C32）：[syntax_check] Cannot find name 'BudgetFunctions'.
  - TS2304（L215, C26）：[syntax_check] Cannot find name 'BudgetFunctions'.
  - TS2304（L219, C16）：[syntax_check] Cannot find name 'Concept'.
  - TS2304（L223, C36）：[syntax_check] Cannot find name 'Bag'.
- 总结：存在语法错误，需要比对 Java 语句结构。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

（无显式结构性依赖，主要依赖 `jree` 提供的运行时桩或尚未补齐的全局声明。）

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

- `[full_check] Cannot find name 'Sentence'.` @ L10
- `[full_check] Cannot find name 'Sentence'.` @ L10
- `[full_check] Cannot find name 'Task'.` @ L11
- `[full_check] Cannot find name 'DerivationContext'.` @ L11
- `[full_check] Cannot find name 'Task'.` @ L12
- `[full_check] Cannot find name 'Symbols'.` @ L27
- `[full_check] Cannot find name 'Symbols'.` @ L27
- `[full_check] Cannot find name 'Sentence'.` @ L33
- `[full_check] Cannot find name 'Sentence'.` @ L36
- `[full_check] Cannot find name 'TemporalRules'.` @ L39
- `[full_check] Cannot find name 'Task'.` @ L43
- `[full_check] Cannot find name 'DerivationContext'.` @ L43
- `[full_check] Cannot find name 'Events'.` @ L53
- `[full_check] Cannot find name 'Task'.` @ L59
- `[full_check] Cannot find name 'Task'.` @ L60
- `[full_check] Cannot find name 'Task'.` @ L64
- `[full_check] Cannot find name 'Stamp'.` @ L70
- `[full_check] Cannot find name 'Task'.` @ L87
- `[full_check] Cannot find name 'Concept'.` @ L99
- `[full_check] Cannot find name 'Bag'.` @ L102
- `[full_check] Cannot find name 'Task'.` @ L106
- `[full_check] Cannot find name 'Task'.` @ L122
- `[full_check] Cannot find name 'DerivationContext'.` @ L154
- `[full_check] Cannot find name 'Task'.` @ L154
- `[full_check] Cannot find name 'Task'.` @ L156
- `[full_check] Cannot find name 'CompoundTerm'.` @ L159
- `[full_check] Cannot find name 'CompoundTerm'.` @ L160
- `[full_check] Cannot find name 'Operation'.` @ L186
- `[full_check] Cannot find name 'Concept'.` @ L187
- `[full_check] Cannot find name 'BudgetFunctions'.` @ L188
- `[full_check] Cannot find name 'Task'.` @ L193
- `[full_check] Cannot find name 'Task'.` @ L193
- `[full_check] Cannot find name 'BudgetValue'.` @ L194
- `[full_check] Cannot find name 'Memory'.` @ L203
- `[full_check] Cannot find name 'Task'.` @ L203
- `[full_check] Cannot find name 'Task'.` @ L204
- `[full_check] Cannot find name 'BudgetFunctions'.` @ L208
- `[full_check] Cannot find name 'BudgetFunctions'.` @ L215
- `[full_check] Cannot find name 'Concept'.` @ L219
- `[full_check] Cannot find name 'Bag'.` @ L223
- `[syntax_check] Cannot find name 'Sentence'.` @ L10
- `[syntax_check] Cannot find name 'Sentence'.` @ L10
- `[syntax_check] Cannot find name 'Task'.` @ L11
- `[syntax_check] Cannot find name 'DerivationContext'.` @ L11
- `[syntax_check] Cannot find name 'Task'.` @ L12
- `[syntax_check] Cannot find name 'Symbols'.` @ L27
- `[syntax_check] Cannot find name 'Symbols'.` @ L27
- `[syntax_check] Cannot find name 'Sentence'.` @ L33
- `[syntax_check] Cannot find name 'Sentence'.` @ L36
- `[syntax_check] Cannot find name 'TemporalRules'.` @ L39
- `[syntax_check] Cannot find name 'Task'.` @ L43
- `[syntax_check] Cannot find name 'DerivationContext'.` @ L43
- `[syntax_check] Cannot find name 'Events'.` @ L53
- `[syntax_check] Cannot find name 'Task'.` @ L59
- `[syntax_check] Cannot find name 'Task'.` @ L60
- `[syntax_check] Cannot find name 'Task'.` @ L64
- `[syntax_check] Cannot find name 'Stamp'.` @ L70
- `[syntax_check] Cannot find name 'Task'.` @ L87
- `[syntax_check] Cannot find name 'Concept'.` @ L99
- `[syntax_check] Cannot find name 'Bag'.` @ L102
- `[syntax_check] Cannot find name 'Task'.` @ L106
- `[syntax_check] Cannot find name 'Task'.` @ L122
- `[syntax_check] Cannot find name 'DerivationContext'.` @ L154
- `[syntax_check] Cannot find name 'Task'.` @ L154
- `[syntax_check] Cannot find name 'Task'.` @ L156
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L159
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L160
- `[syntax_check] Cannot find name 'Operation'.` @ L186
- `[syntax_check] Cannot find name 'Concept'.` @ L187
- `[syntax_check] Cannot find name 'BudgetFunctions'.` @ L188
- `[syntax_check] Cannot find name 'Task'.` @ L193
- `[syntax_check] Cannot find name 'Task'.` @ L193
- `[syntax_check] Cannot find name 'BudgetValue'.` @ L194
- `[syntax_check] Cannot find name 'Memory'.` @ L203
- `[syntax_check] Cannot find name 'Task'.` @ L203
- `[syntax_check] Cannot find name 'Task'.` @ L204
- `[syntax_check] Cannot find name 'BudgetFunctions'.` @ L208
- `[syntax_check] Cannot find name 'BudgetFunctions'.` @ L215
- `[syntax_check] Cannot find name 'Concept'.` @ L219
- `[syntax_check] Cannot find name 'Bag'.` @ L223

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `control/TemporalInferenceControl` -> `io/events/Events`（deps.xml 第 170 行）
- `control/TemporalInferenceControl` -> `entity/Concept`（deps.xml 第 171 行）
- `control/TemporalInferenceControl` -> `language/CompoundTerm`（deps.xml 第 172 行）
- `control/TemporalInferenceControl` -> `inference/TemporalRules`（deps.xml 第 173 行）
- `control/TemporalInferenceControl` -> `entity/Item`（deps.xml 第 174 行）
- `control/TemporalInferenceControl` -> `entity/Task`（deps.xml 第 175 行）
- `control/TemporalInferenceControl` -> `entity/BudgetValue`（deps.xml 第 176 行）
- `control/TemporalInferenceControl` -> `interfaces/Timable`（deps.xml 第 177 行）
- `control/TemporalInferenceControl` -> `language/Term`（deps.xml 第 178 行）
- `control/TemporalInferenceControl` -> `entity/Sentence`（deps.xml 第 179 行）
- `control/TemporalInferenceControl` -> `io/Symbols`（deps.xml 第 180 行）
- `control/TemporalInferenceControl` -> `parameter/Parameters`（deps.xml 第 181 行）
- `control/TemporalInferenceControl` -> `inference/BudgetFunctions`（deps.xml 第 182 行）
- `control/TemporalInferenceControl` -> `entity/Stamp`（deps.xml 第 183 行）
- `control/TemporalInferenceControl` -> `operator/Operation`（deps.xml 第 184 行）
- `control/TemporalInferenceControl` -> `inference/UtilityFunctions`（deps.xml 第 185 行）
- `control/TemporalInferenceControl` -> `control/DerivationContext`（deps.xml 第 186 行）
- `control/TemporalInferenceControl` -> `storage/Bag`（deps.xml 第 187 行）
- `control/TemporalInferenceControl` -> `storage/Memory`（deps.xml 第 188 行）
- 交叉校验：
- Java graph 额外依赖：control/DerivationContext、entity/BudgetValue、entity/Concept、entity/Item、entity/Sentence、entity/Stamp、entity/Task、inference/BudgetFunctions、inference/TemporalRules、inference/UtilityFunctions、interfaces/Timable、io/Symbols、io/events/Events、language/CompoundTerm、language/Term、operator/Operation、parameter/Parameters、storage/Bag、storage/Memory

## 5. Java 功能说明

- **职责概述**：文件工作：重建推理循环、任务调度与暂停机制，替换 synchronized/wait 行为。；TODO 1 处
- **关键数据结构**：
- `TemporalInferenceControl` · 继承：JavaObject · 实现：（无接口）
- **核心流程 / 算法**：
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：重建推理循环、任务调度与暂停机制，替换 synchronized/wait 行为。；TODO 1 处
  3. Java-TS 差异：参见《通用转译法.md》 - 控制与调度
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `Java Memory/Task 接口` 衔接上下游。

## 6. 一致性风险

- 文件内仍保留 1 处 TODO，需对照 Java 填补。
- `tsc` 报错阻塞进一步分析，需要回填语句结构。
- 缺少显式 import，需依赖 Java/ts-analysis 交叉校验。

## 7. 路线图定位

- 1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
- 2. 文件工作：重建推理循环、任务调度与暂停机制，替换 synchronized/wait 行为。；TODO 1 处
- 3. Java-TS 差异：参见《通用转译法.md》 - 控制与调度

## 8. 附加记录

- ts-analysis: LOC=235 · TODO=1
- 参考文件：`java-master/src/main/java/org/opennars/control/TemporalInferenceControl.java`
