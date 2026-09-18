//! Java source: opennars/io/ConfigReader.java
import { java } from "jree";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Parameters } from "../main/Parameters.ts";
import type { Reasoner } from "../interfaces/pub/Reasoner.ts";
import type { Plugin } from "../plugin/Plugin.ts";
import { parseConfigXml } from "./ConfigParser.ts";
import { PluginRegistry } from "./ConfigPluginRegistry.ts";
import type { RuntimeCapabilities } from "../platform/RuntimeCapabilities.ts";

export { parseConfigXml } from "./ConfigParser.ts";

/**
 * Used to read and parse the XML configuration file
 *
 * @author Robert Wünsche
 */
/**
 * Java source declares `public class ConfigReader` without an explicit
 * superclass.  The translated JavaObject shell carried no behavior here:
 * this class is a static configuration facade, while Node file access remains
 * at the explicit host boundary below.
 */
export class ConfigReader {

    /** Classpaths that were present in an XML config but cannot be loaded in Node yet. */
    public static lastUnsupportedPluginClasspaths: string[] = [];
    /** Classpaths represented by a parse-only compatibility stub in Node. */
    public static lastCompatibilityStubPluginClasspaths: string[] = [];
    /** Node-only classpaths skipped because their host capability was absent. */
    public static lastMissingRuntimeCapabilityPluginClasspaths: string[] = [];
    /** Built-ins skipped because their XML constructor arguments were invalid. */
    public static lastInvalidPluginClasspaths: string[] = [];
    /** Classpaths repeated in the XML; instances are still kept in declaration order. */
    public static lastDuplicatePluginClasspaths: string[] = [];

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
        capabilities?: RuntimeCapabilities): Plugin[] {
        const result = PluginRegistry.load(parseConfigXml(text), reasoner, parameters, capabilities);
        ConfigReader.lastUnsupportedPluginClasspaths = [...result.diagnostics.unsupportedPluginClasspaths];
        ConfigReader.lastCompatibilityStubPluginClasspaths = [...result.diagnostics.compatibilityStubPluginClasspaths];
        ConfigReader.lastMissingRuntimeCapabilityPluginClasspaths = [
            ...result.diagnostics.missingRuntimeCapabilityPluginClasspaths,
        ];
        ConfigReader.lastInvalidPluginClasspaths = [...result.diagnostics.invalidPluginClasspaths];
        ConfigReader.lastDuplicatePluginClasspaths = [...result.diagnostics.duplicatePluginClasspaths];
        return [...result.plugins];
    }

    public static loadParamsFromConfigTextAndReturnPlugins(text: string, reasoner: Reasoner,
        parameters: Parameters, capabilities?: RuntimeCapabilities): Plugin[] {
        return ConfigReader.loadNodeConfigText(text, reasoner, parameters, capabilities);
    }

    public static loadParamsFromFileAndReturnPlugins(filepath: java.lang.String, reasoner: Reasoner,
        parameters: Parameters): Plugin[] {

        if (typeof process !== "undefined" && process.versions?.node !== undefined) {
            return ConfigReader.loadNodeConfigText(ConfigReader.loadConfigTextFromFile(String(filepath)), reasoner, parameters);
        }
        throw new Error("ConfigReader requires the Node.js runtime");
    }
}
