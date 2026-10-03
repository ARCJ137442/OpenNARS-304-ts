# 2026-10-03 中期交接：性能收口与下一阶段 Demo

本文件给无对话上下文的 Agent。先读 [当前目标](active-goal-20261002.md)、[当前状态](current-status.md)、[开发指南](developer-guide.md)与仓库 `AGENTS.md`；Demo 项目从 `docs/probes/20261003-demo-batch-requirements.md` 接续。**这次是中期存盘，不是 `/goal` 完成或 v1.0.5 发布。**

```text
OpenNARS 3.0.4 TS 生产核心
    ├─ 原生化 / 去 jree / 平台边界       [已验收]
    ├─ M1′ / M2 / markerless 受保护源码 [已验收]
    └─ 性能候选试探                   [用户要求停止，非严格收敛]
              │
              ▼
Web Demo Lab
    ├─ 044 Astro 终端/首页素材/HUD      [已验收]
    ├─ 045 内部经验                     [未实现]
    ├─ 046 Grid Microworld             [主线未实现；WIP 分支有纯模型]
    ├─ 047 NARS × 2048                 [未实现]
    ├─ 048 Pong 多玩法/多 NARS         [未实现]
    └─ 049 Shot 多玩家全规则           [未实现]
        正式 TypeScript Logo           [人类批示已记录，未制作]
              │
              ▼
最终 Demo / 核心门 → Pages → GitHub fix release → public 评估 [均待后续]
```

## 当前 Git 与现场

- Core `main` 的生产源码仍与受保护 `083d7b8` 同树：`git rev-parse 083d7b8:src` 与中期文档后继的 `HEAD:src` 均为 `a36ce31778f25e74340fe4406847bacd7bb3c949`。本文件提交后需再确认。Core 当前包 `package.json` 为 `1.0.5`，**尚未发布**。
- Demo `main` 的受测源码检查点 `7612d9b` 已推送终端/首页/语义 FX/Microworld 左右修正/固定 HUD/20 TPS **目标配置**；后续文档/构建提交不改变这些行为，最终 Worker 来源以 Demo `public/build-meta.json` 为准。GitHub Pages 仍是 v1.0.4 的旧站点，勿把本地预览当公网新版。
- Demo 试验分支 `codex/gridworld-foundation-wip` 提交 `c9b237b` 已推送；包含方/三角/六角环面纯模型、未验收 Canvas 渲染器、9/9 直接合同与仅供参考的 `.astro` 页面草稿。主线不含不完整路由，可正常构建。下一 Agent 如需恢复该基础，先读该分支 `docs/probes/gridworld-wip-handoff.md`，再独立核对几何与感知。
- Core 主线保留大量历史未跟踪 `reports/evidence/` 与旧探查文件；这是用户要求保留的原始证据，**不得删除，也不得 `git add -A`**。中期工作期间仅保留用户正在访问的 Astro preview 与 CodeGraph 服务，没有第二份 M1/M2/浏览器长测进程。

## 性能结论与边界

接受的优化依次包括 Bag 恢复态读取减包装、Term 具体类快速判等、全 Term Bag 具体类索引与标准词项名称预筛（生产提交 `17b5fb2`、`41070c1`、`82469cc`、`708afc5`）。短负载有明显提升，但不能推广到所有 NAL 或持续 Demo。之后重复 NativeMap 首查删除、改名安全名称索引 v1/v2、几何对象快路 v1/v2 均缺少可接受的端到端收益或增加内存，源码已撤销；原始 patch/JSON、RSS 和跨负载反证见 [Bag 探查](probes/20261002-bag-term-equality.md)。用户明确要求多次无明显优化即停止，所以**本阶段主动停止**，未证明“再无有效优化空间”。

Microworld seed19 示例知识、babble0、同步目标20TPS的 Chrome 30秒实测平均 `15.875 TPS`、末窗 `11.776 TPS`，NARS 操作4次；经典空白模式接近20TPS但没有 NARS 操作，不能替代。CartPole 20TPS 压测平均 `9.947`、末窗 `7.588 TPS`；部分扩展 Demo 后段更低。普通 Demo 的**配置目标**已从5提高到最小20、最大60，Chrome 功能 smoke 通过，但没有据此证明实际20。Bag 插入/分配、概念增长与 GC 长尾仍是后续可查热点；后续功能 Agent 不要重启本轮无根据的性能微调。

## 受保护核心门与已完成 UI 门

