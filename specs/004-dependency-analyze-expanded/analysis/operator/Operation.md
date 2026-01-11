# src/operator/Operation.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/operator/Operation.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/operator/Operation.java` |
| 模块链路 | `language 基座 -> entity -> operator 操作符层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/operator/Operation.ts --noEmit`）

- 执行的命令：`npx tsc src/operator/Operation.ts --noEmit`
- 关键输出：
  - TS2304（L8, C32）：[full_check] Cannot find name 'Inheritance'.
  - TS2304（L9, C19）：[full_check] Cannot find name 'Task'.
  - TS2304（L10, C45）：[full_check] Cannot find name 'Term'.
  - TS2304（L10, C55）：[full_check] Cannot find name 'SELF'.
  - TS2304（L12, C30）：[full_check] Cannot find name 'Term'.
  - TS2304（L18, C39）：[full_check] Cannot find name 'Term'.
  - TS2304（L18, C55）：[full_check] Cannot find name 'Term'.
  - TS2304（L22, C38）：[full_check] Cannot find name 'Term'.
  - TS2304（L32, C57）：[full_check] Cannot find name 'Term'.
  - TS2304（L32, C63）：[full_check] Cannot find name 'Term'.
  - TS2304（L54, C30）：[full_check] Cannot find name 'term'.
  - TS2304（L64, C30）：[full_check] Cannot find name 'Operator'.
  - TS2304（L64, C45）：[full_check] Cannot find name 'Term'.
  - TS2304（L65, C34）：[full_check] Cannot find name 'Product'.
  - TS2304（L68, C27）：[full_check] Cannot find name 'Operator'.
  - TS2304（L69, C16）：[full_check] Cannot find name 'getPredicate'.
  - TS2304（L69, C34）：[full_check] Cannot find name 'Operator'.
  - TS2339（L73, C27）：[full_check] Property 'cert' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/security/index")'.
  - TS2304（L73, C73）：[full_check] Cannot find name 'Product'.
  - TS2304（L73, C84）：[full_check] Cannot find name 'getPredicate'.
  - TS2304（L73, C110）：[full_check] Cannot find name 'Operator'.
  - TS2304（L74, C34）：[full_check] Cannot find name 'getPredicate'.
  - TS2554（L74, C34）：[full_check] Expected 0 arguments, but got 2.
  - TS2339（L74, C72）：[full_check] Property 'cert' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/security/index")'.
  - TS2304（L74, C110）：[full_check] Cannot find name 'Product'.
  - TS2304（L75, C16）：[full_check] Cannot find name 'makeStatementName'.
  - TS2339（L75, C48）：[full_check] Property 'cert' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/security/index")'.
  - TS2304（L75, C84）：[full_check] Cannot find name 'Symbols'.
  - TS2304（L75, C120）：[full_check] Cannot find name 'getPredicate'.
  - TS2304（L78, C61）：[full_check] Cannot find name 'Term'.
  - TS2304（L80, C21）：[full_check] Cannot find name 'COMPOUND_TERM_OPENER'.
  - TS2304（L83, C32）：[full_check] Cannot find name 'Symbols'.
  - TS2304（L87, C28）：[full_check] Cannot find name 'COMPOUND_TERM_CLOSER'.
  - TS2304（L95, C26）：[full_check] Cannot find name 'Task'.
  - TS2304（L99, C23）：[full_check] Cannot find name 'Task'.
  - TS2304（L103, C28）：[full_check] Cannot find name 'Product'.
  - TS2339（L104, C30）：[full_check] Property 'cert' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/security/index")'.
  - TS2304（L104, C68）：[full_check] Cannot find name 'Product'.
  - TS2304（L8, C32）：[syntax_check] Cannot find name 'Inheritance'.
  - TS2304（L9, C19）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L10, C45）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L10, C55）：[syntax_check] Cannot find name 'SELF'.
  - TS2304（L12, C30）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L18, C39）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L18, C55）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L22, C38）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L32, C57）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L32, C63）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L54, C30）：[syntax_check] Cannot find name 'term'.
  - TS2304（L64, C30）：[syntax_check] Cannot find name 'Operator'.
  - TS2304（L64, C45）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L65, C34）：[syntax_check] Cannot find name 'Product'.
  - TS2304（L68, C27）：[syntax_check] Cannot find name 'Operator'.
  - TS2304（L69, C16）：[syntax_check] Cannot find name 'getPredicate'.
  - TS2304（L69, C34）：[syntax_check] Cannot find name 'Operator'.
  - TS2339（L73, C27）：[syntax_check] Property 'cert' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/security/index")'.
  - TS2304（L73, C73）：[syntax_check] Cannot find name 'Product'.
  - TS2304（L73, C84）：[syntax_check] Cannot find name 'getPredicate'.
  - TS2304（L73, C110）：[syntax_check] Cannot find name 'Operator'.
  - TS2304（L74, C34）：[syntax_check] Cannot find name 'getPredicate'.
  - TS2554（L74, C34）：[syntax_check] Expected 0 arguments, but got 2.
  - TS2339（L74, C72）：[syntax_check] Property 'cert' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/security/index")'.
  - TS2304（L74, C110）：[syntax_check] Cannot find name 'Product'.
  - TS2304（L75, C16）：[syntax_check] Cannot find name 'makeStatementName'.
  - TS2339（L75, C48）：[syntax_check] Property 'cert' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/security/index")'.
  - TS2304（L75, C84）：[syntax_check] Cannot find name 'Symbols'.
  - TS2304（L75, C120）：[syntax_check] Cannot find name 'getPredicate'.
  - TS2304（L78, C61）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L80, C21）：[syntax_check] Cannot find name 'COMPOUND_TERM_OPENER'.
  - TS2304（L83, C32）：[syntax_check] Cannot find name 'Symbols'.
  - TS2304（L87, C28）：[syntax_check] Cannot find name 'COMPOUND_TERM_CLOSER'.
  - TS2304（L95, C26）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L99, C23）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L103, C28）：[syntax_check] Cannot find name 'Product'.
  - TS2339（L104, C30）：[syntax_check] Property 'cert' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/security/index")'.
  - TS2304（L104, C68）：[syntax_check] Cannot find name 'Product'.
