import assert from "node:assert/strict";
import test from "node:test";
import { java } from "jree";
import { Bag } from "../../src/storage/Bag.ts";
import { Item } from "../../src/entity/Item.ts";
import { Parameters } from "../../src/main/Parameters.ts";
import { Term } from "../../src/language/Term.ts";
import { NativeMap } from "../../src/runtime/NativeMap.ts";

class TestItem extends Item<string> {
    private readonly key: string;
    private readonly priority: number;

    public constructor(key: string, priority: number) {
        super();
        this.key = key;
        this.priority = priority;
    }

    public name(): string {
        return this.key;
    }

    public getPriority(): number {
        return this.priority;
    }

    public merge(): Item<unknown> {
        return this;
    }
}

test("Bag.pickOut supports both Java overload shapes", () => {
    const bag = new Bag<TestItem, string>(4, 10, new Parameters());
    const item = new TestItem("item", 0.8);

    bag.putIn(item);
    assert.equal(bag.pickOut(item), item);
    assert.equal(bag.size(), 0);

    bag.putIn(item);
    assert.equal(bag.pickOut("item"), item);
    assert.equal(bag.size(), 0);
});

test("Bag keeps its observed runtime class identity without jree JavaObject", () => {
    const bag = new Bag<TestItem, string>(4, 10, new Parameters());

    assert.equal(bag.getClass().getSimpleName(), "Bag");
});

test("Bag.pickOut keeps a key object with name() on the key overload", () => {
    class TermKeyItem extends Item<Term> {
        private readonly key: Term;

        public constructor(key: Term) {
            super();
            this.key = key;
        }

        public name(): Term {
            return this.key;
        }

        public getPriority(): number {
            return 0.8;
        }

        public merge(): Item<unknown> {
            return this;
        }
    }

    const bag = new Bag<TermKeyItem, Term>(4, 10, new Parameters());
    const key = Term.get("a");
    const item = new TermKeyItem(key);

    bag.putIn(item);
    assert.equal(bag.pickOut(Term.get("a")), item);
    assert.equal(bag.size(), 0);
});

test("Bag merges distinct object keys through Java equals semantics", () => {
    class EqualKey {
        public readonly value: string;

        public constructor(value: string) {
            this.value = value;
        }

        public equals(other: unknown): boolean {
            return other instanceof EqualKey && other.value === this.value;
        }

        public hashCode(): number {
            return this.value.length;
        }
    }

    class EqualKeyItem extends Item<EqualKey> {
        private readonly key: EqualKey;

        public constructor(key: EqualKey) {
            super();
            this.key = key;
        }

        public name(): EqualKey {
            return this.key;
        }

        public getPriority(): number {
            return 0.8;
        }

        public merge(): Item<unknown> {
            return this;
        }
    }

    const bag = new Bag<EqualKeyItem, EqualKey>(4, 10, new Parameters());
    const first = new EqualKeyItem(new EqualKey("same"));
    const second = new EqualKeyItem(new EqualKey("same"));

    bag.putIn(first);
    bag.putIn(second);

    assert.equal(bag.size(), 1);
    assert.equal(bag.pickOut(new EqualKey("same")), second);
    assert.equal(bag.size(), 0);
});

test("Bag lookup remains Java-equal when the legacy hash bucket is malformed", () => {
    class EqualKey {
        public readonly value: string;

        public constructor(value: string) {
            this.value = value;
        }

        public equals(other: unknown): boolean {
            return other instanceof EqualKey && other.value === this.value;
        }

        public hashCode(): number {
            return this.value.length;
        }
    }

    class EqualKeyItem extends Item<EqualKey> {
        private readonly key: EqualKey;

        public constructor(key: EqualKey) {
            super();
            this.key = key;
        }

        public name(): EqualKey {
            return this.key;
        }

        public getPriority(): number {
            return 0.8;
        }

        public merge(): Item<unknown> {
            return this;
        }
    }

    const bag = new Bag<EqualKeyItem, EqualKey>(4, 10, new Parameters());
    const internals = bag as unknown as { equalityBuckets: Map<number, unknown> };
    const item = new EqualKeyItem(new EqualKey("same"));
    bag.putIn(item);
    internals.equalityBuckets.set(4, { restored: true });

    assert.equal(bag.get(new EqualKey("same")), item);
});

