//! Java source: opennars/io/ConfigReader.java
import { Parameters } from "../main/Parameters.ts";
import type { Reasoner } from "../interfaces/pub/Reasoner.ts";
import type { Plugin } from "../plugin/Plugin.ts";
import { parseConfigXml } from "./ConfigParser.ts";
import { PluginRegistry } from "./ConfigPluginRegistry.ts";
import type { RuntimeCapabilities } from "../platform/RuntimeCapabilities.ts";
import type { TextInput } from "../runtime/Text.ts";
import { HostCapabilityError, ReasonerIoError } from "../runtime/ReasonerErrors.ts";

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

    public static loadConfigTextFromFile(filepath: TextInput, capabilities?: RuntimeCapabilities): string {
        const readTextFile = capabilities?.readTextFile;
        if (readTextFile === undefined) {
            throw new HostCapabilityError("readTextFile");
        }
        try {
            return readTextFile(String(filepath));
        } catch (error) {
            throw new ReasonerIoError(`Could not read configuration: ${String(filepath)}`, { cause: error });
        }
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

    public static loadParamsFromFileAndReturnPlugins(filepath: TextInput, reasoner: Reasoner,
        parameters: Parameters, capabilities?: RuntimeCapabilities): Plugin[] {

        const text = ConfigReader.loadConfigTextFromFile(filepath, capabilities);
        return ConfigReader.loadNodeConfigText(text, reasoner, parameters, capabilities);
    }
}
