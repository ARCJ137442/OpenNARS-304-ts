export type ValidationCluster = {
  id: string;
  title: string;
  directTests: string[];
  affectedNals: string[];
};

export type ValidationPlan = {
  plan_valid: boolean;
  validation_profile: "slice" | "risk-slice" | "cluster-close" | "stage";
  selected_cluster: ValidationCluster | null;
  supporting_clusters: ValidationCluster[];
  touched_clusters: string[];
  unassigned_source_files: string[];
  multiply_assigned_source_files: string[];
  plan_errors: string[];
  direct_test_hints: string[];
  affected_nal_files: string[];
  common_commands: string[][];
  affected_nal_command: string[] | null;
  m1_minus_command: string[] | null;
  live_java_required: boolean;
  full_m1_required: boolean;
  strict_markerless_required: boolean;
};

export const VALIDATION_CLUSTERS: readonly Readonly<ValidationCluster>[];
export function validationClustersForFile(file: string): string[];
export function getValidationCluster(id: string): ValidationCluster | null;
export function buildValidationPlan(input?: {
  files?: string[];
  tier?: "T0" | "T1" | "T2";
  requestedClusterId?: string | null;
  closeCluster?: boolean;
  javaBaseline?: string | null;
  evidencePrefix?: string | null;
}): ValidationPlan;
