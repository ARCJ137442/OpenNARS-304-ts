import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { java } from "../../src/platform/node/legacy-runtime-facade.ts";

import { Nar } from "../../src/main/Nar.ts";
import { NativeMap } from "../../src/runtime/NativeMap.ts";

test("Nar configuration keys and state strings stay native", () => {
    const source = readFileSync("src/main/Nar.ts", "utf8");
    assert.doesNotMatch(source, /protected name: java\.lang\.String \| null/);
    assert.doesNotMatch(source, /let propertyName: java\.lang\.String/);
    assert.match(source, /protected name: string \| null/);
    assert.match(source, /const propertyName = String\(iOverride\.getKey\(\)\)/);

    const overrides = new NativeMap<string | java.lang.String, unknown>();
    overrides.put(new java.lang.String("HORIZON"), 2);
    const nar = new Nar({
        configText: "<config></config>",
        parameterOverrides: overrides as never,
    });
    try {
        assert.equal(nar.narParameters.HORIZON, 2);
    } finally {
        nar.stop();
    }
});
