import assert from "node:assert/strict";
import test from "node:test";

import { parseArgs, parseCommand } from "../../scripts/shell.mjs";

test("shell parses the Java-like interactive control commands", () => {
  assert.deepEqual(parseArgs(["--cycles", "12", "--no-prompt"]), {
    config: null,
    autoCycles: 12,
    prompt: false,
  });
  assert.deepEqual(parseCommand("<a --> b>."), { kind: "narsese", text: "<a --> b>." });
  assert.deepEqual(parseCommand(":cycles 128"), { kind: "cycles", count: 128 });
  assert.deepEqual(parseCommand(":quit"), { kind: "quit" });
  assert.deepEqual(parseCommand(":status"), { kind: "status" });
});

test("shell rejects invalid automatic cycle counts", () => {
  assert.throws(() => parseArgs(["--cycles", "0"]), /positive integer/);
  assert.throws(() => parseArgs(["--cycles", "not-a-number"]), /positive integer/);
});
