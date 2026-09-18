import assert from "node:assert/strict";
import test from "node:test";
import { Stamp } from "../../src/entity/Stamp.ts";
import { Tense } from "../../src/language/Tense.ts";

const makeStamp = (narId: number, inputId: number): Stamp =>
    new Stamp(Tense.Present, new Stamp.BaseEntry(narId, inputId));

test("Stamp keeps class identity and clone without a jree JavaObject shell", () => {
    const stamp = makeStamp(7, 11);
    const clone = stamp.clone();

    assert.equal(Stamp.class.getName(), "Stamp");
    assert.equal(stamp.getClass(), Stamp.class);
    assert.ok(clone instanceof Stamp);
});

test("Stamp.baseOverlap uses BaseEntry value equality, not object identity", () => {
    const first = makeStamp(7, 11);
    const equalValue = makeStamp(7, 11);
    const differentValue = makeStamp(7, 12);

    assert.equal(Stamp.baseOverlap(first, equalValue), true);
    assert.equal(Stamp.baseOverlap(first, differentValue), false);
});

test("Stamp.evidenceIsCyclic detects equal BaseEntry values in one evidential base", () => {
    const first = new Stamp.BaseEntry(3, 5);
    const equalValue = new Stamp.BaseEntry(3, 5);
    const stamp = makeStamp(3, 5);
    stamp.evidentialBase = [first, equalValue];

    assert.equal(Object.getPrototypeOf(Object.getPrototypeOf(first)), Object.prototype);
    assert.equal(first === equalValue, false);
    assert.equal(first.equals(equalValue), true);
    assert.equal(first.compareTo(equalValue), 0);
    assert.equal(first.toString(), "(3,5)");
    assert.equal(first.hashCode(), equalValue.hashCode());
    assert.equal(stamp.evidenceIsCyclic(), true);
});

test("ProcessGoal evidence subset keeps Java BaseEntry equality", async () => {
    const { BudgetValue } = await import("../../src/entity/BudgetValue.ts");
    const { ProcessGoal } = await import("../../src/control/concept/ProcessGoal.ts");
    const { Sentence } = await import("../../src/entity/Sentence.ts");
    const { Task } = await import("../../src/entity/Task.ts");
    const { Term } = await import("../../src/language/Term.ts");
    const { TruthValue } = await import("../../src/entity/TruthValue.ts");
    const { Nar } = await import("../../src/main/Nar.ts");

    const nar = new Nar();
    try {
        const makeTask = (entries: Array<[number, number]>): InstanceType<typeof Task> => {
            const stamp = makeStamp(entries[0][0], entries[0][1]);
            stamp.evidentialBase = entries.map(([narId, inputId]) => new Stamp.BaseEntry(narId, inputId));
            stamp.baseLength = stamp.evidentialBase.length;
            const sentence = new Sentence(
                Term.get("process-goal-evidence"),
                "!",
                TruthValue.fromFrequencyConfidence(1, 0.9, nar.narParameters),
                stamp,
            );
            return new Task(
                sentence,
                new BudgetValue(0.5, 0.5, 0.5, nar.narParameters),
                Task.EnumType.INPUT,
            );
        };

        const oldGoal = makeTask([[12, 34]]);
        const equalValueTask = makeTask([[12, 34]]);
        const extraEvidenceTask = makeTask([[12, 34], [12, 35]]);
        const processGoalRuntime = ProcessGoal as unknown as {
            processOperationGoal: (...args: unknown[]) => void;
            executeOperation: (...args: unknown[]) => boolean;
        };
        const originalExecuteOperation = processGoalRuntime.executeOperation;
        let executionCount = 0;
        processGoalRuntime.executeOperation = () => {
            executionCount++;
            return true;
        };
        try {
            processGoalRuntime.processOperationGoal(
                equalValueTask.sentence,
                { narParameters: nar.narParameters },
                null,
                oldGoal,
                equalValueTask,
            );
            assert.equal(executionCount, 0);

            processGoalRuntime.processOperationGoal(
                extraEvidenceTask.sentence,
                { narParameters: nar.narParameters },
                null,
                oldGoal,
                extraEvidenceTask,
            );
            assert.equal(executionCount, 1);

            processGoalRuntime.processOperationGoal(
                equalValueTask.sentence,
                { narParameters: nar.narParameters },
                null,
                null,
                equalValueTask,
            );
            assert.equal(executionCount, 2);
        } finally {
            processGoalRuntime.executeOperation = originalExecuteOperation;
        }
    } finally {
        nar.stop();
    }
});
