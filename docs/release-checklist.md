# 发布检查清单

## 仓库

- [ ] `git status` 只包含本次发布相关文件，历史证据未被删除。
- [ ] README、上手、集成、架构和运行手册中的命令可在干净 clone 复现。
- [ ] MIT `LICENSE` 位于仓库根目录。
- [ ] 扫描密码、token、私钥、绝对本机路径和临时日志。
- [ ] `reports/`、`output/`、Java 源码、`.codegraph` 和崩溃日志不进入 npm 包。

## npm

```bash
npm ci
npm run test:release
npm pack --dry-run
```

核对包内只包含 `dist`、必要源码、配置、CLI、公开文档和许可证；确认 `dist/index.d.ts` 不出现 npm `jree` 类型或本机绝对路径。

## Demo

- [ ] web-demo `build:worker`、`check` 和单测通过。
- [ ] `build-meta.json.sourceCommit` 指向准备发布的主仓库提交。
- [ ] 真实浏览器能加载 Worker、提交 Narsese、显示 OUT、读取 `:version`。
- [ ] Pages checkout 的 diff 只包含 demo 站点目录，提交并推送后再验证公开 URL。

## 对外操作

- [ ] 先在 GitHub 网页检查仓库名、默认分支、Issues、Actions、Secrets、Pages、npm provenance 和贡献指南。
- [ ] 确认历史提交、报告、Java 基线和本地路径没有不应公开的内容。
- [ ] 由仓库所有者明确确认后，才执行 GitHub 仓库可见性变更。
