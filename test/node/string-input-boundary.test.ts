import test from "node:test";
import assert from "node:assert/strict";
import { Nar } from "../../src/main/Nar.ts";
import { Narsese } from "../../src/io/Narsese.ts";

test("Node strings are normalized at Narsese input boundaries", () => {
    const nar = new Nar();
    const narsese = new Narsese(nar);

    assert.ok(narsese.parseTerm("a"));
    const task = narsese.parseTask("<a --> b>.");
    assert.equal(task.sentence.term.toString().valueOf(), "<a --> b>");

    nar.addInput("<a --> b>.");
});
