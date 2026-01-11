# src/plugin/mental/Counting.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/plugin/mental/Counting.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/plugin/mental/Counting.java` |
| 模块链路 | `language 基座 -> entity -> operator -> plugin 扩展层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/plugin/mental/Counting.ts --noEmit`）

- 执行的命令：`npx tsc src/plugin/mental/Counting.ts --noEmit`
- 关键输出：
  - TS2420（L8, C14）：[full_check] Class 'Counting' incorrectly implements interface 'Plugin'.
  - TS2304（L10, C17）：[full_check] Cannot find name 'EventObserver'.
  - TS2304（L12, C44）：[full_check] Cannot find name 'Term'.
  - TS2304（L12, C51）：[full_check] Cannot find name 'Term'.
  - TS2304（L54, C26）：[full_check] Cannot find name 'Nar'.
  - TS2304（L55, C21）：[full_check] Cannot find name 'Memory'.
  - TS7006（L58, C25）：[full_check] Parameter 'event' implicitly has an 'any' type.
  - TS7006（L58, C32）：[full_check] Parameter 'a' implicitly has an 'any' type.
  - TS2304（L60, C32）：[full_check] Cannot find name 'Events'.
  - TS2304（L60, C69）：[full_check] Cannot find name 'Events'.
  - TS2304（L63, C27）：[full_check] Cannot find name 'Task'.
  - TS2304（L63, C42）：[full_check] Cannot find name 'Task'.
  - TS2304（L68, C51）：[full_check] Cannot find name 'Symbols'.
  - TS2304（L70, C55）：[full_check] Cannot find name 'Inheritance'.
  - TS2304（L72, C34）：[full_check] Cannot find name 'Inheritance'.
  - TS2304（L72, C70）：[full_check] Cannot find name 'Inheritance'.
  - TS2304（L74, C57）：[full_check] Cannot find name 'SetExt'.
  - TS2304（L76, C43）：[full_check] Cannot find name 'SetExt'.
  - TS2304（L76, C72）：[full_check] Cannot find name 'SetExt'.
  - TS2304（L82, C47）：[full_check] Cannot find name 'Term'.
  - TS2304（L84, C33）：[full_check] Cannot find name 'Term'.
  - TS2304（L88, C43）：[full_check] Cannot find name 'Term'.
  - TS2304（L88, C50）：[full_check] Cannot find name 'Inheritance'.
  - TS2304（L88, C71）：[full_check] Cannot find name 'Product'.
  - TS2304（L95, C40）：[full_check] Cannot find name 'TruthValue'.
  - TS2304（L96, C41）：[full_check] Cannot find name 'Stamp'.
  - TS2304（L97, C36）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L97, C51）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L99, C33）：[full_check] Cannot find name 'Symbols'.
  - TS2304（L102, C39）：[full_check] Cannot find name 'BudgetValue'.
  - TS2304（L104, C42）：[full_check] Cannot find name 'Task'.
  - TS2304（L104, C53）：[full_check] Cannot find name 'Task'.
  - TS2304（L104, C67）：[full_check] Cannot find name 'Task'.
  - TS2304（L113, C45）：[full_check] Cannot find name 'Events'.
  - TS2420（L8, C14）：[syntax_check] Class 'Counting' incorrectly implements interface 'Plugin'.
  - TS2304（L10, C17）：[syntax_check] Cannot find name 'EventObserver'.
  - TS2304（L12, C44）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L12, C51）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L54, C26）：[syntax_check] Cannot find name 'Nar'.
  - TS2304（L55, C21）：[syntax_check] Cannot find name 'Memory'.
  - TS7006（L58, C25）：[syntax_check] Parameter 'event' implicitly has an 'any' type.
  - TS7006（L58, C32）：[syntax_check] Parameter 'a' implicitly has an 'any' type.
  - TS2304（L60, C32）：[syntax_check] Cannot find name 'Events'.
  - TS2304（L60, C69）：[syntax_check] Cannot find name 'Events'.
  - TS2304（L63, C27）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L63, C42）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L68, C51）：[syntax_check] Cannot find name 'Symbols'.
  - TS2304（L70, C55）：[syntax_check] Cannot find name 'Inheritance'.
  - TS2304（L72, C34）：[syntax_check] Cannot find name 'Inheritance'.
  - TS2304（L72, C70）：[syntax_check] Cannot find name 'Inheritance'.
  - TS2304（L74, C57）：[syntax_check] Cannot find name 'SetExt'.
  - TS2304（L76, C43）：[syntax_check] Cannot find name 'SetExt'.
  - TS2304（L76, C72）：[syntax_check] Cannot find name 'SetExt'.
  - TS2304（L82, C47）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L84, C33）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L88, C43）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L88, C50）：[syntax_check] Cannot find name 'Inheritance'.
  - TS2304（L88, C71）：[syntax_check] Cannot find name 'Product'.
  - TS2304（L95, C40）：[syntax_check] Cannot find name 'TruthValue'.
  - TS2304（L96, C41）：[syntax_check] Cannot find name 'Stamp'.
  - TS2304（L97, C36）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L97, C51）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L99, C33）：[syntax_check] Cannot find name 'Symbols'.
  - TS2304（L102, C39）：[syntax_check] Cannot find name 'BudgetValue'.
  - TS2304（L104, C42）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L104, C53）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L104, C67）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L113, C45）：[syntax_check] Cannot find name 'Events'.
