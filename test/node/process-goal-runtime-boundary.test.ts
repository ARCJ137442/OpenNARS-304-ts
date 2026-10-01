import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("ProcessGoal keeps project-owned host and collection boundaries", () => {
    const source = readFileSync("src/control/concept/ProcessGoal.ts", "utf8");
    assert.doesNotMatch(source, /from ["']jree["']/);
    assert.doesNotMatch(source, /java\.lang\.(System|IllegalStateException)/);
    assert.doesNotMatch(source, /java\.util\.Map/);
    assert.match(source, /Logger/);
});
