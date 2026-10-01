import assert from "node:assert/strict";
import test from "node:test";
import { java } from "../../src/platform/node/legacy-runtime-facade.ts";
import { Inheritance } from "../../src/language/Inheritance.ts";
import { Term } from "../../src/language/Term.ts";
import { NativeMap } from "../../src/runtime/NativeMap.ts";

test("J2 MapContract substitutes with NativeMap without changing term semantics", () => {
    const source = Inheritance.make(Term.get("subject"), Term.get("object"));
    const replacement = Term.get("replacement");
    const substitutions = new NativeMap<Term, Term>();
    substitutions.put(Term.get("object"), replacement);

    const result = source.applySubstitute(substitutions);

    assert.equal(String(result), "<subject --> replacement>");
    assert.equal(substitutions.size(), 1);
    assert.equal(substitutions.get(Term.get("object")), replacement);
});

test("J2 MapContract accepts Java LinkedHashMap substitution input", () => {
    const source = Inheritance.make(Term.get("subject"), Term.get("object"));
    const replacement = Term.get("replacement");
    // Java original type: Map<Term, Term>, concrete implementation LinkedHashMap.
    const substitutions = new java.util.LinkedHashMap<Term, Term>();
    substitutions.put(Term.get("object"), replacement);

    const result = source.applySubstitute(substitutions);

    assert.equal(String(result), "<subject --> replacement>");
    assert.equal(substitutions.size(), 1);
    assert.equal(substitutions.get(Term.get("object")), replacement);
});

test("J2 MapContract preserves recursive term counts and insertion order", () => {
    const subject = Term.get("subject");
    const object = Term.get("object");
    const source = Inheritance.make(subject, object);
    const counts = source.countTermRecursively(null);

    assert.equal(counts.get(source)?.valueOf(), 1);
    assert.equal(counts.get(subject)?.valueOf(), 1);
    assert.equal(counts.get(object)?.valueOf(), 1);
    assert.deepEqual([...counts.keySet()].map(String), [String(source), "subject", "object"]);
});
