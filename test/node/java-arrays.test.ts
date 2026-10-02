import assert from "node:assert/strict";
import test from "node:test";
import {
    int16ArrayEquals,
    int16ArrayHashCode,
    valuesHash,
} from "../../src/runtime/value-arrays.ts";

test("Java ShortNumber-array equals preserves null, length, order, and values", () => {
    assert.equal(int16ArrayEquals(null, null), true);
    assert.equal(int16ArrayEquals(null, new Int16Array()), false);
    assert.equal(int16ArrayEquals(new Int16Array([1, 2]), new Int16Array([1, 2])), true);
    assert.equal(int16ArrayEquals(new Int16Array([1, 2]), new Int16Array([2, 1])), false);
    assert.equal(int16ArrayEquals(new Int16Array([1]), new Int16Array([1, 2])), false);
});

test("Java ShortNumber-array hash follows Arrays.hashCode(ShortNumber[])", () => {
    assert.equal(int16ArrayHashCode(null), 0);
    assert.equal(int16ArrayHashCode(new Int16Array()), 1);
    assert.equal(int16ArrayHashCode(new Int16Array([1, 2])), 994);
    assert.equal(int16ArrayHashCode(new Int16Array([2, 1])), 1024);
});

test("Java Objects.hash uses the project Java value hash contract", () => {
    assert.equal(valuesHash("term", 2), (31 * (31 + 3556460) + 2) | 0);
});
