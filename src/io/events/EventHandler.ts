//! Java source: opennars/io/events/EventHandler.java
import { java, JavaObject, S } from "jree";
import { EventEmitter } from "./EventEmitter.ts";
import type { Nar } from "../../main/Nar.ts";



/**
 */
export abstract class EventHandler extends JavaObject implements EventEmitter.EventObserver {
    protected readonly source: EventEmitter;
    protected active: boolean = false;
    private readonly events: java.lang.Class<unknown>[];

    public constructor(n: Nar, active: boolean, ...events: java.lang.Class<unknown>[]);

    public constructor(source: EventEmitter, active: boolean, ...events: java.lang.Class<unknown>[]);
    public constructor(...args: unknown[]) {
        if (args.length !== 3) {
            throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
        }
        const [candidate, active, events] = args as [Nar | EventEmitter, boolean, java.lang.Class<unknown>[]];
        const source = (candidate as Nar).memory?.event ?? candidate as EventEmitter;
        super();
        this.source = source;
        this.events = events;
        this.setActive(active);
    }


    public setActive(b: boolean): void {
        if (this.active === b)
            return;

        this.active = b;
        this.source.set(this, b, ...this.events);
    }

    public isActive(): boolean {
        return this.active;
    }

    public abstract event(event: java.lang.Class<unknown>, args: java.lang.Object[]): void;
}
