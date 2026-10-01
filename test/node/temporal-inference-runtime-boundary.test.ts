import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("TemporalInferenceControl uses project host boundaries", () => {
    const source = readFileSync("src/control/TemporalInferenceControl.ts", "utf8");
    assert.doesNotMatch(source, /from ["']jree["']/);
    assert.doesNotMatch(source, /java\.lang\.(Math|System)/);
    assert.match(source, /Logger/);
});
