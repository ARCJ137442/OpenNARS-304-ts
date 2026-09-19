import assert from "node:assert/strict";
import test from "node:test";
import { java } from "jree";

test("Implication.clone preserves the source term and runtime type", async () => {
    const { Implication } = await import("../../src/language/Implication.ts");
    const { Term } = await import("../../src/language/Term.ts");

    const rule = Implication.make(Term.get("a"), Term.get("b"), 1);
    const clonedRule = rule.clone();

    assert.notEqual(clonedRule, rule);
    assert.equal(String(clonedRule.toString()), String(rule.toString()));
    assert.equal(clonedRule instanceof Implication, true);
});

test("Image placeholder recognition keeps Java exact-Term semantics", async () => {
    const { Image } = await import("../../src/language/Image.ts");
    const { Term } = await import("../../src/language/Term.ts");

    class DerivedTerm extends Term {
        public constructor() {
            super();
            this.setName(new java.lang.String("_"));
        }
    }

    assert.equal(Image.isPlaceHolder(Term.get("_")), true);
    assert.equal(Image.isPlaceHolder(new DerivedTerm()), false);
});

test("Terms.term preserves the relation index when rebuilding images", async () => {
    const { ImageExt } = await import("../../src/language/ImageExt.ts");
    const { ImageInt } = await import("../../src/language/ImageInt.ts");
    const { Term } = await import("../../src/language/Term.ts");
    const { Terms } = await import("../../src/language/Terms.ts");
    await import("../../src/io/Narsese.ts");

    const relation = Term.get("neutralization");
    const replacement = Term.get("reaction");
    const variable = Term.get("?1");
    const imageInt = ImageInt.make([relation, variable], 0);
    const imageExt = new ImageExt([relation, variable], 0);

    const rebuiltInt = Terms.term(imageInt, [replacement, variable]);
    const rebuiltExt = Terms.term(imageExt, [replacement, variable]);

    assert.equal(String(rebuiltInt.name()), "(\\,reaction,_,?1)");
    assert.ok(rebuiltInt instanceof ImageInt);
    assert.equal(rebuiltInt.relationIndex, 0);
    assert.equal(String(rebuiltExt.name()), "(/,reaction,_,?1)");
    assert.ok(rebuiltExt instanceof ImageExt);
    assert.equal(rebuiltExt.relationIndex, 0);
});

test("Terms image/product equivalence keeps Java Set de-duplication", async () => {
    const { ImageExt } = await import("../../src/language/ImageExt.ts");
    const { Inheritance } = await import("../../src/language/Inheritance.ts");
    const { Product } = await import("../../src/language/Product.ts");
    const { Term } = await import("../../src/language/Term.ts");
    const { Terms } = await import("../../src/language/Terms.ts");

    const relation = Term.get("set-relation");
    const variable = Term.get("?set-variable");
    const product = Product.make([variable, variable]);
    const image = new ImageExt([relation, variable], 0);
    const productStatement = Inheritance.make(product, relation);
    const imageStatement = Inheritance.make(relation, image);

    assert.equal(
        Terms.equalSubjectPredicateInRespectToImageAndProduct(productStatement, imageStatement),
        true,
    );
});

test("CompoundTerm Set helpers preserve Java equality and insertion order", async () => {
    const { CompoundTerm } = await import("../../src/language/CompoundTerm.ts");
    const { Product } = await import("../../src/language/Product.ts");
    const { Term } = await import("../../src/language/Term.ts");
    const { NativeSet } = await import("../../src/runtime/NativeSet.ts");

    const first = Term.get("contained-first");
    const equivalent = first.clone();
    const inner = Product.make([first, equivalent]);
    const outer = Product.make([inner, first]);

    const contained = outer.getContainedTerms();
    assert.equal(contained instanceof NativeSet, true);
    assert.equal(contained.size(), 2);
    assert.deepEqual(contained.toArray(), [inner, first]);

    const allComponents = CompoundTerm.addComponentsRecursively(outer, null);
    assert.equal(allComponents instanceof NativeSet, true);
    assert.equal(allComponents.size(), 3);
    assert.deepEqual(allComponents.toArray(), [outer, inner, first]);
    assert.equal(allComponents.contains(equivalent), true);

    const supplied = new NativeSet<ReturnType<typeof Term.get>>();
    const reused = CompoundTerm.addComponentsRecursively(first, supplied);
    assert.equal(reused, supplied);
    assert.deepEqual(supplied.toArray(), [first]);
});

test("CompoundTerm.termList preserves Java Arrays.asList fixed-size semantics", async () => {
    const { CompoundTerm } = await import("../../src/language/CompoundTerm.ts");
    const { Term } = await import("../../src/language/Term.ts");
    const { NativeFixedList } = await import("../../src/runtime/NativeList.ts");

    const first = Term.get("term-list-first");
    const second = Term.get("term-list-second");
    const list = CompoundTerm.termList(first, second);

    assert.equal(list instanceof NativeFixedList, true);
    assert.deepEqual(list.toArray(), [first, second]);
    assert.equal(list.set(0, second), first);
    assert.equal(list.get(0), second);
    assert.throws(() => list.add(first), /UnsupportedOperationException/);
    assert.throws(() => list.remove(0), /UnsupportedOperationException/);
    assert.equal(list.size(), 2);
});
