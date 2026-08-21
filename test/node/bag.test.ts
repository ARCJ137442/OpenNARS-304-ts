import assert from "node:assert/strict";
import test from "node:test";
import { Bag } from "../../src/storage/Bag.ts";
import { Item } from "../../src/entity/Item.ts";
import { Parameters } from "../../src/main/Parameters.ts";

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
