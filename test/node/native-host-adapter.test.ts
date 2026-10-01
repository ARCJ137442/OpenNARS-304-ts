import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { decodeNodeValue, encodeNodeValue } from "../../src/platform/node/native-host-adapter.ts";

test("native host adapter exposes capabilities without a Java namespace", async () => {
    const nodeSource = await readFile(new URL("../../src/platform/node/native-host-adapter.ts", import.meta.url), "utf8");
    const browserSource = await readFile(new URL("../../src/platform/browser/native-host-adapter.ts", import.meta.url), "utf8");

    for (const source of [nodeSource, browserSource]) {
        assert.doesNotMatch(source, /\bexport\s+(?:const|let|var)\s+java\b/);
        assert.doesNotMatch(source, /\bjava\.(?:io|net|lang|util)\b/);
    }
});

test("native Node serialization round-trips values without object stream wrappers", () => {
    const value = { kind: "narsese", text: "<bird --> animal>." };
    assert.deepEqual(decodeNodeValue(encodeNodeValue(value)), value);
});
