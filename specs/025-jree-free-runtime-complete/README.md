---
status: planned
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
updated_at: 2026-09-30T14:12:18.920154100Z
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

- [ ] Inventory every maintained-source and package-level jree import, require, rewrite, and generated artifact.
- [ ] Implement native Node host capabilities and remove the Node adapter's jree boundary.
- [ ] Replace or delete the jree entry rewrite and update build, CLI, Shell, dist API, and package scripts.
- [ ] Migrate all maintained test fixtures and direct contract tests to project-native runtime primitives.
- [ ] Remove jree from package metadata and lockfiles; verify a clean install works without it.
- [ ] Rebuild and inspect dist, release tarball, browser Worker, and demo Worker for forbidden dependency traces.

## Acceptance tests

- [ ] Maintained src, scripts, test, package.json, lockfiles, and generated dist have zero jree imports, requires, dependency entries, or rewrite rules.
- [ ] External Node consumer, CLI, Shell, save/load, stdin, process, UDP/Node host, exception, class identity, boxed string/number, iterator/collection, and Random contracts pass without jree installed.
- [ ] Non-incremental typecheck, build, dist API, serial TS-only M2, Java M2, affected NAL parity, M1-prime, and markerless digests pass on one immutable commit.
- [ ] npm pack or equivalent release inspection proves the package installs and runs with no jree dependency or bundled copy.
- [ ] Node and browser smoke tests pass, and audit:jree, audit:platform, migration scan, and encoding checks report no maintained-source dependency.
- [ ] LeanSpec 023 is not re-marked complete until this successor's acceptance evidence is complete; this spec is the strict closure gate.

## Evidence

Record the inventory, native host contracts, package inspection, test commands, artifact hashes, and the final maintained-source versus historical-archive distinction. Preserve existing evidence files and link each final result to the immutable commit.
