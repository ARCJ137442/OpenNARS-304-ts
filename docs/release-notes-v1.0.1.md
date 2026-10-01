# OpenNARS 3.0.4 TypeScript v1.0.1

Fix release following v1.0.0.

- Runtime Java-shape cleanup began with shared native text/value helpers and a typed `NativeJavaString` boundary.
- Browser host facade reuses the shared native Java runtime for boxed values, collections, Random, StringBuilder and class tokens.
- Runtime performance closure remains protected by M1-prime, M2, M3 and strict markerless evidence.
- The original 2,000,000-cycle stability fixture remains documented as a system bottleneck; the 65536-cycle fixture is the daily long-cycle gate.
- Demo Lab worker builds now alias current `native-host-adapter.ts` imports to the browser adapter during bundling.

Source commits and raw verification evidence are recorded in `docs/current-status.md` and `docs/probes/`.
