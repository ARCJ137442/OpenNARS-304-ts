---
status: in-progress
created: 2026-09-30
priority: high
tags:
- runtime
- native-typescript
- performance
- java-shape
depends_on:
- 025-jree-free-runtime-complete
- 027-native-performance-optimization
created_at: 2026-09-30T23:44:07.472583300Z
updated_at: 2026-09-30T23:44:35.821820100Z
transitions:
- status: in-progress
  at: 2026-09-30T23:44:35.821820100Z
---

# Runtime Java-shape cleanup

## Goal

Reduce residual Java-shaped code in `src/runtime` and its direct callers after strict jree removal. The result should use native TypeScript representations where the Java shape is no longer observable, while retaining narrow compatibility adapters for UTF-16 text, Java hash/equality, exceptions, class identity, iterators, collection order, numeric narrowing, and host capabilities.

## Scope

- Consolidate duplicated runtime helpers only when they expose the same semantic contract and have the same change reason.
- Replace Java-shaped implementation details with `string`, `number`, `bigint`, `Map`, `Set`, arrays, native iterables, and TypeScript classes where direct contracts prove equivalence.
- Keep public compatibility types and host boundaries explicit when external callers or canonical parity observe them.
- Remove redundant conversion, wrapper allocation, and namespace indirection from hot runtime paths when measurements show a benefit.
- Maintain traceability to the Java 3.0.4 contract and the current TypeScript tests.

## Non-goals

- Do not mechanically rename Java terminology or rewrite all public APIs in one batch.
- Do not remove Java-shaped contracts whose UTF-16, hash, equality, exception, class-token, iterator, float32, Random, or host behavior is observable.
- Do not change inference rules, random order, timestamps, operation dispatch, event order, or NAL output.
- Do not delete historical evidence or alter unrelated pending 023/025 worktree changes.

## Contract map

| Runtime concern | Native target | Required retained contract |
| --- | --- | --- |
| Text | native `string` internally | Java UTF-16 code units, `hashCode`, exact equality at compatibility boundaries |
| Values | native primitives and project classes | boxed-number conversion and Java value equality where observed |
| Classes | constructors, `instanceof`, project token | stable `getClass()` identity and event/plugin dispatch |
| Collections | arrays, `Map`, `Set`, explicit native wrappers | insertion order, Java equality receiver direction, iterator removal/fail-fast |
| Exceptions | project exception hierarchy | inheritance, message/cause, catch classification |
| Host effects | explicit capabilities | Node/browser separation and failure behavior |

## Plan

- [x] Inventory runtime modules, direct callers, public declarations, and tests; classify each Java shape as removable, narrowable, or required.
- [x] Establish a runtime-shape baseline: typecheck, serial TS M2, Java M2, M3/RPS, one affected NAL set, and jree/platform audits.
- [x] Refactor one contract family at a time, beginning with duplicated text/value/class helper layers; add focused direct contracts before changing callers.
- [x] Remove dead aliases and wrapper allocations only after native and compatibility paths are both covered.
- [ ] Re-run M2, M3/RPS, affected NALs, M1-prime, markerless digests, and browser/Node smoke on one immutable commit.
- [ ] Record accepted/rejected candidates, residual Java shapes, and human takeover guidance; close only after all gates pass.

## Acceptance tests

- [ ] No unexplained runtime Java-shaped implementation remains in the classified scope.
- [ ] Public and host-facing contracts remain explicit and documented.
- [ ] Typecheck, build, dist API, TS M2, Java M2, M3, affected NAL parity, and audits pass with zero failures.
- [ ] M1-prime and both strict markerless digest comparisons remain equivalent.
- [ ] Node CLI, browser Worker, Demo Lab, and operation/event behavior remain valid.
- [ ] Any residual Java shape has a documented reason, observable contract, and removal condition.

## Evidence

Store inventory, focused contracts, benchmark output, hashes, and rejected experiments under `docs/probes/` and `reports/evidence/`. Keep historical evidence intact and stage only files owned by this spec.

## Batch 1 result

`native-runtime.ts` now re-exports the shared `java-text.ts` and `java-values.ts` contracts instead of carrying duplicate implementations for UTF-16 text, long arithmetic, value equality, and identity hashing. The Node facade, exceptions, boxed number compatibility, and host I/O remain separate because they still represent distinct host-facing responsibilities.

Focused runtime contracts: `28/28` passed. TS-only M2: `496 pass / 0 fail / 2 skipped`; Java M2: `498 pass / 0 fail / 0 skipped`; typecheck, build, and dist API passed. RPS rechecks were `2676.559` and `2799.897 cycles/s`; against the opt12 reference `2810.655`, this batch is performance-neutral within measurement variation and is retained for reduced duplication and clearer ownership, not as a throughput claim.

## Batch 2 result

The browser host adapter now reuses the shared native Java facade for boxed numbers, StringBuilder, Class/Object tokens, collections, Random, and common language exceptions. Browser-only I/O, network-unavailable capabilities, output, UUID and clock behavior remain local to the adapter. A direct browser adapter smoke confirmed native String/hash, boxed Integer conversion, class token construction, and Random availability.

Typecheck, build, dist API, TS M2, and Java M2 remain green. The initial demo worker build exposed that `Nar.ts` and related core files selected the Node adapter directly. Batch 4 below replaces that hard-coded selection; the browser worker now builds with a browser-host alias.

## Batch 3 result

`JavaString` is now a project-owned `NativeJavaString` type instead of `any`. Runtime behavior is unchanged; the change makes the existing boxed-string contract visible to TypeScript and prevents new callers from silently erasing the boundary. Typecheck and focused UTF-16/text/Narsese contracts (`21/21`) passed. This batch is a type-safety and takeover improvement, not a measured throughput claim.

