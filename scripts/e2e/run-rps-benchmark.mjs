#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { performance } from "node:perf_hooks";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { Debug } from "../../src/main/Debug.ts";
import { Nar } from "../../src/main/Nar.ts";
import { createNodeRuntimeCapabilities } from "../../src/platform/node/SystemCommandCapabilities.ts";

const projectRoot = resolve(fileURLToPath(new URL("../..", import.meta.url)));

function parseArgs(argv) {
  const options = { cycles: 100, warmupRuns: 2, repetitions: 20, input: "<{bird} --> [animal]>. :|:", output: null };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--cycles") options.cycles = Number(argv[++index]);
    else if (argument === "--warmup-runs") options.warmupRuns = Number(argv[++index]);
    else if (argument === "--repetitions") options.repetitions = Number(argv[++index]);
    else if (argument === "--input") options.input = argv[++index];
    else if (argument === "--output") options.output = argv[++index];
    else if (argument === "--help" || argument === "-h") {
      console.error("usage: node scripts/e2e/run-rps-benchmark.mjs [--cycles N] [--warmup-runs N] [--repetitions N] [--input NARSESE] [--output PATH]");
      process.exit(0);
    } else throw new Error(`Unknown argument: ${argument}`);
  }
  for (const [name, value] of Object.entries(options).filter(([name]) => name !== "input" && name !== "output")) {
    if (!Number.isInteger(value) || value < 0 || (name === "repetitions" && value < 1)) throw new Error(`${name} must be a valid integer`);
  }
  return options;
}

function percentile(values, fraction) {
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.max(0, Math.ceil(sorted.length * fraction) - 1)] ?? null;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  Debug.TEST = true;
  const nar = new Nar({ capabilities: createNodeRuntimeCapabilities() });
  const warmups = [];
  const samples = [];
  const totalRuns = options.warmupRuns + options.repetitions;
  for (let run = 0; run < totalRuns; run += 1) {
    const startedAt = performance.now();
    nar.addInputText(options.input);
    nar.cycles(options.cycles);
    const elapsedMs = performance.now() - startedAt;
    const sample = {
      run,
      warmup: run < options.warmupRuns,
      cycles: options.cycles,
      elapsed_ms: Number(elapsedMs.toFixed(3)),
      cycles_per_second: Number((options.cycles * 1000 / Math.max(elapsedMs, 0.001)).toFixed(3)),
      request_per_second: Number((1000 / Math.max(elapsedMs, 0.001)).toFixed(3)),
      rss_bytes: process.memoryUsage().rss,
    };
    (sample.warmup ? warmups : samples).push(sample);
  }
  const elapsed = samples.map((sample) => sample.elapsed_ms);
  const summary = {
    schema: "opennars-304-ts/rps-benchmark/v1",
    git_commit: execFileSync("git", ["rev-parse", "HEAD"], { cwd: projectRoot, encoding: "utf8" }).trim(),
    node: process.version,
    configuration: options,
    warmups,
    samples,
    aggregate: {
      repetitions: samples.length,
      median_latency_ms: percentile(elapsed, 0.5),
      p95_latency_ms: percentile(elapsed, 0.95),
      median_cycles_per_second: percentile(samples.map((sample) => sample.cycles_per_second), 0.5),
      p05_cycles_per_second: percentile(samples.map((sample) => sample.cycles_per_second), 0.05),
      median_request_per_second: percentile(samples.map((sample) => sample.request_per_second), 0.5),
      peak_rss_bytes: Math.max(...samples.map((sample) => sample.rss_bytes)),
    },
  };
  if (options.output) {
    const output = resolve(options.output);
    await mkdir(resolve(output, ".."), { recursive: true });
    await writeFile(output, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  }
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => { console.error(error instanceof Error ? error.stack ?? error.message : error); process.exitCode = 1; });
