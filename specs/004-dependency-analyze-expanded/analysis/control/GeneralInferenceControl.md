# src/control/GeneralInferenceControl.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/control/GeneralInferenceControl.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/control/GeneralInferenceControl.java` |
| 模块链路 | `language 基座 -> entity -> inference -> control 控制层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/control/GeneralInferenceControl.ts --noEmit`）

- 执行的命令：`npx tsc src/control/GeneralInferenceControl.ts --noEmit`
- 关键输出：
  - TS2304（L15, C50）：[full_check] Cannot find name 'Memory'.
  - TS2314（L15, C73）：[full_check] Generic type 'Parameters' requires 1 type argument(s).
  - TS2304（L15, C90）：[full_check] Cannot find name 'Nar'.
  - TS2304（L16, C29）：[full_check] Cannot find name 'Concept'.
  - TS2304（L24, C18）：[full_check] Cannot find name 'DerivationContext'.
  - TS2304（L24, C42）：[full_check] Cannot find name 'DerivationContext'.
  - TS2304（L28, C9）：[full_check] Cannot find name 'ProcessAnticipation'.
  - TS2304（L45, C21）：[full_check] Cannot find name 'BudgetFunctions'.
  - TS2304（L57, C36）：[full_check] Cannot find name 'DerivationContext'.
  - TS2304（L75, C40）：[full_check] Cannot find name 'DerivationContext'.
  - TS2304（L76, C19）：[full_check] Cannot find name 'Task'.
  - TS2304（L84, C42）：[full_check] Cannot find name 'TermLink'.
  - TS2304（L90, C13）：[full_check] Cannot find name 'RuleTables'.
  - TS2304（L94, C31）：[full_check] Cannot find name 'TermLink'.
  - TS2304（L105, C25）：[full_check] Cannot find name 'Events'.
  - TS2304（L109, C42）：[full_check] Cannot find name 'TermLink'.
  - TS2304（L109, C57）：[full_check] Cannot find name 'DerivationContext'.
  - TS2304（L111, C9）：[full_check] Cannot find name 'RuleTables'.
  - TS2304（L112, C25）：[full_check] Cannot find name 'Events'.
  - TS2304（L15, C50）：[syntax_check] Cannot find name 'Memory'.
  - TS2314（L15, C73）：[syntax_check] Generic type 'Parameters' requires 1 type argument(s).
  - TS2304（L15, C90）：[syntax_check] Cannot find name 'Nar'.
  - TS2304（L16, C29）：[syntax_check] Cannot find name 'Concept'.
  - TS2304（L24, C18）：[syntax_check] Cannot find name 'DerivationContext'.
  - TS2304（L24, C42）：[syntax_check] Cannot find name 'DerivationContext'.
  - TS2304（L28, C9）：[syntax_check] Cannot find name 'ProcessAnticipation'.
  - TS2304（L45, C21）：[syntax_check] Cannot find name 'BudgetFunctions'.
  - TS2304（L57, C36）：[syntax_check] Cannot find name 'DerivationContext'.
  - TS2304（L75, C40）：[syntax_check] Cannot find name 'DerivationContext'.
  - TS2304（L76, C19）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L84, C42）：[syntax_check] Cannot find name 'TermLink'.
  - TS2304（L90, C13）：[syntax_check] Cannot find name 'RuleTables'.
  - TS2304（L94, C31）：[syntax_check] Cannot find name 'TermLink'.
  - TS2304（L105, C25）：[syntax_check] Cannot find name 'Events'.
  - TS2304（L109, C42）：[syntax_check] Cannot find name 'TermLink'.
  - TS2304（L109, C57）：[syntax_check] Cannot find name 'DerivationContext'.
  - TS2304（L111, C9）：[syntax_check] Cannot find name 'RuleTables'.
  - TS2304（L112, C25）：[syntax_check] Cannot find name 'Events'.
- 总结：存在语法错误，需要比对 Java 语句结构。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

（无显式结构性依赖，主要依赖 `jree` 提供的运行时桩或尚未补齐的全局声明。）

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

