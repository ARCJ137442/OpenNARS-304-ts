import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("LocalRules keeps math operations on the native boundary", () => {
    const source = readFileSync("src/inference/LocalRules.ts", "utf8");
    assert.doesNotMatch(source, /from ["']jree["']/);
    assert.doesNotMatch(source, /java\.lang\.Math/);
});
