# 2026-10-05 开源就绪审查

## 最终公开核对

- Core 仓库已由所有者授权改为 public，当前 API 状态为 `isPrivate=false`：<https://github.com/ARCJ137442/OpenNARS-304-ts>。
- v1.0.7 是正式 Release，资产为 `opennars-304-ts-1.0.7.tgz` 与 `release-manifest.json`，不是 npm 自动发布。
- Dependabot security updates、secret scanning、secret push protection 和 CodeQL default setup 已启用；CodeQL 首次运行成功，Dependabot 告警为 0。
- Pages 仓库与公开 Demo 可访问，Core README 现在同时提供 Web Lab、直接场景入口、本地 Shell 和 ESM API 路径。
- 仍需人工持续检查完整 Git 历史、Issues、Actions、Pages 资产、Release 附件和第三方授权；账户能力暂不支持的 secret-scanning non-provider patterns 与 validity checks 不作已启用声明。

下面的“初次审查快照”保留公开前的证据，不能覆盖上面的最终状态。

## 初次审查快照（公开前，已封存）

- Core `audit:jree`：直接导入文件/出现 `0/0`。
- Core `audit:platform`：`coreCandidateFiles=0`、`mixedBoundaryFiles=0`。
- Core change gate：发布检查器修复为 T0 非生产变更；不要求重新运行 M1′/M2。
- Clean clone：`E:\tmp\opennars-clean-audit-20261005-060203` 内执行离线 `npm ci` 与 `npm run test:release` 通过；327 个包成员，外部 TypeScript/API/CLI/Shell 通过，漏洞数 0，tarball SHA-256 `47d83c4ed98be839b4a03da77da77ee03dcc8f237672deb86fedfbb85bf110d0`。
- 发布检查器已不再读取未纳入 Git 的 `java-master` checkout；CLI smoke 使用版本化 `test/fixtures/release-nal8.add.nal`，配置合同使用版本化 `config/defaultConfig.xml`。
- Core `LICENSE`/`NOTICE` 与 Demo 的 `COPYING-GPL-3.0.txt`、`COPYING-ONA-MIT.txt`、`COPYING-JEV-2048-MIT.txt` 均存在；Demo 构建产物保留对应来源入口。
- 当前维护文档中发现的个人路径已替换为占位符；历史 `reports/evidence`、历史归档和测试夹具仍保留溯源路径，未批量重写。
- GitHub API 只读核对（公开前）：Core 仓库当时为 `private=true`；v1.0.7 为正式 Release，资产为 tarball 与 manifest，资产 digest 与本地哈希一致。
- GitHub API 显示的公开前安全能力状态：当时没有可用的 Actions workflow runs，secret scanning 与 code scanning 仍待账户能力/网页设置处理；该快照已由上方最终公开核对覆盖。
- Git 历史路径审查确认 `.claude/settings.local.json` 曾存在，已由 `5528fd8` 移除；历史提交仍可追溯。当前扫描未发现 GitHub token、云密钥或私钥模式命中（历史证据与 Java 源树排除在自动扫描之外）。

## 人工验收

仓库所有者在改变源码仓库可见性前逐项确认：

1. 检查完整 Git 历史、Issues、Actions 日志、Pages 资产和 Release 附件，确认没有 token、私密日志、本机路径或未授权第三方材料。
2. 对 OpenNARS、ONA、Jev、NARust-o 与 Microworld 素材逐项核对许可证、来源链接和公开资产；确认 GPL 素材没有被 Core MIT 许可覆盖。
3. 在另一台机器或全新网络 clone 中执行 `npm ci`、`npm run test:release`，并手动打开 Node CLI、ESM API 与 <https://arcj137442.github.io/opennars-304-ts-lab/>。
4. 在 GitHub 仓库 Settings 中启用 secret scanning、Dependabot、code scanning，并填写 Security Policy/安全联系渠道；确认 Actions 权限遵循最小权限。
5. 检查 GitHub Pages 实际提交为最新 Demo 构建，确认 `opennars-304-ts-lab/build-meta.json` 的 sourceCommit 与 Demo 构建身份一致。
6. 检查源码仓库为 public，且公开动作确有所有者授权；确认 Pages、Release 和 README 链接一致。

7. 继续在 GitHub Settings 检查 Dependabot、secret scanning/push protection 与 CodeQL 状态；账户能力不支持的 non-provider patterns 与 validity checks 保留人工跟踪。

## 当前边界

Microworld 有操作场景未持续达到 20 TPS、原始 2,000,000 周期长测和 Shot 的长期 NARS/记忆克隆等价仍如实披露，但按 2026-10-05 用户批示，它们不再阻塞本轮发行收口。核心性能试探已在重复低收益后停止，不把这些未证明项写成达标。
