import assert from "node:assert/strict";
import test from "node:test";
import { java } from "../../src/platform/node/legacy-runtime-facade.ts";

import { Nar } from "../../src/main/Nar.ts";
import { Parameters } from "../../src/main/Parameters.ts";
import { TruthValue } from "../../src/entity/TruthValue.ts";
import { Narsese } from "../../src/io/Narsese.ts";
import { OutputHandler } from "../../src/io/events/OutputHandler.ts";

test("Nar config preserves Java float parameters at the TruthValue clamp boundary", () => {
    const nar = new Nar();

    assert.equal(nar.narParameters.TRUTH_EPSILON, Math.fround(0.01));
    assert.equal(nar.narParameters.reliance, Math.fround(0.9));

    const truth = TruthValue.fromFrequencyConfidence(
        1,
        Math.fround(0.99),
        nar.narParameters,
    );
    assert.equal(truth.confidence, 1 - Math.fround(0.01));
});

test("Memory.cycles narrows the duration before the Java multiplication", () => {
    const nar = new Nar();
    const durations = 897.7854144473307;
    const expected = Math.fround(Math.fround(nar.narParameters.DURATION) * Math.fround(durations));

    assert.equal(nar.memory.cycles(durations), expected);
    assert.notEqual(
        nar.memory.cycles(durations),
        Math.fround(nar.narParameters.DURATION * durations),
    );
});

test("Memory.output narrows the volume ratio before the Java subtraction", () => {
    const nar = new Nar();
    nar.narParameters.VOLUME = 9;
    const task = new Narsese(nar).parseTask(new java.lang.String("<volume-test --> object>."));
    const expected = Math.fround(
        Math.fround(1) - Math.fround(Math.fround(nar.narParameters.VOLUME) / Math.fround(100)),
    );
    task.getBudget().setPriority(expected);
    task.getBudget().setDurability(expected);
    task.getBudget().setQuality(expected);

    let outputCount = 0;
    nar.on(OutputHandler.OUT.class, {
        event() {
            outputCount += 1;
        },
    });
    nar.memory.output(task);

    assert.equal(outputCount, 1);
    assert.notEqual(expected, Math.fround(1 - nar.narParameters.VOLUME / 100));
});

test("Parameters keeps every Java float default in binary32", () => {
    const parameters = new Parameters();
    const expected: Record<string, number> = {
        DECISION_THRESHOLD: 0.51,
        HORIZON: 1,
        TRUTH_EPSILON: 0.01,
        BUDGET_EPSILON: 0.0001,
        BUDGET_THRESHOLD: 0.01,
        DEFAULT_CONFIRMATION_EXPECTATION: 0.6,
        DEFAULT_CREATION_EXPECTATION: 0.66,
        DEFAULT_CREATION_EXPECTATION_GOAL: 0.6,
        DEFAULT_JUDGMENT_CONFIDENCE: 0.9,
        DEFAULT_JUDGMENT_PRIORITY: 0.8,
        DEFAULT_JUDGMENT_DURABILITY: 0.5,
        DEFAULT_QUESTION_PRIORITY: 0.9,
        DEFAULT_QUESTION_DURABILITY: 0.9,
        DEFAULT_GOAL_CONFIDENCE: 0.9,
        DEFAULT_GOAL_PRIORITY: 0.9,
        DEFAULT_GOAL_DURABILITY: 0.9,
        DEFAULT_QUEST_PRIORITY: 0.9,
        DEFAULT_QUEST_DURABILITY: 0.9,
        BAG_THRESHOLD: 1,
        FORGET_QUALITY_RELATIVE: 0.3,
        reliance: 0.9,
        DISCOUNT_RATE: 0.5,
        DERIVATION_PRIORITY_LEAK: 0.4,
        DERIVATION_DURABILITY_LEAK: 0.4,
        CURIOSITY_DESIRE_CONFIDENCE_MUL: 0.1,
        CURIOSITY_DESIRE_PRIORITY_MUL: 0.1,
        CURIOSITY_DESIRE_DURABILITY_MUL: 0.3,
        ANTICIPATION_CONFIDENCE: 0.1,
        ANTICIPATION_TOLERANCE: 100,
        SATISFACTION_THRESHOLD: 0,
        COMPLEXITY_UNIT: 1,
        INTERVAL_ADAPT_SPEED: 4,
        DEFAULT_FEEDBACK_PRIORITY: 0.9,
        DEFAULT_FEEDBACK_DURABILITY: 0.5,
        CONCEPT_FORGET_DURATIONS: 2,
        TERMLINK_FORGET_DURATIONS: 10,
        TASKLINK_FORGET_DURATIONS: 4,
        EVENT_FORGET_DURATIONS: 4,
        VARIABLE_INTRODUCTION_CONFIDENCE_MUL: 0.9,
        MOTOR_BABBLING_CONFIDENCE_THRESHOLD: 0.8,
    };

    for (const [name, rawValue] of Object.entries(expected)) {
        assert.equal((parameters as unknown as Record<string, number>)[name], Math.fround(rawValue), name);
    }
    assert.equal(parameters.PROJECTION_DECAY, 0.1);
    assert.notEqual(parameters.PROJECTION_DECAY, Math.fround(0.1));
});
