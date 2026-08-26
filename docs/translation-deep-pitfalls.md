# Java → TypeScript 翻译：深层踩坑点历史假设清单

> **封存的假设库，不是缺陷事实或修复指令。** 本文由早期结构审计整理，部分判断已经被后续 M1/M2 验证收窄或证伪。使用任何线索前必须重新复现，并以[当前状态](current-status.md)、canonical Java 和局部合同为准。

**版本**：0.1（2026-08-23）
**范围**：本文件是 [`docs/java-to-typescript-migration-patterns.md`](./java-to-typescript-migration-patterns.md) v0.8 的**补充**，不替代、也不修订模式库。
**历史目的**：供开工 Agent 按“难解决性 + 长期代价”反查潜在线索；不是经过确认的缺陷清单。

**封存校准（2026-08-27）**：本文的计数和示例主要是结构审计快照，不是通过率。M1/M2 保护回归记录为：非增量 tsc 0 诊断、串行单测 202/202、245 主资源 raw 与稳定基线逐字段一致；raw stability 的 process-limit 与功能结论分开记录。jree 单任务反馈已在 `FunctionOperator`、`Want`、`Evaluate` 中局部原生化，但整体 jree 退场仍未完成。

## 0. 与 v0.7 的关系

| 维度 | v0.7 模式库 | 本文件 |
|---|---|---|
| 组织方式 | 识别条件 → 纠正方式 → 验证门禁 | 难易度 + 长期代价 + 反查信号 |
| 视角 | 翻译工程师视角 | 开工 Agent 视角 |
| 颗粒度 | 16 个具体模式点（A/B/C 级） | 14 个结构性根因（Tier 1/2/3 级） |
| 重叠度 | —— | **70% 内容已在 v0.6**——本文件作为"补充与延伸" |
| 何时优先读 | 写迁移代码时 | 开工 + 复盘时 |

阅读建议：先读本文件 §2（Tier 1），开工前过 §6 checklist；处理具体 bug 时回 v0.6 查具体模式点。

---

## 1. 顶层摘要：4 个根因

| 根因 | 描述 | 命中痛点 |
|---|---|---|
| **A · 模块生命周期** | Java 类加载是确定性事件；JS/Node 模块求值顺序未定 | Tier 1.2, Tier 3.2, Tier 3.3 |
| **B · 运行时精确类型** | Java 有 `Class<T>` 一等公民；TS 仅原型链 + `Symbol.hasInstance` | Tier 1.3, Tier 1.4, Tier 2.2 |
| **C · 值对象语义** | Java `int`/`float`/`double` 精确；TS 全部为 IEEE-754 `number` | Tier 2.1, Tier 2.5（按真理值 B16 模式另存） |
| **D · 多线程 + 监视器** | Java 一等公民；Node 单线程但有 async / Worker race | Tier 1.1（最关键） |

——**所有痛点的根都在"试图在没找到对应物的领域里造对应物"**：模板翻译只能掩盖 95%，剩 5% 必须靠重新设计。

---

## 2. Tier 1：架构级坑，必须靠重新设计解决

### 2.1 Java 的 `synchronized` 块被沉默去除 [v0.6 未覆盖]

**证据**（11+ 处全部被注释保留）：

```
src/control/concept/ProcessAnticipation.ts:178    /* synchronized (targetConcept) { */
src/control/concept/ProcessGoal.ts:286           /* synchronized (get_concept) { */
src/control/concept/ProcessGoal.ts:319           /* synchronized (op) { */
src/control/concept/ProcessGoal.ts:374           /* synchronized (concept.memory.seq_current) { */
src/control/concept/ProcessJudgment.ts:168       /* synchronized (origin_concept) { */
src/control/concept/ProcessJudgment.ts:186       /* synchronized (target_concept) { */
src/control/concept/ProcessQuestion.ts:103       /* synchronized (c) { */
src/control/concept/ProcessQuestion.ts:146       /* synchronized (c) { */
src/control/concept/ProcessTask.ts:44            /* synchronized (concept) { */
src/control/GeneralInferenceControl.ts:29        /* synchronized (mem.concepts) { */
```

Java 版 OpenNARS 靠这些同步块保证 `concept.taskLinks`、`memory.concepts`、`concept.memory.seq_current` 不被并发破坏。`/* ... */` 注释形式表明**翻译者无法把 Java monitor 翻译成 TS 等价物**——也承认了它的存在。

