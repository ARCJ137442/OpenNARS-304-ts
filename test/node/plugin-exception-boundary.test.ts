import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const pluginFiles = [
    "src/plugin/mental/Abbreviation.ts",
    "src/plugin/mental/Emotions.ts",
    "src/plugin/mental/InternalExperience.ts",
    "src/plugin/perception/SensoryChannel.ts",
    "src/plugin/perception/VisionChannel.ts",
];

test("plugin exception boundaries use project-owned Java exception classes", () => {
    for (const file of pluginFiles) {
        const source = readFileSync(file, "utf8");
        assert.doesNotMatch(source, /new java\.lang\.(IllegalArgumentException|IllegalStateException)/, file);
    }
});
