import assert from "node:assert/strict";
import test from "node:test";
import { java } from "jree";

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
