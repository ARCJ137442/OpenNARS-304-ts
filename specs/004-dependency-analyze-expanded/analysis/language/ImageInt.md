# src/language/ImageInt.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/language/ImageInt.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/language/ImageInt.java` |
| 模块链路 | `language 基座` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/language/ImageInt.ts --noEmit`）

- 执行的命令：`npx tsc src/language/ImageInt.ts --noEmit`
- 关键输出：
  - TS2304（L24, C32）：[full_check] Cannot find name 'Term'.
  - TS2345（L25, C15）：[full_check] Argument of type 'Term[]' is not assignable to parameter of type 'number'.
  - TS2304（L35, C28）：[full_check] Cannot find name 'Term'.
  - TS2304（L35, C37）：[full_check] Cannot find name 'Term'.
  - TS2304（L36, C50）：[full_check] Cannot find name 'Term'.
  - TS2304（L40, C37）：[full_check] Cannot find name 'term'.
  - TS2304（L40, C43）：[full_check] Cannot find name 'relationIndex'.
  - TS2304（L47, C45）：[full_check] Cannot find name 'Term'.
  - TS2304（L53, C41）：[full_check] Cannot find name 'term'.
  - TS2304（L54, C122）：[full_check] Cannot find name 'term'.
  - TS2304（L57, C47）：[full_check] Cannot find name 'relationIndex'.
  - TS2304（L76, C33）：[full_check] Cannot find name 'Term'.
  - TS2304（L76, C42）：[full_check] Cannot find name 'Term'.
  - TS2304（L86, C34）：[full_check] Cannot find name 'Term'.
  - TS2304（L97, C33）：[full_check] Cannot find name 'Product'.
  - TS2304（L97, C52）：[full_check] Cannot find name 'Term'.
  - TS2304（L97, C73）：[full_check] Cannot find name 'Term'.
  - TS2304（L108, C55）：[full_check] Cannot find name 'Term'.
  - TS2304（L108, C76）：[full_check] Cannot find name 'Term'.
  - TS2304（L109, C45）：[full_check] Cannot find name 'Term'.
  - TS2304（L112, C44）：[full_check] Cannot find name 'Term'.
  - TS2304（L118, C31）：[full_check] Cannot find name 'Term'.
  - TS2304（L119, C31）：[full_check] Cannot find name 'Term'.
  - TS2304（L119, C50）：[full_check] Cannot find name 'Term'.
  - TS2304（L123, C25）：[full_check] Cannot find name 'isPlaceHolder'.
  - TS2304（L138, C52）：[full_check] Cannot find name 'Term'.
  - TS2304（L148, C61）：[full_check] Cannot find name 'Product'.
  - TS2304（L148, C70）：[full_check] Cannot find name 'Term'.
  - TS2304（L151, C41）：[full_check] Cannot find name 'Product'.
  - TS2304（L152, C29）：[full_check] Cannot find name 'Product'.
  - TS2304（L152, C51）：[full_check] Cannot find name 'Product'.
  - TS2304（L162, C31）：[full_check] Cannot find name 'Term'.
  - TS2304（L171, C73）：[full_check] Cannot find name 'Term'.
  - TS2304（L174, C30）：[full_check] Cannot find name 'Term'.
  - TS2339（L174, C48）：[full_check] Property 'cloneTerms' does not exist on type 'ImageInt'.
  - TS2339（L175, C46）：[full_check] Property 'relationIndex' does not exist on type 'ImageInt'.
  - TS2304（L176, C31）：[full_check] Cannot find name 'Term'.
  - TS2304（L197, C24）：[full_check] Cannot find name 'NativeOperator'.
  - TS2304（L198, C16）：[full_check] Cannot find name 'NativeOperator'.
  - TS2304（L24, C32）：[syntax_check] Cannot find name 'Term'.
  - TS2345（L25, C15）：[syntax_check] Argument of type 'Term[]' is not assignable to parameter of type 'number'.
  - TS2304（L35, C28）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L35, C37）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L36, C50）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L40, C37）：[syntax_check] Cannot find name 'term'.
  - TS2304（L40, C43）：[syntax_check] Cannot find name 'relationIndex'.
  - TS2304（L47, C45）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L53, C41）：[syntax_check] Cannot find name 'term'.
  - TS2304（L54, C122）：[syntax_check] Cannot find name 'term'.
  - TS2304（L57, C47）：[syntax_check] Cannot find name 'relationIndex'.
  - TS2304（L76, C33）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L76, C42）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L86, C34）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L97, C33）：[syntax_check] Cannot find name 'Product'.
  - TS2304（L97, C52）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L97, C73）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L108, C55）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L108, C76）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L109, C45）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L112, C44）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L118, C31）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L119, C31）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L119, C50）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L123, C25）：[syntax_check] Cannot find name 'isPlaceHolder'.
  - TS2304（L138, C52）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L148, C61）：[syntax_check] Cannot find name 'Product'.
  - TS2304（L148, C70）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L151, C41）：[syntax_check] Cannot find name 'Product'.
  - TS2304（L152, C29）：[syntax_check] Cannot find name 'Product'.
  - TS2304（L152, C51）：[syntax_check] Cannot find name 'Product'.
  - TS2304（L162, C31）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L171, C73）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L174, C30）：[syntax_check] Cannot find name 'Term'.
  - TS2339（L174, C48）：[syntax_check] Property 'cloneTerms' does not exist on type 'ImageInt'.
  - TS2339（L175, C46）：[syntax_check] Property 'relationIndex' does not exist on type 'ImageInt'.
  - TS2304（L176, C31）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L197, C24）：[syntax_check] Cannot find name 'NativeOperator'.
  - TS2304（L198, C16）：[syntax_check] Cannot find name 'NativeOperator'.
- 总结：存在语法错误，需要比对 Java 语句结构。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

（无显式结构性依赖，主要依赖 `jree` 提供的运行时桩或尚未补齐的全局声明。）

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

- `[full_check] Cannot find name 'Term'.` @ L24
- `[full_check] Cannot find name 'Term'.` @ L35
- `[full_check] Cannot find name 'Term'.` @ L35
- `[full_check] Cannot find name 'Term'.` @ L36
- `[full_check] Cannot find name 'term'.` @ L40
- `[full_check] Cannot find name 'relationIndex'.` @ L40
- `[full_check] Cannot find name 'Term'.` @ L47
- `[full_check] Cannot find name 'term'.` @ L53
- `[full_check] Cannot find name 'term'.` @ L54
- `[full_check] Cannot find name 'relationIndex'.` @ L57
- `[full_check] Cannot find name 'Term'.` @ L76
- `[full_check] Cannot find name 'Term'.` @ L76
- `[full_check] Cannot find name 'Term'.` @ L86
- `[full_check] Cannot find name 'Product'.` @ L97
- `[full_check] Cannot find name 'Term'.` @ L97
- `[full_check] Cannot find name 'Term'.` @ L97
- `[full_check] Cannot find name 'Term'.` @ L108
- `[full_check] Cannot find name 'Term'.` @ L108
- `[full_check] Cannot find name 'Term'.` @ L109
- `[full_check] Cannot find name 'Term'.` @ L112
- `[full_check] Cannot find name 'Term'.` @ L118
- `[full_check] Cannot find name 'Term'.` @ L119
- `[full_check] Cannot find name 'Term'.` @ L119
- `[full_check] Cannot find name 'isPlaceHolder'.` @ L123
- `[full_check] Cannot find name 'Term'.` @ L138
- `[full_check] Cannot find name 'Product'.` @ L148
- `[full_check] Cannot find name 'Term'.` @ L148
- `[full_check] Cannot find name 'Product'.` @ L151
- `[full_check] Cannot find name 'Product'.` @ L152
- `[full_check] Cannot find name 'Product'.` @ L152
- `[full_check] Cannot find name 'Term'.` @ L162
- `[full_check] Cannot find name 'Term'.` @ L171
- `[full_check] Cannot find name 'Term'.` @ L174
- `[full_check] Cannot find name 'Term'.` @ L176
- `[full_check] Cannot find name 'NativeOperator'.` @ L197
- `[full_check] Cannot find name 'NativeOperator'.` @ L198
- `[syntax_check] Cannot find name 'Term'.` @ L24
- `[syntax_check] Cannot find name 'Term'.` @ L35
- `[syntax_check] Cannot find name 'Term'.` @ L35
- `[syntax_check] Cannot find name 'Term'.` @ L36
- `[syntax_check] Cannot find name 'term'.` @ L40
- `[syntax_check] Cannot find name 'relationIndex'.` @ L40
- `[syntax_check] Cannot find name 'Term'.` @ L47
- `[syntax_check] Cannot find name 'term'.` @ L53
- `[syntax_check] Cannot find name 'term'.` @ L54
- `[syntax_check] Cannot find name 'relationIndex'.` @ L57
- `[syntax_check] Cannot find name 'Term'.` @ L76
- `[syntax_check] Cannot find name 'Term'.` @ L76
- `[syntax_check] Cannot find name 'Term'.` @ L86
- `[syntax_check] Cannot find name 'Product'.` @ L97
- `[syntax_check] Cannot find name 'Term'.` @ L97
- `[syntax_check] Cannot find name 'Term'.` @ L97
- `[syntax_check] Cannot find name 'Term'.` @ L108
- `[syntax_check] Cannot find name 'Term'.` @ L108
- `[syntax_check] Cannot find name 'Term'.` @ L109
- `[syntax_check] Cannot find name 'Term'.` @ L112
- `[syntax_check] Cannot find name 'Term'.` @ L118
- `[syntax_check] Cannot find name 'Term'.` @ L119
- `[syntax_check] Cannot find name 'Term'.` @ L119
- `[syntax_check] Cannot find name 'isPlaceHolder'.` @ L123
- `[syntax_check] Cannot find name 'Term'.` @ L138
- `[syntax_check] Cannot find name 'Product'.` @ L148
- `[syntax_check] Cannot find name 'Term'.` @ L148
- `[syntax_check] Cannot find name 'Product'.` @ L151
- `[syntax_check] Cannot find name 'Product'.` @ L152
- `[syntax_check] Cannot find name 'Product'.` @ L152
- `[syntax_check] Cannot find name 'Term'.` @ L162
- `[syntax_check] Cannot find name 'Term'.` @ L171
- `[syntax_check] Cannot find name 'Term'.` @ L174
- `[syntax_check] Cannot find name 'Term'.` @ L176
- `[syntax_check] Cannot find name 'NativeOperator'.` @ L197
- `[syntax_check] Cannot find name 'NativeOperator'.` @ L198

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `language/ImageInt` -> `language/Image`（deps.xml 第 691 行）
- `language/ImageInt` -> `language/CompoundTerm`（deps.xml 第 692 行）
- `language/ImageInt` -> `language/Product`（deps.xml 第 693 行）
- `language/ImageInt` -> `language/Term`（deps.xml 第 694 行）
- `language/ImageInt` -> `io/Symbols`（deps.xml 第 695 行）
- 交叉校验：
- Java graph 额外依赖：io/Symbols、language/CompoundTerm、language/Image、language/Product、language/Term

## 5. Java 功能说明

- **职责概述**：文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。；TODO 1 处
- **关键数据结构**：
- `ImageInt` · 继承：Image · 实现：（无接口）
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

- ts-analysis: LOC=200 · TODO=1
- 参考文件：`java-master/src/main/java/org/opennars/language/ImageInt.java`
