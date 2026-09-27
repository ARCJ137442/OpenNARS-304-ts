import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("Parser and ConfigReader keep Java input types behind project boundaries", () => {
    const parser = readFileSync("src/io/Parser.ts", "utf8");
    const configReader = readFileSync("src/io/ConfigReader.ts", "utf8");
    assert.doesNotMatch(parser, /from ["']jree["']/);
    assert.doesNotMatch(configReader, /from ["']jree["']/);
    assert.match(parser, /JavaStringInput/);
    assert.match(configReader, /JavaStringInput/);
    assert.match(parser, /JavaException/);
});
