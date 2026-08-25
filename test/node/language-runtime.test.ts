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
