import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { DEFAULT_CONFIG_XML } from "../../src/io/DefaultConfig.ts";
import { parseConfigXml } from "../../src/io/ConfigParser.ts";
import { ConfigReader } from "../../src/io/ConfigReader.ts";
import { Nar } from "../../src/main/Nar.ts";
import { Debug } from "../../src/main/Debug.ts";
import { createNodeRuntimeCapabilities } from "../../src/platform/node/SystemCommandCapabilities.ts";

function normalizeXml(text: string): string {
    return text.replace(/\r\n/g, "\n").trim();
}

test("parseConfigXml returns a native configuration tree", () => {
    const parsed = parseConfigXml(`
        <config>
            <conf name="DURATION" value="9" />
            <conf name="SHOW_REASONING_ERRORS" value="false" />
            <plugins>
                <plugin classpath="org.opennars.operator.NullOperator">
                    <arg type="String.class" value="&amp;drop" name="operator" />
                    <arg isReasoner="nar" name="owner" />
                </plugin>
            </plugins>
        </config>
    `);

    assert.deepEqual(parsed.values, [
        { name: "DURATION", value: "9" },
        { name: "SHOW_REASONING_ERRORS", value: "false" },
    ]);
    assert.equal(parsed.plugins.length, 1);
    assert.equal(parsed.plugins[0].classpath, "org.opennars.operator.NullOperator");
    assert.deepEqual(parsed.plugins[0].arguments, [
        { type: "String.class", value: "&drop", name: "operator", isReasoner: false },
        { type: null, value: null, name: "owner", isReasoner: true },
    ]);
});

test("parseConfigXml rejects empty, missing-root and incomplete configuration", () => {
    assert.throws(() => parseConfigXml(""), /non-empty string/);
    assert.throws(() => parseConfigXml("<settings />"), /<config> root/);
    assert.throws(
        () => parseConfigXml("<config><conf name=\"DURATION\" /></config>"),
        /Missing value attribute/,
    );
});

test("embedded default configuration stays byte-for-byte aligned after line-ending normalization", () => {
    const external = readFileSync("config/defaultConfig.xml", "utf8");
    assert.equal(normalizeXml(DEFAULT_CONFIG_XML), normalizeXml(external));

    const parsed = parseConfigXml(DEFAULT_CONFIG_XML);
    assert.equal(parsed.values.length, 83);
    assert.equal(parsed.plugins.length, 38);
});

test("Nar accepts explicit configuration text without reading a config file", () => {
    const previous = Debug.SHOW_REASONING_ERRORS;
    try {
        const nar = new Nar({
            narId: 304n,
            configText: `
                <config>
                    <conf name="DURATION" value="9" />
                    <conf name="DECISION_THRESHOLD" value="0.123456789" />
                    <conf name="SHOW_REASONING_ERRORS" value="false" />
                </config>
            `,
            configSource: "<memory>",
        });

        assert.equal(nar.memory.narId, 304n);
        assert.equal(nar.narParameters.DURATION, 9);
        assert.equal(nar.narParameters.DECISION_THRESHOLD, Math.fround(0.123456789));
        assert.equal(Debug.SHOW_REASONING_ERRORS, false);
        assert.equal(String(nar.usedConfigFilePath), "<memory>");
        nar.stop();
    } finally {
        Debug.SHOW_REASONING_ERRORS = previous;
    }
});

test("Nar rejects a path passed to the core string configuration overload", () => {
    assert.throws(
        () => new Nar("config/defaultConfig.xml"),
        /configuration must be XML text/i,
    );
});

test("Nar records a missing capability instead of loading a Node-only plugin", () => {
    const nar = new Nar({
        configText: `
            <config>
                <plugins>
                    <plugin classpath="org.opennars.operator.misc.System" />
                </plugins>
            </config>
        `,
    });

    try {
        assert.deepEqual(
            ConfigReader.lastMissingRuntimeCapabilityPluginClasspaths,
            ["org.opennars.operator.misc.System"],
        );
        assert.deepEqual(ConfigReader.lastUnsupportedPluginClasspaths, []);
    } finally {
        nar.stop();
    }
});

test("Nar registers the system plugin when the Node capability is supplied", () => {
    const nar = new Nar({
        capabilities: createNodeRuntimeCapabilities(),
        configText: `
            <config>
                <plugins>
                    <plugin classpath="org.opennars.operator.misc.System" />
                </plugins>
            </config>
        `,
    });

    try {
        assert.deepEqual(ConfigReader.lastMissingRuntimeCapabilityPluginClasspaths, []);
        assert.deepEqual(ConfigReader.lastUnsupportedPluginClasspaths, []);
    } finally {
        nar.stop();
    }
});
