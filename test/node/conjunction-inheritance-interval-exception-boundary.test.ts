import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { Conjunction } from "../../src/language/Conjunction.ts";
import { Inheritance } from "../../src/language/Inheritance.ts";
import { Interval } from "../../src/language/Interval.ts";
import { Debug } from "../../src/main/Debug.ts";
import { Term } from "../../src/language/Term.ts";
import { JavaIllegalArgumentException } from "../../src/runtime/JavaExceptions.ts";

const sources = [
    "src/language/Conjunction.ts",
    "src/language/Inheritance.ts",
    "src/language/Interval.ts",
];

test("Conjunction, Inheritance, and Interval avoid direct jree argument/state exceptions", () => {
    for (const file of sources) {
        const source = readFileSync(file, "utf8");
        assert.doesNotMatch(source, /new java\.lang\.(IllegalArgumentException|IllegalStateException)\(/, file);
    }
});

test("Conjunction and Interval preserve project-owned argument exception identity", () => {
    const conjunctionConstructor = Conjunction as unknown as new (...args: unknown[]) => unknown;
    const intervalConstructor = Interval as unknown as new (...args: unknown[]) => unknown;

    assert.throws(() => new conjunctionConstructor(), (error: unknown) => error instanceof JavaIllegalArgumentException);
    assert.throws(() => new intervalConstructor(), (error: unknown) => error instanceof JavaIllegalArgumentException);
});

test("Inheritance clone preserves project-owned argument exception identity", () => {
    const inheritance = Inheritance.make(Term.get("inheritance-subject"), Term.get("inheritance-predicate"));
    assert.ok(inheritance);
    const clone = inheritance.clone as unknown as (...args: unknown[]) => unknown;

    assert.throws(
        () => clone.call(inheritance, [Term.get("only-one-component")]),
        (error: unknown) => error instanceof JavaIllegalArgumentException,
    );
    assert.throws(
        () => clone.call(inheritance, Term.get("unexpected"), Term.get("extra")),
        (error: unknown) => error instanceof JavaIllegalArgumentException,
    );
});
