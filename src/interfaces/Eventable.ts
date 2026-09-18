//! Java source: opennars/interfaces/Eventable.java
import type { EventEmitter } from "../io/events/EventEmitter.ts";
import type { ClassTokenLike } from "../runtime/RuntimeClass.ts";



/**
 * Implementation can observe events
 *
 * @author Robert Wünsche
 */
export interface Eventable {
    on(c: ClassTokenLike, o: EventEmitter.EventObserver): void;

    off(c: ClassTokenLike, o: EventEmitter.EventObserver): void;

    event(e: EventEmitter.EventObserver, enabled: boolean, ...events: ClassTokenLike[]): void;

    emit(c: ClassTokenLike, ...o: EventEmitter.EventPayload): void;
}
