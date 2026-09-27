import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

import type { Nar } from "../../src/main/Nar.ts";
import { VisualSpace } from "../../src/plugin/perception/VisualSpace.ts";

test("VisualSpace keeps the Java plain-class boundary and image snapshot contract", () => {
    const registered: unknown[] = [];
    const nar = {
        addPlugin(plugin: unknown): void {
            registered.push(plugin);
        },
    } as unknown as Nar;
    const source = [new Float64Array([0.1, 0.2]), new Float64Array([0.3, 0.4])];

    const space = new VisualSpace(nar, source, 0, 0, 2, 2);
    source[0][0] = 9;

    assert.equal(Object.getPrototypeOf(VisualSpace.prototype), Object.prototype);
    assert.ok(space instanceof VisualSpace);
    assert.equal(Object.getPrototypeOf(space), VisualSpace.prototype);
    assert.deepEqual(registered, [VisualSpace.move, VisualSpace.zoom]);
    assert.equal(space.source[0][0], 0.1);
    assert.deepEqual(Array.from(space.cropped[1]), [0.3, 0.4]);
});

test("VisualSpace keeps math and operator text on project boundaries", () => {
    const source = readFileSync(fileURLToPath(new URL("../../src/plugin/perception/VisualSpace.ts", import.meta.url)), "utf8");
    assert.doesNotMatch(source, /from ["']jree["']/);
});
