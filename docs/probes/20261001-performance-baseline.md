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

## Current safe-version recheck

The accepted safe-string source was rechecked on `cbe9c7860747975b38aa03c61fba95abb4107bbf` after removing two exploratory candidates. TypeScript M2 remained `496 pass / 0 fail / 2 skipped`; Java M2 remained `498 pass / 0 fail / 0 skipped`. The corrected M3 workload set was functional and parity equivalent in every sample:

- `nal8.add.nal`: `1.720x` TS/Java wall ratio;
- `nars_multistep_1.nal`: `7.490x`;
- `toothbrush.nal`: `4.230x`;
- `nal4.recursion.small.nal`: `6.210x`.

Raw M3 evidence: `reports/evidence/m3-native-safe-string-correct-20261001.json`, SHA-256 `00AF18838CB8D2DEEAA1EDE471DD1D8E4E114B21C5EEC1170ACF2EC7118A0173`.

Two additional measured candidates were rejected and reverted:

- `javaValuesEqual` boxed-string `instanceof` fast path: `3989.627 cycles/s` median, about `-8.6%` versus the accepted `4366.278` baseline. Evidence: `reports/evidence/rps-native-opt4-java-values-20261001.json`.
- Per-instance `RuntimeClassToken` cache: `4205.462 cycles/s`, about `-3.7%`. Evidence: `reports/evidence/rps-native-opt5-runtime-class-20261001.json`.
- `NativeJavaString.equals` direct private-field comparison: `4210.260 cycles/s`, about `-3.6%`. Evidence: `reports/evidence/rps-native-opt6-string-equals-20261001.json`.

These results do not justify replacing Java equality or class-token contracts with a native shortcut. The remaining measurable hotspots are `CompoundTerm` equality/name work, Bag/NativeMap lookup and removal allocation, and concept growth/GC tails in the demo workload. They require a contract-preserving structural experiment rather than another local dispatch branch.

## Accepted round: lazy inactive-event payload conversion

`Memory.addNewTask` and `Memory.removeTask` now convert their Java-shaped reason payload only when the corresponding event has observers. With an observer, the existing boxed payload, event class, ordering, and callback contract are unchanged; without one, the event emitter was already a no-op, so the conversion was dead work.

On the same single-process RPS workload with 50 repetitions, the safe-string reference measured `2613.224 cycles/s` median, `59.293 ms` p95 latency, and `276729856` bytes peak RSS. The lazy-event candidate measured `2672.096 cycles/s` median (`+2.25%`), `57.670 ms` p95 (`-2.7%`), and `277577728` bytes peak RSS. Demo telemetry on a 20-tick CartPole workload recorded `4.105 RPS`, `1.214 TPS` in the first segment and `0.247 TPS` in the growth segment; this is a shorter probe than the 50-tick baseline and is not presented as a direct aggregate comparison.

Evidence: `reports/evidence/rps-native-safe-string-recheck50-20261001.json`, `reports/evidence/rps-native-opt8-event-lazy-20261001.json`, `reports/evidence/demo-workload-opt8-event-lazy-20261001.json`, and `reports/evidence/perf-opt8-affected-nal-20261001.jsonl`. TS M2 was `496 pass / 0 fail / 2 skipped`; Java M2 was `498 pass / 0 fail / 0 skipped`; affected NAL parity was `3/3`; M3 remained `4/4` functional/parity.

## Next profile target

If the candidate survives the gates, profile allocation and equality dispatch in `CompoundTerm.equals`, `javaValuesEqual`, Bag lookup/removal, parser input normalization, and per-cycle event/diagnostic formatting. The Demo concept-growth tail remains the primary user-visible bottleneck.
