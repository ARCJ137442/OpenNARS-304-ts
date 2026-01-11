import assert from "node:assert/strict";
import test from "node:test";

import { Parameters } from "../../src/main/Parameters.ts";
import { TruthValue } from "../../src/entity/TruthValue.ts";

test("TruthValue constructor assigns fields and keeps Parameters reference", () => {
    const params = new Parameters();
    const truth = new TruthValue(0.25, 0.75, true, params);

    assert.equal(truth.getFrequency(), 0.25);
    assert.equal(truth.getConfidence(), 0.75);
    assert.equal(truth.getAnalytic(), true);
    assert.equal(truth.getNarParameters(), params);
});

test("TruthValue factory methods map to expected defaults", () => {
    const params = new Parameters();

    const empty = TruthValue.fromParameters(params);
    assert.equal(empty.getFrequency(), 0);
    assert.equal(empty.getConfidence(), 0);
    assert.equal(empty.getAnalytic(), false);

    const simple = TruthValue.fromFrequencyConfidence(0.4, 0.6, params);
    assert.equal(simple.getFrequency(), 0.4);
    assert.equal(simple.getConfidence(), 0.6);
    assert.equal(simple.getAnalytic(), false);

    const cloned = TruthValue.fromTruthValue(simple);
    assert.equal(cloned.getFrequency(), 0.4);
    assert.equal(cloned.getConfidence(), 0.6);
    assert.equal(cloned.getAnalytic(), false);
    assert.notEqual(cloned, simple);
});

test("TruthValue clamps confidence based on TRUTH_EPSILON", () => {
    const params = new Parameters();
    params.TRUTH_EPSILON = 0.2;

    const truth = new TruthValue(0.5, 0.9, false, params);
    truth.setConfidence(0.9);
    assert.equal(truth.getConfidence(), 0.8);

    truth.setConfidence(0.3);
    assert.equal(truth.getConfidence(), 0.3);
});

test("TruthValue expectation and negativity follow formula", () => {
    const params = new Parameters();
    const truth = new TruthValue(0.2, 0.8, false, params);

    const expectation = truth.getExpectation();
    assert.ok(Math.abs(expectation - (0.8 * (0.2 - 0.5) + 0.5)) < 1e-9);
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
