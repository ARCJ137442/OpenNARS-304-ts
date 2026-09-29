# OpenNARS-304-TS 当前开发目标与验收计划

> **唯一现行开发目标**。开始工作前读取 `AGENTS.md`、`docs/current-status.md`、
> `docs/developer-guide.md`、最新报告及 LeanSpec board，并查看 `023`、`024`、
> `020`。旧 Agent 提示词、旧计划与历史报告只用于追溯，不能覆盖本文、Git、
> LeanSpec 和原始证据。动态 HEAD、计数和通过率只维护在
> `docs/current-status.md`，本文只规定长期目标、工作分组与验收规则。

## 1. 长期目标与顺序

在已经冻结的 M1 功能等价与 M2 零诊断基线上，按以下顺序完成本阶段开发：

```text
冻结 Java/TS 功能标杆
  ↓
023：按责任簇完成生产核心去 jree 化
  ↓
024：完成核心库平台无关化与 Node/浏览器宿主适配
  ↓
同一不可变提交上的 023/024 集成验收
  ↓
020：正式性能测量与有界优化
  ↓
单一 OpenNARS 公共门面、bundle、使用文档与发布候选
  ↓
用户明确授权后的 tag、GitHub Release、npm 或网站发布
```

功能正确性优先于性能；性能优化不得与尚未闭合的语义迁移混在同一批次。
正式发布属于外部状态变更，只能在用户当次明确授权后执行。

## 2. 当前策略纠正：从逐文件迁移改为责任簇迁移

立即停止“改一个普通文件就结束一个批次并跑一遍 M1-”的做法。单文件只是
实现切片，不是验收单位。剩余工作按下列五个**责任簇**组织。每个切片必须
声明一个 owner 簇；为完成 API 形状调整，最多允许再触及一个 supporting 簇且
最多两个 supporting 生产文件。触及三个簇、没有明确 owner，或 supporting 文件
超过两个时，计划器拒绝执行，必须继续拆分。

| ID | 责任簇 | 主要范围 | 完成目标 |
| --- | --- | --- | --- |
| J1 | 运行时兼容簇 | `src/runtime/**`、`src/util/**`、`src/types.ts` | 建立项目自有的 Java 字符串、异常、类 token、随机数、迭代和集合合同；解除生产核心对 npm jree 的运行时依赖 |
| J2 | 语言与解析簇 | `src/language/**`、`Narsese.ts`、`Parser.ts`、`Symbols.ts`、`Texts.ts` | 统一原生字符串、UTF-16 code unit、hash/compare、数组和集合边界，保持 Narsese 语义 |
| J3 | 推理核心簇 | `src/control/**`、`src/inference/**`、`src/entity/**`、`src/storage/**` | 保留 Java equals/hash、插入顺序、随机调用次数、float32 收窄、链接类型、Bag/Memory 与事件派发合同 |
| J4 | operator/plugin 簇 | `src/operator/**`、`src/plugin/**` | 将 Java List、异常、CharSequence 与输出包装收敛为项目内接口或原生类型 |
| J5 | 主入口与宿主边界簇 | 公共入口、`src/interfaces/**`、`Nar.ts`、`NarNode.ts`、`Shell.ts`、配置、IO、事件与平台文件 | 收口 Node/浏览器能力边界；最后删除 `package.json` 的 jree 依赖、`jree-entry.mjs` 和 loader 特例 |

精确路径归属以 `scripts/checking/validation-clusters.mjs` 为机器真源。
所有生产 TypeScript 文件必须且只能属于一个簇；新增或移动
文件时先更新映射及其测试。类型注解、异常类型或 API 形状的机械调整，只要没
完成整个责任簇、没跨簇且局部合同无异常，就仍是切片，不得据此跑 M1-。

每个责任簇按以下方式推进：

1. 先列出簇内剩余文件、jree 责任、Java 合同、直接测试、2～5 个受影响 NAL、
   出口条件和若干可回退切片；不要再以“下一文件”作为计划标题。
2. 每个切片只实现一个共同合同或一组紧密耦合的 API，完成局部验证后继续该簇。
3. 只有簇的出口条件全部满足时才声明 `--close-cluster`，并在该簇末尾跑一次
   M1--。在当前 Termux 等受限环境中，责任簇保护矩阵统一使用 M1--（243 项）；完整责任簇 M1- 仍由其他高性能环境执行。整个 `023` 预计约 5 次责任簇保护矩阵，不是每删除一个 import 跑一次。
