import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { java } from "../../src/runtime/native-runtime.ts";

import {
  assertUniqueFiles,
  classifyTimeoutObservation,
  completeProcessFailureRows,
  evaluateMarkerPerformance,
  evaluateLongCycleEquivalence,
  evaluateRuntimePerformance,
  evaluateRow,
  extractNalMetadata,
  isProcessTimeout,
  loadCheckpoint,
  normalizeResult,
  parseArgs,
  parseProgressLine,
  isProgressHeartbeat,
  runTs,
  parseJsonLines,
  selectCorpusFiles,
} from "../../scripts/e2e/run-nal-corpus.mjs";
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
    stall_detected: true,
    timeout_reason: "no_progress",
  }, 1);

  assert.equal(result.error_type, "timeout");
  assert.equal(result.timed_out, true);
  assert.equal(result.exception, false);
  assert.equal(result.marker_missing, true);
  assert.equal(result.marker_missing_count, 1);
  assert.equal(result.stall_detected, true);
});

test("NAL runner distinguishes a process crash from a single-file timeout", () => {
  const crash = completeProcessFailureRows(["crashed.nal"], 1, [], {
    status: 1,
    error: { message: "loader crashed" },
  }, "TypeScript")[0];

  assert.equal(crash.error_type, "exception");
  assert.equal(crash.timed_out, false);
  assert.equal(crash.not_run, undefined);
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

test("NAL runner reports marker timing against a 120-second-per-1024-cycle budget", () => {
  const within = evaluateMarkerPerformance(
    { marker_time_ms: [1000] },
    { marker_time_ms: [120000] },
    1024,
  );
  assert.deepEqual(within.marker_time_delta_ms, [119000]);
  assert.deepEqual(within.marker_time_delta_per_1024_ms, [119000]);
  assert.equal(within.ts_marker_timing_complete, true);
  assert.equal(within.marker_delta_timing_complete, true);
  assert.equal(within.ts_performance_within_budget, true);
  assert.equal(within.marker_delta_within_budget, true);

  const over = evaluateMarkerPerformance(
    { marker_time_ms: [0] },
    { marker_time_ms: [120001] },
    1024,
  );
  assert.equal(over.ts_performance_within_budget, false);
  assert.equal(over.marker_delta_within_budget, false);

  const balanced = evaluateMarkerPerformance(
    { marker_time_ms: [0] },
    { marker_time_ms: [60001] },
    1024,
    60000,
  );
  assert.equal(balanced.performance_budget_ms_per_1024_cycles, 60000);
  assert.equal(balanced.ts_performance_within_budget, false);
  assert.equal(balanced.marker_delta_within_budget, false);
});

test("NAL runner records runtime per reasoning cycle and relative slowdown", () => {
  const result = evaluateRuntimePerformance(
    { duration_ms: 500, timed_out: false },
    { duration_ms: 40000, timed_out: false },
    1550,
  );

  assert.equal(result.reasoning_cycles, 1550);
  assert.equal(result.java_runtime_ms, 500);
  assert.equal(result.ts_runtime_ms, 40000);
  assert.equal(result.java_runtime_observation, "completed");
  assert.equal(result.ts_runtime_observation, "completed");
  assert.equal(result.java_runtime_ms_per_cycle, 500 / 1550);
  assert.equal(result.ts_runtime_ms_per_cycle, 40000 / 1550);
  assert.equal(result.runtime_delta_ms, 39500);
  assert.equal(result.ts_runtime_slowdown_ratio, 80);
  assert.equal(result.ts_runtime_within_budget, true);

  const balanced = evaluateRuntimePerformance(
    { duration_ms: 500, timed_out: false },
    { duration_ms: 100000, timed_out: false },
    1550,
    60000,
  );
  assert.equal(balanced.runtime_budget_ms_per_cycle, 60000 / 1024);
  assert.equal(balanced.ts_runtime_within_budget, false);
});

test("NAL runner marks stalled runtime as a lower bound instead of a functional verdict", () => {
  const result = evaluateRuntimePerformance(
    { duration_ms: 500, timed_out: false },
    { duration_ms: 30000, timed_out: true, stall_detected: true, timeout_reason: "no_progress" },
    1550,
  );

  assert.equal(result.ts_runtime_observation, "stalled_lower_bound");
  assert.equal(result.ts_runtime_slowdown_ratio, 60);
  assert.equal(result.ts_runtime_within_budget, false);
});

test("NAL runner classifies no-progress watchdog termination independently of performance", () => {
  const stalled = classifyTimeoutObservation({
    timeoutMs: 120000,
    java: { timed_out: false, exception: false },
    ts: { timed_out: true, stall_detected: true, timeout_reason: "no_progress", exception: false },
  });
  assert.deepEqual(stalled, {
    performance_warning: false,
    timeout_classification: "stalled_no_progress",
  });

  const stalledAfterLongWatchdog = classifyTimeoutObservation({
    timeoutMs: 180001,
    java: { timed_out: false, exception: false },
    ts: { timed_out: true, stall_detected: true, timeout_reason: "no_progress", exception: false },
  });
  assert.deepEqual(stalledAfterLongWatchdog, {
    performance_warning: false,
    timeout_classification: "stalled_no_progress",
  });

  const exception = classifyTimeoutObservation({
    timeoutMs: 120000,
    java: { timed_out: false, exception: true },
    ts: { timed_out: true, exception: false },
  });
  assert.deepEqual(exception, {
    performance_warning: false,
    timeout_classification: "timeout_with_exception",
  });
});

test("NAL runner keeps a slow completed process as performance data, not a timeout", () => {
  const result = classifyTimeoutObservation({
    timeoutMs: 5000,
    java: { duration_ms: 100, timed_out: false, exception: false },
    ts: { duration_ms: 30000, timed_out: false, exception: false },
  });
  assert.deepEqual(result, {
    performance_warning: false,
    timeout_classification: null,
  });
});

test("NAL runner keeps a process safety limit separate from a no-progress timeout", () => {
  const limited = normalizeResult({
    expected: null,
    matched: [],
    error: "process safety limit reached",
    error_type: "process_limit",
    timed_out: false,
    process_limited: true,
    termination_reason: "process_limit",
  }, 1);

  assert.equal(limited.error_type, "process_limit");
  assert.equal(limited.timed_out, false);
  assert.equal(limited.stall_detected, false);
  assert.equal(limited.ok, false);
  assert.equal(classifyTimeoutObservation({
    timeoutMs: 30000,
    ts: limited,
  }).timeout_classification, "process_limit");
  assert.equal(classifyTimeoutObservation({
    timeoutMs: 30000,
    ts: limited,
  }).performance_warning, true);

  const runtime = evaluateRuntimePerformance(
    { duration_ms: 500, timed_out: false },
    { duration_ms: 600000, timed_out: false, process_limited: true },
    1550,
  );
  assert.equal(runtime.ts_runtime_observation, "process_limited");
  assert.equal(runtime.ts_runtime_within_budget, false);
});

test("NAL runner keeps performance observations separate when a marker is missing", () => {
  const result = evaluateMarkerPerformance(
    { marker_time_ms: [10, null] },
    { marker_time_ms: [20, null] },
    2048,
  );
  assert.deepEqual(result.marker_time_delta_ms, [10, null]);
  assert.deepEqual(result.marker_time_delta_per_1024_ms, [5, null]);
  assert.equal(result.ts_marker_timing_complete, false);
  assert.equal(result.marker_delta_timing_complete, false);
  assert.equal(result.marker_delta_within_budget, null);
});

test("marker parity is an equivalence route without requiring 131072 cycles or an internal trace", () => {
  const java = { ok: true, matched: [true, true] };
  const ts = { ok: true, matched: [true, true] };
  const equal = evaluateLongCycleEquivalence({
    cycles: 1550,
    expectedCount: 2,
    java,
    ts,
  });

  assert.equal(equal.marker_standard, "passed");
  assert.equal(equal.internal_event_standard, "unverified");
  assert.equal(equal.equivalence_route, "marker");
  assert.equal(equal.status, "equivalent");
  assert.equal(equal.equivalent, true);
});

test("marker parity remains equivalent when an optional internal trace differs", () => {
  const result = evaluateLongCycleEquivalence({
    cycles: 131072,
    expectedCount: 1,
    java: { ok: true, matched: [true] },
    ts: { ok: true, matched: [true] },
    javaEvents: [{ stage: "TermLink", index: 1 }],
    tsEvents: [{ stage: "TermLink", index: 2 }],
  });

  assert.equal(result.marker_standard, "passed");
  assert.equal(result.internal_event_standard, "failed");
  assert.equal(result.equivalence_route, "marker");
  assert.equal(result.status, "equivalent");
  assert.equal(result.equivalent, true);
});

test("131072-cycle equivalence is available for inputs without Java markers", () => {
  const result = evaluateLongCycleEquivalence({
    cycles: 131072,
    expectedCount: 0,
    java: { ok: true, matched: [] },
    ts: { ok: true, matched: [] },
    javaEvents: [{ stage: "OUT", term: "<a --> b>." }],
    tsEvents: [{ term: "<a --> b>.", stage: "OUT" }],
  });

  assert.equal(result.marker_standard, "not_applicable");
  assert.equal(result.internal_event_standard, "passed");
  assert.equal(result.equivalence_route, "cycle");
  assert.equal(result.status, "equivalent");
  assert.equal(result.equivalent, true);
});

test("NAL parity rows expose marker equivalence independently of the long-cycle target", () => {
  const row = evaluateRow("fixture.nal", ["marker"],
    { expected: 1, matched: [true] },
    { expected: 1, matched: [true] },
    "parity",
    131072);

  assert.equal(row.functional_pass, true);
  assert.equal(row.long_cycle_equivalence.marker_standard, "passed");
  assert.equal(row.long_cycle_equivalence.equivalence_route, "marker");
  assert.equal(row.long_cycle_equivalence.status, "equivalent");
  assert.equal(row.long_cycle_equivalence.equivalent, true);
});

test("NAL runner preserves valid rows when stdout contains a diagnostic line", () => {
  assert.deepEqual(parseJsonLines("# diagnostic\n{\"file\":\"x\",\"matched\":[true]}\n"), {
    rows: [{ file: "x", matched: [true] }],
    nonJsonLines: ["# diagnostic"],
  });
});

test("NAL runner accepts only structured progress heartbeats", () => {
  assert.deepEqual(parseProgressLine('@progress {"file":"fixture.nal","cycle":256,"kind":"cycle"}'), {
    file: "fixture.nal",
    cycle: 256,
    kind: "cycle",
  });
  assert.equal(parseProgressLine("warning: slow"), null);
  assert.equal(parseProgressLine('@progress {"file":"fixture.nal","cycle":-1}'), null);
});

test("NAL runner resets the no-progress watchdog for cycle, command, and marker heartbeats", () => {
  for (const kind of ["cycle", "command", "marker"]) {
    const progress = parseProgressLine(`@progress {"file":"fixture.nal","cycle":256,"kind":"${kind}"}`);
    assert.equal(isProgressHeartbeat(progress), true);
  }
  assert.equal(isProgressHeartbeat(parseProgressLine("warning: slow")), false);
});

test("NAL runner preserves expected marker count on timeout rows", () => {
  const row = evaluateRow("fixture.nal", ["<a --> b>."],
    { error_type: "timeout", timed_out: true, timeout_reason: "no_progress", matched: [] },
    { error_type: "timeout", timed_out: true, timeout_reason: "no_progress", matched: [] },
    "parity", 1, 5000);

  assert.equal(row.java.expected, 1);
  assert.equal(row.java.marker_missing, true);
  assert.equal(row.java.marker_missing_count, 1);
  assert.equal(row.ts.expected, 1);
  assert.equal(row.ts.marker_missing, true);
  assert.equal(row.ts.marker_missing_count, 1);
  assert.equal(row.functional_pass, false);
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

test("NAL runner selects the explicit M1-- corpus without limit-based truncation", () => {
  const files = [
    ...Array.from({ length: 24 }, (_, index) => `java-master/src/main/resources/nal/synthetic/${String(index).padStart(3, "0")}.nal`),
    "java-master/src/main/resources/nal/multi_step/nars_multistep_3.nal",
    ...Array.from({ length: 219 }, (_, index) => `java-master/src/main/resources/nal/synthetic/${String(index + 24).padStart(3, "0")}.nal`),
    "java-master/src/main/resources/nal/stability/long_term_stability.nal",
  ];
  const selected = selectCorpusFiles(files, {
    all: true,
    filePaths: [],
    limit: null,
    mMinus: true,
    start: 0,
  });
  assert.equal(files.length, 245);
  assert.equal(selected.length, 243);
  assert.equal(selected.includes("java-master/src/main/resources/nal/multi_step/nars_multistep_3.nal"), false);
  assert.equal(selected.includes("java-master/src/main/resources/nal/stability/long_term_stability.nal"), false);
  assert.equal(selected[0], files[0]);
  assert.equal(selected.at(-1), files[243]);
});

test("NAL runner rejects partial corpus options for M1--", () => {
  assert.equal(parseArgs(["--all", "--m-minus"]).mMinus, true);
  assert.throws(() => parseArgs(["--m-minus"]), /--m-minus requires --all/);
  assert.throws(() => parseArgs(["--all", "--m-minus", "--limit", "243"]), /cannot be combined with --limit/);
  assert.throws(() => parseArgs(["--all", "--m-minus", "--start", "1"]), /cannot be combined with --start/);
  assert.throws(() => parseArgs(["--all", "--m-minus", "--file", "fixture.nal"]), /cannot be combined with --file/);
});

test("NAL runner records an explicit TypeScript process mode and separates run keys", () => {
  assert.equal(parseArgs([]).tsMode, "hot");
  assert.equal(parseArgs(["--ts-mode", "cold"]).tsMode, "cold");
  assert.equal(parseArgs(["--ts-process-mode", "hot"]).tsMode, "hot");
  assert.equal(parseArgs(["--process-limit-ms", "600000"]).processLimitMs, 600000);
  assert.equal(parseArgs(["--performance-budget-ms-per-1024-cycles", "60000"]).performanceBudgetMsPer1024Cycles, 60000);
  assert.equal(parseArgs(["--performance-budget-ms-per-1024", "60000"]).performanceBudgetMsPer1024Cycles, 60000);
  assert.throws(() => parseArgs(["--performance-budget-ms-per-1024-cycles", "0"]), /performance-budget-ms-per-1024-cycles/);
  assert.throws(() => parseArgs(["--process-limit-ms", "0"]), /--process-limit-ms must be a positive integer/);
  assert.throws(() => parseArgs(["--ts-mode", "warm"]), /--ts-mode must be hot or cold/);
});

test("NAL runner rejects duplicate checkpoint rows for one run", () => {
  const directory = mkdtempSync(join(tmpdir(), "opennars-nal-checkpoint-"));
  const resultFile = join(directory, "matrix.jsonl");
  const file = join(directory, "fixture.nal");
  const row = { run_key: "run-1", file, functional_pass: true };
  writeFileSync(resultFile, `${JSON.stringify(row)}\n${JSON.stringify(row)}\n`, "utf8");
  try {
    assert.throws(() => loadCheckpoint(resultFile, "run-1"), /duplicate checkpoint row/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("NAL runner rejects duplicate input files before execution", () => {
  assert.throws(
    () => assertUniqueFiles(["fixture.nal", "fixture.nal"]),
    /duplicate input file/,
  );
});

test("NAL runner persists cold and hot results without overwriting either run", () => {
  const directory = mkdtempSync(join(tmpdir(), "opennars-nal-mode-"));
  const resultFile = join(directory, "matrix.jsonl");
  const fixture = join(directory, "fixture.nal");
  writeFileSync(fixture, "<a --> b>.\n''outputMustContain('<a --> b>.')\n", "utf8");
  const runner = join(process.cwd(), "scripts", "e2e", "run-nal-corpus.mjs");
  const baseArgs = [
    runner,
    "--engine", "ts",
    "--cycles", "1",
    "--timeout-ms", "30000",
    "--chunk-size", "1",
    "--result-file", resultFile,
    "--file", fixture,
  ];
  try {
    const cold = spawnSync(process.execPath, [...baseArgs, "--ts-mode", "cold"], {
      cwd: process.cwd(),
      encoding: "utf8",
      maxBuffer: 4 * 1024 * 1024,
    });
    assert.ok(cold.status === 0 || cold.status === 1, cold.stderr);
    const hot = spawnSync(process.execPath, [...baseArgs, "--ts-mode", "hot", "--resume"], {
      cwd: process.cwd(),
      encoding: "utf8",
      maxBuffer: 4 * 1024 * 1024,
    });
    assert.ok(hot.status === 0 || hot.status === 1, hot.stderr);
    const rows = readFileSync(resultFile, "utf8").trim().split(/\r?\n/).map((line) => JSON.parse(line));
    assert.equal(rows.length, 2);
    assert.deepEqual(new Set(rows.map((row) => row.ts_process_mode)), new Set(["cold", "hot"]));
    assert.notEqual(rows[0].run_key, rows[1].run_key);
    assert.deepEqual(rows.map((row) => row.sequence), [0, 0]);
    assert.deepEqual(rows.map((row) => row.chunk_index), [0, 0]);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("NAL runner keeps hot results isolated from order and cold-process boundaries", () => {
  const directory = mkdtempSync(join(tmpdir(), "opennars-nal-isolation-"));
  const first = join(directory, "first.nal");
  const second = join(directory, "second.nal");
  const repeat = join(directory, "repeat.nal");
  const source = (subject: string, predicate: string): string => `<${subject} --> ${predicate}>.\n''outputMustContain('<${subject} --> ${predicate}>.')\n`;
  writeFileSync(first, source("a", "b"), "utf8");
  writeFileSync(second, source("b", "c"), "utf8");
  writeFileSync(repeat, source("a", "b"), "utf8");

  const runner = join(process.cwd(), "scripts", "e2e", "run-nal-corpus.mjs");
  const run = (resultFile: string, mode: string, files: string[]) => spawnSync(process.execPath, [
    runner,
    "--engine", "ts",
    "--ts-mode", mode,
    "--cycles", "1",
    "--timeout-ms", "15000",
    "--chunk-size", String(files.length),
    "--result-file", resultFile,
    ...files.flatMap((file) => ["--file", file]),
  ], { cwd: process.cwd(), encoding: "utf8", maxBuffer: 4 * 1024 * 1024 });
  type JsonRow = Record<string, unknown>;
  const readRows = (resultFile: string): JsonRow[] => readFileSync(resultFile, "utf8")
    .trim()
    .split(/\r?\n/)
    .map((line) => JSON.parse(line));
  const semantic = (row: JsonRow): JsonRow => ({
    expected: row.expected,
    passed: row.passed,
    matched: row.matched,
    ok: row.ok,
    error_type: row.error_type,
    exception: row.exception,
    timed_out: row.timed_out,
    not_run: row.not_run,
    marker_missing: row.marker_missing,
  });
  const byFile = (rows: JsonRow[]): Map<string, JsonRow> => new Map(rows.map((row) => [row.file as string, semantic(row)]));
  const assertRunSucceeded = (result: ReturnType<typeof spawnSync>): void => {
    const output = result.stderr ?? result.stdout;
    assert.ok(result.status === 0, output == null ? undefined : output.toString());
  };

  try {
    const hotResultFile = join(directory, "hot.jsonl");
    const coldResultFile = join(directory, "cold.jsonl");
    const reverseResultFile = join(directory, "reverse.jsonl");
    const hot = run(hotResultFile, "hot", [first, second, repeat]);
    const cold = run(coldResultFile, "cold", [first, second]);
    const reverse = run(reverseResultFile, "hot", [second, first]);
    assertRunSucceeded(hot);
    assertRunSucceeded(cold);
    assertRunSucceeded(reverse);

    const hotRows = readRows(hotResultFile);
    const coldRows = readRows(coldResultFile);
    const reverseRows = readRows(reverseResultFile);
    const hotByFile = byFile(hotRows);
    const coldByFile = byFile(coldRows);
    const reverseByFile = byFile(reverseRows);
    assert.deepEqual(hotByFile.get(first), hotByFile.get(repeat));
    assert.deepEqual(hotByFile.get(first), coldByFile.get(first));
    assert.deepEqual(hotByFile.get(second), coldByFile.get(second));
    assert.deepEqual(hotByFile.get(first), reverseByFile.get(first));
    assert.deepEqual(hotByFile.get(second), reverseByFile.get(second));
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("NAL runner resumes after a real middle-file timeout and preserves the tail", async () => {
  const directory = mkdtempSync(join(tmpdir(), "opennars-nal-timeout-tail-"));
  const first = join(directory, "first.nal");
  const slow = join(directory, "slow.nal");
  const last = join(directory, "last.nal");
  const heartbeat = join(directory, "heartbeat.nal");
  const fakeCli = join(directory, "fake-cli.mjs");
  const fakeCliSource = [
    "import { basename } from 'node:path';",
    "const files = process.argv.slice(2).filter((argument) => argument.endsWith('.nal'));",
    "for (const file of files) {",
    "  if (basename(file) === 'slow.nal') {",
    "    setInterval(() => {}, 1000);",
    "    await new Promise(() => {});",
    "  }",
    "  if (basename(file) === 'heartbeat.nal') {",
    "    let cycle = 0;",
    "    const timer = setInterval(() => process.stderr.write(`@progress ${JSON.stringify({ file, cycle: ++cycle, kind: 'cycle' })}\\n`), 50);",
    "    await new Promise((resolve) => setTimeout(resolve, 500));",
    "    clearInterval(timer);",
    "  }",
    "  console.log(JSON.stringify({ file, cycles: 1, expected: 1, passed: 1, matched: [true], ok: true, error_type: 'none', exception: false, timed_out: false }));",
    "}",
  ].join("\n");
  writeFileSync(first, "first", "utf8");
  writeFileSync(slow, "slow", "utf8");
  writeFileSync(last, "last", "utf8");
  writeFileSync(heartbeat, "heartbeat", "utf8");
  writeFileSync(fakeCli, fakeCliSource, "utf8");
  try {
    const rows = await runTs([first, slow, last], 1, 1000, null, fakeCli);
    assert.equal(rows.length, 3);
    assert.deepEqual(rows.map((row) => row.file), [first, slow, last]);
    assert.equal(rows[0].error_type, "none");
    assert.equal(rows[1].error_type, "timeout");
    assert.equal(rows[1].stall_detected, true);
    assert.equal(rows[1].timeout_reason, "no_progress");
    assert.equal(rows[2].error_type, "none");
    assert.deepEqual(rows.map((row) => row.not_run === true), [false, false, false]);

    const heartbeatRows = await runTs([heartbeat], 1, 1000, null, fakeCli);
    assert.equal(heartbeatRows[0].error_type, "none");
    assert.equal(heartbeatRows[0].timed_out, false);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("NAL trace describes ExecutionResult with Java-equivalent operation feedback", () => {
  const traceRunner = join(process.cwd(), "scripts", "e2e", "NalTraceRunner.mjs");
  const file = join(process.cwd(), "java-master", "src", "main", "resources", "nal", "single_step", "nal8.add.nal");
  const result = spawnSync(process.execPath, [
    "--import", "./scripts/register-ts-loader.mjs", traceRunner, "32", file, "--skip-embedded",
  ], {
    cwd: process.cwd(),
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
  });

  assert.equal(result.status, 0, result.stderr);
  const rows = result.stdout.split(/\r?\n/)
    .filter((line) => line.trim().startsWith("{"))
    .map((line) => JSON.parse(line));
  const execution = rows.find((row) => row.event === "EXE");
  assert.ok(execution);
  assert.match(execution.args[0], /\$0\.45;0\.90;0\.95\$ \^add\(\[\{SELF\}, 2, 3, \?1\]\)=\[/);
  assert.doesNotMatch(execution.args[0], /ExecutionResult@/);
});
