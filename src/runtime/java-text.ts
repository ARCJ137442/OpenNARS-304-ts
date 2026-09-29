/** Structural Java text contracts; boxed implementations stay at host edges. */
export interface JavaCharSequence {
    length(): number;
    charAt(index: number): number | null;
    subSequence(start: number, end: number): unknown;
    toString(): unknown;
}

export interface JavaString extends JavaCharSequence {
    equals(other: unknown): boolean;
    hashCode(): number;
}

export type JavaStringInput = string | JavaString;
export type JavaCharSequenceInput = string | JavaCharSequence;
export type JavaTextInput = string | JavaCharSequence;
export type JavaChar = string;

export const javaStringValue = (value: unknown): string => {
    if (value === null || value === undefined || typeof value === "string") return String(value);
    const toString = (value as { toString?: unknown }).toString;
    return typeof toString === "function" ? String(toString.call(value)) : String(value);
};

export const javaStringLength = (value: unknown): number => javaStringValue(value).length;

export const javaStringsEqual = (left: unknown, right: unknown): boolean => {
    if (left === right) return true;
    return javaStringValue(left) === javaStringValue(right);
};

export const javaStringHashCode = (value: unknown): number => {
    const text = javaStringValue(value);
    let hash = 0;
    for (let index = 0; index < text.length; index += 1) hash = Math.imul(31, hash) + text.charCodeAt(index);
    return hash;
};
