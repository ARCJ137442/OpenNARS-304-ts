# src/operator/misc/Reflect.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/operator/misc/Reflect.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/operator/misc/Reflect.java` |
| 模块链路 | `language 基座 -> entity -> operator 操作符层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/operator/misc/Reflect.ts --noEmit`）

- 执行的命令：`npx tsc src/operator/misc/Reflect.ts --noEmit`
- 关键输出：
  - TS2304（L10, C30）：[full_check] Cannot find name 'FunctionOperator'.
  - TS2304（L21, C32）：[full_check] Cannot find name 'Memory'.
  - TS2304（L21, C43）：[full_check] Cannot find name 'Term'.
  - TS2304（L21, C52）：[full_check] Cannot find name 'Term'.
  - TS2304（L27, C22）：[full_check] Cannot find name 'Term'.
  - TS2304（L32, C26）：[full_check] Cannot find name 'Statement'.
  - TS2304（L32, C70）：[full_check] Cannot find name 'Term'.
  - TS2304（L34, C26）：[full_check] Cannot find name 'Statement'.
  - TS2304（L34, C48）：[full_check] Cannot find name 'Term'.
  - TS2304（L34, C55）：[full_check] Cannot find name 'Term'.
  - TS2304（L36, C61）：[full_check] Cannot find name 'Term'.
  - TS2304（L36, C70）：[full_check] Cannot find name 'Term'.
  - TS2304（L45, C32）：[full_check] Cannot find name 'Term'.
  - TS2304（L45, C46）：[full_check] Cannot find name 'Term'.
  - TS2304（L45, C63）：[full_check] Cannot find name 'Term'.
  - TS2304（L45, C70）：[full_check] Cannot find name 'Term'.
  - TS2304（L46, C44）：[full_check] Cannot find name 'Term'.
  - TS2304（L49, C52）：[full_check] Cannot find name 'Statement'.
  - TS2304（L52, C24）：[full_check] Cannot find name 'Inheritance'.
  - TS2304（L52, C41）：[full_check] Cannot find name 'Product'.
  - TS2304（L53, C21）：[full_check] Cannot find name 'Term'.
  - TS2304（L60, C49）：[full_check] Cannot find name 'Statement'.
  - TS2304（L60, C60）：[full_check] Cannot find name 'Term'.
  - TS2304（L63, C24）：[full_check] Cannot find name 'Inheritance'.
  - TS2304（L63, C41）：[full_check] Cannot find name 'Product'.
  - TS2304（L70, C70）：[full_check] Cannot find name 'Term'.
  - TS2304（L73, C24）：[full_check] Cannot find name 'Term'.
  - TS2304（L73, C43）：[full_check] Cannot find name 'Term'.
  - TS2304（L78, C24）：[full_check] Cannot find name 'Inheritance'.
  - TS2304（L78, C41）：[full_check] Cannot find name 'Product'.
  - TS2304（L78, C58）：[full_check] Cannot find name 'Term'.
  - TS2304（L85, C63）：[full_check] Cannot find name 'Term'.
  - TS2304（L85, C69）：[full_check] Cannot find name 'Term'.
  - TS2304（L85, C75）：[full_check] Cannot find name 'Term'.
  - TS2304（L88, C24）：[full_check] Cannot find name 'Inheritance'.
  - TS2304（L88, C41）：[full_check] Cannot find name 'Product'.
  - TS2304（L101, C37）：[full_check] Cannot find name 'Term'.
  - TS2304（L101, C44）：[full_check] Cannot find name 'Term'.
  - TS2304（L102, C31）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L105, C16）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L105, C39）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L107, C18）：[full_check] Cannot find name 'INHERITANCE'.
  - TS2304（L108, C41）：[full_check] Cannot find name 'Inheritance'.
  - TS2304（L109, C18）：[full_check] Cannot find name 'SIMILARITY'.
  - TS2304（L110, C41）：[full_check] Cannot find name 'Similarity'.
  - TS2304（L117, C27）：[full_check] Cannot find name 'Term'.
  - TS2304（L118, C16）：[full_check] Cannot find name 'Term'.
  - TS2304（L10, C30）：[syntax_check] Cannot find name 'FunctionOperator'.
  - TS2304（L21, C32）：[syntax_check] Cannot find name 'Memory'.
  - TS2304（L21, C43）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L21, C52）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L27, C22）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L32, C26）：[syntax_check] Cannot find name 'Statement'.
  - TS2304（L32, C70）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L34, C26）：[syntax_check] Cannot find name 'Statement'.
  - TS2304（L34, C48）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L34, C55）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L36, C61）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L36, C70）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L45, C32）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L45, C46）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L45, C63）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L45, C70）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L46, C44）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L49, C52）：[syntax_check] Cannot find name 'Statement'.
  - TS2304（L52, C24）：[syntax_check] Cannot find name 'Inheritance'.
  - TS2304（L52, C41）：[syntax_check] Cannot find name 'Product'.
  - TS2304（L53, C21）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L60, C49）：[syntax_check] Cannot find name 'Statement'.
  - TS2304（L60, C60）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L63, C24）：[syntax_check] Cannot find name 'Inheritance'.
  - TS2304（L63, C41）：[syntax_check] Cannot find name 'Product'.
  - TS2304（L70, C70）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L73, C24）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L73, C43）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L78, C24）：[syntax_check] Cannot find name 'Inheritance'.
  - TS2304（L78, C41）：[syntax_check] Cannot find name 'Product'.
  - TS2304（L78, C58）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L85, C63）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L85, C69）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L85, C75）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L88, C24）：[syntax_check] Cannot find name 'Inheritance'.
  - TS2304（L88, C41）：[syntax_check] Cannot find name 'Product'.
  - TS2304（L101, C37）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L101, C44）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L102, C31）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L105, C16）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L105, C39）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L107, C18）：[syntax_check] Cannot find name 'INHERITANCE'.
  - TS2304（L108, C41）：[syntax_check] Cannot find name 'Inheritance'.
  - TS2304（L109, C18）：[syntax_check] Cannot find name 'SIMILARITY'.
  - TS2304（L110, C41）：[syntax_check] Cannot find name 'Similarity'.
  - TS2304（L117, C27）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L118, C16）：[syntax_check] Cannot find name 'Term'.
