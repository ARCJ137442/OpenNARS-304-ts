import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, statSync } from "node:fs";
import { delimiter, dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const canonicalJavaRoot = join(projectRoot, "..", "OpenNARS-304-java-canonical-fixed-build");
const defaultJavaJar = join(canonicalJavaRoot, "target", "opennars-3.0.4-SNAPSHOT.jar");
const defaultJavaTestClasses = join(canonicalJavaRoot, "target", "test-classes");
const defaultJavaClasses = join(canonicalJavaRoot, "target", "classes");
const LEGACY_JAR_SHA256 = "796A3B20EE6ED7F8F6778367738AD728F0BFCC32CFAD99BACAEBEC41EBC7EB04";
const javaSource = join(projectRoot, "scripts", "parity", "LocalAlgorithmParityRunner.java");

function requirePath(value, option, kind) {
  const path = resolve(value);
  let stats;
  try {
    stats = statSync(path);
  } catch {
    throw new Error(`${option} path does not exist: ${path}`);
  }
  if (kind === "file" && !stats.isFile()) throw new Error(`${option} path is not a file: ${path}`);
  if (kind === "directory" && !stats.isDirectory()) throw new Error(`${option} path is not a directory: ${path}`);
  return path;
}

function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex").toUpperCase();
}

function parseArgs(argv) {
  const options = {
    javaJar: defaultJavaJar,
    javaClasses: defaultJavaClasses,
    javaTestClasses: defaultJavaTestClasses,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--java-jar") options.javaJar = argv[++index];
    else if (argument === "--java-classes") options.javaClasses = argv[++index];
    else if (argument === "--java-test-classes") options.javaTestClasses = argv[++index];
    else if (argument === "--help" || argument === "-h") {
      console.error("usage: node scripts/parity/run-local-algorithm-parity.mjs [--java-jar PATH] [--java-classes PATH] [--java-test-classes PATH]");
      process.exit(0);
    } else throw new Error(`Unknown argument: ${argument}`);
  }
  options.javaJar = requirePath(options.javaJar, "--java-jar", "file");
  options.javaClasses = requirePath(options.javaClasses, "--java-classes", "directory");
  options.javaTestClasses = requirePath(options.javaTestClasses, "--java-test-classes", "directory");
  options.javaArtifact = {
    jar: options.javaJar,
    sha256: sha256(options.javaJar),
    classes: options.javaClasses,
    testClasses: options.javaTestClasses,
  };
  if (options.javaArtifact.sha256 === LEGACY_JAR_SHA256) {
    throw new Error(`--java-jar points to the legacy 3.1.0 artifact; use the canonical 3.0.4 artifact: ${options.javaJar}`);
  }
  return options;
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
    ...options,
  });
  if (result.status !== 0) {
    throw new Error(`${command} failed:\n${result.stdout}\n${result.stderr}`);
  }
  return result.stdout.trim();
}

function javaSnapshot(options) {
  const outputDirectory = mkdtempSync(join(tmpdir(), "opennars-local-parity-"));
  const classpath = [options.javaTestClasses, options.javaClasses, options.javaJar].join(delimiter);
  try {
    run("javac", ["-encoding", "UTF-8", "-cp", classpath, "-d", outputDirectory, javaSource]);
    return JSON.parse(run("java", ["-cp", [outputDirectory, classpath].join(delimiter), "LocalAlgorithmParityRunner"]));
  } finally {
    rmSync(outputDirectory, { recursive: true, force: true });
  }
}

function truth(value) {
  return {
    frequency: value.frequency,
    confidence: value.confidence,
    expectation: value.getExpectation(),
    analytic: value.analytic,
    external: value.toStringExternal(),
  };
}

function budget(value) {
  return {
    priority: value.getPriority(),
    durability: value.getDurability(),
    quality: value.getQuality(),
    summary: value.summary(),
    external: value.toStringExternal(),
  };
}

