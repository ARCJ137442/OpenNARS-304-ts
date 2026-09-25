import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("Sentence keeps exception construction inside project boundaries", () => {
    const source = readFileSync(new URL("../../src/entity/Sentence.ts", import.meta.url), "utf8");
    assert.doesNotMatch(source, /new java\.lang\.(?:IllegalArgumentException|IllegalStateException)/);
    assert.doesNotMatch(source, /\bS`/);
    assert.doesNotMatch(source, /java\.util\.Objects\.hash/);
});
