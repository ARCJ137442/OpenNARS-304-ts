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

    const { Inheritance } = await import("../../src/language/Inheritance.ts");
    const statement = Inheritance.make(Term.get("A"), Term.get("B"));
    assert.equal(String(statement.toString()), "<A --> B>");
    const { ImageExt } = await import("../../src/language/ImageExt.ts");
    const image = new ImageExt([Term.get("P"), Term.get("A")], 1);
    assert.equal(String(image.toString()), "(/,A,P,_)");

    const { Variable } = await import("../../src/language/Variable.ts");
    const { Product } = await import("../../src/language/Product.ts");
    const { SetInt } = await import("../../src/language/SetInt.ts");
    const { Implication } = await import("../../src/language/Implication.ts");
    const sharedVariable = new Variable("$1");
    const condition = Inheritance.make(Product.make([sharedVariable, Term.get("sunglasses")]), Term.get("own"));
    const conclusion = Inheritance.make(sharedVariable, new SetInt(Term.get("aggressive")));
    const rule = Implication.make(condition, conclusion, 0);
    const ruleSentence = new Sentence(rule, ".", TruthValue.fromFrequencyConfidence(1.0, 0.9, parameters), stamp);
    assert.equal(ruleSentence.truth.confidence, 0.9);
    assert.equal(ruleSentence.term.subjectOrPredicateIsIndependentVar(), false);

    const { SetExt } = await import("../../src/language/SetExt.ts");
    const setMember = Term.get("setMember");
    const arrayConstructedSet = new SetExt([setMember]);
    assert.equal(arrayConstructedSet.term[0], setMember);

    const { Conjunction } = await import("../../src/language/Conjunction.ts");
    const conjunction = Conjunction.make([Term.get("a"), Term.get("b")]) as InstanceType<typeof Conjunction>;
    const clonedConjunction = conjunction.clone();
    assert.equal(String(clonedConjunction.toString()), "(&&,a,b)");

    const { CompoundTerm } = await import("../../src/language/CompoundTerm.ts");
    const indexedTerm = Term.get("M1[-1.0,0.0]");
    const rectangle = CompoundTerm.UpdateConvRectangle([indexedTerm]);
    assert.equal(rectangle.index_variable, "M1");
    assert.deepEqual(Array.from(rectangle.term_indices ?? []), [1, 1, -1, 0, 1, 1]);
});

test("Nar explicit long overload accepts JavaScript number and bigint values", async () => {
    const { Nar } = await import("../../src/main/Nar.ts");

    assert.equal(new Nar(0n).memory.narId, 0n);
    assert.equal(new Nar(7 as never).memory.narId, 7);
});
