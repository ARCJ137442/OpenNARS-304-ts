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
    if (channel === OutputHandler.OUT.class) console.log(...args.map(String));
  },
};
nar.on(OutputHandler.OUT.class, observer);
nar.addInput("<bird --> animal>.");
nar.cycles(10);
nar.off(OutputHandler.OUT.class, observer);
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

## 状态与许可证

024 平台适配、027 性能收敛和 `v1.0.2` fix release 已完成；023/025 严格 host 边界与 031 Java-shape cleanup 仍在推进。长期稳定性原始 2,000,000 周期不属于日常运行负载。详见[运行与验证手册](docs/operator-runbook.md)和[开源就绪评估](docs/open-source-readiness-v1.0.2.md)。

本仓库采用 MIT License，见 [LICENSE](LICENSE)。

本项目改写自 OpenNARS 3.0.4 Java 实现，感谢 OpenNARS authors；详细来源、许可证和项目边界见 [NOTICE](NOTICE)。

生成可下载的 npm 发行包：

```bash
npm run release:bundle
```
