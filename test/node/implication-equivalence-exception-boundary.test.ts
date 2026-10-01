import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { Implication } from "../../src/language/Implication.ts";
import { Equivalence } from "../../src/language/Equivalence.ts";
import { Term } from "../../src/language/Term.ts";
import { JavaIllegalArgumentException, JavaIllegalStateException } from "../support/legacy-exceptions.ts";

test("Implication and Equivalence use project-owned exception classes", () => {
    for (const file of ["src/language/Implication.ts", "src/language/Equivalence.ts"]) {
        const source = readFileSync(file, "utf8");
        assert.doesNotMatch(source, /new java\.lang\.(IllegalArgumentException|IllegalStateException)\(/, file);
    }
});

test("Implication invalid overloads preserve project exception identity", () => {
    const make = Implication.make as unknown as (...args: unknown[]) => unknown;
    assert.throws(() => new (Implication as unknown as new (...args: unknown[]) => unknown)(),
        (error: unknown) => error instanceof JavaIllegalArgumentException);
    assert.throws(() => make(),
        (error: unknown) => error instanceof JavaIllegalArgumentException);

    const implication = Implication.make(Term.get("implication-a"), Term.get("implication-b"), 1);
    assert.throws(() => implication.clone([Term.get("only-one")]),
        (error: unknown) => error instanceof JavaIllegalStateException);
});

test("Equivalence invalid overloads preserve project exception identity", () => {
    const make = Equivalence.make as unknown as (...args: unknown[]) => unknown;
    assert.throws(() => make(),
        (error: unknown) => error instanceof JavaIllegalArgumentException);

    const equivalence = Equivalence.make(Term.get("equivalence-a"), Term.get("equivalence-b"), 0);
    assert.throws(() => equivalence.clone([Term.get("only-one")]),
        (error: unknown) => error instanceof JavaIllegalStateException);
    assert.throws(() => (equivalence.clone as unknown as (...args: unknown[]) => unknown)(Term.get("extra"), Term.get("args")),
        (error: unknown) => error instanceof JavaIllegalArgumentException);
});
