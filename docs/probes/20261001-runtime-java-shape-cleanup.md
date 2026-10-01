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

## Final validation after `07f7dee`

- TS-only M2: `500/502`, zero failures, two documented skips.
- Java M2: `502/502`, zero failures and zero skips.
- M1-prime M1-- body: `243/243`, zero failure/timeout/process_limit/
  exception/stall/not_run. The final JSONL is
  `reports/evidence/m1prime-07f7dee-main-core-mminus-20261001.jsonl`.
- Extra #246 and reduced #245 65536 fixture both pass parity on the final
  commit. The reduced fixture remains a performance observation, not an
  original 2,000,000-cycle stability claim.
- Browser worker build, forbidden-token scan, demo tests `28/28`, Node smoke,
  and real browser Microworld smoke pass.

## 2026-10-01 rejected performance candidates

- `CompoundTerm.replaceIntervals` no-op clone removal improved the short demo
  probe but failed `stresstest_bird1.nal`; reverted in `bf03206`.
- `CompoundTerm.equals` complexity rejection failed the same marker; reverted
  in `f0fb62a`.
- `javaValuesEqual` hash mismatch rejection failed the restored-key contract;
  reverted in `4d40872`.

These remain rejected evidence, not accepted performance rounds. Future
optimization must preserve mutable and restored-object behavior before claiming
throughput gains.

## 2026-10-01 Java-named exception callsite migration

### Change

Migrated production throw sites for invalid arguments and invalid state from
`JavaIllegalArgumentException`/`JavaIllegalStateException` to
`ReasonerInputError`/`ReasonerStateError` across language, inference, entity,
operator, plugin, storage, and event modules. Also moved parser invalid-input
from the Java exception hierarchy to `ReasonerInputError`; migrated numeric
parse, null/state, unsupported-operation, and assertion/invariant callsites to
native reasoner error classes. Messages and cause chains are retained; error
message interpolation uses templates where touched.

`JavaExceptions.ts` remains as a compatibility observer for legacy-facing
tests/facades, with `Symbol.hasInstance` mapping old argument/state/null,
number-format, unsupported and assertion observations onto the native error
names. New production code no longer imports or constructs those Java-named
classes. The Java-shaped namespace itself remains in runtime facade and ambient
test compatibility types and is still a separate 031/023 task.

### Verification

- Non-incremental typecheck passed.
- TS-only M2: `503 passed / 0 failed / 2 skipped`.
- Java M2: `505 passed / 0 failed / 0 skipped`.
- Focused boundary tests passed after replacing stale source-text assertions.
- Run affected NALs and one serial M1-prime on the immutable
  exception-migration commit before making any broad M1 claim. M2 alone does
  not complete 023/031.

The exception-migration M1-prime body completed `243/243` with zero
failure/timeout/process_limit/exception/stall/not_run rows; affected NALs were
`4/4`. The reduced/extra/markerless rows from the immediately preceding
source-equivalent line remain planning evidence only; exact-commit reruns are
still required before closing 031.

## 2026-10-01 native host boundary batch

The former `src/platform/node/native-host-adapter.ts` and browser counterpart
mixed native filesystem/serialization effects with a translated `java`
namespace. The native adapters now expose only host capabilities
(`NodeTextWriter`, byte/value encode/decode helpers, browser clock and writer
capabilities). The translated namespace moved to explicit
`legacy-namespace.ts` files and is reached only by the Node legacy facade and
the translated browser demo boundary.

This removes `java.io`, `java.net`, `java.lang` and `java.util` construction
from the native adapter boundary. It does not claim that the translated
compatibility facade is deleted; its removal requires migrating remaining
test/tool and demo call sites to native text, collection, class-token and
capability APIs. The removal condition is that no maintained caller imports
`java` from either legacy facade and parity/M1' evidence remains equal.

Verification on the current worktree: `npm run typecheck` passed; native host
contracts passed `11/11`; TS-only M2 passed `503/505` with zero failures and
two skips; Java M2 passed `507/507`; `npm run build`, `npm run audit:jree`,
and the browser worker build with `ALLOW_DIRTY_OPENNARS=1` passed. Existing esbuild warnings about
`import.meta` and duplicate switch cases are unrelated.

The exact-commit M1', Java M2, reduced #245, #246 and markerless rows must be
rerun after this batch is committed; prior hashes cannot be reused.

