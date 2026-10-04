# 修订发行检查清单

当前可下载版本为 `v1.0.5`；spec 042 仍在进行，因为持续性能目标和 Shot 完整进化尚未闭合。当前受保护的核心生产提交 `083d7b8` 已通过 M1′、完整 M2 与 strict markerless；当前 HEAD 文档更新后的 Java M2 也已现跑通过。这不自动证明 Demo 性能收敛或 public 仓库可见性已经批准。

## 冻结候选与语义

- [ ] 冻结最终核心与 Demo 提交，两个仓库的已跟踪工作树干净；保留历史未跟踪证据，不使用 `git add -A`。
- [ ] 在最终核心提交运行直接合同、非增量 typecheck、build、dist API、TS-only 与含 Java 的完整 M2，准确记录 passed/failed/skipped。
- [ ] 完成 M1′ 243 项主体及 #25/#246；#245 先以 2048 估算、符合阈值才运行 65536，逐行分类 timeout、process_limit、exception、stall、not_run。
- [ ] 两份 131072-cycle strict markerless 与各自冻结 Java 摘要逐窗口等价；核对基线文件 SHA-256。原始 200 万周期若未运行，明确披露 `not_run`。
- [ ] `audit:jree` 为 0/0、平台核心/混合边界为 0；发布源码、dist、声明文件和依赖树不带 npm `jree` 或宿主类型泄漏。

## 性能与 Demo

- [ ] 发布后继续完成 spec 049 的完整淘汰排名与长期进化；045–048、Shot 六模式基础页面与真实 Worker 门已通过，未完成部分不得包装成完整复刻。
- [ ] 所有 Demo 的目标 TPS 配置至少为 20，并分别记录实际/目标比；目标数值改变不算性能提升。

- [ ] 同浏览器、seed、输入、周期、模式和时长比较推理 RPS、世界 TPS、FPS、p95、概念增长与内存；异步世界 TPS 不充当推理吞吐。
- [ ] 显著披露 Microworld **有操作**场景尚未持续达到 20 TPS：30 秒平均 `15.875`、末窗 `11.776 TPS`。重复低收益后已按用户指令主动停止本轮试探；不能把停止称为严格收敛或性能达标，也不能用经典空白场景替代。
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
- [x] 同步 Pages 的 `opennars-304-ts-lab/` 目录、审阅站点 diff、提交推送；从公网打开首页、Worker、代表 Demo 并核对版本。
- [x] 分内容提交推送核心和 Demo，创建**仅含本版 tarball 与 manifest** 的 GitHub fix release。不发布 npm。
- [x] 2026-10-03 已核对并清理 v1.0.4 Release 误附的五个历史 `.tgz`；现仅有 1.0.4 包与 manifest，本地历史文件保留，原始前后清单见当前状态。
- [ ] 仓库从 private 改 public 前由所有者审查 Git 历史、Issues、Actions 日志、Pages 资产、许可证、第三方素材、机密与联系渠道；可见性变更不随本清单自动执行。
