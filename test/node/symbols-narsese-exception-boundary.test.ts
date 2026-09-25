import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { JavaIllegalArgumentException } from "../../src/runtime/JavaExceptions.ts";
import { Narsese } from "../../src/io/Narsese.ts";
import { Symbols } from "../../src/io/Symbols.ts";

test("Symbols and Narsese use project-owned argument exceptions", () => {
    const symbolsSource = readFileSync("src/io/Symbols.ts", "utf8");
    const narseseSource = readFileSync("src/io/Narsese.ts", "utf8");

    assert.doesNotMatch(symbolsSource, /new java\.lang\.IllegalArgumentException\(/);
    assert.doesNotMatch(narseseSource, /new java\.lang\.IllegalArgumentException\(/);

    assert.throws(
        () => (Symbols.getOperator as (...args: unknown[]) => unknown)(),
        (error: unknown) => error instanceof JavaIllegalArgumentException,
    );
    assert.throws(
        () => new (Narsese as new (...args: unknown[]) => unknown)(),
        (error: unknown) => error instanceof JavaIllegalArgumentException,
    );
});
