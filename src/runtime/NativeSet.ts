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

const javaValueHashCode = (value: unknown): number => {
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
        if (typeof candidate.contains === "function") {
            const contains = candidate.contains as (value: unknown) => unknown;
            return this.items.every((value) => Boolean(contains.call(other, value)));
        }
        if (typeof candidate[Symbol.iterator] !== "function") {
            return false;
        }
        const values = [...other as Iterable<unknown>];
        return this.items.every((value) => values.some((candidateValue) =>
            nativeValuesEqual(candidateValue, value)));
    }

    /** Java Set.hashCode is the sum of the element hash codes. */
    public hashCode(): number {
        return this.items.reduce((sum, value) => (sum + javaValueHashCode(value)) | 0, 0);
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
