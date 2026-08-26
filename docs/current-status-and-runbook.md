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

- Git 主线最新提交以仓库 HEAD 和对应批次报告为准；`4d544a1` 修复 Node/jree 运行时入口警告，`29b326a` 固化 JavaString UTF-16 边界优化与 `42b58fd` 完成发布候选外部消费验收。
- Java canonical JAR：`H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-java-canonical-fixed-build\target\opennars-3.0.4-SNAPSHOT.jar`。
- canonical JAR SHA-256：`2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`。
- Java 与 TypeScript 均按单线程运行；Java 测试使用 JDK 18.0.2。
- `npx tsc --noEmit --pretty false --incremental false`：0 诊断。
- 本批串行 `npm test --silent`：185/185；权威 `npx tsc --noEmit --pretty false --incremental false`：0 诊断；`npm run build --silent`、`npm run test:build --silent`、构建 API 和源码/构建产物 shell smoke 均通过。源码 shell 已改用 `--import` 注册 TypeScript loader，并由项目 resolver 处理 `jree`；发布产物改用 `dist/jree-entry.mjs` 的 `createRequire` 适配入口。实际 shell 子进程 stderr 为空，不再产生 `--experimental-loader`/`DEP0151` 启动警告，也不再改写 `node_modules/jree/package.json`。Node 测试器自身的 `--experimental-strip-types` 提示不属于 shell 子进程。
- `npm pack --ignore-scripts` 后在干净 consumer 中安装的包已通过 `Nar` API、外部 TypeScript consumer、npm bin CLI、交互式 shell 和非法 CLI 参数验收；干净包 shell stderr 无 `ExperimentalWarning`、`DEP0151` 或其他 Node deprecation warning。本批发布包包含 268 个文件；包内 `config/defaultConfig.xml` 的 83 个 `conf` 值与 Java canonical 配置一致。
- 局部算法 parity：`ok: true`，`differences: []`，容差 `1e-5`。
- M1 冻结合同已完成：245 个主资源加 `simpleOperationTest.nal` 共 246 个样本，244 个 marker 样本 marker 等价，2 个 markerless 样本均有 131072 周期独立 stage-digest 验收，综合功能结论为 246/246。原始 JSONL 的过程字段仍保留历史筛查分类，不应直接替代独立验收汇总。
- 构建后公共 API smoke 已验证 `dist/index.js` 可导入 `Nar`、订阅 `CycleEnd`/`OUT`、执行 2 个周期并正常停止；构建后 CLI 对 `nal8.add.nal` 的单周期 smoke 通过；`dist/index.d.ts` 由公共 API facade 生成并已被仓库外 TypeScript consumer 编译。
- `npm run test:release` 会真实执行 `npm pack`，在干净 consumer 中串行验证外部 tsc、API、CLI、shell、shebang、配置和包清单；本批包清单为 262 个文件，未包含 reports、探针或临时证据。
- 024 P1 已提供平台中立的 `parseConfigXml(text)` 和 `ParsedNarConfig`；默认 `new Nar()` 使用源码内嵌的配置文本，不在构造期间读取文件。Node shell 的 `--config PATH` 由 shell 读取文本后以 `NarOptions.configText` 注入；核心收到路径字符串会明确拒绝，避免把文件系统能力伪装成核心能力。

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

配置文本入口示例：

    node --import ./scripts/register-ts-loader.mjs --input-type=module -e "import {Nar} from './src/main/Nar.ts'; const nar=new Nar({configText:'<config><conf name=\"DURATION\" value=\"9\" /></config>'}); console.log(nar.narParameters.DURATION); nar.stop();"

需要读取外部 XML 时，应由 Node 宿主先读取文件，再传入 `new Nar({configText, configSource})`；浏览器后续可直接把上传文本传给同一入口。

若 M1 矩阵出现回退，先回到已记录的 M1 稳定冻结提交定位差异，不得以 M3 的性能改善抵销功能回退。

## M3 当前证据边界

M3 已有 `node scripts/e2e/run-m3-benchmark.mjs` 串行工具和显式资源观测开关。当前代表样本的功能/parity 均通过，未出现 process limit 或 stall；证据仍主要是 1–2 次探索性重复，不能宣称稳定 median/p95。后续性能工作的量化目标为单线程 `60,000 ms / 1024 cycles`，以及 TS/Java 运行时间比不超过 `16x`；本批仍未进入 M3 正式优化门禁。

当前前后 profile 位于 `reports/evidence/m3-head-4d544a1-nal4-recursion-small-string-boundary-profile-comparison-v1.json`；热点为 jree `JavaString.valueOf` → `convertUTF16ToString` → Node `TextDecoder` 以及 GC。直接读取 Java-compatible UTF-16 code unit 后，单次 profile 总时长从 25,131.017 ms 降至 11,547.872 ms；该结果是单机单样本观测，不能外推为完整性能等价。

这些证据只能证明代表样本可以在正式构建下运行，不能宣称完整性能等价或 M3 完成。Java 当前只能从管理接口提供进程 CPU、堆和 committed virtual memory proxy，Windows RSS 仍未直接取得；TypeScript 记录进程 CPU 与峰值 RSS。后续性能基线应继续采用串行、单线程和逐文件记录，并以 `60,000 ms/1024 cycles`、TS/Java 不超过 `16x` 作为目标口径；它不改变当前“先完成去 jree 与功能回归”的优先级。shell 的 `ExperimentalWarning` 与 `DEP0151` 已在 `4d544a1` 的 `--import`/resolver 方案和 `42b58fd` 发布适配器中完成修复；测试宿主中的 `bash.exe: could not find /tmp` 仍是独立环境提示，不属于 Node/jree 启动链。

## 文档分层

- `README.md`：安装、构建和当前门禁速查；
- `docs/current-status-and-runbook.md`：当前事实、运行命令和可宣称边界；
- `docs/strategic-baseline.md`：战略路线和历史决策；
- `docs/java-to-typescript-migration-patterns.md`：可复用迁移纠正模式；
- `docs/translation-deep-pitfalls.md`：结构性风险与开工自检；
- `reports/*.md`：阶段批次的证据、决策和复盘；
- `specs/*`：里程碑、重大决策和阶段门禁，不用于记录每个局部 Bug。
