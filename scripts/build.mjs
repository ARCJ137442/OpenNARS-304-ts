#!/usr/bin/env node

import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = join(projectRoot, "src");
const outputRoot = join(projectRoot, "dist");

async function collectTypeScriptFiles(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        const entryPath = join(directory, entry.name);
        if (entry.isDirectory()) {
            files.push(...await collectTypeScriptFiles(entryPath));
        } else if (entry.isFile() && entry.name.endsWith(".ts")) {
            files.push(entryPath);
        }
    }
    return files;
}

function rewriteRelativeTypeScriptImports(source) {
    return source.replace(/(["'])(\.\.?\/[^"']+?)\.ts\1/g, "$1$2.js$1");
}

function formatDiagnostics(diagnostics) {
    return ts.formatDiagnosticsWithColorAndContext(diagnostics, {
        getCanonicalFileName: fileName => fileName,
        getCurrentDirectory: () => projectRoot,
        getNewLine: () => "\n",
    });
}

function checkTypes() {
    const configPath = join(projectRoot, "tsconfig.json");
    const config = ts.readConfigFile(configPath, ts.sys.readFile);
    if (config.error) {
        throw new Error(formatDiagnostics([config.error]));
    }
    const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, projectRoot);
    parsed.options.noEmit = true;
    parsed.options.incremental = false;
    const program = ts.createProgram(parsed.fileNames, parsed.options);
    const diagnostics = [
        ...program.getOptionsDiagnostics(),
        ...program.getSyntacticDiagnostics(),
        ...program.getSemanticDiagnostics(),
    ];
    if (diagnostics.length > 0) {
        throw new Error(formatDiagnostics(diagnostics));
    }
}

async function emitSourceFile(sourcePath) {
    const source = await readFile(sourcePath, "utf8");
    const result = ts.transpileModule(source, {
        compilerOptions: {
            target: ts.ScriptTarget.ES2022,
            module: ts.ModuleKind.ESNext,
            preserveConstEnums: true,
            sourceMap: false,
        },
        fileName: sourcePath,
        reportDiagnostics: true,
    });
    if (result.diagnostics?.length) {
        throw new Error(formatDiagnostics(result.diagnostics));
    }
    const outputPath = join(outputRoot, relative(sourceRoot, sourcePath).replace(/\.ts$/, ".js"));
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, rewriteRelativeTypeScriptImports(result.outputText), "utf8");
}

async function emitScript(scriptName) {
    const sourcePath = join(projectRoot, "scripts", scriptName);
    const source = await readFile(sourcePath, "utf8");
    const builtSource = rewriteRelativeTypeScriptImports(source.replaceAll("../src/", "./"));
    await writeFile(join(outputRoot, scriptName), builtSource, "utf8");
}

async function main() {
    checkTypes();
    const sourceFiles = await collectTypeScriptFiles(sourceRoot);
    await rm(outputRoot, { recursive: true, force: true });
    await mkdir(outputRoot, { recursive: true });
    for (const sourcePath of sourceFiles.sort()) {
        await emitSourceFile(sourcePath);
    }
    await emitScript("cli.mjs");
    await emitScript("shell.mjs");
    await writeFile(join(outputRoot, "build-manifest.json"), `${JSON.stringify({
        source: "src",
        entry: "index.js",
        cli: "cli.mjs",
        sourceFileCount: sourceFiles.length,
        typescript: ts.version,
    }, null, 2)}\n`, "utf8");
    console.log(JSON.stringify({ output: outputRoot, sourceFileCount: sourceFiles.length, typescript: ts.version }));
}

main().catch(error => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
});
