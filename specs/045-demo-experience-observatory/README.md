---
status: in-progress
created: 2026-10-03
priority: high
tags:
- demo experience visualization
created_at: 2026-10-03T05:52:12.901747300Z
updated_at: 2026-10-03T05:52:13.020308800Z
transitions:
- status: in-progress
  at: 2026-10-03T05:52:13.020308800Z
---

# Demo experience observatory

## 问题

现在的 Demo 能看到世界感知、目标、执行和速率，但用户难以判断 NARS 是否由经验形成了内部知识，也看不到预期与确认/失望如何随行为改变。仅显示 Worker 送入的先验规则或网页日志，会把“实验者输入”误当“NARS 学到的经验”。Microworld HUD 的可变长状态文案还会挤动相邻指标。

## 本阶段实现

- [ ] 在 Worker 侧只读取真实 NARS 事件与状态：预期、确认、失望、操作、派生任务或信念加入。明确区分实验者注入、NARS 内部产生、babble 和尚未观察到；不从 UI 文案猜测学习。
- [ ] 用有界事件缓冲和按需快照呈现内部经验；关闭视图时不做逐刻全量概念扫描。披露观察窗口、采样上限与 NARS 时间，限制对 TPS 的额外影响。
- [ ] 普通 Demo、Microworld 与终端的同一“经验观察”模式使用可复用的语义层，默认折叠。时间关系、证据强度和操作后果优先图形化；原始 Narsese 保留可展开溯源。
- [ ] 终端/游戏操作与奖励动效表达真实事件类别；减少动效模式保留颜色、形状和文字等价信息。
- [ ] Microworld HUD 状态、延迟、FPS/TPS/RPS 使用独立固定槽位；不同状态文案不改变相邻指标的坐标。

本规格建立在 024 的平台中立 Worker 装配、044 的统一 Web Lab 页面，以及当前 Demo 具身合同之上；它影响 042 发布门。当前 LeanSpec CLI 没有 `link`，依赖暂写在正文，不伪称 frontmatter 已链接。

## Test 与诚实声明

- [ ] 直接测试证明事件分类源于 NARS 原始事件，预置规则和 babble 不计为“自主学习”；缓冲上限生效，关闭面板时无全量概念遍历。
- [ ] 固定输入的普通 Demo、Microworld、终端真实 Chrome 运行，看到至少一个可溯源的内部事件；没有事件时显示“尚未观察到”，不得生成示例数据冒充。
- [ ] 在同步/异步及窄屏状态切换时，HUD 其他槽位的几何位置不被状态文本挤动；降低动效后语义仍可辨。
- [ ] Demo `npm run check`、真实浏览器 smoke 与受影响的核心语义门保持通过；若可观察数据引入显著 TPS 回退，应改为按需订阅或撤销。
