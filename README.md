# OpenNARS 3.0.4 TypeScript

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

浏览器体验：<https://arcj137442.github.io/opennars-304-ts/>。Web demo 源码：[OpenNARS-304-ts-web-demo](https://github.com/ARCJ137442/OpenNARS-304-ts-web-demo)。

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

023 原生运行时和 024 平台适配阶段已按 M1-prime 门禁完成。性能优化与正式发布候选属于 020，仍在推进；长期稳定性原始 2,000,000 周期不属于日常运行负载。详见[运行与验证手册](docs/operator-runbook.md)。

本仓库采用 MIT License，见 [LICENSE](LICENSE)。
