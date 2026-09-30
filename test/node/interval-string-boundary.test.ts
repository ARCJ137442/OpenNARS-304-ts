import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { Interval } from "../../src/language/Interval.ts";

test("Interval uses the project string boundary for parsing and naming", () => {
    const source = readFileSync("src/language/Interval.ts", "utf8");
    assert.doesNotMatch(source, /new java\.lang\.String\(/);
    assert.doesNotMatch(source, /from ["']jree["']/);
    assert.equal(Number(new Interval("+4" as unknown as never).time), 3);
    assert.equal(String(new Interval(2n).name()), "+2");
});
