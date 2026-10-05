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

### 安全设置的决策依据

- Dependabot alerts 和 security updates 监测直接依赖中的已知漏洞，并在兼容范围内提供升级路径；它减少长期无人发现的依赖风险，不能代替升级后的测试。
- Secret scanning 在公开仓库历史中发现已知密钥格式；push protection 在提交推送前拦截疑似凭据，降低密钥进入公开 Git 历史后难以彻底清除的风险。误报仍需维护者判断，真实泄漏则应立即撤销凭据。
- CodeQL default setup 对受支持语言运行静态安全分析，帮助发现数据流、注入和不安全 API 等代码缺陷；它不覆盖运行环境、依赖供应链和所有业务逻辑。
- 这三项是公开维护的基础预警，不构成“仓库已经完成全面安全审计”的证明。完整历史、Actions 权限、Release/Pages 资产与第三方授权仍需人工复核。
- 当前 GitHub 能力未开放 secret-scanning non-provider patterns 与 validity checks；本项目不把未启用能力写成已覆盖。

## 人类使用路径

- 先打开 [Web Lab](https://arcj137442.github.io/opennars-304-ts-lab/)，从目录进入一个场景；不需要安装，也不会在首页提前启动 NARS Worker。
- 想直接观察具身闭环，可打开 [Microworld](https://arcj137442.github.io/opennars-304-ts-lab/microworld.html) 或 [Grid Microworld](https://arcj137442.github.io/opennars-304-ts-lab/gridworld.html)。
- 想体验跨局记忆、多角色和终端，可打开 [NARS × 2048](https://arcj137442.github.io/opennars-304-ts-lab/nars2048.html)、[Pong](https://arcj137442.github.io/opennars-304-ts-lab/pong.html)、[Shot](https://arcj137442.github.io/opennars-304-ts-lab/shot.html) 或 [NARS Terminal](https://arcj137442.github.io/opennars-304-ts-lab/terminal.html)。
- 想在本地运行核心，执行 `npm ci`、`npm run build`、`npm run shell`；想嵌入应用，阅读 `docs/integration-guide.md`。

## 仍需人工维护

继续检查完整 Git 历史、Issues、Actions、Pages 资产、Release 附件和第三方许可证授权。Secret scanning 的 non-provider patterns 与 validity checks 受 GitHub 能力限制未启用，后续可在账户计划允许时补开。

## 结论

v1.0.7 现在作为透明的 public 研究/集成 fix release 交付。自动可复现性、发布资产和基础安全扫描已完成；性能披露边界仍以实测结果为准。
