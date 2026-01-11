# src/entity/Item.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/entity/Item.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/entity/Item.java` |
| 模块链路 | `language 基座 -> entity 实体层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/entity/Item.ts --noEmit`）

- 执行的命令：`npx tsc src/entity/Item.ts --noEmit`
- 关键输出：
  - TS2434（L4, C18）：[full_check] A namespace declaration cannot be located prior to a class or function with which it is merged.
  - TS2564（L9, C25）：[full_check] Property 'budget' has no initializer and is not definitely assigned in the constructor.
  - TS2385（L12, C9）：[full_check] Overload signatures must all be public, private or protected.
  - TS2575（L15, C31）：[full_check] No overload expects 3 arguments, but overloads do exist that expect either 1 or 4 arguments.
  - TS2540（L26, C18）：[full_check] Cannot assign to 'priority' because it is a read-only property.
  - TS2339（L32, C57）：[full_check] Property 'equals' does not exist on type 'T'.
  - TS1243（L35, C25）：[full_check] 'static' modifier cannot be used with 'abstract' modifier.
  - TS1267（L35, C32）：[full_check] Property 'StringKeyItem' cannot have an initializer because it is marked abstract.
  - TS2300（L61, C18）：[full_check] Duplicate identifier 'ItemPriorityComparator'.
  - TS2344（L79, C111）：[full_check] Type 'E' does not satisfy the constraint 'Item<unknown>'.
  - TS2300（L93, C19）：[full_check] Duplicate identifier 'ItemPriorityComparator'.
  - TS2687（L93, C19）：[full_check] All declarations of 'ItemPriorityComparator' must have identical modifiers.
  - TS2717（L93, C19）：[full_check] Subsequent property declarations must have the same type.  Property 'ItemPriorityComparator' must be of type 'typeof ItemPriorityComparator', but here has type 'typeof ItemPriorityComparator'.
  - TS2385（L120, C5）：[full_check] Overload signatures must all be public, private or protected.
  - TS2335（L125, C17）：[full_check] 'super' can only be referenced in a derived class.
  - TS2322（L126, C17）：[full_check] Type 'null' is not assignable to type 'BudgetValue'.
  - TS2335（L133, C17）：[full_check] 'super' can only be referenced in a derived class.
  - TS2322（L137, C21）：[full_check] Type 'null' is not assignable to type 'BudgetValue'.
  - TS2416（L261, C21）：[full_check] Property 'toString' in type 'Item<K>' is not assignable to the same property in base type 'JavaObject'.
  - TS2416（L261, C21）：[full_check] Property 'toString' in type 'Item<K>' is not assignable to the same property in base type 'Serializable'.
  - TS4112（L261, C21）：[full_check] This member cannot have an 'override' modifier because its containing class 'Item<K>' does not extend another class.
  - TS2322（L264, C13）：[full_check] Type 'JavaString | ""' is not assignable to type 'JavaString'.
  - TS2339（L265, C47）：[full_check] Property 'toString' does not exist on type 'K'.
  - TS2339（L277, C47）：[full_check] Property 'toString' does not exist on type 'K'.
  - TS2339（L285, C47）：[full_check] Property 'toString' does not exist on type 'K'.
  - TS2339（L305, C28）：[full_check] Property 'hashCode' does not exist on type 'K'.
  - TS2367（L309, C13）：[full_check] This comparison appears to be unintentional because the types 'JavaObject' and 'this' have no overlap.
  - TS2571（L312, C20）：[full_check] Object is of type 'unknown'.
  - TS1243（L317, C21）：[full_check] 'static' modifier cannot be used with 'abstract' modifier.
  - TS1267（L317, C28）：[full_check] Property 'StringKeyItem' cannot have an initializer because it is marked abstract.
  - TS18052（L317, C50）：[full_check] Non-abstract class 'StringKeyItem' does not implement all abstract members of 'Item<CharSequence>'
  - TS2304（L324, C20）：[full_check] Cannot find name '$outer'.
  - TS2367（L328, C17）：[full_check] This comparison appears to be unintentional because the types 'JavaObject' and 'this' have no overlap.
  - TS2571（L331, C24）：[full_check] Object is of type 'unknown'.
  - TS2304（L331, C61）：[full_check] Cannot find name '$outer'.
  - TS2300（L353, C17）：[full_check] Duplicate identifier 'ItemPriorityComparator'.
  - TS2339（L353, C92）：[full_check] Property 'ItemPriorityComparator' does not exist on type 'typeof Item'.
  - TS2434（L4, C18）：[syntax_check] A namespace declaration cannot be located prior to a class or function with which it is merged.
  - TS2564（L9, C25）：[syntax_check] Property 'budget' has no initializer and is not definitely assigned in the constructor.
  - TS2385（L12, C9）：[syntax_check] Overload signatures must all be public, private or protected.
  - TS2575（L15, C31）：[syntax_check] No overload expects 3 arguments, but overloads do exist that expect either 1 or 4 arguments.
  - TS2540（L26, C18）：[syntax_check] Cannot assign to 'priority' because it is a read-only property.
  - TS2339（L32, C57）：[syntax_check] Property 'equals' does not exist on type 'T'.
  - TS1243（L35, C25）：[syntax_check] 'static' modifier cannot be used with 'abstract' modifier.
  - TS1267（L35, C32）：[syntax_check] Property 'StringKeyItem' cannot have an initializer because it is marked abstract.
  - TS2300（L61, C18）：[syntax_check] Duplicate identifier 'ItemPriorityComparator'.
  - TS2344（L79, C111）：[syntax_check] Type 'E' does not satisfy the constraint 'Item<unknown>'.
  - TS2300（L93, C19）：[syntax_check] Duplicate identifier 'ItemPriorityComparator'.
  - TS2687（L93, C19）：[syntax_check] All declarations of 'ItemPriorityComparator' must have identical modifiers.
  - TS2717（L93, C19）：[syntax_check] Subsequent property declarations must have the same type.  Property 'ItemPriorityComparator' must be of type 'typeof ItemPriorityComparator', but here has type 'typeof ItemPriorityComparator'.
  - TS2385（L120, C5）：[syntax_check] Overload signatures must all be public, private or protected.
  - TS2335（L125, C17）：[syntax_check] 'super' can only be referenced in a derived class.
  - TS2322（L126, C17）：[syntax_check] Type 'null' is not assignable to type 'BudgetValue'.
  - TS2335（L133, C17）：[syntax_check] 'super' can only be referenced in a derived class.
  - TS2322（L137, C21）：[syntax_check] Type 'null' is not assignable to type 'BudgetValue'.
  - TS2416（L261, C21）：[syntax_check] Property 'toString' in type 'Item<K>' is not assignable to the same property in base type 'JavaObject'.
  - TS2416（L261, C21）：[syntax_check] Property 'toString' in type 'Item<K>' is not assignable to the same property in base type 'Serializable'.
  - TS4112（L261, C21）：[syntax_check] This member cannot have an 'override' modifier because its containing class 'Item<K>' does not extend another class.
  - TS2322（L264, C13）：[syntax_check] Type 'JavaString | ""' is not assignable to type 'JavaString'.
  - TS2339（L265, C47）：[syntax_check] Property 'toString' does not exist on type 'K'.
  - TS2339（L277, C47）：[syntax_check] Property 'toString' does not exist on type 'K'.
  - TS2339（L285, C47）：[syntax_check] Property 'toString' does not exist on type 'K'.
  - TS2339（L305, C28）：[syntax_check] Property 'hashCode' does not exist on type 'K'.
  - TS2367（L309, C13）：[syntax_check] This comparison appears to be unintentional because the types 'JavaObject' and 'this' have no overlap.
  - TS2571（L312, C20）：[syntax_check] Object is of type 'unknown'.
  - TS1243（L317, C21）：[syntax_check] 'static' modifier cannot be used with 'abstract' modifier.
  - TS1267（L317, C28）：[syntax_check] Property 'StringKeyItem' cannot have an initializer because it is marked abstract.
  - TS18052（L317, C50）：[syntax_check] Non-abstract class 'StringKeyItem' does not implement all abstract members of 'Item<CharSequence>'
  - TS2304（L324, C20）：[syntax_check] Cannot find name '$outer'.
  - TS2367（L328, C17）：[syntax_check] This comparison appears to be unintentional because the types 'JavaObject' and 'this' have no overlap.
  - TS2571（L331, C24）：[syntax_check] Object is of type 'unknown'.
  - TS2304（L331, C61）：[syntax_check] Cannot find name '$outer'.
  - TS2300（L353, C17）：[syntax_check] Duplicate identifier 'ItemPriorityComparator'.
  - TS2339（L353, C92）：[syntax_check] Property 'ItemPriorityComparator' does not exist on type 'typeof Item'.
