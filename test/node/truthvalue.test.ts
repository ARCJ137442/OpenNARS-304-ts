import assert from "node:assert/strict";
import test from "node:test";

import { Parameters } from "../../src/main/Parameters.ts";
import { TruthValue } from "../../src/entity/TruthValue.ts";
import { truthFromWordTerm, truthToWordTerm } from "../../src/entity/TruthValueTerm.ts";
import { Term } from "../../src/language/Term.ts";

test("TruthValue constructor assigns fields and keeps Parameters reference", () => {
    const params = new Parameters();
    const truth = new TruthValue(0.25, 0.75, true, params);

    assert.equal(truth.frequency, 0.25);
    assert.equal(truth.confidence, 0.75);
    assert.equal(truth.analytic, true);
    assert.equal(truth.narParameters, params);
});

test("TruthValue factory methods map to expected defaults", () => {
    const params = new Parameters();

    const empty = TruthValue.fromParameters(params);
    assert.equal(empty.frequency, 0);
    assert.equal(empty.confidence, 0);
    assert.equal(empty.analytic, false);

    const simple = TruthValue.fromFrequencyConfidence(0.4, 0.6, params);
    assert.equal(simple.frequency, Math.fround(0.4));
    assert.equal(simple.confidence, 0.6);
    assert.equal(simple.analytic, false);

    const cloned = TruthValue.fromTruthValue(simple);
    assert.equal(cloned.frequency, Math.fround(0.4));
    assert.equal(cloned.confidence, 0.6);
    assert.equal(cloned.analytic, false);
    assert.notEqual(cloned, simple);
});

test("TruthValue clamps confidence based on TRUTH_EPSILON", () => {
    const params = new Parameters();
    params.TRUTH_EPSILON = 0.2;

    const truth = new TruthValue(0.5, 0.9, false, params);
    truth.confidence = 0.9;
    assert.equal(truth.confidence, 0.8);

    truth.confidence = 0.3;
    assert.equal(truth.confidence, 0.3);
});

test("TruthValue expectation and negativity follow formula", () => {
    const params = new Parameters();
    const truth = new TruthValue(0.2, 0.8, false, params);

    const expectation = truth.getExpectation();
    const expectedExpectation = Math.fround(
        Math.fround(Math.fround(0.8) * Math.fround(Math.fround(0.2) - 0.5)) + 0.5,
    );
    assert.equal(expectation, expectedExpectation);
    assert.equal(truth.isNegative(), true);
});

test("TruthValue string key is stable and usable in maps", () => {
    const params = new Parameters();
    const a = new TruthValue(0.1, 0.2, false, params);
    const b = new TruthValue(0.1, 0.2, false, params);
    const c = new TruthValue(0.1, 0.3, false, params);

    const keyA = a.toKey();
    const keyB = b.toKey();
    const keyC = c.toKey();

    assert.equal(keyA, keyB);
    assert.notEqual(keyA, keyC);

    const map = new Map<string, TruthValue>();
    map.set(keyA, a);
    assert.equal(map.get(keyB), a);
});

test("TruthValue hashCode preserves Java FloatNumber/DoubleNumber operand boundaries", () => {
    const params = new Parameters();
    const cases = [
        [0.4, 0.4, 1717986918],
        [0.73, 0.4, -1159698842],
        [0.9, 0.9, -429529499],
    ] as const;

    for (const [frequency, confidence, expected] of cases) {
        const truth = TruthValue.fromFrequencyConfidence(frequency, confidence, params);
        assert.equal(truth.hashCode(), expected);
    }
});

test("TruthValue equals uses Java epsilon and ignores analytic metadata", () => {
    const params = new Parameters();
    const base = TruthValue.fromFrequencyConfidence(0.4, 0.4, params, false);
    const near = TruthValue.fromFrequencyConfidence(0.4 + 0.001, 0.4 - 0.001, params, true);
    const far = TruthValue.fromFrequencyConfidence(
        0.4 + 2 * params.TRUTH_EPSILON,
        0.4,
        params,
    );

    assert.equal(base.equals(near), true);
    assert.equal(base.equals(far), false);
});

test("TruthValue direct frequency writes preserve Java FloatNumber storage", () => {
    const params = new Parameters();
    const truth = TruthValue.fromFrequencyConfidence(0, 0, params);

    truth.frequency = 0.1;

    assert.equal(truth.frequency, Math.fround(0.1));
});

test("TruthValue expectation difference is a Java FloatNumber result", () => {
    const params = new Parameters();
    const left = TruthValue.fromFrequencyConfidence(0.123456789, 0.87654321, params);
    const right = TruthValue.fromFrequencyConfidence(0.987654321, 0.23456789, params);
    const expected = Math.fround(Math.abs(
        Math.fround(left.getExpectation()) - Math.fround(right.getExpectation()),
    ));

    assert.equal(left.getExpDifAbs(right), expected);
});

test("TruthValue word terms use the native Term factory and preserve Java words", () => {
    const params = new Parameters();
    const trueTruth = TruthValue.fromFrequencyConfidence(1, 0.9, params);
    const falseTruth = TruthValue.fromFrequencyConfidence(0, 0.9, params);
    const unsureTruth = TruthValue.fromFrequencyConfidence(0.5, 0, params);

    assert.equal(String(truthToWordTerm(trueTruth).name()), "TRUE");
    assert.equal(String(truthToWordTerm(falseTruth).name()), "FALSE");
    assert.equal(String(truthToWordTerm(unsureTruth).name()), "UNSURE");

    assert.equal(truthFromWordTerm(params, truthToWordTerm(trueTruth))?.frequency, Math.fround(1));
    assert.equal(truthFromWordTerm(params, truthToWordTerm(falseTruth))?.frequency, Math.fround(0));
    assert.equal(truthFromWordTerm(params, truthToWordTerm(unsureTruth))?.frequency, Math.fround(0.5));
    assert.equal(truthFromWordTerm(params, Term.get("OTHER")), null);
});
