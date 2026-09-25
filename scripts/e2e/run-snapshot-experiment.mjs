import { mkdtemp, readFile, rename, rm, writeFile } from "node:fs/promises";
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

async function saveReplayCheckpoint(directory, checkpoint, input, events) {
  const temporary = join(directory, `nar-${checkpoint}.json.tmp`);
  const snapshot = join(directory, `nar-${checkpoint}.json`);
  const manifest = JSON.stringify({ schema: 1, kind: "replay", checkpoint, inputHash: fingerprint(input), eventHash: fingerprint(events) });
  await writeFile(temporary, manifest, "utf8");
  await rename(temporary, snapshot);
  return JSON.parse(await readFile(snapshot, "utf8"));
}

async function runBaseline(cycles, input) {
  const nar = createNar(input);
  const events = attachEvents(nar);
  nar.cycles(cycles);
  return { cycles, events };
}

async function runWithSnapshots(cycles, checkpoints, input, directory) {
  let nar = createNar(input);
  let activeEvents = attachEvents(nar);
  const events = [];
  let completed = 0;
  for (const checkpoint of [...checkpoints, cycles]) {
    nar.cycles(checkpoint - completed);
    completed = checkpoint;
    events.push(...activeEvents);
    if (checkpoint === cycles) break;
    const snapshot = await saveReplayCheckpoint(directory, checkpoint, input, events);
    if (snapshot.schema !== 1 || snapshot.kind !== "replay" || snapshot.inputHash !== fingerprint(input)) {
      throw new Error("replay checkpoint provenance mismatch");
    }
    nar = createNar(input);
    const prefixEvents = attachEvents(nar);
    nar.cycles(snapshot.checkpoint);
    if (fingerprint(prefixEvents) !== snapshot.eventHash) {
      throw new Error(`replay checkpoint diverged at cycle ${checkpoint}`);
    }
    activeEvents = attachEvents(nar);
  }
  return { cycles, events };
}

export async function runSnapshotExperiment({ cycles = 8, checkpoints = [2, 4], input = defaultInput } = {}) {
  const normalized = validateOptions(cycles, checkpoints);
  const directory = await mkdtemp(join(tmpdir(), "opennars-snapshot-"));
  try {
    const baseline = await runBaseline(cycles, input);
    const resumed = await runWithSnapshots(cycles, normalized, input, directory);
    const mismatches = baseline.events.length === resumed.events.length
      && baseline.events.every((event, index) => JSON.stringify(event) === JSON.stringify(resumed.events[index]))
      ? []
      : [{ baseline: baseline.events, resumed: resumed.events }];
    return { ok: mismatches.length === 0, checkpoints: normalized, baseline, resumed, mismatches };
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runSnapshotExperiment({ cycles: 8, checkpoints: [2, 4, 6] })
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
      if (!result.ok) process.exitCode = 1;
    })
    .catch((error) => {
      console.error(error.stack ?? error);
      process.exitCode = 1;
    });
}
