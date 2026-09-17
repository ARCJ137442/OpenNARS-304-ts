const nativeValuesEqual = (stored: unknown, searched: unknown): boolean => {
    if (Object.is(stored, searched)) {
        return true;
    }
    // Java HashSet.contains/remove uses the searched value as the equals
    // receiver: searched.equals(stored). Keep that direction for translated
    // value objects whose equals implementation is asymmetric.
    const equals = (searched as { equals?: unknown } | null)?.equals;
    return typeof equals === "function" && equals.call(searched, stored);
};

/**
 * Native insertion-ordered Set for translated Java Set contracts.
 *
 * 📌【2026-09-17】This class keeps Set semantics explicit even though its
 * current storage is an array: membership uses Java-style equals rather
 * than JavaScript object identity, and iteration follows insertion order.
 * It is intentionally separate from NativeList so a future Set storage
 * optimization cannot silently change a list-shaped caller's contract.
 */
export class NativeSet<T> implements Iterable<T> {
    private readonly items: T[];

    public constructor(initialValues: Iterable<T> = []) {
        this.items = [];
        this.addAll(initialValues);
    }

    public add(value: T): boolean {
        if (this.contains(value)) {
            return false;
        }
        this.items.push(value);
        return true;
    }

    public addAll(values: Iterable<T>): boolean {
        let changed = false;
        for (const value of values) {
            changed = this.add(value) || changed;
        }
        return changed;
    }

    public clear(): void {
        this.items.length = 0;
    }

    public contains(value: T): boolean {
        return this.items.some((candidate) => nativeValuesEqual(candidate, value));
    }

    public isEmpty(): boolean {
        return this.items.length === 0;
    }

    public remove(value: T): boolean {
        const index = this.items.findIndex((candidate) => nativeValuesEqual(candidate, value));
        if (index < 0) {
            return false;
        }
        this.items.splice(index, 1);
        return true;
    }

    public size(): number {
        return this.items.length;
    }

    public toArray(): T[] {
        return this.items.slice();
    }

    public [Symbol.iterator](): IterableIterator<T> {
        return this.items[Symbol.iterator]();
    }
}
