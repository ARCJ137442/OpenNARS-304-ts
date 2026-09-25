import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("Variable uses project-owned Java exception classes", () => {
    const source = readFileSync("src/language/Variable.ts", "utf8");
    assert.doesNotMatch(source, /new java\.lang\.(IllegalArgumentException|IllegalStateException)\(/);
});
