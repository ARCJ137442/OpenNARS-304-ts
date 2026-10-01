import assert from "node:assert/strict";
import test from "node:test";

import { Shell } from "../../src/main/Shell.ts";
import type { Nar } from "../../src/main/Nar.ts";

test("Shell keeps the Java plain-class boundary and ReasonerScheduler remains local", () => {
    const nar = {} as Nar;
    const shell = new Shell(nar);

    assert.equal(Object.getPrototypeOf(Shell.prototype), Object.prototype);
    assert.equal(Object.getPrototypeOf(shell), Shell.prototype);
    assert.ok(shell instanceof Shell);
    assert.equal(Object.getPrototypeOf(Shell.prototype).constructor.name, "Object");
});
