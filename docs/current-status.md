# OpenNARS-304-ts 当前状态

日期：2026-10-03（Asia/Shanghai）。本文是当前交接入口；目标与退出条件见 [active-goal-20261002.md](active-goal-20261002.md)，历史过程见 [archive/current-status-history-20261002.md](archive/current-status-history-20261002.md)。历史未跟踪原始证据保留，不视为可随意清理的临时文件。

## 当前定位

2026-10-03 新增 Demo 发布前范围：044 终端/首页路径与「一图胜千言」设计底座已由 Demo 提交 `aa06eb6`、`64ba889` 和本地构建/Chrome 证据验收；045 内部经验、046 Grid Microworld、047 NARS × 2048、048 Pong 多模式、049 Shot 完整多玩家移植仍 `in-progress`。现有 v1.0.5 仅是未发布的包版本准备；Pages/Release 仍为 v1.0.4。新需求总账见 [当前目标](active-goal-20261002.md)和相邻 Demo `docs/probes/20261003-demo-batch-requirements.md`。普通 Demo 的配置目标已改为至少 20 TPS，**实际持续速率未因此达标**。核心生产 `src` 树与受保护 `083d7b8` 的 Git 树哈希同为 `a36ce31778f25e74340fe4406847bacd7bb3c949`；v1.0.5 TS-only M2 复跑 `512 passed / 2 skipped / 0 failed`，含 Java M2 与 M1′仍沿用源树相同的既有证据，不能写成新 HEAD 现跑。

```text
v1.0.4 已发布
    │
    ├─ 原生化与平台中立旧 spec：按当时口径 complete
    ├─ 核心生产 083d7b8：M1′/M2/markerless 已保护
    └─ Demo 生产 8a147f4：具身适配、输入节奏、墙钟 RPS 已实测
         │
         ├─ 10 个普通 Demo + Microworld 示例：能发出 NARS 操作
         └─ 持续性能 / 有效任务闭环：仍有未达标项
              ↓
        spec 042 性能收敛 → 最终发行门 → Pages / fix release
```

核心 `083d7b8` 将 INFO 日志从 `console.error` 改为 `console.info`，严重错误与异常堆栈仍走错误通道。源码、发布依赖没有 npm `jree`；最新静态审计 `audit:jree` 为直接导入 `0/0`、平台审计 `coreCandidateFiles=0`、`mixedBoundaryFiles=0`。非增量 typecheck、build、dist API 通过。LeanSpec 042 为 `in-progress`；历史 023/024/025/027/031/036 的 complete 不代替本轮更严格的发行验收。

## 当前核心门证据

| 门 | `083d7b8` 实际结果 | 原始证据 |
| --- | --- | --- |
| M1′ 主体 | 243/243 passed；failed/skipped/timeout/process_limit/exception/stall/not_run 均 0；耗时合计 614081 ms，单文件峰值 RSS 866082816 bytes | `reports/evidence/m1prime-logger-info-083d7b8-20261003.jsonl`，SHA-256 `26DD5A8BAD67FC53F397873CF2E6545B2A5C990D6B5A790BAF7930081498E726` |
| #25 / #246 | 两项 functional/parity 均 passed；#25 502562 周期、136435 ms、RSS 849711104；#246 51564 周期、9279 ms、RSS 444280832 | 同前缀 `extra25` / `extra246` JSONL；SHA-256 分别 `8CB415247C23614B7F7BD44BF7ED32C9B01E0D143FA7F284039750080CAC689B`、`65A246A8E4ABE691CF4A30B4F0772E82B3962EA938F6FA0BE1FE168894A03C42` |
| #245 降周期 | 2048 探针 2706 ms，估算 65536 约 86.6 秒；65536 夹具 passed、实际 67510 周期、35125 ms、RSS 596668416 | `m1prime-logger-info-083d7b8-long-65536-20261003.jsonl`，SHA-256 `138979C6427847A43241CC47B8F8E41C830163C6CB84406DC2F3286DAF5163A5`；冻结 Java 基线 SHA-256 `048C804D91986FBD597593C4CAE174D37DF09AA91D38560C433057945DF2F84E` |
| strict markerless | simple/redundant 各 131072 周期、128 窗口，对各自冻结 Java 摘要 `equal=true` | `reports/evidence/markerless-logger-info-083d7b8-*-20261003.jsonl` 与对应 compare JSON；详见 [运行时探查](probes/20261001-runtime-java-shape-cleanup.md) |
| 完整 M2 | 固定提交 TS-only 512 passed / 2 skipped / 0 failed；含 Java 514/514 passed | `reports/evidence/logger-info-083d7b8-committed-{ts,java}-m2-20261003.tap`，SHA-256 `0B3DA2B52102B6C430780C062F6A1B435BD08AD12DA68A71A0F1EAFC49DED820` / `C99B1F440603725E667F2A4693215786136862F8482A3C48D6D4B66B6FD12D9D` |

