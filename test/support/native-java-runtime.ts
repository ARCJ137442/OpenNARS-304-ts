import { NativeList } from "../../src/runtime/NativeList.ts";
import { NativeMap } from "../../src/runtime/NativeMap.ts";
import { NativeSet } from "../../src/runtime/NativeSet.ts";
import { textHashCode } from "../../src/runtime/Text.ts";
import {
    JavaError,
    JavaException,
    JavaIllegalArgumentException,
    JavaIllegalStateException,
    JavaNumberFormatException,
    JavaNoSuchElementException,
    JavaUnsupportedOperationException,
    JavaRuntimeException,
    JavaThrowable,
} from "./legacy-exceptions.ts";
import { ReasonerRandom as JavaRandom } from "../../src/runtime/ReasonerRandom.ts";
import type { ClassKey } from "../../src/runtime/ClassIdentity.ts";

export class NativeJavaString {
    public constructor(private readonly value: string) {}
    public length(): number { return this.value.length; }
    public charAt(index: number): number | null { return index < 0 || index >= this.value.length ? null : this.value.charCodeAt(index); }
    public subSequence(start: number, end: number): NativeJavaString { return new NativeJavaString(this.value.slice(start, end)); }
    public substring(start: number, end?: number): NativeJavaString { return new NativeJavaString(this.value.substring(start, end)); }
    public split(separator: string): NativeJavaString[] { return this.value.split(separator).map(value => new NativeJavaString(value)); }
    public trim(): NativeJavaString { return new NativeJavaString(this.value.trim()); }
    public indexOf(value: string | NativeJavaString): number { return this.value.indexOf(String(value)); }
    public toString(): string { return this.value; }
    public hashCode(): number { return textHashCode(this.value); }
    public equals(other: unknown): boolean {
        if (other instanceof NativeJavaString) return other.value === this.value;
        if (other === null || other === undefined) return false;
        const toString = (other as { toString?: unknown }).toString;
        return typeof toString === "function" && String(toString.call(other)) === this.value;
    }
}

type Constructor<T> = new (...args: never[]) => T;

class NativeNumber extends Number {
    public constructor(value: number | string | NativeJavaString = 0) { super(Number(String(value))); }
    public doubleValue(): number { return Number(this.valueOf()); }
    public floatValue(): number { return Math.fround(this.doubleValue()); }
    public intValue(): number { return Math.trunc(this.doubleValue()); }
    public longValue(): bigint { return BigInt(this.intValue()); }
}

class NativeInteger extends NativeNumber {
    public static valueOf(value: number | string | NativeJavaString): NativeInteger { return new NativeInteger(value); }
    public static parseInt(value: string | NativeJavaString, radix = 10): number { return Number.parseInt(String(value), radix); }
}

class NativeLong extends NativeNumber {
    public static valueOf(value: number | string | bigint | NativeJavaString): NativeLong { return new NativeLong(Number(value)); }
    public static parseLong(value: string | NativeJavaString, radix = 10): bigint { return BigInt(Number.parseInt(String(value), radix)); }
}

class NativeFloat extends NativeNumber {
    public static valueOf(value: number | string | NativeJavaString): NativeFloat { return new NativeFloat(value); }
    public static parseFloat(value: string | NativeJavaString): number { return Number.parseFloat(String(value)); }
}

class NativeDouble extends NativeNumber {
    public static readonly POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
    public static readonly NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
    public static readonly NaN = Number.NaN;
    public static valueOf(value: number | string | NativeJavaString): NativeDouble { return new NativeDouble(value); }
    public static parseDouble(value: string | NativeJavaString): number { return Number.parseFloat(String(value)); }
}

class NativeBoolean {
    public constructor(public readonly value: boolean) {}
    public valueOf(): boolean { return this.value; }
    public toString(): string { return String(this.value); }
    public static parseBoolean(value: string | NativeJavaString): boolean { return String(value).toLowerCase() === "true"; }
    public static valueOf(value: boolean): NativeBoolean { return new NativeBoolean(value); }
}

class NativeStringBuilder {
    private value: string;
    public constructor(initial = "") { this.value = String(initial); }
    public append(value: unknown): this { this.value += String(value); return this; }
    public setLength(length: number): void { this.value = this.value.slice(0, length); }
    public toString(): NativeJavaString { return new NativeJavaString(this.value); }
}

class NativeClass {
    public static fromConstructor<T>(owner: Constructor<T>): ClassKey<T> {
        return owner as unknown as ClassKey<T>;
    }
}

class NativeObject {
    public static get class(): ClassKey<NativeObject> { return NativeClass.fromConstructor(this as never); }
    public getClass(): ClassKey<NativeObject> { return NativeClass.fromConstructor(this.constructor as never); }
    public hashCode(): number { return 0; }
    public equals(other: unknown): boolean { return other === this; }
    public toString(): string { return this.constructor.name; }
}

