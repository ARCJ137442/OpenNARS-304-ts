import assert from "node:assert/strict";
import test from "node:test";
import { java, JavaObject } from "../support/legacy-runtime-facade.ts";
import {
    JavaDoubleCompat,
    addRuntimeLong,
    javaIdentityHashCode,
    javaStringHashCode,
    javaStringLength,
    javaStringValue,
    javaStringsEqual,
    toRuntimeLong,
} from "../support/legacy-runtime-facade.ts";
import { ClassToken } from "../../src/runtime/ClassIdentity.ts";
import {
    JavaAssertionError,
    JavaClassNotFoundException,
    JavaError,
    JavaIllegalAccessException,
    JavaThrowable,
} from "../support/legacy-exceptions.ts";

test("javaStringLength normalizes jree and native string representations", () => {
    const boxed = new java.lang.String("abc");
    const built = new java.lang.StringBuilder("abc").toString();

    assert.equal(javaStringLength("abc"), 3);
    assert.equal(javaStringLength(boxed), 3);
    assert.equal(javaStringLength(built), 3);
});

test("project runtime class tokens preserve constructor identity and instance checks", () => {
    class Probe {}
    class Other {}
    const token = ClassToken.fromConstructor(Probe);
    const sameToken = ClassToken.fromConstructor(Probe);
    const otherToken = ClassToken.fromConstructor(Other);

    assert.equal(token, sameToken);
    assert.notEqual(token, otherToken);
    assert.equal(token.getName(), "Probe");
    assert.equal(token.getSimpleName(), "Probe");
    assert.equal(token.isInstance(new Probe()), true);
    assert.equal(token.isInstance(new Other()), false);
    assert.equal(token.equals(sameToken), true);
    assert.equal(token.equals(otherToken), false);
});

test("runtime RuntimeLong boundaries reject unsafe numbers before arithmetic", () => {
    assert.equal(toRuntimeLong(42), 42);
    assert.equal(addRuntimeLong(42, 8), 50);
    assert.equal(addRuntimeLong(42n, 8), 50n);
    assert.throws(() => toRuntimeLong(Number.MAX_SAFE_INTEGER + 1), RangeError);
    assert.throws(() => addRuntimeLong(Number.MAX_SAFE_INTEGER, 1), RangeError);
});

test("javaStringValue applies Java toString before JS interpolation", () => {
    const value = new java.lang.StringBuilder("abc");

    assert.equal(javaStringValue(value), "abc");
});

test("Java string equality and hashing use exact UTF-16 code units", () => {
    const first = new java.lang.String("A💡");
    const same = new java.lang.String("A💡");
    const differentCase = new java.lang.String("a💡");
    let expected = 0;
    const expectedText = "A💡";
    for (let index = 0; index < expectedText.length; index += 1) {
        expected = Math.imul(31, expected) + expectedText.charCodeAt(index);
    }

    assert.equal(javaStringsEqual(first, same), true);
    assert.equal(javaStringsEqual(first, differentCase), false);
    assert.equal(javaStringsEqual(first, "A💡"), true);
    assert.equal(javaStringHashCode(first), expected);
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

    assert.ok(assertion instanceof Error);
    assert.ok(assertion instanceof JavaError);
    assert.ok(assertion instanceof JavaThrowable);
    assert.ok(access instanceof java.lang.Exception);
    assert.ok(missing instanceof java.lang.Exception);
    assert.equal(assertion.getMessage(), "invariant");
    assert.equal(access.getMessage(), "access");
    assert.equal(missing.getMessage(), "missing");
});

test("native object class identity does not require a legacy FQN marker", () => {
    const javaObjectConstructor = JavaObject as unknown as Record<string, unknown>;
    assert.equal(javaObjectConstructor["#fqn"], undefined);

    class Probe extends JavaObject {}
    const probe = new Probe();
    assert.equal("#fqn" in Probe, false);
    assert.equal(probe.getClass().getName(), "Probe");
    assert.equal(probe.getClass().getSimpleName(), "Probe");
});
