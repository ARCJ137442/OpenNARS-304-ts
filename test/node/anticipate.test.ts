import assert from "node:assert/strict";
import test from "node:test";
import { Anticipate } from "../../src/operator/mental/Anticipate.ts";
import { Parameters } from "../../src/main/Parameters.ts";
import { Term } from "../../src/language/Term.ts";
import { EventEmitter } from "../../src/io/events/EventEmitter.ts";
import { Events } from "../../src/io/events/Events.ts";
import { OutputHandler } from "../../src/io/events/OutputHandler.ts";
import { Concept } from "../../src/entity/Concept.ts";
import { BudgetValue } from "../../src/entity/BudgetValue.ts";

test("Anticipate keeps a prediction and emits the Java-compatible signal", () => {
    const parameters = new Parameters();
    const event = new EventEmitter();
    const emitted: unknown[] = [];
    const memory = {
        event,
        narParameters: parameters,
        emit(channel: unknown, ...args: unknown[]) {
            emitted.push([channel, ...args]);
        },
        addNewTask() {
            throw new Error("feedback should be disabled for this local contract");
        },
    };
    const time = { time: () => 10n };
    const anticipate = new Anticipate();
    anticipate.setAnticipationAsOperator(false);

    anticipate.anticipate(Term.SELF, memory as never, 15n, null, time);

    assert.equal(anticipate.anticipations.size(), 1);
    const entry = anticipate.anticipations.entrySet().iterator().next();
    assert.equal(entry.getKey().predictionCreationTime, 10n);
    assert.equal(entry.getKey().predictedOccurenceTime, 15n);
    assert.deepEqual(emitted, [[OutputHandler.ANTICIPATE.class, Term.SELF]]);
});

test("Anticipate subscribes and unsubscribes from its cycle events", () => {
    const parameters = new Parameters();
    const event = new EventEmitter();
    const nar = { memory: { event }, narParameters: parameters };
    const anticipate = new Anticipate(0.2, 0.3);

    anticipate.setEnabled(nar as never, true);
    assert.equal(event.isActive(Events.InduceSucceedingEvent.class), true);
    assert.equal(event.isActive(Events.CycleEnd.class), true);
    anticipate.setEnabled(nar as never, false);
    assert.equal(event.isActive(Events.InduceSucceedingEvent.class), false);
    assert.equal(event.isActive(Events.CycleEnd.class), false);
});

test("Anticipate deduplicates equal derived terms in its Set boundary", () => {
    const anticipate = new Anticipate();
    const first = Term.get("anticipated");
    const second = first.clone();
    assert.notEqual(first, second);
    assert.equal(first.equals(second), true);

    const nal = {
        narParameters: { DEFAULT_CONFIRMATION_EXPECTATION: 0.5 },
    };
    const makeTask = (term: Term) => ({
        sentence: {
            truth: { getExpectation: () => 1 },
            isJudgment: () => true,
            isEternal: () => false,
        },
        getTerm: () => term,
    });

    anticipate.event(Events.TaskDerive.class, [makeTask(first), nal] as never);
    anticipate.event(Events.TaskDerive.class, [makeTask(second), nal] as never);

    const newTasks = (anticipate as unknown as {
        newTasks: { size(): number; toArray(): Term[] };
    }).newTasks;
    assert.equal(newTasks.size(), 1);
    assert.equal(newTasks.toArray()[0], first);
});

test("Concept stores anticipation entries in a native array", () => {
    const parameters = new Parameters();
    const memory = { narParameters: parameters } as never;
    const concept = new Concept(
        new BudgetValue(0.5, 0.5, 0.5, parameters),
        Term.get("anticipation"),
        memory,
    );
    const entry = new Concept.AnticipationEntry(0.5, null as never, 0n, 1n);

    assert.equal(Array.isArray(concept.anticipations), true);
    concept.anticipations.push(entry);
    assert.equal(concept.anticipations.length, 1);
    assert.equal(concept.anticipations[0], entry);
});
