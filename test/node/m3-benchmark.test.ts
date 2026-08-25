import assert from "node:assert/strict";
import test from "node:test";

import { median, percentile, statistics, parseArgs } from "../../scripts/e2e/run-m3-benchmark.mjs";

test("M3 benchmark statistics use median and nearest-rank p95", () => {
  assert.equal(median([5, 1, 3]), 3);
  assert.equal(median([1, 5]), 3);
  assert.equal(percentile([5, 1, 3, 2], 0.95), 5);
  assert.deepEqual(statistics([5, 1, 3]), {
    count: 3,
    min: 1,
    median: 3,
    p95: 5,
    max: 5,
    values: [5, 1, 3],
  });
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
