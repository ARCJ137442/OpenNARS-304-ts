# OpenNARS 3.0.4 TypeScript

<img src="brand/opennars-ts-logo.svg" width="260" alt="OpenNARS TypeScript logo" />

[English](README.en.md)

OpenNARS 3.0.4 的 TypeScript 实现。你可以先打开 Web Lab，直接观察推理器进入微世界、棋盘和射击场；也可以在本地启动 Shell，把它当成一个能读 Narsese 的推理实验台。

## 先玩起来

不用安装任何东西，打开 <https://arcj137442.github.io/opennars-304-ts-lab/>。

想看经典虫脑，进入 Microworld；想看离散世界，试试 Grid Microworld；想看跨局棋盘，进入 NARS × 2048；想看多个独立 NARS 角色，进入 Pong 或 Shot。首页只负责导航，选择场景后才启动浏览器 Worker。

每个场景都会把感知、目标、推理事件、操作和环境反馈放在同一条时间线上；展开性能诊断，还能看到 FPS、TPS、RPS、概念数和等待中的 Worker。Microworld 普通入口默认是随机 seed 的空白探索，复现实验使用 `microworld.html?seed=19&knowledge=starter`。

你也可以直接进入场景，省掉目录页的跳转：

- [经典虫脑 Microworld](https://arcj137442.github.io/opennars-304-ts-lab/microworld.html)，观察感知、行动与经验如何连续变化
- [格中虫脑 Grid Microworld](https://arcj137442.github.io/opennars-304-ts-lab/gridworld.html)，切换方格、三角格和六角格
- [NARS × 2048](https://arcj137442.github.io/opennars-304-ts-lab/nars2048.html)，让记忆跨局保留并观察棋盘策略
- [Pong](https://arcj137442.github.io/opennars-304-ts-lab/pong.html)，切换多种单 NARS 与多 NARS 玩法
- [Shot](https://arcj137442.github.io/opennars-304-ts-lab/shot.html)，观察瞄准、射击和进化角色
- [NARS 终端](https://arcj137442.github.io/opennars-304-ts-lab/terminal.html)，输入 Narsese，推进周期并阅读推理输出

## 5 分钟运行

需要 Node.js 22+ 和 npm。

```bash
git clone https://github.com/ARCJ137442/OpenNARS-304-ts.git
cd OpenNARS-304-ts
npm ci
npm run build
```

启动 Shell：

```bash
npm run shell
```

试着输入：

```text
<bird --> animal>.
<robin --> bird>.
<robin --> animal>?
:cycles 100
:quit
```

运行 NAL 文件：

```bash
node dist/cli.mjs --cycles 1550 path/to/example.nal
```

## 作为库集成

```js
import { Nar, OutputHandler } from "opennars-304-ts";

const nar = new Nar();
const observer = {
  event(channel, args = []) {
    if (channel === OutputHandler.OUT) console.log(...args.map(String));
  },
};
nar.on(OutputHandler.OUT, observer);
nar.addInput("<bird --> animal>.");
nar.cycles(10);
nar.off(OutputHandler.OUT, observer);
nar.stop();
```

浏览器体验：<https://arcj137442.github.io/opennars-304-ts-lab/>。Web demo 源码：[OpenNARS-304-ts-web-demo](https://github.com/ARCJ137442/OpenNARS-304-ts-web-demo)。

## 文档

- [上手指南](docs/getting-started.md)
- [用户指南](docs/user-guide.md)
- [集成指南](docs/integration-guide.md)
- [架构说明](docs/architecture.md)
- [运行与验证手册](docs/operator-runbook.md)
- [发布前检查清单](https://github.com/ARCJ137442/OpenNARS-304-ts/blob/main/docs/release-checklist.md)
- [开发者指南](https://github.com/ARCJ137442/OpenNARS-304-ts/blob/main/docs/developer-guide.md)
- [当前状态与证据](https://github.com/ARCJ137442/OpenNARS-304-ts/blob/main/docs/current-status.md)
- [最新中期交接与路线图](https://github.com/ARCJ137442/OpenNARS-304-ts/blob/main/docs/midterm-handoff-20261003.md)

## 状态与许可证

原生 TypeScript 核心与既定语义门已通过；本轮性能试探在连续低收益后按用户要求停止，**尚未证明持续20TPS或严格性能收敛**。v1.0.7 fix release 已发布，静态 Demo Lab 已部署到 <https://arcj137442.github.io/opennars-304-ts-lab/>；生产源码直接 jree audit 为 `0/0`；原始 2,000,000 周期 TS 实测已完成，但 Java 本次未重跑。接手路线见[当前状态](https://github.com/ARCJ137442/OpenNARS-304-ts/blob/main/docs/current-status.md)，运行命令见[手册](docs/operator-runbook.md)。

本仓库采用 MIT License，见 [LICENSE](LICENSE)。

本项目改写自 OpenNARS 3.0.4 Java 实现，感谢 OpenNARS authors；详细来源、许可证和项目边界见 [NOTICE](NOTICE)。

生成可下载的 npm 发行包：

```bash
npm run release:bundle
```
