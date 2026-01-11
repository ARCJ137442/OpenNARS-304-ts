# src/entity/Task.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/entity/Task.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/entity/Task.java` |
| 模块链路 | `language 基座 -> entity 实体层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/entity/Task.ts --noEmit`）

- 执行的命令：`npx tsc src/entity/Task.ts --noEmit`
- 关键输出：
  - TS2304（L16, C27）：[full_check] Cannot find name 'Item'.
  - TS2304（L16, C32）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L19, C31）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L21, C35）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L26, C24）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L28, C27）：[full_check] Cannot find name 'Sentence'.
  - TS2300（L32, C13）：[full_check] Duplicate identifier 'isInput'.
  - TS2304（L40, C27）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L40, C40）：[full_check] Cannot find name 'BudgetValue'.
  - TS2304（L49, C27）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L49, C40）：[full_check] Cannot find name 'BudgetValue'.
  - TS2304（L49, C67）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L59, C27）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L59, C40）：[full_check] Cannot find name 'BudgetValue'.
  - TS2304（L59, C67）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L59, C87）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L63, C47）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L63, C57）：[full_check] Cannot find name 'BudgetValue'.
  - TS2349（L66, C17）：[full_check] This expression is not callable.
  - TS17009（L66, C17）：[full_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS17009（L67, C17）：[full_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L74, C55）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L74, C65）：[full_check] Cannot find name 'BudgetValue'.
  - TS2304（L74, C78）：[full_check] Cannot find name 'Sentence'.
  - TS2349（L77, C17）：[full_check] This expression is not callable.
  - TS17009（L77, C17）：[full_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L84, C65）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L84, C75）：[full_check] Cannot find name 'BudgetValue'.
  - TS2304（L84, C88）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L84, C98）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L103, C20）：[full_check] Cannot find name 'Sentence'.
  - TS2367（L108, C13）：[full_check] This comparison appears to be unintentional because the types 'JavaObject' and 'this' have no overlap.
  - TS2300（L135, C12）：[full_check] Duplicate identifier 'isInput'.
  - TS2304（L140, C16）：[full_check] Cannot find name 'budget'.
  - TS2304（L148, C24）：[full_check] Cannot find name 'Item'.
  - TS2304（L148, C40）：[full_check] Cannot find name 'Item'.
  - TS2304（L161, C31）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L171, C36）：[full_check] Cannot find name 'Memory'.
  - TS2304（L171, C54）：[full_check] Cannot find name 'Sentence'.
  - TS2304（L171, C70）：[full_check] Cannot find name 'Timable'.
  - TS2304（L173, C13）：[full_check] Cannot find name 'InternalExperience'.
  - TS2304（L183, C31）：[full_check] Cannot find name 'Sentence'.
  - TS2349（L211, C52）：[full_check] This expression is not callable.
  - TS2304（L214, C23）：[full_check] Cannot find name 'Term'.
  - TS2304（L16, C27）：[syntax_check] Cannot find name 'Item'.
  - TS2304（L16, C32）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L19, C31）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L21, C35）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L26, C24）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L28, C27）：[syntax_check] Cannot find name 'Sentence'.
  - TS2300（L32, C13）：[syntax_check] Duplicate identifier 'isInput'.
  - TS2304（L40, C27）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L40, C40）：[syntax_check] Cannot find name 'BudgetValue'.
  - TS2304（L49, C27）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L49, C40）：[syntax_check] Cannot find name 'BudgetValue'.
  - TS2304（L49, C67）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L59, C27）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L59, C40）：[syntax_check] Cannot find name 'BudgetValue'.
  - TS2304（L59, C67）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L59, C87）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L63, C47）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L63, C57）：[syntax_check] Cannot find name 'BudgetValue'.
  - TS2349（L66, C17）：[syntax_check] This expression is not callable.
  - TS17009（L66, C17）：[syntax_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS17009（L67, C17）：[syntax_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L74, C55）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L74, C65）：[syntax_check] Cannot find name 'BudgetValue'.
  - TS2304（L74, C78）：[syntax_check] Cannot find name 'Sentence'.
  - TS2349（L77, C17）：[syntax_check] This expression is not callable.
  - TS17009（L77, C17）：[syntax_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L84, C65）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L84, C75）：[syntax_check] Cannot find name 'BudgetValue'.
  - TS2304（L84, C88）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L84, C98）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L103, C20）：[syntax_check] Cannot find name 'Sentence'.
  - TS2367（L108, C13）：[syntax_check] This comparison appears to be unintentional because the types 'JavaObject' and 'this' have no overlap.
  - TS2300（L135, C12）：[syntax_check] Duplicate identifier 'isInput'.
  - TS2304（L140, C16）：[syntax_check] Cannot find name 'budget'.
  - TS2304（L148, C24）：[syntax_check] Cannot find name 'Item'.
  - TS2304（L148, C40）：[syntax_check] Cannot find name 'Item'.
  - TS2304（L161, C31）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L171, C36）：[syntax_check] Cannot find name 'Memory'.
  - TS2304（L171, C54）：[syntax_check] Cannot find name 'Sentence'.
  - TS2304（L171, C70）：[syntax_check] Cannot find name 'Timable'.
  - TS2304（L173, C13）：[syntax_check] Cannot find name 'InternalExperience'.
  - TS2304（L183, C31）：[syntax_check] Cannot find name 'Sentence'.
  - TS2349（L211, C52）：[syntax_check] This expression is not callable.
  - TS2304（L214, C23）：[syntax_check] Cannot find name 'Term'.
- 总结：存在语法错误，需要比对 Java 语句结构。；编译失败：TS1005 @ 222:25 ';' expected. ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

（无显式结构性依赖，主要依赖 `jree` 提供的运行时桩或尚未补齐的全局声明。）

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

- `[full_check] Cannot find name 'Item'.` @ L16
- `[full_check] Cannot find name 'Sentence'.` @ L16
- `[full_check] Cannot find name 'Sentence'.` @ L19
- `[full_check] Cannot find name 'Sentence'.` @ L21
- `[full_check] Cannot find name 'Sentence'.` @ L26
- `[full_check] Cannot find name 'Sentence'.` @ L28
- `[full_check] Cannot find name 'Sentence'.` @ L40
- `[full_check] Cannot find name 'BudgetValue'.` @ L40
- `[full_check] Cannot find name 'Sentence'.` @ L49
- `[full_check] Cannot find name 'BudgetValue'.` @ L49
- `[full_check] Cannot find name 'Sentence'.` @ L49
- `[full_check] Cannot find name 'Sentence'.` @ L59
- `[full_check] Cannot find name 'BudgetValue'.` @ L59
- `[full_check] Cannot find name 'Sentence'.` @ L59
- `[full_check] Cannot find name 'Sentence'.` @ L59
- `[full_check] Cannot find name 'Sentence'.` @ L63
- `[full_check] Cannot find name 'BudgetValue'.` @ L63
- `[full_check] Cannot find name 'Sentence'.` @ L74
- `[full_check] Cannot find name 'BudgetValue'.` @ L74
- `[full_check] Cannot find name 'Sentence'.` @ L74
- `[full_check] Cannot find name 'Sentence'.` @ L84
- `[full_check] Cannot find name 'BudgetValue'.` @ L84
- `[full_check] Cannot find name 'Sentence'.` @ L84
- `[full_check] Cannot find name 'Sentence'.` @ L84
- `[full_check] Cannot find name 'Sentence'.` @ L103
- `[full_check] Cannot find name 'budget'.` @ L140
- `[full_check] Cannot find name 'Item'.` @ L148
- `[full_check] Cannot find name 'Item'.` @ L148
- `[full_check] Cannot find name 'Sentence'.` @ L161
- `[full_check] Cannot find name 'Memory'.` @ L171
- `[full_check] Cannot find name 'Sentence'.` @ L171
- `[full_check] Cannot find name 'Timable'.` @ L171
- `[full_check] Cannot find name 'InternalExperience'.` @ L173
- `[full_check] Cannot find name 'Sentence'.` @ L183
- `[full_check] Cannot find name 'Term'.` @ L214
- `[syntax_check] Cannot find name 'Item'.` @ L16
- `[syntax_check] Cannot find name 'Sentence'.` @ L16
- `[syntax_check] Cannot find name 'Sentence'.` @ L19
- `[syntax_check] Cannot find name 'Sentence'.` @ L21
- `[syntax_check] Cannot find name 'Sentence'.` @ L26
- `[syntax_check] Cannot find name 'Sentence'.` @ L28
- `[syntax_check] Cannot find name 'Sentence'.` @ L40
- `[syntax_check] Cannot find name 'BudgetValue'.` @ L40
- `[syntax_check] Cannot find name 'Sentence'.` @ L49
- `[syntax_check] Cannot find name 'BudgetValue'.` @ L49
- `[syntax_check] Cannot find name 'Sentence'.` @ L49
- `[syntax_check] Cannot find name 'Sentence'.` @ L59
- `[syntax_check] Cannot find name 'BudgetValue'.` @ L59
- `[syntax_check] Cannot find name 'Sentence'.` @ L59
- `[syntax_check] Cannot find name 'Sentence'.` @ L59
- `[syntax_check] Cannot find name 'Sentence'.` @ L63
- `[syntax_check] Cannot find name 'BudgetValue'.` @ L63
- `[syntax_check] Cannot find name 'Sentence'.` @ L74
- `[syntax_check] Cannot find name 'BudgetValue'.` @ L74
- `[syntax_check] Cannot find name 'Sentence'.` @ L74
- `[syntax_check] Cannot find name 'Sentence'.` @ L84
- `[syntax_check] Cannot find name 'BudgetValue'.` @ L84
- `[syntax_check] Cannot find name 'Sentence'.` @ L84
- `[syntax_check] Cannot find name 'Sentence'.` @ L84
- `[syntax_check] Cannot find name 'Sentence'.` @ L103
- `[syntax_check] Cannot find name 'budget'.` @ L140
- `[syntax_check] Cannot find name 'Item'.` @ L148
- `[syntax_check] Cannot find name 'Item'.` @ L148
- `[syntax_check] Cannot find name 'Sentence'.` @ L161
- `[syntax_check] Cannot find name 'Memory'.` @ L171
- `[syntax_check] Cannot find name 'Sentence'.` @ L171
- `[syntax_check] Cannot find name 'Timable'.` @ L171
- `[syntax_check] Cannot find name 'InternalExperience'.` @ L173
- `[syntax_check] Cannot find name 'Sentence'.` @ L183
- `[syntax_check] Cannot find name 'Term'.` @ L214

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `entity/Task` -> `entity/Item`（deps.xml 第 256 行）
- `entity/Task` -> `entity/Stamp`（deps.xml 第 257 行）
- `entity/Task` -> `plugin/mental/InternalExperience`（deps.xml 第 258 行）
- `entity/Task` -> `entity/BudgetValue`（deps.xml 第 259 行）
- `entity/Task` -> `interfaces/Timable`（deps.xml 第 260 行）
- `entity/Task` -> `storage/Memory`（deps.xml 第 261 行）
- `entity/Task` -> `language/Term`（deps.xml 第 262 行）
- `entity/Task` -> `entity/Sentence`（deps.xml 第 263 行）
- 交叉校验：
- Java graph 额外依赖：entity/BudgetValue、entity/Item、entity/Sentence、entity/Stamp、interfaces/Timable、language/Term、plugin/mental/InternalExperience、storage/Memory

## 5. Java 功能说明

- **职责概述**：文件工作：保持 Stamp/TruthValue 等值对象的不可变语义，补齐 clone/equals/hash 与序列化。；tsc TS1005 @ 222:25 错误
- **关键数据结构**：
- `Task` · 继承：Item<Sentence> · 实现：（无接口）
- **核心流程 / 算法**：
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：保持 Stamp/TruthValue 等值对象的不可变语义，补齐 clone/equals/hash 与序列化。；tsc TS1005 @ 222:25 错误
  3. Java-TS 差异：参见《通用转译法.md》 - 实体与序列化
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `Java Memory/Task 接口` 衔接上下游。

## 6. 一致性风险

- `tsc` 报错阻塞进一步分析，需要回填语句结构。
- 缺少显式 import，需依赖 Java/ts-analysis 交叉校验。

## 7. 路线图定位

- 1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
- 2. 文件工作：保持 Stamp/TruthValue 等值对象的不可变语义，补齐 clone/equals/hash 与序列化。；tsc TS1005 @ 222:25 错误
- 3. Java-TS 差异：参见《通用转译法.md》 - 实体与序列化

## 8. 附加记录

- ts-analysis: LOC=232 · TODO=0
- 参考文件：`java-master/src/main/java/org/opennars/entity/Task.java`
