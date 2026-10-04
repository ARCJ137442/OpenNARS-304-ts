# v1.0.7 开源就绪评估

## 自动证据

- GitHub Release：<https://github.com/ARCJ137442/OpenNARS-304-ts/releases/tag/v1.0.7>
- tarball SHA-256：`0195ea1e71d8a467345e412bffd5c22dda7178d74c52874358554547b318d8a7`
- Clean clone `npm ci` 与 `npm run test:release`：通过，327 个包成员，API/CLI/Shell 通过，0 漏洞。
- `audit:jree`：直接导入/出现 `0/0`；`audit:platform`：核心候选/混合边界 `0/0`。
- Demo `npm run check`：Astro 0/0/0、76 项测试、构建和产物检查通过；Pages 已推送最新构建。
- 原始长周期 TS 实测：2,000,000 请求周期、4,000,424 实际推理周期、约 54.7 分钟、峰值 RSS 2.57 GiB、功能 1/1；证据见 [长周期实测](probes/20261005-long-stability-2000000.md)。

## 仍需人工确认

仓库所有者仍需检查完整 Git 历史、Issues、Actions、Pages 资产、Release 附件、第三方许可证授权，并在 GitHub Settings 中确认 secret scanning、Dependabot、code scanning 和安全联系渠道。当前源码仓库可见性仍不由 Agent 改变；公开 Pages 不等于 Core 源码已批准公开。

## 结论

v1.0.7 适合作为透明的 private 研究/集成 fix release。自动可复现性和发布资产已完成；仓库改为 public 需人工审查完成后再决定。