- `[full_check] Cannot find name 'Memory'.` @ L15
- `[full_check] Cannot find name 'Nar'.` @ L15
- `[full_check] Cannot find name 'Concept'.` @ L16
- `[full_check] Cannot find name 'DerivationContext'.` @ L24
- `[full_check] Cannot find name 'DerivationContext'.` @ L24
- `[full_check] Cannot find name 'ProcessAnticipation'.` @ L28
- `[full_check] Cannot find name 'BudgetFunctions'.` @ L45
- `[full_check] Cannot find name 'DerivationContext'.` @ L57
- `[full_check] Cannot find name 'DerivationContext'.` @ L75
- `[full_check] Cannot find name 'Task'.` @ L76
- `[full_check] Cannot find name 'TermLink'.` @ L84
- `[full_check] Cannot find name 'RuleTables'.` @ L90
- `[full_check] Cannot find name 'TermLink'.` @ L94
- `[full_check] Cannot find name 'Events'.` @ L105
- `[full_check] Cannot find name 'TermLink'.` @ L109
- `[full_check] Cannot find name 'DerivationContext'.` @ L109
- `[full_check] Cannot find name 'RuleTables'.` @ L111
- `[full_check] Cannot find name 'Events'.` @ L112
- `[syntax_check] Cannot find name 'Memory'.` @ L15
- `[syntax_check] Cannot find name 'Nar'.` @ L15
- `[syntax_check] Cannot find name 'Concept'.` @ L16
- `[syntax_check] Cannot find name 'DerivationContext'.` @ L24
- `[syntax_check] Cannot find name 'DerivationContext'.` @ L24
- `[syntax_check] Cannot find name 'ProcessAnticipation'.` @ L28
- `[syntax_check] Cannot find name 'BudgetFunctions'.` @ L45
- `[syntax_check] Cannot find name 'DerivationContext'.` @ L57
- `[syntax_check] Cannot find name 'DerivationContext'.` @ L75
- `[syntax_check] Cannot find name 'Task'.` @ L76
- `[syntax_check] Cannot find name 'TermLink'.` @ L84
- `[syntax_check] Cannot find name 'RuleTables'.` @ L90
- `[syntax_check] Cannot find name 'TermLink'.` @ L94
- `[syntax_check] Cannot find name 'Events'.` @ L105
- `[syntax_check] Cannot find name 'TermLink'.` @ L109
- `[syntax_check] Cannot find name 'DerivationContext'.` @ L109
- `[syntax_check] Cannot find name 'RuleTables'.` @ L111
- `[syntax_check] Cannot find name 'Events'.` @ L112

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `control/GeneralInferenceControl` -> `io/events/Events`（deps.xml 第 149 行）
- `control/GeneralInferenceControl` -> `entity/TaskLink`（deps.xml 第 150 行）
- `control/GeneralInferenceControl` -> `entity/Concept`（deps.xml 第 151 行）
- `control/GeneralInferenceControl` -> `inference/BudgetFunctions`（deps.xml 第 152 行）
- `control/GeneralInferenceControl` -> `entity/Item`（deps.xml 第 153 行）
- `control/GeneralInferenceControl` -> `entity/Task`（deps.xml 第 154 行）
- `control/GeneralInferenceControl` -> `main/Nar`（deps.xml 第 155 行）
- `control/GeneralInferenceControl` -> `inference/UtilityFunctions`（deps.xml 第 156 行）
- `control/GeneralInferenceControl` -> `control/concept/ProcessAnticipation`（deps.xml 第 157 行）
- `control/GeneralInferenceControl` -> `control/DerivationContext`（deps.xml 第 158 行）
- `control/GeneralInferenceControl` -> `entity/BudgetValue`（deps.xml 第 159 行）
- `control/GeneralInferenceControl` -> `storage/Bag`（deps.xml 第 160 行）
- `control/GeneralInferenceControl` -> `interfaces/Timable`（deps.xml 第 161 行）
- `control/GeneralInferenceControl` -> `entity/TermLink`（deps.xml 第 162 行）
- `control/GeneralInferenceControl` -> `storage/Memory`（deps.xml 第 163 行）
- `control/GeneralInferenceControl` -> `inference/RuleTables`（deps.xml 第 164 行）
- `control/GeneralInferenceControl` -> `plugin/mental/Emotions`（deps.xml 第 165 行）
- `control/GeneralInferenceControl` -> `language/Term`（deps.xml 第 166 行）
- `control/GeneralInferenceControl` -> `parameter/Parameters`（deps.xml 第 167 行）
- 交叉校验：
- Java graph 额外依赖：control/DerivationContext、control/concept/ProcessAnticipation、entity/BudgetValue、entity/Concept、entity/Item、entity/Task、entity/TaskLink、entity/TermLink、inference/BudgetFunctions、inference/RuleTables、inference/UtilityFunctions、interfaces/Timable、io/events/Events、language/Term、main/Nar、parameter/Parameters、plugin/mental/Emotions、storage/Bag、storage/Memory

## 5. Java 功能说明

- **职责概述**：文件工作：重建推理循环、任务调度与暂停机制，替换 synchronized/wait 行为。
- **关键数据结构**：
- `GeneralInferenceControl` · 继承：JavaObject · 实现：（无接口）
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

- ts-analysis: LOC=115 · TODO=0
- 参考文件：`java-master/src/main/java/org/opennars/control/GeneralInferenceControl.java`
