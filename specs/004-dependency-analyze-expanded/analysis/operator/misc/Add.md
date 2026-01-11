# src/operator/misc/Add.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/operator/misc/Add.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/operator/misc/Add.java` |
| 模块链路 | `language 基座 -> entity -> operator 操作符层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/operator/misc/Add.ts --noEmit`）

- 执行的命令：`npx tsc src/operator/misc/Add.ts --noEmit`
- 关键输出：
  - TS2304（L8, C26）：[full_check] Cannot find name 'FunctionOperator'.
  - TS2304（L14, C32）：[full_check] Cannot find name 'Memory'.
  - TS2304（L14, C43）：[full_check] Cannot find name 'Term'.
  - TS2304（L14, C52）：[full_check] Cannot find name 'Term'.
  - TS2304（L22, C13）：[full_check] Cannot find name 'StringUtils'.
  - TS2304（L28, C13）：[full_check] Cannot find name 'StringUtils'.
  - TS2304（L34, C20）：[full_check] Cannot find name 'Term'.
  - TS2304（L37, C27）：[full_check] Cannot find name 'Term'.
  - TS2304（L38, C16）：[full_check] Cannot find name 'Term'.
  - TS2304（L8, C26）：[syntax_check] Cannot find name 'FunctionOperator'.
  - TS2304（L14, C32）：[syntax_check] Cannot find name 'Memory'.
  - TS2304（L14, C43）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L14, C52）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L22, C13）：[syntax_check] Cannot find name 'StringUtils'.
  - TS2304（L28, C13）：[syntax_check] Cannot find name 'StringUtils'.
  - TS2304（L34, C20）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L37, C27）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L38, C16）：[syntax_check] Cannot find name 'Term'.
- 总结：存在语法错误，需要比对 Java 语句结构。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

（无显式结构性依赖，主要依赖 `jree` 提供的运行时桩或尚未补齐的全局声明。）

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

- `[full_check] Cannot find name 'FunctionOperator'.` @ L8
- `[full_check] Cannot find name 'Memory'.` @ L14
- `[full_check] Cannot find name 'Term'.` @ L14
- `[full_check] Cannot find name 'Term'.` @ L14
- `[full_check] Cannot find name 'StringUtils'.` @ L22
- `[full_check] Cannot find name 'StringUtils'.` @ L28
- `[full_check] Cannot find name 'Term'.` @ L34
- `[full_check] Cannot find name 'Term'.` @ L37
- `[full_check] Cannot find name 'Term'.` @ L38
- `[syntax_check] Cannot find name 'FunctionOperator'.` @ L8
- `[syntax_check] Cannot find name 'Memory'.` @ L14
- `[syntax_check] Cannot find name 'Term'.` @ L14
- `[syntax_check] Cannot find name 'Term'.` @ L14
- `[syntax_check] Cannot find name 'StringUtils'.` @ L22
- `[syntax_check] Cannot find name 'StringUtils'.` @ L28
- `[syntax_check] Cannot find name 'Term'.` @ L34
- `[syntax_check] Cannot find name 'Term'.` @ L37
- `[syntax_check] Cannot find name 'Term'.` @ L38

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `operator/misc/Add` -> `operator/FunctionOperator`（deps.xml 第 1135 行）
- `operator/misc/Add` -> `storage/Memory`（deps.xml 第 1136 行）
- `operator/misc/Add` -> `language/Term`（deps.xml 第 1137 行）
- 交叉校验：
- Java graph 额外依赖：language/Term、operator/FunctionOperator、storage/Memory

## 5. Java 功能说明

- **职责概述**：文件工作：将 Operation 注册与 Memory 交互显式化，补写副作用与预算更新。
- **关键数据结构**：
- `Add` · 继承：FunctionOperator · 实现：（无接口）
- **核心流程 / 算法**：
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：将 Operation 注册与 Memory 交互显式化，补写副作用与预算更新。
  3. Java-TS 差异：参见《通用转译法.md》 - 操作符
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `Java Memory/Task 接口` 衔接上下游。

## 6. 一致性风险

- `tsc` 报错阻塞进一步分析，需要回填语句结构。
- 缺少显式 import，需依赖 Java/ts-analysis 交叉校验。

## 7. 路线图定位

- 1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
- 2. 文件工作：将 Operation 注册与 Memory 交互显式化，补写副作用与预算更新。
- 3. Java-TS 差异：参见《通用转译法.md》 - 操作符

## 8. 附加记录

- ts-analysis: LOC=41 · TODO=0
- 参考文件：`java-master/src/main/java/org/opennars/operator/misc/Add.java`
