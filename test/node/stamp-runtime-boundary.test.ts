import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { java } from "../../src/platform/node/legacy-runtime-facade.ts";
import { Stamp } from "../../src/entity/Stamp.ts";
import { Tense } from "../../src/language/Tense.ts";

const source = readFileSync(new URL("../../src/entity/Stamp.ts", import.meta.url), "utf8");

const makeStamp = (narId: number, inputId: number): Stamp =>
    new Stamp(Tense.Present, new Stamp.BaseEntry(narId, inputId));

test("Stamp keeps project-owned exception and collection boundaries", () => {
    assert.doesNotMatch(source, /from ["']jree["']/);
    assert.doesNotMatch(source, /java\.util\.Arrays/);
    assert.doesNotMatch(source, /new java\.lang\.(?:IllegalArgumentException|IllegalStateException)/);

    const stamp = makeStamp(7, 11);
    assert.equal(stamp.evidentialHash(), stamp.evidentialHash());
    assert.equal(stamp.equals(stamp, true, true, true), true);
    assert.ok(stamp.name() instanceof java.lang.String);
});
