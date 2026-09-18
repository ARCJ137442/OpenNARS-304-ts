import assert from "node:assert/strict";
import test from "node:test";

import { ComplexEmotions } from "../../src/plugin/mental/ComplexEmotions.ts";

test("ComplexEmotions keeps the Java plain-plugin boundary without a jree Object shell", () => {
    const plugin = new ComplexEmotions();

    assert.equal(Object.getPrototypeOf(ComplexEmotions.prototype), Object.prototype);
    assert.equal(Object.getPrototypeOf(plugin), ComplexEmotions.prototype);
});
