import { Class, JavaObject, java } from "../platform/node/native-host-adapter.ts";
export { Class, JavaObject };
// Host-facing legacy Java objects are exported only through this adapter. Core
// and entry modules must not import npm jree directly.
export { java } from "../platform/node/native-host-adapter.ts";
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

export const javaValuesEqual = (left: unknown, right: unknown): boolean => {
    if (left === right) return true;
    const leftEquals = (left as { equals?: unknown } | null)?.equals;
    const rightEquals = (right as { equals?: unknown } | null)?.equals;
    if (typeof leftEquals === "function" && leftEquals === rightEquals
        && (left as { constructor?: unknown } | null)?.constructor
        === (right as { constructor?: unknown } | null)?.constructor) {
        return Boolean(leftEquals.call(left, right));
    }
    if (typeof leftEquals === "function" && Boolean(leftEquals.call(left, right))) return true;
    return typeof rightEquals === "function" && Boolean(rightEquals.call(right, left));
};

export type { int, char, short, long, float, double } from "../types.ts";
export {
    closeResourcesCompat as closeResources,
    handleResourceErrorCompat as handleResourceError,
    throwResourceErrorCompat as throwResourceError,
} from "./ResourceCompat.ts";
export const S = (strings: TemplateStringsArray, ...values: unknown[]): java.lang.String =>
    new java.lang.String(strings.reduce((result, text, index) => result + text + (values[index] ?? ""), ""));
