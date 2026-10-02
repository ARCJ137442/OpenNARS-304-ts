import assert from "node:assert/strict";
import test from "node:test";

import {
    closeResources,
    handleResourceError,
    throwResourceError,
} from "../../src/runtime/ResourceErrors.ts";
import { ResourceError } from "../../src/runtime/ResourceErrors.ts";

test("resource helpers close in reverse order and preserve suppressed failures", () => {
    const closed: string[] = [];
    const first = {
        close(): void {
            closed.push("first");
            throw new Error("first close");
        },
    };
    const second = {
        close(): void {
            closed.push("second");
            throw new Error("second close");
        },
    };

    const error = closeResources([first, second]);

    assert.deepEqual(closed, ["second", "first"]);
    assert.ok(error instanceof ResourceError);
    assert.equal(error?.getMessage(), "second close");
    assert.equal(error?.getSuppressed().length, 1);
    assert.equal(error?.getSuppressed()[0]?.message, "first close");
});

test("resource helpers attach close failures to the primary error and rethrow", () => {
    const primary = new Error("read failure");
    const closeError = new ResourceError("close failure");
    const combined = handleResourceError(primary, closeError);

    assert.equal(combined.getMessage(), "read failure");
    assert.equal(combined.getSuppressed().length, 1);
    assert.equal(combined.getSuppressed()[0], closeError);
    assert.throws(() => throwResourceError(combined), (error: unknown) => error === combined);
});
