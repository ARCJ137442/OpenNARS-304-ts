import assert from "node:assert/strict";
import test from "node:test";

test("native lookup tables preserve Java symbol and tense contracts", async () => {
    const { Symbols } = await import("../../src/io/Symbols.ts");
    const { Tense } = await import("../../src/language/Tense.ts");
    const { java } = await import("jree");

    assert.equal(Symbols.getOperator("&"), Symbols.NativeOperator.INTERSECTION_EXT);
    assert.equal(Symbols.getOperator("-->"), Symbols.NativeOperator.INHERITANCE);
    assert.equal(Symbols.getRelation("-->"), Symbols.NativeOperator.INHERITANCE);
    assert.equal(Symbols.getRelation("&"), null);
    assert.equal(Symbols.getOpener("{"), Symbols.NativeOperator.SET_EXT_OPENER);
    assert.equal(Symbols.getCloser("}"), Symbols.NativeOperator.SET_EXT_CLOSER);
    assert.equal(Symbols.isRelation("<=>"), true);
    assert.equal(Symbols.isRelation("("), false);

    assert.equal(Tense.tense(new java.lang.String(":\\:")), Tense.Past);
    assert.equal(Tense.tense(new java.lang.String(":|:")), Tense.Present);
    assert.equal(Tense.tense(new java.lang.String(":/:")), Tense.Future);
    assert.equal(Tense.tense(new java.lang.String("")), null);
});
