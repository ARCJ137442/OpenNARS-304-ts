
test("Memory keeps task reason literals native until event conversion", () => {
    const source = readFileSync(new URL("../../src/storage/Memory.ts", import.meta.url), "utf8");
    assert.doesNotMatch(source, /\bS`/);
    assert.doesNotMatch(source, /process\.release|isJUnitTest|isjUnit/);
});

import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

test("Memory emits native string reasons in task events", async () => {
    const { Nar } = await import("../../src/main/Nar.ts");
    const { Events } = await import("../../src/io/events/Events.ts");
    const { Sentence } = await import("../../src/entity/Sentence.ts");
    const { Stamp } = await import("../../src/entity/Stamp.ts");
    const { Task } = await import("../../src/entity/Task.ts");
    const { Term } = await import("../../src/language/Term.ts");
    const { Tense } = await import("../../src/language/Tense.ts");
    const { TruthValue } = await import("../../src/entity/TruthValue.ts");
    const { BudgetValue } = await import("../../src/entity/BudgetValue.ts");
    const { Add } = await import("../../src/operator/misc/Add.ts");

    const nar = new Nar();
    const parameters = nar.narParameters;
    const sentence = new Sentence(
        Term.get("memory-boundary"),
        ".",
        TruthValue.fromFrequencyConfidence(1, 0.9, parameters),
        new Stamp(0, Tense.Present, new Stamp.BaseEntry(0, 1), parameters.DURATION),
    );
    const task = new Task(
        sentence,
        new BudgetValue(1, 1, 1, parameters),
        Task.EnumType.INPUT,
    );
    const additions: unknown[][] = [];
    const removals: unknown[][] = [];

    nar.on(Events.TaskAdd.class, {
        event(_channel, args) {
            additions.push(args);
        },
    });
    nar.on(Events.TaskRemove.class, {
        event(_channel, args) {
            removals.push(args);
        },
    });

    nar.memory.addNewTask(task, "native-add-reason");
    nar.memory.removeTask(task, "native-remove-reason");

    assert.equal(String(additions[0]?.[1]), "native-add-reason");
    assert.equal(typeof additions[0]?.[1], "string");
    assert.equal(String(removals[0]?.[1]), "native-remove-reason");
    assert.equal(typeof removals[0]?.[1], "string");

    const add = new Add();
    nar.memory.addOperator(add);
    assert.equal(nar.memory.getOperator("^add"), add);
    assert.equal(nar.memory.getOperator("^add"), add);
});
