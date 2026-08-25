import assert from "node:assert/strict";
import test from "node:test";
import { Anticipate } from "../../src/operator/mental/Anticipate.ts";
import { Parameters } from "../../src/main/Parameters.ts";
import { Term } from "../../src/language/Term.ts";
import { EventEmitter } from "../../src/io/events/EventEmitter.ts";
import { Events } from "../../src/io/events/Events.ts";
import { OutputHandler } from "../../src/io/events/OutputHandler.ts";

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
