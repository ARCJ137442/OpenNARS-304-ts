import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { JavaIllegalArgumentException } from "../support/legacy-exceptions.ts";
import { TruthFunctions } from "../../src/inference/TruthFunctions.ts";

test("TruthFunctions keeps project-owned enum and exception boundaries", () => {
    const source = readFileSync("src/inference/TruthFunctions.ts", "utf8");
    assert.doesNotMatch(source, /from ["']jree["']/);
    assert.equal(TruthFunctions.EnumType.DEDUCTION.name(), "DEDUCTION");
    assert.equal(TruthFunctions.EnumType.DEDUCTION.ordinal(), 7);
    assert.equal(String(TruthFunctions.EnumType.COMPARISON), "COMPARISON");
    assert.notEqual(TruthFunctions.EnumType.DEDUCTION, TruthFunctions.EnumType.ABDUCTION);
    assert.throws(
        () => (TruthFunctions.lookupTruthFunctionAndCompute as (...args: unknown[]) => unknown)(),
        (error: unknown) => error instanceof JavaIllegalArgumentException,
    );
});
