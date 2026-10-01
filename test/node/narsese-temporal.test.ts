import assert from "node:assert/strict";
import test from "node:test";
import type { ImageInt as ImageIntType } from "../../src/language/ImageInt.ts";

test("Narsese preserves temporal statement order from Java relation dispatch", async () => {
    const { java } = await import("../../src/platform/node/legacy-runtime-facade.ts");
    const { Narsese } = await import("../../src/io/Narsese.ts");
    const { CompoundTerm } = await import("../../src/language/CompoundTerm.ts");
    const { NativeList } = await import("../../src/runtime/NativeList.ts");
    const { ImageExt } = await import("../../src/language/ImageExt.ts");
    const { ImageInt } = await import("../../src/language/ImageInt.ts");
    const { Product } = await import("../../src/language/Product.ts");
    const { Operation } = await import("../../src/operator/Operation.ts");
    const { Anticipate } = await import("../../src/operator/mental/Anticipate.ts");
    const { TermLink } = await import("../../src/entity/TermLink.ts");
    const { TemporalRules } = await import("../../src/inference/TemporalRules.ts");
    const { Tense } = await import("../../src/language/Tense.ts");

    const parser = new Narsese({ getOperator: () => null } as any);
    const parseRequired = (input: Parameters<typeof parser.parseTerm>[0]) => {
        const parsed = parser.parseTerm(input);
        if (parsed === null)
            throw new Error(`Expected term for ${String(input)}`);
        return parsed;
    };
    assert.equal(Tense.tense(new java.lang.String("")), null);
    const forward = parseRequired(new java.lang.String("<a =/> b>"));
    const concurrent = parseRequired(new java.lang.String("<a =|> b>"));
    const backward = parseRequired(new java.lang.String("<a =\\> b>"));

    assert.equal(forward.getTemporalOrder(), TemporalRules.ORDER_FORWARD);
    assert.equal(concurrent.getTemporalOrder(), TemporalRules.ORDER_CONCURRENT);
    assert.equal(backward.getTemporalOrder(), TemporalRules.ORDER_BACKWARD);
    assert.equal(TemporalRules.order(8n, 5), TemporalRules.ORDER_FORWARD);
    assert.equal(String(forward.toString()), "<a =/> b>");

    const conditional = parseRequired(new java.lang.String("<(&/,a,b) =/> c>") ) as InstanceType<typeof CompoundTerm>;
    assert.equal(typeof conditional.containedTemporalRelations, "function");
    assert.equal(conditional.containedTemporalRelations(), 1);
    const links = conditional.prepareComponentLinks();
    assert.ok((Array.from(links) as InstanceType<typeof TermLink>[]).some((link) => link.type === TermLink.COMPOUND_CONDITION));

    const intervalConditional = parseRequired(new java.lang.String("<(&/,a,+8,b) =/> c>"));
    const intervals = CompoundTerm.extractIntervals(null, intervalConditional);
    assert.ok(intervals instanceof NativeList);
    assert.equal(intervals.size(), 1);
    assert.equal(Number(intervals.get(0)), 8);
    assert.deepEqual(Array.from(intervals).map(Number), [8]);

    const noIntervals = CompoundTerm.extractIntervals(null, forward);
    assert.ok(noIntervals instanceof NativeList);
    assert.equal(noIntervals.size(), 0);

    const { Nar } = await import("../../src/main/Nar.ts");
    const { LocalRules } = await import("../../src/inference/LocalRules.ts");
    const { TruthValue } = await import("../../src/entity/TruthValue.ts");
    const nar = new Nar();
    try {
        const oldIntervalTerm = parseRequired(new java.lang.String("<(&/,a,+4,b) =/> c>"));
        const recentIntervals: number[] = [];
        const truth = TruthValue.fromFrequencyConfidence(0.8, 0.9, nar.narParameters);
        const useNewBelief = LocalRules.intervalProjection(
            { memory: nar.memory, narParameters: nar.narParameters } as any,
            intervalConditional,
            oldIntervalTerm,
            recentIntervals,
            truth,
        );
        assert.equal(typeof useNewBelief, "boolean");
        assert.equal(recentIntervals.length, 1);
        assert.ok(Number.isFinite(recentIntervals[0]));
    } finally {
        nar.stop();
    }

    const self = parseRequired(new java.lang.String("SELF"));
    const extImage = parseRequired(new java.lang.String("(/,at,_,{t003})")) as InstanceType<typeof ImageExt>;
    const extReplaced = ImageExt.make(extImage, self, 1);
    assert.equal(String(extReplaced.toString()), "(/,at,SELF,_)");
    const intImage = parseRequired(new java.lang.String("(\\,at,_,{t003})")) as ImageIntType;
    const intReplaced = ImageInt.make(intImage, self, 1);
    assert.equal(String(intReplaced.toString()), "(\\,at,SELF,_)");

    const product = Product.make(self, forward);
    assert.equal(String(product.toString()), "(*,SELF,<a =/> b>)");

    const operation = Operation.make(Product.make(self, parseRequired(new java.lang.String("<b --> B>"))), new Anticipate());
    assert.equal(String(operation.toString()), "(^anticipate,SELF,<b --> B>)");
});
