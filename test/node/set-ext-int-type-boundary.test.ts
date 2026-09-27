import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("SetExt and SetInt expose project-owned collection types", () => {
    for (const file of ["SetExt.ts", "SetInt.ts"]) {
        const source = readFileSync(`src/language/${file}`, "utf8");
        assert.doesNotMatch(source, /from ["']jree["']/);
        assert.doesNotMatch(source, /java\.util\.Collection/);
        assert.match(source, /JavaListInput/);
    }
});
