import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

for (const file of ["src/language/SetExt.ts", "src/language/SetInt.ts"]) {
    test(`${file} uses project-owned Java argument exceptions`, () => {
        const source = readFileSync(file, "utf8");
        assert.doesNotMatch(source, /new java\.lang\.(IllegalArgumentException|IllegalStateException)\(/);
    });
}
