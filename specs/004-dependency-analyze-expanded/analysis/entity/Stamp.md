# src/entity/Stamp.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/entity/Stamp.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/entity/Stamp.java` |
| 模块链路 | `language 基座 -> entity 实体层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/entity/Stamp.ts --noEmit`）

- 执行的命令：`npx tsc src/entity/Stamp.ts --noEmit`
- 关键输出：
  - TS2314（L11, C50）：[full_check] Generic type 'Cloneable<T>' requires 1 type argument(s).
  - TS2564（L15, C12）：[full_check] Property 'evidentialBase' has no initializer and is not definitely assigned in the constructor.
  - TS2564（L18, C12）：[full_check] Property 'baseLength' has no initializer and is not definitely assigned in the constructor.
  - TS2564（L21, C13）：[full_check] Property 'creationTime' has no initializer and is not definitely assigned in the constructor.
  - TS2564（L24, C13）：[full_check] Property 'occurrenceTime' has no initializer and is not definitely assigned in the constructor.
  - TS2322（L30, C28）：[full_check] Type 'number' is not assignable to type 'bigint'.
  - TS2322（L36, C13）：[full_check] Type 'null' is not assignable to type 'BaseEntry[]'.
  - TS2304（L39, C20）：[full_check] Cannot find name 'Tense'.
  - TS2300（L45, C15）：[full_check] Duplicate identifier 'name'.
  - TS2322（L45, C15）：[full_check] Type 'null' is not assignable to type 'CharSequence'.
  - TS2300（L55, C13）：[full_check] Duplicate identifier 'evidentialHash'.
  - TS2564（L55, C13）：[full_check] Property 'evidentialHash' has no initializer and is not definitely assigned in the constructor.
  - TS2339（L60, C36）：[full_check] Property 'order' does not exist on type 'typeof ByteBuffer'.
  - TS2304（L60, C95）：[full_check] Cannot find name 'TemporalRules'.
  - TS2339（L66, C36）：[full_check] Property 'order' does not exist on type 'typeof ByteBuffer'.
  - TS2304（L66, C95）：[full_check] Cannot find name 'TemporalRules'.
  - TS2385（L78, C5）：[full_check] Overload signatures must all be public, private or protected.
  - TS2304（L84, C34）：[full_check] Cannot find name 'Tense'.
  - TS2385（L95, C5）：[full_check] Overload signatures must all be public, private or protected.
  - TS2385（L98, C5）：[full_check] Overload signatures must all be public, private or protected.
  - TS2304（L98, C30）：[full_check] Cannot find name 'Timable'.
  - TS2304（L98, C47）：[full_check] Cannot find name 'Memory'.
  - TS2385（L100, C5）：[full_check] Overload signatures must all be public, private or protected.
  - TS2385（L102, C5）：[full_check] Overload signatures must all be public, private or protected.
  - TS2304（L102, C30）：[full_check] Cannot find name 'Timable'.
  - TS2304（L102, C47）：[full_check] Cannot find name 'Memory'.
  - TS2304（L102, C62）：[full_check] Cannot find name 'Tense'.
  - TS2385（L109, C5）：[full_check] Overload signatures must all be public, private or protected.
  - TS2304（L109, C43）：[full_check] Cannot find name 'Tense'.
  - TS2385（L118, C5）：[full_check] Overload signatures must all be public, private or protected.
  - TS2314（L118, C80）：[full_check] Generic type 'Parameters' requires 1 type argument(s).
  - TS2349（L125, C17）：[full_check] This expression is not callable.
  - TS17009（L125, C17）：[full_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L132, C50）：[full_check] Cannot find name 'Tense'.
  - TS2322（L140, C17）：[full_check] Type 'number' is not assignable to type 'bigint'.
  - TS2349（L150, C17）：[full_check] This expression is not callable.
  - TS17009（L150, C17）：[full_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L157, C49）：[full_check] Cannot find name 'Timable'.
  - TS2304（L157, C58）：[full_check] Cannot find name 'Memory'.
  - TS2349（L160, C17）：[full_check] This expression is not callable.
  - TS17009（L160, C17）：[full_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L160, C36）：[full_check] Cannot find name 'Tense'.
  - TS2304（L182, C56）：[full_check] Cannot find name 'Timable'.
  - TS2304（L182, C65）：[full_check] Cannot find name 'Memory'.
  - TS2304（L182, C73）：[full_check] Cannot find name 'Tense'.
  - TS2349（L185, C17）：[full_check] This expression is not callable.
  - TS17009（L185, C17）：[full_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L192, C72）：[full_check] Cannot find name 'Tense'.
  - TS2349（L195, C17）：[full_check] This expression is not callable.
  - TS17009（L195, C17）：[full_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS17009（L196, C17）：[full_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2314（L203, C91）：[full_check] Generic type 'Parameters' requires 1 type argument(s).
  - TS2304（L280, C13）：[full_check] Cannot find name 'Debug'.
  - TS2304（L281, C53）：[full_check] Cannot find name 'Tense'.
  - TS2304（L299, C35）：[full_check] Cannot find name 'Past'.
  - TS2365（L300, C35）：[full_check] Operator '-' cannot be applied to types 'bigint' and 'number'.
  - TS2339（L301, C56）：[full_check] Property 'Future' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/util/concurrent/index")'.
  - TS2365（L302, C35）：[full_check] Operator '+' cannot be applied to types 'bigint' and 'number'.
  - TS2304（L303, C35）：[full_check] Cannot find name 'Present'.
  - TS2339（L321, C40）：[full_check] Property 'clone' does not exist on type 'BaseEntry[]'.
  - TS2322（L332, C13）：[full_check] Type 'null' is not assignable to type 'BaseEntry'.
  - TS2322（L340, C9）：[full_check] Type 'null' is not assignable to type 'BaseEntry'.
  - TS2349（L402, C30）：[full_check] This expression is not callable.
  - TS2349（L402, C53）：[full_check] This expression is not callable.
  - TS2300（L425, C12）：[full_check] Duplicate identifier 'evidentialHash'.
  - TS2304（L434, C23）：[full_check] Cannot find name 'Tense'.
  - TS2322（L471, C13）：[full_check] Type 'string' is not assignable to type 'JavaString'.
  - TS2322（L480, C13）：[full_check] Type 'string' is not assignable to type 'JavaString'.
  - TS2304（L482, C17）：[full_check] Cannot find name 'TemporalRules'.
  - TS2304（L483, C18）：[full_check] Cannot find name 'ORDER_FORWARD'.
  - TS2304（L484, C24）：[full_check] Cannot find name 'Symbols'.
  - TS2304（L485, C18）：[full_check] Cannot find name 'ORDER_BACKWARD'.
  - TS2304（L486, C24）：[full_check] Cannot find name 'Symbols'.
  - TS2304（L488, C24）：[full_check] Cannot find name 'Symbols'.
  - TS2304（L497, C30）：[full_check] Cannot find name 'Tense'.
  - TS2322（L499, C13）：[full_check] Type 'null' is not assignable to type 'CharSequence'.
  - TS2300（L503, C12）：[full_check] Duplicate identifier 'name'.
  - TS2304（L509, C27）：[full_check] Cannot find name 'Symbols'.
  - TS2304（L513, C39）：[full_check] Cannot find name 'Symbols'.
  - TS2304（L517, C35）：[full_check] Cannot find name 'Symbols'.
  - TS2304（L520, C27）：[full_check] Cannot find name 'Symbols'.
  - TS2349（L531, C21）：[full_check] This expression is not callable.
  - TS2322（L570, C13）：[full_check] Type 'string' is not assignable to type 'JavaString'.
  - TS2339（L587, C54）：[full_check] Property 'hashCode' does not exist on type 'typeof Long'.
  - TS2339（L588, C54）：[full_check] Property 'hashCode' does not exist on type 'typeof Long'.
  - TS2339（L593, C41）：[full_check] Property 'comparing' does not exist on type 'typeof Comparator'.
  - TS2339（L593, C61）：[full_check] Property 'getNarId' does not exist on type 'typeof BaseEntry'.
  - TS2339（L594, C42）：[full_check] Property 'getInputId' does not exist on type 'typeof BaseEntry'.
  - TS2314（L11, C50）：[syntax_check] Generic type 'Cloneable<T>' requires 1 type argument(s).
  - TS2564（L15, C12）：[syntax_check] Property 'evidentialBase' has no initializer and is not definitely assigned in the constructor.
  - TS2564（L18, C12）：[syntax_check] Property 'baseLength' has no initializer and is not definitely assigned in the constructor.
  - TS2564（L21, C13）：[syntax_check] Property 'creationTime' has no initializer and is not definitely assigned in the constructor.
  - TS2564（L24, C13）：[syntax_check] Property 'occurrenceTime' has no initializer and is not definitely assigned in the constructor.
  - TS2322（L30, C28）：[syntax_check] Type 'number' is not assignable to type 'bigint'.
  - TS2322（L36, C13）：[syntax_check] Type 'null' is not assignable to type 'BaseEntry[]'.
  - TS2304（L39, C20）：[syntax_check] Cannot find name 'Tense'.
  - TS2300（L45, C15）：[syntax_check] Duplicate identifier 'name'.
  - TS2322（L45, C15）：[syntax_check] Type 'null' is not assignable to type 'CharSequence'.
  - TS2300（L55, C13）：[syntax_check] Duplicate identifier 'evidentialHash'.
  - TS2564（L55, C13）：[syntax_check] Property 'evidentialHash' has no initializer and is not definitely assigned in the constructor.
  - TS2339（L60, C36）：[syntax_check] Property 'order' does not exist on type 'typeof ByteBuffer'.
  - TS2304（L60, C95）：[syntax_check] Cannot find name 'TemporalRules'.
  - TS2339（L66, C36）：[syntax_check] Property 'order' does not exist on type 'typeof ByteBuffer'.
  - TS2304（L66, C95）：[syntax_check] Cannot find name 'TemporalRules'.
  - TS2385（L78, C5）：[syntax_check] Overload signatures must all be public, private or protected.
  - TS2304（L84, C34）：[syntax_check] Cannot find name 'Tense'.
  - TS2385（L95, C5）：[syntax_check] Overload signatures must all be public, private or protected.
  - TS2385（L98, C5）：[syntax_check] Overload signatures must all be public, private or protected.
  - TS2304（L98, C30）：[syntax_check] Cannot find name 'Timable'.
  - TS2304（L98, C47）：[syntax_check] Cannot find name 'Memory'.
  - TS2385（L100, C5）：[syntax_check] Overload signatures must all be public, private or protected.
  - TS2385（L102, C5）：[syntax_check] Overload signatures must all be public, private or protected.
  - TS2304（L102, C30）：[syntax_check] Cannot find name 'Timable'.
  - TS2304（L102, C47）：[syntax_check] Cannot find name 'Memory'.
  - TS2304（L102, C62）：[syntax_check] Cannot find name 'Tense'.
  - TS2385（L109, C5）：[syntax_check] Overload signatures must all be public, private or protected.
  - TS2304（L109, C43）：[syntax_check] Cannot find name 'Tense'.
  - TS2385（L118, C5）：[syntax_check] Overload signatures must all be public, private or protected.
  - TS2314（L118, C80）：[syntax_check] Generic type 'Parameters' requires 1 type argument(s).
  - TS2349（L125, C17）：[syntax_check] This expression is not callable.
  - TS17009（L125, C17）：[syntax_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L132, C50）：[syntax_check] Cannot find name 'Tense'.
  - TS2322（L140, C17）：[syntax_check] Type 'number' is not assignable to type 'bigint'.
  - TS2349（L150, C17）：[syntax_check] This expression is not callable.
  - TS17009（L150, C17）：[syntax_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L157, C49）：[syntax_check] Cannot find name 'Timable'.
  - TS2304（L157, C58）：[syntax_check] Cannot find name 'Memory'.
  - TS2349（L160, C17）：[syntax_check] This expression is not callable.
  - TS17009（L160, C17）：[syntax_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L160, C36）：[syntax_check] Cannot find name 'Tense'.
  - TS2304（L182, C56）：[syntax_check] Cannot find name 'Timable'.
  - TS2304（L182, C65）：[syntax_check] Cannot find name 'Memory'.
  - TS2304（L182, C73）：[syntax_check] Cannot find name 'Tense'.
  - TS2349（L185, C17）：[syntax_check] This expression is not callable.
  - TS17009（L185, C17）：[syntax_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L192, C72）：[syntax_check] Cannot find name 'Tense'.
  - TS2349（L195, C17）：[syntax_check] This expression is not callable.
  - TS17009（L195, C17）：[syntax_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS17009（L196, C17）：[syntax_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2314（L203, C91）：[syntax_check] Generic type 'Parameters' requires 1 type argument(s).
  - TS2304（L280, C13）：[syntax_check] Cannot find name 'Debug'.
  - TS2304（L281, C53）：[syntax_check] Cannot find name 'Tense'.
  - TS2304（L299, C35）：[syntax_check] Cannot find name 'Past'.
  - TS2365（L300, C35）：[syntax_check] Operator '-' cannot be applied to types 'bigint' and 'number'.
  - TS2339（L301, C56）：[syntax_check] Property 'Future' does not exist on type 'typeof import("H:/A137442/Develop/AGI/NARS/_Project/OpenNARS-304-ts/node_modules/jree/lib/java/util/concurrent/index")'.
  - TS2365（L302, C35）：[syntax_check] Operator '+' cannot be applied to types 'bigint' and 'number'.
  - TS2304（L303, C35）：[syntax_check] Cannot find name 'Present'.
  - TS2339（L321, C40）：[syntax_check] Property 'clone' does not exist on type 'BaseEntry[]'.
  - TS2322（L332, C13）：[syntax_check] Type 'null' is not assignable to type 'BaseEntry'.
  - TS2322（L340, C9）：[syntax_check] Type 'null' is not assignable to type 'BaseEntry'.
  - TS2349（L402, C30）：[syntax_check] This expression is not callable.
  - TS2349（L402, C53）：[syntax_check] This expression is not callable.
  - TS2300（L425, C12）：[syntax_check] Duplicate identifier 'evidentialHash'.
  - TS2304（L434, C23）：[syntax_check] Cannot find name 'Tense'.
  - TS2322（L471, C13）：[syntax_check] Type 'string' is not assignable to type 'JavaString'.
  - TS2322（L480, C13）：[syntax_check] Type 'string' is not assignable to type 'JavaString'.
  - TS2304（L482, C17）：[syntax_check] Cannot find name 'TemporalRules'.
  - TS2304（L483, C18）：[syntax_check] Cannot find name 'ORDER_FORWARD'.
  - TS2304（L484, C24）：[syntax_check] Cannot find name 'Symbols'.
  - TS2304（L485, C18）：[syntax_check] Cannot find name 'ORDER_BACKWARD'.
  - TS2304（L486, C24）：[syntax_check] Cannot find name 'Symbols'.
  - TS2304（L488, C24）：[syntax_check] Cannot find name 'Symbols'.
  - TS2304（L497, C30）：[syntax_check] Cannot find name 'Tense'.
  - TS2322（L499, C13）：[syntax_check] Type 'null' is not assignable to type 'CharSequence'.
  - TS2300（L503, C12）：[syntax_check] Duplicate identifier 'name'.
  - TS2304（L509, C27）：[syntax_check] Cannot find name 'Symbols'.
  - TS2304（L513, C39）：[syntax_check] Cannot find name 'Symbols'.
  - TS2304（L517, C35）：[syntax_check] Cannot find name 'Symbols'.
  - TS2304（L520, C27）：[syntax_check] Cannot find name 'Symbols'.
  - TS2349（L531, C21）：[syntax_check] This expression is not callable.
  - TS2322（L570, C13）：[syntax_check] Type 'string' is not assignable to type 'JavaString'.
  - TS2339（L587, C54）：[syntax_check] Property 'hashCode' does not exist on type 'typeof Long'.
  - TS2339（L588, C54）：[syntax_check] Property 'hashCode' does not exist on type 'typeof Long'.
  - TS2339（L593, C41）：[syntax_check] Property 'comparing' does not exist on type 'typeof Comparator'.
  - TS2339（L593, C61）：[syntax_check] Property 'getNarId' does not exist on type 'typeof BaseEntry'.
  - TS2339（L594, C42）：[syntax_check] Property 'getInputId' does not exist on type 'typeof BaseEntry'.
- 总结：存在语法错误，需要比对 Java 语句结构。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

（无显式结构性依赖，主要依赖 `jree` 提供的运行时桩或尚未补齐的全局声明。）

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

- `[full_check] Cannot find name 'Tense'.` @ L39
- `[full_check] Cannot find name 'TemporalRules'.` @ L60
- `[full_check] Cannot find name 'TemporalRules'.` @ L66
- `[full_check] Cannot find name 'Tense'.` @ L84
- `[full_check] Cannot find name 'Timable'.` @ L98
- `[full_check] Cannot find name 'Memory'.` @ L98
- `[full_check] Cannot find name 'Timable'.` @ L102
- `[full_check] Cannot find name 'Memory'.` @ L102
- `[full_check] Cannot find name 'Tense'.` @ L102
- `[full_check] Cannot find name 'Tense'.` @ L109
- `[full_check] Cannot find name 'Tense'.` @ L132
- `[full_check] Cannot find name 'Timable'.` @ L157
- `[full_check] Cannot find name 'Memory'.` @ L157
- `[full_check] Cannot find name 'Tense'.` @ L160
- `[full_check] Cannot find name 'Timable'.` @ L182
- `[full_check] Cannot find name 'Memory'.` @ L182
- `[full_check] Cannot find name 'Tense'.` @ L182
- `[full_check] Cannot find name 'Tense'.` @ L192
- `[full_check] Cannot find name 'Debug'.` @ L280
- `[full_check] Cannot find name 'Tense'.` @ L281
- `[full_check] Cannot find name 'Past'.` @ L299
- `[full_check] Cannot find name 'Present'.` @ L303
- `[full_check] Cannot find name 'Tense'.` @ L434
- `[full_check] Cannot find name 'TemporalRules'.` @ L482
- `[full_check] Cannot find name 'ORDER_FORWARD'.` @ L483
- `[full_check] Cannot find name 'Symbols'.` @ L484
- `[full_check] Cannot find name 'ORDER_BACKWARD'.` @ L485
- `[full_check] Cannot find name 'Symbols'.` @ L486
- `[full_check] Cannot find name 'Symbols'.` @ L488
- `[full_check] Cannot find name 'Tense'.` @ L497
- `[full_check] Cannot find name 'Symbols'.` @ L509
- `[full_check] Cannot find name 'Symbols'.` @ L513
- `[full_check] Cannot find name 'Symbols'.` @ L517
- `[full_check] Cannot find name 'Symbols'.` @ L520
- `[syntax_check] Cannot find name 'Tense'.` @ L39
- `[syntax_check] Cannot find name 'TemporalRules'.` @ L60
- `[syntax_check] Cannot find name 'TemporalRules'.` @ L66
- `[syntax_check] Cannot find name 'Tense'.` @ L84
- `[syntax_check] Cannot find name 'Timable'.` @ L98
- `[syntax_check] Cannot find name 'Memory'.` @ L98
- `[syntax_check] Cannot find name 'Timable'.` @ L102
- `[syntax_check] Cannot find name 'Memory'.` @ L102
- `[syntax_check] Cannot find name 'Tense'.` @ L102
- `[syntax_check] Cannot find name 'Tense'.` @ L109
- `[syntax_check] Cannot find name 'Tense'.` @ L132
- `[syntax_check] Cannot find name 'Timable'.` @ L157
- `[syntax_check] Cannot find name 'Memory'.` @ L157
- `[syntax_check] Cannot find name 'Tense'.` @ L160
- `[syntax_check] Cannot find name 'Timable'.` @ L182
- `[syntax_check] Cannot find name 'Memory'.` @ L182
- `[syntax_check] Cannot find name 'Tense'.` @ L182
- `[syntax_check] Cannot find name 'Tense'.` @ L192
- `[syntax_check] Cannot find name 'Debug'.` @ L280
- `[syntax_check] Cannot find name 'Tense'.` @ L281
- `[syntax_check] Cannot find name 'Past'.` @ L299
- `[syntax_check] Cannot find name 'Present'.` @ L303
- `[syntax_check] Cannot find name 'Tense'.` @ L434
- `[syntax_check] Cannot find name 'TemporalRules'.` @ L482
- `[syntax_check] Cannot find name 'ORDER_FORWARD'.` @ L483
- `[syntax_check] Cannot find name 'Symbols'.` @ L484
- `[syntax_check] Cannot find name 'ORDER_BACKWARD'.` @ L485
- `[syntax_check] Cannot find name 'Symbols'.` @ L486
- `[syntax_check] Cannot find name 'Symbols'.` @ L488
- `[syntax_check] Cannot find name 'Tense'.` @ L497
- `[syntax_check] Cannot find name 'Symbols'.` @ L509
- `[syntax_check] Cannot find name 'Symbols'.` @ L513
- `[syntax_check] Cannot find name 'Symbols'.` @ L517
- `[syntax_check] Cannot find name 'Symbols'.` @ L520

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `entity/Stamp` -> `inference/TemporalRules`（deps.xml 第 247 行）
- `entity/Stamp` -> `interfaces/Timable`（deps.xml 第 248 行）
- `entity/Stamp` -> `storage/Memory`（deps.xml 第 249 行）
- `entity/Stamp` -> `language/Tense`（deps.xml 第 250 行）
- `entity/Stamp` -> `io/Symbols`（deps.xml 第 251 行）
- `entity/Stamp` -> `parameter/Debug`（deps.xml 第 252 行）
- `entity/Stamp` -> `parameter/Parameters`（deps.xml 第 253 行）
- 交叉校验：
- Java graph 额外依赖：inference/TemporalRules、interfaces/Timable、io/Symbols、language/Tense、parameter/Debug、parameter/Parameters、storage/Memory

## 5. Java 功能说明

- **职责概述**：文件工作：保持 Stamp/TruthValue 等值对象的不可变语义，补齐 clone/equals/hash 与序列化。；TODO 2 处
- **关键数据结构**：
- `Stamp` · 继承：JavaObject · 实现：java.lang.Cloneable, java.io.Serializable
- **核心流程 / 算法**：
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：保持 Stamp/TruthValue 等值对象的不可变语义，补齐 clone/equals/hash 与序列化。；TODO 2 处
  3. Java-TS 差异：参见《通用转译法.md》 - 实体与序列化
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `Java Memory/Task 接口` 衔接上下游。

## 6. 一致性风险

- 文件内仍保留 2 处 TODO，需对照 Java 填补。
- `tsc` 报错阻塞进一步分析，需要回填语句结构。
- 缺少显式 import，需依赖 Java/ts-analysis 交叉校验。

## 7. 路线图定位

- 1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
- 2. 文件工作：保持 Stamp/TruthValue 等值对象的不可变语义，补齐 clone/equals/hash 与序列化。；TODO 2 处
- 3. Java-TS 差异：参见《通用转译法.md》 - 实体与序列化

## 8. 附加记录

- ts-analysis: LOC=606 · TODO=2
- 参考文件：`java-master/src/main/java/org/opennars/entity/Stamp.java`
