import assert from "node:assert/strict";
import test from "node:test";

import { BudgetFunctions } from "../../src/inference/BudgetFunctions.ts";
import { BudgetValue } from "../../src/entity/BudgetValue.ts";
import { Parameters } from "../../src/main/Parameters.ts";
import { Term } from "../../src/language/Term.ts";
import { UtilityFunctions } from "../../src/inference/UtilityFunctions.ts";

test("budget inference narrows Java float parameters before belief feedback", () => {
    const parameters = new Parameters();
    const taskPriority = Math.fround(0.37);
    const taskDurability = Math.fround(0.81);
    const beliefPriority = Math.fround(0.43);
    const beliefDurability = Math.fround(0.62);
    const qualityInput = 0.8294686911042077;
    const complexityInput = 1.3117974748330008;

    const beliefBudget = new BudgetValue(
        beliefPriority,
        beliefDurability,
        Math.fround(0.73),
        parameters,
    );
    const taskLink = {
        getPriority: () => taskPriority,
        getDurability: () => taskDurability,
    };
    const beliefLink = {
        target: new Term("budget-target"),
        getPriority: () => beliefBudget.getPriority(),
        getDurability: () => beliefBudget.getDurability(),
        incPriority: (value: number) => beliefBudget.incPriority(value),
        incDurability: (value: number) => beliefBudget.incDurability(value),
    };
    const context = {
        getCurrentTaskLink: () => taskLink,
        getCurrentTask: () => taskLink,
        getCurrentBeliefLink: () => beliefLink,
        memory: { concept: () => null },
        narParameters: parameters,
    };

    type BudgetInferenceAccess = {
        budgetInference: (quality: number, complexity: number, context: unknown) => BudgetValue;
    };
    const budgetInference = (BudgetFunctions as unknown as BudgetInferenceAccess).budgetInference;
    const result = budgetInference.call(BudgetFunctions, qualityInput, complexityInput, context);

    const javaQuality = Math.fround(qualityInput);
    const javaComplexity = Math.fround(complexityInput);
    const expectedQuality = Math.fround(javaQuality / javaComplexity);
    const expectedDurability = UtilityFunctions.and(
        Math.fround(Math.fround(taskDurability) / javaComplexity),
        beliefDurability,
    );

    assert.equal(result.getQuality(), expectedQuality);
    assert.equal(result.getDurability(), expectedDurability);
    assert.equal(
        beliefBudget.getDurability(),
        UtilityFunctions.or(beliefDurability, expectedQuality),
    );
});
