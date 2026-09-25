import test from "node:test";
import assert from "node:assert/strict";

import { runSnapshotExperiment } from "../../scripts/e2e/run-snapshot-experiment.mjs";

test("checkpoint recovery stays consistent beyond 200 reasoning cycles", async () => {
  const result = await runSnapshotExperiment({ cycles: 240, checkpoints: [50, 100, 200] });
  assert.equal(result.ok, true);
  assert.deepEqual(result.mismatches, []);
  assert.deepEqual(result.checkpoints, [50, 100, 200]);
  assert.equal(result.restorationMode, "replay-verified");
  assert.equal(result.stateSnapshots.length, 3);
  assert.deepEqual(result.stateSnapshots.map((snapshot) => snapshot.cycle), [50, 100, 200]);
  assert.match(result.stateSnapshots[0].stateDigest, /^[0-9a-f]{64}$/);
  assert.equal(result.stateSnapshots[0].complete, false);
});

test("snapshot experiment rejects an endpoint checkpoint", async () => {
  await assert.rejects(
    () => runSnapshotExperiment({ cycles: 4, checkpoints: [0, 4] }),
    /checkpoint must be between 1 and cycles/,
  );
});
