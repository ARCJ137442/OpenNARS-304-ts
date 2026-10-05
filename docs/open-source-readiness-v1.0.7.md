# v1.0.7 开源就绪评估

## 自动证据

- GitHub Release：<https://github.com/ARCJ137442/OpenNARS-304-ts/releases/tag/v1.0.7>
- tarball SHA-256：`0195ea1e71d8a467345e412bffd5c22dda7178d74c52874358554547b318d8a7`
- Clean clone `npm ci` 与 `npm run test:release`：通过，327 个包成员，API/CLI/Shell 通过，0 漏洞。
- `audit:jree`：直接导入/出现 `0/0`；`audit:platform`：核心候选/混合边界 `0/0`。
- Demo `npm run check`：Astro 0/0/0、76 项测试、构建和产物检查通过；Pages 已推送最新构建。
- 原始长周期 TS 实测：2,000,000 请求周期、4,000,424 实际推理周期、约 54.7 分钟、峰值 RSS 2.57 GiB、功能 1/1；证据见 [长周期实测](probes/20261005-long-stability-2000000.md)。

## 已完成的公开动作

- Core 仓库已在 2026-10-05 通过 GitHub 管理员授权改为 public。
- Dependabot security updates、secret scanning、secret push protection 已启用，当前 Dependabot 告警数为 0。
- CodeQL default setup 已启用并成功完成首次运行。
- Pages、Release 和源码仓库现在都可由公众访问。

## 仍需人工维护

继续检查完整 Git 历史、Issues、Actions、Pages 资产、Release 附件和第三方许可证授权。Secret scanning 的 non-provider patterns 与 validity checks 受 GitHub 能力限制未启用，后续可在账户计划允许时补开。

## 结论

v1.0.7 现在作为透明的 public 研究/集成 fix release 交付。自动可复现性、发布资产和基础安全扫描已完成；性能披露边界仍以实测结果为准。