4. 若中途出现可归因语义退化，先用定向 NAL 和最早可观察分歧诊断；不要用
   244 项矩阵代替定位，也不要用文档提交、报告行数或测试行数触发 M1-。

## 3. Java 标杆与等价口径

普通 `023/024` 切片和责任簇收口只运行 TypeScript，对照冻结 Java JSONL，
不得现跑 Java：

- canonical Java source commit：
  `8675b76fe8c21ee20a7b8c1b63408fb05327210d`
- canonical JAR SHA-256：
  `2CF519E1F85C38E38384C7076AA750C730580C612C97CC70C70B361361F273F5`
- 冻结标杆：
  `H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\g0-java-baseline-frozen-26772af-20260917.jsonl`
- 冻结标杆 SHA-256：
  `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`

只有 `023/024` 整体验收、J/P 集成、RC，或 Java artifact、fixture、配置、随机
条件、单线程模式、runner 语义与结果 schema 等不变量变化时，才现跑单线程
canonical Java。现跑结果必须先与冻结标杆逐字段核对，不得自动刷新预言。

等价路线预先由 fixture 决定：有 Java marker 的样本在全部对应 marker 匹配且
运行完整时通过；只有无 marker 样本才需要达到 131072 个实际周期并比较事件
窗口。两条路线是“或”，不是失败后的任选补救。仍有周期或事件进展的慢运行是
性能告警和功能观察未完成，不是语义失败，也不是通过；约 180 秒无周期或事件
进展才是 stall 候选。

## 4. 验证计划生成器：不得凭 Agent 模糊判断

每个**已提交候选**先运行：

```powershell
npm run validation:plan -- -- --base <本簇或本切片起点提交> --head HEAD `
  --cluster <J1-runtime-compat|J2-language-parser|J3-inference-core|J4-operator-plugin|J5-main-io-host> `
  --java-baseline "H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\g0-java-baseline-frozen-26772af-20260917.jsonl" `
  --expected-baseline-sha256 264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954 `
  --evidence-prefix <唯一证据前缀>
```

工具输出 JSON，校验生产源码只落入一个责任簇、冻结标杆存在且哈希正确，并给出
本批必须执行的命令。计划无效或 `errors` 非空时停止，不得绕过脚本手工降级。
旧 `--scope responsibility` 已废止，不能再用自由文本把普通切片升级为整簇收口。

### V0：低风险切片

适用于未命中高风险路径的同簇局部实现。运行：

- 直接正常/异常合同；
- TS-only 串行单测；
- 非增量 typecheck；
- build 与 dist API；
- 迁移模式、平台边界、编码和适用的静态检查。

纯文档、报告和测试脚手架变更只运行相关工具回归，不运行无关 NAL 或 M1-。
生产源码改动行数只统计 `src/**/*.ts|tsx|mts|cts`，不统计测试、规格、脚本、
报告和文档。

### V1：风险切片

适用于 Bag、Memory、TaskLink、TermLink、RuleTables、随机数、类身份、集合判等、
迭代、float32、链接与派发等高风险语义路径，即使只改一行。运行 V0 全部，
再运行计划器列出的 2～5 个受影响/哨兵 NAL。若哨兵红，先定位或回退，不启动
M1-。风险切片本身**不**因为路径热、行数多或文件多而自动跑 M1-。

### V2：责任簇收口

仅当该簇预先列出的出口条件全部满足时，在上述命令追加：

```text
--close-cluster
```

此时计划器才允许并要求一次 TS-only M1-- 243 项矩阵，对照冻结 Java JSONL；在 Termux 中不得退回 `--limit 244` 或启动完整 245 项。
同一收口提交的文档、报告、哈希或补记不得再触发第二次 M1-。若收口矩阵失败，
责任簇保持未完成；修复后只对新的收口候选重跑一次。

### V3：阶段门

仅用于 `023`、`024`、`integration` 或 `rc`，把 `--close-cluster` 改为：

```text
--stage 023|024|integration|rc
```

