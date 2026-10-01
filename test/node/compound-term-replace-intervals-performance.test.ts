import assert from "node:assert/strict";
import test from "node:test";

import { CompoundTerm } from "../../src/language/CompoundTerm.ts";
import { Term } from "../../src/language/Term.ts";
import { Narsese } from "../../src/io/Narsese.ts";
import { Nar } from "../../src/main/Nar.ts";

test("replaceIntervals skips cloning when a compound term has no intervals", () => {
    const nar = new Nar();
    const term = new Narsese(nar).parseTerm("<(*,bird,animal) --> visible>");
    assert.ok(term instanceof CompoundTerm);
    const compound = term as CompoundTerm;
    const originalCloneDeep = compound.cloneDeep;
    let cloneCalls = 0;
    compound.cloneDeep = (() => {
        cloneCalls += 1;
        return originalCloneDeep.call(compound);
    }) as CompoundTerm["cloneDeep"];
    try {
        assert.equal(CompoundTerm.replaceIntervals(compound), compound);
        assert.equal(cloneCalls, 0);
    } finally {
        compound.cloneDeep = originalCloneDeep;
        nar.stop();
    }
});

test("replaceIntervals still clones and replaces nested intervals", () => {
    const nar = new Nar();
    try {
        const term = new Narsese(nar).parseTerm("<(&/,a,+1) =/> b>");
        assert.ok(term instanceof CompoundTerm);
        assert.equal(term.hasInterval(), true);
        const compound = term as CompoundTerm;
        const originalCloneDeep = compound.cloneDeep;
        let cloneCalls = 0;
        compound.cloneDeep = (() => {
            cloneCalls += 1;
            return originalCloneDeep.call(compound);
        }) as CompoundTerm["cloneDeep"];
        const replaced = CompoundTerm.replaceIntervals(term);
        assert.ok(replaced);
        assert.equal(cloneCalls, 1);
        compound.cloneDeep = originalCloneDeep;
    } finally {
        nar.stop();
    }
});
