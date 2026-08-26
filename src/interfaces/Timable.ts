//! Java source: opennars/interfaces/Timable.java

/**
 * Used to dispatch the deferred retrieval of time
 *
 * @author Robert Wünsche
 */
export interface Timable {
    /**
     * return the current time from the clock
     *
     * @return The current time
     */
    time(): bigint;
}
