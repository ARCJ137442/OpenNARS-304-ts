export interface NalClassification {
    [key: string]: unknown;
    error_type: string;
    root_cause_cluster: string;
    functional_pass?: boolean;
    parity?: boolean;
    timed_out?: boolean;
    process_limited?: boolean;
    hypothesis: {
        status: string;
        next_experiment: string;
        [key: string]: unknown;
    };
    long_budget_evidence: Record<string, unknown> | null;
}

export const CLUSTER_CATALOG: Record<string, unknown>;
export function buildSummary(...args: unknown[]): Record<string, unknown>;
export function classify(...args: unknown[]): NalClassification;
export function parseArgs(...args: unknown[]): Record<string, unknown>;
export function primaryErrorType(...args: unknown[]): string;
