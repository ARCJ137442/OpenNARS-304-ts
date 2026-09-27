import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { JavaIllegalArgumentException } from "../../src/runtime/JavaExceptions.ts";
import { TemporalRules } from "../../src/inference/TemporalRules.ts";

test("TemporalRules uses project exception boundaries", () => {
    const source = readFileSync("src/inference/TemporalRules.ts", "utf8");
    assert.doesNotMatch(source, /from ["']jree["']/);

    assert.throws(
        () => (TemporalRules.matchingOrder as (...args: unknown[]) => boolean)(TemporalRules.ORDER_NONE),
        (error: unknown) => error instanceof JavaIllegalArgumentException,
    );

});
