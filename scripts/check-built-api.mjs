#!/usr/bin/env node

import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const entry = resolve(process.argv[2] ?? "dist/index.js");
const { Nar, Events, OutputHandler } = await import(pathToFileURL(entry).href);
assert.equal(typeof Nar, "function", "Nar must be exported by the built entry");
assert.ok(Events?.CycleEnd?.class, "CycleEnd must be exported for lifecycle observation");
assert.ok(OutputHandler?.OUT?.class, "OUT must be exported for output observation");

const nar = new Nar();
let cycleEnds = 0;
let outputSignals = 0;
const cycleObserver = { event(eventClass) { if (eventClass === Events.CycleEnd.class) cycleEnds += 1; } };
const outputObserver = { event(eventClass) { if (eventClass === OutputHandler.OUT.class) outputSignals += 1; } };
nar.on(Events.CycleEnd.class, cycleObserver);
nar.on(OutputHandler.OUT.class, outputObserver);
nar.addInput("<bird --> animal>.");
nar.cycles(2);
nar.off(Events.CycleEnd.class, cycleObserver);
nar.off(OutputHandler.OUT.class, outputObserver);
nar.stop();

assert.equal(cycleEnds, 2, "the built API must execute the requested cycles");
assert.equal(typeof nar.toString(), "string", "the built API must expose readable state");
assert.equal(nar.isRunning(), false, "the built API must stop cleanly");
console.log(JSON.stringify({ ok: true, entry, cycles: 2, cycleEnds, outputSignals, stopped: true }));
