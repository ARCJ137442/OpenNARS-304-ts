import test from "node:test";
import assert from "node:assert/strict";
import type { CompoundTerm as CompoundTermType } from "../../src/language/CompoundTerm.ts";
import { Nar } from "../../src/main/Nar.ts";
import { Narsese } from "../../src/io/Narsese.ts";
import { Operation } from "../../src/operator/Operation.ts";

test("Node strings are normalized at Narsese input boundaries", () => {
    const nar = new Nar();
    const narsese = new Narsese(nar);

    assert.ok(narsese.parseTerm("a"));
    const task = narsese.parseTask("<a --> b>.");
    assert.equal(task.sentence.term.toString().valueOf(), "<a --> b>");

    nar.addInput("<a --> b>.");
});

test("Narsese compound parsing preserves native argument order", () => {
    const narsese = new Narsese(new Nar());
    const parsed = narsese.parseTerm("(*,first,(&&,second,third))");

    assert.ok(parsed);
    assert.deepEqual((parsed as CompoundTermType).term.map((term) => String(term.name())), [
        "first",
        "(&&,second,third)",
    ]);
});

test("Narsese functional operation parsing consumes native operator prefix text", () => {
    const narsese = new Narsese(new Nar());
    const parsed = narsese.parseTerm("add(a,b)");

    assert.ok(parsed instanceof Operation);
    assert.equal(String(parsed.name()), "(^add,a,b)");
});