## Exact-commit gate results for `cd3520f`

The boundary commit is `cd3520ff4fd2b544b2d47f74ba761ed78802d0e6` and was
pushed to `origin/main`. The exact evidence is retained under
`reports/evidence/` with these SHA-256 values:

- TS-only M2 `505 passed / 0 failed / 2 skipped`: `m2-native-host-cd3520f-ts.tap`,
  `018F496F4198006CCB447365E2305BCD2620198523AD90E425AD603EC3970A70`.
- Java M2 `507 passed / 0 failed / 0 skipped`: `m2-native-host-cd3520f-java.tap`,
  `2BB72F66CA4794102FAB6B52508EC84DD7517E889F0D8B20F9EF52320F662C8C`.
- M1' body `243/243` passed: `m1prime-cd3520f-mminus-20261001.jsonl`,
  `668D4741DE898DAC7BAA3B76E239BEDA1EB5EC17C205BAB3EC6B7220F334441C`.
- #25 passed: `m1prime-cd3520f-nars-multistep-3-20261001.jsonl`,
  `F099CA00EA48BA67A4279171440DCE3B4FA77D14D1874183889AA16459457DEF`.
- #246 passed: `m1prime-cd3520f-simple-246-20261001.jsonl`,
  `3D2B0470630758917F2B7ACA62415CDD0BFA2FABCF1C9696C7CEAEF83759C242`.
- #245 65536 fixture hit `process_limit` at `1800034 ms`, last progress cycle
  `220251`, marker missing, no exception/timeout/stall: `m1prime-cd3520f-long-65536-20261001.jsonl`,
  `21C68524B0EFF0826FA1541BDA88805FE3673D63443ABCBD2A9A537FC0B5BE77`.
- Strict markerless simple and long comparisons are both `equal=true`,
  `first_difference=null`; comparison hashes are
  `FE5D951C031772C2EBF08D947FEF80D9E79BF0E23D232826BE0F7984AFDE19` for
  `markerless-cd3520f-simple-compare-20261001.json` and
  `markerless-cd3520f-long-compare-20261001.json`.

The source audit at this commit reports `0/0` direct npm jree imports and no
`java.util`/`java.lang` code hits after comment masking. The platform audit
reports zero direct jree imports; remaining Node imports are confined to host
and tooling scopes. These are closure facts, not a claim that all Java-shaped
compatibility contracts have been deleted.

## Legacy harness removal batch

The compatibility namespace used by translated tests and diagnostic scripts
was moved out of `src` into `test/support`. The published source tree now
contains only native host adapters; `dist` has no `legacy-runtime-facade.js`
or `legacy-namespace.js`. The demo workers already pass native strings and do
not import this harness.

After the move: typecheck/build/release package checks passed; TS-only M2 was
`505` total with `503 passed / 0 failed / 2 skipped`; Java M2 was `507/507`.
The raw TAP hashes are `070716E6E48F85AF33E9FE51CC528602C319A9F6CAEA2F51D5A8439936A9ED06`
and `29B0F2217D5A408B7937164754E3A06C9B6066DCD4FDCAF908E0AFC4A076F1CD`.
The new source audit is `0/0` direct jree imports with SHA-256
`7EC1C0B03423ACA418E4D4CC39AB343AA99F4F3B1F8F02D183162EDB17718E48`;
the platform audit SHA-256 is
`10237222BD691D518BF06A73AA1C5D20BCA0357ED95940013316646EDD63B601`.

This harness removal was committed as `91482a7` and pushed. It is a source
tree/package boundary change only; no new M1' run is inferred from it. The
exact post-move M2 TAP hashes are
`070716E6E48F85AF33E9FE51CC528602C319A9F6CAEA2F51D5A8439936A9ED06` and
`29B0F2217D5A408B7937164754E3A06C9B6066DCD4FDCAF908E0AFC4A076F1CD`.

## Semantic helper cleanup batch (`d08a7aa`)

Production Java-named exception/runtime helpers were removed from `src`:

- `ResourceCompat` now exposes native `ResourceError` with `cause` and suppressed errors.
- `CompoundTerm` uses `ReasonerOperationError` for iterator and clone failures.
- `JavaRandom`, `JavaArrays`, and `JavaIterator` became `ReasonerRandom`, `ValueArrays`, and `MutableIterator`; their observable deterministic random, hash and removal contracts remain unchanged.
- `JavaExceptions`, `native-java-runtime`, and ambient Java declarations moved to `test/support`, so they are absent from `dist` and the release package.

