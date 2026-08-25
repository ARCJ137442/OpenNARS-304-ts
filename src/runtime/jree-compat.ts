import { Class, JavaObject, java, type long } from "jree";

// jree 1.3.0 constructs and parses an Error stack in every JavaObject class
// that has not inherited its internal "#fqn" marker.  The published runtime
// only writes this marker; Class.getName()/getSimpleName() use the constructor
// name, and no jree or OpenNARS source reads "#fqn".  Seed the inherited
// marker at the compatibility boundary so translated objects keep their
// observable class identity without paying for a dead stack-parsing path.
const JREE_FQN_MARKER = "#fqn";
const javaObjectConstructor = JavaObject as unknown as Record<string, unknown>;
if (!(JREE_FQN_MARKER in javaObjectConstructor)) {
    Object.defineProperty(javaObjectConstructor, JREE_FQN_MARKER, {
        configurable: true,
        value: true,
    });
}

/** Text accepted at Node-facing Java string input boundaries. */
export type JavaStringInput = java.lang.String | string;

/** Normalize a native Node string before it enters translated Java code. */
export const toJavaString = (value: JavaStringInput): java.lang.String =>
    value instanceof java.lang.String ? value : new java.lang.String(value);

/**
 * Java long values enter the Node-facing port in both jree's bigint form and
 * the numeric clock form retained by the translated OpenNARS runtime.
 * Keep that representation choice at one compatibility boundary instead of
 * forcing every caller to use a type assertion.
 */
export type JavaLongInput = long | number;

export const toRuntimeLong = (value: JavaLongInput): long => value as long;

export const addRuntimeLong = (value: JavaLongInput, delta: number): long =>
    (typeof value === "bigint" ? value + BigInt(delta) : value + delta) as long;

export const subtractRuntimeLong = (value: JavaLongInput, delta: number): long =>
    (typeof value === "bigint" ? value - BigInt(delta) : value - delta) as long;

/** Add two Java long values while preserving the active runtime representation. */
export const addRuntimeLongValues = (left: JavaLongInput, right: JavaLongInput): long =>
    (typeof left === "bigint" || typeof right === "bigint"
        ? BigInt(left) + BigInt(right)
        : left + right) as long;

/** Subtract two Java long values while preserving the active runtime representation. */
export const subtractRuntimeLongValues = (left: JavaLongInput, right: JavaLongInput): long =>
    (typeof left === "bigint" || typeof right === "bigint"
        ? BigInt(left) - BigInt(right)
        : left - right) as long;

/**
 * jree 1.3.0 does not ship java.lang.Double. Keep the boxed-number contract
 * at this compatibility boundary instead of replacing translated Java APIs
 * with native numbers at every call site.
 */
export class JavaDoubleCompat extends java.lang.Number {
    public static readonly POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
    public static readonly NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
    public static readonly NaN = Number.NaN;

    private readonly value: number;

    public constructor(value: number | string | java.lang.String) {
        super();
        this.value = Number(String(value));
    }

    public static toString(value: number): java.lang.String {
        return new java.lang.String(String(value));
    }

    public static valueOf(value: number | string | java.lang.String): JavaDoubleCompat {
        return new JavaDoubleCompat(value);
    }

    public doubleValue(): number {
        return this.value;
    }

    public floatValue(): number {
        return Math.fround(this.value);
    }

    public intValue(): number {
        return Math.trunc(this.value);
    }

    public longValue(): bigint {
        return BigInt(Math.trunc(this.value));
    }

    public valueOf(): number {
        return this.value;
    }
}

/** jree omits several Java exception classes used by the translated sources. */
export class JavaAssertionError extends java.lang.Error {}
export class JavaIllegalAccessError extends java.lang.Error {}
export class JavaInstantiationException extends java.lang.Exception {}
export class JavaNoSuchMethodException extends java.lang.Exception {}
export class JavaIllegalAccessException extends java.lang.Exception {}
export class JavaClassNotFoundException extends java.lang.Exception {}
export class JavaInvocationTargetException extends java.lang.Exception {}
export class JavaParserConfigurationException extends java.lang.Exception {}
export class JavaSAXException extends java.lang.Exception {}
export class JavaParseException extends java.lang.Exception {}

/** jree declares primitive char as a number, while translated Narsese uses string code units at runtime. */
export type JavaChar = string;

/**
 * Java string concatenation can produce either a jree JavaString or a native
 * JavaScript string after migration. Both use UTF-16 code units for length.
 */
export const javaStringLength = (value: unknown): number => String(value).length;

type JavaCharSequenceView = {
    length: number;
    charCodeAt(index: number): number;
};

/**
 * Read Java-compatible UTF-16 code units without converting a jree String
 * through TextDecoder. Java String equality and hashing are defined over code
 * units, so this preserves the contract while avoiding repeated allocation at
 * the compatibility boundary.
 */
const javaCharSequenceView = (value: unknown): JavaCharSequenceView | null => {
    if (typeof value === "string") {
        return {
            length: value.length,
            charCodeAt: (index: number) => value.charCodeAt(index),
        };
    }
    const candidate = value as {
        length?: unknown;
        charAt?: unknown;
    } | null;
    if (typeof candidate?.length !== "function" || typeof candidate.charAt !== "function") {
        return null;
    }
    const lengthMethod = candidate.length as () => unknown;
    const charAtMethod = candidate.charAt as (index: number) => unknown;
    const length = Number(lengthMethod.call(value));
    if (!Number.isInteger(length) || length < 0) return null;
    return {
        length,
        charCodeAt: (index: number) => {
            const unit = charAtMethod.call(value, index);
            if (typeof unit === "number") return unit;
            return String(unit).charCodeAt(0);
        },
    };
};

