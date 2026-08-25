#!/usr/bin/env node

import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const distRoot = join(projectRoot, "dist");
const manifest = JSON.parse(await readFile(join(distRoot, "build-manifest.json"), "utf8"));
await access(join(distRoot, manifest.entry));
await access(join(distRoot, manifest.cli));

const api = await import(pathToFileURL(join(distRoot, manifest.entry)).href);
for (const exportName of ["Nar", "Narsese", "Term", "TruthValue", "BudgetValue"]) {
    assert.ok(exportName in api, `missing public API export: ${exportName}`);
}

console.log(JSON.stringify({
    ok: true,
    entry: manifest.entry,
    cli: manifest.cli,
    sourceFileCount: manifest.sourceFileCount,
    exports: ["Nar", "Narsese", "Term", "TruthValue", "BudgetValue"],
}));
