import assert from "node:assert/strict";
import test from "node:test";

import {
    classifyTimeoutObservation,
    completeProcessFailureRows,
    normalizeResult,
} from "../../scripts/e2e/run-nal-corpus.mjs";

test("NAL runner keeps process exit evidence separate from exception text", () => {
    const [row] = completeProcessFailureRows(["fixture.nal"], 1550, [], {
        status: 3221225477,
        signal: null,
        error: { message: "child process exited" },
        stderr: "ExperimentalWarning\nactual failure",
    }, "TypeScript");

    assert.equal(row.error, "child process exited");
    assert.equal(row.error_type, "exception");
    assert.equal(row.exit_code, 3221225477);
    assert.equal(row.signal, null);
    assert.equal(row.stderr, "ExperimentalWarning\nactual failure");
});

test("NAL runner keeps matched markers when another error flag is present", () => {
    const result = normalizeResult({
        expected: 2,
        matched: [true, false],
        ok: false,
        error: "process exited after first marker",
        error_type: "exception",
    });

    assert.deepEqual(result?.matched, [true, false]);
    assert.equal(result?.passed, 1);
    assert.equal(result?.marker_missing_count, 1);
    assert.equal(result?.exception, true);
});

test("NAL runner classifies progressing process limits as warnings", () => {
    const observation = classifyTimeoutObservation({
        timeoutMs: 30000,
        ts: {
            timed_out: false,
            process_limited: true,
            stall_detected: false,
        },
    });

    assert.equal(observation.timeout_classification, "process_limit");
    assert.equal(observation.performance_warning, true);
});
