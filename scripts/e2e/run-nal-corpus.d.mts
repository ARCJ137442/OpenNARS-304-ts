export interface NalRunnerRow {
    [key: string]: unknown;
    file?: string;
    error?: string;
    error_type?: string;
    passed?: number;
    matched?: boolean[];
    ok?: boolean;
    exception?: boolean;
    timed_out?: boolean;
    marker_missing?: boolean;
    process_limited?: boolean;
    stall_detected?: boolean;
    timeout_reason?: string;
    long_cycle_equivalence: NalLongCycleEquivalence;
    java: NalEngineRow;
    ts: NalEngineRow;
}

export interface NalEngineRow {
    [key: string]: unknown;
    expected?: number;
    marker_missing?: boolean;
    marker_missing_count?: number;
}

export interface NalLongCycleEquivalence {
    [key: string]: unknown;
    marker_standard: string;
    internal_event_standard: string;
    equivalence_route: string;
    status: string;
    equivalent: boolean;
}

export function appendCheckpoint(...args: unknown[]): unknown;
export function assertUniqueFiles(...args: unknown[]): void;
export function completeProcessFailureRows(...args: unknown[]): NalRunnerRow[];
export function classifyTimeoutObservation(...args: unknown[]): NalRunnerRow;
export function evaluateMarkerPerformance(...args: unknown[]): NalRunnerRow;
export function evaluateLongCycleEquivalence(...args: unknown[]): NalRunnerRow;
export function evaluateRuntimePerformance(...args: unknown[]): NalRunnerRow;
export function evaluateRow(...args: unknown[]): NalRunnerRow;
export function extractNalMetadata(...args: unknown[]): NalRunnerRow;
export function isProcessTimeout(...args: unknown[]): boolean;
export function loadCheckpoint(...args: unknown[]): NalRunnerRow[];
export function normalizeResult(...args: unknown[]): NalRunnerRow;
export function parseArgs(...args: unknown[]): Record<string, unknown>;
export function parseProgressLine(...args: unknown[]): NalRunnerRow | null;
export function isProgressHeartbeat(...args: unknown[]): boolean;
export function runTs(...args: unknown[]): Promise<NalRunnerRow[]>;
export function parseJsonLines(...args: unknown[]): NalRunnerRow[];
