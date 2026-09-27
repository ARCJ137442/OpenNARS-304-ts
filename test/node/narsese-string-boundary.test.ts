import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("Narsese parser uses the project string boundary for temporary arguments", () => {
    const source = readFileSync("src/io/Narsese.ts", "utf8");

    assert.doesNotMatch(source, /new java\.lang\.String\(/);
});
