import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("Interval uses the project string boundary for parsing and naming", () => {
    const source = readFileSync("src/language/Interval.ts", "utf8");
    assert.doesNotMatch(source, /new java\.lang\.String\(/);
});
