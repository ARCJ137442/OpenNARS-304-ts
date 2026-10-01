# OpenNARS 3.0.4 TypeScript v1.0.2

Platform-boundary fix release following v1.0.1.

- The reasoning core selects its host facade through `src/platform/host-adapter.ts` instead of hard-coding the Node adapter in `Nar`, `Memory`, `Stamp` and text output paths.
- Browser worker bundling aliases that boundary to the browser adapter, so Node-only `node:v8` and filesystem modules are excluded from the worker.
- Full TS/Java M2, M1-prime, 65536-cycle long fixture, #246, markerless digests, Demo Lab checks and browser smoke were rerun on the release candidate.

The original 2,000,000-cycle stability workload remains a documented system bottleneck; the 65536-cycle fixture is the daily long-cycle gate.
