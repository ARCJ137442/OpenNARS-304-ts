import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("Concept keeps string and state boundaries project-owned", () => {
    const source = readFileSync("src/entity/Concept.ts", "utf8");
    assert.doesNotMatch(source, /from ["']jree["']/);
    assert.doesNotMatch(source, /java\.lang\.(String|IllegalStateException)/);
    assert.match(source, /ReasonerStateError/);
});
