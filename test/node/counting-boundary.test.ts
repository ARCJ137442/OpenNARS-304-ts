import assert from "node:assert/strict";
import test from "node:test";

import { Counting } from "../../src/plugin/mental/Counting.ts";
import { JavaIllegalArgumentException } from "../../src/runtime/jree-compat.ts";

test("Counting keeps Java's plain-plugin boundary and constructor contracts", () => {
    const defaultPlugin = new Counting();
    const configuredPriority = Math.fround(0.123456789);
    const configuredPlugin = new Counting(configuredPriority);

    assert.equal(Object.getPrototypeOf(Counting.prototype), Object.prototype);
    assert.equal(Object.getPrototypeOf(defaultPlugin), Counting.prototype);
    assert.equal(defaultPlugin.getMINIMUM_PRIORITY(), Math.fround(0.3));
    assert.equal(configuredPlugin.getMINIMUM_PRIORITY(), configuredPriority);
});

test("Counting preserves Java's invalid constructor exception contract", () => {
    const CountingConstructor = Counting as unknown as new (...args: unknown[]) => Counting;

    assert.throws(() => new CountingConstructor(0.1, 0.2), (error: unknown) => {
        assert.ok(error instanceof JavaIllegalArgumentException);
        assert.equal(String((error as { getMessage?: () => unknown }).getMessage?.()),
            "Invalid number of arguments");
        return true;
    });
});
