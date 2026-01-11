# src/operator/Operator.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/operator/Operator.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/operator/Operator.java` |
| 模块链路 | `language 基座 -> entity -> operator 操作符层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/operator/Operator.ts --noEmit`）

- 执行的命令：`npx tsc src/operator/Operator.ts --noEmit`
- 关键输出：
  - 无报错
- 总结：命令通过，未触发额外依赖。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

| 符号 | 来源文件 | 触发位置 | 依赖原因 |
| --- | --- | --- | --- |
| `Term` | `src/language/Term.ts` | import | 结构性：Operator 直接使用 Term 的主流程 |
| `Operation` | `src/operator/Operation.ts` | import | 结构性：Operator 直接使用 Operation 的主流程 |
| `Memory` | `src/storage/Memory.ts` | import | 结构性：Operator 直接使用 Memory 的主流程 |
| `Timable` | `src/interfaces/Timable.ts` | import | 结构性：Operator 直接使用 Timable 的主流程 |
| `Task` | `src/entity/Task.ts` | import | 结构性：Operator 直接使用 Task 的主流程 |
| `Nar` | `src/main/Nar.ts` | import | 结构性：Operator 直接使用 Nar 的主流程 |

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

（无缺失符号，报错均与语法结构相关。）

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `operator/Operator` -> `entity/TruthValue`（deps.xml 第 1183 行）
- `operator/Operator` -> `language/CompoundTerm`（deps.xml 第 1184 行）
- `operator/Operator` -> `language/Statement`（deps.xml 第 1185 行）
- `operator/Operator` -> `entity/Item`（deps.xml 第 1186 行）
- `operator/Operator` -> `entity/Task`（deps.xml 第 1187 行）
- `operator/Operator` -> `entity/BudgetValue`（deps.xml 第 1188 行）
- `operator/Operator` -> `interfaces/Timable`（deps.xml 第 1189 行）
- `operator/Operator` -> `language/Product`（deps.xml 第 1190 行）
- `operator/Operator` -> `language/Term`（deps.xml 第 1191 行）
- `operator/Operator` -> `parameter/Debug`（deps.xml 第 1192 行）
- `operator/Operator` -> `parameter/Parameters`（deps.xml 第 1193 行）
- `operator/Operator` -> `io/events/OutputHandler`（deps.xml 第 1194 行）
- `operator/Operator` -> `plugin/Plugin`（deps.xml 第 1195 行）
- `operator/Operator` -> `io/events/EventEmitter`（deps.xml 第 1196 行）
- `operator/Operator` -> `main/Nar`（deps.xml 第 1197 行）
- `operator/Operator` -> `operator/Operation`（deps.xml 第 1198 行）
- `operator/Operator` -> `storage/Memory`（deps.xml 第 1199 行）
- 交叉校验：
- Java graph 额外依赖：entity/BudgetValue、entity/Item、entity/TruthValue、io/events/EventEmitter、io/events/OutputHandler、language/CompoundTerm、language/Product、language/Statement、parameter/Debug、parameter/Parameters、plugin/Plugin

## 5. Java 功能说明

- **职责概述**：文件工作：将 Operation 注册与 Memory 交互显式化，补写副作用与预算更新。
- **关键数据结构**：
- `Operator` · 继承：Term · 实现：Plugin
- **核心流程 / 算法**：
  1. 依赖准备：依赖：language/Term.ts, operator/Operation.ts, storage/Memory.ts, interfaces/Timable.ts, entity/Task.ts, main/Nar.ts
  2. 文件工作：将 Operation 注册与 Memory 交互显式化，补写副作用与预算更新。
  3. Java-TS 差异：参见《通用转译法.md》 - 操作符
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `entity/Task, interfaces/Timable, language/Term, main/Nar, operator/Operation, storage/Memory` 衔接上下游。

## 6. 一致性风险

- 主要风险来自尚未补齐的 Java 语义与单元测试缺失。

## 7. 路线图定位

- 1. 依赖准备：依赖：language/Term.ts, operator/Operation.ts, storage/Memory.ts, interfaces/Timable.ts, entity/Task.ts, main/Nar.ts
- 2. 文件工作：将 Operation 注册与 Memory 交互显式化，补写副作用与预算更新。
- 3. Java-TS 差异：参见《通用转译法.md》 - 操作符

## 8. 附加记录

- ts-analysis: LOC=222 · TODO=0
- 参考文件：`java-master/src/main/java/org/opennars/operator/Operator.java`
