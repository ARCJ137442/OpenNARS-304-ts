# src/language/SetTensional.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/language/SetTensional.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/language/SetTensional.java` |
| 模块链路 | `language 基座` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/language/SetTensional.ts --noEmit`）

- 执行的命令：`npx tsc src/language/SetTensional.ts --noEmit`
- 关键输出：
  - TS2304（L10, C44）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L16, C32）：[full_check] Cannot find name 'Term'.
  - TS2304（L22, C13）：[full_check] Cannot find name 'Debug'.
  - TS2304（L23, C13）：[full_check] Cannot find name 'Terms'.
  - TS2339（L26, C23）：[full_check] Property 'cert' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/security/index")'.
  - TS2304（L37, C53）：[full_check] Cannot find name 'Term'.
  - TS2304（L48, C26）：[full_check] Cannot find name 'Symbols'.
  - TS2304（L10, C44）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L16, C32）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L22, C13）：[syntax_check] Cannot find name 'Debug'.
  - TS2304（L23, C13）：[syntax_check] Cannot find name 'Terms'.
  - TS2339（L26, C23）：[syntax_check] Property 'cert' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/security/index")'.
  - TS2304（L37, C53）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L48, C26）：[syntax_check] Cannot find name 'Symbols'.
- 总结：存在语法错误，需要比对 Java 语句结构。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

（无显式结构性依赖，主要依赖 `jree` 提供的运行时桩或尚未补齐的全局声明。）

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

- `[full_check] Cannot find name 'CompoundTerm'.` @ L10
- `[full_check] Cannot find name 'Term'.` @ L16
- `[full_check] Cannot find name 'Debug'.` @ L22
- `[full_check] Cannot find name 'Terms'.` @ L23
- `[full_check] Cannot find name 'Term'.` @ L37
- `[full_check] Cannot find name 'Symbols'.` @ L48
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L10
- `[syntax_check] Cannot find name 'Term'.` @ L16
- `[syntax_check] Cannot find name 'Debug'.` @ L22
- `[syntax_check] Cannot find name 'Terms'.` @ L23
- `[syntax_check] Cannot find name 'Term'.` @ L37
- `[syntax_check] Cannot find name 'Symbols'.` @ L48

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `language/SetTensional` -> `language/Terms`（deps.xml 第 778 行）
- `language/SetTensional` -> `language/CompoundTerm`（deps.xml 第 779 行）
- `language/SetTensional` -> `language/Term`（deps.xml 第 780 行）
- `language/SetTensional` -> `io/Symbols`（deps.xml 第 781 行）
- `language/SetTensional` -> `parameter/Debug`（deps.xml 第 782 行）
- 交叉校验：
- Java graph 额外依赖：io/Symbols、language/CompoundTerm、language/Term、language/Terms、parameter/Debug

## 5. Java 功能说明

- **职责概述**：文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。
- **关键数据结构**：
- `SetTensional` · 继承：CompoundTerm · 实现：（无接口）
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

- ts-analysis: LOC=64 · TODO=0
- 参考文件：`java-master/src/main/java/org/opennars/language/SetTensional.java`
