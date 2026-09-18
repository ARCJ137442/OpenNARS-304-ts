import test from "node:test";
import assert from "node:assert/strict";
import { Nar } from "../../src/main/Nar.ts";
import { Narsese } from "../../src/io/Narsese.ts";

test("Narsese follows the canonical plain-class boundary", () => {
    const nar = new Nar();
    const parser = new Narsese(nar);

    assert.equal(Object.getPrototypeOf(Narsese.prototype), Object.prototype);
    assert.ok(parser instanceof Narsese);
    assert.equal(parser.memory, nar.memory);
});