**为什么不解决**：

- Node 单线程下假设所有访问是顺序的
- **但 Node 不是真单线程**：`Promise.then`、`process.nextTick`、`setImmediate` 都是潜在的并发点
- 一旦在某个核心推理路径上加入 `await`，整片 `Concept`/`Memory` 数据结构的访问失去 Java 时代的锁保护
- 注释 `/* synchronized */` **误导后续维护者**，让人以为原作者知道这里需要锁

**推荐做法**：

1. **删除这些注释**，加一行 `// NOTE: Node single-thread assumption; do NOT await inside reason cycle.`
2. 在 `docs/` 下独立文档"单线程假设清单"，列出所有"假设当前线程唯一"的代码区
3. 任何对推理循环的修改 PR 必须包含"是否引入 `await` / `setImmediate` / 微任务"的自检
4. 这一条是**整个清单最关键的**——单点漏洞但可毁整个推理循环

### 2.2 Java 静态初始化与 jree 类身份坍缩 [v0.6 B8 部分]

**证据**：

```ts
// src/io/Symbols.ts:230     static { /* 初始化符号表 */ }
// src/language/Tense.ts:28   static { /* ... */ }
```

`v0.6 B8` 已记录"`JavaObject.class` getter 坍缩"——但**没触及它的根因**：Java 类的静态初始化是确定性生命周期事件；TS/Node 的模块求值顺序未定。

**为什么不解决**：

- `Symbols.TENSE_FUTURE`、`Symbols.STAMP_OPENER` 等静态符号在 `Distributor.addInput` 等调用路径上被引用
- 当 `import` 图含循环依赖（如 `Symbols → Tense → Symbols`），部分静态字段可能在 `import "src/main/Nar"` 时还没求值完
- 必须显式 bootstrap

**推荐做法**：

1. 在 `Nar.constructor` 显式 `import` 所有静态表相关文件（强制求值）
2. 或：在 `Symbol.ts` 改用 `static { lazy initializer }` 模式（getter-as-initialization）
3. v0.6 B8 提供的 `jree-compat.ts` monkey-patch 要确认跨 jree 升级仍稳定

### 2.3 反射 API（`Class<T>`、`Class.forName`、`getDeclaredField`）无 TS 等价 [v0.6 C1 部分 + C2.2 部分]

**证据**：

```ts
// src/main/Nar.ts:332
// TODO use reflection for narParameters, allow to set
```

Java 版通过 `Parameters.class.getDeclaredField("decisionThreshold").setDouble(...)` 在运行时改 NAR 配置。TS 完全没有运行时反射。

**为什么不解决**：

- TS 必须改用 hard-code 字段名 + 显式 setter
- 插件注册 (`ServiceLoader.load(Plugin.class)`) 无 TS 等价——必须改显式 import list（v0.6 C2.2 已记录）

**推荐做法**：

1. 在 `src/main/Parameters.ts` 显式列出每个可配置参数
2. 新建 `src/plugin/PLUGIN_REGISTRY.ts`，Nar 启动时显式注册
3. 删 `// TODO use reflection ...` 注释（属于"Cat ②④" 计划删除项）

### 2.4 内部类 `this$0` 隐式捕获 [v0.6 B3 延伸到非枚举场景]

**证据**：

```ts
// src/main/Shell.ts:103-154 — InputThread 通过 IIFE 捕获外层
public InputThread = (($outer) => {
    return class InputThread extends java.lang.Thread {
        private readonly bufIn: java.io.BufferedReader;
        protected readonly nar: Nar;
        protected constructor(input, nar) { ... }
    };
})(this);

// src/entity/Stamp.ts:524 — BaseEntry 通过静态字段
public static BaseEntry = class BaseEntry extends JavaObject
    implements java.lang.Comparable<BaseEntry>, java.io.Serializable { … }
```

**为什么不解决**：

- Java `InputThread` 非静态内部类被翻译成 IIFE `(($outer) => { return class ... })(this)`
- IIFE 模式在 `super()` 之前捕获外层 `this`——但**闭包变量被每个 InputThread 长期持有**
- `Stamp.BaseEntry = class BaseEntry extends JavaObject` 把子类存为静态字段——`instanceof Stamp.BaseEntry` 在静态字段尚未赋值时是 `undefined`

**推荐做法**：

