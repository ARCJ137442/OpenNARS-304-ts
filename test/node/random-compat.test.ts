import assert from "node:assert/strict";
import test from "node:test";

import "../../src/runtime/jree-compat.ts";
import { java } from "jree";

test("jree Random.nextDouble preserves Java's 53-bit value", () => {
    const random = new java.util.Random(1n);

    assert.equal(random.nextDouble(), 0.7308781907032909);
    assert.equal(new java.util.Random(1n).nextInt(), -1155869325);
    assert.equal(new java.util.Random(1n).nextInt(10), 5);
});
