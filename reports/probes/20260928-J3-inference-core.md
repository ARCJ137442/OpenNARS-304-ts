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
