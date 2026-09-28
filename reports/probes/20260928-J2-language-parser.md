# J2 Language and Parser Probe

## Checkpoint

- Date: 2026-09-28 (Asia/Shanghai)
- Probe scope: `J2-language-parser`
- Owner paths: `src/language/**`, `src/io/Narsese.ts`, `src/io/Parser.ts`, `src/io/Symbols.ts`, `src/io/Texts.ts`
- Current implementation commit: `5723d99` (`docs(023): record J1 close evidence and markerless diagnosis`), with production code unchanged since `7d95bf6`.
- J1's PC full M1 evidence and the required markerless diagnostic are complete. The M1 result is `244 passed + 1 process_limit`, and the separate TS/Java markerless comparison is `equal=true`, `first_difference=null`; the process limit is classified as a TS performance/resource observation. J1 is now the accepted predecessor cluster, so this probe may proceed to J2 production implementation.
- This is an investigation checkpoint. J2 is not complete and no stage 023/024 completion claim is made.

## Direct dependency inventory

## Read-only follow-up (2026-09-28)

- CodeGraph is available and current; its broad symbol query mixed unrelated callers, so exact `rg` scans and the on-disk source remain authoritative before edits.
- The six direct J2 imports are unchanged: `CompoundTerm.ts`, `Term.ts`, `Terms.ts`, `Variable.ts`, `Variables.ts`, and `Narsese.ts`. `Parser.ts` already uses the project-owned input type; `Symbols.ts` and `Texts.ts` remain semantic dependencies without a direct `jree` runtime import.
- J1 close evidence is recorded in `reports/evidence/pc-goal-j1-full-m1-20260928.jsonl` and `reports/evidence/j1-markerless-diagnostic-20260928/`; no J1 process remains active. The remaining J2 work is a single cohesive implementation batch followed by its own direct tests, affected NALs, TS-only M2, and PC full M1 close gate.
- Required J2 changes remain a single cohesive batch across the six owned files, using the existing runtime string, exception, collection, iterator, and random contracts. No supporting-cluster production edit is currently required by the source scan.

## Context restoration checkpoint (2026-09-28)

- After context restoration, `git status --short --branch` confirms `main...origin/main [ahead 2]`; the only worktree entries are the previously preserved J1 evidence directories/files and this probe file. No production edits are present yet.
- `git log -1 --oneline --decorate` confirms `5723d99 (HEAD -> main) docs(023): record J1 close evidence and markerless diagnosis`.
- CodeGraph reports an up-to-date index (362 files, 6,594 nodes, 25,147 edges); LeanSpec board is available and still shows 023/024 in progress. The relevant LeanSpec search returns 023 with J2 listed as a partial contract slice.
- The next irreversible action is the planned cohesive J2 implementation batch. The six owned files and the existing runtime adapters remain the source of truth; this checkpoint records no new semantic conclusion beyond confirming that the plan is current.

## Implementation readiness checkpoint (2026-09-28)

- The current source scan confirms that the six-file batch still contains the only J2-owned direct `jree` imports; no supporting J3/J4/J5 production edit is needed before implementation.
- The public signatures requiring deliberate boundary treatment are `CompoundTerm.addTermsTo`, `CompoundTerm.iterator`, `Term.get`, `Terms.verify*`, `Variable`/`Variables` text entry points, and the private `Narsese` buffer helpers. They will use project-owned structural contracts or native `string`/array values while preserving downstream call compatibility.
- `Narsese` currently relies on `java.lang.StringBuilder` only for mutable trimming and substring extraction. A project-owned UTF-16 builder can therefore be local to `Narsese.ts`; it must preserve `length`, `charAt`, `substring`, `delete`, `trimToSize`, `toString`, and `subSequence` observations used by the parser.
- Before editing, the migration invariant is: preserve translated class identity and observable exception messages, replace runtime namespace imports, and keep all UTF-16 index arithmetic explicit through `JavaStringInput`/runtime helpers.

