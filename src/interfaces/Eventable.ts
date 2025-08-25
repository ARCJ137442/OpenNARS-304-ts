import { java } from "jree";



/**
 * Implementation can observe events
 *
 * @author Robert Wünsche
 */
interface Eventable {
    on(c: java.lang.Class<unknown>, o: EventEmitter.EventObserver): void;

    off(c: java.lang.Class<unknown>, o: EventEmitter.EventObserver): void;

    event(e: EventEmitter.EventObserver, enabled: boolean, ...events: java.lang.Class<unknown>[]): void;

    emit(c: java.lang.Class<unknown>, ...o: java.lang.Object[]): void;
}
