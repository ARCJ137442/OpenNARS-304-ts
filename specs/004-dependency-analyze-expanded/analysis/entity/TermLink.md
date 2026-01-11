# src/entity/TermLink.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/entity/TermLink.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/entity/TermLink.java` |
| 模块链路 | `language 基座 -> entity 实体层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/entity/TermLink.ts --noEmit`）

- 执行的命令：`npx tsc src/entity/TermLink.ts --noEmit`
- 关键输出：
  - TS2304（L21, C31）：[full_check] Cannot find name 'Item'.
  - TS2304（L21, C57）：[full_check] Cannot find name 'TLink'.
  - TS2304（L21, C63）：[full_check] Cannot find name 'Term'.
  - TS2304（L43, C29）：[full_check] Cannot find name 'Term'.
  - TS2564（L46, C21）：[full_check] Property 'type' has no initializer and is not definitely assigned in the constructor.
  - TS2564（L52, C21）：[full_check] Property 'index' has no initializer and is not definitely assigned in the constructor.
  - TS2564（L54, C24）：[full_check] Property 'hash' has no initializer and is not definitely assigned in the constructor.
  - TS2304（L65, C32）：[full_check] Cannot find name 'Term'.
  - TS2304（L76, C27）：[full_check] Cannot find name 'Term'.
  - TS2304（L76, C56）：[full_check] Cannot find name 'BudgetValue'.
  - TS2304（L78, C45）：[full_check] Cannot find name 'Term'.
  - TS2304（L80, C45）：[full_check] Cannot find name 'Term'.
  - TS2304（L82, C45）：[full_check] Cannot find name 'Term'.
  - TS2304（L84, C45）：[full_check] Cannot find name 'Term'.
  - TS2304（L88, C58）：[full_check] Cannot find name 'Term'.
  - TS2345（L100, C60）：[full_check] Argument of type 'Int16Array' is not assignable to parameter of type 'number[]'.
  - TS2740（L102, C21）：[full_check] Type 'number[]' is missing the following properties from type 'Int16Array': BYTES_PER_ELEMENT, buffer, byteLength, byteOffset, and 3 more.
  - TS2304（L111, C51）：[full_check] Cannot find name 'Term'.
  - TS2304（L111, C67）：[full_check] Cannot find name 'BudgetValue'.
  - TS2304（L127, C60）：[full_check] Cannot find name 'Term'.
  - TS2349（L130, C17）：[full_check] This expression is not callable.
  - TS17009（L130, C17）：[full_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L137, C64）：[full_check] Cannot find name 'Term'.
  - TS2349（L140, C17）：[full_check] This expression is not callable.
  - TS17009（L140, C17）：[full_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L147, C68）：[full_check] Cannot find name 'Term'.
  - TS2349（L150, C17）：[full_check] This expression is not callable.
  - TS17009（L150, C17）：[full_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L157, C72）：[full_check] Cannot find name 'Term'.
  - TS2349（L160, C17）：[full_check] This expression is not callable.
  - TS17009（L160, C17）：[full_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2367（L182, C13）：[full_check] This comparison appears to be unintentional because the types 'JavaObject' and 'this' have no overlap.
  - TS2304（L195, C21）：[full_check] Cannot find name 'Term'.
  - TS2304（L224, C19）：[full_check] Cannot find name 'Symbols'.
  - TS2304（L225, C19）：[full_check] Cannot find name 'Symbols'.
  - TS2304（L227, C19）：[full_check] Cannot find name 'Symbols'.
  - TS2304（L228, C19）：[full_check] Cannot find name 'Symbols'.
  - TS2304（L258, C25）：[full_check] Cannot find name 'Term'.
  - TS2304（L262, C23）：[full_check] Cannot find name 'Term'.
  - TS2304（L21, C31）：[syntax_check] Cannot find name 'Item'.
  - TS2304（L21, C57）：[syntax_check] Cannot find name 'TLink'.
  - TS2304（L21, C63）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L43, C29）：[syntax_check] Cannot find name 'Term'.
  - TS2564（L46, C21）：[syntax_check] Property 'type' has no initializer and is not definitely assigned in the constructor.
  - TS2564（L52, C21）：[syntax_check] Property 'index' has no initializer and is not definitely assigned in the constructor.
  - TS2564（L54, C24）：[syntax_check] Property 'hash' has no initializer and is not definitely assigned in the constructor.
  - TS2304（L65, C32）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L76, C27）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L76, C56）：[syntax_check] Cannot find name 'BudgetValue'.
  - TS2304（L78, C45）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L80, C45）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L82, C45）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L84, C45）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L88, C58）：[syntax_check] Cannot find name 'Term'.
  - TS2345（L100, C60）：[syntax_check] Argument of type 'Int16Array' is not assignable to parameter of type 'number[]'.
  - TS2740（L102, C21）：[syntax_check] Type 'number[]' is missing the following properties from type 'Int16Array': BYTES_PER_ELEMENT, buffer, byteLength, byteOffset, and 3 more.
  - TS2304（L111, C51）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L111, C67）：[syntax_check] Cannot find name 'BudgetValue'.
  - TS2304（L127, C60）：[syntax_check] Cannot find name 'Term'.
  - TS2349（L130, C17）：[syntax_check] This expression is not callable.
  - TS17009（L130, C17）：[syntax_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L137, C64）：[syntax_check] Cannot find name 'Term'.
  - TS2349（L140, C17）：[syntax_check] This expression is not callable.
  - TS17009（L140, C17）：[syntax_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L147, C68）：[syntax_check] Cannot find name 'Term'.
  - TS2349（L150, C17）：[syntax_check] This expression is not callable.
  - TS17009（L150, C17）：[syntax_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L157, C72）：[syntax_check] Cannot find name 'Term'.
  - TS2349（L160, C17）：[syntax_check] This expression is not callable.
  - TS17009（L160, C17）：[syntax_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2367（L182, C13）：[syntax_check] This comparison appears to be unintentional because the types 'JavaObject' and 'this' have no overlap.
  - TS2304（L195, C21）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L224, C19）：[syntax_check] Cannot find name 'Symbols'.
  - TS2304（L225, C19）：[syntax_check] Cannot find name 'Symbols'.
  - TS2304（L227, C19）：[syntax_check] Cannot find name 'Symbols'.
  - TS2304（L228, C19）：[syntax_check] Cannot find name 'Symbols'.
  - TS2304（L258, C25）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L262, C23）：[syntax_check] Cannot find name 'Term'.
- 总结：存在语法错误，需要比对 Java 语句结构。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

（无显式结构性依赖，主要依赖 `jree` 提供的运行时桩或尚未补齐的全局声明。）

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

- `[full_check] Cannot find name 'Item'.` @ L21
- `[full_check] Cannot find name 'TLink'.` @ L21
- `[full_check] Cannot find name 'Term'.` @ L21
- `[full_check] Cannot find name 'Term'.` @ L43
- `[full_check] Cannot find name 'Term'.` @ L65
- `[full_check] Cannot find name 'Term'.` @ L76
- `[full_check] Cannot find name 'BudgetValue'.` @ L76
- `[full_check] Cannot find name 'Term'.` @ L78
- `[full_check] Cannot find name 'Term'.` @ L80
- `[full_check] Cannot find name 'Term'.` @ L82
- `[full_check] Cannot find name 'Term'.` @ L84
- `[full_check] Cannot find name 'Term'.` @ L88
- `[full_check] Cannot find name 'Term'.` @ L111
- `[full_check] Cannot find name 'BudgetValue'.` @ L111
- `[full_check] Cannot find name 'Term'.` @ L127
- `[full_check] Cannot find name 'Term'.` @ L137
- `[full_check] Cannot find name 'Term'.` @ L147
- `[full_check] Cannot find name 'Term'.` @ L157
- `[full_check] Cannot find name 'Term'.` @ L195
- `[full_check] Cannot find name 'Symbols'.` @ L224
- `[full_check] Cannot find name 'Symbols'.` @ L225
- `[full_check] Cannot find name 'Symbols'.` @ L227
- `[full_check] Cannot find name 'Symbols'.` @ L228
- `[full_check] Cannot find name 'Term'.` @ L258
- `[full_check] Cannot find name 'Term'.` @ L262
- `[syntax_check] Cannot find name 'Item'.` @ L21
- `[syntax_check] Cannot find name 'TLink'.` @ L21
- `[syntax_check] Cannot find name 'Term'.` @ L21
- `[syntax_check] Cannot find name 'Term'.` @ L43
- `[syntax_check] Cannot find name 'Term'.` @ L65
- `[syntax_check] Cannot find name 'Term'.` @ L76
- `[syntax_check] Cannot find name 'BudgetValue'.` @ L76
- `[syntax_check] Cannot find name 'Term'.` @ L78
- `[syntax_check] Cannot find name 'Term'.` @ L80
- `[syntax_check] Cannot find name 'Term'.` @ L82
- `[syntax_check] Cannot find name 'Term'.` @ L84
- `[syntax_check] Cannot find name 'Term'.` @ L88
- `[syntax_check] Cannot find name 'Term'.` @ L111
- `[syntax_check] Cannot find name 'BudgetValue'.` @ L111
- `[syntax_check] Cannot find name 'Term'.` @ L127
- `[syntax_check] Cannot find name 'Term'.` @ L137
- `[syntax_check] Cannot find name 'Term'.` @ L147
- `[syntax_check] Cannot find name 'Term'.` @ L157
- `[syntax_check] Cannot find name 'Term'.` @ L195
- `[syntax_check] Cannot find name 'Symbols'.` @ L224
- `[syntax_check] Cannot find name 'Symbols'.` @ L225
- `[syntax_check] Cannot find name 'Symbols'.` @ L227
- `[syntax_check] Cannot find name 'Symbols'.` @ L228
- `[syntax_check] Cannot find name 'Term'.` @ L258
- `[syntax_check] Cannot find name 'Term'.` @ L262

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `entity/TermLink` -> `entity/TLink`（deps.xml 第 276 行）
- `entity/TermLink` -> `entity/Item`（deps.xml 第 277 行）
- `entity/TermLink` -> `entity/BudgetValue`（deps.xml 第 278 行）
- `entity/TermLink` -> `language/Term`（deps.xml 第 279 行）
- `entity/TermLink` -> `io/Symbols`（deps.xml 第 280 行）
- 交叉校验：
- Java graph 额外依赖：entity/BudgetValue、entity/Item、entity/TLink、io/Symbols、language/Term

## 5. Java 功能说明

- **职责概述**：文件工作：保持 Stamp/TruthValue 等值对象的不可变语义，补齐 clone/equals/hash 与序列化。；TODO 1 处
- **关键数据结构**：
- `TermLink` · 继承：Item<TermLink> · 实现：TLink<Term>
- **核心流程 / 算法**：
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：保持 Stamp/TruthValue 等值对象的不可变语义，补齐 clone/equals/hash 与序列化。；TODO 1 处
  3. Java-TS 差异：参见《通用转译法.md》 - 实体与序列化
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `Java Memory/Task 接口` 衔接上下游。

## 6. 一致性风险

- 文件内仍保留 1 处 TODO，需对照 Java 填补。
- `tsc` 报错阻塞进一步分析，需要回填语句结构。
- 缺少显式 import，需依赖 Java/ts-analysis 交叉校验。

## 7. 路线图定位

- 1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
- 2. 文件工作：保持 Stamp/TruthValue 等值对象的不可变语义，补齐 clone/equals/hash 与序列化。；TODO 1 处
- 3. Java-TS 差异：参见《通用转译法.md》 - 实体与序列化

## 8. 附加记录

- ts-analysis: LOC=265 · TODO=1
- 参考文件：`java-master/src/main/java/org/opennars/entity/TermLink.java`
