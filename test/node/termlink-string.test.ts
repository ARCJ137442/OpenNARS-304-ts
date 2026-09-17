import assert from "node:assert/strict";
import test from "node:test";
import { Term } from "../../src/language/Term.ts";
import { TermLink } from "../../src/entity/TermLink.ts";

test("TermLink prefix preserves Java type, index order, and hexadecimal formatting", () => {
    const target = Term.get("target");
    const component = new TermLink(TermLink.COMPONENT, target, 0, 15);
    const compound = new TermLink(TermLink.COMPOUND, target, 1);

    assert.equal(component.newKeyPrefix(), "@(T1-1-10)_");
    assert.equal(component.toString(), "@(T1-1-10)_target");
    assert.equal(compound.newKeyPrefix(), "_@(T2-2)");
    assert.equal(compound.toString(), "_@(T2-2)target");
    assert.equal(typeof component.newKeyPrefix(), "string");
});
