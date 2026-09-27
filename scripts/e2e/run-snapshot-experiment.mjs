import { mkdir, mkdtemp, readFile, rename, rm, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

import { OutputHandler } from "../../src/io/events/OutputHandler.ts";
import { Nar } from "../../src/main/Nar.ts";
import { Debug } from "../../src/main/Debug.ts";
import { createNodeRuntimeCapabilities } from "../../src/platform/node/SystemCommandCapabilities.ts";

const defaultInput = "<a --> b>.\n<b --> c>.\n<a --> c>?\n";
const experimentNarId = 137442n;
Debug.TEST = true;

function fingerprint(value) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function stateProjection(nar) {
  const bagProjection = (bag) => [...bag].map((item) => (
    typeof item?.toStringLong === "function" ? String(item.toStringLong()) : String(item)
  ));
  const parameters = {};
  for (const key of Object.keys(nar.narParameters).sort()) {
    const value = nar.narParameters[key];
    if (typeof value !== "function") parameters[key] = String(value);
  }
  return {
    cycle: Number(nar.time()),
    narId: String(nar.memory.narId),
    bags: {
      concepts: bagProjection(nar.memory.concepts),
      novelTasks: bagProjection(nar.memory.novelTasks),
      sequence: bagProjection(nar.memory.seq_current),
      operations: bagProjection(nar.memory.recent_operations),
    },
    parameters,
  };
}

function stateDigest(nar) {
  return fingerprint(stateProjection(nar));
}

function attachEvents(nar) {
  const events = [];
  const observer = {
    event(channel, args) {
      if (channel !== OutputHandler.OUT.class && channel !== OutputHandler.EXE.class) return;
      const signal = args[0];
      const text = signal?.sentence
        ? String(signal.sentence.toString(nar, true))
        : String(signal);
      events.push({ channel: channel === OutputHandler.OUT.class ? "OUT" : "EXE", text });
    },
  };
  nar.on(OutputHandler.OUT.class, observer);
  nar.on(OutputHandler.EXE.class, observer);
  return events;
}

function validateOptions(cycles, checkpoints) {
  if (!Number.isInteger(cycles) || cycles < 1) throw new RangeError("cycles must be positive");
  const values = [...new Set(checkpoints)].sort((left, right) => left - right);
  if (values.some((checkpoint) => !Number.isInteger(checkpoint) || checkpoint < 1 || checkpoint >= cycles)) {
    throw new RangeError("checkpoint must be between 1 and cycles");
  }
  return values;
}

function createNar(input) {
  const nar = new Nar({ narId: experimentNarId, capabilities: createNodeRuntimeCapabilities() });
  nar.addInputText(input);
  return nar;
}

async function saveReplayCheckpoint(directory, checkpoint, input, events, nar, runner) {
  const temporary = join(directory, `nar-${checkpoint}.json.tmp`);
  const snapshot = join(directory, `nar-${checkpoint}.json`);
  const inputHash = fingerprint(input);
  const manifest = JSON.stringify({
    schema: 2,
    kind: "nar-state-contract",
    restorationMode: "replay-verified",
    complete: false,
    checkpoint,
    cycle: Number(nar.time()),
    inputHash,
    fixtureSha256: inputHash,
    javaArtifactSha256: null,
    eventHash: fingerprint(events),
    eventCount: events.length,
    stateDigest: stateDigest(nar),
    runner: {
      ...runner,
    },
  });
  await writeFile(temporary, manifest, "utf8");
  await rename(temporary, snapshot);
  return JSON.parse(await readFile(snapshot, "utf8"));
}

async function runBaseline(cycles, input) {
  const nar = createNar(input);
  const events = attachEvents(nar);
  nar.cycles(cycles);
  return { cycles, events, finalStateDigest: stateDigest(nar) };
}

async function runWithSnapshots(cycles, checkpoints, input, directory) {
  let nar = createNar(input);
  let activeEvents = attachEvents(nar);
  const events = [];
  const stateSnapshots = [];
  const runner = { engine: "ts", tsMode: "in-process", cycleTarget: cycles, checkpoints };
  let completed = 0;
  for (const checkpoint of [...checkpoints, cycles]) {
    nar.cycles(checkpoint - completed);
    completed = checkpoint;
    events.push(...activeEvents);
    if (checkpoint === cycles) break;
    const snapshot = await saveReplayCheckpoint(directory, checkpoint, input, events, nar, runner);
    if (snapshot.schema !== 2 || snapshot.kind !== "nar-state-contract"
      || snapshot.restorationMode !== "replay-verified" || snapshot.complete !== false
      || snapshot.inputHash !== fingerprint(input)
      || snapshot.fixtureSha256 !== snapshot.inputHash
      || snapshot.javaArtifactSha256 !== null) {
      throw new Error("replay checkpoint provenance mismatch");
    }
    stateSnapshots.push(snapshot);
    nar = createNar(input);
    const prefixEvents = attachEvents(nar);
    nar.cycles(snapshot.checkpoint);
    if (fingerprint(prefixEvents) !== snapshot.eventHash) {
      throw new Error(`replay checkpoint diverged at cycle ${checkpoint}`);
    }
    if (stateDigest(nar) !== snapshot.stateDigest) {
      throw new Error(`replay checkpoint state diverged at cycle ${checkpoint}`);
    }
    activeEvents = attachEvents(nar);
  }
  return { cycles, events, stateSnapshots, finalStateDigest: stateDigest(nar) };
}

export async function recoverSnapshotCheckpoint(snapshotPath, { input = defaultInput, cycles } = {}) {
  const snapshot = JSON.parse(await readFile(snapshotPath, "utf8"));
  if (snapshot.schema !== 2 || snapshot.kind !== "nar-state-contract"
    || snapshot.restorationMode !== "replay-verified" || snapshot.complete !== false) {
    throw new Error("unsupported snapshot checkpoint");
  }
  if (!Number.isInteger(cycles) || cycles <= snapshot.checkpoint) {
    throw new RangeError("cycles must be greater than checkpoint");
  }
  if (fingerprint(input) !== snapshot.inputHash) throw new Error("snapshot fixture mismatch");
  const nar = createNar(input);
  const prefixEvents = attachEvents(nar);
  nar.cycles(snapshot.checkpoint);
  if (prefixEvents.length !== snapshot.eventCount || fingerprint(prefixEvents) !== snapshot.eventHash) {
    throw new Error("snapshot event prefix mismatch");
  }
  if (stateDigest(nar) !== snapshot.stateDigest) throw new Error("snapshot state mismatch");
  const events = attachEvents(nar);
  nar.cycles(cycles - snapshot.checkpoint);
  return { ok: true, checkpoint: snapshot.checkpoint, events, finalStateDigest: stateDigest(nar) };
}

export async function runSnapshotExperiment({
  cycles = 240,
  checkpoints = [50, 100, 200],
  input = defaultInput,
  checkpointDirectory = null,
} = {}) {
  const normalized = validateOptions(cycles, checkpoints);
  const directory = checkpointDirectory ?? await mkdtemp(join(tmpdir(), "opennars-snapshot-"));
  if (checkpointDirectory !== null) await mkdir(checkpointDirectory, { recursive: true });
  try {
    const baseline = await runBaseline(cycles, input);
    baseline.runner = { engine: "ts", tsMode: "in-process", cycleTarget: cycles, checkpoints: normalized };
    const resumed = await runWithSnapshots(cycles, normalized, input, directory);
    const firstEventDifference = baseline.events.findIndex((event, index) => (
      JSON.stringify(event) !== JSON.stringify(resumed.events[index])
    ));
    const eventsMatch = baseline.events.length === resumed.events.length && firstEventDifference === -1;
    const mismatches = [];
    if (!eventsMatch) {
      mismatches.push({
        kind: "events",
        firstDifferenceIndex: firstEventDifference,
        baselineEventCount: baseline.events.length,
        resumedEventCount: resumed.events.length,
      });
    }
    if (baseline.finalStateDigest !== resumed.finalStateDigest) {
      mismatches.push({
        kind: "final-state",
        baselineFinalStateDigest: baseline.finalStateDigest,
        resumedFinalStateDigest: resumed.finalStateDigest,
      });
    }
    return {
      ok: mismatches.length === 0,
      restorationMode: "replay-verified",
      checkpoints: normalized,
      checkpointDirectory,
      stateSnapshots: resumed.stateSnapshots,
      finalStateDigest: resumed.finalStateDigest,
      baseline,
      resumed,
      mismatches,
    };
  } finally {
    if (checkpointDirectory === null) await rm(directory, { recursive: true, force: true });
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runSnapshotExperiment({ cycles: 240, checkpoints: [50, 100, 200] })
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
      if (!result.ok) process.exitCode = 1;
    })
    .catch((error) => {
      console.error(error.stack ?? error);
      process.exitCode = 1;
    });
}
