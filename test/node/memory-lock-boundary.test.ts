import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("Memory lock marker uses the native boolean contract", () => {
    const source = readFileSync(new URL("../../src/storage/Memory.ts", import.meta.url), "utf8");
    assert.doesNotMatch(source, /java\.lang\.Boolean/);
});