V3 要求同一不可变提交上：现跑单线程 canonical Java、完整 245+1 M1、两个无
marker 样本严格长周期验证、包含 Java 的完整 M2、Node 与真实浏览器验证，以及
依赖/平台审计。阶段门不等同于日常责任簇收口。

## 5. 长测试与 Token 纪律

- 同一矩阵只能有一个进程、一个 checkpoint/resume 和一个证据前缀。
- 命令返回后台 session 后不要数秒级轮询或反复报告“仍在运行”；使用较长等待，
  或在测试期间整理已完成 checkpoint、报告、合同映射和下一个切片。
- 长测试运行期间不得修改被测源码，不得启动同名副本；完成消息到达后一次解析
  完整结果。
- M1- 只承担责任簇收口保护，不用来发现显而易见的编译、类型或定向语义问题。
- `#245` 和严格 markerless 长测不进入日常 M1-，只进入阶段门。

## 6. 后续阶段的完成条件

### 023：去 jree 化

- 五个责任簇逐一收口并各自留下至多一次有效 M1- 证据；
- 生产核心不再直接依赖 npm jree，公共类型不泄漏 jree 类型；
- Java 字符串、异常、类 token、随机数、集合和迭代合同由项目内实现及测试保护；
- 同一提交通过 V3 `--stage 023` 后，才能将 spec 023 标记 complete。

### 024：平台无关化

- 核心库只消费注入的配置、输入输出、时钟/随机与宿主能力接口；
- 文件读取、stdin、进程退出等 Node 能力留在 Shell/Node 外壳；浏览器可通过文本、
  配置对象或上传内容供给输入；
- Node 与真实浏览器从同一核心入口运行，bundle 不依赖 Node shim；
- 同一提交通过 V3 `--stage 024` 后，才能将 spec 024 标记 complete。

### 020、公共门面与发布准备

功能冻结后再进入 `020`：固定硬件、配置、线程、种子和实际周期，区分冷启动、
推理时间与进程回收，通过 profile 做有界优化。随后搜索 LeanSpec；若无现行公共
门面/bundle spec，才用 LeanSpec 工具创建。最终交付唯一公共 `OpenNARS` class、
`opennars-304-ts.lib.js`、唯一核心 `.d.ts`，以及无 `.d.ts` 的 Shell/Web 外壳；
同步用户文档、开发者文档、版本/构建时间/哈希 manifest 和 RC 消费者验证。

## 7. 恢复工作后的第一批行动

1. 保留并完成暂停前已经开始的唯一未提交批次；不得丢弃用户或其他 Agent 修改。
2. 只读运行新计划器，重新分类该批次；已经完成且证据有效的 M1- 不得重跑。
3. 对五个责任簇运行唯一归属审计，列出每簇剩余 jree 文件、运行时责任、出口条件、
   直接合同和 2～5 个 NAL；将清单写入 023，而不是继续逐文件挑选。
4. 选择一个未闭合责任簇，先提交簇计划，再按共同合同连续完成若干小切片。
5. 切片只跑 V0/V1；直到出口条件全部满足才执行一次 V2。

出现未分类语义差异、M2 退化、标杆哈希失效、跨责任簇生产修改或计划器报错时，
立即停止扩大范围。报告先写“可以/不能宣称”，再列 commit、计划器 JSON、标杆
SHA、验证命令与分类、原始证据、实际周期、依赖审计差值、剩余问题和下一项可
证伪实验。LeanSpec 状态只按真实验收更新，不因暂停或局部通过标记 complete。

## 2026-09-28 J1 Runtime Compatibility Recovery Plan

- Re-read after context compaction: `reports/probes/20260928-J1-runtime-compat.md` is the active J1 short-term memory.
- J1 implementation commit is `7d95bf697396958b04c9d2152eae95ce8951538a`; the worktree contains only pre-existing untracked reports/evidence after the commit. Do not discard those historical paths.
- J1 owns `src/runtime/**`, `src/util/**`, and `src/types.ts`. The implementation is one cohesive runtime batch; downstream Random consumers, Shell, logger users, Charset users, and the twelve non-bridge direct `jree` imports stay with J2-J5.
- The batch adds a project-owned Java 48-bit LCG, strengthens RuntimeClassToken and JavaExceptions, enforces UTF-16/hash/compare and safe long boundaries, and adds direct project-owned runtime contract tests. The bridge keeps only documented compatibility behavior required by live downstream callers.
- Implementation checkpoint: `JavaRandom.ts`, the bridge delegation, `RuntimeConstructor`, safe long checks, UTF-16 sequence length handling, and JavaThrowable cause/suppressed lifecycle are implemented and covered by direct tests.
- `arc137-dev-standard` is active for this batch. New responsibilities stay behind explicit adapters, legacy compatibility is kept local with removal conditions, and no unrelated cleanup is included.
- Completion claims remain limited to J1 evidence. J2-J5, stage 023, and stage 024 are not complete until their own gates pass.

