import assert from "node:assert/strict";
import test from "node:test";

import { Float32Math } from "../../src/runtime/Float32.ts";

test("Float32Math narrows Java FloatNumber operands and results", () => {
    const left = Float32Math.from(0.1);
    const right = Float32Math.from(0.2);
    assert.equal(left, Math.fround(0.1));
    assert.equal(right, Math.fround(0.2));
    assert.equal(
        Float32Math.multiply(left, right),
        Math.fround(Math.fround(0.1) * Math.fround(0.2)),
    );
});

test("Float32Math covers Java FloatNumber operation boundaries", () => {
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

test("Float32Math.pow matches Java FloatNumber storage after Math.pow", () => {
    assert.equal(Float32Math.pow(0.9, 2), Math.fround(Math.pow(Math.fround(0.9), 2)));
    assert.equal(Float32Math.pow(0.9, 2), 0.809999942779541);
});

test("Float32Math.powDouble preserves Java Math.pow DoubleNumber result", () => {
    const base = Math.fround(0.123456789);
    const exponent = 1.234567;
    const javaDoubleResult = Math.pow(base, exponent);

    assert.equal(Float32Math.powDouble(0.123456789, exponent), javaDoubleResult);
    assert.notEqual(Float32Math.powDouble(0.123456789, exponent), Math.fround(javaDoubleResult));
});

test("Float32Math.truthToQuality preserves Java FloatNumber complement boundaries", () => {
    const cases = [
        0.3672657907009125,
        0.07869549840688705,
        0.4010399281978607,
    ];

    for (const expectation of cases) {
        const javaQuality = Math.fround(Math.max(
            Math.fround(expectation),
            Math.fround(1 - Math.fround(expectation)) * 0.75,
        ));
        assert.equal(Float32Math.truthToQuality(expectation), javaQuality);
    }
});
