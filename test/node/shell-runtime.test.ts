import assert from "node:assert/strict";
import test from "node:test";
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
