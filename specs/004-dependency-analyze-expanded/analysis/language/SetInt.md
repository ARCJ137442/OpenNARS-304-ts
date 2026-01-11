# src/language/SetInt.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/language/SetInt.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/language/SetInt.java` |
| 模块链路 | `language 基座` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/language/SetInt.ts --noEmit`）

- 执行的命令：`npx tsc src/language/SetInt.ts --noEmit`
- 关键输出：
  - TS2304（L12, C29）：[full_check] Cannot find name 'SetTensional'.
  - TS2304（L19, C32）：[full_check] Cannot find name 'Term'.
  - TS2304（L30, C28）：[full_check] Cannot find name 'Term'.
  - TS2304（L35, C35）：[full_check] Cannot find name 'term'.
  - TS2304（L42, C45）：[full_check] Cannot find name 'Term'.
  - TS2322（L46, C21）：[full_check] Type 'null' is not assignable to type 'SetInt'.
  - TS2304（L61, C48）：[full_check] Cannot find name 'Term'.
  - TS2304（L63, C30）：[full_check] Cannot find name 'Term'.
  - TS2304（L67, C59）：[full_check] Cannot find name 'Term'.
  - TS2304（L70, C56）：[full_check] Cannot find name 'Term'.
  - TS2304（L77, C38）：[full_check] Cannot find name 'Term'.
  - TS2588（L80, C17）：[full_check] Cannot assign to 't' because it is a constant.
  - TS2304（L80, C21）：[full_check] Cannot find name 'Term'.
  - TS2322（L82, C21）：[full_check] Type 'null' is not assignable to type 'SetInt'.
  - TS2304（L101, C24）：[full_check] Cannot find name 'NativeOperator'.
  - TS2304（L102, C16）：[full_check] Cannot find name 'NativeOperator'.
  - TS2304（L111, C16）：[full_check] Cannot find name 'makeSetName'.
  - TS2304（L111, C28）：[full_check] Cannot find name 'SET_INT_OPENER'.
  - TS2304（L111, C47）：[full_check] Cannot find name 'term'.
  - TS2304（L111, C53）：[full_check] Cannot find name 'SET_INT_CLOSER'.
  - TS2304（L12, C29）：[syntax_check] Cannot find name 'SetTensional'.
  - TS2304（L19, C32）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L30, C28）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L35, C35）：[syntax_check] Cannot find name 'term'.
  - TS2304（L42, C45）：[syntax_check] Cannot find name 'Term'.
  - TS2322（L46, C21）：[syntax_check] Type 'null' is not assignable to type 'SetInt'.
  - TS2304（L61, C48）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L63, C30）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L67, C59）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L70, C56）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L77, C38）：[syntax_check] Cannot find name 'Term'.
  - TS2588（L80, C17）：[syntax_check] Cannot assign to 't' because it is a constant.
  - TS2304（L80, C21）：[syntax_check] Cannot find name 'Term'.
  - TS2322（L82, C21）：[syntax_check] Type 'null' is not assignable to type 'SetInt'.
  - TS2304（L101, C24）：[syntax_check] Cannot find name 'NativeOperator'.
  - TS2304（L102, C16）：[syntax_check] Cannot find name 'NativeOperator'.
  - TS2304（L111, C16）：[syntax_check] Cannot find name 'makeSetName'.
  - TS2304（L111, C28）：[syntax_check] Cannot find name 'SET_INT_OPENER'.
  - TS2304（L111, C47）：[syntax_check] Cannot find name 'term'.
  - TS2304（L111, C53）：[syntax_check] Cannot find name 'SET_INT_CLOSER'.
- 总结：存在语法错误，需要比对 Java 语句结构。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

（无显式结构性依赖，主要依赖 `jree` 提供的运行时桩或尚未补齐的全局声明。）

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

- `[full_check] Cannot find name 'SetTensional'.` @ L12
- `[full_check] Cannot find name 'Term'.` @ L19
- `[full_check] Cannot find name 'Term'.` @ L30
- `[full_check] Cannot find name 'term'.` @ L35
- `[full_check] Cannot find name 'Term'.` @ L42
- `[full_check] Cannot find name 'Term'.` @ L61
- `[full_check] Cannot find name 'Term'.` @ L63
- `[full_check] Cannot find name 'Term'.` @ L67
- `[full_check] Cannot find name 'Term'.` @ L70
- `[full_check] Cannot find name 'Term'.` @ L77
- `[full_check] Cannot find name 'Term'.` @ L80
- `[full_check] Cannot find name 'NativeOperator'.` @ L101
- `[full_check] Cannot find name 'NativeOperator'.` @ L102
- `[full_check] Cannot find name 'makeSetName'.` @ L111
- `[full_check] Cannot find name 'SET_INT_OPENER'.` @ L111
- `[full_check] Cannot find name 'term'.` @ L111
- `[full_check] Cannot find name 'SET_INT_CLOSER'.` @ L111
- `[syntax_check] Cannot find name 'SetTensional'.` @ L12
- `[syntax_check] Cannot find name 'Term'.` @ L19
- `[syntax_check] Cannot find name 'Term'.` @ L30
- `[syntax_check] Cannot find name 'term'.` @ L35
- `[syntax_check] Cannot find name 'Term'.` @ L42
- `[syntax_check] Cannot find name 'Term'.` @ L61
- `[syntax_check] Cannot find name 'Term'.` @ L63
- `[syntax_check] Cannot find name 'Term'.` @ L67
- `[syntax_check] Cannot find name 'Term'.` @ L70
- `[syntax_check] Cannot find name 'Term'.` @ L77
- `[syntax_check] Cannot find name 'Term'.` @ L80
- `[syntax_check] Cannot find name 'NativeOperator'.` @ L101
- `[syntax_check] Cannot find name 'NativeOperator'.` @ L102
- `[syntax_check] Cannot find name 'makeSetName'.` @ L111
- `[syntax_check] Cannot find name 'SET_INT_OPENER'.` @ L111
- `[syntax_check] Cannot find name 'term'.` @ L111
- `[syntax_check] Cannot find name 'SET_INT_CLOSER'.` @ L111

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `language/SetInt` -> `language/CompoundTerm`（deps.xml 第 772 行）
- `language/SetInt` -> `language/SetTensional`（deps.xml 第 773 行）
- `language/SetInt` -> `language/Term`（deps.xml 第 774 行）
- `language/SetInt` -> `io/Symbols`（deps.xml 第 775 行）
- 交叉校验：
- Java graph 额外依赖：io/Symbols、language/CompoundTerm、language/SetTensional、language/Term

## 5. Java 功能说明

- **职责概述**：文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。
- **关键数据结构**：
- `SetInt` · 继承：SetTensional · 实现：（无接口）
- **核心流程 / 算法**：
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。
  3. Java-TS 差异：参见《通用转译法.md》 - 语言层
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `Java Memory/Task 接口` 衔接上下游。

## 6. 一致性风险

- `tsc` 报错阻塞进一步分析，需要回填语句结构。
- 缺少显式 import，需依赖 Java/ts-analysis 交叉校验。

## 7. 路线图定位

- 1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
- 2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。
- 3. Java-TS 差异：参见《通用转译法.md》 - 语言层

## 8. 附加记录

- ts-analysis: LOC=114 · TODO=0
- 参考文件：`java-master/src/main/java/org/opennars/language/SetInt.java`
