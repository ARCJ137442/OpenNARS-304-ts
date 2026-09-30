---
status: in-progress
created: 2026-09-30
priority: high
tags:
- performance
- rps
- m3
- demo
- runtime
depends_on:
- 025-jree-free-runtime-complete
- 020-ts-performance-and-release
created_at: 2026-09-30T16:36:56.402637900Z
updated_at: 2026-09-30T16:40:23.324421800Z
transitions:
- status: in-progress
  at: 2026-09-30T16:40:23.324421800Z
---
# Native TypeScript performance optimization

## Goal

After strict jree removal, optimize measured OpenNARS reasoning throughput and browser demo responsiveness with native TypeScript paths. Preserve OpenNARS 3.0.4 semantics, Java parity, readability, and the repository development standard.

## Scope

- Establish repeatable baselines for core RPS, M3 workload throughput, step latency, allocations/RSS, and demo RPS/TPS under fixed seeds and input traces.
- Profile and optimize runtime hot paths, especially string conversion/UTF-16 helpers, Java-shaped equality dispatch, Bag/NativeMap lookups, transient collection allocation, parser boundary conversion, and diagnostic/event formatting.
- Optimize demo Worker and host scheduling only where the measured bottleneck is outside the reasoner; preserve synchronous/async semantics and operation logs.
- Prefer native `string`, arrays, `Map`, `Set`, stable object shapes, cached derived values, and allocation reuse when the Java contract does not require compatibility behavior.
- Keep compatibility helpers narrow and explicit where Java behavior remains observable; do not replace equality, ordering, float32, Random, iterator, or class identity contracts with approximate native behavior.

## Non-goals

- No unmeasured broad rewrite of inference rules.
- No optimization that changes NAL output order, random sequence, timestamps, operation dispatch, exception identity, or public API behavior.
- No counting async demo TPS as a core RPS improvement.

## Performance protocol

- Record the immutable commit, Node/browser version, CPU, workload, fixed seed, warmups, repetitions, cycles, median/p95 latency, cycles/s, RPS, TPS, actual/target TPS ratio, concept/task counts, and peak RSS.
- Use one process per benchmark and unique evidence paths. Keep timeout, process_limit, stall, exception, and not_run classifications distinct.
- For each optimization, run focused contracts first, then non-incremental typecheck, serial M2, build/dist API, affected NAL parity, and the appropriate M1/M1-prime gate.
- Keep a candidate only when it improves the declared primary metric without functional/parity regression. Stop after three consecutive accepted rounds where every required primary metric improves by less than 5%; any regression resets the streak.

## Plan

- [x] Freeze clean native-runtime RPS and M3 baselines on the current commit.
- [ ] Capture CPU/heap evidence for the highest-cost runtime and demo paths.
- [x] Optimize one measured runtime hot path at a time with direct contract tests.
- [ ] Optimize demo Worker scheduling, input/log allocation, and telemetry only when profiling assigns cost there.
- [x] Re-run M2, M3, affected NALs, M1-prime and markerless checks after each accepted batch.
- [ ] Document final improvements, residual bottlenecks, and the three-round convergence decision.

## Acceptance tests

- [x] Core RPS and M3 baselines and post-optimization evidence are reproducible and linked to immutable commits.
- [x] All direct runtime contracts, typecheck, build, dist API, TS-only M2 and Java M2 pass with zero failures.
- [ ] Affected NAL parity and required M1/M1-prime/markerless evidence remain equivalent.
- [ ] Demo browser smoke, operation behavior, RPS/TPS HUD and sync/async controls remain valid.
- [ ] The final report distinguishes measured gains from unresolved long-cycle resource bottlenecks and records remaining Java-shaped paths.

## Evidence

Store raw benchmark output and hashes under `reports/evidence/`; preserve all prior evidence. The final spec update must name the optimized path, measured delta, test gates, and residual risk.