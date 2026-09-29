# 用户指南

## 入口选择

| 需求 | 入口 |
| --- | --- |
| 交互输入 Narsese | `npm run shell` |
| 批量运行 `.nal` | `node dist/cli.mjs --cycles 1550 file.nal` |
| Node/TypeScript 集成 | `dist/index.js` + `dist/index.d.ts` |
| 浏览器体验 | `OpenNARS-304-ts-web-demo` 的 Worker demo |

## Shell

```bash
npm run shell
```

```text
<bird --> animal>.
:cycles 100
:status
:reset
:quit
```

每条 Narsese 输入不会隐式推进周期；周期由 `:cycles N`、`:cycle N` 或 `:step N` 显式触发。

## CLI

```bash
npm run build
node dist/cli.mjs --help
node dist/cli.mjs --cycles 1550 path/to/example.nal
```

CLI 是 Node 宿主，负责读取文件；核心 `Nar` 接收文本，不在浏览器中读取路径。

## 库入口

```js
import { Nar, Events, OutputHandler } from "opennars-304-ts";

const nar = new Nar();
const listener = {
  event(channel, args = []) {
    if (channel === OutputHandler.OUT.class) console.log(args.map(String).join(" "));
  },
};
nar.on(OutputHandler.OUT.class, listener);
nar.addInputText("<bird --> animal>.\n<robin --> bird>.");
nar.cycles(10);
nar.off(OutputHandler.OUT.class, listener);
nar.stop();
```

## 配置

```js
import { Nar, parseConfigXml } from "opennars-304-ts";

const configText = `<config><conf name="DURATION" value="5" /></config>`;
console.log(parseConfigXml(configText).values);
const nar = new Nar({ configText, configSource: "inline" });
nar.stop();
```

Node 应由宿主读取配置文件后传入 `configText`；浏览器使用文本框、上传文件的 `File.text()` 或网络响应文本。

## 浏览器

在线入口：<https://arcj137442.github.io/opennars-304-ts/>。Worker 接收文本命令并返回结构化消息，浏览器不会解析 Node `fs/path/process` 或 npm `jree`。

## 限制

- Node 与浏览器使用不同宿主 adapter；核心 API 不承诺文件、终端或进程能力。
- `Nar` 的保存/加载文件能力属于 Node/Java 兼容边界，不是浏览器合同。
- 020 的正式性能基线和发布候选仍待后续完成；长期稳定性原始 2M 周期不作为日常负载。
