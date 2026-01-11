# src/entity/TaskLink.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/entity/TaskLink.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/entity/TaskLink.java` |
| 模块链路 | `language 基座 -> entity 实体层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/entity/TaskLink.ts --noEmit`）

- 执行的命令：`npx tsc src/entity/TaskLink.ts --noEmit`
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
- `entity/TaskLink` -> `entity/TLink`（deps.xml 第 266 行）
- `entity/TaskLink` -> `entity/Item`（deps.xml 第 267 行）
- `entity/TaskLink` -> `entity/Task`（deps.xml 第 268 行）
- `entity/TaskLink` -> `entity/BudgetValue`（deps.xml 第 269 行）
- `entity/TaskLink` -> `entity/TermLink`（deps.xml 第 270 行）
- `entity/TaskLink` -> `language/Term`（deps.xml 第 271 行）
- `entity/TaskLink` -> `entity/Sentence`（deps.xml 第 272 行）
- `entity/TaskLink` -> `parameter/Parameters`（deps.xml 第 273 行）
- 交叉校验：
- Java graph 额外依赖：entity/BudgetValue、entity/Item、entity/Sentence、entity/TLink、entity/Task、entity/TermLink、language/Term、parameter/Parameters

## 5. Java 功能说明

- **职责概述**：文件工作：保持 Stamp/TruthValue 等值对象的不可变语义，补齐 clone/equals/hash 与序列化。
- **关键数据结构**：
- `TaskLink` · 继承：Item<Task> · 实现：TLink<Task>
- **核心流程 / 算法**：
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：保持 Stamp/TruthValue 等值对象的不可变语义，补齐 clone/equals/hash 与序列化。
  3. Java-TS 差异：参见《通用转译法.md》 - 实体与序列化
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `Java Memory/Task 接口` 衔接上下游。

## 6. 一致性风险

- 缺少显式 import，需依赖 Java/ts-analysis 交叉校验。

## 7. 路线图定位

- 1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
- 2. 文件工作：保持 Stamp/TruthValue 等值对象的不可变语义，补齐 clone/equals/hash 与序列化。
- 3. Java-TS 差异：参见《通用转译法.md》 - 实体与序列化

## 8. 附加记录

- ts-analysis: LOC=218 · TODO=0
- 参考文件：`java-master/src/main/java/org/opennars/entity/TaskLink.java`
