# OpenNARS-304-ts 当前状态

日期：2026-10-04（Asia/Shanghai）。本文是当前交接入口；目标与退出条件见 [active-goal-20261002.md](active-goal-20261002.md)，历史过程见 [archive/current-status-history-20261002.md](archive/current-status-history-20261002.md)。历史未跟踪原始证据保留，不视为可随意清理的临时文件。

## 当前定位

2026-10-03 用户要求中期收口性能试探，功能性新需求交下一个 Agent。044 终端/首页路径与「一图胜千言」底座已由 Demo `aa06eb6`、`64ba889`、`7612d9b` 和本地构建/Chrome 证据验收；045 内部经验、046 Grid Microworld、047 NARS × 2048、048 Pong 多模式已完成，049 Shot 完整多玩家移植仍 `in-progress`。Demo 主线保持可构建；v1.0.5 仅是未发布的包版本准备，Pages/Release 仍为 v1.0.4。新需求总账见 [当前目标](active-goal-20261002.md)、[本次中期交接](midterm-handoff-20261003.md)和相邻 Demo `docs/probes/20261003-demo-batch-requirements.md`。普通 Demo 的配置目标已改为至少 20 TPS，**实际持续速率未因此达标**。核心生产 `src` 树与受保护 `083d7b8` 的 Git 树哈希同为 `a36ce31778f25e74340fe4406847bacd7bb3c949`；v1.0.5 TS-only M2 复跑 `512 passed / 2 skipped / 0 failed`，含 Java M2 与 M1′仍沿用源树相同的既有证据，不能写成新 HEAD 现跑。

```text
v1.0.4 已发布
    │
    ├─ 原生化与平台中立旧 spec：按当时口径 complete
    ├─ 核心生产 083d7b8：M1′/M2/markerless 已保护
    └─ Demo 主线 7612d9b：044 终端/首页/Microworld HUD 已验收
         │
         ├─ 10 个普通 Demo + Microworld 示例：能发出 NARS 操作
         ├─ 045–049 功能：交下一位 Agent（Grid WIP 另存分支）
         └─ 持续性能 / 有效任务闭环：仍有未达标项
              ↓
        性能试探中期收口 → 后续功能 / 最终发行门 → Pages / fix release
```

核心 `083d7b8` 将 INFO 日志从 `console.error` 改为 `console.info`，严重错误与异常堆栈仍走错误通道。源码、发布依赖没有 npm `jree`；最新静态审计 `audit:jree` 为直接导入 `0/0`、平台审计 `coreCandidateFiles=0`、`mixedBoundaryFiles=0`。非增量 typecheck、build、dist API 通过。LeanSpec 042 为 `in-progress`；历史 023/024/025/027/031/036 的 complete 不代替本轮更严格的发行验收。

## 2026-10-04 增量事实

Demo 仓库 `1aa332c` 已完成并推送 045 经验观察：普通 Demo、经典 Microworld、Astro 终端共享真实 NARS 事件时间线；38 项 Demo 检查与真实浏览器 smoke 通过。事件来源明确区分 `nars`、`prior`、`input`、`babble`，仅推理阶段事件标记为自主；观察窗口有界，默认折叠，不扫描概念内容。045 LeanSpec 已由 `in-progress` 更新为 `complete`。因此后续未完成 Demo 功能范围为 046–049，Pages、v1.0.5 和最终发行门仍未完成。

Demo 后续提交已完成 046 Grid Microworld：`gridworld.html` 支持正方形/正三角形/正六边形环面切换，复用真实 Microworld Worker、六路感知、经验观察和 FPS/TPS/RPS；纯模型 9 项合同、Demo 47 项测试和逐拓扑 Chrome smoke 通过。046 LeanSpec 已更新为 `complete`。Grid 是独立离散环境，不替代经典连续 Microworld 的持续 TPS 证据。

047 NARS×2048 已完成 Demo 实现：纯 TS 合并引擎、Canvas 动效、键盘/触摸、棋盘重开与 NARS 记忆重置语义、经验观察、FPS/TPS/RPS 和匿名导出已接线；50 项 Demo 测试与浏览器 smoke 通过。Jev 本地规则仅作 MIT 参考，不引入其 API/密钥；跨局学习收益仍未被证明，不作性能或学习提升声明。

048 Pong 已完成并推送：Demo `a52e544` 新增单页 9 种玩法、离散球场、独立多 Worker、同步/异步节奏、角色状态、经验观察和真实操作记录；纯模型合同、`typecheck`、构建、产物检查及部署前缀浏览器 smoke 通过。9/9 模式均观察到非 babble `source=NARS` 操作，页面错误 0。OpenNARS 3.0.4 不接受 `^stop` 操作词项，Pong 以可解析的 `^Idle` 作为内部操作符并在世界层归一化为 `stop`。048 规格和证据已在 Core `952ddcb` 完成；Demo 2048 几何/粒子修复另见提交 `72b14f2`。

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

相邻 Demo 仓库受测源码检查点 `7612d9b`：固定 Chrome smoke 显示普通 10 个 Demo 在 babble 0 时均能发出 `source=NARS` 操作；Microworld 的 seed19 示例知识可发出 `^Forward`，经典空白模式规则数为 0；无尾斜杠首页五张素材可见、首页 Worker 数 0、页面错误 0。终端已迁入 Astro 并加入同一目录，判断/目标/周期/重置在桌面与窄屏实测可用。Microworld 左/右身体语义修正及 HUD 固定槽位有直接/Chrome 回归。Demo 的 TypeScript/Astro、36 项单测和静态构建检查通过。预置因果规则有界面披露，不等于从零学习。

