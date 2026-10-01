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

test("operator and plugin exceptions use the project-owned exception layer", () => {
    const exceptionFiles = [
        "src/operator/FunctionOperator.ts",
        "src/operator/NullOperator.ts",
        "src/operator/Operation.ts",
        "src/operator/Operator.ts",
        "src/operator/mental/Anticipate.ts",
        "src/operator/misc/Add.ts",
        "src/operator/misc/Count.ts",
        "src/operator/misc/Reflect.ts",
        "src/plugin/mental/Counting.ts",
        "src/plugin/mental/Emotions.ts",
        "src/plugin/perception/SensoryChannel.ts",
        "src/plugin/perception/VisionChannel.ts",
    ];

    for (const file of exceptionFiles) {
        const source = readFileSync(file, "utf8");
        const jreeImports = [...source.matchAll(/import\s*(?:type\s*)?\{([^}]*)\}\s*from\s*["'][^"']*native-runtime\.ts["']/g)]
            .map((match) => match[1]);
        for (const importedNames of jreeImports) {
            assert.doesNotMatch(importedNames, /\bJava(?:Illegal|Null|NumberFormat|Runtime|Exception|Error)[A-Z]\w*/, file);
        }
        assert.match(source, /from ["'][^"']*runtime\/(?:JavaExceptions|ReasonerErrors)\.ts["']/, file);
    }
});
