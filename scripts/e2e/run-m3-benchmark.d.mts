export declare function median(values: number[]): number | null;
export declare function percentile(values: number[], percentileValue: number): number | null;
export declare function statistics(values: number[]): {
  count: number;
  min: number | null;
  median: number | null;
  p95: number | null;
  p95_exploratory: number | null;
  p95_qualified: boolean;
  max: number | null;
  values: number[];
};
export interface BenchmarkRunRow {
  functional_pass?: boolean;
  parity?: boolean;
  both_wrong?: boolean;
  reasoning_cycles?: number;
  java?: { duration_ms?: number; resource_metrics?: Record<string, unknown> | null };
  ts?: { duration_ms?: number; resource_metrics?: Record<string, unknown> | null };
  [key: string]: unknown;
}
export interface BenchmarkRun {
  warmup?: boolean;
  repetition?: number;
  row?: BenchmarkRunRow;
  [key: string]: unknown;
}
export interface EngineObservation {
  reasoning_cycles: ReturnType<typeof statistics>;
  wall_ms: ReturnType<typeof statistics>;
  cycles_per_second: ReturnType<typeof statistics>;
  wall_ms_per_1024_cycles: ReturnType<typeof statistics>;
  process_cpu_ms: ReturnType<typeof statistics>;
  peak_rss_bytes: ReturnType<typeof statistics>;
  marker_time_ms: unknown[][];
  resource_sources: string[];
  rss_observations: number;
}
export interface BenchmarkSampleSummary {
  file: string;
  repetitions: number;
  functional_pass_all: boolean;
  parity_pass_all: boolean;
  ts_to_java_wall_ratio: ReturnType<typeof statistics>;
  java: EngineObservation;
  ts: EngineObservation;
  runs: BenchmarkRun[];
}
export declare function sampleSummary(file: string, runs: BenchmarkRun[]): BenchmarkSampleSummary;
export declare function parseArgs(argv: string[]): {
  files: string[];
  warmupRuns: number;
  repetitions: number;
  [key: string]: unknown;
};
