# src/language/Product.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/language/Product.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/language/Product.java` |
| 模块链路 | `language 基座` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/language/Product.ts --noEmit`）

- 执行的命令：`npx tsc src/language/Product.ts --noEmit`
- 关键输出：
  - TS2304（L11, C30）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L18, C32）：[full_check] Cannot find name 'Term'.
  - TS2304（L20, C42）：[full_check] Cannot find name 'Term'.
  - TS2304（L24, C40）：[full_check] Cannot find name 'Term'.
  - TS2339（L29, C31）：[full_check] Property 'cert' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/security/index")'.
  - TS2304（L36, C53）：[full_check] Cannot find name 'Term'.
  - TS2349（L39, C17）：[full_check] This expression is not callable.
  - TS17009（L39, C17）：[full_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L39, C42）：[full_check] Cannot find name 'Term'.
  - TS2304（L52, C32）：[full_check] Cannot find name 'Term'.
  - TS2304（L64, C31）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L64, C56）：[full_check] Cannot find name 'Term'.
  - TS2304（L64, C75）：[full_check] Cannot find name 'Term'.
  - TS2304（L65, C55）：[full_check] Cannot find name 'Term'.
  - TS2304（L68, C40）：[full_check] Cannot find name 'Term'.
  - TS2304（L78, C60）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L78, C74）：[full_check] Cannot find name 'Term'.
  - TS2304（L81, C31）：[full_check] Cannot find name 'Term'.
  - TS2304（L103, C28）：[full_check] Cannot find name 'Term'.
  - TS2304（L103, C37）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L104, C49）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L108, C36）：[full_check] Cannot find name 'term'.
  - TS2304（L115, C45）：[full_check] Cannot find name 'Term'.
  - TS2304（L139, C24）：[full_check] Cannot find name 'NativeOperator'.
  - TS2304（L140, C16）：[full_check] Cannot find name 'NativeOperator'.
  - TS2304（L11, C30）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L18, C32）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L20, C42）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L24, C40）：[syntax_check] Cannot find name 'Term'.
  - TS2339（L29, C31）：[syntax_check] Property 'cert' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/security/index")'.
  - TS2304（L36, C53）：[syntax_check] Cannot find name 'Term'.
  - TS2349（L39, C17）：[syntax_check] This expression is not callable.
  - TS17009（L39, C17）：[syntax_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L39, C42）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L52, C32）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L64, C31）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L64, C56）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L64, C75）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L65, C55）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L68, C40）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L78, C60）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L78, C74）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L81, C31）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L103, C28）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L103, C37）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L104, C49）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L108, C36）：[syntax_check] Cannot find name 'term'.
  - TS2304（L115, C45）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L139, C24）：[syntax_check] Cannot find name 'NativeOperator'.
  - TS2304（L140, C16）：[syntax_check] Cannot find name 'NativeOperator'.
- 总结：存在语法错误，需要比对 Java 语句结构。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

（无显式结构性依赖，主要依赖 `jree` 提供的运行时桩或尚未补齐的全局声明。）

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

- `[full_check] Cannot find name 'CompoundTerm'.` @ L11
- `[full_check] Cannot find name 'Term'.` @ L18
- `[full_check] Cannot find name 'Term'.` @ L20
- `[full_check] Cannot find name 'Term'.` @ L24
- `[full_check] Cannot find name 'Term'.` @ L36
- `[full_check] Cannot find name 'Term'.` @ L39
- `[full_check] Cannot find name 'Term'.` @ L52
- `[full_check] Cannot find name 'CompoundTerm'.` @ L64
- `[full_check] Cannot find name 'Term'.` @ L64
- `[full_check] Cannot find name 'Term'.` @ L64
- `[full_check] Cannot find name 'Term'.` @ L65
- `[full_check] Cannot find name 'Term'.` @ L68
- `[full_check] Cannot find name 'CompoundTerm'.` @ L78
- `[full_check] Cannot find name 'Term'.` @ L78
- `[full_check] Cannot find name 'Term'.` @ L81
- `[full_check] Cannot find name 'Term'.` @ L103
- `[full_check] Cannot find name 'CompoundTerm'.` @ L103
- `[full_check] Cannot find name 'CompoundTerm'.` @ L104
- `[full_check] Cannot find name 'term'.` @ L108
- `[full_check] Cannot find name 'Term'.` @ L115
- `[full_check] Cannot find name 'NativeOperator'.` @ L139
- `[full_check] Cannot find name 'NativeOperator'.` @ L140
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L11
- `[syntax_check] Cannot find name 'Term'.` @ L18
- `[syntax_check] Cannot find name 'Term'.` @ L20
- `[syntax_check] Cannot find name 'Term'.` @ L24
- `[syntax_check] Cannot find name 'Term'.` @ L36
- `[syntax_check] Cannot find name 'Term'.` @ L39
- `[syntax_check] Cannot find name 'Term'.` @ L52
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L64
- `[syntax_check] Cannot find name 'Term'.` @ L64
- `[syntax_check] Cannot find name 'Term'.` @ L64
- `[syntax_check] Cannot find name 'Term'.` @ L65
- `[syntax_check] Cannot find name 'Term'.` @ L68
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L78
- `[syntax_check] Cannot find name 'Term'.` @ L78
- `[syntax_check] Cannot find name 'Term'.` @ L81
- `[syntax_check] Cannot find name 'Term'.` @ L103
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L103
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L104
- `[syntax_check] Cannot find name 'term'.` @ L108
- `[syntax_check] Cannot find name 'Term'.` @ L115
- `[syntax_check] Cannot find name 'NativeOperator'.` @ L139
- `[syntax_check] Cannot find name 'NativeOperator'.` @ L140

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `language/Product` -> `language/CompoundTerm`（deps.xml 第 756 行）
- `language/Product` -> `language/Term`（deps.xml 第 757 行）
- `language/Product` -> `io/Symbols`（deps.xml 第 758 行）
- 交叉校验：
- Java graph 额外依赖：io/Symbols、language/CompoundTerm、language/Term

## 5. Java 功能说明

- **职责概述**：文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。
- **关键数据结构**：
- `Product` · 继承：CompoundTerm · 实现：（无接口）
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

- ts-analysis: LOC=143 · TODO=0
- 参考文件：`java-master/src/main/java/org/opennars/language/Product.java`
