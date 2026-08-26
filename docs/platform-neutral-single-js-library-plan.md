# `npm run bundle` 平台中立单 JS + `.d.ts` 子计划

> **暂缓计划（尚未实施）**：项目已于 2026-08-27 阶段封存。本文保留为恢复开发时的设计输入，不表示 `npm run bundle`、单一公共类或正式发布物已经存在。恢复前先核对[当前状态](current-status.md)。

## 1. 文档定位

本文定义 OpenNARS 3.0.4 TypeScript 发布准备中的一个子功能：通过 `npm run bundle`，把已经平台中立化并冻结公共 API 的核心构建为一个自包含 JavaScript 文件和一个 TypeScript 声明文件，供 Node.js 与浏览器集成。

本文不是完整发版计划。公共文档、license/changelog/manifest、性能证据、Release Candidate 和正式发布授权需要在恢复工作时重新立项；bundle 完成不得被表述为发布准备全部完成。

状态：**Planned / 尚未完成**。

关联里程碑：

- `019-tsc-zero-error-build`：已完成的零诊断构建基线；
- `023-jree-removal-native-runtime`：移除生产核心对 jree 的依赖；
- `024-platform-neutral-core-host-adapters`：配置、文件、进程、终端与浏览器能力分层；
- `020-ts-performance-and-release`：最终性能与发版门禁。

2026-08-26 基于 `ed494569c6b0fba12730e0dc2a768d62d08784d4` 生成的客户临时包只用于应急集成，不代表本文目标已经完成。

## 2. `npm run bundle` 目标

最终直接交付目录的核心入口只提供：

```text
opennars-304-ts.lib.js
opennars-304-ts.lib.d.ts
```

其中：

- `opennars-304-ts.lib.js` 是自包含、平台中立、无外部包依赖的单运行时文件；
- `opennars-304-ts.lib.d.ts` 是与实现同步生成或验证的唯一公开类型声明；
- 同一份 `.lib.js` 可在 Node.js CommonJS/ESM、浏览器、Web Worker 和主流 bundler 中加载；
- Shell 与 Web 作为外部壳分别生成 JavaScript，但不各自生成 `.d.ts`；
- 默认使用不需要文件系统的内置配置；
- 文件、终端、进程、上传和外部操作由宿主负责；
- 普通用户只需要学习一个 `OpenNARS` 类和少量普通 TypeScript 类型；
- Java 迁移内部类型、jree、Java collection、class token 和事件实现不进入公开合同。

## 3. 反目标

- 不在本功能中重写 NAL 推理算法；
- 不为了单文件而改变 Java/TypeScript 已冻结的功能语义；
- 不把现有浏览器 fake shim 固化为正式架构；
- 不要求核心直接读取 `.nal` 文件或配置文件；
- 不要求第一版支持 CommonJS `require()`；
- 不把 CLI、网页 UI 或 Worker 调度细节塞进核心类；
- 不把单文件 bundle 大小优化与推理性能优化混为一谈；
- 不强制建立持续集成，测试可由发布候选人工触发。

## 4. 单类公开合同

建议的稳定入口：

```ts
export class OpenNARS {
  static readonly version: string;

  constructor(options?: OpenNARSOptions);

  input(narsese: string): this;
  cycles(count: number): this;
  onOutput(listener: OpenNARSOutputListener): () => void;
  setVolume(volume: number): this;
  registerOperation(name: string, handler: OpenNARSOperationHandler): () => void;
  reset(): this;
  close(): void;

  readonly cycle: number;
}
```

可以导出 `OpenNARSOptions`、`OpenNARSOutput`、`OpenNARSOperationHandler` 等 TypeScript 类型，但不得为每个概念增加运行时 class。

### 4.1 输入

`input(text)` 接受单行或多行 Narsese：

- 保留有意义的输入顺序；
- 明确空行与注释行为；
- 不隐式读取路径；
- 不因多行形式额外推进未声明周期；
- 解析错误使用稳定的原生 `Error` 子类或错误码。

### 4.2 周期

`cycles(count)`：

- 只接受有限、安全的正整数；
- 同步核心保持 Java 3.0.4 的单线程周期顺序；
- 浏览器是否放入 Worker 由宿主入口决定，不改变核心语义；
- 超大工作量的取消由可选宿主能力处理，不在核心中引用进程 API。

### 4.3 输出

公开输出使用普通对象：

```ts
interface OpenNARSOutput {
  readonly channel: "IN" | "OUT" | "ANSWER" | "EXE" | "ERR" | string;
  readonly text: string;
  readonly cycle: number;
}
```

不得要求使用者传入 `java.lang.Class`、`EventObserver` 或访问 `OutputHandler.*.class`。取消订阅函数必须可重复调用且不泄漏监听器。

### 4.4 NAL-8 宿主操作

`registerOperation()` 是唯一建议保留的高级集成入口：

