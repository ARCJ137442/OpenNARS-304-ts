import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { SetExt } from "../../src/language/SetExt.ts";
import { Term } from "../../src/language/Term.ts";

test("SetTensional exposes native strings without Java text types", () => {
    const source = readFileSync("src/language/SetTensional.ts", "utf8");
    const textRuntime = readFileSync("src/runtime/Text.ts", "utf8");
    assert.doesNotMatch(source, /from ["']jree["']/);
    assert.doesNotMatch(source, /JavaCharSequence|JavaString/);
    assert.match(textRuntime, /type TextString\s*=\s*string/);

    const name = SetExt.make(Term.get("bird")).name();
    assert.equal(typeof name, "string");
    assert.equal(name, "{bird}");
});