1. 内部类一律上提为独立文件：`InputThread.ts`、`StampBaseEntry.ts`
2. 用依赖注入替代表层捕获：`new InputThread(nar, reader)`
3. v0.6 B3 提示了枚举场景，但内部类的 `this$0` 隐式语义**未触及**

---

## 3. Tier 2：行为差异，编译过但可能 bug

### 3.1 构造重载 → `switch(args.length)` [v0.6 B1, B4]

**证据**：`src/entity/Stamp.ts:133-214`（6 个重载 → 1 个 switch），这是 v0.6 B1 + B4 的范例。

**v0.6 已识别**但**未触及的两个遗留问题**：

- 类型安全丢失（编译过 ≠ 接受正确类型）
- 增加新重载需同时改 switch + 改类型签名——不显式同步就出 silent bug

**为什么不解决**：

- 同参数数目的重载（v0.6 B4）尤危险——switch 中后一个分支永远不可达，需要运行时对象形态判断替代
- 项目至少 6 个 entity 类用此模式（Stamp、Sentence、Task、Concept、BudgetValue、Item）

**推荐做法**：

1. 严格按 TruthValue.ts 范例做：工厂方法 + 类型签名 + toKey()
2. 每个 entity 文件单独加 `test/node/*.test.ts`
3. 一旦 tsc 报"参数不匹配"，立刻迁移到工厂法

### 3.2 `instanceof` 在 jree 类上的歧义 [v0.6 B15]

**证据**：437 处 `instanceof` 调用，几乎全在 `inference/*Rules*.ts`

**为什么不解决**：

- 原生 `instanceof Stamp` 靠原型链，正确
- `instanceof java.util.LinkedHashMap` 走 jree 模拟的 `Symbol.hasInstance`
- v0.6 B15 已识别，但当 `JavaObject.class` getter 失效时（v0.6 B8 已记录），instanceof 会坍缩到同一 token
- 总 `instanceof` 437 处是高频风险面

**推荐做法**：

1. 推理规则里**所有 `instanceof` 必须是 TS 原生类**
2. 任何 `instanceof java.util.*` 必须内联替换为 `map.get(key)` / `Array.isArray(...)` 等原生判断
3. 集中维护一份 "instanceof → 等价判断" 映射表到 `docs/runtime-blockers.md`

### 3.3 LinkedHashMap 插入顺序语义 [v0.6 未单列]

**证据**：`src/control/concept/ProcessGoal.ts` 中 8 处 `new java.util.LinkedHashMap()`：

```
src/control/concept/ProcessGoal.ts:177   new java.util.LinkedHashSet()
src/control/concept/ProcessGoal.ts:292   new java.util.LinkedHashMap()
src/control/concept/ProcessGoal.ts:307   new java.util.LinkedHashMap()
src/control/concept/ProcessGoal.ts:367   new java.util.LinkedHashMap()
src/control/concept/ProcessGoal.ts:370   new java.util.LinkedHashMap()
src/control/concept/ProcessGoal.ts:373   new java.util.LinkedHashMap()
src/control/concept/ProcessGoal.ts:379   new java.util.LinkedHashMap(subsconc)
src/control/concept/ProcessGoal.ts:383   new java.util.LinkedHashMap()
```

**为什么不解决**：

- TS 原生 `Map` 也保证插入顺序（ES2015 spec），但 jree 的 LinkedHashMap 是否在 access-order 切换、reinsertion、null 键等边界与 Java 严格一致——**是个开放问题**
- NAL-9 操作预期相关路径依赖插入顺序归并，行为漂移只在对顺序敏感时显形
- v0.6 B 系列没单列此项

**推荐做法**：

1. 跑 246 NAL 矩阵确认插入顺序不影响
2. 若发现漂移，把对应的 LinkedHashMap 改用 TS 原生 Map（ES2015 spec 保证）

### 3.4 `equals/hashCode` 契约 [v0.6 C2, C2.1 部分]

**证据**：152 处 equals 重载 + 28 处 hashCode 重载；Total = 180 处契约。

**v0.6 C2 + C2.1** 覆盖了字符串层面，但**没说全**：

- TS 原生 `Map` 不调用 `obj.equals()` —— 用 `===`
- jree LinkedHashMap 用 `obj.hashCode()` 找桶
- 漏重载 hashCode 但重载了 equals → **Map 默默查不到 key**——只在 NAL 行为差分暴露

**为什么不解决**：

