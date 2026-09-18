import assert from "node:assert/strict";
import test from "node:test";
import { java } from "jree";
import { EventEmitter } from "../../src/io/events/EventEmitter.ts";
import { EventHandler } from "../../src/io/events/EventHandler.ts";
import { Events } from "../../src/io/events/Events.ts";
import { RuntimeObject, type ClassTokenLike } from "../../src/runtime/RuntimeClass.ts";

test("EventEmitter.set subscribes only to the requested event classes", () => {
    const emitter = new EventEmitter();
    assert.equal(Object.getPrototypeOf(EventEmitter.prototype), Object.prototype);
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

test("Events keeps the Java plain namespace-holder boundary", () => {
    const events = new Events();

    assert.equal(Object.getPrototypeOf(Events.prototype), Object.prototype);
    assert.ok(events instanceof Events);
    assert.equal(Events.CycleEnd.class.getSimpleName(), "CycleEnd");
});

test("native event classes keep stable runtime identity tokens", () => {
    assert.equal(Events.CycleEnd.class, Events.CycleEnd.class);
    assert.notEqual(Events.CycleEnd.class, Events.CycleStart.class);
    assert.equal(Events.CycleEnd.class.getName(), "CycleEnd");
    assert.equal(Events.CycleEnd.class.getSimpleName(), "CycleEnd");
    assert.equal(Events.CycleEnd.class.equals(Events.CycleEnd.class), true);
    assert.equal(Events.CycleEnd.class.equals(Events.CycleStart.class), false);
});

test("EventEmitter uses native map and observer arrays while preserving identity removal", () => {
    const emitter = new EventEmitter();
    const observer: EventEmitter.EventObserver = { event() {} };
    emitter.on(Events.CycleEnd.class, observer);
    emitter.on(Events.CycleEnd.class, observer);

    const events = (emitter as unknown as {
        events: Map<ClassTokenLike, EventEmitter.EventObserver[]>;
    }).events;
    const observers = events.get(Events.CycleEnd.class);
    assert.ok(observers);
    assert.equal(events instanceof Map, true);
    assert.equal(Array.isArray(observers), true);
    assert.equal(observers.length, 2);

    emitter.off(Events.CycleEnd.class, observer);
    assert.equal(observers.length, 1);
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
        pendingOps: Array<[boolean, ClassTokenLike, EventEmitter.EventObserver]>;
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

test("EventEmitter preserves native event payload order", () => {
    const emitter = new EventEmitter();
    const received: EventEmitter.EventPayload[] = [];
    const observer: EventEmitter.EventObserver = {
        event(_event, args) {
            received.push(args);
        },
    };
    const payload: EventEmitter.EventPayload = [true, "native", { id: 3 }, [1, 2]];

    emitter.on(Events.CycleEnd.class, observer);
    emitter.emit(Events.CycleEnd.class, ...payload);

    assert.deepEqual(received, [payload]);
    assert.equal(received[0][0], true);
    assert.equal(received[0][1], "native");
    assert.deepEqual(received[0][2], { id: 3 });
    assert.deepEqual(received[0][3], [1, 2]);
});

test("EventHandler accepts Java-style event varargs", () => {
    const emitter = new EventEmitter();
    const received: unknown[] = [];
    class Handler extends EventHandler {
        public event(event: ClassTokenLike): void {
            received.push(event);
        }
    }

    new Handler(emitter, true, Events.CycleEnd.class);
    emitter.emit(Events.CycleStart.class);
    emitter.emit(Events.CycleEnd.class);
    assert.deepEqual(received, [Events.CycleEnd.class]);
});

test("EventHandler uses the project runtime identity boundary without jree", () => {
    assert.equal(Object.getPrototypeOf(EventHandler.prototype), RuntimeObject.prototype);
    assert.notEqual(Object.getPrototypeOf(EventHandler.prototype), Object.prototype);
});

test("Events.ConceptNew preserves the Java InferenceEvent constructor contract", () => {
    const concept = {
        toString: () => "fake-concept",
    } as never;
    const event = new Events.ConceptNew(concept, 3n);

    assert.equal(event.when, 3n);
    assert.equal(event.stack, null);
    assert.equal(event.getType(), event.getClass());
    assert.equal(event.getType(), Events.ConceptNew.class);
    assert.equal(String(event.toString()), "Concept Created: fake-concept");
});
