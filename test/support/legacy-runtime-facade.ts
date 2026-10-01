import { createNodeLegacyNamespace, Class, JavaObject, NativeJavaString } from "./node-legacy-namespace.ts";
import type { TextString as NativeCharSequence } from "../../src/runtime/Text.ts";
export { Class, JavaObject };
// Host-facing legacy Java objects are exported only through this adapter. Core
// and entry modules must not import npm jree directly.
/** Legacy translated namespace. New code must use native capabilities instead. */
export const java = createNodeLegacyNamespace();
import { textHashCode, textValue } from "../../src/runtime/Text.ts";
import { identityHashCode, runtimeValueEquals } from "../../src/runtime/runtime-numbers.ts";
import { ReasonerRandom as JavaRandom } from "../../src/runtime/ReasonerRandom.ts";
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
} from "./legacy-exceptions.ts";

export type JavaChar = string;
export const javaStringValue = (value: unknown): string => {
    if (value instanceof NativeJavaString) return value.toString();
    if (value === null || value === undefined) return String(value);
    const toString = (value as { toString?: unknown }).toString;
    if (typeof toString === "function" && toString !== Object.prototype.toString) {
        const result = toString.call(value);
        if (result !== value) return javaStringValue(result);
    }
    return textValue(value);
};
export const javaStringLength = (value: unknown): number => javaStringValue(value).length;
export const javaStringHashCode = (value: unknown): number => textHashCode(javaStringValue(value));
export const javaStringsEqual = (left: unknown, right: unknown): boolean => javaStringValue(left) === javaStringValue(right);
export {
    addRuntimeLong,
    addRuntimeLongValues,
    identityHashCode,
    runtimeValueEquals,
    subtractRuntimeLong,
    subtractRuntimeLongValues,
    toRuntimeLong,
} from "../../src/runtime/runtime-numbers.ts";
export type { RuntimeLongInput } from "../../src/runtime/runtime-numbers.ts";
export const javaIdentityHashCode = identityHashCode;
export const javaValuesEqual = runtimeValueEquals;
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
} from "./legacy-exceptions.ts";

/** Text accepted at Node-facing Java string input boundaries. */
export type JavaStringInput = NativeJavaString | string;
export type JavaString = NativeJavaString;
export type JavaCharSequence = NativeCharSequence;

/** Values accepted by the Java Plugin.name() CharSequence boundary. */
export type JavaCharSequenceInput = NativeCharSequence | string;

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
export const toJavaString = (value: JavaStringInput): NativeJavaString =>
    value instanceof NativeJavaString ? value : new NativeJavaString(value);

/**
 * jree 1.3.0 does not ship java.lang.Double. Keep the boxed-number contract
 * at this compatibility boundary instead of replacing translated Java APIs
 * with native numbers at every call site.
 */
export class JavaDoubleCompat extends Number {
    public static readonly POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
    public static readonly NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
    public static readonly NaN = Number.NaN;

    private readonly value: number;

    public constructor(value: number | string | NativeJavaString) {
        super();
        this.value = Number(String(value));
    }

    public static toString(value: number): NativeJavaString {
        return new NativeJavaString(String(value));
    }

    public static valueOf(value: number | string | NativeJavaString): JavaDoubleCompat {
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
    value instanceof JavaThrowable;

export const isJavaException = (value: unknown): value is JavaException =>
    value instanceof JavaException;

/** Compatibility boundary for java.util.logging.Logger, which jree 1.3.0 omits. */
export class JavaSystemLoggerCompat {
    public static readonly Level = { SEVERE: "SEVERE" } as const;
    private readonly name: string;

    private constructor(name: string) {
        this.name = name;
    }

    public static getLogger(name: NativeJavaString | string): JavaSystemLoggerCompat {
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

    public constructor(pattern: NativeJavaString | string) {
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

    public format(value: number): NativeJavaString {
        return new NativeJavaString(this.formatter.format(value));
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

    public toString(): NativeJavaString {
        return new NativeJavaString(`${this.prefix}${this.values.join(this.delimiter)}${this.suffix}`);
    }
}

/** Java System.exit(), mapped to the host process boundary for the Node CLI. */
export const javaSystemExit = (status: number): never => {
    if (typeof process !== "undefined" && typeof process.exit === "function") {
        process.exit(status);
    }
    throw new Error(`Process exit requested with status ${status}`);
};

export type { int, char, short, long, float, double } from "../../src/types.ts";
export {
    closeResourcesCompat as closeResources,
    handleResourceErrorCompat as handleResourceError,
    throwResourceErrorCompat as throwResourceError,
} from "../../src/runtime/ResourceCompat.ts";
export const S = (strings: TemplateStringsArray, ...values: unknown[]): NativeJavaString =>
    new NativeJavaString(strings.reduce((result, text, index) => result + text + (values[index] ?? ""), ""));
