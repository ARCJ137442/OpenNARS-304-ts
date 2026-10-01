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

## 2026-10-01 platform-neutral main-core batch plan

### User decision

`src/main` is a reusable reasoner library. It must not import Node modules, a
host adapter, or Java-shaped namespace facades. Host effects are supplied as
narrow capabilities by `src/platform`; Node CLI, stdin/stdout, files, process
exit, UDP and serialization remain outside the core.

Error messages remain diagnostic and may use TypeScript template strings. Error
classes are classified by meaning: invalid input/configuration, unavailable
capability, I/O failure, and invariant failure. Java exception names are kept
only at a compatibility boundary while direct callers migrate.

### Current findings

- `src/main/Shell.ts` imports Node fs, process exit, stdin and the Node host
  facade, and exposes `java.io.*` writer/input types.
- `src/main/NarNode.ts` constructs UDP and object streams through a Java-shaped
  facade and catches Java exception predicates.
- `src/io/events/TextOutputHandler.ts` accepts Java writer classes and opens
  files itself; this makes an output formatter responsible for host I/O.
- `src/main/Nar.ts` still throws project classes named `Java*`; its snapshot
  path is already capability based and is the first migration seam.
- `src/platform/host-adapter.ts` currently forwards to the Node adapter. It is
  a temporary build seam, not the target design.

### Batch implementation

1. Add platform-neutral `ReasonerInputError`, `ReasonerStateError`,
   `HostCapabilityError` and `ReasonerIoError` classes with native `Error`
   inheritance and `cause` preservation. Keep aliases in `JavaExceptions.ts`
   only while old translated callers are migrated.
2. Define minimal text output and command/session capability contracts under
   `src/main`/`src/platform`; make `TextOutputHandler` consume a line sink and
   an injected save-file capability rather than `java.io.*` constructors.
3. Split `Shell` into a pure command runner that parses arguments and emits
   structured events, plus a Node CLI adapter that owns fs/stdin/process.
4. Split `NarNode` into a platform-neutral task redirection contract and a Node
   UDP/serialization adapter. The core must use `string`, `Uint8Array`,
   `Map`/arrays and native `Error` predicates.
5. Remove `import { java, ... }` from changed `src/main`/`src/io` paths and
   make browser aliasing unnecessary for those paths.
6. Add focused tests for invalid input, missing capability, I/O cause chains,
   line output, command parsing, and Node adapter integration; then run
   typecheck, build, focused M2, full M2, affected NALs and M1-prime serially.

### Acceptance boundary

This batch does not claim all Java-compatible value contracts are removable.
UTF-16 text, Java hash/equality, Random ordering, collection iteration and
runtime class identity remain only where the reasoner observes them. It does
claim that core orchestration and host effects are no longer coupled to Java or
Node names. The pending `lean-spec create` command is a repository tool gap
(`Invalid template format`); no manual spec frontmatter is created.

### Post-implementation review

Commit `322836e` implements the batch. A follow-up removes `Nar`'s remaining
`JavaSystemLoggerCompat`, `JavaDoubleCompat`, and `isJavaException` imports;
decision-threshold parsing now uses `Number.parseFloat` plus the existing
binary32 boundary, and reasoning failures are recognized as native `Error`
values and re-emitted through NARS events. The follow-up is intentionally
separate from the host-boundary commit so its M1' evidence can identify the
exact source revision.