- 核心 `083d7b8`：M1′ 主体 `243/243 passed`；#25、#246 与 #245 的 65536 周期降载夹具通过；两项 131072 周期 strict markerless 对冻结 Java 摘要逐窗口相等。TS-only M2 为 `512 passed / 2 skipped / 0 failed`，含 Java M2 为 `514/514 passed`。v1.0.5 发行准备时重新运行的 TS-only M2 同为 `512/2/0`，原始 `reports/evidence/v1.0.5-ts-only-m2-20261003.tap` SHA-256 `BC3C456C64BB29D61AB851BE263850287541B01E0F3149A1642AEC4362D3D060`。其他门沿用**同源码树**旧提交证据，不能表述为新 HEAD 现跑。原始 2,000,000 周期长期稳定性为 `not_run`。
- Core `npm run test:release` 在 `1.0.5` 包配置上通过：CLI、Shell、ESM API、外部 TypeScript 消费者与包内容检查；测试生成的 tarball SHA-256 `65bcf959bc196dc00d5c69077ae8c85729561fb2662759761bd1d564a575f3a7`。该 tarball 不是 GitHub 新 release。`audit:jree` 为 `0/0`，平台扫描核心候选/混合边界均 0。
- Demo `aa06eb6` / `64ba889` / `7612d9b`：044 终端成为 Astro 路由与目录卡，无尾斜杠入口的五张 sprite 均加载且食物像素可见，首页零 NARS Worker；终端 Worker 输入判断、复合目标、推进周期和重置，窄屏键盘/减少动效已测。Microworld 左逆时针/右顺时针的直接合同通过；HUD 长状态文案的浏览器几何回归证明延迟及 FPS/TPS/RPS 坐标不变。`npm run check` 的 TypeScript/Astro、36 单测、构建、产物通过；Chrome smoke 的十个普通 Demo、Microworld、终端均通过，页面错误 0。原始 Demo `test-results/demo-check-batch-20261003.log` SHA-256 `1AAF1DF1CF849C2F595EACEB694FBC9A17CBFE7B43607DA2E48C65BD8A3B2A2D`；`browser-smoke-target20-20261003.log` SHA-256 `F61B9B86C206FE1BC6EF6EB970077CEBA6977996076A9C286C2A3712F40BF2C1`。这些是本地功能门，不是新功能 045–049 或 Pages 发布证据。

## 下一 Agent 的可证伪顺序

发布整理补充：`v1.0.4` 误附的 0.1.0、1.0.0–1.0.3 五个包已在本地/远端 SHA-256 核对后从该 Release 移除，本地文件保留；远端仅剩 1.0.4 包与 manifest。前后清单与哈希见当前状态，下一位 Agent 不必重复此清理。

1. `git status --short --branch` 核对两个主线和 Grid WIP 分支；读 specs 045–049 及 Demo 六份 `20261003-*` 探查文件。LeanSpec `search` 遇中文可能 UTF-8 panic，`link` 子命令不可用；不要伪造 board/依赖结果。
2. 先实现共享的多 Worker/角色诊断和按需内部经验事件观察，区分预置、babble、NARS 派生；此能力供 Pong 与 Shot 共用。避免每世界刻全量扫概念袋。
3. Grid 是**另一个 Demo**，内部切换方/三角/六角格及网格数；NARS × 2048 独立入口，游戏终局自动重开但默认保留同一 Worker/记忆。Pong 在一页对照多玩法；Shot 从当前简化版升级为 NARust-o 六入口的多玩家/进化规则。各项须真实 Worker 操作与规则测试，不以漂亮画面充当学习。
   正式 Logo 也属于下一阶段：Demo 需求总账的 2026-10-03 14:47:53 人类批示提供两份既有 OpenNARS SVG，要求以同尺寸青色 TS 方块替换 Julia/Rust 标记。文件已确认存在；当前未制作，实施前先查来源/许可，再用于官网与 Lab。
4. 每项完成后做直接合同、Demo `npm run check`、真实 Chrome；目标 TPS 最低20与实际速率分开记录。功能全部通过后，在最终源码/产物身份上核对 M1′、完整 M2、Node/API、markerless、许可与浏览器门，再更新 Pages、创建仅含当前包/manifest 的新 GitHub Release。仓库 public 可见性需所有者单独检查；不发布 npm。

操作入口：Demo 静态构建 `npm run check`；先运行 `npm run preview`，再以 `DEMO_BASE_URL=http://127.0.0.1:4321/opennars-304-ts-lab/` 执行 `npm run test:browser`。切勿把无尾斜杠入口误当根站 `/` 测；该错误曾导致 404，现已加入回归。Chrome smoke 是功能测试，不证明持续 TPS。