export type NativeJavaFacade = {
    lang: Record<string, unknown>;
    util: Record<string, unknown>;
};

type LegacyCollection<T> = Iterable<T> & {
    size(): number;
    add(value: T): boolean;
    addAll(values: Iterable<T>): boolean;
    contains(value: T): boolean;
    clear(): void;
};

type LegacyList<T> = LegacyCollection<T> & {
    get(index: number): T;
    remove(index: number): T;
    toArray(): T[];
};

type LegacySet<T> = LegacyCollection<T> & { remove(value: T): boolean; toArray(): T[] };

type LegacyMap<K, V> = {
    size(): number;
    isEmpty(): boolean;
    clear(): void;
    get(key: K): V | null;
    getOrDefault(key: K, fallback: V): V;
    put(key: K, value: V): V | null;
    remove(key: K): V | null;
    containsKey(key: K): boolean;
    keySet(): LegacySet<K>;
    values(): LegacyCollection<V>;
    entrySet(): LegacySet<{ getKey(): K; getValue(): V; setValue(value: V): V }>;
};

export type NativeJavaNamespace = NativeJavaFacade & {
    lang: any;
    util: Record<string, unknown> & {
        LinkedHashMap: new <K, V>(...args: unknown[]) => LegacyMap<K, V>;
        HashMap: new <K, V>(...args: unknown[]) => LegacyMap<K, V>;
        ArrayList: new <T>(...args: unknown[]) => LegacyList<T>;
        LinkedList: new <T>(...args: unknown[]) => LegacyList<T>;
        LinkedHashSet: new <T>(...args: unknown[]) => LegacySet<T>;
        HashSet: new <T>(...args: unknown[]) => LegacySet<T>;
        Random: new (seed?: bigint | number) => JavaRandom;
        Arrays: any;
        NoSuchElementException: any;
        UnsupportedOperationException: any;
        concurrent: any;
    };
    io: any;
    net: any;
    nio: any;
};

/** Build the platform-neutral portion of the translated Java namespace. */
export function createNativeJavaFacade(): NativeJavaFacade {
    return {
        lang: {
            Object: NativeObject,
            String: NativeJavaString,
            CharSequence: NativeJavaString,
            Number: NativeNumber,
            Integer: NativeInteger,
            Long: NativeLong,
            Float: NativeFloat,
            Double: NativeDouble,
            Boolean: NativeBoolean,
            StringBuilder: NativeStringBuilder,
            Throwable: JavaThrowable,
            Error: JavaError,
            Exception: JavaException,
            RuntimeException: JavaRuntimeException,
            IllegalArgumentException: JavaIllegalArgumentException,
            IllegalStateException: JavaIllegalStateException,
            NumberFormatException: JavaNumberFormatException,
            NoSuchElementException: JavaNoSuchElementException,
            UnsupportedOperationException: JavaUnsupportedOperationException,
            Math,
            System: {
                out: { println: (value: unknown): void => console.log(String(value)), print: (value: unknown): void => console.log(String(value)) },
                err: { println: (value: unknown): void => console.error(String(value)), print: (value: unknown): void => console.error(String(value)) },
                currentTimeMillis: (): bigint => BigInt(Date.now()),
                lineSeparator: (): NativeJavaString => new NativeJavaString("\n"),
                identityHashCode: (value: object): number => textHashCode(String(value)),
            },
        },
        util: {
            Random: JavaRandom,
            ArrayList: NativeList,
            LinkedList: NativeList,
            LinkedHashSet: NativeSet,
            HashSet: NativeSet,
            HashMap: NativeMap,
            LinkedHashMap: NativeMap,
            Collections: { emptyList: (): unknown[] => [], emptySet: (): NativeSet<unknown> => new NativeSet(), unmodifiableList: (value: unknown): unknown => value },
            UUID: { randomUUID: (): { toString(): string } => ({ toString: () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}` }) },
            NoSuchElementException: JavaNoSuchElementException,
            UnsupportedOperationException: JavaUnsupportedOperationException,
            Arrays: { hashCode: (values: unknown[]): number => values.reduce<number>((hash, value) => Math.imul(31, hash) + Number(value), 1) },
        },
    };
}

export { NativeClass as Class, NativeObject as JavaObject };
export type JavaStringInput = NativeJavaString | string;
export const toJavaString = (value: JavaStringInput): NativeJavaString =>
    value instanceof NativeJavaString ? value : new NativeJavaString(value);
export const isJavaThrowable = (value: unknown): value is JavaThrowable => value instanceof JavaThrowable;
export const isJavaException = (value: unknown): value is JavaException => value instanceof JavaException;
