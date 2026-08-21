# Java → TypeScript 迁移纠正模式库

版本：0.3（2026-08-22）

本文件把当前 OpenNARS 转写中反复出现的纠正归纳为可检索、可验证、可批量处理的模式。它不是“看到字符串就替换”的规则表：每条模式都必须同时说明识别条件、正确的 TypeScript 语义、验证门禁和自动化边界。

## 1. 当前证据

使用本仓库的 TypeScript 5.4.5 编译器检查当前 `src` 与 `test`，并用迁移扫描器屏蔽注释和字符串后统计源码，得到：

- 7,077 行 `tsc` 输出，其中 6,667 条错误；
- 5,128 条 TS2304，主要是 Java 包级隐式依赖没有变成 TypeScript `import`；
- 34 条 TS17009，主要是 Java 构造器委托 `this(...)`；
- 27 处迁移扫描器识别出的构造器委托，分布在 17 个文件；
- 181 处 `.class`；
- 259 处 Java 字符串方法、420 处 Java 集合方法调用习惯。

这说明迁移的首要问题是“重复的语义转换模式没有固化”，不是单个文件的偶然手工错误。

## 2. 模式分级

### A 级：可以自动修复，但必须编译验证

这些模式有明确的语法等价物，适合由扫描器或 codemod 批量处理。

| 模式 | Java → TS 痕迹 | 纠正方式 | 门禁 |
| --- | --- | --- | --- |
| 泛型尖括号重复 | `<<E>>` | 改为 `<E>`；只处理类型声明，不处理 Narsese 字符串 | `tsc` + 类型声明测试 |
| 类成员尾逗号 | `}(...) ,` 或类体中最后成员后的逗号 | 改为分号；不能改变对象字面量中的逗号 | `tsc` |
| Java 运算符残留 | `| ===`、`& ===` | 根据 Java 原表达式恢复为 `||`、`&&`；禁止猜测优先级 | `tsc` + 条件分支测试 |
| 缺少 ESM 扩展名 | `from "../../src/entity/TLink"` | 用 `esm-relative-extension` 补 `.ts`；库内统一由构建配置决定 | Node import smoke |

### B 级：可以识别和生成候选补丁，必须人工确认

这些模式经常重复，但会影响循环依赖、初始化次序或 Java/TS 运行时差异，不能无条件全局替换。

#### B1. Java 构造器委托

Java：

    Foo() { this(defaultValue); }

生成的 TS 常见为：

    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 0: {
                this(defaultValue);
                break;
            }
        }
    }

TypeScript/JavaScript 不能用 `this(...)` 调用另一个构造器。正确做法是提取一个私有初始化函数、静态工厂，或在同一个构造器分支中显式完成初始化。不能简单替换为 `super(...)`，因为那会改变继承关系和字段初始化。

验证要求：

- 所有重载入口都能构造；
- `super()` 是派生类构造器的第一条有效语句；
- 字段、事件监听器和随机种子只初始化一次；
- 对应 Java 构造器测试和 Node import smoke 都通过。

涉及文件示例：`src/io/Narsese.ts`、`src/main/Nar.ts`、`src/entity/Task.ts`。

#### B2. Java 包级隐式依赖

Java 同包类可以直接使用：

    Task task;
    Term term;

TypeScript 必须显式导入：

    import { Task } from "../entity/Task.ts";
    import { Term } from "../language/Term.ts";

不能只根据首字母把所有同名符号批量导入。必须先建立 `定义符号 → 文件` 索引，再根据编译诊断、实际引用和循环依赖逐个确认。

验证要求：

- 目标模块可独立 import；
- 没有依赖全局变量的未定义符号；
- import 图没有把静态初始化提前到未完成状态；
- 对外入口使用真实导出，而不是 side-effect import。

当前最大的错误簇 TS2304 属于此模式。

#### B3. Java 匿名类与枚举

以下形式本身可以被 JavaScript 解析：

    new class extends EnumType { }("NAME", 0)

但 Java `enum` 的名称、序号、`values()`、比较和静态初始化语义不能仅凭语法保留。基础枚举优先改成不可变对象或显式值对象；只有确实需要 `instanceof` 和方法覆盖时才保留匿名子类。

验证要求：名称、序号、字符串化、相等性和 switch 分支与 Java 一致。

涉及文件示例：`src/io/Symbols.ts`、`src/inference/TruthFunctions.ts`、`src/language/Tense.ts`。

