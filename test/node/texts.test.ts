import assert from "node:assert/strict";
import test from "node:test";

import { Texts } from "../../src/io/Texts.ts";

test("Texts.n2 formats values with two decimals and rounding", () => {
    assert.equal(Texts.n2(1.0), "1.00");
    assert.equal(Texts.n2(0.5), "0.50");
    assert.equal(Texts.n2(0.09), "0.09");
    assert.equal(Texts.n2(0.145), "0.15");
    assert.equal(Texts.n2(0.1), "0.10");
    assert.equal(Texts.n2(0.009), "0.01");
    assert.equal(Texts.n2(0.001), "0.00");
    assert.equal(Texts.n2(0.01), "0.01");
    assert.equal(Texts.n2(0), "0.00");
});

test("Texts.n2 rejects out-of-range values", () => {
    assert.throws(() => Texts.n2(-0.01), /Invalid value/);
    assert.throws(() => Texts.n2(1.01), /Invalid value/);
});

test("Texts.n4 and n1 format fixed decimals", () => {
    assert.equal(Texts.n4(0.25), "0.2500");
    assert.equal(Texts.n1(0.25), "0.3");
});

test("Texts.yarn concatenates non-null components", () => {
    assert.equal(Texts.yarn(null, undefined), null);
    assert.equal(Texts.yarn("a"), "a");
    assert.equal(Texts.yarn("a", null, "b", "c"), "abc");
});

test("Texts.compareTo matches lexicographic ordering", () => {
    assert.equal(Texts.compareTo("abc", "abc"), 0);
    assert.ok(Texts.compareTo("abc", "abd") < 0);
    assert.ok(Texts.compareTo("abd", "abc") > 0);
    assert.ok(Texts.compareTo("ab", "abc") < 0);
    assert.ok(Texts.compareTo("abc", "ab") > 0);
});
