import assert from "node:assert/strict";
import test from "node:test";

import { Emotions } from "../../src/plugin/mental/Emotions.ts";

test("Emotions keeps the Java plain-plugin boundary and float constructor contract", () => {
    const defaultPlugin = new Emotions();
    const configured = new Emotions(
        Math.fround(0.2),
        Math.fround(0.8),
        Math.fround(0.4),
        Math.fround(0.9),
        7,
    );

    assert.equal(Object.getPrototypeOf(Emotions.prototype), Object.prototype);
    assert.equal(Object.getPrototypeOf(defaultPlugin), Emotions.prototype);
    assert.ok(defaultPlugin instanceof Emotions);
    assert.equal(configured.HAPPY_EVENT_LOWER_THRESHOLD, Math.fround(0.2));
    assert.equal(configured.HAPPY_EVENT_HIGHER_THRESHOLD, Math.fround(0.8));
    assert.equal(configured.BUSY_EVENT_LOWER_THRESHOLD, Math.fround(0.4));
    assert.equal(configured.BUSY_EVENT_HIGHER_THRESHOLD, Math.fround(0.9));
    assert.equal(configured.CHANGE_STEPS_DEMANDED, 7);
});
