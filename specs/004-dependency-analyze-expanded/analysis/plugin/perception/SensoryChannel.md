# src/plugin/perception/SensoryChannel.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/plugin/perception/SensoryChannel.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/plugin/perception/SensoryChannel.java` |
| 模块链路 | `language 基座 -> entity -> operator -> plugin 扩展层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/plugin/perception/SensoryChannel.ts --noEmit`）

- 执行的命令：`npx tsc src/plugin/perception/SensoryChannel.ts --noEmit`
- 关键输出：
  - TS1135（L144, C31）：Argument expression expected.
  - TS1005（L144, C48）：',' expected.
- 总结：存在语法错误，需要比对 Java 语句结构。；编译失败：TS1135 @ 144:31 Argument expression expected.，另有 1 条 ; 暂无针对性测试

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
- `plugin/perception/SensoryChannel` -> `io/Parser`（deps.xml 第 1306 行）
- `plugin/perception/SensoryChannel` -> `entity/Concept`（deps.xml 第 1307 行）
- `plugin/perception/SensoryChannel` -> `plugin/Plugin`（deps.xml 第 1308 行）
- `plugin/perception/SensoryChannel` -> `entity/Item`（deps.xml 第 1309 行）
- `plugin/perception/SensoryChannel` -> `entity/Task`（deps.xml 第 1310 行）
- `plugin/perception/SensoryChannel` -> `main/Nar`（deps.xml 第 1311 行）
- `plugin/perception/SensoryChannel` -> `io/Narsese`（deps.xml 第 1312 行）
- `plugin/perception/SensoryChannel` -> `interfaces/Timable`（deps.xml 第 1313 行）
- `plugin/perception/SensoryChannel` -> `storage/Memory`（deps.xml 第 1314 行）
- `plugin/perception/SensoryChannel` -> `language/Term`（deps.xml 第 1315 行）
- 交叉校验：
- Java graph 额外依赖：entity/Concept、entity/Item、entity/Task、interfaces/Timable、io/Narsese、io/Parser、language/Term、main/Nar、plugin/Plugin、storage/Memory

## 5. Java 功能说明

- **职责概述**：文件工作：为心理/感知插件提供事件通道、状态缓存与关闭流程。；tsc TS1135 @ 144:31 错误
- **关键数据结构**：
- `SensoryChannel` · 继承：JavaObject · 实现：Plugin
- **核心流程 / 算法**：
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：为心理/感知插件提供事件通道、状态缓存与关闭流程。；tsc TS1135 @ 144:31 错误
  3. Java-TS 差异：参见《通用转译法.md》 - 插件
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `Java Memory/Task 接口` 衔接上下游。

## 6. 一致性风险

- `tsc` 报错阻塞进一步分析，需要回填语句结构。
- 缺少显式 import，需依赖 Java/ts-analysis 交叉校验。

## 7. 路线图定位

- 1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
- 2. 文件工作：为心理/感知插件提供事件通道、状态缓存与关闭流程。；tsc TS1135 @ 144:31 错误
- 3. Java-TS 差异：参见《通用转译法.md》 - 插件

## 8. 附加记录

- ts-analysis: LOC=147 · TODO=0
- 参考文件：`java-master/src/main/java/org/opennars/plugin/perception/SensoryChannel.java`
