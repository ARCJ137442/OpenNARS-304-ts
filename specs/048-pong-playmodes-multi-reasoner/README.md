---
status: complete
created: 2026-10-03
priority: high
tags:
- demo pong multi-reasoner
created_at: 2026-10-03T06:09:25.546653300Z
updated_at: 2026-10-04T08:43:50.388890800Z
completed_at: 2026-10-04T08:43:50.388890800Z
transitions:
- status: in-progress
  at: 2026-10-03T06:09:25.649363800Z
- status: complete
  at: 2026-10-04T08:43:50.388890800Z
---

# Pong play modes and multi-reasoner lab

## 目的与来源

在同一个 Pong Demo 中比较 OpenNARS Java Lab 的经典 Pong 与用户 NARust-o `examples/_games/pong.rs`（本地提交 `cd685cd`，Cargo `MIT OR Apache-2.0`）的离散网格玩法。NARust-o 的 Narsese 原为 ONA 适配，不能原样复制；所有模式须按 OpenNARS 3.0.4 的复合目标/操作条件重写并在真实 Worker 中验证。用户要求全体 Demo 的**目标 TPS**至少 20，实际 TPS 必须另测。

## 玩法对照与统一世界

| NARust-o 函数 | 应表达的差异 | NARS 数 |
| --- | --- | ---: |
| `pong_test` | 左右感知 + 左右挡板操作 | 1 |
| `pong_test2` | 左/中/右感知 + 停止操作 | 1 |
| `pong_test2x` | 左右分别由推理器控制同一挡板 | 2 |
| `pong_test_gan` | 挡板与球分别由推理器控制 | 2 |
| `pong_test2_arguments` | 操作带参数 | 1 |
| `pong_test_2p` | 上下双挡板对战 | 2 |
| `pong_test_2p_one` | 双挡板场景中的单推理器控制 | 1 |
| `pong_test_2p_one_no_diff` | 双挡板且不做差分感知 | 1 |
| `pong_test2_diff` / `pong_test_diff` | 差分感知变体 | 1 |
| `pong_test_2p_diff` | 双玩家原感知与差分感知对照 | 2 |

模式可以由同一纯 TypeScript 离散网格世界与参数表驱动，不能为每个函数复制整套页面。原 OpenNARS Pong 保留为对照模式；模式选择器可按控制者数量/感知/操作集渐进披露。多 NARS 模式为每个推理器分配独立 Worker、时间/RPS/概念袋/操作来源及重置控制，清晰显示合成世界 TPS；未完成多 NARS 前不得把两个操作线程模拟成两个推理器。

## 计划与验收

- [x] 审计各源函数的球/挡板更新、感知、反馈、操作集和推理器数量，形成最小模式参数表与差异测试；标注哪些实验名虽不同但世界规则相同。
- [x] 实现离散格 Pong（球、上/下挡板、命中/漏接、操作速度），单模式切换不离开页面；经典连续画面仍可作为比较选项。每个模式展示真实输入与 NARS 操作，来源/授权可追溯。
- [x] 将多 NARS Worker 调度、角色颜色、每实例 HUD、记忆与重置边界做成通用能力；单实例 Demo 沿用同一模型，不为未来多实例硬加空位。
- [x] 所有 Demo（包括 Pong 与现有游戏）默认/最小**配置目标**至少 20 TPS，控制范围与提示相符；固定 Chrome 记录每个模式实际/目标、RPS 与内存，不能把设定值写成实测。
- [x] 直接合同验证模式差异、双控制者冲突规则、角色隔离、Pong 操作/反馈与 OpenNARS 可解析 Narsese；真实浏览器逐模式确认可运行和操作来源。多推理器未通过即标实验，不公开空壳选项。

## 验收证据（2026-10-04）

- Demo 纯模型合同：Pong 模式注册、差分感知、双控制器冲突、命中/漏接反馈、挡板边界均通过；`npm run typecheck` 通过。
- 静态构建与产物检查：`npm run build`、`node scripts/check-build.mjs` 通过，生成 `pong.html`。
- 部署前缀真实浏览器 smoke：9/9 Pong 模式通过；每个模式的 Worker 数量与角色表匹配；同步/异步均推进世界刻；Canvas 有非空像素；每个模式观察到 `source=NARS` 非 babble 操作；页面错误 0。
- 同一 smoke 还复验 10 个既有 Demo、Grid 三拓扑、NARS×2048、Microworld；既有入口均观察到非 babble 操作。
- `^Idle` 是 OpenNARS 3.0.4 对“停止”语义的内部操作符适配：页面与世界层归一化为 `stop`，避免非法 `^stop` Narsese。

本规格依赖 024 平台边界与 044 统一 Lab，和 045 经验视图共用多实例诊断。LeanSpec 当前无 `link` 子命令，依赖正文记录。
