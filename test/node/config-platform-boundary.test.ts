import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { DEFAULT_CONFIG_XML } from "../../src/io/DefaultConfig.ts";
import { parseConfigXml } from "../../src/io/ConfigParser.ts";
import { ConfigReader } from "../../src/io/ConfigReader.ts";
import { PluginRegistry } from "../../src/io/ConfigPluginRegistry.ts";
import { Nar } from "../../src/main/Nar.ts";
import { Debug } from "../../src/main/Debug.ts";
import { Parameters } from "../../src/main/Parameters.ts";
import type { Reasoner } from "../../src/interfaces/pub/Reasoner.ts";
import { createNodeRuntimeCapabilities } from "../../src/platform/node/SystemCommandCapabilities.ts";
import { Anticipate } from "../../src/operator/mental/Anticipate.ts";
import { Emotions } from "../../src/plugin/mental/Emotions.ts";
import { InternalExperience } from "../../src/plugin/mental/InternalExperience.ts";

test("ConfigReader keeps the Java plain-class boundary without a jree Object shell", () => {
    const reader = new ConfigReader();

    assert.equal(Object.getPrototypeOf(ConfigReader.prototype), Object.prototype);
    assert.equal(Object.getPrototypeOf(reader), ConfigReader.prototype);
});

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

