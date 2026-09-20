import assert from "node:assert/strict";
import test from "node:test";

import {
    JavaAssertionError,
    JavaError,
    JavaException,
    JavaRuntimeException,
    JavaThrowable,
} from "../../src/runtime/JavaExceptions.ts";

test("native Java throwable hierarchy preserves type and message contracts", () => {
    const cause = new Error("cause");
    const error = new JavaAssertionError("invariant", cause);

    assert.ok(error instanceof Error);
    assert.ok(error instanceof JavaThrowable);
    assert.ok(error instanceof JavaError);
    assert.equal(error.getMessage(), "invariant");
    assert.equal(error.getLocalizedMessage(), "invariant");
    assert.equal(error.getCause(), cause);
    assert.equal(error.name, "JavaAssertionError");
});

test("native Java exception layers retain Java-shaped subclassing", () => {
    class NativeIllegalArgumentException extends JavaRuntimeException {}
    const error = new NativeIllegalArgumentException("bad argument");

    assert.ok(error instanceof JavaException);
    assert.ok(error instanceof JavaRuntimeException);
    assert.equal(error.getMessage(), "bad argument");
    assert.equal(error.toString(), "NativeIllegalArgumentException: bad argument");
});

test("native Java throwable supports Java-style cause and message updates", () => {
    const error = new JavaThrowable();
    const cause = new Error("later");

    assert.equal(error.getMessage(), null);
    error.initCause(cause).setMessage("updated");
    assert.equal(error.getMessage(), "updated");
    assert.equal(error.getCause(), cause);
    assert.equal(error.message, "updated");
});