/** Java String equality over UTF-16 code units, including native strings. */
export const javaStringsEqual = (left: unknown, right: unknown): boolean => {
    if (left === right) return true;
    const leftView = javaCharSequenceView(left);
    const rightView = javaCharSequenceView(right);
    if (leftView !== null && rightView !== null) {
        if (leftView.length !== rightView.length) return false;
        for (let index = 0; index < leftView.length; index += 1) {
            if (leftView.charCodeAt(index) !== rightView.charCodeAt(index)) return false;
        }
        return true;
    }
    return String(left) === String(right);
};

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

/** Compatibility boundary for java.util.logging.Logger, which jree 1.3.0 omits. */
export class JavaSystemLoggerCompat {
    public static readonly Level = { SEVERE: "SEVERE" } as const;
    private readonly name: string;

    private constructor(name: string) {
        this.name = name;
    }

    public static getLogger(name: java.lang.String | string): JavaSystemLoggerCompat {
        return new JavaSystemLoggerCompat(javaStringValue(name));
    }

    public log(level: string, message: unknown, error: unknown): void {
        const prefix = `${level} ${this.name}`;
        if (message === null || message === undefined) {
            console.error(prefix);
        } else {
            console.error(prefix, javaStringValue(message));
        }
        if (error !== null && error !== undefined) {
            const printStackTrace = (error as { printStackTrace?: unknown }).printStackTrace;
            if (typeof printStackTrace === "function") {
                printStackTrace.call(error);
            } else {
                console.error(error);
            }
        }
    }
}

/** Minimal Node-backed replacements for Java standard classes omitted by jree. */
export class JavaDecimalFormatCompat {
    private readonly formatter: Intl.NumberFormat;

    public constructor(pattern: java.lang.String | string) {
        const normalized = javaStringValue(pattern);
        const fractionPattern = normalized.split(".")[1] ?? "";
        const maximumFractionDigits = fractionPattern.length;
        const minimumFractionDigits = (fractionPattern.match(/0/g) ?? []).length;
        this.formatter = new Intl.NumberFormat("en-US", {
            useGrouping: false,
            minimumFractionDigits,
            maximumFractionDigits,
        });
    }

    public format(value: number): java.lang.String {
        return new java.lang.String(this.formatter.format(value));
    }
}

export class JavaRuntimeCompat {
    private static readonly instance = new JavaRuntimeCompat();

    private constructor() {
    }

    public static getRuntime(): JavaRuntimeCompat {
        return JavaRuntimeCompat.instance;
    }

    public totalMemory(): number {
        return process.memoryUsage().heapTotal;
    }

    public freeMemory(): number {
        const usage = process.memoryUsage();
        return Math.max(0, usage.heapTotal - usage.heapUsed);
    }
}

export class JavaStringJoinerCompat {
    private readonly values: string[] = [];
    private readonly delimiter: string;
    private readonly prefix: string;
    private readonly suffix: string;

    public constructor(delimiter: JavaStringInput, prefix: JavaStringInput = "", suffix: JavaStringInput = "") {
        this.delimiter = javaStringValue(delimiter);
        this.prefix = javaStringValue(prefix);
        this.suffix = javaStringValue(suffix);
    }

    public add(value: JavaStringInput): JavaStringJoinerCompat {
        this.values.push(javaStringValue(value));
        return this;
    }

    public toString(): java.lang.String {
        return new java.lang.String(`${this.prefix}${this.values.join(this.delimiter)}${this.suffix}`);
    }
}

/** Java String.hashCode(), applied after crossing a jree/native string boundary. */
export const javaStringHashCode = (value: unknown): number => {
    const view = javaCharSequenceView(value);
    let hash = 0;
    if (view !== null) {
        for (let index = 0; index < view.length; index += 1) {
            hash = Math.imul(31, hash) + view.charCodeAt(index);
        }
        return hash;
    }
    const text = javaStringValue(value);
    for (let index = 0; index < text.length; index += 1) {
        hash = Math.imul(31, hash) + text.charCodeAt(index);
    }
    return hash;
};

/** Java System.identityHashCode(), stable for the lifetime of an object. */
const identityHashCodes = new WeakMap<object, number>();
let nextIdentityHashCode = 1;

export const javaIdentityHashCode = (value: object | null): number => {
    if (value === null) return 0;
    const existing = identityHashCodes.get(value);
    if (existing !== undefined) return existing;
    const assigned = nextIdentityHashCode++;
    identityHashCodes.set(value, assigned);
    return assigned;
};

/** Java System.exit(), mapped to the host process boundary for the Node CLI. */
export const javaSystemExit = (status: number): never => {
    if (typeof process !== "undefined" && typeof process.exit === "function") {
        process.exit(status);
    }
    throw new Error(`Process exit requested with status ${status}`);
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

export const javaValuesEqual = (left: unknown, right: unknown): boolean => {
    if (left === right) return true;
    const leftEquals = (left as { equals?: unknown } | null)?.equals;
    if (typeof leftEquals === "function" && Boolean(leftEquals.call(left, right))) return true;
    const rightEquals = (right as { equals?: unknown } | null)?.equals;
    return typeof rightEquals === "function" && Boolean(rightEquals.call(right, left));
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
