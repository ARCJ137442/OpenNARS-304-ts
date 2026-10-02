# OpenNARS 3.0.4 TypeScript v1.0.4

## 中文

这是面向运行时原生化和平台边界的 fix release。

- 生产运行时不再直接导入 npm `jree`，jree audit 为 `0/0`。
- 推理核心的文本、数值、类身份、调度器、值集合、资源错误和配置读取边界改用项目内 TypeScript 合同。
- `ConfigReader` 不再导入 Node 内建模块，文件读取通过 `RuntimeCapabilities.readTextFile` 注入。
- `Term.equals` 的具体类判等改用原生构造器身份；短 demo workload RPS 相对前一基线提升约 22–24%。
- M2：TS-only `506/508`（2 skips、0 failures），Java `508/508`。
- M1' 主体：`243/243`；严格 markerless simple/long 均与 canonical Java `equal=true`。
- Demo Lab 已绑定核心提交 `234b999`，Node、Worker 和真实浏览器 smoke 通过。

长期稳定性原始 2,000,000 周期仍受当前设备资源限制；65536 观察按内存保护分类，不能据此宣称原始长周期完成或 Java 性能等价。

## English

This fix release continues the native TypeScript runtime and platform-boundary work for OpenNARS 3.0.4.

- Production source has zero direct npm `jree` imports (`0/0` audit).
- Text, numeric, class-identity, scheduler, value-collection, resource-error, and configuration boundaries now use project-owned TypeScript contracts.
- `ConfigReader` no longer imports Node built-ins; file access is injected through `RuntimeCapabilities.readTextFile`.
- `Term.equals` uses native constructor identity on the hot path; the short demo workload improved by about 22–24% against the previous baseline.
- TS-only M2: `506/508` effective with two documented skips; Java M2: `508/508`.
- M1' body: `243/243`; strict simple/long markerless digests are equal to canonical Java.
- Demo Lab is bound to core commit `234b999`; Node, Worker, and real-browser smoke checks pass.

The original 2,000,000-cycle stability workload remains a device-resource limitation. The reduced observation is classified as memory-protected and does not claim original long-cycle completion or Java-level performance parity.
