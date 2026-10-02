# OpenNARS-304-ts Current Status

Status date: 2026-10-02 (Asia/Shanghai)

This file is the current handoff. Historical detail moved to [archive/current-status-history-20261002.md](archive/current-status-history-20261002.md); raw test evidence remains under `reports/evidence/` and is never treated as disposable output.

## Current Position

```text
v1.0.4 release (44e937b, origin/main)
        |
        +-- 148149b  template-string cleanup
        +-- fd4735b  native sentence/truth rendering
        +-- a033cfa  constructor identity + native event keys
        +-- 01f08e6  safe iterator call-site reduction
        +-- 445d873  CompoundTerm constructor equality optimization
        |
        +-- code clean; M1' candidate evidence complete
        v
  performance / Java-shape cleanup -> M1' -> neat-freak midterm save -> push/tag
```

## Confirmed

- Production `src` has zero direct npm `jree` imports, zero `java.lang`/`java.util` code hits after comment stripping, and the current audit reports `0/0` direct imports/occurrences.
- Core text rendering no longer uses private one-shot `StringBuilder` objects. Sentence output uses native fragments plus `join`; `TruthValue` returns formatted text directly.
- Internal exact class comparisons use `constructor ===`; event identity uses constructor keys through `ClassKey` and `getClass(object)`. The old `ClassToken` object and WeakMap cache are gone from production.
- Safe iterator call sites in `TaskLink` and `Bag` use native iteration. Mutable `remove`/fail-fast contracts remain in explicit collection boundaries.
- Full TS-only M2 on the selected line: `506/508`, `0 failed`, `2 skipped`. Full Java M2: `508/508`.
- Focused event/runtime contracts after constructor identity: `30/30`; focused iterator/container contracts: `33/33`.
- Dist API, typecheck, build and jree audit pass on the current source line.

## In Flight

- M1' `m1prime-compound-constructor-20261002.jsonl`: `243/243` passed with zero failure, timeout, process_limit, exception, stall or not_run rows.
- Extra `nars_multistep_3.nal` and `simpleOperationTest.nal`: `2/2` passed in `m1prime-compound-extra-20261002.jsonl`.
- Candidate `CompoundTerm.equals` A/B: baseline `2.594 RPS`, candidate `3.661 RPS`, candidate peak RSS `330358784`; committed at `445d873`.
- Evidence hashes: M1' `F14E70676275EA41D73D5B2F5CD0F6765E6E6CAB9E0DFA23A885EF6C7121361F`; extra `4502E4A90054ED5B8D45D41BA79C2DF2DBE08B98D51BC559E1D4B227DDACED2A`; jree audit `69AF5E37833B13BFD0E5CF35521C10CB6743CEF9F648A2CE496B3F2864F3A028`; platform audit `DD7271085CA252DE0E1BAB586206EBABA41517BBAB15B5FD03BED96E30E4301D`.
- 50-tick current demo probe at `01f08e6`: `3.720 RPS`, median step `2004 ms`, p95 `6759 ms`, peak RSS `333123584`; first segment TPS `1.319`, later segments below `0.5`. Concept count grows `1025 -> 3731`.

## Spec / Gate State

```text
023/024/025/027/031/036 board state: complete in LeanSpec history,
but final claims are limited by the current immutable evidence and this handoff.

020 performance/release: in progress
Original 2,000,000-cycle stability workload: not claimed (device resource limit)
M1' on current candidate: 243/243 + extra 2/2 passed
M2 on selected candidate: TS-only 506/508 (0 failed, 2 skipped); Java 508/508
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

M1' command currently in flight:

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

1. Keep the selected candidate protected by the committed M1'/M2/audit evidence.
2. Continue the next mutable-iterator and GC/state-growth performance batch.
3. Update the demo repository and release package only after the next selected candidate passes the same gates.
