# OpenNARS 3.0.4 TypeScript

OpenNARS 3.0.4 的 TypeScript/Node.js 迁移实现。项目以可复现的 Java 3.0.4 产物为语义基线，保留交互式 Shell、批处理 CLI 和 ESM 库入口。

> **项目已于 2026-08-27 进入阶段封存。** M1 功能等价与 M2 零诊断构建基线已经冻结；去 jree 化、浏览器平台中立化、正式性能门和发布候选尚未完成。精确证据、剩余边界和恢复方式见[当前状态](docs/current-status.md)。

## 快速开始

```bash
git clone https://github.com/ARCJ137442/OpenNARS-304-ts.git
cd OpenNARS-304-ts
npm ci
npm run build
```

启动交互式 Shell：

```bash
npm run shell
```

或直接运行构建产物：

```bash
node dist/shell.mjs
```

在 Shell 中输入 Narsese 或裸整数周期命令；输入 `:help` 查看命令，输入 `:quit` 退出。

批量执行 NAL 文件：

```bash
node dist/cli.mjs --cycles 1550 path/to/example.nal
```

## 作为库使用

当前公开入口是 ESM `dist/index.js`，主类为 `Nar`：

```js
import { Nar, OutputHandler } from "./dist/index.js";

const nar = new Nar();
const output = {
  event(_channel, args = []) {
    console.log(...args.map(String));
  },
};

nar.on(OutputHandler.OUT.class, output);
nar.addInput("<bird --> animal>.");
nar.cycles(10);
nar.off(OutputHandler.OUT.class, output);
nar.stop();
```

更完整的输入、配置、生命周期和限制说明见[用户指南](docs/user-guide.md)。

## 文档入口

- [当前状态](docs/current-status.md)：封存点、可信证据、未完成项和恢复条件。
- [用户指南](docs/user-guide.md)：Shell、CLI 与 ESM 库的使用方法。
- [开发者指南](docs/developer-guide.md)：架构、测试门禁、LeanSpec 与接手流程。
- [文档索引](docs/README.md)：当前文档、维护资料、历史资料和后续计划的分类。

## 版本与发布边界

- 包版本：`0.1.0`。
- 模块格式：ESM。
- `package.json` 声明许可证为 MIT；封存点尚未补入独立 `LICENSE` 文件。
- 当前仓库是经过 M1/M2 验证的开发冻结点，不是完成去 jree 化、浏览器中立化和正式性能验收后的 Release Candidate。
