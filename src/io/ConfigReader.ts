//! Java source: opennars/io/ConfigReader.java
import { java, JavaObject } from "jree";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Parameters } from "../main/Parameters.ts";
import { Debug } from "../main/Debug.ts";
import type { Plugin } from "../plugin/Plugin.ts";
import type { Reasoner } from "../interfaces/pub/Reasoner.ts";
import { NullOperator } from "../operator/NullOperator.ts";
import { Add } from "../operator/misc/Add.ts";
import { Count } from "../operator/misc/Count.ts";
import { Reflect } from "../operator/misc/Reflect.ts";
import { Anticipate } from "../operator/mental/Anticipate.ts";
import { Believe } from "../operator/mental/Believe.ts";
import { Doubt } from "../operator/mental/Doubt.ts";
import { Evaluate } from "../operator/mental/Evaluate.ts";
import { Hesitate } from "../operator/mental/Hesitate.ts";
import { Want } from "../operator/mental/Want.ts";
import { Wonder } from "../operator/mental/Wonder.ts";
import { InternalExperience } from "../plugin/mental/InternalExperience.ts";
import { Emotions } from "../plugin/mental/Emotions.ts";
import { VisionChannel } from "../plugin/perception/VisionChannel.ts";
import { System } from "../operator/misc/System.ts";
import { parseConfigXml } from "./ConfigParser.ts";
import type { RuntimeCapabilities } from "../platform/RuntimeCapabilities.ts";

export { parseConfigXml } from "./ConfigParser.ts";

// These fields are Java `float` values. Node's XML path parses numbers as
// binary64, so make the narrowing explicit at the configuration boundary.
const FLOAT_PARAMETER_NAMES = new Set([
    "DECISION_THRESHOLD", "HORIZON", "TRUTH_EPSILON", "BUDGET_EPSILON",
    "BUDGET_THRESHOLD", "DEFAULT_CONFIRMATION_EXPECTATION",
    "DEFAULT_CREATION_EXPECTATION", "DEFAULT_CREATION_EXPECTATION_GOAL",
    "DEFAULT_JUDGMENT_CONFIDENCE", "DEFAULT_JUDGMENT_PRIORITY",
    "DEFAULT_JUDGMENT_DURABILITY", "DEFAULT_QUESTION_PRIORITY",
    "DEFAULT_QUESTION_DURABILITY", "DEFAULT_GOAL_CONFIDENCE",
    "DEFAULT_GOAL_PRIORITY", "DEFAULT_GOAL_DURABILITY", "DEFAULT_QUEST_PRIORITY",
    "DEFAULT_QUEST_DURABILITY", "BAG_THRESHOLD", "FORGET_QUALITY_RELATIVE",
    "reliance", "DISCOUNT_RATE", "DERIVATION_PRIORITY_LEAK",
    "DERIVATION_DURABILITY_LEAK", "CURIOSITY_DESIRE_CONFIDENCE_MUL",
    "CURIOSITY_DESIRE_PRIORITY_MUL", "CURIOSITY_DESIRE_DURABILITY_MUL",
    "ANTICIPATION_CONFIDENCE", "ANTICIPATION_TOLERANCE", "SATISFACTION_THRESHOLD",
    "COMPLEXITY_UNIT", "INTERVAL_ADAPT_SPEED", "DEFAULT_FEEDBACK_PRIORITY",
    "DEFAULT_FEEDBACK_DURABILITY", "CONCEPT_FORGET_DURATIONS",
    "TERMLINK_FORGET_DURATIONS", "TASKLINK_FORGET_DURATIONS", "EVENT_FORGET_DURATIONS",
    "VARIABLE_INTRODUCTION_CONFIDENCE_MUL", "MOTOR_BABBLING_CONFIDENCE_THRESHOLD",
]);



/**
 * Used to read and parse the XML configuration file
 *
 * @author Robert Wünsche
 */
export class ConfigReader extends JavaObject {

    /** Classpaths that were present in an XML config but cannot be loaded in Node yet. */
    public static lastUnsupportedPluginClasspaths: string[] = [];
    /** Classpaths represented by a parse-only compatibility stub in Node. */
    public static lastCompatibilityStubPluginClasspaths: string[] = [];
    /** Node-only classpaths skipped because their host capability was absent. */
    public static lastMissingRuntimeCapabilityPluginClasspaths: string[] = [];

    private static nodeConfigPath(filepath: string): string | null {
        const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
        const candidates = [
            resolve(filepath),
            resolve(process.cwd(), filepath),
            resolve(packageRoot, "config", "defaultConfig.xml"),
            resolve(process.cwd(), "java-master", "src", "main", "resources", "config", "defaultConfig.xml"),
        ];
        return candidates.find(candidate => existsSync(candidate)) ?? null;
    }

    public static loadConfigTextFromFile(filepath: string): string {
        const path = ConfigReader.nodeConfigPath(filepath);
        if (path === null) {
            throw new Error(`Configuration file not found: ${filepath}`);
        }
        return readFileSync(path, "utf8");
    }

