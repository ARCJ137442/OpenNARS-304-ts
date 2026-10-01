import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { Nar } from "../../src/main/Nar.ts";
import { Shell } from "../../src/main/Shell.ts";
import { HostCapabilityError } from "../../src/runtime/ReasonerErrors.ts";

test("Shell core has no Node, process, or Java namespace dependency", () => {
    const source = readFileSync("src/main/Shell.ts", "utf8");
    assert.doesNotMatch(source, /from ["']node:/);
    assert.doesNotMatch(source, /process\./);
    assert.doesNotMatch(source, /\bjava\.(?:io|lang|net)\b/);
});

test("Shell parses text into platform-neutral commands", () => {
    assert.deepEqual(Shell.parseCommand(":cycles 12"), { kind: "cycles", count: 12 });
    assert.deepEqual(Shell.parseCommand("<bird --> animal>."), {
        kind: "narsese",
        text: "<bird --> animal>.",
    });
    assert.deepEqual(Shell.parseCommand(":quit"), { kind: "quit" });
});

test("Shell executes Narsese and controls using injected line output", () => {
    const nar = new Nar();
    const lines: unknown[] = [];
    const shell = new Shell(nar, { println: value => lines.push(value) });
    try {
        assert.equal(shell.execute({ kind: "narsese", text: "<bird --> animal>." }), true);
        assert.equal(shell.execute({ kind: "cycles", count: 1 }), true);
        assert.ok(lines.some(value => String(value).includes("cycles=1")));
        assert.ok(lines.some(value => String(value).includes("<bird --> animal>.")));
        assert.equal(shell.execute({ kind: "quit" }), false);
    } finally {
        nar.stop();
    }
});

test("Shell requires host file capability only for file input", () => {
    const nar = new Nar();
    const shell = new Shell(nar, { println: () => undefined });
    try {
        assert.throws(
            () => shell.run(["null", "null", "input.nal", "1"], { output: { println: () => undefined } }),
            HostCapabilityError,
        );
    } finally {
        nar.stop();
    }
});
