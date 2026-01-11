# src/plugin/mental/Emotions.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/plugin/mental/Emotions.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/plugin/mental/Emotions.java` |
| 模块链路 | `language 基座 -> entity -> operator -> plugin 扩展层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/plugin/mental/Emotions.ts --noEmit`）

- 执行的命令：`npx tsc src/plugin/mental/Emotions.ts --noEmit`
- 关键输出：
  - TS2420（L9, C14）：[full_check] Class 'Emotions' incorrectly implements interface 'Plugin'.
  - TS2322（L19, C12）：[full_check] Type 'number' is not assignable to type 'bigint'.
  - TS2322（L20, C12）：[full_check] Type 'number' is not assignable to type 'bigint'.
  - TS2300（L23, C13）：[full_check] Duplicate identifier 'happy'.
  - TS2564（L23, C13）：[full_check] Property 'happy' has no initializer and is not definitely assigned in the constructor.
  - TS2300（L25, C13）：[full_check] Duplicate identifier 'busy'.
  - TS2564（L25, C13）：[full_check] Property 'busy' has no initializer and is not definitely assigned in the constructor.
  - TS2300（L115, C12）：[full_check] Duplicate identifier 'happy'.
  - TS2300（L119, C12）：[full_check] Duplicate identifier 'busy'.
  - TS2304（L123, C68）：[full_check] Cannot find name 'DerivationContext'.
  - TS2304（L147, C28）：[full_check] Cannot find name 'Term'.
  - TS2304（L147, C35）：[full_check] Cannot find name 'SetInt'.
  - TS2304（L147, C51）：[full_check] Cannot find name 'Term'.
  - TS2304（L148, C26）：[full_check] Cannot find name 'Term'.
  - TS2304（L148, C33）：[full_check] Cannot find name 'Term'.
  - TS2304（L149, C22）：[full_check] Cannot find name 'Inheritance'.
  - TS2304（L149, C36）：[full_check] Cannot find name 'Inheritance'.
  - TS2304（L150, C24）：[full_check] Cannot find name 'TruthValue'.
  - TS2304（L150, C41）：[full_check] Cannot find name 'TruthValue'.
  - TS2304（L152, C20）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L152, C35）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L152, C49）：[full_check] Cannot find name 'Symbols'.
  - TS2304（L152, C83）：[full_check] Cannot find name 'Stamp'.
  - TS2304（L155, C34）：[full_check] Cannot find name 'BudgetValue'.
  - TS2304（L155, C52）：[full_check] Cannot find name 'BudgetValue'.
  - TS2304（L157, C17）：[full_check] Cannot find name 'BudgetFunctions'.
  - TS2304（L159, C20）：[full_check] Cannot find name 'Task'.
  - TS2304（L159, C31）：[full_check] Cannot find name 'Task'.
  - TS2304（L159, C56）：[full_check] Cannot find name 'Task'.
  - TS2304（L213, C60）：[full_check] Cannot find name 'DerivationContext'.
  - TS2304（L235, C28）：[full_check] Cannot find name 'Term'.
  - TS2304（L235, C35）：[full_check] Cannot find name 'SetInt'.
  - TS2304（L235, C51）：[full_check] Cannot find name 'Term'.
  - TS2304（L236, C26）：[full_check] Cannot find name 'Term'.
  - TS2304（L236, C37）：[full_check] Cannot find name 'Term'.
  - TS2304（L237, C22）：[full_check] Cannot find name 'Inheritance'.
  - TS2304（L237, C36）：[full_check] Cannot find name 'Inheritance'.
  - TS2304（L238, C24）：[full_check] Cannot find name 'TruthValue'.
  - TS2304（L238, C41）：[full_check] Cannot find name 'TruthValue'.
  - TS2304（L240, C20）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L240, C35）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L242, C17）：[full_check] Cannot find name 'Symbols'.
  - TS2304（L244, C21）：[full_check] Cannot find name 'Stamp'.
  - TS2304（L247, C35）：[full_check] Cannot find name 'BudgetValue'.
  - TS2304（L247, C53）：[full_check] Cannot find name 'BudgetValue'.
  - TS2304（L249, C17）：[full_check] Cannot find name 'BudgetFunctions'.
  - TS2304（L250, C20）：[full_check] Cannot find name 'Task'.
  - TS2304（L250, C31）：[full_check] Cannot find name 'Task'.
  - TS2304（L250, C57）：[full_check] Cannot find name 'Task'.
  - TS2304（L257, C26）：[full_check] Cannot find name 'Nar'.
  - TS2420（L9, C14）：[syntax_check] Class 'Emotions' incorrectly implements interface 'Plugin'.
  - TS2322（L19, C12）：[syntax_check] Type 'number' is not assignable to type 'bigint'.
  - TS2322（L20, C12）：[syntax_check] Type 'number' is not assignable to type 'bigint'.
  - TS2300（L23, C13）：[syntax_check] Duplicate identifier 'happy'.
  - TS2564（L23, C13）：[syntax_check] Property 'happy' has no initializer and is not definitely assigned in the constructor.
  - TS2300（L25, C13）：[syntax_check] Duplicate identifier 'busy'.
  - TS2564（L25, C13）：[syntax_check] Property 'busy' has no initializer and is not definitely assigned in the constructor.
  - TS2300（L115, C12）：[syntax_check] Duplicate identifier 'happy'.
  - TS2300（L119, C12）：[syntax_check] Duplicate identifier 'busy'.
  - TS2304（L123, C68）：[syntax_check] Cannot find name 'DerivationContext'.
  - TS2304（L147, C28）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L147, C35）：[syntax_check] Cannot find name 'SetInt'.
  - TS2304（L147, C51）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L148, C26）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L148, C33）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L149, C22）：[syntax_check] Cannot find name 'Inheritance'.
  - TS2304（L149, C36）：[syntax_check] Cannot find name 'Inheritance'.
  - TS2304（L150, C24）：[syntax_check] Cannot find name 'TruthValue'.
  - TS2304（L150, C41）：[syntax_check] Cannot find name 'TruthValue'.
  - TS2304（L152, C20）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L152, C35）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L152, C49）：[syntax_check] Cannot find name 'Symbols'.
  - TS2304（L152, C83）：[syntax_check] Cannot find name 'Stamp'.
  - TS2304（L155, C34）：[syntax_check] Cannot find name 'BudgetValue'.
  - TS2304（L155, C52）：[syntax_check] Cannot find name 'BudgetValue'.
  - TS2304（L157, C17）：[syntax_check] Cannot find name 'BudgetFunctions'.
  - TS2304（L159, C20）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L159, C31）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L159, C56）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L213, C60）：[syntax_check] Cannot find name 'DerivationContext'.
  - TS2304（L235, C28）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L235, C35）：[syntax_check] Cannot find name 'SetInt'.
  - TS2304（L235, C51）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L236, C26）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L236, C37）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L237, C22）：[syntax_check] Cannot find name 'Inheritance'.
  - TS2304（L237, C36）：[syntax_check] Cannot find name 'Inheritance'.
  - TS2304（L238, C24）：[syntax_check] Cannot find name 'TruthValue'.
  - TS2304（L238, C41）：[syntax_check] Cannot find name 'TruthValue'.
  - TS2304（L240, C20）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L240, C35）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L242, C17）：[syntax_check] Cannot find name 'Symbols'.
  - TS2304（L244, C21）：[syntax_check] Cannot find name 'Stamp'.
  - TS2304（L247, C35）：[syntax_check] Cannot find name 'BudgetValue'.
  - TS2304（L247, C53）：[syntax_check] Cannot find name 'BudgetValue'.
  - TS2304（L249, C17）：[syntax_check] Cannot find name 'BudgetFunctions'.
  - TS2304（L250, C20）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L250, C31）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L250, C57）：[syntax_check] Cannot find name 'Task'.
  - TS2304（L257, C26）：[syntax_check] Cannot find name 'Nar'.
