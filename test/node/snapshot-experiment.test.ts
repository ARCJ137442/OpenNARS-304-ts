import test from "node:test";
import { mkdtemp, readdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import assert from "node:assert/strict";

import { recoverSnapshotCheckpoint, runSnapshotExperiment } from "../../scripts/e2e/run-snapshot-experiment.mjs";

test("checkpoint recovery stays consistent beyond 200 reasoning cycles", async () => {
  const checkpointDirectory = await mkdtemp(join(tmpdir(), "opennars-long-recovery-"));
  try {
    const result = await runSnapshotExperiment({
      cycles: 360,
      checkpoints: [50, 200, 350],
      checkpointDirectory,
    });
    assert.equal(result.ok, true);
    assert.deepEqual(result.mismatches, []);
    assert.deepEqual(result.checkpoints, [50, 200, 350]);
    assert.equal(result.restorationMode, "replay-verified");
    assert.equal(result.stateSnapshots.length, 3);
    assert.deepEqual(result.stateSnapshots.map((snapshot) => snapshot.cycle), [50, 200, 350]);
    assert.match(result.stateSnapshots[0].stateDigest, /^[0-9a-f]{64}$/);
    assert.equal(result.stateSnapshots[0].complete, false);
    assert.equal(result.stateSnapshots[0].fixtureSha256, result.stateSnapshots[0].inputHash);
    assert.equal(result.stateSnapshots[0].javaArtifactSha256, null);
    assert.deepEqual(result.stateSnapshots[0].runner, {
      engine: "ts",
      tsMode: "in-process",
      cycleTarget: 360,
      checkpoints: [50, 200, 350],
    });
    assert.equal(result.baseline.finalStateDigest, result.finalStateDigest);
    assert.equal(result.resumed.finalStateDigest, result.baseline.finalStateDigest);

    for (const snapshot of result.stateSnapshots) {
      const recovered = await recoverSnapshotCheckpoint(
        join(checkpointDirectory, `nar-${snapshot.checkpoint}.json`),
        { cycles: 360 },
      );
      assert.deepEqual(
        recovered.events,
        result.baseline.events.slice(snapshot.eventCount),
      );
      assert.equal(recovered.finalStateDigest, result.baseline.finalStateDigest);
    }
  } finally {
    await rm(checkpointDirectory, { recursive: true, force: true });
  }
});

test("snapshot experiment rejects an endpoint checkpoint", async () => {
  await assert.rejects(
    () => runSnapshotExperiment({ cycles: 4, checkpoints: [0, 4] }),
    /checkpoint must be between 1 and cycles/,
  );
});

test("snapshot experiment preserves checkpoint manifests for process recovery", async () => {
  const checkpointDirectory = await mkdtemp(join(tmpdir(), "opennars-persisted-checkpoints-"));
  try {
    const result = await runSnapshotExperiment({
      cycles: 240,
      checkpoints: [50, 100, 200],
      checkpointDirectory,
    });
    assert.equal(result.checkpointDirectory, checkpointDirectory);
    assert.deepEqual(
      (await readdir(checkpointDirectory)).sort(),
      ["nar-100.json", "nar-200.json", "nar-50.json"],
    );
  } finally {
    await rm(checkpointDirectory, { recursive: true, force: true });
  }
});

test("a fresh recovery entry point matches the zero-run tail and final state", async () => {
  const checkpointDirectory = await mkdtemp(join(tmpdir(), "opennars-fresh-recovery-"));
  try {
    const baseline = await runSnapshotExperiment({
      cycles: 240,
      checkpoints: [50, 100, 200],
      checkpointDirectory,
    });
    const recovered = await recoverSnapshotCheckpoint(
      join(checkpointDirectory, "nar-200.json"),
      { input: "<a --> b>.\n<b --> c>.\n<a --> c>?\n", cycles: 240 },
    );
    assert.equal(recovered.ok, true);
    assert.deepEqual(recovered.events, baseline.baseline.events.slice(baseline.stateSnapshots.at(-1)?.eventCount ?? 0));
    assert.equal(recovered.finalStateDigest, baseline.baseline.finalStateDigest);
  } finally {
    await rm(checkpointDirectory, { recursive: true, force: true });
  }
});
