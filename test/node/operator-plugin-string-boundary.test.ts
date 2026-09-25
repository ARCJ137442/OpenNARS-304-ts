import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const sourceFiles = [
    "src/operator/misc/System.ts",
    "src/operator/mental/Anticipate.ts",
    "src/plugin/mental/Abbreviation.ts",
    "src/plugin/mental/InternalExperience.ts",
    "src/plugin/perception/VisionChannel.ts",
    "src/plugin/perception/SensoryChannel.ts",
];

test("operator and plugin text boundaries use native strings", () => {
    for (const file of sourceFiles) {
        const source = readFileSync(file, "utf8");
        assert.doesNotMatch(source, /new java\.lang\.String/, file);
        if (file === "src/plugin/mental/Abbreviation.ts" || file === "src/plugin/mental/InternalExperience.ts" || file === "src/plugin/perception/SensoryChannel.ts") {
            assert.doesNotMatch(source, /from ["']jree["']/);
        }
    }
});
