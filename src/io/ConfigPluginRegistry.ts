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

type PluginArgumentKind = "int" | "float" | "boolean" | "string" | "reasoner";

interface BuiltinPluginFactory {
    readonly argumentKinds: readonly PluginArgumentKind[];
    readonly create: (values: readonly unknown[]) => Plugin;
}

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
    readonly invalidPluginClasspaths: readonly string[];
    readonly duplicatePluginClasspaths: readonly string[];
}

export interface PluginRegistryResult {
    readonly plugins: readonly Plugin[];
    readonly diagnostics: PluginRegistryDiagnostics;
}

function factory(argumentKinds: readonly PluginArgumentKind[], create: (values: readonly unknown[]) => Plugin): BuiltinPluginFactory {
    return { argumentKinds, create };
}

function createBuiltinFactories(reasoner: Reasoner, capabilities?: RuntimeCapabilities): Map<string, BuiltinPluginFactory> {
    return new Map<string, BuiltinPluginFactory>([
        ["org.opennars.operator.misc.Add", factory([], () => new Add())],
        ["org.opennars.operator.misc.Count", factory([], () => new Count())],
        ["org.opennars.operator.misc.Reflect", factory([], () => new Reflect())],
        ["org.opennars.operator.misc.System", factory([], () => new System(capabilities))],
        ["org.opennars.operator.mental.Anticipate", factory(["float", "float"], values => new Anticipate(
            values[0] as number,
            values[1] as number,
        ))],
        ["org.opennars.operator.mental.Believe", factory([], () => new Believe())],
        ["org.opennars.operator.mental.Doubt", factory([], () => new Doubt())],
        ["org.opennars.operator.mental.Evaluate", factory([], () => new Evaluate())],
        ["org.opennars.operator.mental.Hesitate", factory([], () => new Hesitate())],
        ["org.opennars.operator.mental.Want", factory([], () => new Want())],
        ["org.opennars.operator.mental.Wonder", factory([], () => new Wonder())],
        ["org.opennars.plugin.mental.InternalExperience", factory(
            ["float", "float", "float", "float", "float", "float", "boolean", "boolean", "boolean"],
            values => new InternalExperience(
                values[0] as number,
                values[1] as number,
                values[2] as number,
                values[3] as number,
                values[4] as number,
                values[5] as number,
                values[6] as boolean,
                values[7] as boolean,
                values[8] as boolean,
            ),
        )],
        ["org.opennars.plugin.mental.Emotions", factory(
            ["float", "float", "float", "float", "int"],
            values => new Emotions(
                values[0] as number,
                values[1] as number,
                values[2] as number,
                values[3] as number,
                values[4] as number,
            ),
        )],
        ["org.opennars.plugin.perception.VisionChannel", factory(
            ["string", "reasoner", "reasoner", "int", "int", "int", "float", "int"],
            values => new VisionChannel(
                values[0] as string,
                values[1] as Reasoner,
                values[2] as Reasoner,
                values[3] as number,
                values[4] as number,
                values[5] as number,
                values[6] as number,
                values[7] as number,
            ),
        )],
    ]);
}

function parseInteger(value: string): number | null {
    const normalized = value.trim();
    if (!/^[+-]?\d+$/.test(normalized)) return null;
    const parsed = Number(normalized);
    return Number.isInteger(parsed) && parsed >= -2147483648 && parsed <= 2147483647 ? parsed : null;
}

function parseFloat32(value: string): number | null {
    const normalized = value.trim();
    if (normalized.length === 0) return null;
    const parsed = Number(normalized);
    if (Number.isNaN(parsed) && normalized.toLowerCase() !== "nan") return null;
    return Math.fround(parsed);
}

function parsePluginArguments(plugin: ParsedNarConfig["plugins"][number], kinds: readonly PluginArgumentKind[],
    reasoner: Reasoner): readonly unknown[] | null {
    if (plugin.arguments.length !== kinds.length) return null;
    const values: unknown[] = [];
    for (let index = 0; index < kinds.length; index++) {
        const argument = plugin.arguments[index];
        const kind = kinds[index];
        if (kind === "reasoner") {
            if (!argument.isReasoner) return null;
            values.push(reasoner);
            continue;
        }
        if (argument.isReasoner || argument.value === null) return null;
        const expectedType = kind === "int" ? "int.class"
            : kind === "float" ? "float.class"
                : kind === "boolean" ? "boolean.class" : "String.class";
        if (argument.type !== expectedType) return null;
        if (kind === "int") {
            const value = parseInteger(argument.value);
            if (value === null) return null;
            values.push(value);
        } else if (kind === "float") {
            const value = parseFloat32(argument.value);
            if (value === null) return null;
            values.push(value);
        } else if (kind === "boolean") {
            values.push(argument.value.toLowerCase() === "true");
        } else {
            values.push(argument.value);
        }
    }
    return values;
}

function addUnique(items: string[], value: string): void {
    if (!items.includes(value)) items.push(value);
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
        const factories = createBuiltinFactories(reasoner, capabilities);
        const unsupportedPluginClasspaths: string[] = [];
        const compatibilityStubPluginClasspaths: string[] = [];
        const missingRuntimeCapabilityPluginClasspaths: string[] = [];
        const invalidPluginClasspaths: string[] = [];
        const duplicatePluginClasspaths: string[] = [];
        const seenPluginClasspaths = new Set<string>();

        for (const plugin of config.plugins) {
            const classpath = plugin.classpath;
            if (seenPluginClasspaths.has(classpath)) {
                addUnique(duplicatePluginClasspaths, classpath);
            } else {
                seenPluginClasspaths.add(classpath);
            }
            if (classpath === "org.opennars.operator.NullOperator") {
                if (plugin.arguments.length > 1) {
                    addUnique(invalidPluginClasspaths, classpath);
                    continue;
                }
                if (plugin.arguments.length === 0) {
                    plugins.push(new NullOperator());
                    continue;
                }
                const values = parsePluginArguments(plugin, ["string"], reasoner);
                if (values === null) {
                    addUnique(invalidPluginClasspaths, classpath);
                    continue;
                }
                plugins.push(new NullOperator(values[0] as string));
                continue;
            }
            if (classpath === "org.opennars.operator.misc.System") {
                if (capabilities?.executeSystemCommand === undefined) {
                    addUnique(missingRuntimeCapabilityPluginClasspaths, classpath);
                } else {
                    const factory = factories.get(classpath);
                    const values = factory === undefined
                        ? null
                        : parsePluginArguments(plugin, factory.argumentKinds, reasoner);
                    if (factory === undefined || values === null) {
                        addUnique(invalidPluginClasspaths, classpath);
                    } else {
                        plugins.push(factory.create(values));
                    }
                }
                continue;
            }
            const factory = factories.get(classpath);
            if (factory !== undefined) {
                const values = parsePluginArguments(plugin, factory.argumentKinds, reasoner);
                if (values === null) {
                    addUnique(invalidPluginClasspaths, classpath);
                } else {
                    plugins.push(factory.create(values));
                }
            } else {
                addUnique(unsupportedPluginClasspaths, classpath);
            }
        }

        return {
            plugins,
            diagnostics: {
                unsupportedPluginClasspaths,
                compatibilityStubPluginClasspaths,
                missingRuntimeCapabilityPluginClasspaths,
                invalidPluginClasspaths,
                duplicatePluginClasspaths,
            },
        };
    }
}
