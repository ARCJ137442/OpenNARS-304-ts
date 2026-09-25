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
    eventCount: number;
    stateDigest: string;
    runner: {
      engine: "ts";
      tsMode: "in-process";
      cycleTarget: number;
      checkpoints: number[];
    };
  }>;
  baseline: { cycles: number; events: Array<{ channel: string; text: string }> };
  resumed: { cycles: number; events: Array<{ channel: string; text: string }>; stateSnapshots: SnapshotExperimentResult["stateSnapshots"]; finalStateDigest: string };
  finalStateDigest: string;
  mismatches: unknown[];
}

export function runSnapshotExperiment(options?: {
  cycles?: number;
  checkpoints?: number[];
  input?: string;
  checkpointDirectory?: string;
}): Promise<SnapshotExperimentResult>;

export function recoverSnapshotCheckpoint(snapshotPath: string, options: { input?: string; cycles: number }): Promise<{
  ok: true;
  checkpoint: number;
  events: Array<{ channel: string; text: string }>;
  finalStateDigest: string;
}>;
