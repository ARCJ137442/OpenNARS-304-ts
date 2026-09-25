import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("ProcessAnticipation uses the project string boundary", () => {
    const source = readFileSync("src/control/concept/ProcessAnticipation.ts", "utf8");
    assert.doesNotMatch(source, /from ["']jree["']/);
    assert.doesNotMatch(source, /new java\.lang\.String/);
});
