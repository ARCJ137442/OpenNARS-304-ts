import assert from "node:assert/strict";
import test from "node:test";
import { java, JavaObject } from "../../src/platform/node/legacy-runtime-facade.ts";
import { javaStringValue } from "../../src/platform/node/legacy-runtime-facade.ts";
import { runSerialParameterized } from "../util/serial-parameterized-runner.ts";

test("serial parameterized runner continues after a case failure", () => {
    const parameters = new java.util.ArrayList<JavaObject[]>();
    parameters.add([new java.lang.String("first")]);
    parameters.add([new java.lang.String("second")]);
    parameters.add([new java.lang.String("third")]);

    const executed: string[] = [];
    const failures: string[] = [];
    runSerialParameterized(parameters, argumentsForTest => {
        const name = javaStringValue(argumentsForTest[0] as java.lang.String);
        executed.push(name);
        if (name === "second")
            throw new Error("expected test failure");
    }, argumentsForTest => {
        failures.push(javaStringValue(argumentsForTest[0] as java.lang.String));
    });

    assert.deepEqual(executed, ["first", "second", "third"]);
    assert.deepEqual(failures, ["second"]);
});
