# 集成指南

## Node.js / TypeScript

安装 npm 包后，从 ESM 入口导入 `Nar`。宿主负责文件、终端和进程能力；核心只接收文本和显式配置。

```bash
npm install opennars-304-ts
```

```ts
import { Nar, OutputHandler } from "opennars-304-ts";

const nar = new Nar();
const observer = {
  event(channel: unknown, args: unknown[] = []) {
    if (channel === OutputHandler.OUT.class) console.log(args.map(String).join(" "));
  },
};

nar.on(OutputHandler.OUT.class, observer);
nar.addInputText("<bird --> animal>.\n<robin --> bird>.");
nar.cycles(10);
nar.off(OutputHandler.OUT.class, observer);
nar.stop();
```

配置由宿主读取后注入：

```ts
import { readFile } from "node:fs/promises";
import { Nar, parseConfigXml } from "opennars-304-ts";

const configText = await readFile("config.xml", "utf8");
console.log(parseConfigXml(configText).values);
const nar = new Nar({ configText, configSource: "file" });
nar.stop();
```

浏览器或其他宿主应使用 `File.text()`、`fetch()` 或等价 API 读取文本，再调用 `addInputText`。核心 API 不承诺 `fs`、`process`、终端或网络访问。

## NAL 文件

CLI 负责读取路径并把文本交给核心：

```bash
node dist/cli.mjs --cycles 1550 examples/example.nal
```

库集成需要自行处理编码、文件错误和输出订阅；不要在浏览器 bundle 中引入 Node 文件模块。

## 浏览器 Worker

公开 demo 将核心打包进独立 Worker。Worker 消息是宿主协议，不是 Node CLI 的内部实现：发送 `{ type: "command", line: "<a --> b>." }`，接收 `ready`、`output`、`complete` 和 `fatal` 消息。自定义配置使用 `{ type: "config", text, name }`。

## 稳定性边界

`dist/index.d.ts` 是公开类型入口。Java 兼容名称可能出现在异常、类 token 和 adapter 类型中，但 npm 包的公共声明不依赖 npm `jree` 类型。兼容层属于实现边界，后续 020 优化可能改变内部表示，不改变已声明的核心输入、周期和事件合同。
