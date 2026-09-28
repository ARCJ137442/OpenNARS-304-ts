import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import test from "node:test";

const projectRoot = process.cwd();
const localRunner = join(projectRoot, "scripts", "parity", "run-local-algorithm-parity.mjs");
const nalRunner = join(projectRoot, "scripts", "e2e", "run-nal-corpus.mjs");
const legacyRoot = join(projectRoot, "java-master", "target");
const legacyJar = join(legacyRoot, "opennars-3.1.0-SNAPSHOT.jar");
const canonicalRoot = join(projectRoot, "..", "OpenNARS-304-java-canonical-fixed-build", "target");
const canonicalJar = join(canonicalRoot, "opennars-3.0.4-SNAPSHOT.jar");
const canonicalClasses = join(canonicalRoot, "classes");
const canonicalTestClasses = join(canonicalRoot, "test-classes");
const frozenJavaBaseline = join(
  projectRoot,
  "..",
  "OpenNARS-304-ts-evidence-archive",
  "g0-java-baseline-frozen-26772af-20260917.jsonl",
);

function run(script: string, args: string[]) {
  const nodeArgs = ["--import", "./scripts/register-ts-loader.mjs", script, ...args];
  return spawnSync(process.execPath, nodeArgs, {
    cwd: projectRoot,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
}

test("local parity runner rejects a missing selected Java artifact", () => {
  const result = run(localRunner, ["--java-jar", join(projectRoot, "missing-java-baseline.jar")]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /--java-jar path does not exist/);
});

test("NAL runner rejects a missing selected Java artifact", () => {
  const result = run(nalRunner, [
    "--engine", "java",
    "--limit", "1",
    "--cycles", "1",
    "--java-jar", join(projectRoot, "missing-java-baseline.jar"),
  ]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /--java-jar path does not exist/);
});

test("local parity rejects the historical 3.1.0 artifact", { skip: !existsSync(legacyJar) }, () => {
  const result = run(localRunner, [
    "--java-jar", legacyJar,
  ]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /legacy 3\.1\.0 artifact/);
});

test("local parity default and explicit selection identify the canonical Java artifact", {
  skip: process.env.OPENNARS_TEST_MODE === "ts-only"
    || !existsSync(canonicalJar) || !existsSync(canonicalClasses) || !existsSync(canonicalTestClasses),
}, () => {
  const result = run(localRunner, [
    "--java-jar", canonicalJar,
    "--java-classes", canonicalClasses,
    "--java-test-classes", canonicalTestClasses,
  ]);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const output = JSON.parse(result.stdout);
  assert.equal(output.javaArtifact.jar, canonicalJar);
  assert.match(output.javaArtifact.sha256, /^[0-9A-F]{64}$/);
});

test("NAL runner rejects the historical 3.1.0 artifact", { skip: !existsSync(legacyJar) }, () => {
  const result = run(nalRunner, [
    "--engine", "java",
    "--limit", "1",
    "--cycles", "1",
    "--java-jar", legacyJar,
  ]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /legacy 3\.1\.0 artifact/);
});

test("NAL runner can compare TS with the frozen Java baseline without starting Java", {
  skip: !existsSync(frozenJavaBaseline),
}, () => {
  const result = run(nalRunner, [
    "--engine", "ts",
    "--java-baseline", frozenJavaBaseline,
    "--file", join(projectRoot, "java-master", "src", "main", "resources", "nal", "single_step", "nal8.add.nal"),
    "--cycles", "1550",
    "--timeout-ms", "180000",
    "--process-limit-ms", "1800000",
    "--ts-mode", "cold",
    "--summary",
  ]);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const output = JSON.parse(result.stdout);
  assert.equal(output.java_artifact, null);
  assert.equal(output.files, 1);
  assert.equal(output.passed, 1);
  assert.equal(output.failed, 0);
  assert.match(output.java_baseline.sha256, /^[0-9A-F]{64}$/);
  assert.match(output.java_baseline.java_artifact_sha256, /^[0-9A-F]{64}$/);
});

test("NAL runner rejects a missing frozen Java baseline", () => {
  const result = run(nalRunner, [
    "--engine", "ts",
    "--java-baseline", join(projectRoot, "missing-java-functional-baseline.jsonl"),
  ]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /--java-baseline path does not exist/);
});
