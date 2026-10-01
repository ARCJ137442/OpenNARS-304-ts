import { javaValueHashCode } from "./NativeSet.ts";

/**
 * Native Int16Array helpers retaining the canonical indexed value and order
 * semantics without depending on a foreign collection implementation.
 */
export const javaInt16ArrayEquals = (
    left: Int16Array | null | undefined,
    right: Int16Array | null | undefined,
): boolean => {
    if (left === right) {
        return true;
    }
    if (left === null || left === undefined || right === null || right === undefined) {
        return false;
    }
    if (left.length !== right.length) {
        return false;
    }
    for (let i = 0; i < left.length; i += 1) {
        if (left[i] !== right[i]) {
            return false;
        }
    }
    return true;
};

/** Java Arrays.hashCode(short[]) with Java's null-array result of zero. */
export const javaInt16ArrayHashCode = (
    values: Int16Array | null | undefined,
): number => {
    if (values === null || values === undefined) {
        return 0;
    }
    let result = 1;
    for (const value of values) {
        result = (31 * result + value) | 0;
    }
    return result;
};

/** Java Objects.hash(Object...) using the project's Java value hash contract. */
export const javaObjectsHash = (...values: unknown[]): number => {
    let result = 1;
    for (const value of values) {
        result = (31 * result + javaValueHashCode(value)) | 0;
    }
    return result;
};
