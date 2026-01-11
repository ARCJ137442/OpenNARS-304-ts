# src/plugin/Plugin.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/plugin/Plugin.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/plugin/Plugin.java` |
| 模块链路 | `language 基座 -> entity -> operator -> plugin 扩展层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/plugin/Plugin.ts --noEmit`）

- 执行的命令：`npx tsc src/plugin/Plugin.ts --noEmit`
- 关键输出：
  - TS2689（L8, C31）：[full_check] Cannot extend an interface 'java.io.Serializable'. Did you mean 'implements'?
  - TS1245（L14, C24）：[full_check] Method 'setEnabled' cannot have an implementation because it is marked abstract.
  - TS2304（L14, C38）：[full_check] Cannot find name 'Nar'.
  - TS1245（L18, C24）：[full_check] Method 'name' cannot have an implementation because it is marked abstract.
  - TS2339（L19, C21）：[full_check] Property 'getClass' does not exist on type 'Plugin'.
  - TS2689（L8, C31）：[syntax_check] Cannot extend an interface 'java.io.Serializable'. Did you mean 'implements'?
  - TS1245（L14, C24）：[syntax_check] Method 'setEnabled' cannot have an implementation because it is marked abstract.
  - TS2304（L14, C38）：[syntax_check] Cannot find name 'Nar'.
  - TS1245（L18, C24）：[syntax_check] Method 'name' cannot have an implementation because it is marked abstract.
  - TS2339（L19, C21）：[syntax_check] Property 'getClass' does not exist on type 'Plugin'.
- 总结：存在语法错误，需要比对 Java 语句结构。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

（无显式结构性依赖，主要依赖 `jree` 提供的运行时桩或尚未补齐的全局声明。）

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

- `[full_check] Cannot find name 'Nar'.` @ L14
- `[syntax_check] Cannot find name 'Nar'.` @ L14

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `plugin/Plugin` -> `main/Nar`（deps.xml 第 1361 行）
- 交叉校验：
- Java graph 额外依赖：main/Nar

## 5. Java 功能说明

- **职责概述**：文件工作：为心理/感知插件提供事件通道、状态缓存与关闭流程。
- **关键数据结构**：
- `Plugin` · 继承：java.io.Serializable · 实现：（无接口）
- **核心流程 / 算法**：
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：为心理/感知插件提供事件通道、状态缓存与关闭流程。
  3. Java-TS 差异：参见《通用转译法.md》 - 插件
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `Java Memory/Task 接口` 衔接上下游。

## 6. 一致性风险

- `tsc` 报错阻塞进一步分析，需要回填语句结构。
- 缺少显式 import，需依赖 Java/ts-analysis 交叉校验。

## 7. 路线图定位

- 1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
- 2. 文件工作：为心理/感知插件提供事件通道、状态缓存与关闭流程。
- 3. Java-TS 差异：参见《通用转译法.md》 - 插件

## 8. 附加记录

- ts-analysis: LOC=21 · TODO=0
- 参考文件：`java-master/src/main/java/org/opennars/plugin/Plugin.java`
