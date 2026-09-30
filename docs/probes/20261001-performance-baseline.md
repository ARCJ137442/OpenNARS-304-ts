# Native runtime performance round 1

## Baseline

Commit `c84a1ab` on Node `v22.17.0`, Windows x64.

- In-process RPS: median `3843.848 cycles/s`, p05 `1451.295`, median latency `23.463 ms`, p95 `63.091 ms`, peak RSS `258998272` bytes.
- Demo CartPole workload, 50 ticks / 10 cycles per tick: `2.721 RPS`, median step `2730.790 ms`, p95 `9512.974 ms`, peak RSS `351440896` bytes, final concepts `3731`.
- M3 four workloads: functional/parity all true. TS/Java wall ratios were `1.760x` (`nal8.add`), `7.616x` (`nars_multistep_1`), `4.071x` (`toothbrush`) and `6.155x` (`nal4.recursion.small`).

Raw files: `reports/evidence/rps-native-baseline-20261001.json`, `reports/evidence/demo-workload-native-baseline-20261001.json`, `reports/evidence/m3-native-baseline-20261001.json`.

## Round 1 candidate

The candidate caches Java-compatible text hashes for immutable `NativeJavaString`, `Term` and `CompoundTerm` names, fast-paths native boxed string observation, and caches stable object-key hash codes inside `NativeMap`. Equality direction, hash fallback, insertion order, iterator behavior and invalidation paths are unchanged.

Exploratory result on the same working tree before commit:

- In-process RPS: median `4048.927 cycles/s`, p05 `1511.234`, median latency `24.369 ms`, p95 `60.842 ms`, peak RSS `260366336` bytes, approximately `+5.3%` median cycles/s.
- Demo workload: `2.951 RPS`, median step `2620.048 ms`, p95 `8816.522 ms`, peak RSS `385564672` bytes, approximately `+8.5%` RPS. Concept growth remained `1025 -> 3731`; this round does not solve state-growth/GC tails.
- M3 functional/parity remained true; ratios were `1.740x`, `7.669x`, `4.213x`, and `5.846x` in the same file order.

The candidate still requires full serial M2 and the appropriate NAL/M1-prime protection before being accepted. Do not attribute the RSS increase to the candidate without a repeated controlled sample.

## Next profile target

If the candidate survives the gates, profile allocation and equality dispatch in `CompoundTerm.equals`, `javaValuesEqual`, Bag lookup/removal, parser input normalization, and per-cycle event/diagnostic formatting. The Demo concept-growth tail remains the primary user-visible bottleneck.
