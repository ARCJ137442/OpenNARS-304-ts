import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("DerivationContext keeps project-owned exception and string boundaries", () => {
    const source = readFileSync("src/control/DerivationContext.ts", "utf8");
    assert.doesNotMatch(source, /from ["']jree["']/);
    assert.doesNotMatch(source, /java\.lang\.(IllegalArgumentException|IllegalStateException)/);
    assert.doesNotMatch(source, /S`/);
});
