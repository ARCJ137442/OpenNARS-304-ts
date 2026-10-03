# 运行与验证手册

## 日常验证

```bash
npm ci
npm run typecheck
npm test
npm run test:build
npm run test:api:dist
npm run test:release
```

这些命令是 TypeScript-only 的日常门。阶段复核再运行 `npm run test:unit:with-java`、`npm run audit:jree`、`npm run audit:platform` 和 `npm run validation:plan`。

## M1-prime 口径

023/024 阶段门采用 244 个普通 NAL、#245 的 65536 周期降载 fixture 和额外 #246 `simpleOperationTest.nal`。原始 2,000,000 周期在当前设备上属于持续系统瓶颈，不作为日常门；运行时必须保留 `passed`、`process_limit`、`timeout`、`exception`、`stall` 和 `not_run` 的区别。

完整命令和 canonical Java 路径见[源码仓库中的核实手册](https://github.com/ARCJ137442/OpenNARS-304-ts/blob/main/docs/verification-commands.md)。长测使用单进程、唯一结果文件、逐文件 checkpoint 和 `--resume`；内存超过设备硬停止线时停止扩张。

## Demo 构建

在 web-demo checkout 中执行：

```bash
npm ci
npm run build:worker
npm run check
npm test
```

检查 `public/build-meta.json` 的 `sourceCommit`，再用真实浏览器确认 Worker online、输入 Narsese、输出 OUT 和 `:version`。Pages 部署需要显式传入 Pages checkout：

```bash
npm run deploy:pages -- H:/path/to/ARCJ137442.github.io
```

脚本只写入 `opennars-304-ts-lab/` 子目录，不自动提交或改变仓库可见性。

## 故障排查

- `dist` 与源码不一致：删除本地 `dist` 后重新运行 `npm run build`。
- demo 显示旧版本：核对 `public/build-meta.json`、Pages commit 和浏览器缓存。
- 配置失败：确认宿主读取的是 UTF-8 文本，并把文本传给 `parseConfigXml`/`Nar`。
- 进程异常：先保存 stdout、stderr、退出码、信号、进度和 RSS，再确认没有重复启动同名长测。
