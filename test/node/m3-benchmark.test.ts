import assert from "node:assert/strict";
import test from "node:test";

import { median, percentile, statistics, parseArgs, sampleSummary } from "../../scripts/e2e/run-m3-benchmark.mjs";

test("M3 benchmark statistics use median and nearest-rank p95", () => {
  assert.equal(median([5, 1, 3]), 3);
  assert.equal(median([1, 5]), 3);
  assert.equal(percentile([5, 1, 3, 2], 0.95), 5);
  assert.deepEqual(statistics([5, 1, 3]), {
    count: 3,
    min: 1,
    median: 3,
    p95: null,
    p95_exploratory: 5,
    p95_qualified: false,
    max: 5,
    values: [5, 1, 3],
  });
});

test("M3 benchmark exposes normalized throughput and marks qualified p95", () => {
  const runs = Array.from({ length: 20 }, (_, repetition) => ({
    warmup: false,
    repetition,
    row: {
      functional_pass: true,
      parity: true,
      both_wrong: false,
      java: { duration_ms: 100, resource_metrics: null },
      ts: { duration_ms: 500, resource_metrics: null },
      reasoning_cycles: 100,
    },
  }));
  const summary = sampleSummary("sample.nal", runs);
  assert.equal(summary.java.wall_ms_per_1024_cycles.median, 1024);
  assert.equal(summary.ts.wall_ms_per_1024_cycles.median, 5120);
  assert.equal(summary.ts.cycles_per_second.median, 200);
  assert.equal(summary.ts_to_java_wall_ratio.median, 5);
  assert.equal(summary.ts.wall_ms.p95, 500);
  assert.equal(summary.ts.wall_ms.p95_qualified, true);
});

test("M3 benchmark requires explicit files and accepts serial repetition settings", () => {
  const options = parseArgs([
    "--file", "sample.nal",
    "--warmup-runs", "1",
    "--repetitions", "3",
  ]);
  assert.deepEqual(options.files, ["sample.nal"]);
  assert.equal(options.warmupRuns, 1);
  assert.equal(options.repetitions, 3);
  assert.throws(() => parseArgs(["--repetitions", "0", "--file", "sample.nal"]), /--repetitions/);
  assert.throws(() => parseArgs([]), /at least one --file PATH/);
});
