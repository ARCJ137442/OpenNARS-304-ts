import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { java } from "../../src/platform/node/legacy-runtime-facade.ts";

import { Nar } from "../../src/main/Nar.ts";

test("Nar internal input helpers keep native string values", () => {
    const source = readFileSync("src/main/Nar.ts", "utf8");
    assert.doesNotMatch(source, /private addMultiLineInput\(text: java\.lang\.String\)/);
    assert.doesNotMatch(source, /private addCommand\(text: java\.lang\.String\)/);
    assert.doesNotMatch(source, /addMultiLineInput\(new java\.lang\.String\(inputText\)\)/);
    assert.doesNotMatch(source, /addCommand\(inputText as unknown as java\.lang\.String\)/);
    assert.doesNotMatch(source, /parseTask\(new java\.lang\.String\(inputText\)\)/);
    assert.doesNotMatch(source, /this\.addInput\(new java\.lang\.String\(newInput\)\)/);

    const nar = new Nar();
    try {
        nar.addInput("1");
        nar.addInput(new java.lang.String("2"));
        nar.addInput("<native --> input>.\n<boxed --> input>.");
        assert.equal(typeof Nar.NAME, "string");
    } finally {
        nar.stop();
    }
});
