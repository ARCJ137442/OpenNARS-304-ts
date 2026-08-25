# 当前状态与运行手册

更新时间：2026-08-25

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

M1 未全量通过时，不启动新的 M3 benchmark 或性能优化。任何 M2 改动都必须以 M1 冻结证据为回归底线；若出现功能回退，先修复 M1，再继续 M2。

## 当前已确认事实

- Git 主线最新提交：`eba42ea`；代码优化提交：`4d5435f`。
- Java canonical JAR：`H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-java-canonical-fixed-build\target\opennars-3.0.4-SNAPSHOT.jar`。
- canonical JAR SHA-256：`2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`。
- Java 与 TypeScript 均按单线程运行；Java 测试使用 JDK 18.0.2。
- `npx tsc --noEmit --pretty false --incremental false`：0 诊断。
- 固定优化提交上的 `npm test --silent`：155/155；jree 的 DEP0151 是运行时弃用警告，不是测试失败。
- 局部算法 parity：`ok: true`，`differences: []`，容差 `1e-5`。
- M1 当前批次 `reports/evidence/m1-245-parity-20260825-fqn-fixed-v1.jsonl` 已在第 24 行暂停：`nars_multistep_2.nal` 首次出现 `Bag.findEquivalentKey` 的不可迭代桶异常。兼容性修复后的单样本证据 `reports/evidence/m1-nars-multistep-2-bag-rebuild-fix-20260825-v2.jsonl` 已 Java/TS marker 2/2、`functional_pass=true`、无异常/无 stall；TS 约 365.9 秒，性能差距另行记录。245+1 全量复跑尚未完成，因此仍不得宣称 M1 通过。

## M1 全量运行

推荐使用显式 artifact 路径，避免历史 3.1.0 JAR 被误用：

    node scripts/e2e/run-nal-corpus.mjs --engine parity --all --chunk-size 1 --cycles 1550 --timeout-ms 180000 --process-limit-ms 300000 --ts-mode cold --java-jar H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-java-canonical-fixed-build\target\opennars-3.0.4-SNAPSHOT.jar --java-classes H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-java-canonical-fixed-build\target\classes --java-test-classes H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-java-canonical-fixed-build\target\test-classes --result-file reports/evidence/m1-245-parity-YYYYMMDD-v1.jsonl

建议：

- `--chunk-size 1` 保证逐文件落盘和故障恢复；
- `--timeout-ms 180000` 表示 180 秒没有进度才判定 stall，不把“慢”直接当作逻辑失败；
- `--process-limit-ms 300000` 是常规单文件硬进程上限；对持续有周期进展但尚未出现 marker 的已知慢样本，可单独提高上限复核，不能因此掩盖真正的无进展卡死；
- 结果必须同时查看 `matched[]`、`ok`、`error_type`、`marker_missing`、`timed_out` 和 `process_limited`；
- 只有 245 个主资源全部完成且无未解释功能分叉，才能将 M1 标记为通过。

当前运行的 PID、日志和 checkpoint 以实际终端输出为准，不写入长期文档，避免留下过期进程状态。

## M2 固定提交复核

代码变更后按以下顺序串行执行：

    npm run build --silent
    npm test --silent
    npx tsc --noEmit --pretty false --incremental false
    npm run test:parity:local --silent
    npm run test:build --silent

交互式人工核实入口：

    npm run shell

它对应 Java `java -jar opennars.jar` 的 Narsese 输入体验，但采用本项目当前可控的单线程 step 模式：输入一行 Narsese 后用 `:cycles N` 推进；`:status`、`:reset`、`:quit` 可查看状态、重置和退出。构建产物使用 `npm run build` 后的 `npm run shell:dist`。该入口用于人工 smoke，不替代 canonical Java 与 TypeScript 的 M1 parity 矩阵。

若 M1 矩阵出现回退，先回到已记录的 M1 稳定冻结提交定位差异，不得以 M3 的性能改善抵销功能回退。

## M3 当前证据边界

M3 已有 `npm run benchmark:m3` 串行工具和显式资源观测开关。`4d5435f` 的 jree FQN 优化在 single-step、multi-step、application、recursion 四类代表样本上通过功能/parity；其正式证据位于 `reports/evidence/m3-formal-resource-baseline-20260825-*.json`。

这只能证明代表样本和优化候选已验证，不能替代 M1 全量矩阵，也不能宣称完整性能等价。Java 当前只能从管理接口提供进程 CPU、堆和 committed virtual memory proxy，Windows RSS 仍未直接取得；TypeScript 记录进程 CPU 与峰值 RSS。

## 文档分层

- `README.md`：安装、构建和当前门禁速查；
- `docs/current-status-and-runbook.md`：当前事实、运行命令和可宣称边界；
- `docs/strategic-baseline.md`：战略路线和历史决策；
- `docs/java-to-typescript-migration-patterns.md`：可复用迁移纠正模式；
- `docs/translation-deep-pitfalls.md`：结构性风险与开工自检；
- `reports/*.md`：阶段批次的证据、决策和复盘；
- `specs/*`：里程碑、重大决策和阶段门禁，不用于记录每个局部 Bug。
