import assert from "node:assert/strict";
import test from "node:test";
import { java } from "../../src/runtime/native-runtime.ts";
import { Stamp } from "../../src/entity/Stamp.ts";
import { Tense } from "../../src/language/Tense.ts";

const makeStamp = (): Stamp =>
    new Stamp(10, Tense.Present, new Stamp.BaseEntry(7, 11), 2);

test("Stamp occurrence text keeps Java String output without StringBuilder construction", () => {
    const stamp = makeStamp();

    assert.ok(stamp.getOccurrenceTimeString() instanceof java.lang.String);
    assert.equal(String(stamp.getOccurrenceTimeString()), "[10]");

    stamp.setEternal();
    assert.equal(String(stamp.getOccurrenceTimeString()), "");
});

test("Stamp appendOcurrenceTime preserves the caller builder and append contract", () => {
    const stamp = makeStamp();
    const builder = new java.lang.StringBuilder("prefix");

    const result = stamp.appendOcurrenceTime(builder);

    assert.strictEqual(result, builder);
    assert.equal(String(result.toString()), "prefix[10]");
});

test("Stamp name is a cached Java String and invalidates after occurrence changes", () => {
    const stamp = makeStamp();
    const first = stamp.name();
    const second = stamp.name();

    assert.ok(first instanceof java.lang.String);
    assert.strictEqual(first, second);
    assert.equal(String(first), stamp.toString());
    assert.match(String(first), /10/);
    assert.match(String(first), /\(7,11\)/);

    stamp.setOccurrenceTime(12);
    const changed = stamp.name();

    assert.notStrictEqual(changed, first);
    assert.match(String(changed), /12/);
});
