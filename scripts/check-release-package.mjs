#!/usr/bin/env node

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { copyFile, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, posix, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const npxCommand = process.platform === "win32" ? "npx.cmd" : "npx";

function useShell(command) {
    return process.platform === "win32" && command.toLowerCase().endsWith(".cmd");
}

function run(command, args, cwd, options = {}) {
    const result = spawnSync(command, args, {
        cwd,
        encoding: "utf8",
        shell: useShell(command),
        input: options.input,
        maxBuffer: 16 * 1024 * 1024,
    });
    const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
    if (result.error || result.status !== 0) {
        throw new Error(`${command} ${args.join(" ")} failed (${result.status}):\n${output}`);
    }
    return { stdout: result.stdout ?? "", stderr: result.stderr ?? "", output };
}

function runAllowFailure(command, args, cwd) {
    const result = spawnSync(command, args, {
        cwd,
        encoding: "utf8",
        shell: useShell(command),
        maxBuffer: 16 * 1024 * 1024,
    });
    return {
        status: result.status,
        stdout: result.stdout ?? "",
        stderr: result.stderr ?? "",
    };
}

function configPairs(text) {
    const pairs = [];
    const pattern = /<conf\s+name="([^"]+)"\s+value="([^"]+)"\s*\/>/g;
    for (const match of text.matchAll(pattern)) pairs.push(`${match[1]}=${match[2]}`);
    return pairs.sort();
}

function assertNoNodeWarnings(text, label) {
    assert.doesNotMatch(text, /ExperimentalWarning|DEP0151|DeprecationWarning/, `${label} emitted a Node runtime warning`);
}

let auditRoot;
try {
    auditRoot = await mkdtemp(join(tmpdir(), "opennars-release-"));
    const consumerRoot = join(auditRoot, "consumer");
    const packResult = run(npmCommand, ["pack", "--ignore-scripts", "--pack-destination", auditRoot, "--json"], projectRoot);
    const packInfo = JSON.parse(packResult.stdout)[0];
    const tarball = join(auditRoot, packInfo.filename);
    const packageFiles = packInfo.files.map(file => file.path.replaceAll("\\", "/").replace(/^package\//, ""));
    for (const required of [
        "dist/index.d.ts",
        "dist/cli.mjs",
        "dist/shell.mjs",
        "config/defaultConfig.xml",
        "brand/opennars-ts-logo.svg",
    ]) assert.ok(packageFiles.includes(required), `tarball is missing ${required}`);
    const logo = await readFile(join(projectRoot, "brand", "opennars-ts-logo.svg"), "utf8");
    assert.match(logo, /SPDX-License-Identifier: MIT/);
    assert.match(logo, /<text[^>]*>TS<\/text>/);
    for (const forbidden of ["reports/", "scripts/e2e/", "java-master/", "output/", "META-INF/"]) {
        assert.equal(packageFiles.some(file => file.startsWith(forbidden)), false, `tarball contains ${forbidden}`);
    }
    for (const file of packageFiles) {
        if (file.startsWith("src/")) assert.ok(file.endsWith(".ts"), `tarball contains a source diagnostic: ${file}`);
        assert.doesNotMatch(file, /(?:\.codex-corrupt|\.bak|\.tmp|~)$/, `tarball contains a temporary artifact: ${file}`);
        assert.doesNotMatch(file, /^docs\/(?:release-checklist|current-status|midterm-handoff|active-goal|open-source-readiness)/,
            `tarball contains an internal maintenance document: ${file}`);
    }
    const members = new Set(packageFiles);
    for (const file of packageFiles.filter(file => file.endsWith(".md"))) {
        const markdown = await readFile(join(projectRoot, file), "utf8");
        for (const [, rawTarget] of markdown.matchAll(/\]\(([^)]+)\)/g)) {
            const target = rawTarget.replace(/^<|>$/g, "").split("#", 1)[0];
            if (!target || /^[a-z][a-z0-9+.-]*:/i.test(target)) continue;
            const resolvedTarget = posix.normalize(posix.join(posix.dirname(file), target));
            assert.ok(members.has(resolvedTarget), `shipped Markdown link is missing its target: ${file} -> ${rawTarget}`);
        }
    }

    await writeFile(join(auditRoot, "package.json"), JSON.stringify({
        name: "opennars-release-consumer",
        private: true,
        type: "module",
    }, null, 2));
    run(npmCommand, ["install", "--ignore-scripts", "--no-audit", "--no-fund", "--silent", tarball], auditRoot);
    run(npmCommand, ["install", "--save-dev", "--ignore-scripts", "--no-audit", "--no-fund", "--silent", "typescript@5.4.5"], auditRoot);
    await copyFile(join(projectRoot, "test", "fixtures", "public-package-consumer.ts"), join(auditRoot, "public-package-consumer.ts"));
    await copyFile(join(projectRoot, "test", "fixtures", "public-package-tsconfig.json"), join(auditRoot, "tsconfig.json"));
    run(npxCommand, ["--no-install", "tsc", "-p", "tsconfig.json", "--noEmit"], auditRoot);

    const api = run(process.execPath, ["--input-type=module", "-e", "import {Nar} from 'opennars-304-ts'; const nar=new Nar(); nar.addInput('<bird --> animal>.'); nar.cycles(2); nar.stop(); if (nar.isRunning()) process.exit(1); console.log(JSON.stringify({api:'ok',cycles:2,stopped:true}));"], auditRoot);
    assertNoNodeWarnings(api.stderr, "external API");

    const nalSource = join(projectRoot, "java-master", "src", "main", "resources", "nal", "single_step", "nal8.add.nal");
    const nalFile = join(auditRoot, "nal8.add.nal");
    await copyFile(nalSource, nalFile);
    const cliPath = join(auditRoot, "node_modules", ".bin", process.platform === "win32" ? "opennars-304.cmd" : "opennars-304");
    const cli = run(cliPath, ["--cycles", "1", nalFile], auditRoot);
    assert.match(cli.output, /OUT|EXE|output/i, "external CLI must expose an observable marker");
    assertNoNodeWarnings(cli.stderr, "external CLI");
    const invalidCli = runAllowFailure(cliPath, ["--not-a-real-option"], auditRoot);
    assert.notEqual(invalidCli.status, 0, "invalid CLI arguments must fail");

    const shellPath = join(auditRoot, "node_modules", ".bin", process.platform === "win32" ? "opennars-304-shell.cmd" : "opennars-304-shell");
    const shell = run(shellPath, ["--no-prompt"], auditRoot, { input: ":quit\n" });
    assertNoNodeWarnings(shell.stderr, "external shell");
    const cliShebang = (await readFile(join(auditRoot, "node_modules", "opennars-304-ts", "dist", "cli.mjs"), "utf8")).split(/\r?\n/, 1)[0];
    assert.equal(cliShebang, "#!/usr/bin/env node", "published CLI must retain its shebang");

    const packageConfig = await readFile(join(auditRoot, "node_modules", "opennars-304-ts", "config", "defaultConfig.xml"), "utf8");
    const javaConfig = await readFile(join(projectRoot, "java-master", "src", "main", "resources", "config", "defaultConfig.xml"), "utf8");
    const packageConfigPairs = configPairs(packageConfig);
    assert.deepEqual(packageConfigPairs, configPairs(javaConfig), "published config values must match Java canonical config");

    const tarballHash = createHash("sha256").update(await readFile(tarball)).digest("hex");
    console.log(JSON.stringify({
        ok: true,
        tarball: packInfo.filename,
        tarballSha256: tarballHash,
        packageFiles: packageFiles.length,
        externalTsc: "passed",
        api: JSON.parse(api.stdout.trim().split(/\r?\n/).at(-1)),
        cli: "passed",
        shell: "passed",
        runtimeWarnings: "none",
        cliShebang,
        configConfCount: packageConfigPairs.length,
        forbiddenPackageMembers: 0,
    }));
} finally {
    if (auditRoot) await rm(auditRoot, { recursive: true, force: true });
}
