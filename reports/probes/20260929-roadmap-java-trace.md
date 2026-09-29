# 路线图与 Java 痕迹态势（2026-09-29）

## 当前定位

当前主仓库 HEAD 为 `14ed360`。PC 完整 live M1 正在唯一进程中运行，已到第 245 项 `stability/long_term_stability.nal`；该样本当前仍有 CPU/RSS 进展，最终分类尚未产生。不要启动第二份 M1。

## 路线

```text
J1 runtime contracts ─┐
J2 language/parser ────┤
J3 inference core ─────┤──> 023 jree stage gate ──┐
J4 operator/plugin ────┤                          │
J5 main/io/host ───────┘                          ├──> 024 platform stage gate
                                                   │
P3 plugin host contract ──────────────────────────┤
P4 browser XML config upload ─────────────────────┤
P5 explicit browser adapters ─────────────────────┘
                                                            │
                                                            v
                                                020 bounded performance/release
```

## 已确证

- J1-J5 的主要实现批次、局部合同、TS-only M2、受影响 NAL 与既有 M1 证据已提交。
- 含 Java M2：`496/496`。
- 两个 markerless 长周期：Java/TS `equal=true`，均达到 `131072` 周期、`128` 窗口。
- Node CLI、dist API、typecheck、build、真实浏览器 Worker 通过。
- web-demo P4 XML 配置文件入口已提交于 `af0bcb7`；P5 adapter 已提交于 `180924f`；当前 web-demo `main` 已包含两者。
- jree 直接导入已集中到 `src/platform/node/jree-host-adapter.ts`，主 runtime bridge 不再直接导入 npm 包；该边界批次为 `b094296`。

## 正在推进

- `stage-14ed360-full-m1-20260929.jsonl`：245 项 live Java/TS parity，当前最后一项仍在运行。
- M1 结束后：解析 245 行分类、补第 246 项、计算 SHA-256、更新 023/024 stage 证据。
- #245 原始 2,000,000 周期因系统瓶颈停止；65536 周期替代实验已通过 parity：TS `495117 ms`、`67510` cycles、峰值 RSS `464674816`，Java `4231 ms`，SHA-256 `0D60FA82F33B3557965F1FAFCB8C42402AAD130160B77E8A180594FE1A2B0A10`。按 65536 请求步数线性外推原始版本约 `251.83` 分钟，超过 30 分钟阈值。后续用 `M1'` 表示 `244` 个普通主资源 + 65536 周期 #245 + #246；不再运行原始 2M 版本，除非专门性能调研。
- 然后提交主仓库和 web-demo，并 `git push origin main`。

## Java 痕迹态势

```text
强：java.* 运行时命名空间、jree-compat、boxed String/Number、Java I/O、Java 异常
中：Java 重载、Map/List/Set/Iterator 类型、StringBuilder、getClass/class、静态工厂
弱：项目内 UTF-16/hashCode、equals/hashCode、Random LCG、float32、cause/suppressed 合同
工具性：canonical Java parity、NAL stage digest、迁移审计与 Java 原始类型注释
```

当前真正阻塞是强痕迹仍可从共享核心路径到达：`jree-compat.ts` 仍被生产调用者广泛使用，虽然 npm 直接导入已集中到 Node host adapter。023/024 尚不能标记 complete；020 不得提前开始。
