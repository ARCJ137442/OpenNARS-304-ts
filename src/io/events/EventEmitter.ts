//! Java source: opennars/io/events/EventEmitter.java
import "../../runtime/jree-compat.ts";
import { java, JavaObject, S } from "jree";

type PendingOperation = [
    enabled: boolean,
    event: java.lang.Class<unknown>,
    observer: EventEmitter.EventObserver,
];
type ObserverList = EventEmitter.EventObserver[];


/**
 *
 */
// Adapted from
// http://www.recursiverobot.com/post/86215392884/witness-a-simple-android-and-java-event-emitter
// TODO separate this into a single-thread and multithread implementation
export class EventEmitter extends JavaObject {

    private readonly events: Map<java.lang.Class<unknown>, ObserverList>;

    // Java source: private final Deque<Object[]> pendingOps = new ArrayDeque<>();
    // The queue is private and only supports FIFO iteration followed by clear.
    private readonly pendingOps: PendingOperation[] = [];

    /**
     * EventEmitter that allows unknown events; must use concurrent collection
     * for multithreading since new event classes may be added at any time.
     */
    public constructor();

    /**
     * EventEmitter with a fixed set of known events; the 'events' map
     * can then be made unmodifiable and non-concurrent for speed.
     */
    public constructor(...knownEventClasses: java.lang.Class<unknown>[]);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 0: {

                /*
                 * if (Parameters.THREADS > 1)
                 * events = new ConcurrentHashMap<>();
                 * else
                 */
                // events = new LinkedHashMap<>();
                super();
                this.events = new Map();


                break;
            }

            case 1: {
                const [knownEventClasses] = args as [java.lang.Class<unknown>[]];


                super();
                this.events = new Map();
                for (let c of knownEventClasses) {
                    this.events.set(c, this.newObserverList());
                }


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    protected newObserverList(): ObserverList {
        return [];
        /*
         * return Parameters.THREADS == 1 ?
         * new ArrayList<>() : Collections.synchronizedList(new ArrayList<>());
         */
    }

    public isActive(event: java.lang.Class<unknown>): boolean {
        const observers = this.events.get(event);
        if (observers !== undefined)
            return observers.length > 0;
        return false;
    }

    // apply pending on/off changes when synchronizing, ex: in-between memory cycles
    public synch(): void {
        /* synchronized (pendingOps) { */
        if (this.pendingOps.length > 0) {
            for (const [enabled, c, d] of this.pendingOps) {
                if (enabled) {
                    this.on(c, d);
                } else {
                    this.off(c, d);
                }
            }
        }
        this.pendingOps.length = 0;
        /* } */
    }

    public on(event: java.lang.Class<unknown>, o: EventEmitter.EventObserver): void {
        const observers = this.events.get(event);
        if (observers !== undefined) {
            observers.push(o);
        } else {
            const a = this.newObserverList();
            a.push(o);
            this.events.set(event, a);
        }
    }

    /**
     * @param event
     * @param o
     */
    public off(event: java.lang.Class<unknown>, o: EventEmitter.EventObserver): void {
        if (null === event || null === o)
            throw new java.lang.IllegalStateException("Invalid parameter");

        if (!this.events.has(event))
            throw new java.lang.IllegalStateException("Unknown event: " + event);

        // Observers are commonly plain TypeScript objects, not JavaObject
        // instances. jree's List.remove(value) only compares Java-style
        // equatable objects, so preserve Java's registration identity here.
        const observers = this.events.get(event);
        if (observers === undefined) {
            throw new java.lang.IllegalStateException("Unknown event: " + event);
        }
        for (let index = 0; index < observers.length; index += 1) {
            if (observers[index] === o) {
                observers.splice(index, 1);
                break;
            }
        }
        /*
         * if (!removed) {
         * throw new IllegalStateException("EventObserver " + o +
         * " was not registered for events");
         * }
         */
    }

    /** for enabling many events at the same time */
    public set(o: EventEmitter.EventObserver, enable: boolean, ...events: java.lang.Class<unknown>[]): void {
        for (let c of events) {
            if (enable)
                this.on(c, o);
            else
                this.off(c, o);
        }
    }

    public emit(eventClass: java.lang.Class<unknown>, ...params: java.lang.Object[]): void {
        const observers = this.events.get(eventClass);

        if (observers === undefined || observers.length === 0)
            return;

        // final int n = observers.size();
        for (let m of observers) {
            m.event(eventClass, params);
        }

    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace EventEmitter {
    export interface EventObserver {
        event(event: java.lang.Class<unknown>, args: java.lang.Object[]): void;
    }

}


