import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("Variables uses project-owned Java exception classes", () => {
    const source = readFileSync("src/language/Variables.ts", "utf8");
    assert.doesNotMatch(source, /new java\.lang\.(IllegalArgumentException|IllegalStateException)\(/);
});
