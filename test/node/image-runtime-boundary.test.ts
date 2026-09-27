import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { ImageExt } from "../../src/language/ImageExt.ts";
import { Term } from "../../src/language/Term.ts";

test("Image uses project-owned string and hash boundaries", () => {
    const source = readFileSync("src/language/Image.ts", "utf8");
    assert.doesNotMatch(source, /from ["']jree["']/);
    assert.doesNotMatch(source, /java\.util\.Objects\.hash/);
    assert.doesNotMatch(source, /new java\.lang\.StringBuilder/);
});

test("Image keeps Java-compatible generated names", () => {
    const relation = Term.get("image-relation");
    const variable = Term.get("?image-variable");
    const image = new ImageExt([relation, variable], 0);
    assert.equal(String(image.name()), "(/,image-relation,_,?image-variable)");
});
