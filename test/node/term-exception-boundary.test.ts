import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { Term } from "../../src/language/Term.ts";
import { JavaIllegalArgumentException, JavaIllegalStateException } from "../support/legacy-exceptions.ts";

test("Term does not construct jree argument/state exceptions directly", () => {
    const source = readFileSync("src/language/Term.ts", "utf8");
    assert.doesNotMatch(source, /new java\.lang\.(IllegalArgumentException|IllegalStateException)\(/);
});

test("Term invalid overloads preserve project exception identity", () => {
    assert.throws(() => new (Term as unknown as { new (...args: unknown[]): Term })("a", "b"),
        (error: unknown) => error instanceof JavaIllegalArgumentException);
    assert.throws(() => (Term.get as (...args: unknown[]) => Term)("a", "b"),
        (error: unknown) => error instanceof JavaIllegalArgumentException);
    const hasVar = Term.get("a").hasVar as (...args: unknown[]) => boolean;
    assert.throws(() => hasVar("x", "y"),
        (error: unknown) => error instanceof JavaIllegalArgumentException);
    assert.throws(() => hasVar("x"),
        (error: unknown) => error instanceof JavaIllegalStateException);
});
