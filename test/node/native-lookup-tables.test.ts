import assert from "node:assert/strict";
import test from "node:test";

test("native lookup tables preserve Java symbol and tense contracts", async () => {
    const { Symbols } = await import("../../src/io/Symbols.ts");
    const { Tense } = await import("../../src/language/Tense.ts");
    const { java } = await import("../../src/runtime/native-runtime.ts");

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
    assert.deepEqual(Tense.values(), [Tense.Past, Tense.Present, Tense.Future]);
    assert.equal(Tense.Present.name(), "Present");
    assert.equal(Tense.Present.ordinal(), 1);
    assert.equal(Tense.Present.toString(), ":|:");
    assert.equal(Tense.valueOf("Present"), Tense.Present);
    assert.throws(() => Tense.valueOf("Missing"), /No enum constant Tense\.Missing/);
    assert.equal(Tense.Eternal, null);
});

test("Term atom cache normalizes Java and native text keys", async () => {
    const { Term } = await import("../../src/language/Term.ts");
    const { java } = await import("../../src/runtime/native-runtime.ts");
    const name = `term-cache-${Date.now()}-${Math.random()}`;

    const nativeTerm = Term.get(name);
    const javaTerm = Term.get(new java.lang.String(name));

    assert.equal(javaTerm, nativeTerm);
});
