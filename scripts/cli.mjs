#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { performance } from "node:perf_hooks";
import { resolve } from "node:path";

import { OutputHandler } from "../src/io/events/OutputHandler.ts";
import { Events } from "../src/io/events/Events.ts";
import { Nar } from "../src/main/Nar.ts";
import { Debug } from "../src/main/Debug.ts";

// Match java-master's NALTest static setup: deterministic occurrence times.
Debug.TEST = true;

function parseArgs(argv) {
  let cycles = 1550;
  let progressInterval = 0;
  const files = [];
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--cycles") {
      cycles = Number(argv[++index]);
    } else if (argument === "--progress-interval") {
      progressInterval = Number(argv[++index]);
    } else if (argument === "--help" || argument === "-h") {
      console.error("usage: node scripts/cli.mjs [--cycles N] [--progress-interval N] <nal-file>...");
      process.exit(0);
    } else {
      files.push(resolve(argument));
    }
  }
  if (!Number.isInteger(cycles) || cycles < 1) {
    throw new Error("--cycles must be a positive integer");
  }
  if (!Number.isInteger(progressInterval) || progressInterval < 0) {
    throw new Error("--progress-interval must be a non-negative integer");
  }
  if (files.length === 0) {
    throw new Error("at least one NAL file is required");
  }
  return { cycles, progressInterval, files };
}

function extractExpectations(source) {
  const marker = "''outputMustContain('";
  const expectations = [];
  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line.startsWith(marker) && line.endsWith("')")) {
      expectations.push(line.slice(marker.length, -2));
    }
  }
  return expectations;
}

function taskText(task, nar) {
  return String(task.sentence.toString(nar, true));
}

function signalText(signal, nar) {
  if (signal?.sentence) return taskText(signal, nar);
  try {
    if (typeof signal?.getKey === "function") return String(signal.getKey());
  } catch {
    // Some Java-translated display methods still assume Java String values.
  }
  try {
    return String(signal);
  } catch {
    return "";
  }
}

function createResourceMetrics() {
  if (process.env.OPENNARS_RESOURCE_METRICS !== "1") return null;
  const startUsage = process.resourceUsage();
  let peakRssBytes = process.memoryUsage().rss;
  const sample = () => {
    peakRssBytes = Math.max(peakRssBytes, process.memoryUsage().rss);
  };
  return {
    sample,
    finish() {
      sample();
      const endUsage = process.resourceUsage();
      return {
        source: "node-process",
        user_cpu_ms: (endUsage.userCPUTime - startUsage.userCPUTime) / 1000,
        system_cpu_ms: (endUsage.systemCPUTime - startUsage.systemCPUTime) / 1000,
        peak_rss_bytes: peakRssBytes,
      };
    },
  };
}

function failureText(failure) {
  const summary = String(failure);
  const stack = failure?.stack;
  return stack && !stack.includes(summary) ? `${summary}\n${stack}` : stack ?? summary;
}

function emitProgress(file, cycle, kind = "cycle") {
  process.stderr.write(`@progress ${JSON.stringify({ file, cycle, kind })}\n`);
}

async function runFile(file, cycles, progressInterval) {
  let source;
  try {
    source = await readFile(file, "utf8");
  } catch (failure) {
    const errorType = failure?.code === "ENOENT"
      ? "file_not_found"
      : failure?.code === "EILSEQ"
        ? "file_encoding"
        : "file_read";
    return {
      file,
      cycles,
      expected: 0,
      passed: 0,
      matched: [],
      ok: false,
      error_type: errorType,
      exception: true,
      timed_out: false,
      thread_mode: "single",
      marker_missing: false,
      marker_missing_count: 0,
      marker_time_ms: [],
      error: failureText(failure),
    };
  }
  const expectations = extractExpectations(source);
  const matched = new Array(expectations.length).fill(false);
  const markerTimeMs = new Array(expectations.length).fill(null);
  let cycleCount = 0;
  let lastCommandCycle = -1;
  let error = null;
  let runtimeMetrics = null;
  let resourceMetrics = null;

  try {
    const nar = new Nar();
    const startedAt = performance.now();
    resourceMetrics = createResourceMetrics();
    const outputChannel = OutputHandler.OUT.class;
    const executeChannel = OutputHandler.EXE.class;
    const observer = {
      event(channel, args) {
        if (channel === Events.CycleEnd.class) {
          cycleCount += 1;
          if (resourceMetrics !== null && (cycleCount % 256 === 0 || cycleCount === cycles)) {
            resourceMetrics.sample();
          }
          if (progressInterval > 0 && (cycleCount % progressInterval === 0 || cycleCount === cycles)) {
            emitProgress(file, cycleCount);
          }
          return;
        }
        if (channel !== outputChannel && channel !== executeChannel) return;
        if (progressInterval > 0 && lastCommandCycle !== cycleCount) {
          lastCommandCycle = cycleCount;
          emitProgress(file, cycleCount, "command");
        }
        const signal = args[0];
        const text = signalText(signal, nar);
        for (let index = 0; index < expectations.length; index += 1) {
          if (!matched[index] && text.includes(expectations[index])) {
            matched[index] = true;
            markerTimeMs[index] = performance.now() - startedAt;
            if (progressInterval > 0) emitProgress(file, cycleCount, "marker");
          }
        }
      },
    };
    nar.on(outputChannel, observer);
    nar.on(executeChannel, observer);
    nar.on(Events.CycleEnd.class, observer);
    nar.addInputText(source);
    nar.cycles(cycles);
    runtimeMetrics = resourceMetrics?.finish() ?? null;
  } catch (failure) {
    error = failureText(failure);
    runtimeMetrics = resourceMetrics?.finish() ?? null;
  }

  const passed = matched.filter(Boolean).length;
  const ok = expectations.length === passed;
  return {
    file,
    cycles,
    expected: expectations.length,
    passed,
    matched,
    ok,
    error_type: error ? "exception" : "none",
    exception: Boolean(error),
    timed_out: false,
    thread_mode: "single",
    marker_missing: passed < expectations.length,
    marker_missing_count: expectations.length - passed,
    marker_time_ms: markerTimeMs,
    ...(runtimeMetrics === null ? {} : { resource_metrics: runtimeMetrics }),
    ...(error ? { error } : {}),
  };
}

async function main() {
  const { cycles, progressInterval, files } = parseArgs(process.argv.slice(2));
  for (const file of files) {
    const result = await runFile(file, cycles, progressInterval);
    console.log(JSON.stringify(result));
    if (result.error_type.startsWith("file_")) process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error.stack ?? error);
  process.exitCode = 1;
});
