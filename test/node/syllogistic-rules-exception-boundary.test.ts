import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("SyllogisticRules uses project-owned argument exceptions", () => {
    const source = readFileSync("src/inference/SyllogisticRules.ts", "utf8");
    assert.doesNotMatch(source, /from ["']jree["']/);
    assert.doesNotMatch(source, /new java\.lang\.IllegalArgumentException/);
    assert.match(source, /JavaIllegalArgumentException/);
});
