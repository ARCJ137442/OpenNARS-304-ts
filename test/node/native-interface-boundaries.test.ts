import assert from "node:assert/strict";
import test from "node:test";
import type { Multistepable } from "../../src/interfaces/Multistepable.ts";
import type { Timable } from "../../src/interfaces/Timable.ts";

test("time and multistep interfaces use native TypeScript values", () => {
    const clock: Timable = {
        time: () => 7n,
    };
    const steps: Multistepable = {
        start: (_period: bigint = 0n) => undefined,
        stop: () => undefined,
        cycles: (_cycles: number) => undefined,
        cycle: () => undefined,
    };

    assert.equal(clock.time(), 7n);
    assert.doesNotThrow(() => steps.start(1n));
    assert.doesNotThrow(() => steps.cycles(1));
});
