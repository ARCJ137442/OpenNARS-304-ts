import type { long } from "../types.ts";

export type RuntimeLongInput = long | number;

const normalizeLongNumber = (value: number): number => {
    if (!Number.isSafeInteger(value)) throw new RangeError(`Runtime long input must be a safe integer: ${value}`);
    return value;
};

const normalizeLong = (value: RuntimeLongInput): RuntimeLongInput =>
    typeof value === "number" ? normalizeLongNumber(value) : value;

export const toRuntimeLong = (value: RuntimeLongInput): long => normalizeLong(value) as long;

export const addRuntimeLong = (value: RuntimeLongInput, delta: number): long =>
    addRuntimeLongValues(value, delta);

export const subtractRuntimeLong = (value: RuntimeLongInput, delta: number): long =>
    subtractRuntimeLongValues(value, delta);

export const addRuntimeLongValues = (left: RuntimeLongInput, right: RuntimeLongInput): long => {
    const a = normalizeLong(left);
    const b = normalizeLong(right);
    return (typeof a === "bigint" || typeof b === "bigint"
        ? BigInt(a) + BigInt(b)
        : normalizeLongNumber(a + b)) as long;
};

export const subtractRuntimeLongValues = (left: RuntimeLongInput, right: RuntimeLongInput): long => {
    const a = normalizeLong(left);
    const b = normalizeLong(right);
    return (typeof a === "bigint" || typeof b === "bigint"
        ? BigInt(a) - BigInt(b)
        : normalizeLongNumber(a - b)) as long;
};

/** Compare values using the project's observable value-equality contract. */
export const runtimeValueEquals = (left: unknown, right: unknown): boolean => {
    if (left === right) return true;
    const leftEquals = (left as { equals?: unknown } | null)?.equals;
    if (typeof leftEquals === "function" && Boolean(leftEquals.call(left, right))) return true;
    const rightEquals = (right as { equals?: unknown } | null)?.equals;
    return typeof rightEquals === "function" && Boolean(rightEquals.call(right, left));
};

const identityHashCodes = new WeakMap<object, number>();
let nextIdentityHashCode = 1;
/** Stable identity hash for objects whose identity participates in ordering. */
export const identityHashCode = (value: object | null): number => {
    if (value === null) return 0;
    const existing = identityHashCodes.get(value);
    if (existing !== undefined) return existing;
    const assigned = nextIdentityHashCode++;
    identityHashCodes.set(value, assigned);
    return assigned;
};
