/**
 * Native ordered list for translated Java tables.
 *
 * 📌【2026-09-16】Concept tables use only this small ArrayList contract:
 * indexed read/insert/remove, value removal, append, size checks and ordered iteration.
 * Keeping that contract here avoids constructing a jree ArrayList for every
 * concept while preserving the insertion order used by Java's ranked tables.
 */
export class NativeList<T> implements Iterable<T> {
    private readonly items: T[];
    private modificationCount = 0;

    public constructor(initialValues: Iterable<T> = []) {
        this.items = Array.from(initialValues);
    }

    public add(element: T): boolean;
    public add(index: number, element: T): void;
    public add(first: T | number, second?: T): boolean | void {
        if (arguments.length === 1) {
            this.items.push(first as T);
            this.modificationCount += 1;
            return true;
        }

        const index = first as number;
        this.checkInsertIndex(index);
        this.items.splice(index, 0, second as T);
        this.modificationCount += 1;
    }

    public addAll(elements: Iterable<T>): boolean {
        const values = Array.from(elements);
        if (values.length === 0) {
            return false;
        }
        this.items.push(...values);
        this.modificationCount += 1;
        return true;
    }

    public clear(): void {
        if (this.items.length > 0) {
            this.items.length = 0;
            this.modificationCount += 1;
        }
    }

    public contains(element: T): boolean {
        return this.indexOf(element) !== -1;
    }

    public get(index: number): T {
        this.checkElementIndex(index);
        return this.items[index];
    }

    public indexOf(element: T): number {
        return this.items.findIndex((candidate) => NativeList.valuesEqual(candidate, element));
    }

    public isEmpty(): boolean {
        return this.items.length === 0;
    }

    public iterator(): NativeListIterator<T> {
        return new NativeListIterator(this);
    }

    public remove(index: number): T;
    public remove(element: T): boolean;
    public remove(value: number | T): T | boolean {
        // Java List.remove(int) and List.remove(Object) are distinguished by
        // the translated call-site type. At runtime, primitive numeric calls
        // retain the indexed form; object values use Java-style equality.
        if (typeof value === "number") {
            this.checkElementIndex(value);
            const [removed] = this.items.splice(value, 1);
            this.modificationCount += 1;
            return removed;
        }

        const index = this.indexOf(value);
        if (index < 0) {
            return false;
        }
        this.items.splice(index, 1);
        this.modificationCount += 1;
        return true;
    }

    public set(index: number, element: T): T {
        this.checkElementIndex(index);
        const previous = this.items[index];
        this.items[index] = element;
        return previous;
    }

    public size(): number {
        return this.items.length;
    }

    public toArray(): T[] {
        return this.items.slice();
    }

    public [Symbol.iterator](): IterableIterator<T> {
        return new NativeListIterableIterator(this.iterator());
    }

    /** @internal Used by NativeListIterator for Java-shaped fail-fast checks. */
    public get modificationVersion(): number {
        return this.modificationCount;
    }

    /** @internal Used by NativeListIterator to remove its last value. */
    public removeAt(index: number): void {
        this.remove(index);
    }

    private checkElementIndex(index: number): void {
        if (!Number.isInteger(index) || index < 0 || index >= this.items.length) {
            throw new RangeError(`NativeList index out of bounds: ${index}`);
        }
    }

    private checkInsertIndex(index: number): void {
        if (!Number.isInteger(index) || index < 0 || index > this.items.length) {
            throw new RangeError(`NativeList insertion index out of bounds: ${index}`);
        }
    }

    private static valuesEqual(left: unknown, right: unknown): boolean {
        if (Object.is(left, right)) {
            return true;
        }
        // Java ArrayList.indexOf/contains uses the searched object as the
        // receiver: searched.equals(candidate). Preserve that direction for
        // translated value types whose equals implementation is asymmetric.
        const equals = (right as { equals?: unknown } | null)?.equals;
        return typeof equals === "function" && equals.call(right, left);
    }
}

export class NativeListIterator<T> {
    private cursor = 0;
    private lastIndex = -1;
    private expectedModificationVersion: number;

    public constructor(private readonly owner: NativeList<T>) {
        this.expectedModificationVersion = owner.modificationVersion;
    }

    public hasNext(): boolean {
        this.checkForExternalMutation();
        return this.cursor < this.owner.size();
    }

    public next(): T {
        this.checkForExternalMutation();
        if (!this.hasNext()) {
            throw new Error("NativeList iterator is exhausted");
        }
        this.lastIndex = this.cursor;
        this.cursor += 1;
        return this.owner.get(this.lastIndex);
    }

    public remove(): void {
        this.checkForExternalMutation();
        if (this.lastIndex < 0) {
            throw new Error("NativeList iterator has no removable item");
        }
        this.owner.removeAt(this.lastIndex);
        this.cursor = this.lastIndex;
        this.lastIndex = -1;
        this.expectedModificationVersion = this.owner.modificationVersion;
    }

    private checkForExternalMutation(): void {
        if (this.expectedModificationVersion !== this.owner.modificationVersion) {
            throw new Error("NativeList was modified outside its iterator");
        }
    }
}

class NativeListIterableIterator<T> implements IterableIterator<T> {
    public constructor(private readonly iterator: NativeListIterator<T>) {}

    public [Symbol.iterator](): IterableIterator<T> {
        return this;
    }

    public next(): IteratorResult<T> {
        if (!this.iterator.hasNext()) {
            return { done: true, value: undefined as never };
        }
        return { done: false, value: this.iterator.next() };
    }
}
