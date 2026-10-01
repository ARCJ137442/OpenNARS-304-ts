import assert from "node:assert/strict";
import test from "node:test";
import { CompoundTerm } from "../../src/language/CompoundTerm.ts";
import { Narsese } from "../../src/io/Narsese.ts";
import { Nar } from "../../src/main/Nar.ts";

test("CompoundTerm equality rejects different component counts before names", () => {
    const nar = new Nar();
    try {
        const parser = new Narsese(nar);
        const left = parser.parseTerm("(*,a,b)") as CompoundTerm;
        const right = parser.parseTerm("(*,a,b,c)") as CompoundTerm;
        assert.notEqual(left.term.length, right.term.length);
        assert.equal(left.equals(right), false);
    } finally {
        nar.stop();
    }
});

test("CompoundTerm equality retains equal-arity name comparison", () => {
    const nar = new Nar();
    try {
        const parser = new Narsese(nar);
        const left = parser.parseTerm("<(*,a,b) --> visible>") as CompoundTerm;
        const right = parser.parseTerm("<(*,a,b) --> visible>") as CompoundTerm;
        assert.equal(left.equals(right), true);
    } finally {
        nar.stop();
    }
});

test("CompoundTerm equality contract is name-based even after restored-name mutation", () => {
    const nar = new Nar();
    try {
        const parser = new Narsese(nar);
        const left = parser.parseTerm("(*,a,b)") as CompoundTerm;
        const right = parser.parseTerm("(*,a,b,c)") as CompoundTerm;
        const restoreName = (term: CompoundTerm, name: string): void => {
            (term as unknown as { setName(value: string): void }).setName(name);
        };
        restoreName(left, "restored-name");
        restoreName(right, "restored-name");
        assert.equal(left.equals(right), true);
    } finally {
        nar.stop();
    }
});