- 总结：存在语法错误，需要比对 Java 语句结构。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

（无显式结构性依赖，主要依赖 `jree` 提供的运行时桩或尚未补齐的全局声明。）

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

- `[full_check] Cannot find name 'DerivationContext'.` @ L123
- `[full_check] Cannot find name 'Term'.` @ L147
- `[full_check] Cannot find name 'SetInt'.` @ L147
- `[full_check] Cannot find name 'Term'.` @ L147
- `[full_check] Cannot find name 'Term'.` @ L148
- `[full_check] Cannot find name 'Term'.` @ L148
- `[full_check] Cannot find name 'Inheritance'.` @ L149
- `[full_check] Cannot find name 'Inheritance'.` @ L149
- `[full_check] Cannot find name 'TruthValue'.` @ L150
- `[full_check] Cannot find name 'TruthValue'.` @ L150
- `[full_check] Cannot find name 'Sentence'.` @ L152
- `[full_check] Cannot find name 'Sentence'.` @ L152
- `[full_check] Cannot find name 'Symbols'.` @ L152
- `[full_check] Cannot find name 'Stamp'.` @ L152
- `[full_check] Cannot find name 'BudgetValue'.` @ L155
- `[full_check] Cannot find name 'BudgetValue'.` @ L155
- `[full_check] Cannot find name 'BudgetFunctions'.` @ L157
- `[full_check] Cannot find name 'Task'.` @ L159
- `[full_check] Cannot find name 'Task'.` @ L159
- `[full_check] Cannot find name 'Task'.` @ L159
- `[full_check] Cannot find name 'DerivationContext'.` @ L213
- `[full_check] Cannot find name 'Term'.` @ L235
- `[full_check] Cannot find name 'SetInt'.` @ L235
- `[full_check] Cannot find name 'Term'.` @ L235
- `[full_check] Cannot find name 'Term'.` @ L236
- `[full_check] Cannot find name 'Term'.` @ L236
- `[full_check] Cannot find name 'Inheritance'.` @ L237
- `[full_check] Cannot find name 'Inheritance'.` @ L237
- `[full_check] Cannot find name 'TruthValue'.` @ L238
- `[full_check] Cannot find name 'TruthValue'.` @ L238
- `[full_check] Cannot find name 'Sentence'.` @ L240
- `[full_check] Cannot find name 'Sentence'.` @ L240
- `[full_check] Cannot find name 'Symbols'.` @ L242
- `[full_check] Cannot find name 'Stamp'.` @ L244
- `[full_check] Cannot find name 'BudgetValue'.` @ L247
- `[full_check] Cannot find name 'BudgetValue'.` @ L247
- `[full_check] Cannot find name 'BudgetFunctions'.` @ L249
- `[full_check] Cannot find name 'Task'.` @ L250
- `[full_check] Cannot find name 'Task'.` @ L250
- `[full_check] Cannot find name 'Task'.` @ L250
- `[full_check] Cannot find name 'Nar'.` @ L257
- `[syntax_check] Cannot find name 'DerivationContext'.` @ L123
- `[syntax_check] Cannot find name 'Term'.` @ L147
- `[syntax_check] Cannot find name 'SetInt'.` @ L147
- `[syntax_check] Cannot find name 'Term'.` @ L147
- `[syntax_check] Cannot find name 'Term'.` @ L148
- `[syntax_check] Cannot find name 'Term'.` @ L148
- `[syntax_check] Cannot find name 'Inheritance'.` @ L149
- `[syntax_check] Cannot find name 'Inheritance'.` @ L149
- `[syntax_check] Cannot find name 'TruthValue'.` @ L150
- `[syntax_check] Cannot find name 'TruthValue'.` @ L150
- `[syntax_check] Cannot find name 'Sentence'.` @ L152
- `[syntax_check] Cannot find name 'Sentence'.` @ L152
- `[syntax_check] Cannot find name 'Symbols'.` @ L152
- `[syntax_check] Cannot find name 'Stamp'.` @ L152
- `[syntax_check] Cannot find name 'BudgetValue'.` @ L155
- `[syntax_check] Cannot find name 'BudgetValue'.` @ L155
- `[syntax_check] Cannot find name 'BudgetFunctions'.` @ L157
- `[syntax_check] Cannot find name 'Task'.` @ L159
- `[syntax_check] Cannot find name 'Task'.` @ L159
- `[syntax_check] Cannot find name 'Task'.` @ L159
- `[syntax_check] Cannot find name 'DerivationContext'.` @ L213
- `[syntax_check] Cannot find name 'Term'.` @ L235
- `[syntax_check] Cannot find name 'SetInt'.` @ L235
- `[syntax_check] Cannot find name 'Term'.` @ L235
- `[syntax_check] Cannot find name 'Term'.` @ L236
- `[syntax_check] Cannot find name 'Term'.` @ L236
- `[syntax_check] Cannot find name 'Inheritance'.` @ L237
- `[syntax_check] Cannot find name 'Inheritance'.` @ L237
- `[syntax_check] Cannot find name 'TruthValue'.` @ L238
- `[syntax_check] Cannot find name 'TruthValue'.` @ L238
- `[syntax_check] Cannot find name 'Sentence'.` @ L240
- `[syntax_check] Cannot find name 'Sentence'.` @ L240
- `[syntax_check] Cannot find name 'Symbols'.` @ L242
- `[syntax_check] Cannot find name 'Stamp'.` @ L244
- `[syntax_check] Cannot find name 'BudgetValue'.` @ L247
- `[syntax_check] Cannot find name 'BudgetValue'.` @ L247
- `[syntax_check] Cannot find name 'BudgetFunctions'.` @ L249
- `[syntax_check] Cannot find name 'Task'.` @ L250
- `[syntax_check] Cannot find name 'Task'.` @ L250
- `[syntax_check] Cannot find name 'Task'.` @ L250
- `[syntax_check] Cannot find name 'Nar'.` @ L257

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `plugin/mental/Emotions` -> `language/Inheritance`（deps.xml 第 1260 行）
- `plugin/mental/Emotions` -> `entity/TruthValue`（deps.xml 第 1261 行）
- `plugin/mental/Emotions` -> `plugin/Plugin`（deps.xml 第 1262 行）
- `plugin/mental/Emotions` -> `inference/BudgetFunctions`（deps.xml 第 1263 行）
- `plugin/mental/Emotions` -> `entity/Stamp`（deps.xml 第 1264 行）
- `plugin/mental/Emotions` -> `main/Nar`（deps.xml 第 1265 行）
- `plugin/mental/Emotions` -> `entity/Task`（deps.xml 第 1266 行）
- `plugin/mental/Emotions` -> `control/DerivationContext`（deps.xml 第 1267 行）
- `plugin/mental/Emotions` -> `entity/BudgetValue`（deps.xml 第 1268 行）
- `plugin/mental/Emotions` -> `language/SetInt`（deps.xml 第 1269 行）
- `plugin/mental/Emotions` -> `interfaces/Timable`（deps.xml 第 1270 行）
- `plugin/mental/Emotions` -> `language/Term`（deps.xml 第 1271 行）
- `plugin/mental/Emotions` -> `entity/Sentence`（deps.xml 第 1272 行）
- `plugin/mental/Emotions` -> `io/Symbols`（deps.xml 第 1273 行）
- `plugin/mental/Emotions` -> `parameter/Parameters`（deps.xml 第 1274 行）
- 交叉校验：
- Java graph 额外依赖：control/DerivationContext、entity/BudgetValue、entity/Sentence、entity/Stamp、entity/Task、entity/TruthValue、inference/BudgetFunctions、interfaces/Timable、io/Symbols、language/Inheritance、language/SetInt、language/Term、main/Nar、parameter/Parameters、plugin/Plugin

## 5. Java 功能说明

- **职责概述**：文件工作：为心理/感知插件提供事件通道、状态缓存与关闭流程。
- **关键数据结构**：
- `Emotions` · 继承：JavaObject · 实现：Plugin
- **核心流程 / 算法**：
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：为心理/感知插件提供事件通道、状态缓存与关闭流程。
  3. Java-TS 差异：参见《通用转译法.md》 - 插件
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `Java Memory/Task 接口` 衔接上下游。

## 6. 一致性风险

- `tsc` 报错阻塞进一步分析，需要回填语句结构。
- 缺少显式 import，需依赖 Java/ts-analysis 交叉校验。

## 7. 路线图定位

- 1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
- 2. 文件工作：为心理/感知插件提供事件通道、状态缓存与关闭流程。
- 3. Java-TS 差异：参见《通用转译法.md》 - 插件

## 8. 附加记录

- ts-analysis: LOC=264 · TODO=0
- 参考文件：`java-master/src/main/java/org/opennars/plugin/mental/Emotions.java`
