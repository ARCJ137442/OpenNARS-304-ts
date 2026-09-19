import assert from "node:assert/strict";
import test from "node:test";

import { java } from "jree";
import { Inheritance } from "../../src/language/Inheritance.ts";
import { Term } from "../../src/language/Term.ts";
import { NativeMap } from "../../src/runtime/NativeMap.ts";

test("J3 MapContract uses NativeMap for substitution without changing term semantics", () => {
    const source = Inheritance.make(Term.get("subject"), Term.get("object"));
    const replacement = Term.get("replacement");
    const substitutions = new NativeMap<Term, Term>();
    substitutions.put(Term.get("object"), replacement);

    const result = source.applySubstitute(substitutions);

    assert.equal(String(result), "<subject --> replacement>");
    assert.equal(substitutions.size(), 1);
    assert.equal(substitutions.get(Term.get("object")), replacement);
});

test("J3 MapContract keeps Java LinkedHashMap inputs compatible", () => {
    const source = Inheritance.make(Term.get("subject"), Term.get("object"));
    const replacement = Term.get("replacement");
    const substitutions = new java.util.LinkedHashMap<Term, Term>();
    substitutions.put(Term.get("object"), replacement);

    const result = source.applySubstitute(substitutions);

    assert.equal(String(result), "<subject --> replacement>");
    assert.equal(substitutions.size(), 1);
    assert.equal(substitutions.get(Term.get("object")), replacement);
});
