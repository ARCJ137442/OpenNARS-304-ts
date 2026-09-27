import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { java } from "jree";

import { toJavaString, type JavaStringInput } from "../../src/runtime/jree-compat.ts";

test("Shell command-line text boundaries accept project-owned strings", () => {
    const source = readFileSync("src/main/Shell.ts", "utf8");
    assert.match(source, /createNar\(args: JavaStringInput\[\]\)/);
    assert.match(source, /log\(message: JavaStringInput\)/);
    assert.match(source, /main\(args: JavaStringInput\[\]\)/);
    assert.match(source, /run\(args: JavaStringInput\[\]\)/);

    const nativeArgs: JavaStringInput[] = ["null", "null", "null", "1"];
    const boxedArgs: JavaStringInput[] = nativeArgs.map((value) => new java.lang.String(String(value)));
    assert.deepEqual(nativeArgs.map((value) => String(toJavaString(value))), ["null", "null", "null", "1"]);
    assert.deepEqual(boxedArgs.map((value) => String(toJavaString(value))), ["null", "null", "null", "1"]);
});
