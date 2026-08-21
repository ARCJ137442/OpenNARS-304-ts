import assert from "node:assert/strict";
import test from "node:test";

test("translated term and sentence constructors preserve Java delegation contracts", async () => {
    // Load the sentence root first so its existing language-module cycle is initialized once.
    const { Sentence } = await import("../../src/entity/Sentence.ts");
    const { Term } = await import("../../src/language/Term.ts");
    const { TruthValue } = await import("../../src/entity/TruthValue.ts");
    const { Stamp } = await import("../../src/entity/Stamp.ts");
    const { Tense } = await import("../../src/language/Tense.ts");
    const { Parameters } = await import("../../src/main/Parameters.ts");

    const parameters = new Parameters();
    const term = Term.get("A");
    const truth = TruthValue.fromFrequencyConfidence(0.7, 0.6, parameters);
    const stamp = new Stamp(0, Tense.Present, new Stamp.BaseEntry(0, 1), parameters.DURATION);
    const sentence = new Sentence(term, ".", truth, stamp);

    assert.equal(typeof term.name, "function");
    assert.equal(String(term.toString()), "A");
    assert.equal(String(sentence.getTerm().toString()), "A");
    assert.equal(String(sentence.getTruth().toStringExternal()), "%0.70;0.60%");
    assert.match(String(sentence.getKey()), /^A\. %0\.70;0\.60%/);

    assert.equal(Term.get("a").equals(Term.get("A")), false);
    assert.notEqual(Term.get("a").hashCode(), Term.get("A").hashCode());

    const { Add } = await import("../../src/operator/misc/Add.ts");
    const add = new Add();
    assert.equal(add.equals(add), true);
    assert.equal(add.equals(Term.get("a"), Term.get("A")), 0);

    const { Negation } = await import("../../src/language/Negation.ts");
    const negated = Negation.make([Term.get("a")]);
    assert.equal(negated instanceof Negation, true);
    assert.equal((negated as InstanceType<typeof Negation>).term[0], Term.get("a"));
});
