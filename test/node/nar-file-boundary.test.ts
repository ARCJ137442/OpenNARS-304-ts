import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { Nar } from "../../src/main/Nar.ts";

test("Nar file persistence exposes project-owned text path boundaries", () => {
    const source = readFileSync("src/main/Nar.ts", "utf8");
    assert.match(source, /SaveToFile\(name: JavaStringInput\)/);
    assert.match(source, /LoadFromFile\(name: JavaStringInput/);
    assert.doesNotMatch(source, /File(?:Input|Output)Stream/);
    assert.match(source, /saveSnapshot/);
    assert.match(source, /loadSnapshot/);

    const saved = new Map<string, unknown>();
    const nar = new Nar({ capabilities: {
        saveSnapshot(name, value) { saved.set(name, value); },
        loadSnapshot(name) { return saved.get(name); },
    } });
    try {
        nar.SaveToFile("native.nars");
        assert.equal(saved.has("native.nars"), true);
    } finally {
        nar.stop();
    }
});
