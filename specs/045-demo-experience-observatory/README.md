---
status: complete
created: 2026-10-03
priority: high
tags:
- demo experience visualization
created_at: 2026-10-03T05:52:12.901747300Z
updated_at: 2026-10-04T04:36:01.464403700Z
completed_at: 2026-10-04T04:36:01.464403700Z
transitions:
- status: in-progress
  at: 2026-10-03T05:52:13.020308800Z
- status: complete
  at: 2026-10-04T04:36:01.464403700Z
---

# Demo experience observatory

## 问题

现在的 Demo 能看到世界感知、目标、执行和速率，但用户难以判断 NARS 是否由经验形成了内部知识，也看不到预期与确认/失望如何随行为改变。仅显示 Worker 送入的先验规则或网页日志，会把“实验者输入”误当“NARS 学到的经验”。Microworld HUD 的可变长状态文案还会挤动相邻指标。

## 本阶段实现

- [x] 在 Worker 侧只读取真实 NARS 事件与状态：预期、确认、失望、操作、派生任务或信念加入。明确区分实验者注入、NARS 内部产生、babble 和尚未观察到；不从 UI 文案猜测学习。
- [x] 用有界事件缓冲和按需快照呈现内部经验；关闭视图时不做逐刻全量概念扫描。披露观察窗口、采样上限与 NARS 时间，限制对 TPS 的额外影响。
- [x] 普通 Demo、Microworld 与终端的同一“经验观察”模式使用可复用的语义层，默认折叠。时间关系、证据强度和操作后果优先图形化；原始 Narsese 保留可展开溯源。
- [x] 终端/游戏操作与奖励动效表达真实事件类别；减少动效模式保留颜色、形状和文字等价信息。
- [x] Microworld HUD 状态、延迟、FPS/TPS/RPS 使用独立固定槽位；不同状态文案不改变相邻指标的坐标。

本规格建立在 024 的平台中立 Worker 装配、044 的统一 Web Lab 页面，以及当前 Demo 具身合同之上；它影响 042 发布门。当前 LeanSpec CLI 没有 `link`，依赖暂写在正文，不伪称 frontmatter 已链接。

## Test 与诚实声明

- [x] 直接测试证明事件分类源于 NARS 原始事件，预置规则和 babble 不计为“自主学习”；缓冲上限生效，关闭面板时无全量概念遍历。
- [x] 固定输入的普通 Demo、Microworld、终端真实 Chrome 运行，看到至少一个可溯源的内部事件；没有事件时显示“尚未观察到”，不得生成示例数据冒充。
- [x] 在同步/异步及窄屏状态切换时，HUD 其他槽位的几何位置不被状态文本挤动；降低动效后语义仍可辨。
- [x] Demo `npm run check`、真实浏览器 smoke 与受影响的核心语义门保持通过；经验观察使用按需快照与有界消息，不扫描概念内容。

## 验收记录

Demo 主线的经验合同位于 `src/experience/contract.ts`，Worker 适配位于 `src/experience/worker-recorder.ts`。Demo `npm run check` 在 2026-10-04 通过 38 项测试、Astro 零诊断、静态构建和产物检查；`npm run test:browser` 在终端、Microworld 与 10 个普通 Demo 上通过，页面错误为 0。事件列表只把推理阶段的 `nars` 来源标为 `autonomous=true`，预置规则、输入和 babble 保留其他来源。
