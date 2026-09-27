import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("set operator classes avoid unused direct jree imports", () => {
    for (const file of ["DifferenceExt.ts", "DifferenceInt.ts", "IntersectionExt.ts", "IntersectionInt.ts"]) {
        const source = readFileSync(`src/language/${file}`, "utf8");
        assert.doesNotMatch(source, /from ["']jree["']/);
    }
});
