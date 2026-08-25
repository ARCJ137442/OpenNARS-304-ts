# 当前状态与运行手册

更新时间：2026-08-26

本文是当前主线的事实入口，优先级高于历史报告中的旧统计。历史审阅、重启提示词和逐批报告保留用于追溯，不直接代表当前通过率。

## 门禁顺序

```text
M1：245 个主资源 NAL 单线程功能/parity 全量矩阵
  ↓
M2：TypeScript 非增量零诊断、统一测试、正式 build/API
  ↓
M3：串行资源基线、重复 median/p95、profile 与优化
  ↓
发布：CLI、公共 API、插件、稳定性和文档
```

M1 已冻结；M3 benchmark 只使用正式构建产物，且不得以性能观测覆盖功能验收。任何后续优化都必须以 M1/M2 冻结证据为回归底线；若出现功能回退，先修复功能，再继续性能工作。

## 当前已确认事实

- Git 主线最新已推送提交：`7964e69`；warning/classpath 修复位于 `bf7dd22`，文档同步位于 `7964e69`。
- Java canonical JAR：`H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-java-canonical-fixed-build\target\opennars-3.0.4-SNAPSHOT.jar`。
- canonical JAR SHA-256：`2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`。
- Java 与 TypeScript 均按单线程运行；Java 测试使用 JDK 18.0.2。
- `npx tsc --noEmit --pretty false --incremental false`：0 诊断。
- 本批串行 `npm test --silent`：159/159；权威 `npx tsc --noEmit --pretty false --incremental false`：0 诊断；`npm run build --silent` 与 `npm run shell:dist` 均通过。shell 已改用 `--import` 注册 TypeScript loader，并在入口前修补 jree 的 ESM `exports` 元数据；实际 shell 子进程 stderr 为空，不再产生 `--experimental-loader`/`DEP0151` 启动警告。Node 测试器自身的 `--experimental-strip-types` 提示不属于 shell 子进程。
- 局部算法 parity：`ok: true`，`differences: []`，容差 `1e-5`。
- M1 冻结合同已完成：245 个主资源加 `simpleOperationTest.nal` 共 246 个样本，244 个 marker 样本 marker 等价，2 个 markerless 样本均有 131072 周期独立 stage-digest 验收，综合功能结论为 246/246。原始 JSONL 的过程字段仍保留历史筛查分类，不应直接替代独立验收汇总。

## M1 冻结回归

推荐使用显式 artifact 路径，避免历史 3.1.0 JAR 被误用：

    node scripts/e2e/run-nal-corpus.mjs --engine parity --all --chunk-size 1 --cycles 1550 --timeout-ms 180000 --process-limit-ms 900000 --ts-mode cold --java-jar H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-java-canonical-fixed-build\target\opennars-3.0.4-SNAPSHOT.jar --java-classes H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-java-canonical-fixed-build\target\classes --java-test-classes H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-java-canonical-fixed-build\target\test-classes --result-file reports/evidence/m1-245-parity-YYYYMMDD-v1.jsonl

建议：

- `--chunk-size 1` 保证逐文件落盘和故障恢复；
- `--timeout-ms 180000` 表示 180 秒没有进度才判定 stall，不把“慢”直接当作逻辑失败；
- `--process-limit-ms 300000` 是常规单文件硬进程上限；对持续有周期进展但尚未出现 marker 的已知慢样本，可单独提高上限复核，不能因此掩盖真正的无进展卡死；
- 结果必须同时查看 `matched[]`、`ok`、`error_type`、`marker_missing`、`timed_out` 和 `process_limited`；
- 只有发现真实功能回归时才重新运行 245+1；日常 M2/M3 批次使用冻结证据和小范围受影响样本，避免重复消耗全量矩阵。

当前运行的 PID、日志和 checkpoint 以实际终端输出为准，不写入长期文档，避免留下过期进程状态。

## M2 固定提交复核

代码变更后按以下顺序串行执行：

    npm run build --silent
    npm test --silent
    npx tsc --noEmit --pretty false --incremental false
    npm run test:parity:local --silent
    npm run test:build --silent

第 246 个夹具单独核实：

    node scripts/e2e/run-nal-corpus.mjs --engine parity --file java-master\src\test\simpleOperationTest.nal --chunk-size 1 --cycles 1550 --timeout-ms 180000 --process-limit-ms 900000 --ts-mode cold --java-jar H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-java-canonical-fixed-build\target\opennars-3.0.4-SNAPSHOT.jar --java-classes H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-java-canonical-fixed-build\target\classes --java-test-classes H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-java-canonical-fixed-build\target\test-classes --result-file reports/evidence/m1-simpleOperationTest-YYYYMMDD-v1.jsonl --summary

交互式人工核实入口：

    npm run shell

它对应 Java `java -jar opennars.jar` 的 Narsese 输入体验，但采用本项目当前可控的单线程 step 模式：输入一行 Narsese 后用 `:cycles N` 推进；`:status`、`:reset`、`:quit` 可查看状态、重置和退出。构建产物使用 `npm run build` 后的 `npm run shell:dist`。该入口用于人工 smoke，不替代 canonical Java 与 TypeScript 的 M1 parity 矩阵。

若 M1 矩阵出现回退，先回到已记录的 M1 稳定冻结提交定位差异，不得以 M3 的性能改善抵销功能回退。

## M3 当前证据边界

M3 已有 `node scripts/e2e/run-m3-benchmark.mjs` 串行工具和显式资源观测开关。当前 HEAD `7964e69` 的正式 `dist` 基线位于 `reports/evidence/m3-formal-baseline-20260825-head-7964-v1.json`、`...recursion-v1.json` 和 `m3-formal-baseline-20260826-head-7964-simple-operation-v1.json`；四个 marker 代表样本功能/parity 通过，markerless 样本本次运行完成但未在该次 1550 周期追加观测中达到 131072。

当前 profile 位于 `reports/evidence/m3-head-7964-nal8-add-v1-profile-summary.json`，第一可观测热点为 jree `getConverter`（21.91%），其次为 GC（16.21%）。尚未实施新的优化。

这些证据只能证明代表样本可以在正式构建下运行，不能宣称完整性能等价或 M3 完成。Java 当前只能从管理接口提供进程 CPU、堆和 committed virtual memory proxy，Windows RSS 仍未直接取得；TypeScript 记录进程 CPU 与峰值 RSS。shell 的 `ExperimentalWarning` 与 `DEP0151` 已由 `bf7dd22` 修复并通过回归测试。

## 文档分层

- `README.md`：安装、构建和当前门禁速查；
- `docs/current-status-and-runbook.md`：当前事实、运行命令和可宣称边界；
- `docs/strategic-baseline.md`：战略路线和历史决策；
- `docs/java-to-typescript-migration-patterns.md`：可复用迁移纠正模式；
- `docs/translation-deep-pitfalls.md`：结构性风险与开工自检；
- `reports/*.md`：阶段批次的证据、决策和复盘；
- `specs/*`：里程碑、重大决策和阶段门禁，不用于记录每个局部 Bug。
