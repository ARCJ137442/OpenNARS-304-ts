import assert from "node:assert/strict";
import test from "node:test";

import "../support/legacy-runtime-facade.ts";
import { java } from "../support/legacy-runtime-facade.ts";
import { ReasonerRandom as JavaRandom } from "../../src/runtime/ReasonerRandom.ts";

test("jree Random.nextDouble preserves Java's 53-bit value", () => {
    const random = new java.util.Random(1n);

    assert.equal(random.nextDouble(), 0.7308781907032909);
    assert.equal(new java.util.Random(1n).nextInt(), -1155869325);
    assert.equal(new java.util.Random(1n).nextInt(10), 5);
});

test("project JavaRandom preserves seeded Java sequences and reset semantics", () => {
    const random = new JavaRandom(1n);

    assert.equal(random.nextInt(), -1155869325);
    assert.equal(random.nextInt(10), 8);
    assert.equal(random.nextFloat(), 0.41008079051971436);
    assert.equal(random.nextDouble(), 0.4074398012118764);

    random.setSeed(1n);
    assert.equal(random.nextDouble(), 0.7308781907032909);
});

test("project JavaRandom rejects invalid bit, bound, and unsafe seed inputs", () => {
    const random = new JavaRandom(1n);

    assert.throws(() => random.next(-1), RangeError);
    assert.throws(() => random.next(33), RangeError);
    assert.throws(() => random.nextInt(0), RangeError);
    assert.throws(() => random.nextInt(2 ** 31), RangeError);
    assert.throws(() => new JavaRandom(Number.MAX_SAFE_INTEGER + 1), RangeError);
});
