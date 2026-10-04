# 修订发行检查清单

当前可下载版本为 `v1.0.6`；spec 042 仍在进行，因为持续性能目标、049 长期 NARS 等价和 public 审查尚未闭合。发行资产绑定 Core tag `v1.0.6` / commit `9b4e8a8`；受保护的核心生产提交 `083d7b8` 已通过 M1′、完整 M2 与 strict markerless。当前 HEAD `5528fd8` 仅为文档/公开面同步，`test:release`、typecheck 和 dist API 已现跑通过。这不自动证明 Demo 性能收敛或 public 仓库可见性已经批准。

## 冻结候选与语义

- [x] 冻结最终核心与 Demo 提交，两个仓库的已跟踪工作树干净；历史未跟踪证据保留，未使用 `git add -A`。
- [x] 在发布候选上运行直接合同、非增量 typecheck、build、dist API、TS-only 与含 Java 的完整 M2，准确记录 passed/failed/skipped。
- [x] 当前候选再次串行现跑含 Java M2：`514/514 passed`；证据见 `reports/evidence/m2-current-7492666-java-20261005.tap`。
- [x] M1′ 243 项主体及 #25/#246、#245 降周期和两份 strict markerless 已有同源树可追溯证据；原始 200 万周期明确为 `not_run`。
- [x] 两份 131072-cycle strict markerless 与冻结 Java 摘要逐窗口等价，基线 SHA-256 已记录。
- [x] `audit:jree` 为 0/0，平台核心/混合边界审计为 0；发行包不含 npm `jree` 或内部临时文件。

## 性能与 Demo

- [x] Shot 世界层完成六模式角色矩阵、淘汰排名和固定 seed 10,000 刻有界进化合同；[ ] 仍需完成 NARS 长期行为/记忆克隆等价，未完成部分不得包装成完整复刻。
- [ ] 所有 Demo 的目标 TPS 配置至少为 20，并分别记录实际/目标比；目标数值改变不算性能提升。

- [ ] 同浏览器、seed、输入、周期、模式和时长比较推理 RPS、世界 TPS、FPS、p95、概念增长与内存；异步世界 TPS 不充当推理吞吐。
- [x] 显著披露 Microworld **有操作**场景尚未持续达到 20 TPS：当前 20 秒复测平均/末窗 `17.618/14.364 TPS`；历史 30 秒复测为 `15.875/11.776 TPS`。重复低收益后已按用户指令主动停止本轮试探；不能把停止称为严格收敛或性能达标，也不能用经典空白场景替代。
- [ ] 普通 Demo 的默认目标速率与有效 NARS 操作经真实浏览器验证；尤其要核对 BandRobot 的实际交付和 TicTacToe、TestChamber、FighterPlane、Echo Relay 的后段速率。
- [x] Demo Worker 构建、产物完整性检查与部署前缀真实 Chrome smoke 通过；首页不启动 NARS Worker，页面错误为 0；`build-meta.json.sourceCommit` 指向发布绑定的 Core 提交。

## 包、网站与来源

```bash
npm ci
npm run test:release
npm pack --dry-run
npm run release:bundle
```

- [x] 检查 tarball、release manifest 与 SHA-256；包内只含必要源码/配置、CLI、双语公开文档、`LICENSE`、`NOTICE`，没有报告、崩溃日志、`.codegraph`、私钥或本机路径。
- [x] 中英 README、上手、集成、架构、运行手册与 Demo 文档可指导干净 clone 运行 Node CLI/API 和静态网页，并披露 OpenNARS 来源、Demo 授权与 Agent/模型参与。
- [x] 同步 Pages 的 `opennars-304-ts-lab/` 目录、审阅站点 diff、提交推送；从公网打开首页、Worker、代表 Demo 并核对版本。
- [x] 分内容提交推送核心和 Demo，创建**仅含本版 tarball 与 manifest** 的 GitHub fix release。不发布 npm。
- [x] 2026-10-03 已核对并清理 v1.0.4 Release 误附的五个历史 `.tgz`；现仅有 1.0.4 包与 manifest，本地历史文件保留，原始前后清单见当前状态。
- [ ] 仓库从 private 改 public 前由所有者审查 Git 历史、Issues、Actions 日志、Pages 资产、许可证、第三方素材、机密与联系渠道；可见性变更不随本清单自动执行。