同 Chrome 154 的**历史固定配置**30 秒：Microworld 示例模式目标 20 TPS、10 周期、babble 0，平均 `15.875 TPS`、末窗 `11.776`，NARS 4 次；经典空白模式同 seed 约 `19.627/19.766 TPS`，却没有 NARS 操作，不能替示例模式过门。CartPole 旧默认目标 5 TPS 时平均 `4.923`、末窗 `5.195`；20 TPS 压测平均 `9.947`、末窗 `7.588`。普通 Demo 现在目标最小20，但**尚无新配置下的持续30秒全矩阵**。扩展 Demo 的输入节奏变化是行为适配，不算核心同语义提速；TicTacToe、TestChamber、FighterPlane、Echo Relay 的历史后段仍不足。完整矩阵见相邻 Demo `docs/probes/20261003-embodied-operation-adaptation.md`。

`RuntimeTelemetryView` 已改为约一秒墙钟窗口统计完成的 NARS 周期，空闲归零；浏览器暂停回归通过。单次活跃推理速度不得写成持续 RPS。

## 尚未完成与下一步

2026-10-03 下载包审计发现并修复一个发布遗漏：`files: src` 将本地历史 `src/language/Term.ts.codex-corrupt` 收入包。现改为 `src/**/*.ts`，本地文件保留；内部发行检查清单也不再随包提供。文档索引精简为用户入口，未随包提供的维护资料改用源码仓库链接；发行检查器新增源文件/临时文件/内部文档排除及本地 Markdown 链接完整性断言。增强的 `npm run test:release` 通过外部 TypeScript、API、CLI、Shell，包成员为325；指定本机路径模式扫描0命中，不等于已完成全面机密审计。最终日志 `reports/evidence/release-package-content-fix-passed-20261003.log` SHA-256 `40EEC9FE577D12731A7B66C20F0BDD1EFE14255728B53E2E08B83D56EB5F668D`；包清单 `pack-content-after-fix-20261003.json` SHA-256 `57BC57EB2F3DE7F1EAD3DEB2BBF15F053A6C337C0AE88D436045F9B5F1DBE772`。首轮增强检查因已有缺失文档链接失败，修正后通过；推理源码未改，不重复 M1′。

2026-10-04 正式 TypeScript Logo 已加入 Core brand/、中英 README、发行包白名单；以用户提供 Julia SVG 为底稿，仅替换 Julia 三圆组，保留原天平矢量主体。Demo 从 Core brand 单源复制，favicon、首页和 Astro 终端引用；Core release test、Demo npm run check 与 Chrome smoke 通过。Core commit ed71f77、Demo commit f5a1f58；最终 Demo 构建绑定 Core 735c44e，Logo SHA-256 `13703EC71A49D5BF7D7A7D79B3E21AB349CA281B6C13699451BA72F1C6739142`，构建日志 `logo-final-check-ed71f77-20261004.log` SHA `6099C29FA0CA93F50C43F59FB77BEE026144FBBB8A3E304AD2C8C5072307AA33`，Chrome smoke `logo-final-browser-ed71f77-20261004.log` SHA `F61B9B86C206FE1BC6EF6EB970077CEBA6977996076A9C286C2A3712F40BF2C1`。Logo 源码已推送，Demo 改动已提交；Pages 仍未更新。

2026-10-03 发布资产整理已完成：GitHub `v1.0.4` Release 的五个误附旧版 `.tgz`（0.1.0、1.0.0–1.0.3）经本地/远端 SHA-256 一致性核对后移除，本地历史包保留。远端现仅有 `opennars-304-ts-1.0.4.tgz` 与 `release-manifest.json`。前后清单在 `reports/evidence/release-v1.0.4-assets-{before,after}-cleanup-20261003.json`，SHA-256 分别 `4C44ADEDDA4B9208929872A83CC502883551F16E3D14EE905174BCAC175443D1`、`EE0DFB8B13FDFB49B49BA76810E221C0D33B349B8872714412F7DCC0FB1EA83E`。这不表示创建了 v1.0.5 Release。正式 TypeScript Logo 的人类批示已补入当前目标，仍属于后续功能交接。

1. BandRobot 虽发出操作，但固定 150 刻仍未完成抓取—搬运—交付；无效左移循环的负反馈候选已撤销。需以世界状态/成功交付验收，而非操作次数。
2. 已证实 Microworld 474 刻有 596718 次 Bag 同类回退、29202388 次扫描；两版改名安全名称索引只有约 3%–5% 的 Microworld 总收益，并使 TestChamber RSS 多约 44–71 MB。其后的几何对象快路两版也没有端到端收益（Microworld 基线/候选总耗时 `9447/9533/9511 ms`），RSS 增加，**均已撤销**。用户要求在反复低收益时停止，因此本轮不再启动新性能候选。Microworld 示例模式持续 20 TPS 未达标；Bag 插入/分配、概念增长和 GC 长尾仍有未穷尽的热点，不能称严格性能收敛。原始数据、源码 patch 和 SHA 见 [Bag 探查](probes/20261002-bag-term-equality.md)。
3. 本次仅做性能中期收口，不继续新功能；045–049 的可证伪路径见[中期交接](midterm-handoff-20261003.md)。未来任何核心生产修改需重新判断直接合同、完整 M2、M1′、markerless；Demo 新功能需静态构建与真实浏览器。最终发行仍须 Node/API、依赖/平台、编码、许可、公开资产与 Pages 现跑；GitHub fix release 未创建，也不发布 npm。仓库可见性变更仍须单独人工检查。
