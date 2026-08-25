import assert from "node:assert/strict";
import test from "node:test";

import { NativeDeque } from "../../src/runtime/NativeDeque.ts";

test("NativeDeque preserves FIFO order and removes from the head", () => {
    const deque = new NativeDeque<number>();
    deque.addLast(1);
    deque.addLast(2);
    deque.addLast(3);

    assert.deepEqual([...deque], [1, 2, 3]);
    assert.equal(deque.remove(), 1);
    assert.equal(deque.remove(), 2);
    assert.deepEqual([...deque], [3]);
    assert.equal(deque.size(), 1);
});

test("NativeDeque iterator.remove preserves the remaining order", () => {
    const deque = new NativeDeque<string>();
    deque.addLast("old");
    deque.addLast("match");
    deque.addLast("new");

    const iterator = deque.iterator();
    assert.equal(iterator.next(), "old");
    assert.equal(iterator.next(), "match");
    iterator.remove();
    assert.equal(iterator.next(), "new");
    assert.throws(() => iterator.next(), /exhausted/);
    assert.deepEqual([...deque], ["old", "new"]);
});

test("NativeDeque supports re-adding an iterator match at the tail", () => {
    const deque = new NativeDeque<string>();
    deque.addLast("old");
    deque.addLast("match");
    deque.addLast("new");

    const iterator = deque.iterator();
    assert.equal(iterator.next(), "old");
    assert.equal(iterator.next(), "match");
    iterator.remove();
    deque.addLast("match");

    assert.deepEqual([...deque], ["old", "new", "match"]);
});

test("NativeDeque matches TaskLink's bounded-record eviction condition", () => {
    const deque = new NativeDeque<number>();
    const recordLength = 3;

    for (const value of [1, 2, 3, 4]) {
        while (deque.size() + 1 >= recordLength) {
            deque.remove();
        }
        deque.addLast(value);
    }

    assert.deepEqual([...deque], [3, 4]);
});
