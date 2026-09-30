import type { long } from "../types.ts";

export type JavaLongInput = long | number;

const normalizeLongNumber = (value: number): number => {
    if (!Number.isSafeInteger(value)) throw new RangeError(`Java long number must be a safe integer: ${value}`);
    return value;
};

const normalizeLong = (value: JavaLongInput): JavaLongInput =>
    typeof value === "number" ? normalizeLongNumber(value) : value;

export const toRuntimeLong = (value: JavaLongInput): long => normalizeLong(value) as long;

export const addRuntimeLong = (value: JavaLongInput, delta: number): long =>
    addRuntimeLongValues(value, delta);

export const subtractRuntimeLong = (value: JavaLongInput, delta: number): long =>
    subtractRuntimeLongValues(value, delta);

export const addRuntimeLongValues = (left: JavaLongInput, right: JavaLongInput): long => {
    const a = normalizeLong(left);
    const b = normalizeLong(right);
    return (typeof a === "bigint" || typeof b === "bigint"
        ? BigInt(a) + BigInt(b)
        : normalizeLongNumber(a + b)) as long;
};

export const subtractRuntimeLongValues = (left: JavaLongInput, right: JavaLongInput): long => {
    const a = normalizeLong(left);
    const b = normalizeLong(right);
    return (typeof a === "bigint" || typeof b === "bigint"
        ? BigInt(a) - BigInt(b)
        : normalizeLongNumber(a - b)) as long;
};

export const javaValuesEqual = (left: unknown, right: unknown): boolean => {
    if (left === right) return true;
    const leftEquals = (left as { equals?: unknown } | null)?.equals;
    const rightEquals = (right as { equals?: unknown } | null)?.equals;
    // Java value objects normally implement one symmetric equals method. If
    // both operands expose the same function, one dispatch avoids repeating
    // the dynamic lookup while preserving the fallback for asymmetric or
    // heterogeneous translated objects.
    if (typeof leftEquals === "function" && leftEquals === rightEquals
        && (left as { constructor?: unknown } | null)?.constructor
        === (right as { constructor?: unknown } | null)?.constructor) {
        return Boolean(leftEquals.call(left, right));
    }
    if (typeof leftEquals === "function" && Boolean(leftEquals.call(left, right))) return true;
    return typeof rightEquals === "function" && Boolean(rightEquals.call(right, left));
};

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
