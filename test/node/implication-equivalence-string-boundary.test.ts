import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("Implication and Equivalence use project-owned string boundaries", () => {
    const implication = readFileSync("src/language/Implication.ts", "utf8");
    const equivalence = readFileSync("src/language/Equivalence.ts", "utf8");
    const source = `${implication}\n${equivalence}`;

    assert.doesNotMatch(source, /java\.util\.Arrays\.toString/);
    assert.doesNotMatch(source, /java\.lang\.CharSequence/);
    assert.doesNotMatch(source, /from ["']jree["']/);
});
