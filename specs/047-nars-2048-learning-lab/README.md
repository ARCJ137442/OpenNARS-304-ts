---
status: complete
created: 2026-10-03
priority: high
tags:
- demo game learning
created_at: 2026-10-03T06:01:46.053685800Z
updated_at: 2026-10-04T06:13:23.638899Z
completed_at: 2026-10-04T06:13:23.638899Z
transitions:
- status: in-progress
  at: 2026-10-03T06:01:46.157553Z
- status: complete
  at: 2026-10-04T06:13:23.638899Z
---

# NARS 2048 learning lab

## 目的与来源

将用户自己的 [jev-2048](https://github.com/ARCJ137442/jev-2048)（本地提交 `9582bcf`，MIT）作为规则、纯引擎、棋盘动效与可观测实验台的参考，在 OpenNARS 3.0.4 TS 静态 Demo Lab 中实现另一个独立的「NARS × 2048」Demo。复制/改写的源文件应保留 MIT 许可与具体来源；Jev 的远端 API、密钥、概率/成本语义**不照搬**。本项目改问：NARS 在连续多局中是否从真实操作—结果经验形成能改变决策的知识？

## 核心合同

- [x] 用纯 TypeScript 游戏引擎实现四方向压实、每回合至多合并一次、合法方向、得分、新块生成、游戏终局；不修改试算输入。保留参考项目有实验价值的棋盘尺寸/生成分布/步进控制与可复现 seed，适配统一 Lab 的配色、布局、键盘和动效。
- [x] 浏览器 Worker 的 `^up/^down/^left/^right` 是唯一自动行动接口；感知包含局面可操作特征，目标至少为复合词项，反馈包含合并/得分与无效移动结果。预置规则、NARS 自主操作、babble、人工操作和非法方向明确分色/分源，不用启发式动作伪装 NARS。
- [x] 终局自动开新局并累计局数、得分与最高块；默认复用同一个 NARS Worker/记忆，另设明确的“重置 NARS 记忆”动作。棋盘重置、页面刷新、Worker 重建语义分开。
- [x] 页面展示 Canvas 棋盘、合并/新块/终局/方向粒子动效、操作来源、FPS/TPS/RPS、局数与按需内部经验视图；`prefers-reduced-motion` 保留状态可读性。
- [x] 提供匿名 JSON 实验记录导出与 Jev MIT attribution；记录不含密钥或外部服务数据。对“学到了多少”只做由真实事件和对照支持的声明。

## 验收

- [x] 参考 `jev-2048` 引擎行为的直接合同及不修改试算输入测试通过；无私密 Jev API 或密钥依赖进入静态产物。
- [x] 真实浏览器固定页面证明棋盘重开只替换棋盘；记忆重置才重启 Worker。NAR 时间在短窗口持续增长。
- [x] 固定设置下保留记忆/重置记忆的控制路径和成绩/局数/来源记录可用；未观察到稳定非 babble 策略时准确保留 `IDLE`，不宣称提升。
- [x] Demo 类型/构建/50 项单测/浏览器门通过，首页不为 2048 启动 NARS Worker，Pages 子路径与 Jev MIT attribution 已接线。

## 验收记录

Demo 侧提交包含 `src/games/nars2048.ts`、Canvas `src/nars2048-renderer.ts`、页面和 `COPYING-JEV-2048-MIT.txt`。`npm run check` 与 `npm run test:browser` 已通过；经验观察和操作来源边界沿用 045 合同。该规格完成不代表已证明 NARS 跨局学习收益，收益结论仍需后续固定 seed 对照实验。

本规格依赖 024 平台边界、044 统一 Lab、045 内部经验观察；与 046 网格 Microworld 是并列的新 Demo。LeanSpec `link` 子命令当前不可用，依赖以正文为准。
