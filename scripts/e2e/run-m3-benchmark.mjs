#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { performance } from "node:perf_hooks";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(fileURLToPath(new URL("../..", import.meta.url)));
const runner = join(projectRoot, "scripts", "e2e", "run-nal-corpus.mjs");
const defaultJavaRoot = resolve(projectRoot, "..", "OpenNARS-304-java-canonical-fixed-build");
const defaultJavaJar = join(defaultJavaRoot, "target", "opennars-3.0.4-SNAPSHOT.jar");
const defaultJavaClasses = join(defaultJavaRoot, "target", "classes");
const defaultJavaTestClasses = join(defaultJavaRoot, "target", "test-classes");
const defaultTsCli = join(projectRoot, "dist", "cli.mjs");

function parseArgs(argv) {
  const options = {
    cycles: 1550,
    timeoutMs: 30000,
    processLimitMs: 300000,
    warmupRuns: 0,
    repetitions: 1,
    javaJar: defaultJavaJar,
    javaClasses: defaultJavaClasses,
    javaTestClasses: defaultJavaTestClasses,
    tsCli: defaultTsCli,
    output: null,
    files: [],
  };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--cycles") options.cycles = Number(argv[++index]);
    else if (argument === "--timeout-ms") options.timeoutMs = Number(argv[++index]);
    else if (argument === "--process-limit-ms") options.processLimitMs = Number(argv[++index]);
    else if (argument === "--warmup-runs") options.warmupRuns = Number(argv[++index]);
    else if (argument === "--repetitions") options.repetitions = Number(argv[++index]);
    else if (argument === "--java-jar") options.javaJar = argv[++index];
    else if (argument === "--java-classes") options.javaClasses = argv[++index];
    else if (argument === "--java-test-classes") options.javaTestClasses = argv[++index];
    else if (argument === "--ts-cli") options.tsCli = argv[++index];
    else if (argument === "--output") options.output = argv[++index];
    else if (argument === "--file") options.files.push(argv[++index]);
    else if (argument === "--help" || argument === "-h") {
      console.error("usage: node scripts/e2e/run-m3-benchmark.mjs --file PATH [--file PATH ...] [options]");
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }
  const positiveIntegers = [
    ["--cycles", options.cycles],
    ["--timeout-ms", options.timeoutMs],
    ["--process-limit-ms", options.processLimitMs],
    ["--warmup-runs", options.warmupRuns],
    ["--repetitions", options.repetitions],
  ];
  for (const [name, value] of positiveIntegers) {
    if (!Number.isInteger(value) || value < 0 || (name !== "--warmup-runs" && value < 1)
      || (name === "--repetitions" && value < 1)) {
      throw new Error(`${name} must be a valid positive integer`);
    }
  }
  if (options.files.length === 0) throw new Error("at least one --file PATH is required");
  return options;
}

function median(values) {
  if (values.length === 0) return null;
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
}

function percentile(values, percentileValue) {
  if (values.length === 0) return null;
  const sorted = [...values].sort((left, right) => left - right);
  const rank = Math.max(1, Math.ceil(sorted.length * percentileValue));
  return sorted[rank - 1];
}

function numericValues(values) {
  return values.filter((value) => Number.isFinite(value));
}

function statistics(values) {
  const numeric = numericValues(values);
  return {
    count: numeric.length,
    min: numeric.length === 0 ? null : Math.min(...numeric),
    median: median(numeric),
    p95: percentile(numeric, 0.95),
    max: numeric.length === 0 ? null : Math.max(...numeric),
    values: numeric,
  };
}

function javaHash(path) {
  return createHash("sha256").update(readFileSync(resolve(path))).digest("hex").toUpperCase();
}

function commandOutput(command, args) {
  const result = spawnSync(command, args, { cwd: projectRoot, encoding: "utf8", windowsHide: true });
  return `${result.stdout ?? ""}${result.stderr ?? ""}`.trim();
}

