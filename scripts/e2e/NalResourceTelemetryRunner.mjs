import { readFileSync, writeFileSync } from "node:fs";
import { performance } from "node:perf_hooks";
import { java } from "jree";
import { OutputHandler } from "../../src/io/events/OutputHandler.ts";
import { Events } from "../../src/io/events/Events.ts";
import { Debug } from "../../src/main/Debug.ts";
import { Nar } from "../../src/main/Nar.ts";

function parseArgs(argv) {
  let file = null;
  let chunk = 1024;
  let maxCycles = null;
  let rssLimitMb = 1800;
  let output = null;
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--chunk") chunk = Number(argv[++index]);
    else if (argument === "--max-cycles") maxCycles = Number(argv[++index]);
    else if (argument === "--rss-limit-mb") rssLimitMb = Number(argv[++index]);
    else if (argument === "--output") output = argv[++index];
    else if (argument === "--help" || argument === "-h") {
      console.error("usage: node --import ./scripts/register-ts-loader.mjs scripts/e2e/NalResourceTelemetryRunner.mjs [--chunk N] [--max-cycles N] [--rss-limit-mb N] [--output FILE] <nal-file>");
      process.exit(0);
    } else if (file === null) file = argument;
    else throw new Error(`unexpected argument: ${argument}`);
  }
  if (file === null) throw new Error("a nal file is required");
  if (!Number.isInteger(chunk) || chunk < 1) throw new Error("--chunk must be a positive integer");
  if (maxCycles !== null && (!Number.isInteger(maxCycles) || maxCycles < 1)) {
    throw new Error("--max-cycles must be a positive integer");
  }
  if (!Number.isFinite(rssLimitMb) || rssLimitMb < 256) throw new Error("--rss-limit-mb must be at least 256");
  return { file, chunk, maxCycles, rssLimitMb, output };
}

function sizeOf(value) {
  return value === null || value === undefined || typeof value.size !== "function" ? 0 : Number(value.size());
}

function countConceptState(nar) {
  const totals = {
    concepts: 0,
    task_links: 0,
    term_links: 0,
    beliefs: 0,
    desires: 0,
    questions: 0,
    quests: 0,
  };
  const iterator = nar.memory.iterator();
  while (iterator.hasNext()) {
    const concept = iterator.next();
    totals.concepts += 1;
    totals.task_links += sizeOf(concept.taskLinks);
    totals.term_links += sizeOf(concept.termLinks);
    totals.beliefs += sizeOf(concept.beliefs);
    totals.desires += sizeOf(concept.desires);
    totals.questions += sizeOf(concept.questions);
    totals.quests += sizeOf(concept.quests);
  }
  return totals;
}

function memoryState(nar) {
  const usage = process.memoryUsage();
  return {
    rss_bytes: usage.rss,
    heap_used_bytes: usage.heapUsed,
    heap_total_bytes: usage.heapTotal,
    external_bytes: usage.external,
    array_buffers_bytes: usage.arrayBuffers,
    bags: {
      concepts: sizeOf(nar.memory.concepts),
      novel_tasks: sizeOf(nar.memory.novelTasks),
      sequence_current: sizeOf(nar.memory.seq_current),
      recent_operations: sizeOf(nar.memory.recent_operations),
    },
    concept_state: countConceptState(nar),
  };
}

function signalText(signal, nar) {
  if (signal?.sentence) {
    try {
      return String(signal.sentence.toString(nar, true));
    } catch {
      return String(signal);
    }
  }
  return String(signal ?? "");
}

