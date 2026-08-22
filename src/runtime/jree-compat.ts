import { Class, JavaObject, java } from "jree";

/**
 * Java string concatenation can produce either a jree JavaString or a native
 * JavaScript string after migration. Both use UTF-16 code units for length.
 */
export const javaStringLength = (value: unknown): number => String(value).length;

/**
 * Java's `+` operator invokes toString on reference values; JavaScript's `+`
 * does not do that for jree JavaObject instances. Normalize that boundary
 * before composing Java-facing diagnostic or output text.
 */
export const javaStringValue = (value: unknown): string => {
    if (value === null || value === undefined || typeof value === "string") {
        return String(value);
    }
    const toString = (value as { toString?: unknown }).toString;
    if (typeof toString === "function") {
        return String(toString.call(value));
    }
    return String(value);
};

// jree 1.3.0 uses Java's 48-bit LCG but applies JavaScript bitwise operators
// to the 48-bit state.  That truncates next(>16) to 32 bits, and its
// nextDouble additionally performs integer BigInt division.  OpenNARS uses
// java.util.Random for both probabilistic plugins and randomized unification;
// keep the Java-compatible state at this runtime boundary instead of
// changing translated logic.
type RandomCompat = {
    next?: (bits: number) => number;
    nextInt?: (bound?: number) => number;
    nextFloat?: () => number;
    nextDouble?: () => number;
    setSeed?: (seed: bigint | number) => void;
};

const randomPrototype = java.util.Random.prototype as unknown as RandomCompat;
const randomState = new WeakMap<object, bigint>();
const RANDOM_MULTIPLIER = 0x5deece66dn;
const RANDOM_ADDEND = 0xbn;
const RANDOM_MASK = (1n << 48n) - 1n;

const nextRandomBits = (random: object, bits: number): number => {
    const state = ((randomState.get(random) ?? 0n) * RANDOM_MULTIPLIER + RANDOM_ADDEND) & RANDOM_MASK;
    randomState.set(random, state);
    return Number(state >> BigInt(48 - bits));
};

if (randomPrototype.next && randomPrototype.nextInt && randomPrototype.nextDouble && randomPrototype.setSeed) {
    randomPrototype.setSeed = function setSeed(seed: bigint | number): void {
        randomState.set(this as unknown as object, (BigInt(seed) ^ RANDOM_MULTIPLIER) & RANDOM_MASK);
    };
    randomPrototype.next = function next(bits: number): number {
        return nextRandomBits(this as unknown as object, bits);
    };
    randomPrototype.nextInt = function nextInt(bound?: number): number {
        if (bound === undefined) {
            const value = nextRandomBits(this as unknown as object, 32);
            return value >= 2 ** 31 ? value - 2 ** 32 : value;
        }
        if (bound <= 0) {
            throw new Error("bound must be positive");
        }
        if ((bound & -bound) === bound) {
            return Math.floor((bound * nextRandomBits(this as unknown as object, 31)) / 2 ** 31);
        }
        let bits: number;
        let value: number;
        do {
            bits = nextRandomBits(this as unknown as object, 31);
            value = bits % bound;
        } while (((bits - value + (bound - 1)) | 0) < 0);
        return value;
    };
    randomPrototype.nextFloat = function nextFloat(): number {
        return nextRandomBits(this as unknown as object, 24) / 2 ** 24;
    };
    randomPrototype.nextDouble = function nextDouble(): number {
        return (nextRandomBits(this as unknown as object, 26) * 2 ** 27
            + nextRandomBits(this as unknown as object, 27)) / 2 ** 53;
    };
}

// jree 1.3.0's LinkedHashSet inherits HashSet's immutable hash backend, so
// iteration of values with Java hashCode methods is not insertion ordered.
// OpenNARS relies on LinkedHashSet order for powersets and deterministic rule
// dispatch; keep the backend for membership/hash semantics and add an explicit
// insertion-order view at this compatibility boundary.
type LinkedHashSetCompat = {
    add?: (value: unknown) => boolean;
    addAll?: (collection: Iterable<unknown>) => boolean;
    clear?: () => void;
    clone?: () => unknown;
    contains?: (value: unknown) => boolean;
    iterator?: () => unknown;
    remove?: (value: unknown) => boolean;
    removeAll?: (collection: Iterable<unknown>) => boolean;
    retainAll?: (collection: Iterable<unknown>) => boolean;
    toArray?: (array?: unknown[]) => unknown[];
    [Symbol.iterator]?: () => IterableIterator<unknown>;
};

const linkedHashSetPrototype = java.util.LinkedHashSet.prototype as unknown as LinkedHashSetCompat;
const linkedHashSetOrder = new WeakMap<object, unknown[]>();
const originalLinkedHashSetAdd = linkedHashSetPrototype.add;
const originalLinkedHashSetClear = linkedHashSetPrototype.clear;
const originalLinkedHashSetClone = linkedHashSetPrototype.clone;
const originalLinkedHashSetContains = linkedHashSetPrototype.contains;
const originalLinkedHashSetIterator = linkedHashSetPrototype.iterator;
const originalLinkedHashSetRemove = linkedHashSetPrototype.remove;
const originalLinkedHashSetRemoveAll = linkedHashSetPrototype.removeAll;
const originalLinkedHashSetRetainAll = linkedHashSetPrototype.retainAll;

