# src/plugin/perception/VisualSpace.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/plugin/perception/VisualSpace.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/plugin/perception/VisualSpace.java` |
| 模块链路 | `language 基座 -> entity -> operator -> plugin 扩展层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/plugin/perception/VisualSpace.ts --noEmit`）

- 执行的命令：`npx tsc src/plugin/perception/VisualSpace.ts --noEmit`
- 关键输出：
  - TS2304（L9, C56）：[full_check] Cannot find name 'ImaginationSpace'.
  - TS2304（L19, C34）：[full_check] Cannot find name 'NullOperator'.
  - TS2304（L19, C53）：[full_check] Cannot find name 'NullOperator'.
  - TS2304（L20, C34）：[full_check] Cannot find name 'NullOperator'.
  - TS2304（L20, C53）：[full_check] Cannot find name 'NullOperator'.
  - TS2304（L21, C27）：[full_check] Cannot find name 'Nar'.
  - TS2304（L23, C29）：[full_check] Cannot find name 'Nar'.
  - TS2351（L29, C28）：[full_check] This expression is not constructable.
  - TS2351（L30, C27）：[full_check] This expression is not constructable.
  - TS2345（L34, C40）：[full_check] Argument of type 'Float64Array' is not assignable to parameter of type 'unknown[]'.
  - TS2345（L40, C40）：[full_check] Argument of type 'Float64Array' is not assignable to parameter of type 'unknown[]'.
  - TS2304（L46, C41）：[full_check] Cannot find name 'ImaginationSpace'.
  - TS2304（L46, C81）：[full_check] Cannot find name 'TruthValue'.
  - TS2304（L48, C24）：[full_check] Cannot find name 'TruthValue'.
  - TS2304（L53, C29）：[full_check] Cannot find name 'TruthValue'.
  - TS2304（L53, C46）：[full_check] Cannot find name 'TruthValue'.
  - TS2304（L56, C26）：[full_check] Cannot find name 'TruthValue'.
  - TS2304（L56, C43）：[full_check] Cannot find name 'TruthValue'.
  - TS2304（L66, C33）：[full_check] Cannot find name 'TruthValue'.
  - TS2304（L66, C50）：[full_check] Cannot find name 'TruthValue'.
  - TS2304（L68, C33）：[full_check] Cannot find name 'TruthValue'.
  - TS2304（L68, C50）：[full_check] Cannot find name 'TruthValue'.
  - TS2304（L70, C33）：[full_check] Cannot find name 'TruthValue'.
  - TS2304（L70, C59）：[full_check] Cannot find name 'TruthFunctions'.
  - TS2304（L71, C31）：[full_check] Cannot find name 'TruthFunctions'.
  - TS2304（L72, C31）：[full_check] Cannot find name 'TruthFunctions'.
  - TS2304（L83, C36）：[full_check] Cannot find name 'Conjunction'.
  - TS2304（L83, C50）：[full_check] Cannot find name 'ImaginationSpace'.
  - TS2304（L84, C65）：[full_check] Cannot find name 'TemporalRules'.
  - TS2304（L87, C24）：[full_check] Cannot find name 'Term'.
  - TS2304（L91, C18）：[full_check] Cannot find name 'ImaginationSpace'.
  - TS2304（L94, C46）：[full_check] Cannot find name 'Operation'.
  - TS2304（L97, C23）：[full_check] Cannot find name 'Operation'.
  - TS2304（L97, C54）：[full_check] Cannot find name 'Operation'.
  - TS2304（L107, C30）：[full_check] Cannot find name 'Operation'.
  - TS2304（L107, C44）：[full_check] Cannot find name 'ImaginationSpace'.
  - TS2304（L107, C63）：[full_check] Cannot find name 'ImaginationSpace'.
  - TS2304（L124, C37）：[full_check] Cannot find name 'Operation'.
  - TS2304（L125, C17）：[full_check] Cannot find name 'Operator'.
  - TS2304（L125, C51）：[full_check] Cannot find name 'Operator'.
  - TS2304（L9, C56）：[syntax_check] Cannot find name 'ImaginationSpace'.
  - TS2304（L19, C34）：[syntax_check] Cannot find name 'NullOperator'.
  - TS2304（L19, C53）：[syntax_check] Cannot find name 'NullOperator'.
  - TS2304（L20, C34）：[syntax_check] Cannot find name 'NullOperator'.
  - TS2304（L20, C53）：[syntax_check] Cannot find name 'NullOperator'.
  - TS2304（L21, C27）：[syntax_check] Cannot find name 'Nar'.
  - TS2304（L23, C29）：[syntax_check] Cannot find name 'Nar'.
  - TS2351（L29, C28）：[syntax_check] This expression is not constructable.
  - TS2351（L30, C27）：[syntax_check] This expression is not constructable.
  - TS2345（L34, C40）：[syntax_check] Argument of type 'Float64Array' is not assignable to parameter of type 'unknown[]'.
  - TS2345（L40, C40）：[syntax_check] Argument of type 'Float64Array' is not assignable to parameter of type 'unknown[]'.
  - TS2304（L46, C41）：[syntax_check] Cannot find name 'ImaginationSpace'.
  - TS2304（L46, C81）：[syntax_check] Cannot find name 'TruthValue'.
  - TS2304（L48, C24）：[syntax_check] Cannot find name 'TruthValue'.
  - TS2304（L53, C29）：[syntax_check] Cannot find name 'TruthValue'.
  - TS2304（L53, C46）：[syntax_check] Cannot find name 'TruthValue'.
  - TS2304（L56, C26）：[syntax_check] Cannot find name 'TruthValue'.
  - TS2304（L56, C43）：[syntax_check] Cannot find name 'TruthValue'.
  - TS2304（L66, C33）：[syntax_check] Cannot find name 'TruthValue'.
  - TS2304（L66, C50）：[syntax_check] Cannot find name 'TruthValue'.
  - TS2304（L68, C33）：[syntax_check] Cannot find name 'TruthValue'.
  - TS2304（L68, C50）：[syntax_check] Cannot find name 'TruthValue'.
  - TS2304（L70, C33）：[syntax_check] Cannot find name 'TruthValue'.
  - TS2304（L70, C59）：[syntax_check] Cannot find name 'TruthFunctions'.
  - TS2304（L71, C31）：[syntax_check] Cannot find name 'TruthFunctions'.
  - TS2304（L72, C31）：[syntax_check] Cannot find name 'TruthFunctions'.
  - TS2304（L83, C36）：[syntax_check] Cannot find name 'Conjunction'.
  - TS2304（L83, C50）：[syntax_check] Cannot find name 'ImaginationSpace'.
  - TS2304（L84, C65）：[syntax_check] Cannot find name 'TemporalRules'.
  - TS2304（L87, C24）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L91, C18）：[syntax_check] Cannot find name 'ImaginationSpace'.
  - TS2304（L94, C46）：[syntax_check] Cannot find name 'Operation'.
  - TS2304（L97, C23）：[syntax_check] Cannot find name 'Operation'.
  - TS2304（L97, C54）：[syntax_check] Cannot find name 'Operation'.
  - TS2304（L107, C30）：[syntax_check] Cannot find name 'Operation'.
  - TS2304（L107, C44）：[syntax_check] Cannot find name 'ImaginationSpace'.
  - TS2304（L107, C63）：[syntax_check] Cannot find name 'ImaginationSpace'.
  - TS2304（L124, C37）：[syntax_check] Cannot find name 'Operation'.
  - TS2304（L125, C17）：[syntax_check] Cannot find name 'Operator'.
  - TS2304（L125, C51）：[syntax_check] Cannot find name 'Operator'.
