import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("Sentence normalization keeps array copying project-owned", () => {
    const source = readFileSync(new URL("../../src/entity/Sentence.ts", import.meta.url), "utf8");
    assert.doesNotMatch(source, /java\.lang\.System\.arraycopy/);
});
