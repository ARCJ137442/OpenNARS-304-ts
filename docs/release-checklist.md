# 修订发行检查清单

当前可下载版本为 `v1.0.4`；下一次 fix release **尚未创建**，spec 042 仍在进行。当前受保护的核心生产提交 `083d7b8` 已通过 M1′、完整 M2 与 strict markerless；这不自动证明 Demo 性能收敛或新发行可发布。每次新的核心生产修改都要重新判断门禁。

## 冻结候选与语义

- [ ] 冻结最终核心与 Demo 提交，两个仓库的已跟踪工作树干净；保留历史未跟踪证据，不使用 `git add -A`。
- [ ] 在最终核心提交运行直接合同、非增量 typecheck、build、dist API、TS-only 与含 Java 的完整 M2，准确记录 passed/failed/skipped。
- [ ] 完成 M1′ 243 项主体及 #25/#246；#245 先以 2048 估算、符合阈值才运行 65536，逐行分类 timeout、process_limit、exception、stall、not_run。
- [ ] 两份 131072-cycle strict markerless 与各自冻结 Java 摘要逐窗口等价；核对基线文件 SHA-256。原始 200 万周期若未运行，明确披露 `not_run`。
- [ ] `audit:jree` 为 0/0、平台核心/混合边界为 0；发布源码、dist、声明文件和依赖树不带 npm `jree` 或宿主类型泄漏。

## 性能与 Demo

- [ ] 同浏览器、seed、输入、周期、模式和时长比较推理 RPS、世界 TPS、FPS、p95、概念增长与内存；异步世界 TPS 不充当推理吞吐。
- [ ] Microworld 的**有操作**场景持续达到 20 TPS，或满足目标文件中“最后一次有效优化后连续三轮 <5% 且无高收益候选”的收敛与显著披露条件。经典空白场景的速率不能替代它。
- [ ] 普通 Demo 的默认目标速率与有效 NARS 操作经真实浏览器验证；尤其要核对 BandRobot 的实际交付和 TicTacToe、TestChamber、FighterPlane、Echo Relay 的后段速率。
- [ ] `npm run check`、Worker 构建、产物完整性检查与真实 Chrome smoke 通过；首页不启动 NARS Worker，Console/page/Worker 错误均为 0；`build-meta.json.sourceCommit` 指向最终核心提交。

## 包、网站与来源

```bash
npm ci
npm run test:release
npm pack --dry-run
npm run release:bundle
```

- [ ] 检查 tarball、release manifest 与 SHA-256；包内只含 `dist`、必要源码/配置、CLI、双语公开文档、`LICENSE`、`NOTICE`，没有报告、崩溃日志、`.codegraph`、私钥或本机路径。
- [ ] 中英 README、上手、集成、架构、运行手册与 Demo 文档能让干净 clone 的读者运行 Node CLI/API 和静态网页；明确 OpenNARS 3.0.4 改写来源、Demo 原始代码/素材授权和按事实记录的 Agent/模型参与。
- [ ] 同步 Pages 的 `opennars-304-ts-lab/` 目录、审阅站点 diff、提交推送；从公网打开首页、Worker、代表 Demo 并核对版本。
- [ ] 分内容提交推送核心和 Demo，创建**仅含本版 tarball 与 manifest** 的 GitHub fix release；旧 release 误带的历史 `.tgz` 资产单独核对清理。不发布 npm。
- [ ] 仓库从 private 改 public 前由所有者审查 Git 历史、Issues、Actions 日志、Pages 资产、许可证、第三方素材、机密与联系渠道；可见性变更不随本清单自动执行。
