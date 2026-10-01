import assert from "node:assert/strict";
import test from "node:test";

import {
    JavaAssertionError,
    JavaClassNotFoundException,
    JavaError,
    JavaException,
    JavaIllegalArgumentException,
    JavaIllegalStateException,
    JavaNullPointerException,
    JavaRuntimeException,
    JavaThrowable,
} from "../support/legacy-exceptions.ts";
import { java } from "../support/legacy-runtime-facade.ts";
import { isJavaException, isJavaThrowable } from "../support/legacy-runtime-facade.ts";

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
    const error = new JavaIllegalArgumentException("bad argument");

    assert.ok(error instanceof JavaException);
    assert.ok(error instanceof JavaRuntimeException);
    assert.equal(error.getMessage(), "bad argument");
    assert.equal(error.toString(), "JavaIllegalArgumentException: bad argument");
    assert.ok(error instanceof java.lang.Throwable);
    assert.ok(error instanceof java.lang.Exception);
    assert.ok(error instanceof java.lang.RuntimeException);
    assert.ok(error instanceof java.lang.IllegalArgumentException);
    assert.ok(isJavaException(error));
    assert.ok(isJavaThrowable(error));
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

test("native Java throwable distinguishes uninitialized and explicit-null causes", () => {
    const defaultCause = new JavaThrowable();
    assert.equal(defaultCause.getCause(), null);
    defaultCause.initCause(null);
    assert.throws(() => defaultCause.initCause(new Error("late")), JavaIllegalStateException);

    const explicitNull = new JavaThrowable("already initialized", null);
    assert.equal(explicitNull.getCause(), null);
    assert.throws(() => explicitNull.initCause(new Error("late")), JavaIllegalStateException);
});

test("native Java throwable protects suppressed state and returns a snapshot", () => {
    const error = new JavaThrowable("primary");
    const suppressed = new JavaIllegalStateException("suppressed");

    error.addSuppressed(suppressed);
    const snapshot = error.getSuppressed();
    assert.deepEqual(snapshot, [suppressed]);
    (snapshot as JavaThrowable[]).length = 0;
    assert.deepEqual(error.getSuppressed(), [suppressed]);
    assert.throws(() => error.addSuppressed(error), JavaIllegalArgumentException);
    assert.throws(() => error.addSuppressed(null as unknown as JavaThrowable), JavaNullPointerException);
});

test("native Java exception compatibility preserves old jree instanceof checks", () => {
    const state = new JavaIllegalStateException("state");
    const missing = new JavaClassNotFoundException("missing");

    assert.ok(state instanceof java.lang.IllegalStateException);
    assert.ok(state instanceof java.lang.RuntimeException);
    assert.ok(missing instanceof java.lang.Exception);
    assert.ok(missing instanceof java.lang.Throwable);
    assert.ok(isJavaException(state));
    assert.ok(isJavaThrowable(missing));
    assert.equal(state.getMessage(), "state");
    assert.equal(missing.getMessage(), "missing");
});