test("Bag removes an item when a restored hash bucket is not a JS array", () => {
    const bag = new Bag<TestItem, string>(4, 10, new Parameters());
    const item = new TestItem("same", 0.8);
    bag.putIn(item);

    const internals = bag as unknown as {
        equalityBuckets: Map<number, unknown>;
        removeKey: (key: string) => TestItem;
    };
    internals.equalityBuckets.set(4, { restored: true });

    assert.equal(internals.removeKey("same"), item);
    assert.equal(bag.size(), 0);
});

test("Bag removes from a restored Java List bucket without rebuilding the bag", () => {
    const bag = new Bag<TestItem, string>(4, 10, new Parameters());
    const item = new TestItem("same", 0.8);
    bag.putIn(item);

    const restoredBucket = new java.util.ArrayList<string>();
    restoredBucket.add("same");
    const internals = bag as unknown as {
        equalityBuckets: Map<number, unknown>;
        removeKey: (key: string) => TestItem;
    };
    internals.equalityBuckets.set(4, restoredBucket);

    assert.equal(internals.removeKey("same"), item);
    assert.equal(bag.size(), 0);
});

test("Bag removes from a restored Java Set bucket through iterator.remove", () => {
    const bag = new Bag<TestItem, string>(4, 10, new Parameters());
    const item = new TestItem("same", 0.8);
    bag.putIn(item);

    const restoredBucket = new java.util.LinkedHashSet<string>();
    restoredBucket.add("same");
    const internals = bag as unknown as {
        equalityBuckets: Map<number, unknown>;
        removeKey: (key: string) => TestItem;
    };
    internals.equalityBuckets.set(4, restoredBucket);

    assert.equal(internals.removeKey("same"), item);
    assert.equal(bag.size(), 0);
});

test("Bag stores priority-level FIFO queues in native arrays", () => {
    const bag = new Bag<TestItem, string>(4, 10, new Parameters());
    const internals = bag as unknown as { itemTable: unknown };
    const itemTable = internals.itemTable as unknown[];

    assert.equal(Array.isArray(itemTable), true);
    assert.equal(itemTable.length, 4);
    assert.ok(itemTable.every((level) => Array.isArray(level)));
});

test("Bag keeps the Java HashMap/LinkedHashMap contract with a native Map", () => {
    const bag = new Bag<TestItem, string>(4, 10, new Parameters());
    const internals = bag as unknown as { nameTable: unknown };

    assert.ok(internals.nameTable instanceof NativeMap);
    const first = new TestItem("first", 0.2);
    const second = new TestItem("second", 0.9);
    const replacement = new TestItem("first", 0.8);

    bag.putIn(first);
    bag.putIn(second);
    bag.putIn(replacement);

    assert.equal(bag.get("first"), replacement);
    assert.deepEqual(Array.from(bag), [replacement, second]);
});

test("Bag native iteration preserves LinkedHashMap insertion order across replacement and removal", () => {
    const bag = new Bag<TestItem, string>(4, 10, new Parameters());
    const first = new TestItem("first", 0.2);
    const second = new TestItem("second", 0.9);
    const replacement = new TestItem("first", 0.8);

    bag.putIn(first);
    bag.putIn(second);
    assert.deepEqual(Array.from(bag), [first, second]);

    bag.putIn(replacement);
    assert.deepEqual(Array.from(bag), [replacement, second]);

    assert.equal(bag.pickOut("first"), replacement);
    assert.deepEqual(Array.from(bag), [second]);
});
