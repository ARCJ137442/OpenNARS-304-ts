//! Java source: opennars/io/events/EventHandler.java
import { java, JavaObject, S } from "jree";
import { EventEmitter } from "./EventEmitter.ts";
import type { ClassTokenLike } from "../../runtime/RuntimeClass.ts";
import type { Nar } from "../../main/Nar.ts";



/**
 */
export abstract class EventHandler extends JavaObject implements EventEmitter.EventObserver {
    protected readonly source: EventEmitter;
    protected active: boolean = false;
    private readonly events: ClassTokenLike[];

    public constructor(n: Nar, active: boolean, ...events: ClassTokenLike[]);

    public constructor(source: EventEmitter, active: boolean, ...events: ClassTokenLike[]);
    public constructor(...args: unknown[]) {
        if (args.length < 2) {
            throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
        }
        const [candidate, active] = args as [Nar | EventEmitter, boolean];
        const events = args.slice(2) as ClassTokenLike[];
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

    public abstract event(event: ClassTokenLike, args: EventEmitter.EventPayload): void;
}