#### B4. Java 同参数数目的重载

Java 允许下面两个重载同时存在：

    pickOut(Key key)
    pickOut(Item item)

迁移器常把它们生成成按 `args.length` 分支的 TypeScript；由于两个入口都是一个参数，后一个分支永远不可达。`Bag.pickOut` 因此曾经无法按 Item 对象移除元素，导致概念 Bag 取出旧对象失败；`Negation.make(Term)` 与 `make(Term[])` 也曾把数组当成 Term。相同问题还出现在 `SetExt(Term[])`、`SetInt(Term[])` 与 varargs 构造器：`new SetExt(t1)` 如果不解包，会把 `Term[]` 当成集合内唯一元素。

纠正方式是先确认参数的运行时形态，再进入共享实现：

    if (Array.isArray(value)) {
        return make(value[0]);
    }
    if (typeof value === "object" && typeof value.name === "function") {
        key = value.name();
    }

不能按参数个数猜测类型，也不能为绕过类型错误而把两个入口合并成 `any`。必须为每一个同参数数目的重载增加对象形态、数组形态和边界 key 的回归测试。

验证要求：

- 每个重载都能被真实调用；
- 对象重载确实修改了容器状态，而不是只返回对象；
- 数组重载不会把数组包装成领域对象；
- 至少有一个运行到长期周期的 NAL 用例，确认容器不会异常增长。

涉及文件示例：`src/storage/Bag.ts`、`src/language/Negation.ts`、`src/language/SetExt.ts`、`src/language/SetInt.ts`。

#### B5. Java 的“直接变量”判断不能改成递归变量判断

Java 的 `Term.subjectOrPredicateIsIndependentVar()` 只判断 Statement 的直接 subject/predicate 是否为 `Variable`。迁移时若写成 `subject.hasVarIndep()`，就会把“包含变量的复合语句”误判成“主项本身是变量”，从而触发 `Sentence` 的置信度清零。典型后果是带变量的高阶规则输入成了 `%1.00;0.00%`，规则虽然能被解析、链接和合一，却因预算阈值无法继续推理。

纠正方式是保留“直接对象”的运行时判别，只对具有 `getType()` 的 Variable 调用 `hasVarIndep()`；不能用递归聚合属性代替 Java 的 `instanceof Variable`。

验证要求：

- 直接变量、包含变量的 Statement、无变量复合项分别测试；
- 规则输入的默认置信度保持 `DEFAULT_JUDGMENT_CONFIDENCE`；
- 至少用一条需要高阶条件推理的 NAL 语料验证后续任务没有被零置信度吞掉。

涉及文件示例：`src/language/Term.ts`、`src/entity/Sentence.ts`、`test/node/core-runtime.test.ts`。

#### B6. Java 数组与 jree 集合不能直接走 `System.arraycopy`

Java `System.arraycopy` 可以在数组类型间完成规范复制；jree 的实现只接受原生 JavaScript 数组，而迁移后的目标字段可能是 `Int16Array`。此时“保留 Java 调用形式”反而会在实际构造 TermLink 时抛出 `ArraysStoreException`。

纠正方式是在明确的 typed-array 边界使用 `.set(source, offset)`，或先转换为兼容的原生数组；不要把所有索引容器降级为 `any`。对应测试必须覆盖普通链接、`COMPOUND_CONDITION` 链接和多级索引。

涉及文件示例：`src/entity/TermLink.ts`。

#### B7. Java Enum/类的字符串化要固定在语义边界

部分 jree Enum 的 `String(value)` 暴露的是 ordinal，而 Java 代码中的 `toString()` 才是符号文本。对 Narsese 运算符、集合键和 Statement 名称，必须在边界选择 `op.toString()` 或明确的符号映射；不能以“都是对象”为由统一调用 `String()`。

这类错误通常不会立即报错，而会生成 `21`、`5` 一类看似合法但不可解析的项名。验证要求同时检查运算符文本、复合项名称和 Java/TypeScript 对照结果。

涉及文件示例：`src/language/Statement.ts`、`src/language/CompoundTerm.ts`、`src/language/Image.ts`。

#### B8. Java 静态 `.class` 与 JavaScript 类属性不是同一契约

jree 当前版本的 `JavaObject.class` 静态 getter 可能按 `this.constructor` 返回同一个类标记，导致 `Events.CycleStart.class` 与 `Events.CycleEnd.class` 相等。事件总线因此会把一个事件的观察者误触发到所有事件上，表现为输出重复、生命周期顺序异常或插件收到错误事件。

