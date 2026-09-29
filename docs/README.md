# 文档索引

本索引用于区分“当前事实”“可执行说明”“历史证据”和“尚未实施的计划”。如果文档之间出现冲突，按下列优先级解释。

## 外部用户入口

1. [仓库 README](../README.md)：安装、最小示例和导航。
2. [上手指南](getting-started.md)：第一次 clone 后的运行方式。
3. [用户指南](user-guide.md)：Shell、CLI、ESM 库、配置与限制。
4. [集成指南](integration-guide.md)：Node/TypeScript、浏览器和 NAL 集成方式。
5. [架构说明](architecture.md)：核心、Node adapter、Browser Worker 和数据流。
6. [运行手册](operator-runbook.md)：构建、验证、部署和故障排查。
7. [发布检查](release-checklist.md)：公开仓库、npm 和 Pages 发布前检查。

## 开发与维护入口

- [当前开发目标与验收计划](luna-agent-active-goal.md)：恢复后的唯一现行执行目标、T0/T1/T2 触发标准和长期门禁。
- [开发者指南](developer-guide.md)：架构、LeanSpec、门禁、恢复 DAG 和提交纪律。
- [M1/M2/M3 命令行核实手册](verification-commands.md)：维护者复核命令和长测试口径。
- [Java → TypeScript 迁移纠正模式库](java-to-typescript-migration-patterns.md)：经过归纳的迁移模式与自动化边界。
- [AGENTS.md](../AGENTS.md)：Agent 在本仓库工作的强制规则。
- [诊断归档说明](diagnostic-archive.md)：仓库外临时产物的范围、去向和逐脚本归档理由。

`current-status.md`、`luna-agent-active-goal.md`、`reports/` 和历史 spec 记录维护过程与机器证据；它们不是第一次使用项目所需的入口。

## 历史资料

以下文档用于追溯决策，不代表封存后的当前任务：

- [历史战略基线](strategic-baseline.md)
- [Luna Agent G0/M1/M2 重启提示词](luna-agent-goal-restart-prompt.md)
- [Luna Agent G0 后长期目标](luna-agent-post-g0-goal.md)
- [2026-08-22 审阅意见](luna-agent-review-and-next-actions.md)
- [深层踩坑点假设清单](translation-deep-pitfalls.md)
- 根目录 `通用转写方法1.1.md`

历史资料中的“当前”“下一步”和统计数字都只能按其标注日期理解。

## 暂缓的后续计划

以下计划在封存点尚未完成，也不会因文档存在而自动恢复：

- [平台中立单 JS + `.d.ts` 打包计划](platform-neutral-single-js-library-plan.md)
- [BabelNAR 按需横向一致性测试计划](babelnar-on-demand-cross-parity-test-plan.md)

恢复任一计划前，必须重新核对 `docs/current-status.md`、Git HEAD、LeanSpec board 与产物哈希。

## 过程与证据

- `reports/`：逐批阶段报告；[2026-08-27 冻结报告](../reports/20260827-003242.md)是代码冻结交接入口。
- `reports/evidence/`：机器可读矩阵、哈希、性能和诊断产物；证据必须结合对应报告解释。
- `specs/`：LeanSpec 规格与实现状态；`in-progress` 表示验收尚未完成，即使项目处于封存状态也不能改写为 complete。
