import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("Inheritance avoids direct jree String construction for operator checks", () => {
    const source = readFileSync("src/language/Inheritance.ts", "utf8");
    assert.doesNotMatch(source, /startsWith\(new java\.lang\.String\(/);
    assert.doesNotMatch(source, /java\.util\.Arrays\.toString/);
});
