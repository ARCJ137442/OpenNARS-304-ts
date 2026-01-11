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
  - 无报错
- 总结：命令通过，未触发额外依赖。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

（无显式结构性依赖，主要依赖 `jree` 提供的运行时桩或尚未补齐的全局声明。）

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

（无缺失符号，报错均与语法结构相关。）

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
- 缺少显式 import，需依赖 Java/ts-analysis 交叉校验。

## 7. 路线图定位

- 1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
- 2. 文件工作：重建推理循环、任务调度与暂停机制，替换 synchronized/wait 行为。；TODO 1 处
- 3. Java-TS 差异：参见《通用转译法.md》 - 控制与调度

## 8. 附加记录

- ts-analysis: LOC=235 · TODO=1
- 参考文件：`java-master/src/main/java/org/opennars/control/TemporalInferenceControl.java`