function runOne(options, file, repetition, warmup) {
  const tempDirectory = mkdtempSync(join(tmpdir(), "opennars-m3-benchmark-"));
  const resultFile = join(tempDirectory, "result.jsonl");
  const args = [
    runner,
    "--engine", "parity",
    "--cycles", String(options.cycles),
    "--timeout-ms", String(options.timeoutMs),
    "--process-limit-ms", String(options.processLimitMs),
    "--ts-mode", "cold",
    "--ts-cli", resolve(options.tsCli),
    "--chunk-size", "1",
    "--resource-metrics",
    "--java-jar", resolve(options.javaJar),
    "--java-classes", resolve(options.javaClasses),
    "--java-test-classes", resolve(options.javaTestClasses),
    "--result-file", resultFile,
    "--file", resolve(file),
  ];
  const startedAt = performance.now();
  let processResult;
  try {
    processResult = spawnSync(process.execPath, args, {
      cwd: projectRoot,
      encoding: "utf8",
      windowsHide: true,
      maxBuffer: 16 * 1024 * 1024,
    });
    const lines = readFileSync(resultFile, "utf8").split(/\r?\n/).filter(Boolean);
    const row = lines.length === 0 ? null : JSON.parse(lines.at(-1));
    return {
      file: resolve(file),
      repetition,
      warmup,
      runner_exit_code: processResult.status,
      runner_wall_ms: performance.now() - startedAt,
      row,
      stderr: processResult.stderr?.trim() || null,
    };
  } catch (error) {
    return {
      file: resolve(file),
      repetition,
      warmup,
      runner_exit_code: processResult?.status ?? null,
      runner_wall_ms: performance.now() - startedAt,
      row: null,
      error: error instanceof Error ? error.message : String(error),
      stderr: processResult?.stderr?.trim() || null,
    };
  } finally {
    rmSync(tempDirectory, { recursive: true, force: true });
  }
}

function engineObservation(runs, engine) {
  const official = runs.filter((run) => !run.warmup);
  const rows = official.map((run) => run.row?.[engine]).filter((row) => row !== null && row !== undefined);
  const resource = rows.map((row) => row.resource_metrics ?? null);
  const cpu = resource.map((metrics) => {
    if (metrics === null) return null;
    if (Number.isFinite(metrics.process_cpu_ms)) return metrics.process_cpu_ms;
    if (Number.isFinite(metrics.user_cpu_ms) || Number.isFinite(metrics.system_cpu_ms)) {
      return (metrics.user_cpu_ms ?? 0) + (metrics.system_cpu_ms ?? 0);
    }
    return null;
  });
  const rss = resource.map((metrics) => metrics?.peak_rss_bytes ?? null);
  return {
    wall_ms: statistics(rows.map((row) => row.duration_ms)),
    process_cpu_ms: statistics(cpu),
    peak_rss_bytes: statistics(rss),
    marker_time_ms: rows.map((row) => row.marker_time_ms ?? []),
    resource_sources: [...new Set(resource.map((metrics) => metrics?.source).filter(Boolean))],
    rss_observations: rss.filter((value) => Number.isFinite(value)).length,
  };
}

function sampleSummary(file, runs) {
  const official = runs.filter((run) => !run.warmup);
  const functional = official.every((run) => run.row?.functional_pass === true);
  const parity = official.every((run) => run.row?.parity === true && run.row?.both_wrong !== true);
  return {
    file: resolve(file),
    repetitions: official.length,
    functional_pass_all: functional,
    parity_pass_all: parity,
    java: engineObservation(runs, "java"),
    ts: engineObservation(runs, "ts"),
    runs,
  };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const runsByFile = new Map();
  for (const file of options.files) {
    const runs = [];
    for (let repetition = 0; repetition < options.warmupRuns + options.repetitions; repetition += 1) {
      runs.push(runOne(options, file, repetition, repetition < options.warmupRuns));
    }
    runsByFile.set(resolve(file), sampleSummary(file, runs));
  }
  const summary = {
    schema: "opennars-304-ts/m3-benchmark/v1",
    git_commit: commandOutput("git", ["rev-parse", "HEAD"]),
    node: process.version,
    java_version: commandOutput("java", ["-version"]),
    platform: process.platform,
    architecture: process.arch,
    configuration: {
      cycles: options.cycles,
      timeout_ms: options.timeoutMs,
      process_limit_ms: options.processLimitMs,
      warmup_runs: options.warmupRuns,
      repetitions: options.repetitions,
      thread_mode: "single",
      ts_mode: "cold",
      ts_cli: resolve(options.tsCli),
      java_jar: resolve(options.javaJar),
      java_jar_sha256: javaHash(options.javaJar),
      resource_metrics: true,
    },
    samples: [...runsByFile.values()],
    all_functional_pass: [...runsByFile.values()].every((sample) => sample.functional_pass_all),
    all_parity_pass: [...runsByFile.values()].every((sample) => sample.parity_pass_all),
    rss_status: "TypeScript reports peak RSS; Java adapter reports RSS unavailable and a committed-virtual-memory proxy.",
  };
  if (options.output !== null) writeFileSync(resolve(options.output), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(summary, null, 2));
  if (!summary.all_functional_pass || !summary.all_parity_pass) process.exitCode = 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();

export { median, percentile, statistics, parseArgs, sampleSummary };
