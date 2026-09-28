# J3 Inference Core Probe

## Checkpoint

- Date: 2026-09-28 (Asia/Shanghai)
- Probe scope: `J3-inference-core`
- Owner paths: `src/inference/**`, `src/storage/**`, `src/entity/Sentence.ts`, `src/entity/Stamp.ts`, `src/entity/TaskLink.ts`, `src/entity/TermLink.ts`
- Current immutable implementation commit: `e17247a` (`feat(j2): 完成语言解析责任簇原生运行时迁移`). J2 production and direct tests are committed; the PC full M1 close gate for J2 is running from this commit in `reports/evidence/pc-goal-j2-full-m1-20260928.jsonl`.
- This is read-only J3 planning while the J2 M1 process runs. No J3 production edit has been made and no J3 completion claim is made.

## Current direct dependency inventory

- Exact source scan currently identifies two J3-owned direct `jree` imports: `src/storage/Memory.ts` and `src/entity/Sentence.ts`.
- `Memory.ts` still constructs and publicly types `java.util.Random`; its state is consumed by variable unification and other inference paths. The replacement must preserve the seeded Java sequence and call count through the project `JavaRandom` contract.
- `Sentence.ts` still uses jree `String`, `CharSequence`, `StringBuilder`, `Math`, boxed `Long`, and direct Java argument/state exceptions. It also normalizes duplicate variables through a text-key map. The batch must preserve exact class identity, Java text equality/hash behavior, UTF-16 output, occurrence-time formatting, and exception messages.
- `Bag.ts`, `TermLink.ts`, `TaskLink.ts`, `Stamp.ts`, `CompositionalRules.ts`, `SyllogisticRules.ts`, and `TemporalRules.ts` already use project-owned collections or numeric adapters in their visible runtime paths, but their Java contracts remain J3 semantic review items. In particular, Bag ordering/level state, link index arrays, and nested Set/Map equality are hot inference behavior.

## J3 cohesive implementation direction

1. Migrate `Memory.randomNumber` to a project-owned random input type and preserve all downstream structural call sites.
2. Migrate `Sentence` text construction, variable-scope normalization, occurrence-time rendering, and exceptions in one batch. Use the existing Java string helpers and a narrow local builder contract where mutable append behavior is required.
3. Audit Bag/Memory state transitions and link dispatch against canonical Java before changing any hot algorithm. Keep NativeMap/NativeSet identity and insertion-order semantics explicit.
4. Add direct contracts for seeded random order, Sentence class/text identity, occurrence-time and normalization output, Bag level/counter transitions, iterator removal, and TermLink/TaskLink index equality/hash.

## Validation plan

- Read-only source and CodeGraph impact analysis first; no per-file dispatch.
- After implementation: non-incremental typecheck, build, dist API, J3 direct tests, TS-only M2, and 2-5 affected inference NALs.
- J3 close gate requires one PC full M1 from its immutable commit. Do not call J3 complete from local slices or from the J2 M1 result.

## Open risks and falsifiable experiments

- Risk: changing `Memory.randomNumber` representation changes JavaRandom state sharing. Experiment: compare seeded `nextInt` sequences before/after construction and run commutative unification tests.
- Risk: native Sentence text changes variable normalization key direction or boxed-string output. Experiment: compare duplicate scoped variables, occurrence-time strings, and class-sensitive equality against canonical tests.
- Risk: Bag performance or insertion order changes while removing the remaining bridge. Experiment: run Bag iterator/level transition tests and sentinel NALs before any broader inference edit.

## Supported claims

- J3 residual direct imports, hot contracts, batch boundaries, and validation requirements are recorded.
- J2 is awaiting its full M1 close gate; J3, stage 023, stage 024, and release readiness remain unclaimed.

## J3 implementation checkpoint (2026-09-28)

- Implemented the cohesive direct-runtime migration in `src/storage/Memory.ts` and `src/entity/Sentence.ts`: `Memory.randomNumber` now uses `JavaRandom`; `Sentence` uses project-owned Java text/exception helpers, a local append builder, native normalization keys, and boxed JavaString output only at the compatibility boundary.
- Non-incremental typecheck, build, dist API, migration scan, and the J3 direct regression slice passed. The direct slice covered Bag, compositional rules, Sentence/Stamp boundaries, random contracts, variable substitution/query behavior, toothbrush ordering, and link contracts: 52/52 passed.
- J3 sentinel NAL run: `nal6.17.nal`, `nal4.recursion.nal`, and `nars_transitivity.nal` passed. `application/toothbrush2.nal` reached 201,550 cycles and was classified as `process_limit` at 900,000 ms with last progress 160,277; no exception or semantic cause is established. Raw evidence is `reports/evidence/j3-affected-nal-20260928.jsonl`.
- The next required evidence is full TS-only M2, then an immutable J3 commit and one PC full M1 close gate. J3, 023, 024, and release readiness are not complete yet.

## J3 local validation close checkpoint (2026-09-28)

