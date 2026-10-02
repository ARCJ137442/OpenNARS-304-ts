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

