import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { java } from "../../src/runtime/native-runtime.ts";

import { Nar } from "../../src/main/Nar.ts";
import type { Task } from "../../src/entity/Task.ts";
import type { Timable } from "../../src/interfaces/Timable.ts";
import { SensoryChannel } from "../../src/plugin/perception/SensoryChannel.ts";

class InputProbeChannel extends SensoryChannel {
  public constructor(owner: Nar, private readonly received: Task[]) {
    super();
    this.nar = owner;
  }

  public addInput(task: Task, _time: Timable): Nar {
    this.received.push(task);
    return this.nar;
  }
}

test("Nar consumes NAL text and preserves IN creation-time semantics", () => {
  const nar = new Nar();
  try {
    nar.addInputText("'ignored comment\nCONFIG: ignored metadata\nIN: <a --> b>. {3 :|:}\n");
    assert.equal(String(nar.time()), "3");
  } finally {
    nar.stop();
  }
});

test("Nar two-argument addInputText accepts project-owned string values", () => {
  const source = readFileSync("src/main/Nar.ts", "utf8");
  assert.doesNotMatch(source, /addInputText\(text: java\.lang\.String, time: Timable\)/);

  const nar = new Nar();
  const received: Task[] = [];
  const time: Timable = { time: () => 0n };
  const channel = new InputProbeChannel(nar, received);

  try {
    channel.addInputText("<native --> input>.", time);
    channel.addInputText(new java.lang.String("<boxed --> input>."), time);

    assert.equal(received.length, 2);
    assert.ok(received[0] instanceof Object);
    assert.ok(received[1] instanceof Object);
  } finally {
    nar.stop();
  }
});
