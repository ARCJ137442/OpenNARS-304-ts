import assert from "node:assert/strict";
import test from "node:test";
import { TemporalInferenceControl } from "../../src/control/TemporalInferenceControl.ts";
import { BudgetValue } from "../../src/entity/BudgetValue.ts";
import { Sentence } from "../../src/entity/Sentence.ts";
import { Stamp } from "../../src/entity/Stamp.ts";
import { Task } from "../../src/entity/Task.ts";
import { TruthValue } from "../../src/entity/TruthValue.ts";
import { Term } from "../../src/language/Term.ts";
import { Tense } from "../../src/language/Tense.ts";
import { Parameters } from "../../src/main/Parameters.ts";
import { NativeSet } from "../../src/runtime/NativeSet.ts";

test("TemporalInferenceControl filters equal Task values in local attempt set", () => {
    const parameters = new Parameters();
    parameters.SEQUENCE_BAG_ATTEMPTS = 2;
    parameters.OPERATION_SAMPLES = 0;

    const makeTask = (narId: number, inputId: number): Task => {
        const sentence = new Sentence(
            Term.get("temporal-attempt"),
            ".",
            TruthValue.fromFrequencyConfidence(1, 0.9, parameters),
            new Stamp(Tense.Present, new Stamp.BaseEntry(narId, inputId)),
        );
        return new Task(sentence, new BudgetValue(0.5, 0.5, 0.5, parameters), Task.EnumType.INPUT);
    };

    const newEvent = makeTask(1, 1);
    const firstAttempt = makeTask(2, 2);
    const equalAttempt = new Task(firstAttempt.sentence, new BudgetValue(0.4, 0.4, 0.4, parameters), Task.EnumType.INPUT);
    assert.notEqual(firstAttempt, equalAttempt);
    assert.equal(firstAttempt.equals(equalAttempt), true);

    const queue = [firstAttempt, equalAttempt];
    const putBack: Task[] = [];
    const fakeNal = {
        narParameters: parameters,
        emit: () => undefined,
        memory: {
            lastDecision: null,
            narParameters: parameters,
            cycles: (count: number) => count,
            seq_current: {
                takeOut: () => queue.shift() ?? null,
                putBack: (task: Task) => putBack.push(task),
            },
        },
    } as unknown as import("../../src/control/DerivationContext.ts").DerivationContext;
    const runtime = TemporalInferenceControl as unknown as {
        proceedWithTemporalInduction: (...args: unknown[]) => null;
        addToSequenceTasks: (...args: unknown[]) => void;
    };
    const originalProceed = runtime.proceedWithTemporalInduction;
    const originalAdd = runtime.addToSequenceTasks;
    let proceedCount = 0;
    runtime.proceedWithTemporalInduction = () => {
        proceedCount += 1;
        return null;
    };
    runtime.addToSequenceTasks = () => undefined;
    try {
        assert.equal(TemporalInferenceControl.eventInference(newEvent, fakeNal), true);
    } finally {
        runtime.proceedWithTemporalInduction = originalProceed;
        runtime.addToSequenceTasks = originalAdd;
    }

    assert.equal(proceedCount, 1);
    assert.deepEqual(putBack, [firstAttempt, equalAttempt]);

    const values = new NativeSet<Task>();
    assert.equal(values.add(firstAttempt), true);
    assert.equal(values.add(equalAttempt), false);
    assert.equal(values.contains(equalAttempt), true);
    values.clear();
    assert.equal(values.contains(equalAttempt), false);
});