function readInputs(file) {
  const steps = [];
  let embeddedCycles = 0;
  for (const rawLine of readFileSync(file, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line.length === 0 || line.startsWith("'") || line.startsWith("//")) continue;
    if (/^[0-9]+$/.test(line)) {
      const cycles = Number(line);
      embeddedCycles += cycles;
      steps.push({ kind: "cycles", value: cycles });
    } else {
      steps.push({ kind: "input", value: line });
    }
  }
  return { steps, embeddedCycles };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const { steps, embeddedCycles } = readInputs(options.file);
  Debug.TEST = true;
  const nar = new Nar();
  const startedAt = performance.now();
  let cycles = 0;
  let cycleEnds = 0;
  let outEvents = 0;
  let exeEvents = 0;
  const expectedMarkers = [];
  for (const rawLine of readFileSync(options.file, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    const prefix = "''outputMustContain('";
    if (line.startsWith(prefix) && line.endsWith("')")) expectedMarkers.push(line.slice(prefix.length, -2));
  }
  const matched = new Array(expectedMarkers.length).fill(false);
  const markerTimes = new Array(expectedMarkers.length).fill(null);
  const observer = {
    event(channel, args) {
      if (channel === Events.CycleEnd.class) {
        cycleEnds += 1;
        return;
      }
      if (channel !== OutputHandler.OUT.class && channel !== OutputHandler.EXE.class) return;
      if (channel === OutputHandler.OUT.class) outEvents += 1;
      if (channel === OutputHandler.EXE.class) exeEvents += 1;
      const text = signalText(args[0], nar);
      for (let index = 0; index < expectedMarkers.length; index += 1) {
        if (!matched[index] && text.includes(expectedMarkers[index])) {
          matched[index] = true;
          markerTimes[index] = performance.now() - startedAt;
        }
      }
    },
  };
  nar.on(OutputHandler.OUT.class, observer);
  nar.on(OutputHandler.EXE.class, observer);
  nar.on(Events.CycleEnd.class, observer);
  const targetCycles = Math.min(options.maxCycles ?? embeddedCycles, embeddedCycles);
  const samples = [];
  let stoppedReason = "completed";
  let stopRequested = false;
  const runChunk = (next) => {
    const before = performance.now();
    nar.cycles(next);
    cycles += next;
    const state = memoryState(nar);
    const matchedSnapshot = [...matched];
    const markerTimesSnapshot = [...markerTimes];
    const sample = {
      cycle: cycles,
      chunk_cycles: next,
      chunk_duration_ms: performance.now() - before,
      elapsed_ms: performance.now() - startedAt,
      cycle_end_events: cycleEnds,
      out_events: outEvents,
      exe_events: exeEvents,
      expected_markers: expectedMarkers,
      matched: matchedSnapshot,
      marker_time_ms: markerTimesSnapshot,
      ...state,
    };
    samples.push(sample);
    process.stdout.write(`${JSON.stringify({ type: "sample", ...sample })}\n`);
    if (matched.length > 0 && matched.every(Boolean)) {
      stoppedReason = "markers_reached";
      stopRequested = true;
    } else if (state.rss_bytes >= options.rssLimitMb * 1024 * 1024) {
      stoppedReason = "rss_safety_limit";
      stopRequested = true;
    }
  };
  for (const step of steps) {
    if (stopRequested || cycles >= targetCycles) break;
    if (step.kind === "input") {
      nar.addInput(new java.lang.String(step.value));
      continue;
    }
    let remaining = Math.min(step.value, targetCycles - cycles);
    while (remaining > 0 && !stopRequested) {
      const next = Math.min(options.chunk, remaining);
      runChunk(next);
      remaining -= next;
    }
  }
  if (!stopRequested && cycles >= targetCycles && targetCycles < embeddedCycles) {
    stoppedReason = "cycle_budget_reached";
  }
  const result = {
    file: options.file,
    thread_mode: "single",
    embedded_cycles: embeddedCycles,
    target_cycles: targetCycles,
    observed_cycles: cycles,
    chunk_cycles: options.chunk,
    rss_limit_mb: options.rssLimitMb,
    stopped_reason: stoppedReason,
    expected_markers: expectedMarkers,
    matched: [...matched],
    marker_time_ms: [...markerTimes],
    sample_count: samples.length,
    final: samples.at(-1) ?? null,
  };
  if (options.output !== null) writeFileSync(options.output, `${JSON.stringify({ ...result, samples }, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify({ type: "result", ...result })}\n`);
}

main();
