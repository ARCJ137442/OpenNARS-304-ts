#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { performance } from "node:perf_hooks";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { Debug } from "../../src/main/Debug.ts";
import { Nar } from "../../src/main/Nar.ts";
import { createNodeRuntimeCapabilities } from "../../src/platform/node/SystemCommandCapabilities.ts";

const projectRoot = resolve(fileURLToPath(new URL("../..", import.meta.url)));

function parseArgs(argv) {
  const options = { cycles: 10, ticks: 200, reportEvery: 20, output: null };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--cycles") options.cycles = Number(argv[++index]);
    else if (argument === "--ticks") options.ticks = Number(argv[++index]);
    else if (argument === "--report-every") options.reportEvery = Number(argv[++index]);
    else if (argument === "--output") options.output = argv[++index];
    else if (argument === "--help" || argument === "-h") {
      console.error("usage: node scripts/e2e/run-demo-workload-benchmark.mjs [--cycles N] [--ticks N] [--report-every N] [--output PATH]");
      process.exit(0);
    } else throw new Error(`Unknown argument: ${argument}`);
  }
  for (const [name, value] of Object.entries(options).filter(([name]) => name !== "output")) {
    if (!Number.isInteger(value) || value < 1) throw new Error(`${name} must be a positive integer`);
  }
  return options;
}

function clamp(value, low, high) { return Math.min(high, Math.max(low, value)); }
function quantizeAngle(angle) { return Math.round(((angle + Math.PI) / (Math.PI * 2)) * 8); }
function quantile(values, fraction) {
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.max(0, Math.ceil(sorted.length * fraction) - 1)] ?? null;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  Debug.TEST = true;
  const nar = new Nar({ capabilities: createNodeRuntimeCapabilities() });
  let angle = 0.08;
  let angularVelocity = 0;
  let segmentStartedAt = performance.now();
  let segmentElapsed = [];
  let segmentStartConcepts = nar.memory.concepts.size();
  const segments = [];
  const allElapsed = [];

  for (let tick = 1; tick <= options.ticks; tick += 1) {
    const feedback = Math.abs(angle) <= 0.5 ? "<{SELF} --> [good]>. :|:" : "";
    const input = `<{SELF} --> [angle${quantizeAngle(angle)}]>. :|:\n<{SELF} --> [good]>! :|:`
      + (feedback ? `\n${feedback}` : "");
    const start = performance.now();
    nar.addInputText(input);
    nar.cycles(options.cycles);
    const elapsedMs = performance.now() - start;
    allElapsed.push(elapsedMs);
    segmentElapsed.push(elapsedMs);

    angle += angularVelocity;
    angularVelocity = clamp(angularVelocity + 0.2 * Math.sin(angle), -0.3, 0.3);
    if (angle > Math.PI) angle = -Math.PI;
    if (angle < -Math.PI) angle = Math.PI;

    if (tick % options.reportEvery === 0 || tick === options.ticks) {
      const endedAt = performance.now();
      const durationMs = endedAt - segmentStartedAt;
      const concepts = nar.memory.concepts.size();
      const cycles = segmentElapsed.length * options.cycles;
      segments.push({
        start_tick: tick - segmentElapsed.length + 1,
        end_tick: tick,
        ticks: segmentElapsed.length,
        duration_ms: Number(durationMs.toFixed(2)),
        tps: Number((segmentElapsed.length * 1000 / durationMs).toFixed(3)),
        rps: Number((cycles * 1000 / segmentElapsed.reduce((sum, value) => sum + value, 0)).toFixed(3)),
        median_step_ms: Number(quantile(segmentElapsed, 0.5).toFixed(3)),
        p95_step_ms: Number(quantile(segmentElapsed, 0.95).toFixed(3)),
        concepts,
        concepts_added: concepts - segmentStartConcepts,
        task_bags: {
          novel: nar.memory.novelTasks.size(),
          sequence: nar.memory.seq_current.size(),
          recent_operations: nar.memory.recent_operations.size(),
        },
        rss_bytes: process.memoryUsage().rss,
      });
      segmentStartedAt = endedAt;
      segmentElapsed = [];
      segmentStartConcepts = concepts;
    }
  }

  const summary = {
    schema: "opennars-304-ts/demo-workload-benchmark/v1",
    git_commit: execFileSync("git", ["rev-parse", "HEAD"], { cwd: projectRoot, encoding: "utf8" }).trim(),
    node: process.version,
    workload: "CartPole sensor-bin + recurring composite goal + upright feedback; one Nar instance; no babble/action",
    configuration: options,
    aggregate: {
      ticks: options.ticks,
      cycles: options.ticks * options.cycles,
      elapsed_ms: Number(allElapsed.reduce((sum, value) => sum + value, 0).toFixed(2)),
      median_step_ms: Number(quantile(allElapsed, 0.5).toFixed(3)),
      p95_step_ms: Number(quantile(allElapsed, 0.95).toFixed(3)),
      rps: Number((options.ticks * options.cycles * 1000 / allElapsed.reduce((sum, value) => sum + value, 0)).toFixed(3)),
      peak_rss_bytes: Math.max(...segments.map((segment) => segment.rss_bytes)),
    },
    segments,
  };
  if (options.output) {
    const output = resolve(options.output);
    await mkdir(resolve(output, ".."), { recursive: true });
    await writeFile(output, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  }
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => { console.error(error instanceof Error ? error.stack ?? error.message : error); process.exitCode = 1; });
