import assert from "node:assert/strict";
import test from "node:test";
import { NarNode } from "../../src/main/NarNode.ts";

test("NarNode.TargetNar keeps the Java plain network-target boundary", () => {
    assert.equal(Object.getPrototypeOf(NarNode.TargetNar.prototype), Object.prototype);
});

test("NarNode keeps class identity without inheriting jree.JavaObject", () => {
    assert.equal(NarNode.name, "NarNode");
    assert.equal(NarNode === NarNode, true);
});

test("NarNode stores redirection targets in insertion order", () => {
    const first = {} as NarNode.TargetNar;
    const second = {} as NarNode.TargetNar;
    const node = { targets: [] as NarNode.TargetNar[] } as unknown as NarNode;
    const addRedirectionTo = NarNode.prototype.addRedirectionTo as unknown as
        (this: NarNode, target: NarNode.TargetNar) => void;

    addRedirectionTo.call(node, first);
    addRedirectionTo.call(node, second);

    assert.deepEqual((node as unknown as { targets: NarNode.TargetNar[] }).targets, [first, second]);
});
