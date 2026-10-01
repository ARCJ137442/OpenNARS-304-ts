import assert from "node:assert/strict";
import test from "node:test";

import "../support/legacy-runtime-facade.ts";
import { java } from "../support/legacy-runtime-facade.ts";

test("LinkedHashSet keeps insertion order for hashable Java objects", () => {
    const first = new java.util.LinkedHashSet<number>();
    first.add(1);
    first.add(2);
    const second = new java.util.LinkedHashSet<number>();
    second.add(3);
    const third = new java.util.LinkedHashSet<number>();

    const values = new java.util.LinkedHashSet<java.util.LinkedHashSet<number>>();
    for (const value of [first, second, third]) {
        values.add(value);
    }

    assert.deepEqual(values.toArray(), [first, second, third]);
    assert.deepEqual([...values].map((value) => [...value]), [[1, 2], [3], []]);
});

test("LinkedHashSet add, remove, and re-add follow Java order", () => {
    const values = new java.util.LinkedHashSet<string>();
    values.add("a");
    values.add("b");
    values.remove("a");
    values.add("a");

    assert.deepEqual([...values], ["b", "a"]);
});
