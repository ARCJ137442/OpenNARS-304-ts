/**
 * Java original type: java.util.Iterator<T>.
 *
 * This is the smallest project-owned contract needed by translated code that
 * still uses Java's hasNext/next protocol.  Concrete implementations remain
 * native TypeScript iterators (for example NativeMapIterator); the jree
 * package is not part of this boundary.
 */
export interface JavaIterator<T> {
    hasNext(): boolean;
    next(): T;
    remove(): void;
}
