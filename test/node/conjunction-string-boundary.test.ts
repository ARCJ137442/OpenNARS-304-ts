import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("Conjunction uses the project string boundary for generated indices", () => {
    const source = readFileSync("src/language/Conjunction.ts", "utf8");

    assert.doesNotMatch(source, /new java\.lang\.String\(/);
    assert.doesNotMatch(source, /java\.lang\.System\.arraycopy/);
    assert.doesNotMatch(source, /java\.util\.Collection/);
    assert.doesNotMatch(source, /java\.lang\.(String|CharSequence)/);
});
