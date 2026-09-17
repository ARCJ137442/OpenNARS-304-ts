import assert from "node:assert/strict";
import test from "node:test";
import { java } from "jree";
import { DerivationContext } from "../../src/control/DerivationContext.ts";
import { CompositionalRules } from "../../src/inference/CompositionalRules.ts";
import { Inheritance } from "../../src/language/Inheritance.ts";
import { Implication } from "../../src/language/Implication.ts";
import { Term } from "../../src/language/Term.ts";
import { Nar } from "../../src/main/Nar.ts";
import { javaStringValue } from "../../src/runtime/jree-compat.ts";
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

test("CompositionalRules.introduceVariables keeps Java Map substitution semantics", () => {
    const nar = new Nar();
    const context = new DerivationContext(nar.memory, nar.narParameters, nar);
    const sharedSubject = Term.get("shared-subject");
    const antecedent = Inheritance.make(sharedSubject, Term.get("antecedent"));
    const consequent = Inheritance.make(sharedSubject, Term.get("consequent"));
    const implication = Implication.make(antecedent, consequent, 0);

    const outputs = CompositionalRules.introduceVariables(context, implication, true);
    const outputTerms = Array.from(outputs, output => javaStringValue(output.getLeft().name()));

    assert.deepEqual(outputTerms, ["<<$ind0 --> antecedent> =|> <$ind0 --> consequent>>"]);
    assert.equal(outputs.toArray()[0].getRight(), 1);
});
