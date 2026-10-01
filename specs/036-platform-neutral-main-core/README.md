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
- [ ] Migrate remaining `src/main` Java-shaped value aliases and class tokens
  after direct contracts are classified.
- [ ] Complete Node/Browser smoke, M2, M1-prime and platform audit on one
  immutable commit.

## Tests

- [x] TypeScript typecheck.
- [x] Focused Shell, output-writer, and NarNode transport contracts.
- [ ] Full serial TS-only M2 and Java M2.
- [ ] Affected NAL parity, M1-prime and markerless comparison.
- [ ] Browser Worker and Node CLI smoke without `src/main` host imports.

## Dependencies

This successor continues the strict jree boundary in spec 025 and the host
separation in spec 024. The local `lean-spec link` command is unavailable in
this installation, so those dependencies are recorded here until the tool is
restored.
