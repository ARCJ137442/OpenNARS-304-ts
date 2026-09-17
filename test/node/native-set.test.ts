import assert from "node:assert/strict";
import test from "node:test";

import { NativeSet } from "../../src/runtime/NativeSet.ts";

class EqualValue {
    public constructor(public readonly key: string) {}

    public equals(other: unknown): boolean {
        return other instanceof EqualValue && this.key === other.key;
    }
}

test("NativeSet preserves Java Set equality and insertion order", () => {
    const first = new EqualValue("first");
    const equalFirst = new EqualValue("first");
    const second = new EqualValue("second");
    const values = new NativeSet([first, equalFirst, second]);

    assert.equal(values.size(), 2);
    assert.deepEqual(values.toArray(), [first, second]);
    assert.equal(values.contains(equalFirst), true);
    assert.equal(values.remove(equalFirst), true);
    assert.equal(values.contains(first), false);
    assert.deepEqual(values.toArray(), [second]);

    values.clear();
    assert.equal(values.isEmpty(), true);
});

test("NativeSet uses the searched value as the Java equals receiver", () => {
    class StoredValue {
        public equals(_other: unknown): boolean {
            return false;
        }
    }
    class SearchValue {
        public equals(other: unknown): boolean {
            return other instanceof StoredValue;
        }
    }

    const values = new NativeSet<StoredValue | SearchValue>([new StoredValue()]);
    assert.equal(values.contains(new SearchValue()), true);
});

test("NativeSet.equals follows Java AbstractSet receiver direction", () => {
    class StoredValue {
        public equals(_other: unknown): boolean {
            return false;
        }
    }
    class SearchValue {
        public equals(other: unknown): boolean {
            return other instanceof StoredValue;
        }
    }

    const left = new NativeSet<StoredValue | SearchValue>([new StoredValue()]);
    const right = new NativeSet<StoredValue | SearchValue>([new SearchValue()]);

    // Java AbstractSet.equals is this.containsAll(other), so the receiver is
    // the left-hand set and its contains implementation examines right's
    // values.  This is intentionally asymmetric for the test value objects.
    assert.equal(left.equals(right), true);
    assert.equal(right.equals(left), false);
});
