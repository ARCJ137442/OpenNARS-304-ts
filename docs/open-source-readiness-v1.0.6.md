# v1.0.6 开源就绪评估

日期：2026-10-05。本文只评估当前 `v1.0.6` 发行和仓库公开可见性，不改变 GitHub 仓库权限。

## 已确认

- Core release `v1.0.6` 已发布，资产为 tarball 与 manifest；tarball SHA-256 为 `99cbe017d69a3f247c9d27999d62e72a9861cd592d5b7d5a18389ad6a6606954`。
- `npm run test:release` 通过：327 个包成员、外部 TypeScript/API/CLI/Shell 全通过、forbidden package members `0`。
- `audit:jree` 直接导入/出现为 `0/0`；`audit:platform` 的 `coreCandidateFiles=0`、`mixedBoundaryFiles=0`。
- Demo 当前代码 `0b33497`，Pages `306c2a4`；74 项 Demo 测试、typecheck、build、产物检查和部署前缀 Chrome 门通过。
- 当前 Microworld 20 秒复测已保存：示例知识平均/末窗 `17.618/14.364 TPS`，空白探索 `19.567/19.760 TPS`；空白探索没有 NARS 操作。
- Shot 固定 seed `3040304` 的 10,000 刻六模式世界合同通过；这证明 TS 世界模型长期有界，不证明 NARS 长期学习等价。
- 根许可证、NOTICE、SECURITY、CONTRIBUTING、中英 README 和 Demo 来源/许可文件存在；敏感文件名与私钥模式扫描为 `0`。

## 仍需披露

- 原始 2,000,000 周期长期稳定性为 `not_run`。
- Microworld 有操作场景尚未持续达到 20 TPS；概念增长和推理长尾仍是瓶颈。
- 性能优化候选在重复低收益后按用户要求停止；这不是严格性能收敛证明。
- Shot 的 NARS 长期行为等价和 NARS 记忆克隆等价尚未证明；049 保持 `in-progress`。
- Git 历史和历史报告仍包含内部证据索引；当前维护文档、规格、README 和归档维护输出已移除可清理的个人路径，但没有对历史报告溯源材料做批量重写。

## 决策

当前版本**适合继续作为透明的 private 研究/集成 release 交付**，不建议现在直接把 Core 仓库改为 public。改为 public 前由仓库所有者完成以下人工审查：

1. 检查完整 Git 历史、Issues、Actions 日志、Pages 资产和 release 附件中的路径、私密数据与第三方材料。
2. 确认 OpenNARS、ONA、Jev 和 NARust-o 的许可证/来源声明与实际公开资产一致。
3. 在干净 clone 执行 `npm ci`、`npm run test:release`，并打开 Node CLI、ESM API 与 Pages Demo。
4. 配置 secret scanning、Dependabot、code scanning 和安全联系渠道。

该结论不阻止公开 Pages Demo；它只说明源码仓库可见性仍需要人工批准。

## English Summary

The `v1.0.6` package, Node/API checks, jree/platform audits, Demo gates, and Pages deployment are reproducible. The release is suitable for transparent private research/integration distribution. The source repository should remain private until an owner-led review covers Git history, issues, Actions logs, Pages assets, third-party licenses, local paths, and secret exposure. Sustained 20 TPS, the original 2,000,000-cycle run, strict performance convergence, and long-run Shot/NARS equivalence remain unproven.
