# TypeScript idiom survey: Java-shaped expressions

## Scope

This probe records the language-level cleanup boundary after the v1.0.4 release. It is intentionally separate from semantic runtime work.

## Findings

- Active production string concatenation is already mostly converted to template strings. Remaining high-value examples are concentrated in test/support code and a few boundary builders.
- A text expression such as `"*volume=" + volume` should become `` `*volume=${volume}` `` when every operand is textual formatting. Do not change numeric addition or hash arithmetic.
- `string` is the correct core type for text input. Java UTF-16 behavior is already provided by JavaScript string indexing and `length`; Java hash and comparison helpers remain explicit contracts until their callers are migrated.
- Exact term identity must use `constructor ===` (or an explicit token), not a broad `instanceof`, because parent/child term classes have different semantic roles.
- Native `Map`/`Set` cannot replace value-semantic containers globally. `equals`, insertion order, live views, iterator removal, and fail-fast behavior are observable contracts.
- Java-style exception names, logger facades, overload dispatch, and mutable iterators require separate batches with direct contract tests.

## First implementation batch

1. Convert unambiguous text formatting concatenations in TypeScript tests and support harnesses to template strings.
2. Convert the remaining sensory Narsese text builder to one template expression while preserving exact output.
3. Keep Java-compatible wrappers where they are still part of a tested boundary; do not rename or remove them in this batch.
4. Run typecheck, build, focused string/runtime tests, and the existing M2 gate. Any parity change stops the batch.

## Deferred batches

- Core APIs from boxed text inputs to native `string`.
- Project error taxonomy and removal of Java exception aliases.
- Constructor/token based class identity cleanup.
- Collection and iterator migration after contract-level benchmarks.

## Batch 2: sentence rendering

- `SentenceStringBuilder` was a one-shot local accumulator, not a public mutable contract.
- `TruthValue.appendString(builder, external)` had only one production caller and existed solely to append a formatted truth value.
- The native replacement is a `string` return plus a local `string[]` assembled with `join("")`.
- Sentence keys use the existing `Stamp.getOccurrenceTimeString()` value instead of adapting a stamp to a builder.
- The compatibility `Stamp.appendOcurrenceTime` method remains for external/test callers and is intentionally deferred to the stamp boundary batch.

## Batch 3: exact class checks

- Internal checks that only ask whether two terms have the same concrete TypeScript class now compare `constructor` values directly.
- This preserves the old exact-token semantics while avoiding `ClassToken.fromConstructor` lookup on hot inference paths.
- Event and plugin dispatch still use `ClassToken`/`.class`; those tokens are an identity protocol, not an incidental reflection call, and remain a separate compatibility boundary.
- Diagnostic names use `constructor.name` where the old code only needed the display name.

## Batch 4: native event identity

- Event keys are now constructor values (`ClassKey`), not allocated reflection tokens.
- `getClass(object)` is the readable native helper and returns `object.constructor` directly.
- The old `ClassToken` class, WeakMap cache, token equality methods, and `.getName()`/`.getSimpleName()` event formatting were removed from production.
- Static `.class` accessors currently return the constructor for source compatibility; the event map itself never sees a token object. Further naming cleanup can remove the transitional accessor after consumers are migrated.
- Error messages identify unknown events by `constructor.name`, preserving useful diagnostics without object reflection wrappers.