The six J2 production files that still import the `jree` namespace directly are:

- `src/language/CompoundTerm.ts`
- `src/language/Term.ts`
- `src/language/Terms.ts`
- `src/language/Variable.ts`
- `src/language/Variables.ts`
- `src/io/Narsese.ts`

`src/io/Parser.ts` only imports the project-owned `JavaStringInput` type. `Symbols.ts` and `Texts.ts` are already native at runtime but remain in the J2 semantic surface because parser symbols and numeric text formatting are consumed by the same contracts.

The direct imports are one responsibility cluster, not six independent migration tasks. The implementation must preserve the public translated signatures while replacing runtime observations with project-owned adapters and native arrays/strings at the boundary.

## Contract families

### 1. Java text and UTF-16 behavior

- `Term`, `CompoundTerm`, `Variable`, and `Narsese` accept `CharSequence`/`String` values and return names through `AbstractTerm.name()`.
- `length`, `charAt`, `substring`, `trim`, `indexOf`, and parser character scans must count UTF-16 code units, including supplementary characters.
- `Term.equals` and `hashCode`, `Texts.compareTo`, and operator/name comparisons require Java `String` exact equality and the 31-based signed 32-bit hash.
- `StringBuilder` is only used by `Narsese.parseTask` and `parseTense`; its required contract is construction, append/delete/subSequence/toString, not a general Java reflection surface.
- Existing `javaStringLength`, `javaStringValue`, `javaStringHashCode`, `javaStringsEqual`, `toJavaString`, and `JavaCharSequence` helpers are the compatibility starting point. J2 must make callers depend on those project-owned contracts rather than `java.lang.String` methods.

### 2. Collections, arrays, and iteration

- `CompoundTerm.shuffle` and `Terms` currently type against `java.util.Random`, `Collection`, `Set`, and `Iterator`; these types cross into J3 and J4 call sites, so the J2 batch must preserve structural interfaces while removing direct namespace imports from the owned files.
- `CompoundTerm.termList` requires fixed-size `Arrays.asList` behavior; `NativeFixedList` already provides the required set-versus-size mutation distinction.
- `CompoundTerm.getContainedTerms`, `Terms.verifyNonNull`, and `Variables` matching rely on insertion-ordered Java Set equality and value-based contains/remove; `NativeSet` is the project-owned implementation.
- `CompoundTerm.iterator` needs `hasNext`, `next`, `remove` and Java-shaped exhaustion/unsupported-operation errors. `JavaIterator` is the project-owned structural interface; the iterator must not leak `jree` types.
- `java.util.Arrays.sort` and `Arrays.toString` are the remaining utility calls. Sorting must preserve Java comparator order; diagnostics must retain Java array spelling used by direct tests.

### 3. Exceptions and class identity

- `CompoundTerm.UnableToCloneException`, parser invalid-input paths, variable argument validation, and `Terms.verify*` must all throw project-owned `JavaIllegalArgumentException`, `JavaIllegalStateException`, `JavaRuntimeException`, or `Parser.InvalidInputException`.
- No J2 production path should construct or return `java.lang.Throwable`, `java.lang.RuntimeException`, or `java.util.NoSuchElementException` after the batch. Existing exception messages are observable and must remain stable.
- `Term`/`CompoundTerm` equality uses exact runtime class identity. The replacement must continue to reject equal names from different term subclasses and retain `RuntimeClassToken` behavior established by J1.

### 4. Narsese parser semantics

- `parseTask` strips budget/truth suffixes using a mutable text buffer, then parses punctuation, tense, statements, sets, compounds, and nested arguments.
- `parseTerm`, `parseStatement`, `parseCompoundTerm`, and `parseArguments` must retain nesting depth, relation recognition, separator handling, image/product placeholders, temporal order, and exact diagnostic locations.
- `topRelation`, `nextSeparator`, opener/closer checks, and `possiblyNarsese` are character-index algorithms. They must use UTF-16 code-unit indices and must not split a surrogate pair accidentally.
- `parseTense` and the temporal relation forms `=/>`, `=|>`, and `=\\>` are covered by existing temporal tests and affected NALs.

