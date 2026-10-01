import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { Term } from "../../src/language/Term.ts";
import { JavaIllegalArgumentException } from "../support/legacy-exceptions.ts";


test("CompoundTerm hasVar rejects invalid overloads with the project exception", () => {
    const source = readFileSync("src/language/CompoundTerm.ts", "utf8");
    assert.doesNotMatch(source, /new java\.lang\.IllegalArgumentException\(/);
});

test("CompoundTerm hasVar preserves the Java argument exception identity", async () => {
    const { Inheritance } = await import("../../src/language/Inheritance.ts");
    const compound = Inheritance.make(Term.get("a"), Term.get("b"));
    assert.ok(compound);
    assert.throws(() => (compound as { hasVar: (...args: unknown[]) => boolean }).hasVar("x", "y"),
        (error: unknown) => error instanceof JavaIllegalArgumentException);
});