- 操作名称与参数使用字符串或普通结构；
- Node 与浏览器可注册不同宿主行为；
- 未注册、拒绝、异常和超时有明确输出/错误合同；
- 浏览器默认不允许执行任意系统命令；
- 现有 `System` 等 Node 专属操作必须移入显式 Node adapter，不可被通用 bundle 静态导入。

### 4.5 生命周期

- `reset()` 清空推理状态并重置时钟；
- `close()` 停止活动、解除监听并可重复调用；
- close 后输入或 cycles 的行为必须稳定、可测试；
- Worker 的创建/终止属于浏览器宿主示例，不成为同步核心的隐式副作用。

## 5. 平台边界

依赖方向固定为：

```text
平台中立 OpenNARS 门面
    ↓
平台中立 Nar/配置/解析/推理核心
    ↓
普通 TypeScript 数据结构与能力接口

Node adapter                 Browser adapter
├─ fs/config path            ├─ config text/object
├─ CLI/readline              ├─ File.text()/textarea
├─ process/signals           ├─ Web Worker
└─ approved operations       └─ approved operations
```

核心允许接收：

- 默认配置对象；
- 配置文本；
- 已解析的普通配置对象；
- 明确注入的操作或取消能力。

核心禁止直接导入：

- `node:fs`、`node:path`、`node:process`、`node:child_process`、`node:readline`；
- jree；
- DOM、Worker、File 或终端 API；
- 仅为构建工具存在的 shim。

Node 文件读取示例：

```ts
const source = await readFile(path, "utf8");
nars.input(source);
```

浏览器上传示例：

```ts
nars.input(await file.text());
```

这两种行为不需要在核心类中增加 `inputFile()`。

## 6. 包与构建合同

### 6.1 直接文件合同

客户集成不以 `.tgz` 或展开的 npm 包为前提。直接复制 `.lib.js` 与同名 `.lib.d.ts` 即可使用；构建身份作为类的只读元数据嵌入运行时文件。若以后另行发布 npm registry 包，它只能引用同一对已验收文件，不能成为另一套实现。

Node Shell 与 Web 壳不得扩大核心公开 API，也不得拥有独立类型声明。它们可以引用核心 `.lib.js`，但核心文件本身不得包含内部相对模块路径。

### 6.2 `npm run bundle`

- `bundle: true`；
- 输出同时满足浏览器全局加载、Node CommonJS 与 Node ESM interop；
- `target: es2022`；
- 不包含外部运行时依赖或隐藏的动态 require；
- 不包含 `node:` import；
- 默认配置以数据模块或构建期静态内容进入核心；
- 保留 license 与构建 manifest；
- source map 是否发布单独决定，不影响两文件公开合同；
- 不设置未经审计的 `sideEffects: false`，避免删除 Java 静态初始化语义。

### 6.3 类型声明

- `.d.ts` 只描述公开门面与普通类型；
- 不引用源码路径、jree 或 `@types/node`；
- 由声明生成加 API 审核保护，避免手写声明与实现漂移；
- 在没有 DOM lib 的 Node consumer 和有 DOM lib 的 Web consumer 中分别编译；
- advanced 内部 API 不通过根入口意外暴露。

## 7. 任务 DAG

```text
G0 最新稳定 HEAD 的 M1/M2 全量回归（本子计划开始前必须通过）
 └─→ U0 冻结公开 API 与临时包反馈

U0
 ├─→ U1 完成 024 配置文本/对象与默认配置路径
 ├─→ U2 完成 024 输入文本/文件宿主边界
 └─→ U3 完成 023 的公开可达 jree 类型收口

U1 + U2 + U3
 └─→ U4 实现 OpenNARS 单类门面与原生输出合同
      ├─→ U5 实现 NAL-8 宿主操作注册
      └─→ U6 生成平台中立单 ESM + 单 .d.ts

U4 + U5 + U6
 └─→ U7 Node/Web/Worker/CLI/类型/包集成验证
      └─→ U8 再次执行 M1/M2 集成冻结，并把 bundle 结果交给完整 G8 发版准备
```

## 8. 分阶段计划

### U0：API 冻结

- 收集临时客户包使用反馈；
- 确认类名、同步/异步边界、输出事件、volume 和操作注册；
- 通过最小兼容 spike 固定同一 `.lib.js` 在浏览器、Node ESM 和 Node CommonJS interop 下的加载合同；
- 用 API fixture 锁定允许的公开 symbol。

### U1—U3：核心中立化

- `new OpenNARS()` 不读文件；
- 配置 XML/文本解析成为纯函数；
- 默认配置成为静态数据；
- `addInputFile` 移到 Node adapter；
- `System`/进程能力移到 Node adapter；
- 根入口可达图中消除 jree 与 Node built-in。

### U4：门面实现

