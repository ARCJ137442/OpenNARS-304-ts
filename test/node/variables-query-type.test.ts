import assert from "node:assert/strict";
import test from "node:test";

test("compound hasVar(type) preserves Java variable-kind dispatch", async () => {
    const { java } = await import("../../src/platform/node/legacy-runtime-facade.ts");
    const { Nar } = await import("../../src/main/Nar.ts");
    const { Narsese } = await import("../../src/io/Narsese.ts");
    const { Symbols } = await import("../../src/io/Symbols.ts");
    const { Variables } = await import("../../src/language/Variables.ts");

    const nar = new Nar(304);
    const parser = new Narsese(nar);
    const dependent = parser.parseTerm(new java.lang.String(
        "(&&,<#1 --> [unscrewing]>,<#1 --> object>)",
    ));
    const other = parser.parseTerm(new java.lang.String(
        "(&&,<#1 --> [bendable]>,<#1 --> object>)",
    ));
    assert.ok(dependent);
    assert.ok(other);

    assert.equal(Boolean(dependent.hasVar()), true);
    assert.equal(Boolean(dependent.hasVarDep()), true);
    assert.equal(Boolean(dependent.hasVarQuery()), false);
    assert.equal(Boolean(dependent.hasVar(Symbols.VAR_QUERY)), false);

    nar.memory.randomNumber.setSeed(1n);
    const terms = [dependent, other];
    assert.equal(Variables.unify(nar.memory.randomNumber, Symbols.VAR_QUERY, terms), false);
    assert.equal(nar.memory.randomNumber.nextInt(2), 1);
});
