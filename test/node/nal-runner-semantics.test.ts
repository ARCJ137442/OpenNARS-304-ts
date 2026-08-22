import assert from "node:assert/strict";
import test from "node:test";

import { evaluateRow, normalizeResult } from "../../scripts/e2e/run-nal-corpus.mjs";

test("NAL runner counts final matched markers even when an exception occurs", () => {
  const result = normalizeResult({
    expected: 2,
    passed: 0,
    matched: [true, false],
    error: "late failure",
  }, 2);

  assert.equal(result.passed, 1);
  assert.deepEqual(result.matched, [true, false]);
  assert.equal(result.exception, true);
  assert.equal(result.marker_missing, true);
  assert.equal(result.ok, false);
});

test("NAL runner keeps timeout and marker absence as separate observations", () => {
  const result = normalizeResult({
    expected: null,
    matched: [],
    error: "timed out",
    error_type: "timeout",
    timed_out: true,
  }, 1);

  assert.equal(result.error_type, "timeout");
  assert.equal(result.timed_out, true);
  assert.equal(result.exception, false);
  assert.equal(result.marker_missing, true);
  assert.equal(result.marker_missing_count, 1);
});

test("parity does not become functional pass when both engines miss the marker", () => {
  const row = evaluateRow("fixture.nal", 1,
    { expected: 1, matched: [false], error: "java marker missing" },
    { expected: 1, matched: [false], error: "ts marker missing" },
    "parity");

  assert.equal(row.parity, true);
  assert.equal(row.both_wrong, true);
  assert.equal(row.java_ts_diff, false);
  assert.equal(row.functional_pass, false);
});

test("parity exposes Java/TypeScript result differences independently", () => {
  const row = evaluateRow("fixture.nal", 1,
    { expected: 1, matched: [true] },
    { expected: 1, matched: [false] },
    "parity");

  assert.equal(row.parity, false);
  assert.equal(row.java_ts_diff, true);
  assert.equal(row.both_wrong, false);
  assert.equal(row.functional_pass, false);
});