## Existing project-owned replacements

- `JavaStringInput`, `JavaCharSequence`, `JavaChar`, `toJavaString`, and Java string hash/equality helpers: `src/runtime/jree-compat.ts`.
- `NativeList`, `NativeFixedList`, `NativeReadOnlyList`, `NativeSet`, `NativeMap`, `NativeSortedSet`, and their iterators: `src/runtime/`.
- `JavaIterator`: `src/runtime/JavaIterator.ts`.
- `JavaRandom`: `src/runtime/JavaRandom.ts`.
- `JavaExceptions` and `RuntimeClassToken`: `src/runtime/`.

These implementations have local contracts, but J2 still needs to make its owned source use them directly and add tests for the parser-facing edge cases. The compatibility bridge remains available to downstream clusters until their owners migrate.

## Cohesive implementation batch

The J2 code change is one batch with four tightly coupled slices:

1. Replace `jree` imports in the six owned files with project-owned exception, string, collection, random, iterator, and array helpers. Keep structural input types where downstream callers still require them, but do not expose a `jree` namespace in J2 public declarations.
2. Convert `Term`, `CompoundTerm`, `Variable`, and `Variables` text and collection operations to native/project-owned contracts, preserving Java exact class checks, hash codes, insertion order, fixed-size lists, random call counts, and exception messages.
3. Replace `Narsese`'s `java.lang.StringBuilder` and `S` template calls with a project-owned builder/string interpolation helper while retaining all parser branches, UTF-16 indices, and diagnostic text.
4. Add/update direct tests for supplementary-plane names, hash/compare exactness, nested separators, temporal relations, collection iterator boundaries, duplicate/order diagnostics, and parser exception classes. Then run the J2 direct test set and affected NALs as one coherent validation pass.

No J3/J4/J5 production file is part of this batch. If a public type adjustment requires a supporting edit, it must remain a project-owned runtime type and be recorded before editing.

## Direct validation and NAL set

- Direct tests: `test/node/language-runtime.test.ts`, `test/node/narsese-boundary.test.ts`, `test/node/narsese-temporal.test.ts`, plus the focused string/exception boundary tests selected by the validation plan.
- Affected NALs: `nal4.7.nal`, `nal6.17.nal`, `nal8.add.nal`, and `nars_transitivity.nal`.
- Required local checks: non-incremental typecheck, build, dist API, migration-pattern scan, jree audit, platform audit, and TS-only M2. The J2 close gate is a single PC complete M1 after all J2 exits pass.
- The M1 close gate must use one process, one unique evidence prefix, per-file checkpoint/resume, RSS monitoring, and exact classification of passed/failed/skipped/timeout/process_limit/exception/stall/not_run.

## Exit conditions

- Zero direct `jree` imports in the six J2-owned production files; remaining bridge imports are assigned to J3-J5 and documented.
- No public J2 declaration leaks `jree` namespace types; project-owned structural types are used at the boundary.
- Direct contracts cover UTF-16, Java hash/equality/compare, fixed-size and ordered collections, iterator exhaustion/removal, random ordering, exception classes/messages, and parser diagnostics.
- All J2 direct tests, typecheck, build, dist API, audits, and four affected NALs pass.
- TS-only M2 has no unclassified failure. Only after those facts are present may the J2 PC full M1 close gate run.

## Risks and falsifiable experiments

