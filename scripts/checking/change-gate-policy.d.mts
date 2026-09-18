export type ChangeGateInput = {
  files?: string[];
  sourceChangedLines?: number;
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
  source_changed_lines: number;
  reasons: string[];
  note: string;
};

export function classifyChangeGate(input?: ChangeGateInput): ChangeGateResult;
export function isProductionSourceFile(file: string): boolean;
export function countProductionSourceLines(numstat: string): number;
export function runtimeDependencyFingerprint(manifest: Record<string, unknown>): string;
