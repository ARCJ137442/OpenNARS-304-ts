# file_template.md

> Template for the analysis record of a single TypeScript file. Store actual records under `analysis/<ts-relative-path>.md`, mirroring the `src/` directory, and keep the Markdown filename identical to the analyzed TypeScript file.

## 1. Metadata

| Field | Value |
| --- | --- |
| TypeScript file | `src/.../<File>.ts` |
| Matching Java source | `java-master/.../<File>.java` |
| Module chain | e.g. `io -> entity -> ...` aligned with the roadmap |
| Analysis date / owner | `2026-01-11 / ChatGPT Codex` |
| Evidence sources | `deps.xml` excerpt, specs, design docs |

Explain how the TS file maps to the Java source and list the references that will be cited later.

## 2. Syntax check (`npx tsc <file> --noEmit`)

- Command executed
- Key findings: missing symbols, type errors, unresolved imports
- Takeaways: can this file compile, and does it rely on ambient declarations?

For repetitive errors, capture a few representative samples with line numbers instead of dumping the full log.

## 3. TypeScript dependency audit

### 3.1 Structural dependencies

| Symbol | Source file | Touch point | Reason |
| --- | --- | --- | --- |
| `Concept` | `src/concept/Concept.ts` | Constructor | Directly required for runtime behavior |

### 3.2 Superficial dependencies (constants, diagnostics, enums, etc.)

| Symbol | Source file | Touch point | Notes |
| --- | --- | --- | --- |
| `Operator` | `src/bag/Operator.ts` | Constant definition | Referenced only through constants |

### 3.3 Missing symbols / unresolved references

List items raised by tsc or manual inspection and note the suspected source plus severity.

Highlight why each dependency matters; structural ones block behavior, superficial ones may be deferred if the cost is acceptable.

## 4. Java dependency cross-check (from `deps.xml`)

- Direct edges: `<from> -> <to>` with the corresponding `deps.xml` snippet or line reference.
- Cross-check result: describe where the TS audit diverges from the Java dependency graph.
- Divergence notes: justify any mismatch (constant-only usage, not yet ported classes, etc.).

Clarify which relationships are grounded in Java semantics versus TypeScript-only artifacts.

## 5. Function description sourced from Java

- **Responsibility**: one-sentence summary of the Java file.
- **Key data structures**: main classes, members, and their roles.
- **Core flow / algorithms**: ordered steps or pseudo-code for important methods.
- **Critical invariants / constraints**: initialization, default values, concurrency, serialization, etc.
- **Collaboration points**: how this file interacts with prerequisite or successor modules.

This section must be backed by the Java source, not guesses from TypeScript.

## 6. Consistency risks

Capture anything that could break the "same behavior" goal, including:

- Initialization order and static blocks
- Default/null handling differences
- Inherited or implicit interface dependencies
- Serialization or protocol assumptions
- Any other behavior that might drift during porting

Each risk should describe the trigger and the mitigation or follow-up action.

## 7. Roadmap placement

- Chain position: `io -> entity -> ...`
- Predecessors: files that must be analyzed/ported first and why.
- Unlocks: files or modules enabled once this file is complete.
- Evidence: cite whether the ordering comes from the TS audit, `deps.xml`, or Java semantics.

This keeps the output aligned with the roadmap template from spec003.

## 8. Additional notes

- Location of the `tsc` log or any helper script outputs.
- `deps.xml` snippets that were referenced.
- TODO / open questions for review or follow-up specs.

Document anything that needs to be fed back into specs or tracking artifacts.
