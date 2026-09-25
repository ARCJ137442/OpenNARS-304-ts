import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("StructuralRules sequence array copies preserve Java component order", async () => {
    await import("../../src/entity/Sentence.ts");
    const { StructuralRules } = await import("../../src/inference/StructuralRules.ts");
    const { Conjunction } = await import("../../src/language/Conjunction.ts");
    const { TemporalRules } = await import("../../src/inference/TemporalRules.ts");
    const { Term } = await import("../../src/language/Term.ts");
    const { TruthValue } = await import("../../src/entity/TruthValue.ts");
    const { Parameters } = await import("../../src/main/Parameters.ts");
    const { BudgetFunctions } = await import("../../src/inference/BudgetFunctions.ts");

    const params = new Parameters();
    const originalForward = BudgetFunctions.forward;
    const originalCompoundForward = BudgetFunctions.compoundForward;
    const output: string[][] = [];
    const atoms = ["A", "B", "C", "D", "E"].map(name => Term.get(`copy-${name}`));
    const conjunction = Conjunction.make(atoms, TemporalRules.ORDER_FORWARD) as import("../../src/language/Conjunction.ts").Conjunction;
    const truth = TruthValue.fromFrequencyConfidence(1, 0.9, params);
    const fakeNal = {
        narParameters: params,
        getCurrentTask: () => ({ sentence: { getTruth: () => truth, isJudgment: () => true, isGoal: () => false } }),
        singlePremiseTask: (result: { term: typeof atoms }) => {
            output.push(result.term.map(term => String(term.name())));
        },
    } as unknown as import("../../src/control/DerivationContext.ts").DerivationContext;
    BudgetFunctions.forward = (() => null) as unknown as typeof BudgetFunctions.forward;
    BudgetFunctions.compoundForward = (() => null) as unknown as typeof BudgetFunctions.compoundForward;
    try {
        const nested = Conjunction.make([atoms[1], atoms[2]], TemporalRules.ORDER_FORWARD);
        const parent = Conjunction.make([atoms[0], atoms[1], atoms[3]], TemporalRules.ORDER_FORWARD) as import("../../src/language/Conjunction.ts").Conjunction;
        parent.term[1] = nested;
        StructuralRules.flattenSequence(parent, nested, true, 1, fakeNal);
        assert.deepEqual(output.pop(), ["copy-A", "copy-B", "copy-C", "copy-D"]);

        StructuralRules.takeOutFromConjunction(conjunction, atoms[2], true, 2, fakeNal);
        assert.deepEqual(output.pop(), ["copy-A", "copy-B", "copy-D", "copy-E"]);
        StructuralRules.splitConjunctionApart(conjunction, atoms[2], true, 2, fakeNal);
        assert.deepEqual(output, [
            ["copy-A", "copy-B", "copy-C"],
            ["copy-C", "copy-D", "copy-E"],
        ]);
    } finally {
        BudgetFunctions.forward = originalForward;
        BudgetFunctions.compoundForward = originalCompoundForward;
    }
});

test("StructuralRules no longer imports jree for array copies", () => {
    const source = readFileSync("src/inference/StructuralRules.ts", "utf8");
    assert.doesNotMatch(source, /from ["']jree["']/);
    assert.doesNotMatch(source, /java\.lang\.System\.arraycopy/);
});
