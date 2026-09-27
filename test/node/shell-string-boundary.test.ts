import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { java } from "jree";

import { toJavaString, type JavaStringInput } from "../../src/runtime/jree-compat.ts";
import { Shell } from "../../src/main/Shell.ts";

test("Shell command-line text boundaries accept project-owned strings", () => {
    const source = readFileSync("src/main/Shell.ts", "utf8");
    assert.doesNotMatch(source, /\bS`/);
    assert.doesNotMatch(source, /import\s*\{[^}]*\bS\b[^}]*\}\s*from\s*["']jree["']/);
    assert.match(source, /createNar\(args: JavaStringInput\[\]\)/);
    assert.match(source, /log\(message: JavaStringInput\)/);
    assert.match(source, /main\(args: JavaStringInput\[\]\)/);
    assert.match(source, /run\(args: JavaStringInput\[\]\)/);

    const nativeArgs: JavaStringInput[] = ["null", "null", "null", "1"];
    const boxedArgs: JavaStringInput[] = nativeArgs.map((value) => new java.lang.String(String(value)));
    assert.deepEqual(nativeArgs.map((value) => String(toJavaString(value))), ["null", "null", "null", "1"]);
    assert.deepEqual(boxedArgs.map((value) => String(toJavaString(value))), ["null", "null", "null", "1"]);
});

test("Shell log preserves native and boxed string output", () => {
    const shellLogger = Shell as unknown as { log(message: JavaStringInput): void };
    const outputChunks: string[] = [];
    const originalWrite = process.stdout.write;
    process.stdout.write = ((chunk: string | Uint8Array) => {
        outputChunks.push(typeof chunk === "string" ? chunk : Buffer.from(chunk).toString("utf8"));
        return true;
    }) as typeof process.stdout.write;
    try {
        shellLogger.log("native");
        shellLogger.log(new java.lang.String("boxed"));
    } finally {
        process.stdout.write = originalWrite;
    }
    const lineSeparator = String(java.lang.System.lineSeparator());
    assert.equal(outputChunks.join(""), `[l]: native${lineSeparator}[l]: boxed${lineSeparator}`);
});
