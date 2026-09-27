import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("Negation, Similarity, and Disjunction avoid direct jree imports", () => {
    for (const file of ["Negation.ts", "Similarity.ts", "Disjunction.ts"]) {
        const source = readFileSync(`src/language/${file}`, "utf8");
        assert.doesNotMatch(source, /from ["']jree["']/);
    }
});