## Batch 4 result

`Nar` host effects are represented by explicit `RuntimeCapabilities.saveSnapshot/loadSnapshot`; Node supplies the v8/file implementation while browser builds use the browser host boundary. `Nar`, `Memory` and `Stamp` no longer hard-code the Node adapter selection point. Typecheck, build, dist API and browser worker build pass. Full M2/M1-prime reruns are required before this spec can close.

## Batch 5 result: native reasoner errors

Production callsites for invalid arguments and invalid state now use
`ReasonerInputError`, `ReasonerStateError`, `ReasonerInvariantError`, and
`ReasonerOperationError`. Parser invalid-input is also project-native. The
Java-named exception hierarchy remains only at compatibility/facade edges so
legacy observation contracts continue to work while the namespace is removed.

Typecheck, focused boundaries, TS-only M2 (`503/0/2`), Java M2 (`505/0/0`),
affected NALs (`4/4`) and M1-prime body (`243/243`) passed on the migration
line. Final #246/#245 and exact-commit markerless evidence still need to be
recorded before 031 can close.

The exact error-migration commit `c97fa98` then completed the 243-item M1'
body (`243/243`) and affected NALs (`4/4`). Its remaining exact-commit rows
are intentionally not inferred from the previous equivalent source line; the
spec stays `in-progress` until #246, reduced #245, markerless, browser/Node
smoke and the residual runtime-shape audit are recorded on one final commit.

## Batch 6 result: native host boundary

`src/platform/node/native-host-adapter.ts` and
`src/platform/browser/native-host-adapter.ts` now expose native host
capabilities only. Filesystem, serialization, text output, clock and browser
availability are represented as TypeScript functions/classes and
`RuntimeCapabilities`; the adapters no longer construct or export a `java`
namespace. The compatibility namespace was moved to explicitly named
`legacy-namespace.ts` modules and is imported only by the legacy facade and
the translated demo boundary.

This is a boundary reduction, not the final deletion of every Java-shaped
contract. UTF-16/hash/equality, class-token, iterator, Random and parity
contracts remain in project-owned runtime modules until all callers have been
migrated and exact-commit gates are rerun.

The direct host contracts passed (`11/11`), typecheck and build passed, the
serial TS-only M2 passed `503/505` with zero failures and two documented skips,
and Java M2 passed `507/507`. The browser worker built successfully with the
dirty-source override.
The acceptance boxes remain open until exact-commit M1', Java M2, #246,
reduced #245, markerless, Node/browser smoke and the residual audit are
recorded together.

## Exact-commit gate result: `cd3520f`

The exact commit `cd3520ff4fd2b544b2d47f74ba761ed78802d0e6` is pushed. Its
TS-only M2 (`505/0/2`), Java M2 (`507/0/0`), M1' body (`243/243`), #25, #246,
strict simple markerless and strict long markerless gates passed. The #245
65536 fixture again reached the approved safety limit (`1800034 ms`, last
progress cycle `220251`, marker missing) and is classified as `process_limit`;
therefore the original 2,000,000-cycle workload remains a documented system
bottleneck and does not count as a completed long-cycle gate.

The native host and browser demo checks passed, and the demo repository was
updated and pushed as `ff4b01d`, with worker metadata bound to `cd3520f`.
031 remains `in-progress`: the remaining work is to migrate the callers of the
legacy namespace, remove the explicitly named compatibility facades when
their observable contracts are no longer needed, and rerun the final gates
after that removal.

## Batch 7 result: remove legacy facades from the published source tree

The translated namespace used only by compatibility tests and diagnostic
scripts moved from `src/platform` to `test/support`. `src` and the generated
`dist` no longer contain `legacy-runtime-facade` or `legacy-namespace`; the
native host adapters remain capability-only. Test and parity callers keep the
same observable contracts through the test-only harness.

Typecheck, build, release package checks, TS-only M2 (`503 passed / 0 failed /
2 skipped`), Java M2 (`507/507`), and both audits passed. This closes the
published-tree portion of the Java namespace cleanup. The remaining 031 work
is the deliberate Java-compatible contract layer in runtime text/value,
exceptions, class tokens, collections, iterators and Random; those contracts
must stay until their observable parity obligations have an explicit native
replacement.

The harness move is committed as `91482a7` and pushed. The exact-commit M1'
and markerless evidence from `cd3520f` remains valid because this batch only
changes test/tool imports and package contents; the post-move M2 and audit
outputs are recorded separately in the probe above.

## Batch 8 result: native semantic helper names

Commit `d08a7aa` removes Java-named exception/runtime helpers from `src`.
Resource cleanup now uses `ResourceError`; iterator, random and array helper
modules use `MutableIterator`, `ReasonerRandom` and `ValueArrays`; legacy
exception and namespace implementations remain test-only. The source audit
reports direct jree `0/0` and zero `JavaObject`, `java.util` and `java.lang`
code hits.

TS-only M2 (`503 passed / 0 failed / 2 skipped`) and Java M2 (`507/507`) pass.
031 remains in progress because Java-compatible text/hash, class identity,
collection order, iterator removal and Random semantics still need either a
native public representation or an explicit narrow semantic module.

## Next responsibility batch: native text model

The next implementation batch targets the central term-name path, not a
cosmetic rename. Replace boxed string instances and Java-shaped
`CharSequence` method calls in production with native TypeScript `string`,
while keeping narrowly scoped text hashing/comparison only where NARS
canonical ordering, map keys or frozen Java parity observe those rules.
Preserve supplementary UTF-16 pairs, isolated surrogate units, case-sensitive
term equality, exact Narsese output, and index parsing. Test-only boxed-string
fixtures may remain in `test/support`; they must not leak into `src`, public
types, dist, or release package.
