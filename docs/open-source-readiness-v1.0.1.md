# v1.0.1 Open-source readiness

## Recommendation

当前版本值得以“公开研究型 fix release”方式开源：核心包可安装、CLI/ESM API 可运行，npm jree 依赖已从维护源码和发布包移除，Demo Lab 已部署到 <https://arcj137442.github.io/opennars-304-ts-lab/>。开源说明必须诚实保留长期稳定性和平台边界限制，不应把它包装成性能等同 Java 的生产系统。

## Confirmed

- GitHub Release `v1.0.1` 已创建。
- `npm run test:release`、`npm pack --dry-run`、release bundle、TS/Java M2 通过。
- M1-prime：243/243、#25、#245 65536 fixture、#246 均通过；strict markerless 两项 equal。
- Demo：Astro check、28 tests、static build、worker build、artifact check、真实浏览器 smoke 通过。
- 许可证和来源：根目录 MIT `LICENSE`、`NOTICE`，Demo 产物保留 GPL/ONA attribution files。
- `audit:jree`：直接 npm jree import files/occurrences 为 `0/0`。

## Disclosures

- 原始 2,000,000-cycle stability workload 是当前设备上的持续系统瓶颈；公开文档应以 65536-cycle fixture 作为日常长周期门，并保留原始限制说明。
- Demo 的后半段 TPS 受概念增长和 GC 长尾影响，不能宣称达到 20 TPS。
- 023/025 strict host closure 与 031 Java-shape cleanup 仍在进行；当前 runtime 保留 Java-compatible text, exceptions, class tokens, collections and host facades because those contracts are observable。
- Browser worker 依赖构建脚本将当前 `native-host-adapter.ts` 映射到 browser adapter；这是发布工程边界，不是 npm jree 依赖。

## Maintainer checks before changing visibility

- 确认 GitHub 仓库历史、issues、Actions logs、Pages artifacts、release assets 和未跟踪公开文件中没有本机路径、私密日志、token、私有数据或未授权第三方材料。
- 确认 GitHub Pages 使用 `opennars-304-ts-lab/`，而 README、metadata、主页链接和 release notes 使用同一 URL。
- 启用 Dependabot/secret scanning/code scanning，并设置 Security Advisory 联系流程。
- 在干净 clone 上执行 `npm ci`、`npm run test:release`，再打开 Node CLI、ESM API 和 Pages Demo。
- 检查 `LICENSE`、`NOTICE`、Demo COPYING 文件与上游 OpenNARS attribution 一致。
- 公开仓库可接受贡献后，要求 PR 说明测试、性能、许可证和行为兼容边界。

## Decision

建议现在公开仓库和 `v1.0.1`，但把项目定位为可复现的 OpenNARS 3.0.4 TypeScript 研究/集成版本。若目标是“Java 性能等同、20 TPS Demo、所有 platform boundary 完成”的生产承诺，应先完成 023/025/031 后再提高公开承诺等级。
