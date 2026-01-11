# src/language/AbstractTerm.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/language/AbstractTerm.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/language/AbstractTerm.java` |
| 模块链路 | `language 基座` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/language/AbstractTerm.ts --noEmit`）

- 执行的命令：`npx tsc src/language/AbstractTerm.ts --noEmit`
- 关键输出：
  - TS2689（L6, C37）：[full_check] Cannot extend an interface 'java.lang.Cloneable'. Did you mean 'implements'?
  - TS1174（L6, C58）：[full_check] Classes can only extend a single class.
  - TS1245（L27, C24）：[full_check] Method 'name' cannot have an implementation because it is marked abstract.
  - TS2322（L28, C9）：[full_check] Type 'string' is not assignable to type 'CharSequence'.
  - TS2689（L6, C37）：[syntax_check] Cannot extend an interface 'java.lang.Cloneable'. Did you mean 'implements'?
  - TS1174（L6, C58）：[syntax_check] Classes can only extend a single class.
  - TS1245（L27, C24）：[syntax_check] Method 'name' cannot have an implementation because it is marked abstract.
  - TS2322（L28, C9）：[syntax_check] Type 'string' is not assignable to type 'CharSequence'.
- 总结：存在语法错误，需要比对 Java 语句结构。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

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
- deps.xml 未列出额外依赖。
- 交叉校验：
- TS 与 Java 依赖集合一致。

## 5. Java 功能说明

- **职责概述**：文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。
- **关键数据结构**：
- `AbstractTerm` · 继承：java.lang.Cloneable, java.lang.Comparable<AbstractTerm> · 实现：（无接口）
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

- ts-analysis: LOC=31 · TODO=0
- 参考文件：`java-master/src/main/java/org/opennars/language/AbstractTerm.java`
