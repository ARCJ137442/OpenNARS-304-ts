import assert from "node:assert/strict";

/**
 * Minimal assertion boundary for migrated JUnit-style tests.
 *
 * The overloads preserve the two argument orders used by Java Assert without
 * weakening the values under test to `any`.
 */
export function assertTrue(value: unknown): void;
export function assertTrue(message: string, value: unknown): void;
export function assertTrue(first: unknown, second?: unknown): void {
    const value = second === undefined ? first : second;
    const message = second === undefined ? undefined : String(first);
    assert.ok(value, message);
}

export function assertEquals(expected: unknown, actual: unknown): void;
export function assertEquals(message: string, expected: unknown, actual: unknown): void;
export function assertEquals(first: unknown, second: unknown, third?: unknown): void {
    if (third === undefined) {
        assert.strictEqual(second, first);
        return;
    }
    if (typeof first !== "string") {
        throw new TypeError("JUnit assertEquals message must be a string");
    }
    assert.strictEqual(third, second, first);
}
