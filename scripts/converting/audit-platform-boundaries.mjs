import { readFile, writeFile } from "node:fs/promises";
import { resolve, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = resolve(fileURLToPath(new URL(".", import.meta.url)));
const projectRoot = resolve(scriptDirectory, "../..");
const demoRoot = resolve(projectRoot, "..", "OpenNARS-304-ts-web-demo");

const SOURCE_EXTENSIONS = new Set([".ts", ".mts", ".mjs", ".js", ".html"]);
const IGNORED_DIRECTORIES = new Set(["node_modules", ".git", "dist"]);

const RULES = [
    {
        id: "jree-import",
        layer: "jree-runtime",
        pattern: /(?:from\s+["']jree["']|import\s+["']jree["']|require\s*\(\s*["']jree["'])/g,
        recommendation: "move the public dependency behind a project-owned native contract",
    },
    {
        id: "node-import",
        layer: "node-host",
        pattern: /(?:from\s+["']node:[^"']+["']|import\s+["']node:[^"']+["']|require\s*\(\s*["']node:[^"']+["'])/g,
        recommendation: "move the import to a Node host adapter",
    },
    {
        id: "node-global",
        layer: "node-host",
        pattern: /\bprocess\.(?:env|argv|cwd|exit|exitCode|stdin|stdout|stderr|versions|release|platform|memoryUsage|resourceUsage)|\b(?:readFileSync|writeFileSync|execFileSync|spawnSync)\b/g,
        recommendation: "pass an explicit capability or keep the access in a host adapter",
    },
    {
        id: "terminal-or-stream",
        layer: "node-host",
        pattern: /\b(?:stdin|stdout|stderr)\b|\b(?:terminal|TTY|InputStream|OutputStream)\b/g,
        recommendation: "keep terminal and stream adaptation outside the platform-neutral core",
    },
    {
        id: "browser-node-shim",
        layer: "browser-shim",
        pattern: /\b(?:virtualModules|nodeShimPlugin|processShim|browser:(?:fs|path|os|url|child_process|process|crypto|util|stream))\b|readFileSync\s*=\s*\(\)\s*=>\s*configXml/g,
        recommendation: "replace the shim with explicit browser configuration and capabilities",
    },
];

function toPosix(value) {
    return value.split(sep).join("/");
}

function scopeFor(filePath) {
    const absolutePath = resolve(filePath);
    const projectRelative = toPosix(relative(projectRoot, absolutePath));
    if (projectRelative.startsWith("src/")) {
        if (projectRelative === "src/runtime/NodeStdinInputStream.ts") return "node-adapter-candidate";
        if ([
            "src/io/ConfigReader.ts",
            "src/main/Nar.ts",
            "src/main/Shell.ts",
            "src/operator/misc/System.ts",
            "src/runtime/jree-compat.ts",
        ].includes(projectRelative)) return "mixed-boundary";
        return "core-candidate";
    }
    if (projectRelative.startsWith("scripts/")) return "node-tooling";

    const demoRelative = toPosix(relative(demoRoot, absolutePath));
    if (demoRelative.startsWith("src/")) return "browser-source";
    if (demoRelative.startsWith("scripts/")) return "browser-build-tool";
    if (demoRelative === "public/nars-worker.js") return "generated-browser-bundle";
    return "outside-scope";
}

async function walk(directory) {
    const entries = await (await import("node:fs/promises")).readdir(directory, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        if (IGNORED_DIRECTORIES.has(entry.name)) continue;
        const child = resolve(directory, entry.name);
        if (entry.isDirectory()) {
            files.push(...await walk(child));
        } else if (SOURCE_EXTENSIONS.has(entry.name.slice(entry.name.lastIndexOf(".")))) {
            files.push(child);
        }
    }
    return files;
}

function matchesFor(source, rule) {
    rule.pattern.lastIndex = 0;
    return [...source.matchAll(rule.pattern)].map(match => ({
        line: source.slice(0, match.index).split(/\r?\n/).length,
        text: match[0],
    }));
}

export async function buildPlatformAudit() {
    const roots = [resolve(projectRoot, "src"), resolve(projectRoot, "scripts")];
    if (await exists(demoRoot)) {
        roots.push(resolve(demoRoot, "src"), resolve(demoRoot, "scripts"), resolve(demoRoot, "public", "nars-worker.js"));
    }

    const files = [];
    for (const root of roots) {
        if ((await statKind(root)) === "file") files.push(root);
        else if ((await statKind(root)) === "directory") files.push(...await walk(root));
    }

    const entries = [];
    for (const filePath of files.sort()) {
        const source = await readFile(filePath, "utf8");
        const matches = [];
        for (const rule of RULES) {
            const ruleMatches = matchesFor(source, rule);
            if (ruleMatches.length > 0) {
                matches.push({
                    id: rule.id,
                    layer: rule.layer,
                    occurrences: ruleMatches.length,
                    lines: ruleMatches.map(match => match.line),
                    samples: ruleMatches.slice(0, 5).map(match => match.text),
                    recommendation: rule.recommendation,
                });
            }
        }
        if (matches.length > 0) {
            entries.push({
                file: toPosix(relative(projectRoot, filePath)),
                scope: scopeFor(filePath),
                matches,
            });
        }
    }

    const countBy = (selector) => entries.reduce((count, entry) => count + (selector(entry) ? 1 : 0), 0);
    const occurrencesBy = (id) => entries.reduce((count, entry) => count + entry.matches
        .filter(match => match.id === id)
        .reduce((sum, match) => sum + match.occurrences, 0), 0);
    const scopes = [...new Set(entries.map(entry => entry.scope))].sort();
    return {
        schemaVersion: 1,
        generatedAt: new Date().toISOString(),
        projectRoot,
        demoRoot,
        scopes,
        summary: {
            filesScanned: files.length,
            filesWithPlatformOrJreeMatches: entries.length,
            coreCandidateFiles: countBy(entry => entry.scope === "core-candidate"),
            mixedBoundaryFiles: countBy(entry => entry.scope === "mixed-boundary"),
            nodeAdapterCandidateFiles: countBy(entry => entry.scope === "node-adapter-candidate"),
            browserSourceFiles: countBy(entry => entry.scope === "browser-source"),
            jreeImportFiles: countBy(entry => entry.matches.some(match => match.id === "jree-import")),
            jreeImportOccurrences: occurrencesBy("jree-import"),
            nodeImportFiles: countBy(entry => entry.matches.some(match => match.id === "node-import")),
            nodeImportOccurrences: occurrencesBy("node-import"),
            nodeGlobalFiles: countBy(entry => entry.matches.some(match => match.id === "node-global")),
            nodeGlobalOccurrences: occurrencesBy("node-global"),
            browserShimFiles: countBy(entry => entry.matches.some(match => match.id === "browser-node-shim")),
            browserShimOccurrences: occurrencesBy("browser-node-shim"),
        },
        entries,
        limitations: [
            "This is a static inventory; it does not prove that an import is reachable from the browser bundle.",
            "Generated public/nars-worker.js is included only to expose the current browser artifact boundary.",
            "Each candidate still requires a Java/TypeScript contract test before migration.",
        ],
    };
}

async function exists(path) {
    return (await statKind(path)) !== null;
}

async function statKind(path) {
    try {
        const { stat } = await import("node:fs/promises");
        const result = await stat(path);
        return result.isDirectory() ? "directory" : result.isFile() ? "file" : "other";
    } catch (error) {
        if (error?.code === "ENOENT") return null;
        throw error;
    }
}

async function main() {
    const audit = await buildPlatformAudit();
    const outputArgumentIndex = process.argv.indexOf("--output");
    const outputPath = outputArgumentIndex >= 0 ? process.argv[outputArgumentIndex + 1] : null;
    const text = `${JSON.stringify(audit, null, 2)}\n`;
    if (outputPath !== null && outputPath !== undefined && outputPath.length > 0) {
        await writeFile(resolve(outputPath), text, "utf8");
    }
    process.stdout.write(text);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    await main();
}
