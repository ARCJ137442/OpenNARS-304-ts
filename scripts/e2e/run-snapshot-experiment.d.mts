export interface SnapshotExperimentResult {
  ok: boolean;
  checkpoints: number[];
  baseline: { cycles: number; events: Array<{ channel: string; text: string }> };
  resumed: { cycles: number; events: Array<{ channel: string; text: string }> };
  mismatches: unknown[];
}

export function runSnapshotExperiment(options?: {
  cycles?: number;
  checkpoints?: number[];
  input?: string;
}): Promise<SnapshotExperimentResult>;
