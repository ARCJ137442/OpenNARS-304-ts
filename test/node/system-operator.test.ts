import assert from "node:assert/strict";
import test from "node:test";
import { java } from "../support/legacy-runtime-facade.ts";
import { Term } from "../../src/language/Term.ts";
import { System } from "../../src/operator/misc/System.ts";
import { MissingRuntimeCapabilityError } from "../../src/platform/RuntimeCapabilities.ts";
import { createNodeRuntimeCapabilities } from "../../src/platform/node/SystemCommandCapabilities.ts";

test("System operator executes its Java-compatible shell contract", () => {
    const operator = new System(createNodeRuntimeCapabilities());
    const callFunction = (operator as unknown as Record<string, unknown>)["function"] as
        (memory: unknown, terms: Term[]) => Term;
    const result = callFunction.call(operator, undefined, [
        Term.get(new java.lang.String("printf")),
        Term.get(new java.lang.String("'a\\nb'")),
    ]);

    assert.equal(String(result.name()), "ab");
});

test("System operator exposes the Java range term", () => {
    const operator = new System();
    const getRange = (operator as unknown as Record<string, unknown>)["getRange"] as () => Term;

    assert.equal(String(getRange.call(operator).name()), "system_called");
});

test("System operator reports a missing host capability explicitly", () => {
    const operator = new System();
    const callFunction = (operator as unknown as Record<string, unknown>)["function"] as
        (memory: unknown, terms: Term[]) => Term;

    assert.throws(
        () => callFunction.call(operator, undefined, [Term.get(new java.lang.String("printf"))]),
        (error: unknown) => error instanceof MissingRuntimeCapabilityError
            && error.code === "MISSING_RUNTIME_CAPABILITY"
            && error.capability === "executeSystemCommand",
    );
});

test("System operator preserves Java empty-result behavior when the host command fails", () => {
    const operator = new System({
        executeSystemCommand: () => {
            throw new Error("host command failed");
        },
    });
    const callFunction = (operator as unknown as Record<string, unknown>)["function"] as
        (memory: unknown, terms: Term[]) => Term;

    const result = callFunction.call(operator, undefined, [Term.get(new java.lang.String("failing"))]);
    assert.equal(String(result.name()), "");
});
