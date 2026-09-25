import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("AbstractTerm keeps CharSequence as a type-only project boundary", () => {
    const source = readFileSync("src/language/AbstractTerm.ts", "utf8");
    assert.doesNotMatch(source, /from ["']jree["']/);
    assert.match(source, /JavaCharSequence/);
});
