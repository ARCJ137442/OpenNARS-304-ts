import assert from "node:assert/strict";
import test from "node:test";
import {
    javaInt16ArrayEquals,
    javaInt16ArrayHashCode,
    javaObjectsHash,
} from "../../src/runtime/JavaArrays.ts";

test("Java short-array equals preserves null, length, order, and values", () => {
    assert.equal(javaInt16ArrayEquals(null, null), true);
    assert.equal(javaInt16ArrayEquals(null, new Int16Array()), false);
    assert.equal(javaInt16ArrayEquals(new Int16Array([1, 2]), new Int16Array([1, 2])), true);
    assert.equal(javaInt16ArrayEquals(new Int16Array([1, 2]), new Int16Array([2, 1])), false);
    assert.equal(javaInt16ArrayEquals(new Int16Array([1]), new Int16Array([1, 2])), false);
});

test("Java short-array hash follows Arrays.hashCode(short[])", () => {
    assert.equal(javaInt16ArrayHashCode(null), 0);
    assert.equal(javaInt16ArrayHashCode(new Int16Array()), 1);
    assert.equal(javaInt16ArrayHashCode(new Int16Array([1, 2])), 994);
    assert.equal(javaInt16ArrayHashCode(new Int16Array([2, 1])), 1024);
});

test("Java Objects.hash uses the project Java value hash contract", () => {
    assert.equal(javaObjectsHash("term", 2), (31 * (31 + 3556460) + 2) | 0);
});