纠正方式是在应用运行时适配层把静态 `.class` getter 改为按实际静态类构造器返回 `Class.fromConstructor(this)`，并在事件总线上测试不同事件的隔离、批量 `set` 和 `off`。该修复应集中在兼容层，避免散落在业务事件类中。

涉及文件示例：`src/runtime/jree-compat.ts`、`src/io/events/Events.ts`、`src/io/events/EventEmitter.ts`。

#### B9. Java 变长参数调用在事件和数组边界必须显式展开

Java 的 `emit(c, o)`、事件处理器和构造器数组参数在 TypeScript 中常见的错误是把数组作为一个参数继续传递。调用方若拿到 `Object[]`，应在进入 `...params` 的边界使用 `...array`；构造器若对应 `Term[]`，则按 B4 的数组形态解包。

验证要求：事件观察者看到的参数个数和 Java 一致；多参数、空参数以及嵌套数组分别覆盖。涉及文件示例：`src/main/Nar.ts`、`src/io/events/EventEmitter.ts`、`src/io/events/EventHandler.ts`。

#### B10. 继承方法被同名业务重载遮蔽

Java 子类可以继承 `equals(Object)`，同时声明 `equals(Term, Term)`；TypeScript/JavaScript 没有按签名自动重载，后声明的方法会覆盖前者。`FunctionOperator.equals` 因此曾在 TermLink 的单参数比较中把第二个参数读成 `undefined`，使普通链接构造直接崩溃。

纠正方式是保留所有公开入口，在一个实现中按 `args.length` 分派：单参数转发到 `super.equals`，双参数执行领域相似度计算；不要只改调用方，也不要把领域相似度改名后遗漏 Java API 兼容层。

验证要求：

- 子类实例可以进行单参数对象相等比较；
- 双参数领域比较仍返回 Java 约定的数值结果；
- 触发该方法的集合/TermLink 路径至少有一个 NAL 回归样本；
- 单元测试同时覆盖单参数和双参数入口。

涉及文件示例：`src/operator/FunctionOperator.ts`、`test/node/core-runtime.test.ts`。

### C 级：必须做语义重写，禁止自动替换

#### C1. Java 包装类型与原生类型

`java.lang.String`、`Integer`、`Float`、`Double`、`Long` 不能机械映射为 TypeScript `string`、`number` 或 `bigint`。需要按边界决定：

- Narsese 文本与 Node I/O：原生 `string`；
- Java 集合适配层：保留 `jree` 类型或定义最小接口；
- 周期、时间戳和序列号：统一数值表示，明确是否需要 `bigint`；
- 算法中的浮点值：统一 `number`，禁止混用 `bigint`。

#### C2. Java 字符串/集合方法

`.equals()`、`.contains()`、`.isEmpty()`、`.length()`、`.add()`、`.put()`、`.get()` 等调用必须根据接收对象决定替代方式。字符串、数组、原生 `Map`、`jree` 集合和领域对象的同名方法不是同一语义。

建议顺序：先明确边界类型，再改调用点；不要为消灭编译错误而给所有对象添加宽泛的 `any` 或兼容方法。

#### C2.1 Java 字符串比较与运行时适配层

迁移代码不能假定 Java 运行时适配层的 `java.lang.String.equals/hashCode/compareTo` 已经完全等价于 Java。当前 jree 版本的 JavaString 使用 UTF-16 typed array 和 locale 比较路径，可能把大小写不同的字符串当成相等值，并产生相同 hash；这会直接破坏 Narsese 中 `a` 与 `A` 的项区分、Statement 合法性和 Java 集合 key。

纠正方式是在领域对象的语义边界使用明确的原生文本比较，并实现与 Java 一致的 hash；不要全局修改第三方包，也不要把所有字符串都降级为 `any`。例如 `Term.equals` 应比较 `String(name)` 的精确值，`Term.hashCode` 应按 Java String 的 31 进制规则计算。

验证要求：

- `a` 与 `A` 不相等且 hash 不相同；
- 相同文本的不同 Term 实例仍相等；
- 用不同大小写项构造的继承关系不被错误判为自反关系；
- Java/TypeScript 局部算法对照和 NAL 语料继续通过。

### C2.2 配置插件的迁移状态必须显式表达

