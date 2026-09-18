import assert from "node:assert/strict";
import test from "node:test";

import { Counting } from "../../src/plugin/mental/Counting.ts";

test("Counting keeps Java's plain-plugin boundary and constructor contracts", () => {
    const defaultPlugin = new Counting();
    const configuredPriority = Math.fround(0.123456789);
    const configuredPlugin = new Counting(configuredPriority);

    assert.equal(Object.getPrototypeOf(Counting.prototype), Object.prototype);
    assert.equal(Object.getPrototypeOf(defaultPlugin), Counting.prototype);
    assert.equal(defaultPlugin.getMINIMUM_PRIORITY(), Math.fround(0.3));
    assert.equal(configuredPlugin.getMINIMUM_PRIORITY(), configuredPriority);
});
