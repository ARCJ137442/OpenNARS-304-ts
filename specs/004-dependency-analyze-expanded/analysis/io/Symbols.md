# src/io/Symbols.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/io/Symbols.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/io/Symbols.java` |
| 模块链路 | `language 基座 -> entity -> io I/O 层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/io/Symbols.ts --noEmit`）

- 执行的命令：`npx tsc src/io/Symbols.ts --noEmit`
- 关键输出：
  - TS2304（L44, C56）：[full_check] Cannot find name 'IN'.
  - TS2304（L45, C57）：[full_check] Cannot find name 'OUT'.
  - TS2304（L46, C56）：[full_check] Cannot find name 'ERR'.
  - TS2345（L80, C29）：[full_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L82, C29）：[full_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L84, C29）：[full_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L86, C29）：[full_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L88, C29）：[full_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L90, C29）：[full_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L92, C30）：[full_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L96, C30）：[full_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L98, C30）：[full_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L100, C30）：[full_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L102, C30）：[full_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L104, C30）：[full_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L106, C29）：[full_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L110, C29）：[full_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L112, C30）：[full_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L114, C29）：[full_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L116, C30）：[full_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L120, C30）：[full_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L122, C30）：[full_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L124, C30）：[full_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L126, C30）：[full_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L130, C24）：[full_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L132, C24）：[full_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L134, C24）：[full_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L136, C24）：[full_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L138, C24）：[full_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L140, C24）：[full_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L144, C24）：[full_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L146, C24）：[full_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L148, C25）：[full_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L150, C24）：[full_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L152, C24）：[full_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L154, C24）：[full_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L158, C23）：[full_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2564（L163, C25）：[full_check] Property 'symbol' has no initializer and is not definitely assigned in the constructor.
  - TS2564（L169, C25）：[full_check] Property 'ch' has no initializer and is not definitely assigned in the constructor.
  - TS2564（L172, C25）：[full_check] Property 'relation' has no initializer and is not definitely assigned in the constructor.
  - TS2564（L175, C25）：[full_check] Property 'isNative' has no initializer and is not definitely assigned in the constructor.
  - TS2564（L178, C25）：[full_check] Property 'opener' has no initializer and is not definitely assigned in the constructor.
  - TS2564（L181, C25）：[full_check] Property 'closer' has no initializer and is not definitely assigned in the constructor.
  - TS2349（L194, C21）：[full_check] This expression is not callable.
  - TS17009（L194, C21）：[full_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2349（L204, C21）：[full_check] This expression is not callable.
  - TS17009（L204, C21）：[full_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L214, C27）：[full_check] Cannot find name '$name$'.
  - TS2304（L214, C35）：[full_check] Cannot find name '$index$'.
  - TS2322（L218, C21）：[full_check] Type 'string | 0' is not assignable to type 'string'.
  - TS2349（L218, C38）：[full_check] This expression is not callable.
  - TS2339（L220, C47）：[full_check] Property 'endsWith' does not exist on type 'JavaString'.
  - TS2339（L221, C47）：[full_check] Property 'endsWith' does not exist on type 'JavaString'.
  - TS2339（L252, C31）：[full_check] Property 'ch' does not exist on type 'Enum<unknown>'.
  - TS2367（L253, C17）：[full_check] This comparison appears to be unintentional because the types 'string' and 'number' have no overlap.
  - TS2345（L254, C44）：[full_check] Argument of type 'string' is not assignable to parameter of type 'Character'.
  - TS2345（L267, C51）：[full_check] Argument of type 'number' is not assignable to parameter of type 'Character'.
  - TS2344（L330, C47）：[full_check] Type 'typeof NativeOperator' does not satisfy the constraint 'abstract new (...args: any) => any'.
  - TS2304（L44, C56）：[syntax_check] Cannot find name 'IN'.
  - TS2304（L45, C57）：[syntax_check] Cannot find name 'OUT'.
  - TS2304（L46, C56）：[syntax_check] Cannot find name 'ERR'.
  - TS2345（L80, C29）：[syntax_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L82, C29）：[syntax_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L84, C29）：[syntax_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L86, C29）：[syntax_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L88, C29）：[syntax_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L90, C29）：[syntax_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L92, C30）：[syntax_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L96, C30）：[syntax_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L98, C30）：[syntax_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L100, C30）：[syntax_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L102, C30）：[syntax_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L104, C30）：[syntax_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L106, C29）：[syntax_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L110, C29）：[syntax_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L112, C30）：[syntax_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L114, C29）：[syntax_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L116, C30）：[syntax_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L120, C30）：[syntax_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L122, C30）：[syntax_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L124, C30）：[syntax_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L126, C30）：[syntax_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L130, C24）：[syntax_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L132, C24）：[syntax_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L134, C24）：[syntax_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L136, C24）：[syntax_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L138, C24）：[syntax_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L140, C24）：[syntax_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L144, C24）：[syntax_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L146, C24）：[syntax_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L148, C25）：[syntax_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L150, C24）：[syntax_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L152, C24）：[syntax_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L154, C24）：[syntax_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2345（L158, C23）：[syntax_check] Argument of type 'JavaString' is not assignable to parameter of type 'string'.
  - TS2564（L163, C25）：[syntax_check] Property 'symbol' has no initializer and is not definitely assigned in the constructor.
  - TS2564（L169, C25）：[syntax_check] Property 'ch' has no initializer and is not definitely assigned in the constructor.
  - TS2564（L172, C25）：[syntax_check] Property 'relation' has no initializer and is not definitely assigned in the constructor.
  - TS2564（L175, C25）：[syntax_check] Property 'isNative' has no initializer and is not definitely assigned in the constructor.
  - TS2564（L178, C25）：[syntax_check] Property 'opener' has no initializer and is not definitely assigned in the constructor.
  - TS2564（L181, C25）：[syntax_check] Property 'closer' has no initializer and is not definitely assigned in the constructor.
  - TS2349（L194, C21）：[syntax_check] This expression is not callable.
  - TS17009（L194, C21）：[syntax_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2349（L204, C21）：[syntax_check] This expression is not callable.
  - TS17009（L204, C21）：[syntax_check] 'super' must be called before accessing 'this' in the constructor of a derived class.
  - TS2304（L214, C27）：[syntax_check] Cannot find name '$name$'.
  - TS2304（L214, C35）：[syntax_check] Cannot find name '$index$'.
  - TS2322（L218, C21）：[syntax_check] Type 'string | 0' is not assignable to type 'string'.
  - TS2349（L218, C38）：[syntax_check] This expression is not callable.
  - TS2339（L220, C47）：[syntax_check] Property 'endsWith' does not exist on type 'JavaString'.
  - TS2339（L221, C47）：[syntax_check] Property 'endsWith' does not exist on type 'JavaString'.
  - TS2339（L252, C31）：[syntax_check] Property 'ch' does not exist on type 'Enum<unknown>'.
  - TS2367（L253, C17）：[syntax_check] This comparison appears to be unintentional because the types 'string' and 'number' have no overlap.
  - TS2345（L254, C44）：[syntax_check] Argument of type 'string' is not assignable to parameter of type 'Character'.
  - TS2345（L267, C51）：[syntax_check] Argument of type 'number' is not assignable to parameter of type 'Character'.
  - TS2344（L330, C47）：[syntax_check] Type 'typeof NativeOperator' does not satisfy the constraint 'abstract new (...args: any) => any'.
- 总结：存在语法错误，需要比对 Java 语句结构。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

（无显式结构性依赖，主要依赖 `jree` 提供的运行时桩或尚未补齐的全局声明。）

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

- `[full_check] Cannot find name 'IN'.` @ L44
- `[full_check] Cannot find name 'OUT'.` @ L45
- `[full_check] Cannot find name 'ERR'.` @ L46
- `[full_check] Cannot find name '$name$'.` @ L214
- `[full_check] Cannot find name '$index$'.` @ L214
- `[syntax_check] Cannot find name 'IN'.` @ L44
- `[syntax_check] Cannot find name 'OUT'.` @ L45
- `[syntax_check] Cannot find name 'ERR'.` @ L46
- `[syntax_check] Cannot find name '$name$'.` @ L214
- `[syntax_check] Cannot find name '$index$'.` @ L214

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `io/Symbols` -> `io/events/OutputHandler`（deps.xml 第 617 行）
- 交叉校验：
- Java graph 额外依赖：io/events/OutputHandler

## 5. Java 功能说明

- **职责概述**：文件工作：将 java.io 流与事件转接到 Node 流 + EventEmitter，补宏 Parser/Narsese/Events 链路。
- **关键数据结构**：
- `Symbols` · 继承：JavaObject · 实现：（无接口）
- **核心流程 / 算法**：
  1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
  2. 文件工作：将 java.io 流与事件转接到 Node 流 + EventEmitter，补宏 Parser/Narsese/Events 链路。
  3. Java-TS 差异：参见《通用转译法.md》 - I/O 与事件
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `Java Memory/Task 接口` 衔接上下游。

## 6. 一致性风险

- `tsc` 报错阻塞进一步分析，需要回填语句结构。
- 缺少显式 import，需依赖 Java/ts-analysis 交叉校验。

## 7. 路线图定位

- 1. 依赖准备：仅依赖 jree 或 TS 自身静态成员
- 2. 文件工作：将 java.io 流与事件转接到 Node 流 + EventEmitter，补宏 Parser/Narsese/Events 链路。
- 3. Java-TS 差异：参见《通用转译法.md》 - I/O 与事件

## 8. 附加记录

- ts-analysis: LOC=333 · TODO=0
- 参考文件：`java-master/src/main/java/org/opennars/io/Symbols.java`
