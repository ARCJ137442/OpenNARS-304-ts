---
status: complete
created: 2026-10-03
priority: high
tags:
- web lab design
created_at: 2026-10-03T05:22:08.716018300Z
updated_at: 2026-10-03T06:21:41.496279500Z
completed_at: 2026-10-03T06:21:41.496279500Z
transitions:
- status: in-progress
  at: 2026-10-03T05:22:19.054330900Z
- status: complete
  at: 2026-10-03T06:21:41.496279500Z
---

# Web Lab terminal and one-image design

## 为什么现在做

静态 Lab 的无尾斜杠入口把相对图片与终端链接解析到网站根目录，导致首页 Microworld 预览缺少虫子和食物、导航进入 404。现有终端实际上有 Worker、Narsese 输入、周期、音量和 XML 配置能力，但由独立 HTML/JS 复制到发布目录，视觉、路由和维护方式与 Astro Lab 分离。用户要求以 OpenNARS 3.0.4 Java Lab 的 Launcher 为功能索引，逐步用前端技术复刻，并将「一图胜千言」作为发布前设计规范。

## 本阶段范围与边界

- [x] 无尾斜杠与标准入口都能加载五项预览素材、正确导航到终端；首页仍不启动 NARS Worker。
- [x] 将现有终端接入 Lab 的统一导航与视觉语言；保留 Narsese 输入、命令历史、周期推进、输出音量、停止/重置与配置能力，实测 Worker 可运行。源码已进入 Astro 构建，旧独立 HTML/JS 复制链移除；交互模块暂仍为 JavaScript，后续可独立 TypeScript 化。
- [x] 对照 Java `Launcher.java` 记录入口对应关系：Main GUI→浏览器终端，Pong/Micro World/Test Chamber→现有演示；Language Lab、Perception、Prediction、Vision 等未实现的功能只列路线，不做假链接或空壳入口。
- [x] 将用户「一图胜千言」原则落盘为设计源，审阅首页、终端和代表 Demo 的信息密度、颜色语义、图形/动效、渐进披露、移动与键盘可用性。
- [x] 静态构建与真实浏览器同时检查无尾斜杠入口、图片像素、终端链接和 Worker；性能门仍遵守 spec 042 的主动停止与未达标披露，不因界面工作重启核心吞吐试探。

本规格依赖已完成的 024 平台中立核心边界，亦影响 042 的新发行门。当前 LeanSpec CLI 的 `link` 子命令不可用，无法写入依赖 frontmatter；仅在正文记录真实关系，不伪称已链接。

## Test

- [x] `npm run check` 的 TypeScript/Astro、单测、构建和产物门通过。
- [x] Chrome 从 `/opennars-304-ts-lab` 与带尾斜杠路径打开首页，五个 sprite 返回 200 且预览含食物像素；两路径都能进入可运行的终端。
- [x] 终端输入判断、复合目标与周期命令后收到推理输出；停止/重置会终止旧 Worker 并启动新会话。
- [x] 首页零 NARS Worker；键盘操作、390px 视口、减少动效设置可用；构建产物静态扫描未见本机路径。

## 本轮证据与后续边界

Demo 代码/直接测试提交 `aa06eb6`，需求与来源文件提交 `64ba889`。同一工作树 `npm run check` 通过：TypeScript/Astro、36 项单测、三页 Astro 静态构建与产物检查；原始 `test-results/demo-check-batch-20261003.log` SHA-256 `1AAF1DF1CF849C2F595EACEB694FBC9A17CBFE7B43607DA2E48C65BD8A3B2A2D`。Chrome smoke 通过：无尾斜杠五张素材与食物像素、终端判断/目标/12 周期/重置、窄屏键盘输入、十个普通 Demo 和 Microworld 操作、首页零 Worker/零页面错误；原始 `test-results/browser-smoke-target20-20261003.log` SHA-256 `F61B9B86C206FE1BC6EF6EB970077CEBA6977996076A9C286C2A3712F40BF2C1`。静态 `dist` 中未命中测试使用的本机路径模式。

044 只验收入口、终端整合与设计底座；045 的内部经验、046 网格、047 2048、048 Pong 多模式与 049 Shot 全移植仍未完成。所有 Demo 的**目标**已调至至少 20 TPS，但持续**实际** TPS 尚未因此达标。Pages 与 v1.0.5 Release 仍未发布，属于 042 最终门。
