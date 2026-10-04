# OpenNARS 3.0.4 TypeScript v1.0.5

## 中文

本次修订版收录平台中立核心之后的原生 TypeScript 整理、Bag 词项查找优化、诊断日志修正，以及更新的静态 Demo Lab。包提供 Node.js CLI 与 ESM API；Demo Lab 单独部署为静态网站，不发布 npm。

- 一次性句子字符串构建器改为原生字符串；类身份判断使用构造器，保留可观察的词项判等与事件身份合同。
- Bag 的恢复态查找减少包装分配，并对标准词项使用安全的具体类与名称预筛。短基准显示收益，但不能推断所有 NAL 或长期 Demo 都等比例加速。
- 普通 INFO 诊断输出改走信息通道；严重错误和异常仍走错误通道。
- Demo Lab 对感知输入节奏与墙钟 RPS 做了修正；真实浏览器 smoke 中，十个普通 Demo 和 Microworld 示例模式均出现非 babble 的 NARS 操作。BandRobot 已明确标为多步任务实验，因为固定场景尚未证明自主完成抓取—运输—交付。
- Demo Lab 新增并公开了 Grid Microworld、NARS × 2048、Pong 九种玩法与 Shot 六模式基础页面；Shot 的完整淘汰排名与长期进化行为仍标为进行中。

受保护核心生产提交 `083d7b8`：TS-only M2 为 `512 passed / 2 skipped / 0 failed`，含 Java M2 为 `514/514 passed`；当前 HEAD 文档更新后的 Java M2 现跑为 `514/514 passed`；M1′ 主体 `243/243 passed`，另有 #25、#246 和 #245 的 65536 周期降载夹具通过；两项 131072 周期 strict markerless 与冻结 Java 摘要逐窗口相等。v1.0.5 包检查、Node/API/CLI/Shell、Pages 与部署前缀浏览器 smoke 均已复核；以上结果不能冒充原始 245 项完整 M1。

**性能限制：** Microworld 有 NARS 操作的 seed19 示例模式，Chrome 30 秒平均 `15.875 TPS`、末五秒 `11.776 TPS`，未达到期望的持续 20 TPS。TicTacToe、TestChamber、FighterPlane 和 Echo Relay 的后段世界 TPS 也仍偏低。重复首查、名称索引和几何对象候选未获得可接受的端到端收益；应用户要求，本轮停止继续试探。Bag 插入/分配、概念增长与 GC 长尾仍是可调查热点，停止不代表性能已经收敛。原始 2,000,000 周期稳定性负载因设备资源限制 **not_run**；降载测试不证明它通过，也不宣称与 Java 性能相同。

来源和许可见 `NOTICE`、`LICENSE` 与 Demo 项目的 attribution 文件。本项目由 Agent 参与实现；按当时实际会话记录，已有 `GPT-6 Sol High` 身份披露在 `docs/agent-workflow-disclosure.md`。

## English

This fix release includes native TypeScript cleanup, Bag term-lookup improvements, a diagnostic logging fix, and an updated static Demo Lab. The package provides a Node.js CLI and ESM API; the Lab is deployed separately as a static site. It is not published to npm.

- One-shot sentence builders now use native strings. Constructor identity replaces a class-token path while preserving observable term equality and event identity.
- Bag lookup avoids some wrapper allocation and uses safe concrete-class and name prefilters for standard terms. Short benchmarks improved, but that does not imply proportional gains across all NAL workloads or long-running demos.
- Ordinary INFO diagnostics use the information channel; serious errors and exceptions retain the error channel.
- The Lab adjusts perception cadence and wall-clock RPS reporting. A real-browser smoke test observed non-babble NARS operations in all ten ordinary demos and the Microworld starter scenario. BandRobot is labeled a multi-step experiment: autonomous pickup, transport, and delivery have not been demonstrated in the fixed scenario.
- The Lab now publishes Grid Microworld, NARS × 2048, nine Pong play modes, and the six-mode Shot foundation page. Shot's full elimination ranking and long-run evolution behavior remain in progress.

For protected core source commit `083d7b8`, TS-only M2 was `512 passed / 2 skipped / 0 failed`, Java M2 was `514/514 passed`; a current-HEAD Java M2 rerun also passed `514/514`. The M1′ body was `243/243 passed`, and #25, #246, and the reduced 65536-cycle #245 fixture passed. Both 131072-cycle strict markerless digests matched their frozen Java baselines window by window. Package, Node/API/CLI/Shell, Pages, and deployment-prefix browser checks were verified for v1.0.5. These results do not constitute the original full 245-file M1.

**Performance limitations:** With NARS actions enabled, the Microworld seed-19 starter scenario averaged `15.875 TPS` over 30 seconds and reached `11.776 TPS` in the final five seconds in Chrome, below the desired sustained 20 TPS. TicTacToe, TestChamber, FighterPlane, and Echo Relay also have low late-window world rates. Three subsequent candidate families showed insufficient end-to-end benefit; the user stopped this optimization round. Bag insertion/allocation, concept growth, and GC tails remain possible hotspots, so this is not a convergence proof. The original two-million-cycle stability workload is **not_run** because of device resource limits; the reduced fixture cannot stand in for it or establish Java-equivalent performance.

See `NOTICE`, `LICENSE`, and the Demo project's attribution files for origins and licensing. Agent involvement is disclosed in `docs/agent-workflow-disclosure.md`, including the recorded `GPT-6 Sol High` identity for its earlier work.
