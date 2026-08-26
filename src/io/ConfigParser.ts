/**
 * Platform-neutral representation of the Java XML configuration contract.
 *
 * This module deliberately has no dependency on jree, Node.js or any plugin
 * implementation. Host adapters decide how the text is obtained and how the
 * parsed plugin descriptors are instantiated.
 */

export type ConfigAttributeValue = string;

export interface ParsedConfigValue {
    readonly name: string;
    readonly value: ConfigAttributeValue;
}

export interface ParsedPluginArgument {
    readonly type: string | null;
    readonly value: string | null;
    readonly name: string | null;
    readonly isReasoner: boolean;
}

export interface ParsedPlugin {
    readonly classpath: string;
    readonly arguments: readonly ParsedPluginArgument[];
}

export interface ParsedNarConfig {
    readonly values: readonly ParsedConfigValue[];
    readonly plugins: readonly ParsedPlugin[];
}

const CONFIG_ELEMENT_PATTERN = /<config\b[^>]*>([\s\S]*)<\/config\s*>/i;
const CONF_ELEMENT_PATTERN = /<conf\b([^>]*?)(?:\/\s*>|>)/gi;
const PLUGIN_ELEMENT_PATTERN = /<plugin\b([^>]*?)(?:\/\s*>|>([\s\S]*?)<\/plugin\s*>)/gi;
const ARG_ELEMENT_PATTERN = /<arg\b([^>]*?)(?:\/\s*>|>)/gi;
const ATTRIBUTE_PATTERN = /([A-Za-z_:][A-Za-z0-9_.:-]*)\s*=\s*(["'])(.*?)\2/g;

function decodeXmlAttribute(value: string): string {
    return value
        .replaceAll("&quot;", '"')
        .replaceAll("&apos;", "'")
        .replaceAll("&lt;", "<")
        .replaceAll("&gt;", ">")
        .replaceAll("&amp;", "&");
}

function attributesOf(source: string): ReadonlyMap<string, string> {
    const attributes = new Map<string, string>();
    let consumed = 0;
    for (const match of source.matchAll(ATTRIBUTE_PATTERN)) {
        consumed += match[0].length;
        attributes.set(match[1], decodeXmlAttribute(match[3]));
    }
    const withoutAttributes = source.replace(ATTRIBUTE_PATTERN, "").replace(/[\s/]/g, "");
    if (withoutAttributes.length > 0 || consumed === 0 && source.trim().length > 0) {
        throw new Error(`Invalid XML attribute list: ${source.trim()}`);
    }
    return attributes;
}

function requiredAttribute(attributes: ReadonlyMap<string, string>, name: string, element: string): string {
    const value = attributes.get(name);
    if (value === undefined) {
        throw new Error(`Missing ${name} attribute on ${element}`);
    }
    return value;
}

function parsePluginArguments(body: string): ParsedPluginArgument[] {
    const argumentsList: ParsedPluginArgument[] = [];
    for (const match of body.matchAll(ARG_ELEMENT_PATTERN)) {
        const attributes = attributesOf(match[1]);
        const isReasoner = attributes.has("isReasoner");
        argumentsList.push({
            type: attributes.get("type") ?? null,
            value: attributes.get("value") ?? null,
            name: attributes.get("name") ?? null,
            isReasoner,
        });
    }
    return argumentsList;
}

/** Parse the Java ConfigReader XML subset without requiring a host runtime. */
export function parseConfigXml(text: string): ParsedNarConfig {
    if (typeof text !== "string" || text.trim().length === 0) {
        throw new Error("Configuration XML must be a non-empty string");
    }
    const configMatch = CONFIG_ELEMENT_PATTERN.exec(text);
    if (configMatch === null) {
        throw new Error("Configuration XML must contain a <config> root element");
    }
    const body = configMatch[1];
    const values: ParsedConfigValue[] = [];
    for (const match of body.matchAll(CONF_ELEMENT_PATTERN)) {
        const attributes = attributesOf(match[1]);
        values.push({
            name: requiredAttribute(attributes, "name", "conf"),
            value: requiredAttribute(attributes, "value", "conf"),
        });
    }

    const plugins: ParsedPlugin[] = [];
    for (const match of body.matchAll(PLUGIN_ELEMENT_PATTERN)) {
        const attributes = attributesOf(match[1]);
        plugins.push({
            classpath: requiredAttribute(attributes, "classpath", "plugin"),
            arguments: parsePluginArguments(match[2] ?? ""),
        });
    }
    return { values, plugins };
}
