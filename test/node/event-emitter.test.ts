import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { java } from "jree";
import { tmpdir } from "node:os";
import { EventEmitter } from "../../src/io/events/EventEmitter.ts";
import { Nar } from "../../src/main/Nar.ts";
import { EventHandler } from "../../src/io/events/EventHandler.ts";
import { Events } from "../../src/io/events/Events.ts";
import { OutputHandler } from "../../src/io/events/OutputHandler.ts";
import { TextOutputHandler } from "../../src/io/events/TextOutputHandler.ts";
import {
    JavaIllegalArgumentException,
    JavaIllegalStateException,
} from "../../src/runtime/jree-compat.ts";
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

test("EventEmitter preserves Java exception boundaries", () => {
    const Constructor = EventEmitter as unknown as new (...args: unknown[]) => EventEmitter;
    assert.throws(() => new Constructor(Events.CycleStart.class, Events.CycleEnd.class),
        (error: unknown) => {
            assert.ok(error instanceof JavaIllegalArgumentException);
            assert.equal(String((error as { getMessage?: () => unknown }).getMessage?.()),
                "Invalid number of arguments");
            return true;
        });

    const emitter = new EventEmitter();
    const observer: EventEmitter.EventObserver = { event() {} };
    assert.throws(() => emitter.off(null as unknown as ClassTokenLike, observer),
        (error: unknown) => {
            assert.ok(error instanceof JavaIllegalStateException);
            assert.equal(String((error as { getMessage?: () => unknown }).getMessage?.()),
                "Invalid parameter");
            return true;
        });
    assert.throws(() => emitter.off(Events.CycleStart.class, observer),
        (error: unknown) => {
            assert.ok(error instanceof JavaIllegalStateException);
            assert.equal(String((error as { getMessage?: () => unknown }).getMessage?.()),
                "Unknown event: [object Object]");
            return true;
        });
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

test("EventHandler preserves the Java illegal-argument boundary", () => {
    class InvalidHandler extends EventHandler {
        public event(): void {}
    }

    const Constructor = InvalidHandler as unknown as new (...args: unknown[]) => EventHandler;
    assert.throws(() => new Constructor(), (error: unknown) => {
        assert.ok(error instanceof JavaIllegalArgumentException);
        assert.equal(String((error as { getMessage?: () => unknown }).getMessage?.()),
            "Invalid number of arguments");
        return true;
    });
});

test("OutputHandler preserves the Java illegal-argument boundary", () => {
    class InvalidOutputHandler extends OutputHandler {
        public event(): void {}
    }

    const Constructor = InvalidOutputHandler as unknown as new (...args: unknown[]) => OutputHandler;
    assert.throws(() => new Constructor(), (error: unknown) => {
        assert.ok(error instanceof JavaIllegalArgumentException);
        assert.equal(String((error as { getMessage?: () => unknown }).getMessage?.()),
            "Invalid number of arguments");
        return true;
    });
});

test("TextOutputHandler preserves the Java illegal-argument boundary", () => {
    const getOutputString = TextOutputHandler.getOutputString as unknown as (...args: unknown[]) => unknown;
    assert.throws(() => getOutputString(), (error: unknown) => {
        assert.ok(error instanceof JavaIllegalArgumentException);
        assert.equal(String((error as { getMessage?: () => unknown }).getMessage?.()),
            "Invalid number of arguments");
        return true;
    });
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

test("InferenceEvent keeps optional stack frames in a native ordered array", () => {
    const source = readFileSync("src/io/events/Events.ts", "utf8");
    assert.doesNotMatch(source, /java\.util\.List<java\.lang\.StackTraceElement>/);
    assert.doesNotMatch(source, /java\.util\.Arrays\.asList/);
    assert.match(source, /readonly stack: readonly StackTraceElementCompat\[\] \| null/);

    const Base = Events.InferenceEvent as unknown as {
        new (when: bigint, stackFrames: number): { stack: unknown };
    };
    const event = new Base(3n, 2);
    assert.ok(Array.isArray(event.stack));
});

test("Events.ConceptNew keeps event text on the project-owned string boundary", () => {
    const source = readFileSync("src/io/events/Events.ts", "utf8");

    assert.doesNotMatch(source, /public override toString\(\): java\.lang\.String/);
    assert.doesNotMatch(source, /new java\.lang\.StringBuilder\(\)\.append\(S`Concept Created: `/);
});

test("Events.TaskAdd accepts native and Java string reasons at the event boundary", () => {
    const source = readFileSync("src/io/events/Events.ts", "utf8");
    assert.doesNotMatch(source, /onTaskAdd\(t: Task, reason: java\.lang\.String/);

    const received: unknown[] = [];
    const observer = new class extends Events.TaskAdd {
        public override onTaskAdd(_task: unknown, reason: string | java.lang.String): void {
            received.push(reason);
        }
    }();

    observer.event(Events.TaskAdd.class, [null, "native-reason"]);
    observer.event(Events.TaskAdd.class, [null, new java.lang.String("boxed-reason")]);

    assert.equal(String(received[0]), "native-reason");
    assert.equal(String(received[1]), "boxed-reason");
});


test("TextOutputHandler keeps line prefixes on the native string boundary", () => {
    const source = readFileSync("src/io/events/TextOutputHandler.ts", "utf8");
    assert.doesNotMatch(source, /private prefix: java\.lang\.String/);
    assert.doesNotMatch(source, /setLinePrefix\(prefix: java\.lang\.String/);

    const lines: unknown[] = [];
    const nar = new Nar();
    const handler = new TextOutputHandler(nar, {
        println(value: unknown): void {
            lines.push(value);
        },
    });

    assert.equal(handler.setLinePrefix(new java.lang.String("boxed: ")), handler);
    handler.event(OutputHandler.OUT.class, [new java.lang.String("signal")]);

    assert.deepEqual(lines.map(String), ["boxed: OUT: signal"]);
});

test("TextOutputHandler.LineOutput accepts project-owned text values", () => {
    const source = readFileSync("src/io/events/TextOutputHandler.ts", "utf8");
    assert.doesNotMatch(source, /println\(s: java\.lang\.String\): void/);
});

test("TextOutputHandler.openSaveFile accepts project-owned text paths", () => {
    const source = readFileSync("src/io/events/TextOutputHandler.ts", "utf8");
    assert.doesNotMatch(source, /openSaveFile\(path: java\.lang\.String\)/);

    const directory = mkdtempSync(join(tmpdir(), "opennars-text-output-"));
    const nativePath = join(directory, "native.log");
    const boxedPath = join(directory, "boxed.log");
    const handler = new TextOutputHandler(new Nar());

    try {
        handler.openSaveFile(nativePath);
        handler.closeSaveFile();
        handler.openSaveFile(new java.lang.String(boxedPath));
        handler.closeSaveFile();

        assert.equal(existsSync(nativePath), true);
        assert.equal(existsSync(boxedPath), true);
    } finally {
        rmSync(directory, { recursive: true, force: true });
    }
});
