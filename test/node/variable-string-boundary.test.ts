import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("Variable constructors do not wrap native names with jree String", () => {
    const source = readFileSync("src/language/Variable.ts", "utf8");
    assert.doesNotMatch(source, /new java\.lang\.String\(/);
});
