/** Structural Java text contracts; boxed implementations stay at host edges. */
export interface JavaCharSequence {
    length(): number;
    charAt(index: number): number | null;
    subSequence(start: number, end: number): unknown;
    toString(): any;
}

/**
 * Java-shaped string return type kept opaque during the bridge migration.
 * Runtime values are NativeJavaString; `any` preserves legacy translated
 * overloads while callers are moved to native `string` contracts.
 */
export type JavaString = any;

/** Project-owned boxed string used at translated Java-shaped boundaries. */
export class NativeJavaString implements JavaString {
    private hashValue: number | null = null;
    public constructor(private readonly value: string) {}

    public length(): number { return this.value.length; }
    public charAt(index: number): number | null {
        return index < 0 || index >= this.value.length ? null : this.value.charCodeAt(index);
    }
    public subSequence(start: number, end: number): JavaCharSequence {
        return new NativeJavaString(this.value.slice(start, end));
    }
    public toString(): string { return this.value; }
    public toJSON(): object { return {}; }
    public split(separator: string): NativeJavaString[] { return this.value.split(separator).map((value) => new NativeJavaString(value)); }
    public substring(start: number, end?: number): NativeJavaString { return new NativeJavaString(this.value.substring(start, end)); }
    public includes(value: string): boolean { return this.value.includes(value); }
    public indexOf(value: string | NativeJavaString): number { return this.value.indexOf(String(value)); }
    public trim(): NativeJavaString { return new NativeJavaString(this.value.trim()); }
    public equals(other: unknown): boolean { return javaStringValue(this) === javaStringValue(other); }
    public hashCode(): number {
        if (this.hashValue !== null) return this.hashValue;
        let hash = 0;
        for (let index = 0; index < this.value.length; index += 1) hash = Math.imul(31, hash) + this.value.charCodeAt(index);
        this.hashValue = hash;
        return hash;
    }
}

export type JavaStringInput = string | JavaString;
export type JavaCharSequenceInput = string | JavaCharSequence;
export type JavaTextInput = string | JavaCharSequence;
export type JavaChar = string;

export type JavaListInput<T> = {
    toArray(array?: T[]): T[];
};

export const isJavaListInput = <T>(value: unknown): value is JavaListInput<T> =>
    typeof (value as { toArray?: unknown } | null)?.toArray === "function";

export const toJavaString = (value: JavaStringInput): JavaString =>
    typeof value === "string" ? new NativeJavaString(value) : value;

export const javaStringValue = (value: unknown): string => {
    if (value === null || value === undefined || typeof value === "string") return String(value);
    if (value instanceof NativeJavaString) return value.toString();
    const toString = (value as { toString?: unknown }).toString;
    return typeof toString === "function" ? String(toString.call(value)) : String(value);
};

export const javaStringLength = (value: unknown): number => javaStringValue(value).length;

export const javaStringsEqual = (left: unknown, right: unknown): boolean => {
    if (left === right) return true;
    return javaStringValue(left) === javaStringValue(right);
};

export const javaStringHashCode = (value: unknown): number => {
    if (value instanceof NativeJavaString) return value.hashCode();
    const text = javaStringValue(value);
    let hash = 0;
    for (let index = 0; index < text.length; index += 1) hash = Math.imul(31, hash) + text.charCodeAt(index);
    return hash;
};
