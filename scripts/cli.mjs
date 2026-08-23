import { readFile } from "node:fs/promises";
import { performance } from "node:perf_hooks";
import { resolve } from "node:path";

import { OutputHandler } from "../src/io/events/OutputHandler.ts";
import { Nar } from "../src/main/Nar.ts";
import { Debug } from "../src/main/Debug.ts";

// Match java-master's NALTest static setup: deterministic occurrence times.
Debug.TEST = true;

function parseArgs(argv) {
  let cycles = 1550;
  const files = [];
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--cycles") {
      cycles = Number(argv[++index]);
    } else if (argument === "--help" || argument === "-h") {
      console.error("usage: node scripts/cli.mjs [--cycles N] <nal-file>...");
      process.exit(0);
    } else {
      files.push(resolve(argument));
    }
  }
  if (!Number.isInteger(cycles) || cycles < 1) {
    throw new Error("--cycles must be a positive integer");
  }
  if (files.length === 0) {
    throw new Error("at least one NAL file is required");
  }
  return { cycles, files };
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

function failureText(failure) {
  const summary = String(failure);
  const stack = failure?.stack;
  return stack && !stack.includes(summary) ? `${summary}\n${stack}` : stack ?? summary;
}

async function runFile(file, cycles) {
  const expectations = extractExpectations(await readFile(file, "utf8"));
  const matched = new Array(expectations.length).fill(false);
  const markerTimeMs = new Array(expectations.length).fill(null);
  let error = null;

  try {
    const nar = new Nar();
    const startedAt = performance.now();
    const outputChannel = OutputHandler.OUT.class;
    const executeChannel = OutputHandler.EXE.class;
    const observer = {
      event(channel, args) {
        if (channel !== outputChannel && channel !== executeChannel) return;
        const signal = args[0];
        const text = signalText(signal, nar);
        for (let index = 0; index < expectations.length; index += 1) {
          if (!matched[index] && text.includes(expectations[index])) {
            matched[index] = true;
            markerTimeMs[index] = performance.now() - startedAt;
          }
        }
      },
    };
    nar.on(outputChannel, observer);
    nar.on(executeChannel, observer);
    nar.addInputFile(file);
    nar.cycles(cycles);
  } catch (failure) {
    error = failureText(failure);
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
    ...(error ? { error } : {}),
  };
}

async function main() {
  const { cycles, files } = parseArgs(process.argv.slice(2));
  for (const file of files) {
    console.log(JSON.stringify(await runFile(file, cycles)));
  }
}

main().catch((error) => {
  console.error(error.stack ?? error);
  process.exitCode = 1;
});
