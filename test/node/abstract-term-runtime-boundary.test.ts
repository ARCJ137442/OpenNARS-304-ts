import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("AbstractTerm exposes a native string name", () => {
    const source = readFileSync("src/language/AbstractTerm.ts", "utf8");
    assert.doesNotMatch(source, /from ["']jree["']/);
    assert.match(source, /name\(\): TextString/);
    assert.doesNotMatch(source, /JavaCharSequence|JavaString/);
});
