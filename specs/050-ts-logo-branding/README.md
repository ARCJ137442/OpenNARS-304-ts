---
status: complete
created: 2026-10-04
priority: medium
tags:
- branding web release
created_at: 2026-10-04T01:05:31.017942700Z
updated_at: 2026-10-04T03:08:48.358705800Z
completed_at: 2026-10-04T02:55:38.306456400Z
transitions:
- status: in-progress
  at: 2026-10-04T01:05:31.116453500Z
- status: complete
  at: 2026-10-04T02:55:38.306456400Z
---

# OpenNARS TypeScript logo branding

## 目标

以用户提供的 Julia 版 OpenNARS SVG 为底稿做最小修改：原样保留 viewBox、天平 path/rect/polygon、线宽、坐标和整体布局，保留黑色原稿；只将 Julia 专用颜色规则改为 cyan、把 `#julia` 三圆组替换为右托盘内 `72×72` 圆角青色方块与 TS 文字（Julia 原三圆组外接约 `76×70` viewBox 单位），不重绘天平。第二份 Rust 参考用于确认用户期望的语言徽标位置，不复制其插图。

## 范围

- [x] 核心仓库保存 `brand/opennars-ts-logo.svg`，双语 README 中预览，包白名单包含 `brand`。
- [x] 以 Julia 参考 SVG 为底稿，保留主体全部路径与布局，三圆组最小替换成右托盘内同范围 TS 圆角方块。
- [x] Demo 构建从核心品牌源复制 SVG 到静态资源；favicon、首页与终端使用 TS 标记；图片按 Pages 子路径生成。
- [x] `brand/README.md` 标记使用的用户参考、最小 SVG 改动范围、许可边界与核心单一源；Demo 文档说明从核心构建复制。
- [x] Core release test 与 Demo `npm run check` 通过；Chrome 已浏览首页/终端，Logo 资源在无尾斜杠 smoke 下返回 200、固有比例正确且站点页面无错误。
- [x] Core brand/ 是唯一源，Demo 在构建时复制，产物检查验证两份 SVG 字节一致。

Pages 部署属于 spec 042 的最终发行工作；本 spec 已验收品牌源码、构建资产和界面入口。Core `ed71f77`、Demo `f5a1f58` 已推送；最终公网检查与发行仍须重跑，但不阻塞本地 spec 完成。

## 边界

本 spec 只处理项目标识资源与页面引用，不实现 045–049 Demo 功能，也不改变核心推理源码。Logo 视觉细节如需人工审美调整，应在资源提交上迭代，不借此恢复性能候选。
