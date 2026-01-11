# src/plugin/mental/ComplexEmotions.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/plugin/mental/ComplexEmotions.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/plugin/mental/ComplexEmotions.java` |
| 模块链路 | `language 基座 -> entity -> operator -> plugin 扩展层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/plugin/mental/ComplexEmotions.ts --noEmit`）

- 执行的命令：`npx tsc src/plugin/mental/ComplexEmotions.ts --noEmit`
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
- `plugin/mental/ComplexEmotions` -> `io/events/Events`（deps.xml 第 1226 行）
- `plugin/mental/ComplexEmotions` -> `entity/TruthValue`（deps.xml 第 1227 行）
- `plugin/mental/ComplexEmotions` -> `entity/Concept`（deps.xml 第 1228 行）
- `plugin/mental/ComplexEmotions` -> `plugin/Plugin`（deps.xml 第 1229 行）
- `plugin/mental/ComplexEmotions` -> `io/events/EventEmitter`（deps.xml 第 1230 行）
- `plugin/mental/ComplexEmotions` -> `entity/Item`（deps.xml 第 1231 行）
- `plugin/mental/ComplexEmotions` -> `inference/LocalRules`（deps.xml 第 1232 行）
- `plugin/mental/ComplexEmotions` -> `entity/Task`（deps.xml 第 1233 行）
- `plugin/mental/ComplexEmotions` -> `main/Nar`（deps.xml 第 1234 行）
- `plugin/mental/ComplexEmotions` -> `storage/Memory`（deps.xml 第 1235 行）
- `plugin/mental/ComplexEmotions` -> `language/Term`（deps.xml 第 1236 行）
- `plugin/mental/ComplexEmotions` -> `entity/Sentence`（deps.xml 第 1237 行）
- 交叉校验：
- Java graph 额外依赖：entity/Concept、entity/Item、entity/Sentence、entity/Task、entity/TruthValue、inference/LocalRules、io/events/EventEmitter、io/events/Events、language/Term、main/Nar、plugin/Plugin、storage/Memory

## 5. Java 功能说明

- **职责概述**：文件工作：为心理/感知插件提供事件通道、状态缓存与关闭流程。
- **关键数据结构**：
- `ComplexEmotions` · 继承：JavaObject · 实现：Plugin
- **核心流程 / 算法**：
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：为心理/感知插件提供事件通道、状态缓存与关闭流程。
  3. Java-TS 差异：参见《通用转译法.md》 - 插件
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `Java Memory/Task 接口` 衔接上下游。

## 6. 一致性风险

- 缺少显式 import，需依赖 Java/ts-analysis 交叉校验。

## 7. 路线图定位

- 1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
- 2. 文件工作：为心理/感知插件提供事件通道、状态缓存与关闭流程。
- 3. Java-TS 差异：参见《通用转译法.md》 - 插件

## 8. 附加记录

- ts-analysis: LOC=59 · TODO=0
- 参考文件：`java-master/src/main/java/org/opennars/plugin/mental/ComplexEmotions.java`