## 2026-09-28 J2 Language and Parser Probe

- Short-term memory: `reports/probes/20260928-J2-language-parser.md`.
- J2 is the next responsibility cluster after J1. Its six direct `jree` production imports are `CompoundTerm.ts`, `Term.ts`, `Terms.ts`, `Variable.ts`, `Variables.ts`, and `Narsese.ts`; `Parser.ts` uses only the project-owned input type, while `Symbols.ts` and `Texts.ts` remain in the semantic surface.
- The J2 batch is organized around four contracts: UTF-16 Java text/hash/compare, project-owned collections/arrays/iterators, native exception/class identity, and Narsese `StringBuilder`/nested parser indices. It is one coherent responsibility-cluster implementation, not six file tasks.
- Existing replacements are `jree-compat` string helpers, `NativeList`/`NativeFixedList`/`NativeSet` and iterators, `JavaRandom`, `JavaExceptions`, and `RuntimeClassToken`. The bridge remains available to later owners until their migrations.
- J2 direct tests are `language-runtime.test.ts`, `narsese-boundary.test.ts`, and `narsese-temporal.test.ts`, with focused string/exception boundary tests selected by the validation plan. Sentinel NALs are `nal4.7.nal`, `nal6.17.nal`, `nal8.add.nal`, and `nars_transitivity.nal`.
- J2 exit requires no direct `jree` import in its six owned production files, no public J2 declaration leaking jree types, all direct checks and sentinels passing, and one PC full M1 at cluster close. J2 implementation may start only after the J1 close evidence and its remaining process-limit diagnosis are recorded.

### J1 validation checkpoint

- Direct contracts `19/19` passed; non-incremental typecheck, build (`141` source files), and dist API passed.
- Affected NALs `nal1.0.nal`, `nal6.17.nal`, and `toothbrush.nal` passed `3/3`; evidence SHA-256 is `4E4E9C7F030EB7C80E25DA75D6FC18CA41E876A3CB109CDA63BDFBDEA1891442`.
- TS-only M2 passed `493/495` with `2` skips and `0` failures; elapsed `151833.9708 ms`. The duplicate invocation was stopped and is excluded.
- Jree/platform inventories remain `13/41/35/1` and `coreCandidateFiles=11`, `mixedBoundaryFiles=4`, `nodeAdapterCandidateFiles=2`, `browserSourceFiles=2`, `jreeImportFiles=20`; these are remaining owner-cluster work.
- The post-commit PC full M1 close gate completed as one cold TS process with all 245 main resources and `--process-limit-ms 7200000`. The JSONL contains `244 passed` and one `process_limit` for the known 2,001,974-cycle `stability/long_term_stability.nal` sample; there are zero timeout, exception, stall, or not-run records. The required extra `simpleOperationTest.nal` evidence passed separately in `92206 ms`, with peak RSS `340078592` bytes. Full evidence SHA-256 is `68C039636163DFA6AEF62082F6773BB84E8C667B2D3AB52B763951B13F46A813`; extra evidence SHA-256 is `B93A6668AE1DAE385254598C752665800CEF15BF3A5C77DC479380DECD939F27`.

### J2 read-only follow-up (2026-09-28)

- CodeGraph remains indexed and current. The J2 source scan confirms the same six direct imports and no required supporting-cluster production edit; the existing project-owned runtime contracts are sufficient as the migration boundary.
- The J1 full M1 process has exited. Its final classification is `244 passed`, `1 process_limit`, `0 timeout`, `0 exception`, `0 stall`, `0 not_run`; the extra 246th evidence is `passed`. J1 remains open only for a bounded markerless diagnostic and the cluster-close validation plan; J2 production implementation remains paused until that diagnosis is recorded.

