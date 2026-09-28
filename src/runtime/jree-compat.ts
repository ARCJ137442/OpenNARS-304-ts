import { Class, JavaObject, java } from "jree";
// Host-facing legacy Java objects are exported only through this adapter. Core
// and entry modules must not import npm jree directly.
export { java } from "jree";
import type { long } from "../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import { JavaRandom } from "./JavaRandom.ts";
import {
    JavaAssertionError,
    JavaClassNotFoundException,
    JavaError,
    JavaException,
    JavaIllegalAccessError,
    JavaIllegalAccessException,
    JavaIllegalArgumentException,
    JavaIllegalStateException,
    JavaInstantiationException,
    JavaInvocationTargetException,
    JavaNoSuchMethodException,
    JavaNumberFormatException,
    JavaNoSuchElementException,
    JavaParseException,
    JavaParserConfigurationException,
    JavaRuntimeException,
    JavaUnsupportedOperationException,
    JavaSAXException,
    JavaThrowable,
} from "./JavaExceptions.ts";
export {
    JavaAssertionError,
    JavaClassNotFoundException,
    JavaIllegalAccessError,
    JavaIllegalAccessException,
    JavaIllegalArgumentException,
    JavaIllegalStateException,
    JavaInstantiationException,
    JavaInvocationTargetException,
    JavaNoSuchMethodException,
    JavaNumberFormatException,
    JavaNoSuchElementException,
    JavaParseException,
    JavaParserConfigurationException,
    JavaSAXException,
    JavaUnsupportedOperationException,
} from "./JavaExceptions.ts";

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
export type JavaString = java.lang.String;
export type JavaCharSequence = java.lang.CharSequence;

/** Values accepted by the Java Plugin.name() CharSequence boundary. */
export type JavaCharSequenceInput = java.lang.CharSequence | string;

/**
 * Structural view of the original Java `java.util.List<T>` input contract.
 * The translated core only needs the Java `toArray` operation at this
 * boundary; callers may still pass a real jree List without exposing jree's
 * type namespace from every consumer.
 */
export type JavaListInput<T> = {
    toArray(array?: T[]): T[];
};

export const isJavaListInput = <T>(value: unknown): value is JavaListInput<T> =>
    typeof (value as { toArray?: unknown } | null)?.toArray === "function";

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

const normalizeLongNumber = (value: number): number => {
    if (!Number.isSafeInteger(value)) {
        throw new RangeError(`Java long number must be a safe integer: ${value}`);
    }
    return value;
};

const normalizeLongInput = (value: JavaLongInput): JavaLongInput =>
    typeof value === "number" ? normalizeLongNumber(value) : value;

const normalizeLongDelta = (delta: number): number => normalizeLongNumber(delta);

export const toRuntimeLong = (value: JavaLongInput): long => normalizeLongInput(value) as long;

export const addRuntimeLong = (value: JavaLongInput, delta: number): long => {
    const normalized = normalizeLongInput(value);
    const safeDelta = normalizeLongDelta(delta);
    return (typeof normalized === "bigint"
        ? normalized + BigInt(safeDelta)
        : normalizeLongNumber(normalized + safeDelta)) as long;
};

export const subtractRuntimeLong = (value: JavaLongInput, delta: number): long => {
    const normalized = normalizeLongInput(value);
    const safeDelta = normalizeLongDelta(delta);
    return (typeof normalized === "bigint"
        ? normalized - BigInt(safeDelta)
        : normalizeLongNumber(normalized - safeDelta)) as long;
};

/** Add two Java long values while preserving the active runtime representation. */
export const addRuntimeLongValues = (left: JavaLongInput, right: JavaLongInput): long => {
    const normalizedLeft = normalizeLongInput(left);
    const normalizedRight = normalizeLongInput(right);
    return (typeof normalizedLeft === "bigint" || typeof normalizedRight === "bigint"
        ? BigInt(normalizedLeft) + BigInt(normalizedRight)
        : normalizeLongNumber(normalizedLeft + normalizedRight)) as long;
};

/** Subtract two Java long values while preserving the active runtime representation. */
export const subtractRuntimeLongValues = (left: JavaLongInput, right: JavaLongInput): long => {
    const normalizedLeft = normalizeLongInput(left);
    const normalizedRight = normalizeLongInput(right);
    return (typeof normalizedLeft === "bigint" || typeof normalizedRight === "bigint"
        ? BigInt(normalizedLeft) - BigInt(normalizedRight)
        : normalizeLongNumber(normalizedLeft - normalizedRight)) as long;
};

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

