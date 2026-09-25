import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const sourceFiles = [
    "src/operator/misc/System.ts",
    "src/plugin/mental/Abbreviation.ts",
    "src/plugin/perception/VisionChannel.ts",
];

test("operator and plugin text boundaries use native strings", () => {
    for (const file of sourceFiles) {
        const source = readFileSync(file, "utf8");
        assert.doesNotMatch(source, /new java\.lang\.String/, file);
        if (file === "src/plugin/mental/Abbreviation.ts") {
            assert.doesNotMatch(source, /from ["']jree["']/);
        }
    }
});
