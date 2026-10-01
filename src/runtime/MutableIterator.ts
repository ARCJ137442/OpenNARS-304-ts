/**
 * Small mutable iterator contract for containers that support removal.
 */
export interface MutableIterator<T> {
    hasNext(): boolean;
    next(): T;
    remove(): void;
}
