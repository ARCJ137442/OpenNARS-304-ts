import assert from "node:assert/strict";
import test from "node:test";

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
            this.setName("_");
        }
    }

    assert.equal(Image.isPlaceHolder(Term.get("_")), true);
    assert.equal(Image.isPlaceHolder(new DerivedTerm()), false);
});
