import assert from "node:assert/strict";
import test from "node:test";

import { NativeList } from "../../src/runtime/NativeList.ts";

test("NativeList preserves Java ArrayList insertion and indexed access order", () => {
    const list = new NativeList<string>(["a", "c"]);

    assert.equal(list.add("d"), true);
    list.add(1, "b");

    assert.equal(list.size(), 4);
    assert.deepEqual(list.toArray(), ["a", "b", "c", "d"]);
    assert.equal(list.get(2), "c");
    assert.equal(list.set(2, "C"), "c");
    assert.deepEqual([...list], ["a", "b", "C", "d"]);

    const iterator = list.iterator();
    list.set(0, "A");
    assert.equal(iterator.next(), "A");
});

test("NativeList preserves indexed removal and Java-style equality lookup", () => {
    type EqualityValue = { value: number; equals?: (other: unknown) => boolean };
    const first: EqualityValue = { value: 1, equals: (other) => (other as { value?: number })?.value === 1 };
    const second: EqualityValue = { value: 2, equals: (other) => (other as { value?: number })?.value === 2 };
    const list = new NativeList([first, second]);
    const searchedSecond: EqualityValue = { value: 2, equals: (other) => (other as { value?: number })?.value === 2 };
    const searchedFirst: EqualityValue = { value: 1, equals: (other) => (other as { value?: number })?.value === 1 };

    assert.equal(list.contains(searchedSecond), true);
    assert.equal(list.indexOf(searchedFirst), 0);
    assert.equal(list.remove(0), first);
    assert.deepEqual(list.toArray(), [second]);
    assert.equal(list.remove(searchedSecond), true);
    assert.deepEqual(list.toArray(), []);
    assert.equal(list.isEmpty(), true);

    list.clear();
    assert.equal(list.isEmpty(), true);
    assert.equal(list.size(), 0);
});

test("NativeList equality lookup calls equals on the searched value", () => {
    type EqualityValue = { value: number; equals: (other: unknown) => boolean };
    const stored: EqualityValue = { value: 1, equals: () => false };
    const searched: EqualityValue = { value: 1, equals: (other) => other === stored };
    const list = new NativeList<EqualityValue>([stored]);

    assert.equal(list.contains(searched), true);
    assert.equal(list.indexOf(searched), 0);
});

test("NativeList iterator preserves removal and fail-fast behavior", () => {
    const list = new NativeList(["old", "match", "new"]);
    const iterator = list.iterator();

    assert.equal(iterator.next(), "old");
    assert.equal(iterator.next(), "match");
    iterator.remove();
    assert.equal(iterator.next(), "new");
    assert.throws(() => iterator.next(), /exhausted/);
    assert.deepEqual([...list], ["old", "new"]);

    const invalidated = list.iterator();
    list.add("later");
    assert.throws(() => invalidated.hasNext(), /modified outside/);
});

test("NativeList rejects invalid element and insertion indices", () => {
    const list = new NativeList(["a"]);

    assert.throws(() => list.get(1), /index out of bounds/);
    assert.throws(() => list.remove(-1), /index out of bounds/);
    assert.throws(() => list.add(2, "b"), /insertion index out of bounds/);
});
