---
status: complete
created: 2026-09-30
priority: high
tags:
- jree
- native-typescript
- host-adapter
- release
depends_on:
- 023-jree-removal-native-runtime
- 024-platform-neutral-core-host-adapters
created_at: 2026-09-30T14:12:18.920154100Z
updated_at: 2026-10-01T05:56:44.230871100Z
completed_at: 2026-10-01T05:56:44.230871100Z
transitions:
- status: in-progress
  at: 2026-09-30T14:21:31.107804600Z
- status: planned
  at: 2026-09-30T14:28:03.410637700Z
- status: in-progress
  at: 2026-09-30T15:15:40.466017800Z
- status: complete
  at: 2026-10-01T05:56:44.230871100Z
---

## Goal

Finish the native TypeScript runtime begun by spec 023. The maintained library, Node CLI, public API, test fixtures, build scripts, and published artifacts must run without installing, importing, requiring, or rewriting to jree. Preserve the OpenNARS 3.0.4 behavioral contracts already protected by spec 023 and 024.

## Scope

- Replace the Node host adapter's jree namespace, exception checks, boxed values, Random patch, and Java I/O wrappers with the project runtime and explicit Node capabilities.
- Remove the published jree-entry rewrite boundary and make build, CLI, Shell, dist API, and external consumer paths load the native Node adapter.
- Migrate maintained test and fixture imports from jree to project-native contracts; canonical Java parity remains an external oracle, not a runtime dependency.
- Remove jree from package.json, lockfiles, release package manifests, and generated dist output.
- Keep historical reports, archived evidence, and provenance notes intact; they may mention the removed dependency as historical context.

## Non-goals

- Do not rewrite NARS inference algorithms or change canonical Java semantics.
- Do not delete historical evidence merely to make a text search clean.
- Do not hide a remaining runtime dependency by moving jree from dependencies to devDependencies.

## Design constraints

- Shared core uses native TypeScript values and project-owned contracts only.
- Node-only file, terminal, process, UDP, serialization, and clock capabilities stay behind explicit host interfaces.
- Java-compatible UTF-16, hashCode, equality, exception inheritance, class tokens, iterator, collection order, and JavaRandom behavior remain tested where required by OpenNARS contracts.
- Browser and Node adapters share the project-native runtime primitives; neither adapter imports jree.
- Public API declarations and generated bundles contain no jree type or module names.

## Plan

- [x] Inventory every maintained-source and package-level jree import, require, rewrite, and generated artifact.
- [x] Implement native Node host capabilities and remove the Node adapter's jree boundary.
- [x] Replace or delete the jree entry rewrite and update build, CLI, Shell, dist API, and package scripts.
- [x] Migrate all maintained test fixtures and direct contract tests to project-native runtime primitives.
- [x] Remove jree from package metadata and lockfiles; verify a clean install works without it.
- [x] Rebuild and inspect dist, release tarball, browser Worker, and demo Worker for forbidden dependency traces.

## Acceptance tests

- [x] Maintained src, scripts, test, package.json, lockfiles, and generated dist have zero jree imports, requires, dependency entries, or rewrite rules.
- [x] External Node consumer, CLI, Shell, save/load, stdin, process, UDP/Node host, exception, class identity, boxed string/number, iterator/collection, and Random contracts pass without jree installed.
- [x] Non-incremental typecheck, build, dist API, serial TS-only M2, Java M2, affected NAL parity, M1-prime, and markerless-equivalent evidence pass on the immutable `60f0a27` line.
- [x] npm pack or equivalent release inspection proves the package installs and runs with no jree dependency or bundled copy.
- [x] Node and browser smoke tests pass, and audit:jree, audit:platform, migration scan, and encoding checks report no maintained-source dependency.
- [x] LeanSpec 023 may be re-marked complete only after this successor's acceptance evidence is complete; this spec is the strict closure gate.

## Evidence

Record the inventory, native host contracts, package inspection, test commands, artifact hashes, and the final maintained-source versus historical-archive distinction. Preserve existing evidence files and link each final result to the immutable commit.

## Final closure evidence

- `npm run test:release`: external TSC/API/CLI/Shell passed; tarball had zero
  forbidden package members and no runtime warnings.
- `npm pack --dry-run`: package contains no `jree` dependency or bundled copy.
- Final M2: TS-only `500/502` with two documented skips; Java `502/502`.
- Final M1-prime body: `243/243`, SHA-256
  `C21414D508B499E8BEE61B8AA082CDCC70E2564BFD5E8CA6615B89CA29308F72`.
- Final #246 SHA-256:
  `B7B62317F4DB2183B92456B5FEF1C201C6F72B0431AC22639D11AD8124CF317A`.
- Final reduced #245 SHA-256:
  `A8AC7A7B3CB2100EB5E4F858E88A24921DCD06D911B56C4623B183CD28495C0F`.
- `audit:jree` maintained-source direct import files/occurrences: `0/0`;
  package dependency declaration: `null`.
- Browser Worker build, static scan, demo tests `28/28`, and real browser smoke
  passed. Historical evidence remains outside the maintained runtime boundary.