- 总结：存在语法错误，需要比对 Java 语句结构。；编译失败：TS1005 @ 281:36 '=' expected.，另有 2 条 ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

| 符号 | 来源文件 | 触发位置 | 依赖原因 |
| --- | --- | --- | --- |
| `BudgetValue` | `src/entity/BudgetValue.ts` | import | 结构性：Item 直接使用 BudgetValue 的主流程 |

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

- `[full_check] Cannot find name '$outer'.` @ L324
- `[full_check] Cannot find name '$outer'.` @ L331
- `[syntax_check] Cannot find name '$outer'.` @ L324
- `[syntax_check] Cannot find name '$outer'.` @ L331

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `entity/Item` -> `entity/BudgetValue`（deps.xml 第 224 行）
- 交叉校验：
- TS 与 Java 依赖集合一致。

## 5. Java 功能说明

- **职责概述**：文件工作：保持 Stamp/TruthValue 等值对象的不可变语义，补齐 clone/equals/hash 与序列化。；tsc TS1005 @ 281:36 错误
- **关键数据结构**：
- 以函数或常量导出为主，未声明 class。
- **核心流程 / 算法**：
  1. 依赖准备：依赖：entity/BudgetValue.ts
  2. 文件工作：保持 Stamp/TruthValue 等值对象的不可变语义，补齐 clone/equals/hash 与序列化。；tsc TS1005 @ 281:36 错误
  3. Java-TS 差异：参见《通用转译法.md》 - 实体与序列化
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `entity/BudgetValue` 衔接上下游。

## 6. 一致性风险

- `tsc` 报错阻塞进一步分析，需要回填语句结构。

## 7. 路线图定位

- 1. 依赖准备：依赖：entity/BudgetValue.ts
- 2. 文件工作：保持 Stamp/TruthValue 等值对象的不可变语义，补齐 clone/equals/hash 与序列化。；tsc TS1005 @ 281:36 错误
- 3. Java-TS 差异：参见《通用转译法.md》 - 实体与序列化

## 8. 附加记录

- ts-analysis: LOC=285 · TODO=0
- 参考文件：`java-master/src/main/java/org/opennars/entity/Item.java`
