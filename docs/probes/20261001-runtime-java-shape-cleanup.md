# Runtime Java-shape cleanup probe

## Current commits

- `9b45b51`: `native-runtime.ts` delegates text, long, value equality and identity helpers to `java-text.ts` and `java-values.ts`.
- `b633788`: browser host adapter reuses the shared native Java facade for boxed values, collections, Random, StringBuilder and class tokens.
- `3c92303`: `JavaString` is `NativeJavaString`, replacing an `any` type leak.

## Confirmed removable or narrowable shapes

- Duplicate helper implementations in `native-runtime.ts` were removed. The compatibility export remains for tests and translated tooling, but it has one implementation owner.
- Browser boxed-number, StringBuilder, Class/Object and collection facades now share the project-owned native implementation.
- `JavaString = any` was narrowed to the immutable project boxed string without changing runtime values.

## Contracts intentionally retained

- `java.lang.*` namespace facade at host-facing Node/browser adapters.
- Java UTF-16 text methods, hashCode and exact equality at translated boundaries.
- Runtime class tokens and `getClass()` for event/plugin dispatch.
- Java exception hierarchy and `instanceof` predicates.
- Java collection iterator/remove/fail-fast behavior in NativeList/NativeMap/NativeSet.
- Node file, stream, serialization and network capability wrappers.

## Open boundary

The demo worker build with `ALLOW_DIRTY_OPENNARS=1` still reaches `node:v8` through existing Node adapter imports in `Nar.ts` and related 023 worktree paths. This is a pre-existing platform-boundary dependency and prevents claiming browser bundle closure for spec 031. The browser adapter itself passes direct String/hash, boxed Integer, class token and Random smoke checks.

## Verification

- Focused runtime contracts: `28/28` pass before the first cleanup batch.
- Text-focused contracts after `JavaString` narrowing: `21/21` pass.
- TS M2: `496 pass / 0 fail / 2 skipped` on the preceding immutable performance commit.
- Java M2: `498 pass / 0 fail / 0 skipped` on the preceding immutable performance commit.
- Typecheck, build, dist API and jree audit pass after the cleanup batches.
- RPS cleanup batch 1 rechecks: `2676.559` and `2799.897 cycles/s`; this is performance-neutral against the opt12 reference `2810.655`.

Next investigation: split the remaining host-facing facade from platform-neutral core imports so the browser worker no longer resolves Node adapter modules, then reassess whether Java-shaped exception and boxed-number names can be narrowed without changing public or parity contracts.