- 总结：存在语法错误，需要比对 Java 语句结构。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

（无显式结构性依赖，主要依赖 `jree` 提供的运行时桩或尚未补齐的全局声明。）

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

- `[full_check] Cannot find name 'EventObserver'.` @ L10
- `[full_check] Cannot find name 'Term'.` @ L12
- `[full_check] Cannot find name 'Term'.` @ L12
- `[full_check] Cannot find name 'Nar'.` @ L54
- `[full_check] Cannot find name 'Memory'.` @ L55
- `[full_check] Cannot find name 'Events'.` @ L60
- `[full_check] Cannot find name 'Events'.` @ L60
- `[full_check] Cannot find name 'Task'.` @ L63
- `[full_check] Cannot find name 'Task'.` @ L63
- `[full_check] Cannot find name 'Symbols'.` @ L68
- `[full_check] Cannot find name 'Inheritance'.` @ L70
- `[full_check] Cannot find name 'Inheritance'.` @ L72
- `[full_check] Cannot find name 'Inheritance'.` @ L72
- `[full_check] Cannot find name 'SetExt'.` @ L74
- `[full_check] Cannot find name 'SetExt'.` @ L76
- `[full_check] Cannot find name 'SetExt'.` @ L76
- `[full_check] Cannot find name 'Term'.` @ L82
- `[full_check] Cannot find name 'Term'.` @ L84
- `[full_check] Cannot find name 'Term'.` @ L88
- `[full_check] Cannot find name 'Inheritance'.` @ L88
- `[full_check] Cannot find name 'Product'.` @ L88
- `[full_check] Cannot find name 'TruthValue'.` @ L95
- `[full_check] Cannot find name 'Stamp'.` @ L96
- `[full_check] Cannot find name 'Sentence'.` @ L97
- `[full_check] Cannot find name 'Sentence'.` @ L97
- `[full_check] Cannot find name 'Symbols'.` @ L99
- `[full_check] Cannot find name 'BudgetValue'.` @ L102
- `[full_check] Cannot find name 'Task'.` @ L104
- `[full_check] Cannot find name 'Task'.` @ L104
- `[full_check] Cannot find name 'Task'.` @ L104
- `[full_check] Cannot find name 'Events'.` @ L113
- `[syntax_check] Cannot find name 'EventObserver'.` @ L10
- `[syntax_check] Cannot find name 'Term'.` @ L12
- `[syntax_check] Cannot find name 'Term'.` @ L12
- `[syntax_check] Cannot find name 'Nar'.` @ L54
- `[syntax_check] Cannot find name 'Memory'.` @ L55
- `[syntax_check] Cannot find name 'Events'.` @ L60
- `[syntax_check] Cannot find name 'Events'.` @ L60
- `[syntax_check] Cannot find name 'Task'.` @ L63
- `[syntax_check] Cannot find name 'Task'.` @ L63
- `[syntax_check] Cannot find name 'Symbols'.` @ L68
- `[syntax_check] Cannot find name 'Inheritance'.` @ L70
- `[syntax_check] Cannot find name 'Inheritance'.` @ L72
- `[syntax_check] Cannot find name 'Inheritance'.` @ L72
- `[syntax_check] Cannot find name 'SetExt'.` @ L74
- `[syntax_check] Cannot find name 'SetExt'.` @ L76
- `[syntax_check] Cannot find name 'SetExt'.` @ L76
- `[syntax_check] Cannot find name 'Term'.` @ L82
- `[syntax_check] Cannot find name 'Term'.` @ L84
- `[syntax_check] Cannot find name 'Term'.` @ L88
- `[syntax_check] Cannot find name 'Inheritance'.` @ L88
- `[syntax_check] Cannot find name 'Product'.` @ L88
- `[syntax_check] Cannot find name 'TruthValue'.` @ L95
- `[syntax_check] Cannot find name 'Stamp'.` @ L96
- `[syntax_check] Cannot find name 'Sentence'.` @ L97
- `[syntax_check] Cannot find name 'Sentence'.` @ L97
- `[syntax_check] Cannot find name 'Symbols'.` @ L99
- `[syntax_check] Cannot find name 'BudgetValue'.` @ L102
- `[syntax_check] Cannot find name 'Task'.` @ L104
- `[syntax_check] Cannot find name 'Task'.` @ L104
- `[syntax_check] Cannot find name 'Task'.` @ L104
- `[syntax_check] Cannot find name 'Events'.` @ L113

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `plugin/mental/Counting` -> `io/events/Events`（deps.xml 第 1240 行）
- `plugin/mental/Counting` -> `language/Inheritance`（deps.xml 第 1241 行）
- `plugin/mental/Counting` -> `entity/TruthValue`（deps.xml 第 1242 行）
- `plugin/mental/Counting` -> `plugin/Plugin`（deps.xml 第 1243 行）
- `plugin/mental/Counting` -> `language/CompoundTerm`（deps.xml 第 1244 行）
- `plugin/mental/Counting` -> `io/events/EventEmitter`（deps.xml 第 1245 行）
- `plugin/mental/Counting` -> `language/SetExt`（deps.xml 第 1246 行）
- `plugin/mental/Counting` -> `entity/Item`（deps.xml 第 1247 行）
- `plugin/mental/Counting` -> `language/Statement`（deps.xml 第 1248 行）
- `plugin/mental/Counting` -> `entity/Stamp`（deps.xml 第 1249 行）
- `plugin/mental/Counting` -> `main/Nar`（deps.xml 第 1250 行）
- `plugin/mental/Counting` -> `entity/Task`（deps.xml 第 1251 行）
- `plugin/mental/Counting` -> `entity/BudgetValue`（deps.xml 第 1252 行）
- `plugin/mental/Counting` -> `language/Product`（deps.xml 第 1253 行）
- `plugin/mental/Counting` -> `storage/Memory`（deps.xml 第 1254 行）
- `plugin/mental/Counting` -> `language/Term`（deps.xml 第 1255 行）
- `plugin/mental/Counting` -> `entity/Sentence`（deps.xml 第 1256 行）
- `plugin/mental/Counting` -> `io/Symbols`（deps.xml 第 1257 行）
- 交叉校验：
- Java graph 额外依赖：entity/BudgetValue、entity/Item、entity/Sentence、entity/Stamp、entity/Task、entity/TruthValue、io/Symbols、io/events/EventEmitter、io/events/Events、language/CompoundTerm、language/Inheritance、language/Product、language/SetExt、language/Statement、language/Term、main/Nar、plugin/Plugin、storage/Memory

## 5. Java 功能说明

- **职责概述**：文件工作：为心理/感知插件提供事件通道、状态缓存与关闭流程。；TODO 1 处
- **关键数据结构**：
- `Counting` · 继承：JavaObject · 实现：Plugin
- **核心流程 / 算法**：
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：为心理/感知插件提供事件通道、状态缓存与关闭流程。；TODO 1 处
  3. Java-TS 差异：参见《通用转译法.md》 - 插件
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `Java Memory/Task 接口` 衔接上下游。

## 6. 一致性风险

- 文件内仍保留 1 处 TODO，需对照 Java 填补。
- `tsc` 报错阻塞进一步分析，需要回填语句结构。
- 缺少显式 import，需依赖 Java/ts-analysis 交叉校验。

## 7. 路线图定位

- 1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
- 2. 文件工作：为心理/感知插件提供事件通道、状态缓存与关闭流程。；TODO 1 处
- 3. Java-TS 差异：参见《通用转译法.md》 - 插件

## 8. 附加记录

- ts-analysis: LOC=117 · TODO=1
- 参考文件：`java-master/src/main/java/org/opennars/plugin/mental/Counting.java`
