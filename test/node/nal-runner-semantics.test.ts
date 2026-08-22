import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { java } from "jree";

import { evaluateRow, extractNalMetadata, isProcessTimeout, normalizeResult, parseArgs, parseJsonLines } from "../../scripts/e2e/run-nal-corpus.mjs";
import { Tense } from "../../src/language/Tense.ts";

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

test("NAL runner keeps files after a timeout separate from the timed-out file", () => {
  const result = normalizeResult({
    expected: null,
    matched: [],
    error: "not run after preceding timeout",
    error_type: "not_run",
    not_run: true,
  }, 1);

  assert.equal(result.error_type, "not_run");
  assert.equal(result.not_run, true);
  assert.equal(result.timed_out, false);
  assert.equal(result.exception, false);
  assert.equal(result.marker_missing, true);
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

test("NAL runner preserves valid rows when stdout contains a diagnostic line", () => {
  assert.deepEqual(parseJsonLines("# diagnostic\n{\"file\":\"x\",\"matched\":[true]}\n"), {
    rows: [{ file: "x", matched: [true] }],
    nonJsonLines: ["# diagnostic"],
  });
});

test("NAL runner recognizes Windows timeout results with signal and message", () => {
  assert.equal(isProcessTimeout({ signal: "SIGTERM", error: { message: "spawnSync node ETIMEDOUT" } }), true);
  assert.equal(isProcessTimeout({ signal: "SIGTERM", error: { message: "process terminated" } }), false);
});

test("Tense lookup accepts Java String values at the parser boundary", () => {
  assert.equal(Tense.tense(new java.lang.String(":|:")), Tense.Present);
  assert.equal(Tense.tense(new java.lang.String(":\\:")), Tense.Past);
  assert.equal(Tense.tense(new java.lang.String(":/:")), Tense.Future);
});

test("NAL metadata separates embedded and runner-added cycles", () => {
  assert.deepEqual(
    extractNalMetadata([
      "<a --> b>.",
      "32",
      "''outputMustContain('<a --> b>.')",
      "50000",
    ].join("\n")),
    { expected: ["<a --> b>."], embeddedCycles: 50032 },
  );
});

test("NAL runner validates and resumes a persisted per-file result", () => {
  assert.deepEqual(
    parseArgs([
      "--result-file", "matrix.jsonl", "--resume", "--chunk-size", "1",
      "--file", "fixture.nal",
    ]).filePaths,
    ["fixture.nal"],
  );
  assert.equal(
    parseArgs(["--result-file", "matrix.jsonl", "--resume", "--chunk-size", "1"]).resultFile,
    "matrix.jsonl",
  );
  assert.throws(() => parseArgs(["--resume"]), /--resume requires --result-file PATH/);

  const directory = mkdtempSync(join(tmpdir(), "opennars-nal-matrix-"));
  const resultFile = join(directory, "matrix.jsonl");
  const runner = join(process.cwd(), "scripts", "e2e", "run-nal-corpus.mjs");
  const args = [
    runner,
    "--engine", "ts",
    "--cycles", "1",
    "--start", "29",
    "--limit", "2",
    "--chunk-size", "2",
    "--timeout-ms", "30000",
    "--result-file", resultFile,
  ];
  try {
    const first = spawnSync(process.execPath, args, {
      cwd: process.cwd(),
      encoding: "utf8",
      maxBuffer: 4 * 1024 * 1024,
    });
    assert.ok(first.status === 0 || first.status === 1, first.stderr);
    const firstRows = readFileSync(resultFile, "utf8")
      .trim()
      .split(/\r?\n/)
      .map((line) => JSON.parse(line));
    assert.equal(firstRows.length, 2);
    assert.equal(typeof firstRows[0].run_key, "string");

    const resumed = spawnSync(process.execPath, [...args, "--resume"], {
      cwd: process.cwd(),
      encoding: "utf8",
      maxBuffer: 4 * 1024 * 1024,
    });
    assert.equal(resumed.status, first.status, resumed.stderr);
    const resumedRows = readFileSync(resultFile, "utf8")
      .trim()
      .split(/\r?\n/);
    assert.equal(resumedRows.length, 2);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
