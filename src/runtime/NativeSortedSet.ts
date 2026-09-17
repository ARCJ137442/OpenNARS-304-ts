import { javaValueHashCode } from "./NativeSet.ts";

/**
 * Native ordered set for translated TreeSet-shaped term helpers.
 *
 * 📌【2026-09-16】Term.toSortedSet only needs a sorted, duplicate-free
 * collection with retainAll(), toArray(), and ordinary set lookup. Keeping
 * this narrow contract native removes the jree ArrayList that previously
 * masqueraded as a Set without pretending to implement every TreeSet view.
 */
export class NativeSortedSet<T> implements Iterable<T> {
    private readonly items: T[];

    public constructor(
        values: Iterable<T>,
        private readonly compare: (left: T, right: T) => number,
    ) {
        this.items = [];
        for (const value of values) {
            this.add(value);
        }
    }

    public add(value: T): boolean {
        const index = this.lowerBound(value);
        if (index < this.items.length && this.compare(this.items[index], value) === 0) {
            return false;
        }
        this.items.splice(index, 0, value);
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
        const index = this.lowerBound(value);
        return index < this.items.length && this.compare(this.items[index], value) === 0;
    }

    /** Java TreeSet inherits value equality and hashing from AbstractSet. */
    public equals(other: unknown): boolean {
        if (other === this) {
            return true;
        }
        const candidate = other as {
            size?: unknown;
            [Symbol.iterator]?: unknown;
        } | null;
        if (candidate === null || typeof candidate !== "object" || typeof candidate.size !== "function") {
            return false;
        }
        if (Number(candidate.size()) !== this.items.length || typeof candidate[Symbol.iterator] !== "function") {
            return false;
        }
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
        const index = this.lowerBound(value);
        if (index >= this.items.length || this.compare(this.items[index], value) !== 0) {
            return false;
        }
        this.items.splice(index, 1);
        return true;
    }

    public retainAll(values: Iterable<T>): boolean {
        const collection = values as Iterable<T> & { contains?: (value: T) => boolean };
        const candidates = collection.contains === undefined ? Array.from(values) : null;
        let changed = false;
        for (let index = this.items.length - 1; index >= 0; index -= 1) {
            const value = this.items[index];
            const retained = typeof collection.contains === "function"
                ? collection.contains(value)
                : candidates!.some((candidate) => NativeSortedSet.valuesEqual(value, candidate));
            if (!retained) {
                this.items.splice(index, 1);
                changed = true;
            }
        }
        return changed;
    }

    public size(): number {
        return this.items.length;
    }

    public toArray(): T[];
    public toArray(target: T[]): T[];
    public toArray(target?: T[]): T[] {
        if (target === undefined || target.length < this.items.length) {
            return this.items.slice();
        }
        target.splice(0, this.items.length, ...this.items);
        if (target.length > this.items.length) {
            target[this.items.length] = undefined as T;
        }
        return target;
    }

    public [Symbol.iterator](): IterableIterator<T> {
        return this.items[Symbol.iterator]();
    }

    private lowerBound(value: T): number {
        let low = 0;
        let high = this.items.length;
        while (low < high) {
            const middle = low + Math.floor((high - low) / 2);
            if (this.compare(this.items[middle], value) < 0) {
                low = middle + 1;
            } else {
                high = middle;
            }
        }
        return low;
    }

    private static valuesEqual(left: unknown, right: unknown): boolean {
        if (Object.is(left, right)) {
            return true;
        }
        const equals = (right as { equals?: unknown } | null)?.equals;
        return typeof equals === "function" && equals.call(right, left);
    }
}
