import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { Disjunction } from "../../src/language/Disjunction.ts";
import { Negation } from "../../src/language/Negation.ts";
import { Similarity } from "../../src/language/Similarity.ts";
import { Term } from "../../src/language/Term.ts";
import { JavaIllegalArgumentException } from "../../src/runtime/JavaExceptions.ts";

const sources = [
    "src/language/Similarity.ts",
    "src/language/Disjunction.ts",
    "src/language/Negation.ts",
];

test("Similarity, Disjunction, and Negation avoid direct jree argument exceptions", () => {
    for (const file of sources) {
        const source = readFileSync(file, "utf8");
        assert.doesNotMatch(source, /new java\.lang\.(IllegalArgumentException|IllegalStateException)\(/, file);
    }
});

test("Similarity preserves project-owned argument exception identity", () => {
    const SimilarityConstructor = Similarity as unknown as new (...args: unknown[]) => unknown;
    const clone = Similarity.make(Term.get("similarity-a"), Term.get("similarity-b"))?.clone as unknown as (...args: unknown[]) => unknown;
    assert.throws(() => new SimilarityConstructor(), (error: unknown) => error instanceof JavaIllegalArgumentException);
    assert.throws(() => clone(Term.get("unexpected"), Term.get("extra")), (error: unknown) => error instanceof JavaIllegalArgumentException);
});

test("Disjunction preserves project-owned argument exception identity", () => {
    const make = Disjunction.make as unknown as (...args: unknown[]) => unknown;
    const disjunction = Disjunction.make(Term.get("disjunction-a"), Term.get("disjunction-b"));
    const clone = disjunction?.clone as unknown as (...args: unknown[]) => unknown;
    assert.throws(() => make(), (error: unknown) => error instanceof JavaIllegalArgumentException);
    assert.throws(() => clone(Term.get("unexpected"), Term.get("extra")), (error: unknown) => error instanceof JavaIllegalArgumentException);
});

test("Negation preserves project-owned argument exception identity", () => {
    const make = Negation.make as unknown as (...args: unknown[]) => unknown;
    const negation = Negation.make(Term.get("negation-a"));
    const clone = negation?.clone as unknown as (...args: unknown[]) => unknown;
    assert.throws(() => make(), (error: unknown) => error instanceof JavaIllegalArgumentException);
    assert.throws(() => clone(Term.get("unexpected"), Term.get("extra")), (error: unknown) => error instanceof JavaIllegalArgumentException);
});
