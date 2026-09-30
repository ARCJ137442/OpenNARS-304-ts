import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

import { java } from "../../src/runtime/native-runtime.ts";
import { Concept } from "../../src/entity/Concept.ts";
import { DerivationContext } from "../../src/control/DerivationContext.ts";
import { Sentence } from "../../src/entity/Sentence.ts";
import { Task } from "../../src/entity/Task.ts";
import { TaskLink } from "../../src/entity/TaskLink.ts";
import { TermLink } from "../../src/entity/TermLink.ts";
import { Events } from "../../src/io/events/Events.ts";
import { OutputHandler } from "../../src/io/events/OutputHandler.ts";
import { Debug } from "../../src/main/Debug.ts";
import { Nar } from "../../src/main/Nar.ts";

export const STAGES = ["input", "concept", "links", "scheduler", "rule", "derivation", "marker"];
const EVENT_DEFINITIONS = [
  ["CycleStart", Events.CycleStart.class],
  ["CycleEnd", Events.CycleEnd.class],
  ["TaskAdd", Events.TaskAdd.class],
  ["ConceptNew", Events.ConceptNew.class],
  ["ConceptDirectProcessedTask", Events.ConceptDirectProcessedTask.class],
  ["TaskImmediateProcess", Events.TaskImmediateProcess.class],
  ["TermLinkAdd", Events.TermLinkAdd.class],
  ["TaskLinkAdd", Events.TaskLinkAdd.class],
  ["ConceptFire", Events.ConceptFire.class],
  ["TermLinkSelect", Events.TermLinkSelect.class],
  ["BeliefSelect", Events.BeliefSelect.class],
  ["BeliefReason", Events.BeliefReason.class],
  ["TaskDerive", Events.TaskDerive.class],
  ["NewTaskExecution", Events.NewTaskExecution.class],
  ["OUT", OutputHandler.OUT.class],
  ["EXE", OutputHandler.EXE.class],
];
const STAGE_BY_EVENT = new Map([
  ["TaskAdd", "input"],
  ["ConceptNew", "concept"],
  ["ConceptDirectProcessedTask", "concept"],
  ["TaskImmediateProcess", "concept"],
  ["TermLinkAdd", "links"],
  ["TaskLinkAdd", "links"],
  ["ConceptFire", "scheduler"],
  ["TermLinkSelect", "scheduler"],
  ["BeliefSelect", "scheduler"],
  ["BeliefReason", "rule"],
  ["TaskDerive", "derivation"],
  ["NewTaskExecution", "marker"],
  ["OUT", "marker"],
  ["EXE", "marker"],
]);

function parseArgs(argv) {
  if (argv.length < 2) {
      throw new Error("usage: NalStageDigestRunner <cycles> <nal-file> [--skip-embedded] [--window-size N] [--stream]");
  }
  const cycles = Number(argv[0]);
  if (!Number.isInteger(cycles) || cycles < 1) throw new Error("cycles must be a positive integer");
  const file = argv[1];
  const extra = argv.slice(2);
  let windowSize = 1024;
  let skipEmbedded = false;
  let stream = false;
  for (let index = 0; index < extra.length; index += 1) {
    if (extra[index] === "--skip-embedded") {
      skipEmbedded = true;
    } else if (extra[index] === "--stream") {
      stream = true;
    } else if (extra[index] === "--window-size") {
      windowSize = Number(extra[++index]);
      if (!Number.isInteger(windowSize) || windowSize < 1) throw new Error("window size must be positive");
    } else {
      throw new Error(`unknown argument: ${extra[index]}`);
    }
  }
  return { cycles, file, skipEmbedded, windowSize, stream };
}

function digest() {
  return createHash("sha256");
}

function emptyStages() {
  return Object.fromEntries(STAGES.map((stage) => [stage, {
    event_count: 0,
    cycles_with_events: 0,
    first_event: null,
    last_event: null,
    hasher: digest(),
  }]));
}

function describe(value, nar) {
  if (value === null || value === undefined) return "";
  if (value instanceof Task) return String(value.sentence.toString(nar, true));
  if (value instanceof Sentence) return String(value.toString(nar, true));
  if (value instanceof Concept) return termText(value.getTerm());
  if (value instanceof TaskLink) {
    const index = value.index === null || value.index === undefined
      ? "null"
      : `[${Array.from(value.index).join(",")}]`;
    return `${termText(value.getTarget().sentence.term)}|type=${value.type}|index=${index}`;
  }
  if (value instanceof TermLink) {
    const index = value.index === null || value.index === undefined
      ? "null"
      : `[${Array.from(value.index).join(",")}]`;
    return `${termText(value.target)}|type=${value.type}|index=${index}`;
  }
  if (value instanceof DerivationContext) {
    return termText(value.getCurrentTask()?.sentence?.term);
  }
  return "";
}

function termText(value) {
  if (value !== null && value !== undefined && typeof value.name === "function") return String(value.name());
  return String(value ?? "");
}

