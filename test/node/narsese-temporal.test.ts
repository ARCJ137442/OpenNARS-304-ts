import assert from "node:assert/strict";
import test from "node:test";

test("Narsese preserves temporal statement order from Java relation dispatch", async () => {
    const { java } = await import("jree");
    const { Narsese } = await import("../../src/io/Narsese.ts");
    const { CompoundTerm } = await import("../../src/language/CompoundTerm.ts");
    const { ImageExt } = await import("../../src/language/ImageExt.ts");
    const { ImageInt } = await import("../../src/language/ImageInt.ts");
    const { Product } = await import("../../src/language/Product.ts");
    const { Operation } = await import("../../src/operator/Operation.ts");
    const { Anticipate } = await import("../../src/operator/mental/Anticipate.ts");
    const { TermLink } = await import("../../src/entity/TermLink.ts");
    const { TemporalRules } = await import("../../src/inference/TemporalRules.ts");
    const { Tense } = await import("../../src/language/Tense.ts");

    const parser = new Narsese({ getOperator: () => null });
    assert.equal(Tense.tense(new java.lang.String("")), null);
    const forward = parser.parseTerm(new java.lang.String("<a =/> b>"));
    const concurrent = parser.parseTerm(new java.lang.String("<a =|> b>"));
    const backward = parser.parseTerm(new java.lang.String("<a =\\> b>"));
    assert.ok(forward);
    assert.ok(concurrent);
    assert.ok(backward);

    assert.equal(forward.getTemporalOrder(), TemporalRules.ORDER_FORWARD);
    assert.equal(concurrent.getTemporalOrder(), TemporalRules.ORDER_CONCURRENT);
    assert.equal(backward.getTemporalOrder(), TemporalRules.ORDER_BACKWARD);
    assert.equal(TemporalRules.order(8, 5), TemporalRules.ORDER_FORWARD);
    assert.equal(String(forward.toString()), "<a =/> b>");

    const conditional = parser.parseTerm(new java.lang.String("<(&/,a,b) =/> c>"));
    assert.ok(conditional);
    assert.equal(typeof conditional.containedTemporalRelations, "function");
    assert.equal(conditional.containedTemporalRelations(), 1);
    const links = conditional.prepareComponentLinks();
    assert.ok(Array.from(links).some((link) => link.type === TermLink.COMPOUND_CONDITION));

    const intervalConditional = parser.parseTerm(new java.lang.String("<(&/,a,+8,b) =/> c>"));
    assert.ok(intervalConditional);
    const intervals = CompoundTerm.extractIntervals(null, intervalConditional);
    assert.deepEqual(Array.from(intervals).map(Number), [8]);

    const self = parser.parseTerm(new java.lang.String("SELF"));
    const extImage = parser.parseTerm(new java.lang.String("(/,at,_,{t003})"));
    assert.ok(self);
    assert.ok(extImage);
    const extReplaced = ImageExt.make(extImage, self, 1);
    assert.equal(String(extReplaced.toString()), "(/,at,SELF,_)");
    const intImage = parser.parseTerm(new java.lang.String("(\\,at,_,{t003})"));
    assert.ok(intImage);
    const intReplaced = ImageInt.make(intImage, self, 1);
    assert.equal(String(intReplaced.toString()), "(\\,at,SELF,_)");

    const product = Product.make(self, forward);
    assert.equal(String(product.toString()), "(*,SELF,<a =/> b>)");

    const operation = Operation.make(Product.make(self, parser.parseTerm(new java.lang.String("<b --> B>"))), new Anticipate());
    assert.equal(String(operation.toString()), "(^anticipate,SELF,<b --> B>)");
});