原始 2,000,000 周期长期稳定性仍为 **not_run**。降周期夹具不是原版长测，也不能宣称 Java 性能等价。

## Demo 实际状态

相邻 Demo 仓库的具身输入批次与静态 Worker 已提交；当前监测代码生产提交 `8a147f4`。固定 Chrome smoke 显示普通 10 个 Demo 在 babble 0 时均能发出 `source=NARS` 操作；Microworld 的 seed19 示例知识也会发出 `^Forward`，经典空白模式规则数为 0；首页 Worker 数 0、页面错误 0。预置因果规则有界面披露，不等于从零学习。Demo 的 TypeScript/Astro、35 项单测和静态构建检查通过。

同 Chrome 154、30 秒：Microworld 示例模式目标 20 TPS、10 周期、babble 0，平均 `15.875 TPS`、末窗 `11.776`，NARS 4 次；经典空白模式同 seed 约 `19.627/19.766 TPS`（平均/末窗），却没有 NARS 操作，不能用它替示例模式过门。CartPole 默认目标 5 TPS 时平均 `4.923`、末窗 `5.195`；20 TPS 压测平均 `9.947`、末窗 `7.588`。扩展 Demo 采用“前 5 刻完整输入、随后变化即报并每 5 刻刷新，反馈不丢”的**行为适配**，五项平均 TPS 对比旧输入改善 45.9%–215.2%，但 TicTacToe、TestChamber、FighterPlane、Echo Relay 的后段仍不足。完整矩阵、原始 JSON 哈希与行为限制见 Demo 仓库 `docs/probes/20261003-embodied-operation-adaptation.md`。

`RuntimeTelemetryView` 已改为约一秒墙钟窗口统计完成的 NARS 周期，空闲归零；浏览器暂停回归通过。单次活跃推理速度不得写成持续 RPS。

## 尚未完成与下一步

1. BandRobot 虽发出操作，但固定 150 刻仍未完成抓取—搬运—交付；无效左移循环的负反馈候选已撤销。需以世界状态/成功交付验收，而非操作次数。
2. 已证实 Microworld 474 刻有 596718 次 Bag 同类回退、29202388 次扫描；两版改名安全名称索引只有约 3%–5% 的 Microworld 总收益，并使 TestChamber RSS 多约 44–71 MB。其后的几何对象快路两版也没有端到端收益（Microworld 基线/候选总耗时 `9447/9533/9511 ms`），RSS 增加，**均已撤销**。用户要求在反复低收益时停止，因此本轮不再启动新性能候选。Microworld 示例模式持续 20 TPS 未达标；Bag 插入/分配、概念增长和 GC 长尾仍有未穷尽的热点，不能称严格性能收敛。原始数据、源码 patch 和 SHA 见 [Bag 探查](probes/20261002-bag-term-equality.md)。
3. 任何新核心生产修改重新跑直接合同、完整 M2、M1′、markerless；Demo 改动跑静态构建与真实浏览器。最后核对 Node/API、依赖/平台、编码、许可及公开资产，更新中英双语文档、Pages，分内容推送并创建 GitHub fix release（不发布 npm）。仓库可见性变更仍须单独人工检查。