- Risk: replacing `java.lang.String` values too early can change `String(value)` and `charAt` behavior in downstream term constructors. Experiment: run supplementary-plane and ASCII names through `Term.get`, `Variable.getName`, `Narsese.parseTerm`, and round-trip `toString` before changing parser code.
- Risk: native `Set`/`Array` equality can reverse the Java `equals` receiver or alter insertion order. Experiment: exercise equivalent cloned terms, duplicate variables, nested image/product matching, and iterator removal against `NativeSet` and existing J2 tests.
- Risk: a builder rewrite can shift parser indices after budget/truth trimming. Experiment: compare all punctuation/tense forms and malformed diagnostics before and after the batch, then run the four sentinel NALs.

## Supported claims

- J2 scope, direct imports, contract families, project-owned replacement candidates, and the batch exit conditions are now recorded.
- J1 is limited to its accepted cluster evidence; J2 production implementation is now active, while J2, stage 023, stage 024, and release readiness are not complete.

## Post-restoration implementation checkpoint (2026-09-28)

- The previous context ended before any edit command completed. Re-reading the plan and current tree confirms that J2 production files are still unchanged at `5723d99`; no partial implementation patch is present.
- The implementation remains authorized as one cohesive six-file batch. The first compile-safe move is to replace direct `jree` type/value usage with project-owned runtime contracts while preserving the translated public overloads and Java observable behavior.
- The next action is source editing, followed immediately by non-incremental typecheck. Any compiler failure is an implementation defect to resolve within this J2 batch; it does not justify splitting the responsibility by file.

## J2 implementation and local validation (2026-09-28)

- Implemented the cohesive six-file migration in `CompoundTerm.ts`, `Term.ts`, `Terms.ts`, `Variable.ts`, `Variables.ts`, and `Narsese.ts`. Direct `jree` imports and namespace runtime references are gone from those owned files. `Narsese` now uses a local UTF-16 builder; term/variable text keeps Java hash/equality/compare behavior; collections, sorting, random input, iterators, and exception classes use project-owned contracts.
- Added project-owned `JavaNoSuchElementException` and `JavaUnsupportedOperationException` plus legacy `instanceof` registration, because `CompoundTerm.iterator()` must preserve the existing Java exception identity seen by tests.
- Added the supplementary-plane text contract in `test/node/language-runtime.test.ts`; it verifies UTF-16 Java hash/equality and variable text boundaries.
- `npm run typecheck`: passed with zero diagnostics. `npm run build`, `npm run test:build`, and `npm run test:api:dist`: passed. Focused J2/direct tests: 62/62 passed before the supplementary test; the updated language suite is 9/9, and the variable/order regression slice is 19/19.
- Full TS-only M2 evidence: `reports/evidence/j2-ts-only-m2-20260928.tap`, 496 tests total, 494 passed, 0 failed, 2 skipped, exit code 0. SHA-256: `15DB029785F82E5E4545C914D6532EFE95B9C5B1A3478C67A0D2CCC50B212662`.
- Affected NAL evidence: `reports/evidence/j2-affected-nal-20260928.jsonl`, nal4.7/nal6.17/nal8.add passed; the first 180,000 ms transitivity run is explicitly classified as `process_limit` with last progress 184,588 and no exception. SHA-256: `B225B4B4AAC9DA6FF1CA1778686EF31278DB7BE92FB29C32E56DC15A19A9AC45`.
- The permitted 900,000 ms single-process rerun of `nars_transitivity.nal` passed both markers: `reports/evidence/j2-nars-transitivity-900-20260928.jsonl`, 226,869 ms, peak RSS 304,193,536 bytes, SHA-256 `F257AEF457C74D367A438D987B4040FC9AE3EE6EBBD36A5DB01C2F0019CF9912`.
- Static migration outputs are saved as `reports/evidence/j2-audit-jree-20260928.json` and `reports/evidence/j2-audit-platform-20260928.json`; both commands exit 0. The J2-owned direct-import count is zero; the remaining seven direct-import files belong to later responsibility clusters or the compatibility bridge.
- J2 is ready for its immutable close commit and PC full M1 close gate. J2 is not complete until that M1 evidence is recorded; 023, 024, and release readiness remain unclaimed.

