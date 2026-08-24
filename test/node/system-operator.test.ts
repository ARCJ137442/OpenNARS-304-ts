import assert from "node:assert/strict";
import test from "node:test";
import { java } from "jree";
import { Term } from "../../src/language/Term.ts";
import { System } from "../../src/operator/misc/System.ts";

test("System operator executes its Java-compatible shell contract", () => {
    const operator = new System();
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