### J1 post-M1 diagnosis checkpoint (2026-09-28)

- The bounded single-process markerless diagnostic is complete at commit `7d95bf697396958b04c9d2152eae95ce8951538a`. TS and canonical Java both reached `131072` cycles, `128` windows, and `2279730` events with `incomplete=false`; the comparison is `equal=true` and `first_difference=null`.
- TS exited with code `0`, no signal, and peak RSS `979410944` bytes after `1632775.876 ms`. Java exited with code `0`, no signal, and peak RSS `9019392` bytes after `11395.8333 ms`. The evidence preserves stdout, process metadata, RSS, and comparison hashes under `reports/evidence/j1-markerless-diagnostic-20260928/`.
- The full M1 `process_limit` for `stability/long_term_stability.nal` is therefore classified as a TS resource/performance observation, not a semantic regression, timeout, exception, stall, or not-run result. No JavaRandom or UTF-16 semantic divergence was observed in the diagnostic.
- J1 may proceed to its `--close-cluster` validation plan. J2 production work is unblocked by this diagnosis, but no cluster or stage completion claim is valid until its own gate passes.

### J1 closure state

- Local J1 contracts, build, API, affected NALs, and TS-only M2 are complete; PC full M1 is recorded as `244 passed + 1 process_limit`, with the required 246th evidence passed.
- Supported claim: J1 implementation and local validation are complete; the PC matrix has one explicitly classified process-limit observation; and the markerless TS/Java diagnostic is semantically equal with complete evidence.
- Prohibited claim: J1 cluster-close, 023, 024, zero production jree imports, complete Java M2, or release readiness remain unclaimed until the `--close-cluster` plan and its required matrix pass.

### Spec024 stage-gate recovery checkpoint (2026-09-29)

- Repository HEAD is `5d8cae9` (`test: 统一含Java parity测试加载器`); tracked worktree content is clean and only historical/untracked evidence remains. The browser demo adapter source is at `180924f`.
- Final live-Java M1 evidence is complete: `245` main rows contain `244` functional/parity passes and one `process_limit` observation for `stability/long_term_stability.nal`, with zero timeout, exception, stall, or not-run rows. The required 246th `simpleOperationTest.nal` evidence passed. SHA-256 values are recorded in `reports/probes/20260929-spec024-stage-gate.md`.
- Fixed-loader Java M2 evidence exists at `reports/evidence/stage-java-m2-20260929.tap`; no new Java run is warranted unless the source or runner contract changes.
- `node scripts/checking/classify-change-gate.mjs --stage 024 ...` returns `plan_valid=true`. On this npm version the package script requires a second separator (`npm run validation:plan -- -- --base ...`) for option names to reach the script; this is a CLI forwarding quirk, not a core behavior failure.
- Strict markerless stage evidence is the active experiment. It uses one process per engine, `131072` cycles, `1024`-cycle windows, and a unique evidence prefix for `simpleOperationTest.nal` and `stability/long_term_stability.nal`. Do not update 023/024 status until both comparisons, Java M2, Node, browser, audit, and build gates are complete on one immutable commit.

### Spec024 stage-gate evidence checkpoint (2026-09-29)

- Both strict markerless validations completed on `5d8cae9`. `simpleOperationTest.nal` and `stability/long_term_stability.nal` each reached `131072` cycles and `128` windows with Java/TS `equal=true`, `first_difference=null`, and `incomplete=false`. The long sample's first Java attempt hit a Windows JVM `0xc0000005`; a single retry completed and is the authoritative Java comparison. Raw files and process metrics are under `reports/evidence/spec024-markerless-20260929/`.
- The fixed-loader complete Java M2 rerun passed `496/496`, with the earlier isolated `shell-string-boundary` `0xc0000005` preserved and its `2/2` retry passing. Node CLI, dist API, typecheck, build, demo build/check/unit tests, real browser Worker, final audits and Hanzi encoding check all completed.
- The remaining stage blocker is explicit: `audit:jree` still reports `src/runtime/jree-compat.ts` as the only production direct jree import file (two occurrences). This bridge is reachable by shared core and browser paths, so 023 and 024 must remain `in-progress` until its responsibilities are moved behind project-owned runtime modules or the contract is otherwise closed.
