import assert from "node:assert/strict";
import test from "node:test";
import { javaValuesEqual } from "../../src/runtime/java-values.ts";

test("javaValuesEqual rejects unequal hashes before invoking equals", () => {
    let equalsCalls = 0;
    const left = { hashCode: () => 1, equals: () => { equalsCalls += 1; return true; } };
    const right = { hashCode: () => 2, equals: () => { equalsCalls += 1; return true; } };
    assert.equal(javaValuesEqual(left, right), false);
    assert.equal(equalsCalls, 0);
});

test("javaValuesEqual preserves receiver order when hashes agree", () => {
    const calls: string[] = [];
    const left = { hashCode: () => 1, equals: () => { calls.push("left"); return false; } };
    const right = { hashCode: () => 1, equals: () => { calls.push("right"); return true; } };
    assert.equal(javaValuesEqual(left, right), true);
    assert.deepEqual(calls, ["left", "right"]);
});
