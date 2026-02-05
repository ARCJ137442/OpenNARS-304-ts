//! Java source: opennars/entity/TLink.java

/**
 * A link between a compound term and a component term
 * <p>
 * This interface provides a generic link from a source to a target object,
 * with index and priority information.
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
export interface TLink<T> {
    /**
     * Get one index by level
     *
     * @param i The index level
     * @return The index value
     */
    getIndex(i: number): number;

    /**
     * Get the target object
     *
     * @return The linked target
     */
    getTarget(): T;

    /**
     * Get priority value
     *
     * @return Current priority value
     */
    getPriority(): number;
}
