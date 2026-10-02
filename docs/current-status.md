# OpenNARS-304-ts Current Status

Status date: 2026-10-03 (Asia/Shanghai)

This file is the current handoff. Historical detail moved to [archive/current-status-history-20261002.md](archive/current-status-history-20261002.md); raw test evidence remains under `reports/evidence/` and is never treated as disposable output.

The expanded current objective and acceptance boundaries are in [active-goal-20261002.md](active-goal-20261002.md).

## Current Position

Last fully protected **core** production commit: `708afc5`, which adds a name prefilter only for the project's standard `Term`, `CompoundTerm` and `Variable` equality methods. Its fixed-input 20/30-tick RPS improved about 8.5–15% against the prior candidate with identical final concept counts; this is a short Node workload. Direct contracts `21/21`, TS-only M2 `511 passed / 2 skipped`, Java M2 `513/513`, nonincremental typecheck, build/dist API and static audits pass. On the same production commit, M1′ body `243/243`, #25/#246 and reduced #245 65536 pass, and both strict markerless samples reached 131072 cycles with Java-equal digests. M1′ body peak RSS was `856879104 bytes`; original 2,000,000-cycle stability remains `not_run`. M1′ body summed duration `693624 ms` versus `665581 ms` on the previous candidate, so the short-workload gain cannot be generalized to all NAL. Current Worker Chrome 30-second **sync** samples still miss sustained Demo targets: Microworld `12.57 TPS` average and `2.79 TPS` final five-second window; CartPole `2.23 TPS` average and `1.59 TPS` final window, with no NARS non-babble operation in these samples. Demo `npm run check` and real Chrome smoke pass. An async scheduler defect was fixed in Demo commits `25d0bac` and `278956f`: CartPole now sustains `19.95` world TPS while completing only `720` NARS cycles/30 seconds (`23.94 wall RPS`), so this is not a reasoner speedup. Performance convergence and fix release remain open. Source identities, SHA-256 values and classifications are in [the current Bag probe](probes/20261002-bag-term-equality.md).

```text
v1.0.4 release (44e937b)
        |
        +-- ce448b6  midterm protection and push (origin/main)
        +-- 17b5fb2  Bag restored-key scan allocation reduction
        +-- 41070c1  Bag concrete Term class fast path
        +-- 82469cc  Bag concrete Term index; M1'/M2 protected
        +-- 33125d4  M1' validation type declaration fix
        +-- 708afc5  standard Term name prefilter; core gates passed
        +-- edd4036  current goal and gate clarification (docs only)
        |
        v
  current Worker browser recheck -> further measured optimization -> fix release
```

## Confirmed

- Production `src` has zero direct npm `jree` imports, zero `java.lang`/`java.util` code hits after comment stripping, and the current audit reports `0/0` direct imports/occurrences.
- Core text rendering no longer uses private one-shot `StringBuilder` objects. Sentence output uses native fragments plus `join`; `TruthValue` returns formatted text directly.
- Internal exact class comparisons use `constructor ===`; event identity uses constructor keys through `ClassKey` and `getClass(object)`. The old `ClassToken` object and WeakMap cache are gone from production.
- Safe iterator call sites in `TaskLink` and `Bag` use native iteration. Mutable `remove`/fail-fast contracts remain in explicit collection boundaries.
- Full TS-only M2 on current production: `511 passed / 2 skipped / 0 failed`. Full Java M2: `513/513 passed`.
- Focused event/runtime contracts after constructor identity: `30/30`; focused iterator/container contracts: `33/33`.
- Dist API, typecheck, build and jree audit pass on the current source line.
- At `17b5fb2`, Bag's read-only restored-key scan avoids per-entry wrappers. Two fixed-input A/B runs improved RPS by about 24–25% without changing fallback equality or insertion order. TS-only M2 `506/508` (2 skipped), Java M2 `508/508`, 28 direct Bag/Map contracts, build and dist API passed.

## Protected Evidence

