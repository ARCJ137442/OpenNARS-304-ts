# src/main/Shell.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/main/Shell.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/main/Shell.java` |
| 模块链路 | `language 基座 -> entity -> control -> main 应用层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/main/Shell.ts --noEmit`）

- 执行的命令：`npx tsc src/main/Shell.ts --noEmit`
- 关键输出：
  - TS1359（L107, C35）：Identifier expected. 'in' is a reserved word that cannot be used here.
  - TS1109（L109, C87）：Expression expected.
  - TS1109（L109, C89）：Expression expected.
- 总结：存在语法错误，需要比对 Java 语句结构。；编译失败：TS1359 @ 107:35 Identifier expected. 'in' is a reserved word that cannot be used here.，另有 2 条 ; 暂无针对性测试

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
- `main/Shell` -> `io/events/TextOutputHandler`（deps.xml 第 920 行）
- `main/Shell` -> `main/NarNode`（deps.xml 第 921 行）
- `main/Shell` -> `language/Term`（deps.xml 第 922 行）
- `main/Shell` -> `parameter/Debug`（deps.xml 第 923 行）
- `main/Shell` -> `main/Nar`（deps.xml 第 924 行）
- 交叉校验：
- Java graph 额外依赖：io/events/TextOutputHandler、language/Term、main/Nar、main/NarNode、parameter/Debug

## 5. Java 功能说明

- **职责概述**：文件工作：把 Nar/NarNode/Shell 生命周期、线程和 CLI 搭到 Node 异步控制器上。；tsc TS1359 @ 107:35 错误；TODO 1 处
- **关键数据结构**：
- `Shell` · 继承：JavaObject · 实现：（无接口）
- **核心流程 / 算法**：
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：把 Nar/NarNode/Shell 生命周期、线程和 CLI 搭到 Node 异步控制器上。；tsc TS1359 @ 107:35 错误；TODO 1 处
  3. Java-TS 差异：参见《通用转译法.md》 - 主程序
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `Java Memory/Task 接口` 衔接上下游。

## 6. 一致性风险

- 文件内仍保留 1 处 TODO，需对照 Java 填补。
- `tsc` 报错阻塞进一步分析，需要回填语句结构。
- 缺少显式 import，需依赖 Java/ts-analysis 交叉校验。

## 7. 路线图定位

- 1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
- 2. 文件工作：把 Nar/NarNode/Shell 生命周期、线程和 CLI 搭到 Node 异步控制器上。；tsc TS1359 @ 107:35 错误；TODO 1 处
- 3. Java-TS 差异：参见《通用转译法.md》 - 主程序

## 8. 附加记录

- ts-analysis: LOC=195 · TODO=1
- 参考文件：`java-master/src/main/java/org/opennars/main/Shell.java`
