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
export declare function parseArgs(argv: string[]): {
  files: string[];
  warmupRuns: number;
  repetitions: number;
  [key: string]: unknown;
};
