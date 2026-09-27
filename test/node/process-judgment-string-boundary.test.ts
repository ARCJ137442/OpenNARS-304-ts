import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("ProcessJudgment uses native exception text", () => {
    const source = readFileSync("src/control/concept/ProcessJudgment.ts", "utf8");
    assert.doesNotMatch(source, /from ["']jree["']/);
    assert.doesNotMatch(source, /S`/);
});
