# 上手指南

这份指南面向第一次接触项目的用户。完整推理核心运行在 Node.js 中；浏览器用户直接打开在线 demo。

## 安装

需要 Node.js 22 或更新版本。

```bash
git clone https://github.com/ARCJ137442/OpenNARS-304-ts.git
cd OpenNARS-304-ts
npm ci
npm run build
```

## 第一次运行

```bash
npm run shell
```

输入以下内容观察推理输出：

```text
<bird --> animal>.
<robin --> bird>.
<robin --> animal>?
:cycles 100
:quit
```

批处理 NAL 文件：

```bash
node dist/cli.mjs --cycles 1550 path/to/example.nal
```

## 浏览器

无需安装 Node.js 即可使用在线 demo：<https://arcj137442.github.io/opennars-304-ts/>。
输入 `:help` 查看命令，输入 `:version` 查看 demo 绑定的核心提交。

## 下一步

- 想写 Node/TypeScript 集成：阅读[集成指南](integration-guide.md)。
- 想了解模块边界：阅读[架构说明](architecture.md)。
- 想运行维护检查：阅读[运行手册](operator-runbook.md)。
