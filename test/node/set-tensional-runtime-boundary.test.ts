import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("SetTensional keeps its CharSequence return type project-owned", () => {
    const source = readFileSync("src/language/SetTensional.ts", "utf8");
    assert.doesNotMatch(source, /from ["']jree["']/);
    assert.match(source, /JavaCharSequence/);
});
