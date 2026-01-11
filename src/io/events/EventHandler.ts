//! Java source: opennars/io/events/EventHandler.java
import { java, JavaObject, S } from "jree";



/**
 */
export abstract class EventHandler extends JavaObject implements EventEmitter.EventObserver {
    protected readonly source: EventEmitter;
    protected active: boolean = false;
    private readonly events: java.lang.Class<unknown>[];

    public constructor(n: Nar, active: boolean, ...events: java.lang.Class<unknown>[]);

    public constructor(source: EventEmitter, active: boolean, ...events: java.lang.Class<unknown>[]);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 3: {
                const [n, active, events] = args as [Nar, boolean, java.lang.Class<unknown>[]];


                this(n.memory.event, active, this.events);


                break;
            }

            case 3: {
                const [source, active, events] = args as [EventEmitter, boolean, java.lang.Class<unknown>[]];


                super();
                this.source = source;
                this.events = this.events;
                this.setActive(active);


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    public setActive(b: boolean): void {
        if (this.active === b)
            return;

        this.active = b;
        this.source.set(this, b, this.events);
    }

    public isActive(): boolean {
        return this.active;
    }
}
