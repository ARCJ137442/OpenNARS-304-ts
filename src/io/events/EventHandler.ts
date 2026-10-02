//! Java source: opennars/io/events/EventHandler.java
import { EventEmitter } from "./EventEmitter.ts";
import { ReasonerInputError } from "../../runtime/ReasonerErrors.ts";
import { ReasonerObject, type ClassKey } from "../../runtime/ClassIdentity.ts";
import type { Nar } from "../../main/Nar.ts";



/**
 */
// Java 原始声明为 implements EventObserver；ReasonerObject 只承接已观测的 class/getClass，替代转写器添加的 JavaObject 壳。
export abstract class EventHandler extends ReasonerObject implements EventEmitter.EventObserver {
    protected readonly source: EventEmitter;
    protected active: boolean = false;
    private readonly events: ClassKey[];

    public constructor(n: Nar, active: boolean, ...events: ClassKey[]);

    public constructor(source: EventEmitter, active: boolean, ...events: ClassKey[]);
    public constructor(...args: unknown[]) {
        if (args.length < 2) {
            throw new ReasonerInputError("Invalid number of arguments");
        }
        const [candidate, active] = args as [Nar | EventEmitter, boolean];
        const events = args.slice(2) as ClassKey[];
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

    public abstract event(event: ClassKey, args: EventEmitter.EventPayload): void;
}
