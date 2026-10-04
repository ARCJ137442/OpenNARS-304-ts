---
status: complete
created: 2026-10-03
priority: high
tags:
- demo grid sensorimotor
created_at: 2026-10-03T05:54:52.364263700Z
updated_at: 2026-10-04T05:07:09.453309300Z
completed_at: 2026-10-04T05:07:09.453309300Z
transitions:
- status: in-progress
  at: 2026-10-03T05:54:52.465603500Z
- status: complete
  at: 2026-10-04T05:07:09.453309300Z
---

# Grid Microworld topologies

## 意图

用户要求先纠正 Microworld 左右操作的身体相对语义：以屏幕 y 向下的世界坐标展示时，`^Left` 应逆时针、`^Right` 应顺时针。随后增加**一个**由 Microworld 衍生的简化 2D 网格 Demo，形状作为世界参数而非三个 Demo：正方形、正三角形、正六边形。世界有有限格数但无边缘碰撞（环面），虫体与食物都占离散格；左右前操作与六路离散感知的 Narsese 接口尽量共用。

## 合同与实施

- [x] 经典 Microworld 的 NARS `LEFT/RIGHT` 与手动左/右转同语义；用朝东起点直接证明 left 转后朝上、right 转后朝下。若与 Java 源码角度符号不同，明确记录这是屏幕坐标下按用户语义修正的 Demo 行为，不拿其测试冒充 Java 画面 parity。
- [x] 一个 Grid Microworld 入口有方格/三角格/六角格三种可切换拓扑；切换时重置世界与 Worker 并清楚显示所选拓扑，不卡住旧推理进程。
- [x] 方格每格 4 个边邻居、六角格 6 个边邻居、三角格 3 个边邻居且 up/down 朝向交替；左/右转到本格相邻朝向，前进跨一个边。所有邻接与坐标在有限环面上 wrap。
- [x] 六路感知沿三种网格的虫体朝向分成 3 个好食物 + 3 个坏食物扇区；感知/目标/奖励仍送到现有 Microworld Worker，操作取自真实 NARS 或明确标记 babble/手动来源。
- [x] 食物有限且分布于格子；好/坏碰撞、重新分布、回合计数与目标反馈有可复现 seed。渲染显示格形、虫体方向、食物、感受区与操作来源；加入统一 Lab 目录和预览，不在首页启动 NARS。
- [x] 新 Demo 的 HUD、经验视图与 FX 遵守 044/045 的固定槽位、真实事件和减少动效合同，不把拓扑视觉效果当 NARS 学习证据。

本规格在现有 Microworld Worker 协议与 Web Lab 路由之上实现；其几何与环境状态为 Demo 层，不修改核心 OpenNARS 推理语义。当前 LeanSpec `link` 不可用，依赖 024/044/045 暂在正文记载。

## Test

- [x] 三种格形的邻接数、左右逆/顺时针、前进、wrap、seed 重现和食物反馈直接合同通过。
- [x] 构建/typecheck、Demo 单测、真实 Chrome 对三种参数的加载/切换、画面非空、Worker 在线、六路感知、NARS Worker 事件与重置通过。
- [x] 与经典 Microworld 分开声明：网格 Demo 是新环境，不能把它的 TPS 或操作数替代原版 2D 连续世界的证据。

## 验收记录

Demo 页面与模型提交随下一次 Demo 主线提交推送。逐拓扑浏览器检查和全量 `npm run check` 通过；实际操作来源保留 `NARS`、`babble`、`手动` 或 `IDLE`，不把没有在短窗口出现的自主操作伪造为成功。
