import assert from "node:assert/strict";
import test from "node:test";
import { CompoundTerm } from "../../src/language/CompoundTerm.ts";
import { Narsese } from "../../src/io/Narsese.ts";
import { Nar } from "../../src/main/Nar.ts";

test("CompoundTerm equality rejects unequal complexity before name formatting", () => {
    const nar = new Nar();
    try {
        const parser = new Narsese(nar);
        const left = parser.parseTerm("<(*,a,b) --> visible>") as CompoundTerm;
        const right = parser.parseTerm("<(*,a,b,c) --> visible>") as CompoundTerm;
        assert.notEqual(left.getComplexity(), right.getComplexity());
        const leftName = left.name;
        let nameCalls = 0;
        left.name = (() => {
            nameCalls += 1;
            return leftName.call(left);
        }) as CompoundTerm["name"];
        assert.equal(left.equals(right), false);
        assert.equal(nameCalls, 0);
        left.name = leftName;
    } finally {
        nar.stop();
    }
});

test("CompoundTerm equality still compares equal-complexity terms by name", () => {
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
