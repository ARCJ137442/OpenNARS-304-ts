import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("ProcessQuestion uses project-owned state exceptions", () => {
    const source = readFileSync("src/control/concept/ProcessQuestion.ts", "utf8");
    assert.doesNotMatch(source, /from ["']jree["']/);
    assert.doesNotMatch(source, /new java\.lang\.IllegalStateException/);
});