- 重构 `equals` 时漏字段不像 Java IDE 那样自动同步
- 漏 hashCode 重载只在用 jree 集合时才显形——但 437 处 `instanceof` 派发大量依赖

**推荐做法**：

1. 跟随 TruthValue.toKey() 模式：所有 jree 集合键的类型都做 `toKey()` 字符串化
2. 重构 `equals` 必同步 `hashCode`，CI 加 lint 检查
3. ES2015 原生 Map 是更好的归宿（用对象引用，不再要 hashCode）

### 3.5 `clone()` 深浅语义 [v0.6 未单列]

**证据**：76 处 `clone()` 调用

**为什么不解决**：

- Java `clone()` 是 JNI native 浅拷贝；TS `{...obj}` 是浅拷贝；但 `structuredClone` 是深
- 项目里 Concept 用 clone 分离共享状态——若某个 clone 漏深拷贝字段，**两个 Concept 共享同一 taskLinks**，修改影响全局
- 现有测试掩盖了部分，但不是全部

**推荐做法**：

1. `Concept`/`Task`/`Sentence` 这类"含内部集合"的类一律用 `structuredClone(...)` 或显式 `deepClone()` 方法
2. 浅拷贝只能用于值对象（`Stamp`、`TruthValue`）
3. 删除每个 `clone()` 方法的注释头，加一行 `// Deep-clones internal collections`。Java 时代的浅拷贝默认在 TS 反而是反 idiom

---

## 4. Tier 3：掩盖、易引爆

### 4.1 `java.util.Random` 偏差 → NAL 推理随机源偏移 [v0.6 B11]

v0.6 B11 已完整记录。本文件补充两点长期代价：

- **245 NAL 矩阵中含真随机的少数，差分验证是统计意义上的**——不能保证 100% 一致
- **每次 jree 升级都必须重测 Random**——没有"版本对就完事"的说法
- 当前 compat 位于 `src/runtime/jree-compat.ts:25-84`，是项目级补丁，不依赖 jree 上游修复

### 4.2 `Charset` 异步初始化 race [v0.6 未单列]

**证据**：`src/runtime/jree-compat.ts:86-107` 用 `Object.defineProperty` 拦截 `defaultCharset` 写入

**为什么不解决**：

- jree 用 `setTimeout` 异步初始化——Node 上**任何** jree 字段都可能引发同类 race
- 项目级补丁，不是 jree 上游修复
- 升级 jree 时这个拦截可能误伤正常写入

**推荐做法**：

1. 升级 jree 前单独测试 `test/node/random-compat.test.ts` + Charset 行为
2. 升级后若 init 改回同步，**移除该 patch**，因为它会锁死 defaultCharset 不可变

### 4.3 `JavaObject.class` 类身份坍缩 [v0.6 B8]

v0.6 B8 已识别。本文件补充：

- compat 必须存在直到 `src/entity/*` 与 `src/inference/*` **全部去 jree**
- 任何 `import { java } from "jree"` 残留都重新引发坍缩的风险
- 推荐**显式追踪 jree 导入残留数**（目前 116 处）——这是 P6 退场的硬指标

### 4.4 显式插件注册 vs Java `ServiceLoader` [v0.6 C2.2]

v0.6 C2.2 已记录。当前事实：

- `^anticipate` 已接入；其余 19+ 个 mental/misc operator 仍列在 `ConfigReader.lastUnsupportedPluginClasspaths` 中
- NAL 语料中凡引用这些 operator 的，TS 侧**功能缺失**而不报错——因为 Narsese 解析会把 `^op` 看作合法项

**为什么危险**：依赖 NAL 矩阵覆盖度——若 246 NAL 中只有 20% 涉及未迁移 operator，则 80% 矩阵通过会**假阳性**。

**推荐做法**：

1. 在 `src/plugin/MIGRATION_STATUS.ts` 维护 operator↔状态映射（done / pending / deferred）
2. CI 跑 NAL 矩阵时，按"operator 命中数"分组报告（已迁移 / 未迁移 / N/A）
3. 不能把"通过率 80%"等同于"行为对齐"——必须按 operator 拆分看

---

## 5. 反查表：现象 → 痛点

