import test from "node:test";
import assert from "node:assert/strict";

import { runSnapshotExperiment } from "../../scripts/e2e/run-snapshot-experiment.mjs";

test("checkpoint replay recovery matches uninterrupted execution", async () => {
  const result = await runSnapshotExperiment({ cycles: 8, checkpoints: [2, 4, 6] });
  assert.equal(result.ok, true);
  assert.deepEqual(result.mismatches, []);
  assert.deepEqual(result.checkpoints, [2, 4, 6]);
});

test("snapshot experiment rejects an endpoint checkpoint", async () => {
  await assert.rejects(
    () => runSnapshotExperiment({ cycles: 4, checkpoints: [0, 4] }),
    /checkpoint must be between 1 and cycles/,
  );
});
