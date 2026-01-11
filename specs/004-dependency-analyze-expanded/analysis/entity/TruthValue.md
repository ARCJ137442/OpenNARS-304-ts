# src/entity/TruthValue.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/entity/TruthValue.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/entity/TruthValue.java` |
| 模块链路 | `language 基座 -> entity 实体层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/entity/TruthValue.ts --noEmit`）

- 执行的命令：`npx tsc src/entity/TruthValue.ts --noEmit`
- 关键输出：
  - TS2314（L13, C55）：[full_check] Generic type 'Cloneable<T>' requires 1 type argument(s).
  - TS2304（L15, C43）：[full_check] Cannot find name 'Term'.
  - TS2304（L15, C54）：[full_check] Cannot find name 'Term'.
  - TS2304（L16, C44）：[full_check] Cannot find name 'Term'.
  - TS2304（L16, C55）：[full_check] Cannot find name 'Term'.
  - TS2304（L17, C45）：[full_check] Cannot find name 'Term'.
  - TS2304（L17, C56）：[full_check] Cannot find name 'Term'.
  - TS2322（L22, C29）：[full_check] Type 'string' is not assignable to type 'number'.
  - TS2322（L26, C29）：[full_check] Type 'string' is not assignable to type 'number'.
  - TS2564（L30, C13）：[full_check] Property 'frequency' has no initializer and is not definitely assigned in the constructor.
  - TS2564（L34, C13）：[full_check] Property 'confidence' has no initializer and is not definitely assigned in the constructor.
  - TS2564（L40, C13）：[full_check] Property 'narParameters' has no initializer and is not definitely assigned in the constructor.
  - TS2349（L78, C17）：[full_check] This expression is not callable.
  - TS17009（L78, C17）：[full_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2349（L102, C17）：[full_check] This expression is not callable.
  - TS17009（L102, C17）：[full_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L275, C21）：[full_check] Cannot find name 'Texts'.
  - TS2304（L277, C21）：[full_check] Cannot find name 'Texts'.
  - TS2304（L302, C26）：[full_check] Cannot find name 'Term'.
  - TS2304（L314, C65）：[full_check] Cannot find name 'Term'.
  - TS2322（L322, C13）：[full_check] Type 'null' is not assignable to type 'TruthValue'.
  - TS2314（L13, C55）：[syntax_check] Generic type 'Cloneable<T>' requires 1 type argument(s).
  - TS2304（L15, C43）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L15, C54）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L16, C44）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L16, C55）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L17, C45）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L17, C56）：[syntax_check] Cannot find name 'Term'.
  - TS2322（L22, C29）：[syntax_check] Type 'string' is not assignable to type 'number'.
  - TS2322（L26, C29）：[syntax_check] Type 'string' is not assignable to type 'number'.
  - TS2564（L30, C13）：[syntax_check] Property 'frequency' has no initializer and is not definitely assigned in the constructor.
  - TS2564（L34, C13）：[syntax_check] Property 'confidence' has no initializer and is not definitely assigned in the constructor.
  - TS2564（L40, C13）：[syntax_check] Property 'narParameters' has no initializer and is not definitely assigned in the constructor.
  - TS2349（L78, C17）：[syntax_check] This expression is not callable.
  - TS17009（L78, C17）：[syntax_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2349（L102, C17）：[syntax_check] This expression is not callable.
  - TS17009（L102, C17）：[syntax_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L275, C21）：[syntax_check] Cannot find name 'Texts'.
  - TS2304（L277, C21）：[syntax_check] Cannot find name 'Texts'.
  - TS2304（L302, C26）：[syntax_check] Cannot find name 'Term'.
  - TS2304（L314, C65）：[syntax_check] Cannot find name 'Term'.
  - TS2322（L322, C13）：[syntax_check] Type 'null' is not assignable to type 'TruthValue'.
- 总结：存在语法错误，需要比对 Java 语句结构。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

| 符号 | 来源文件 | 触发位置 | 依赖原因 |
| --- | --- | --- | --- |
| `Symbols` | `src/io/Symbols.ts` | import | 结构性：TruthValue 直接使用 Symbols 的主流程 |
| `Parameters` | `src/main/Parameters.ts` | import | 结构性：TruthValue 直接使用 Parameters 的主流程 |

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

- `[full_check] Cannot find name 'Term'.` @ L15
- `[full_check] Cannot find name 'Term'.` @ L15
- `[full_check] Cannot find name 'Term'.` @ L16
- `[full_check] Cannot find name 'Term'.` @ L16
- `[full_check] Cannot find name 'Term'.` @ L17
- `[full_check] Cannot find name 'Term'.` @ L17
- `[full_check] Cannot find name 'Texts'.` @ L275
- `[full_check] Cannot find name 'Texts'.` @ L277
- `[full_check] Cannot find name 'Term'.` @ L302
- `[full_check] Cannot find name 'Term'.` @ L314
- `[syntax_check] Cannot find name 'Term'.` @ L15
- `[syntax_check] Cannot find name 'Term'.` @ L15
- `[syntax_check] Cannot find name 'Term'.` @ L16
- `[syntax_check] Cannot find name 'Term'.` @ L16
- `[syntax_check] Cannot find name 'Term'.` @ L17
- `[syntax_check] Cannot find name 'Term'.` @ L17
- `[syntax_check] Cannot find name 'Texts'.` @ L275
- `[syntax_check] Cannot find name 'Texts'.` @ L277
- `[syntax_check] Cannot find name 'Term'.` @ L302
- `[syntax_check] Cannot find name 'Term'.` @ L314

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `entity/TruthValue` -> `io/Texts`（deps.xml 第 284 行）
- `entity/TruthValue` -> `language/Term`（deps.xml 第 285 行）
- `entity/TruthValue` -> `io/Symbols`（deps.xml 第 286 行）
- `entity/TruthValue` -> `parameter/Parameters`（deps.xml 第 287 行）
- 交叉校验：
- TS 额外依赖：main/Parameters
- Java graph 额外依赖：io/Texts、language/Term、parameter/Parameters

## 5. Java 功能说明

- **职责概述**：文件工作：保持 Stamp/TruthValue 等值对象的不可变语义，补齐 clone/equals/hash 与序列化。
- **关键数据结构**：
- `TruthValue` · 继承：JavaObject · 实现：java.lang.Cloneable, java.io.Serializable
- **核心流程 / 算法**：
  1. 依赖准备：依赖：io/Symbols.ts, main/Parameters.ts
  2. 文件工作：保持 Stamp/TruthValue 等值对象的不可变语义，补齐 clone/equals/hash 与序列化。
  3. Java-TS 差异：参见《通用转译法.md》 - 实体与序列化
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `io/Symbols, main/Parameters` 衔接上下游。

## 6. 一致性风险

- `tsc` 报错阻塞进一步分析，需要回填语句结构。

## 7. 路线图定位

- 1. 依赖准备：依赖：io/Symbols.ts, main/Parameters.ts
- 2. 文件工作：保持 Stamp/TruthValue 等值对象的不可变语义，补齐 clone/equals/hash 与序列化。
- 3. Java-TS 差异：参见《通用转译法.md》 - 实体与序列化

## 8. 附加记录

- ts-analysis: LOC=332 · TODO=0
- 参考文件：`java-master/src/main/java/org/opennars/entity/TruthValue.java`
