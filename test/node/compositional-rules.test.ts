import assert from "node:assert/strict";
import test from "node:test";
import { java } from "jree";
import { CompositionalRules } from "../../src/inference/CompositionalRules.ts";
import { NativeSet } from "../../src/runtime/NativeSet.ts";

test("CompositionalRules.powerSet preserves Java subset order without a temporary List", () => {
    const original = new java.util.LinkedHashSet<string>();
    original.add("a");
    original.add("b");
    original.add("c");

    const subsets = CompositionalRules.powerSet(original);
    const normalized = Array.from(subsets, subset => Array.from(subset).join(""));

    assert.equal(subsets.size(), 8);
    assert.deepEqual(normalized, ["abc", "bc", "ac", "c", "ab", "b", "a", ""]);
});

test("CompositionalRules.powerSet handles empty and singleton sets", () => {
    const empty = new java.util.LinkedHashSet<string>();
    assert.deepEqual(Array.from(CompositionalRules.powerSet(empty), subset => Array.from(subset)), [[]]);

    const singleton = new java.util.LinkedHashSet<string>();
    singleton.add("only");
    assert.deepEqual(Array.from(CompositionalRules.powerSet(singleton), subset => Array.from(subset)), [["only"], []]);
});

test("CompositionalRules.powerSet keeps nested Set equality by value", () => {
    const original = new NativeSet(["left", "right"]);
    const subsets = CompositionalRules.powerSet(original);
    const equalFullSubset = new NativeSet(["left", "right"]);
    const nested = new NativeSet([subsets.toArray()[0], equalFullSubset]);

    assert.equal(subsets.contains(equalFullSubset), true);
    assert.equal(nested.size(), 1);
    assert.equal(subsets.toArray()[0].equals(equalFullSubset), true);
    assert.equal(subsets.toArray()[0].hashCode(), equalFullSubset.hashCode());
});
