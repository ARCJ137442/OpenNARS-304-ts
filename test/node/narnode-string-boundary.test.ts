import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { Nar } from "../../src/main/Nar.ts";
import { NarNode, type MessageTransport, type NetworkMessage } from "../../src/main/NarNode.ts";
import { HostCapabilityError } from "../../src/runtime/ReasonerErrors.ts";

test("NarNode core contains only typed network messages and injected transport", () => {
    const source = readFileSync("src/main/NarNode.ts", "utf8");
    assert.doesNotMatch(source, /from ["']node:/);
    assert.doesNotMatch(source, /\bjava\.(?:io|lang|net|nio)\b/);
    assert.match(source, /interface MessageTransport/);
});

test("NarNode routes received and emitted messages through an injected transport", () => {
    const sent: NetworkMessage[] = [];
    const transport: MessageTransport = {
        listen(_port, onMessage) { onMessage({ kind: "narsese", text: "<bird --> animal>." }); },
        send(_address, _port, message) { sent.push(message); },
    };
    const nar = new Nar({ capabilities: { messageTransport: transport } });
    try {
        const node = new NarNode(nar, 64000);
        node.addRedirectionTo(new NarNode.TargetNar("127.0.0.1", 64001, 0, null, true, transport));
        node.sendNarsese("<bird --> animal>.", new NarNode.TargetNar("127.0.0.1", 64001, 0, null, true, transport));
        assert.equal(nar.time(), 0);
        assert.equal(sent.length, 1);
        assert.deepEqual(sent[0], { kind: "narsese", text: "<bird --> animal>." });
    } finally {
        nar.stop();
    }
});

test("NarNode reports absent transport as a platform capability error", () => {
    const nar = new Nar();
    try {
        assert.throws(() => new NarNode(nar, 64002), HostCapabilityError);
    } finally {
        nar.stop();
    }
});
