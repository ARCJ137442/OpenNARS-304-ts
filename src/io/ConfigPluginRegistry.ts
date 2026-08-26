//! Java source: org/opennars/io/ConfigReader.java plugin registration subset
import { Parameters } from "../main/Parameters.ts";
import { Debug } from "../main/Debug.ts";
import type { Plugin } from "../plugin/Plugin.ts";
import type { Reasoner } from "../interfaces/pub/Reasoner.ts";
import type { ParsedNarConfig } from "./ConfigParser.ts";
import { NullOperator } from "../operator/NullOperator.ts";
import { Add } from "../operator/misc/Add.ts";
import { Count } from "../operator/misc/Count.ts";
import { Reflect } from "../operator/misc/Reflect.ts";
import { System } from "../operator/misc/System.ts";
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
import type { RuntimeCapabilities } from "../platform/RuntimeCapabilities.ts";

// These fields are Java `float` values. Keep binary32 narrowing at the
// configuration boundary before the values enter inference state.
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

export interface PluginRegistryDiagnostics {
    readonly unsupportedPluginClasspaths: readonly string[];
    readonly compatibilityStubPluginClasspaths: readonly string[];
    readonly missingRuntimeCapabilityPluginClasspaths: readonly string[];
}

export interface PluginRegistryResult {
    readonly plugins: readonly Plugin[];
    readonly diagnostics: PluginRegistryDiagnostics;
}

function createBuiltinFactories(reasoner: Reasoner): Map<string, () => Plugin> {
    return new Map<string, () => Plugin>([
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
            "BRIGHT",
            reasoner,
            reasoner,
            5,
            5,
            25,
            0.1,
            0,
        )],
    ]);
}

function applyConfigValues(config: ParsedNarConfig, parameters: Parameters): void {
    const parameterTarget = parameters as unknown as Record<string, unknown>;
    const debugTarget = Debug as unknown as Record<string, unknown>;
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
            target[name] = FLOAT_PARAMETER_NAMES.has(name) ? Math.fround(value) : value;
        }
    }
}

/** Instantiate the configured built-ins without Java reflection or host I/O. */
export class PluginRegistry {
    public static load(config: ParsedNarConfig, reasoner: Reasoner, parameters: Parameters,
        capabilities?: RuntimeCapabilities): PluginRegistryResult {
        applyConfigValues(config, parameters);
        const plugins: Plugin[] = [];
        const factories = createBuiltinFactories(reasoner);
        const unsupportedPluginClasspaths: string[] = [];
        const compatibilityStubPluginClasspaths: string[] = [];
        const missingRuntimeCapabilityPluginClasspaths: string[] = [];

        for (const plugin of config.plugins) {
            const classpath = plugin.classpath;
            if (classpath === "org.opennars.operator.NullOperator") {
                const value = plugin.arguments.find(argument => argument.type === "String.class")?.value;
                plugins.push(value === undefined || value === null
                    ? new NullOperator()
                    : new NullOperator(value));
                continue;
            }
            if (classpath === "org.opennars.operator.misc.System") {
                if (capabilities?.executeSystemCommand === undefined) {
                    missingRuntimeCapabilityPluginClasspaths.push(classpath);
                } else {
                    plugins.push(new System(capabilities));
                }
                continue;
            }
            const factory = factories.get(classpath);
            if (factory !== undefined) {
                plugins.push(factory());
            } else {
                unsupportedPluginClasspaths.push(classpath);
            }
        }

        return {
            plugins,
            diagnostics: {
                unsupportedPluginClasspaths,
                compatibilityStubPluginClasspaths,
                missingRuntimeCapabilityPluginClasspaths,
            },
        };
    }
}
