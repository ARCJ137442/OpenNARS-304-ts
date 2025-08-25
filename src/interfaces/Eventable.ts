


import { java } from "jree";



/**
 * Implementation can observe events
 *
 * @author Robert Wünsche
 */
interface Eventable {
    on(/* final */  c: java.lang.Class<unknown> | null, /* final */  o: EventEmitter.EventObserver | null): void;

    off(/* final */  c: java.lang.Class<unknown> | null, /* final */  o: EventEmitter.EventObserver | null): void;

    event(/* final */  e: EventEmitter.EventObserver | null, /* final */  enabled: boolean, /* final */ ...events: java.lang.Class<unknown> | null[]): void;

    emit(/* final */  c: java.lang.Class<unknown> | null, /* final */ ...o: java.lang.Object | null[]): void;
}
