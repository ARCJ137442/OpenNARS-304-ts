import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { java } from "jree";

import { toJavaString } from "../../src/runtime/jree-compat.ts";

test("Nar file persistence exposes project-owned text path boundaries", () => {
    const source = readFileSync("src/main/Nar.ts", "utf8");
    assert.match(source, /SaveToFile\(name: JavaStringInput\)/);
    assert.match(source, /LoadFromFile\(name: JavaStringInput\)/);
    assert.match(source, /FileOutputStream\(toJavaString\(name\)\)/);
    assert.match(source, /FileInputStream\(toJavaString\(name\)\)/);

    const nativePath = "/tmp/opennars-native.nars";
    const boxedPath = new java.lang.String("/tmp/opennars-boxed.nars");
    assert.equal(String(toJavaString(nativePath)), nativePath);
    assert.equal(String(toJavaString(boxedPath)), String(boxedPath));

    const io = java.io as unknown as Record<string, unknown>;
    assert.equal(typeof io.ObjectOutputStream, "undefined");
    assert.equal(typeof io.ObjectInputStream, "undefined");
});
