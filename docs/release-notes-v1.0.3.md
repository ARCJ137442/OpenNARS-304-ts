# OpenNARS 3.0.4 TypeScript v1.0.3

## 变更

- Node 与 Browser native host adapter 只提供 TypeScript 宿主能力，不再创建 `java.io`、`java.net` 或 `java.lang` 命名空间。
- 翻译兼容 harness 移到 `test/support`，发布 `src`、`dist` 和 npm tarball 不再包含 legacy facade。
- Demo worker 直接向核心传入原生 `string`，demo 发布提交为 `ff4b01d`，核心边界提交为 `cd3520f`。
- 保留 UTF-16、Java hash/equality、class token、集合迭代、Random 和异常继承等可观察合同。

## 验证

- TS-only M2：`503 passed / 0 failed / 2 skipped`。
- Java M2：`507/507`。
- M1' 主体：`243/243`；#25 与 #246 通过。
- 严格 markerless simple/long：`equal=true`、`first_difference=null`。
- #245 65536 fixture 在 `1800s` 命中 `process_limit`；这是设备上的持续性长周期瓶颈，未宣称原始 2,000,000 周期通过。
- release package 外部 TypeScript、API、CLI、Shell 和启动警告检查通过；直接 npm jree import 为 `0/0`，依赖声明为 `null`。

## English

v1.0.3 is a native-host-boundary fix release for the OpenNARS 3.0.4 TypeScript implementation. Published source and `dist` no longer contain the translated legacy facade; compatibility helpers remain test-only so the observable UTF-16, hashing, class-token, collection, Random and exception contracts stay covered.

The reduced long-stability fixture remains a documented `process_limit` on the current device. This release does not claim completion of the original 2,000,000-cycle workload or Java-level performance parity.
