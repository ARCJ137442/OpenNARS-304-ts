import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { DifferenceExt } from "../../src/language/DifferenceExt.ts";
import { DifferenceInt } from "../../src/language/DifferenceInt.ts";
import { IntersectionExt } from "../../src/language/IntersectionExt.ts";
import { IntersectionInt } from "../../src/language/IntersectionInt.ts";
import { Term } from "../../src/language/Term.ts";
import {
    JavaIllegalArgumentException,
    JavaIllegalStateException,
} from "../support/legacy-exceptions.ts";

const sources = [
    "src/language/IntersectionExt.ts",
    "src/language/IntersectionInt.ts",
    "src/language/DifferenceExt.ts",
    "src/language/DifferenceInt.ts",
];

test("intersection and difference terms avoid direct jree argument/state exceptions", () => {
    for (const file of sources) {
        const source = readFileSync(file, "utf8");
        assert.doesNotMatch(source, /new java\.lang\.(IllegalArgumentException|IllegalStateException)\(/, file);
    }
});

test("intersection factories preserve project-owned argument exceptions", () => {
    const extMake = IntersectionExt.make as unknown as (...args: unknown[]) => unknown;
    const intMake = IntersectionInt.make as unknown as (...args: unknown[]) => unknown;

    assert.throws(() => extMake(), (error: unknown) => error instanceof JavaIllegalArgumentException);
    assert.throws(() => intMake(), (error: unknown) => error instanceof JavaIllegalArgumentException);
});

test("difference factories preserve project-owned argument exceptions", () => {
    const extMake = DifferenceExt.make as unknown as (...args: unknown[]) => unknown;
    const intMake = DifferenceInt.make as unknown as (...args: unknown[]) => unknown;

    assert.throws(() => extMake(), (error: unknown) => error instanceof JavaIllegalArgumentException);
    assert.throws(() => intMake(), (error: unknown) => error instanceof JavaIllegalArgumentException);
});

test("DifferenceInt keeps its invalid component-count state contract", () => {
    assert.throws(
        () => DifferenceInt.ensureValidDifferenceArguments([Term.get("single-component")]),
        (error: unknown) => error instanceof JavaIllegalStateException && error.message === "Requires 2 components",
    );
});
