import assert from "node:assert/strict";
import test from "node:test";

import { InternalExperience } from "../../src/plugin/mental/InternalExperience.ts";

test("InternalExperience keeps the Java plain-plugin boundary and constructor contracts", () => {
    const defaultPlugin = new InternalExperience();
    const configured = new InternalExperience(
        Math.fround(0.2),
        Math.fround(0.3),
        Math.fround(0.0002),
        Math.fround(0.00003),
        Math.fround(0.4),
        Math.fround(0.5),
        false,
        true,
        true,
    );

    assert.equal(Object.getPrototypeOf(InternalExperience.prototype), Object.prototype);
    assert.equal(Object.getPrototypeOf(defaultPlugin), InternalExperience.prototype);
    assert.ok(defaultPlugin instanceof InternalExperience);
    assert.equal(configured.MINIMUM_PRIORITY_TO_CREATE_WANT_BELIEVE_ETC, Math.fround(0.2));
    assert.equal(configured.MINIMUM_PRIORITY_TO_CREATE_WONDER_EVALUATE, Math.fround(0.3));
    assert.equal(configured.INTERNAL_EXPERIENCE_PROBABILITY, Math.fround(0.0002));
    assert.equal(configured.INTERNAL_EXPERIENCE_RARE_PROBABILITY, Math.fround(0.00003));
    assert.equal(configured.INTERNAL_EXPERIENCE_DURABILITY_MUL, Math.fround(0.4));
    assert.equal(configured.INTERNAL_EXPERIENCE_PRIORITY_MUL, Math.fround(0.5));
    assert.equal(configured.ALLOW_WANT_BELIEF, false);
    assert.equal(configured.OLD_BELIEVE_WANT_EVALUATE_WONDER_STRATEGY, true);
    assert.equal(configured.FULL_REFLECTION, true);
});
