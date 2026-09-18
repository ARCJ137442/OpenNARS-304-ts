export type ChangeGateInput = {
  files?: string[];
  changedLines?: number;
  patch?: string;
  stage?: "none" | "023" | "024" | "integration" | "rc";
  scope?: "slice" | "responsibility";
  runtimeDependenciesChanged?: boolean;
};

export type ChangeGateResult = {
  tier: "T0" | "T1" | "T2";
  live_java_required: boolean;
  m1_minus_required: boolean;
  m1_minus_reasons: string[];
  source_files: number;
  changed_lines: number;
  reasons: string[];
  note: string;
};

export function classifyChangeGate(input?: ChangeGateInput): ChangeGateResult;
export function runtimeDependencyFingerprint(manifest: Record<string, unknown>): string;
