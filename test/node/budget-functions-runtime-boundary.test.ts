import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { JavaIllegalStateException } from "../support/legacy-exceptions.ts";
import { BudgetFunctions } from "../../src/inference/BudgetFunctions.ts";

test("BudgetFunctions keeps project-owned enum and exception boundaries", () => {
    const source = readFileSync("src/inference/BudgetFunctions.ts", "utf8");
    assert.doesNotMatch(source, /from ["']jree["']/);
    assert.equal(BudgetFunctions.Activating.Max.name(), "Max");
    assert.equal(BudgetFunctions.Activating.Max.ordinal(), 0);
    assert.equal(String(BudgetFunctions.Activating.TaskLink), "TaskLink");
    assert.notEqual(BudgetFunctions.Activating.Max, BudgetFunctions.Activating.TaskLink);
    assert.throws(
        () => (BudgetFunctions as unknown as { solutionEval: (...args: unknown[]) => unknown }).solutionEval(),
        (error: unknown) => error instanceof JavaIllegalStateException,
    );
});
