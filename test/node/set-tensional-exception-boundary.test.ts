import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("SetTensional uses the project-owned Java state exception", () => {
    const source = readFileSync("src/language/SetTensional.ts", "utf8");
    assert.doesNotMatch(source, /new java\.lang\.IllegalStateException\(/);
});
