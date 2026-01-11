# src/language/CompoundTerm.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/language/CompoundTerm.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/language/CompoundTerm.java` |
| 模块链路 | `language 基座` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/language/CompoundTerm.ts --noEmit`）

- 执行的命令：`npx tsc src/language/CompoundTerm.ts --noEmit`
- 关键输出：
  - 无报错
- 总结：命令通过，未触发额外依赖。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

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
- `language/CompoundTerm` -> `language/Terms`（deps.xml 第 624 行）
- `language/CompoundTerm` -> `language/Interval`（deps.xml 第 625 行）
- `language/CompoundTerm` -> `language/Implication`（deps.xml 第 626 行）
- `language/CompoundTerm` -> `inference/TemporalRules`（deps.xml 第 627 行）
- `language/CompoundTerm` -> `language/Term`（deps.xml 第 628 行）
- `language/CompoundTerm` -> `io/Symbols`（deps.xml 第 629 行）
- `language/CompoundTerm` -> `parameter/Debug`（deps.xml 第 630 行）
- `language/CompoundTerm` -> `language/Variable`（deps.xml 第 631 行）
- `language/CompoundTerm` -> `language/Equivalence`（deps.xml 第 632 行）
- `language/CompoundTerm` -> `language/AbstractTerm`（deps.xml 第 633 行）
- `language/CompoundTerm` -> `entity/TermLink`（deps.xml 第 634 行）
- `language/CompoundTerm` -> `storage/Memory`（deps.xml 第 635 行）
- 交叉校验：
- Java graph 额外依赖：entity/TermLink、inference/TemporalRules、io/Symbols、language/AbstractTerm、language/Equivalence、language/Implication、language/Interval、language/Term、language/Terms、language/Variable、parameter/Debug、storage/Memory

## 5. Java 功能说明

- **职责概述**：文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。；TODO 4 处
- **关键数据结构**：
- `CompoundTerm` · 继承：Term · 实现：java.lang.Iterable<Term>
- **核心流程 / 算法**：
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。；TODO 4 处
  3. Java-TS 差异：参见《通用转译法.md》 - 语言层
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `Java Memory/Task 接口` 衔接上下游。

## 6. 一致性风险

- 文件内仍保留 4 处 TODO，需对照 Java 填补。
- 缺少显式 import，需依赖 Java/ts-analysis 交叉校验。

## 7. 路线图定位

- 1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
- 2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。；TODO 4 处
- 3. Java-TS 差异：参见《通用转译法.md》 - 语言层

## 8. 附加记录

- ts-analysis: LOC=818 · TODO=4
- 参考文件：`java-master/src/main/java/org/opennars/language/CompoundTerm.java`
