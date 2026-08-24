//! Java source: opennars/interfaces/Eventable.java
import { java } from "jree";
import type { EventEmitter } from "../io/events/EventEmitter.ts";



/**
 * Implementation can observe events
 *
 * @author Robert Wünsche
 */
export interface Eventable {
    on(c: java.lang.Class<unknown>, o: EventEmitter.EventObserver): void;

    off(c: java.lang.Class<unknown>, o: EventEmitter.EventObserver): void;

    event(e: EventEmitter.EventObserver, enabled: boolean, ...events: java.lang.Class<unknown>[]): void;

    emit(c: java.lang.Class<unknown>, ...o: java.lang.Object[]): void;
}
