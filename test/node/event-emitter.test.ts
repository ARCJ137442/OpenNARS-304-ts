import assert from "node:assert/strict";
import test from "node:test";
import { EventEmitter } from "../../src/io/events/EventEmitter.ts";
import { Events } from "../../src/io/events/Events.ts";

test("EventEmitter.set subscribes only to the requested event classes", () => {
    const emitter = new EventEmitter();
    const received: unknown[] = [];
    const observer: EventEmitter.EventObserver = {
        event(event) {
            received.push(event);
        },
    };

    emitter.set(observer, true, Events.CycleEnd.class);
    emitter.emit(Events.CycleStart.class);
    emitter.emit(Events.CycleEnd.class);
    assert.deepEqual(received, [Events.CycleEnd.class]);

    emitter.set(observer, false, Events.CycleEnd.class);
    emitter.emit(Events.CycleEnd.class);
    assert.deepEqual(received, [Events.CycleEnd.class]);
});
