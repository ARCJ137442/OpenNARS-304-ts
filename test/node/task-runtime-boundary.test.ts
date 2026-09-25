import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { Task } from "../../src/entity/Task.ts";

test("Task keeps project-owned enum and string boundaries", () => {
    const source = readFileSync("src/entity/Task.ts", "utf8");
    assert.doesNotMatch(source, /from ["']jree["']/);
    assert.doesNotMatch(source, /java\.lang\.(StringBuilder|Enum|IllegalArgumentException)/);
    assert.doesNotMatch(source, /S`/);
    assert.equal(Task.EnumType.INPUT.name(), "INPUT");
    assert.equal(Task.EnumType.INPUT.ordinal(), 0);
    assert.equal(String(Task.EnumType.DERIVED), "DERIVED");
    assert.notEqual(Task.EnumType.INPUT, Task.EnumType.DERIVED);
});
