export interface SnapshotExperimentResult {
  ok: boolean;
  restorationMode: "replay-verified";
  checkpoints: number[];
  stateSnapshots: Array<{
    schema: 2;
    kind: "nar-state-contract";
    restorationMode: "replay-verified";
    complete: false;
    checkpoint: number;
    cycle: number;
    inputHash: string;
    eventHash: string;
    stateDigest: string;
  }>;
  baseline: { cycles: number; events: Array<{ channel: string; text: string }> };
  resumed: { cycles: number; events: Array<{ channel: string; text: string }>; stateSnapshots: SnapshotExperimentResult["stateSnapshots"] };
  mismatches: unknown[];
}

export function runSnapshotExperiment(options?: {
  cycles?: number;
  checkpoints?: number[];
  input?: string;
}): Promise<SnapshotExperimentResult>;
