---
status: in-progress
created: 2026-10-01
priority: high
created_at: 2026-10-01T03:52:41.998882100Z
updated_at: 2026-10-01T03:53:13.036395400Z
transitions:
- status: in-progress
  at: 2026-10-01T03:53:13.036395400Z
---

# Platform-neutral main core

Move src/main orchestration behind host capabilities and native reasoner errors.

## Goal

Make `src/main` a platform-neutral NARS library. Core orchestration accepts
native text and structured commands, emits structured events, and receives
host effects through narrow capabilities. Node CLI, stdin/stdout, files,
process exit, UDP and serialization stay under `src/platform/node`.

## Design constraints

- Error messages remain diagnostic and use template strings where interpolation
  is needed; error classes describe NARS meaning rather than Java names.
- `src/main` must not import Node built-ins or `platform/node` facades.
- Java-compatible UTF-16, hash/equality, collection order and class identity
  remain only at proven observable compatibility boundaries.
- Browser builds must be able to import the reasoner without a Node alias.

## Plan

- [x] Introduce native reasoner input/state/I/O/capability error classes.
- [x] Replace `Nar` direct Java exception construction in the changed input and
  lifecycle paths.
- [x] Make `Shell` a text/command runner with injected output and file access.
- [x] Make `NarNode` route typed messages through an injected transport and add
  a Node UDP adapter.
- [x] Make `TextOutputHandler` use native buffers and injected text writers.
- [x] Remove platform and Java namespace imports from `src/main` orchestration;
  remaining value aliases and class tokens are explicitly deferred to spec 031.
- [x] Complete Node/Browser smoke, M2, M1-prime and platform audit on one
  immutable commit.

## Tests

- [x] TypeScript typecheck.
- [x] Focused Shell, output-writer, and NarNode transport contracts.
- [x] Full serial TS-only M2 (`500/502`, 2 documented skips) and Java M2
  (`502/502`) on the final commit.
- [x] Affected NAL parity, M1-prime (`243/243`), #246 and #245 65536 fixture
  parity on the final commit.
- [x] Browser Worker build/static scan, real Microworld browser smoke, and Node
  CLI smoke without `src/main` host imports.

## Dependencies

This successor continues the strict jree boundary in spec 025 and the host
separation in spec 024. The local `lean-spec link` command is unavailable in
this installation, so those dependencies are recorded here until the tool is
restored.

## Final evidence for `07f7dee`

- TS-only M2: `500 passed / 0 failed / 2 skipped`.
- Java M2: `502 passed / 0 failed / 0 skipped`.
- M1-prime body: `243/243` parity, with zero failure, timeout,
  process-limit, exception, stall, or not-run rows.
- Extra `simpleOperationTest.nal`: `1/1` parity.
- Reduced #245 fixture: `long_term_stability-65536.nal` Java/TS parity `1/1`,
  TS duration about `386.8 s`, peak RSS `411623424` bytes; this is not the
  original 2,000,000-cycle stability claim.
- Worker build, static forbidden-token scan, demo tests `28/28`, and real
  browser Microworld smoke passed. Worker build retains six known esbuild
  warnings from translated overload switches and `import.meta` in IIFE output.
