import assert from "node:assert/strict";
import test from "node:test";

import { Nar } from "../../src/main/Nar.ts";
import { TruthValue } from "../../src/entity/TruthValue.ts";

test("Nar config preserves Java float parameters at the TruthValue clamp boundary", () => {
    const nar = new Nar();

    assert.equal(nar.narParameters.TRUTH_EPSILON, Math.fround(0.01));
    assert.equal(nar.narParameters.reliance, Math.fround(0.9));

    const truth = TruthValue.fromFrequencyConfidence(
        1,
        Math.fround(0.99),
        nar.narParameters,
    );
    assert.equal(truth.confidence, 1 - Math.fround(0.01));
});
