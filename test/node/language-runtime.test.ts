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
