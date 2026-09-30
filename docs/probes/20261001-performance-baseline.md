# Native runtime performance round 1

## Baseline

Commit `c84a1ab` on Node `v22.17.0`, Windows x64.

- In-process RPS: median `3843.848 cycles/s`, p05 `1451.295`, median latency `23.463 ms`, p95 `63.091 ms`, peak RSS `258998272` bytes.
- Demo CartPole workload, 50 ticks / 10 cycles per tick: `2.721 RPS`, median step `2730.790 ms`, p95 `9512.974 ms`, peak RSS `351440896` bytes, final concepts `3731`.
- M3 four workloads: functional/parity all true. TS/Java wall ratios were `1.760x` (`nal8.add`), `7.616x` (`nars_multistep_1`), `4.071x` (`toothbrush`) and `6.155x` (`nal4.recursion.small`).

Raw files: `reports/evidence/rps-native-baseline-20261001.json`, `reports/evidence/demo-workload-native-baseline-20261001.json`, `reports/evidence/m3-native-baseline-20261001.json`.

## Round 1 candidate

The candidate caches Java-compatible text hashes for immutable `NativeJavaString` values and fast-paths native boxed string observation. Mutable `Term`/`CompoundTerm` names and object-key `NativeMap` hashes are deliberately not cached because translated code can mutate those structures in place.

Exploratory result on the same working tree before commit:

- In-process RPS: median `4048.927 cycles/s`, p05 `1511.234`, median latency `24.369 ms`, p95 `60.842 ms`, peak RSS `260366336` bytes, approximately `+5.3%` median cycles/s.
- Demo workload: `2.951 RPS`, median step `2620.048 ms`, p95 `8816.522 ms`, peak RSS `385564672` bytes, approximately `+8.5%` RPS. Concept growth remained `1025 -> 3731`; this round does not solve state-growth/GC tails.
- M3 functional/parity remained true; ratios were `1.740x`, `7.669x`, `4.213x`, and `5.846x` in the same file order.

## Rejected round 2 candidate

The symmetric-equals single-dispatch fast path was measured at `4032.567 cycles/s` median, below round 1's `4048.927 cycles/s` median. It was reverted in `2ec3b5a`; the raw rejected sample is `reports/evidence/rps-native-opt2-20261001.json`. The fallback direction and asymmetric equality behavior remain unchanged.

The mutable hash-cache candidate initially caused `nars_transitivity.nal` to miss its second marker after 211550 cycles. Removing it restored parity (`1/1`) in `reports/evidence/perf-opt1-transitivity-retry-20261001.jsonl`. The safe immutable-string subset measured `4366.278 cycles/s` median; raw evidence is `reports/evidence/rps-native-safe-string-20261001.json`.

The candidate still requires full serial M2 and the appropriate NAL/M1-prime protection before being accepted. Do not attribute the RSS increase to the candidate without a repeated controlled sample.

## Gate result

- TS-only serial M2 after the candidate: `496 pass / 0 fail / 2 skipped`; TAP SHA-256 `D4F12FD46DE0601C1C2A33195DF90D5689015E79E43464709FFB2C0C35E8AE08`.
- Java serial M2 after the candidate: `498 pass / 0 fail / 0 skipped`; TAP SHA-256 `3AD4DEB24E496F0443A6784CD81F292A5404B2021F893F164C077FF2F91C8DEC`.
- M3 remains functional/parity equivalent across all four workloads. The candidate is accepted as a protected runtime round; affected NAL and M1-prime closure are still pending.

## Safe-string closure evidence

After removing the mutable term/map caches, the immutable-string-only candidate restored `nars_transitivity.nal` parity. Final gate TAPs on the safe code are:

- TS-only M2: `496 pass / 0 fail / 2 skipped`, SHA-256 `18595D8E2A66FA08A083D07F655E62FDD9AE2F3EA1B4325DD317459C38899708`.
- Java M2: `498 pass / 0 fail / 0 skipped`, SHA-256 `4A29A26BCD46F75D4131854E2E7F1657DA0A124EAC41552B1F631EDF9318B709`.
- Affected transitivity parity: `1/1`, with no timeout, process limit, exception, or marker ambiguity in the retry evidence.

The safe-string candidate is the current accepted optimization. Its RPS median is `4366.278 cycles/s` against the original `3843.848` baseline; this is a benchmark gain, not yet a complete M1-prime closure.

## Next profile target

If the candidate survives the gates, profile allocation and equality dispatch in `CompoundTerm.equals`, `javaValuesEqual`, Bag lookup/removal, parser input normalization, and per-cycle event/diagnostic formatting. The Demo concept-growth tail remains the primary user-visible bottleneck.
