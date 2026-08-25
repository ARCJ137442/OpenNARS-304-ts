import assert from "node:assert/strict";
import test from "node:test";
import { java, JavaObject } from "jree";
import {
    JavaAssertionError,
    JavaClassNotFoundException,
    JavaDoubleCompat,
    JavaIllegalAccessException,
    javaIdentityHashCode,
    javaStringLength,
    javaStringValue,
} from "../../src/runtime/jree-compat.ts";

test("javaStringLength normalizes jree and native string representations", () => {
    const boxed = new java.lang.String("abc");
    const built = new java.lang.StringBuilder("abc").toString();

    assert.equal(javaStringLength("abc"), 3);
    assert.equal(javaStringLength(boxed), 3);
    assert.equal(javaStringLength(built), 3);
});

test("javaStringValue applies Java toString before JS interpolation", () => {
    const value = new java.lang.StringBuilder("abc");

    assert.equal(javaStringValue(value), "abc");
});

test("jree Double compatibility preserves boxed numeric operations", () => {
    const value = JavaDoubleCompat.valueOf("1.5");

    assert.equal(value.doubleValue(), 1.5);
    assert.equal(value.floatValue(), Math.fround(1.5));
    assert.equal(String(JavaDoubleCompat.toString(value.doubleValue())), "1.5");
    assert.equal(JavaDoubleCompat.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
});

test("identity hash compatibility is stable and distinguishes object identity", () => {
    const first = {};
    const second = {};

    assert.equal(javaIdentityHashCode(null), 0);
    assert.equal(javaIdentityHashCode(first), javaIdentityHashCode(first));
    assert.notEqual(javaIdentityHashCode(first), javaIdentityHashCode(second));
});

test("missing jree exception compatibility preserves Java inheritance", () => {
    const assertion = new JavaAssertionError("invariant");
    const access = new JavaIllegalAccessException("access");
    const missing = new JavaClassNotFoundException("missing");

    assert.ok(assertion instanceof java.lang.Error);
    assert.ok(access instanceof java.lang.Exception);
    assert.ok(missing instanceof java.lang.Exception);
    assert.equal(assertion.getMessage(), "invariant");
    assert.equal(access.getMessage(), "access");
    assert.equal(missing.getMessage(), "missing");
});

test("jree object FQN marker is inherited without changing class identity", () => {
    const javaObjectConstructor = JavaObject as unknown as Record<string, unknown>;
    assert.equal(javaObjectConstructor["#fqn"], true);

    class Probe extends JavaObject {}
    const probe = new Probe();
    assert.equal("#fqn" in Probe, true);
    assert.equal(probe.getClass().getName(), "Probe");
    assert.equal(probe.getClass().getSimpleName(), "Probe");
});
