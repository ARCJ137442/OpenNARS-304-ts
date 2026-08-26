# OpenNARS-304-ts 用户指南

本文面向已经了解 NARS/Narsese、希望运行或集成 OpenNARS 3.0.4 TypeScript 的用户。它不介绍 NARS 理论。

## 使用边界

封存版本提供三种可用入口：

1. 交互式 Shell；
2. 面向 `.nal` 文件的批处理 CLI；
3. ESM JavaScript/TypeScript 库入口。

项目版本为 `0.1.0`。M1/M2 已冻结，但去 jree 化、浏览器平台中立化和正式发布门尚未完成；集成前请先阅读[当前状态](current-status.md)。

## 安装与构建

冻结点验证环境使用 Node.js 22.17.0 与 npm 11.19.0。仓库未声明最低 Node 版本，因此其他版本应自行运行构建和 API 检查。

```bash
git clone https://github.com/ARCJ137442/OpenNARS-304-ts.git
cd OpenNARS-304-ts
npm ci
npm run build
```

构建后主要入口为：

- `dist/index.js`：ESM 库；
- `dist/index.d.ts`：公开 TypeScript 声明；
- `dist/cli.mjs`：批处理 CLI；
- `dist/shell.mjs`：交互式 Shell。

## 交互式 Shell

源码开发入口：

```bash
npm run shell
```

构建产物入口：

```bash
node dist/shell.mjs
```

Shell 每行提交一条 Narsese；多条输入按行连续发送。常用命令：

| 输入 | 作用 |
| --- | --- |
| `100` | 推进 100 个周期 |
| `:cycles 100` | 推进 100 个周期；别名为 `:cycle`、`:step` |
| `:status` | 显示运行状态 |
| `:reset` | 重置 NAR |
| `:help` | 显示帮助 |
| `:quit` | 退出 Shell |

示例会话：

```text
<bird --> animal>.
<robin --> bird>.
<robin --> animal>?
100
```

指定配置文件由 Shell 这个 Node 宿主负责读取：

```bash
node dist/shell.mjs --config path/to/config.xml
```

## 批处理 CLI

```bash
node dist/cli.mjs --cycles 1550 path/to/example.nal
```

多个文件可以依次放在命令末尾：

```bash
node dist/cli.mjs --cycles 1550 first.nal second.nal
```

查看参数：

```bash
node dist/cli.mjs --help
```

CLI 负责文件读取；核心 `Nar` 接收字符串或显式配置，不应由浏览器环境模拟 Node 文件系统。

## ESM 库入口

最小运行示例：

```js
import { Nar, Events, OutputHandler } from "./dist/index.js";

const nar = new Nar();

const observer = {
  event(channel, args = []) {
    if (channel === OutputHandler.OUT.class) {
      console.log("OUT", ...args.map(String));
    }
  },
};

nar.on(OutputHandler.OUT.class, observer);
nar.addInputText(`
<bird --> animal>.
<robin --> bird>.
<robin --> animal>?
`);
nar.cycles(100);
console.log("time", String(nar.time()));
nar.off(OutputHandler.OUT.class, observer);
nar.stop();
```

生命周期事件也可以通过 `Events` 订阅：

```js
const cycleObserver = {
  event(event) {
    if (event === Events.CycleEnd.class) console.log("cycle complete");
  },
};

nar.on(Events.CycleEnd.class, cycleObserver);
nar.cycles(1);
nar.off(Events.CycleEnd.class, cycleObserver);
```

## 配置输入

核心支持把配置作为文本或显式选项传入：

```js
import { Nar, parseConfigXml } from "./dist/index.js";

const configText = `<config></config>`;
const parsed = parseConfigXml(configText);
const nar = new Nar({ configText, configSource: "integration" });
```

`parseConfigXml` 返回平台中立的数据结构。如何取得文本由宿主决定：Node CLI 可以读取文件，网页可以使用文本框、上传控件或网络资源。

## 公开 API 与稳定性

冻结点的公开声明导出：`Nar`、`Narsese`、`Term`、`TruthValue`、`BudgetValue`、`Parameters`、`Events`、`OutputHandler`、配置解析器和宿主能力错误。

当前主类名是 `Nar`。规划中的单一 `OpenNARS` 外部门面、单文件 bundle 和浏览器/Node 双平台正式发布物尚未实现，不应根据历史计划文档假定它们存在。

## 已知限制

- 运行时仍依赖 `jree@1.3.0`；
- 当前包入口只声明 ESM `import`，没有 CommonJS `require` 合同；
- 浏览器中立集成门尚未完成，不能只凭 `dist/index.js` 存在就宣称任意浏览器可直接运行；
- 最终性能预算和正式 Release Candidate 尚未完成；
- `package.json` 声明 MIT，但封存点没有独立 `LICENSE` 文件；
- 会话持久化、加载/保存不是本次封存的公开合同。

如需维护或继续开发，请转到[开发者指南](developer-guide.md)。
