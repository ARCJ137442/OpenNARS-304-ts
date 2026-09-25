export interface SnapshotExperimentResult {
  ok: boolean;
  restorationMode: "replay-verified";
  checkpoints: number[];
  checkpointDirectory: string | null;
  stateSnapshots: Array<{
    schema: 2;
    kind: "nar-state-contract";
    restorationMode: "replay-verified";
    complete: false;
    checkpoint: number;
    cycle: number;
    inputHash: string;
    fixtureSha256: string;
    javaArtifactSha256: string | null;
    eventHash: string;
    stateDigest: string;
    runner: {
      engine: "ts";
      tsMode: "in-process";
      cycleTarget: number;
      checkpoints: number[];
    };
  }>;
  baseline: { cycles: number; events: Array<{ channel: string; text: string }> };
  resumed: { cycles: number; events: Array<{ channel: string; text: string }>; stateSnapshots: SnapshotExperimentResult["stateSnapshots"] };
  mismatches: unknown[];
}

export function runSnapshotExperiment(options?: {
  cycles?: number;
  checkpoints?: number[];
  input?: string;
  checkpointDirectory?: string;
}): Promise<SnapshotExperimentResult>;
