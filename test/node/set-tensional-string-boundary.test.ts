import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("SetTensional builds names through the project string boundary", () => {
    const source = readFileSync("src/language/SetTensional.ts", "utf8");
    assert.doesNotMatch(source, /new java\.lang\.String\(/);
});
