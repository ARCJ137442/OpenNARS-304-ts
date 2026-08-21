//! Java source: opennars/io/events/EventEmitter.java
import "../../runtime/jree-compat.ts";
import { java, JavaObject, S } from "jree";



/**
 *
 */
// Adapted from
// http://www.recursiverobot.com/post/86215392884/witness-a-simple-android-and-java-event-emitter
// TODO separate this into a single-thread and multithread implementation
export class EventEmitter extends JavaObject {

    private readonly events: java.util.Map<java.lang.Class<unknown>, java.util.List<EventEmitter.EventObserver>>;

    // jree's ArrayDeque constructor mishandles both an omitted argument and a
    // numeric capacity; an empty Java collection preserves the no-argument form.
    private readonly pendingOps: java.util.Deque<java.lang.Object[]> = new java.util.ArrayDeque(new java.util.ArrayList());

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
                this.events = new java.util.LinkedHashMap();


                break;
            }

            case 1: {
                const [knownEventClasses] = args as [java.lang.Class<unknown>[]];


                super();
                this.events = new java.util.LinkedHashMap(knownEventClasses.length);
                for (let c of knownEventClasses) {
                    this.events.put(c, this.newObserverList());
                }


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    protected newObserverList(): java.util.List<EventEmitter.EventObserver> {
        return new java.util.ArrayList();
        /*
         * return Parameters.THREADS == 1 ?
         * new ArrayList<>() : Collections.synchronizedList(new ArrayList<>());
         */
    }

    public isActive(event: java.lang.Class<unknown>): boolean {
        if (this.events.get(event) !== null)
            return !this.events.get(event).isEmpty();
        return false;
    }

    // apply pending on/off changes when synchronizing, ex: in-between memory cycles
    public synch(): void {
        /* synchronized (pendingOps) { */
        if (!this.pendingOps.isEmpty()) {
            for (let o of this.pendingOps) {
                let c: java.lang.Class<unknown> = o[1] as java.lang.Class<unknown>;
                let d: EventEmitter.EventObserver = o[2] as EventObserver;
                if (o[0] as java.lang.Boolean) {
                    this.on(c, d);
                } else {
                    this.off(c, d);
                }
            }
        }
        this.pendingOps.clear();
        /* } */
    }

    public on(event: java.lang.Class<unknown>, o: EventEmitter.EventObserver): void {
        if (this.events.containsKey(event))
            this.events.get(event).add(o);
        else {
            let a: java.util.List<EventEmitter.EventObserver> = this.newObserverList();
            a.add(o);
            this.events.put(event, a);
        }
    }

    /**
     * @param event
     * @param o
     */
    public off(event: java.lang.Class<unknown>, o: EventEmitter.EventObserver): void {
        if (null === event || null === o)
            throw new java.lang.IllegalStateException("Invalid parameter");

        if (!this.events.containsKey(event))
            throw new java.lang.IllegalStateException("Unknown event: " + event);

        // Observers are commonly plain TypeScript objects, not JavaObject
        // instances. jree's List.remove(value) only compares Java-style
        // equatable objects, so preserve Java's registration identity here.
        const observers = this.events.get(event);
        for (let index = 0; index < observers.size(); index += 1) {
            if (observers.get(index) === o) {
                observers.remove(index);
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
        let observers: java.util.List<EventEmitter.EventObserver> = this.events.get(eventClass);

        if ((observers === null) || (observers.isEmpty()))
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


