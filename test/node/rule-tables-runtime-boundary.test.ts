import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { JavaIllegalArgumentException } from "../../src/runtime/JavaExceptions.ts";
import { RuleTables } from "../../src/inference/RuleTables.ts";

test("RuleTables keeps project-owned enum and exception boundaries", () => {
    const source = readFileSync("src/inference/RuleTables.ts", "utf8");
    assert.doesNotMatch(source, /from ["']jree["']/);
    assert.equal(RuleTables.EnumFigureSide.LEFT.name(), "LEFT");
    assert.equal(RuleTables.EnumFigureSide.LEFT.ordinal(), 0);
    assert.equal(String(RuleTables.EnumFigureSide.RIGHT), "RIGHT");
    assert.notEqual(RuleTables.EnumFigureSide.LEFT, RuleTables.EnumFigureSide.RIGHT);
    assert.throws(
        () => (RuleTables as unknown as { retSideFromFigure: (...args: unknown[]) => unknown })
            .retSideFromFigure(99, RuleTables.EnumFigureSide.LEFT),
        (error: unknown) => error instanceof JavaIllegalArgumentException,
    );
});
