import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { java } from "jree";

import { toJavaString } from "../../src/runtime/jree-compat.ts";

test("NarNode network text boundaries stay project-owned", () => {
    const source = readFileSync("src/main/NarNode.ts", "utf8");
    assert.doesNotMatch(source, /\bS`/);
    assert.doesNotMatch(source, /import\s*\{[^}]*\bS\b[^}]*\}\s*from\s*["']jree["']/);
    assert.match(source, /sendNarsese\(input: JavaStringInput, target: NarNode\.TargetNar\)/);
    assert.match(source, /sendNarsese\(input: JavaStringInput, targetIP: JavaStringInput/);
    assert.match(source, /constructor\(targetIP: JavaStringInput/);
    assert.match(source, /addRedirectionTo\(targetIP: JavaStringInput/);

    const nativeHost = "127.0.0.1";
    const boxedHost = new java.lang.String(nativeHost);
    assert.equal(String(toJavaString(nativeHost)), nativeHost);
    assert.equal(String(toJavaString(boxedHost)), nativeHost);

    const net = java.net as unknown as Record<string, unknown>;
    const io = java.io as unknown as Record<string, unknown>;
    assert.equal(typeof net.InetAddress, "undefined");
    assert.equal(typeof net.DatagramSocket, "undefined");
    assert.equal(typeof io.ObjectOutputStream, "undefined");
});
