import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { ComplexEmotions } from "../../src/plugin/mental/ComplexEmotions.ts";

test("ComplexEmotions keeps the Java plain-plugin boundary without a jree Object shell", () => {
    const plugin = new ComplexEmotions();

    assert.equal(Object.getPrototypeOf(ComplexEmotions.prototype), Object.prototype);
    assert.equal(Object.getPrototypeOf(plugin), ComplexEmotions.prototype);
});

test("ComplexEmotions keeps event text on the native string boundary", () => {
    const source = readFileSync("src/plugin/mental/ComplexEmotions.ts", "utf8");

    assert.doesNotMatch(source, /from ["']jree["']/);
    assert.doesNotMatch(source, /new java\.lang\.String/);
    assert.doesNotMatch(source, /java\.lang\.System\.out/);
});
