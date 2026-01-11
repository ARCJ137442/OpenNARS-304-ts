import assert from "node:assert/strict";
import test from "node:test";
import { Distributor } from "../../src/storage/Distributor.ts";

test("Distributor fills order with expected counts", () => {
    const range = 20;
    const distributor = new Distributor(range);

    const expectedCapacity = (range * (range + 1)) / 2;
    assert.equal(distributor.order.length, expectedCapacity);

    const counts = new Array<number>(range).fill(0);
    for (const value of distributor.order) {
        assert.ok(Number.isInteger(value), "order values must be integers");
        assert.ok(value >= 0 && value < range, "order values must be within [0, range)");
        counts[value]++;
    }

    for (let value = 0; value < range; value++) {
        assert.equal(counts[value], value + 1, `value ${value} should appear ${value + 1} times`);
    }
});

test("Distributor.next cycles through capacity", () => {
    const range = 10;
    const distributor = new Distributor(range);

    const capacity = (range * (range + 1)) / 2;
    let index = 0;
    for (let steps = 0; steps < capacity; steps++) {
        assert.equal(distributor.pick(index), distributor.order[index]);
        index = distributor.next(index);
    }
    assert.equal(index, 0);
});

test("Distributor rejects non-positive range", () => {
    assert.throws(() => new Distributor(0), RangeError);
    assert.throws(() => new Distributor(-1), RangeError);
});