async function tsSnapshot() {
  const [{ Parameters }, { TruthValue }, { TruthFunctions }, { BudgetValue }, { UtilityFunctions }] = await Promise.all([
    import("../../src/main/Parameters.ts"),
    import("../../src/entity/TruthValue.ts"),
    import("../../src/inference/TruthFunctions.ts"),
    import("../../src/entity/BudgetValue.ts"),
    import("../../src/inference/UtilityFunctions.ts"),
  ]);
  const parameters = new Parameters();
  const a = new TruthValue(0.7, 0.6, false, parameters);
  const b = new TruthValue(0.3, 0.4, false, parameters);
  const operations = {
    a: () => a,
    b: () => b,
    negation: () => TruthFunctions.negation(a, parameters),
    conversion: () => TruthFunctions.conversion(a, parameters),
    contraposition: () => TruthFunctions.contraposition(a, parameters),
    revision: () => TruthFunctions.revision(a, b, parameters),
    deduction: () => TruthFunctions.deduction(a, b, parameters),
    induction: () => TruthFunctions.induction(a, b, parameters),
    abduction: () => TruthFunctions.abduction(a, b, parameters),
    analogy: () => TruthFunctions.analogy(a, b, parameters),
    resemblance: () => TruthFunctions.resemblance(a, b, parameters),
    exemplification: () => TruthFunctions.exemplification(a, b, parameters),
    comparison: () => TruthFunctions.comparison(a, b, parameters),
    desireStrong: () => TruthFunctions.desireStrong(a, b, parameters),
    desireWeak: () => TruthFunctions.desireWeak(a, b, parameters),
    desireDed: () => TruthFunctions.desireDed(a, b, parameters),
    desireInd: () => TruthFunctions.desireInd(a, b, parameters),
    union: () => TruthFunctions.union(a, b, parameters),
    intersection: () => TruthFunctions.intersection(a, b, parameters),
    anonymousAnalogy: () => TruthFunctions.anonymousAnalogy(a, b, parameters),
    reduceDisjunction: () => TruthFunctions.reduceDisjunction(a, b, parameters),
    reduceConjunction: () => TruthFunctions.reduceConjunction(a, b, parameters),
    reduceConjunctionNeg: () => TruthFunctions.reduceConjunctionNeg(a, b, parameters),
    lookupTruthOrNull: () => TruthFunctions.lookupTruthOrNull(
      a,
      b,
      parameters,
      false,
      TruthFunctions.EnumType.DEDUCTION,
      true,
      TruthFunctions.EnumType.ABDUCTION,
    ),
  };
  const snapshot = { truth: {}, budget: {}, utility: {} };
  for (const [name, operation] of Object.entries(operations)) snapshot.truth[name] = truth(operation());

  snapshot.budget.normal = budget(new BudgetValue(0.4, 0.6, 0.8, parameters));
  snapshot.budget.fromTruth = budget(new BudgetValue(0.4, 0.6, a, parameters));
  snapshot.budget.bounded = budget(new BudgetValue(1.2, 1.1, 0.2, parameters));
  const mutated = new BudgetValue(0.4, 0.6, 0.8, parameters);
  mutated.incPriority(0.2);
  mutated.decDurability(0.5);
  mutated.incQuality(0.1);
  snapshot.budget.mutated = budget(mutated);
  const merged = new BudgetValue(0.4, 0.6, 0.8, parameters);
  merged.merge(new BudgetValue(0.7, 0.2, 0.3, parameters));
  snapshot.budget.merged = budget(merged);
  snapshot.utility = {
    and: UtilityFunctions.and(0.7, 0.4),
    or: UtilityFunctions.or(0.7, 0.4),
    aveGeo: UtilityFunctions.aveGeo(0.4, 0.6, 0.8),
    truthToQuality: Math.max(a.getExpectation(), (1 - a.getExpectation()) * 0.75),
  };
  return snapshot;
}

function compare(expected, actual, path = "", differences = []) {
  if (typeof expected === "number" && typeof actual === "number") {
    if (Math.abs(expected - actual) > 1e-5) differences.push(`${path}: ${expected} !== ${actual}`);
    return differences;
  }
  if (typeof expected !== typeof actual || expected === null || actual === null) {
    if (expected !== actual) differences.push(`${path}: ${JSON.stringify(expected)} !== ${JSON.stringify(actual)}`);
    return differences;
  }
  if (typeof expected === "object") {
    const keys = new Set([...Object.keys(expected), ...Object.keys(actual)]);
    for (const key of keys) compare(expected[key], actual[key], path ? `${path}.${key}` : key, differences);
    return differences;
  }
  if (expected !== actual) differences.push(`${path}: ${JSON.stringify(expected)} !== ${JSON.stringify(actual)}`);
  return differences;
}

const options = parseArgs(process.argv.slice(2));
const java = javaSnapshot(options);
const ts = await tsSnapshot();
const differences = compare(java, ts);
const result = {
  ok: differences.length === 0,
  tolerance: 1e-5,
  javaArtifact: options.javaArtifact,
  differences,
  java,
  ts,
};
console.log(JSON.stringify(result, null, 2));
if (!result.ok) process.exitCode = 1;
