import assert from "node:assert/strict";
import test from "node:test";

import { BudgetFunctions } from "../../src/inference/BudgetFunctions.ts";
import { BudgetValue } from "../../src/entity/BudgetValue.ts";
import { Parameters } from "../../src/main/Parameters.ts";
import { Term } from "../../src/language/Term.ts";
import { UtilityFunctions } from "../../src/inference/UtilityFunctions.ts";
import { TruthValue } from "../../src/entity/TruthValue.ts";
import type { Sentence } from "../../src/entity/Sentence.ts";

type RankableSentence = Pick<Sentence, "truth"> & {
    getTruth: () => { getExpectation: () => number };
};

const rankableSentence = (confidence: number, expectation: number): Sentence => ({
    truth: { confidence },
    getTruth: () => ({ getExpectation: () => expectation }),
} as unknown as RankableSentence as Sentence);

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

test("rankBelief narrows Java float return values at the budget boundary", () => {
    const olderBelief = rankableSentence(0.14211009442806244, 0.14211009442806244);
    const newerBelief = rankableSentence(0.14211007952690125, 0.14211007952690125);

    const olderRank = BudgetFunctions.rankBelief(olderBelief, false);
    const newerRank = BudgetFunctions.rankBelief(newerBelief, false);

    assert.equal(olderRank, Math.fround(0.14211009442806244));
    assert.equal(newerRank, Math.fround(0.14211007952690125));
    assert.notEqual(olderRank, newerRank);
    assert.equal(
        BudgetFunctions.rankBelief(olderBelief, true),
        Math.fround(0.14211009442806244),
    );
});

test("truthToQuality and the TruthValue budget constructor share Java float semantics", () => {
    const parameters = new Parameters();
    const expectation = 0.3672657907009125;
    const truth = new TruthValue(0.25, 0.5, false, parameters);
    truth.getExpectationAsFloat = () => expectation;

    const quality = BudgetFunctions.truthToQuality(truth);
    const budget = new BudgetValue(0.4, 0.6, truth, parameters);

    assert.equal(quality, Math.fround(Math.max(
        Math.fround(expectation),
        Math.fround(1 - Math.fround(expectation)) * 0.75,
    )));
    assert.equal(budget.getQuality(), quality);
});
