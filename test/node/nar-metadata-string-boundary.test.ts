import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { Nar } from "../../src/main/Nar.ts";

test("Nar metadata and configuration paths stay native strings", () => {
    const source = readFileSync("src/main/Nar.ts", "utf8");
    assert.match(source, /VERSION: string/);
    assert.match(source, /NAME: string/);
    assert.match(source, /WEBSITE: string/);
    assert.match(source, /DEFAULTCONFIG_FILEPATH: string/);
    assert.match(source, /usedConfigFilePath: string/);
    assert.doesNotMatch(source, /VERSION: java\.lang\.String/);
    assert.doesNotMatch(source, /NAME: java\.lang\.String/);
    assert.doesNotMatch(source, /DEFAULTCONFIG_FILEPATH: java\.lang\.String/);
    assert.equal(typeof Nar.VERSION, "string");
    assert.equal(typeof Nar.NAME, "string");
    assert.equal(typeof Nar.WEBSITE, "string");
    assert.equal(typeof Nar.DEFAULTCONFIG_FILEPATH, "string");

    const nar = new Nar({ configText: "<config></config>", configSource: "<memory>" });
    try {
        assert.equal(typeof nar.usedConfigFilePath, "string");
        assert.equal(nar.usedConfigFilePath, "<memory>");
    } finally {
        nar.stop();
    }
});
