import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { java } from "../support/legacy-runtime-facade.ts";
import { NodeStdinInputStream, type NodeReadableInput } from "../../src/runtime/NodeStdinInputStream.ts";

class FakeReadable implements NodeReadableInput {
    private readonly listeners = new Map<string, (...args: unknown[]) => void>();

    public on(event: "data" | "end", listener: (...args: unknown[]) => void): NodeReadableInput {
        this.listeners.set(event, listener);
        return this;
    }

    public resume(): NodeReadableInput {
        return this;
    }

    public emit(event: "data" | "end", value?: unknown): void {
        this.listeners.get(event)?.(value);
    }
}

test("Node stdin adapter stays independent from the jree InputStream runtime", () => {
    const source = readFileSync("src/runtime/NodeStdinInputStream.ts", "utf8");
    assert.doesNotMatch(source, /from ["']jree["']/);
    assert.doesNotMatch(source, /extends\s+java\.io\.InputStream/);
    assert.match(source, /public ready\(\): boolean/);
});

test("Node stdin adapter exposes queued bytes through Java InputStream", () => {
    const source = new FakeReadable();
    const stream = new NodeStdinInputStream(source);

    source.emit("data", new TextEncoder().encode("a\n"));
    assert.equal(stream.available(), 2);

    const buffer = new Int8Array(2);
    assert.equal(stream.read(buffer), 2);
    assert.deepEqual(Array.from(buffer), [97, 10]);
    assert.equal(stream.available(), 0);
    assert.equal(stream.read(), -1);
});

test("Node stdin adapter feeds the Java line reader through the narrow host boundary", () => {
    const source = new FakeReadable();
    const stream = new NodeStdinInputStream(source);
    const reader = new java.io.BufferedReader(
        new java.io.InputStreamReader(stream as unknown as java.io.InputStream),
    );

    source.emit("data", new TextEncoder().encode("first\r\nsecond\n"));
    assert.equal(String(reader.readLine()), "first");
    assert.equal(String(reader.readLine()), "second");
    assert.equal(reader.readLine(), null);
});
