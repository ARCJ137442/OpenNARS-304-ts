import assert from "node:assert/strict";
import test from "node:test";

test("Narsese preserves temporal statement order from Java relation dispatch", async () => {
    const { java } = await import("jree");
    const { Narsese } = await import("../../src/io/Narsese.ts");
    const { TermLink } = await import("../../src/entity/TermLink.ts");
    const { TemporalRules } = await import("../../src/inference/TemporalRules.ts");
    const { Tense } = await import("../../src/language/Tense.ts");

    const parser = new Narsese({ getOperator: () => null });
    assert.equal(Tense.tense(new java.lang.String("")), null);
    const forward = parser.parseTerm(new java.lang.String("<a =/> b>"));
    const concurrent = parser.parseTerm(new java.lang.String("<a =|> b>"));
    const backward = parser.parseTerm(new java.lang.String("<a =\\> b>"));

    assert.equal(forward.getTemporalOrder(), TemporalRules.ORDER_FORWARD);
    assert.equal(concurrent.getTemporalOrder(), TemporalRules.ORDER_CONCURRENT);
    assert.equal(backward.getTemporalOrder(), TemporalRules.ORDER_BACKWARD);
    assert.equal(TemporalRules.order(8, 5), TemporalRules.ORDER_FORWARD);
    assert.equal(String(forward.toString()), "<a =/> b>");

    const conditional = parser.parseTerm(new java.lang.String("<(&/,a,b) =/> c>"));
    assert.equal(typeof conditional.containedTemporalRelations, "function");
    assert.equal(conditional.containedTemporalRelations(), 1);
    const links = conditional.prepareComponentLinks();
    assert.ok(Array.from(links).some((link) => link.type === TermLink.COMPOUND_CONDITION));
});
