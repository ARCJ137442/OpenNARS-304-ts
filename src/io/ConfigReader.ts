//! Java source: opennars/io/ConfigReader.java
import { java, JavaObject, type int, type float, type double } from "jree";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
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

    private static nodeConfigPath(filepath: string): string | null {
        const candidates = [
            resolve(filepath),
            resolve(process.cwd(), filepath),
            resolve(process.cwd(), "java-master", "src", "main", "resources", "config", "defaultConfig.xml"),
        ];
        return candidates.find(candidate => existsSync(candidate)) ?? null;
    }

    private static loadNodeConfig(filepath: string, reasoner: Reasoner, parameters: Parameters): java.util.List<Plugin> {
        const path = ConfigReader.nodeConfigPath(filepath);
        if (path === null) {
            throw new Error(`Configuration file not found: ${filepath}`);
        }

        const xml = readFileSync(path, "utf8");
        const parameterTarget = parameters as unknown as Record<string, unknown>;
        const debugTarget = Debug as unknown as Record<string, unknown>;
        const configuredPlugins: string[] = [];
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
        ConfigReader.lastUnsupportedPluginClasspaths = [];
        ConfigReader.lastCompatibilityStubPluginClasspaths = [];
        for (const match of xml.matchAll(/<conf\s+name=["']([^"']+)["']\s+value=["']([^"']*)["']\s*\/?>/g)) {
            const [, name, rawValue] = match;
            let value: unknown = rawValue;
            if (rawValue === "true" || rawValue === "false") {
                value = rawValue === "true";
            } else if (/^[-+]?\d+$/.test(rawValue)) {
                value = Number.parseInt(rawValue, 10);
            } else if (/^[-+]?(?:\d+\.\d*|\.\d+)(?:[eE][-+]?\d+)?$/.test(rawValue)) {
                value = Number.parseFloat(rawValue);
            }

            // Preserve binary32 values before inference uses them in binary64
            // expressions, while leaving Java double parameters unchanged.
            if (FLOAT_PARAMETER_NAMES.has(name) && typeof value === "number") {
                value = Math.fround(value);
            }

            if (Object.prototype.hasOwnProperty.call(parameterTarget, name)) {
                parameterTarget[name] = value;
            } else if (Object.prototype.hasOwnProperty.call(debugTarget, name)) {
                debugTarget[name] = value;
            }
        }

        const pluginPattern = /<plugin\s+[^>]*classpath=["']([^"']+)["'][^>]*(?:\/?>)(?:([\s\S]*?)<\/plugin>)?/g;
        for (const match of xml.matchAll(pluginPattern)) {
            const classpath = match[1];
            const body = match[2] ?? "";
            if (classpath === "org.opennars.operator.NullOperator") {
                const valueMatch = body.match(/<arg\s+[^>]*type=["']String\.class["'][^>]*value=["']([^"']+)["'][^>]*\/?\s*>/);
                plugins.add(valueMatch === null ? new NullOperator() : new NullOperator(valueMatch[1]));
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
        return plugins;
    }

    public static loadParamsFromFileAndReturnPlugins(filepath: java.lang.String, reasoner: Reasoner,
        parameters: Parameters): java.util.List<Plugin> {

        if (typeof process !== "undefined" && process.versions?.node !== undefined) {
            return ConfigReader.loadNodeConfig(String(filepath), reasoner, parameters);
        }

        java.lang.System.out.println("Got relative path for loading the config: " + filepath);
        let ret: java.util.List<Plugin> = new java.util.ArrayList<Plugin>();
        let file: java.io.File = new java.io.File(filepath);

        let stream: java.io.InputStream = null;
        // if this failed, then load from resources
        if (!file.exists()) {
            file = null;
            let n: java.net.URL = Resources.getResource("config/defaultConfig.xml");
            // System.out.println(n.toURI().toString());
            let connection: java.net.URLConnection = n.openConnection();
            stream = connection.getInputStream();
            java.lang.System.out.println("Loading config " + "config/defaultConfig.xml" + " from resources");
        } else {
            java.lang.System.out.println("Loading config " + file.getName() + " from file");
        }

        let documentBuilderFactory: DocumentBuilderFactory = DocumentBuilderFactory.newInstance();
        let documentBuilder: DocumentBuilder = documentBuilderFactory.newDocumentBuilder();
        let document: Document = stream !== null ? documentBuilder.parse(stream) : documentBuilder.parse(file);
        let config: NodeList = document.getElementsByTagName("config").item(0).getChildNodes();

        for (let iterationConfigIdx: int = 0; iterationConfigIdx < config.getLength(); iterationConfigIdx++) {
            let iConfig: Node = config.item(iterationConfigIdx);

            if (iConfig.getNodeType() !== Node.ELEMENT_NODE) {
                continue;
            }

            let nodeName: java.lang.String = iConfig.getNodeName();
            if (nodeName.equals("plugins")) {
                let plugins: NodeList = iConfig.getChildNodes();

                for (let iterationPluginIdx: int = 0; iterationPluginIdx < plugins.getLength(); iterationPluginIdx++) {
                    let iPlugin: Node = plugins.item(iterationPluginIdx);

                    if (iPlugin.getNodeType() !== Node.ELEMENT_NODE) {
                        continue;
                    }

                    let pluginClassPath: java.lang.String = iPlugin.getAttributes().getNamedItem("classpath").getNodeValue();

                    let pluginArguments: NodeList = iPlugin.getChildNodes();

                    let createdPlugin: Plugin = ConfigReader.createPluginByClassnameAndArguments(pluginClassPath, pluginArguments, reasoner);
                    ret.add(createdPlugin);
                }
            } else {

                let propertyName: java.lang.String = iConfig.getAttributes().getNamedItem("name").getNodeValue();
                let propertyValueAsString: java.lang.String = iConfig.getAttributes().getNamedItem("value").getNodeValue();

                let wasConfigValueAssigned: boolean = false;

                try {
                    let fieldOfProperty: java.lang.reflect.Field = Parameters.class.getField(propertyName);

                    if (fieldOfProperty.getType() === int.class) {
                        fieldOfProperty.set(parameters, java.lang.Integer.parseInt(propertyValueAsString));
                    } else if (fieldOfProperty.getType() === float.class) {
                        fieldOfProperty.set(parameters, java.lang.Float.parseFloat(propertyValueAsString));
                    } else if (fieldOfProperty.getType() === double.class) {
                        fieldOfProperty.set(parameters, java.lang.Double.parseDouble(propertyValueAsString));
                    } else if (fieldOfProperty.getType() === boolean.class) {
                        fieldOfProperty.set(parameters, java.lang.Boolean.parseBoolean(propertyValueAsString));
                    } else {
                        throw new java.text.ParseException("Unknown type", 0);
                    }

                    wasConfigValueAssigned = true;
                } catch (e) {
                    if (e instanceof java.lang.NoSuchFieldException) {
                        java.lang.System.out.println(propertyName + " is not a valid NARS config field");
                    } else {
                        throw e;
                    }
                }

                if (!wasConfigValueAssigned) {
                    try {
                        let fieldOfProperty: java.lang.reflect.Field = Debug.class.getDeclaredField(propertyName);

                        if (fieldOfProperty.getType() === int.class) {
                            fieldOfProperty.set(null, java.lang.Integer.parseInt(propertyValueAsString));
                        } else if (fieldOfProperty.getType() === float.class) {
                            fieldOfProperty.set(null, java.lang.Float.parseFloat(propertyValueAsString));
                        } else {
                            throw new java.text.ParseException("Unknown type", 0);
                        }

                        wasConfigValueAssigned = true;
                    } catch (e) {
                        if (e instanceof java.lang.NoSuchFieldException) {
                            // ignore
                        } else {
                            throw e;
                        }
                    }
                }
            }
        }
        return ret;
    }

    private static createPluginByClassnameAndArguments(pluginClassPath: java.lang.String, pluginArguments: NodeList,
        reasoner: Reasoner): Plugin {
        let types: java.util.List<java.lang.Class<unknown>> = new java.util.ArrayList();
        let values: java.util.List<java.lang.Object> = new java.util.ArrayList();

        for (let parameterIdx: int = 0; parameterIdx < pluginArguments.getLength(); parameterIdx++) {
            let iParameter: Node = pluginArguments.item(parameterIdx);

            if (iParameter.getNodeType() !== Node.ELEMENT_NODE) {
                continue;
            }

            let typeString: java.lang.String = null;
            let valueString: java.lang.String = null;
            let specialIsReasoner: boolean = iParameter.getAttributes().getNamedItem("isReasoner") !== null;

            if (!specialIsReasoner) {
                typeString = iParameter.getAttributes().getNamedItem("type").getNodeValue();
                valueString = iParameter.getAttributes().getNamedItem("value").getNodeValue();
            }

            if (specialIsReasoner) {
                types.add(Reasoner.class);
                values.add(reasoner);
            } else if (typeString === null) {
                throw new java.text.ParseException("No type specified for parameter", 0);
            } else if (typeString.equals("int.class")) {
                types.add(int.class);
                values.add(java.lang.Integer.parseInt(valueString));
            } else if (typeString.equals("float.class")) {
                types.add(float.class);
                values.add(java.lang.Float.parseFloat(valueString));
            } else if (typeString.equals("boolean.class")) {
                types.add(boolean.class);
                values.add(java.lang.Boolean.parseBoolean(valueString));
            } else if (typeString.equals("String.class")) {
                types.add(java.lang.String.class);
                values.add(valueString);
            } else {
                throw new java.text.ParseException("Unknown type", 0);
            }
        }

        let typesAsArr: java.lang.Class<unknown>[] = types.toArray(new Array<java.lang.Class>(types.size()));
        let valuesAsArr: java.lang.Object[] = values.toArray(new Array<java.lang.Object>(values.size()));

        let c: java.lang.Class<unknown> = java.lang.Class.forName(pluginClassPath);

        let createdPlugin: Plugin = c.getConstructor(typesAsArr).newInstance(valuesAsArr) as Plugin;
        return createdPlugin;
    }
}