/**
 * Keep the old jree instanceof observations while the compatibility bridge
 * still exists.  The native exception hierarchy remains jree-free; these
 * predicates are only a temporary adapter for translated catch sites.
 */
type JavaConstructor = Function & {
    [Symbol.hasInstance]?: (value: unknown) => boolean;
};

const registerJreeInstanceof = (
    constructor: unknown,
    predicate: (value: unknown) => boolean,
): void => {
    if (typeof constructor !== "function") return;
    const target = constructor as JavaConstructor;
    const original = target[Symbol.hasInstance];
    Object.defineProperty(target, Symbol.hasInstance, {
        configurable: true,
        value(value: unknown): boolean {
            return predicate(value) || (original?.call(target, value) ?? false);
        },
    });
};

registerJreeInstanceof(java.lang.Throwable, value => value instanceof JavaThrowable);
registerJreeInstanceof(java.lang.Error, value => value instanceof JavaError);
registerJreeInstanceof(java.lang.Exception, value => value instanceof JavaException);
registerJreeInstanceof(java.lang.RuntimeException, value => value instanceof JavaRuntimeException);
registerJreeInstanceof(java.lang.IllegalArgumentException,
    value => value instanceof JavaIllegalArgumentException);
registerJreeInstanceof(java.lang.IllegalStateException,
    value => value instanceof JavaIllegalStateException);
registerJreeInstanceof(java.util.NoSuchElementException,
    value => value instanceof JavaNoSuchElementException);
registerJreeInstanceof(java.lang.UnsupportedOperationException,
    value => value instanceof JavaUnsupportedOperationException);

/**
 * Temporary exception observation boundary.
 *
 * Native exceptions are the target contract.  The legacy branch is retained
 * until every translated producer has left jree, because jree can still
 * create exceptions from untouched compatibility APIs.
 */
export const isJavaThrowable = (value: unknown): value is JavaThrowable =>
    value instanceof JavaThrowable || value instanceof java.lang.Throwable;

export const isJavaException = (value: unknown): value is JavaException =>
    value instanceof JavaException || value instanceof java.lang.Exception;

/** jree declares primitive char as a number, while translated Narsese uses string code units at runtime. */
export type JavaChar = string;

/**
 * Java string concatenation can produce either a jree JavaString or a native
 * JavaScript string after migration. Both use UTF-16 code units for length.
 */
export const javaStringLength = (value: unknown): number =>
    javaCharSequenceView(value)?.length ?? javaStringValue(value).length;

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

// Keep a thin jree adapter until J2-J4 move their Random constructor types to
// the project-owned implementation. The state machine itself lives in
// JavaRandom so there is one source of Java's 48-bit semantics.
type RandomCompat = {
    next?: (bits: number) => number;
    nextInt?: (bound?: number) => number;
    nextFloat?: () => number;
    nextDouble?: () => number;
    setSeed?: (seed: bigint | number) => void;
};

const randomPrototype = java.util.Random.prototype as unknown as RandomCompat;
const randomInstances = new WeakMap<object, JavaRandom>();
const randomInstance = (random: object): JavaRandom => {
    const existing = randomInstances.get(random);
    if (existing !== undefined) return existing;
    const created = new JavaRandom(0n);
    randomInstances.set(random, created);
    return created;
};

if (randomPrototype.next && randomPrototype.nextInt && randomPrototype.nextDouble && randomPrototype.setSeed) {
    randomPrototype.setSeed = function setSeed(seed: bigint | number): void {
        randomInstance(this as unknown as object).setSeed(seed);
    };
    randomPrototype.next = function next(bits: number): number {
        return randomInstance(this as unknown as object).next(bits);
    };
    randomPrototype.nextInt = function nextInt(bound?: number): number {
        return randomInstance(this as unknown as object).nextInt(bound);
    };
    randomPrototype.nextFloat = function nextFloat(): number {
        return randomInstance(this as unknown as object).nextFloat();
    };
    randomPrototype.nextDouble = function nextDouble(): number {
        return randomInstance(this as unknown as object).nextDouble();
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
