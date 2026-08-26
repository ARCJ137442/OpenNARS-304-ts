import assert from "node:assert/strict";
import test from "node:test";

import { Nar } from "../../src/main/Nar.ts";

test("Nar consumes NAL text and preserves IN creation-time semantics", () => {
  const nar = new Nar();
  try {
    nar.addInputText("'ignored comment\nCONFIG: ignored metadata\nIN: <a --> b>. {3 :|:}\n");
    assert.equal(String(nar.time()), "3");
  } finally {
    nar.stop();
  }
});