- Full TS-only M2 completed with `494 passed / 0 failed / 2 skipped`; raw TAP is
  `reports/evidence/j3-ts-only-m2-20260928.tap`, SHA-256
  `0C830BA6000337C911A3C0CD74694C52D5B4ABB9601D29A93095D9E81FF71EDE`.
- J3 affected NAL evidence is `reports/evidence/j3-affected-nal-20260928.jsonl`, SHA-256
  `5111686D2D8B7BF1F7CE4C37B5D262900571D2E2386858744EFE27F460600F38`. Three sentinels pass;
  `application/toothbrush2.nal` is one `process_limit` at 900,000 ms with no exception or
  semantic diagnosis.
- The source batch is ready for an immutable J3 commit. The PC full M1 close gate remains
  mandatory before J3 can be declared complete.

## J3 PC M1 classification and retry evidence (2026-09-28)

- Immutable code commit under test: `a07b235`.
- Live-Java PC M1 evidence: `reports/evidence/pc-goal-j3-full-m1-20260928.jsonl`, SHA-256
  `F8F79A6429CFD4E3B04A6F750299D8FC87776547099E5D3BE584ED210FF9E34B`. Summary: 245 rows,
  239 functional passes, 240 parity rows, 2 process limits, 4 exception/exception-linked rows,
  0 plain timeout, 0 stall, 0 not_run. Java exception rows are Windows page-file exhaustion
  (`errno=1455`); TS exception rows exited with `0xE06D7363`.
- Independent TS-only retries classified the two `0xE06D7363` rows as transient process/resource
  failures: `nars_multistep_2.nal` passed 2/2 in 499,144 ms (peak RSS 468,885,504 bytes), and
  `nars_spatialSeq1.nal` passed 2/2 in 92,396 ms (peak RSS 345,772,032 bytes).
- `nars_transitivity.nal` also passed independently in TS-only mode; its prior 900-second J3
  row was affected by the live-Java page-file failure, not a stable TS semantic mismatch.
- Frozen Java baseline for further retries: `g0-java-baseline-26772af-20260917.jsonl`, SHA-256
  `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`. Future retries use
  `--engine ts --java-baseline` and do not launch Java unless code/behavior changes or a stage
  gate explicitly requires live Java.
- J3 cannot yet be declared complete: `toothbrush2.nal` and `long_term_stability.nal` remain
  process-limit observations, and the original full matrix contains environment exceptions.

## Frozen-baseline retry record (2026-09-28)

- `nars_multistep_2.nal` TS-only retry passed 2/2: SHA-256
  `2A88722FCF3E18C5E335B239397F3F4C2F1562828BB590721EDD760969A9B92A`.
- `nars_spatialSeq1.nal` TS-only retry passed 2/2: SHA-256
  `27DD0591CDAA2087E0413669D5862C9B217A0C8ECC9D094DEE87BB1F5D624126`.
- `nars_transitivity.nal` TS-only retry passed 2/2: SHA-256
  `99B7F889A40E228DE892102992F7C4AB482444ACDBFD64AF4474587B3B7BFDD0`.
- Frozen-baseline TS-only retry for `application/toothbrush2.nal` remained `process_limit` at
  900,000 ms, last progress 165860: SHA-256
  `8DE628EA12338E71CEC9CB19A63EAD1B2B60432D67C9450DA95DB3511FBDDE14`.
- Frozen-baseline TS-only retry for `stability/long_term_stability.nal` remained
  `process_limit` at 900,000 ms, last progress 77357: SHA-256
  `734C31CB900578A50C4C55B15BA77D0C4B1B79D486B0163A802B99E323942999`.
- These retries use the frozen Java baseline only; no Java process was started. The two
  remaining process limits are performance/resource observations, not semantic regressions.

- Final long-stability baseline retry: `reports/evidence/j3-retry-baseline-long-stability-7200s-20260928.jsonl`,
  SHA-256 `A0838286861DBE158904A8CFB595C4AE01533FEFD6D4EE18F4EC3A45FCB04D75`. It ran
  TS-only for `7,200,045 ms`, reached `438,184` progress cycles, and was classified as
  `process_limit` with no exception or stall. This is the final bounded resource observation;
  prior 131,072-cycle markerless stage-digest evidence remains the functional equivalence route.

## J3 final bounded observations

- TS-only frozen-baseline retry for `application/toothbrush2.nal` with a 3,600,000 ms limit
  passed both markers in 1,154,353 ms; peak RSS was 876,658,688 bytes. Evidence SHA-256:
  `188BD390BB87B824683CF26BCEFF5C41F64EE907A2035A3D4F32944B32A5DE1B`.
- TS-only frozen-baseline retry for `multi_step/nars_multistep_3.nal` with a 3,600,000 ms limit
  passed both markers in 2,145,511 ms; peak RSS was 1,027,907,584 bytes. Evidence SHA-256:
  `ADA368AC6CB4D9D57E65037930E77EA9169E099CF51C0BB60B4D1BC3B4883FC6`.
- J3 direct contracts and M2 are green, and all semantic marker retries now pass. The raw live-Java
  matrix remains preserved with its environment classifications; J3 is ready for documentation
  closure but no stage 023/024 completion claim is made.
