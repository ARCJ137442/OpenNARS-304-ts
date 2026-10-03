# OpenNARS 3.0.4 TypeScript

[English](README.en.md)

OpenNARS 3.0.4 的 TypeScript 实现，提供 Node.js CLI、交互式 Shell、ESM 库入口，以及独立的浏览器 Worker demo。

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
- [发布前检查清单](docs/release-checklist.md)
- [开发者指南](docs/developer-guide.md)
- [当前状态与证据](docs/current-status.md)
- [最新中期交接与路线图](docs/midterm-handoff-20261003.md)

## 状态与许可证

原生 TypeScript 核心与既定语义门已通过；本轮性能试探在连续低收益后按用户要求停止，**尚未证明持续20TPS或严格性能收敛**。下一阶段是 Demo 周边功能迭代；当前 v1.0.5 只完成包版本准备，未创建 GitHub Release，Pages 仍为 v1.0.4。生产源码直接 jree audit 为 `0/0`；原始 2,000,000 周期长期稳定性仍 `not_run`。接手路线见[最新中期交接](docs/midterm-handoff-20261003.md)、[当前状态](docs/current-status.md)和[运行与验证手册](docs/operator-runbook.md)。

本仓库采用 MIT License，见 [LICENSE](LICENSE)。

本项目改写自 OpenNARS 3.0.4 Java 实现，感谢 OpenNARS authors；详细来源、许可证和项目边界见 [NOTICE](NOTICE)。

生成可下载的 npm 发行包：

```bash
npm run release:bundle
```
