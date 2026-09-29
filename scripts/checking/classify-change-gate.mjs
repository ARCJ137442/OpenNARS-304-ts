import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { classifyChangeGate, countProductionSourceLines, runtimeDependencyFingerprint } from "./change-gate-policy.mjs";
import { buildValidationPlan } from "./validation-clusters.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const options = {
  base: null,
  head: "HEAD",
  stage: "none",
  cluster: null,
  closeCluster: false,
  javaBaseline: process.env.OPENNARS_FROZEN_JAVA_BASELINE ?? null,
  expectedBaselineSha256: process.env.OPENNARS_FROZEN_JAVA_BASELINE_SHA256 ?? null,
  evidencePrefix: null,
  m1Profile: "full",
};
for (let index = 2; index < process.argv.length; index += 1) {
  const argument = process.argv[index];
  if (argument === "--base") options.base = process.argv[++index];
  else if (argument === "--head") options.head = process.argv[++index];
  else if (argument === "--stage") options.stage = process.argv[++index];
  else if (argument === "--cluster") options.cluster = process.argv[++index];
  else if (argument === "--close-cluster") options.closeCluster = true;
  else if (argument === "--java-baseline") options.javaBaseline = process.argv[++index];
  else if (argument === "--expected-baseline-sha256") options.expectedBaselineSha256 = process.argv[++index];
  else if (argument === "--evidence-prefix") options.evidencePrefix = process.argv[++index];
  else if (argument === "--m1-profile") options.m1Profile = process.argv[++index];
  else if (argument === "--scope") {
    throw new Error("--scope is obsolete; use --cluster ID for a slice and add --close-cluster only when that enumerated cluster is complete");
  }
  else throw new Error(`unknown argument: ${argument}`);
}
if (!options.base || !options.head) {
  throw new Error("usage: classify-change-gate.mjs --base COMMIT [--head COMMIT] [--cluster J1-runtime-compat] [--close-cluster] [--stage none|023|024|integration|rc] [--m1-profile full|prime] [--java-baseline FILE] [--expected-baseline-sha256 HEX] [--evidence-prefix PATH]");
}

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
const javaBaseline = options.javaBaseline === null ? null : resolve(options.javaBaseline);
if (javaBaseline !== null && !existsSync(javaBaseline)) throw new Error(`frozen Java baseline not found: ${javaBaseline}`);
const javaBaselineSha256 = javaBaseline === null ? null
  : createHash("sha256").update(readFileSync(javaBaseline)).digest("hex").toUpperCase();
if (options.expectedBaselineSha256 !== null
  && javaBaselineSha256 !== options.expectedBaselineSha256.toUpperCase()) {
  throw new Error(`frozen Java baseline SHA-256 mismatch: expected ${options.expectedBaselineSha256.toUpperCase()}, got ${javaBaselineSha256}`);
}
const result = classifyChangeGate({
  files,
  sourceChangedLines,
  patch,
  stage: options.stage,
  clusterId: options.cluster,
  closeCluster: options.closeCluster,
  runtimeDependenciesChanged,
  m1Profile: options.m1Profile,
});
const validationPlan = buildValidationPlan({
  files,
  tier: result.tier,
  requestedClusterId: options.cluster,
  closeCluster: options.closeCluster,
  javaBaseline,
  evidencePrefix: options.evidencePrefix === null ? null : resolve(options.evidencePrefix),
  m1Profile: options.m1Profile,
});
process.stdout.write(`${JSON.stringify({
  base: git("rev-parse", options.base).trim(),
  head: git("rev-parse", options.head).trim(),
  files,
  frozen_java_baseline: javaBaseline,
  frozen_java_baseline_sha256: javaBaselineSha256,
  ...result,
  validation_plan: validationPlan,
}, null, 2)}\n`);
if (!validationPlan.plan_valid) process.exitCode = 2;