test("Nar.PluginState keeps the Java lifecycle contract without a jree object shell", () => {
    const transitions: boolean[] = [];
    const nar = new Nar({ configText: "<config><plugins /></config>" });
    const plugin = {
        setEnabled(_owner: Nar, enabled: boolean): boolean {
            transitions.push(enabled);
            return true;
        },
    };

    try {
        const state = new nar.PluginState(plugin);
        assert.equal(Object.getPrototypeOf(Object.getPrototypeOf(state)), Object.prototype);
        assert.equal(state.isEnabled(), true);
        assert.deepEqual(transitions, [true]);

        state.setEnabled(false);
        assert.equal(state.isEnabled(), false);
        assert.deepEqual(transitions, [true, false]);
    } finally {
        nar.stop();
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

test("PluginRegistry returns a native ordered plugin sequence and diagnostics", () => {
    const result = PluginRegistry.load(parseConfigXml(`
        <config>
            <plugins>
                <plugin classpath="org.opennars.operator.NullOperator" />
                <plugin classpath="org.opennars.operator.misc.Add" />
                <plugin classpath="org.example.Unsupported" />
            </plugins>
        </config>
    `), undefined as unknown as Reasoner, new Parameters());

    assert.equal(Array.isArray(result.plugins), true);
    assert.equal(result.plugins.length, 2);
    assert.deepEqual(result.diagnostics.unsupportedPluginClasspaths, ["org.example.Unsupported"]);
    assert.deepEqual(result.diagnostics.compatibilityStubPluginClasspaths, []);
    assert.deepEqual(result.diagnostics.missingRuntimeCapabilityPluginClasspaths, []);
    assert.deepEqual(result.diagnostics.invalidPluginClasspaths, []);
    assert.deepEqual(result.diagnostics.duplicatePluginClasspaths, []);
});

test("PluginRegistry consumes Java constructor arguments with float32 narrowing", () => {
    const result = PluginRegistry.load(parseConfigXml(`
        <config>
            <plugins>
                <plugin classpath="org.opennars.operator.mental.Anticipate">
                    <arg type="float.class" value="0.123456789" />
                    <arg type="float.class" value="0.987654321" />
                </plugin>
            </plugins>
        </config>
    `), undefined as unknown as Reasoner, new Parameters());

    assert.deepEqual(result.diagnostics.invalidPluginClasspaths, []);
    const anticipate = result.plugins[0] as Anticipate;
    assert.equal(anticipate.ANTICIPATION_DURABILITY_MUL, Math.fround(0.123456789));
    assert.equal(anticipate.ANTICIPATION_PRIORITY_MUL, Math.fround(0.987654321));
});

test("PluginRegistry accepts Java no-argument constructors", () => {
    const result = PluginRegistry.load(parseConfigXml(`
        <config>
            <plugins>
                <plugin classpath="org.opennars.operator.mental.Anticipate" />
                <plugin classpath="org.opennars.plugin.mental.Emotions" />
                <plugin classpath="org.opennars.plugin.mental.InternalExperience" />
            </plugins>
        </config>
    `), undefined as unknown as Reasoner, new Parameters());

    assert.deepEqual(result.diagnostics.invalidPluginClasspaths, []);
    assert.equal(result.plugins.length, 3);
    assert.ok(result.plugins[0] instanceof Anticipate);
    assert.ok(result.plugins[1] instanceof Emotions);
    assert.ok(result.plugins[2] instanceof InternalExperience);
});

test("PluginRegistry diagnoses invalid and repeated registrations without reordering valid instances", () => {
    const result = PluginRegistry.load(parseConfigXml(`
        <config>
            <plugins>
                <plugin classpath="org.opennars.operator.misc.Add">
                    <arg type="String.class" value="unexpected" />
                </plugin>
                <plugin classpath="org.opennars.operator.NullOperator">
                    <arg type="String.class" value="^first" />
                </plugin>
                <plugin classpath="org.opennars.operator.NullOperator">
                    <arg type="String.class" value="^second" />
                </plugin>
                <plugin classpath="org.example.Unsupported" />
            </plugins>
        </config>
    `), undefined as unknown as Reasoner, new Parameters());

    assert.equal(result.plugins.length, 2);
    assert.deepEqual(result.diagnostics.invalidPluginClasspaths, ["org.opennars.operator.misc.Add"]);
    assert.deepEqual(result.diagnostics.duplicatePluginClasspaths, ["org.opennars.operator.NullOperator"]);
    assert.deepEqual(result.diagnostics.unsupportedPluginClasspaths, ["org.example.Unsupported"]);
});

test("PluginRegistry accepts an empty plugin section without diagnostics", () => {
    const result = PluginRegistry.load(parseConfigXml("<config></config>"), undefined as unknown as Reasoner, new Parameters());

    assert.deepEqual(result.plugins, []);
    assert.deepEqual(result.diagnostics, {
        unsupportedPluginClasspaths: [],
        compatibilityStubPluginClasspaths: [],
        missingRuntimeCapabilityPluginClasspaths: [],
        invalidPluginClasspaths: [],
        duplicatePluginClasspaths: [],
    });
});

test("ConfigReader forwards the native plugin sequence without a jree list wrapper", () => {
    const nar = new Nar({ configText: "<config></config>" });
    try {
        const plugins = ConfigReader.loadParamsFromConfigTextAndReturnPlugins(`
            <config>
                <plugins>
                    <plugin classpath="org.opennars.operator.NullOperator" />
                    <plugin classpath="org.opennars.operator.misc.Add" />
                </plugins>
            </config>
        `, nar, nar.narParameters);

        assert.equal(Array.isArray(plugins), true);
        assert.equal(plugins.length, 2);
    } finally {
        nar.stop();
    }
});

test("Nar exposes a live native read-only plugin list", () => {
    const nar = new Nar({
        configText: `
            <config>
                <plugins>
                    <plugin classpath="org.opennars.operator.NullOperator" />
                </plugins>
            </config>
        `,
    });

    try {
        const states = (nar as unknown as { plugins: unknown[] }).plugins;
        assert.equal(Array.isArray(states), true);
        assert.equal(states.length, 1);
        const plugins = nar.getPlugins();
        assert.equal(plugins.constructor.name, "NativeReadOnlyList");
        assert.equal(plugins.size(), 1);
        assert.equal(plugins.get(0), states[0]);
        assert.throws(() => plugins.add(states[0] as never), /UnsupportedOperationException/);
        nar.removePlugin(states[0] as never);
        assert.equal(states.length, 0);
        assert.equal(nar.getPlugins().size(), 0);
    } finally {
        nar.stop();
    }
});
