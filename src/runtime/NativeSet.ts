/** Java Object.equals lookup with the searched value as receiver. */
export const javaValueEquals = (stored: unknown, searched: unknown): boolean => {
    if (Object.is(stored, searched)) {
        return true;
    }
    // Java HashSet.contains/remove uses the searched value as the equals
    // receiver: searched.equals(stored). Keep that direction for translated
    // value objects whose equals implementation is asymmetric.
    const equals = (searched as { equals?: unknown } | null)?.equals;
    return typeof equals === "function" && equals.call(searched, stored);
};

export const javaValueHashCode = (value: unknown): number => {
    if (value === null || value === undefined) {
        return 0;
    }
    const hashCode = (value as { hashCode?: unknown }).hashCode;
    if (typeof hashCode === "function") {
        return Number(hashCode.call(value));
    }
    if (typeof value === "boolean") {
        return value ? 1231 : 1237;
    }
    if (typeof value === "number") {
        return Number.isInteger(value) ? value | 0 : javaStringHashCode(String(value));
    }
    return javaStringHashCode(String(value));
};

const javaStringHashCode = (value: string): number => {
    let hash = 0;
    for (let index = 0; index < value.length; index += 1) {
        hash = ((hash * 31) + value.charCodeAt(index)) | 0;
    }
    return hash;
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
    private modificationCount = 0;

    public constructor(initialValues: Iterable<T> = []) {
        this.items = [];
        this.addAll(initialValues);
    }

    public add(value: T): boolean {
        if (this.contains(value)) {
            return false;
        }
        this.items.push(value);
        this.modificationCount += 1;
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
        if (this.items.length > 0) {
            this.items.length = 0;
            this.modificationCount += 1;
        }
    }

    public contains(value: T): boolean {
        return this.items.some((candidate) => javaValueEquals(candidate, value));
    }

    /**
     * Java Set equality is value-based, including when a Set is itself an
     * element of another Set.  This is needed by CompositionalRules.powerSet;
     * object identity alone would allow equal nested subsets to coexist.
     */
    public equals(other: unknown): boolean {
        if (other === this) {
            return true;
        }
        const candidate = other as {
            size?: unknown;
            contains?: unknown;
            [Symbol.iterator]?: unknown;
        } | null;
        if (candidate === null || typeof candidate !== "object" || typeof candidate.size !== "function") {
            return false;
        }
        if (Number(candidate.size()) !== this.items.length) {
            return false;
        }
        if (typeof candidate[Symbol.iterator] !== "function") {
            return false;
        }
        // AbstractSet.equals is this.containsAll(other), not
        // other.containsAll(this).  Keeping this receiver direction matters
        // for translated value objects whose equals implementation is
        // asymmetric, and also mirrors the Java Set contract directly.
        return [...other as Iterable<unknown>].every((value) => this.contains(value as T));
    }

    /** Java Set.hashCode is the sum of the element hash codes. */
    public hashCode(): number {
        return this.items.reduce((sum, value) => (sum + javaValueHashCode(value)) | 0, 0);
    }

    public isEmpty(): boolean {
        return this.items.length === 0;
    }

    public remove(value: T): boolean {
        const index = this.items.findIndex((candidate) => javaValueEquals(candidate, value));
        if (index < 0) {
            return false;
        }
        this.items.splice(index, 1);
        this.modificationCount += 1;
        return true;
    }

    /** Java Set iterators support removing the last value returned by next(). */
    public iterator(): NativeSetIterator<T> {
        return new NativeSetIterator(this);
    }

    public size(): number {
        return this.items.length;
    }

    public toArray(): T[] {
        return this.items.slice();
    }

    /** @internal Used by NativeSetIterator without exposing indexed Set access. */
    public valueAt(index: number): T {
        return this.items[index];
    }

    /** @internal Used by NativeSetIterator for Java-shaped fail-fast checks. */
    public get modificationVersion(): number {
        return this.modificationCount;
    }

    /** @internal Used by NativeSetIterator to remove its last value. */
    public removeAt(index: number): void {
        this.items.splice(index, 1);
        this.modificationCount += 1;
    }

    public [Symbol.iterator](): IterableIterator<T> {
        return new NativeSetIterableIterator(this.iterator());
    }
}

export class NativeSetIterator<T> {
    private cursor = 0;
    private lastIndex = -1;
    private expectedModificationVersion: number;

    public constructor(private readonly owner: NativeSet<T>) {
        this.expectedModificationVersion = owner.modificationVersion;
    }

    public hasNext(): boolean {
        this.checkForExternalMutation();
        return this.cursor < this.owner.size();
    }

    public next(): T {
        this.checkForExternalMutation();
        if (!this.hasNext()) {
            throw new Error("NativeSet iterator is exhausted");
        }
        this.lastIndex = this.cursor;
        this.cursor += 1;
        return this.owner.valueAt(this.lastIndex);
    }

    public remove(): void {
        this.checkForExternalMutation();
        if (this.lastIndex < 0) {
            throw new Error("NativeSet iterator has no removable item");
        }
        this.owner.removeAt(this.lastIndex);
        this.cursor = this.lastIndex;
        this.lastIndex = -1;
        this.expectedModificationVersion = this.owner.modificationVersion;
    }

    private checkForExternalMutation(): void {
        if (this.expectedModificationVersion !== this.owner.modificationVersion) {
            throw new Error("NativeSet was modified outside its iterator");
        }
    }
}

class NativeSetIterableIterator<T> implements IterableIterator<T> {
    public constructor(private readonly iterator: NativeSetIterator<T>) {}

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
