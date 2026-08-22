import assert from "node:assert/strict";
import test from "node:test";
import { java } from "jree";
import { javaStringLength, javaStringValue } from "../../src/runtime/jree-compat.ts";

test("javaStringLength normalizes jree and native string representations", () => {
    const boxed = new java.lang.String("abc");
    const built = new java.lang.StringBuilder("abc").toString();

    assert.equal(javaStringLength("abc"), 3);
    assert.equal(javaStringLength(boxed), 3);
    assert.equal(javaStringLength(built), 3);
});

test("javaStringValue applies Java toString before JS interpolation", () => {
    const value = new java.lang.StringBuilder("abc");

    assert.equal(javaStringValue(value), "abc");
});
