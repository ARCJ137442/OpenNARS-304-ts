# src/language/Variable.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/language/Variable.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/language/Variable.java` |
| 模块链路 | `language 基座` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/language/Variable.ts --noEmit`）

- 执行的命令：`npx tsc src/language/Variable.ts --noEmit`
- 关键输出：
  - TS2304（L11, C31）：[full_check] Cannot find name 'Term'.
  - TS2304（L15, C20）：[full_check] Cannot find name 'Term'.
  - TS2564（L17, C13）：[full_check] Property 'hash' has no initializer and is not definitely assigned in the constructor.
  - TS2385（L26, C5）：[full_check] Overload signatures must all be public, private or protected.
  - TS2304（L26, C64）：[full_check] Cannot find name 'Term'.
  - TS2349（L33, C17）：[full_check] This expression is not callable.
  - TS17009（L33, C17）：[full_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L40, C72）：[full_check] Cannot find name 'Term'.
  - TS2304（L57, C28）：[full_check] Cannot find name 'Term'.
  - TS2339（L58, C14）：[full_check] Property 'setName' does not exist on type 'Variable'.
  - TS2322（L59, C9）：[full_check] Type 'number | null' is not assignable to type 'number'.
  - TS2349（L73, C55）：[full_check] This expression is not callable.
  - TS2367（L124, C13）：[full_check] This comparison appears to be unintentional because the types 'JavaObject' and 'this' have no overlap.
  - TS2349（L134, C29）：[full_check] This expression is not callable.
  - TS2339（L134, C45）：[full_check] Property 'name' does not exist on type 'Variable'.
  - TS2352（L146, C27）：[full_check] Conversion of type 'JavaObject' to type 'Variable' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  - TS2349（L149, C35）：[full_check] This expression is not callable.
  - TS2339（L149, C51）：[full_check] Property 'name' does not exist on type 'Variable'.
  - TS2349（L155, C33）：[full_check] This expression is not callable.
  - TS2339（L155, C49）：[full_check] Property 'name' does not exist on type 'Variable'.
  - TS2349（L178, C49）：[full_check] This expression is not callable.
  - TS2349（L180, C44）：[full_check] This expression is not callable.
  - TS2304（L185, C28）：[full_check] Cannot find name 'AbstractTerm'.
  - TS2339（L198, C58）：[full_check] Property 'name' does not exist on type 'Variable'.
  - TS2339（L198, C109）：[full_check] Property 'name' does not exist on type 'Variable'.
  - TS2304（L227, C35）：[full_check] Cannot find name 'VAR_QUERY'.
  - TS2304（L231, C35）：[full_check] Cannot find name 'VAR_DEPENDENT'.
  - TS2304（L235, C35）：[full_check] Cannot find name 'VAR_INDEPENDENT'.
  - TS2349（L239, C56）：[full_check] This expression is not callable.
  - TS2367（L241, C16）：[full_check] This comparison appears to be unintentional because the types 'number | null' and 'string' have no overlap.
  - TS2304（L244, C24）：[full_check] Cannot find name 'Term'.
  - TS2304（L251, C22）：[full_check] Cannot find name 'Texts'.
  - TS2339（L251, C40）：[full_check] Property 'name' does not exist on type 'Variable'.
  - TS2339（L251, C50）：[full_check] Property 'name' does not exist on type 'Variable'.
  - TS2339（L258, C48）：[full_check] Property 'identityHashCode' does not exist on type 'typeof System'.
  - TS2339（L259, C48）：[full_check] Property 'identityHashCode' does not exist on type 'typeof System'.
  - TS2304（L266, C24）：[full_check] Cannot find name 'Texts'.
  - TS2304（L274, C23）：[full_check] Cannot find name 'VAR_QUERY'.
  - TS2304（L274, C44）：[full_check] Cannot find name 'VAR_DEPENDENT'.
  - TS2304（L274, C69）：[full_check] Cannot find name 'VAR_INDEPENDENT'.
  - TS2304（L288, C18）：[full_check] Cannot find name 'VAR_INDEPENDENT'.
  - TS2304（L291, C18）：[full_check] Cannot find name 'VAR_DEPENDENT'.
  - TS2304（L294, C18）：[full_check] Cannot find name 'VAR_QUERY'.
  - TS2339（L315, C43）：[full_check] Property 'forDigit' does not exist on type 'typeof Character'.
  - TS2304（L321, C52）：[full_check] Cannot find name 'Term'.
  - TS2304（L321, C93）：[full_check] Cannot find name 'Term'.
  - TS2304（L323, C47）：[full_check] Cannot find name 'Term'.
  - TS2304（L11, C31）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L15, C20）：[syntax_check] Cannot find name 'Term'.
  - TS2564（L17, C13）：[syntax_check] Property 'hash' has no initializer and is not definitely assigned in the constructor.
  - TS2385（L26, C5）：[syntax_check] Overload signatures must all be public, private or protected.
  - TS2304（L26, C64）：[syntax_check] Cannot find name 'Term'.
  - TS2349（L33, C17）：[syntax_check] This expression is not callable.
  - TS17009（L33, C17）：[syntax_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L40, C72）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L57, C28）：[syntax_check] Cannot find name 'Term'.
  - TS2339（L58, C14）：[syntax_check] Property 'setName' does not exist on type 'Variable'.
  - TS2322（L59, C9）：[syntax_check] Type 'number | null' is not assignable to type 'number'.
  - TS2349（L73, C55）：[syntax_check] This expression is not callable.
  - TS2367（L124, C13）：[syntax_check] This comparison appears to be unintentional because the types 'JavaObject' and 'this' have no overlap.
  - TS2349（L134, C29）：[syntax_check] This expression is not callable.
  - TS2339（L134, C45）：[syntax_check] Property 'name' does not exist on type 'Variable'.
  - TS2352（L146, C27）：[syntax_check] Conversion of type 'JavaObject' to type 'Variable' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  - TS2349（L149, C35）：[syntax_check] This expression is not callable.
  - TS2339（L149, C51）：[syntax_check] Property 'name' does not exist on type 'Variable'.
  - TS2349（L155, C33）：[syntax_check] This expression is not callable.
  - TS2339（L155, C49）：[syntax_check] Property 'name' does not exist on type 'Variable'.
  - TS2349（L178, C49）：[syntax_check] This expression is not callable.
  - TS2349（L180, C44）：[syntax_check] This expression is not callable.
  - TS2304（L185, C28）：[syntax_check] Cannot find name 'AbstractTerm'.
  - TS2339（L198, C58）：[syntax_check] Property 'name' does not exist on type 'Variable'.
  - TS2339（L198, C109）：[syntax_check] Property 'name' does not exist on type 'Variable'.
  - TS2304（L227, C35）：[syntax_check] Cannot find name 'VAR_QUERY'.
  - TS2304（L231, C35）：[syntax_check] Cannot find name 'VAR_DEPENDENT'.
  - TS2304（L235, C35）：[syntax_check] Cannot find name 'VAR_INDEPENDENT'.
  - TS2349（L239, C56）：[syntax_check] This expression is not callable.
  - TS2367（L241, C16）：[syntax_check] This comparison appears to be unintentional because the types 'number | null' and 'string' have no overlap.
  - TS2304（L244, C24）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L251, C22）：[syntax_check] Cannot find name 'Texts'.
  - TS2339（L251, C40）：[syntax_check] Property 'name' does not exist on type 'Variable'.
  - TS2339（L251, C50）：[syntax_check] Property 'name' does not exist on type 'Variable'.
  - TS2339（L258, C48）：[syntax_check] Property 'identityHashCode' does not exist on type 'typeof System'.
  - TS2339（L259, C48）：[syntax_check] Property 'identityHashCode' does not exist on type 'typeof System'.
  - TS2304（L266, C24）：[syntax_check] Cannot find name 'Texts'.
  - TS2304（L274, C23）：[syntax_check] Cannot find name 'VAR_QUERY'.
  - TS2304（L274, C44）：[syntax_check] Cannot find name 'VAR_DEPENDENT'.
  - TS2304（L274, C69）：[syntax_check] Cannot find name 'VAR_INDEPENDENT'.
  - TS2304（L288, C18）：[syntax_check] Cannot find name 'VAR_INDEPENDENT'.
  - TS2304（L291, C18）：[syntax_check] Cannot find name 'VAR_DEPENDENT'.
  - TS2304（L294, C18）：[syntax_check] Cannot find name 'VAR_QUERY'.
  - TS2339（L315, C43）：[syntax_check] Property 'forDigit' does not exist on type 'typeof Character'.
  - TS2304（L321, C52）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L321, C93）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L323, C47）：[syntax_check] Cannot find name 'Term'.
- 总结：存在语法错误，需要比对 Java 语句结构。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

（无显式结构性依赖，主要依赖 `jree` 提供的运行时桩或尚未补齐的全局声明。）

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

- `[full_check] Cannot find name 'Term'.` @ L11
- `[full_check] Cannot find name 'Term'.` @ L15
- `[full_check] Cannot find name 'Term'.` @ L26
- `[full_check] Cannot find name 'Term'.` @ L40
- `[full_check] Cannot find name 'Term'.` @ L57
- `[full_check] Cannot find name 'AbstractTerm'.` @ L185
- `[full_check] Cannot find name 'VAR_QUERY'.` @ L227
- `[full_check] Cannot find name 'VAR_DEPENDENT'.` @ L231
- `[full_check] Cannot find name 'VAR_INDEPENDENT'.` @ L235
- `[full_check] Cannot find name 'Term'.` @ L244
- `[full_check] Cannot find name 'Texts'.` @ L251
- `[full_check] Cannot find name 'Texts'.` @ L266
- `[full_check] Cannot find name 'VAR_QUERY'.` @ L274
- `[full_check] Cannot find name 'VAR_DEPENDENT'.` @ L274
- `[full_check] Cannot find name 'VAR_INDEPENDENT'.` @ L274
- `[full_check] Cannot find name 'VAR_INDEPENDENT'.` @ L288
- `[full_check] Cannot find name 'VAR_DEPENDENT'.` @ L291
- `[full_check] Cannot find name 'VAR_QUERY'.` @ L294
- `[full_check] Cannot find name 'Term'.` @ L321
- `[full_check] Cannot find name 'Term'.` @ L321
- `[full_check] Cannot find name 'Term'.` @ L323
- `[syntax_check] Cannot find name 'Term'.` @ L11
- `[syntax_check] Cannot find name 'Term'.` @ L15
- `[syntax_check] Cannot find name 'Term'.` @ L26
- `[syntax_check] Cannot find name 'Term'.` @ L40
- `[syntax_check] Cannot find name 'Term'.` @ L57
- `[syntax_check] Cannot find name 'AbstractTerm'.` @ L185
- `[syntax_check] Cannot find name 'VAR_QUERY'.` @ L227
- `[syntax_check] Cannot find name 'VAR_DEPENDENT'.` @ L231
- `[syntax_check] Cannot find name 'VAR_INDEPENDENT'.` @ L235
- `[syntax_check] Cannot find name 'Term'.` @ L244
- `[syntax_check] Cannot find name 'Texts'.` @ L251
- `[syntax_check] Cannot find name 'Texts'.` @ L266
- `[syntax_check] Cannot find name 'VAR_QUERY'.` @ L274
- `[syntax_check] Cannot find name 'VAR_DEPENDENT'.` @ L274
- `[syntax_check] Cannot find name 'VAR_INDEPENDENT'.` @ L274
- `[syntax_check] Cannot find name 'VAR_INDEPENDENT'.` @ L288
- `[syntax_check] Cannot find name 'VAR_DEPENDENT'.` @ L291
- `[syntax_check] Cannot find name 'VAR_QUERY'.` @ L294
- `[syntax_check] Cannot find name 'Term'.` @ L321
- `[syntax_check] Cannot find name 'Term'.` @ L321
- `[syntax_check] Cannot find name 'Term'.` @ L323

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `language/Variable` -> `io/Texts`（deps.xml 第 854 行）
- `language/Variable` -> `language/AbstractTerm`（deps.xml 第 855 行）
- `language/Variable` -> `language/Term`（deps.xml 第 856 行）
- `language/Variable` -> `io/Symbols`（deps.xml 第 857 行）
- 交叉校验：
- Java graph 额外依赖：io/Symbols、io/Texts、language/AbstractTerm、language/Term

## 5. Java 功能说明

- **职责概述**：文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。；TODO 1 处
- **关键数据结构**：
- `Variable` · 继承：Term · 实现：（无接口）
- **核心流程 / 算法**：
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。；TODO 1 处
  3. Java-TS 差异：参见《通用转译法.md》 - 语言层
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `Java Memory/Task 接口` 衔接上下游。

## 6. 一致性风险

- 文件内仍保留 1 处 TODO，需对照 Java 填补。
- `tsc` 报错阻塞进一步分析，需要回填语句结构。
- 缺少显式 import，需依赖 Java/ts-analysis 交叉校验。

## 7. 路线图定位

- 1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
- 2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。；TODO 1 处
- 3. Java-TS 差异：参见《通用转译法.md》 - 语言层

## 8. 附加记录

- ts-analysis: LOC=327 · TODO=1
- 参考文件：`java-master/src/main/java/org/opennars/language/Variable.java`
