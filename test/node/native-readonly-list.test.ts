import assert from "node:assert/strict";
import test from "node:test";
import { NativeList, NativeReadOnlyList } from "../../src/runtime/NativeList.ts";

test("NativeReadOnlyList is a live ordered view over a native array", () => {
    const source = ["first", "second"];
    const view = new NativeReadOnlyList(source);

    assert.equal(view.size(), 2);
    assert.equal(view.get(0), "first");
    assert.deepEqual(view.toArray(), ["first", "second"]);
    assert.deepEqual([...view], ["first", "second"]);

    source.push("third");
    assert.equal(view.size(), 3);
    assert.equal(view.get(2), "third");
    source.splice(0, 1);
    assert.deepEqual([...view], ["second", "third"]);
});

test("NativeReadOnlyList preserves NativeList equality lookup and rejects mutation", () => {
    const stored = { value: "same", equals(other: unknown): boolean {
        return (other as { value?: string } | null)?.value === this.value;
    } };
    const source = new NativeList([stored]);
    const view = new NativeReadOnlyList(source);
    const searched = { value: "same", equals(other: unknown): boolean {
        return (other as { value?: string } | null)?.value === this.value;
    } };

    assert.equal(view.contains(searched), true);
    assert.equal(view.indexOf(searched), 0);
    assert.throws(() => view.clear(), /UnsupportedOperationException/);
    assert.throws(() => view.remove(0), /UnsupportedOperationException/);
    const iterator = view.iterator();
    assert.equal(iterator.next(), stored);
    assert.throws(() => iterator.remove(), /UnsupportedOperationException/);
});