Java XML 配置会加载比当前 TypeScript 闭包更大的插件集合。Node 侧不能因为类文件能被 import 就假装插件语义已经完成，也不能静默丢掉一个会出现在 Narsese 输入中的操作符。当前 `^anticipate` 已接入实际 `Anticipate` 运算符和 CycleEnd/InduceSucceedingEvent 生命周期；Node 配置路径通过 `new Anticipate(0.1, 0.1)` 注册它。仍未迁移的插件继续记录在 `ConfigReader.lastUnsupportedPluginClasspaths` 中；不能因为配置加载成功就把未支持插件标为已完成。

验证要求：

- 配置加载不会因未迁移插件导致整机启动失败；
- Narsese 中出现该操作符时可以明确解析；
- `^anticipate` 的注册、事件开关、预测更新和过期分支有独立单测；
- 其他未迁移插件的 NAL 结果不能被标记为完整语义等价，直到真实插件实现与 Java 对照通过。

#### C3. 资源、线程与进程控制

Java 的 try-with-resources、`Thread`、`System.exit` 和阻塞 I/O 需要改写为 Node 资源释放、事件循环/Worker 和进程退出策略。对应的代码必须有生命周期测试，不能只修语法。

涉及文件示例：`src/main/Shell.ts`、`src/main/NarNode.ts`、`src/main/Nar.ts`。

## 3. 推荐的批量迁移流水线

```text
扫描模式
  ↓
按 A/B/C 分级
  ↓
A 级生成候选补丁并应用
  ↓
tsc 语法门禁
  ↓
B 级逐模块确认 import/初始化/枚举
  ↓
Node import smoke
  ↓
单元测试 + Java/TS NAL 差分测试
  ↓
记录未解决的 C 级语义差异
```

每一批迁移必须保留：

1. 原 Java 文件路径和对应 TS 文件；
2. 使用的模式编号；
3. 自动修复与人工决策的边界；
4. 编译、模块加载、单元和端到端测试结果；
5. 尚未解决的 Java/TS 行为差异。

### 3.1 局部算法对照联测

局部算法先于整机推理链建立对照契约。`scripts/parity/LocalAlgorithmParityRunner.java` 直接调用 Java 版本的 `TruthFunctions`、`BudgetValue` 与工具函数，输出固定输入向量的 JSON；`scripts/parity/run-local-algorithm-parity.mjs` 使用同一组向量调用 TypeScript 实现，并逐项比较数值、字符串和布尔值。

当前联测覆盖：

- 真值函数：否定、转换、逆否、修订、演绎、归纳、溯因、类比、相似、析取/合取归约，以及欲望相关函数；
- 预算值：普通构造、由真值构造、有界值、原地修改和合并；
- 工具函数：`and`、`or`、几何平均和真值到质量的转换。

运行方式：

    node --experimental-strip-types scripts/parity/run-local-algorithm-parity.mjs

该命令需要先生成 `java-master/target/classes`、`java-master/target/test-classes` 和 Java 快照 jar。它只锁定局部数值语义，不代表 TypeScript 的 NAL/CLI 端到端链路已经完成；整机差分仍由独立的 NAL fixture 负责。Java 代码在这里是行为基线，TypeScript 侧新增测试和修补应优先围绕已有实现加固，不以重写既有算法为目标。

## 4. 自动化边界

`scripts/converting/scan-migration-patterns.mjs` 只负责扫描和计数，不默认改写源码。`scripts/converting/apply-migration-patterns.mjs` 目前只实现三个 A 级窄规则：导出类型别名中的重复泛型尖括号、明确的 `| ===`/`& ===` 运算符残留，以及相对 ESM 导入补 `.ts`；默认仍然是预览，只有显式 `--write` 才写回。原因是构造器委托、隐式 import、包装类型和集合调用都可能引入循环依赖或改变初始化顺序。

后续 codemod 应采用显式模式开关，例如：

    node scripts/converting/apply-migration-patterns.mjs --pattern malformed-generic --check

默认只生成 diff 预览；只有在 `tsc`、Node import smoke 和对应测试都通过后，才允许纳入提交。

## 5. 当前优先级

1. 固化同参数数目重载、继承方法重载遮蔽、构造器委托和静态成员引用的人工重写模板；
2. 为最小语言实体闭包建立显式 import 图，并继续修复 JavaString/集合边界；
3. 把 Java 包装类型收敛到 TS 边界接口；
4. 再批量处理 A 级语法模式；
5. 每完成一个闭包，就接入 NAL 差分测试，而不是等待全部文件迁移结束。