Exact M2 evidence on `d08a7aa97ae126b3b85361c02d164ba1ae255453`:

- TS-only: `503 passed / 0 failed / 2 skipped`, SHA-256 `1ADA1B40C905885CA07A4603844F5B9EE37D82EEB18846D24923F430E0D6A84E`.
- Java: `507/507`, SHA-256 `CE1D6A1D264DB99D630945AE6C60471875464B880A6CB60A654F6185E9FE5752`.
- Source audit: direct jree `0/0`, Java object/util/lang code hits all zero; SHA-256 `F5FC7FE7C822D3A19AF65997159FF84B92217188A3E8F9AC33056C2129D6030A`.

## Next batch plan: native text throughout the reasoner

CodeGraph confirms `Term.name()` is the central text contract. `NativeJavaString`
currently allocates a wrapper around each term name and exposes Java methods
(`length`, `charAt`, `subSequence`, `equals`, `hashCode`). Its behavior is not
the NARS domain contract: NARS needs exact UTF-16 code-unit text, stable
case-sensitive name equality, Java-compatible hash/order where those values
affect term maps and canonical ordering. TypeScript `string` already provides
UTF-16 storage/indexing and direct equality; only the explicitly observed
hash/order formulas need small semantic helpers.

The batch will move core signatures to `string`, remove boxed `NativeJavaString`
construction from production, replace `JavaCharSequence`/`JavaStringInput`
with native text types, and migrate string method callsites to `.length`,
`.charAt`, `.slice`, and direct equality. Helpers will be renamed to domain
names (`textValue`, `textEquals`, `textHashCode`, `compareText`) and retained
only where they encode canonical behavior. The legacy test facade may provide
a boxed-string fixture to continue testing interop, but production `src` and
public API must not depend on it. This is a direct step toward the requested
independent TypeScript NARS implementation.

Risk/verification contract: compare exact term spellings, supplementary
characters, isolated surrogate code units, case sensitivity, parser indices,
sorting order, hashes, Map/Bag lookups, and output strings. Direct text tests
run first, then typecheck, serial TS-only/Java M2, affected NALs, M1' and strict
markerless on the final immutable commit. Any changed hash/order or marker is
a blocker, not an acceptable cost of native strings.

## 2026-10-02 native text and TypeScript idiom batch

The current batch moves reasoner text construction toward native TypeScript:
clear diagnostic and Narsese formatting uses template literals, fixed term
index output uses an array plus `join`, and image/variable names use native
string assembly. `TextString` is now `string` in production; boxed text remains
only in `test/support` as an interop fixture. Variable constructors normalize
boxed inputs before establishing type/scope, preserving equality and Java
UTF-16 hash behavior.

The read-only idiom survey found three boundaries that must remain explicit:
Java-compatible UTF-16 hash/order, runtime class identity, and collection
iterator/remove semantics. They are not mechanical template-string or
`Map`/`Set` replacements. Overload dispatch and nullable sentinels likewise
remain compatibility contracts until their callers are migrated as a separate
batch.

Verification on the current uncommitted tree:

- non-incremental typecheck: passed;
- focused native-text and output contracts: 25/25 passed, then core/runtime
  regression set 77/77 passed;
- TS-only serial M2: 507 total, 505 passed, 0 failed, 2 skipped, 129607 ms;
  raw TAP: `reports/evidence/m2-native-text-idioms-ts-final2-20261002.tap`,
  SHA-256 `48FB7C2E195BFCBBA549F76B042EE4BC2DDFA6E160E9297E06ABE5A8C9DF3DD1`;
- Java serial M2: 507/507, 0 failed, 0 skipped, 131973 ms;
  raw TAP: `reports/evidence/m2-native-text-idioms-java-20261002.tap`,
  SHA-256 `CED702229FF1986F5B817E06BF3F4735A7DAFE0040FFDFBFC2092E464B52F4FA`;
- build, build checks, and dist API checks: passed;
- source jree audit: direct imports 0/0; platform audit remains an inventory,
  not proof that every browser/runtime boundary is platform-neutral.

This batch does not claim M1-prime, NAL parity, markerless equality, or spec
031 completion. Those require a new immutable commit and their own evidence.