function normalizeStable(value) {
  // Stamp evidential-base identifiers are runtime-generated and differ across
  // Java and TypeScript; preserve stamp positions while removing only the id.
  return value.replace(/\((-?\d{10,}),/g, "(#,");
}

function eventToken(name, args, nar) {
  // Keep only stable Java/TS-shared values. Reasons, execution objects and
  // contexts may contain runtime identity or platform-specific formatting.
  const value = ["ConceptFire", "NewTaskExecution", "OUT", "EXE"].includes(name)
    ? null
    : args[0];
  return `${name}|${normalizeStable(describe(value, nar))}\n`;
}

function addEvent(stages, name, token) {
  const stage = STAGE_BY_EVENT.get(name);
  if (stage === undefined) return;
  const item = stages[stage];
  item.event_count += 1;
  item.first_event ??= token.trimEnd();
  item.last_event = token.trimEnd();
  item.hasher.update(token, "utf8");
}

function snapshotStage(stage) {
  return {
    event_count: stage.event_count,
    cycles_with_events: stage.cycles_with_events,
    first_event: stage.first_event,
    last_event: stage.last_event,
    digest: stage.hasher.digest("hex").toUpperCase(),
  };
}

function snapshotStages(stages) {
  return Object.fromEntries(STAGES.map((stage) => [stage, snapshotStage(stages[stage])]));
}

function addCycleToWindow(window, cycleStages) {
  window.cycle_count += 1;
  window.end_cycle = window.start_cycle + window.cycle_count - 1;
  for (const stage of STAGES) {
    const source = cycleStages[stage];
    const target = window.stages[stage];
    if (source.event_count > 0) target.cycles_with_events += 1;
    target.event_count += source.event_count;
    target.first_event ??= source.first_event;
    target.last_event = source.last_event ?? target.last_event;
    if (source.event_count > 0) {
      target.hasher.update(`${source.hasher.digest("hex").toUpperCase()}\n`, "utf8");
    }
  }
  window.total_events += STAGES.reduce((sum, stage) => sum + cycleStages[stage].event_count, 0);
}

function newWindow(startCycle) {
  return {
    start_cycle: startCycle,
    end_cycle: startCycle - 1,
    cycle_count: 0,
    total_events: 0,
    stages: Object.fromEntries(STAGES.map((stage) => [stage, {
      event_count: 0,
      cycles_with_events: 0,
      first_event: null,
      last_event: null,
      hasher: digest(),
    }])),
  };
}

function finalizeWindow(window) {
  return {
    kind: "window",
    start_cycle: window.start_cycle,
    end_cycle: window.end_cycle,
    cycle_count: window.cycle_count,
    total_events: window.total_events,
    stages: snapshotStages(window.stages),
  };
}

function run({ cycles, file, skipEmbedded, windowSize, stream }) {
  Debug.TEST = true;
  const nar = new Nar();
  const names = new Map(EVENT_DEFINITIONS.map(([name, eventClass]) => [eventClass, name]));
  const records = [];
  let pre = emptyStages();
  let preEvents = 0;
  let preEventsTotal = 0;
  let active = false;
  let preFlushed = false;
  let currentCycle = 0;
  let current = emptyStages();
  let window = null;
  let windows = 0;
  let totalEvents = 0;
  let incomplete = false;
  const emitRecord = (record) => {
    if (stream) process.stdout.write(`${JSON.stringify(record)}\n`);
    else records.push(record);
  };

  const flushPre = () => {
    if (preFlushed) return;
    preFlushed = true;
    if (preEvents > 0) {
      preEventsTotal += preEvents;
      emitRecord({ kind: "pre", total_events: preEvents, stages: snapshotStages(pre) });
    }
    pre = emptyStages();
    preEvents = 0;
  };
  const flushWindow = () => {
    if (window === null || window.cycle_count === 0) return;
    emitRecord(finalizeWindow(window));
    windows += 1;
    window = null;
  };
  const finishCycle = () => {
    if (window === null) window = newWindow(currentCycle);
    addCycleToWindow(window, current);
    current = emptyStages();
    if (window.cycle_count >= windowSize) flushWindow();
  };
  const observer = {
    event(eventClass, args) {
      const name = names.get(eventClass) ?? String(eventClass);
      if (name === "CycleStart") {
        if (!active) flushPre();
        active = true;
        currentCycle += 1;
        return;
      }
      if (name === "CycleEnd") {
        finishCycle();
        active = false;
        preFlushed = false;
        return;
      }
      const stage = STAGE_BY_EVENT.get(name);
      if (stage === undefined) return;
      const token = eventToken(name, args, nar);
      totalEvents += 1;
      if (active) addEvent(current, name, token);
      else {
        preEvents += 1;
        addEvent(pre, name, token);
      }
    },
  };
  nar.event(observer, true, ...EVENT_DEFINITIONS.map(([, eventClass]) => eventClass));

  for (const rawLine of readFileSync(file, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line.length === 0 || line.startsWith("'")) continue;
    if (/^[0-9]+$/.test(line)) {
      if (!skipEmbedded) nar.cycles(Number(line));
    } else {
      nar.addInput(new java.lang.String(line));
    }
  }
  nar.cycles(cycles);
  if (active) {
    incomplete = true;
    if (currentCycle > 0) finishCycle();
  }
  flushWindow();
  return {
    kind: "summary",
    format_version: 1,
    window_cycles: windowSize,
    requested_cycles: cycles,
    skip_embedded: skipEmbedded,
    pre_events: preEventsTotal,
    cycles_observed: currentCycle,
    windows,
    total_events: totalEvents,
    incomplete,
    records: stream ? [] : records,
  };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.stream) {
    process.stdout.write(`${JSON.stringify({
      kind: "meta",
      format_version: 1,
      window_cycles: options.windowSize,
      requested_cycles: options.cycles,
      skip_embedded: options.skipEmbedded,
    })}\n`);
  }
  process.stdout.write(`${JSON.stringify(run(options))}\n`);
}

try {
  main();
} catch (error) {
  console.error(error?.stack ?? error);
  process.exitCode = 1;
}
