import { readFile } from "node:fs/promises";
import ts from "typescript";

const jreeEntry = new URL("../node_modules/jree/lib/index.js", import.meta.url).href;

const compilerOptions = {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    sourceMap: false,
    inlineSourceMap: false,
    inlineSources: false,
};

export function resolve(specifier, context, nextResolve) {
    if (specifier === "jree") {
        return {
            url: jreeEntry,
            shortCircuit: true,
        };
    }
    return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
    if (!url.endsWith(".ts")) {
        return nextLoad(url, context);
    }

    const source = await readFile(new URL(url), "utf8");
    const output = ts.transpileModule(source, {
        compilerOptions,
        fileName: new URL(url).pathname,
    });
    return {
        format: "module",
        source: output.outputText,
        shortCircuit: true,
    };
}
