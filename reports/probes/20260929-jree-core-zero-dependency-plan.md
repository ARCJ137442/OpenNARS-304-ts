# Core zero-dependency bridge plan（2026-09-29）

## 要什么

```text
core: language + inference + entities + storage + operators/plugins
  -> 只依赖项目内 runtime contracts 和显式 capabilities
  -> 不解析 npm jree
  -> 不解析 node:fs/path/process/child_process/terminal

node adapter package
  -> 文件、stdin、进程、网络、Java parity、可选 jree compatibility

browser adapter package
  -> Worker、配置文本、文件上传、不可用能力错误
```

最终验收不是“源码看起来不像 Java”，而是 core 的 import graph 不再需要 jree，公共 API 不泄漏 jree 类型，Node 与 browser 只在 host boundary 装配能力。

## 现在是什么

- `src/platform/node/jree-host-adapter.ts` 是 npm jree 的唯一生产直接导入点；边界提交为 `b094296`。
- `src/runtime/jree-compat.ts` 仍被 `62` 个生产文件使用、命中 `73` 个 import 文本；其中只有 `Nar`、`NarNode`、`Shell`、`TextOutputHandler` 等少数文件需要完整 `java.*` 运行时对象，其余大部分只需要字符串、异常、long、值判等和类型别名。
- 这使当前状态适合做“按职责提取合同”的批量迁移，而不是继续把 npm jree 入口扩散到新文件。

### Batch A 当前结果

- 新增 `src/runtime/java-text.ts`、`src/runtime/java-values.ts`；异常识别函数下沉到 `JavaExceptions.ts`。
- 已迁移 `Item`、`Sentence`、`Term`、`CompoundTerm`、`Terms`、`Variable`、`Variables`、`Bag`、`Memory`、`Task`、`Concept`、`Narsese` 的纯文本/值 helper 导入。
- 非增量 typecheck、build、dist API 通过；最终 TS-only M2 为 `494 passed / 0 failed / 2 skipped`，TAP SHA-256 `212471A134C2ED36BAA687F544AEEDC8127BAA5A3C6C8278146F3685AEBD50F3`。
- 仍有约 69 个 `jree-compat` import 命中；Batch A 是连续迁移的第一块，不宣称 core zero-dependency 或 023 complete。

### Batch A continuation `72e4e07`

- 又迁移 `ProcessGoal`、`TaskLink`、`TermLink`、`Events`、`Image`、`Statement`、`Tense`、`Operation`、`Operator`、`Feel` 的纯 `javaStringValue`/日志文本 helper 导入。
- typecheck、build、dist API 通过；串行 TS-only M2 为 `494 passed / 0 failed / 2 skipped`，耗时 `182971 ms`。
- 受影响 NAL 不重复运行：这些文件的同一提交/同一预期已经有通过的 M1/M1' 或 sentinel 证据，本批只改变 helper 归属。

### Exception helper continuation `8aab324`

- `Operator`、`TermLink`、`TaskLink`、`Events`、`TextOutputHandler` 的异常识别/异常类导入已移到项目 `JavaExceptions.ts`；host `java.*` 形状仍留在 Node/browser adapter 边界。
- typecheck、build、dist API 通过；没有重复运行已有同合同 NAL。

## 后续行动批次

### Batch A：项目内纯合同（核心 0 外部依赖）

新建项目内模块并批量替换 62 个调用者：

- `src/runtime/java-text.ts`：`JavaStringInput`、`JavaCharSequence`、UTF-16 length/equality/hash/compare、`javaStringValue`；核心内部统一 native `string`，boxed String 只在 host boundary 进入。
- `src/runtime/java-values.ts`：`javaValuesEqual`、identity hash、long 加减与安全范围。
- `src/runtime/java-exceptions.ts`：从现有 `JavaExceptions.ts` 导出异常层和 `isJavaException/isJavaThrowable`。
- `src/runtime/java-collections.ts`：把 `JavaListInput` 等结构合同指向 `NativeList/NativeMap/NativeSet`，不保留 jree 类型命名空间。

这批完成后，`jree-compat.ts` 只剩 host-facing boxed/IO facade；language/control/inference/entity/storage/operator/plugin 不再从它导入。

### Batch B：host adapter 与包边界

- Node：`src/platform/node/jree-host-adapter.ts` 只负责兼容 Java boxed/I/O/reflection 和 parity；Node 原生文件、进程、网络能力保持显式接口。
- Browser：`src/platform/browser/java-host-adapter.ts` 提供同样的最小 boxed/exception/string facade；Worker build 将 Node adapter 解析替换为 browser adapter。
- 将 jree 从核心 package dependency 移到独立 adapter package 的 optional/dev 依赖；core 的发布入口不再解析 jree。
- `runtime/jree-compat.ts` 改为迁移期兼容 re-export，生产 core 不再引用；全部消费者切完后删除。

### Batch C：宿主形状清理

- `Nar.ts`/`NarNode.ts`/`Shell.ts`：把文件、网络、终端、退出和序列化改成显式 capability，不把 `java.io` 形状传入核心。
- `TextOutputHandler.ts`：把 `PrintWriter/StringWriter/StringBuilder` 收窄为项目 `LineOutput`/`TextBuilder` 合同，Node/browser 分别装配。
- 统一异常、缺失能力、无效配置错误契约，保持现有直接合同和 M2。

## 证伪实验

1. Batch A 后运行 typecheck/build/dist API、TS-only M2 和 4 个责任簇 sentinel；静态验证 core import graph 不含 jree。
2. Batch B 后在 Node 和 browser 各构建 Worker，检查 bundle 不含 jree 路径；运行真实浏览器 Narsese 输出与配置文本入口。
3. Batch C 后只在不可变提交上运行含 Java M2、完整 245+1 M1、两个 markerless digest，再决定是否更新 LeanSpec。

## 性能热点

既有 M3 profile 已确认：`jree JavaString.valueOf -> convertUTF16ToString -> TextDecoder/getConverter` 和 GC 是低成本样本的第一热点；`getConverter` 占约 `21.9%` 至 `27.6%` profile 时间。该证据支持 Batch A 优先消除重复 boxed String/TextDecoder 转换，但没有证明可直接缓存或全局替换。优化必须等 023/024 集成门通过后进入 020，并以同一 NAL、marker、周期、M1/M2 对照验证。
