//! Java source: opennars/interfaces/Resettable.java

import { java } from "jree";



/**
 * Implementations can be reseted - that is to flush all content and restore the
 * state to some default state
 *
 * @author Robert Wünsche
 */
export interface Resettable {
    /**
     * reset
     */
    reset(): void;
}
