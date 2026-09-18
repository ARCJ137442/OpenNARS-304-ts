import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { classifyChangeGate, countProductionSourceLines, runtimeDependencyFingerprint } from "./change-gate-policy.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const options = { base: null, head: "HEAD", stage: "none", scope: "slice" };
for (let index = 2; index < process.argv.length; index += 1) {
  const argument = process.argv[index];
  if (argument === "--base") options.base = process.argv[++index];
  else if (argument === "--head") options.head = process.argv[++index];
  else if (argument === "--stage") options.stage = process.argv[++index];
  else if (argument === "--scope") options.scope = process.argv[++index];
  else throw new Error(`unknown argument: ${argument}`);
}
if (!options.base || !options.head) throw new Error("usage: classify-change-gate.mjs --base COMMIT [--head COMMIT] [--stage none|023|024|integration|rc] [--scope slice|responsibility]");

function git(...args) {
  return execFileSync("git", args, { cwd: projectRoot, encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
}

const range = `${options.base}..${options.head}`;
const files = git("diff", "--name-only", "--diff-filter=ACMRD", range, "--")
  .split(/\r?\n/).filter(Boolean);
const numstat = git("diff", "--numstat", range, "--");
const sourceChangedLines = countProductionSourceLines(numstat);
const patch = git("diff", "--unified=0", "--no-ext-diff", range, "--");
const runtimeDependencies = (revision) => runtimeDependencyFingerprint(JSON.parse(git("show", `${revision}:package.json`)));
const runtimeDependenciesChanged = files.includes("package.json")
  && runtimeDependencies(options.base) !== runtimeDependencies(options.head);
const result = classifyChangeGate({ files, sourceChangedLines, patch, stage: options.stage, scope: options.scope, runtimeDependenciesChanged });
process.stdout.write(`${JSON.stringify({ base: git("rev-parse", options.base).trim(), head: git("rev-parse", options.head).trim(), files, ...result }, null, 2)}\n`);