- 在内部 `Nar` 之上实现最薄的组合式 wrapper；
- 不继承迁移类；
- 输入、周期、输出、volume、reset、close 逐项有合同测试；
- 内部对象不通过 public property 泄漏。

### U5：操作注册

- 以普通回调桥接 NAL-8 操作；
- 明确参数、返回值、异常和异步策略；
- Node 与 Web 均有至少一个真实操作集成示例；
- 禁止浏览器通用包执行任意 shell 命令。

### U6：产物生成

- 构建 `opennars-304-ts.lib.js` 与 `opennars-304-ts.lib.d.ts`；
- 构建无独立声明文件的 Shell 与 Web 外部壳；
- 生成 artifact SHA-256，并把 build manifest 作为核心类只读元数据嵌入；
- 客户目录禁止出现 `.tgz`、源码树、展开的内部模块或额外 per-host `.d.ts`；
- CLI/Shell 与 Web 壳保持可用；
- 浏览器不再依赖 fake `fs/path/process/child_process`。

### U7：集成验收

至少包含：

1. Node ESM 干净目录安装与 import；
2. TypeScript Node consumer 严格编译；
3. 浏览器原生 module import；
4. Web Worker import；
5. Vite/esbuild 等 bundler 消费冒烟；
6. 多行输入、cycles、volume、ANSWER/OUT/EXE；
7. 订阅/取消订阅、reset、close；
8. NAL-8 自定义宿主操作；
9. bundle 静态扫描无 jree、动态 require 和 Node built-in；
10. Node CLI/Shell 与 Windows `.cmd`、POSIX `.sh` 示例；
11. 浏览器示例带最小本机 Web 启动器，Windows `.cmd` 与 POSIX `.sh` 均可用；
12. 客户目录文件白名单、版本和 SHA；
13. 无源码 loader、无工作目录隐式依赖。

### U8：发布门

在同一个 release commit/artifact 上验证：

- M1 245+1 功能冻结门；
- M2 零诊断、单元测试、构建和 API；
- BabelNAR 按需横向规则测试；
- Node 与浏览器客户示例；
- 独立 M3 性能预算；
- README、license、版本、构建时间和 changelog。

## 9. bundle 使用文档子计划

正式使用文档控制在一个简洁 Markdown 文件内，读者默认了解 NARS，不介绍 NARS 理论。

这里只规定与 bundle 直接相关的集成使用文档，不承担全仓历史 Agent 文档整理。全仓文档清单、权威/历史/重复分类、旧提示词归档和发布制品排除规则属于完整发版准备 G8-C。

建议结构：

1. 安装与 ESM import；
2. 创建 `OpenNARS`；
3. 多行 Narsese 与 cycles；
4. OUT/ANSWER/EXE 输出；
5. volume；
6. NAL-8 操作注册；
7. Node 文件读取；
8. 浏览器文件上传与 Worker；
9. 配置文本/对象；
10. reset、close、版本和错误。

每个平台最多保留一个完整示例；其余使用短片段，避免复制内部迁移 API。

## 10. 完成条件

只有同时满足以下条件，才能宣称“`npm run bundle` 子功能完成”；这仍不等于 Release Candidate 或正式发布准备完成：

- 核心入口只需 `opennars-304-ts.lib.js` 与 `opennars-304-ts.lib.d.ts`；
- `OpenNARS` 是普通集成所需的唯一运行时 class；
- 同一 JS 文件在 Node ESM 和真实浏览器中运行；
- 浏览器构建不使用 Node fake shim；
- 根入口可达图无 jree、Node built-in 和动态 require；
- 默认构造不读取文件；
- 文件和上传均通过宿主读取后传入文本；
- 输出、volume、reset、close 和 NAL-8 操作有跨平台合同；
- Node/Web TypeScript consumer 严格编译；
- 直接文件消费与客户目录白名单通过，交付目录不存在 `.tgz`；
- CLI、Shell 与 Windows `.cmd`、POSIX `.sh` 示例可运行；
- 最小本机 Web 启动器只暴露浏览器示例所需文件；
- M1/M2 功能门不退化；
- 性能结论独立记录；
- 简洁使用文档、license、版本、构建 manifest 与 SHA 完整；
- 未解释语义差异为 0。

## 11. 临时包与正式包的边界

基于 `ed494569` 的临时客户包允许：

- jree 与默认配置被编译进单一核心 `.lib.js`，但不得以外部包或配置文件出现；
- 浏览器外壳继续使用已验证的 Worker 隔离方式；
- Shell 与 Web 外壳只引用核心文件，不各自发布 `.d.ts`；
- Windows 与 POSIX 启动脚本作为外壳入口保留。

临时包不得用于宣称：

- 平台中立化完成；
- 单一通用 JS 正式完成；
- jree 已从生产核心移除；
- 浏览器不再需要 shim；
- 最终性能或发布门已完成。

正式实现应沿 024 与 023 的最小、可验证批次推进，不把临时兼容代码直接搬进核心。
