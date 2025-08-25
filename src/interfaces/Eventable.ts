import { java } from "jree";



/**
 * Implementation can observe events
 *
 * @author Robert Wünsche
 */
interface Eventable {
    on(/* final */  c: java.lang.Class<unknown>, /* final */  o: EventEmitter.EventObserver): void;

    off(/* final */  c: java.lang.Class<unknown>, /* final */  o: EventEmitter.EventObserver): void;

    event(/* final */  e: EventEmitter.EventObserver, /* final */  enabled: boolean, /* final */ ...events: java.lang.Class<unknown>[]): void;

    emit(/* final */  c: java.lang.Class<unknown>, /* final */ ...o: java.lang.Object[]): void;
}
