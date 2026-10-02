//! Java source: opennars/interfaces/Eventable.java
import type { EventEmitter } from "../io/events/EventEmitter.ts";
import type { ClassKey } from "../runtime/ClassIdentity.ts";



/**
 * Implementation can observe events
 *
 * @author Robert Wünsche
 */
export interface Eventable {
    on(c: ClassKey, o: EventEmitter.EventObserver): void;

    off(c: ClassKey, o: EventEmitter.EventObserver): void;

    event(e: EventEmitter.EventObserver, enabled: boolean, ...events: ClassKey[]): void;

    emit(c: ClassKey, ...o: EventEmitter.EventPayload): void;
}