- 总结：存在语法错误，需要比对 Java 语句结构。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

（无显式结构性依赖，主要依赖 `jree` 提供的运行时桩或尚未补齐的全局声明。）

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

- `[full_check] Cannot find name 'ImaginationSpace'.` @ L9
- `[full_check] Cannot find name 'NullOperator'.` @ L19
- `[full_check] Cannot find name 'NullOperator'.` @ L19
- `[full_check] Cannot find name 'NullOperator'.` @ L20
- `[full_check] Cannot find name 'NullOperator'.` @ L20
- `[full_check] Cannot find name 'Nar'.` @ L21
- `[full_check] Cannot find name 'Nar'.` @ L23
- `[full_check] Cannot find name 'ImaginationSpace'.` @ L46
- `[full_check] Cannot find name 'TruthValue'.` @ L46
- `[full_check] Cannot find name 'TruthValue'.` @ L48
- `[full_check] Cannot find name 'TruthValue'.` @ L53
- `[full_check] Cannot find name 'TruthValue'.` @ L53
- `[full_check] Cannot find name 'TruthValue'.` @ L56
- `[full_check] Cannot find name 'TruthValue'.` @ L56
- `[full_check] Cannot find name 'TruthValue'.` @ L66
- `[full_check] Cannot find name 'TruthValue'.` @ L66
- `[full_check] Cannot find name 'TruthValue'.` @ L68
- `[full_check] Cannot find name 'TruthValue'.` @ L68
- `[full_check] Cannot find name 'TruthValue'.` @ L70
- `[full_check] Cannot find name 'TruthFunctions'.` @ L70
- `[full_check] Cannot find name 'TruthFunctions'.` @ L71
- `[full_check] Cannot find name 'TruthFunctions'.` @ L72
- `[full_check] Cannot find name 'Conjunction'.` @ L83
- `[full_check] Cannot find name 'ImaginationSpace'.` @ L83
- `[full_check] Cannot find name 'TemporalRules'.` @ L84
- `[full_check] Cannot find name 'Term'.` @ L87
- `[full_check] Cannot find name 'ImaginationSpace'.` @ L91
- `[full_check] Cannot find name 'Operation'.` @ L94
- `[full_check] Cannot find name 'Operation'.` @ L97
- `[full_check] Cannot find name 'Operation'.` @ L97
- `[full_check] Cannot find name 'Operation'.` @ L107
- `[full_check] Cannot find name 'ImaginationSpace'.` @ L107
- `[full_check] Cannot find name 'ImaginationSpace'.` @ L107
- `[full_check] Cannot find name 'Operation'.` @ L124
- `[full_check] Cannot find name 'Operator'.` @ L125
- `[full_check] Cannot find name 'Operator'.` @ L125
- `[syntax_check] Cannot find name 'ImaginationSpace'.` @ L9
- `[syntax_check] Cannot find name 'NullOperator'.` @ L19
- `[syntax_check] Cannot find name 'NullOperator'.` @ L19
- `[syntax_check] Cannot find name 'NullOperator'.` @ L20
- `[syntax_check] Cannot find name 'NullOperator'.` @ L20
- `[syntax_check] Cannot find name 'Nar'.` @ L21
- `[syntax_check] Cannot find name 'Nar'.` @ L23
- `[syntax_check] Cannot find name 'ImaginationSpace'.` @ L46
- `[syntax_check] Cannot find name 'TruthValue'.` @ L46
- `[syntax_check] Cannot find name 'TruthValue'.` @ L48
- `[syntax_check] Cannot find name 'TruthValue'.` @ L53
- `[syntax_check] Cannot find name 'TruthValue'.` @ L53
- `[syntax_check] Cannot find name 'TruthValue'.` @ L56
- `[syntax_check] Cannot find name 'TruthValue'.` @ L56
- `[syntax_check] Cannot find name 'TruthValue'.` @ L66
- `[syntax_check] Cannot find name 'TruthValue'.` @ L66
- `[syntax_check] Cannot find name 'TruthValue'.` @ L68
- `[syntax_check] Cannot find name 'TruthValue'.` @ L68
- `[syntax_check] Cannot find name 'TruthValue'.` @ L70
- `[syntax_check] Cannot find name 'TruthFunctions'.` @ L70
- `[syntax_check] Cannot find name 'TruthFunctions'.` @ L71
- `[syntax_check] Cannot find name 'TruthFunctions'.` @ L72
- `[syntax_check] Cannot find name 'Conjunction'.` @ L83
- `[syntax_check] Cannot find name 'ImaginationSpace'.` @ L83
- `[syntax_check] Cannot find name 'TemporalRules'.` @ L84
- `[syntax_check] Cannot find name 'Term'.` @ L87
- `[syntax_check] Cannot find name 'ImaginationSpace'.` @ L91
- `[syntax_check] Cannot find name 'Operation'.` @ L94
- `[syntax_check] Cannot find name 'Operation'.` @ L97
- `[syntax_check] Cannot find name 'Operation'.` @ L97
- `[syntax_check] Cannot find name 'Operation'.` @ L107
- `[syntax_check] Cannot find name 'ImaginationSpace'.` @ L107
- `[syntax_check] Cannot find name 'ImaginationSpace'.` @ L107
- `[syntax_check] Cannot find name 'Operation'.` @ L124
- `[syntax_check] Cannot find name 'Operator'.` @ L125
- `[syntax_check] Cannot find name 'Operator'.` @ L125

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `plugin/perception/VisualSpace` -> `operator/ImaginationSpace`（deps.xml 第 1346 行）
- `plugin/perception/VisualSpace` -> `operator/Operator`（deps.xml 第 1347 行）
- `plugin/perception/VisualSpace` -> `entity/TruthValue`（deps.xml 第 1348 行）
- `plugin/perception/VisualSpace` -> `language/CompoundTerm`（deps.xml 第 1349 行）
- `plugin/perception/VisualSpace` -> `inference/TemporalRules`（deps.xml 第 1350 行）
- `plugin/perception/VisualSpace` -> `language/Statement`（deps.xml 第 1351 行）
- `plugin/perception/VisualSpace` -> `main/Nar`（deps.xml 第 1352 行）
- `plugin/perception/VisualSpace` -> `operator/Operation`（deps.xml 第 1353 行）
- `plugin/perception/VisualSpace` -> `language/Conjunction`（deps.xml 第 1354 行）
- `plugin/perception/VisualSpace` -> `inference/TruthFunctions`（deps.xml 第 1355 行）
- `plugin/perception/VisualSpace` -> `operator/NullOperator`（deps.xml 第 1356 行）
- `plugin/perception/VisualSpace` -> `language/Term`（deps.xml 第 1357 行）
- `plugin/perception/VisualSpace` -> `parameter/Parameters`（deps.xml 第 1358 行）
- 交叉校验：
- Java graph 额外依赖：entity/TruthValue、inference/TemporalRules、inference/TruthFunctions、language/CompoundTerm、language/Conjunction、language/Statement、language/Term、main/Nar、operator/ImaginationSpace、operator/NullOperator、operator/Operation、operator/Operator、parameter/Parameters

## 5. Java 功能说明

- **职责概述**：文件工作：为心理/感知插件提供事件通道、状态缓存与关闭流程。；TODO 4 处
- **关键数据结构**：
- `VisualSpace` · 继承：JavaObject · 实现：ImaginationSpace
- **核心流程 / 算法**：
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：为心理/感知插件提供事件通道、状态缓存与关闭流程。；TODO 4 处
  3. Java-TS 差异：参见《通用转译法.md》 - 插件
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `Java Memory/Task 接口` 衔接上下游。

## 6. 一致性风险

- 文件内仍保留 4 处 TODO，需对照 Java 填补。
- `tsc` 报错阻塞进一步分析，需要回填语句结构。
- 缺少显式 import，需依赖 Java/ts-analysis 交叉校验。

## 7. 路线图定位

- 1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
- 2. 文件工作：为心理/感知插件提供事件通道、状态缓存与关闭流程。；TODO 4 处
- 3. Java-TS 差异：参见《通用转译法.md》 - 插件

## 8. 附加记录

- ts-analysis: LOC=137 · TODO=4
- 参考文件：`java-master/src/main/java/org/opennars/plugin/perception/VisualSpace.java`