- 总结：存在语法错误，需要比对 Java 语句结构。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

（无显式结构性依赖，主要依赖 `jree` 提供的运行时桩或尚未补齐的全局声明。）

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

- `[full_check] Cannot find name 'FunctionOperator'.` @ L10
- `[full_check] Cannot find name 'Memory'.` @ L21
- `[full_check] Cannot find name 'Term'.` @ L21
- `[full_check] Cannot find name 'Term'.` @ L21
- `[full_check] Cannot find name 'Term'.` @ L27
- `[full_check] Cannot find name 'Statement'.` @ L32
- `[full_check] Cannot find name 'Term'.` @ L32
- `[full_check] Cannot find name 'Statement'.` @ L34
- `[full_check] Cannot find name 'Term'.` @ L34
- `[full_check] Cannot find name 'Term'.` @ L34
- `[full_check] Cannot find name 'Term'.` @ L36
- `[full_check] Cannot find name 'Term'.` @ L36
- `[full_check] Cannot find name 'Term'.` @ L45
- `[full_check] Cannot find name 'Term'.` @ L45
- `[full_check] Cannot find name 'Term'.` @ L45
- `[full_check] Cannot find name 'Term'.` @ L45
- `[full_check] Cannot find name 'Term'.` @ L46
- `[full_check] Cannot find name 'Statement'.` @ L49
- `[full_check] Cannot find name 'Inheritance'.` @ L52
- `[full_check] Cannot find name 'Product'.` @ L52
- `[full_check] Cannot find name 'Term'.` @ L53
- `[full_check] Cannot find name 'Statement'.` @ L60
- `[full_check] Cannot find name 'Term'.` @ L60
- `[full_check] Cannot find name 'Inheritance'.` @ L63
- `[full_check] Cannot find name 'Product'.` @ L63
- `[full_check] Cannot find name 'Term'.` @ L70
- `[full_check] Cannot find name 'Term'.` @ L73
- `[full_check] Cannot find name 'Term'.` @ L73
- `[full_check] Cannot find name 'Inheritance'.` @ L78
- `[full_check] Cannot find name 'Product'.` @ L78
- `[full_check] Cannot find name 'Term'.` @ L78
- `[full_check] Cannot find name 'Term'.` @ L85
- `[full_check] Cannot find name 'Term'.` @ L85
- `[full_check] Cannot find name 'Term'.` @ L85
- `[full_check] Cannot find name 'Inheritance'.` @ L88
- `[full_check] Cannot find name 'Product'.` @ L88
- `[full_check] Cannot find name 'Term'.` @ L101
- `[full_check] Cannot find name 'Term'.` @ L101
- `[full_check] Cannot find name 'CompoundTerm'.` @ L102
- `[full_check] Cannot find name 'CompoundTerm'.` @ L105
- `[full_check] Cannot find name 'CompoundTerm'.` @ L105
- `[full_check] Cannot find name 'INHERITANCE'.` @ L107
- `[full_check] Cannot find name 'Inheritance'.` @ L108
- `[full_check] Cannot find name 'SIMILARITY'.` @ L109
- `[full_check] Cannot find name 'Similarity'.` @ L110
- `[full_check] Cannot find name 'Term'.` @ L117
- `[full_check] Cannot find name 'Term'.` @ L118
- `[syntax_check] Cannot find name 'FunctionOperator'.` @ L10
- `[syntax_check] Cannot find name 'Memory'.` @ L21
- `[syntax_check] Cannot find name 'Term'.` @ L21
- `[syntax_check] Cannot find name 'Term'.` @ L21
- `[syntax_check] Cannot find name 'Term'.` @ L27
- `[syntax_check] Cannot find name 'Statement'.` @ L32
- `[syntax_check] Cannot find name 'Term'.` @ L32
- `[syntax_check] Cannot find name 'Statement'.` @ L34
- `[syntax_check] Cannot find name 'Term'.` @ L34
- `[syntax_check] Cannot find name 'Term'.` @ L34
- `[syntax_check] Cannot find name 'Term'.` @ L36
- `[syntax_check] Cannot find name 'Term'.` @ L36
- `[syntax_check] Cannot find name 'Term'.` @ L45
- `[syntax_check] Cannot find name 'Term'.` @ L45
- `[syntax_check] Cannot find name 'Term'.` @ L45
- `[syntax_check] Cannot find name 'Term'.` @ L45
- `[syntax_check] Cannot find name 'Term'.` @ L46
- `[syntax_check] Cannot find name 'Statement'.` @ L49
- `[syntax_check] Cannot find name 'Inheritance'.` @ L52
- `[syntax_check] Cannot find name 'Product'.` @ L52
- `[syntax_check] Cannot find name 'Term'.` @ L53
- `[syntax_check] Cannot find name 'Statement'.` @ L60
- `[syntax_check] Cannot find name 'Term'.` @ L60
- `[syntax_check] Cannot find name 'Inheritance'.` @ L63
- `[syntax_check] Cannot find name 'Product'.` @ L63
- `[syntax_check] Cannot find name 'Term'.` @ L70
- `[syntax_check] Cannot find name 'Term'.` @ L73
- `[syntax_check] Cannot find name 'Term'.` @ L73
- `[syntax_check] Cannot find name 'Inheritance'.` @ L78
- `[syntax_check] Cannot find name 'Product'.` @ L78
- `[syntax_check] Cannot find name 'Term'.` @ L78
- `[syntax_check] Cannot find name 'Term'.` @ L85
- `[syntax_check] Cannot find name 'Term'.` @ L85
- `[syntax_check] Cannot find name 'Term'.` @ L85
- `[syntax_check] Cannot find name 'Inheritance'.` @ L88
- `[syntax_check] Cannot find name 'Product'.` @ L88
- `[syntax_check] Cannot find name 'Term'.` @ L101
- `[syntax_check] Cannot find name 'Term'.` @ L101
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L102
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L105
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L105
- `[syntax_check] Cannot find name 'INHERITANCE'.` @ L107
- `[syntax_check] Cannot find name 'Inheritance'.` @ L108
- `[syntax_check] Cannot find name 'SIMILARITY'.` @ L109
- `[syntax_check] Cannot find name 'Similarity'.` @ L110
- `[syntax_check] Cannot find name 'Term'.` @ L117
- `[syntax_check] Cannot find name 'Term'.` @ L118

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `operator/misc/Reflect` -> `language/Inheritance`（deps.xml 第 1148 行）
- `operator/misc/Reflect` -> `operator/FunctionOperator`（deps.xml 第 1149 行）
- `operator/misc/Reflect` -> `language/CompoundTerm`（deps.xml 第 1150 行）
- `operator/misc/Reflect` -> `storage/Memory`（deps.xml 第 1151 行）
- `operator/misc/Reflect` -> `language/Product`（deps.xml 第 1152 行）
- `operator/misc/Reflect` -> `language/Term`（deps.xml 第 1153 行）
- `operator/misc/Reflect` -> `language/Statement`（deps.xml 第 1154 行）
- `operator/misc/Reflect` -> `language/Similarity`（deps.xml 第 1155 行）
- `operator/misc/Reflect` -> `io/Symbols`（deps.xml 第 1156 行）
- 交叉校验：
- Java graph 额外依赖：io/Symbols、language/CompoundTerm、language/Inheritance、language/Product、language/Similarity、language/Statement、language/Term、operator/FunctionOperator、storage/Memory

## 5. Java 功能说明

- **职责概述**：文件工作：将 Operation 注册与 Memory 交互显式化，补写副作用与预算更新。
- **关键数据结构**：
- `Reflect` · 继承：FunctionOperator · 实现：（无接口）
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

- ts-analysis: LOC=121 · TODO=0
- 参考文件：`java-master/src/main/java/org/opennars/operator/misc/Reflect.java`