- M1' `m1prime-compound-constructor-20261002.jsonl`: `243/243` passed with zero failure, timeout, process_limit, exception, stall or not_run rows.
- Extra `nars_multistep_3.nal` and `simpleOperationTest.nal`: `2/2` passed in `m1prime-compound-extra-20261002.jsonl`.
- Candidate `CompoundTerm.equals` A/B: baseline `2.594 RPS`, candidate `3.661 RPS`, candidate peak RSS `330358784`; committed at `445d873`.
- Evidence hashes: M1' `F14E70676275EA41D73D5B2F5CD0F6765E6E6CAB9E0DFA23A885EF6C7121361F`; extra `4502E4A90054ED5B8D45D41BA79C2DF2DBE08B98D51BC559E1D4B227DDACED2A`; jree audit `69AF5E37833B13BFD0E5CF35521C10CB6743CEF9F648A2CE496B3F2864F3A028`; platform audit `DD7271085CA252DE0E1BAB586206EBABA41517BBAB15B5FD03BED96E30E4301D`.
- Historical 50-tick demo probe at `01f08e6`: `3.720 RPS`, median step `2004 ms`, p95 `6759 ms`, peak RSS `333123584`; first segment TPS `1.319`, later segments below `0.5`. Concept count grew `1025 -> 3731`.
- `17b5fb2` M1′ body `243/243`, #25 `1/1`, #246 `1/1`; reduced #245 65536 fixture `1/1` at `180667 ms` and peak RSS `388861952` bytes. Both strict markerless samples reached 131072 cycles and match frozen Java digests. See [the current probe](probes/20261002-performance-next-batch.md) for source SHA, classifications, baseline hashes and raw files.

## Spec / Gate State

```text
023/024/025/027/031/036 board state: complete in LeanSpec history,
but final claims are limited by the current immutable evidence and this handoff.

020/027/031 LeanSpec board state: complete in historical spec records
Current performance convergence goal (042): active; `708afc5` core gate passed, Chrome functional smoke passed, Demo TPS/operation and further convergence remain
Original 2,000,000-cycle stability workload: not claimed (device resource limit)
M1' on `708afc5`: 243/243 + extra 2/2, reduced #245 and strict markerless passed
M2 on `708afc5`: TS-only 511/513 (0 failed, 2 skipped); Java 513/513
Demo TPS target 20 / sync target 15: not achieved; concept growth and GC tails remain
```

## Evidence Commands

```powershell
npm run typecheck
npm run build
npm run test:unit:serial
npm run test:unit:with-java
npm run test:api:dist
npm run audit:jree
node scripts/e2e/run-demo-workload-benchmark.mjs --cycles 10 --ticks 50 --report-every 10 --output <unique-evidence>.json
```

M1' command used for this protected candidate:

```powershell
node scripts/e2e/run-nal-corpus.mjs --engine ts --java-baseline <frozen-g0-jsonl> --all --m-minus --chunk-size 1 --cycles 1550 --timeout-ms 180000 --process-limit-ms 3600000 --ts-mode cold --resource-metrics --result-file reports/evidence/m1prime-compound-constructor-20261002.jsonl --summary
```

The frozen baseline is outside the repository at `H:\A137442\Develop\AGI\NARS\_Project\OpenNARS-304-ts-evidence-archive\g0-java-baseline-frozen-26772af-20260917.jsonl`, SHA-256 `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`.

## Handoff Rules

- Do not delete historical evidence, crash logs, or the archived status file without an explicit retention decision.
- Do not claim 031, complete M1, original long stability, TPS targets, or release readiness from M2 alone.
- Keep long tests single-process with unique evidence prefixes and checkpoints. Resume the same result file after interruption.
- After M1' terminates: classify every row (`passed`, `failed`, `skipped`, `timeout`, `process_limit`, `exception`, `stall`, `not_run`), then commit or revert the candidate based on parity and performance evidence.

## Next Actions

1. Profile the actual synchronous Worker after concept growth, or build an equal-input Node harness; the current simplified Node 60-tick profile reaches fewer concepts and cannot explain the browser long tail by itself.
2. Continue measured core/Demo optimization until the stated TPS target or a valid three-round sub-5% convergence proof. Rerun final gates for any new core change and verify NARS non-babble actions.
3. Update Pages and prepare the fix release only after the final protected candidate and Demo acceptance.
