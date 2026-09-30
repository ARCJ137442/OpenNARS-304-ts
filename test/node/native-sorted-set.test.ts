import assert from "node:assert/strict";
import test from "node:test";
import { java } from "../../src/runtime/native-runtime.ts";

import { Term } from "../../src/language/Term.ts";
import { NativeSortedSet } from "../../src/runtime/NativeSortedSet.ts";

test("NativeSortedSet preserves TreeSet order and comparator uniqueness", () => {
    const first = Term.get("sorted-set-a");
    const second = Term.get("sorted-set-b");
    if (first === null || second === null) throw new Error("terms must exist");

    const set = new NativeSortedSet(
        [second, first, second],
        (left, right) => left.compareTo(right),
    );

    assert.equal(set.size(), 2);
    assert.deepEqual(set.toArray().map((term) => String(term.name())), ["sorted-set-a", "sorted-set-b"]);
    assert.equal(set.contains(first), true);
    assert.equal(set.add(first), false);
    assert.equal(set.add(Term.get("sorted-set-c")), true);
});

test("NativeSortedSet follows the Java Set equality and hash contract", () => {
    const first = Term.get("sorted-equality-a");
    const second = Term.get("sorted-equality-b");
    if (first === null || second === null) throw new Error("terms must exist");
    const compare = (left: Term, right: Term) => left.compareTo(right);
    const left = new NativeSortedSet([first, second], compare);
    const right = new NativeSortedSet([second, first], compare);

    assert.equal(left.equals(right), true);
    assert.equal(right.equals(left), true);
    assert.equal(left.hashCode(), right.hashCode());
});

test("Term.toSortedSet supports retainAll and Java-shaped toArray", () => {
    const first = Term.get("native-set-a");
    const second = Term.get("native-set-b");
    const third = Term.get("native-set-c");
    if (first === null || second === null || third === null) throw new Error("terms must exist");

    const set = Term.toSortedSet(third, first, second, second);
    assert.equal(set.size(), 3);
    const kept = new NativeSortedSet([first, third], (left, right) => left.compareTo(right));
    assert.equal(set.retainAll(kept as unknown as java.util.Collection<Term>), true);

    const target = new Array<Term>(3);
    assert.equal(set.toArray(target), target);
    assert.deepEqual(
        target.map((term) => term === undefined ? "undefined" : String(term.name())),
        ["native-set-a", "native-set-c", "undefined"],
    );
});
