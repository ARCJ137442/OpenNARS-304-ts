import assert from "node:assert/strict";
import test from "node:test";

import { TLink } from "../../src/entity/TLink.ts";

/**
 * Mock implementation of TLink<T> for testing interface contract
 */
class MockTLink<T> implements TLink<T> {
    private readonly _target: T;
    private readonly _indices: readonly number[];
    private readonly _priority: number;

    constructor(target: T, indices: readonly number[], priority: number = 0.5) {
        this._target = target;
        this._indices = indices;
        this._priority = priority;
    }

    getIndex(i: number): number {
        if (i >= 0 && i < this._indices.length) {
            return this._indices[i];
        }
        return -1;
    }

    getTarget(): T {
        return this._target;
    }

    getPriority(): number {
        return this._priority;
    }
}

test("TLink.getIndex returns correct index for valid level", () => {
    const mockLink = new MockTLink("target", [0, 1, 2, 3]);
    assert.equal(mockLink.getIndex(0), 0);
    assert.equal(mockLink.getIndex(1), 1);
    assert.equal(mockLink.getIndex(2), 2);
    assert.equal(mockLink.getIndex(3), 3);
});

test("TLink.getIndex returns -1 for invalid level", () => {
    const mockLink = new MockTLink("target", [0, 1]);
    assert.equal(mockLink.getIndex(-1), -1);
    assert.equal(mockLink.getIndex(2), -1);
    assert.equal(mockLink.getIndex(10), -1);
});

test("TLink.getIndex with empty indices array", () => {
    const mockLink = new MockTLink("target", []);
    assert.equal(mockLink.getIndex(0), -1);
    assert.equal(mockLink.getIndex(1), -1);
});

test("TLink.getTarget returns the linked target object", () => {
    const targetString = "test-target";
    const mockLink = new MockTLink(targetString, [0]);
    assert.equal(mockLink.getTarget(), targetString);

    const targetNumber = 42;
    const mockLink2 = new MockTLink(targetNumber, [0]);
    assert.equal(mockLink2.getTarget(), targetNumber);
});

test("TLink.getPriority returns priority value", () => {
    const mockLink = new MockTLink("target", [0], 0.75);
    assert.equal(mockLink.getPriority(), 0.75);
});

test("TLink.getPriority returns default priority when not specified", () => {
    const mockLink = new MockTLink("target", [0]);
    assert.equal(mockLink.getPriority(), 0.5);
});

test("TLink.getPriority handles zero priority", () => {
    const mockLink = new MockTLink("target", [0], 0);
    assert.equal(mockLink.getPriority(), 0);
});

test("TLink.getPriority handles maximum priority", () => {
    const mockLink = new MockTLink("target", [0], 1.0);
    assert.equal(mockLink.getPriority(), 1.0);
});

test("TLink interface supports generic Term type", () => {
    const mockLink = new MockTLink<string>("term-target", [0, 1]);
    assert.strictEqual(mockLink.getTarget(), "term-target");
    assert.equal(mockLink.getIndex(0), 0);
    assert.equal(mockLink.getIndex(1), 1);
});

test("TLink interface supports generic Task type", () => {
    const mockTask = { id: "task-123", content: "test" };
    const mockLink = new MockTLink<{ id: string; content: string }>(mockTask, [2]);
    assert.strictEqual(mockLink.getTarget(), mockTask);
    assert.equal(mockLink.getTarget().id, "task-123");
});

test("TLink with multi-level indices maintains order", () => {
    const mockLink = new MockTLink("compound-target", [1, 3, 0, 2]);
    assert.equal(mockLink.getIndex(0), 1);
    assert.equal(mockLink.getIndex(1), 3);
    assert.equal(mockLink.getIndex(2), 0);
    assert.equal(mockLink.getIndex(3), 2);
});

test("TLink.getIndex returns negative one-based index (Java compatibility)", () => {
    // Java TermLink returns -1 when index is out of bounds
    const mockLink = new MockTLink("target", [0]);
    assert.equal(mockLink.getIndex(0), 0);
    assert.equal(mockLink.getIndex(1), -1);
});

test("TLink mock implementation preserves immutability", () => {
    const indices = [0, 1, 2] as const;
    const mockLink = new MockTLink("target", indices, 0.9);

    // Verify values are stable
    assert.equal(mockLink.getIndex(0), 0);
    assert.equal(mockLink.getIndex(1), 1);
    assert.equal(mockLink.getTarget(), "target");
    assert.equal(mockLink.getPriority(), 0.9);
});

test("TLink interface can be used as type parameter", () => {
    function processTLink<T>(link: TLink<T>): T {
        return link.getTarget();
    }

    const mockLink = new MockTLink("test-value", [0]);
    const result = processTLink(mockLink);
    assert.equal(result, "test-value");
});

test("TLink with floating point indices", () => {
    // While indices are typically integers, test flexibility
    const mockLink = new MockTLink("target", [0.5, 1.5]);
    assert.equal(mockLink.getIndex(0), 0.5);
    assert.equal(mockLink.getIndex(1), 1.5);
});
