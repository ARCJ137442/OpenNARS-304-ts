# Plans

> Part of spec: [ts-translation-assessment](README.md)

## Guiding Inputs

- Java baseline: java-master/src/main/java/org/opennars
- TS target: src with jree dependency
- Current gaps: parameter package mismatch, build/test scaffolding, runtime semantics gaps

## Phase 1: Alignment and Structure

- Decide canonical location for Parameters and Debug (parameter vs main).
- Normalize imports and update references (ConfigReader, Nar, Memory, inference utilities).
- Document package mapping rules to prevent future drift.

## Phase 2: Runtime Semantics

- Define TS replacements for Java threading (Thread, synchronized, volatile).
- Define serialization strategy to replace ObjectInputStream and Serializable.
- Replace reflection usage in ConfigReader and Nar.overrideParameters with explicit registries or metadata.

## Phase 3: Dependency Parity

- Replace Guava and commons-lang3 usages with TS utilities or local helpers.
- Audit and document jree usage; decide whether to keep it or phase it out.

## Phase 4: Verification

- Add a build script (enable emit or a bundler) and document how to run it.
- Wire a test runner and connect existing test/ files.
- Create a minimal smoke test (Nar init, Narsese parse, one reasoning cycle).

## Exit Criteria

- Package structure matches Java or is explicitly documented.
- Build and test scripts run locally without manual setup.
- Core reasoning path runs with a sample input file.
