import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { java } from "../../src/platform/node/legacy-runtime-facade.ts";

import type { Plugin } from "../../src/plugin/Plugin.ts";

test("Plugin CharSequence boundary accepts Java and native string values", () => {
    const javaNamedPlugin: Plugin = {
        setEnabled: () => true,
        name: () => new java.lang.String("JavaNamedPlugin"),
    };
    const nativeNamedPlugin: Plugin = {
        setEnabled: () => true,
        name: () => "NativeNamedPlugin",
    };

    assert.equal(String(javaNamedPlugin.name?.()), "JavaNamedPlugin");
    assert.equal(nativeNamedPlugin.name?.(), "NativeNamedPlugin");
});

test("Plugin names use a project-owned CharSequence boundary", () => {
    const source = readFileSync("src/plugin/Plugin.ts", "utf8");

    assert.doesNotMatch(source, /from ["'][^"']*native-runtime\.ts["']/);
});
