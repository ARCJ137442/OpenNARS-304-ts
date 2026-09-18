//! Java source: opennars/io/events/EventHandler.java
import { java, S } from "jree";
import { EventEmitter } from "./EventEmitter.ts";
import { RuntimeObject, type ClassTokenLike } from "../../runtime/RuntimeClass.ts";
import type { Nar } from "../../main/Nar.ts";



/**
 */
// Java 原始声明为 implements EventObserver；RuntimeObject 只承接已观测的 class/getClass，替代转写器添加的 JavaObject 壳。
export abstract class EventHandler extends RuntimeObject implements EventEmitter.EventObserver {
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
