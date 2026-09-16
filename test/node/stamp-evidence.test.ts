import assert from "node:assert/strict";
import test from "node:test";
import { Stamp } from "../../src/entity/Stamp.ts";
import { Tense } from "../../src/language/Tense.ts";

const makeStamp = (narId: number, inputId: number): Stamp =>
    new Stamp(Tense.Present, new Stamp.BaseEntry(narId, inputId));

test("Stamp.baseOverlap uses BaseEntry value equality, not object identity", () => {
    const first = makeStamp(7, 11);
    const equalValue = makeStamp(7, 11);
    const differentValue = makeStamp(7, 12);

    assert.equal(Stamp.baseOverlap(first, equalValue), true);
    assert.equal(Stamp.baseOverlap(first, differentValue), false);
});

test("Stamp.evidenceIsCyclic detects equal BaseEntry values in one evidential base", () => {
    const first = new Stamp.BaseEntry(3, 5);
    const equalValue = new Stamp.BaseEntry(3, 5);
    const stamp = makeStamp(3, 5);
    stamp.evidentialBase = [first, equalValue];

    assert.equal(first === equalValue, false);
    assert.equal(first.equals(equalValue), true);
    assert.equal(stamp.evidenceIsCyclic(), true);
});
