# src/language/Term.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/language/Term.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/language/Term.java` |
| 模块链路 | `language 基座` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/language/Term.ts --noEmit`）

- 执行的命令：`npx tsc src/language/Term.ts --noEmit`
- 关键输出：
  - 无报错
- 总结：命令通过，未触发额外依赖。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

| 符号 | 来源文件 | 触发位置 | 依赖原因 |
| --- | --- | --- | --- |
| `SetExt` | `src/language/SetExt.ts` | import | 结构性：Term 直接使用 SetExt 的主流程 |

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

（无缺失符号，报错均与语法结构相关。）

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `language/Term` -> `io/Texts`（deps.xml 第 810 行）
- `language/Term` -> `language/Implication`（deps.xml 第 811 行）
- `language/Term` -> `language/CompoundTerm`（deps.xml 第 812 行）
- `language/Term` -> `inference/TemporalRules`（deps.xml 第 813 行）
- `language/Term` -> `language/Statement`（deps.xml 第 814 行）
- `language/Term` -> `io/Symbols`（deps.xml 第 815 行）
- `language/Term` -> `parameter/Debug`（deps.xml 第 816 行）
- `language/Term` -> `operator/ImaginationSpace`（deps.xml 第 817 行）
- `language/Term` -> `language/Variable`（deps.xml 第 818 行）
- `language/Term` -> `language/SetExt`（deps.xml 第 819 行）
- `language/Term` -> `operator/Operation`（deps.xml 第 820 行）
- `language/Term` -> `language/AbstractTerm`（deps.xml 第 821 行）
- `language/Term` -> `language/Equivalence`（deps.xml 第 822 行）
- `language/Term` -> `storage/Memory`（deps.xml 第 823 行）
- 交叉校验：
- Java graph 额外依赖：inference/TemporalRules、io/Symbols、io/Texts、language/AbstractTerm、language/CompoundTerm、language/Equivalence、language/Implication、language/Statement、language/Variable、operator/ImaginationSpace、operator/Operation、parameter/Debug、storage/Memory

## 5. Java 功能说明

- **职责概述**：文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。；TODO 1 处
- **关键数据结构**：
- `Term` · 继承：JavaObject · 实现：（无接口）
- **核心流程 / 算法**：
  1. 依赖准备：依赖：language/SetExt.ts
  2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。；TODO 1 处
  3. Java-TS 差异：参见《通用转译法.md》 - 语言层
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `language/SetExt` 衔接上下游。

## 6. 一致性风险

- 文件内仍保留 1 处 TODO，需对照 Java 填补。

## 7. 路线图定位

- 1. 依赖准备：依赖：language/SetExt.ts
- 2. 文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。；TODO 1 处
- 3. Java-TS 差异：参见《通用转译法.md》 - 语言层

## 8. 附加记录

- ts-analysis: LOC=536 · TODO=1
- 参考文件：`java-master/src/main/java/org/opennars/language/Term.java`
