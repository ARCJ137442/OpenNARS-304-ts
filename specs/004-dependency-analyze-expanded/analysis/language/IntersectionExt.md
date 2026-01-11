# src/language/IntersectionExt.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/language/IntersectionExt.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/language/IntersectionExt.java` |
| 模块链路 | `language 基座` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/language/IntersectionExt.ts --noEmit`）

- 执行的命令：`npx tsc src/language/IntersectionExt.ts --noEmit`
- 关键输出：
  - TS2304（L11, C38）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L18, C30）：[full_check] Cannot find name 'Term'.
  - TS2304（L21, C13）：[full_check] Cannot find name 'Debug'.
  - TS2304（L22, C13）：[full_check] Cannot find name 'Terms'.
  - TS2339（L25, C23）：[full_check] Property 'cert' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/security/index")'.
  - TS2304（L36, C28）：[full_check] Cannot find name 'Term'.
  - TS2304（L36, C37）：[full_check] Cannot find name 'Term'.
  - TS2304（L37, C57）：[full_check] Cannot find name 'Term'.
  - TS2304（L41, C44）：[full_check] Cannot find name 'term'.
  - TS2304（L48, C45）：[full_check] Cannot find name 'Term'.
  - TS2304（L67, C27）：[full_check] Cannot find name 'Term'.
  - TS2304（L67, C36）：[full_check] Cannot find name 'Term'.
  - TS2304（L76, C31）：[full_check] Cannot find name 'Term'.
  - TS2304（L76, C44）：[full_check] Cannot find name 'Term'.
  - TS2304（L76, C51）：[full_check] Cannot find name 'Term'.
  - TS2304（L77, C45）：[full_check] Cannot find name 'Term'.
  - TS2304（L80, C38）：[full_check] Cannot find name 'Term'.
  - TS2588（L83, C17）：[full_check] Cannot assign to 't' because it is a constant.
  - TS2304（L83, C21）：[full_check] Cannot find name 'Term'.
  - TS2304（L98, C49）：[full_check] Cannot find name 'Term'.
  - TS2304（L98, C55）：[full_check] Cannot find name 'Term'.
  - TS2304（L102, C39）：[full_check] Cannot find name 'SetInt'.
  - TS2304（L102, C68）：[full_check] Cannot find name 'SetInt'.
  - TS2304（L104, C31）：[full_check] Cannot find name 'Term'.
  - TS2304（L104, C40）：[full_check] Cannot find name 'ObjectArrays'.
  - TS2304（L105, C35）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L106, C35）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L106, C55）：[full_check] Cannot find name 'Term'.
  - TS2304（L107, C28）：[full_check] Cannot find name 'SetInt'.
  - TS2304（L109, C39）：[full_check] Cannot find name 'SetExt'.
  - TS2304（L109, C68）：[full_check] Cannot find name 'SetExt'.
  - TS2694（L111, C40）：[full_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/util/index"' has no exported member 'NavigableSet'.
  - TS2304（L111, C53）：[full_check] Cannot find name 'Term'.
  - TS2304（L111, C61）：[full_check] Cannot find name 'Term'.
  - TS2304（L111, C88）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L113, C45）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L118, C28）：[full_check] Cannot find name 'SetExt'.
  - TS2304（L118, C62）：[full_check] Cannot find name 'Term'.
  - TS2304（L120, C40）：[full_check] Cannot find name 'Term'.
  - TS2304（L122, C31）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L125, C35）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L132, C31）：[full_check] Cannot find name 'CompoundTerm'.
  - TS2304（L138, C66）：[full_check] Cannot find name 'Term'.
  - TS2304（L156, C24）：[full_check] Cannot find name 'NativeOperator'.
  - TS2304（L157, C16）：[full_check] Cannot find name 'NativeOperator'.
  - TS2304（L11, C38）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L18, C30）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L21, C13）：[syntax_check] Cannot find name 'Debug'.
  - TS2304（L22, C13）：[syntax_check] Cannot find name 'Terms'.
  - TS2339（L25, C23）：[syntax_check] Property 'cert' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/security/index")'.
  - TS2304（L36, C28）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L36, C37）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L37, C57）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L41, C44）：[syntax_check] Cannot find name 'term'.
  - TS2304（L48, C45）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L67, C27）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L67, C36）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L76, C31）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L76, C44）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L76, C51）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L77, C45）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L80, C38）：[syntax_check] Cannot find name 'Term'.
  - TS2588（L83, C17）：[syntax_check] Cannot assign to 't' because it is a constant.
  - TS2304（L83, C21）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L98, C49）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L98, C55）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L102, C39）：[syntax_check] Cannot find name 'SetInt'.
  - TS2304（L102, C68）：[syntax_check] Cannot find name 'SetInt'.
  - TS2304（L104, C31）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L104, C40）：[syntax_check] Cannot find name 'ObjectArrays'.
  - TS2304（L105, C35）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L106, C35）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L106, C55）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L107, C28）：[syntax_check] Cannot find name 'SetInt'.
  - TS2304（L109, C39）：[syntax_check] Cannot find name 'SetExt'.
  - TS2304（L109, C68）：[syntax_check] Cannot find name 'SetExt'.
  - TS2694（L111, C40）：[syntax_check] Namespace '"H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/util/index"' has no exported member 'NavigableSet'.
  - TS2304（L111, C53）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L111, C61）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L111, C88）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L113, C45）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L118, C28）：[syntax_check] Cannot find name 'SetExt'.
  - TS2304（L118, C62）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L120, C40）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L122, C31）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L125, C35）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L132, C31）：[syntax_check] Cannot find name 'CompoundTerm'.
  - TS2304（L138, C66）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L156, C24）：[syntax_check] Cannot find name 'NativeOperator'.
  - TS2304（L157, C16）：[syntax_check] Cannot find name 'NativeOperator'.
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
- `[full_check] Cannot find name 'Debug'.` @ L21
- `[full_check] Cannot find name 'Terms'.` @ L22
- `[full_check] Cannot find name 'Term'.` @ L36
- `[full_check] Cannot find name 'Term'.` @ L36
- `[full_check] Cannot find name 'Term'.` @ L37
- `[full_check] Cannot find name 'term'.` @ L41
- `[full_check] Cannot find name 'Term'.` @ L48
- `[full_check] Cannot find name 'Term'.` @ L67
- `[full_check] Cannot find name 'Term'.` @ L67
- `[full_check] Cannot find name 'Term'.` @ L76
- `[full_check] Cannot find name 'Term'.` @ L76
- `[full_check] Cannot find name 'Term'.` @ L76
- `[full_check] Cannot find name 'Term'.` @ L77
- `[full_check] Cannot find name 'Term'.` @ L80
- `[full_check] Cannot find name 'Term'.` @ L83
- `[full_check] Cannot find name 'Term'.` @ L98
- `[full_check] Cannot find name 'Term'.` @ L98
- `[full_check] Cannot find name 'SetInt'.` @ L102
- `[full_check] Cannot find name 'SetInt'.` @ L102
- `[full_check] Cannot find name 'Term'.` @ L104
- `[full_check] Cannot find name 'ObjectArrays'.` @ L104
- `[full_check] Cannot find name 'CompoundTerm'.` @ L105
- `[full_check] Cannot find name 'CompoundTerm'.` @ L106
- `[full_check] Cannot find name 'Term'.` @ L106
- `[full_check] Cannot find name 'SetInt'.` @ L107
- `[full_check] Cannot find name 'SetExt'.` @ L109
- `[full_check] Cannot find name 'SetExt'.` @ L109
- `[full_check] Cannot find name 'Term'.` @ L111
- `[full_check] Cannot find name 'Term'.` @ L111
- `[full_check] Cannot find name 'CompoundTerm'.` @ L111
- `[full_check] Cannot find name 'CompoundTerm'.` @ L113
- `[full_check] Cannot find name 'SetExt'.` @ L118
- `[full_check] Cannot find name 'Term'.` @ L118
- `[full_check] Cannot find name 'Term'.` @ L120
- `[full_check] Cannot find name 'CompoundTerm'.` @ L122
- `[full_check] Cannot find name 'CompoundTerm'.` @ L125
- `[full_check] Cannot find name 'CompoundTerm'.` @ L132
- `[full_check] Cannot find name 'Term'.` @ L138
- `[full_check] Cannot find name 'NativeOperator'.` @ L156
- `[full_check] Cannot find name 'NativeOperator'.` @ L157
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L11
- `[syntax_check] Cannot find name 'Term'.` @ L18
- `[syntax_check] Cannot find name 'Debug'.` @ L21
- `[syntax_check] Cannot find name 'Terms'.` @ L22
- `[syntax_check] Cannot find name 'Term'.` @ L36
- `[syntax_check] Cannot find name 'Term'.` @ L36
- `[syntax_check] Cannot find name 'Term'.` @ L37
- `[syntax_check] Cannot find name 'term'.` @ L41
- `[syntax_check] Cannot find name 'Term'.` @ L48
- `[syntax_check] Cannot find name 'Term'.` @ L67
- `[syntax_check] Cannot find name 'Term'.` @ L67
- `[syntax_check] Cannot find name 'Term'.` @ L76
- `[syntax_check] Cannot find name 'Term'.` @ L76
- `[syntax_check] Cannot find name 'Term'.` @ L76
- `[syntax_check] Cannot find name 'Term'.` @ L77
- `[syntax_check] Cannot find name 'Term'.` @ L80
- `[syntax_check] Cannot find name 'Term'.` @ L83
- `[syntax_check] Cannot find name 'Term'.` @ L98
- `[syntax_check] Cannot find name 'Term'.` @ L98
- `[syntax_check] Cannot find name 'SetInt'.` @ L102
- `[syntax_check] Cannot find name 'SetInt'.` @ L102
- `[syntax_check] Cannot find name 'Term'.` @ L104
- `[syntax_check] Cannot find name 'ObjectArrays'.` @ L104
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L105
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L106
- `[syntax_check] Cannot find name 'Term'.` @ L106
- `[syntax_check] Cannot find name 'SetInt'.` @ L107
- `[syntax_check] Cannot find name 'SetExt'.` @ L109
- `[syntax_check] Cannot find name 'SetExt'.` @ L109
- `[syntax_check] Cannot find name 'Term'.` @ L111
- `[syntax_check] Cannot find name 'Term'.` @ L111
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L111
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L113
- `[syntax_check] Cannot find name 'SetExt'.` @ L118
- `[syntax_check] Cannot find name 'Term'.` @ L118
- `[syntax_check] Cannot find name 'Term'.` @ L120
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L122
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L125
- `[syntax_check] Cannot find name 'CompoundTerm'.` @ L132
- `[syntax_check] Cannot find name 'Term'.` @ L138
- `[syntax_check] Cannot find name 'NativeOperator'.` @ L156
- `[syntax_check] Cannot find name 'NativeOperator'.` @ L157

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `language/IntersectionExt` -> `language/Terms`（deps.xml 第 729 行）
- `language/IntersectionExt` -> `language/CompoundTerm`（deps.xml 第 730 行）
- `language/IntersectionExt` -> `language/SetExt`（deps.xml 第 731 行）
- `language/IntersectionExt` -> `language/SetInt`（deps.xml 第 732 行）
- `language/IntersectionExt` -> `language/Term`（deps.xml 第 733 行）
- `language/IntersectionExt` -> `io/Symbols`（deps.xml 第 734 行）
- `language/IntersectionExt` -> `parameter/Debug`（deps.xml 第 735 行）
- 交叉校验：
- Java graph 额外依赖：io/Symbols、language/CompoundTerm、language/SetExt、language/SetInt、language/Term、language/Terms、parameter/Debug

## 5. Java 功能说明

- **职责概述**：文件工作：维持 Term/Statement 层的泛型层次和不可变结构，同时统一缓存策略。
- **关键数据结构**：
- `IntersectionExt` · 继承：CompoundTerm · 实现：（无接口）
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

- ts-analysis: LOC=168 · TODO=0
- 参考文件：`java-master/src/main/java/org/opennars/language/IntersectionExt.java`
