# J1 Runtime Compatibility Probe

## Checkpoint

- Date: 2026-09-28 (Asia/Shanghai)
- Baseline commit for the implementation batch: `7d95bf697396958b04c9d2152eae95ce8951538a`.
- Worktree: `main` is ahead of `origin/main` by this commit; existing untracked reports and evidence are preserved.
- Environment: `java-master` is a valid junction to `H:\A137442\Develop\AGI\NARS\opennars-304-master`; target contains 4 JARs and 491 NAL files. The frozen Java JSONL is available at the active-goal archive path with SHA-256 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`; `node_modules` is present.
- Discovery tools: CodeGraph is current; LeanSpec board and exact 023/024 searches work. The broad phrase `runtime jree platform neutral` returned no match, which is a query result rather than a tool outage.
- Read-only baseline plan: `npm run validation:plan -- -- --base HEAD --head HEAD --cluster J1-runtime-compat --java-baseline <frozen-jsonl> --expected-baseline-sha256 264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954 --evidence-prefix reports/evidence/pc-goal-stage0-plan-20260928` returned `plan_valid=true`, `T0`, no changed files. Bare `npm run validation:plan` is invalid because the classifier requires `--base` and `--head`; npm on this host requires the documented doubled separator.
- Scope: `J1-runtime-compat` (`src/runtime/**`, `src/util/**`, `src/types.ts`, subject to `scripts/checking/validation-clusters.mjs`).
- This is an investigation checkpoint, not a J1 completion claim.

## Confirmed Findings

- `src/runtime/jree-compat.ts` is the only direct J1 production import boundary for `jree`, but it currently imports `Class`, `JavaObject`, and `java` and contains several distinct compatibility contracts.
- A current AST import scan confirms 13 production files directly import `jree`, distributed across J1/J2/J3/J4/J5 as `1/6/2/0/4`. This is a dependency inventory, not 13 independent migration tasks.
- The bridge currently covers Java string input/value/length/equality/hash behavior, `Double`, Java exception inheritance observations, Java object class markers and identity hash, Java `Random`, insertion-ordered `LinkedHashSet`, Java long representation helpers, logger/decimal formatting/string joiner compatibility, and Node process-backed runtime/exit behavior.
- Bridge exports have cross-cluster consumers: string conversion/input is used by every later cluster; exception compatibility by J2/J3/J4/J5; Java-long and logger APIs by J3/J4/J5; list input by J2/J4; and value comparison by J2/J3. J1 must preserve explicitly identified compatibility entry points until their owning clusters migrate.
- The bridge also applies global or prototype-level behavior for JavaObject `#fqn` and `.class`, exception constructors' `Symbol.hasInstance`, the Random prototype, LinkedHashSet prototype behavior, and `Charset.defaultCharset`. These are migration obligations because they affect callers beyond the bridge module.
- Existing project-owned implementations include `JavaExceptions.ts`, `RuntimeClass.ts`, native collection classes, and `JavaIterator.ts`. Their consumer coverage and contracts still need a complete inventory.
- The direct test entry points named by the cluster map include `runtime-compat.test.ts`, `random-compat.test.ts`, and `native-interface-boundaries.test.ts`; current tests still assert behavior through `jree` and the bridge.
- Later clusters still consume compatibility exports and runtime observations. In particular, native class identity and exception behavior are observed outside J1. Removing bridge side effects before replacement contracts and consumers are ready would make a J1-only change unsafe.
- Candidate project-owned replacements already present include `JavaExceptions.ts`, `RuntimeClass.ts`, `NativeSet/Map/List/Deque/SortedSet`, `JavaIterator.ts`, `Float32.ts`, and `JavaArrays.ts`; existence alone does not establish parity or adequate direct contract tests.
- Runtime, random, and LinkedHashSet tests currently assert several behaviors through `jree`; J1 tests need to exercise the project-owned implementation directly while retaining only compatibility tests that explicitly protect later-cluster callers.
- The active goal and current-status records require one PC full M1 at responsibility-cluster close, TS-only M2 within the cluster, and stage-gated 023/024 completion. PC does not use Termux `M1--`.

## Follow-up Inventory (2026-09-28)

- Re-read this checkpoint after context recovery before continuing J1. Worktree remains `main...origin/main` at `9605701`; all pre-existing untracked report/evidence paths remain present and untouched.
- CodeGraph is available and current (361 indexed files, 6,571 nodes, 25,034 edges). Its first broad query mixed unrelated symbols into the result, so exact source/API scans remain the authority for this inventory.
- The bridge's exported API families are: Java exception re-exports and `isJavaThrowable`/`isJavaException`; Java string/list/char aliases and input conversion; Java-long conversion/arithmetic; boxed-double, logger, decimal-format, runtime-memory, and string-joiner adapters; Java UTF-16 length/equality/hash/value helpers; identity hash; process exit; and Java-style value equality.
- The 13 direct production `jree` import files are exactly `CompoundTerm`, `Sentence`, `Memory`, `Shell`, `NarNode`, `Nar`, `Variables`, `Variable`, `Terms`, `Term`, `Narsese`, `TextOutputHandler`, and `runtime/jree-compat.ts`. Ownership remains 1/6/2/0/4 across J1-J5; the 12 non-bridge imports stay with their owning clusters.
- Most bridge APIs are consumed outside J1. String conversion/aliases and exception observations span language, inference/entity, operator/plugin, and host code; long helpers are used by inference/main; logging and process/memory services reach control/main; identity/string comparison helpers reach language and entity code. These APIs need an explicit compatibility-retention decision per export before any removal.
- Existing project-owned contracts are not equally complete: `JavaExceptions.ts`, native set/map/list/deque/sorted-set, and iterator behavior have direct tests; CodeGraph found no focused coverage for `RuntimeClassToken`/`RuntimeConstructor`. Add a J1-owned test for stable constructor token identity, class name, and `isInstance` before claiming that contract closed.
- J1 owns the bridge file and the runtime helpers under `src/runtime/**`; it does not own the downstream direct imports above. A J1 batch may preserve narrowly documented compatibility exports for J2-J5, but must not claim the corresponding downstream migrations or final 023 jree removal.
- Follow-up consumer tracing confirms Java `Random` calls remain in J2 `CompoundTerm`, J3 inference and `Memory`, and J4 plugin code. A J1-native Random implementation therefore does not permit removing the `jree` Random compatibility patch until those consumers migrate.
- `JavaSystemLoggerCompat` is consumed by control/main/plugin code. `javaSystemExit` belongs to the Shell/host boundary, while `Charset.defaultCharset` is a host-facing compatibility behavior that should remain until J5 owns that migration.
- Searches found no production call sites for `JavaDecimalFormatCompat`, `JavaRuntimeCompat`, or `JavaStringJoinerCompat`; confirm whether these are compatibility-only public exports before deciding to remove or retain them.

## Contract Families To Close In J1

1. Java string representation and UTF-16 code-unit equality, length, comparison/hash helpers where owned by runtime.
2. Java exception class hierarchy and `instanceof` observations without global prototype mutation.
3. Stable project-owned runtime class tokens and identity hash semantics.
4. Java 48-bit seeded random state and exact `next`, `nextInt`, `nextFloat`, and `nextDouble` consumption.
5. Collection equality/hash, insertion order, set/map/list behavior, and iterator removal semantics.
6. Primitive numeric/long representation boundaries and host capability boundaries that belong to runtime.

## Open Checks Before Editing

- Enumerate every production import of `jree-compat.ts`, direct `jree` import, `java.*` type/value use, and which responsibility cluster owns each consumer.
- Compare `JavaExceptions.ts`, `RuntimeClass.ts`, `JavaIterator.ts`, and each native collection against the exact Java/jree contracts currently relied on by production and tests.
- Determine whether J1 can replace the bridge internals while preserving temporary compatibility exports, and list any unavoidable supporting-cluster files before changing code.
- Add direct tests against project-owned runtime APIs; do not treat tests that only compare back to `jree` as sufficient project-owned contract coverage.
- Reproduction history: `reports/evidence/pc-goal-stage0-hotcold-isolated-20260928/process.json` records the full-file invocation at `9605701429b000aa88987e2161d1d1816c22761e`, parent exit `1`, signal `null`, elapsed `16447.8311 ms`, classification `exception`; 26/28 passed, including the named hot/cold test, while two unrelated `ENOENT` cases failed. `reports/evidence/pc-goal-stage0-hotcold-filtered-20260928/process.json` passed but included one other test. The exact anchored test was then run separately and passed, so no further reproduction is a J1 entry condition.
- Exact reproduction completed at `9605701429b000aa88987e2161d1d1816c22761e` using the anchored pattern `^NAL runner keeps hot results isolated from order and cold-process boundaries$`. Exactly one TAP subtest ran and passed; parent exit `0`, signal `null`, classification `passed`, elapsed `8357.1849 ms`, target duration `7278.8513 ms`, stderr empty, peak sampled parent-Node RSS `47,493,120` bytes. The test did not reproduce the Termux nonzero exit. Evidence directory: `reports/evidence/pc-goal-stage0-hotcold-exact-20260928/`; `process.json` SHA-256 `D06FE9FB64454E40E971CA116AFDCEB222315DE4B729977CD09751B1FD8709D1`, `stdout.log` SHA-256 `22A3E5DADD8C0AC32C8B31782DCDE65C1B322C2022E4A735F62F8D61DBB88F35`, `stderr.log` SHA-256 `E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855`, `rss.log` SHA-256 `D34D08EABF21031E6EF7A2713330F95BAD9690250D208B835E0523B05329FF91`, `progress.log` SHA-256 `CF9C0FD448EC94D2CA41BBA79669337218FF78F0388EA29FBB02B7A553DC8604`.

## Implementation Plan

1. [x] Finish the one-test hot/cold reproduction and retain the original evidence directories.
2. [x] Reconcile the AST import distribution, cross-cluster bridge consumer families, and bridge-level side effects into this checkpoint. Treat the 13 imports as cluster-owned edges, not 13 tickets.
3. [x] Finish the per-export consumer/owner/removal matrix, including Random's J2/J3/J4 callers, logger consumers in control/main/plugin, Shell ownership of process exit, J5 ownership of default Charset, and compatibility-only candidates without production call sites.
4. [x] Compare each J1-owned runtime type and collection with Java and production caller contracts. Mark each `replace in J1`, `preserve as compatibility API for a later cluster`, or `requires an explicitly bounded supporting-cluster edit`.
5. [x] Read this plan again after the API/contract matrix is complete. The matrix is sufficient to implement J1 as one cohesive runtime batch: project-owned contracts and direct tests, removal of J1-owned runtime dependencies, plus only the compatibility updates needed to keep downstream callers type-safe. Do not claim J2-J5 or 023 completion from a J1 batch.
6. [x] Run the relevant direct contracts, non-incremental typecheck, build, dist API check, migration/jree/platform audits, TS-only M2, and the J1 affected NAL set. Resolve failures before J1 closure; the sole J1 M1 is the PC full M1 with all 245 main resources plus the extra project test required for 246/246 evidence.
7. [x] Record exact evidence, remaining audit hits by owning cluster, claims supported, prohibited claims, and the next falsifiable experiment in this checkpoint before moving to J2.

## Next Experiment

The export/side-effect/consumer matrix is complete and has been re-read after context recovery. The J1 batch is now ready for one cohesive implementation pass. The bridge will keep only compatibility behavior that has a live downstream owner; project-owned contracts will be tested directly.

## Implementation checkpoint (2026-09-28)

- Existing `NativeSet`, `NativeMap`, `NativeList`, `NativeDeque`, `NativeSortedSet`, `JavaIterator`, and `JavaExceptions` provide the right ownership boundary; this batch strengthens observable Java contracts rather than introducing a second collection hierarchy.
- `RuntimeClassToken` already caches by constructor and supports `isInstance`, but its constructor type is private and its direct identity/name/instance contract has no focused test. The batch will export the constructor type needed by public callers and add that direct test.
- `jree-compat.ts` is the remaining J1 runtime dependency because it imports `Class`, `JavaObject`, and `java`. The batch will move the exact 48-bit LCG into `JavaRandom.ts`, keep a narrow prototype adapter only for downstream J2-J4 consumers, and leave host-facing logger/exit/Charset compatibility untouched.
- String helpers must accept native strings and jree-like `length()/charAt()` values without changing Java UTF-16 code-unit semantics. `toJavaString` remains a downstream compatibility return boundary until J2/J5 migrate its callers.
- Long helpers must reject unsafe numeric values instead of silently producing lossy bigint conversions; safe integer numbers remain supported for the current translated clock representation.
- No supporting-cluster production edit is required to land this batch. Downstream Random consumers continue to work through the temporary adapter, so their migration remains explicitly outside J1.

## Export / Consumer / Removal Matrix

| API or side effect | Current consumers | Owner | J1 action | Removal condition |
| --- | --- | --- | --- | --- |
| `JavaStringInput`, `JavaString`, `JavaCharSequence`, `toJavaString`, UTF-16 length/equality/hash/value | language, parser, inference, operator, main, IO, public interfaces | J1 contract; downstream callers J2-J5 | Preserve a structural boundary and normalize to native UTF-16 strings where possible | J2/J5 public and parser signatures no longer accept jree boxed strings |
| Java exception classes and `isJavaThrowable` / `isJavaException` | language, inference, operator, plugin, main | J1 defines hierarchy; callers remain cross-cluster | Keep project-owned hierarchy and temporary jree `instanceof` observation | All producer/catcher sites use `JavaExceptions.ts` and no test observes jree inheritance |
| `RuntimeClassToken` / `RuntimeObject` | event, entity, language, storage, main, plugin | J1 | Keep project-owned token identity; add direct stable identity/name/`isInstance` coverage | No remaining production class-identity path depends on jree `Class` |
| `JavaLongInput` and long arithmetic helpers | inference, control, main, entity | J1 boundary with J3/J5 consumers | Preserve bigint/number representation bridge; no domain rewrite in J1 | J3/J5 use one project-owned long representation at all public boundaries |
| `JavaDoubleCompat` | `Nar` configuration path and metrics tests | J1 compatibility | Keep native boxed-number replacement and direct contract | Nar configuration no longer needs Java boxed numeric semantics |
| Random LCG behavior | `CompoundTerm`/`Variables` (J2), `Memory` (J3), plugin code (J4), tests | J1 implementation, consumers later | Add project-owned `JavaRandom`; retain narrow jree prototype patch for current callers | J2/J3/J4 signatures and construction use `JavaRandom` exclusively |
| LinkedHashSet insertion-order patch | translated callers and tests outside J1 | J2/J3 | Preserve temporary patch; do not claim collection migration | All domain sets use `NativeSet`/`NativeSortedSet` and no jree LinkedHashSet is constructed |
| `JavaSystemLoggerCompat` | control, inference, main, plugin | J3/J4/J5 host-facing logging | Preserve compatibility adapter | Each owner routes logging through project host adapter |
| `javaSystemExit` | `Shell` and CLI host | J5 | Preserve; J1 must not alter process ownership | Shell/CLI owns exit through host adapter |
| `Charset.defaultCharset` patch | jree `PrintStream`/file output path | J5 | Preserve host workaround | J5 removes jree output classes or supplies a native encoding adapter |
| `JavaDecimalFormatCompat`, `JavaRuntimeCompat`, `JavaStringJoinerCompat` | no production callers; metrics/import tests only | J1 compatibility surface | Keep tested exports, remove no API in this batch | Public API audit proves they are not exported/needed, followed by explicit cleanup |
| `JavaIterator` and native collections | runtime and J2/J3/J5 migrated slices | J1 | Keep and strengthen direct iterator/equality/hash contracts | All remaining jree collection construction is migrated by owning cluster |

## J1 Batch Boundary

The batch owns `src/runtime/**`, `src/types.ts`, and `src/util/**` only. It may add direct runtime tests and narrow compatibility types. It does not edit downstream Random consumers, Shell, logger users, Charset users, or the twelve non-bridge direct `jree` imports; those remain visible as J2-J5 audit work.

## Implementation checkpoint (2026-09-28, resumed)

- Production edits currently present: `src/runtime/JavaRandom.ts`, `src/runtime/JavaExceptions.ts`, `src/runtime/RuntimeClass.ts`, and `src/runtime/jree-compat.ts`.
- Constructor cause state is closed: zero/one-argument constructors use the uninitialized sentinel, an explicit `null` cause is initialized, and a second `initCause` throws `JavaIllegalStateException`.
- Direct contracts for JavaRandom seeded sequences and validation, RuntimeClassToken identity/name/instance behavior, safe Java-long rejection, UTF-16 boundaries, and Throwable suppressed snapshot/cause lifecycle are present and passing.

## Validation checkpoint (2026-09-28)

- Direct J1 contracts: `19/19` passed across `java-exceptions.test.ts`, `random-compat.test.ts`, `runtime-compat.test.ts`, and `native-interface-boundaries.test.ts`.
- Non-incremental typecheck: passed with `0` diagnostics.
- Build: passed, `141` source files emitted. Dist API: passed with `cycles=2`, `cycleEnds=2`, `outputSignals=1`, `stopped=true`.
- Migration scan completed without a J1-local error. Jree audit remains `directJreeImportFiles=13`, `highRiskItems=41`, `semanticReviewItems=35`, `candidateNativeItems=1`; these are remaining cross-cluster inventory, not J1 failures. Platform audit remains `coreCandidateFiles=11`, `mixedBoundaryFiles=4`, `nodeAdapterCandidateFiles=2`, `browserSourceFiles=2`, `jreeImportFiles=20`.
- Affected NAL set: `nal1.0.nal`, `nal6.17.nal`, `toothbrush.nal` passed `3/3`, `0` failed, `0` timeout, `0` process-limit, `0` stall. Evidence: `reports/evidence/pc-goal-j1-affected-nal-20260928.jsonl`, SHA-256 `4E4E9C7F030EB7C80E25DA75D6FC18CA41E876A3CB109CDA63BDFBDEA1891442`.
- TS-only M2: `495` total, `493` passed, `2` skipped, `0` failed, `0` timeout, `0` process-limit, `0` exception, `0` stall; elapsed `151833.9708 ms`. A duplicate invocation was stopped before completion and is excluded from evidence.
- The J1 batch changes only `src/runtime/**` plus direct runtime tests and planning memory. The bridge retains compatibility behavior required by J2-J5; the 13 direct jree files and 41/35/1 inventory remain open under their owning clusters.

### Post-commit full M1 result (2026-09-28)

- The single PC full M1 process completed from the unique checkpoint `reports/evidence/pc-goal-j1-full-m1-20260928.jsonl` using cold TS, all 245 main resources, and `--process-limit-ms 7200000`.
- Aggregate classification is `244 passed`, `1 process_limit`, `0 timeout`, `0 exception`, `0 stall`, `0 not_run`. The only process-limited record is `stability/long_term_stability.nal`, which observed `2,001,974` cycles and last progress at cycle `513089` before the 7,200,000 ms safety limit. This is a process-limit/performance observation, not a semantic regression claim.
- Full JSONL SHA-256: `68C039636163DFA6AEF62082F6773BB84E8C667B2D3AB52B763951B13F46A813`.
- The required extra 246th evidence `reports/evidence/pc-goal-j1-extra-simple-20260928/simpleOperationTest.jsonl` passed with `1/1`, `92206 ms`, and peak RSS `340078592` bytes. SHA-256: `B93A6668AE1DAE385254598C752665800CEF15BF3A5C77DC479380DECD939F27`.

### Supported claims

- The project-owned JavaRandom LCG, JavaThrowable cause/suppressed lifecycle, RuntimeClassToken identity, safe numeric long boundary, and UTF-16 string helpers have direct project-owned tests and pass the J1 local validation set.
- J1 local build, API, M2, audits, and three affected NALs pass against frozen baseline SHA `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`.
- The PC full M1 result is fully accounted for as `244 passed + 1 process_limit`, and the extra 246th evidence passed.

### Prohibited claims

- J1 is not yet cluster-closed: the full M1 contains one explicitly classified process-limit result, and the bounded markerless diagnosis plus close-cluster plan still need to be recorded.
- This checkpoint does not claim J2-J5 completion, stage 023/024 completion, zero production jree imports, complete M1/M2 with Java, markerless long-cycle equivalence, or release readiness.

### Next falsifiable experiment

- Completed the single-process markerless stage digest at `131072` cycles with `--skip-embedded --window-size 1024` for both TS and canonical Java at commit `7d95bf697396958b04c9d2152eae95ce8951538a`. Both sides reached `131072` cycles, `128` windows, and `2279730` events with `incomplete=false`; comparison is `equal=true`, `first_difference=null`.
- TS process metadata: exit code `0`, signal `null`, elapsed `1632775.876 ms`, peak RSS `979410944` bytes. Java process metadata: exit code `0`, signal `null`, elapsed `11395.8333 ms`, peak RSS `9019392` bytes. The full stdout/stderr/process/RSS/comparison evidence is in `reports/evidence/j1-markerless-diagnostic-20260928/`.
- Evidence hashes: TS stdout `17585DC92E0658513EE963D1F90E5469CB713CD0B840F662431FCF5B3736473F`; TS process `62AFE64B0C35A3121A8BBACDD802DD2107A5D908F6AB6799A4CDBFE57A81959A`; Java stdout `B4BBD998D831173EFD063915DF7A8336464923D829DE3DE86F9E953542C34875`; Java process `2F03F2ED7FB66188400B4D68C710AC4B20F38394857403C83D62B886F4F5BE54`; comparison `FE5D951C031772C2EBF08D947FEF80D9E79BF0E23D232826BE0F7984AFDE19`.
- Classification: the M1 `process_limit` is a TS performance/resource observation. It is not a timeout, exception, stall, not-run result, or semantic regression. No JavaRandom or UTF-16 helper divergence was observed. J1 is ready for the close-cluster plan; J2 production implementation may start after that plan is accepted.
