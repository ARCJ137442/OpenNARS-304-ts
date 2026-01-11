# src/plugin/perception/VisualSpace.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/plugin/perception/VisualSpace.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/plugin/perception/VisualSpace.java` |
| 模块链路 | `language 基座 -> entity -> operator -> plugin 扩展层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/plugin/perception/VisualSpace.ts --noEmit`）

- 执行的命令：`npx tsc src/plugin/perception/VisualSpace.ts --noEmit`
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
- `plugin/perception/VisualSpace` -> `operator/ImaginationSpace`（deps.xml 第 1346 行）
- `plugin/perception/VisualSpace` -> `operator/Operator`（deps.xml 第 1347 行）
- `plugin/perception/VisualSpace` -> `entity/TruthValue`（deps.xml 第 1348 行）
- `plugin/perception/VisualSpace` -> `language/CompoundTerm`（deps.xml 第 1349 行）
- `plugin/perception/VisualSpace` -> `inference/TemporalRules`（deps.xml 第 1350 行）
- `plugin/perception/VisualSpace` -> `language/Statement`（deps.xml 第 1351 行）
- `plugin/perception/VisualSpace` -> `main/Nar`（deps.xml 第 1352 行）
- `plugin/perception/VisualSpace` -> `operator/Operation`（deps.xml 第 1353 行）
- `plugin/perception/VisualSpace` -> `language/Conjunction`（deps.xml 第 1354 行）
- `plugin/perception/VisualSpace` -> `inference/TruthFunctions`（deps.xml 第 1355 行）
- `plugin/perception/VisualSpace` -> `operator/NullOperator`（deps.xml 第 1356 行）
- `plugin/perception/VisualSpace` -> `language/Term`（deps.xml 第 1357 行）
- `plugin/perception/VisualSpace` -> `parameter/Parameters`（deps.xml 第 1358 行）
- 交叉校验：
- Java graph 额外依赖：entity/TruthValue、inference/TemporalRules、inference/TruthFunctions、language/CompoundTerm、language/Conjunction、language/Statement、language/Term、main/Nar、operator/ImaginationSpace、operator/NullOperator、operator/Operation、operator/Operator、parameter/Parameters

## 5. Java 功能说明

- **职责概述**：文件工作：为心理/感知插件提供事件通道、状态缓存与关闭流程。；TODO 4 处
- **关键数据结构**：
- `VisualSpace` · 继承：JavaObject · 实现：ImaginationSpace
- **核心流程 / 算法**：
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：为心理/感知插件提供事件通道、状态缓存与关闭流程。；TODO 4 处
  3. Java-TS 差异：参见《通用转译法.md》 - 插件
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `Java Memory/Task 接口` 衔接上下游。

## 6. 一致性风险

- 文件内仍保留 4 处 TODO，需对照 Java 填补。
- 缺少显式 import，需依赖 Java/ts-analysis 交叉校验。

## 7. 路线图定位

- 1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
- 2. 文件工作：为心理/感知插件提供事件通道、状态缓存与关闭流程。；TODO 4 处
- 3. Java-TS 差异：参见《通用转译法.md》 - 插件

## 8. 附加记录

- ts-analysis: LOC=137 · TODO=4
- 参考文件：`java-master/src/main/java/org/opennars/plugin/perception/VisualSpace.java`
