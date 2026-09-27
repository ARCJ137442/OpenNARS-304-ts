import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("CompoundTerm builds names through the project string boundary", () => {
    const source = readFileSync("src/language/CompoundTerm.ts", "utf8");
    assert.doesNotMatch(source, /new java\.lang\.String\(/);
});
