import assert from "node:assert/strict";
import test from "node:test";

import { Float32Math } from "../../src/runtime/Float32.ts";

test("Float32Math narrows Java float operands and results", () => {
    const left = Float32Math.from(0.1);
    const right = Float32Math.from(0.2);
    assert.equal(left, Math.fround(0.1));
    assert.equal(right, Math.fround(0.2));
    assert.equal(
        Float32Math.multiply(left, right),
        Math.fround(Math.fround(0.1) * Math.fround(0.2)),
    );
});

test("Float32Math covers Java float operation boundaries", () => {
    const left = 16777217;
    const right = 3.25;
    const javaLeft = Math.fround(left);
    const javaRight = Math.fround(right);
    assert.equal(Float32Math.add(left, right), Math.fround(javaLeft + javaRight));
    assert.equal(Float32Math.subtract(left, right), Math.fround(javaLeft - javaRight));
    assert.equal(Float32Math.multiply(left, right), Math.fround(javaLeft * javaRight));
    assert.equal(Float32Math.divide(left, right), Math.fround(javaLeft / javaRight));
    assert.equal(Float32Math.sqrt(left), Math.fround(Math.sqrt(javaLeft)));
});

test("Float32Math.pow matches Java float storage after Math.pow", () => {
    assert.equal(Float32Math.pow(0.9, 2), Math.fround(Math.pow(Math.fround(0.9), 2)));
    assert.equal(Float32Math.pow(0.9, 2), 0.809999942779541);
});
