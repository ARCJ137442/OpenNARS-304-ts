import assert from "node:assert/strict";
import test from "node:test";

import { NativeMap } from "../../src/runtime/NativeMap.ts";

class EqualKey {
    public constructor(public readonly name: string) {}

    public equals(other: unknown): boolean {
        return other instanceof EqualKey && this.name === other.name;
    }

    public hashCode(): number {
        return this.name.length;
    }
}

class EqualsOnlyKey {
    public constructor(public readonly name: string) {}

    public equals(other: unknown): boolean {
        return other instanceof EqualsOnlyKey && this.name === other.name;
    }
}

test("NativeMap preserves Java Map equality, insertion order, and replacement position", () => {
    const first = new EqualKey("first");
    const equalFirst = new EqualKey("first");
    const second = new EqualKey("second");
    const values = new NativeMap<EqualKey, number>();

    assert.equal(values.put(first, 1), null);
    assert.equal(values.put(second, 2), null);
    assert.equal(values.put(equalFirst, 3), 1);
    assert.equal(values.size(), 2);
    assert.equal(values.get(equalFirst), 3);
    assert.deepEqual(values.keySet().toArray(), [first, second]);
    assert.deepEqual(values.entrySet().toArray().map((entry) => [entry.getKey(), entry.getValue()]), [
        [first, 3],
        [second, 2],
    ]);
});

test("NativeMap scans hash collisions and removes indexed records", () => {
    const first = new EqualKey("first");
    const collision = new EqualKey("other");
    const values = new NativeMap<EqualKey, number>();

    assert.equal(first.hashCode(), collision.hashCode());
    values.put(first, 1);
    values.put(collision, 2);
    assert.equal(values.size(), 2);
    assert.equal(values.get(new EqualKey("first")), 1);
    assert.equal(values.get(new EqualKey("other")), 2);
    assert.equal(values.remove(new EqualKey("first")), 1);
    assert.equal(values.get(new EqualKey("other")), 2);

    values.clear();
    assert.equal(values.size(), 0);
    values.put(collision, 3);
    assert.equal(values.get(new EqualKey("other")), 3);
});

test("NativeMap preserves equality fallback for object keys without hashCode", () => {
    const values = new NativeMap<EqualsOnlyKey, number>();
    values.put(new EqualsOnlyKey("same"), 1);

    assert.equal(values.containsKey(new EqualsOnlyKey("same")), true);
    assert.equal(values.put(new EqualsOnlyKey("same"), 2), 1);
    assert.equal(values.size(), 1);
    assert.equal(values.get(new EqualsOnlyKey("same")), 2);
});

test("NativeMap views are live and iterators support Java-style removal", () => {
    const values = new NativeMap<string, number>([["first", 1], ["second", 2], ["third", 3]]);
    const keyView = values.keySet();
    const entryIterator = values.entrySet().iterator();

    assert.deepEqual(keyView.toArray(), ["first", "second", "third"]);
    assert.equal(entryIterator.next().getKey(), "first");
    entryIterator.remove();
    assert.deepEqual(keyView.toArray(), ["second", "third"]);
    assert.equal(values.values().contains(2), true);
    assert.equal(values.values().remove(2), true);
    assert.deepEqual(keyView.toArray(), ["third"]);
    assert.equal(values.put("fourth", 4), null);
    assert.throws(() => entryIterator.hasNext(), /modified outside its iterator/);
});

test("NativeMap distinguishes a missing key from a mapped null value", () => {
    const values = new NativeMap<string, string | null>();
    values.put("present", null);

    assert.equal(values.containsKey("present"), true);
    assert.equal(values.get("present"), null);
    assert.equal(values.get("missing"), null);
    assert.equal(values.getOrDefault("present", "default"), null);
    assert.equal(values.getOrDefault("missing", "default"), "default");
});

test("NativeMap count entries match jree LinkedHashMap on equal domain keys", async () => {
    const { java } = await import("jree");
    const first = new EqualKey("first");
    const equalFirst = new EqualKey("first");
    const second = new EqualKey("second");
    const nativeMap = new NativeMap<EqualKey, number>();
    const javaMap = new java.util.LinkedHashMap<EqualKey, { valueOf(): number }>();

    nativeMap.put(first, 1);
    javaMap.put(first, java.lang.Integer.valueOf(1));
    nativeMap.put(second, 2);
    javaMap.put(second, java.lang.Integer.valueOf(2));
    nativeMap.put(equalFirst, 3);
    javaMap.put(equalFirst, java.lang.Integer.valueOf(3));

    assert.equal(nativeMap.size(), javaMap.size());
    assert.deepEqual(nativeMap.keySet().toArray(), Array.from(javaMap.keySet()));
    assert.equal(nativeMap.get(equalFirst), javaMap.get(equalFirst)?.valueOf());
});
