import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("BudgetValue uses native string markers", () => {
    const source = readFileSync("src/entity/BudgetValue.ts", "utf8");
    assert.doesNotMatch(source, /type CharCode\s*=/);
    assert.match(source, /private static readonly MARK: string/);
    assert.match(source, /private static readonly SEPARATOR: string/);
});

test("BudgetValue keeps runtime compatibility behind project-owned boundaries", () => {
    const source = readFileSync("src/entity/BudgetValue.ts", "utf8");
    assert.doesNotMatch(source, /from ["']jree["']/);
    assert.doesNotMatch(source, /java\.lang\.(IllegalArgumentException|IllegalStateException|Math|Object|String)/);
    assert.match(source, /ReasonerInputError/);
});
