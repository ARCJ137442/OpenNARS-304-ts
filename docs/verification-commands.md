# M1 / M2 / M3 命令行核实手册

> **封存后的维护手册**：这些命令记录冻结环境的复核口径，不会在项目暂停期间自动运行。完整 M1 成本较高；恢复前必须核对 artifact、路径、结果文件名和[当前状态](current-status.md)。

本文只给当前主线可复核的命令。所有 M1 Java 对照都显式绑定 canonical Java 304 artifact；不要改用历史 3.1.0 JAR。

## M1：Java 304 与 TypeScript 功能对照

先在项目根目录执行。命令是单进程、单线程、逐文件 checkpoint；`--timeout-ms` 是“无进展 watchdog”，不是用 TypeScript 总运行时间判定功能失败。

```powershell
node scripts/e2e/run-nal-corpus.mjs --engine parity --all --chunk-size 1 --cycles 1550 --timeout-ms 180000 --process-limit-ms 900000 --ts-mode cold --java-jar H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-java-canonical-fixed-build\target\opennars-3.0.4-SNAPSHOT.jar --java-classes H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-java-canonical-fixed-build\target\classes --java-test-classes H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-java-canonical-fixed-build\target\test-classes --result-file reports\evidence\m1-245-parity-YYYYMMDD-v1.jsonl
```

系统重启或进程中断后，使用完全相同的参数并追加 `--resume`，不要启动第二个同名矩阵：

```powershell
node scripts/e2e/run-nal-corpus.mjs --engine parity --all --chunk-size 1 --cycles 1550 --timeout-ms 180000 --process-limit-ms 900000 --ts-mode cold --java-jar H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-java-canonical-fixed-build\target\opennars-3.0.4-SNAPSHOT.jar --java-classes H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-java-canonical-fixed-build\target\classes --java-test-classes H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-java-canonical-fixed-build\target\test-classes --result-file reports\evidence\m1-245-parity-YYYYMMDD-v1.jsonl --resume
```

`--all` 的主语料是 245 个资源。M1 的第 246 项可以单独执行；在一次原生化批次后若要求保护 M1，应一并执行：

```powershell
node scripts/e2e/run-nal-corpus.mjs --engine parity --file java-master\src\test\simpleOperationTest.nal --chunk-size 1 --cycles 1550 --timeout-ms 180000 --process-limit-ms 900000 --ts-mode cold --java-jar H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-java-canonical-fixed-build\target\opennars-3.0.4-SNAPSHOT.jar --java-classes H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-java-canonical-fixed-build\target\classes --java-test-classes H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-java-canonical-fixed-build\target\test-classes --result-file reports\evidence\m1-simpleOperationTest-YYYYMMDD-v1.jsonl --summary
```

核对结果时，245 + 1 必须全部满足 `functional_pass=true`。`parity=true` 但任一侧异常、marker 缺失或双方都未满足期望，不能算通过：

```powershell
$main = @(Get-Content reports\evidence\m1-245-parity-YYYYMMDD-v1.jsonl | ForEach-Object { $_ | ConvertFrom-Json })
$extra = @(Get-Content reports\evidence\m1-simpleOperationTest-YYYYMMDD-v1.jsonl | ForEach-Object { $_ | ConvertFrom-Json })
$all = @($main) + @($extra)
"rows=$($all.Count) functional_pass=$(@($all | Where-Object functional_pass).Count) failed=$(@($all | Where-Object { -not $_.functional_pass }).Count)"
$all | Where-Object { -not $_.functional_pass } | Select-Object file, functional_pass, parity, java_ts_diff, timeout_classification, java_exception, ts_exception
```

带 marker 的样本按 marker 对照判定；没有 marker 的样本才使用 131072 周期内部轨迹判定。运行较慢本身是性能记录，不等于功能失败；只有无进展 watchdog 或进程安全上限命中，才作为异常类别单独记录。

## M2：TypeScript 自身的构建与人工入口

M2 不替代 M1。建议串行执行，避免系统内存压力：

```powershell
npx tsc --noEmit --pretty false --incremental false
npm test
npm run test:parity:local --silent
npm run test:build --silent
npm run test:api:dist --silent
npm run test:release --silent
```

其中第一条是阶段权威的非增量零诊断检查；`npm test` 默认已经指向 `test:unit:serial`。`test:build` 会先正式构建，再检查 `dist/index.js` 的公共 API；`test:release` 还会验证干净包的外部 tsc、API、CLI、shell 和启动警告。

### Narsese 交互式 CLI

这对应 Java `java -jar opennars.jar` 的人工输入方式，但 TypeScript 端固定为单线程 step 模式，便于复核：

```powershell
npm run shell
```

启动后可输入：

```text
<a --> b>.
:cycles 100
:status
:reset
:quit
```

也可以让每条 Narsese 自动推进固定周期：

```powershell
npm run shell -- --cycles 100
```

正式构建后使用：

```powershell
npm run build
npm run shell:dist
```

入口使用 Node `register()` loader，并由项目 resolver 将 jree 解析到明确的 `lib/index.js`，不修改 `node_modules`；因此不应再看到 `--experimental-loader` 或 `DEP0151` 启动警告。CLI 是 M2 的人工 smoke 入口，不替代 M1 的 Java/TypeScript 机器可读矩阵。

### 显式配置文本

核心不读取配置路径；宿主读取文件后注入文本。Node shell 已实现这一适配：

```powershell
":quit" | node --import ./scripts/register-ts-loader.mjs scripts/shell.mjs --no-prompt --config config/defaultConfig.xml
```

库调用可以直接传入原生配置文本：

```powershell
node --import ./scripts/register-ts-loader.mjs --input-type=module -e "import {Nar} from './src/main/Nar.ts'; const nar=new Nar({configText:'<config><conf name=\"DURATION\" value=\"9\" /></config>'}); console.log(nar.narParameters.DURATION); nar.stop();"
```

`parseConfigXml(text)` 只返回原生的参数值/插件描述数组，不依赖 Node 或 jree；浏览器 Worker 可以复用该解析入口。`new Nar('config/defaultConfig.xml')` 会拒绝路径并提示宿主先读取，这是故意的边界检查。

## M3：正式构建串行性能基线

先执行正式构建：

```powershell
npm run build
```

再直接调用 benchmark 脚本（当前 PowerShell/npm 组合对 `npm run ... -- --option` 的透传不稳定）：

```powershell
node scripts/e2e/run-m3-benchmark.mjs --cycles 1550 --timeout-ms 180000 --process-limit-ms 900000 --warmup-runs 1 --repetitions 2 --output reports/evidence/m3-formal-baseline-YYYYMMDD-v1.json --file java-master/src/main/resources/nal/single_step/nal8.add.nal --file java-master/src/main/resources/nal/multi_step/nars_multistep_1.nal --file java-master/src/main/resources/nal/application/toothbrush.nal --file java-master/src/main/resources/nal/multi_step/nal4.recursion.small.nal
```

该命令固定 canonical Java artifact、单线程、冷启动和资源指标；结果同时记录 Java/TypeScript 的 wall、CPU、RSS、marker、parity、异常和 process limit。markerless 131072 周期结论仍以 M1 冻结的 stage-digest 证据为准，不能把一次短周期无 marker 运行标成等价。