- 总结：存在语法错误，需要比对 Java 语句结构。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

（无显式结构性依赖，主要依赖 `jree` 提供的运行时桩或尚未补齐的全局声明。）

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

- `[full_check] Cannot find name 'Inheritance'.` @ L8
- `[full_check] Cannot find name 'Task'.` @ L9
- `[full_check] Cannot find name 'Term'.` @ L10
- `[full_check] Cannot find name 'SELF'.` @ L10
- `[full_check] Cannot find name 'Term'.` @ L12
- `[full_check] Cannot find name 'Term'.` @ L18
- `[full_check] Cannot find name 'Term'.` @ L18
- `[full_check] Cannot find name 'Term'.` @ L22
- `[full_check] Cannot find name 'Term'.` @ L32
- `[full_check] Cannot find name 'Term'.` @ L32
- `[full_check] Cannot find name 'term'.` @ L54
- `[full_check] Cannot find name 'Operator'.` @ L64
- `[full_check] Cannot find name 'Term'.` @ L64
- `[full_check] Cannot find name 'Product'.` @ L65
- `[full_check] Cannot find name 'Operator'.` @ L68
- `[full_check] Cannot find name 'getPredicate'.` @ L69
- `[full_check] Cannot find name 'Operator'.` @ L69
- `[full_check] Cannot find name 'Product'.` @ L73
- `[full_check] Cannot find name 'getPredicate'.` @ L73
- `[full_check] Cannot find name 'Operator'.` @ L73
- `[full_check] Cannot find name 'getPredicate'.` @ L74
- `[full_check] Cannot find name 'Product'.` @ L74
- `[full_check] Cannot find name 'makeStatementName'.` @ L75
- `[full_check] Cannot find name 'Symbols'.` @ L75
- `[full_check] Cannot find name 'getPredicate'.` @ L75
- `[full_check] Cannot find name 'Term'.` @ L78
- `[full_check] Cannot find name 'COMPOUND_TERM_OPENER'.` @ L80
- `[full_check] Cannot find name 'Symbols'.` @ L83
- `[full_check] Cannot find name 'COMPOUND_TERM_CLOSER'.` @ L87
- `[full_check] Cannot find name 'Task'.` @ L95
- `[full_check] Cannot find name 'Task'.` @ L99
- `[full_check] Cannot find name 'Product'.` @ L103
- `[full_check] Cannot find name 'Product'.` @ L104
- `[syntax_check] Cannot find name 'Inheritance'.` @ L8
- `[syntax_check] Cannot find name 'Task'.` @ L9
- `[syntax_check] Cannot find name 'Term'.` @ L10
- `[syntax_check] Cannot find name 'SELF'.` @ L10
- `[syntax_check] Cannot find name 'Term'.` @ L12
- `[syntax_check] Cannot find name 'Term'.` @ L18
- `[syntax_check] Cannot find name 'Term'.` @ L18
- `[syntax_check] Cannot find name 'Term'.` @ L22
- `[syntax_check] Cannot find name 'Term'.` @ L32
- `[syntax_check] Cannot find name 'Term'.` @ L32
- `[syntax_check] Cannot find name 'term'.` @ L54
- `[syntax_check] Cannot find name 'Operator'.` @ L64
- `[syntax_check] Cannot find name 'Term'.` @ L64
- `[syntax_check] Cannot find name 'Product'.` @ L65
- `[syntax_check] Cannot find name 'Operator'.` @ L68
- `[syntax_check] Cannot find name 'getPredicate'.` @ L69
- `[syntax_check] Cannot find name 'Operator'.` @ L69
- `[syntax_check] Cannot find name 'Product'.` @ L73
- `[syntax_check] Cannot find name 'getPredicate'.` @ L73
- `[syntax_check] Cannot find name 'Operator'.` @ L73
- `[syntax_check] Cannot find name 'getPredicate'.` @ L74
- `[syntax_check] Cannot find name 'Product'.` @ L74
- `[syntax_check] Cannot find name 'makeStatementName'.` @ L75
- `[syntax_check] Cannot find name 'Symbols'.` @ L75
- `[syntax_check] Cannot find name 'getPredicate'.` @ L75
- `[syntax_check] Cannot find name 'Term'.` @ L78
- `[syntax_check] Cannot find name 'COMPOUND_TERM_OPENER'.` @ L80
- `[syntax_check] Cannot find name 'Symbols'.` @ L83
- `[syntax_check] Cannot find name 'COMPOUND_TERM_CLOSER'.` @ L87
- `[syntax_check] Cannot find name 'Task'.` @ L95
- `[syntax_check] Cannot find name 'Task'.` @ L99
- `[syntax_check] Cannot find name 'Product'.` @ L103
- `[syntax_check] Cannot find name 'Product'.` @ L104

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `operator/Operation` -> `entity/Task`（deps.xml 第 1173 行）
- `operator/Operation` -> `operator/Operator`（deps.xml 第 1174 行）
- `operator/Operation` -> `language/Inheritance`（deps.xml 第 1175 行）
- `operator/Operation` -> `language/CompoundTerm`（deps.xml 第 1176 行）
- `operator/Operation` -> `language/Product`（deps.xml 第 1177 行）
- `operator/Operation` -> `language/Term`（deps.xml 第 1178 行）
- `operator/Operation` -> `language/Statement`（deps.xml 第 1179 行）
- `operator/Operation` -> `io/Symbols`（deps.xml 第 1180 行）
- 交叉校验：
- Java graph 额外依赖：entity/Task、io/Symbols、language/CompoundTerm、language/Inheritance、language/Product、language/Statement、language/Term、operator/Operator

## 5. Java 功能说明

- **职责概述**：文件工作：将 Operation 注册与 Memory 交互显式化，补写副作用与预算更新。
- **关键数据结构**：
- `Operation` · 继承：Inheritance · 实现：（无接口）
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

- ts-analysis: LOC=107 · TODO=0
- 参考文件：`java-master/src/main/java/org/opennars/operator/Operation.java`