const javaValuesEqual = (left: unknown, right: unknown): boolean => {
    if (left === right) return true;
    const equals = (left as { equals?: unknown } | null)?.equals;
    return typeof equals === "function" && Boolean(equals.call(left, right));
};

const linkedHashSetValues = (set: object): unknown[] => {
    const current = linkedHashSetOrder.get(set);
    if (current !== undefined) return current;
    const values = originalLinkedHashSetIterator === undefined
        ? []
        : Array.from(originalLinkedHashSetIterator.call(set) as Iterable<unknown>);
    linkedHashSetOrder.set(set, values);
    return values;
};

if (originalLinkedHashSetAdd && originalLinkedHashSetContains && originalLinkedHashSetIterator && originalLinkedHashSetRemove
    && originalLinkedHashSetClear && originalLinkedHashSetRemoveAll && originalLinkedHashSetRetainAll) {
    linkedHashSetPrototype.add = function add(value: unknown): boolean {
        if (!linkedHashSetOrder.has(this as object)) linkedHashSetOrder.set(this as object, []);
        const alreadyPresent = originalLinkedHashSetContains.call(this, value);
        const added = originalLinkedHashSetAdd.call(this, value);
        if (added && !alreadyPresent) linkedHashSetValues(this as object).push(value);
        return added && !alreadyPresent;
    };
    linkedHashSetPrototype.addAll = function addAll(collection: Iterable<unknown>): boolean {
        let changed = false;
        for (const value of collection) {
            changed = this.add!(value) || changed;
        }
        return changed;
    };
    linkedHashSetPrototype.clear = function clear(): void {
        originalLinkedHashSetClear.call(this);
        linkedHashSetValues(this as object).length = 0;
    };
    linkedHashSetPrototype.remove = function remove(value: unknown): boolean {
        const removed = originalLinkedHashSetRemove.call(this, value);
        if (removed) {
            const values = linkedHashSetValues(this as object);
            const index = values.findIndex((candidate) => javaValuesEqual(candidate, value));
            if (index >= 0) values.splice(index, 1);
        }
        return removed;
    };
    linkedHashSetPrototype.removeAll = function removeAll(collection: Iterable<unknown>): boolean {
        let changed = false;
        for (const value of Array.from(collection)) {
            changed = this.remove!(value) || changed;
        }
        return changed;
    };
    linkedHashSetPrototype.retainAll = function retainAll(collection: Iterable<unknown>): boolean {
        const candidates = Array.from(collection);
        let changed = false;
        for (const value of [...linkedHashSetValues(this as object)]) {
            const retained = candidates.some((candidate) => javaValuesEqual(candidate, value));
            if (!retained) changed = this.remove!(value) || changed;
        }
        return changed;
    };
    linkedHashSetPrototype.iterator = function iterator(): unknown {
        const values = [...linkedHashSetValues(this as object)];
        let index = 0;
        const result = {
            hasNext: () => index < values.length,
            next: () => values[index++],
            [Symbol.iterator]() {
                return this;
            },
        };
        return result;
    };
    linkedHashSetPrototype[Symbol.iterator] = function* iterator(): IterableIterator<unknown> {
        yield* linkedHashSetValues(this as object);
    };
    linkedHashSetPrototype.toArray = function toArray(): unknown[] {
        return [...linkedHashSetValues(this as object)];
    };
    if (originalLinkedHashSetClone) {
        linkedHashSetPrototype.clone = function clone(): unknown {
            return new java.util.LinkedHashSet(this as never);
        };
    }
}

// jree 1.3.0's Charset static initializer asynchronously assigns a Charset
// instance to the defaultCharset method.  PrintStream calls that method after
// the timer fires, so the assignment becomes a process-wide runtime failure.
// Keep this external-runtime workaround at the compatibility boundary rather
// than replacing Java-facing output calls throughout the reasoning core.
type CharsetConstructor = {
    new (name: string): unknown;
    defaultCharset: unknown;
};

const charsetClass = java.nio.charset.Charset as unknown as CharsetConstructor;
const defaultCharset = charsetClass.defaultCharset;
const stableDefaultCharset = typeof defaultCharset === "function"
    ? (defaultCharset as () => unknown).bind(charsetClass)
    : () => new charsetClass("utf-8");

Object.defineProperty(charsetClass, "defaultCharset", {
    configurable: true,
    get: () => stableDefaultCharset,
    // jree's delayed initializer writes the broken instance here.
    set: () => undefined,
});

// jree 1.3.0's published JavaObject.class getter passes Function instead of
// the receiver class to Class.fromConstructor(). That collapses every
// translated Java class literal to one token and breaks event dispatch.
const descriptor = Object.getOwnPropertyDescriptor(JavaObject, "class");
if (descriptor?.configurable && descriptor.get) {
    const javaObjectClass = Class.fromConstructor(JavaObject);
    if (JavaObject.class !== javaObjectClass) {
        Object.defineProperty(JavaObject, "class", {
            configurable: true,
            get(this: typeof JavaObject) {
                return Class.fromConstructor(this);
            },
        });
    }
}
