import assert from "node:assert/strict";
import test from "node:test";
import { java } from "jree";
import { EventEmitter } from "../../src/io/events/EventEmitter.ts";
import { EventHandler } from "../../src/io/events/EventHandler.ts";
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

test("EventEmitter.synch applies pending operations in FIFO order", () => {
    const emitter = new EventEmitter();
    const received: unknown[] = [];
    const observer: EventEmitter.EventObserver = {
        event(event) {
            received.push(event);
        },
    };
    const pendingOps = (emitter as unknown as {
        pendingOps: Array<[boolean, java.lang.Class<unknown>, EventEmitter.EventObserver]>;
    }).pendingOps;

    pendingOps.push([true, Events.CycleEnd.class, observer]);
    emitter.synch();
    emitter.emit(Events.CycleEnd.class);

    pendingOps.push([false, Events.CycleEnd.class, observer]);
    emitter.synch();
    emitter.emit(Events.CycleEnd.class);

    assert.deepEqual(received, [Events.CycleEnd.class]);
    assert.equal(pendingOps.length, 0);
});

test("EventHandler accepts Java-style event varargs", () => {
    const emitter = new EventEmitter();
    const received: unknown[] = [];
    class Handler extends EventHandler {
        public event(event: java.lang.Class<unknown>): void {
            received.push(event);
        }
    }

    new Handler(emitter, true, Events.CycleEnd.class);
    emitter.emit(Events.CycleStart.class);
    emitter.emit(Events.CycleEnd.class);
    assert.deepEqual(received, [Events.CycleEnd.class]);
});

test("Events.ConceptNew preserves the Java InferenceEvent constructor contract", () => {
    const concept = {
        toString: () => "fake-concept",
    } as never;
    const event = new Events.ConceptNew(concept, 3n);

    assert.equal(event.when, 3n);
    assert.equal(event.stack, null);
    assert.equal(event.getType(), event.getClass());
    assert.equal(String(event.toString()), "Concept Created: fake-concept");
});