| 看到的现象 | 可能是哪条 |
|---|---|
| NAL 行为差分指向"随机性相关"但找不到算法 bug | Tier 4.1 Random 偏差 |
| `instanceof` 派发到错的规则 | Tier 2.2 jree class identity |
| `Concept`/`Task` 的 `taskLinks` 莫名其妙被共享 | Tier 3.5 clone() 深浅 |
| `addInput` 首调抛 "X is undefined" | Tier 2.2 静态初始化 |
| `Memory.concepts` 在 245 NAL 跑后偶尔混乱 | Tier 2.1 synchronized 沉默去除 |
| NAL 矩阵某一条输出差几分钱（0.01 量级） | v0.6 B16 浮点模式 |
| Narsese 中的 `a` 与 `A` 被判等 | Tier 3.4 / v0.6 C2.1 JavaString 边界 |
| 推理规则少建某类链接（`COMPOUND_CONDITION`） | Tier 3.2 / v0.6 B15 instanceof 类族 |
| NAL operator 调用看不到具体实现 | Tier 2.3 反射 / v0.6 C2.2 插件显式表达 |
| jree 升级后某个旧 fixture 突然挂了 | Tier 4.2 / Tier 4.3 / Tier 4.4 全套 |
| Bag 在压力下抽到的 Task 与 Java 基线不一致 | Tier 3.3 LinkedHashMap 顺序 |

---

## 6. Agent 开工前的 checklist（离场前自检）

> 任一条命中 → 不得标 "完成"，必须先修补并配套测试。

| # | 自检项 | 命中时该做什么 |
|---|---|---|
| 1 | 新模块 / 改动中**引入 `await` / `setImmediate` / `process.nextTick` 在推理循环**？ | 答 yes → 删除；答 no → 通过 Tier 2.1 检查 |
| 2 | 新模块含 `/* synchronized */` 注释？ | 答 yes → 删除并替换为 Node 单线程假设说明（Tier 2.1） |
| 3 | 新模块 `import { java } from "jree"`？ | 答 yes → 必须配套本文件 Tier 1~4 全套检查 |
| 4 | 新模块有构造重载但用 `switch(args.length)`？ | 答 yes → 改 TruthValue 范例的工厂法（Tier 3.1） |
| 5 | 新概念有 `clone()` 但没显式深拷贝策略？ | 答 yes → 改 `structuredClone(...)` 或显式深拷贝工厂（Tier 3.5） |
| 6 | 新写的 `equals()` 没同步 `hashCode()`？ | 答 yes → 加 hashCode 或一并迁 toKey() 模式（Tier 3.4） |
| 7 | 新写 `instanceof java.util.*`？ | 答 yes → 改 `Array.isArray(...)` / `Map.get(...)` / 集中运行时类型映射（Tier 3.2） |
| 8 | 新模块触碰 `Parameters.*` 但用 reflection？ | 答 yes → 显式字段名 + 显式 setter（Tier 2.3） |
| 9 | NAL 算子列表引用了 `^anticipate` / `^believe` / `^want` 等但未验证 operator 实现？ | 答 yes → 查 `src/plugin/MIGRATION_STATUS.ts`（Tier 4.4） |
| 10 | 改动跨 jree 边界（升级 jree 前）？ | 答 yes → 跑 `test/node/random-compat.test.ts` + Charset（Tier 4.2） |

**任何一条 yes → 必须有配套 `test/node/*.test.ts` 单元测试**。

---

## 7. 与本仓其他文档的关系

| 文档 | 互补焦点 |
|---|---|
| [`docs/strategic-baseline.md`](./strategic-baseline.md) | 项目阶段（P0~P6）的导航与门禁 |
| [`docs/java-to-typescript-migration-patterns.md`](./java-to-typescript-migration-patterns.md) v0.6 | 16 个 A/B/C 级迁移纠正模式（写迁移代码时优先查） |
| [`通用转写方法1.1.md`](../通用转写方法1.1.md) | 9 步转写流程（动一个模块时的具体步骤） |
| **本文件** | 14 个 Tier 级结构性踩坑点（开工 + 复盘时优先查） |

——四份文档形成四角：战略导航 / 模式纠正 / 流程规范 / 结构性风险。

## 8. 维护规则

1. **不与 v0.6 重叠**：当某个坑被吸纳进 v0.6 时，从本文件删去并加注"已迁 v0.6 Bxx"
2. **新增条目必须先过 §6 自检**——这是本文件的天然回归门
3. **版本号累计**：v0.1 → v0.2 时在顶部版本日志加一行"新增条目"
4. **每条对应一个 NAL 行为差分案例**——凭空写条目不接受
