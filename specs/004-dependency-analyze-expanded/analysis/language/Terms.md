# src/language/Terms.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/language/Terms.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/language/Terms.java` |
| 模块链路 | `language 基座` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/language/Terms.ts --noEmit`）

- 执行的命令：`npx tsc src/language/Terms.ts --noEmit`
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
- `language/Terms` -> `language/Implication`（deps.xml 第 826 行）
- `language/Terms` -> `language/Image`（deps.xml 第 827 行）
- `language/Terms` -> `language/IntersectionExt`（deps.xml 第 828 行）
- `language/Terms` -> `language/DifferenceExt`（deps.xml 第 829 行）
- `language/Terms` -> `language/CompoundTerm`（deps.xml 第 830 行）
- `language/Terms` -> `inference/TemporalRules`（deps.xml 第 831 行）
- `language/Terms` -> `language/Negation`（deps.xml 第 832 行）
- `language/Terms` -> `language/Statement`（deps.xml 第 833 行）
- `language/Terms` -> `language/DifferenceInt`（deps.xml 第 834 行）
- `language/Terms` -> `language/Conjunction`（deps.xml 第 835 行）
- `language/Terms` -> `language/ImageExt`（deps.xml 第 836 行）
- `language/Terms` -> `language/IntersectionInt`（deps.xml 第 837 行）
- `language/Terms` -> `language/Product`（deps.xml 第 838 行）
- `language/Terms` -> `language/Term`（deps.xml 第 839 行）
- `language/Terms` -> `language/Disjunction`（deps.xml 第 840 行）
- `language/Terms` -> `entity/Sentence`（deps.xml 第 841 行）
- `language/Terms` -> `io/Symbols`（deps.xml 第 842 行）
- `language/Terms` -> `language/Inheritance`（deps.xml 第 843 行）
- `language/Terms` -> `language/Variable`（deps.xml 第 844 行）
- `language/Terms` -> `language/ImageInt`（deps.xml 第 845 行）
- `language/Terms` -> `language/SetExt`（deps.xml 第 846 行）
- `language/Terms` -> `language/Equivalence`（deps.xml 第 847 行）
- `language/Terms` -> `language/SetInt`（deps.xml 第 848 行）
- `language/Terms` -> `entity/TermLink`（deps.xml 第 849 行）
- `language/Terms` -> `storage/Memory`（deps.xml 第 850 行）
- `language/Terms` -> `language/Similarity`（deps.xml 第 851 行）
- 交叉校验：
- Java graph 额外依赖：entity/Sentence、entity/TermLink、inference/TemporalRules、io/Symbols、language/CompoundTerm、language/Conjunction、language/DifferenceExt、language/DifferenceInt、language/Disjunction、language/Equivalence、language/Image、language/ImageExt、language/ImageInt、language/Implication、language/Inheritance、language/IntersectionExt、language/IntersectionInt、language/Negation、language/Product、language/SetExt、language/SetInt、language/Similarity、language/Statement、language/Term、language/Variable、storage/Memory

## 5. Java 功能说明

- **职责概述**：文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。；TODO 1 处
- **关键数据结构**：
- `Terms` · 继承：JavaObject · 实现：（无接口）
- **核心流程 / 算法**：
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。；TODO 1 处
  3. Java-TS 差异：参见《通用转译法.md》 - 语言层
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `Java Memory/Task 接口` 衔接上下游。

## 6. 一致性风险

- 文件内仍保留 1 处 TODO，需对照 Java 填补。
- 缺少显式 import，需依赖 Java/ts-analysis 交叉校验。

## 7. 路线图定位

- 1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
- 2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。；TODO 1 处
- 3. Java-TS 差异：参见《通用转译法.md》 - 语言层

## 8. 附加记录

- ts-analysis: LOC=615 · TODO=1
- 参考文件：`java-master/src/main/java/org/opennars/language/Terms.java`