    private static loadNodeConfigText(text: string, reasoner: Reasoner, parameters: Parameters,
        capabilities?: RuntimeCapabilities): java.util.List<Plugin> {
        const config = parseConfigXml(text);
        const parameterTarget = parameters as unknown as Record<string, unknown>;
        const debugTarget = Debug as unknown as Record<string, unknown>;
        const configuredPlugins: string[] = [];
        const missingRuntimeCapabilityPlugins: string[] = [];
        const plugins = new java.util.ArrayList<Plugin>();
        const supportedPluginFactories = new Map<string, () => Plugin>([
            ["org.opennars.operator.misc.Add", () => new Add()],
            ["org.opennars.operator.misc.Count", () => new Count()],
            ["org.opennars.operator.misc.Reflect", () => new Reflect()],
            ["org.opennars.operator.mental.Anticipate", () => new Anticipate(0.1, 0.1)],
            ["org.opennars.operator.mental.Believe", () => new Believe()],
            ["org.opennars.operator.mental.Doubt", () => new Doubt()],
            ["org.opennars.operator.mental.Evaluate", () => new Evaluate()],
            ["org.opennars.operator.mental.Hesitate", () => new Hesitate()],
            ["org.opennars.operator.mental.Want", () => new Want()],
            ["org.opennars.operator.mental.Wonder", () => new Wonder()],
            ["org.opennars.plugin.mental.InternalExperience", () => new InternalExperience(
                0.3,
                0.3,
                0.0001,
                0.000025,
                0.1,
                0.1,
                true,
                false,
                false,
            )],
            ["org.opennars.plugin.mental.Emotions", () => new Emotions(
                0.25,
                0.75,
                0.1,
                0.9,
                1000,
            )],
            ["org.opennars.plugin.perception.VisionChannel", () => new VisionChannel(
                new java.lang.String("BRIGHT"),
                reasoner,
                reasoner,
                5,
                5,
                25,
                0.1,
                0,
            )],
        ]);
        ConfigReader.lastUnsupportedPluginClasspaths = [];
        ConfigReader.lastCompatibilityStubPluginClasspaths = [];
        ConfigReader.lastMissingRuntimeCapabilityPluginClasspaths = [];
        for (const { name, value: rawValue } of config.values) {
            let target: Record<string, unknown> | null = null;
            if (Object.prototype.hasOwnProperty.call(parameterTarget, name)) {
                target = parameterTarget;
            } else if (Object.prototype.hasOwnProperty.call(debugTarget, name)) {
                target = debugTarget;
            }
            if (target === null) continue;
            const currentValue = target[name];
            if (typeof currentValue === "boolean") {
                target[name] = rawValue === "true";
            } else if (typeof currentValue === "number") {
                const value = Number.parseFloat(rawValue);
                // Preserve binary32 values before inference uses them in binary64
                // expressions, while leaving Java double parameters unchanged.
                target[name] = FLOAT_PARAMETER_NAMES.has(name) ? Math.fround(value) : value;
            }
        }

        for (const plugin of config.plugins) {
            const classpath = plugin.classpath;
            if (classpath === "org.opennars.operator.NullOperator") {
                const value = plugin.arguments.find(argument => argument.type === "String.class")?.value;
                plugins.add(value === undefined || value === null
                    ? new NullOperator()
                    : new NullOperator(new java.lang.String(value)));
            } else if (classpath === "org.opennars.operator.misc.System") {
                if (capabilities?.executeSystemCommand === undefined) {
                    missingRuntimeCapabilityPlugins.push(classpath);
                } else {
                    plugins.add(new System(capabilities));
                }
            } else {
                const factory = supportedPluginFactories.get(classpath);
                if (factory !== undefined) {
                    plugins.add(factory());
                } else {
                    configuredPlugins.push(classpath);
                }
            }
        }
        ConfigReader.lastUnsupportedPluginClasspaths = configuredPlugins;
        ConfigReader.lastMissingRuntimeCapabilityPluginClasspaths = missingRuntimeCapabilityPlugins;
        return plugins;
    }

    public static loadParamsFromConfigTextAndReturnPlugins(text: string, reasoner: Reasoner,
        parameters: Parameters, capabilities?: RuntimeCapabilities): java.util.List<Plugin> {
        return ConfigReader.loadNodeConfigText(text, reasoner, parameters, capabilities);
    }

    public static loadParamsFromFileAndReturnPlugins(filepath: java.lang.String, reasoner: Reasoner,
        parameters: Parameters): java.util.List<Plugin> {

        if (typeof process !== "undefined" && process.versions?.node !== undefined) {
            return ConfigReader.loadNodeConfigText(ConfigReader.loadConfigTextFromFile(String(filepath)), reasoner, parameters);
        }
        throw new Error("ConfigReader requires the Node.js runtime");
    }
}
