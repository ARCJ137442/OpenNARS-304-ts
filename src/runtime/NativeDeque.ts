/**
 * A small FIFO deque for hot paths that only need queue operations and
 * iterator removal.
 *
 * 📌【2026-08-26】TaskLink uses exactly this subset of Java's Deque contract.
 * Keeping the storage native avoids constructing jree Vector/AbstractList
 * iterators for every novelty check while preserving the Java iteration order
 * and iterator.remove() behavior.
 */
export class NativeDeque<T> implements Iterable<T> {
    private items: T[] = [];
    private head = 0;
    private modificationCount = 0;

    public addLast(value: T): void {
        this.items.push(value);
        this.modificationCount += 1;
    }

    public remove(): T {
        if (this.size() === 0) {
            throw new Error("NativeDeque is empty");
        }

        const value = this.items[this.head];
        this.items[this.head] = undefined as T;
        this.head += 1;
        this.modificationCount += 1;
        this.compactIfNeeded();
        return value;
    }

    public size(): number {
        return this.items.length - this.head;
    }

    public iterator(): NativeDequeIterator<T> {
        return new NativeDequeIterator(this);
    }

    public *[Symbol.iterator](): IterableIterator<T> {
        const iterator = this.iterator();
        while (iterator.hasNext()) {
            yield iterator.next();
        }
    }

    /** @internal Used by NativeDequeIterator so iterator.remove stays local. */
    public valueAt(index: number): T {
        const physicalIndex = this.head + index;
        if (index < 0 || physicalIndex >= this.items.length) {
            throw new Error("NativeDeque iterator is out of range");
        }
        return this.items[physicalIndex];
    }

    /** @internal Used by NativeDequeIterator so iterator.remove stays local. */
    public removeAt(index: number): void {
        const physicalIndex = this.head + index;
        if (index < 0 || physicalIndex >= this.items.length) {
            throw new Error("NativeDeque iterator is out of range");
        }
        this.items.splice(physicalIndex, 1);
        this.modificationCount += 1;
        this.compactIfNeeded();
    }

    /** @internal Used by NativeDequeIterator for fail-fast external mutation checks. */
    public get modificationVersion(): number {
        return this.modificationCount;
    }

    private compactIfNeeded(): void {
        if (this.head >= 32 && this.head * 2 >= this.items.length) {
            this.items = this.items.slice(this.head);
            this.head = 0;
        }
    }
}

export class NativeDequeIterator<T> {
    private cursor = 0;
    private lastIndex = -1;
    private expectedModificationVersion: number;

    public constructor(private readonly owner: NativeDeque<T>) {
        this.expectedModificationVersion = owner.modificationVersion;
    }

    public hasNext(): boolean {
        this.checkForExternalMutation();
        return this.cursor < this.owner.size();
    }

    public next(): T {
        this.checkForExternalMutation();
        if (!this.hasNext()) {
            throw new Error("NativeDeque iterator is exhausted");
        }
        this.lastIndex = this.cursor;
        this.cursor += 1;
        return this.owner.valueAt(this.lastIndex);
    }

    public remove(): void {
        this.checkForExternalMutation();
        if (this.lastIndex < 0) {
            throw new Error("NativeDeque iterator has no removable item");
        }
        this.owner.removeAt(this.lastIndex);
        this.cursor = this.lastIndex;
        this.lastIndex = -1;
        this.expectedModificationVersion = this.owner.modificationVersion;
    }

    private checkForExternalMutation(): void {
        if (this.expectedModificationVersion !== this.owner.modificationVersion) {
            throw new Error("NativeDeque was modified outside its iterator");
        }
    }
}
