import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { Nar } from "../../src/main/Nar.ts";

test("Nar delegates wall-clock time to an explicit runtime capability", () => {
    const nar = new Nar({
        configText: "<config><conf name=\"STEPS_CLOCK\" value=\"false\" /></config>",
        capabilities: {
            currentTimeMillis: () => 123456789n,
        },
    });

    try {
        assert.equal(nar.time(), 123456789n);
    } finally {
        nar.stop();
    }
});

test("Nar does not call jree System.currentTimeMillis directly", () => {
    const source = readFileSync("src/main/Nar.ts", "utf8");
    assert.doesNotMatch(source, /java\.lang\.System\.currentTimeMillis/);
});

test("Nar keeps the step clock independent from the wall-clock capability", () => {
    const nar = new Nar({
        capabilities: {
            currentTimeMillis: () => 987654321n,
        },
    });

    try {
        nar.cycles(2);
        assert.equal(nar.time(), 2);
    } finally {
        nar.stop();
    }
});

test("Node host capabilities expose a bigint millisecond clock", async () => {
    const { createNodeRuntimeCapabilities } = await import(
        "../../src/platform/node/SystemCommandCapabilities.ts"
    );
    const currentTimeMillis = createNodeRuntimeCapabilities().currentTimeMillis;

    assert.equal(typeof currentTimeMillis, "function");
    assert.equal(typeof currentTimeMillis?.(), "bigint");
});
