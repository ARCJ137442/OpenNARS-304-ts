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

## Accepted round: lazy output formatting

`Memory.output` now checks whether an `OUT` or active `DEBUG` observer exists before calculating the budget threshold and constructing parent diagnostics. If either observer is active, event order and payloads remain unchanged; when neither is active, the method has no observable effect and returns before formatting.

The first 50-run sample measured `2719.727 cycles/s`; an independent same-configuration recheck measured `2810.655 cycles/s`, `35.430 ms` median latency, `57.162 ms` p95 latency, `1749.408 cycles/s` p05, and `257499136` bytes peak RSS. Relative to opt9 (`2741.476 cycles/s`), the recheck is `+2.5%`. This is the third consecutive accepted round below 5% after opt8 (`+2.25%`) and opt9 (`+2.6%`), so the planned convergence rule is met.

Opt10 mixed boxed/native equality (`2727.382 cycles/s`) and opt11 native hash entry (`2733.174 cycles/s`) were rejected because both were below opt9. Their raw evidence remains under `reports/evidence/`.

Opt12 evidence: `reports/evidence/rps-native-opt12-lazy-output-recheck-20261001.json`, `reports/evidence/m3-native-opt12-lazy-output-20261001.json` (SHA-256 `0A8E002DD79E8EE4B92CD2ED43B0C9EE66BE2F6038491A57BF33BDDA2D8B695E`), `reports/evidence/m1prime-opt12-mminus-20261001.jsonl`, `reports/evidence/m1prime-opt12-nars-multistep-3-20261001.jsonl`, `reports/evidence/m1prime-opt12-long-65536-20261001.jsonl`, `reports/evidence/m1prime-opt12-simple-246-20261001.jsonl`, `reports/evidence/markerless-opt12-long-ts-20261001.jsonl`, and `reports/evidence/markerless-opt12-simple-ts-20261001.jsonl`. The 243-item M1-- body was `243/243`; #25, #245 65536, and #246 were functional/parity equivalent; both markerless comparisons were equal; TS M2 was `496/496` effective with 2 documented Java skips; Java M2 was `498/498`.

The 50-tick CartPole demo probe on the preceding accepted source recorded `3.024 RPS`, `2520.025 ms` median step, `8388.976 ms` p95, and `340709376` bytes peak RSS. This remains far below a 20 TPS target because concept growth and inference/GC tails dominate after the first ten ticks; the accepted runtime optimizations do not solve that state-growth bottleneck.

## Accepted round: native boxed-string equality

`javaStringsEqual` now compares the immutable native payload directly when both values are `NativeJavaString`; all mixed/native-legacy CharSequence pairs continue through the established conversion path. This avoids allocating two temporary CharSequence view closures for the dominant boxed-string comparison while keeping UTF-16 equality exact.

On the same 50-repetition RPS workload, the immediately previous accepted round measured `2672.096 cycles/s` median, `57.670 ms` p95 latency, and `277577728` bytes peak RSS. This candidate measured `2741.476 cycles/s` (`+2.6%`), `57.414 ms` p95, and `273944576` bytes peak RSS. M3 was functional/parity equivalent in all four workloads; ratios were `1.730x`, `7.090x`, `4.050x`, and `5.160x` in the usual file order. Build and dist API smoke passed; TS M2 was `496 pass / 0 fail / 2 skipped`; Java M2 was `498 pass / 0 fail / 0 skipped`.

Raw evidence: `reports/evidence/rps-native-opt9-native-string-equality-20261001.json` and `reports/evidence/m3-native-opt9-native-string-equality-20261001.json` (M3 SHA-256 `420C492ACA6C7DA764A049CD502C7FBDDAC7E9E4325E0525A4799A45F0A12210`). M1-prime 243-item main body is in progress under `reports/evidence/m1prime-opt9-mminus-20261001.jsonl`; then rerun #25, #245 65536, #246, and markerless comparisons on this candidate before accepting it. Do not claim this round is closed until those results are final.

## Next profile target

The optimization convergence gate is closed for this batch. The remaining performance work is a separate, larger investigation of concept growth, Bag/NativeMap allocation and long-tail GC behavior; it must establish a new benchmark baseline before changing inference state ownership or retention policy. The Demo concept-growth tail remains the primary user-visible bottleneck.

## Structural candidate: interval replacement fast path

On the `4225f8e` working tree, `CompoundTerm.replaceIntervals` was found to
deep-clone every compound term before checking whether it contained an
interval. The call graph treats the returned term as immutable, so the native
candidate returns the original compound immediately when `hasInterval()` is
false and preserves the clone path for interval-bearing terms.

Focused contracts passed, including a clone-count assertion for both branches.
The 50-tick CartPole workload improved from `2.841 RPS` / peak RSS
`344109056` bytes to `4.618 RPS` / `415666176` bytes in the first sample and
`4.698 RPS` / `355340288` bytes in the independent recheck. Segment TPS still
falls below 1 after concept growth, so this is a large RPS improvement but not
the final 20 TPS demo result.

The same candidate's 50-run in-process RPS benchmark measured `3870.598
cycles/s` median, `58.837 ms` p95, and peak RSS `269574144` bytes. Raw evidence:
`reports/evidence/demo-workload-interval-fastpath-20261001.json`,
`reports/evidence/demo-workload-hash-shortcut-20261001.json`,
`reports/evidence/demo-workload-hash-shortcut-recheck-20261001.json`, and
`reports/evidence/rps-native-hash-shortcut-20261001.json`.

This candidate remains pending M3, complete M2, affected NAL, M1-prime and
markerless validation. The `javaValuesEqual` hash short-circuit was measured
in the same probe but is not yet accepted independently; its focused contract
preserves receiver order for equal hashes and rejects unequal hashes before
calling `equals`.

## Structural candidate: complexity rejection in `CompoundTerm.equals`

`CompoundTerm` already maintains a stable complexity value for each term. The
candidate rejects two compound terms with different complexity before forcing
their lazy names, then retains the existing Java-compatible name equality for
equal-complexity terms. Focused tests cover both branches and preserve the
receiver direction.

The 50-tick CartPole probe measured `3.713 RPS`, median step `2046.664 ms`,
p95 `6936.998 ms`, and peak RSS `406876160` bytes. This remains a candidate;
full M2, M3, affected NAL, M1-prime and markerless evidence are required.
