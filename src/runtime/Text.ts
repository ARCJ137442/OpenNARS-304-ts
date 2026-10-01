/** Native text types used by the reasoner. */
export type TextString = string;
export type TextInput = string | { toString(): string };
export type TextCharacter = string;
export type ArrayConvertible<T> = { toArray(array?: T[]): T[] };

export const isArrayConvertible = <T>(value: unknown): value is ArrayConvertible<T> =>
    typeof (value as { toArray?: unknown } | null)?.toArray === "function";

export const asText = (value: TextInput): string => String(value);
export const textValue = (value: unknown): string => String(value);
export const textLength = (value: string): number => value.length;
export const textEquals = (left: string, right: string): boolean => left === right;

/** Canonical UTF-16 hash retained for persisted term keys and Java parity. */
export const textHashCode = (value: string): number => {
    let hash = 0;
    for (let index = 0; index < value.length; index += 1) {
        hash = Math.imul(31, hash) + value.charCodeAt(index);
    }
    return hash;
};
