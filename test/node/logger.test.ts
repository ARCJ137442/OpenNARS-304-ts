import assert from "node:assert/strict";
import test from "node:test";

import { Logger } from "../../src/runtime/Logger.ts";

test("informational reasoner events do not appear as host errors", () => {
    const originalInfo = console.info;
    const originalError = console.error;
    const infos: unknown[][] = [];
    const errors: unknown[][] = [];
    console.info = (...args: unknown[]) => { infos.push(args); };
    console.error = (...args: unknown[]) => { errors.push(args); };
    try {
        const logger = Logger.named("ProcessGoal");
        logger.log("INFO", "Executed based on a goal");
        assert.deepEqual(infos, [["INFO ProcessGoal", "Executed based on a goal"]]);
        assert.deepEqual(errors, []);

        logger.log("SEVERE", "Execution failed");
        assert.deepEqual(errors, [["SEVERE ProcessGoal", "Execution failed"]]);
    } finally {
        console.info = originalInfo;
        console.error = originalError;
    }
});
